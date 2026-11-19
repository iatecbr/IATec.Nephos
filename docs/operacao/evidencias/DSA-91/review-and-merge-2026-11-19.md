```json
{
  "task": "DSA-91",
  "gate": "review-and-merge",
  "date": "2026-11-19",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor beefc26cab597869a985fa4bfc5ec7b3e88f0d7d origin/v/5.0.0",
  "exit_code": 0,
  "sha": "f31c776",
  "external_origin": null
}
```

# DSA-91 — `review-and-merge`

PR 187 (`feat/dsa-91-rich-option`) brought the `nph-rich-option` card, a form choice with a title and a description where the whole
card checks the option, and the rich look of the `nph-option` with a description in the `nph-select`, `nph-combobox` and
`nph-multi-combobox` list, in the contract accepted in Figma (frame `6935:11785`).

- **Components.** `src/components/nph-rich-option/`: the element, its CSS, the browser tests (the card, the rich option inside the
  three lists with a real pointer, the Docs page), the demonstration frame, the Validation stories (including `Brands`) and the Docs
  page. The card holds the role, the state and the focus itself (`ElementInternals`); the control drawn at its start is an inert
  visual indicator. `nph-option` gained `rich`, `description` and `keyboard`, with its own CSS file `nph-option.rich.css`; the three
  lists write `keyboard` from the last input, and the combobox entries gained `rich` and `description`.
- **Change outside the piece.** One line in `nph-radio`: an `inert` radio, a visual indicator inside another piece, skips the
  composition check and logs nothing, with a regression test (it amends P82).
- **Spec and decision.** `fichas/nph-rich-option.md`, the updated sheets of `nph-option`, `nph-select`, `nph-combobox`,
  `nph-multi-combobox` and `nph-radio`, the generated Metadata, and P134 in `docs/decisoes-tecnicas.md`. The Storybook dictionary has the
  three languages; the option API of the `nph-select` Docs page names the new properties.
- **Declared differences.** Enter follows the control the card holds (nothing on a checkbox or radio card, a toggle on a switch card)
  and does not submit the form, which the accepted table lists. A group of radio cards inside `nph-field` is read as a `group`, not a
  `radiogroup`. The selected rich option has no background (a deviation from DSA-29 D8 and D-3, only for the rich option).
- **Not changed:** the tokens, `design.md`, the look of the plain option, `focus/halo-error` and the shortcut of the option. No token was
  created or changed.

It was merged on 2026-11-19T11:32Z at commit `f31c776`, by Elvys. The PR head, `beefc26`, is an ancestor of the tip of the
integration branch.

## How the review went

**Elvys reviewed and merged PR 187; Copilot did not review (out of quota).**

The request for the Copilot review (`gh pr edit 187 --add-reviewer @copilot`) did not register a reviewer (`reviewRequests` stayed
empty), and the change was not reviewed by Copilot at any point, so there is no round of fixes from it.

Before the pull request, the advisor of the session reviewed the plan and the delivery. Its findings changed the work in these points,
each with a test or a record: the real pointer over a list taller than its limit, the Enter behavior and its record in P134 and the
sheet, the option API of the `nph-select` Docs page, the sheet of `nph-radio`, the pending decision D-4 in the task, and the sources
declared in the context.

**Proofs and Azure.** The 12 proofs were run in sequence, every exit code read: `build:tokens`, `test:tokens`, `test` (242 files,
10,749 tests), `typecheck`, `test:i18n`, `test:naming`, `test:spelling` (cspell only on the changed files, never on `design.md`),
`test:operacao`, `build-storybook`, `build:lib`, `test:package` (62 tests) and `git diff --check` all exit 0, on `37c5e9f` and again on
`beefc26`, the head of the pull request. The syncs with the base that came after the first run brought only documentation of
`docs/operacao/**` (DSA-94 and DSA-96).

Azure, build 633519: Build and Test failed only for infrastructure (the iframe of `test:package` not ready in 60 s, and the timing
flake of `nph-tooltip` with no assertion of this task); the one rerun of the stages was done through the Azure DevOps API. After the
syncs, Build, Test and Storybook (633521) were SUCCESS on the PR at the final head `beefc26`.

## Command

```text
git merge-base --is-ancestor beefc26cab597869a985fa4bfc5ec7b3e88f0d7d origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `beefc26` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `f31c776`.

## Still open

- **D-4** waits for Indiane: where the 20 px icon sits on the card. The code follows the provisional rule, the icon centered on the first
  line of the title, as recorded in the task and in P134.
- **Known limits.** A group of radio cards inside `nph-field` reads as a `group` (a follow-up lets the field read the role of the
  instance); the control inside the card shows no hover on card hover (DSA-45 D-3); the description is announced through
  `aria-description` and was proved in Chromium only; the card has no `forced-colors` or right-to-left treatment. Nothing else is
  pending for this task.

The change has not had a Copilot review.
