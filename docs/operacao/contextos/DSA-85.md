```json
{
  "task": "DSA-85",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-85-respostas-23721b",
  "start_sha": "e351b9b",
  "end_sha": null
}
```

## Goal of this pass
Apply in the code the answers Indiane gave on 2026-11-16 on the Figma previews to the pending decisions of DSA-72, DSA-73, DSA-76, DSA-77, DSA-78 and DSA-80 that change the code, and make the base green again: the five scheduler tokens added with DSA-84 were not read by the CSS, so the scheduler test "every scheduler token is read by the CSS" failed.

## Sources opened
- `docs/operacao/tarefas/DSA-85.md`, the sections "Decisions answered on 2026-11-16 on the Figma previews" of DSA-72, DSA-73, DSA-76, DSA-77, DSA-78 and DSA-80, and `DSA-84.md` with its evidence
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- The sheets `fichas/nph-scheduler.md`, `nph-stepper.md`, `nph-collapsible.md`, `nph-sidebar.md` and `nph-sidebar-rail-button.md`, and P115 to P124 in `docs/decisoes-tecnicas.md`

## Changes
- `nph-scheduler`: the CSS reads `scheduler/hour-height`, `month-row-min-height`, `list-time-width`, `list-time-width-compact` and `mini-month-cell-size`; the mini month cell goes from 28 to 36.
- `nph-stepper`: the connector follows the status of the step before it; on the narrow width a step in error gives `nph-progress` the error status.
- `nph-collapsible`: the preview type draws no button when the text fits in three lines.
- `nph-sidebar` and `nph-sidebar-rail-button`: the rail button of the group that holds the current page shows the active look; the arrow of a first-level group of the panel menu turns 180 degrees.
- `scripts/tokens-lib.mjs`, `scripts/build-tokens.mjs`, `scripts/test-invariance.mjs`: the build takes a `%` dimension and refuses any unit other than `px` and `%`.
- `design.md` (only the `icones_nucleo` list, in its own commit, authorized by Elvys on 2026-11-17) and `nph-icon`: the icons `sidebar` and `repeat`, Light and Solid. The collapse buttons of `nph-sidebar` and `nph-scheduler` draw `sidebar`; the recurring event draws `repeat`.
- The Storybook dictionary, the sheets and P115 to P124.
- Left out: the tokens `command/offset-top` and `core/layout-offset/top` (T-2, Claude's).

## Commands run
- `git fetch origin && git checkout -B feat/dsa-85-respostas origin/v/5.0.0`
- The proofs of the wave, in sequence, on the head of the pull request.

## Result
Pull request #177 is open against `v/5.0.0`. The task is `in-review`: the offset of the command panel is not in the code (T-2).

## Evidence
None yet: the gate `review-and-merge` stays pending until the merge.

## Blocker
T-2: the tokens `command/offset-top` and `core/layout-offset/top` come from Claude in Figma.

## Next command
When the tokens are on `v/5.0.0`: the panel of `nph-command` opens at that distance from the top, by a change of its CSS.
