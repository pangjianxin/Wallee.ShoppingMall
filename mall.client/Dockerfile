# syntax=docker/dockerfile:1.4


#FROM node:20-alpine AS base

ARG PNPM_VERSION=10.28.1
ARG NPM_MIRROR=https://registry.npmmirror.com

FROM node:24-alpine3.20 AS base
# Patch base image packages to mitigate known vulnerabilities
RUN apk --no-cache upgrade
ARG NPM_MIRROR
ENV COREPACK_INTEGRITY_KEYS=0 \
	NPM_CONFIG_REGISTRY=${NPM_MIRROR} \
	PNPM_REGISTRY_URL=${NPM_MIRROR}

# 安装依赖

FROM base AS deps
ARG PNPM_VERSION
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* .npmrc* ./
# 使用 BuildKit cache 挂载 pnpm store，避免每次都从网络重新下载依赖
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
	corepack enable pnpm \
	&& npm config set registry "$NPM_CONFIG_REGISTRY" \
	&& corepack prepare pnpm@${PNPM_VERSION} --activate \
	&& pnpm install --frozen-lockfile --store-dir /root/.pnpm-store


# Rebuild the source code only when needed

FROM base AS builder
ARG PNPM_VERSION
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 可选：禁用 Next.js telemetry
# ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm \
	&& corepack prepare pnpm@${PNPM_VERSION} --activate \
	&& pnpm run build

# Production image, copy all the files and run next

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# 可选：禁用 Next.js telemetry
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# 利用 Next.js output traces 减小镜像体积
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.env.production ./.env.production
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

