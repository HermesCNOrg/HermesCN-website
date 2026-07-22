import Link from "next/link";

import { BannerDescription } from "~/app/_components/banner-description";
import { HermesVsOpenClaw } from "~/app/_components/hermes-vs-openclaw";
import { InstallTerminal } from "~/app/_components/install-terminal";
import { docsHref } from "~/lib/docs-links";

const features = [
  {
    icon: "ri-global-line",
    order: "01",
    title: "无处不在",
    copy: "Telegram、Discord、Slack、WhatsApp、Signal、Email、CLI 等入口都能接入。一个 Agent，一份记忆，覆盖每个使用场景。",
  },
  {
    icon: "ri-brain-line",
    order: "02",
    title: "持久记忆",
    copy: "它会学习你的项目与偏好，自动沉淀 Skills，并记住每一次问题是如何被解决的。",
  },
  {
    icon: "ri-calendar-check-line",
    order: "03",
    title: "专注自动化",
    copy: "用自然语言安排报告、备份和简报，让任务通过网关自动运行，稳定交付结果。",
  },
  {
    icon: "ri-git-branch-line",
    order: "04",
    title: "任务委派",
    copy: "把复杂工作拆给隔离的子 Agent，每个任务都有自己的对话、终端和脚本环境，减少主上下文负担。",
  },
  {
    icon: "ri-search-line",
    order: "05",
    title: "联网搜索",
    copy: "支持网页搜索、浏览器自动化、视觉理解、图像生成、文本转语音和多模型推理。",
  },
  {
    icon: "ri-shield-check-line",
    order: "06",
    title: "隔离沙箱",
    copy: "支持本地、Docker、SSH、Singularity、Modal 五种后端，并提供容器加固与隔离运行环境。",
  },
];

const communityEntrances = [
  { title: "微信群", image: "/code.png" },
  {
    title: "知识星球",
    image: "/knowledge-planet-qr.png",
    href: "https://t.zsxq.com/PI2or",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0000f2] text-[#f5f5f5]">
      <section className="relative isolate overflow-hidden border-b border-[#f5f5f5]/20 bg-[#0000f2]">
        <div className="mx-auto grid min-h-[max(100vh,720px)] w-full max-w-7xl gap-12 px-5 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pt-24">
          <div className="relative z-10 flex min-h-0 items-center py-12 lg:h-full lg:py-20">
            <div className="max-w-4xl">
              <h1 className="max-w-4xl text-5xl leading-[1.2] font-bold text-[#f5f5f5] sm:text-6xl lg:text-7xl">
                HermesCN
                <br />
                中文社区
              </h1>
              <BannerDescription />

              <div className="mt-10 grid w-full max-w-sm grid-cols-1 gap-0 overflow-hidden border border-[#f5f5f5]/25 bg-[#0000b8]/30 sm:grid-cols-2">
                {communityEntrances.map((item) => (
                  <div
                    className="flex min-w-0 flex-col items-center gap-2 border-b border-[#f5f5f5]/20 px-2 py-3 text-center last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
                    key={item.title}
                  >
                    <img
                      alt={`${item.title}二维码`}
                      className="h-36 w-36 bg-white object-contain"
                      src={item.image}
                    />
                    {item.href ? (
                      <a
                        className="group inline-flex items-center gap-1 text-xs font-medium text-[#f5f5f5] transition hover:-translate-y-px hover:text-[#ecfe4a] hover:underline hover:underline-offset-4"
                        href={item.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>加入{item.title}</span>
                        <i
                          aria-hidden="true"
                          className="ri-arrow-right-up-line text-sm leading-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-[#f5f5f5]">
                        加入{item.title}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <InstallTerminal />

              <div className="mt-12 flex flex-wrap gap-3">
                <a
                  className="border border-white bg-white px-6 py-3 text-sm font-medium text-[#0000f2] transition hover:-translate-y-0.5 hover:bg-[#0000f2] hover:text-white"
                  href="https://hermes-assets.nousresearch.com/Hermes-Setup.dmg?build=beaa1a08e6ab"
                >
                  下载客户端
                </a>
                <Link
                  className="inline-flex items-center gap-1.5 border border-[#f5f5f5]/70 px-6 py-3 text-sm font-medium text-[#f5f5f5] transition hover:border-white hover:bg-white hover:text-[#0000f2]"
                  href={docsHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>阅读文档</span>
                  <i
                    aria-hidden="true"
                    className="ri-arrow-right-up-line text-base leading-none"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[30rem] items-center justify-center lg:h-full lg:min-h-0 lg:justify-end">
            <img
              alt=""
              aria-hidden="true"
              className="relative h-auto max-h-[60vh] w-auto max-w-full object-contain object-center lg:max-h-[calc(100vh-11rem)] lg:max-w-[40rem]"
              src="/logo_ip2.png"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#f5f5f5]/20 bg-[#0000f2]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div>
            <p className="text-sm text-[#d8dcff]">01 · Feature Preview</p>
            <h2 className="mt-4 text-3xl leading-tight font-normal text-[#f5f5f5] sm:text-5xl">
              Hermes Agent 特性
            </h2>
          </div>
          <div className="mt-10 grid gap-0 border-t border-l border-[#0000f2]/15 md:grid-cols-3">
            {features.map((feature) => (
              <div
                className="group border-r border-b border-[#0000f2]/15 bg-white p-6 text-[#0000f2]"
                key={feature.title}
              >
                <div className="flex items-center justify-between text-[#0000f2]/65">
                  <span className="text-xs">{feature.order}</span>
                  <i
                    aria-hidden="true"
                    className={`${feature.icon} origin-right text-2xl transition-transform duration-200 group-hover:scale-125`}
                  />
                </div>
                <h3 className="mt-10 origin-left text-2xl font-normal text-current transition-transform duration-200 group-hover:scale-[1.04]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#0000f2]/65">
                  {feature.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HermesVsOpenClaw />

      <section className="bg-white text-[#0000f2]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm text-[#0000f2]/65">
              03 · Community Thesis
            </p>
            <h2 className="text-3xl leading-tight font-normal text-[#0000f2] sm:text-5xl">
              连接更多 AI Native 超级个体，把个人经验变成可复用的生产力系统。
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#0000f2]/65">
              HermesCN 会围绕中文资料、实践案例、Skills
              生态和自动化工作流，帮助个人与企业把一次次有效协作沉淀下来，让
              Agent 真正进入日常工作。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
