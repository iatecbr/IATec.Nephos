```json
{
  "task": "DSA-47",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-47-nph-button-icone-solido-b4494c",
  "start_sha": "59f1fd59155264aeeb907dd5b76c02ecf5950e74",
  "end_sha": null
}
```

## Goal of this pass
Make the `nph-button` with text draw its start and end icons in the `solid` variant of
`nph-icon` while it is hovered or pressed, in the rule Indiane decided on 21/10/2026, and
record P88, which amends P68. The icon-only button keeps its icon `light` until D1 is answered.

## Sources opened
- `docs/operacao/tarefas/DSA-47.md` and its evidence
- `docs/decisoes-tecnicas.md` — P68 and P86
- `fichas/nph-button.md`
- `src/components/nph-button/` and `src/components/nph-icon/nph-icon.icons.ts`

## Changes
The component, its CSS, tests, the `Icons` story, the dictionaries, the spec, the Metadata and P88
are on the branch; PR #113 is open for review.

## Commands run
- The proof commands of `component-handoff.md`, plus `build:lib` and `test:package`.

## Result
Every proof exits 0 except `test:naming`, which fails only on records and a script line this
branch does not touch, as on `v/5.0.0`.

## Evidence
None recorded: `review-and-merge` waits for the pull request.

## Blocker
None. D1 waits for Indiane and does not block.

## Next command
After the merge, record `review-and-merge` and move the task to `done`.
