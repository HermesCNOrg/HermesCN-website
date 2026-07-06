import { type Metadata } from "next";

import { SkillsCatalog, type SkillCard } from "./skills-catalog";
import skillsCatalog from "~/data/skills-catalog.json";

type ClawHubSkill = {
  slug: string;
  displayName?: string;
  summary?: string | null;
  description?: string | null;
  topics?: string[];
  tags?: { latest?: string };
  stats?: {
    comments?: number;
    downloads?: number;
    installs?: number;
    stars?: number;
    versions?: number;
  };
  latestVersion?: {
    version?: string;
    changelog?: string;
    license?: string | null;
  };
};

type SkillsResponse = {
  items?: ClawHubSkill[];
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

const fallbackSkills: SkillCard[] = [
  {
    slug: "self-improving-agent",
    name: "self-improving agent",
    summary: "把失败、纠错和新发现沉淀成可复用经验，让 Agent 在长期项目里持续变聪明。",
    description:
      "适合长期项目、反复迭代的开发任务，以及需要把经验沉淀成规则的个人工作流。",
    topics: ["自我改进"],
    version: "4.0.1",
    downloads: 465794,
    installs: 18337,
    stars: 3888,
    comments: 53,
    versions: 38,
    changelog: "更新了自动错误检测、模式去重和复盘提醒。",
  },
  {
    slug: "skill-vetter",
    name: "Skill Vetter",
    summary: "安装第三方 skill 前做安全审查，快速检查权限范围、可疑模式和潜在风险。",
    description:
      "适合在安装 ClawHub、GitHub 或其他来源的 skill 前进行快速安全复核。",
    topics: ["安全", "权限"],
    version: "1.0.0",
    downloads: 261747,
    installs: 12012,
    stars: 1251,
    comments: 0,
    versions: 1,
    changelog: "Initial release - Security-first skill vetting for AI agents",
  },
  {
    slug: "multi-search-engine",
    name: "Multi Search Engine",
    summary: "聚合多个搜索引擎，支持中文与全球信息源，适合调研、比对和网页检索。",
    description:
      "支持多搜索引擎、时间过滤、站内搜索和隐私搜索，适合研究与资料收集。",
    topics: ["搜索", "隐私"],
    version: "2.1.3",
    downloads: 155715,
    installs: 5482,
    stars: 744,
    comments: 6,
    versions: 7,
    changelog: "更新 cookie 处理和搜索执行策略，减少不必要的请求。",
  },
];

export const metadata: Metadata = {
  title: "Skills | HermesCN 中文社区",
  description: "发现、筛选和查看适合 Hermes Agent 工作流的 Skills。",
};

function localizeTopics(topics: string[]) {
  return topics.slice(0, 4).map((topic) => topicLabels[topic] ?? topic);
}

function toSkillCard(skill: ClawHubSkill): SkillCard {
  const slug = skill.slug;

  return {
    slug,
    name: skill.displayName ?? slug,
    summary:
      localizedSummaries[slug] ??
      skill.summary ??
      "来自 ClawHub 的公开 Skill，建议安装前先查看详情和安全状态。",
    description:
      skill.description ??
      skill.summary ??
      "暂无更详细说明，请打开 ClawHub 原始页面查看作者、权限和扫描状态。",
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

function getSkills(): SkillCard[] {
  const data = skillsCatalog as SkillsResponse;
  const skills = data.items?.map(toSkillCard) ?? [];

  return skills.length > 0 ? skills : fallbackSkills;
}

export default function SkillsPage() {
  const skills = getSkills();

  return (
    <main className="min-h-screen bg-[#fbfaff] pt-40 text-[#111111]">
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:pb-14">
        <div className="max-w-4xl">
          <p className="text-sm font-medium tracking-[0.18em] text-[#2202f2] uppercase">
            Skills
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold text-[#111111] sm:text-6xl">
            找到适合你工作流的 Agent Skills
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#4b4b4b] sm:text-lg">
            浏览可复用的 Agent 能力包，按用途筛选，查看说明、版本、热度和更新记录，再决定是否安装到自己的 Hermes 工作流里。
          </p>
        </div>
      </section>

      <SkillsCatalog skills={skills} />
    </main>
  );
}
