```json
{
  "task": "DSA-127",
  "gate": "review-and-merge",
  "date": "2026-11-26",
  "owner": "elvys",
  "command": "git merge-base --is-ancestor 17f3159a012714337f6613b5f75e30f62ad2711c origin/v/5.0.0",
  "exit_code": 0,
  "sha": "194746a4",
  "external_origin": null
}
```
# DSA-127 — `review-and-merge`
PR 210 (`feat/dsa-127-skeleton-switch`) changed the line shape of `nph-skeleton` to a box of
`--nph-skeleton-line-box-height` (20) with the bar of `--nph-skeleton-line-height` (16) centered, and dropped the
`nph-switch` label in the default size by `--nph-switch-label-offset` (2), with stories, tests and the two sheets.
It was merged by helifiora on 2026-11-26T23:47:21Z, at commit `194746a4`. The code commit is `b4ba8168`; the PR head,
`17f3159a`, is an ancestor of the tip of the integration branch.
## How the review went
**The pull request has no review, from Copilot or from a person.** `gh pr view 210` lists no review and no review
request. The merge was done by the author.
**Proofs.** The proof commands were not run again for this record. Only `node scripts/verificar-operacao.mjs` was run,
on the record itself.
## Command
```text
git merge-base --is-ancestor 17f3159a012714337f6613b5f75e30f62ad2711c origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `17f3159a` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `194746a4`.
## Still open
- The change has not had a Copilot review.
