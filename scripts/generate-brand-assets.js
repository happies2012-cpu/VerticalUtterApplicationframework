#!/usr/bin/env node
/**
 * Nexus Platform — Automated Brand Asset Pipeline
 * Generates all web/PWA favicons and brand assets from the master logo.
 * Run: node scripts/generate-brand-assets.js
 */

const sharp = require("sharp");
const fs    = require("fs");
const path  = require("path");
const https = require("https");
const http  = require("http");

/* ─── Config ─────────────────────────────────────────────── */
const LOGO_URL  = "https://www.gsgroups.net/gslogo.png";
const LOGO_CACHE = path.join(__dirname, "../public/icons/logo-master.png");
const PUBLIC    = path.join(__dirname, "../public");
const ICONS_DIR = path.join(PUBLIC, "icons");

/* ─── Utilities ──────────────────────────────────────────── */
function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(dest); return; }
    const file   = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} downloading ${url}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve(dest)));
    }).on("error", (e) => { fs.unlinkSync(dest); reject(e); });
  });
}

function log(msg, ok = true) {
  const sym = ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
  console.log(`  ${sym}  ${msg}`);
}

/* ─── ICO builder (pure Node, no extra deps) ─────────────── */
async function buildIco(src, dest, sizes) {
  const entries = await Promise.all(
    sizes.map(async (size) => {
      const buf = await sharp(src)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      return { size, buf };
    })
  );

  // ICO header
  const numImages = entries.length;
  const headerSize = 6 + 16 * numImages;
  let offset = headerSize;
  const offsets = entries.map(({ buf }) => {
    const o = offset;
    offset += buf.length;
    return o;
  });

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0,          0); // reserved
  header.writeUInt16LE(1,          2); // type: ICO
  header.writeUInt16LE(numImages,  4); // image count

  entries.forEach(({ size, buf }, i) => {
    const base = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, base + 0);  // width
    header.writeUInt8(size >= 256 ? 0 : size, base + 1);  // height
    header.writeUInt8(0,                       base + 2);  // palette
    header.writeUInt8(0,                       base + 3);  // reserved
    header.writeUInt16LE(1,                    base + 4);  // planes
    header.writeUInt16LE(32,                   base + 6);  // bit count
    header.writeUInt32LE(buf.length,           base + 8);  // size
    header.writeUInt32LE(offsets[i],           base + 12); // offset
  });

  const parts = [header, ...entries.map(({ buf }) => buf)];
  fs.writeFileSync(dest, Buffer.concat(parts));
}

/* ─── Main ───────────────────────────────────────────────── */
async function main() {
  console.log("\n\x1b[35m▶ NEXUS BRAND ASSET PIPELINE\x1b[0m\n");

  /* 1. Ensure dirs */
  [PUBLIC, ICONS_DIR].forEach(mkdirp);

  /* 2. Download master logo */
  console.log("  Fetching master logo…");
  await download(LOGO_URL, LOGO_CACHE);
  log(`Master logo cached → public/icons/logo-master.png`);

  const master = sharp(LOGO_CACHE);
  const meta   = await master.metadata();
  log(`Source: ${meta.width}×${meta.height} ${meta.format?.toUpperCase()} (${meta.hasAlpha ? "RGBA" : "RGB"})`);

  /* ── Web / PWA assets ──────────────────────────────────── */
  console.log("\n  \x1b[36mWeb & PWA Icons\x1b[0m");

  // favicon.ico — multi-resolution (16, 32, 48)
  await buildIco(LOGO_CACHE, path.join(PUBLIC, "favicon.ico"), [16, 32, 48]);
  log("favicon.ico (16×16 + 32×32 + 48×48)");

  // favicon-16x16.png
  await sharp(LOGO_CACHE)
    .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "favicon-16x16.png"));
  log("favicon-16x16.png");

  // favicon-32x32.png
  await sharp(LOGO_CACHE)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "favicon-32x32.png"));
  log("favicon-32x32.png");

  // apple-touch-icon.png (180×180, opaque white bg for iOS)
  await sharp(LOGO_CACHE)
    .resize(160, 160, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  log("apple-touch-icon.png (180×180, white bg)");

  // android-chrome-192x192.png
  await sharp(LOGO_CACHE)
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "android-chrome-192x192.png"));
  log("android-chrome-192x192.png");

  // android-chrome-512x512.png
  await sharp(LOGO_CACHE)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "android-chrome-512x512.png"));
  log("android-chrome-512x512.png");

  /* ── Optimized in-app logo ─────────────────────────────── */
  console.log("\n  \x1b[36mIn-App UI Assets\x1b[0m");

  // logo.png — high-density compressed UI logo
  await sharp(LOGO_CACHE)
    .resize(240, 240, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(PUBLIC, "logo.png"));
  log("logo.png (240×240, compressed)");

  // logo-white.png — white version for dark backgrounds
  await sharp(LOGO_CACHE)
    .resize(240, 240, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .negate({ alpha: false })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ICONS_DIR, "logo-white.png"));
  log("icons/logo-white.png (inverted, white)");

  // logo-dark.png — dark version for light backgrounds
  await sharp(LOGO_CACHE)
    .resize(240, 240, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ICONS_DIR, "logo-dark.png"));
  log("icons/logo-dark.png (240×240)");

  // og-image.png — Open Graph social preview
  const ogWidth  = 1200;
  const ogHeight = 630;
  const logoSize = 280;

  const logoResized = await sharp(LOGO_CACHE)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const ogBackground = {
    create: {
      width:      ogWidth,
      height:     ogHeight,
      channels:   4,
      background: { r: 10, g: 8, b: 24, alpha: 255 },
    },
  };

  await sharp(ogBackground)
    .composite([{
      input: logoResized,
      left:  Math.round((ogWidth  - logoSize) / 2),
      top:   Math.round((ogHeight - logoSize) / 2),
    }])
    .jpeg({ quality: 92 })
    .toFile(path.join(PUBLIC, "og-image.jpg"));
  log("og-image.jpg (1200×630, social preview)");

  /* ── site.webmanifest ──────────────────────────────────── */
  const manifest = {
    name:             "Nexus Platform",
    short_name:       "Nexus",
    description:      "The future of team work — AI-driven task orchestration and neural collaboration.",
    start_url:        "/",
    display:          "standalone",
    background_color: "#0a0818",
    theme_color:      "#8b5cf6",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
  fs.writeFileSync(
    path.join(PUBLIC, "site.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );
  log("site.webmanifest");

  /* ─── Summary ─────────────────────────────────────────── */
  console.log("\n\x1b[35m  ═══════════════════════════════════\x1b[0m");
  console.log("\x1b[32m  ✓ All assets generated successfully\x1b[0m\n");

  const files = [
    "public/favicon.ico",
    "public/favicon-16x16.png",
    "public/favicon-32x32.png",
    "public/apple-touch-icon.png",
    "public/android-chrome-192x192.png",
    "public/android-chrome-512x512.png",
    "public/logo.png",
    "public/og-image.jpg",
    "public/site.webmanifest",
    "public/icons/logo-master.png",
    "public/icons/logo-white.png",
    "public/icons/logo-dark.png",
  ];
  files.forEach((f) => {
    const fullPath = path.join(__dirname, "..", f);
    const exists   = fs.existsSync(fullPath);
    const size     = exists ? `(${(fs.statSync(fullPath).size / 1024).toFixed(1)} KB)` : "";
    log(`${f} ${size}`, exists);
  });
  console.log();
}

main().catch((e) => {
  console.error("\n\x1b[31m✗ Pipeline failed:\x1b[0m", e.message);
  process.exit(1);
});
