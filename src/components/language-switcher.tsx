"use client";

import { Dropdown } from "@heroui/react";

export function LanguageSwitcher() {
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="切换语言"
        className="inline-flex items-center gap-2 border border-[#f5f5f5]/30 bg-transparent px-3.5 py-1.5 text-sm font-medium text-[#f5f5f5] transition hover:border-white hover:bg-white hover:text-[#0000f2]"
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
