import Image from "next/image";

const industries = [
  {
    icon: "ri-code-box-line",
    title: "互联网 / 软件 / IT",
    copy: "帮助研发、产品、设计、运维和安全团队梳理高频工作，把需求分析、代码协作、知识库和自动化流程接入日常工作。",
    services: ["研发提效", "知识库", "流程自动化"],
  },
  {
    icon: "ri-cpu-line",
    title: "硬件 / 半导体 / EE / IC",
    copy: "面向硬件、嵌入式、芯片和工业控制团队，提供资料整理、研发协作、测试记录和项目流程的 Agent 化改造建议。",
    services: ["资料管理", "测试记录", "项目协作"],
  },
  {
    icon: "ri-graduation-cap-line",
    title: "教育 / 培训",
    copy: "为学校、出版和培训机构设计课程研发、教学辅助、学员答疑和内容生产流程，降低重复备课与运营成本。",
    services: ["课程研发", "教学辅助", "学员服务"],
  },
  {
    icon: "ri-video-line",
    title: "自媒体 / 短剧 / 短视频",
    copy: "围绕选题、脚本、分镜、素材管理和账号复盘搭建协作流程，让内容团队更稳定地产出和复用经验。",
    services: ["选题脚本", "素材管理", "账号复盘"],
  },
  {
    icon: "ri-shopping-bag-3-line",
    title: "电商 / 跨境电商",
    copy: "支持选品分析、店铺运营、客服协同、ERP 接入和营销素材生产，优先处理每天重复发生的运营任务。",
    services: ["选品分析", "客服协同", "ERP 接入"],
  },
  {
    icon: "ri-heart-pulse-line",
    title: "医疗 / 制药 / 健康",
    copy: "为制药与泛健康团队整理专业资料、建设内部知识库，并辅助生成更清晰、可审阅的业务内容。",
    services: ["资料整理", "知识库", "内容审阅"],
  },
  {
    icon: "ri-building-4-line",
    title: "工业 / 制造业 / 实业",
    copy: "从物流、实体服务、汽车制造到化工场景，协助识别可自动化节点，优化表单、报表、排班和跨部门协作。",
    services: ["流程诊断", "报表自动化", "协作优化"],
  },
  {
    icon: "ri-scales-3-line",
    title: "法律",
    copy: "面向律师和法律团队，提供检索、合同审阅、案件资料整理和知识沉淀方案，让专业判断有更好的信息底座。",
    services: ["法律检索", "合同审阅", "案卷整理"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfe] px-5 pt-40 pb-20 text-[#111111] sm:px-8">
      <section className="mx-auto max-w-6xl pb-12">
        <p className="text-sm font-medium tracking-[0.24em] text-[#2202f2] uppercase">
          Industry Solutions
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-[#111111] sm:text-6xl">
          为每个行业找到
          <br />
          <span className="text-[#2202f2]">能落地的 Agent 场景</span>
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-[#3f3f46]">
          你提供真实业务问题，我们提供场景诊断、工作流设计、工具选型、原型搭建和落地陪跑，帮助团队把 AI / Agent
          从“尝试一下”变成稳定可复用的工作方式。
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <div className="grid gap-4">
          {industries.map((industry) => (
            <article
              className="group grid gap-6 rounded-lg border border-[#e3e0f7] bg-white p-5 shadow-[0_16px_50px_rgba(34,2,242,0.06)] transition hover:-translate-y-0.5 hover:border-[#2202f2]/35 hover:shadow-[0_24px_70px_rgba(34,2,242,0.1)] md:grid-cols-[1fr_7.5rem] md:items-center lg:p-6"
              key={industry.title}
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center text-[#2202f2]">
                    <i
                      aria-hidden="true"
                      className={`${industry.icon} text-3xl leading-none`}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl leading-snug font-semibold text-[#111111]">
                      {industry.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-[#4b4b4b]">
                      {industry.copy}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 pl-[3.75rem]">
                  {industry.services.map((service) => (
                    <span
                      className="rounded-full bg-[#f1efff] px-3 py-1 text-sm font-medium text-[#2202f2]"
                      key={service}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="justify-self-start md:justify-self-end">
                <div className="w-28 rounded-lg border border-[#e6e3ff] bg-[#fbfbfe] p-2 text-center transition group-hover:border-[#2202f2]/40">
                  <Image
                    alt={`扫码加入${industry.title}群聊`}
                    className="aspect-square w-full rounded-md bg-white object-cover"
                    height={96}
                    src="/code.png"
                    width={96}
                  />
                  <p className="mt-2 text-xs font-medium text-[#6b6b76]">
                    扫码入群
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
