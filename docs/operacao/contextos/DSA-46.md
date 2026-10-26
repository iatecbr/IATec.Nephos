```json
{
  "task": "DSA-46",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-46-nph-combobox-43fc0a",
  "start_sha": "afac0e7",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-combobox` and its list (component, list module, CSS, tests,
stories, Docs page, sheet, P95 and Metadata), from the contract in the
`figma-docs-accepted` evidence, with the form pattern of P80, the field
contract of P83 and the option and the layer of P91.

## Sources opened
- `docs/operacao/tarefas/DSA-46.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-select/` and `src/components/nph-option/` (P91),
  `src/components/nph-input/` (P80), `src/components/nph-field/` (P83),
  `src/components/nph-empty/` (P84), `src/components/nph-dropdown-menu/` (P92),
  `src/components/nph-spinner/` and `src/components/nph-kbd/`
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P80, P83, P84, P91, P92
- `vite.config.lib.ts` — code shared by entries goes to `dist/shared/`

## Changes
The task moves to in progress with the pending decisions D-1 to D-5. See the
commits on the branch.

## Commands run
- `npm ci`, then `node scripts/verificar-operacao.mjs` before the first commit.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-5 wait for Indiane and do not block.

## Next command
Commit the component and its list, then the stories, the Docs page and the sheet.
