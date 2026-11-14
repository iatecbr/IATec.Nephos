```json
{
  "task": "DSA-79",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/kind-jennings-582f7b",
  "start_sha": "4024dfcbd082c3f7c45b44171d491e0cb296b784",
  "end_sha": null
}
```

## Goal of this pass
Add the free text variant to `nph-combobox` in the contract accepted in Figma on 2026-11-12: a field without the arrow whose typed text is the value and whose list only suggests, with its tests, stories, spec and the technical decision P122. The nph-combobox with the arrow does not change: its create row (D-1), its first suggestion active while typing (D-5) and its empty list stay as they are.

## Sources opened
- `docs/operacao/tarefas/DSA-79.md` and `docs/operacao/evidencias/DSA-79/figma-docs-accepted-2026-11-12.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` (the `combobox/free-text-padding-end` use and the motion rules) and `docs/operacao/component-handoff.md`
- `src/components/nph-combobox/` (component, list module, CSS, tests, stories, Docs page, demo frame), `src/components/nph-input/` (events and Enter) and `fichas/nph-combobox.md`, `fichas/nph-icon.md`
- P95, P96 and P121 in `docs/decisoes-tecnicas.md`
- `src/tokens/generated/tokens.css`: `--nph-combobox-free-text-padding-end`

## Changes
Component, CSS and tests of the free text variant (`free-text` and `no-suggestions-label`), in `nph-combobox.ts`, `nph-combobox.css` and the new `nph-combobox.free-text.test.ts`. The list module, the tests of the arrow variant and the tokens are untouched.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-79-combobox-free-text origin/v/5.0.0`
- baseline on the untouched branch: `npm run test:naming` and cspell over everything but `design.md` pass
- `npx vitest run --project unit src/components/nph-combobox src/components/nph-multi-combobox` and `npx tsc --noEmit`

## Result
Code and tests written and green; stories, Docs page, dictionaries, sheet and P122 are next.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npx vitest run --project storybook src/components/nph-combobox`
