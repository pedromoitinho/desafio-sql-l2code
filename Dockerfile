FROM node:18-alpine as builder

WORKDIR /src
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm prisma generate
COPY . .
RUN pnpm run build

FROM node:18-alpine
WORKDIR /src
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN npm install -g pnpm
RUN pnpm install --prod
RUN pnpm prisma generate
COPY --from=builder /src/dist ./dist
EXPOSE 3000

CMD ["node", "./dist/index.js"]