#!/usr/bin/env python3
"""Home Cloud: file manager + admin for the Luckfox home server.

Every user gets a private folder under /mnt/storage/users/<name> with an
optional storage limit. The admin can see all folders and manage users.
Uses only the Python standard library.

  app.py          run the server
  app.py --init   create users.json (random admin password) if missing, then exit
"""
import hashlib, hmac, json, mimetypes, os, re, secrets, shutil, sys, threading, time
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, quote, unquote, urlparse

HS = os.environ.get("HS_DIR", "/opt/homeserver")
STORAGE = os.environ.get("HS_STORAGE", "/mnt/storage")
PORT = int(os.environ.get("HS_PORT", "8080"))
WEB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")

USERS_DIR = os.path.join(STORAGE, "users")
REMOVED_DIR = os.path.join(STORAGE, "removed-users")
DB = os.path.join(HS, "users.json")
PWFILE = os.path.join(HS, "ADMIN-PASSWORD.txt")
LOGFILE = os.path.join(HS, "app.log")

ADMIN = "admin"
NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{1,31}$")
PW_MIN, PW_MAX = 8, 128
GB = 1024 ** 3
PBKDF2_ITERS = int(os.environ.get("HS_PBKDF2_ITERS", "100000"))
SESSION_SECS = 7 * 24 * 3600
MAX_FAILS, FAIL_WINDOW = 5, 15 * 60
CHUNK = 1 << 20
DISK_RESERVE = 64 * 1024 * 1024  # never fill the card completely

STATIC = {"app.js": "text/javascript", "app.css": "text/css", "favicon.svg": "image/svg+xml"}
# types a browser could execute as a page; always downloaded, never shown inline
RISKY_EXT = {".html", ".htm", ".xhtml", ".svg", ".xml", ".js", ".mjs", ".shtml", ".xht"}

LOCK = threading.RLock()
SESSIONS = {}  # token -> {"user", "exp", "csrf"}
FAILS = {}  # ip -> [timestamps]
USAGE = {}  # owner -> bytes stored (computed lazily, then kept up to date)
RESERVED = {}  # owner -> bytes of uploads in progress

for ext, typ in ((".mkv", "video/x-matroska"), (".webm", "video/webm"), (".m4a", "audio/mp4"),
                 (".flac", "audio/flac"), (".heic", "image/heic"), (".webp", "image/webp"), (".md", "text/markdown")):
    mimetypes.add_type(typ, ext)


class ApiError(Exception):
    def __init__(self, code, msg):
        super().__init__(msg)
        self.code, self.msg = code, msg


def log(msg):
    try:
        if os.path.exists(LOGFILE) and os.path.getsize(LOGFILE) > 2 * 1024 * 1024:
            os.replace(LOGFILE, LOGFILE + ".1")
        with open(LOGFILE, "a") as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + msg + "\n")
    except OSError:
        pass


def human(n):
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if n < 1024 or unit == "TB":
            return ("%.0f %s" if unit == "B" else "%.1f %s") % (n, unit)
        n /= 1024.0


# ---------------------------------------------------------------- users

def load_db():
    with LOCK, open(DB) as f:
        return json.load(f)


def save_db(db):
    with LOCK:
        tmp = DB + ".tmp"
        with open(os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "w") as f:
            json.dump(db, f, indent=2)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, DB)


def hash_pw(pw, salt=None, iters=PBKDF2_ITERS):
    salt = salt or secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", pw.encode(), bytes.fromhex(salt), iters)
    return "pbkdf2_sha256$%d$%s$%s" % (iters, salt, dk.hex())


def check_pw(user, pw):
    h = (user or {}).get("hash") or hash_pw("x", "00" * 16)  # constant-ish time for unknown users
    _, iters, salt, _ = h.split("$")
    return bool(user) and hmac.compare_digest(hash_pw(pw, salt, int(iters)), h)


def valid_pw(pw):
    if not isinstance(pw, str) or not (PW_MIN <= len(pw) <= PW_MAX):
        raise ApiError(400, "Password must be %d-%d characters." % (PW_MIN, PW_MAX))
    return pw


def quota_bytes(owner):
    u = load_db()["users"].get(owner)
    q = float((u or {}).get("quota_gb") or 0)
    return int(q * GB) if q > 0 else None


def init_db():
    os.makedirs(USERS_DIR, exist_ok=True)
    if not os.path.exists(DB):
        pw = secrets.token_urlsafe(12)
        save_db({"users": {ADMIN: {"hash": hash_pw(pw), "quota_gb": 0}}})
        with open(os.open(PWFILE, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "w") as f:
            f.write("admin password: %s\nchange it after logging in\n" % pw)
    db = load_db()
    changed = False
    for u in db["users"].values():
        if "pw" in u:  # plain-text password from the Copyparty setup
            u["hash"] = hash_pw(u.pop("pw"))
            changed = True
    if changed:
        save_db(db)
    for name in db["users"]:
        os.makedirs(os.path.join(USERS_DIR, name), exist_ok=True)


def drop_sessions(user, keep=None):
    with LOCK:
        for tok in [t for t, s in SESSIONS.items() if s["user"] == user and t != keep]:
            del SESSIONS[tok]


# ---------------------------------------------------------------- paths & usage

def check_part(x):
    if not x or x in (".", "..") or x.startswith(".") or "\0" in x or "/" in x or "\\" in x \
            or len(x.encode()) > 255 or x != x.strip():
        raise ApiError(400, "Invalid name: %r" % x[:40])
    return x


def split_path(p):
    return [check_part(x) for x in (p or "").split("/") if x != ""]


def user_root(user):
    return USERS_DIR if user == ADMIN else os.path.join(USERS_DIR, user)


def resolve(user, parts):
    root = os.path.realpath(user_root(user))
    full = os.path.join(root, *parts)
    real = os.path.realpath(full)
    if real != root and not real.startswith(root + os.sep):
        raise ApiError(403, "Not allowed")
    return full


def owner_of(user, parts):
    if user != ADMIN:
        return user
    return parts[0] if parts else None


def dir_size(path):
    total = 0
    for root, dirs, files in os.walk(path):
        for fn in files:
            try:
                total += os.lstat(os.path.join(root, fn)).st_size
            except OSError:
                pass
    return total


def usage(owner):
    with LOCK:
        if owner not in USAGE:
            USAGE[owner] = dir_size(os.path.join(USERS_DIR, owner))
        return USAGE[owner]


def add_usage(owner, delta):
    with LOCK:
        USAGE[owner] = max(0, usage(owner) + delta)


def unique_path(folder, name):
    stem, ext = os.path.splitext(name)
    cand, n = name, 1
    while os.path.lexists(os.path.join(folder, cand)):
        cand = "%s (%d)%s" % (stem, n, ext)
        n += 1
    return os.path.join(folder, cand)


def entry(path, name):
    st = os.stat(path)
    d = os.path.isdir(path)
    return {"name": name, "dir": d, "size": 0 if d else st.st_size, "mtime": int(st.st_mtime)}


# ---------------------------------------------------------------- http

class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "HomeCloud"
    sys_version = ""
    timeout = 120

    def log_message(self, fmt, *args):
        pass

    # ---- helpers

    def client_ip(self):
        ip = self.client_address[0]
        fwd = self.headers.get("X-Forwarded-For")
        if fwd and ip.startswith("127."):  # tailscale funnel proxies from localhost
            ip = fwd.split(",")[0].strip()
        return ip

    def base_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")

    def send_bytes(self, code, data, ctype, extra=()):
        self.send_response(code)
        self.base_headers()
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        for k, v in extra:
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def send_json(self, obj, code=200, extra=()):
        self.send_bytes(code, json.dumps(obj).encode(), "application/json",
                        [("Cache-Control", "no-store")] + list(extra))

    def session(self):
        c = SimpleCookie(self.headers.get("Cookie", ""))
        tok = c["hc_sid"].value if "hc_sid" in c else ""
        with LOCK:
            s = SESSIONS.get(tok)
            if s and s["exp"] > time.time():
                return tok, s
            SESSIONS.pop(tok, None)
        return None, None

    def require(self, csrf=True, admin=False):
        tok, s = self.session()
        if not s:
            raise ApiError(401, "Please log in.")
        if csrf and not hmac.compare_digest(self.headers.get("X-CSRF", ""), s["csrf"]):
            raise ApiError(403, "Session check failed, reload the page.")
        if s["user"] not in load_db()["users"]:
            raise ApiError(401, "Please log in.")
        if admin and s["user"] != ADMIN:
            raise ApiError(403, "Admins only.")
        return tok, s

    def body_json(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n > 1024 * 1024:
            raise ApiError(413, "Request too large")
        try:
            return json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            raise ApiError(400, "Bad request")

    def me(self, s):
        user = s["user"]
        quota = quota_bytes(user) if user != ADMIN else None
        return {"user": user, "admin": user == ADMIN, "csrf": s["csrf"],
                "used": usage(user), "quota": quota}

    # ---- dispatch

    def do_GET(self):
        self.route("GET")

    def do_HEAD(self):
        self.route("HEAD")

    def do_POST(self):
        self.route("POST")

    def do_PUT(self):
        self.route("PUT")

    def route(self, method):
        u = urlparse(self.path)
        path, q = u.path, {k: v[0] for k, v in parse_qs(u.query).items()}
        try:
            if method in ("GET", "HEAD"):
                if path == "/":
                    return self.static("index.html", "text/html; charset=utf-8")
                if path.startswith("/static/") and path[8:] in STATIC:
                    return self.static(path[8:], STATIC[path[8:]])
                if path.startswith("/d/"):
                    return self.download(path[3:], q)
                if path == "/api/me":
                    return self.send_json(self.me(self.require(csrf=False)[1]))
                if path == "/api/list":
                    return self.api_list(q)
                if path == "/api/admin/overview":
                    return self.admin_overview()
            elif method == "POST":
                routes = {"/api/login": self.api_login, "/api/logout": self.api_logout,
                          "/api/mkdir": self.api_mkdir, "/api/rename": self.api_rename,
                          "/api/delete": self.api_delete, "/api/upload-check": self.api_upload_check,
                          "/api/password": self.api_password, "/api/admin/users": self.admin_users}
                if path in routes:
                    return routes[path]()
            elif method == "PUT" and path == "/api/upload":
                return self.api_upload(q)
            raise ApiError(404, "Not found")
        except ApiError as e:
            if e.code >= 400 and self.command in ("PUT", "POST") and int(self.headers.get("Content-Length") or 0) > 1024 * 1024:
                self.close_connection = True  # unread upload body
            self.send_json({"error": e.msg}, e.code)
        except (BrokenPipeError, ConnectionResetError):
            self.close_connection = True
        except Exception as e:
            log("error %s %s: %r" % (method, path, e))
            self.close_connection = True
            try:
                self.send_json({"error": "Server error"}, 500)
            except OSError:
                pass

    # ---- static

    def static(self, name, ctype):
        with open(os.path.join(WEB, name), "rb") as f:
            data = f.read()
        csp = ("default-src 'self'; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; "
               "script-src 'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'none'; "
               "base-uri 'none'; form-action 'self'")
        self.send_bytes(200, data, ctype, [("Cache-Control", "no-cache"), ("Content-Security-Policy", csp),
                                           ("X-Frame-Options", "DENY")])

    # ---- auth

    def api_login(self):
        ip, now = self.client_ip(), time.time()
        with LOCK:
            recent = [t for t in FAILS.get(ip, []) if now - t < FAIL_WINDOW]
            FAILS[ip] = recent
            if len(recent) >= MAX_FAILS:
                raise ApiError(429, "Too many wrong passwords. Try again in 15 minutes.")
        b = self.body_json()
        name = str(b.get("user", "")).strip().lower()
        user = load_db()["users"].get(name)
        if not check_pw(user, str(b.get("pw", ""))):
            with LOCK:
                FAILS.setdefault(ip, []).append(now)
            log("login failed for %r from %s" % (name[:32], ip))
            raise ApiError(403, "Wrong username or password.")
        with LOCK:
            FAILS.pop(ip, None)
            tok = secrets.token_urlsafe(32)
            s = SESSIONS[tok] = {"user": name, "exp": now + SESSION_SECS, "csrf": secrets.token_urlsafe(24)}
        secure = "; Secure" if self.headers.get("X-Forwarded-Proto") == "https" else ""
        cookie = "hc_sid=%s; Path=/; HttpOnly; SameSite=Strict; Max-Age=%d%s" % (tok, SESSION_SECS, secure)
        log("login %s from %s" % (name, ip))
        self.send_json(self.me(s), extra=[("Set-Cookie", cookie)])

    def api_logout(self):
        tok, _ = self.require()
        with LOCK:
            SESSIONS.pop(tok, None)
        self.send_json({"ok": True}, extra=[("Set-Cookie", "hc_sid=; Path=/; Max-Age=0")])

    def api_password(self):
        tok, s = self.require()
        b = self.body_json()
        db = load_db()
        u = db["users"][s["user"]]
        if not check_pw(u, str(b.get("old", ""))):
            raise ApiError(403, "Current password is wrong.")
        u["hash"] = hash_pw(valid_pw(b.get("new")))
        save_db(db)
        drop_sessions(s["user"], keep=tok)
        if s["user"] == ADMIN and os.path.exists(PWFILE):
            os.remove(PWFILE)
        log("password changed by %s" % s["user"])
        self.send_json({"ok": True})

    # ---- files

    def api_list(self, q):
        _, s = self.require(csrf=False)
        user = s["user"]
        parts = split_path(q.get("path"))
        full = resolve(user, parts)
        if not os.path.isdir(full):
            raise ApiError(404, "Folder not found")
        out = []
        with os.scandir(full) as it:
            for de in it:
                if de.name.startswith("."):
                    continue
                try:
                    e = entry(de.path, de.name)
                except OSError:
                    continue
                if user == ADMIN and not parts:
                    e["size"] = usage(de.name)  # user folders: show how much each holds
                out.append(e)
        out.sort(key=lambda e: (not e["dir"], e["name"].casefold()))
        self.send_json({"path": "/".join(parts), "entries": out,
                        "root_is_users": user == ADMIN and not parts})

    def writable(self, user, parts):
        owner = owner_of(user, parts)
        if owner is None:
            raise ApiError(400, "Open a user's folder first.")
        return owner

    def api_mkdir(self):
        _, s = self.require()
        b = self.body_json()
        parts = split_path(b.get("path")) + [check_part(str(b.get("name", "")).strip())]
        self.writable(s["user"], parts[:-1])
        full = resolve(s["user"], parts)
        if os.path.lexists(full):
            raise ApiError(409, "Something with that name already exists.")
        os.mkdir(full)
        self.send_json({"ok": True})

    def api_rename(self):
        _, s = self.require()
        b = self.body_json()
        parts = split_path(b.get("path"))
        if not parts or (s["user"] == ADMIN and len(parts) == 1):
            raise ApiError(400, "That folder can't be renamed.")
        new = check_part(str(b.get("name", "")).strip())
        src = resolve(s["user"], parts)
        dst = resolve(s["user"], parts[:-1] + [new])
        if not os.path.lexists(src):
            raise ApiError(404, "Not found")
        if os.path.lexists(dst):
            raise ApiError(409, "Something with that name already exists.")
        os.rename(src, dst)
        self.send_json({"ok": True})

    def api_delete(self):
        _, s = self.require()
        user = s["user"]
        paths = self.body_json().get("paths") or []
        if not isinstance(paths, list) or len(paths) > 1000:
            raise ApiError(400, "Bad request")
        for p in paths:
            parts = split_path(p)
            if not parts or (user == ADMIN and len(parts) == 1):
                raise ApiError(400, "User folders can only be removed from the Admin page.")
            full = resolve(user, parts)
            if not os.path.lexists(full):
                continue
            owner = owner_of(user, parts)
            if os.path.isdir(full) and not os.path.islink(full):
                size = dir_size(full)
                shutil.rmtree(full)
            else:
                size = os.lstat(full).st_size
                os.remove(full)
            add_usage(owner, -size)
            log("%s deleted %s (%s)" % (user, "/".join(parts), human(size)))
        self.send_json({"ok": True, "used": usage(user)})

    def check_space(self, owner, size, reserve=False):
        """Raise if `size` more bytes don't fit; with reserve=True also claim them (atomically)."""
        limit = quota_bytes(owner)
        with LOCK:
            used = usage(owner) + RESERVED.get(owner, 0)
            if limit is not None and used + size > limit:
                left = max(0, limit - used)
                raise ApiError(413, "Not enough space: this file is %s but only %s of %s is left."
                               % (human(size), human(left), human(limit)))
            if shutil.disk_usage(STORAGE).free < size + sum(RESERVED.values()) + DISK_RESERVE:
                raise ApiError(507, "The storage card is full.")
            if reserve:
                RESERVED[owner] = RESERVED.get(owner, 0) + size

    def upload_target(self, user, q):
        parts = split_path(q.get("path")) + split_path(q.get("rel"))
        owner = self.writable(user, parts)
        name = check_part(str(q.get("name", "")).strip())
        return parts, owner, name

    def api_upload_check(self):
        _, s = self.require()
        b = self.body_json()
        _, owner, _ = self.upload_target(s["user"], {k: str(b.get(k, "")) for k in ("path", "rel", "name")})
        self.check_space(owner, int(b.get("size") or 0))
        self.send_json({"ok": True})

    def api_upload(self, q):
        _, s = self.require()
        user = s["user"]
        parts, owner, name = self.upload_target(user, q)
        if "Content-Length" not in self.headers:
            raise ApiError(411, "Missing length")
        length = int(self.headers["Content-Length"])
        folder = resolve(user, parts)
        self.check_space(owner, length, reserve=True)
        tmp = os.path.join(folder, ".upload-" + secrets.token_hex(8))
        done = False
        try:
            os.makedirs(folder, exist_ok=True)
            with open(tmp, "wb") as f:
                left = length
                while left > 0:
                    chunk = self.rfile.read(min(CHUNK, left))
                    if not chunk:
                        raise ApiError(400, "Upload interrupted")
                    f.write(chunk)
                    left -= len(chunk)
            with LOCK:
                final = unique_path(folder, name)
                os.rename(tmp, final)
            done = True
        finally:
            with LOCK:
                RESERVED[owner] -= length
                if done:
                    USAGE[owner] = usage(owner) + length
            if not done:
                self.close_connection = True
                try:
                    os.remove(tmp)
                except OSError:
                    pass
        log("%s uploaded %s (%s)" % (user, "/".join(parts + [os.path.basename(final)]), human(length)))
        self.send_json({"ok": True, "name": os.path.basename(final), "used": usage(user)})

    def download(self, rawpath, q):
        _, s = self.require(csrf=False)
        parts = split_path(unquote(rawpath))
        full = resolve(s["user"], parts)
        if not parts or not os.path.isfile(full):
            raise ApiError(404, "File not found")
        size = os.path.getsize(full)
        start, end, code = 0, size - 1, 200
        rng = self.headers.get("Range", "")
        if rng.startswith("bytes=") and size:
            a, _, b = rng[6:].split(",")[0].strip().partition("-")
            try:
                if a == "":
                    start = max(0, size - int(b))
                else:
                    start = int(a)
                    end = min(int(b), size - 1) if b else size - 1
                code = 206
            except ValueError:
                start, end, code = 0, size - 1, 200
            if code == 206 and start > end:
                return self.send_bytes(416, b"", "text/plain", [("Content-Range", "bytes */%d" % size)])
        name = parts[-1]
        ext = os.path.splitext(name)[1].lower()
        ctype = mimetypes.guess_type(name)[0] or "application/octet-stream"
        attach = q.get("dl") == "1" or ext in RISKY_EXT
        if ext in RISKY_EXT:
            ctype = "application/octet-stream"
        count = end - start + 1 if size else 0
        self.send_response(code)
        self.base_headers()
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(count))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "private, max-age=300")
        self.send_header("Content-Disposition", "%s; filename*=UTF-8''%s" % ("attachment" if attach else "inline", quote(name)))
        if ctype != "application/pdf":
            self.send_header("Content-Security-Policy", "sandbox; default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'")
        if code == 206:
            self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.end_headers()
        if self.command == "HEAD" or not count:
            return
        with open(full, "rb") as f:
            self.connection.sendfile(f, start, count)

    # ---- admin

    def admin_overview(self):
        self.require(csrf=False, admin=True)
        db = load_db()
        du = shutil.disk_usage(STORAGE)
        users = [{"name": n, "used": usage(n), "quota_gb": float(u.get("quota_gb") or 0)}
                 for n, u in sorted(db["users"].items(), key=lambda kv: (kv[0] != ADMIN, kv[0]))]
        self.send_json({"disk": {"total": du.total, "used": du.used, "free": du.free}, "users": users,
                        "admin_pw_file": os.path.exists(PWFILE)})

    def admin_users(self):
        tok, s = self.require(admin=True)
        b = self.body_json()
        action = b.get("action")
        name = str(b.get("name", "")).strip().lower()
        db = load_db()

        def quota():
            try:
                v = float(b.get("quota") or 0)
            except (TypeError, ValueError):
                raise ApiError(400, "Limit must be a number of GB.")
            if not 0 <= v <= 100000:
                raise ApiError(400, "Limit must be between 0 and 100000 GB.")
            return v

        if action == "add":
            if not NAME_RE.match(name):
                raise ApiError(400, "Username: 2-32 characters, lowercase letters, digits, - or _.")
            if name in db["users"]:
                raise ApiError(409, "User '%s' already exists." % name)
            db["users"][name] = {"hash": hash_pw(valid_pw(b.get("pw"))), "quota_gb": quota()}
            os.makedirs(os.path.join(USERS_DIR, name), exist_ok=True)
            save_db(db)
            msg = "Added %s." % name
        elif name not in db["users"]:
            raise ApiError(404, "No such user.")
        elif action == "quota":
            db["users"][name]["quota_gb"] = quota()
            save_db(db)
            q = db["users"][name]["quota_gb"]
            msg = "%s: limit set to %s." % (name, ("%g GB" % q) if q else "no limit")
        elif action == "password":
            db["users"][name]["hash"] = hash_pw(valid_pw(b.get("pw")))
            save_db(db)
            drop_sessions(name, keep=tok)
            if name == ADMIN and os.path.exists(PWFILE):
                os.remove(PWFILE)
            msg = "Password changed for %s." % name
        elif action == "remove":
            if name == ADMIN:
                raise ApiError(400, "The admin account can't be removed.")
            del db["users"][name]
            save_db(db)
            drop_sessions(name)
            src = os.path.join(USERS_DIR, name)
            if os.path.isdir(src):
                os.makedirs(REMOVED_DIR, exist_ok=True)
                shutil.move(src, os.path.join(REMOVED_DIR, "%s-%s" % (name, time.strftime("%Y%m%d-%H%M%S"))))
            with LOCK:
                USAGE.pop(name, None)
            msg = "Removed %s. Their files were kept in removed-users on the card." % name
        else:
            raise ApiError(400, "Unknown action")
        log("admin: " + msg)
        self.send_json({"ok": True, "message": msg})


def main():
    init_db()
    if "--init" in sys.argv:
        return
    srv = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    srv.daemon_threads = True
    log("Home Cloud started on :%d" % PORT)
    print("Home Cloud on :%d" % PORT, flush=True)
    srv.serve_forever()


if __name__ == "__main__":
    main()
