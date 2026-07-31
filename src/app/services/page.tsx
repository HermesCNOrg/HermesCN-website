import { type Metadata } from "next";
import Image from "next/image";

import { createPageMetadata } from "~/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "企业 AI Agent 生态服务与行业解决方案",
  description:
    "连接 HermesCN 社区能力与真实业务需求，为软件、教育、电商、制造和法律等行业提供 AI Agent 场景判断、原型验证与持续落地服务。",
  path: "/services",
});

const industries = [
  {
    icon: "ri-code-box-fill",
    title: "互联网 / 软件 / IT",
    copy: "帮助研发、产品、设计、运维和安全团队梳理高频工作，把需求分析、代码协作、知识库和自动化流程接入日常工作。",
    services: ["研发提效", "知识库", "流程自动化"],
  },
  {
    icon: "ri-cpu-fill",
    title: "硬件 / 半导体 / EE / IC",
    copy: "面向硬件、嵌入式、芯片和工业控制团队，提供资料整理、研发协作、测试记录和项目流程的 Agent 化改造建议。",
    services: ["资料管理", "测试记录", "项目协作"],
  },
  {
    icon: "ri-graduation-cap-fill",
    title: "教育 / 培训",
    copy: "为学校、出版和培训机构设计课程研发、教学辅助、学员答疑和内容生产流程，降低重复备课与运营成本。",
    services: ["课程研发", "教学辅助", "学员服务"],
  },
  {
    icon: "ri-video-fill",
    title: "自媒体 / 短剧 / 短视频",
    copy: "围绕选题、脚本、分镜、素材管理和账号复盘搭建协作流程，让内容团队更稳定地产出和复用经验。",
    services: ["选题脚本", "素材管理", "账号复盘"],
  },
  {
    icon: "ri-shopping-bag-3-fill",
    title: "电商 / 跨境电商",
    copy: "支持选品分析、店铺运营、客服协同、ERP 接入和营销素材生产，优先处理每天重复发生的运营任务。",
    services: ["选品分析", "客服协同", "ERP 接入"],
  },
  {
    icon: "ri-heart-pulse-fill",
    title: "医疗 / 制药 / 健康",
    copy: "为制药与泛健康团队整理专业资料、建设内部知识库，并辅助生成更清晰、可审阅的业务内容。",
    services: ["资料整理", "知识库", "内容审阅"],
  },
  {
    icon: "ri-building-4-fill",
    title: "工业 / 制造业 / 实业",
    copy: "从物流、实体服务、汽车制造到化工场景，协助识别可自动化节点，优化表单、报表、排班和跨部门协作。",
    services: ["流程诊断", "报表自动化", "协作优化"],
  },
  {
    icon: "ri-scales-3-fill",
    title: "法律",
    copy: "面向律师和法律团队，提供检索、合同审阅、案件资料整理和知识沉淀方案，让专业判断有更好的信息底座。",
    services: ["法律检索", "合同审阅", "案卷整理"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0000f2] text-[#f5f5f5]">
      <section className="border-b border-[#f5f5f5]/20 bg-[#0000f2]">
        <div className="mx-auto max-w-7xl px-5 pt-32 pb-16 sm:px-8">
          <div className="max-w-4xl">
            <p className="text-sm text-[#d8dcff]">01 · Industry Solutions</p>
            <h1 className="mt-5 text-5xl leading-[1.02] font-normal text-[#f5f5f5] sm:text-6xl">
              为每个行业找到
              <br />
              能落地的 Agent 场景
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d8dcff]">
              你提供真实业务问题，我们提供场景诊断、工作流设计、工具选型、原型搭建和落地陪跑，帮助团队把
              AI / Agent 从“尝试一下”变成稳定可复用的工作方式。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-[#0000f2]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div>
            <p className="text-sm text-[#0000f2]/65">02 · Service Matrix</p>
            <h2 className="mt-3 text-3xl leading-tight font-normal text-[#0000f2] sm:text-5xl">
              解决方案
            </h2>
          </div>

          <div className="mt-10 grid gap-0 border-t border-l border-[#0000f2]/15">
            {industries.map((industry) => (
              <article
                className="group relative grid gap-6 border-r border-b border-[#0000f2]/15 bg-white p-5 text-[#0000f2] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-transparent before:transition-colors hover:before:bg-[#0000f2] md:grid-cols-[1fr_7.5rem] md:items-center lg:p-6"
                key={industry.title}
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="relative flex size-11 shrink-0 items-center justify-center text-[#0000f2]">
                      <i
                        aria-hidden="true"
                        className={`${industry.icon.replace("-fill", "-line")} text-3xl leading-none transition-opacity group-hover:opacity-0`}
                      />
                      <i
                        aria-hidden="true"
                        className={`${industry.icon} absolute text-3xl leading-none opacity-0 transition-opacity group-hover:opacity-100`}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl leading-snug font-normal text-current">
                        {industry.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-base leading-7 text-[#0000f2]/65">
                        {industry.copy}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 pl-[3.75rem]">
                    {industry.services.map((service) => (
                      <span
                        className="border border-[#0000f2]/15 px-3 py-1 text-sm font-medium text-[#0000f2]/65"
                        key={service}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block md:justify-self-end">
                  <div
                    aria-label={`${industry.title}交流群即将开通`}
                    className="relative w-28 overflow-hidden border border-[#0000f2]/15 bg-white p-2 text-center text-[#0000f2]"
                    role="img"
                  >
                    <div
                      aria-hidden="true"
                      className="aspect-square w-full overflow-hidden bg-white"
                    >
                      <Image
                        alt=""
                        className="aspect-square w-full bg-white object-cover"
                        height={96}
                        src="/code.png"
                        width={96}
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-[#0000f2]/65">
                      行业交流群
                    </p>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 grid place-items-center bg-white/55 backdrop-blur-[4px]"
                    >
                      <span className="text-[15px] text-[#000000]">
                        即将开通
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
