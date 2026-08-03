import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import fs from "node:fs";
import path from "node:path";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const mainSiteBaseUrl =
  process.env.DOCUSAURUS_MAIN_SITE_BASE_URL ?? "https://hermescn.org";

const docsBaseUrl = process.env.DOCUSAURUS_BASE_URL ?? "/";

const mainSiteHref = (pathname: string) => `${mainSiteBaseUrl}${pathname}`;
const siteDescription =
  "Hermes Agent 中文文档与教程，覆盖安装、配置、Agent Skills、常见问题和实践案例。";

type SearchIndexItem = {
  title: string;
  url: string;
  content: string;
};

const docsDir = path.join(__dirname, "docs");

function stripFrontMatter(source: string) {
  return source.replace(/^---[\s\S]*?---/, "").trim();
}

function getFrontMatterTitle(source: string) {
  const frontMatter = source.match(/^---([\s\S]*?)---/);
  const title = frontMatter?.[1].match(/^title:\s*(.+)$/m)?.[1];

  return title?.replace(/^['"]|['"]$/g, "").trim();
}

function getMarkdownTitle(source: string) {
  return stripFrontMatter(source)
    .match(/^#\s+(.+)$/m)?.[1]
    ?.trim();
}

function getDocsFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getDocsFiles(fullPath);
    }

    return /\.(md|mdx)$/.test(entry.name) ? [fullPath] : [];
  });
}

function getDocUrl(filePath: string) {
  const relativePath = path.relative(docsDir, filePath);
  const withoutExtension = relativePath.replace(/\.(md|mdx)$/, "");
  const segments = withoutExtension
    .split(path.sep)
    .map((segment) => segment.replace(/^\d+-/, ""));
  const fileName = segments.at(-1);

  if (fileName === "index") {
    return `/${segments.slice(0, -1).join("/")}`;
  }

  return `/${segments.join("/")}`;
}

function createSearchIndex(): SearchIndexItem[] {
  return getDocsFiles(docsDir).map((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    const content = stripFrontMatter(source)
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`[\]()]|!\[[^\]]*\]\([^)]+\)/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      title:
        getFrontMatterTitle(source) ??
        getMarkdownTitle(source) ??
        path.basename(filePath),
      url: getDocUrl(filePath),
      content,
    };
  });
}

const config: Config = {
  title: "HermesCN",
  tagline: "Hermes Agent 安装、配置与实践指南",
  favicon: "img/favicon.png",
  headTags: [
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://hermescn.org/#website",
        url: "https://hermescn.org",
        name: "HermesCN",
        alternateName: ["Hermes Agent 中文社区", "Hermes 中文社区"],
        description: siteDescription,
        inLanguage: "zh-CN",
        publisher: {
          "@id": "https://hermescn.org/#organization",
        },
      }),
    },
  ],
  customFields: {
    mainSiteBaseUrl,
    githubHref: "https://github.com/HermesCNOrg",
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  // Set the production url of your site here
  url: "https://hermescn.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: docsBaseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "lxdao",
  projectName: "hermesCN_org",

  onBrokenLinks: "warn",

  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
    localeConfigs: {
      "zh-Hans": {
        label: "简体中文",
        htmlLang: "zh-Hans",
      },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: undefined,
        },
        blog: {
          routeBasePath: "blog",
          blogTitle: "HermesCN 博客",
          blogDescription:
            "记录 HermesCN 的社区建设、个人实践、项目协作与行业观察。",
          showReadingTime: true,
          blogSidebarCount: 0,
          postsPerPage: 10,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          ignorePatterns: [
            "/blog/archive",
            "/blog/tags/**",
            "/docs/blog/archive",
            "/docs/blog/tags/**",
          ],
          lastmod: "date",
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    function localSearchIndexPlugin() {
      return {
        name: "local-search-index",
        async loadContent() {
          return createSearchIndex();
        },
        async postBuild({ content, outDir }) {
          fs.writeFileSync(
            path.join(outDir, "search-index.json"),
            JSON.stringify(content, null, 2),
          );
        },
      };
    },
  ],

  themeConfig: {
    image: "img/hermescn-social-card.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "HermesCN",
      logo: {
        alt: "HermesCN 中文社区",
        src: "img/favicon.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          label: "文档",
          position: "left",
          className: "hermes-section-link hermes-section-link--documentation",
        },
        {
          type: "docSidebar",
          sidebarId: "tutorials",
          label: "教程",
          position: "left",
          className: "hermes-section-link hermes-section-link--tutorial",
        },
        {
          to: "/blog",
          label: "博客",
          position: "left",
          className: "hermes-section-link hermes-section-link--blog",
        },
        { type: "custom-main-site", position: "right" },
        { type: "custom-github", position: "right" },
        { type: "custom-search", position: "right" },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "网站地图",
          items: [
            { label: "首页", href: mainSiteHref("/"), target: "_self" },
            { label: "文档", to: "/getting-started/quickstart" },
            { label: "教程", to: "/tutorials/" },
            { label: "博客", to: "/blog" },
            { label: "Skills", href: mainSiteHref("/skills"), target: "_self" },
            {
              label: "实践案例",
              href: mainSiteHref("/best-practices"),
              target: "_self",
            },
            {
              label: "解决方案",
              href: mainSiteHref("/services"),
              target: "_self",
            },
          ],
        },
        {
          title: "社区方向",
          items: [
            { label: "中文文档", to: "/getting-started/quickstart" },
            {
              label: "Skills 实践",
              href: mainSiteHref("/skills"),
              target: "_self",
            },
            { label: "本地部署", to: "/getting-started/installation" },
            {
              label: "解决方案支持",
              href: mainSiteHref("/services"),
              target: "_self",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} HermesCN 中文社区. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
