"use client";

import { ScrollShadow } from "@heroui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MarkdownRenderer } from "~/components/markdown-renderer";
import { SkillDrawer } from "./skill-drawer";
import {
  loadSkill,
  loadSkillIndex,
  type SkillCard,
  type SkillIndexEntry,
} from "./skills-static-data";

const INITIAL_VISIBLE_SKILLS = 48;
const VISIBLE_SKILLS_STEP = 48;

export function SkillsCatalog() {
  const [skills, setSkills] = useState<SkillIndexEntry[]>([]);
  const [details, setDetails] = useState<Map<string, SkillCard>>(new Map());
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState<SkillCard | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_SKILLS);

  useEffect(() => {
    let active = true;

    void loadSkillIndex().then(
      (items) => {
        if (active) setSkills(items);
      },
      () => {
        if (active) setLoadError(true);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();

    for (const skill of skills) {
      const current = counts.get(skill.category);
      counts.set(skill.category, {
        label: skill.categoryLabel,
        count: (current?.count ?? 0) + 1,
      });
    }

    return Array.from(counts.entries())
      .map(([value, item]) => ({ value, ...item }))
      .sort((a, b) => {
        if (a.value === "other") return 1;
        if (b.value === "other") return -1;
        return b.count - a.count;
      });
  }, [skills]);

  const sources = useMemo(() => {
    const counts = new Map<string, number>();

    for (const skill of skills) {
      counts.set(skill.source, (counts.get(skill.source) ?? 0) + 1);
    }

    return Array.from(counts, ([value, count]) => ({ value, count })).sort(
      (a, b) => b.count - a.count,
    );
  }, [skills]);

  const filteredSkills = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const filtered = skills.filter((skill) => {
      if (selectedCategory !== "all" && skill.category !== selectedCategory) {
        return false;
      }
      if (selectedSource !== "all" && skill.source !== selectedSource) {
        return false;
      }

      if (!keyword) return true;
      return `${skill.name} ${skill.categoryLabel} ${skill.source} ${skill.identifier}`
        .toLowerCase()
        .includes(keyword);
    });

    return filtered;
  }, [query, selectedCategory, selectedSource, skills]);

  const visibleSkills = filteredSkills.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_SKILLS);
  }, [query, selectedCategory, selectedSource]);

  useEffect(() => {
    let active = true;
    const missing = visibleSkills.filter((skill) => !details.has(skill.id));

    if (missing.length === 0) return;

    void Promise.all(missing.map(loadSkill)).then(
      (loaded) => {
        if (!active) return;
        setDetails((current) => {
          const next = new Map(current);
          for (const skill of loaded) next.set(skill.id, skill);
          return next;
        });
      },
      () => {
        if (active) setLoadError(true);
      },
    );

    return () => {
      active = false;
    };
  }, [details, visibleSkills]);

  const hasActiveFilters =
    selectedCategory !== "all" || selectedSource !== "all" || Boolean(query);

  return (
    <section className="bg-white text-[#0000f2]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#0000f2]/65">02 · Catalog</p>
            <h2 className="mt-3 text-3xl leading-tight font-normal sm:text-5xl">
              Skills 目录
            </h2>
            <p className="mt-3 text-sm text-[#0000f2]/65">
              {skills.length > 0
                ? `共匹配 ${filteredSkills.length.toLocaleString("zh-CN")} 个`
                : loadError
                  ? "目录加载失败"
                  : "正在加载目录"}
            </p>
          </div>

          {hasActiveFilters ? (
            <button
              className="border border-[#0000f2] px-4 py-2 text-sm font-medium transition hover:bg-[#0000f2] hover:text-white"
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSource("all");
                setQuery("");
              }}
            >
              清空筛选
            </button>
          ) : null}
        </div>

        <div className="py-6">
          <input
            aria-label="搜索 Skills"
            className="h-12 w-full border border-[#0000f2]/15 px-4 text-sm outline-none placeholder:text-[#0000f2]/38 hover:border-[#0000f2] focus:border-[#0000f2]"
            placeholder="搜索名称、分类或来源"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="mt-6 grid gap-6">
            <div>
              <p className="text-sm font-medium">分类</p>
              <ScrollShadow
                hideScrollBar
                className="mt-3 flex max-h-40 flex-wrap content-start gap-2"
                orientation="vertical"
                size={24}
              >
                <button
                  className={`border px-3 py-1.5 text-sm transition ${selectedCategory === "all" ? "border-[#0000f2] bg-[#0000f2] text-white" : "border-[#0000f2]/15"}`}
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                >
                  全部 {skills.length.toLocaleString("zh-CN")}
                </button>
                {categories.map((category) => (
                  <button
                    className={`border px-3 py-1.5 text-sm transition ${selectedCategory === category.value ? "border-[#0000f2] bg-[#0000f2] text-white" : "border-[#0000f2]/15 hover:border-[#0000f2]"}`}
                    key={category.value}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label} {category.count.toLocaleString("zh-CN")}
                  </button>
                ))}
              </ScrollShadow>
            </div>

            <div>
              <p className="text-sm font-medium">来源</p>
              <ScrollShadow
                hideScrollBar
                className="mt-3 flex max-h-32 flex-wrap content-start gap-2"
                orientation="vertical"
                size={24}
              >
                <button
                  className={`border px-3 py-1.5 text-sm transition ${selectedSource === "all" ? "border-[#0000f2] bg-[#0000f2] text-white" : "border-[#0000f2]/15"}`}
                  type="button"
                  onClick={() => setSelectedSource("all")}
                >
                  全部 {skills.length.toLocaleString("zh-CN")}
                </button>
                {sources.map((source) => (
                  <button
                    className={`border px-3 py-1.5 text-sm transition ${selectedSource === source.value ? "border-[#0000f2] bg-[#0000f2] text-white" : "border-[#0000f2]/15 hover:border-[#0000f2]"}`}
                    key={source.value}
                    type="button"
                    onClick={() => setSelectedSource(source.value)}
                  >
                    {source.value} {source.count.toLocaleString("zh-CN")}
                  </button>
                ))}
              </ScrollShadow>
            </div>
          </div>
        </div>

        <div className="mt-10 grid border-t border-l border-[#0000f2]/15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleSkills.map((entry) => {
            const skill = details.get(entry.id);
            const href = `/skills/${entry.id}?chunk=${entry.chunk}&offset=${entry.offset}`;

            return (
              <article
                className="group relative flex min-h-[17rem] flex-col border-r border-b border-[#0000f2]/15 p-5 transition hover:bg-[#0000f2] hover:text-white"
                key={entry.id}
              >
                <Link
                  aria-label={`查看 ${entry.name} 详情`}
                  className="absolute inset-0"
                  href={href}
                  onClick={(event) => {
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    ) {
                      return;
                    }

                    event.preventDefault();
                    if (skill) {
                      setSelectedSkill(skill);
                    } else {
                      void loadSkill(entry).then(setSelectedSkill, () => {
                        setLoadError(true);
                      });
                    }
                  }}
                />
                <div className="pointer-events-none relative flex items-start justify-between gap-4">
                  <div>
                    <h3 className="line-clamp-2 text-lg leading-6 font-normal">
                      {entry.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#0000f2]/55 group-hover:text-white/65">
                      {entry.source} · {entry.categoryLabel}
                    </p>
                  </div>
                  <i aria-hidden="true" className="ri-arrow-right-up-line" />
                </div>

                <MarkdownRenderer
                  className="pointer-events-none relative mt-4 max-h-[7.5rem] flex-1 overflow-hidden text-sm leading-6 text-[#0000f2]/65 group-hover:text-white/75 [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10"
                  content={skill?.summary ?? "正在加载 Skill 说明…"}
                />

                <div className="pointer-events-none relative mt-4 flex flex-wrap gap-2">
                  {(skill?.tags.slice(0, 3) ?? [entry.categoryLabel]).map(
                    (tag) => (
                      <span
                        className="border border-[#0000f2]/15 px-2.5 py-1 text-xs group-hover:border-white/25"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {visibleCount < filteredSkills.length ? (
          <div className="mt-10 flex justify-center">
            <button
              className="border border-[#0000f2] px-6 py-3 text-sm font-medium transition hover:bg-[#0000f2] hover:text-white"
              type="button"
              onClick={() =>
                setVisibleCount((current) => current + VISIBLE_SKILLS_STEP)
              }
            >
              加载更多（已显示 {visibleSkills.length.toLocaleString("zh-CN")} /{" "}
              {filteredSkills.length.toLocaleString("zh-CN")}）
            </button>
          </div>
        ) : null}
      </div>

      <SkillDrawer
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </section>
  );
}
