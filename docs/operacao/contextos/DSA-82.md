```json
{
  "task": "DSA-82",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/heuristic-banach-6b873e",
  "start_sha": "0dccd99",
  "end_sha": null
}
```

## Goal of this pass
Apply in the code the answers Indiane gave on 2026-11-16 in the chat to the pending decisions of DSA-71, DSA-73, DSA-74, DSA-76 and DSA-79, and record the answers of DSA-71 to DSA-80 in P115 to P124.

## Sources opened
- `docs/operacao/tarefas/DSA-82.md` and the sections "Decisions answered on 2026-11-16" of DSA-71, DSA-72, DSA-73, DSA-74, DSA-75, DSA-76, DSA-77, DSA-78, DSA-79 and DSA-80
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- The sheets `fichas/nph-tooltip.md`, `nph-tabs.md`, `nph-stepper.md`, `nph-button.md`, `nph-file-upload.md`, `nph-field.md`, `nph-sidebar.md` and `nph-combobox.md`, and P115 to P124 in `docs/decisoes-tecnicas.md`

## Changes
- `nph-tooltip`: an element with an explicit `tabindex`, `-1` included, gets the balloon; `nph-tabs` no longer lends `tabindex="0"` to the cut tab.
- `nph-tabs`: the scroll arrows are drawn with a default name that follows the nearest `lang` when the product gives none.
- `nph-stepper`: the cut pending step of the linear stepper has a role, `aria-disabled` and `tabindex="0"`.
- `nph-button`: the `description` property; `nph-file-upload` gives it the rule or the reason.
- `nph-field`: no error line under a control that declares `nphFieldShowsError`.
- `nph-sidebar`: a new current page opens its parent groups in the panel menu.
- The Storybook dictionary, the sheets, P115 to P124 and the new P127.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-82-respostas origin/v/5.0.0`
- The proofs of the wave, in sequence, on the head of the pull request.

## Result
Not yet: the pull request is not open.

## Blocker
None. D-1 (the role of the cut pending step) is a pending decision for Indiane and does not block.

## Next command
Open the pull request against `v/5.0.0`, request Copilot, follow Azure, comment the ready-for-review phrase on the final head.
