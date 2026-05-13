FROM node:26-alpine AS package
WORKDIR /app

COPY ./planar-asclepius/package.json ./planar-asclepius/
COPY ./planar-asclepius/yarn.lock    ./planar-asclepius/
COPY ./planar-prism/package.json     ./planar-prism/
COPY ./planar-prism/yarn.lock        ./planar-prism/
COPY ./planar-shared/package.json    ./planar-shared/
COPY ./planar-shared/yarn.lock       ./planar-shared/
COPY ./planar-shell/package.json     ./planar-shell/
COPY ./planar-shell/yarn.lock        ./planar-shell/

RUN yarn --cwd ./planar-asclepius --frozen-lockfile
RUN yarn --cwd ./planar-prism     --frozen-lockfile
RUN yarn --cwd ./planar-shared    --frozen-lockfile
RUN yarn --cwd ./planar-shell     --frozen-lockfile

COPY . .

RUN yarn --cwd ./planar-shared start
RUN yarn --cwd ./planar-asclepius add file:../planar-shared --force
RUN yarn --cwd ./planar-prism     add file:../planar-shared --force
RUN yarn --cwd ./planar-shell     add file:../planar-shared --force

RUN yarn --cwd ./planar-prism compile
RUN yarn --cwd ./planar-shell build

RUN yarn --cwd ./planar-asclepius start
