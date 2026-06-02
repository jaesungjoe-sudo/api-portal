#!/usr/bin/env bash
# Design System Harness installer — idempotent. Verifies hooks & settings.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
HOOKS=".claude/hooks"
PASS=0; FAIL=0
ok(){ echo "  ✓ $1"; PASS=$((PASS+1)); }
bad(){ echo "  ✗ $1"; FAIL=$((FAIL+1)); }

echo "== Design System Harness install =="

# 1) Node version (>=18)
if command -v node >/dev/null 2>&1; then
  MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$MAJOR" -ge 18 ]; then ok "node $(node -v) (>=18)"; else bad "node too old: $(node -v)"; fi
else
  bad "node not found"; fi

# 2) Hook files present
for h in protect-files check-design-tokens check-catalog-exists notify; do
  if [ -f "$HOOKS/$h.mjs" ]; then ok "$h.mjs present"; else bad "$h.mjs MISSING"; fi
done

# 3) Hook smoke tests (must not crash)
echo '{"tool_name":"Edit","tool_input":{"file_path":"/x/.env.local"}}' | node "$HOOKS/protect-files.mjs" >/dev/null 2>&1 && bad "protect-files should block .env (exit2)" || ok "protect-files blocks .env"
echo '{"tool_name":"Edit","tool_input":{"file_path":"/x/a.txt"}}' | node "$HOOKS/protect-files.mjs" >/dev/null 2>&1 && ok "protect-files allows non-.env" || bad "protect-files wrongly blocked"

# 4) settings.json valid + plugin preserved
if node -e "const j=require('./.claude/settings.json'); if(!j.enabledPlugins||!j.hooks) process.exit(1)" 2>/dev/null; then
  ok "settings.json valid (plugin + hooks)"; else bad "settings.json invalid or missing keys"; fi

# 5) Tracking reminder (.claude is gitignored → force-add)
echo ""
echo "== git tracking =="
echo "  .claude/ is gitignored. Harness files are tracked via: git add -f"
echo "  (settings.local.json intentionally NOT tracked.)"

echo ""
echo "== result: $PASS passed, $FAIL failed =="
[ "$FAIL" -eq 0 ] || { echo "Some checks failed — see above."; exit 1; }
echo "Harness OK."
