```json
{
  "task": "DSA-63",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-48-nph-tooltip-ajuste-62075c",
  "start_sha": "dd9772d52da51c2eb2e6c142f4c7444f7dd08d10",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-notification` in the contract accepted in Figma: inline and toast placement, the
seven severities, subtle and solid emphasis, stacked and single-line layout, the optional
title, the actions, the close button and the time bar, with tests, stories, the Storybook
dictionary and the sheet.

## Sources opened
- `docs/operacao/tarefas/DSA-63.md` and `docs/operacao/evidencias/DSA-63/figma-docs-accepted-2026-11-04.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-button/`, `src/components/nph-dialog/`, `src/components/nph-empty/`,
  `src/components/nph-icon/`, `src/components/nph-spinner/` and `src/components/nph-skeleton/`
- `src/tokens/generated/tokens.css`: the `notification/*` tokens, `elevation/modal` and the
  focus tokens

## Changes
- `src/components/nph-notification/`: component, CSS, unit tests, demo frame, Validation stories
  (with Brands), Docs page and its test.
- `.storybook/i18n/`: `notificationDocs`, `notificationValidation`, the sidebar labels and the
  claims, in `en`, `pt-BR` and `es`.
- `fichas/nph-notification.md` and the generated `src/shared/metadata/nph-notification.json`.
- `docs/decisoes-tecnicas.md`: P108 (P107 belongs to the DSA-65 pull request).
- The task: D-1 for Indiane (the toast region as a piece of its own).

## Commands run
- `git fetch origin` and `git merge --ff-only origin/v/5.0.0`
- `npm ci`
- `npx vitest run --project unit src/components/nph-notification src/shared`
- `npx vitest run --project storybook src/components/nph-notification`
- `node scripts/verificar-operacao.mjs --gerar-metadata`
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`,
  `test:spelling`, `test:operacao`, `build-storybook`, `build:lib` and `test:package`

## Result
The component, its stories, its sheet and P108 are in pull request 150, from the branch `feat/dsa-63-notification`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blockers
None.

## Next command
`gh pr merge 150` (Elvys merges)
