"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "~/components/copy-button";

const installOptions = [
  {
    id: "unix",
    label: "Linux / macOS / WSL2",
    command:
      "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
  },
  {
    id: "windows",
    label: "Windows",
    command: "iex (irm https://hermes-agent.nousresearch.com/install.ps1)",
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
    <div className="mt-8 w-full max-w-2xl overflow-hidden border border-[#0000f2]/15 bg-white">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-[#0000f2]/10 bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#d64040]" />
          <span className="size-2.5 rounded-full bg-[#d9c46a]" />
          <span className="size-2.5 rounded-full bg-[#0000f2]" />
        </div>

        <div className="flex border border-[#0000f2]/15 bg-white p-0.5 text-xs">
          {installOptions.map((option) => (
            <button
              className={
                option.id === activeId
                  ? "bg-[#0000f2] px-3 py-1 text-white"
                  : "px-3 py-1 text-[#0000f2]/65 transition hover:bg-[#0000f2] hover:text-white"
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
      <div className="flex h-16 items-center gap-3 px-4 text-sm leading-6 text-[#0000f2]">
        <code className="min-w-0 flex-1 overflow-hidden whitespace-pre">
          <span className="invisible block h-0">
            <span className="text-[#0000f2]/55">$ </span>
            {longestCommand}
          </span>
          <span className="text-[#0000f2]/55">$ </span>
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
