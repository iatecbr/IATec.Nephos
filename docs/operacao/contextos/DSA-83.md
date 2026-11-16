```json
{
  "task": "DSA-83",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-83-menubar-5d2f92",
  "start_sha": "e351b9b",
  "end_sha": null
}
```

## Goal of this pass
Implement the `nph-menubar` in `src/components/nph-menubar/` — component, CSS, tests, stories, the sheet `fichas/nph-menubar.md` and the Storybook dictionary — in the contract accepted in Figma, and make the two decided changes in approved pieces: the focus border of the `nph-dropdown-menu` item (also in the `nph-context-menu`) in `focus/border`, and `dropdown/submenu-offset` as the submenu gap of the `nph-context-menu`.

## Sources opened
- `docs/operacao/tarefas/DSA-83.md` and the evidence `docs/operacao/evidencias/DSA-83/figma-docs-accepted-2026-11-16.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `fichas/nph-dropdown-menu.md`, `fichas/nph-context-menu.md`, `fichas/nph-navigation-menu.md` and P92, P110 and P113 in `docs/decisoes-tecnicas.md`
- `src/tokens/generated/tokens.css`: the `menubar/*` tokens and `dropdown/submenu-offset`, all present

## Changes
- New piece `nph-menubar` and decision P126.
- `nph-dropdown-menu` and `nph-context-menu`: the focus border in `focus/border`; `nph-context-menu`: the submenu at `dropdown/submenu-offset`.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-83-menubar origin/v/5.0.0`

## Result
In progress.

## Blocker
None. The base is red on `nph-scheduler.test.ts` ("every scheduler token is read by the CSS"), which DSA-85 fixes.

## Next command
`node scripts/verificar-operacao.mjs`
