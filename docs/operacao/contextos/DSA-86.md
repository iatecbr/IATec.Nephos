```json
{
  "task": "DSA-86",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/loving-northcutt-c4d108",
  "start_sha": "0dccd99",
  "end_sha": null
}
```

## Goal of this pass
Implement the `nph-resizable`, a group of two or three panels separated by a handle that is dragged, or moved by keyboard, to resize them, in the contract accepted in Figma, with its tests, stories, Storybook dictionary and the sheet `fichas/nph-resizable.md`. Desktop only in v1.

## Sources opened
- `docs/operacao/tarefas/DSA-86.md` and `docs/operacao/evidencias/DSA-86/figma-docs-accepted-2026-11-16.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `docs/operacao/component-handoff.md` and `docs/stories.md`
- The sheets `fichas/nph-button.md`, `fichas/nph-icon.md` and `fichas/nph-skeleton.md`
- `src/tokens/generated/tokens.css`: the ten `resizable/*` tokens and `color/border-strong` are present

## Changes
- `src/components/nph-resizable/`: component, CSS, tests, Validation stories, reading page and demo scenery.
- `fichas/nph-resizable.md` and its Metadata; P128 in `docs/decisoes-tecnicas.md`; the Storybook dictionary in three languages.
- Left out, by the task: no collapsed variant, no mobile layout, no second handle size, no dotted `grip` icon in `nph-icon`, no change to `nph-button` or `nph-icon`, no token.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-86-resizable origin/v/5.0.0`
- The proofs of the wave, in sequence, on the head of the pull request.

## Result
In progress.

## Blocker
None.
