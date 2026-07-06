import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import fs from 'node:fs';
import path from 'node:path';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const mainSiteBaseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3078'
    : 'https://hermes-cn-org.vercel.app';

const docsBaseUrl = process.env.NODE_ENV === 'development' ? '/' : '/docs/';

const mainSiteHref = (pathname: string) => `${mainSiteBaseUrl}${pathname}`;

type SearchIndexItem = {
  title: string;
  url: string;
  content: string;
};

const docsDir = path.join(__dirname, 'docs');

function stripFrontMatter(source: string) {
  return source.replace(/^---[\s\S]*?---/, '').trim();
}

function getFrontMatterTitle(source: string) {
  const frontMatter = source.match(/^---([\s\S]*?)---/);
  const title = frontMatter?.[1].match(/^title:\s*(.+)$/m)?.[1];

  return title?.replace(/^['"]|['"]$/g, '').trim();
}

function getMarkdownTitle(source: string) {
  return stripFrontMatter(source).match(/^#\s+(.+)$/m)?.[1]?.trim();
}

function getDocsFiles(dir: string): string[] {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getDocsFiles(fullPath);
    }

    return /\.(md|mdx)$/.test(entry.name) ? [fullPath] : [];
  });
}

function getDocUrl(filePath: string) {
  const relativePath = path.relative(docsDir, filePath);
  const withoutExtension = relativePath.replace(/\.(md|mdx)$/, '');
  const segments = withoutExtension.split(path.sep);
  const fileName = segments.at(-1);

  if (fileName === 'index') {
    return `/${segments.slice(0, -1).join('/')}`;
  }

  return `/${segments.join('/')}`;
}

function createSearchIndex(): SearchIndexItem[] {
  return getDocsFiles(docsDir).map((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    const content = stripFrontMatter(source)
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_`[\]()]|!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      title: getFrontMatterTitle(source) ?? getMarkdownTitle(source) ?? path.basename(filePath),
      url: getDocUrl(filePath),
      content,
    };
  });
}

const config: Config = {
  title: 'HermesCN 中文文档',
  tagline: 'Hermes Agent 中文社区文档',
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://hermes-cn-org.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: docsBaseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lxdao',
  projectName: 'hermesCN_org',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en', 'zh-Hant'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
        htmlLang: 'zh-Hans',
      },
      en: {
        label: 'English',
        htmlLang: 'en',
      },
      'zh-Hant': {
        label: '繁體中文',
        htmlLang: 'zh-Hant',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    function localSearchIndexPlugin() {
      return {
        name: 'local-search-index',
        async loadContent() {
          return createSearchIndex();
        },
        async postBuild({content, outDir}) {
          fs.writeFileSync(
            path.join(outDir, 'search-index.json'),
            JSON.stringify(content, null, 2),
          );
        },
      };
    },
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'HermesCN 文档',
      logo: {
        alt: 'HermesCN 中文社区',
        src: 'img/favicon.png',
      },
      items: [
        {type: 'custom-search', position: 'right'},
        {href: mainSiteHref('/'), label: '主站', position: 'right', target: '_self'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '网站地图',
          items: [
            {label: '首页', href: mainSiteHref('/'), target: '_self'},
            {label: '文档', to: '/intro'},
            {label: '论坛', href: mainSiteHref('/forum'), target: '_self'},
            {label: 'Skill', href: mainSiteHref('/skill'), target: '_self'},
            {label: '最佳实践', href: mainSiteHref('/best-practices'), target: '_self'},
            {label: '解决方案', href: mainSiteHref('/services'), target: '_self'},
          ],
        },
        {
          title: '社区方向',
          items: [
            {label: '中文文档', to: '/intro'},
            {label: 'Skills 实践', href: mainSiteHref('/skill'), target: '_self'},
            {label: '本地部署', to: '/intro'},
            {label: '解决方案支持', href: mainSiteHref('/services'), target: '_self'},
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
