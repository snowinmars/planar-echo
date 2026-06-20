# syntax=docker/dockerfile:1

FROM node:26-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
# TODO [snow]: yarn is required for internal planar usage. Change the code and remove the yarn
ENV COREPACK_DEFAULT_ACQUIRE_TIMEOUT=180000
RUN npm install -g corepack && corepack enable && corepack prepare yarn@4.16.0 --activate

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY planar-shared/package.json    ./planar-shared/
COPY planar-prism/package.json     ./planar-prism/
COPY planar-asclepius/package.json ./planar-asclepius/
COPY planar-shell/package.json     ./planar-shell/
RUN yarn install --immutable

FROM deps AS build
COPY planar-shared    ./planar-shared
COPY planar-prism     ./planar-prism
COPY planar-asclepius ./planar-asclepius
COPY planar-shell     ./planar-shell
COPY planar-ghost     ./planar-ghost
RUN yarn build
# this may look like a nonsence, but.
# A user may want to convert game without docker, so it have something in the ghost directory
# and serve it through the docker later
# so it would be a good idea to refresh the data
RUN yarn workspace @planar/prism build-ghost

FROM node:26-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV COREPACK_DEFAULT_ACQUIRE_TIMEOUT=180000
RUN npm install -g corepack && corepack enable && corepack prepare yarn@4.16.0 --activate

COPY --from=build /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/planar-shared ./planar-shared

COPY --from=build /app/planar-prism/package.json ./planar-prism/
COPY --from=build /app/planar-asclepius/package.json ./planar-asclepius/
COPY --from=build /app/planar-shell/package.json ./planar-shell/

COPY --from=build /app/planar-prism/dist/ ./planar-prism/dist/
COPY --from=build /app/planar-asclepius/dist/ ./planar-asclepius/dist/
COPY --from=build /app/planar-shell/dist/ ./planar-shell/dist/

COPY --from=build /app/planar-ghost/ ./planar-ghost/

EXPOSE 3003
CMD ["node", "/app/planar-asclepius/dist/index.js"]
