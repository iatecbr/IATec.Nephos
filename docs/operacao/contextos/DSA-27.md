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
`src/components/nph-switch/` (component, CSS, tests, Validation and Docs stories, demo),
`fichas/nph-switch.md` with its generated Metadata, P79 in `docs/decisoes-tecnicas.md` and
the `switchDocs` and `switchValidation` dictionaries in the three languages. See the commits
on the branch.

## Commands run
- `npm ci`; the proof commands of `docs/operacao/component-handoff.md`, plus `build:lib`,
  `test:package` and the Metadata generation.

## Result
The branch is ready. The pull request waits for the merge of DSA-28, which brings P83.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D5 and D6 wait for Indiane and do not block.

## Next command
Sync with `v/5.0.0` after the merge of DSA-28, run the proofs again and open the PR.
