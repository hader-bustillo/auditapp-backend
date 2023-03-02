FROM public.ecr.aws/docker/library/node:16-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Dockerfile that builds and deploys app to AWS ECS
FROM public.ecr.aws/docker/library/node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
CMD ["npx", "sequelize db:migrate"]
ENTRYPOINT ["npm", "run start"]