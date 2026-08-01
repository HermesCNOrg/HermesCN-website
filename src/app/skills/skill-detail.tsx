"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MarkdownRenderer } from "~/components/markdown-renderer";
import type { SkillCard } from "./skills-static-data";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) throw new Error("Copy failed");
  }
}

export function SkillDetail({
  mode = "page",
  skill,
}: {
  mode?: "drawer" | "page";
  skill: SkillCard;
}) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detailHref = `/skills/${skill.id}?chunk=${skill.chunk}&offset=${skill.offset}`;

  useEffect(
    () => () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    },
    [],
  );

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
          <p className="text-sm text-[#0000f2]/55">
            {skill.source} · {skill.categoryLabel} · v{skill.version}
          </p>
          <h1
            className={
              mode === "page"
                ? "mt-4 max-w-4xl text-5xl leading-[1.02] font-normal text-[#0000f2] sm:text-6xl"
                : "mt-3 text-3xl leading-tight font-normal text-[#0000f2] sm:text-4xl"
            }
          >
            {skill.name}
          </h1>
          {skill.author ? (
            <p className="mt-3 text-sm text-[#0000f2]/55">
              作者：{skill.author}
            </p>
          ) : null}
        </header>

        <section className="mt-8">
          <p className="text-sm leading-6 text-[#0000f2]/62">安装命令</p>
          <div className="mt-3 flex items-stretch border border-[#0000f2]/20">
            <code className="min-w-0 flex-1 overflow-x-auto px-4 py-3 text-sm text-[#0000f2]">
              {skill.installCmd}
            </code>
            <button
              aria-label={copied ? "已复制" : "复制安装命令"}
              className="flex w-24 shrink-0 items-center justify-center gap-1.5 border-l border-[#0000f2] bg-[#0000f2] text-sm text-white transition hover:bg-[#1616cc]"
              type="button"
              onClick={() => {
                void copyText(skill.installCmd).then(
                  () => {
                    setCopied(true);
                    if (copyTimerRef.current)
                      clearTimeout(copyTimerRef.current);
                    copyTimerRef.current = setTimeout(
                      () => setCopied(false),
                      2_000,
                    );
                  },
                  () => undefined,
                );
              }}
            >
              <i
                aria-hidden="true"
                className={copied ? "ri-check-line" : "ri-file-copy-line"}
              />
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        </section>

        <section className="mt-12 border-t border-[#0000f2]/15 pt-8">
          <h2 className="text-sm font-medium text-[#0000f2]">用途说明</h2>
          <MarkdownRenderer
            className="mt-4 max-w-3xl text-lg text-[#0000f2]/72"
            content={skill.summary}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {(skill.tags.length > 0 ? skill.tags : [skill.categoryLabel]).map(
              (tag) => (
                <span
                  className="border border-[#0000f2]/20 px-3 py-1.5 text-sm text-[#0000f2]/70"
                  key={tag}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </section>

        {skill.description && skill.description !== skill.summary ? (
          <section className="mt-12 border-t border-[#0000f2]/15 pt-8">
            <h2 className="text-sm font-medium text-[#0000f2]">Skill 说明</h2>
            <MarkdownRenderer className="mt-6" content={skill.description} />
          </section>
        ) : null}

        {skill.commands.length > 0 || skill.envVars.length > 0 ? (
          <section className="mt-12 border-t border-[#0000f2]/15 pt-8">
            <h2 className="text-sm font-medium text-[#0000f2]">使用要求</h2>
            <div className="mt-4 space-y-3 text-sm text-[#0000f2]/70">
              {skill.commands.length > 0 ? (
                <p>命令：{skill.commands.join("、")}</p>
              ) : null}
              {skill.envVars.length > 0 ? (
                <p>环境变量：{skill.envVars.join("、")}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        <footer className="mt-12 border-t border-[#0000f2]/15 pt-6 text-xs leading-6 text-[#0000f2]/52">
          <p>
            数据来自 {skill.source}。安装或运行第三方 Skill
            前，请检查其内容、权限和安全状态。
          </p>
          {skill.sourceUrl ? (
            <a
              className="mt-3 inline-flex items-center gap-1 underline underline-offset-4"
              href={skill.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              查看来源
              <i aria-hidden="true" className="ri-arrow-right-up-line" />
            </a>
          ) : null}

          {mode === "drawer" ? (
            <Link
              className="mt-5 flex w-full items-center justify-between border border-[#0000f2] px-4 py-3 text-sm text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
              href={detailHref}
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
