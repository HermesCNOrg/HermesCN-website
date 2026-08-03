import { type Metadata } from "next";

import { PixelBlast } from "~/app/_components/pixel-blast";
import { createPageMetadata } from "~/lib/seo";
import { SkillsCatalog } from "./skills-catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Hermes Agent Skills 指南与实践案例",
  description:
    "探索 Hermes Agent Skills 中文生态，按场景浏览可复用能力、版本与实践信息，为个人工作流和真实项目选择合适的 Skills。",
  path: "/skills",
  keywords: [
    "Hermes Agent Skills",
    "Hermes Skills 中文",
    "Agent Skills",
    "AI Agent Skills",
  ],
});

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-[#0000f2] text-[#f5f5f5]">
      <section className="relative isolate overflow-hidden border-b border-[#f5f5f5]/20">
        <PixelBlast
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.15]"
          edgeFade={0.18}
          enableRipples={false}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pt-32 pb-16 sm:px-8">
          <div className="max-w-4xl">
            <p className="text-sm text-[#d8dcff]">01 · Skills Library</p>
            <h1 className="mt-5 text-5xl leading-[1.02] font-normal text-[#f5f5f5] sm:text-6xl">
              找到适合你工作流的 Agent Skills
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d8dcff]">
              浏览可复用的 Agent
              能力包，按用途筛选，查看说明、版本、热度和更新记录，再决定是否安装到自己的
              Hermes 工作流里。
            </p>
          </div>
        </div>
      </section>

      <SkillsCatalog />
    </main>
  );
}
