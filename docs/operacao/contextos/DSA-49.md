```json
{
  "task": "DSA-49",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-18-nph-radio-266b51",
  "start_sha": "e839be0",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-table` in the contract of the `figma-docs-accepted` evidence: columns, rows and
footer given by property and drawn as a native table; the two sizes, the frame, the fixed header,
the stripe and the grid; the caption with description, total and action; the composite cells;
the expanding row, the tree and the two-level header; the empty body. Write the sheet, the
Metadata and P97.

## Sources opened
- `docs/operacao/tarefas/DSA-49.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — typography roles, `icones_nucleo`, the uses that name a table; the `table/*`
  tokens in `src/tokens/`
- `docs/decisoes-tecnicas.md` — P62.1, P72, P86, P90, P91
- `src/components/nph-button/`, `nph-badge/`, `nph-avatar/`, `nph-skeleton/`, `nph-tooltip/`,
  `nph-empty/` and `nph-image/`
- `scripts/test-package.mjs` — one definition per component folder

## Changes
The piece, the stories, the Docs page, the dictionary, the sheet, the Metadata and P97. See the
commits on the branch.

## Commands run
- `npm ci`, then `npm run test:naming` on the base before the first commit, to separate the
  findings that already exist.

## Result
In progress; the proof commands run before the pull request opens.

## Evidence
None recorded: `review-and-merge` waits for the merge.

## Blocker
None. D1 to D8 wait for Indiane and do not block: the category content stays out until D1, and
the code follows the defaults written in each question.

## Next command
Open the pull request to `v/5.0.0`; after the merge, record the `review-and-merge` evidence and
move the task to done.
