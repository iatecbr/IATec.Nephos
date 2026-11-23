```json
{
  "task": "DSA-99",
  "worktree": "/home/helielton_fioramonte/Work/IATec.Nephos",
  "start_sha": "4ae504f",
  "end_sha": null
}
```
## Goal of this pass
Implement the nph-popconfirm in the contract accepted in Figma (evidence of the `figma-docs-accepted` gate), with CSS, tests, stories, the Storybook dictionary, the sheet and the decision record.
## Sources opened
- `docs/operacao/tarefas/DSA-99.md` and `docs/operacao/evidencias/DSA-99/figma-docs-accepted-2026-11-19.md`
- `docs/operacao/component-handoff.md`
- `src/components/nph-popover/` (ts, css and tests), the family model; `src/components/nph-button/` (loading, focus hook)
- `src/tokens/generated/tokens.css`: the `popconfirm/*` tokens and the two core widths, all present
## Changes
- `src/components/nph-popconfirm/nph-popconfirm.ts` and `.css`: surface, types, sizes, sides, alignments, arrow, `alertdialog`, initial focus by type, Tab kept between Cancel and Confirm, `nph-confirm` and `nph-cancel` events, loading Confirm, stacked actions, `return-focus-to`.
- `src/components/nph-popconfirm/nph-popconfirm.test.ts`: browser tests. `nph-popconfirm.stories.ts` and `.demo.ts`: Validation stories, with `Brands`. Dictionary in three languages.
- `fichas/nph-popconfirm.md`, decision P137 in `docs/decisoes-tecnicas.md`, generated `src/shared/metadata/nph-popconfirm.json`, `popconfirm` in `cspell.config.yaml`.
## Commands run
- `git checkout -b feat/dsa-99-popconfirm`
- `npx vitest run src/shared nph-popconfirm`, `npx tsc --noEmit`, `npm run test:i18n`, `node scripts/verificar-operacao.mjs --gerar-metadata`
## Result
Component, CSS, tests, stories, dictionary, sheet, P137 and Metadata written and passing, not committed. Open: the full proof on the head, the pull request, the Copilot review.
## Evidence
None yet.
## Blocker
None.
## Next command
Commit, open the pull request to `v/5.0.0` and request the Copilot review: `gh pr edit <number> --add-reviewer @copilot`.
