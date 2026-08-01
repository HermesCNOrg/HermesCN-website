import type { Metadata } from "next";

import { createPageMetadata } from "~/lib/seo";
import { SkillPageClient } from "./skill-page-client";

type SkillPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ chunk?: string; offset?: string }>;
};

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;

  return createPageMetadata({
    title: "Skill 详情",
    description: "查看 Agent Skill 的用途、来源和安装信息。",
    path: `/skills/${slug}`,
  });
}

export default async function SkillPage({
  params,
  searchParams,
}: SkillPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const chunk = Number.parseInt(query.chunk ?? "", 10);
  const offset = Number.parseInt(query.offset ?? "", 10);

  return (
    <main className="min-h-screen bg-[#f8f8ff] pt-24 text-[#0000f2]">
      <SkillPageClient
        chunk={Number.isInteger(chunk) && chunk >= 0 ? chunk : -1}
        id={slug}
        offset={Number.isInteger(offset) && offset >= 0 ? offset : -1}
      />
    </main>
  );
}
