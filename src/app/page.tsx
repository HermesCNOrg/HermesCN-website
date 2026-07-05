import { Card, Link } from "@heroui/react";
import { BannerDescription } from "~/app/_components/banner-description";
import { InstallTerminal } from "~/app/_components/install-terminal";

const features = [
  {
    title: "长期记忆",
    copy: "让 Agent 记住你的项目、偏好和工作方式，把一次次协作沉淀为之后可复用的上下文。",
  },
  {
    title: "Skills 沉淀",
    copy: "把复杂任务的成功路径整理成技能，帮助个体、团队与社区共享 AI native 的实践能力。",
  },
  {
    title: "工具与自动化",
    copy: "连接终端、文件、浏览器、MCP 与消息入口，让 Agent 从聊天框走向真实工作流。",
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
                <Link
                  className="bg-primary rounded-full px-6 py-3 text-sm font-medium shadow-[0_16px_40px_rgba(34,2,242,0.18)] transition hover:-translate-y-0.5"
                  href="/docs"
                >
                  阅读文档
                </Link>
                <Link
                  className="rounded-full border border-[#2202f2] px-6 py-3 text-sm font-medium text-[#2202f2] transition hover:bg-[#f1efff]"
                  href="/forum"
                >
                  加入论坛
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
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:px-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              className="border border-[#e3dfff] bg-white/90"
              key={feature.title}
            >
              <Card.Header>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Description>{feature.copy}</Card.Description>
              </Card.Header>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm tracking-[0.2em] text-white/70 uppercase">
              Community Thesis
            </p>
            <h2 className="text-3xl leading-tight font-semibold text-white sm:text-5xl">
              让中文社区里的创造者，不只是使用 Agent，而是和 Agent 一起进化。
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80">
              我们会围绕中文资料、最佳实践、Skills 生态和解决方案支持，连接更多
              AI native 超级个体，让每一次解决问题都能成为社区的共同资产。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
