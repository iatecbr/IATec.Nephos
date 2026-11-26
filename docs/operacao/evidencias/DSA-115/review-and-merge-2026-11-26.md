```json
{
  "task": "DSA-115",
  "gate": "review-and-merge",
  "date": "2026-11-26",
  "owner": "elvys",
  "command": "git merge-base --is-ancestor d215be8ab91ce23b13919e108cfbcb8637875969 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "8088eb72",
  "external_origin": null
}
```
# DSA-115 — `review-and-merge`
PR 209 (`feat/dsa-115-decisoes-23-11`) applied in the code the answers Indiane gave on 2026-11-23 to the pending
decisions of DSA-23, DSA-34, DSA-40, DSA-41, DSA-45, DSA-58, DSA-69 and DSA-96, and brought the texts that still called
those points open to the answers. The nine rows of the table of the task, as recorded in the context file of the pass:
- `nph-toggle-group` roving tabindex (DSA-23 D5).
- `nph-input-otp` digits-only property and the resend action on the Docs page (DSA-41 D2 and D4).
- `nph-checkbox` and `nph-switch` hover from outside, turned on by `nph-dropdown-menu` (DSA-45 D-3).
- `nph-empty` illustrations embedded in the package, with the asset lines of the library build and the lines of
  `docs/consuming*.md` removed (DSA-40 D1 and D4).
- `nph-data-table` third click removes the sort (DSA-58 D-3).
- `nph-context-menu` `nph-open` and `nph-close` events (DSA-69 D-2).
- `nph-date-picker` shortcut and typed period against unavailable days (DSA-96 D-15).
- `nph-label` `use_when` item 3 (DSA-34 D-2).
- Docs sweep of `docs/decisoes-tecnicas.md`, the sheets and the dictionaries.
It was merged by helifiora on 2026-11-26T21:10:08Z, at commit `8088eb72`. The PR head, `d215be8`, is an ancestor of the
tip of the integration branch.
## How the review went
**The pull request has no review, from Copilot or from a person.** `gh pr view 209` lists no review. The merge was
done by the author.
**Proofs.** The proofs below come from the context file of the pass, written before the pull request. They were not run
again on the merge commit when this record was written.
- Exit 0: `build:tokens`, `test:tokens`, `typecheck`, `test:i18n`, `test:operacao`, `test:package`, `build-storybook`
  and `git diff --check`.
- Not exit 0: `npm test` (2 tests: the token contracts of `nph-notification` and `nph-sidebar`) and `test:naming` (the
  sheets of DSA-127 and DSA-128). The context file records that both fail the same way on `origin/v/5.0.0`, so they do
  not come from this change. That comparison was not repeated for this record.
## Command
```text
git merge-base --is-ancestor d215be8ab91ce23b13919e108cfbcb8637875969 origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `d215be8` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `8088eb72`.
## Still open
- `npm test` fails in 2 tests and `test:naming` fails on the DSA-127 and DSA-128 sheets, on the base too. They need an
  owner outside this task.
- The change has not had a Copilot review.
