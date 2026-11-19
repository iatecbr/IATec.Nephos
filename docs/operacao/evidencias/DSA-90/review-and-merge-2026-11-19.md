```json
{
  "task": "DSA-90",
  "gate": "review-and-merge",
  "date": "2026-11-19",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 4906ba6fb5def1e4a225ae36db64ea32e9ba3af1 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "2049e6a",
  "external_origin": null
}
```

# DSA-90 — `review-and-merge`

PR 186 (`feat/dsa-90-date-picker`) brought the `nph-date-picker`, a date field with a calendar in two modes (a single date and a
range), and its date grid `nph-calendar`, in the contract accepted in Figma (frame `6673:62837`).

- **Components.** `src/components/nph-calendar/` and `src/components/nph-date-picker/`: the elements, their CSS, the browser tests,
  the pure logic with its tests, the Validation stories (including `Brands`), the Docs page of the date picker and its test, and the
  demonstration frames. `nph-calendar` is its own exported element (`mode`, `size`, `months` 1 or 2, `value`, `start`, `end`, `min`,
  `max`, `unavailable`, `month`, `week-start`, `now`, `labels`; events `nph-pick` and `nph-month-change`). `nph-date-picker` has the field,
  the calendar button, the panel in the top layer, seven shortcuts as `nph-option` in a listbox, the footer and the typed date; it is
  form-associated and fires `change`.
- **Internal element.** `nph-date-picker-control`, the control row that takes the `nph-field` contract and hands it to the `nph-input`
  beside the calendar button. It is not public: no folder, no sheet, dropped from the manifest. `scripts/test-package.mjs` lists it in
  `INTERNAL_ELEMENTS`, and `src/shared/docs/usage.test.ts` lists the date picker in `DATA_BY_PROPERTY` with `labels`.
- **Spec and decision.** `fichas/nph-calendar.md`, `fichas/nph-date-picker.md`, the generated Metadata, and P133 in
  `docs/decisoes-tecnicas.md`. The Storybook dictionary has the three languages.
- **Provisional rules.** D-1 to D-11 follow the column "Until the design owner answers" of the task, each named in the sheets and in
  P133. The code added D-12 (three measures with no token), D-13 (a typed Start or End with the panel closed) and D-14 (the page margin
  of the narrow switch), and extends D-4 to a Start typed after the End.
- **Not changed:** the tokens, `design.md`, the `nph-scheduler` and `fichas/nph-option.md`. No token was created or changed.

It was merged on 2026-11-19T00:32Z at commit `2049e6a`, by Elvys. The PR head, `4906ba6`, is an ancestor of the tip of the
integration branch.

## How the review went

**Elvys reviewed and merged PR 186; Copilot did not review (out of quota).**

The request for the Copilot review (`gh pr edit 186 --add-reviewer @copilot`) was made on each push, and the change was not reviewed
by Copilot at any point, so there is no round of fixes from it.

Before the pull request, the advisor of the session reviewed the work. Its findings changed the code and the text in these points,
each with a test: the Start typed after the End, the single date error that stayed after Esc, the property `labels` with no key at all,
the sheet and the decision aligned with the code, and the Views story for the month and year views.

**Proofs and Azure.** The 12 proofs were run in sequence on `4906ba6` (the merge of `origin/v/5.0.0` with DSA-89, which brought P132),
every exit code read: `build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`, `test:spelling` (cspell only on
the changed files, never on `design.md`), `test:operacao`, `build-storybook`, `build:lib`, `test:package` and `git diff --check` all
exit 0.

Azure, in three builds:

- Build 633430, on `ddb4aa8`: the Test stage failed twice. The first attempt failed only for infrastructure (`Failed to fetch dynamically
  imported module`, the iframe not ready); the one rerun failed again, and in it one real defect of this PR showed up: the `Views` story
  failed the accessibility gate (`label-content-name-mismatch`, the month cell named "January 2026" with the visible text "Jan"). It was
  fixed in `0b0d175`, with a test, and the name now starts with the visible text.
- Build on `0b0d175`: Build and Test passed.
- Build 633475, on `4906ba6`: Build passed; the first Test attempt failed only for infrastructure (17 files that could not import, 50
  "Failed to fetch dynamically imported module", no assertion error); the one rerun passed. Build and Test are SUCCESS on the PR, and the
  Storybook build (633476) passed.

## Command

```text
git merge-base --is-ancestor 4906ba6fb5def1e4a225ae36db64ea32e9ba3af1 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `4906ba6` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `2049e6a`.

## Still open

- **D-1 to D-11** wait for Indiane, as recorded in the task; the code follows the provisional rule of each one.
- **D-12 to D-14** wait for Indiane: the measures with no token, a typed Start or End with the panel closed, and the page margin of the
  narrow switch.
- **Known limits.** The narrow range panel has no story, because it depends on the width of the window and Storybook has no control for
  it; the tests prove it. The sheet of `nph-option` still says the option is written only inside the list that owns it; the date picker
  owns its shortcut list, and the sheet of the date picker records it. Nothing else is pending for this task.

The change has not had a Copilot review.
