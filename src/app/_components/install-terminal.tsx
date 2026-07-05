"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "~/components/copy-button";

const command =
  "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash";

export function InstallTerminal() {
  const [typedCommand, setTypedCommand] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedCommand(command.slice(0, index));

      if (index >= command.length) {
        window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 max-w-2xl overflow-hidden rounded-md border border-[#e6e3ff] bg-white shadow-[0_18px_45px_rgba(34,2,242,0.1)]">
      <div className="flex h-9 items-center gap-2 border-b border-[#f0eeff] bg-[#fbfaff] px-4">
        <span className="size-2.5 rounded-full bg-[#ff6b6b]" />
        <span className="size-2.5 rounded-full bg-[#ffd166]" />
        <span className="size-2.5 rounded-full bg-[#6ee7b7]" />
      </div>
      <div className="flex h-16 items-center gap-3 px-4 text-sm leading-6 text-[#111111]">
        <code className="min-w-0 flex-1 overflow-hidden whitespace-pre">
          <span className="invisible block h-0">
            <span className="text-[#2202f2]">$ </span>
            {command}
          </span>
          <span className="text-[#2202f2]">$ </span>
          {typedCommand}
        </code>
        <CopyButton label="复制安装命令" text={command} />
      </div>
    </div>
  );
}
