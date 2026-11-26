```json
{
  "task": "DSA-108",
  "gate": "review-and-merge",
  "date": "2026-11-26",
  "owner": "helifiora",
  "command": "git merge-base --is-ancestor 60d3117e197e93a82fb5586ac32940ea2bec42d0 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "453747ef",
  "external_origin": null
}
```
# DSA-108 — `review-and-merge`

PR #206 (`feat/dsa-108-icones-editor-nph-icon`) added `rotate-left`, `strikethrough`, `list-ul`, `list-ol`,
`block-quote` and `text-slash` to the `nph-icon` core, each with its `light` and `solid` artwork. It also added
the six names to `icones_nucleo.acao` in `design.md`, to the `acao` category of `nph-icon.demo.ts`, and a test
block that proves each name is a core name, is listed in `design.md` and draws a different artwork in `light`
and in `solid`. No token, no `nph-rich-text-editor` code and no Figma change.

It was merged on 2026-11-26 (17:29:35Z), at commit `90eaa815`, by `helifiora`. The PR head, `60d3117`, is an
ancestor of the tip of the integration branch.

## How the review went

**No review is recorded on the pull request.** The GitHub API lists no review and no review comment on PR #206.
The Copilot review was requested with `gh pr edit 206 --add-reviewer @copilot`, but the request does not show
in `reviewRequests`, so it is not confirmed that it was registered. The rule of `AGENTS.md` (the merge waits for
the last Copilot review of the current head) is not evidenced for this PR. This record states that gap and does
not fill it.

## The pipeline at the PR head

On `60d3117` the Build stage and the Storybook pipeline passed and the **Test stage failed**. The log of that
build was not read for this record. The failing test known on the base at the time is the token contract of
`nph-sidebar` (the `panel-menu/expand-*` tokens, DSA-98 item 6), which fails the same way on
`origin/v/5.0.0` without this change.

## Command

```text
git merge-base --is-ancestor 60d3117e197e93a82fb5586ac32940ea2bec42d0 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `60d3117` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`453747ef`.

## Proof commands

Run on the branch before the last commit (`a06c178`, which holds the whole change), and run again, for the icon
tests and the typecheck only, on `60d3117` (the last commit only removed the quotes of the `strikethrough` key):

| Command | Result |
|---|---|
| `npm run build:tokens` | exit 0 |
| `npm run test:tokens` | exit 0 |
| `npm run typecheck` | exit 0 (also on `60d3117`) |
| `npm run test:i18n` | exit 0 |
| `npm run test:operacao` | exit 0 |
| `npm run build-storybook` | exit 0 |
| `git diff --check` | exit 0 |
| `npx vitest run src/components/nph-icon` | 88 of 88 tests pass (also on `60d3117`) |
| `npm test` | **fails**: 1 test in 1 file; 11316 of 11317 tests pass |
| `npm run test:naming` | **fails**: one unused exception, for a word in `DSA-58.md`; it fails the same way without this change |

The failing test is the token contract of `nph-sidebar`, not caused by this task.

On the merged base (`453747ef`), the tests of `nph-icon`, `nph-notification` and `nph-sidebar` were run again:
727 of 729 pass. The two failures are the token contract of `nph-notification` (`notification/stack-gap`, DSA-103)
and of `nph-sidebar` (`panel-menu/expand-*`, DSA-98); both wait for the removal of a token, which is Claude's.
None is in `nph-icon`.

## Still open

- The Copilot review of PR #206 is not on record (above).
- `npm run test:naming` and the token contracts of `nph-sidebar` and `nph-notification` are not fixed by this
  task.
- DSA-105 (`nph-rich-text-editor`) had this task as a dependency; its other blocker is its own.
