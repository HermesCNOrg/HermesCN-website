import Image from "next/image";

import { openClawMigrationHref } from "~/lib/docs-links";

const gaps = [
  {
    capability: "更安全的执行边界",
    detail:
      "命令审批、授权控制、容器隔离与命名空间隔离，让 Agent 执行任务时更可控。",
    hermes: "内置安全边界",
    openclaw: "相对有限",
  },
  {
    capability: "更稳定的运行环境",
    detail:
      "支持本地、Docker、SSH、Daytona、Singularity、Modal 等后端，适合长期在线与远程运行。",
    hermes: "多后端稳定运行",
    openclaw: "偏本地使用",
  },
  {
    capability: "自我进化",
    detail:
      "Hermes 会从经验中创建 Skills，在使用中改进 Skills，并持续沉淀跨会话记忆。",
    hermes: "闭环学习",
    openclaw: "缺少闭环",
  },
  {
    capability: "一键迁移",
    detail:
      "通过迁移命令导入 OpenClaw 配置、记忆、Persona、Skills、模型和平台设置。",
    hermes: "支持迁移",
    openclaw: "迁移来源",
  },
  {
    capability: "自动化与委派",
    detail:
      "内置计划任务、消息投递和隔离子 Agent，让复杂工作可以无人值守、并行推进。",
    hermes: "原生支持",
    openclaw: "不是核心",
  },
];

export function HermesVsOpenClaw() {
  return (
    <section className="bg-[#0000f2]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-medium text-[#d8dcff]">
            02 · Hermes 解决了 OpenClaw 的哪些问题
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-normal text-[#f5f5f5] sm:text-5xl">
            更安全、更稳定，并且会自我进化。
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#d8dcff]">
            Hermes 补齐的是 OpenClaw 在长期运行里的关键缺口：更明确的安全边界、
            更稳定的沙箱与远程后端、会自动沉淀 Skills 的学习闭环，以及从
            OpenClaw 一键迁移到 Hermes 的路径。
          </p>
          <a
            className="mt-7 inline-flex items-center justify-center gap-2 border border-white bg-white px-5 py-3 text-sm font-medium text-[#0000f2] transition hover:-translate-y-0.5 hover:bg-[#0000f2] hover:text-white"
            href={openClawMigrationHref}
          >
            查看迁移指南
            <i
              aria-hidden="true"
              className="ri-arrow-right-up-line text-base"
            />
          </a>
        </div>

        <div className="mt-10 overflow-hidden border border-[#0000f2]/15 bg-white">
          <div className="grid border-b border-[#0000f2]/10 bg-white md:grid-cols-[1.3fr_0.85fr_0.85fr]">
            <div className="px-5 py-4 text-sm font-semibold text-[#0000f2]/65">
              能力缺口
            </div>
            <ProductHead
              logo="/icon_hermes.png"
              name="Hermes"
              tone="bg-[#0000f2] text-white"
            />
            <ProductHead
              logo="/icon_openclaw.jpeg"
              name="OpenClaw"
              tone="bg-[#d8dcff] text-[#0000f2]"
            />
          </div>

          <div className="divide-y divide-[#0000f2]/10">
            {gaps.map((gap) => (
              <div
                className="grid gap-0 bg-white md:grid-cols-[1.3fr_0.85fr_0.85fr]"
                key={gap.capability}
              >
                <div className="px-5 py-5">
                  <h3 className="text-base font-semibold text-[#0000f2]">
                    {gap.capability}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#0000f2]/65">
                    {gap.detail}
                  </p>
                </div>
                <ChecklistCell state="yes" text={gap.hermes} />
                <ChecklistCell state="limited" text={gap.openclaw} />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-[#d8dcff]">
          简单说：OpenClaw 更适合快速开始；Hermes 更适合把 Agent
          变成长期在线、稳定安全、持续学习的工作系统。
        </p>
      </div>
    </section>
  );
}

function ProductHead({
  logo,
  name,
  tone,
}: {
  logo: string;
  name: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-[#0000f2]/10 px-5 py-4 md:border-t-0 md:border-l">
      <Image
        alt={`${name} icon`}
        className="size-10 border border-[#0000f2]/10 bg-white object-cover"
        height={40}
        src={logo}
        width={40}
      />
      <span className={`px-3 py-1 text-sm font-semibold ${tone}`}>{name}</span>
    </div>
  );
}

function ChecklistCell({
  state,
  text,
}: {
  state: "yes" | "limited";
  text: string;
}) {
  const isYes = state === "yes";

  return (
    <div className="flex items-center gap-3 border-t border-[#0000f2]/10 px-5 py-4 md:border-t-0 md:border-l">
      <span
        className={
          isYes
            ? "flex size-7 shrink-0 items-center justify-center bg-[#0000f2] text-white"
            : "flex size-7 shrink-0 items-center justify-center bg-[#d8dcff] text-[#0000f2]"
        }
      >
        <i
          aria-hidden="true"
          className={
            isYes ? "ri-check-line text-base" : "ri-subtract-line text-base"
          }
        />
      </span>
      <span
        className={
          isYes
            ? "text-sm font-medium text-[#0000f2]"
            : "text-sm font-medium text-[#0000f2]/65"
        }
      >
        {text}
      </span>
    </div>
  );
}
