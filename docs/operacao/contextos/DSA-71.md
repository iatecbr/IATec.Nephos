```json
{
  "task": "DSA-71",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/trusting-shaw-6c75b5",
  "start_sha": "0aff2147d348190cc8931c0f87fc374531ce582b",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-tabs` in the contract accepted in Figma on 2026-11-09: the list of tabs that switches the panel of a section, in five styles (segmented, underline, solid, light and outline tab button), with an optional start icon, counter and tag on each tab, with tests, stories and the spec.

## Sources opened
- `docs/operacao/tarefas/DSA-71.md` and `docs/operacao/evidencias/DSA-71/figma-docs-accepted-2026-11-09.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-breadcrumb/`, `nph-chip/` and `nph-toggle-group/` as patterns; the sheets of `nph-icon`, `nph-badge` and `nph-tooltip`
- `src/tokens/generated/tokens.css`: the `tabs/*` tokens

## Changes
Component, CSS and tests of `nph-tabs`.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-71-tabs origin/v/5.0.0`
- `npm ci`
- `npx vitest run --project unit src/components/nph-tabs/nph-tabs.test.ts`

## Result
The task is in progress on the branch `feat/dsa-71-tabs`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run test:operacao`
