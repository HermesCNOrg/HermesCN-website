"use client";

import Link from "next/link";
import { useState } from "react";

import { LanguageSwitcher } from "~/components/language-switcher";

export type MobileMenuItem = {
  href: string;
  label: string;
  opensInNewTab?: boolean;
};

export type MobileCommunityLink = {
  href: string;
  icon: string;
  label: string;
  mobileLabel: string;
};

type MobileMenuProps = {
  communityLinks: MobileCommunityLink[];
  items: MobileMenuItem[];
  pathname: string;
};

export function MobileMenu({
  communityLinks,
  items,
  pathname,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        className="inline-flex h-9 w-9 items-center justify-center border border-[#f5f5f5]/30 text-xl text-[#f5f5f5] transition hover:border-white hover:bg-white hover:text-[#0000f2]"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <i
          aria-hidden="true"
          className={`ri-${isOpen ? "close" : "menu"}-line leading-none`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute top-full right-0 z-30 mt-3 w-[calc(100vw-2.5rem)] max-w-72 border border-[#0000f2]/20 bg-white p-3 text-[#0000f2] shadow-[0_16px_32px_rgba(0,0,0,0.2)]"
          id="mobile-navigation"
        >
          <span
            aria-hidden="true"
            className="absolute -top-2 right-2 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-white"
          />
          <nav className="grid gap-1" aria-label="移动端导航">
            {items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  className={[
                    "flex items-center justify-between border border-transparent px-3 py-3 text-sm transition",
                    isActive
                      ? "border-[#f5f5f5]/70 bg-[#2d2dff] text-[#f5f5f5]"
                      : "text-[#0000f2] hover:border-[#0000f2] hover:bg-[#0000f2] hover:text-white",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                  onClick={() => setIsOpen(false)}
                  rel={item.opensInNewTab ? "noopener noreferrer" : undefined}
                  target={item.opensInNewTab ? "_blank" : undefined}
                >
                  <span>{item.label}</span>
                  {item.opensInNewTab ? (
                    <i
                      aria-hidden="true"
                      className="ri-arrow-right-up-line text-base leading-none"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <nav
            aria-label="社区链接"
            className="mt-3 grid grid-cols-3 border-t border-[#0000f2]/20 pt-3"
          >
            {communityLinks.map((item) => (
              <a
                className="flex min-w-0 flex-col items-center gap-1.5 px-2 py-2 text-xs text-[#0000f2] transition hover:bg-[#0000f2] hover:text-white"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <i
                  aria-hidden="true"
                  className={`${item.icon} text-xl leading-none`}
                />
                <span>{item.mobileLabel}</span>
              </a>
            ))}
          </nav>

          <div className="mt-3 border-t border-[#0000f2]/20 pt-3">
            <LanguageSwitcher variant="light" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
