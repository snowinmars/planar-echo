$ErrorActionPreference = "Stop"
yarn --cwd ./planar-shared build
yarn --cwd ./planar-asclepius add file:../planar-shared --force
yarn --cwd ./planar-prism     add file:../planar-shared --force
yarn --cwd ./planar-shell     add file:../planar-shared --force

# from root:
# cd planar-shared ; node .\node_modules\typescript\bin\tsc ; node .\node_modules\tsc-alias\dist\bin\index.js ; cd .. ; cd planar-asclepius ; npm i ../planar-shared --force  ; cd .. ; cd planar-prism ; npm i ../planar-shared --force  ; cd .. ; cd planar-shell ; npm i ../planar-shared --force  ; cd .. ;
