import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [logo, globals, docsCss, design] = await Promise.all([
  readFile(new URL("../public/logo.svg", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../docs-site/src/css/custom.css", import.meta.url), "utf8"),
  readFile(new URL("../DESIGN.md", import.meta.url), "utf8"),
]);

assert.match(logo, /<title(?:\s+[^>]*)?>HermesCN\.org · Hermes 中文社区<\/title>/);
assert.doesNotMatch(logo, /HermesCn\.org/);

const forbiddenChineseSerif = /Songti|STSong|Noto Serif CJK SC|Noto Serif SC|SimSun|Display Serif|UI Serif/;
assert.doesNotMatch(globals, forbiddenChineseSerif);
assert.doesNotMatch(docsCss, forbiddenChineseSerif);
assert.doesNotMatch(design, forbiddenChineseSerif);

const requiredSansFonts = ["PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "sans-serif"];
for (const font of requiredSansFonts) {
  assert.ok(globals.includes(font), `main site font stack must include ${font}`);
  assert.ok(docsCss.includes(font), `docs font stack must include ${font}`);
}

console.log("Brand casing and Chinese sans-serif checks passed.");
