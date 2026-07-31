"use client";

import { useState } from "react";
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

const defaultInstallOption = installOptions[0]!;

function MiddleEllipsis({ text }: { text: string }) {
  const tailLength = 18;
  const head = text.slice(0, -tailLength);
  const tail = text.slice(-tailLength);

  return (
    <span aria-hidden="true" className="flex min-w-0 flex-1 whitespace-nowrap">
      <span className="overflow-hidden">{head}</span>
      <span>…</span>
      <span className="shrink-0">{tail}</span>
    </span>
  );
}

export function InstallTerminal() {
  const [activeId, setActiveId] = useState(defaultInstallOption.id);
  const activeOption =
    installOptions.find((option) => option.id === activeId) ??
    defaultInstallOption;

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden border border-[#0000f2]/15 bg-white">
      <div className="grid min-h-11 min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-[#0000f2]/10 bg-white px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#d64040]" />
          <span className="size-2.5 rounded-full bg-[#d9c46a]" />
          <span className="size-2.5 rounded-full bg-[#0000f2]" />
        </div>

        <div className="flex min-w-0 justify-self-end border border-[#0000f2]/15 bg-white p-0.5 text-[11px] sm:text-xs">
          {installOptions.map((option) => (
            <button
              className={
                option.id === activeId
                  ? "min-w-0 bg-[#0000f2] px-1.5 py-1 leading-4 whitespace-nowrap text-white sm:px-2"
                  : "min-w-0 px-1.5 py-1 leading-4 whitespace-nowrap text-[#0000f2]/65 transition hover:bg-[#0000f2] hover:text-white sm:px-2"
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
      <div className="flex h-16 items-center gap-2 px-3 text-sm leading-6 text-[#0000f2] sm:gap-3 sm:px-4">
        <code
          aria-label={`$ ${activeOption.command}`}
          className="flex min-w-0 flex-1"
          title={`$ ${activeOption.command}`}
        >
          <span aria-hidden="true" className="shrink-0 text-[#0000f2]/55">
            $&nbsp;
          </span>
          <MiddleEllipsis text={activeOption.command} />
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
