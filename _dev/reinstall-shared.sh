set -e
yarn --cwd ./planar-shared build
yarn --cwd ./planar-asclepius add file:../planar-shared --force
yarn --cwd ./planar-prism     add file:../planar-shared --force
yarn --cwd ./planar-shell     add file:../planar-shared --force
