import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  skillsData,
  skillsCatalog,
  skillsPage,
  skillDetail,
  workerConfig,
  buildScript,
  manifestText,
  llmsRoute,
  docsCss,
] = await Promise.all([
  readFile(
    new URL("../src/app/skills/skills-static-data.ts", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/app/skills/skills-catalog.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../src/app/skills/page.tsx", import.meta.url), "utf8"),
  readFile(
    new URL("../src/app/skills/skill-detail.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
  readFile(new URL("./build-skills-data.mjs", import.meta.url), "utf8"),
  readFile(
    new URL("../public/skills-data/manifest.json", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../src/app/llms.txt/route.ts", import.meta.url), "utf8"),
  readFile(new URL("../docs-site/src/css/custom.css", import.meta.url), "utf8"),
]);

const manifest = JSON.parse(manifestText);

assert.match(
  skillsData,
  /\/skills-data\/manifest\.json/,
  "the Skills page must resolve the current static data version from its manifest",
);
assert.match(
  skillsData,
  /\/skills-data\/search-index\.json\?v=\$\{version\}/,
  "the Skills page must load the prepared static search index with its current version",
);
assert.match(
  skillsData,
  /skills-\$\{String\(chunk\)\.padStart\(3, "0"\)\}\.json/,
  "Skill details must load from bounded static chunks",
);
assert.doesNotMatch(
  `${skillsData}\n${skillsCatalog}\n${skillDetail}`,
  /SKILLS_CATALOG_KV|CLAWHUB_API_TOKEN|\/api\/skills\//,
  "the public Skills UI must not depend on the removed KV or ClawHub API path",
);
assert.doesNotMatch(
  skillsPage,
  /force-dynamic|getSkills\(/,
  "the public Skills page must remain static",
);
assert.match(
  skillsData,
  /NousResearch\/hermes-agent\/skills\/\$\{entry\.category\}\/\$\{name\}/,
  "bundled Skills must expose a copyable installation command",
);
assert.match(
  skillDetail,
  /复制安装命令/,
  "every Skill detail must render an installation command copy action",
);
assert.match(
  workerConfig,
  /"main":\s*"\.open-next\/worker\.js"/,
  "Wrangler must deploy the generated OpenNext Worker directly",
);
assert.doesNotMatch(
  workerConfig,
  /SKILLS_CATALOG_KV|"crons"|"triggers"/,
  "Wrangler must not retain the removed Skills KV or scheduled trigger",
);
assert.match(
  buildScript,
  /const chunkSize = 1_000/,
  "the static catalog must keep each generated chunk bounded",
);
assert.equal(
  manifest.totalSkills > 0,
  true,
  "the static catalog cannot be empty",
);
assert.equal(
  manifest.chunks.length,
  Math.ceil(manifest.totalSkills / manifest.chunkSize),
  "the manifest must list every generated chunk",
);
assert.equal(
  manifest.categories.length,
  16,
  "the public catalog must expose the curated main categories only",
);
assert.equal(
  manifest.categories.reduce((total, category) => total + category.count, 0),
  manifest.totalSkills,
  "the curated categories must retain every source Skill",
);
assert.equal(
  manifest.categories.at(-1)?.id,
  "other",
  "the long-tail category must remain last",
);
assert.equal(
  typeof manifest.catalogSha256,
  "string",
  "the manifest must version the generated catalog assets",
);
assert.match(
  skillsCatalog,
  /const INITIAL_VISIBLE_SKILLS = 48/,
  "the catalog should initially render a bounded number of skill cards",
);
assert.match(
  skillsCatalog,
  /const \[selectedSource, setSelectedSource\] = useState\("all"\)/,
  "the catalog must provide an independent source filter",
);
assert.match(
  skillsCatalog,
  /<p className="text-sm font-medium">来源<\/p>/,
  "the source filter must appear as its own section",
);
assert.match(
  skillsCatalog,
  /filteredSkills\.slice\(0, visibleCount\)/,
  "the catalog should progressively reveal filtered skills",
);
assert.match(
  skillsCatalog,
  /<ScrollShadow[\s\S]*hideScrollBar[\s\S]*orientation="vertical"/,
  "the category list must use HeroUI ScrollShadow without a visible scrollbar",
);
assert.match(
  llmsRoute,
  /skills-data\/manifest\.json/,
  "llms.txt must advertise the current machine-readable Skills catalog",
);
assert.match(
  docsCss,
  /\.hermes-section-link--documentation::before\s*\{[^}]*content:\s*"\\eadb"\s*!important;/s,
  "the active documentation nav item must retain its book icon",
);

console.log("Public static Skills catalog and docs nav icon checks passed.");
