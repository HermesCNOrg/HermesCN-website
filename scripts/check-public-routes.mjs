import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [skillsData, skillsCatalog, skillRoute, docsCss] = await Promise.all([
  readFile(
    new URL("../src/app/skills/skills-data.ts", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/app/skills/skills-catalog.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/app/api/skills/[slug]/route.ts", import.meta.url),
    "utf8",
  ),
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

assert.doesNotMatch(
  skillsData,
  /fetch\s*\(/,
  "the public skills page must read the prepared catalog without blocking on ClawHub",
);
assert.doesNotMatch(
  skillsData,
  /CLAWHUB_SKILLS_URL|CLAWHUB_API_TOKEN|fetchSkills|fetchPage/,
  "ClawHub synchronization must stay outside the user request path",
);
assert.match(
  skillsData,
  /skillsCatalog\.items/,
  "the public skills page must read the prepared local catalog",
);
assert.match(
  skillsCatalog,
  /const INITIAL_VISIBLE_SKILLS = 48/,
  "the catalog should initially render a bounded number of skill cards",
);
assert.match(
  skillsCatalog,
  /filteredSkills\.slice\(0, visibleCount\)/,
  "the catalog should progressively reveal filtered skills",
);

assert.match(
  docsCss,
  /\.hermes-section-link--documentation::before\s*\{[^}]*content:\s*"\\eadb"\s*!important;/s,
  "the active documentation nav item must retain its book icon",
);

console.log("Public skills static catalog and docs nav icon checks passed.");
