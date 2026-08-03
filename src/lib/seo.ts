import type { Metadata } from "next";

export const siteConfig = {
  name: "HermesCN",
  shortName: "HermesCN",
  url: "https://hermescn.org",
  description:
    "HermesCN 是面向中文用户的 Hermes Agent 社区，提供中文文档、安装教程、Agent Skills 与实践案例，帮助你更快完成安装、配置，并把 Hermes Agent 用到真实任务中。",
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
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
}: PageMetadata): Metadata {
  return {
    title,
    description,
    keywords,
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
