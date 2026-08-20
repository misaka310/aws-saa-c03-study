param(
    [switch]$VerifyOnly,
    [string]$DeployScript = $env:CHATGPT_SITES_DEPLOY_SCRIPT,
    [string]$CodexJs = $env:CHATGPT_SITES_CODEX_JS
)

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Resolve-Tool {
    param([string[]]$Candidates, [string]$Label)
    foreach ($Candidate in $Candidates) {
        if ([string]::IsNullOrWhiteSpace($Candidate)) { continue }
        $Command = Get-Command $Candidate -ErrorAction SilentlyContinue
        if ($Command) { return $Command.Source }
        if (Test-Path -LiteralPath $Candidate) { return (Resolve-Path -LiteralPath $Candidate).Path }
    }
    throw "$Label was not found"
}

function Invoke-Native {
    param([string]$FilePath, [string[]]$Arguments, [string]$Label)
    $Process = Start-Process -FilePath $FilePath -ArgumentList $Arguments -NoNewWindow -Wait -PassThru
    if ($Process.ExitCode -ne 0) {
        throw "$Label failed with exit code $($Process.ExitCode)"
    }
}

$Node = Resolve-Tool -Candidates @("node.exe", "C:\Program Files\nodejs\node.exe") -Label "Node.js"

Push-Location $Root
try {
    Invoke-Native -FilePath $Node -Arguments @("scripts/build-sites.mjs") -Label "Sites build"
    Invoke-Native -FilePath $Node -Arguments @("--test", "quiz/test_quiz.mjs", "quiz/test_backup.mjs", "scripts/test-sites.mjs") -Label "Repository verification"

    if (-not $VerifyOnly) {
        if ([string]::IsNullOrWhiteSpace($DeployScript)) {
            throw "Deployment is optional and requires -DeployScript or CHATGPT_SITES_DEPLOY_SCRIPT. Use -VerifyOnly to build and test without a deploy adapter."
        }
        if (-not (Test-Path -LiteralPath $DeployScript)) {
            throw "Deploy script was not found: $DeployScript"
        }

        $Python = Resolve-Tool -Candidates @("python.exe", "py.exe", "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe") -Label "Python"
        if ([string]::IsNullOrWhiteSpace($CodexJs)) {
            $CodexJs = Resolve-Tool -Candidates @("$HOME\AppData\Roaming\npm\node_modules\@openai\codex\bin\codex.js") -Label "Codex CLI JavaScript entrypoint"
        }

        $env:CHATGPT_SITES_NODE = $Node
        $env:CHATGPT_SITES_CODEX_JS = $CodexJs
        Invoke-Native -FilePath $Python -Arguments @(
            (Resolve-Path -LiteralPath $DeployScript).Path,
            "--cwd", $Root,
            "--expected-slug", "aws-saa-c03-study",
            "--private-marker", "SAA_BACKUP"
        ) -Label "Private Site deployment"
    }
}
finally {
    Pop-Location
}
