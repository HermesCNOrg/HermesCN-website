import Link from "next/link";

import { BannerDescription } from "~/app/_components/banner-description";
import { HermesVsOpenClaw } from "~/app/_components/hermes-vs-openclaw";
import { InstallTerminal } from "~/app/_components/install-terminal";
import { docsHref } from "~/lib/docs-links";

const features = [
  {
    icon: "ri-global-line",
    title: "无处不在",
    copy: "Telegram、Discord、Slack、WhatsApp、Signal、Email、CLI 等入口都能接入。一个 Agent，一份记忆，覆盖每个使用场景。",
  },
  {
    icon: "ri-brain-line",
    title: "持久记忆",
    copy: "它会学习你的项目与偏好，自动沉淀 Skills，并记住每一次问题是如何被解决的。",
  },
  {
    icon: "ri-calendar-check-line",
    title: "专注自动化",
    copy: "用自然语言安排报告、备份和简报，让任务通过网关自动运行，稳定交付结果。",
  },
  {
    icon: "ri-git-branch-line",
    title: "任务委派",
    copy: "把复杂工作拆给隔离的子 Agent，每个任务都有自己的对话、终端和脚本环境，减少主上下文负担。",
  },
  {
    icon: "ri-search-line",
    title: "联网搜索",
    copy: "支持网页搜索、浏览器自动化、视觉理解、图像生成、文本转语音和多模型推理。",
  },
  {
    icon: "ri-shield-check-line",
    title: "隔离沙箱",
    copy: "支持本地、Docker、SSH、Singularity、Modal 五种后端，并提供容器加固与隔离运行环境。",
  },
];

const communityEntrances = [
  { title: "微信群", image: "/code.png" },
  { title: "知识星球", image: "/code.png" },
  { title: "飞书群", image: "/code.png" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <section className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[max(100vh,720px)] w-full max-w-7xl gap-12 px-5 pt-28 sm:px-8 lg:h-[max(100vh,720px)] lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:pt-24">
          <div className="flex min-h-0 items-center py-10 lg:h-full lg:py-20">
            <div className="max-w-4xl">
              <h1 className="max-w-4xl text-5xl leading-[1.15] font-semibold tracking-tight text-[#111111] sm:text-6xl">
                欢迎加入
                <br />
                <span className="text-[#2202f2]"> HermesCN </span>中文社区
              </h1>
              <BannerDescription />

              <div className="mt-10 grid max-w-sm grid-cols-3 gap-2">
                {communityEntrances.map((item) => (
                  <Link
                    aria-label={item.title}
                    className="group flex w-full flex-col items-center gap-2 rounded-md border border-[#e6e3ff] bg-white px-2 py-2 text-center shadow-[0_12px_34px_rgba(34,2,242,0.06)] transition hover:-translate-y-0.5 hover:border-[#2202f2]/40 hover:bg-[#fbfaff]"
                    href="/forum"
                    key={item.title}
                  >
                    <img
                      alt={`${item.title}二维码占位`}
                      className="h-full w-full rounded-md bg-white object-cover"
                      src={item.image}
                    />
                    <span className="text-xs font-medium text-[#111111]">
                      加入{item.title}
                    </span>
                  </Link>
                ))}
              </div>

              <InstallTerminal />

              <div className="mt-12 flex flex-wrap gap-3">
                <a
                  className="bg-primary rounded-full px-6 py-3 text-sm font-medium shadow-[0_16px_40px_rgba(34,2,242,0.18)] transition hover:-translate-y-0.5"
                  href="https://hermes-assets.nousresearch.com/Hermes-Setup.dmg?build=beaa1a08e6ab"
                >
                  下载客户端
                </a>
                <Link
                  className="rounded-full border border-[#2202f2] px-6 py-3 text-sm font-medium text-[#2202f2] transition hover:bg-[#f1efff]"
                  href={docsHref}
                >
                  阅读文档
                </Link>
              </div>
            </div>
          </div>

          <div className="flex min-h-[30rem] items-end justify-center lg:h-full lg:min-h-0 lg:justify-end">
            <img
              alt=""
              aria-hidden="true"
              className="h-auto max-h-[62vh] w-auto max-w-full object-contain object-right-bottom lg:max-h-[calc(100vh-14rem)] lg:max-w-[36rem]"
              src="/logo_ip.svg"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[#ece9ff] bg-[#f8f7ff]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <h2 className="text-3xl font-semibold text-[#111111]">
            Hermes Agent 特性
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                className="rounded-lg border border-[#e3dfff] bg-white/90 p-6"
                key={feature.title}
              >
                <i
                  aria-hidden="true"
                  className={`${feature.icon} text-3xl text-[#2202f2]`}
                />
                <h3 className="mt-4 text-lg font-semibold text-[#111111]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#4b4b4b]">
                  {feature.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HermesVsOpenClaw />

      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm tracking-[0.2em] text-white/70 uppercase">
              Community Thesis
            </p>
            <h2 className="text-3xl leading-tight font-semibold text-white sm:text-5xl">
              连接更多 AI Native 超级个体，把个人经验变成可复用的生产力系统。
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80">
              HermesCN 会围绕中文资料、最佳实践、Skills 生态和自动化工作流，帮助个人与企业把一次次有效协作沉淀下来，让 Agent 真正进入日常工作。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
