import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:5173";
const OUT = ".screenshots";
mkdirSync(OUT, { recursive: true });

const pages = [
  { route: "/login", name: "login", auth: false },
  { route: "/dashboard", name: "dashboard", auth: true },
  { route: "/transactions", name: "transactions", auth: true },
  { route: "/subscriptions", name: "subscriptions", auth: true },
  { route: "/analytics", name: "analytics", auth: true },
  { route: "/settings", name: "settings", auth: true },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  await context.addInitScript(() => {
    window.localStorage.setItem("mm-auth", "true");
  });
  const unauth = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });

  for (const p of pages) {
    const ctx = p.auth ? context : unauth;
    const page = await ctx.newPage();
    await page.goto(`${BASE}${p.route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${p.name}-${vp.name}.png`, fullPage: true });
    await page.close();
  }
  if (vp.name === "desktop") {
    const page = await context.newPage();
    await page.goto(`${BASE}/transactions?ajouter=depense`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/transactions-modal-${vp.name}.png` });
    await page.close();
  }
  await context.close();
  await unauth.close();
}
await browser.close();
console.log("done");
