"use client";

import { Dropdown } from "@heroui/react";

export function LanguageSwitcher() {
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="切换语言"
        className="inline-flex items-center gap-2 rounded-full border border-[#e6e3ff] bg-[#f7f6ff] px-3.5 py-1.5 text-sm font-medium text-[#2202f2] transition hover:border-[#2202f2]/40 hover:bg-[#f1efff]"
      >
        <i aria-hidden="true" className="ri-translate-2 text-base" />
        简中
        <i aria-hidden="true" className="ri-arrow-down-s-line" />
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="语言"
          selectedKeys={["zh-CN"]}
          selectionMode="single"
        >
          <Dropdown.Item id="zh-CN" textValue="简体中文">
            <span className="flex items-center gap-2">
              <Dropdown.ItemIndicator />
              简体中文
            </span>
          </Dropdown.Item>
          <Dropdown.Item id="zh-TW" isDisabled textValue="繁體中文">
            繁體中文
          </Dropdown.Item>
          <Dropdown.Item id="en" isDisabled textValue="English">
            English
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
