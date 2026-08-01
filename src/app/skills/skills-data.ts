import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import skillsCatalog from "~/data/skills-catalog.json";
import {
  SKILLS_CATALOG_KEY,
  type StoredSkillsCatalog,
} from "~/lib/skills-sync";
import type { SkillCard } from "./skills-catalog";

type CatalogSkill = {
  slug: string;
  displayName?: string;
  summary?: string | null;
  description?: string | null;
  topics?: string[];
  tags?: { latest?: string | null };
  stats?: {
    comments?: number;
    downloads?: number;
    installs?: number;
    stars?: number;
    versions?: number;
  };
  latestVersion?: {
    version?: string | null;
    changelog?: string | null;
    license?: string | null;
  };
};

type SkillsCatalogKv = {
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
};

const localizedSummaries: Record<string, string> = {
  "self-improving-agent":
    "把失败、纠错和新发现沉淀成可复用经验，让 Agent 在长期项目里持续变聪明。",
  "skill-vetter":
    "安装第三方 skill 前做安全审查，快速检查权限范围、可疑模式和潜在风险。",
  "self-improving":
    "结合自我反思、主动跟进和记忆整理，适合希望 Agent 长期改进的工作流。",
  gog: "连接 Gmail、Calendar、Drive、Sheets、Docs 等 Google Workspace 工具。",
  "proactive-agent":
    "让 Agent 从被动执行变成主动伙伴，适合定期检查、后续跟进和自动化提醒。",
  "multi-search-engine":
    "聚合多个搜索引擎，支持中文与全球信息源，适合调研、比对和网页检索。",
  github: "通过 GitHub CLI 管理 issue、PR、workflow 和仓库日常协作。",
  weather: "查询当前天气和预报，无需额外 API key，适合日程和出行类任务。",
  notion: "连接 Notion 页面和数据库，用于知识管理、项目记录和内容整理。",
};

const topicLabels: Record<string, string> = {
  "self-improvement": "自我改进",
  "Self Improving": "自我改进",
  Learning: "学习",
  GitHub: "GitHub",
  Permission: "权限",
  Gmail: "Gmail",
  Calendar: "日历",
  Docs: "文档",
  Privacy: "隐私",
};

function localizeTopics(topics: string[]) {
  return topics.slice(0, 4).map((topic) => topicLabels[topic] ?? topic);
}

function toSkillCard(skill: CatalogSkill): SkillCard {
  const slug = skill.slug;

  return {
    slug,
    name: skill.displayName ?? slug,
    sourceSummary: skill.summary ?? undefined,
    summary:
      localizedSummaries[slug] ??
      skill.summary ??
      "来自 ClawHub 的公开 Skill，建议安装前先查看详情和安全状态。",
    description:
      skill.description ??
      skill.summary ??
      "暂无更详细说明，请在使用前检查 Skill 内容和权限范围。",
    topics: localizeTopics(skill.topics ?? []),
    version: skill.tags?.latest ?? skill.latestVersion?.version ?? "latest",
    downloads: skill.stats?.downloads ?? 0,
    installs: skill.stats?.installs ?? 0,
    stars: skill.stats?.stars ?? 0,
    comments: skill.stats?.comments ?? 0,
    versions: skill.stats?.versions ?? 0,
    changelog: skill.latestVersion?.changelog ?? "",
  };
}

const fallbackSkills = (skillsCatalog.items as CatalogSkill[]).map(toSkillCard);

async function readWebsiteCatalog() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const store = (
      env as CloudflareEnv & {
        SKILLS_CATALOG_KV?: SkillsCatalogKv;
      }
    ).SKILLS_CATALOG_KV;
    const catalog = await store?.get<StoredSkillsCatalog>(
      SKILLS_CATALOG_KEY,
      "json",
    );

    if (catalog?.items?.length) {
      return (catalog.items as CatalogSkill[]).map(toSkillCard);
    }
  } catch {
    // Local development and failed KV reads use the build-time catalog.
  }

  return fallbackSkills;
}

export async function getSkills() {
  return readWebsiteCatalog();
}

export async function getSkill(slug: string) {
  const skills = await readWebsiteCatalog();
  return skills.find((item) => item.slug === slug);
}
