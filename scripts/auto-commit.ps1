# ============================================================
# Auto-commit script — called by Kiro hook on file save
# Generates smart conventional commit messages based on
# which files were changed.
# ============================================================

Set-Location E:\apps\exit-exam-ethiopia

# Stage all changes
git add -A

# Check if there's anything to commit
$status = git diff --cached --name-only 2>&1
if (-not $status) {
  Write-Host "Nothing to commit." -ForegroundColor Yellow
  exit 0
}

$files = $status -split "`n" | Where-Object { $_ -ne "" }

# Determine commit type + scope from changed files
$type  = "chore"
$scope = ""
$desc  = "update files"

$hasAdmin    = $files | Where-Object { $_ -match "admin" }
$hasAuth     = $files | Where-Object { $_ -match "login|register|auth|middleware" }
$hasPages    = $files | Where-Object { $_ -match "src/app" }
$hasSchema   = $files | Where-Object { $_ -match "schema\.sql" }
$hasStyles   = $files | Where-Object { $_ -match "globals\.css" }
$hasConfig   = $files | Where-Object { $_ -match "package\.json|next\.config|tsconfig|tailwind|postcss|vercel\.json" }
$hasLib      = $files | Where-Object { $_ -match "src/lib" }
$hasComp     = $files | Where-Object { $_ -match "src/components" }
$hasChangelog = $files | Where-Object { $_ -match "CHANGELOG" }

if ($hasSchema)    { $type = "feat"; $scope = "db";      $desc = "update Supabase schema" }
if ($hasAdmin)     { $type = "feat"; $scope = "admin";   $desc = "update admin panel" }
if ($hasAuth)      { $type = "feat"; $scope = "auth";    $desc = "update authentication" }
if ($hasComp)      { $type = "feat"; $scope = "ui";      $desc = "update components" }
if ($hasLib)       { $type = "feat"; $scope = "lib";     $desc = "update library utilities" }
if ($hasPages)     { $type = "feat"; $scope = "pages";   $desc = "update pages" }
if ($hasStyles)    { $type = "style"; $scope = "css";    $desc = "update styles" }
if ($hasConfig)    { $type = "chore"; $scope = "config"; $desc = "update configuration" }
if ($hasChangelog) { $type = "docs"; $scope = "changelog"; $desc = "update changelog" }

# Count changed files
$count = $files.Count
$fileList = ($files | Select-Object -First 3) -join ", "
if ($count -gt 3) { $fileList += " +$($count - 3) more" }

# Build commit message
if ($scope) {
  $msg = "${type}(${scope}): $desc"
} else {
  $msg = "${type}: $desc"
}
$msg += " [$fileList]"

# Commit
git -c credential.helper=wincred `
    -c user.name="ecoders1" `
    -c user.email="ecoders1@users.noreply.github.com" `
    commit -m $msg

# Push
git -c credential.helper=wincred push origin main

Write-Host ""
Write-Host "✅  $msg" -ForegroundColor Green
