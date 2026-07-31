import React, { type ReactNode } from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { PageMetadata } from "@docusaurus/theme-common";

const defaultKeywords = [
  "Hermes Agent",
  "Hermes 中文社区",
  "AI Agent",
  "Agent Skills",
];

export default function DocItemMetadata(): ReactNode {
  const { metadata, frontMatter, assets } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const image = assets.image ?? frontMatter.image ?? "/og-image.png";
  const keywords = frontMatter.keywords ?? defaultKeywords;
  const url = new URL(metadata.permalink, siteConfig.url).toString();
  const isTutorial = metadata.id.startsWith("tutorials/");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": url,
    mainEntityOfPage: url,
    url,
    headline: metadata.title,
    description: metadata.description,
    ...(metadata.lastUpdatedAt
      ? { dateModified: new Date(metadata.lastUpdatedAt).toISOString() }
      : {}),
    image: new URL(image, siteConfig.url).toString(),
    inLanguage: "zh-CN",
    articleSection: isTutorial ? "Hermes Agent 实践教程" : "Hermes Agent 文档",
    learningResourceType: isTutorial ? "Tutorial" : "Documentation",
    about: {
      "@type": "SoftwareApplication",
      name: "Hermes Agent",
      applicationCategory: "DeveloperApplication",
      url: "https://hermes-agent.nousresearch.com/",
    },
    author: {
      "@type": "Organization",
      "@id": "https://hermescn.org/#organization",
      name: "HermesCN 中文社区",
      url: "https://hermescn.org",
    },
    publisher: {
      "@id": "https://hermescn.org/#organization",
    },
    isPartOf: {
      "@id": "https://hermescn.org/#website",
    },
  };

  return (
    <>
      <PageMetadata
        title={metadata.title}
        description={metadata.description}
        keywords={keywords}
        image={image}
      />
      <Head>
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
    </>
  );
}
