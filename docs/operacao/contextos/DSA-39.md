```json
{
  "task": "DSA-39",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-39-nph-slider-0eb846",
  "start_sha": "b11f5b6f821b3b8d8f78b93d59a70386cb9519c9",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-slider` (component, CSS, stories, Docs page, tests, sheet, P94 and Metadata)
from the contract in the `figma-docs-accepted` evidence, with the form pattern of P80 and the
field contract of P83.

## Sources opened
- `docs/operacao/tarefas/DSA-39.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-input/`, `src/components/nph-field/`, `src/components/nph-tooltip/`,
  `src/components/nph-label/` and `src/components/nph-button/`
- `docs/decisoes-tecnicas.md` — P01, P02, P21, P62, P77, P80 and P83

## Changes
`nph-slider` (component, CSS and tests in a real browser, with the real `nph-field`), seven
Validation stories, the Docs page, the dictionaries in the three languages, the sheet and its
Metadata, and P94. The task left B1 when DSA-16 and DSA-28 were done. See the commits on the
branch.

## Commands run
- `npm ci`; `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `test:naming`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.

## Result
In review in the pull request of the branch `claude/dsa-39-nph-slider-0eb846`.

## Evidence
The proof table is in the description of the pull request. `review-and-merge` waits for the
merge.

## Blocker
None. D1 to D5 wait for Indiane and do not block.

## Follow-up
None.

## Next command
Wait for the review of the pull request.
