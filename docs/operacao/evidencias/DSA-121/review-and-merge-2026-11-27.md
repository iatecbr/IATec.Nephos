```json
{
  "task": "DSA-121",
  "gate": "review-and-merge",
  "date": "2026-11-27",
  "owner": "elvys",
  "command": "git merge-base --is-ancestor 1e63295e32141215149992bbce8f52b9d8563f86 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "aa704d81",
  "external_origin": null
}
```
# DSA-121 — `review-and-merge`
The nph-sidebar has the background property, neutral or brand.
PR 214 (`feat/dsa-123-dsa-129-dsa-121`) was merged on 2026-11-27, at commit `aa704d81`. The PR head, `1e63295e`, is an ancestor of the tip of the integration branch.
## How the review went
**PR 214 has no review, from Copilot or from a person.** `gh pr view 214` lists no review and no thread. The Copilot review was requested and did not arrive before the merge.
**Proofs.** Before the PR: `typecheck`, `test:tokens`, `test:i18n`, `test:operacao`, `build-storybook` and `git diff --check` exit 0. `npm test` had 3 failures that fail the same way on the base (`nph-sidebar` panel menu token family, `nph-notification`) and `test:naming` fails only in `design.md` and in tasks DSA-125 to DSA-127. The proofs were not run again on the merge commit.
## Command
```text
git merge-base --is-ancestor 1e63295e32141215149992bbce8f52b9d8563f86 origin/v/5.0.0
```
## Output
No output. Exit code `0`: commit `1e63295e` is an ancestor of `v/5.0.0`.
## Still open
- PR 214 has not had a Copilot review.
