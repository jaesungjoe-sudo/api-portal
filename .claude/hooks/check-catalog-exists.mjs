#!/usr/bin/env node
// PostToolUse (Write): for a NEW src/components/ui/<name>.tsx, warn if spec/catalog/nav missing.
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";
import { execFileSync } from "node:child_process";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const fp = payload?.tool_input?.file_path ?? "";
const m = fp.match(/src\/components\/ui\/([a-z0-9-]+)\.tsx$/);
if (!m || !existsSync(fp)) process.exit(0);

// Only warn for newly-created (git-untracked) files.
function isTracked(path) {
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", path], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
if (isTracked(fp)) process.exit(0);

const name = m[1];
const src = readFileSync(fp, "utf8");
// Tier 3 heuristic: has cva variants → reusable, demo-worthy.
const isTier3 = /\bcva\(/.test(src);
if (!isTier3) process.exit(0); // Tier 1/2 — no catalog requirement

const specPath = `design-system/components/${name}.md`;
const catalogPath = `src/app/(design-system)/design-system/primitives/${name}/page.tsx`;
const navPath = "src/lib/design-system-nav.ts";

const missing = [];
if (!existsSync(specPath)) missing.push(`② 스펙: ${specPath}`);
if (!existsSync(catalogPath)) missing.push(`③ 카탈로그: ${catalogPath}`);
const navHasIt = existsSync(navPath) && readFileSync(navPath, "utf8").includes(`/primitives/${name}`);
if (!navHasIt) missing.push(`④ nav 등록: ${navPath}`);

if (missing.length) {
  console.error(
    `⚠️ check-catalog-exists (비차단): 신규 Tier-3 후보 "${basename(fp)}" 의 아티팩트 누락:\n` +
      missing.map((x) => `  - ${x}`).join("\n") +
      `\n  → 재사용 primitive 면 추가 (rules/component-artifacts.md 승격 절차). 1회성이면 무시.`
  );
  process.exit(1); // non-blocking warning — exit 1 surfaces stderr in transcript
}
process.exit(0); // clean: no missing artifacts
