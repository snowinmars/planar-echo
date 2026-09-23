# Third-party notices

planar-echo source is distributed under [GPL-3.0-or-later](LICENSE). This file records third-party material incorporated into, adapted by, or downloaded through the project. It does not relicense game data, user input, generated Ghost output, or trademarks. See [LEGAL.md](LEGAL.md).

## GemRB

Portions of the following files were independently adapted from or checked against GemRB:

- `planar-prism/src/steps/4b.raw2assets/algo/audio/decodeAcm.ts`
- `planar-prism/src/steps/4b.raw2assets/writeAreWalks.ts`
- `planar-shared/src/creAnimation.ts`

Upstream sources:

- [ACM unpacker](https://github.com/gemrb/gemrb/blob/04eba1cb28b71325a014d41a94d8e334b0a465b2/gemrb/plugins/ACMReader/unpacker.cpp)
- [PST terrain table](https://github.com/gemrb/gemrb/blob/04eba1cb28b71325a014d41a94d8e334b0a465b2/gemrb/unhardcoded/pst/terrain.2da)
- [Orientation definitions](https://github.com/gemrb/gemrb/blob/04eba1cb28b71325a014d41a94d8e334b0a465b2/gemrb/core/Orientation.h)

Copyright: Contributors to the GemRB project. The cited sources are licensed `GPL-2.0-or-later`; the terrain table receives that designation through GemRB's `REUSE.toml`. planar-echo's adaptations and modifications are distributed under `GPL-3.0-or-later`.

## Near Infinity

The following files contain implementations, mappings, or format behavior adapted from or checked against Near Infinity:

- `planar-prism/src/shared/xor.ts`
- `planar-prism/src/steps/4.biffs2json/pstee/bcs/context/buildBcsContext.ts`
- `planar-prism/src/steps/4.biffs2json/pstee/bcs/context/buildBcsContext.const.ts`
- `planar-prism/src/steps/4.biffs2json/pstee/cre/v10/parsers/1.parseHeaderV10.types.ts`
- `planar-prism/src/steps/4.biffs2json/pstee/cre/v11/parsers/1.parseHeaderV11.types.ts`

Upstream: [Near Infinity](https://github.com/NearInfinityBrowser/NearInfinity), copyright its contributors, licensed under [GNU LGPL 2.1](https://github.com/NearInfinityBrowser/NearInfinity/blob/50021b834e0360c6400a6a818626b50edabdd868/LICENSE.txt). Incorporated portions are conveyed as part of this GPL-3.0-or-later work as permitted by LGPL 2.1 section 3.

`xor.ts` also downloads `StaticSimpleXorDecryptor.java` from Near Infinity's public `master` branch at runtime and extracts its 64-byte key into a local cache. That upstream file and fetched content remain under Near Infinity's terms.

## node-ask

`planar-prism/src/node-ask/` was refactored from [intervalia/node-ask](https://github.com/intervalia/node-ask/tree/c04e4adba6a7c962e173b208d7a639f9e9d5198d).

Copyright (c) 2014-2015 Michael Glen Collins. Licensed under the MIT License.

## Font Awesome

`planar-shell/src/svg/github.tsx` adapts the GitHub brand icon from Font Awesome Free 5.15.4 into a React component.

Font Awesome Free 5.15.4 by Fonticons, Inc. Icons are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The icon has been reformatted as TSX and styled through `currentColor`. Brand icons and names remain trademarks of their respective owners.

## Bootstrap Icons

`planar-shell/src/svg/translation.tsx` adapts the Bootstrap Icons `translate` icon.

Copyright (c) 2019-2024 The Bootstrap Authors. Licensed under the MIT License.

## Magic sphere

The complex path in `planar-shell/src/svg/convert/Step5Shield.tsx` is adapted from Ivan Bogachev's public CodePen [Magic sphere](https://codepen.io/sfi0zy/pen/JOrGjX), first published in 2017. Public Pens are licensed under the MIT License by the [CodePen Terms of Service](https://blog.codepen.io/legal/terms-of-service/). The path is recolored, scaled, and composed with an independently drawn shield.

## MIT License text

The following terms apply separately to the node-ask, Bootstrap Icons, and Magic sphere material identified above:

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## Wikimedia Commons material

- `planar-shell/src/svg/steam.tsx` adapts [Steam icon logo.svg](https://commons.wikimedia.org/wiki/File:Steam_icon_logo.svg), marked public domain on Wikimedia Commons. Steam and its logo remain trademarks of Valve Corporation.
- `planar-shell/src/svg/ussr.tsx` adapts [Hammer and sickle.svg](https://commons.wikimedia.org/wiki/File:Hammer_and_sickle.svg), marked public domain because the shape is ineligible for copyright on Wikimedia Commons. The component is retained but is not used by the current UI. National restrictions on political symbols may still apply.

Public-domain status does not grant trademark, personality, insignia, or other non-copyright rights.

## WeiDU downloader

At the user's request, `planar-asclepius/src/services/fs/download/weidu/action.ts` downloads unmodified WeiDU v251.00 release archives directly from the [WeiDU GitHub release](https://github.com/WeiDUorg/weidu/releases/tag/v251.00) into the ignored local `planar-weidu/` directory. WeiDU is not bundled in this repository.

WeiDU's `COPYING` contains GNU GPL version 2 and an additional permission allowing unmodified binaries to be redistributed free of conditions. WeiDU and its notices remain the property of their respective authors.

## Pending provenance records

The following retained brand artwork has no open-license grant recorded in this repository. No GPL, MIT, or public-domain status is claimed for it:

- `planar-shell/src/svg/gog.tsx` — GOG wordmark;
- `planar-shell/src/svg/telegram.tsx` — Telegram logo;
- `planar-shell/src/svg/weidu.tsx` — a trace based on the WeiDU website favicon.

These names and marks belong to their respective owners. Primary brand-kit, license, or permission records are still required.

## Package dependencies

Dependencies installed from the JavaScript package ecosystem retain the licenses and notices distributed in their own packages. This document does not replace those package-level notices.
