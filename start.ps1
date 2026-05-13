yarn --cwd ./planar-shared start
yarn --cwd ./planar-asclepius add file:../planar-shared --force
yarn --cwd ./planar-prism     add file:../planar-shared --force
yarn --cwd ./planar-shell     add file:../planar-shared --force

yarn --cwd ./planar-prism compile
yarn --cwd ./planar-shell build

yarn --cwd ./planar-asclepius start
