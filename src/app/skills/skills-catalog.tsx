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

    return [{ count: skills.length, label: "全部" }, ...topics];
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
    <section className="bg-white text-[#0000f2]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#0000f2]/65">02 · Catalog</p>
            <h2 className="mt-3 text-3xl leading-tight font-normal text-[#0000f2] sm:text-5xl">
              Skills 目录
            </h2>
            <p className="mt-3 text-sm text-[#0000f2]/65">
              共匹配 {filteredSkills.length} 个
            </p>
          </div>

          {hasActiveFilters ? (
            <button
              className="border border-[#0000f2] bg-white px-4 py-2 text-sm font-medium text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
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

        <div className="mt-8 border-y border-[#0000f2]/15 py-6">
          <input
            aria-label="搜索 Skills"
            className="h-12 w-full border border-[#0000f2]/15 bg-white px-4 text-sm text-[#0000f2] shadow-none transition outline-none placeholder:text-[#0000f2]/38 hover:border-[#0000f2] focus:border-[#0000f2]"
            placeholder="搜索名称、用途或分类"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="mt-6 grid gap-6">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-[#0000f2]">方向</p>
                <span className="h-px flex-1 bg-[#0000f2]/15" />
              </div>
              <div className="relative mt-3 max-h-40 overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-white to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-white to-transparent" />
                <div className="scrollbar-hide max-h-40 [scrollbar-width:none] overflow-y-auto pt-4 pr-1 pb-3 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex flex-wrap gap-2">
                    {topicOptions.map((topic) => {
                      const active =
                        topic.label === "全部"
                          ? selectedTopics.size === 0
                          : selectedTopics.has(topic.label);

                      return (
                        <button
                          aria-pressed={active}
                          className={`group border px-3 py-1.5 text-sm transition ${
                            active
                              ? "border-[#0000f2] bg-[#0000f2] text-white"
                              : "border-[#0000f2]/15 bg-white text-[#0000f2]/75 hover:border-[#0000f2] hover:bg-[#0000f2] hover:text-white"
                          }`}
                          key={topic.label}
                          type="button"
                          onClick={() => toggleTopic(topic.label)}
                        >
                          {topic.label}
                          <span
                            className={`ml-1 text-xs transition ${
                              active
                                ? "text-white/75"
                                : "text-[#0000f2]/45 group-hover:text-white/70"
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
                <p className="text-sm font-medium text-[#0000f2]">排序</p>
                <span className="h-px flex-1 bg-[#0000f2]/15" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const active = sortBy === option.value;

                  return (
                    <button
                      aria-pressed={active}
                      className={`border px-3 py-1.5 text-sm transition ${
                        active
                          ? "border-[#0000f2] bg-[#0000f2] text-white"
                          : "border-[#0000f2]/15 bg-white text-[#0000f2]/75 hover:border-[#0000f2] hover:bg-[#0000f2] hover:text-white"
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

        <div className="mt-10 grid gap-0 border-t border-l border-[#0000f2]/15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSkills.map((skill) => (
            <a
              className="group flex min-h-[17rem] flex-col border-r border-b border-[#0000f2]/15 bg-white p-5 text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
              href={getSkillUrl(skill)}
              key={skill.slug}
              rel="noreferrer"
              target="_blank"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="line-clamp-2 origin-left text-lg leading-6 font-normal text-current transition-transform duration-200 group-hover:scale-[1.03]">
                    {skill.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#0000f2]/55 transition group-hover:text-white/65">
                    {skill.slug} · v{skill.version}
                  </p>
                </div>
                <span className="grid h-8 w-8 shrink-0 origin-right place-items-center border border-[#0000f2]/15 text-[#0000f2] transition-transform duration-200 group-hover:scale-125 group-hover:border-white/35 group-hover:text-white">
                  <i aria-hidden="true" className="ri-arrow-right-up-line" />
                </span>
              </div>

              <p className="mt-4 line-clamp-4 flex-1 text-sm leading-6 text-[#0000f2]/65 transition group-hover:text-white/75">
                {skill.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(skill.topics.length > 0 ? skill.topics : ["Skill"]).map(
                  (topic) => (
                    <span
                      className="border border-[#0000f2]/15 px-2.5 py-1 text-xs text-[#0000f2]/65 transition group-hover:border-white/25 group-hover:text-white/75"
                      key={topic}
                    >
                      {topic}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#0000f2]/15 pt-4 text-xs text-[#0000f2]/55 transition group-hover:border-white/25 group-hover:text-white/65">
                <span>{formatCount(skill.stars)} stars</span>
                <span>{formatCount(skill.downloads)} downloads</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
