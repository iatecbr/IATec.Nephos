```json
{
  "task": "DSA-126",
  "gate": "review-and-merge",
  "date": "2026-11-27",
  "owner": "elvys",
  "command": "git merge-base --is-ancestor 4d48afe92a0d32930f964f98b954375fce76520a origin/v/5.0.0",
  "exit_code": 0,
  "sha": "e5c02840",
  "external_origin": null
}
```
# DSA-126 — `review-and-merge`
The option of the `nph-sidebar` floating panel reads `sidebar/flyout-item-radius` (8) and its focus border (9) and halo (13); the item and subitem of the fixed menu keep 12. Merged in a batch with DSA-74.
PR 213 (`feat/ajustes-dsa-126-dsa-74`) was merged by helifiora on 2026-11-27, at commit `e5c02840`. The PR head, `4d48afe9`, is an ancestor of the tip of the integration branch.
## How the review went
**PR 213 has no review, from Copilot or from a person.** `gh pr view 213` lists no review. The merge was done by the author.
**Proofs.** `npx vitest run src/components/nph-sidebar` on `v/5.0.0` at `e5c02840`: 119 of 120 passed. The one failure is the token contract test on `--nph-panel-menu-expand-duration`, which belongs to DSA-98 (the token leaves in Claude's part) and also fails without this change. The other proof commands were not run again for this record. `node scripts/verificar-operacao.mjs` was run on the record itself.
## Command
```text
git merge-base --is-ancestor 4d48afe92a0d32930f964f98b954375fce76520a origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `4d48afe9` is an ancestor of `v/5.0.0`.
## Still open
- PR 213 has not had a Copilot review.
