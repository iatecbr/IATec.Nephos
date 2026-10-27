```json
{
  "task": "DSA-53",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-31-nph-multi-combobox-4b7aff",
  "start_sha": "f95bb64",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button`
(components, CSS, tests, stories, Docs page, sheets, P98 and Metadata), from the
contract in the `figma-docs-accepted` evidence, with the icon-only `nph-button` of
P86, the `nph-tooltip` of P77 and the `nph-dropdown-menu` of P92.

## Sources opened
- `docs/operacao/tarefas/DSA-53.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-button/` (P68, P86), `src/components/nph-tooltip/` (P77),
  `src/components/nph-dropdown-menu/` (P92), `src/components/nph-icon/` (P21)
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P72, P73, P77, P86, P91, P92, P97

## Changes
The task moves to in progress with the pending decisions D-1 to D-4. See the
commits on the branch.

## Commands run
- `npm ci`, then `node scripts/verificar-operacao.mjs` before the commit.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-4 wait for Indiane and do not block.

## Next command
Commit the three components, the stories, the Docs page and the sheets.
