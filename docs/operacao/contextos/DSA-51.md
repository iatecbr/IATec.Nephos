```json
{
  "task": "DSA-51",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-16-nph-input-20ff0b",
  "start_sha": "579b2fa3bd7a8d1bc226ae9e31b36eb857a36aa1",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-image` in the contract of the `figma-docs-accepted` evidence: the seven sizes and
the three ratios of `media`, the content states derived from `src`, the clickable image with the
veil, the eye and the focus ring, and the disabled look. Write the sheet, the Metadata and P90.

## Sources opened
- `docs/operacao/tarefas/DSA-51.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — `icones_nucleo` and the overlay tokens; the `image/*` tokens in `src/tokens/`
- `docs/decisoes-tecnicas.md` — P21, P66, P68, P73, P74, P78
- `src/components/nph-avatar/`, `src/components/nph-spinner/` and `src/components/nph-togglebutton/`

## Changes
The piece, the stories, the Docs page, the dictionary, the sheet, the Metadata and P90. See the
commits on the branch.

## Commands run
- `npm ci`, then `npm run test:naming` on the base before the first commit, to separate the
  findings that already exist.

## Result
In review in PR 106, synced with `v/5.0.0` after PRs 100 and 104. The proof commands pass, except
`test:naming`, whose findings are all in files this branch does not touch.

## Evidence
None recorded: `review-and-merge` waits for the merge.

## Blocker
None. D1 (the empty and error illustrations) and D2 (the `design.md` entry of the `image/*`
tokens) wait for Indiane and do not block: empty and error draw the frame only until D1.

## Next command
Wait for the review; after the merge, record the `review-and-merge` evidence and move the task to done.
