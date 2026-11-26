```json
{
  "task": "DSA-111",
  "gate": "review-and-merge",
  "date": "2026-11-26",
  "owner": "helifiora",
  "command": "git merge-base --is-ancestor d499e54b7ea5e2a30ab27b1e15848519c63c5dd3 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "11f550a8bf88e83af06b2ad5b87fffa8acd99fc1",
  "external_origin": null
}
```
# DSA-111 — `review-and-merge`
PR #208 (`feat/dsa-111-dropdown-menu-align`) was merged into `v/5.0.0` on 2026-11-26 19:21:34Z at commit `11f550a8`. The PR head, `d499e54b`, is an ancestor of the tip of the integration branch.
## How the review went
**No review is recorded on the pull request.** The GitHub API lists no review on PR #208, so there is no Copilot review to cite and no thread to answer. The rule of `AGENTS.md` (Copilot reviews every pull request) is not evidenced for this PR. This record states that gap and does not fill it.
## Command
```text
git merge-base --is-ancestor d499e54b7ea5e2a30ab27b1e15848519c63c5dd3 origin/v/5.0.0
```
## Output
No output. Exit code `0`, checked at `11f550a8bf88e83af06b2ad5b87fffa8acd99fc1`.
## What was checked in the code
- `nph-dropdown-menu` has the `align` property (`start` by default, `end`) in the code, the demo and the stories.
- `src/components/nph-dropdown-menu/nph-dropdown-menu.test.ts` has the tests the task asks for: end alignment 4 px below with the default staying at the start; end alignment in a right-to-left page; end alignment turning up near the bottom and staying inside the window.
- `fichas/nph-dropdown-menu.md`, `src/shared/metadata/nph-dropdown-menu.json` and the amendment of P92 in `docs/decisoes-tecnicas.md` record the alignment.
## Proof commands, run again on 2026-11-26 on `11f550a8bf88e83af06b2ad5b87fffa8acd99fc1`
| Command | Result |
|---|---|
| `npm run build:tokens` | exit 0 |
| `npm run test:tokens` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run test:i18n` | exit 0 |
| `git diff --check` | exit 0 |
| `npm run test:operacao` | exit 0 |
| `npx vitest run nph-dropdown-menu` | exit 0, 4 files and 184 tests |
| `npm run build:lib` | exit 0 |
| `npm run test:package` | exit 0 |
| `npm test` | exit 1, 254 of 256 files and 11338 of 11340 tests pass; the 2 failures are not from this task (below) |
| `npm run test:naming` | exit 1; words in the tasks DSA-122 to DSA-128 and one unused exception for `DSA-58.md`; none belongs to this task |
## Still open
- The Copilot review of PR #208 is not on record (above).
- On PR #208 the Azure checks `iatecbr.IATec.Nephos`, its Test Stage job and `iatecbr.IATec.Nephos.Storybook` are `FAILURE`. The cause was not read. The `nph-dropdown-menu` tests pass on the current tip.
- The 2 failing tests belong to DSA-103 (`notification/stack-gap` still in `semantic.tokens.json`, test in `nph-notification.test.ts`) and DSA-98 (`panel-menu/expand-*` still in `semantic.tokens.json`, test in `nph-sidebar.test.ts`): the token removal of both is pending.
