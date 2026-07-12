# ast-index Rules

All commands: `ast-index <command>`

## Keep Index Up To Date

After `git pull`, `git rebase`, `git checkout`, or `git switch`, run
`ast-index update`.

For active development, keep the watcher running:

```bash
ast-index watch
# or, from the current shell:
ast-index watch &
```

## Mandatory Search Rules

1. **ALWAYS use `ast-index` via Bash** for ALL code search tasks.
2. **NEVER use Grep, Glob, or `find`** as a first choice — these tools waste tokens and produce worse results.
3. **NEVER duplicate results** — if ast-index found results, that is the complete answer.
4. **Fallback ONLY if ast-index returns empty** AND you have tried at least 2 different query variations. When falling back:
   - Use `grep` (not `grep` tool) with minimal, targeted patterns
   - Use `glob` only for file-extension searches that ast-index `file` cannot handle
   - Document in your response: "ast-index returned empty for [query]; falling back to [tool]"
5. **NEVER fall back to grep/glob for**: symbol definitions, usages, callers, implementations, class hierarchy, module deps — ast-index handles all of these.

## Mandatory Read Rules

1. **ALWAYS run `ast-index outline <file>` BEFORE `Read`** for any file longer than 500 lines.
2. Use the outline to identify the specific symbol or range you need, then `Read` only that slice with `offset` / `limit`.
3. This rule is mandatory — do not bulk-read large files without an outline first.

## Rules For Subagents

When spawning any agent for code search, ALWAYS include these instructions in
the prompt. Many agent systems do not automatically pass project rules to
subagents.

```text
PRIMARY: Use `ast-index` via Bash for all code search. It is always preferred.

FALLBACK (only if ast-index returns empty after 2+ query variations):
- `grep` via Bash — for regex/string-literal search only
- `glob` via Bash — for file-extension searches only

NEVER use grep/glob for: symbol definitions, usages, callers, implementations,
class hierarchy, or module deps. ast-index handles all of these better.

Before using the Read tool on any file longer than 500 lines, first run
`ast-index outline <file>` to get its structure, then Read only the targeted
slice via offset/limit. Never bulk-read large files.
```

## Commands

- **Search:** `search`, `file`, `symbol`, `class` — find files and symbols by name
- **Usages:** `usages`, `callers`, `call-tree`, `refs` — find where symbols are used
- **Hierarchy:** `implementations`, `hierarchy`, `extensions` — class hierarchy
- **Modules:** `module`, `deps`, `dependents`, `api` — module dependencies
- **Files:** `outline`, `imports`, `changed` — file analysis
- **iOS:** `storyboard-usages`, `asset-usages`, `asset-unused` — storyboard/asset search
- **Quality:** `todo`, `deprecated` — find TODOs and deprecated items
- **Index:** `rebuild`, `update`, `watch`, `stats` — index management

## Common Use Cases

- `ast-index usages "PaymentViewController"` — where is this class used?
- `ast-index implementations "PaymentProcessing"` — what implements this protocol?
- `ast-index callers "processPayment"` — what calls this function?
- `ast-index call-tree "processPayment" -d 3` — call hierarchy
- `ast-index deps "PaymentFeature"` — module dependencies
- `ast-index dependents "NetworkKit"` — what depends on this module?
- `ast-index changed` — what changed in my branch?
- `ast-index todo` — find all TODOs
