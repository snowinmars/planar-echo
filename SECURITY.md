# Security policy

planar-echo is an active, source-built tech preview. Security support is best-effort for the current `master` branch; there are no supported release lines or response-time guarantees yet.

## Reporting a vulnerability

Send security-sensitive reports privately to [snowinmars@yandex.ru](mailto:snowinmars@yandex.ru). Do not publish an exploit, credentials, private paths, game data, or unnecessary personal information in a GitHub issue.

Include:

- the affected revision and platform;
- the exposed component or trust boundary;
- minimal reproduction steps;
- the realistic impact;
- any suggested mitigation.

Use [public issues](https://github.com/snowinmars/planar-echo/issues) only for non-sensitive hardening and ordinary defects.

## Current trust model

- Runtime mods are trusted executable JavaScript, not sandboxed packages. `server.js` inherits the daemon's Node.js permissions and `client.js` runs with the Shell origin's browser privileges.
- A manifest, version, hash, or successful validation identifies an artifact; it does not make the artifact safe.
- The local backend has no hardened multi-user authentication boundary. Its network exposure depends on the configured host environment and firewall.
- Source game files, Ghost output, local defaults, and runtime mods may contain sensitive local paths or third-party content. Do not attach them to public reports.
- Multiplayer, untrusted-mod isolation, and hostile-network deployment are not currently supported security claims.

Reports about code escaping these documented trust assumptions are in scope. A deliberately malicious trusted mod exercising its documented ambient permissions is not, by itself, a sandbox escape.
