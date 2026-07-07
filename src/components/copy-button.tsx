"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
};

export function CopyButton({ text, label = "复制" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      aria-label={copied ? "已复制" : label}
      className="inline-flex size-8 shrink-0 items-center justify-center border border-[#0000f2]/15 bg-white text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
      onClick={handleCopy}
      type="button"
    >
      <i
        aria-hidden="true"
        className={
          copied ? "ri-check-line text-lg" : "ri-file-copy-line text-lg"
        }
      />
    </button>
  );
}
