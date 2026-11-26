```json
{
  "task": "DSA-113",
  "gate": "review-and-merge",
  "date": "2026-11-26",
  "owner": "helifiora",
  "command": "git merge-base --is-ancestor 9b17f3919bc530cb8a30b975478b3af8da7e108b origin/v/5.0.0",
  "exit_code": 0,
  "sha": "243c00b3271f3c6211b533d36b70813bee4901e0",
  "external_origin": null
}
```
# DSA-113 — `review-and-merge`
PR #199 (`fix/ajustes-prioridade-3`) was merged into `v/5.0.0` on 2026-11-26 12:28:08Z at commit `440c5539`. The PR head, `9b17f391`, is an ancestor of the tip of the integration branch.
PR #199 also carries other tasks; the evidence of each one points to the same PR.
## How the review went
**No review is recorded on the pull request.** The GitHub API lists no review on PR #199, so there is no Copilot review to cite and no thread to answer. The rule of `AGENTS.md` (Copilot reviews every pull request) is not evidenced for this PR. This record states that gap and does not fill it.
## Command
```text
git merge-base --is-ancestor 9b17f3919bc530cb8a30b975478b3af8da7e108b origin/v/5.0.0
```
## Output
No output. Exit code `0`: the PR head is an ancestor of `origin/v/5.0.0`, checked at `243c00b3271f3c6211b533d36b70813bee4901e0`.
## Proof commands, run again on 2026-11-26
Run on `243c00b3`, the tip of `v/5.0.0` (it contains the PR), not on the PR head:
| Command | Result |
|---|---|
| `npm run build:tokens` | exit 0 |
| `npm run test:tokens` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run test:i18n` | exit 0 |
| `git diff --check` | exit 0 |
| `npm run test:operacao` | exit 0 |
| `npm test` | 254 of 255 files and 11302 of 11303 tests pass. The one failure, `nph-context-menu.test.ts` (the contextmenu event the browser adds to the key), passes alone (120 of 120) and is a timing flake under full-suite load |
| `npm run build:lib` | exit 0 |
| `npm run test:package` | exit 0 |
| `npm run build-storybook` | exit 0 |
| `npm run test:naming` | fails on 16 words in `design.md` and in the tasks DSA-122 to DSA-127, and one unused exception for `DSA-58.md`; none belongs to this task |
## What was checked in the code
`color/primary-on-surface` of Educacao in light resolves to `core/educacao/800` (`#664412`), which is 8.22:1 over `color/muted` (`#f5f8fd`, computed), above the 4.5:1 the task asks for.
The PR diff was compared with the goal of the task in the current source, not only with the test result.

## Still open
- The Copilot review of PR #199 is not on record (above).
- The `test:naming` failures belong to the documents that carry them, not to this task.
