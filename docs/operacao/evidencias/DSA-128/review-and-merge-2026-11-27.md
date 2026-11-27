```json
{
  "task": "DSA-128",
  "gate": "review-and-merge",
  "date": "2026-11-27",
  "owner": "elvys",
  "command": "git merge-base --is-ancestor 6cb207ef357b8886185050838f4d5a56dedc427f origin/v/5.0.0",
  "exit_code": 0,
  "sha": "3911a7b9",
  "external_origin": null
}
```
# DSA-128 — `review-and-merge`
The rich `nph-option` aligns its parts to the top, with the start icon, dot, texts and check dropped by the content offset token, with stories, tests and the sheets.
PR 211 (`feat/dsa-124-dsa-128-option`) was merged by helifiora on 2026-11-27, at commit `3911a7b9`. The PR head, `6cb207ef`, is an ancestor of the tip of the integration branch.
## How the review went
**PR 211 has no review, from Copilot or from a person.** `gh pr view 211` lists no review. The merge was done by the author.
**Proofs.** npx vitest run on `nph-select`, `nph-option`, `nph-rich-option`, `nph-tree-select` and others on `v/5.0.0` at `e5c02840`: all passed in those pieces. The other proof commands were not run again for this record. `node scripts/verificar-operacao.mjs` was run on the record itself.
## Command
```text
git merge-base --is-ancestor 6cb207ef357b8886185050838f4d5a56dedc427f origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `6cb207ef` is an ancestor of `v/5.0.0`.
## Still open
- PR 211 has not had a Copilot review.
