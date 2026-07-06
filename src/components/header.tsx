"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "~/components/language-switcher";
import { docsHref } from "~/lib/docs-links";

const navItems = [
  { href: "/", label: "首页" },
  { href: docsHref, label: "文档" },
  { href: "/forum", label: "论坛" },
  { href: "/skills", label: "Skills" },
  { href: "/best-practices", label: "实践案例" },
  { href: "/services", label: "解决方案" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-4 z-20 px-5 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full border border-[#e8e5ff] bg-white/95 px-5 shadow-[0_18px_50px_rgba(34,2,242,0.08)] backdrop-blur sm:px-6">
        <div className="flex items-center gap-8">
          <Link className="flex items-center" href="/">
            <img
              alt="HermesCN 中文社区"
              className="h-8 w-auto"
              src="/logo.svg"
            />
          </Link>

          <nav className="hidden items-center gap-2 text-sm text-[#2f3140] md:flex lg:gap-3">
            {navItems.map((item) => {
              const isDocs =
                item.href === docsHref &&
                (pathname === "/docs" || pathname.startsWith("/docs/"));
              const isActive =
                isDocs ||
                (item.href === "/"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  className={[
                    "rounded-full px-2.5 py-1 transition",
                    isActive
                      ? "bg-[#2202f2] text-white hover:text-white"
                      : "hover:text-[#2202f2]",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
