"use client";

import { type Dispatch, type SetStateAction } from "react";
import { useMemo, useState } from "react";

import stories from "~/data/user-stories.json";

type Story = {
  id: string;
  source: string;
  author: string;
  url: string;
  date: string;
  category: string;
  headline: string;
  quote: string;
  size: "sm" | "md" | "lg";
};

const allStories = stories as Story[];

const categoryLabels: Record<string, string> = {
  "dev-workflow": "开发工作流",
  "personal-assistant": "个人助理",
  integrations: "集成连接",
  meta: "生态观察",
  creative: "创作生产",
  "business-ops": "业务运营",
  "cost-optimization": "成本优化",
  "content-creation": "内容创作",
  research: "研究分析",
  enterprise: "企业协作",
  privacy: "隐私与自托管",
  messaging: "消息平台",
  general: "通用案例",
  trading: "交易与市场",
  marketing: "营销增长",
};

const sourceLabels: Record<string, string> = {
  blog: "博客",
  discord: "Discord",
  github: "GitHub",
  gist: "Gist",
  hn: "Hacker News",
  linkedin: "LinkedIn",
  podcast: "Podcast",
  producthunt: "Product Hunt",
  reddit: "Reddit",
  x: "X",
  youtube: "YouTube",
};

function getLabel(map: Record<string, string>, value: string) {
  return map[value] ?? value;
}

function formatDate(value: string) {
  if (!value) return "社区记录";

  return value;
}

export function PracticeCases() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(),
  );
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () =>
      Array.from(new Set(allStories.map((story) => story.category))).sort(
        (a, b) =>
          getLabel(categoryLabels, a).localeCompare(
            getLabel(categoryLabels, b),
            "zh-CN",
          ),
      ),
    [],
  );

  const sources = useMemo(
    () =>
      Array.from(new Set(allStories.map((story) => story.source))).sort(
        (a, b) =>
          getLabel(sourceLabels, a).localeCompare(
            getLabel(sourceLabels, b),
            "zh-CN",
          ),
      ),
    [],
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const story of allStories) {
      counts.set(story.category, (counts.get(story.category) ?? 0) + 1);
    }

    return counts;
  }, []);

  const sourceCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const story of allStories) {
      counts.set(story.source, (counts.get(story.source) ?? 0) + 1);
    }

    return counts;
  }, []);

  const filteredStories = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return allStories.filter((story) => {
      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(story.category);
      const matchesSource =
        selectedSources.size === 0 || selectedSources.has(story.source);
      const searchable =
        `${story.headline} ${story.quote} ${story.author} ${story.source}`.toLowerCase();
      const matchesQuery = !keyword || searchable.includes(keyword);

      return matchesCategory && matchesSource && matchesQuery;
    });
  }, [selectedCategories, selectedSources, query]);

  const hasActiveFilters =
    selectedCategories.size > 0 || selectedSources.size > 0 || Boolean(query);

  function toggleFilter(
    value: string,
    setter: Dispatch<SetStateAction<Set<string>>>,
  ) {
    setter((current) => {
      const next = new Set(current);

      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#0000f2] text-[#f5f5f5]">
      <section className="border-b border-[#f5f5f5]/20 bg-[#0000f2]">
        <div className="mx-auto max-w-7xl px-5 pt-32 pb-16 sm:px-8">
          <div className="max-w-4xl">
            <p className="text-sm text-[#d8dcff]">01 · Practice Cases</p>
            <h1 className="mt-5 text-5xl leading-[1.02] font-normal text-[#f5f5f5] sm:text-6xl">
              实践案例
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d8dcff]">
              汇集社区真实故事与公开使用案例，覆盖工作流、个人助理、集成连接、创作生产和企业协作等场景，看看人们实际让
              Hermes Agent 做成了什么。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-[#0000f2]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[#0000f2]/65">02 · Library</p>
              <h2 className="mt-3 text-3xl leading-tight font-normal text-[#0000f2] sm:text-5xl">
                案例库
              </h2>
              <p className="mt-3 text-sm text-[#0000f2]/65">
                共匹配 {filteredStories.length} 条
              </p>
            </div>

            {hasActiveFilters && (
              <button
                className="border border-[#0000f2] bg-white px-4 py-2 text-sm font-medium text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
                onClick={() => {
                  setSelectedCategories(new Set());
                  setSelectedSources(new Set());
                  setQuery("");
                }}
                type="button"
              >
                清空筛选
              </button>
            )}
          </div>

          <div className="mt-8 border-y border-[#0000f2]/15 py-6">
            <input
              aria-label="搜索案例"
              className="h-12 w-full border border-[#0000f2]/15 bg-white px-4 text-sm text-[#0000f2] shadow-none transition outline-none placeholder:text-[#0000f2]/38 hover:border-[#0000f2] focus:border-[#0000f2]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索场景、作者或关键词"
              type="search"
              value={query}
            />

            <div className="mt-6 grid gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-[#0000f2]">方向</p>
                  <span className="h-px flex-1 bg-[#0000f2]/15" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((item) => {
                    const active = selectedCategories.has(item);

                    return (
                      <button
                        aria-pressed={active}
                        className={`group border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-[#0000f2] bg-[#0000f2] text-white"
                            : "border-[#0000f2]/15 bg-white text-[#0000f2]/75 hover:border-[#0000f2] hover:bg-[#0000f2] hover:text-white"
                        }`}
                        key={item}
                        onClick={() =>
                          toggleFilter(item, setSelectedCategories)
                        }
                        type="button"
                      >
                        {getLabel(categoryLabels, item)}
                        <span
                          className={`ml-1 text-xs transition ${
                            active
                              ? "text-white/75"
                              : "text-[#0000f2]/45 group-hover:text-white/70"
                          }`}
                        >
                          {categoryCounts.get(item) ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-[#0000f2]">来源</p>
                  <span className="h-px flex-1 bg-[#0000f2]/15" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sources.map((item) => {
                    const active = selectedSources.has(item);

                    return (
                      <button
                        aria-pressed={active}
                        className={`group border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-[#0000f2] bg-[#0000f2] text-white"
                            : "border-[#0000f2]/15 bg-white text-[#0000f2]/75 hover:border-[#0000f2] hover:bg-[#0000f2] hover:text-white"
                        }`}
                        key={item}
                        onClick={() => toggleFilter(item, setSelectedSources)}
                        type="button"
                      >
                        {getLabel(sourceLabels, item)}
                        <span
                          className={`ml-1 text-xs transition ${
                            active
                              ? "text-white/75"
                              : "text-[#0000f2]/45 group-hover:text-white/70"
                          }`}
                        >
                          {sourceCounts.get(item) ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-0 border-t border-l border-[#0000f2]/15 md:grid-cols-2 xl:grid-cols-3">
            {filteredStories.map((story) => (
              <a
                className="group flex min-h-[19rem] flex-col border-r border-b border-[#0000f2]/15 bg-white p-5 text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
                href={story.url}
                key={story.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-[#0000f2]/15 px-3 py-1 text-xs font-medium text-[#0000f2]/75 transition group-hover:border-white/25 group-hover:text-white/75">
                      {getLabel(categoryLabels, story.category)}
                    </span>
                    <span className="border border-[#0000f2]/15 px-3 py-1 text-xs text-[#0000f2]/55 transition group-hover:border-white/25 group-hover:text-white/65">
                      {getLabel(sourceLabels, story.source)}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-[#0000f2]/55 transition group-hover:text-white/65">
                    {formatDate(story.date)}
                  </span>
                </div>

                <h3 className="mt-4 origin-left text-lg leading-7 font-normal text-current transition-transform duration-200 group-hover:scale-[1.03]">
                  {story.headline}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#0000f2]/65 transition group-hover:text-white/75">
                  {story.quote}
                </p>

                <p className="mt-auto pt-5 text-xs text-[#0000f2]/55 transition group-hover:text-white/65">
                  {story.author}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
