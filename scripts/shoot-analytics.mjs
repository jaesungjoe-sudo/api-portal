// Verification — screenshots the analytics pages behind Basic Auth.
// Run: BASIC_AUTH_USER=... BASIC_AUTH_PASSWORD=... node scripts/shoot-analytics.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const username = process.env.BASIC_AUTH_USER;
const password = process.env.BASIC_AUTH_PASSWORD;
if (!username || !password) {
  console.error("Missing BASIC_AUTH_USER / BASIC_AUTH_PASSWORD env vars");
  process.exit(1);
}

const PAGES = [
  { path: "/analytics", name: "analytics" },
  { path: "/analytics/top-apis", name: "analytics-top-apis" },
];
const OUT = "/tmp/analytics-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  httpCredentials: { username, password },
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
for (const p of PAGES) {
  await page.goto(`http://localhost:3000${p.path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800); // let recharts animate in
  const path = `${OUT}/${p.name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`saved ${path}`);
}
await browser.close();
console.log("done");
