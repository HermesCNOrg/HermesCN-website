"use client";

import { Drawer } from "@heroui/react";
import { useEffect, useState } from "react";

import { SkillDetail } from "./skill-detail";
import type { SkillCard } from "./skills-static-data";

export function SkillDrawer({
  onClose,
  skill,
}: {
  onClose: () => void;
  skill: SkillCard | null;
}) {
  const [renderedSkill, setRenderedSkill] = useState(skill);

  useEffect(() => {
    if (skill) {
      setRenderedSkill(skill);
    }
  }, [skill]);

  if (!renderedSkill) return null;

  return (
    <Drawer.Backdrop
      className="z-[100] bg-[#0000f2]/42"
      isOpen={Boolean(skill)}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Drawer.Content placement="right">
        <Drawer.Dialog
          aria-label={`${renderedSkill.name} 详情`}
          className="h-full max-h-screen rounded-none bg-[#f8f8ff] p-0 text-[#0000f2] shadow-[-16px_0_60px_rgba(0,0,90,0.18)]"
          style={{ maxWidth: "42rem", width: "100%" }}
        >
          <Drawer.Header className="flex-row items-center gap-4 border-b border-[#0000f2]/15 bg-[#f8f8ff]/95 px-6 py-4 backdrop-blur sm:px-8">
            <Drawer.Heading className="mr-auto text-left text-sm font-normal text-[#0000f2]/55">
              Skill Detail
            </Drawer.Heading>
            <button
              aria-label="关闭详情"
              className="grid h-10 w-10 shrink-0 place-items-center border border-[#0000f2]/20 text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
              type="button"
              onClick={onClose}
            >
              <i aria-hidden="true" className="ri-close-line text-xl" />
            </button>
          </Drawer.Header>
          <Drawer.Body
            className="overflow-y-auto p-0"
            data-testid="skill-drawer-body"
          >
            <SkillDetail mode="drawer" skill={renderedSkill} />
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
