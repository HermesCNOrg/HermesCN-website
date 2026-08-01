import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  skillsData,
  skillsCatalog,
  skillsPage,
  skillRoute,
  workerEntrypoint,
  workerConfig,
  docsCss,
] = await Promise.all([
  readFile(
    new URL("../src/app/skills/skills-data.ts", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/app/skills/skills-catalog.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../src/app/skills/page.tsx", import.meta.url), "utf8"),
  readFile(
    new URL("../src/app/api/skills/[slug]/route.ts", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../worker-entry.ts", import.meta.url), "utf8"),
  readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
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
  "the public skills page must retain the prepared local catalog as fallback",
);
assert.match(
  skillsData,
  /SKILLS_CATALOG_KV/,
  "the public skills page must read the website-managed catalog from KV",
);
assert.match(
  skillsPage,
  /export const dynamic = ["']force-dynamic["']/,
  "the public skills route must read the current website KV catalog at request time",
);
assert.match(
  workerEntrypoint,
  /async scheduled\(/,
  "the website Worker must own the daily synchronization handler",
);
assert.match(
  workerEntrypoint,
  /syncSkillsCatalog/,
  "the scheduled handler must synchronize the Skills catalog",
);
assert.match(
  workerConfig,
  /"main":\s*"worker-entry\.ts"/,
  "Wrangler must deploy the custom website Worker entrypoint",
);
assert.match(
  workerConfig,
  /"crons":\s*\[\s*"0 2 \* \* \*"\s*\]/,
  "Skills synchronization must run once daily at 02:00 UTC",
);
assert.match(
  workerConfig,
  /"binding":\s*"SKILLS_CATALOG_KV"/,
  "the website Worker must own a KV binding for its Skills catalog",
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
