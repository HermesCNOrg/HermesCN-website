import Link from "next/link";

import { docsHref } from "~/lib/docs-links";

const sitemap = [
  { href: "/", label: "首页" },
  { href: docsHref, label: "文档" },
  { href: "/skills", label: "Skills" },
  { href: "/best-practices", label: "实践案例" },
  { href: "/services", label: "解决方案" },
];

const community = ["中文文档", "Skills 实践", "本地部署", "解决方案支持"];

const externalLinks = [
  {
    href: "https://x.com/hermescn_org",
    icon: "ri-twitter-x-line",
    label: "X（Twitter）",
  },
  {
    href: "https://github.com/HermesCNOrg",
    icon: "ri-github-fill",
    label: "GitHub",
  },
  {
    href: "https://t.zsxq.com/PI2or",
    icon: "ri-planet-line",
    label: "知识星球",
    qrImage: "/knowledge-planet-qr.png",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#f5f5f5]/20 bg-[#0000f2] text-[#f5f5f5]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_3fr]">
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

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-3 lg:gap-x-10">
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

          <div>
            <h2 className="text-sm font-semibold text-[#f5f5f5]">关注我们</h2>
            <nav className="mt-4 grid gap-3 text-sm text-[#d8dcff]">
              {externalLinks.map((item) => (
                <div className="group relative w-fit" key={item.href}>
                  <a
                    className="inline-flex items-center gap-2 transition hover:text-white"
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i
                      aria-hidden="true"
                      className={`${item.icon} text-base`}
                    />
                    <span>{item.label}</span>
                    <i
                      aria-hidden="true"
                      className="ri-arrow-right-up-line text-sm"
                    />
                  </a>
                  {item.qrImage ? (
                    <div
                      className="pointer-events-none absolute bottom-full left-0 z-10 mb-3 w-44 translate-y-1 border border-[#f5f5f5]/30 bg-white p-2 opacity-0 shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                      role="tooltip"
                    >
                      <img
                        alt="知识星球二维码"
                        className="w-full"
                        src={item.qrImage}
                      />
                      <span className="mt-1 block text-center text-xs text-[#0000f2]">
                        微信扫码加入知识星球
                      </span>
                      <span className="absolute top-full left-5 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-white" />
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-[#f5f5f5]/20 px-5 py-5 text-center text-xs text-[#d8dcff] sm:px-8">
        © {new Date().getFullYear()} HermesCN 中文社区. All rights reserved.
      </div>
    </footer>
  );
}
