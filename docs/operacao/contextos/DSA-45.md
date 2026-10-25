```json
{
  "task": "DSA-45",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-45-nph-dropdown-menu-6256e3",
  "start_sha": "906f1cf",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-dropdown-menu` (component, CSS, tests, stories, Docs page, sheet,
P92 and Metadata) and the `right-from-bracket` icon of `nph-icon`, from the
contract in the `figma-docs-accepted` evidence.

## Sources opened
- `docs/operacao/tarefas/DSA-45.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-tooltip/` (the top layer, P77), `src/components/nph-select/`
  (the list, P91), `src/components/nph-checkbox/` (P81),
  `src/components/nph-switch/` (P79), `src/components/nph-badge/`,
  `src/components/nph-avatar/` and `src/components/nph-icon/`
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P77, P79, P81, P91
- `vite.config.lib.ts`, `scripts/test-package.mjs` — one definition per folder,
  so the items are data of the menu and not tags of their own

## Changes
The task moves to in progress with the pending decisions D-1 to D-6. See the
commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-6 wait for Indiane and do not block.

## Next command
Commit the icon, then the component, the sheet, the stories and the Docs page.
