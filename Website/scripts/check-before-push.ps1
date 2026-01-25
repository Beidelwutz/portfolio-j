# Prüft, ob versehentlich sensible Dateien zum Push vorgemerkt sind.
# Vor dem Push ausführen: .\scripts\check-before-push.ps1

$ErrorActionPreference = "Stop"
$repoRoot = (Get-Item $PSScriptRoot).Parent.FullName
Set-Location $repoRoot

$sensitivePatterns = @(
    '\.env',
    'secret',
    'credentials',
    '\.key$',
    '\.pem$',
    '\\private\\',
    '/private/',
    '\\privat\\',
    '\\_private\\',
    '\.env\.',
    'config\.local\.',
    'geheim',
    'intern'
)

$gitArgs = @('-c', "safe.directory=$repoRoot", 'diff', '--name-only', '--cached')
$staged = & git @gitArgs 2>$null
if (-not $staged) {
    Write-Host 'Keine Änderungen zum Commit vorgemerkt.' -ForegroundColor Gray
    exit 0
}

$bad = @()
foreach ($f in $staged) {
    foreach ($p in $sensitivePatterns) {
        if ($f -match $p) {
            $bad += $f
            break
        }
    }
}

if ($bad.Count -gt 0) {
    Write-Host 'ACHTUNG: Diese Dateien wirken sensibel und sollten nicht gepusht werden:' -ForegroundColor Red
    $bad | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nAus Staging entfernen: git reset HEAD Dateiname" -ForegroundColor Yellow
    Write-Host 'Siehe SECURITY.md für Richtlinien.' -ForegroundColor Yellow
    exit 1
}

Write-Host 'Check OK: Keine offensichtlich sensiblen Dateien im Staging.' -ForegroundColor Green
exit 0
