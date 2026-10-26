```json
{
  "task": "DSA-31",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-31-nph-multi-combobox-4b7aff",
  "start_sha": "695e5c2",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-multi-combobox` and its internal chip (component, CSS, tests,
stories, Docs page, sheet, P96 and Metadata), from the contract in the
`figma-docs-accepted` evidence, with the form pattern of P80, the field
contract of P83, the option of P91 with the `checkbox` marker, and the list of
P95.

## Sources opened
- `docs/operacao/tarefas/DSA-31.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-combobox/` (P95), `src/components/nph-option/` (P91),
  `src/components/nph-input/` (P80), `src/components/nph-field/` (P83),
  `src/components/nph-checkbox/` (P81), `src/components/nph-badge/` (P68),
  `src/components/nph-dropdown-menu/` (P92)
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P80, P83, P91, P92, P95

## Changes
`nph-multi-combobox` and its chip (component, CSS, tests), the `checkbox` marker of
`nph-option` (amendment of P91), six Validation stories, the Docs page, the dictionaries
in the three languages, the sheet and its Metadata, and P96. See the commits on the
branch.

## Commands run
- `npm ci`, then `node scripts/verificar-operacao.mjs` before the commit.
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `test:naming`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.

## Result
In review in PR #125.

## Evidence
The proof table is in the description of PR #125. `review-and-merge` waits for the merge.

## Blocker
None. D-1 to D-4 wait for Indiane and do not block.

## Next command
Wait for the review of PR #125.
