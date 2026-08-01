import { siteConfig } from "~/lib/seo";

const content = `# ${siteConfig.name}

> ${siteConfig.description}

HermesCN 是独立的 Hermes Agent 中文社区与协作网络，不代表 Nous Research 或 Hermes 官方团队。

## 主要入口

- [HermesCN 首页](${siteConfig.url}/)：社区定位、核心能力与参与入口
- [Hermes Agent 中文文档](${siteConfig.url}/docs/)：安装、配置、功能和参考资料
- [Hermes Agent 从入门到精通](${siteConfig.url}/docs/tutorials/)：面向中文用户的实践教程
- [HermesCN 博客](${siteConfig.url}/docs/blog)：社区建设、项目协作与行业观察
- [Hermes 为什么是更好的选择](${siteConfig.url}/docs/blog/why-hermes-is-a-better-choice)：与 WorkBuddy、OpenClaw、腾讯 Marvis 的定位和适用场景对比
- [Agent Skills 中文生态](${siteConfig.url}/skills)：Skills 浏览与实践信息
- [实践案例](${siteConfig.url}/best-practices)：公开使用故事与工作流案例
- [企业生态服务](${siteConfig.url}/services)：场景判断、原型验证与落地协作

## 机器可读资源

- [文档精选索引](${siteConfig.url}/docs/llms.txt)
- [完整文档语料](${siteConfig.url}/docs/llms-full.txt)
- [Skill 静态目录](${siteConfig.url}/skills-data/manifest.json)：Skills 数据版本、数量和分片索引
- [主站 Sitemap](${siteConfig.url}/sitemap.xml)
- [文档 Sitemap](${siteConfig.url}/docs/sitemap.xml)

## 内容原则

- 技术命令、配置和能力以最新 Hermes 官方文档与实际验证为准。
- 社区教程强调可复现步骤、验收方法、安全边界与失败恢复。
- 企业相关内容区分探索、原型和正式交付，不把演示结果描述为成熟方案。
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
