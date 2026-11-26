```json
{
  "task": "DSA-110",
  "gate": "review-and-merge",
  "date": "2026-11-26",
  "owner": "helifiora",
  "command": "git merge-base --is-ancestor 6a19b6837d3b92c1cbdef6cbb27645bb38fa77a4 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "9a017796",
  "external_origin": null
}
```
# DSA-110 — `review-and-merge`
PR #207 (`feat/dsa-110-button-junction-hooks`) gave the `nph-button` the corner hooks per logical side
(`--nph-button-radius-inline-*`, `--nph-button-focus-border-radius-inline-*`, `--nph-button-focus-halo-radius-inline-*`),
the halo color hook `--nph-button-focus-halo`, and the held tooltip of an icon-only button with `aria-haspopup="menu"`.
It also changed the sheet, the Metadata and `docs/decisoes-tecnicas.md` (P142). No token was created or changed and the
`nph-tooltip` was not changed.
It was merged on 2026-11-26 (18:44:49Z), at commit `9a017796`, by `helifiora`. The PR head, `6a19b68`, is an ancestor
of the tip of the integration branch.
## How the review went
**No review is recorded on the pull request.** The API lists no review and no review comment on PR #207. The Copilot
review was requested with `gh pr edit 207 --add-reviewer @copilot` and with the API, but `reviewRequests` stayed
empty, so it is not confirmed that it was registered. The rule of `AGENTS.md` (the merge waits for the last Copilot
review of the current head) is not evidenced for this PR. This record states that gap and does not fill it.
## The pipeline at the PR head
On `6a19b68` the Build stage and the Storybook pipeline passed and the **Test stage failed**. The log of that build was
not read for this record. The two tests known to fail on the base, the token contracts of `nph-sidebar` and
`nph-notification`, fail the same way without this change.
## Command
```text
git merge-base --is-ancestor 6a19b6837d3b92c1cbdef6cbb27645bb38fa77a4 origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `6a19b68` is an ancestor of `v/5.0.0`.
## Proof commands
Run on the branch before the PR, with the code unchanged by the two commits after it (the last one only records the task):
| Command | Result |
|---|---|
| `npm run build:tokens` | exit 0 |
| `npm run test:tokens` | exit 0 |
| `npm run typecheck` | exit 0 (also on the merged base) |
| `npm run test:i18n` | exit 0 |
| `npm run test:operacao` | exit 0 |
| `npm run build-storybook` | exit 0 |
| `git diff --check` | exit 0 |
| `npx vitest run src/components/nph-button` | 225 of 225 tests pass |
| `npm test` | **fails**: 2 tests in 2 files; 11330 of 11332 tests pass |
| `npm run test:naming` | **fails** on `design.md` and `docs/operacao/tarefas`, files this task did not touch; not run on the base |
| `npm run test:spelling` | not run to the end: it did not finish in 10 minutes |
On the merged base (`9a017796`), the tests of `nph-button`, `nph-tooltip`, `nph-notification`, `nph-sidebar` and
`nph-popconfirm` were run again: 1056 of 1058 pass. The two failures are the token contracts of `nph-notification` and
`nph-sidebar`; the sidebar one fails the same way on `origin/v/5.0.0` without this change, and so does the
notification one.
## Still open
- The Copilot review of PR #207 is not on record (above), and the log of the failing Test stage was not read.
- `npm run test:naming`, `npm run test:spelling` and the two token contracts are not fixed by this task.
