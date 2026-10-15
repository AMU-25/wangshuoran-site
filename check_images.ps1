$root = "d:/王烁然安利站"
$data = Get-Content (Join-Path $root "assets/js/data.js") -Raw
$dir = Join-Path $root "assets/img/uploads"

# 提取所有 assets/img/uploads/xxx.jpg|png 引用
$refs = [regex]::Matches($data, 'assets/img/uploads/[A-Za-z0-9_]+\.(jpg|png|jpeg|webp|gif)') | ForEach-Object { $_.Value } | Sort-Object -Unique

$missing = @()
foreach ($r in $refs) {
  $p = Join-Path $root $r
  if (-not (Test-Path $p)) { $missing += $r }
}

Write-Host ("总引用数: {0}" -f $refs.Count)
Write-Host ("缺失文件数: {0}" -f $missing.Count)
if ($missing.Count) {
  Write-Host "----- 缺失的图片 -----"
  $missing | ForEach-Object { Write-Host $_ }
}
Write-Host "DONE"
