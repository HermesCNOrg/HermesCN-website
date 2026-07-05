import Link from "next/link";

import { LanguageSwitcher } from "~/components/language-switcher";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/docs", label: "文档" },
  { href: "/forum", label: "论坛" },
  { href: "/skill", label: "Skill" },
  { href: "/best-practices", label: "最佳实践" },
  { href: "/services", label: "解决方案" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-4 z-20 px-5 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full border border-[#e8e5ff] bg-white/95 px-5 shadow-[0_18px_50px_rgba(34,2,242,0.08)] backdrop-blur sm:px-6">
        <div className="flex items-center gap-12">
          <Link className="flex items-center" href="/">
            <img
              alt="HermesCN 中文社区"
              className="h-8 w-auto"
              src="/logo.svg"
            />
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-[#2f3140] md:flex lg:gap-6">
            {navItems.map((item) => (
              <Link
                className="transition hover:text-[#2202f2]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
