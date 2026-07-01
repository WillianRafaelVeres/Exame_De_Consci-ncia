$ErrorActionPreference = "Stop"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
  Write-Host "Este script precisa ser executado como Administrador." -ForegroundColor Yellow
  Write-Host "Clique com o botao direito no PowerShell e escolha 'Executar como administrador', entao rode:"
  Write-Host "npm run fix:expo-firewall" -ForegroundColor Cyan
  exit 1
}

$profiles = Get-NetConnectionProfile | Where-Object {
  $_.IPv4Connectivity -ne "Disconnected" -and $_.NetworkCategory -ne "DomainAuthenticated"
}

foreach ($profile in $profiles) {
  if ($profile.NetworkCategory -ne "Private") {
    Set-NetConnectionProfile -InterfaceIndex $profile.InterfaceIndex -NetworkCategory Private
  }
}

$nodePath = (Get-Command node -ErrorAction Stop).Source
$ruleName = "Expo Metro Node.js 8081-8090"
$existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

if ($existingRule) {
  Remove-NetFirewallRule -DisplayName $ruleName
}

New-NetFirewallRule `
  -DisplayName $ruleName `
  -Direction Inbound `
  -Action Allow `
  -Program $nodePath `
  -Protocol TCP `
  -LocalPort 8081-8090 `
  -Profile Private | Out-Null

Write-Host "Rede privada e Firewall ajustados para Expo/Metro." -ForegroundColor Green
Write-Host "Node: $nodePath"
Get-NetConnectionProfile | Select-Object Name, InterfaceAlias, NetworkCategory, IPv4Connectivity | Format-Table -AutoSize
Get-NetFirewallRule -DisplayName $ruleName | Select-Object DisplayName, Enabled, Direction, Action, Profile | Format-Table -AutoSize
