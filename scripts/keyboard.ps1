Add-Type -AssemblyName System.Windows.Forms

param(
    [string]$Action,
    [string]$Text = ""
)

Start-Sleep -Milliseconds 500

switch ($Action) {
    "paste" {
        [System.Windows.Forms.SendKeys]::SendWait("^v")
    }
    "enter" {
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
    }
    "type" {
        [System.Windows.Forms.Clipboard]::SetText($Text)
        Start-Sleep -Milliseconds 100
        [System.Windows.Forms.SendKeys]::SendWait("^v")
    }
    "ctrl_enter" {
        [System.Windows.Forms.SendKeys]::SendWait("^{ENTER}")
    }
}
