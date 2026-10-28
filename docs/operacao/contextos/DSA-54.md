```json
{
  "task": "DSA-54",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-54-nph-pagination-4a7569",
  "start_sha": "e270b77",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-pagination` (component, CSS, tests, stories, Docs page, sheet, P99 and
Metadata), from the contract in the `figma-docs-accepted` evidence, with `nph-icon`,
the `nph-tooltip` of P77, the `nph-select` of P91 and the `nph-input` of P80, and add
the `arrow-left-to-line` icon, light and solid, to the `nph-icon` core.

## Sources opened
- `docs/operacao/tarefas/DSA-54.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — `icones_nucleo` and the tokens named in the evidence
- `src/components/nph-button/` (P68, P86, P88), `src/components/nph-tooltip/` (P77),
  `src/components/nph-select/` (P91), `src/components/nph-input/` (P80),
  `src/components/nph-sidebar-item/` (P98), `src/components/nph-icon/` (P21)
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P77, P80, P86, P91, P97, P98

## Changes
The task moves to in progress with the pending decisions D-1 to D-5. See the
commits on the branch.

## Commands run
- `node scripts/verificar-operacao.mjs` before the commit.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-5 wait for Indiane and do not block.

## Next command
Commit the icon, the component, the stories, the Docs page and the sheet.
