#!/usr/bin/env node
// PreToolUse (Write|Edit): block edits to .env* files (secrets present).
import { readFileSync } from "node:fs";
import { basename } from "node:path";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0); // unparseable → don't interfere
}

const fp = payload?.tool_input?.file_path ?? "";
const name = basename(fp);

if (/^\.env(\..+)?$/.test(name)) {
  console.error(
    `🔒 protect-files: "${name}" 수정은 차단됩니다 (시크릿 포함). ` +
      `필요하면 사용자가 직접 편집하세요. (.claude/hooks/protect-files.mjs)`
  );
  process.exit(2); // block
}

process.exit(0);
