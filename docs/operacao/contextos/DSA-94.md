```json
{
  "task": "DSA-94",
  "worktree": "/home/helielton_fioramonte/Work/IATec.Nephos",
  "start_sha": "f919605",
  "end_sha": "271c7601"
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
Branch rebased on `origin/v/5.0.0` (`9bd901c6`) and pull request #193 opened to `v/5.0.0`, Copilot review requested. On the final head: `build:tokens`, `test:tokens`, `typecheck`, `test:i18n`, `test:operacao`, `build:lib`, `test:package` and `build-storybook` pass; `npm test` has 11060 of 11066 passing. The tree select has 72 tests, and its stories pass the a11y check. The 6 failures (`nph-notification` stories, `nph-carousel`, `nph-togglebutton`, `nph-tooltip`) are the same on `origin/v/5.0.0` at `f9196052`, with no code of this branch; DSA-116 tracks the token tests. `test:naming` fails only on `DSA-100`, `DSA-101` and `DSA-102`. `test:spelling` did not finish in this environment; `cspell` on the touched files has no issue.
## Evidence
Pull request https://github.com/iatecbr/IATec.Nephos/pull/193. The `review-and-merge` gate stays `pending` until the merge.
## Blocker
None.
## Next command
Answer each review thread of the Copilot, fix with a regression test when it is a defect, push and request a new review of the new head: `gh pr edit 193 --add-reviewer @copilot`. After the merge, move the task to `done` and pass the `review-and-merge` gate.
