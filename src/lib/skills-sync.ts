type SkillsCatalogStore = {
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string): Promise<void>;
};

export const SKILLS_CATALOG_KEY = "skills-catalog:v1";
export const SKILLS_CATALOG_LIMIT = 240;
export const SKILLS_CATALOG_MINIMUM = 200;

const CLAWHUB_SKILLS_URL = "https://clawhub.ai/api/v1/skills";

type CatalogPage = {
  items?: unknown[];
  nextCursor?: string | null;
};

export type StoredSkillsCatalog = {
  source: string;
  syncedAt: string;
  count: number;
  items: unknown[];
};

export type SkillsSyncEnv = {
  SKILLS_CATALOG_KV: SkillsCatalogStore;
  CLAWHUB_API_TOKEN?: string;
};

async function fetchPage(env: SkillsSyncEnv, cursor?: string) {
  const url = new URL(CLAWHUB_SKILLS_URL);
  url.searchParams.set("limit", "100");
  url.searchParams.set("sort", "recommended");
  url.searchParams.set("nonSuspiciousOnly", "true");
  if (cursor) url.searchParams.set("cursor", cursor);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(env.CLAWHUB_API_TOKEN
        ? { Authorization: `Bearer ${env.CLAWHUB_API_TOKEN}` }
        : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`ClawHub returned ${response.status}`);
  }

  return (await response.json()) as CatalogPage;
}

export async function collectSkillsCatalog(
  env: SkillsSyncEnv,
): Promise<StoredSkillsCatalog> {
  const items: unknown[] = [];
  let cursor: string | undefined;

  while (items.length < SKILLS_CATALOG_LIMIT) {
    const page = await fetchPage(env, cursor);
    const pageItems = Array.isArray(page.items) ? page.items : [];
    items.push(...pageItems);

    if (!page.nextCursor || pageItems.length === 0) break;
    cursor = page.nextCursor;
  }

  const limitedItems = items.slice(0, SKILLS_CATALOG_LIMIT);
  if (limitedItems.length < SKILLS_CATALOG_MINIMUM) {
    throw new Error(
      `Refusing to replace catalog with only ${limitedItems.length} Skills`,
    );
  }

  return {
    source: CLAWHUB_SKILLS_URL,
    syncedAt: new Date().toISOString(),
    count: limitedItems.length,
    items: limitedItems,
  };
}

export async function syncSkillsCatalog(env: SkillsSyncEnv) {
  const catalog = await collectSkillsCatalog(env);
  await env.SKILLS_CATALOG_KV.put(SKILLS_CATALOG_KEY, JSON.stringify(catalog));
  console.log(`Synchronized ${catalog.count} Skills at ${catalog.syncedAt}`);
  return catalog;
}
