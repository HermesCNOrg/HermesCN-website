import type { Locale } from "~/i18n/config";

export type SkillIndexEntry = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  source: string;
  identifier: string;
  chunk: number;
  offset: number;
};

export type SkillCard = SkillIndexEntry & {
  summary: string;
  description: string;
  overview: string;
  tags: string[];
  platforms: string[];
  author: string;
  version: string;
  license: string;
  envVars: string[];
  commands: string[];
  installCmd: string;
  sourceUrl: string;
};

type SkillIndexRow = [
  id: string,
  name: string,
  category: string,
  categoryLabel: string,
  source: string,
  identifier: string,
  chunk: number,
  offset: number,
];

type SnapshotSkill = {
  name?: string;
  description?: string;
  overview?: string;
  category?: string;
  categoryLabel?: string;
  source?: string;
  tags?: string[];
  platforms?: string[];
  author?: string;
  version?: string;
  license?: string;
  envVars?: string[];
  commands?: string[];
  docsPath?: string;
  identifier?: string;
  installCmd?: string;
  sourceUrl?: string;
};

type SkillTranslation = [description: string, overview: string] | null;

let indexRequest: Promise<SkillIndexEntry[]> | undefined;
let assetVersionRequest: Promise<string> | undefined;
const chunkRequests = new Map<number, Promise<SnapshotSkill[]>>();
const translationChunkRequests = new Map<number, Promise<SkillTranslation[]>>();

function nonEmpty(value: string | undefined, fallback: string) {
  if (value) return value;
  return fallback;
}

function getInstallCommand(entry: SkillIndexEntry, skill: SnapshotSkill) {
  if (skill.installCmd) return skill.installCmd;

  const name = skill.name ?? entry.name;
  if (entry.source === "built-in") {
    return `hermes skills install NousResearch/hermes-agent/skills/${entry.category}/${name}`;
  }

  return `hermes skills install official/${entry.category}/${name}`;
}

function fetchJson<T>(url: string, cache: RequestCache = "force-cache") {
  return fetch(url, { cache }).then((response) => {
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    return response.json() as Promise<T>;
  });
}

function loadAssetVersion() {
  assetVersionRequest ??= fetchJson<{
    categoryVersion: number;
    catalogSha256: string;
    translations?: { "zh-Hans"?: { sha256: string } };
  }>("/skills-data/manifest.json", "no-store").then(
    ({ categoryVersion, catalogSha256, translations }) =>
      `${categoryVersion}-${catalogSha256.slice(0, 12)}-${translations?.["zh-Hans"]?.sha256.slice(0, 12) ?? "none"}`,
  );

  return assetVersionRequest;
}

export function loadSkillIndex() {
  indexRequest ??= loadAssetVersion()
    .then((version) =>
      fetchJson<SkillIndexRow[]>(`/skills-data/search-index.json?v=${version}`),
    )
    .then((rows) =>
      rows.map(
        ([
          id,
          name,
          category,
          categoryLabel,
          source,
          identifier,
          chunk,
          offset,
        ]) => ({
          id,
          name,
          category,
          categoryLabel,
          source,
          identifier,
          chunk,
          offset,
        }),
      ),
    );

  return indexRequest;
}

export function loadSkillChunk(chunk: number) {
  let request = chunkRequests.get(chunk);

  if (!request) {
    const file = `skills-${String(chunk).padStart(3, "0")}.json`;
    request = loadAssetVersion()
      .then((version) =>
        fetchJson<SnapshotSkill[]>(`/skills-data/${file}?v=${version}`),
      )
      .catch((error: unknown) => {
        chunkRequests.delete(chunk);
        throw error;
      });
    chunkRequests.set(chunk, request);
  }

  return request;
}

function loadTranslationChunk(chunk: number) {
  let request = translationChunkRequests.get(chunk);

  if (!request) {
    const file = `skills-${String(chunk).padStart(3, "0")}.zh-Hans.json`;
    request = loadAssetVersion()
      .then((version) =>
        fetchJson<SkillTranslation[]>(`/skills-data/${file}?v=${version}`),
      )
      .catch((error: unknown) => {
        translationChunkRequests.delete(chunk);
        throw error;
      });
    translationChunkRequests.set(chunk, request);
  }

  return request;
}

export function toSkillCard(
  entry: SkillIndexEntry,
  skill: SnapshotSkill,
  translation?: SkillTranslation,
): SkillCard {
  const description = translation?.[0] ?? skill.description ?? "";
  const overview = translation?.[1] ?? skill.overview ?? "";
  const docsUrl = skill.docsPath
    ? `https://hermes-agent.nousresearch.com/docs/user-guide/skills/${skill.docsPath}`
    : "";
  return {
    ...entry,
    name: skill.name ?? entry.name,
    summary:
      overview ||
      description ||
      "暂无详细说明，请在使用前检查 Skill 内容和权限范围。",
    description,
    overview,
    tags: Array.isArray(skill.tags) ? skill.tags : [],
    platforms: Array.isArray(skill.platforms) ? skill.platforms : [],
    author: skill.author ?? "",
    version: nonEmpty(skill.version, "latest"),
    license: skill.license ?? "",
    envVars: Array.isArray(skill.envVars) ? skill.envVars : [],
    commands: Array.isArray(skill.commands) ? skill.commands : [],
    installCmd: getInstallCommand(entry, skill),
    sourceUrl: nonEmpty(skill.sourceUrl, docsUrl),
  };
}

export async function loadSkill(entry: SkillIndexEntry, locale: Locale) {
  const [skills, translations] = await Promise.all([
    loadSkillChunk(entry.chunk),
    locale === "zh" ? loadTranslationChunk(entry.chunk) : undefined,
  ]);
  const skill = skills[entry.offset];

  if (!skill) throw new Error(`Skill ${entry.id} is missing from its chunk`);
  return toSkillCard(entry, skill, translations?.[entry.offset]);
}

export async function loadSkillAt(
  id: string,
  chunk: number,
  offset: number,
  locale: Locale,
) {
  const [skills, translations] = await Promise.all([
    loadSkillChunk(chunk),
    locale === "zh" ? loadTranslationChunk(chunk) : undefined,
  ]);
  const skill = skills[offset];

  if (!skill) throw new Error(`Skill ${id} is missing from its chunk`);

  return toSkillCard(
    {
      id,
      name: skill.name ?? id,
      category: skill.category ?? "other",
      categoryLabel: skill.categoryLabel ?? skill.category ?? "Other",
      source: skill.source ?? "unknown",
      identifier: skill.identifier ?? "",
      chunk,
      offset,
    },
    skill,
    translations?.[offset],
  );
}
