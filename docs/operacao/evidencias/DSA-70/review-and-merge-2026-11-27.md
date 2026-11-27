```json
{
  "task": "DSA-70",
  "gate": "review-and-merge",
  "date": "2026-11-27",
  "owner": "elvys",
  "command": "git merge-base --is-ancestor e9de12293d13a2c1f29629f6d126917a7f2ded65 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "272acbf2",
  "external_origin": null
}
```
# DSA-70 — `review-and-merge`
The last row of the table, `nph-table` (`table/link-foreground` in dark), is closed. The token part was already on
`v/5.0.0` since 2026-11-26 (T-1). PR 212 (`feat/dsa-70-table-link-dark`) renamed the test `link in dark mode` in
`nph-table.test.ts` to compare `--nph-table-link-foreground` with `--nph-theme-brand-text-dark`, instead of
`theme/brand-200`. It was merged by helifiora on 2026-11-27T11:03:59Z, at commit `272acbf2`. The code commit is
`e9de1229`, an ancestor of the tip of the integration branch.
Every other row was merged earlier by PR 163 (evidence `review-and-merge-partial-2026-11-09.md`). With PR 212 all
rows of the table are in the code and merged.
## How the review went
**PR 212 has no review, from Copilot or from a person.** `gh pr view 212` lists no review. The merge was done by the
author.
**Proofs.** The proof commands were not run again for this record. Only `node scripts/verificar-operacao.mjs` was run,
on the record itself.
## Command
```text
git merge-base --is-ancestor e9de12293d13a2c1f29629f6d126917a7f2ded65 origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `e9de1229` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `272acbf2`.
## Still open
- PR 212 has not had a Copilot review.
- DSA-45 D-3, DSA-62 D-2, DSA-67 D-3 and DSA-69 D-1 and D-2 stay open in their own tasks, as the task already said.
