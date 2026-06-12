# ============================================================
# Exit Exam Ethiopia — Release Script
# Usage:
#   .\scripts\release.ps1 patch   → 1.0.0 → 1.0.1 (bug fixes)
#   .\scripts\release.ps1 minor   → 1.0.0 → 1.1.0 (new features)
#   .\scripts\release.ps1 major   → 1.0.0 → 2.0.0 (breaking changes)
# ============================================================

param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("patch","minor","major")]
  [string]$Type
)

$ErrorActionPreference = "Stop"

# Read current version from package.json
$pkg = Get-Content package.json | ConvertFrom-Json
$current = $pkg.version
$parts = $current.Split(".")
$major = [int]$parts[0]
$minor = [int]$parts[1]
$patch = [int]$parts[2]

# Bump version
switch ($Type) {
  "major" { $major++; $minor = 0; $patch = 0 }
  "minor" { $minor++; $patch = 0 }
  "patch" { $patch++ }
}
$newVersion = "$major.$minor.$patch"

Write-Host ""
Write-Host "🔖  Bumping version: $current → $newVersion ($Type)" -ForegroundColor Cyan

# Update package.json
$content = Get-Content package.json -Raw
$content = $content -replace '"version": ".*?"', """version"": ""$newVersion"""
Set-Content package.json $content -NoNewline

# Prepend to CHANGELOG
$date = Get-Date -Format "yyyy-MM-dd"
$entry = @"
## [$newVersion] — $date

### Changed
- Version bump ($Type release)

---

"@
$changelog = Get-Content CHANGELOG.md -Raw
$insertAt = $changelog.IndexOf("## [")
$newChangelog = $changelog.Substring(0, $insertAt) + $entry + $changelog.Substring($insertAt)
Set-Content CHANGELOG.md $newChangelog -NoNewline

# Git commit + tag + push
git add package.json CHANGELOG.md
git -c credential.helper=wincred `
    -c user.name="ecoders1" `
    -c user.email="ecoders1@users.noreply.github.com" `
    commit -m "chore(release): v$newVersion"

git tag -a "v$newVersion" -m "Release v$newVersion"

git -c credential.helper=wincred push origin main
git -c credential.helper=wincred push origin "v$newVersion"

Write-Host ""
Write-Host "✅  Released v$newVersion and pushed tag to GitHub" -ForegroundColor Green
Write-Host "    https://github.com/ecoders1/exit-exam-ethiopia/releases/tag/v$newVersion" -ForegroundColor Gray
