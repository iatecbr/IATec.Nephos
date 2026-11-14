```json
{
  "task": "DSA-77",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/nervous-dhawan-de0f03",
  "start_sha": "fb5178f",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-scheduler`, a calendar of events in the work week, week, day, month and list views, on desktop and mobile, with an optional side panel, a toolbar and its inner event piece, in the contract accepted in Figma on 2026-11-12, with tests, stories and the sheet. The technical decision is P120.

## Sources opened
- `docs/operacao/tarefas/DSA-77.md` and `docs/operacao/evidencias/DSA-77/figma-docs-accepted-2026-11-12.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `docs/operacao/component-handoff.md`, `docs/stories.md`
- The code header and the sheet (`api`, `invalid_combinations`, `anti_patterns`) of `nph-button`, `nph-popover`, `nph-select`, `nph-checkbox`, `nph-avatar-stack`, `nph-skeleton`, `nph-empty`, `nph-dropdown-menu` and `nph-icon`; `nph-file-upload` and `nph-sidebar` as patterns, and decisions P116 and P119
- `design.md`: the `icones_nucleo` list; the contract of the tokens comes from the evidence, and `src/tokens/generated/tokens.css` has the `scheduler/*` and `event/<color>-*` tokens, all present

## Changes
- `nph-scheduler` (component, CSS, tests, Validation stories, Docs page, dictionaries in three languages, sheet) and P120.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-77-scheduler origin/v/5.0.0`

## Result
In progress on the branch `feat/dsa-77-scheduler`.

## Evidence
`docs/operacao/evidencias/DSA-77/figma-docs-accepted-2026-11-12.md`.

## Blocker
None.

## Next command
`node scripts/verificar-operacao.mjs`
