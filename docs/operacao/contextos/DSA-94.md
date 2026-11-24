```json
{
  "task": "DSA-94",
  "worktree": "/home/helielton_fioramonte/Work/IATec.Nephos",
  "start_sha": "f919605",
  "end_sha": null
}
```
## Goal of this pass
Land the three shared pieces of DSA-94 (tokens, `nph-skeleton` background, `nph-tree` error row), extract the rows of the `nph-tree` as modules (path A, decided with the code owner) and write the `nph-tree-select` with CSS, tests, stories, the Storybook dictionary, the sheet, the Metadata and decision P138.
## Sources opened
- `docs/operacao/tarefas/DSA-94.md` and `docs/operacao/evidencias/DSA-94/figma-docs-accepted-2026-11-18.md`
- `AGENTS.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-select/nph-select.ts`, `nph-combobox/nph-combobox.list.ts`, `nph-multi-combobox/nph-multi-combobox.ts`, `nph-tree/nph-tree.ts`, `nph-date-picker/nph-date-picker.ts`, `nph-popconfirm/*` as the model of the stories
## Changes
- Tokens: the `tree-select/*` group (8), `expectedCount` +8, `tokens.css` regenerated, the "DSA-94" mark out of the `tree-select/*` lines of `design.md`.
- `nph-skeleton`: background from `color/muted` to `skeleton/background`; CSS, tests, sheet, Metadata, dictionaries.
- `nph-tree`: error row that wraps; the model (`nph-tree.model.ts`) and the rows (`nph-tree.rows.ts`, `nph-tree.rows.css`) as modules the tree and the tree select share, with `data-focus` for a focus drawn with no DOM focus; the token-contract test counts only the `tree/*` tokens.
- `nph-tree-select`: component, CSS, logic, demo, Validation stories, 70 tests; dictionaries in three languages; sheet; Metadata; P138.
## Commands run
- `npm run build:tokens`, `npm run test:tokens`, `npx tsc --noEmit`, `npx vitest run nph-tree/ nph-skeleton nph-tree-select`, `npm run test:i18n`, `npm run test:naming`, `npx cspell` on the touched files, `node scripts/verificar-operacao.mjs --gerar-metadata`, `npm run build-storybook`, `npm test`
## Result
`nph-tree`, `nph-skeleton` and `nph-tree-select` tests pass (the tree select has 70); the Storybook builds; the stories of the tree select pass the a11y check inside `npm test`. The full `npm test` has 6 failures, all outside this task: `nph-notification` stories (axe contrast 4.44:1 on the dark help button), `nph-carousel` token contract (`color/marker`, DSA-114), `nph-togglebutton` (dark contrast 1.39 against 1.54 pinned) and `nph-tooltip` (balloon contrast 5.85 against 6.69), which read token values this task did not change. `test:naming` fails only on `docs/operacao/tarefas/DSA-58`, `DSA-100`, `DSA-101` and `DSA-102`.
## Evidence
None yet; no pull request.
## Blocker
None for the code. Open in the sheet: the `nph-tooltip` of a cut label is not drawn in the panel (see "Known limits" of the sheet).
## Next command
Push `feat/dsa-94-tree-select`, open the pull request to `v/5.0.0` and request the Copilot review: `gh pr edit <number> --add-reviewer @copilot`.
