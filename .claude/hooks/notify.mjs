#!/usr/bin/env node
// OS desktop notification utility. NOT auto-registered to a settings.json event —
// invoked manually (`node .claude/hooks/notify.mjs "msg"`) or by other hooks. Best-effort.
// Message via argv (preferred) or stdin JSON {message}.
import { execFileSync } from "node:child_process";
import { platform } from "node:os";
import { readFileSync } from "node:fs";

let msg = process.argv.slice(2).join(" ").trim();
if (!msg) {
  try {
    const p = JSON.parse(readFileSync(0, "utf8") || "{}");
    msg = p.message || p.reason || "Claude Code event";
  } catch {
    msg = "Claude Code event";
  }
}

try {
  const os = platform();
  if (os === "darwin") {
    execFileSync("osascript", [
      "-e",
      `display notification ${JSON.stringify(msg)} with title "Claude Code"`,
    ]);
  } else if (os === "linux") {
    execFileSync("notify-send", ["Claude Code", msg]);
  } else if (os === "win32") {
    execFileSync("powershell", [
      "-NoProfile",
      "-Command",
      `[void][System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show(${JSON.stringify(msg)},'Claude Code')`,
    ]);
  }
} catch {
  // best-effort: notification failure must never break the flow
}
process.exit(0);
