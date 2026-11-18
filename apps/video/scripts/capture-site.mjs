// Films web pages frame by frame in Chrome for the project walkthrough videos.
//   node scripts/capture-site.mjs public        portfolio public page + login page (headless)
//   node scripts/capture-site.mjs dashboard     portfolio admin pages; visible Chrome, you sign in with Google yourself
//   node scripts/capture-site.mjs email-agent   n8n Email summary agent v2; visible Chrome, you sign in to n8n yourself
//   node scripts/capture-site.mjs edw         DRIW warehouse dashboards served by local XAMPP (headless)
//   node scripts/capture-site.mjs tcehub      TCEHub live preview on Vercel (headless)
//   node scripts/capture-site.mjs crrdc       CRRDC information system; visible Chrome, you pass the access page and sign in yourself
//   node scripts/capture-site.mjs probe         prints portfolio section offsets to tune the keyframes below
// Writes public/<out>/<shot>.mp4 (1920x1080, 30fps), or <shot>.png at 2x for still shots. Needs Chrome and ffmpeg on PATH.
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const SITE = "https://ivansalinas.vercel.app";
const TCE = "https://tcehub-alpha.vercel.app";
const CRRDC = "https://crrdc.vercel.app";
const FPS = 30;
const PORT = 9342;
const mode = process.argv[2] || "public";

const fileUrl = (p) => pathToFileURL(join(root, p)).href;

// Keyframes: [seconds, scroll target]. Target is px, "#id" (element top), "#id+px" or "max" (page bottom). Scroll eases between them.
// still: true takes one 2x screenshot instead of filming. authed(path) says when a headed run is past the sign-in page.
const MODES = {
  public: { out: "footage", shots: [
    { name: "site", url: `${SITE}/`, seconds: 19, keys: [[0, 0], [1, 0], [4, "#top"], [6, "#top"], [7.5, "#practice"], [9.5, "#practice"], [11, "#disciplines"], [12.5, "#disciplines"], [14, "#work"], [15.5, "#work"], [18, "#work+900"], [19, "#work+900"]] },
    { name: "login", url: `${SITE}/loginauthentication`, seconds: 4.5, keys: [[0, 0]] },
  ] },
  dashboard: { out: "footage", headed: true, authed: (p) => p.startsWith("/analytics"), shots: [
    { name: "analytics", url: `${SITE}/analytics`, seconds: 6, keys: [[0, 0], [1.5, 0], [5, 700], [6, 700]] },
    { name: "content", url: `${SITE}/analytics/content`, seconds: 3, keys: [[0, 0], [3, 250]] },
    { name: "testimonials", url: `${SITE}/analytics/testimonials`, seconds: 2.5, keys: [[0, 0]] },
    { name: "requests", url: `${SITE}/analytics/services-request`, seconds: 2.5, keys: [[0, 0]] },
  ] },
  // n8n stills (editor.png, run.png) are screenshots you take in your signed-in browser; only the digest is filmed.
  "email-agent": { out: "email-agent", shots: [
    { name: "digest", url: fileUrl("public/email-agent/digest.html"), css: "body { zoom: 1.55; width: 740px; margin: 30px auto !important; }", seconds: 10, keys: [[0, 0], [1.5, 0], [9, "max"], [10, "max"]] },
  ] },
  // DRIW warehouse dashboards on local XAMPP (http://localhost/driw). Filmed at 1280x720 CSS px x1.5 so the narrow layout fills 1920x1080.
  edw: { out: "edw", viewport: [1280, 720, 1.5], shots: [
    { name: "executive", url: "http://localhost/driw/", seconds: 4.4, keys: [[0, 0], [1.2, 0], [4.4, 620]] },
    { name: "operations", url: "http://localhost/driw/operations", seconds: 2.6, keys: [[0, 0], [0.8, 0], [2.6, 400]] },
    { name: "logistics", url: "http://localhost/driw/logistics", seconds: 2.4, keys: [[0, 0], [0.6, 0], [2.4, 350]] },
  ] },
  // TCEHub live preview (front end in development, mock data). "phone" is filmed at iPhone size for the mobile-first scene.
  tcehub: { out: "tcehub", viewport: [1280, 720, 1.5], shots: [
    { name: "home", url: `${TCE}/`, seconds: 6.5, keys: [[0, 0], [1.5, 0], [6.5, 700]] },
    { name: "shops", url: `${TCE}/shops`, seconds: 5.5, keys: [[0, 0], [1, 0], [5.5, 450]] },
    { name: "events", url: `${TCE}/events`, seconds: 2.25, keys: [[0, 0], [2.25, 250]] },
    { name: "galleries", url: `${TCE}/galleries`, seconds: 2.25, keys: [[0, 0], [2.25, 250]] },
    { name: "phone", url: `${TCE}/`, viewport: [390, 844, 2], seconds: 8.5, keys: [[0, 0], [1, 0], [8.5, 2000]] },
    { name: "admin", url: `${TCE}/admin/shops`, seconds: 8.5, keys: [[0, 0]] },
  ] },
  // CRRDC information system: visible Chrome, you pass the access page and sign in yourself. Filmed at 1440x810 x1.333.
  crrdc: { out: "crrdc", headed: true, viewport: [1440, 810, 4 / 3], authed: (p) => !/^\/(access|loginaccesscrrdc2026|signup)?$/.test(p), shots: [
    { name: "dashboard", url: `${CRRDC}/dashboard`, seconds: 7, keys: [[0, 0], [2, 0], [7, 900]] },
    { name: "projects", url: `${CRRDC}/project-management`, seconds: 4, keys: [[0, 0], [1.5, 0], [4, 400]] },
    { name: "documents", url: `${CRRDC}/document-management`, seconds: 3.5, keys: [[0, 0], [1.5, 0], [3.5, 300]] },
    { name: "extension", url: `${CRRDC}/extension-activities-management`, seconds: 3, keys: [[0, 0], [3, 300]] },
    { name: "staff", url: `${CRRDC}/faculties-staff`, seconds: 3, keys: [[0, 0]] },
    { name: "approvals", url: `${CRRDC}/user-approvals`, seconds: 3, keys: [[0, 0]] },
    { name: "settings", url: `${CRRDC}/settings`, seconds: 3, keys: [[0, 0], [3, 300]] },
    { name: "home", url: `${CRRDC}/`, public: true, seconds: 6, keys: [[0, 0], [1.5, 0], [6, 1100]] },
  ] },
};
const config = MODES[mode];
const headed = !!config?.headed;
// Persistent profile so the Google session survives between runs. Gitignored; holds your login cookies.
const profile = join(root, headed ? ".chrome-profile" : ".chrome-profile-headless");
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  ...(headed ? [] : ["--headless=new"]), `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--window-size=1920,1080", "--hide-scrollbars", "--force-device-scale-factor=1", "--no-first-run",
  // A minimized or covered visible window stops painting; keep it rendering.
  "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page"); } catch {}
}
if (!target) throw new Error("Chrome did not start");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const n = ++id;
  pending.set(n, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
  ws.send(JSON.stringify({ id: n, method, params }));
});
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
await send("Page.enable");

async function open(url) {
  await send("Page.navigate", { url });
  for (let i = 0; i < 150; i++) { await sleep(100); if (await evaluate("document.readyState === 'complete'").catch(() => false)) break; }
  await evaluate("document.fonts.ready.then(() => true)");
  await sleep(1500); // let entrance animations settle
}

const ease = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
async function resolveKeys(keys) {
  return Promise.all(keys.map(async ([t, k]) => {
    if (typeof k === "number") return [t, k];
    if (k === "max") return [t, await evaluate("document.documentElement.scrollHeight - innerHeight")];
    const [sel, off = "0"] = k.split("+");
    const y = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); return el ? el.getBoundingClientRect().top + scrollY : null })()`);
    if (y == null) throw new Error(`selector not found: ${sel}`);
    return [t, y + Number(off)];
  }));
}
function scrollAt(keys, t) {
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1][0] <= t) i++;
  if (i === keys.length - 1) return keys[i][1];
  const [t0, y0] = keys[i], [t1, y1] = keys[i + 1];
  return y0 + (y1 - y0) * ease((t - t0) / (t1 - t0));
}

async function film(shot) {
  await open(shot.url);
  const authed = async () => config.authed(await evaluate("location.pathname").catch(() => ""));
  if (headed && !shot.public && !shot.url.startsWith("file:") && !(await authed())) {
    console.log(`\n>>> Sign in in the Chrome window. Waiting up to 15 minutes...`);
    for (let i = 0; i < 900 && !(await authed()); i++) await sleep(1000);
    if (!(await authed())) throw new Error("sign-in timed out");
  }
  // Emulate after the login dance so the visible window stays usable while signing in, then reload at that size.
  const [vw, vh, scale] = shot.viewport ?? config.viewport ?? [1920, 1080, 1];
  await send("Emulation.setDeviceMetricsOverride", { width: vw, height: vh, deviceScaleFactor: shot.still ? 2 * scale : scale, mobile: vw < 768 });
  await open(shot.url);
  // Optional CSS to frame a page for video (e.g. enlarge a narrow email).
  if (shot.css) await evaluate(`document.head.insertAdjacentHTML("beforeend", ${JSON.stringify(`<style>${shot.css}</style>`)}); new Promise((r) => setTimeout(r, 300))`);
  const outDir = join(root, "public", config.out);
  mkdirSync(outDir, { recursive: true });
  if (shot.still) {
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(outDir, `${shot.name}.png`), Buffer.from(data, "base64"));
    console.log(`${shot.name}: still`);
    return;
  }
  const keys = await resolveKeys(shot.keys);
  const dir = join(root, "footage-frames", shot.name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const total = Math.round(shot.seconds * FPS);
  for (let f = 0; f < total; f++) {
    const y = Math.round(scrollAt(keys, f / FPS));
    await evaluate(`window.scrollTo({ top: ${y}, behavior: "instant" }); new Promise((r) => { requestAnimationFrame(() => requestAnimationFrame(r)); setTimeout(r, 200); })`);
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 92 });
    await writeFile(join(dir, `f${String(f).padStart(4, "0")}.jpg`), Buffer.from(data, "base64"));
  }
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", join(dir, "f%04d.jpg"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", join(outDir, `${shot.name}.mp4`)]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`${shot.name}: ${total} frames`);
}

try {
  if (mode === "probe") {
    await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await open(SITE + "/");
    console.log(await evaluate(`JSON.stringify({ height: document.documentElement.scrollHeight, sections: [...document.querySelectorAll("section[id]")].map((s) => [s.id, Math.round(s.getBoundingClientRect().top + scrollY)]) })`));
  } else {
    if (!config) throw new Error(`unknown mode: ${mode}`);
    for (const shot of config.shots) await film(shot);
  }
} finally {
  ws.close();
  chrome.kill();
  rmSync(join(root, "footage-frames"), { recursive: true, force: true });
}
