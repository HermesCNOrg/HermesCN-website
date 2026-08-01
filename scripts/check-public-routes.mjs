import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [skillsData, skillRoute, docsCss] = await Promise.all([
  readFile(new URL("../src/app/skills/skills-data.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/app/api/skills/[slug]/route.ts", import.meta.url), "utf8"),
  readFile(new URL("../docs-site/src/css/custom.css", import.meta.url), "utf8"),
]);

for (const [name, source] of [
  ["skills page data", skillsData],
  ["skill detail route", skillRoute],
]) {
  assert.doesNotMatch(
    source,
    /from ["']~\/env["']/,
    `${name} must not import the full app env schema for an optional public API token`,
  );
}

assert.match(
  docsCss,
  /\.hermes-section-link--documentation::before\s*\{[^}]*content:\s*"\\eadb"\s*!important;/s,
  "the active documentation nav item must retain its book icon",
);

console.log("Public skills env isolation and docs nav icon checks passed.");
