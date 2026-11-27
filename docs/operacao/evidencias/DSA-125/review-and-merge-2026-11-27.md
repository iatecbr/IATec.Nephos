```json
{
  "task": "DSA-125",
  "gate": "review-and-merge",
  "date": "2026-11-27",
  "owner": "elvys",
  "command": "git merge-base --is-ancestor bbd8a93f16f805a79d9c9977efe6bdb4b5137634 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "243c00b3",
  "external_origin": null
}
```
# DSA-125 — `review-and-merge`
PR 202 (`fix/contratos-de-token-pos-fundacao-2026-11-26`) gave the row trigger of `nph-collapsible` the `start`, `tag` and `end` slots, shown only when filled, with `collapsible/tag-gap`, tests, stories, the sheet and the Metadata.
It was merged by helifiora on 2026-11-26T15:27:46Z, at commit `243c00b3`. The code commit is `bbd8a93f`, an ancestor of the tip of the integration branch.
## How the review went
**PR 202 has no review, from Copilot or from a person.** `gh pr view 202` lists no review. The merge was done by the author. The task record stayed `ready` after the merge; this record closes it.
**Proofs.** `npx vitest run src/components/nph-scheduler src/components/nph-collapsible` on `v/5.0.0` at `272acbf2`: 10 files, 468 tests, all passed. The other proof commands were not run again for this record. `node scripts/verificar-operacao.mjs` was run on the record itself.
## Command
```text
git merge-base --is-ancestor bbd8a93f16f805a79d9c9977efe6bdb4b5137634 origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `bbd8a93f` is an ancestor of `v/5.0.0`.
## Still open
- PR 202 has not had a Copilot review.
