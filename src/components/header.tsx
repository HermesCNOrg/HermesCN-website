"use client";

import { Tooltip } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LanguageSwitcher } from "~/components/language-switcher";
import { tutorialHref } from "~/lib/docs-links";
import { MobileMenu, type MobileMenuItem } from "~/components/mobile-menu";

const navItems: MobileMenuItem[] = [
  { href: "/", label: "首页" },
  { href: "/best-practices", label: "实践案例" },
  { href: "/skills", label: "Skills" },
  { href: "/services", label: "解决方案" },
  {
    href: tutorialHref,
    label: "文档与教程",
    opensInNewTab: true,
  },
];

const communityLinks = [
  {
    href: "https://t.zsxq.com/PI2or",
    icon: "ri-planet-line",
    label: "知识星球",
    mobileLabel: "星球",
    qrImage: "/knowledge-planet-qr.png",
  },
  {
    href: "https://github.com/HermesCNOrg",
    icon: "ri-github-fill",
    label: "GitHub",
    mobileLabel: "GitHub",
  },
  {
    href: "https://x.com/hermescn_org",
    icon: "ri-twitter-x-line",
    label: "X（Twitter）",
    mobileLabel: "X",
  },
];

export function Header() {
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const [activeCommunityTooltip, setActiveCommunityTooltip] = useState<
    string | null
  >(null);
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
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between border border-white/30 bg-[#0000f2]/90 px-5 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-8">
          <Link className="flex items-center" href="/">
            <img
              alt="Hermes Agent 中文社区"
              className="h-8 w-auto"
              src="/logo.svg"
            />
          </Link>

          <nav className="hidden items-center gap-2 text-sm text-white md:flex lg:gap-3">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  className={[
                    "inline-flex items-center gap-1 border border-transparent px-2.5 py-1 transition",
                    isActive
                      ? "border-white bg-white text-[#0000f2]"
                      : "text-[#f5f5f5] hover:border-white hover:bg-white hover:text-[#0000f2]",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
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
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <nav aria-label="社区链接" className="flex items-center">
            {communityLinks.map((item) => (
              <Tooltip
                closeDelay={100}
                delay={200}
                isOpen={activeCommunityTooltip === item.href}
                key={item.href}
                onOpenChange={(isOpen) =>
                  setActiveCommunityTooltip(isOpen ? item.href : null)
                }
                trigger="hover"
              >
                <Tooltip.Trigger>
                  <a
                    aria-label={item.label}
                    className="grid size-10 place-items-center text-xl text-[#d8dcff] transition-transform duration-200 hover:scale-110 hover:text-white"
                    href={item.href}
                    onBlur={() => setActiveCommunityTooltip(null)}
                    onFocus={() => setActiveCommunityTooltip(item.href)}
                    onMouseEnter={() => setActiveCommunityTooltip(item.href)}
                    onMouseLeave={() => setActiveCommunityTooltip(null)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i aria-hidden="true" className={item.icon} />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Content
                  className="border border-[#0000f2]/15 bg-white p-2 text-[#0000f2]"
                  offset={10}
                  placement="bottom"
                >
                  {item.qrImage ? (
                    <div className="w-40">
                      <img
                        alt="知识星球二维码"
                        className="w-full bg-white"
                        src={item.qrImage}
                      />
                      <p className="mt-2 text-center text-xs font-medium">
                        微信扫码加入
                      </p>
                    </div>
                  ) : (
                    <span className="px-1 text-xs font-medium">
                      {item.label}
                    </span>
                  )}
                </Tooltip.Content>
              </Tooltip>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
        <MobileMenu
          communityLinks={communityLinks}
          items={navItems}
          pathname={pathname}
        />
      </div>
    </header>
  );
}
