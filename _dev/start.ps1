$ErrorActionPreference = "Stop"
./reinstall-shared.ps1

yarn --cwd ../planar-prism build
yarn --cwd ../planar-shell build

yarn --cwd ../planar-asclepius start
