# HermesCN 中文社区

HermesCN 中文社区是一个基于 Next.js 的社区网站，文档站使用 Docusaurus 构建，并以静态文件形式同步到 `public/docs`。

## 本地开发

```bash
pnpm install
pnpm dev
```

常用检查：

```bash
pnpm typecheck
pnpm lint
```

## 推荐部署方式

生产环境建议使用 **Docker 多阶段构建 + Next.js standalone 产物**，不建议直接将完整源码目录长期放在服务器上运行。

这个仓库同时包含 Next.js 主站和 Docusaurus 文档站。执行完整安装时，pnpm workspace 会在根目录的 `node_modules` 中集中保存两个项目的依赖；Docusaurus、Webpack、TypeScript、Tailwind 和其他构建工具只在构建期间需要，但它们会让源码目录占用数 GB 空间。即使这些依赖没有上传，也会在服务器执行 `pnpm install` 和构建时重新产生。

Docker 多阶段构建可以把“构建环境”和“运行环境”分开：

1. 构建阶段复制源码并安装完整依赖。
2. 构建 Docusaurus，将最终静态文件同步到 `public/docs`。
3. 构建 Next.js standalone 产物。
4. 运行阶段只复制 standalone、`.next/static` 和 `public`。
5. 服务器直接运行产物，不再执行 `pnpm install`，也不保留完整源码、构建缓存和文档站依赖。

最终运行镜像中主要保留：

```text
app/
├── server.js
├── node_modules/       # standalone 自动收集的运行时依赖
├── public/
│   └── docs/           # Docusaurus 静态产物
└── .next/
    └── static/
```

这样做的主要原因：

- 显著减少服务器磁盘占用，避免保留完整的 workspace `node_modules`。
- 构建和运行都在 Linux 容器中完成，避免 macOS 与 Linux 原生依赖不兼容。
- 每次部署都是独立镜像，不会在项目目录中持续累积 `.next`、Webpack 和 Docusaurus 缓存。
- 版本回滚只需切换镜像，不需要重新安装依赖或恢复源码目录。

需要注意：

- Docker 本身不会自动减小体积，必须使用多阶段构建，并且最终阶段只复制运行产物。
- Next.js 需要启用 `output: "standalone"`；standalone 默认不会自动复制 `public` 和 `.next/static`，构建镜像时需要显式复制。
- 不建议在 macOS 本地构建后直接上传运行产物，应在 Linux CI、Docker 或 Linux 服务器的构建阶段完成。
- Docker 构建缓存和旧镜像仍会占用磁盘，应按服务器的发布保留策略定期清理。

仓库已经提供 `Dockerfile`、`.dockerignore` 和 `compose.yaml`。Docker 构建时会自动启用 standalone，不影响现有的 Cloudflare/OpenNext 构建方式。

Docker 项目和镜像统一使用 `hermescn-website`；镜像展示名称为 `HermesCN-website`。Docker 镜像仓库名要求使用小写字符，因此配置中的技术标识采用小写形式。

### 运维部署

首次部署先准备环境变量：

```bash
cp .env.example .env
```

编辑 `.env`，至少将示例中的域名、密钥和第三方服务配置替换为生产环境值。然后构建并启动：

```bash
docker compose up -d --build
```

默认映射到宿主机的 `3000` 端口。如需更换宿主机端口：

```bash
APP_PORT=8080 docker compose up -d --build
```

常用运维命令：

```bash
# 查看容器状态
docker compose ps

# 查看实时日志
docker compose logs -f web

# 拉取新代码后重新构建并更新
docker compose up -d --build

# 停止服务
docker compose down
```

`compose.yaml` 目前只负责网站容器，不会创建数据库容器，也不会自动执行数据库迁移。现有认证功能如果需要连接数据库，仍通过 `.env` 中的 `DATABASE_URL` 指向外部数据库。
