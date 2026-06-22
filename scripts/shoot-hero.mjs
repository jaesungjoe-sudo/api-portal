// Temporary verification script — screenshots the landing hero across widths
// behind Basic Auth. Run: BASIC_AUTH_USER=... BASIC_AUTH_PASSWORD=... node scripts/shoot-hero.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const username = process.env.BASIC_AUTH_USER;
const password = process.env.BASIC_AUTH_PASSWORD;
if (!username || !password) {
  console.error("Missing BASIC_AUTH_USER / BASIC_AUTH_PASSWORD env vars");
  process.exit(1);
}

const WIDTHS = [1920, 1512, 1440, 1280, 1024, 768];
const OUT = "/tmp/hero-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const w of WIDTHS) {
  const ctx = await browser.newContext({
    httpCredentials: { username, password },
    viewport: { width: w, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForSelector("svg ellipse", { timeout: 10000 });
  const path = `${OUT}/hero-${w}.png`;
  // capture the hero region (top of page) — full ellipse extent
  await page.screenshot({ path, clip: { x: 0, y: 0, width: w, height: 1000 } });
  console.log(`saved ${path}`);
  await ctx.close();
}
await browser.close();
console.log("done");
