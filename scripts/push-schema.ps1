# ============================================================
# push-schema.ps1
# Reads supabase/schema.sql and executes it against your
# Supabase project using the Management API (service-role key).
# Usage:  powershell -ExecutionPolicy Bypass -File scripts/push-schema.ps1
# ============================================================

Set-Location E:\apps\exit-exam-ethiopia

# ── Load .env.local ──────────────────────────────────────────
$envFile = ".\.env.local"
if (-not (Test-Path $envFile)) {
  Write-Host "❌  .env.local not found." -ForegroundColor Red
  exit 1
}

$envVars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
    $envVars[$matches[1].Trim()] = $matches[2].Trim()
  }
}

$supabaseUrl     = $envVars["NEXT_PUBLIC_SUPABASE_URL"]
$serviceRoleKey  = $envVars["SUPABASE_SERVICE_ROLE_KEY"]

if (-not $supabaseUrl -or -not $serviceRoleKey) {
  Write-Host "❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local" -ForegroundColor Red
  exit 1
}

# ── Read schema ──────────────────────────────────────────────
$schemaFile = ".\supabase\schema.sql"
if (-not (Test-Path $schemaFile)) {
  Write-Host "❌  supabase/schema.sql not found." -ForegroundColor Red
  exit 1
}

$sql = Get-Content $schemaFile -Raw -Encoding UTF8

Write-Host "🚀  Pushing schema.sql to Supabase..." -ForegroundColor Cyan

# ── Execute via Supabase REST /rest/v1/rpc or SQL endpoint ───
# Supabase exposes a direct SQL execution endpoint for service-role
$uri = "$supabaseUrl/rest/v1/rpc/exec_sql"

# Use the pg_dump compatible endpoint: POST to /sql
# (available via the supabase-js admin or direct HTTP)
$sqlEndpoint = "$supabaseUrl/pg/query"

$headers = @{
  "apikey"        = $serviceRoleKey
  "Authorization" = "Bearer $serviceRoleKey"
  "Content-Type"  = "application/json"
}

$body = @{ query = $sql } | ConvertTo-Json -Depth 5

try {
  $response = Invoke-RestMethod `
    -Uri $sqlEndpoint `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ErrorAction Stop

  Write-Host "✅  Schema applied successfully!" -ForegroundColor Green
  if ($response) {
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor DarkGray
  }
}
catch {
  # Fallback: try the older /rest/v1/ direct SQL path used by some Supabase versions
  $fallbackEndpoint = "$supabaseUrl/rest/v1/"
  Write-Host "⚠️   /pg/query failed, trying fallback..." -ForegroundColor Yellow

  # Split into individual statements and run each via psql-style HTTP
  # The most reliable way without the Supabase CLI is the Management API
  $projectRef = ($supabaseUrl -replace 'https://', '' -replace '\.supabase\.co.*', '')
  $mgmtEndpoint = "https://api.supabase.com/v1/projects/$projectRef/database/query"

  $mgmtHeaders = @{
    "Authorization" = "Bearer $serviceRoleKey"
    "Content-Type"  = "application/json"
  }

  try {
    $response = Invoke-RestMethod `
      -Uri $mgmtEndpoint `
      -Method POST `
      -Headers $mgmtHeaders `
      -Body $body `
      -ErrorAction Stop

    Write-Host "✅  Schema applied via Management API!" -ForegroundColor Green
  }
  catch {
    Write-Host ""
    Write-Host "❌  Could not push schema automatically." -ForegroundColor Red
    Write-Host "    The most reliable option is the Supabase CLI:" -ForegroundColor Yellow
    Write-Host "    1. Install: npm install -g supabase" -ForegroundColor White
    Write-Host "    2. Login:   supabase login" -ForegroundColor White
    Write-Host "    3. Link:    supabase link --project-ref $projectRef" -ForegroundColor White
    Write-Host "    4. Push:    supabase db push" -ForegroundColor White
    Write-Host ""
    Write-Host "    Or paste schema.sql manually in:" -ForegroundColor Yellow
    Write-Host "    https://supabase.com/dashboard/project/$projectRef/sql/new" -ForegroundColor Cyan
    exit 1
  }
}
