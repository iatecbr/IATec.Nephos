```json
{
  "task": "DSA-44",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-44-nph-dialog-07ca69",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Build the `nph-dialog` in the contract of the `figma-docs-accepted` evidence: a native modal
`<dialog>` over the `overlay/scrim` veil, with heading, description, close button, content,
footer and lines; write its sheet, stories, tests, the Metadata and P87.

## Sources opened
- `docs/operacao/tarefas/DSA-44.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — dialog colors, `overlay/scrim`, `elevation/modal`, space, motion, §2f
- `docs/decisoes-tecnicas.md` — P66, P68, P76, P77
- `src/components/nph-button/`, `nph-separator/`, `nph-tooltip/`, `nph-toggle-group/`

## Changes
See the commits on the branch.

## Commands run
- `npm ci`; `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `build-storybook`, `build:lib`, `test:package`, `test:naming`; `git diff --check`.

## Result
In review in pull request 115, synced with `v/5.0.0` at `e2f7841`, with DSA-38, DSA-41, DSA-43 and DSA-47 merged.
The rule of Q1 is in `nph-button.css` (`:host(:not([data-nph-icon-only])) .control { flex: 1 }`),
with scope tests in the button, and the stacked test of the dialog is on. Every proof passes except
`test:naming`, which fails only in files of the base: `scripts/test-package.mjs:180` and the records
of DSA-34, 39, 42, 43, 45 and 47.

## Evidence
None recorded: `review-and-merge` waits for the merge.

## Blocker
None for the pull request. D1, D2, D4 and D5 wait for Indiane and do not block; D3 keeps the
highlight icon out.

## Next command
Copilot review of pull request 115; with the gate open, comment that it is ready to merge and wait for
Elvys's merge.
