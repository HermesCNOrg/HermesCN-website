# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS dependencies

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY docs-site/package.json ./docs-site/package.json
COPY prisma/schema.prisma ./prisma/schema.prisma

ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone
ENV NO_UPDATE_NOTIFIER=1
ENV BETTER_AUTH_SECRET="docker-build-only-secret-not-used-at-runtime"
ENV BETTER_AUTH_URL="http://localhost:3000"
ENV BETTER_AUTH_GITHUB_CLIENT_ID="docker-build"
ENV BETTER_AUTH_GITHUB_CLIENT_SECRET="docker-build"
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/docs-site/node_modules ./docs-site/node_modules
COPY --from=dependencies /app/generated ./generated
COPY . .

RUN pnpm build

FROM node:22-bookworm-slim AS runner

WORKDIR /app

LABEL org.opencontainers.image.title="HermesCN-website"

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then((response)=>{if(!response.ok)process.exit(1)}).catch(()=>process.exit(1))"]

CMD ["node", "server.js"]
