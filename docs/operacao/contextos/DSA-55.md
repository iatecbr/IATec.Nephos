```json
{
  "task": "DSA-55",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-55-toolbar-fd37bc",
  "start_sha": "efbd559ee9c3ccfae616d67d9cb21d42cba173c4",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-toolbar` in the contract accepted in Figma: the bulk, page, tools and floating bars
and the applied filters strip, in three sizes, with the toolbar keyboard pattern of the W3C ARIA
Authoring Practices, tests, stories, the Storybook dictionary and the sheet.

## Sources opened
- `docs/operacao/tarefas/DSA-55.md` and `docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-28.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-toggle-group/`, `src/components/nph-button/`, `src/components/nph-chip/`,
  `src/components/nph-separator/`, `src/components/nph-checkbox/`, `src/components/nph-input/`
  and `src/components/nph-dropdown-menu/`
- `src/tokens/generated/tokens.css`: the `toolbar/*` tokens, `elevation/dropdown` and `text/label-md`

## Changes
- `src/components/nph-toolbar/`: component, CSS, unit tests, demo frame, Validation stories,
  Docs page and its test.
- `.storybook/i18n/`: `toolbarDocs`, `toolbarValidation`, the sidebar labels and the claims, in
  `en`, `pt-BR` and `es`.
- `fichas/nph-toolbar.md` and the generated `src/shared/metadata/nph-toolbar.json`.
- `docs/decisoes-tecnicas.md`: P104 (P102 is taken by the Vitest 5 pull request and P103 was
  reserved for DSA-59).
- The task: D-1 to D-5 for Indiane.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- `npm ci`
- `npx vitest run --project unit src/components/nph-toolbar src/shared`
- `npx vitest run --project storybook src/components/nph-toolbar`
- `node scripts/verificar-operacao.mjs --gerar-metadata`
- `npm run test:naming`, `npm run test:spelling`, `npm run test:i18n`, `npm run typecheck`

## Result
The component, its stories, its sheet and P104 are on the branch `feat/dsa-55-toolbar`. The
focus rule of the applied filters was also checked by hand in Storybook: the X moves the focus to
the next chip, the last one to the Filter button, and the strip hides.

## Evidence
None yet. `review-and-merge` waits for the merge of pull request #146.

## Blocker
None.

## Next command
Wait for the Copilot review of pull request #146.
