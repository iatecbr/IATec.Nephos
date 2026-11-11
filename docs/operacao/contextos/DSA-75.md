```json
{
  "task": "DSA-75",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/funny-darwin-e93804",
  "start_sha": "7ea324419fa18a286125cd1237902300321ac9ed",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-tree` in the contract accepted in Figma on 2026-11-11: a list of items in levels where each branch opens and closes and the person chooses one item or several, in the three selections (none, single, multiple), with the first load, the load on demand with its error row and the empty tree, with tests, stories and the spec. The Tree Select and the Tree Table are other pieces and the tree of `nph-table` does not change.

## Sources opened
- `docs/operacao/tarefas/DSA-75.md` and `docs/operacao/evidencias/DSA-75/figma-docs-accepted-2026-11-11.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` (the `tree/*` uses) and `docs/operacao/component-handoff.md`
- `src/components/nph-stepper/`, `nph-table/`, `nph-dropdown-menu/`, `nph-checkbox/`, `nph-tooltip/`, `nph-context-menu/`, `nph-spinner/`, `nph-skeleton/` and `nph-empty/` as patterns; the sheets of `nph-checkbox` and `nph-context-menu`; P101 and P117
- `src/tokens/generated/tokens.css`: the `tree/*` tokens

## Changes
Component, CSS and tests of `nph-tree`; the stories (Validation), the Docs page, the dictionaries in three languages, the sheet `fichas/nph-tree.md` with its Metadata, P118 in `docs/decisoes-tecnicas.md`, and the word `multiselectable` in the spelling dictionary.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-75-tree origin/v/5.0.0` and `npm ci`
- `npx vitest run --project unit src/components/nph-tree`
- `node scripts/verificar-operacao.mjs --gerar-metadata`
- the twelve proofs in sequence: `build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`, `test:spelling`, `test:operacao`, `build-storybook`, `build:lib`, `test:package`, `git diff --check`

## Result
The task is in review on the branch `feat/dsa-75-tree`. The component, its tests, stories, sheet and P118 are written; D-1 and D-2 wait for Indiane and do not block the pull request.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`gh pr view --json reviews,reviewThreads`
