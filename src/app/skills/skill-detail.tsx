"use client";

import { Skeleton } from "@heroui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MarkdownRenderer } from "~/components/markdown-renderer";
import type { SkillCard } from "./skills-catalog";

type SkillSource = {
  clawHubUrl: string;
  description?: string;
  ownerHandle: string;
};

function formatCount(value: number) {
  return value.toLocaleString("zh-CN");
}

const metrics = [
  { key: "downloads", label: "Downloads" },
  { key: "stars", label: "Stars" },
  { key: "installs", label: "Installs" },
  { key: "versions", label: "Versions" },
] as const;

export function SkillDetail({
  mode = "page",
  skill,
}: {
  mode?: "drawer" | "page";
  skill: SkillCard;
}) {
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<SkillSource | null>();
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSource() {
      setSource(undefined);

      try {
        const response = await fetch(
          `/api/skills/${encodeURIComponent(skill.slug)}`,
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Skill detail returned ${response.status}`);
        }

        const detail = (await response.json()) as SkillSource;

        if (!detail.ownerHandle || !detail.clawHubUrl) {
          throw new Error("Skill source unavailable");
        }

        setSource({
          ownerHandle: detail.ownerHandle,
          description: detail.description,
          clawHubUrl: detail.clawHubUrl,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSource(null);
      }
    }

    void loadSource();

    return () => controller.abort();
  }, [skill.slug]);

  useEffect(
    () => () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  const installPrompt = source
    ? `请帮我在当前 Hermes 环境安装这个 ClawHub Skill：
@${source.ownerHandle}/${skill.slug}
来源：${source.clawHubUrl}

安装前请先检查 Skill 内容和权限，确认安全后再安装。`
    : null;
  const sourceUrl =
    source?.clawHubUrl ??
    `https://clawhub.ai/skills?q=${encodeURIComponent(skill.slug)}`;

  return (
    <article
      className={mode === "page" ? "mx-auto max-w-5xl px-5 sm:px-8" : ""}
    >
      <div
        className={
          mode === "page" ? "py-14" : "flex min-h-full flex-col p-6 sm:p-8"
        }
      >
        {mode === "page" ? (
          <Link
            className="inline-flex items-center gap-2 text-sm text-[#0000f2]/65 transition hover:text-[#0000f2]"
            href="/skills"
          >
            <i aria-hidden="true" className="ri-arrow-left-line" />
            返回 Skills
          </Link>
        ) : null}

        <header className={mode === "page" ? "mt-10" : ""}>
          <div className="flex min-h-5 items-center gap-2 text-sm text-[#0000f2]/55">
            {source === undefined ? (
              <Skeleton
                aria-label="正在加载作者信息"
                className="h-4 w-24 rounded-none bg-[#0000f2]/10"
              />
            ) : source ? (
              <span>@{source.ownerHandle} ·</span>
            ) : null}
            <span>
              {skill.slug} · v{skill.version}
            </span>
          </div>
          <h1
            className={
              mode === "page"
                ? "mt-4 max-w-4xl text-5xl leading-[1.02] font-normal text-[#0000f2] sm:text-6xl"
                : "mt-3 text-3xl leading-tight font-normal text-[#0000f2] sm:text-4xl"
            }
          >
            {skill.name}
          </h1>
        </header>

        <section className="mt-8">
          <p className="text-sm leading-6 text-[#0000f2]/62">
            复制下面的提示词，发送给 Hermes 即可安装。
          </p>
          {installPrompt ? (
            <div className="mt-3 flex items-stretch border border-[#0000f2]/20">
              <p className="min-w-0 flex-1 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-[#0000f2]">
                {installPrompt}
              </p>
              <button
                aria-label={copied ? "已复制" : "复制安装提示词"}
                className="grid w-24 shrink-0 place-items-center border-l border-[#0000f2] bg-[#0000f2] text-sm text-white transition hover:bg-[#1616cc]"
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(installPrompt).then(() => {
                    setCopied(true);

                    if (copyTimerRef.current) {
                      clearTimeout(copyTimerRef.current);
                    }

                    copyTimerRef.current = setTimeout(
                      () => setCopied(false),
                      2000,
                    );
                  });
                }}
              >
                {copied ? (
                  <i aria-hidden="true" className="ri-check-line text-lg" />
                ) : (
                  "复制"
                )}
              </button>
            </div>
          ) : source === undefined ? (
            <Skeleton
              aria-label="正在加载安装信息"
              className="mt-3 h-28 w-full rounded-none bg-[#0000f2]/10"
            />
          ) : (
            <p className="mt-3 border border-[#0000f2]/15 px-4 py-3 text-sm text-[#0000f2]/55">
              暂时无法获取安装信息，可前往 ClawHub 查看。
            </p>
          )}
        </section>

        <section className="mt-8 grid grid-cols-2 border-t border-l border-[#0000f2]/15 sm:grid-cols-4">
          {metrics.map(({ key, label }) => (
            <div
              className="border-r border-b border-[#0000f2]/15 p-4"
              key={key}
            >
              <p className="text-xs text-[#0000f2]/50">{label}</p>
              <p className="mt-2 text-xl text-[#0000f2]">
                {formatCount(skill[key])}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-12 border-t border-[#0000f2]/15 pt-8">
          <h2 className="text-sm font-medium text-[#0000f2]">用途说明</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#0000f2]/72">
            {skill.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(skill.topics.length > 0 ? skill.topics : ["Skill"]).map(
              (topic) => (
                <span
                  className="border border-[#0000f2]/20 px-3 py-1.5 text-sm text-[#0000f2]/70"
                  key={topic}
                >
                  {topic}
                </span>
              ),
            )}
          </div>
        </section>

        <section className="mt-12 border-t border-[#0000f2]/15 pt-8">
          <h2 className="text-sm font-medium text-[#0000f2]">Skill 文档</h2>
          {source === undefined ? (
            <div aria-label="正在加载 Skill 文档" className="mt-6 space-y-3">
              <Skeleton className="h-5 w-full rounded-none bg-[#0000f2]/10" />
              <Skeleton className="h-5 w-11/12 rounded-none bg-[#0000f2]/10" />
              <Skeleton className="h-5 w-4/5 rounded-none bg-[#0000f2]/10" />
              <Skeleton className="mt-8 h-8 w-1/3 rounded-none bg-[#0000f2]/10" />
              <Skeleton className="h-5 w-full rounded-none bg-[#0000f2]/10" />
            </div>
          ) : source?.description ? (
            <MarkdownRenderer className="mt-6" content={source.description} />
          ) : (
            <p className="mt-6 text-sm text-[#0000f2]/55">
              暂时无法获取完整文档。
            </p>
          )}
        </section>

        {skill.changelog ? (
          <section className="mt-12 border-t border-[#0000f2]/15 pt-8">
            <h2 className="text-sm font-medium text-[#0000f2]">最近更新</h2>
            <MarkdownRenderer
              className="mt-4 text-sm leading-7"
              content={skill.changelog}
            />
          </section>
        ) : null}

        <footer className="mt-12 border-t border-[#0000f2]/15 pt-6 text-xs leading-6 text-[#0000f2]/52">
          <p>
            数据来自{" "}
            <a
              className="underline underline-offset-4 transition hover:text-[#0000f2]"
              href={sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              ClawHub
              <i aria-hidden="true" className="ri-arrow-right-up-line ml-1" />
            </a>
            。安装或运行第三方 Skill 前，请检查其内容、权限和安全状态。
          </p>

          {mode === "drawer" ? (
            <Link
              className="mt-5 flex w-full items-center justify-between border border-[#0000f2] px-4 py-3 text-sm text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
              href={`/skills/${encodeURIComponent(skill.slug)}`}
            >
              打开完整页面
              <i aria-hidden="true" className="ri-arrow-right-line" />
            </Link>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
