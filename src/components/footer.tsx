import Link from "next/link";

import { docsHref } from "~/lib/docs-links";

const sitemap = [
  { href: "/", label: "首页" },
  { href: docsHref, label: "文档" },
  { href: "/forum", label: "论坛" },
  { href: "/skills", label: "Skills" },
  { href: "/best-practices", label: "实践案例" },
  { href: "/services", label: "解决方案" },
];

const community = ["中文文档", "Skills 实践", "本地部署", "解决方案支持"];

export function Footer() {
  return (
    <footer className="border-t border-[#f5f5f5]/20 bg-[#0000f2] text-[#f5f5f5]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link className="inline-flex items-center" href="/">
            <img
              alt="HermesCN 中文社区"
              className="h-12 w-auto"
              src="/logo.svg"
            />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#d8dcff]">
            HermesCN 中文社区连接更多 AI native
            超级个体，沉淀中文资料、实践经验和解决方案。
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#f5f5f5]">网站地图</h2>
          <nav className="mt-4 grid gap-3 text-sm text-[#d8dcff]">
            {sitemap.map((item) => (
              <Link
                className="transition hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#f5f5f5]">社区方向</h2>
          <ul className="mt-4 grid gap-3 text-sm text-[#d8dcff]">
            {community.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#f5f5f5]/20 px-5 py-5 text-center text-xs text-[#d8dcff] sm:px-8">
        © {new Date().getFullYear()} HermesCN 中文社区. All rights reserved.
      </div>
    </footer>
  );
}
