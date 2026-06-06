FROM node:26-alpine AS package
WORKDIR /app/

# to yarn workspaces
# E:\prg\snowinmars\planar-echo\
# yarn is required for internal planar usage
RUN npm install -g yarn

COPY ./planar-asclepius/package.json ./planar-asclepius/
COPY ./planar-asclepius/yarn.lock    ./planar-asclepius/
COPY ./planar-prism/package.json     ./planar-prism/
COPY ./planar-prism/yarn.lock        ./planar-prism/
COPY ./planar-shared/package.json    ./planar-shared/
COPY ./planar-shared/yarn.lock       ./planar-shared/
COPY ./planar-shell/package.json     ./planar-shell/
COPY ./planar-shell/yarn.lock        ./planar-shell/

RUN yarn --cwd ./planar-asclepius/ --frozen-lockfile
RUN yarn --cwd ./planar-prism/     --frozen-lockfile
RUN yarn --cwd ./planar-shared/    --frozen-lockfile
RUN yarn --cwd ./planar-shell/     --frozen-lockfile



FROM package AS build
WORKDIR /app/

COPY --from=package /app/ .
RUN mkdir -p ./planar-ghost/
COPY . .

RUN yarn --cwd ./planar-shared/    start
RUN yarn --cwd ./planar-asclepius/ add file:../planar-shared/ --force
RUN yarn --cwd ./planar-prism/     add file:../planar-shared/ --force
RUN yarn --cwd ./planar-shell/     add file:../planar-shared/ --force

RUN yarn --cwd ./planar-asclepius/ build
RUN yarn --cwd ./planar-asclepius/ gen
RUN yarn --cwd ./planar-prism/     build
RUN yarn --cwd ./planar-shell/     build

# this may look like a nonsence, but.
# A user may want to convert game without docker, so it have something in the ghost folder
# and serve it through the docker, so it would be a good idea to refresh the data
RUN yarn --cwd ./planar-prism/     build-ghost



FROM build AS run
WORKDIR /app/

COPY --from=build /app/ .

CMD yarn --cwd ./planar-asclepius/ serve
