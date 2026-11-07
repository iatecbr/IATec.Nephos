```json
{
  "task": "DSA-68",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/gracious-murdock-accfbf",
  "start_sha": "3157ccd2e11cc58046ace8bc0bf153be6533fc00",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-hover-card` in the contract accepted in Figma on 2026-11-06: the read-only preview card anchored to a link, opened by the pointer resting on the link or by keyboard focus, with an optional arrow on four sides and an optional meta line, with tests, stories and the spec.

## Sources opened
- `docs/operacao/tarefas/DSA-68.md` and `docs/operacao/evidencias/DSA-68/figma-docs-accepted-2026-11-06.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-tooltip/` (opening, layer and placement) and `nph-breadcrumb/` (link, stories, docs) as patterns
- `src/tokens/generated/tokens.css`: the `hover-card/*` tokens

## Changes
None yet.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-68-hover-card origin/v/5.0.0`

## Result
Work started.

## Evidence
None yet. `review-and-merge` waits for the merge.

## Blocker
None.

## Next command
`node scripts/verificar-operacao.mjs`
