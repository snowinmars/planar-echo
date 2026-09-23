# Legal and Content Policy

This document describes the project's intended content policy. It is **not legal advice**, does not establish that any particular use is lawful, and needs review by a qualified legal specialist. Laws, licenses, and exceptions vary by jurisdiction and circumstance.

## Purpose and interoperability

planar-echo is an independent implementation intended to enable interoperability with user-provided Infinity Engine game data. It converts data from a user's own installation into local formats used by an independently developed browser workbench and runtime.

That technical purpose is not a legal conclusion. Users and contributors are responsible for complying with applicable law and the terms governing their copies of games and other software.

## Independent project and trademarks

planar-echo is not affiliated with, sponsored by, endorsed by, approved by, or developed with the consent of any publisher, developer, platform operator, or rights holder associated with Infinity Engine games.

Game titles, engine names, company names, and other trademarks are used descriptively to identify compatibility, required source data, or observed behavior. All trademarks and associated goodwill belong to their respective owners.

## Game data and local output

- Users must provide their own legally acquired source game data.
- The repository and project releases do not distribute the original game's data files or original game asset files.
- Conversion output is created locally and may reproduce or transform third-party content. That content remains subject to the rights and license terms of its owners.
- planar-echo does not grant permission to redistribute source game files or generated output. Users must determine whether any proposed use or distribution is authorized.
- Documentation screenshots may depict user-provided game content for identification or demonstration; they do not grant rights in the depicted material.

## License scope

planar-echo project source is licensed under the [GNU General Public License, version 3 or later](LICENSE). The GPL does not relicense third-party game content, third-party dependencies under their own terms, user-provided input, or locally generated output. Rights in those materials remain governed by their respective owners and applicable terms.

Confirmed third-party code, data, and artwork incorporated into the repository are identified in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Those materials retain their own notices and terms.

The maintainer currently does not sell planar-echo or operate a paid planar-echo service. This is a statement of current project practice, not an additional license restriction. The GPL permits commercial redistribution and support when its terms are followed.

## Fair use and interoperability exceptions

Fair use, fair dealing, interoperability, reverse-engineering, archival, or similar exceptions may exist in some jurisdictions. They are jurisdiction-dependent, fact-specific, and **not guaranteed**. This project does not claim that any exception necessarily applies to a user's or contributor's activity.

## Executable mods

planar-echo mods are trusted executable code, not sandboxed data. A mod's `server.js` can inherit the local daemon's filesystem, network, and process permissions; `client.js` runs with the privileges available to application code in the Shell browser origin. Manifests, versions, validation, or future hashes identify or describe artifacts but do not establish that they are safe. Install only mods from trusted sources.

Mods distributed for use with planar-echo are expected to use GPL-compatible license terms and to preserve every applicable third-party notice. A mod manifest or successful load does not establish license compatibility.

## Contributions and provenance

Contributors must have the right to submit every part of a contribution and to license it under the project's terms. Do not submit:

- original or converted game data;
- copied game source code, scripts, dialogue, artwork, audio, maps, or other copyrighted content;
- third-party material without compatible permission and required attribution;
- machine-local paths, personal data, credentials, or generated local runtime directories.

Behavioral descriptions and independently written compatibility code should be limited to what is necessary for the contribution. Maintainers may reject or remove material when its provenance or authorization is unclear.

## Contact and takedown requests

For private rights, attribution, or takedown concerns, email [snowinmars@yandex.ru](mailto:snowinmars@yandex.ru). For non-sensitive concerns, you may instead open a [GitHub issue](https://github.com/snowinmars/planar-echo/issues). Identify:

- the exact repository path or URL;
- the material at issue;
- your relationship to the relevant rights;
- the requested action and a way to follow up.

Do not post confidential documents, credentials, or unnecessary personal information in a public issue.

This policy should be revisited as distribution, packaged releases, multiplayer, or content handling changes, and it requires specialist legal review before being treated as comprehensive.
