```json
{
  "task": "DSA-52",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-31-nph-multi-combobox-4b7aff",
  "start_sha": "24dd4a8",
  "end_sha": null
}
```

## Goal of this pass
Make the icon-only `nph-button` swap its icon from `light` to `solid` in hover-active,
as the button with text does since P88, and bring the tests, the stories, the
dictionary, the sheet, the Metadata and P88 to the same rule.

## Sources opened
- `docs/operacao/tarefas/DSA-52.md` and its evidence
- `docs/operacao/tarefas/DSA-47.md` (D1) and `docs/operacao/component-handoff.md`
- `design.md` — the icon rules (`icone_regras`) and `icon/size-*`
- `src/components/nph-button/` and `fichas/nph-button.md`
- `docs/decisoes-tecnicas.md` — P68, P86 and P88

## Changes
The task moves to in progress. See the commits on the branch.

## Commands run
- `npm ci`, then `node scripts/verificar-operacao.mjs` before the commit.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None.

## Next command
Commit the component, the tests and the stories.
