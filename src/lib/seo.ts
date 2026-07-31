import type { Metadata } from "next";

export const siteConfig = {
  name: "HermesCN 中文社区",
  shortName: "HermesCN",
  url: "https://hermescn.org",
  description:
    "Hermes Agent 中文社区与协作网络，聚合中文文档、Agent Skills、前沿实践与真实项目，帮助个人成长，连接生态伙伴，并为企业提供 AI Agent 场景探索与落地服务。",
  locale: "zh_CN",
  language: "zh-CN",
  social: {
    github: "https://github.com/HermesCNOrg",
    x: "https://x.com/hermescn_org",
  },
} as const;

type PageMetadata = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
