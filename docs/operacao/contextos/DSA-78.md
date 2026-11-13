```json
{
  "task": "DSA-78",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/charming-elion-f27ae6",
  "start_sha": "fb5178f97fb5dfb99651c3d99769e653998c3ecb",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-collapsible` in the contract accepted in Figma on 2026-11-12: a trigger that opens and closes a block of content in the same place, in the line, button and preview types, the flush and card appearances, the indicator at the end or at the start and the compact, default and large sizes, with tests, stories and the spec. The accordion and the vertical stepper are not changed or built here.

## Sources opened
- `docs/operacao/tarefas/DSA-78.md` and `docs/operacao/evidencias/DSA-78/figma-docs-accepted-2026-11-12.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` (the `collapsible/*` uses and the motion rules) and `docs/operacao/component-handoff.md`
- `src/components/nph-stepper/`, `nph-tree/`, `nph-button/`, `nph-icon/`, `nph-sidebar/` and `nph-file-upload/` as patterns; the sheets of `nph-icon` and `nph-button`; P111, P116, P117 and P118
- `src/tokens/generated/tokens.css`: the `collapsible/*` tokens

## Changes
Component, CSS and tests of `nph-collapsible`; the stories (Validation), the Docs page, the dictionaries in three languages, the sheet `fichas/nph-collapsible.md` with its Metadata, P121 in `docs/decisoes-tecnicas.md`, and the word `beforematch` in the spelling dictionary.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-78-collapsible origin/v/5.0.0` and `npm ci`
- `npx vitest run --project unit src/components/nph-collapsible` and `--project storybook`
- `node scripts/verificar-operacao.mjs --gerar-metadata`
- `npm run build:lib` and a read of `dist/custom-elements.json` for the event
- the twelve proofs in sequence: `build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`, `test:spelling`, `test:operacao`, `build-storybook`, `build:lib`, `test:package`, `git diff --check`

## Result
The task is in review on the branch `feat/dsa-78-collapsible`. The component, its tests, stories, sheet and P121 are written; D-1 to D-3 wait for Indiane and do not block the pull request. `test:naming` and `test:spelling` fail on the base (text of DSA-80 and DSA-81), not on this branch.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`gh pr view --json reviews,reviewThreads`
