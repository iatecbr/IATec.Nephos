```json
{
  "task": "DSA-58",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/sweet-ritchie-681a57",
  "start_sha": "29f9418f667f1f2e9257662a67f0c59aed624428",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-data-table` in the contract accepted in Figma: the table to search, sort, select and
act on records, built on nph-table, with the nph-toolbar above it, the bulk bar in its place
while rows are selected, row actions in an nph-dropdown-menu, the ajuste column with an
nph-switch and the footer with nph-pagination; with tests, stories, the Storybook dictionary and
the sheet.

## Sources opened
- `docs/operacao/tarefas/DSA-58.md` and `docs/operacao/evidencias/DSA-58/documentacao-figma-aceita-2026-10-28.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-table/`, `src/components/nph-toolbar/`, `src/components/nph-pagination/`,
  `src/components/nph-dropdown-menu/`, `src/components/nph-checkbox/` and the sheets of the pieces it uses
- `src/tokens/generated/tokens.css`: the `data-table/*` and `table/*` tokens

## Changes
- `src/components/nph-data-table/`: component, CSS, unit tests, demo frame, Validation stories,
  Docs page and its test.
- `src/components/nph-table/nph-table.ts`: protected extension points that draw, by default,
  what the table already drew, and the development messages under the tag that reports them.
  The tests of nph-table did not change (P105, item 1).
- `.storybook/i18n/`: `dataTableDocs`, `dataTableValidation`, the sidebar labels and the claims,
  in `en`, `pt-BR` and `es`.
- `fichas/nph-data-table.md` and the generated `src/shared/metadata/nph-data-table.json`.
- `docs/decisoes-tecnicas.md`: P105.
- `custom-elements-manifest.config.mjs`: a superclass module is read as its source file.
- `src/shared/docs/usage.test.ts`, `cspell.config.yaml` and `scripts/language-exceptions.json`.
- The task: D-1 to D-6 for Indiane.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- `npx vitest run --project unit src/components/nph-data-table src/components/nph-table src/shared`
- `npx vitest run --project storybook src/components/nph-data-table`
- `node scripts/verificar-operacao.mjs --gerar-metadata`
- `npm run build:tokens`, `npm run test:tokens`, `npm test`, `npm run typecheck`, `npm run test:i18n`,
  `npm run test:naming`, `npm run test:spelling`, `npm run test:operacao`, `npm run build-storybook`,
  `npm run build:lib`, `npm run test:package` and `git diff --check`

## Result
The component, its stories, its sheet and P105 are on the branch `feat/dsa-58-data-table`. Sorting,
selection with the bulk bar and its count, the menu of the more and the empty by search state with
its button were also checked by hand in Storybook, in light and dark.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`gh pr create --base v/5.0.0`
