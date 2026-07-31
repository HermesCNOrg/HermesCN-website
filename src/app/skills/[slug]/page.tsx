import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageMetadata } from "~/lib/seo";
import { SkillDetail } from "../skill-detail";
import { getSkill } from "../skills-data";

type SkillPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  if (!skill) {
    return {};
  }

  return createPageMetadata({
    title: `${skill.name} Skill`,
    description: skill.summary,
    path: `/skills/${skill.slug}`,
  });
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = await getSkill(slug);

  if (!skill) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f8ff] pt-24 text-[#0000f2]">
      <SkillDetail skill={skill} />
    </main>
  );
}
