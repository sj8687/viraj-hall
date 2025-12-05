FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY ./packages ./packages 
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json
COPY ./apps/backend ./apps/backend

RUN pnpm install --frozen-lockfile

RUN pnpm run db:generate

RUN pnpm run build

EXPOSE 8080

CMD ["pnpm", "run", "start:backend"]