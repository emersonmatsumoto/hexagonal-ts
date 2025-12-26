# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.3.5 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
COPY package.json bun.lock /temp/dev/
COPY packages/api/package.json /temp/dev/packages/api/
COPY packages/application/package.json /temp/dev/packages/application/
COPY packages/memory/package.json /temp/dev/packages/memory/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
COPY package.json bun.lock /temp/prod/
COPY packages/api/package.json /temp/prod/packages/api/
COPY packages/application/package.json /temp/prod/packages/application/
COPY packages/memory/package.json /temp/prod/packages/memory/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
# FROM base AS prerelease
# COPY --from=install /temp/dev/node_modules node_modules
# COPY --from=install /temp/dev/packages/api/node_modules packages/api/node_modules
# COPY --from=install /temp/dev/packages/application/node_modules packages/application/node_modules
# COPY --from=install /temp/dev/packages/memory/node_modules packages/memory/node_modules
# COPY . .

# [optional] tests & build
#ENV NODE_ENV=production
# RUN bun test
#RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/prod/packages/api/node_modules packages/api/node_modules
# COPY --from=install /temp/prod/packages/application/node_modules packages/application/node_modules
COPY --from=install /temp/prod/packages/memory/node_modules packages/memory/node_modules
COPY . .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "app" ]
