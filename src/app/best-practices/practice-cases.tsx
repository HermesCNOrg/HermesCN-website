"use client";

import { Button, Input } from "@heroui/react";
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
    <div className="min-h-screen bg-white text-[#111111]">
      <section className="border-b border-[#ece9ff] bg-white">
        <div className="mx-auto flex min-h-[35rem] max-w-7xl items-end px-5 pt-32 pb-16 sm:px-8">
          <div className="max-w-4xl">
            <p className="text-sm tracking-[0.2em] text-[#2202f2] uppercase">
              Practice Cases
            </p>
            <h1 className="mt-5 text-5xl leading-[1.12] font-semibold tracking-tight sm:text-6xl">
              实践案例
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b4b4b]">
              汇集社区真实故事与公开使用案例，覆盖工作流、个人助理、集成连接、创作生产和企业协作等场景，看看人们实际让
              Hermes Agent 做成了什么。
            </p>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-lg border border-[#e6e3ff] bg-[#fbfaff] p-4">
                <p className="text-3xl font-semibold text-[#2202f2]">
                  {allStories.length}
                </p>
                <p className="mt-1 text-sm text-[#5f6270]">stories</p>
              </div>
              <div className="rounded-lg border border-[#e6e3ff] bg-[#fbfaff] p-4">
                <p className="text-3xl font-semibold text-[#2202f2]">
                  {categories.length}
                </p>
                <p className="mt-1 text-sm text-[#5f6270]">categories</p>
              </div>
              <div className="rounded-lg border border-[#e6e3ff] bg-[#fbfaff] p-4">
                <p className="text-3xl font-semibold text-[#2202f2]">
                  {sources.length}
                </p>
                <p className="mt-1 text-sm text-[#5f6270]">sources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f7ff]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              案例库
              <span className="ml-2 text-sm font-normal text-[#5f6270]">
                （共匹配 {filteredStories.length} 条）
              </span>
            </h2>

            {hasActiveFilters && (
              <Button
                className="rounded-full border border-[#2202f2] bg-white px-4 py-2 text-sm font-medium text-[#2202f2] transition hover:bg-[#f1efff]"
                onClick={() => {
                  setSelectedCategories(new Set());
                  setSelectedSources(new Set());
                  setQuery("");
                }}
                type="button"
              >
                清空筛选
              </Button>
            )}
          </div>

          <div className="mt-6 grid gap-6">
            <Input
              aria-label="搜索案例"
              className="h-12 rounded-md border border-transparent bg-white text-sm shadow-none transition outline-none focus-within:border-[#2202f2] focus-within:ring-4 focus-within:ring-[#2202f2]/10 hover:border-[#2202f2]"
              fullWidth
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索场景、作者或关键词"
              type="search"
              value={query}
            />

            <div className="grid gap-5">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-[#2f3140]">方向</p>
                  <span className="h-px flex-1 bg-[#ddd8ff]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((item) => {
                    const active = selectedCategories.has(item);

                    return (
                      <button
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-[#2202f2] bg-[#2202f2] text-white"
                            : "border-transparent bg-white text-[#4b4b4b] hover:border-[#2202f2] hover:bg-[#f1efff]"
                        }`}
                        key={item}
                        onClick={() =>
                          toggleFilter(item, setSelectedCategories)
                        }
                        type="button"
                      >
                        {getLabel(categoryLabels, item)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-[#2f3140]">来源</p>
                  <span className="h-px flex-1 bg-[#ddd8ff]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sources.map((item) => {
                    const active = selectedSources.has(item);

                    return (
                      <button
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-[#2202f2] bg-[#2202f2] text-white"
                            : "border-transparent bg-white text-[#4b4b4b] hover:border-[#2202f2] hover:bg-[#f1efff]"
                        }`}
                        key={item}
                        onClick={() => toggleFilter(item, setSelectedSources)}
                        type="button"
                      >
                        {getLabel(sourceLabels, item)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredStories.map((story) => (
              <a
                className="group flex min-h-[19rem] flex-col rounded-lg border border-[#e3dfff] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#2202f2]/40 hover:shadow-[0_18px_50px_rgba(34,2,242,0.08)]"
                href={story.url}
                key={story.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f1efff] px-3 py-1 text-xs font-medium text-[#2202f2]">
                      {getLabel(categoryLabels, story.category)}
                    </span>
                    <span className="rounded-full bg-[#f8f7ff] px-3 py-1 text-xs text-[#5f6270]">
                      {getLabel(sourceLabels, story.source)}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-[#777985]">
                    {formatDate(story.date)}
                  </span>
                </div>

                <h3 className="mt-4 text-lg leading-7 font-semibold transition group-hover:text-[#2202f2] group-hover:underline group-hover:decoration-[#2202f2] group-hover:underline-offset-4">
                  {story.headline}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#4b4b4b]">
                  {story.quote}
                </p>

                <p className="mt-auto pt-5 text-xs text-[#777985]">
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
