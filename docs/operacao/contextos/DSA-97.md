```json
{
  "task": "DSA-97",
  "worktree": "/home/helielton_fioramonte/Work/IATec.Nephos",
  "start_sha": "c2e683a",
  "end_sha": null
}
```
## Goal of this pass
Implement the nph-accordion and its item nph-accordion-item, in the contract accepted in Figma (evidence of the `figma-docs-accepted` gate), with CSS, tests, stories, the Storybook dictionary, the sheet and the decision record.
## Sources opened
- `docs/operacao/tarefas/DSA-97.md` and `docs/operacao/evidencias/DSA-97/figma-docs-accepted-2026-11-19.md`
- `AGENTS.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-collapsible/` and `fichas/nph-collapsible.md`, the model for the item
- `src/tokens/generated/tokens.css`: the 23 `accordion/*` tokens and the `collapsible/*` ones, all present
## Changes
- `nph-accordion` (container: appearance, expansion, size, heading level, divider and block by `::slotted`, single expansion rules) and `nph-accordion-item` (trigger, heading, region, start media, tag, end status, indicator, open, disabled, locked section, open that does not close, `until-found`), each with CSS and tests.
- Validation stories and shared demo, the Storybook dictionary in three languages, the sheet `fichas/nph-accordion.md`, its generated Metadata and P136.
## Commands run
- `git checkout -b feat/dsa-97-accordion origin/v/5.0.0`
- `npx vitest run nph-accordion`, `npx tsc --noEmit`, `npm run test:i18n`, `npm run test:naming`, `node scripts/verificar-operacao.mjs`, `npm run build:lib`
## Result
Code, tests, stories, sheet, Metadata and P136 written, not committed. Open: pull request, the full proof on its head, and the Docs page.
## Evidence
None yet.
## Blocker
None.
## Next command
Commit, open the pull request to `v/5.0.0` and request the Copilot review: `gh pr edit <number> --add-reviewer @copilot`.
