# clean-motion-video: one-line installer for Windows
#
#   irm https://raw.githubusercontent.com/Mohamedriyadh22/clean-motion-video/main/install.ps1 | iex
#
# What it does (safe to run again at any time):
#   1. checks Node.js 22+, ffmpeg, Google Chrome, Python 3 and Git, and installs any that are missing (winget)
#   2. installs the Python packages the voice script needs (requests, python-dotenv)
#   3. downloads (or updates) the skill into your Claude skills folder
#   4. creates a work folder with a .env file and helps you paste YOUR OWN ElevenLabs API key (and tests it)
#   5. tells you the one step only you can do: install the "animation-studio" plugin in the Claude app
# Set $env:CMV_CHECK_ONLY = "1" before running to only check, without installing or asking anything.

$ErrorActionPreference = 'Continue'
$Repo      = 'https://github.com/Mohamedriyadh22/clean-motion-video'
$SkillDir  = Join-Path $env:USERPROFILE '.claude\skills\clean-motion-video'
$WorkDir   = Join-Path ([Environment]::GetFolderPath('MyVideos')) 'claude-videos'
$CheckOnly = $env:CMV_CHECK_ONLY -eq '1'
$results   = [ordered]@{}

function Say($msg, $color = 'Gray') { Write-Host $msg -ForegroundColor $color }
function Ok($name, $detail)  { $script:results[$name] = "OK  $detail";      Say "  [OK]   $name  $detail" Green }
function Bad($name, $detail) { $script:results[$name] = "MISSING  $detail"; Say "  [--]   $name  $detail" Yellow }
function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
}
function Has($cmd) { [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }
function Winget-Install($id, $name) {
  if ($CheckOnly) { return }
  if (-not (Has 'winget')) { Say "    winget is not available: install $name manually." Red; return }
  Say "    installing $name ..." Cyan
  winget install --id $id -e --silent --accept-source-agreements --accept-package-agreements | Out-Null
  Refresh-Path
}

Say ''
Say '=== clean-motion-video installer ===' Cyan
if ($CheckOnly) { Say '(check-only mode: nothing will be installed or changed)' DarkGray }
Say ''
Say '1) Tools' White

# Node.js 22+
$nodeOk = $false
if (Has 'node') { $v = (node --version) -replace 'v', ''; $nodeOk = ([int]($v.Split('.')[0]) -ge 22) }
if (-not $nodeOk) { Winget-Install 'OpenJS.NodeJS.LTS' 'Node.js'; if (Has 'node') { $v = (node --version) -replace 'v', ''; $nodeOk = ([int]($v.Split('.')[0]) -ge 22) } }
if ($nodeOk) { Ok 'Node.js' "v$v" } else { Bad 'Node.js' 'need version 22 or newer (https://nodejs.org)' }

# ffmpeg
if (-not (Has 'ffmpeg')) { Winget-Install 'Gyan.FFmpeg' 'ffmpeg' }
if (Has 'ffmpeg') { Ok 'ffmpeg' '' } else { Bad 'ffmpeg' 'winget install Gyan.FFmpeg' }

# Google Chrome
$chromePaths = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe")
$chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { Winget-Install 'Google.Chrome' 'Google Chrome'; $chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1 }
if ($chrome) {
  Ok 'Chrome' ''
  if (-not $CheckOnly -and -not $env:CHROME_PATH) { [Environment]::SetEnvironmentVariable('CHROME_PATH', $chrome, 'User'); $env:CHROME_PATH = $chrome }
} else { Bad 'Chrome' 'https://www.google.com/chrome' }

# Python 3
$py = $null
foreach ($c in @('python', 'py')) { if (Has $c) { $out = & $c --version 2>&1; if ("$out" -match 'Python 3') { $py = $c; break } } }
if (-not $py) { Winget-Install 'Python.Python.3.12' 'Python 3'; foreach ($c in @('python', 'py')) { if (Has $c) { $out = & $c --version 2>&1; if ("$out" -match 'Python 3') { $py = $c; break } } } }
if ($py) { Ok 'Python' "$((& $py --version 2>&1))" } else { Bad 'Python' 'https://www.python.org (tick "Add to PATH")' }

# Python packages
if ($py) {
  & $py -c "import requests, dotenv" 2>$null
  if ($LASTEXITCODE -ne 0 -and -not $CheckOnly) { Say '    installing requests + python-dotenv ...' Cyan; & $py -m pip install --user --quiet requests python-dotenv 2>$null | Out-Null; & $py -c "import requests, dotenv" 2>$null }
  if ($LASTEXITCODE -eq 0) { Ok 'Python packages' 'requests, python-dotenv' } else { Bad 'Python packages' "$py -m pip install requests python-dotenv" }
}

# Git
if (-not (Has 'git')) { Winget-Install 'Git.Git' 'Git' }
if (Has 'git') { Ok 'Git' '' } else { Bad 'Git' 'winget install Git.Git' }

Say ''
Say '2) The skill' White
if (Test-Path (Join-Path $SkillDir 'SKILL.md')) {
  if ((Test-Path (Join-Path $SkillDir '.git')) -and -not $CheckOnly -and (Has 'git')) { git -C $SkillDir pull --quiet 2>$null | Out-Null; Ok 'Skill' "updated ($SkillDir)" }
  else { Ok 'Skill' "installed ($SkillDir)" }
} elseif (-not $CheckOnly -and (Has 'git')) {
  New-Item -ItemType Directory -Force -Path (Split-Path $SkillDir) | Out-Null
  git clone --quiet $Repo $SkillDir 2>$null
  if (Test-Path (Join-Path $SkillDir 'SKILL.md')) { Ok 'Skill' "installed ($SkillDir)" } else { Bad 'Skill' "git clone $Repo `"$SkillDir`"" }
} else { Bad 'Skill' "git clone $Repo `"$SkillDir`"" }

Say ''
Say '3) Work folder and ElevenLabs key' White
$envFile = Join-Path $WorkDir '.env'
if (-not $CheckOnly) { New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null }
$key = $null
if (Test-Path $envFile) { $line = Get-Content $envFile | Where-Object { $_ -match '^ELEVENLABS_API_KEY=' } | Select-Object -First 1; if ($line) { $key = ($line -split '=', 2)[1].Trim() } }
if (-not $key -and -not $CheckOnly) {
  Say '    You need your OWN ElevenLabs API key (free plan is fine).' White
  Say '    Opening the ElevenLabs key page: sign in, click "Create API Key", copy it.' White
  Start-Process 'https://elevenlabs.io/app/settings/api-keys'
  $key = (Read-Host '    Paste your key here (or press Enter to skip for now)').Trim()
  if ($key) { Set-Content -Path $envFile -Value "ELEVENLABS_API_KEY=$key" -Encoding UTF8 }
}
if ($key) {
  try {
    $sub = Invoke-RestMethod -Uri 'https://api.elevenlabs.io/v1/user/subscription' -Headers @{ 'xi-api-key' = $key } -TimeoutSec 20
    Ok 'ElevenLabs key' "works - plan: $($sub.tier), characters left: $($sub.character_limit - $sub.character_count)"
    if ($sub.tier -eq 'free') { Say '    note: the free plan has no Music API; the skill makes the music itself.' DarkGray }
  } catch { Bad 'ElevenLabs key' "saved in $envFile but it did not work - check it and paste it again" }
} else { Bad 'ElevenLabs key' "add ELEVENLABS_API_KEY=your_key to $envFile" }

Say ''
Say '4) One step only you can do (in the Claude app)' White
Say '    Plugins -> Browse plugins -> search "animation-studio" -> Install' Cyan
Say '    (it is the drawing engine the skill uses)' DarkGray

Say ''
$missing = @($results.Keys | Where-Object { $results[$_] -like 'MISSING*' })
if ($missing.Count -eq 0) {
  Say 'All set!' Green
  Say "Open the Claude app -> Code tab -> choose the folder: $WorkDir" White
  Say 'Then ask, for example: "Make a 60-second video about my project, cream and orange colors, calm female voice."' White
} else {
  Say ("Still needed: " + ($missing -join ', ')) Yellow
  Say 'Fix the items above (or just run this installer again), then open the Claude app -> Code tab.' White
}
Say ''
