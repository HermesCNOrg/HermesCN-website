import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputPath = path.join(process.cwd(), "src/data/skills-catalog.json");
const baseUrl = "https://clawhub.ai/api/v1/skills";
const pageLimit = 100;
const maxItems = Number.parseInt(process.argv[2] ?? "240", 10);

function pickSkill(skill) {
  return {
    slug: skill.slug,
    displayName: skill.displayName ?? skill.slug,
    summary: skill.summary ?? null,
    description: skill.description ?? null,
    topics: Array.isArray(skill.topics) ? skill.topics : [],
    tags: {
      latest: skill.tags?.latest ?? null,
    },
    stats: {
      comments: skill.stats?.comments ?? 0,
      downloads: skill.stats?.downloads ?? 0,
      installs: skill.stats?.installs ?? 0,
      stars: skill.stats?.stars ?? 0,
      versions: skill.stats?.versions ?? 0,
    },
    latestVersion: {
      version: skill.latestVersion?.version ?? null,
      changelog: skill.latestVersion?.changelog ?? null,
      license: skill.latestVersion?.license ?? null,
    },
  };
}

async function fetchPage(cursor) {
  const url = new URL(baseUrl);
  url.searchParams.set("limit", String(pageLimit));
  url.searchParams.set("sort", "recommended");
  url.searchParams.set("nonSuspiciousOnly", "true");

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`ClawHub API ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  const items = [];
  let cursor;

  while (items.length < maxItems) {
    const page = await fetchPage(cursor);
    const pageItems = Array.isArray(page.items) ? page.items : [];

    for (const item of pageItems) {
      items.push(pickSkill(item));
      if (items.length >= maxItems) break;
    }

    if (!page.nextCursor || pageItems.length === 0) {
      break;
    }

    cursor = page.nextCursor;
  }

  const catalog = {
    source: baseUrl,
    syncedAt: new Date().toISOString(),
    count: items.length,
    items,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);

  console.log(`Synced ${items.length} skills to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
