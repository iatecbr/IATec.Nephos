```json
{
  "task": "DSA-27",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-27-nph-switch-1ea737",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-switch` in the contract of the `figma-docs-accepted` evidence: the track with
the sliding knob, the label after it, focus on the track, error, disabled and reduced motion.
Write its sheet, the Metadata and P79.

## Sources opened
- `docs/operacao/tarefas/DSA-27.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — the switch, input, primary, focus and motion tokens
- `docs/decisoes-tecnicas.md` — P73, P76
- `src/components/nph-togglebutton/` and `src/components/nph-toggle-group/`

## Changes
`nph-switch` (component, CSS, tests, also inside the real `nph-field`), six Validation
stories, the Docs page, the dictionaries in the three languages, the sheet and its Metadata,
and P79. The branch was synced with `v/5.0.0` several times; the conflicts were only in
`docs/decisoes-tecnicas.md` and in the dictionaries, resolved keeping the entries of the other
tasks. See the commits on the branch.

## Commands run
- `npm ci`; `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `test:naming`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.

## Result
In review in PR #108.

## Evidence
The proof table is in the description of PR #108. `review-and-merge` waits for the merge.

## Blocker
None. D5 and D6 wait for Indiane and do not block.

## Next command
Answer the review of PR #108; Elvys merges it.
