"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "~/i18n/use-locale";
import { SkillDetail } from "../skill-detail";
import { loadSkillAt, type SkillCard } from "../skills-static-data";

export function SkillPageClient({
  chunk,
  id,
  offset,
}: {
  chunk: number;
  id: string;
  offset: number;
}) {
  const locale = useLocale();
  const [skill, setSkill] = useState<SkillCard | null>();

  useEffect(() => {
    let active = true;
    setSkill(undefined);

    void loadSkillAt(id, chunk, offset, locale).then(
      (item) => {
        if (active) setSkill(item);
      },
      () => {
        if (active) setSkill(null);
      },
    );

    return () => {
      active = false;
    };
  }, [chunk, id, locale, offset]);

  if (skill === undefined) {
    return <p className="px-5 py-20 text-center">正在加载 Skill…</p>;
  }

  if (skill === null) {
    return (
      <div className="px-5 py-20 text-center">
        <p>未找到这个 Skill。</p>
        <Link className="mt-4 inline-block underline" href="/skills">
          返回 Skills
        </Link>
      </div>
    );
  }

  return <SkillDetail skill={skill} />;
}
