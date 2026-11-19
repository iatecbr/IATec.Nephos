```json
{
  "task": "DSA-96",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/wizardly-tu-6605a2",
  "start_sha": "ee3e17b",
  "end_sha": null
}
```

## Goal of this pass
Bring `nph-date-picker` and `nph-calendar` to the six answers the design owner gave on 2026-11-18 (D-2, D-5, D-6, D-9, D-10 and the header of the large grid), with the tests, the sheets, the metadata, the stories and the Storybook dictionary changed in the same work. D-12 to D-14 and a typed period that holds an unavailable day stay open with the design owner.

## Sources opened
- `docs/operacao/tarefas/DSA-96.md` and the evidence `docs/operacao/evidencias/DSA-96/design-decision-2026-11-18.md`
- `docs/operacao/tarefas/DSA-90.md`, the section "Decisions open with the design owner", and P133 in `docs/decisoes-tecnicas.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `docs/operacao/component-handoff.md`
- `fichas/nph-calendar.md`, `fichas/nph-date-picker.md`, `fichas/nph-option.md`
- `src/components/nph-calendar/` and `src/components/nph-date-picker/`

## Gaps declared
- No token is created or changed: the large header and the cell are `control/height-large`, the default cell `control/height-default`.
- The answers say nothing about four edges; the code takes a provisional rule and the task records them as new open decisions (D-15 to D-18).

## Commands run
- `git fetch origin && git checkout -B feat/dsa-96-date-picker origin/v/5.0.0`

## Result
In progress.
