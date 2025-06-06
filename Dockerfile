# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

EXPOSE 3000
CMD ["bun", "dev"]