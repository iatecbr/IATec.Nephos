```json
{
  "task": "DSA-94",
  "worktree": "/home/helielton_fioramonte/Work/IATec.Nephos",
  "start_sha": "f919605",
  "end_sha": null
}
```
## Goal of this pass
Land the three pieces of DSA-94 that do not depend on the open point "the tree as a popup": the eight `tree-select/*` tokens, the `nph-skeleton` background and the error row of the `nph-tree` that wraps. Then the `nph-tree-select` component.
## Sources opened
- `docs/operacao/tarefas/DSA-94.md` and `docs/operacao/evidencias/DSA-94/figma-docs-accepted-2026-11-18.md`
- `AGENTS.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-select/nph-select.ts`, `nph-combobox/nph-combobox.list.ts`, `nph-multi-combobox/nph-multi-combobox.ts`, `nph-tree/nph-tree.ts`, `nph-date-picker/nph-date-picker.ts` (panel placement)
## Changes
- `src/tokens/source/semantic.tokens.json`: group `tree-select` (8 tokens), `expectedCount` +8, origin; `tokens.css` regenerated; `design.md` loses the "DSA-94" mark on the `tree-select/*` lines.
- `nph-skeleton`: shape background from `color/muted` to `skeleton/background`; CSS, tests, sheet, Metadata and the three dictionaries.
- `nph-tree`: error row takes the width it has, wraps, `Try again` drops below the message; CSS, template, tests, sheet, Metadata and dictionaries. The token-contract test now leaves out `tree-select/*` and `tree-table/*` when it counts the `tree/*` tokens (the `tree-table/*` ones already broke it on the base).
## Commands run
- `git checkout -b feat/dsa-94-tree-select origin/v/5.0.0`
- `npm run build:tokens`, `npm run test:tokens`, `npx vitest run nph-tree/ nph-skeleton`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `node scripts/verificar-operacao.mjs --gerar-metadata`
## Result
Tokens, skeleton and tree error row committed on the branch (3 commits). `nph-tree` and `nph-skeleton` tests pass (246). `test:naming` fails only on `docs/operacao/tarefas/DSA-58`, `DSA-101` and `DSA-102`, which this task did not touch.
## Evidence
None yet.
## Blocker
The component needs a decision on "the tree as a popup": an `aria-activedescendant` on the field cannot point into the shadow root of the `nph-tree`. Path A: extract the rows of the `nph-tree` as a module the tree select draws in its own shadow root (as `nph-combobox.list.ts`). Path B: a popup mode in the `nph-tree`, which cannot give a valid `aria-activedescendant`. Waiting for the code owner.
## Next command
Decide the path, then write `src/components/nph-tree-select/`.
