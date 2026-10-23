```json
{
  "task": "DSA-43",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-43-nph-icon-button-91e130",
  "start_sha": "e65c07c0d3e4c1336c169be1058cde2ac6b400f7",
  "end_sha": null
}
```

## Goal of this pass
Bring the icon-only `nph-button` to the `nph-icon-button` contract in the `figma-docs-accepted`
evidence: the `shape` attribute (square or circular) and the required tooltip with the action
name, through the `relation="name"` of the `nph-tooltip` merged in DSA-48. Record P86, which
amends P68, and move the task `piece` to `nph-button`, the tag and spec of the code.

## Sources opened
- `docs/operacao/tarefas/DSA-43.md` and its evidence; `docs/operacao/tarefas/DSA-48.md` and its
  evidence; `docs/operacao/tarefas/DSA-42.md` (D2 to D7)
- `docs/decisoes-tecnicas.md` — P68, P77 and its amendment of 22/10/2026
- `fichas/nph-button.md` and `fichas/nph-tooltip.md`
- `src/components/nph-button/`, `src/components/nph-tooltip/` and the merged diff of DSA-48

## Changes
The component, its CSS, tests, stories, the dictionaries, the spec, the Metadata and P86.

## Commands run
- `npm ci`; the proof commands of `component-handoff.md`, plus `build:lib` and `test:package`.

## Result
Recorded in the pull request.

## Evidence
None recorded: `review-and-merge` waits for the pull request.

## Blocker
None. D1 and D2 wait for Indiane and do not block.

## Next command
Open the pull request to `v/5.0.0` and move the task to `in-review`.
