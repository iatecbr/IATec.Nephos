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
- `npm ci`.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the merge.

## Blocker
None. D1, D2, D4 and D5 wait for Indiane and do not block; D3 keeps the highlight icon out.

## Next command
`npm test`, then the other proof commands of `component-handoff.md`.
