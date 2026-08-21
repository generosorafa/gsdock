import { readdirSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { gzipSync } from "node:zlib";

const distDirectory = new URL("../dist/", import.meta.url);
const indexHtml = readFileSync(new URL("index.html", distDirectory), "utf8");
const assetDirectory = new URL("assets/", distDirectory);
const files = readdirSync(assetDirectory).filter(
  (file) => file.endsWith(".js") || file.endsWith(".css"),
);

const limits = {
  initialJavaScript: 100 * 1024,
  initialCss: 20 * 1024,
  lazyJavaScript: 25 * 1024,
};

function gzipBytes(file) {
  return gzipSync(readFileSync(new URL(file, assetDirectory))).byteLength;
}

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

const initialScript = indexHtml.match(/<script[^>]+src="\/assets\/([^"]+\.js)"/)?.[1];
const initialStyles = [...indexHtml.matchAll(/<link[^>]+href="\/assets\/([^"]+\.css)"/g)].map(
  (match) => match[1],
);

if (!initialScript || initialStyles.length === 0) {
  throw new Error("Não foi possível identificar os assets iniciais no build do Vite.");
}

const checks = [
  {
    label: "JavaScript inicial",
    actual: gzipBytes(initialScript),
    limit: limits.initialJavaScript,
  },
  {
    label: "CSS inicial",
    actual: initialStyles.reduce((total, file) => total + gzipBytes(file), 0),
    limit: limits.initialCss,
  },
];

const lazyScripts = files.filter(
  (file) => file.endsWith(".js") && file !== basename(initialScript),
);
for (const file of lazyScripts) {
  checks.push({
    label: `Chunk lazy ${file}`,
    actual: gzipBytes(file),
    limit: limits.lazyJavaScript,
  });
}

const failures = checks.filter((check) => check.actual > check.limit);
for (const check of checks) {
  const status = check.actual <= check.limit ? "OK" : "EXCEDEU";
  console.log(`${status} · ${check.label}: ${formatKiB(check.actual)} / ${formatKiB(check.limit)}`);
}

if (failures.length > 0) {
  throw new Error(`${failures.length} budget(s) de bundle foram excedidos.`);
}
