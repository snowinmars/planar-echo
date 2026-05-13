# planar-echo

[\[Russian\]](README.ru.md) \[English\]

Tool to run Infinity Engine games in a browser.

Uses your original game files locally.


## Legal

It is legal as long as you own the original game.

Planar-echo requires you to own the game, otherwise it won't work. Everything runs locally: data never leaves your PC.

Due to this, this tool is not piracy: planar-echo does not contain neither distribute copyrighted content.

Think of planar-echo like an emulator.


## Status

Tech demo.

Planar-echo is under heavy development.


### What works today

- Supported games:
  - Planescape: Torment (enchanted edition only)
- Converting original game files to json
 - .cre
 - .dlg
 - .eff
 - .ids
 - .ini
 - .itm
 - .tlk
- Russian and english localzations are fully supported
- Render dialogues in browser, no logic behind


### Close range roadmap

- Cz, de, fr, ko, pl translations are possible - ask community to validate them
- Implement logic for dialogues
- Allow to pack jsons back to biff to boost modding community
- Provide .sh/.exe/.apk artifacts with game content to run without reconverting again


### Licensing note

Planar-echo contains of five parts:

| Name             | Description   | License                               |
|:-----------------|:--------------|:-------------------------------------|
| planar-asclepius | backend        | licensed under the repository license |
| planar-ghost     | build artifact | licensed under original game license <br /> not affected by the repository license |
| planar-prism     | parser         | licensed under the repository license |
| planar-shared    | shared package | licensed under the repository license |
| planar-shell     | frontend       | licensed under the repository license |


## How it works (short version)

1. You provide original game
2. You setup conversion flow in planar-shell UI using planar-asclepius server
3. Planar-asclepius runs planar-prism to dismantle original game files to jsons and js files
4. Planar-shell run js sources provided by planar-asclepius


## How to run


### With docker

1. You provide original game
1. `docker compose build`
1. `docker compose up`

It serves both backend and frontend using reverse proxy.

### Without Docker

1. You provide original game
1. Install [nodejs](https://nodejs.org/)
1. Install [yarn](https://yarnpkg.com/)
1. Run `./start.sh` on linux or `./start.ps1` on windows
1. Open `http://localhost:3003/`


## How to contribute

Issues and PRs on [GitHub](https://github.com/snowinmars/planar-echo/).

```bash
# install all packages except planar-shared
yarn --cwd ./planar-asclepius
yarn --cwd ./planar-prism
yarn --cwd ./planar-shared
yarn --cwd ./planar-shell

# install planar-shared package
yarn --cwd ./planar-shared start
yarn --cwd ./planar-asclepius add file:../planar-shared --force
yarn --cwd ./planar-prism     add file:../planar-shared --force
yarn --cwd ./planar-shell     add file:../planar-shared --force

# in one terminal start frontend
# in will run on hardcoded url http://localhost:3000
# it will use hardcoded backend url http://localhost:3003
yarn --cwd ./planar-shell start

# in other terminal start backend
# in will run on hardcoded url http://localhost:3003
yarn --cwd ./planar-asclepius start
```
