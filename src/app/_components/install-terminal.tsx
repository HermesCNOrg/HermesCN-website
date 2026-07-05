"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "~/components/copy-button";

const installOptions = [
  {
    id: "unix",
    label: "Linux / macOS / WSL2",
    command: "curl -fsSL https://res1.hermesagent.org.cn/install.sh | bash",
  },
  {
    id: "windows",
    label: "Windows",
    command: "irm https://res1.hermesagent.org.cn/install.ps1 | iex",
  },
];

const longestCommand = installOptions.reduce(
  (longest, option) =>
    option.command.length > longest.length ? option.command : longest,
  "",
);
const defaultInstallOption = installOptions[0]!;

export function InstallTerminal() {
  const [activeId, setActiveId] = useState(defaultInstallOption.id);
  const [typedCommand, setTypedCommand] = useState("");
  const activeOption =
    installOptions.find((option) => option.id === activeId) ??
    defaultInstallOption;

  useEffect(() => {
    let index = 0;
    setTypedCommand("");

    const timer = window.setInterval(() => {
      index += 1;
      setTypedCommand(activeOption.command.slice(0, index));

      if (index >= activeOption.command.length) {
        window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, [activeOption.command]);

  return (
    <div className="mt-8 max-w-2xl overflow-hidden rounded-md border border-[#e6e3ff] bg-white shadow-[0_18px_45px_rgba(34,2,242,0.1)]">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-[#f0eeff] bg-[#fbfaff] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ff6b6b]" />
          <span className="size-2.5 rounded-full bg-[#ffd166]" />
          <span className="size-2.5 rounded-full bg-[#6ee7b7]" />
        </div>

        <div className="flex rounded-full border border-[#e6e3ff] bg-white p-0.5 text-xs">
          {installOptions.map((option) => (
            <button
              className={
                option.id === activeId
                  ? "rounded-full bg-[#2202f2] px-3 py-1 text-white"
                  : "rounded-full px-3 py-1 text-[#6b6d78] transition hover:text-[#2202f2]"
              }
              key={option.id}
              onClick={() => setActiveId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex h-16 items-center gap-3 px-4 text-sm leading-6 text-[#111111]">
        <code className="min-w-0 flex-1 overflow-hidden whitespace-pre">
          <span className="invisible block h-0">
            <span className="text-[#2202f2]">$ </span>
            {longestCommand}
          </span>
          <span className="text-[#2202f2]">$ </span>
          {typedCommand}
        </code>
        <CopyButton
          key={activeOption.id}
          label="复制安装命令"
          text={activeOption.command}
        />
      </div>
    </div>
  );
}
