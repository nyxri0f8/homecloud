"use strict";
(() => {
  // ------------------------------------------------------------ icons
  const P = {
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6l2 2h7.4A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    sheet: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M8.5 12h7v6h-7zM12 12v6M8.5 15h7"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    video: '<rect x="2.5" y="5.5" width="13.5" height="13" rx="2.5"/><path d="m21.5 8-5.5 4 5.5 4z"/>',
    audio: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V9M10 13h4"/>',
    code: '<path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4"/>',
    upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5"/><path d="M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"/>',
    folderPlus: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6l2 2h7.4A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><path d="M12 10.5v6M9 13.5h6"/>',
    folderUp: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6l2 2h7.4A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><path d="M12 16.5v-6M9.5 13 12 10.5l2.5 2.5"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5L18 7M10 11v6M14 11v6"/>',
    edit: '<path d="M4 20h4.5L19.5 9a2.1 2.1 0 0 0-3-3L5.5 17z"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>',
    chevD: '<path d="m6 9 6 6 6-6"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16.5 14.5 12 10 7.5M14.5 12H4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8.5-8.5M16.5 6.5l3 3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20.5a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20.5a6 6 0 0 0-3.5-5.4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    open: '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    home: '<path d="M3.5 10.5 12 4l8.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-4v-6h-6v6H5A1.5 1.5 0 0 1 3.5 19z"/>',
  };
  const FILLED = new Set(["more"]);
  const LOGO = '<svg class="logo" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#3b6ef5"/><path d="M10 21.5h12.5a4.5 4.5 0 0 0 .6-8.96A6.5 6.5 0 0 0 10.6 13 4.3 4.3 0 0 0 10 21.5Z" fill="#fff"/></svg>';
  const FOLDER_BIG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6l2 2h7.4A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/></svg>';

  function icon(name) {
    const s = document.createElement("span");
    s.className = "ic";
    const f = FILLED.has(name);
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="' + (f ? "currentColor" : "none") + '" stroke="' + (f ? "none" : "currentColor") +
      '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + P[name] + "</svg>";
    return s;
  }
  function raw(html, cls) { const s = document.createElement("span"); if (cls) s.className = cls; s.innerHTML = html; return s; }

  // ------------------------------------------------------------ dom helper
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k in el && typeof v !== "string") el[k] = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids.flat(9)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  // replaceChildren() would render null as the text "null"
  const fill = (el, ...kids) => el.replaceChildren(...kids.flat(9).filter((k) => k != null && k !== false));

  // ------------------------------------------------------------ formatting & types
  function fmtSize(n) {
    if (n == null) return "";
    const u = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (n >= 1024 && i < 4) { n /= 1024; i++; }
    return (i ? n.toFixed(n < 10 ? 1 : 0) : n) + " " + u[i];
  }
  function fmtDate(t) {
    const d = new Date(t * 1000), now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const o = { day: "numeric", month: "short" };
    if (d.getFullYear() !== now.getFullYear()) o.year = "numeric";
    return d.toLocaleDateString([], o);
  }
  const KINDS = {
    image: "jpg jpeg png gif webp bmp heic heif avif svg ico tif tiff",
    video: "mp4 mkv webm mov avi m4v 3gp wmv",
    audio: "mp3 wav flac m4a aac ogg opus wma",
    pdf: "pdf",
    doc: "doc docx odt rtf txt md pages ppt pptx odp key",
    sheet: "xls xlsx csv ods numbers",
    archive: "zip rar 7z tar gz tgz bz2 xz iso apk",
    code: "js ts py java c cpp h cs html htm css json xml sh bat ps1 yml yaml go rs php rb sql ini conf log",
  };
  const EXT_KIND = {};
  for (const [k, v] of Object.entries(KINDS)) for (const e of v.split(" ")) EXT_KIND[e] = k;
  const ext = (n) => (n.includes(".") ? n.split(".").pop().toLowerCase() : "");
  const kindOf = (e) => (e.dir ? "folder" : EXT_KIND[ext(e.name)] || "file");
  const ICON_OF = { folder: "folder", image: "image", video: "video", audio: "audio", pdf: "doc", doc: "doc", sheet: "sheet", archive: "archive", code: "code", file: "file" };
  const SHOW_IMG = new Set("jpg jpeg png gif webp bmp avif ico".split(" "));
  const SHOW_VID = new Set("mp4 webm mov m4v mkv".split(" "));
  const SHOW_AUD = new Set("mp3 wav flac m4a aac ogg opus".split(" "));
  const SHOW_TXT = new Set("txt md csv json log xml yml yaml ini conf py js ts css html htm sh bat ps1 c cpp h java go rs php rb sql".split(" "));
  function viewKind(e) {
    const x = ext(e.name);
    if (SHOW_IMG.has(x)) return "image";
    if (SHOW_VID.has(x)) return "video";
    if (SHOW_AUD.has(x)) return "audio";
    if (x === "pdf") return "pdf";
    if (SHOW_TXT.has(x) && e.size < 5 * 1024 * 1024) return "text";
    return null;
  }
  function fileIcon(e, big) {
    const k = kindOf(e);
    if (k === "folder" && big) { const s = raw(FOLDER_BIG, "ic"); s.style.color = "var(--c-folder)"; return s; }
    const w = h("span", { class: "ficon" }, icon(ICON_OF[k]));
    w.style.color = "var(--c-" + k + ")";
    w.style.background = "color-mix(in srgb, var(--c-" + k + ") 14%, transparent)";
    if (big) { w.style.background = "none"; return w.firstChild; }
    return w;
  }

  // ------------------------------------------------------------ state & api
  const S = {
    me: null, path: "", entries: [], rootUsers: false, sel: new Set(), filter: "",
    view: store("view") || "list", sort: { key: "name", dir: 1 }, page: "files",
  };
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem("hc_" + k); localStorage.setItem("hc_" + k, v); } catch (e) { /* storage unavailable */ }
    return null;
  }

  async function api(method, url, body) {
    const opt = { method, headers: {}, credentials: "same-origin" };
    if (S.me) opt.headers["X-CSRF"] = S.me.csrf;
    if (body !== undefined) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
    let r;
    try { r = await fetch(url, opt); } catch (e) { throw new Error("Can't reach the server. Check your connection."); }
    let data = {};
    try { data = await r.json(); } catch (e) { /* not json */ }
    if (r.status === 401 && S.me) { S.me = null; renderLogin("Your session ended, please log in again."); }
    if (!r.ok) throw new Error(data.error || "Something went wrong (" + r.status + ")");
    return data;
  }

  const joinPath = (...xs) => xs.filter(Boolean).join("/");
  const enc = (p) => p.split("/").map(encodeURIComponent).join("/");
  const fileUrl = (p, dl) => "/d/" + enc(p) + (dl ? "?dl=1" : "");
  const filesHash = (p) => "#/files" + (p ? "/" + enc(p) : "");

  function download(p) {
    const a = h("a", { href: fileUrl(p, true), download: "" });
    document.body.append(a);
    a.click();
    a.remove();
  }

  // ------------------------------------------------------------ toasts, menus, modals
  let toastBox;
  function toast(msg, err) {
    const t = h("div", { class: "toast" + (err ? " err" : "") }, icon(err ? "info" : "info"), h("span", { text: msg }));
    toastBox.append(t);
    setTimeout(() => t.remove(), err ? 6000 : 3200);
  }

  let menuEl = null;
  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }
  function openMenu(anchor, items, header) {
    closeMenu();
    const m = h("div", { class: "menu", role: "menu" }, header || null);
    for (const it of items) {
      if (it === "-") { m.append(h("hr")); continue; }
      m.append(h("button", { class: it.danger ? "danger" : "", role: "menuitem", onclick: (ev) => { ev.stopPropagation(); closeMenu(); it.run(); } },
        icon(it.icon), h("span", { text: it.label })));
    }
    document.body.append(m);
    menuEl = m;
    const r = anchor.getBoundingClientRect();
    const left = Math.max(8, Math.min(r.right - m.offsetWidth, innerWidth - m.offsetWidth - 8));
    let top = r.bottom + 6;
    if (top + m.offsetHeight > innerHeight - 8) top = Math.max(8, r.top - m.offsetHeight - 6);
    m.style.left = left + "px";
    m.style.top = top + "px";
  }
  document.addEventListener("click", (e) => { if (menuEl && !menuEl.contains(e.target)) closeMenu(); });
  window.addEventListener("scroll", closeMenu, true);
  window.addEventListener("resize", closeMenu);

  function modal({ title, text, fields = [], ok = "Save", danger = false, onSubmit }) {
    const err = h("div", { class: "form-err" });
    const inputs = fields.map((f) => h("input", {
      class: "input", name: f.name, type: f.type || "text", value: f.value || "", placeholder: f.placeholder || "",
      autocomplete: f.autocomplete || "off", required: f.required !== false, minlength: f.minlength, min: f.min, step: f.step,
    }));
    const btn = h("button", { class: "btn " + (danger ? "danger" : "primary"), type: "submit", text: ok });
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const form = h("form", {
      onsubmit: async (e) => {
        e.preventDefault();
        err.textContent = "";
        btn.disabled = true;
        const vals = {};
        inputs.forEach((i) => (vals[i.name] = i.value));
        try { await onSubmit(vals); close(); } catch (x) { err.textContent = x.message; btn.disabled = false; }
      },
    },
    fields.map((f, i) => h("label", { class: "field" }, h("span", { text: f.label }), inputs[i])),
    err,
    h("div", { class: "actions" }, h("button", { class: "btn", type: "button", text: "Cancel", onclick: close }), btn));
    const ov = h("div", { class: "overlay", onmousedown: (e) => { if (e.target === ov) close(); } },
      h("div", { class: "modal", role: "dialog", "aria-modal": "true" }, h("h3", { text: title }), text ? h("p", { text }) : null, form));
    document.body.append(ov);
    document.addEventListener("keydown", onKey);
    (inputs[0] || btn).focus();
    if (inputs[0] && inputs[0].value) {
      const dot = inputs[0].value.lastIndexOf(".");
      inputs[0].setSelectionRange(0, dot > 0 ? dot : inputs[0].value.length);
    }
  }

  // ------------------------------------------------------------ login
  const app = document.getElementById("app");
  function renderLogin(msg) {
    const err = h("div", { class: "form-err", text: msg || "" });
    const user = h("input", { class: "input", name: "user", autocomplete: "username", autocapitalize: "none", spellcheck: "false", required: true });
    const pw = h("input", { class: "input", name: "pw", type: "password", autocomplete: "current-password", required: true });
    const btn = h("button", { class: "btn primary", type: "submit", text: "Log in" });
    fill(app, h("div", { class: "login-wrap" }, h("div", { class: "login" },
      raw(LOGO), h("h1", { text: "Home Cloud" }), h("p", { text: "Log in to your files" }),
      h("form", {
        onsubmit: async (e) => {
          e.preventDefault();
          btn.disabled = true;
          err.textContent = "";
          try {
            S.me = await api("POST", "/api/login", { user: user.value, pw: pw.value });
            renderShell();
            route();
          } catch (x) { err.textContent = x.message; btn.disabled = false; pw.select(); }
        },
      },
      h("label", { class: "field" }, h("span", { text: "Username" }), user),
      h("label", { class: "field" }, h("span", { text: "Password" }), pw),
      err, btn))));
    user.focus();
  }

  // ------------------------------------------------------------ shell
  let main, topbar, quotaEl, navEl, uploadsEl, dropzone, fileInput, dirInput;
  function renderShell() {
    quotaEl = h("div", { class: "quota-pill" });
    navEl = h("nav", { class: "nav" });
    const av = h("button", { class: "avatar", title: S.me.user, text: S.me.user[0], onclick: (e) => { e.stopPropagation(); userMenu(av); } });
    topbar = h("header", { class: "topbar" },
      h("a", { class: "brand", href: "#/files" }, raw(LOGO), h("span", { text: "Home Cloud" })),
      navEl, h("div", { class: "spacer" }), quotaEl, av);
    main = h("main");
    uploadsEl = h("div", { class: "uploads hidden" });
    toastBox = h("div", { class: "toasts" });
    dropzone = h("div", { class: "dropzone hidden" }, h("div", {}, icon("upload"), h("span", { text: "Drop to upload here" })));
    fileInput = h("input", { type: "file", multiple: true, class: "hidden", onchange: () => { pickFiles(fileInput); } });
    dirInput = h("input", { type: "file", multiple: true, class: "hidden", onchange: () => { pickFiles(dirInput); } });
    dirInput.setAttribute("webkitdirectory", "");
    fill(app, topbar, main, uploadsEl, dropzone, toastBox, fileInput, dirInput);
    renderTop();
  }
  function renderTop() {
    fill(navEl, 
      h("a", { href: "#/files", class: S.page === "files" ? "on" : "", text: "Files" }),
      S.me.admin ? h("a", { href: "#/admin", class: S.page === "admin" ? "on" : "", text: "Admin" }) : null);
    renderQuota();
  }
  function renderQuota() {
    if (!quotaEl || !S.me) return;
    const { used, quota } = S.me;
    if (quota) {
      const pct = Math.min(100, (used * 100) / quota);
      const bar = h("i", { class: pct >= 100 ? "full" : pct >= 85 ? "warn" : "" });
      bar.style.width = pct + "%";
      fill(quotaEl, h("span", { text: fmtSize(used) + " of " + fmtSize(quota) + " used" }), h("div", { class: "bar" }, bar));
    } else {
      fill(quotaEl, h("span", { text: fmtSize(used) + " used" }));
    }
  }
  function userMenu(anchor) {
    openMenu(anchor, [
      { icon: "key", label: "Change password", run: changePassword },
      "-",
      { icon: "logout", label: "Log out", run: logout },
    ], h("div", { class: "who" }, h("b", { text: S.me.user }), S.me.admin ? "Administrator" : "Member"));
  }
  async function logout() {
    try { await api("POST", "/api/logout"); } catch (e) { /* ignore */ }
    S.me = null;
    location.hash = "";
    renderLogin();
  }
  function changePassword() {
    modal({
      title: "Change password",
      fields: [
        { name: "old", label: "Current password", type: "password", autocomplete: "current-password" },
        { name: "new", label: "New password (8+ characters)", type: "password", autocomplete: "new-password", minlength: 8 },
        { name: "again", label: "New password again", type: "password", autocomplete: "new-password", minlength: 8 },
      ],
      onSubmit: async (v) => {
        if (v.new !== v.again) throw new Error("The new passwords don't match.");
        await api("POST", "/api/password", { old: v.old, new: v.new });
        toast("Password changed");
      },
    });
  }

  // ------------------------------------------------------------ routing
  function route() {
    if (!S.me) return;
    closeMenu();
    const hash = location.hash.slice(1);
    if (hash === "/admin" && S.me.admin) {
      S.page = "admin";
      renderTop();
      return renderAdmin();
    }
    S.page = "files";
    renderTop();
    let path = "";
    if (hash.startsWith("/files/")) path = hash.slice(7).split("/").filter(Boolean).map(decodeURIComponent).join("/");
    openFolder(path);
  }
  window.addEventListener("hashchange", route);

  // ------------------------------------------------------------ files page
  async function openFolder(path, keepScroll) {
    const sameFolder = path === S.path;
    S.path = path;
    if (!sameFolder) { S.sel.clear(); S.filter = ""; }
    const y = window.scrollY;
    if (!keepScroll) fill(main, h("div", { class: "empty" }, h("p", { text: "Loading…" })));
    try {
      const r = await api("GET", "/api/list?path=" + encodeURIComponent(path));
      if (S.path !== path || S.page !== "files") return;
      S.entries = r.entries;
      S.rootUsers = r.root_is_users;
      for (const n of [...S.sel]) if (!S.entries.some((e) => e.name === n)) S.sel.delete(n);
      renderFiles();
      if (keepScroll) window.scrollTo(0, y);
    } catch (e) {
      if (!S.me) return;
      fill(main, h("div", { class: "empty" }, h("h3", { text: "Couldn't open this folder" }), h("p", { text: e.message }),
        h("a", { class: "btn", href: "#/files", text: "Go to my files" })));
    }
  }
  let refreshTimer = null;
  function refreshSoon() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => { if (S.page === "files") openFolder(S.path, true); }, 500);
  }
  async function refreshMe() {
    try { const m = await api("GET", "/api/me"); S.me.used = m.used; S.me.quota = m.quota; renderQuota(); } catch (e) { /* ignore */ }
  }

  function visibleEntries() {
    const f = S.filter.trim().toLowerCase();
    const list = S.entries.filter((e) => !f || e.name.toLowerCase().includes(f));
    const { key, dir } = S.sort;
    list.sort((a, b) => {
      if (a.dir !== b.dir) return a.dir ? -1 : 1;
      let c = 0;
      if (key === "size") c = a.size - b.size;
      else if (key === "mtime") c = a.mtime - b.mtime;
      if (!c) c = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
      return c * dir;
    });
    return list;
  }

  function crumbs() {
    const parts = S.path ? S.path.split("/") : [];
    const rootLabel = S.me.admin ? "All users" : "My files";
    const out = [h("a", { href: "#/files", text: rootLabel })];
    parts.forEach((p, i) => {
      out.push(h("span", { class: "sep" }, icon("chevR")));
      out.push(h("a", { href: filesHash(parts.slice(0, i + 1).join("/")), text: p }));
    });
    return h("div", { class: "crumbs" }, out);
  }

  function renderFiles() {
    const canWrite = !S.rootUsers;
    const search = h("input", {
      class: "input", type: "search", placeholder: "Search this folder", value: S.filter,
      oninput: () => { S.filter = search.value; renderList(); },
    });
    const viewBtn = (v, ic, label) => h("button", {
      class: S.view === v ? "on" : "", title: label, "aria-label": label,
      onclick: () => { S.view = v; store("view", v); renderFiles(); },
    }, icon(ic));
    const toolbar = h("div", { class: "toolbar" },
      canWrite ? [
        h("button", { class: "btn primary", onclick: () => fileInput.click() }, icon("upload"), h("span", { class: "lbl", text: "Upload" })),
        h("button", { class: "btn", title: "Upload a whole folder", onclick: () => dirInput.click() }, icon("folderUp"), h("span", { class: "lbl", text: "Upload folder" })),
        h("button", { class: "btn", onclick: newFolder }, icon("folderPlus"), h("span", { class: "lbl", text: "New folder" })),
      ] : null,
      h("div", { class: "spacer" }),
      h("div", { class: "search" }, icon("search"), search),
      h("div", { class: "seg" }, viewBtn("list", "list", "List view"), viewBtn("grid", "grid", "Grid view")));

    const listBox = h("div");
    function renderList() {
      const items = visibleEntries();
      fill(listBox, items.length ? (S.view === "grid" ? gridView(items) : listView(items)) : emptyView(canWrite));
      listBox.classList.toggle("selecting", S.sel.size > 0);
      fill(selBox, selBar());
    }
    const selBox = h("div");
    fill(main, crumbs(),
      S.rootUsers ? h("p", { class: "hint", text: "Each folder belongs to one user. Open a folder to see or add their files." }) : null,
      toolbar, selBox, listBox);
    renderList();
    S.rerenderList = renderList;
  }

  function emptyView(canWrite) {
    if (S.filter) return h("div", { class: "empty" }, h("h3", { text: "No matches" }), h("p", { text: "Nothing here matches “" + S.filter + "”." }));
    return h("div", { class: "empty" }, raw(FOLDER_BIG, "big"),
      h("h3", { text: S.rootUsers ? "No users yet" : "This folder is empty" }),
      h("p", { text: canWrite ? "Drag files here, or use the Upload button." : "Add users on the Admin page." }),
      canWrite ? h("button", { class: "btn primary", onclick: () => fileInput.click() }, icon("upload"), "Upload files") : null);
  }

  function toggleSel(name, on) {
    if (on) S.sel.add(name); else S.sel.delete(name);
    S.rerenderList();
  }

  function selBar() {
    if (!S.sel.size) return null;
    const names = [...S.sel];
    return h("div", { class: "selbar" },
      h("span", { text: names.length + " selected" }), h("div", { class: "spacer" }),
      h("button", { class: "btn sm", onclick: () => downloadMany(names) }, icon("download"), h("span", { class: "lbl", text: "Download" })),
      S.rootUsers ? null : h("button", { class: "btn sm danger", onclick: () => deleteItems(names) }, icon("trash"), h("span", { class: "lbl", text: "Delete" })),
      h("button", { class: "btn sm ghost icon", title: "Clear selection", onclick: () => { S.sel.clear(); S.rerenderList(); } }, icon("x")));
  }

  function sortHead(key, label, cls) {
    const on = S.sort.key === key;
    return h("div", {
      class: cls, text: label + (on ? (S.sort.dir > 0 ? " ↑" : " ↓") : ""),
      onclick: () => { S.sort = { key, dir: on ? -S.sort.dir : 1 }; S.rerenderList(); },
    });
  }

  function listView(items) {
    const allSel = items.length && items.every((e) => S.sel.has(e.name));
    const head = h("div", { class: "row head" },
      S.rootUsers ? h("div") : h("input", { type: "checkbox", class: "chk", checked: !!allSel, "aria-label": "Select all",
        onchange: (e) => { items.forEach((x) => (e.target.checked ? S.sel.add(x.name) : S.sel.delete(x.name))); S.rerenderList(); } }),
      sortHead("name", "Name", ""), sortHead("size", "Size", "col-size"), sortHead("mtime", "Modified", "col-date"), h("div"));
    head.style.cursor = "pointer";
    return h("div", { class: "files" }, head, items.map(rowEl));
  }

  function rowEl(e) {
    const sub = (e.dir ? (S.rootUsers ? fmtSize(e.size) : "Folder") : fmtSize(e.size)) + " · " + fmtDate(e.mtime);
    const more = h("button", { class: "btn ghost icon more", title: "More", "aria-label": "More actions for " + e.name,
      onclick: (ev) => { ev.stopPropagation(); itemMenu(more, e); } }, icon("more"));
    return h("div", { class: "row" + (S.sel.has(e.name) ? " sel" : ""), oncontextmenu: (ev) => { ev.preventDefault(); itemMenu(more, e); } },
      S.rootUsers ? h("div") : h("input", { type: "checkbox", class: "chk", checked: S.sel.has(e.name), "aria-label": "Select " + e.name,
        onchange: (ev) => toggleSel(e.name, ev.target.checked) }),
      h("div", { class: "name", onclick: () => openItem(e) }, fileIcon(e),
        h("span", { class: "tt" }, h("span", { class: "t", text: e.name, title: e.name }), h("span", { class: "sub", text: sub }))),
      h("div", { class: "meta col-size", text: e.dir && !S.rootUsers ? "—" : fmtSize(e.size) }),
      h("div", { class: "meta col-date", text: fmtDate(e.mtime) }),
      more);
  }

  function gridView(items) {
    return h("div", { class: "grid" }, items.map((e) => {
      const p = joinPath(S.path, e.name);
      let thumb;
      if (!e.dir && SHOW_IMG.has(ext(e.name)) && e.size < 12 * 1024 * 1024) {
        thumb = h("div", { class: "thumb" }, h("img", { src: fileUrl(p), loading: "lazy", alt: "", decoding: "async" }));
      } else {
        thumb = h("div", { class: "thumb" }, fileIcon(e, true));
      }
      const more = h("button", { class: "btn ghost icon sm more", title: "More", "aria-label": "More actions for " + e.name,
        onclick: (ev) => { ev.stopPropagation(); itemMenu(more, e); } }, icon("more"));
      return h("div", { class: "card" + (S.sel.has(e.name) ? " sel" : ""), onclick: () => openItem(e),
        oncontextmenu: (ev) => { ev.preventDefault(); itemMenu(more, e); } },
        S.rootUsers ? null : h("input", { type: "checkbox", class: "chk", checked: S.sel.has(e.name), "aria-label": "Select " + e.name,
          onclick: (ev) => ev.stopPropagation(), onchange: (ev) => toggleSel(e.name, ev.target.checked) }),
        thumb, h("div", { class: "cap" }, h("span", { class: "t", text: e.name, title: e.name }), more));
    }));
  }

  function openItem(e) {
    const p = joinPath(S.path, e.name);
    if (e.dir) { location.hash = filesHash(p); return; }
    if (viewKind(e)) preview(e);
    else download(p);
  }

  function itemMenu(anchor, e) {
    const p = joinPath(S.path, e.name);
    const items = [];
    if (e.dir) items.push({ icon: "folder", label: "Open", run: () => openItem(e) });
    else {
      if (viewKind(e)) items.push({ icon: "open", label: "Preview", run: () => preview(e) });
      items.push({ icon: "download", label: "Download", run: () => download(p) });
    }
    if (!S.rootUsers) {
      items.push({ icon: "edit", label: "Rename", run: () => renameItem(e) });
      items.push("-", { icon: "trash", label: "Delete", danger: true, run: () => deleteItems([e.name]) });
    }
    openMenu(anchor, items);
  }

  function newFolder() {
    modal({
      title: "New folder", ok: "Create",
      fields: [{ name: "name", label: "Folder name", placeholder: "e.g. Photos" }],
      onSubmit: async (v) => {
        await api("POST", "/api/mkdir", { path: S.path, name: v.name.trim() });
        toast("Folder created");
        openFolder(S.path, true);
      },
    });
  }

  function renameItem(e) {
    modal({
      title: "Rename", ok: "Rename",
      fields: [{ name: "name", label: "New name", value: e.name }],
      onSubmit: async (v) => {
        const name = v.name.trim();
        if (name === e.name) return;
        await api("POST", "/api/rename", { path: joinPath(S.path, e.name), name });
        if (S.sel.delete(e.name)) S.sel.add(name);
        toast("Renamed");
        openFolder(S.path, true);
      },
    });
  }

  function deleteItems(names) {
    const one = names.length === 1;
    modal({
      title: one ? "Delete “" + names[0] + "”?" : "Delete " + names.length + " items?",
      text: "This permanently deletes " + (one ? "it" : "them") + ", including everything inside folders. This can't be undone.",
      ok: "Delete", danger: true,
      onSubmit: async () => {
        const r = await api("POST", "/api/delete", { paths: names.map((n) => joinPath(S.path, n)) });
        names.forEach((n) => S.sel.delete(n));
        if (r.used != null) { S.me.used = r.used; renderQuota(); }
        toast(one ? "Deleted" : names.length + " items deleted");
        openFolder(S.path, true);
      },
    });
  }

  function downloadMany(names) {
    const files = S.entries.filter((e) => names.includes(e.name) && !e.dir);
    if (!files.length) { toast("Folders can't be downloaded in one go yet. Open them and select the files.", true); return; }
    files.forEach((e, i) => setTimeout(() => download(joinPath(S.path, e.name)), i * 400));
    if (files.length < names.length) toast("Skipped folders; downloading " + files.length + " file(s).");
  }

  // ------------------------------------------------------------ viewer
  function preview(start) {
    const list = S.entries.filter((e) => !e.dir && viewKind(e));
    let idx = Math.max(0, list.indexOf(start));
    const title = h("span", { class: "t" });
    const stage = h("div", { class: "stage" });
    const dl = h("button", { class: "btn", title: "Download", onclick: () => download(joinPath(S.path, list[idx].name)) }, icon("download"), h("span", { class: "lbl", text: "Download" }));
    const openBtn = h("button", { class: "btn icon", title: "Open in new tab", onclick: () => window.open(fileUrl(joinPath(S.path, list[idx].name)), "_blank", "noopener") }, icon("open"));
    const close = () => { v.remove(); document.removeEventListener("keydown", onKey); };
    const step = (d) => { if (list.length > 1) { idx = (idx + d + list.length) % list.length; show(); } };
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prev = h("button", { class: "nav-btn prev", title: "Previous", onclick: () => step(-1) }, icon("chevL"));
    const next = h("button", { class: "nav-btn next", title: "Next", onclick: () => step(1) }, icon("chevR"));
    const v = h("div", { class: "viewer", role: "dialog", "aria-modal": "true" },
      h("div", { class: "vbar" }, title, openBtn, dl, h("button", { class: "btn icon", title: "Close", onclick: close }, icon("x"))),
      stage);
    function show() {
      const e = list[idx];
      const url = fileUrl(joinPath(S.path, e.name));
      title.textContent = e.name + "  ·  " + fmtSize(e.size);
      const k = viewKind(e);
      let el;
      if (k === "image") el = h("img", { src: url, alt: e.name });
      else if (k === "video") el = h("video", { src: url, controls: true, autoplay: true, playsInline: true });
      else if (k === "audio") el = h("audio", { src: url, controls: true, autoplay: true });
      else if (k === "pdf") el = h("iframe", { src: url, title: e.name });
      else {
        el = h("pre", { text: "Loading…" });
        fetch(url, { headers: { Range: "bytes=0-262143" }, credentials: "same-origin" })
          .then((r) => r.text())
          .then((t) => { el.textContent = t + (e.size > 262144 ? "\n\n… (preview shows the first 256 KB, download to see the rest)" : ""); })
          .catch(() => { el.textContent = "Couldn't load this file."; });
      }
      fill(stage, el, list.length > 1 ? prev : null, list.length > 1 ? next : null);
    }
    document.body.append(v);
    document.addEventListener("keydown", onKey);
    show();
  }

  // ------------------------------------------------------------ uploads
  const U = { items: [], running: false, collapsed: false };
  function pickFiles(input) {
    const files = [...input.files].map((f) => {
      const rel = (f.webkitRelativePath || "").split("/").slice(0, -1).join("/");
      return { file: f, rel };
    });
    input.value = "";
    enqueue(files, S.path);
  }
  function enqueue(files, dir) {
    if (!files.length) return;
    for (const { file, rel } of files) U.items.push({ file, dir, rel: rel || "", name: file.name, size: file.size, loaded: 0, status: "queued" });
    U.collapsed = false;
    renderUploads();
    pump();
  }
  async function pump() {
    if (U.running) return;
    U.running = true;
    for (;;) {
      const it = U.items.find((x) => x.status === "queued");
      if (!it) break;
      await uploadOne(it);
    }
    U.running = false;
    renderUploads();
    refreshMe();
  }
  async function uploadOne(it) {
    it.status = "uploading";
    it.t0 = Date.now();
    renderUploads();
    try {
      await api("POST", "/api/upload-check", { path: it.dir, rel: it.rel, name: it.name, size: it.size });
    } catch (e) {
      it.status = "error"; it.err = e.message; renderUploads(); return;
    }
    await new Promise((resolve) => {
      const x = new XMLHttpRequest();
      it.xhr = x;
      const q = new URLSearchParams({ path: it.dir, rel: it.rel, name: it.name });
      x.open("PUT", "/api/upload?" + q.toString());
      x.setRequestHeader("X-CSRF", S.me.csrf);
      x.setRequestHeader("Content-Type", "application/octet-stream");
      x.upload.onprogress = (ev) => { it.loaded = ev.loaded; renderUploadsSoon(); };
      x.onload = () => {
        let d = {};
        try { d = JSON.parse(x.responseText); } catch (e) { /* not json */ }
        if (x.status === 200) {
          it.status = "done"; it.loaded = it.size;
          if (d.used != null && !S.me.admin) { S.me.used = d.used; renderQuota(); }
          if (S.page === "files" && S.path === it.dir) refreshSoon();
        } else {
          it.status = "error"; it.err = d.error || "Upload failed (" + x.status + ")";
        }
        resolve();
      };
      x.onerror = () => { if (it.status !== "cancelled") { it.status = "error"; it.err = "Connection lost. Try again."; } resolve(); };
      x.onabort = () => { it.status = "cancelled"; resolve(); };
      x.send(it.file);
    });
    renderUploads();
  }
  let uTimer = null;
  function renderUploadsSoon() { if (!uTimer) uTimer = setTimeout(() => { uTimer = null; renderUploads(); }, 250); }
  function renderUploads() {
    const items = U.items;
    if (!items.length) { uploadsEl.classList.add("hidden"); return; }
    uploadsEl.classList.remove("hidden");
    const active = items.filter((x) => x.status === "queued" || x.status === "uploading");
    const done = items.filter((x) => x.status === "done").length;
    const errs = items.filter((x) => x.status === "error").length;
    const total = items.reduce((a, x) => a + x.size, 0) || 1;
    const loaded = items.reduce((a, x) => a + (x.status === "done" ? x.size : x.loaded), 0);
    const head = active.length
      ? "Uploading " + (done + 1) + " of " + items.length + " · " + Math.floor((loaded * 100) / total) + "%"
      : done + " upload" + (done === 1 ? "" : "s") + " complete" + (errs ? ", " + errs + " failed" : "");
    const toggle = h("button", { class: "btn ghost icon sm", title: U.collapsed ? "Expand" : "Collapse", onclick: () => { U.collapsed = !U.collapsed; renderUploads(); } }, icon(U.collapsed ? "chevR" : "chevD"));
    const closeBtn = h("button", {
      class: "btn ghost icon sm", title: active.length ? "Cancel all" : "Close",
      onclick: () => {
        if (active.length && !confirm("Cancel the remaining uploads?")) return;
        for (const x of items) {
          if (x.status === "queued") x.status = "cancelled";
          if (x.status === "uploading" && x.xhr) { x.status = "cancelled"; x.xhr.abort(); }
        }
        U.items = [];
        renderUploads();
      },
    }, icon("x"));
    const rows = U.collapsed ? null : h("div", { class: "ulist" }, items.slice().reverse().map((x) => {
      let s;
      if (x.status === "uploading") {
        const secs = (Date.now() - x.t0) / 1000;
        const speed = secs > 1 ? " · " + fmtSize(x.loaded / secs) + "/s" : "";
        s = Math.floor((x.loaded * 100) / (x.size || 1)) + "%" + speed;
      } else s = { queued: "Waiting", done: "Done", error: x.err, cancelled: "Cancelled" }[x.status];
      const bar = h("i", { class: x.status === "error" ? "full" : "" });
      bar.style.width = (x.status === "done" ? 100 : x.status === "queued" ? 0 : Math.floor((x.loaded * 100) / (x.size || 1))) + "%";
      return h("div", { class: "uitem " + x.status },
        h("span", { class: "n", text: (x.rel ? x.rel + "/" : "") + x.name, title: x.name }),
        x.status === "error" ? null : h("span", { class: "s", text: fmtSize(x.size) }),
        x.status === "uploading" || x.status === "queued" ? h("div", { class: "bar" }, bar) : null,
        h("span", { class: "s", text: s }));
    }));
    fill(uploadsEl, h("div", { class: "uhead" }, icon("upload"), h("span", { class: "t", text: head }), toggle, closeBtn), rows);
  }
  window.addEventListener("beforeunload", (e) => {
    if (U.items.some((x) => x.status === "uploading" || x.status === "queued")) { e.preventDefault(); e.returnValue = ""; }
  });

  // drag and drop, including whole folders
  const canUploadHere = () => S.me && S.page === "files" && !S.rootUsers;
  const hasFiles = (e) => e.dataTransfer && [...e.dataTransfer.types].includes("Files");
  let dragDepth = 0;
  window.addEventListener("dragenter", (e) => {
    if (!hasFiles(e) || !canUploadHere()) return;
    e.preventDefault();
    dragDepth++;
    dropzone.classList.remove("hidden");
  });
  window.addEventListener("dragover", (e) => { if (hasFiles(e) && canUploadHere()) e.preventDefault(); });
  window.addEventListener("dragleave", () => {
    if (!dropzone) return;
    if (--dragDepth <= 0) { dragDepth = 0; dropzone.classList.add("hidden"); }
  });
  window.addEventListener("drop", async (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth = 0;
    dropzone.classList.add("hidden");
    if (!canUploadHere()) return;
    const dir = S.path;
    const entries = [...e.dataTransfer.items].map((i) => (i.webkitGetAsEntry ? i.webkitGetAsEntry() : null));
    let files = [];
    if (entries.some(Boolean)) {
      for (const en of entries) if (en) await walkEntry(en, "", files);
    } else {
      files = [...e.dataTransfer.files].map((f) => ({ file: f, rel: "" }));
    }
    enqueue(files, dir);
  });
  function walkEntry(entry, rel, out) {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((f) => { out.push({ file: f, rel }); resolve(); }, () => resolve());
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const sub = joinPath(rel, entry.name);
        const all = [];
        const readBatch = () => reader.readEntries(async (batch) => {
          if (!batch.length) {
            for (const c of all) await walkEntry(c, sub, out);
            resolve();
          } else { all.push(...batch); readBatch(); }
        }, () => resolve());
        readBatch();
      } else resolve();
    });
  }

  // ------------------------------------------------------------ admin page
  async function renderAdmin() {
    fill(main, h("div", { class: "empty" }, h("p", { text: "Loading…" })));
    let ov;
    try { ov = await api("GET", "/api/admin/overview"); } catch (e) {
      fill(main, h("div", { class: "empty" }, h("h3", { text: "Couldn't load" }), h("p", { text: e.message })));
      return;
    }
    if (S.page !== "admin") return;
    const d = ov.disk;
    const allocated = ov.users.reduce((a, u) => a + u.quota_gb, 0);
    const diskPct = (d.used * 100) / d.total;
    const diskBar = h("i", { class: diskPct >= 95 ? "full" : diskPct >= 85 ? "warn" : "" });
    diskBar.style.width = diskPct + "%";

    const nameIn = h("input", { class: "input", name: "name", required: true, pattern: "[a-z0-9][a-z0-9_\\-]{1,31}", placeholder: "e.g. priya", autocapitalize: "none", spellcheck: "false" });
    const pwIn = h("input", { class: "input", name: "pw", type: "password", required: true, minlength: 8, autocomplete: "new-password" });
    const qIn = h("input", { class: "input", name: "quota", type: "number", min: "0", step: "0.5", value: "10" });
    const addErr = h("div", { class: "form-err" });
    const addBtn = h("button", { class: "btn primary", type: "submit" }, icon("users"), "Add user");

    fill(main, 
      h("div", { class: "page-title", text: "Admin" }),
      ov.admin_pw_file ? h("div", { class: "note" }, icon("info"), h("div", {},
        h("b", { text: "You're still using the generated admin password. " }),
        "Change it: click your initial (top right) → Change password.")) : null,
      h("section", { class: "panel" },
        h("h2", { text: "Storage card" }),
        h("div", { class: "bar" }, diskBar),
        h("div", { class: "stats" },
          h("div", { class: "stat" }, h("b", { text: fmtSize(d.used) }), h("span", { text: "Used" })),
          h("div", { class: "stat" }, h("b", { text: fmtSize(d.free) }), h("span", { text: "Free" })),
          h("div", { class: "stat" }, h("b", { text: fmtSize(d.total) }), h("span", { text: "Total" }))),
        h("div", { class: "hint", text: "Limits handed out: " + allocated + " GB of " + fmtSize(d.total) +
          (allocated * 1073741824 > d.total ? " — more than the card holds, so not everyone can fill their limit." : "") })),
      h("section", { class: "panel" },
        h("h2", { text: "Add a user" }),
        h("form", {
          class: "addform",
          onsubmit: async (e) => {
            e.preventDefault();
            addErr.textContent = "";
            addBtn.disabled = true;
            try {
              const r = await api("POST", "/api/admin/users", { action: "add", name: nameIn.value.trim().toLowerCase(), pw: pwIn.value, quota: qIn.value });
              toast(r.message);
              renderAdmin();
            } catch (x) { addErr.textContent = x.message; addBtn.disabled = false; }
          },
        },
        h("label", { class: "field" }, h("span", { text: "Username" }), nameIn),
        h("label", { class: "field" }, h("span", { text: "Password (8+ characters)" }), pwIn),
        h("label", { class: "field" }, h("span", { text: "Limit in GB (0 = none)" }), qIn),
        addBtn),
        addErr,
        h("div", { class: "hint", text: "They log in at this same address with their username and password, and only see their own files." })),
      h("section", { class: "panel" },
        h("h2", { text: "Users (" + ov.users.length + ")" }),
        ov.users.map(userRow)));
  }

  function userRow(u) {
    const q = u.quota_gb * 1073741824;
    const pct = q ? Math.min(100, (u.used * 100) / q) : 0;
    const bar = h("i", { class: pct >= 100 ? "full" : pct >= 85 ? "warn" : "" });
    bar.style.width = (q ? pct : 0) + "%";
    const isAdmin = u.name === "admin";
    const limitIn = h("input", { class: "input", type: "number", min: "0", step: "0.5", value: String(u.quota_gb), "aria-label": "Limit for " + u.name });
    const act = async (body) => {
      const r = await api("POST", "/api/admin/users", Object.assign({ name: u.name }, body));
      toast(r.message);
      renderAdmin();
    };
    return h("div", { class: "urow" },
      h("div", { class: "who" }, h("span", { class: "avatar", text: u.name[0] }),
        h("div", {}, h("b", { text: u.name + (isAdmin ? " (you)" : "") }),
          h("span", { text: u.quota_gb ? "Limit " + u.quota_gb + " GB" : "No limit" }))),
      h("div", { class: "use" },
        h("span", { text: q ? fmtSize(u.used) + " of " + fmtSize(q) + " (" + Math.round(pct) + "%)" : fmtSize(u.used) + " used" }),
        h("div", { class: "bar" }, bar)),
      h("div", { class: "acts" },
        h("form", { class: "limit", onsubmit: async (e) => { e.preventDefault(); try { await act({ action: "quota", quota: limitIn.value }); } catch (x) { toast(x.message, true); } } },
          limitIn, h("span", { class: "meta", text: "GB" }), h("button", { class: "btn sm", type: "submit", text: "Set" })),
        h("a", { class: "btn sm", href: filesHash(u.name), title: "Open " + u.name + "'s files" }, icon("folder")),
        h("button", { class: "btn sm", title: "Reset password", onclick: () => modal({
          title: "New password for " + u.name, ok: "Set password",
          fields: [{ name: "pw", label: "New password (8+ characters)", type: "password", autocomplete: "new-password", minlength: 8 }],
          onSubmit: (v) => act({ action: "password", pw: v.pw }),
        }) }, icon("key")),
        isAdmin ? null : h("button", { class: "btn sm danger", title: "Remove user", onclick: () => modal({
          title: "Remove " + u.name + "?", ok: "Remove", danger: true,
          text: "They won't be able to log in anymore. Their files are kept on the card in the removed-users folder, not deleted.",
          onSubmit: () => act({ action: "remove" }),
        }) }, icon("trash"))));
  }

  // ------------------------------------------------------------ start
  (async () => {
    try {
      const r = await fetch("/api/me", { credentials: "same-origin" });
      if (r.ok) S.me = await r.json();
    } catch (e) { /* offline */ }
    if (!S.me) return renderLogin();
    renderShell();
    route();
  })();
})();
