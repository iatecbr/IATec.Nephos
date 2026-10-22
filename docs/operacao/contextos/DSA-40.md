```json
{
  "task": "DSA-40",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-40-nph-empty-6944c2",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-empty` in the contract of the `figma-docs-accepted` evidence: illustration that
follows the color scheme, heading, optional description, no action. Write the sheet, the Metadata,
the stories, the Docs page and P84, and ship the two illustrations as files of the package.

## Sources opened
- `docs/operacao/tarefas/DSA-40.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — `tokens_scheme` and the tokens named in the evidence
- `docs/decisoes-tecnicas.md` — P66, P69, P73, P75, P76, P77
- `src/components/nph-skeleton/` and `src/components/nph-tooltip/` as the format
- `vite.config.lib.ts`, `scripts/build-lib.mjs`, `scripts/test-package.mjs`

## Changes
The component, its CSS, tests, stories, demo, Docs page, dictionary, sheet, Metadata, P84 and two
lines of `vite.config.lib.ts`. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.
- The proof commands of `docs/operacao/component-handoff.md`, `npm run build:lib` and `npm run test:package`.

## Result
In review, pull request #100. The proof commands pass, except the known failures of `nph-tooltip`
(typecheck, six tests and the tsc step of build:lib) and the known `test:naming` failures in files
this branch does not touch.

## Evidence
None recorded: `review-and-merge` waits for the merge.

## Blocker
None. D1 to D3 wait for Indiane and do not block.

## Next command
Wait for the review; after the DSA-48 fix of `nph-tooltip` merges, sync with `v/5.0.0` and run the
proofs again. After the merge, record the `review-and-merge` evidence and move the task to done.
