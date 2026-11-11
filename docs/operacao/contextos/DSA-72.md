```json
{
  "task": "DSA-72",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/optimistic-jones-3dadc1",
  "start_sha": "1b98a1d",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-sidebar` in the contract accepted in Figma, move the focus border of `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button` to `focus/border`, and write the sheet. The technical decision is P116.

## Sources opened
- `docs/operacao/tarefas/DSA-72.md` and `docs/operacao/evidencias/DSA-72/figma-docs-accepted-2026-11-10.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `docs/operacao/component-handoff.md`
- The sheets of `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button` in full; the sheets of `nph-button`, `nph-input`, `nph-skeleton`, `nph-tooltip`, `nph-dropdown-menu` and `nph-icon` for their invalid combinations and focus rules
- The code of `nph-button`, `nph-dropdown-menu`, `nph-dialog` and `nph-input` (layer, dialog, focus and token precedents), and decisions P02, P98 and P115
- `design.md`, the sidebar, focus and scrim entries; `src/tokens/generated/tokens.css`: the `sidebar/*` tokens the evidence names, all present

## Changes
In progress. See the pull request.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-72-sidebar origin/v/5.0.0`

## Result
Not finished.

## Evidence
`docs/operacao/evidencias/DSA-72/figma-docs-accepted-2026-11-10.md`.

## Blocker
None. D-1 (the `sidebar` icon in `nph-icon`) and D-2 (the logo in dark) stay with Indiane and do not block the pull request.

## Next command
`node scripts/verificar-operacao.mjs`
