# HermesCN 项目开发索引

## 项目定位

HermesCN 中文社区是一个 Next.js 站点，包含首页、社区页面、服务页面、最佳实践页面、技能页面、Better Auth 登录能力，以及一个独立的 Docusaurus 文档子项目。

## 技术栈

- 主站：Next.js App Router、React、HeroUI、Tailwind CSS
- 认证：Better Auth
- 数据库：Prisma
- 文档：Docusaurus，位于 `docs-site`
- 包管理：pnpm workspace

## 常用命令

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run check
```

文档相关：

```bash
pnpm run dev:doc
pnpm run build:doc
pnpm run docs:sync
```

## 目录索引

- `src/app`：主站页面、布局和 API 路由
- `src/app/_components`：首页专用组件
- `src/components`：跨页面公共组件
- `src/lib`：小型公共工具
- `src/server`：服务端能力，包括认证、数据库、邮件
- `src/i18n`：多语言配置和文案
- `prisma`：数据库 schema
- `docs-site`：Docusaurus 文档站
- `scripts`：开发和构建辅助脚本
- `public`：主站静态资源

## 主站入口

- 首页：`src/app/page.tsx`
- 全局布局：`src/app/layout.tsx`
- Header：`src/components/header.tsx`
- Footer：`src/components/footer.tsx`
- 文档跳转配置：`src/lib/docs-links.ts`
- `/docs` 开发环境跳转：`src/middleware.ts`

## 文档系统

开发环境：

- 主站运行在 `http://localhost:3078`
- 文档站运行在 `http://localhost:3079/docs`
- 主站里的文档链接会跳到本地文档服务

生产环境：

- `pnpm run build` 会先构建 `docs-site`
- `scripts/sync-docs.mjs` 会把 `docs-site/build` 同步到 `public/docs`
- 主站里的文档链接会指向 `/docs`

`public/docs` 和 `docs-site/build` 是构建产物，不应提交。

## 认证与数据

- Better Auth 配置：`src/server/better-auth/config.ts`
- Better Auth API 路由：`src/app/api/auth/[...all]/route.ts`
- Prisma schema：`prisma/schema.prisma`
- 数据库客户端：`src/server/db.ts`

涉及 API、服务端数据形状或 agent-facing 访问能力时，需要同步检查 `llms.txt` 相关生成逻辑。当前项目尚未看到独立的 `llms.txt` 实现文件。

## 样式与交互约定

- 全局样式在 `src/styles/globals.css`
- 首页主要模块优先放在 `src/app/_components`
- 公共导航和页脚使用 `docsHref`，不要硬编码文档地址
- 主题色背景按钮文字必须保持白色

## 开发注意事项

- 优先保持代码简洁，避免新增不必要的 helper 或中间层
- 新增用户可见文案时，检查是否需要同步多语言
- 修改文档集成时，优先保持 pnpm workspace，不要重新引入 npm lockfile
- 修改构建流程后至少运行 `pnpm run build`
