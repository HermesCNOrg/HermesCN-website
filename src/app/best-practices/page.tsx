import { type Metadata } from "next";

import { PracticeCases } from "./practice-cases";

export const metadata: Metadata = {
  title: "实践案例 | HermesCN 中文社区",
  description: "来自 Hermes Agent 社区的真实故事与使用案例。",
};

export default function BestPracticesPage() {
  return <PracticeCases />;
}
