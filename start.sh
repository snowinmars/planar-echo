set -e
./reinstall-shared.sh

yarn --cwd ./planar-prism compile
yarn --cwd ./planar-shell build

yarn --cwd ./planar-asclepius start
