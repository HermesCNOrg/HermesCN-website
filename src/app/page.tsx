import { Card } from "@heroui/react";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-[0.18em] text-muted uppercase">
            HermesCN
          </span>
        </header>

        <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-muted">
              HermesCN 中文社区
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
              HermesCN 中文社区
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              一个轻量的项目首页。当前仅保留 Next.js 前端入口、
              Better Auth 鉴权逻辑和 Prisma 用户相关数据结构。
            </p>
          </div>

          <div className="grid gap-4">
            <Card className="border border-white/10 bg-surface/80">
              <Card.Header>
                <Card.Title>首页</Card.Title>
                <Card.Description>
                  保留一个干净的首页，用 Tailwind 和 HeroUI 作为 UI 基础。
                </Card.Description>
              </Card.Header>
            </Card>

            <Card className="border border-white/10 bg-surface-secondary/80">
              <Card.Header>
                <Card.Title>鉴权</Card.Title>
                <Card.Description>
                  后端保留 Better Auth、邮件服务和用户会话相关逻辑。
                </Card.Description>
              </Card.Header>
            </Card>

            <Card className="border border-white/10 bg-surface-tertiary/80">
              <Card.Header>
                <Card.Title>数据库</Card.Title>
                <Card.Description>
                  Prisma schema 只保留鉴权需要的用户、账号、会话和验证表。
                </Card.Description>
              </Card.Header>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
