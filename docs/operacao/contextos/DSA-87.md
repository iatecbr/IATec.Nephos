```json
{
  "task": "DSA-87",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/loving-northcutt-c4d108",
  "start_sha": "e0e5214",
  "end_sha": null
}
```

## Goal of this pass
Implement the `nph-carousel`, a strip of slides where one part shows at a time and the person moves on with arrows, indicators or by dragging, in the contract accepted in Figma, with its tests, stories, Storybook dictionary and the sheet `fichas/nph-carousel.md`.

## Sources opened
- `docs/operacao/tarefas/DSA-87.md` and `docs/operacao/evidencias/DSA-87/figma-docs-accepted-2026-11-16.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- The sheets `fichas/_modelo.md` and `fichas/nph-resizable.md`, and the code of `nph-button`, `nph-image`, `nph-skeleton`, `nph-tabs` and `nph-resizable`
- `src/tokens/generated/tokens.css`: the fourteen `carousel/*` tokens are present

## Changes
- `src/components/nph-carousel/`: component, CSS, tests, Validation stories, reading page and demo scenery.
- `fichas/nph-carousel.md` and its Metadata; P129 in `docs/decisoes-tecnicas.md`; the Storybook dictionary in three languages.
- Left out, by the task: no automatic rotation, no vertical carousel, no thumbnails, no wrap-around, no change to `nph-button` or `nph-icon`, no token.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-87-carousel origin/v/5.0.0`
- The proofs of the wave, in sequence, on the head of the pull request.

## Result
In progress.

## Blocker
None.
