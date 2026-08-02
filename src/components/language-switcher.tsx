"use client";

import { Dropdown } from "@heroui/react";

import { setLocale, useLocale } from "~/i18n/use-locale";

type LanguageSwitcherProps = {
  variant?: "dark" | "light";
};

export function LanguageSwitcher({ variant = "dark" }: LanguageSwitcherProps) {
  const isLight = variant === "light";
  const locale = useLocale();

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="切换语言"
        className={[
          "inline-flex items-center gap-2 border px-3.5 py-1.5 text-sm font-medium transition",
          isLight
            ? "border-[#0000f2]/30 text-[#0000f2] hover:border-[#0000f2] hover:bg-[#0000f2] hover:text-white"
            : "border-[#f5f5f5]/30 bg-transparent text-[#f5f5f5] hover:border-white hover:bg-white hover:text-[#0000f2]",
        ].join(" ")}
      >
        <i aria-hidden="true" className="ri-translate-2 text-base" />
        简体中文
        <i aria-hidden="true" className="ri-arrow-down-s-line" />
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="语言"
          selectedKeys={[locale]}
          selectionMode="single"
          onAction={(key) => {
            if (key === "zh") setLocale(key);
          }}
        >
          <Dropdown.Item id="zh" textValue="简体中文">
            <span className="flex items-center gap-2">
              <Dropdown.ItemIndicator />
              简体中文
            </span>
          </Dropdown.Item>
          <Dropdown.Item id="en" isDisabled textValue="English（即将开放）">
            <span className="flex w-full items-center justify-between gap-3">
              English
              <span className="text-xs font-normal opacity-60">即将开放</span>
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
