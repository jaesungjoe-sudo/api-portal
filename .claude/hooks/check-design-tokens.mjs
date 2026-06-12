#!/usr/bin/env node
// PostToolUse (Write|Edit): warn on hardcoded colors / arbitrary values in .tsx (non-blocking).
import { readFileSync, existsSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const fp = payload?.tool_input?.file_path ?? "";
if (!/\.tsx$/.test(fp) || !existsSync(fp)) process.exit(0);

const src = readFileSync(fp, "utf8");
const lines = src.split("\n");

// Intended exceptions (CLAUDE.md): Avatar mock background.
const ALLOW = [/bg-fuchsia-600/];

const PATTERNS = [
  { re: /#[0-9a-fA-F]{3,8}\b/, msg: "hex color literal" },
  { re: /\brgba?\(/, msg: "rgb()/rgba() literal" },
  {
    re: /\b(?:text|bg|border|fill|stroke|ring|from|to|via)-\[#?[0-9a-fA-F]/,
    msg: "arbitrary color value (use semantic token)",
  },
  {
    re: /\b(?:text|p|px|py|pt|pb|pl|pr|m|mx|my|gap|w|h|rounded|leading)-\[\d/,
    msg: "arbitrary size value (use Tailwind scale)",
  },
  { re: /var\(--color-/, msg: "var(--color-*) 직접 사용 (시맨틱 클래스 사용)" },
];

const findings = [];
lines.forEach((line, i) => {
  if (ALLOW.some((a) => a.test(line))) return;
  for (const { re, msg } of PATTERNS) {
    if (re.test(line)) {
      findings.push(`  L${i + 1}: ${msg} → ${line.trim().slice(0, 80)}`);
      break;
    }
  }
});

if (findings.length) {
  console.error(
    `⚠️ check-design-tokens (비차단): ${fp}\n${findings.join("\n")}\n` +
      `  → 시맨틱 Tailwind 클래스 사용 (CLAUDE.md 원칙 3 / rules/color.md).`
  );
  process.exit(1); // non-blocking warning — exit 1 surfaces stderr in transcript (PostToolUse: tool already ran, nothing blocked)
}
process.exit(0); // clean: no findings
