# Copy the Home Cloud app to the board (LF line endings), without restarting anything.
$src = $PSScriptRoot
$tmp = Join-Path $env:TEMP "homecloud-deploy"
Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$tmp\web" | Out-Null
foreach ($f in 'app.py', 'S99homeserver', 'web\index.html', 'web\app.css', 'web\app.js', 'web\favicon.svg') {
    [IO.File]::WriteAllText("$tmp\$f", ([IO.File]::ReadAllText("$src\$f") -replace "`r", ""))
}
ssh luckfox 'mkdir -p /opt/homeserver/web'
scp -q "$tmp\app.py" luckfox:/opt/homeserver/app.py
scp -q "$tmp\web\index.html" "$tmp\web\app.css" "$tmp\web\app.js" "$tmp\web\favicon.svg" luckfox:/opt/homeserver/web/
scp -q "$tmp\S99homeserver" luckfox:/opt/homeserver/S99homeserver.new
ssh luckfox 'chmod 755 /opt/homeserver/app.py; ls -la /opt/homeserver/app.py /opt/homeserver/web'
