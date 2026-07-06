"use client";

import { useMemo, useState } from "react";

export type SkillCard = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  topics: string[];
  version: string;
  downloads: number;
  installs: number;
  stars: number;
  comments: number;
  versions: number;
  changelog: string;
};

const sortOptions = [
  { label: "推荐", value: "recommended" },
  { label: "Stars", value: "stars" },
  { label: "Downloads", value: "downloads" },
  { label: "Installs", value: "installs" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

function formatCount(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}万`;
  }

  return value.toLocaleString("zh-CN");
}

function getSkillUrl(skill: SkillCard) {
  return `https://clawhub.ai/skills?q=${encodeURIComponent(skill.slug)}`;
}

export function SkillsCatalog({ skills }: { skills: SkillCard[] }) {
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortValue>("recommended");

  const topicOptions = useMemo(() => {
    const counts = new Map<string, number>();

    for (const skill of skills) {
      for (const topic of skill.topics) {
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      }
    }

    const topics = Array.from(counts.entries())
      .map(([label, count]) => ({ count, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "zh-CN"));

    return [
      { count: skills.length, label: "全部" },
      ...topics,
    ];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const filtered = skills.filter((skill) => {
      const matchesTopic =
        selectedTopics.size === 0 ||
        skill.topics.some((topic) => selectedTopics.has(topic));
      const searchable =
        `${skill.name} ${skill.slug} ${skill.summary} ${skill.description} ${skill.topics.join(" ")}`.toLowerCase();
      const matchesQuery = !keyword || searchable.includes(keyword);

      return matchesTopic && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "installs") return b.installs - a.installs;

      return 0;
    });
  }, [query, selectedTopics, skills, sortBy]);

  const hasActiveFilters =
    selectedTopics.size > 0 || sortBy !== "recommended" || Boolean(query);

  function toggleTopic(topic: string) {
    setSelectedTopics((current) => {
      if (topic === "全部") {
        return new Set();
      }

      const next = new Set(current);

      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }

      return next;
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="py-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">
            Skills 目录
            <span className="ml-2 text-sm font-normal text-[#5f6270]">
              （共匹配 {filteredSkills.length} 个）
            </span>
          </h2>

          {hasActiveFilters ? (
            <button
              className="rounded-full border border-[#2202f2] bg-white px-4 py-2 text-sm font-medium text-[#2202f2] transition hover:bg-[#f1efff]"
              type="button"
              onClick={() => {
                setSelectedTopics(new Set());
                setSortBy("recommended");
                setQuery("");
              }}
            >
              清空筛选
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6">
          <input
            aria-label="搜索 Skills"
            className="h-12 rounded-md border border-transparent bg-white px-4 text-sm shadow-none outline-none transition placeholder:text-[#8a879a] hover:border-[#2202f2] focus:border-[#2202f2] focus:ring-4 focus:ring-[#2202f2]/10"
            placeholder="搜索名称、用途或分类"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="grid gap-5">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-[#2f3140]">方向</p>
                <span className="h-px flex-1 bg-[#ddd8ff]" />
              </div>
              <div className="relative mt-3 max-h-40 overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-[#fbfaff] to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-[#fbfaff] to-transparent" />
                <div className="scrollbar-hide max-h-40 overflow-y-auto pr-1 pt-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex flex-wrap gap-2">
                    {topicOptions.map((topic) => {
                      const active =
                        topic.label === "全部"
                          ? selectedTopics.size === 0
                          : selectedTopics.has(topic.label);

                      return (
                        <button
                          aria-pressed={active}
                          className={`rounded-full border px-3 py-1.5 text-sm transition ${
                            active
                              ? "border-[#2202f2] bg-[#2202f2] text-white"
                              : "border-transparent bg-white text-[#4b4b4b] hover:border-[#2202f2] hover:bg-[#f1efff]"
                          }`}
                          key={topic.label}
                          type="button"
                          onClick={() => toggleTopic(topic.label)}
                        >
                          {topic.label}
                          <span
                            className={`ml-1 text-xs ${
                              active ? "text-white/75" : "text-[#8a879a]"
                            }`}
                          >
                            {topic.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-[#2f3140]">排序</p>
                <span className="h-px flex-1 bg-[#ddd8ff]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const active = sortBy === option.value;

                  return (
                    <button
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        active
                          ? "border-[#2202f2] bg-[#2202f2] text-white"
                          : "border-transparent bg-white text-[#4b4b4b] hover:border-[#2202f2] hover:bg-[#f1efff]"
                      }`}
                      key={option.value}
                      type="button"
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSkills.map((skill) => (
          <a
            className="group flex min-h-[17rem] flex-col rounded-lg border border-[#e6e3ff] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#2202f2]/40 hover:shadow-[0_16px_44px_rgba(34,2,242,0.08)]"
            href={getSkillUrl(skill)}
            key={skill.slug}
            rel="noreferrer"
            target="_blank"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="line-clamp-2 text-lg leading-6 font-semibold text-[#111111] transition group-hover:text-[#2202f2]">
                  {skill.name}
                </h2>
                <p className="mt-1 text-xs text-[#6b6d78]">
                  {skill.slug} · v{skill.version}
                </p>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#ded8ff] text-[#2202f2] transition group-hover:bg-[#f4f2ff]">
                <i aria-hidden="true" className="ri-arrow-right-up-line" />
              </span>
            </div>

            <p className="mt-4 line-clamp-4 flex-1 text-sm leading-6 text-[#4b4b4b]">
              {skill.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(skill.topics.length > 0 ? skill.topics : ["Skill"]).map(
                (topic) => (
                  <span
                    className="rounded-full bg-[#f7f6ff] px-2.5 py-1 text-xs text-[#4b4770]"
                    key={topic}
                  >
                    {topic}
                  </span>
                ),
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#f0eeff] pt-4 text-xs text-[#5f6270]">
              <span>{formatCount(skill.stars)} stars</span>
              <span>{formatCount(skill.downloads)} downloads</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
