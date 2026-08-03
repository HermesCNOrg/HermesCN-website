import { type Metadata } from "next";

import { createPageMetadata } from "~/lib/seo";
import { PracticeCases } from "./practice-cases";

export const metadata: Metadata = createPageMetadata({
  title: "Hermes Agent 实践案例与真实工作流",
  description:
    "汇集 Hermes Agent 中文社区的真实使用故事、前沿工作流与项目实践，帮助个人复用经验，也为企业 Agent 场景提供参考。",
  path: "/best-practices",
  keywords: [
    "Hermes Agent 使用案例",
    "Hermes Agent 实践",
    "Hermes Agent 工作流",
    "AI Agent 案例",
  ],
});

export default function BestPracticesPage() {
  return <PracticeCases />;
}
