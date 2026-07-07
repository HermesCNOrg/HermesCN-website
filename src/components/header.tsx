"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LanguageSwitcher } from "~/components/language-switcher";
import { docsHref } from "~/lib/docs-links";

const navItems = [
  { href: "/", label: "首页" },
  { href: docsHref, label: "文档" },
  { href: "/skills", label: "Skills" },
  { href: "/best-practices", label: "实践案例" },
  { href: "/services", label: "解决方案" },
  { href: "/forum", label: "论坛", isExternal: true },
];

export function Header() {
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 24) {
        setIsHidden(false);
      } else if (delta > 8 && currentScrollY > 96) {
        setIsHidden(true);
      } else if (delta < -8) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-4 z-20 transform-gpu px-5 will-change-transform sm:px-6",
        isHidden ? "pointer-events-none" : "",
      ].join(" ")}
      style={{
        opacity: isHidden ? 0 : 1,
        transform: isHidden
          ? "translate3d(0, -120%, 0) scale(0.98)"
          : "translate3d(0, 0, 0) scale(1)",
        transition:
          "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease",
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between border border-[#f5f5f5]/25 bg-[#0000f2]/90 px-5 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-8">
          <Link className="flex items-center" href="/">
            <img
              alt="HermesCN 中文社区"
              className="h-8 w-auto"
              src="/logo.svg"
            />
          </Link>

          <nav className="hidden items-center gap-2 text-sm text-[#f5f5f5] md:flex lg:gap-3">
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
                    "inline-flex items-center gap-1 border border-transparent px-2.5 py-1 transition",
                    isActive
                      ? "border-[#f5f5f5]/70 bg-[#2d2dff] text-[#f5f5f5]"
                      : "text-[#f5f5f5] hover:border-white hover:bg-white hover:text-[#0000f2]",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                >
                  <span>{item.label}</span>
                  {item.isExternal ? (
                    <i
                      aria-hidden="true"
                      className="ri-external-link-line text-[0.95em] leading-none"
                    />
                  ) : null}
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
