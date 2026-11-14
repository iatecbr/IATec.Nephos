```json
{
  "task": "DSA-80",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-80-command-06f392",
  "start_sha": "a495dc9",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-command` in the contract accepted in Figma on 2026-11-12: a command palette in a dialog, with a search field, the commands by group, the states of the content and a footer of keyboard hints, with tests, stories, the Docs page, the Storybook dictionary and the spec. Add to `nph-dialog` only the options it needs: the title for the screen reader only, no padding, the click on the veil that closes it and the new origins of `nph-close`. The `nph-dropdown-menu`, the `nph-input`, the `nph-empty` and the `nph-combobox` are not changed.

## Sources opened
- `docs/operacao/tarefas/DSA-80.md` and `docs/operacao/evidencias/DSA-80/figma-docs-accepted-2026-11-12.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` (the `command/*` tokens) and `docs/operacao/component-handoff.md`
- `docs/stories.md`, P87 and P122; the sheet of `nph-dialog` and, for the pieces the palette reuses, the headers and styles of `nph-dropdown-menu`, `nph-combobox`, `nph-input`, `nph-kbd`, `nph-empty` and `nph-spinner`
- `src/components/nph-dialog/`, `nph-dropdown-menu/` and `nph-combobox/` (the list module) as patterns
- `src/tokens/generated/tokens.css`: the `command/*` tokens, all present

## Changes
- `nph-dialog`: the options `hide-heading`, `no-padding` and `close-on-backdrop`, the origins `backdrop`, `open-key` and `command-run` in `nph-close`, and the method `requestClose(source)`; tests in `nph-dialog.options.test.ts`; the sheet.
- `nph-command`: component, CSS, tests, stories, Docs page, dictionaries, sheet and P123.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-80-command origin/v/5.0.0` and `npm ci`
- `npx vitest run --project unit src/components/nph-dialog src/components/nph-command`

## Result
In progress on the branch `feat/dsa-80-command`: the dialog options, the component, its tests, the sheet and P123 are written and pass; stories, the Docs page and the dictionaries are being finished, then the twelve proofs and the pull request.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npx vitest run --project unit src/components/nph-command src/components/nph-dialog`
