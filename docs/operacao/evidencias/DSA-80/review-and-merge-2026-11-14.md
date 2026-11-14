```json
{
  "task": "DSA-80",
  "gate": "review-and-merge",
  "date": "2026-11-14",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor b46b79047538ea1bd2932dbf619a5e49b8ec4d65 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "ebd7099",
  "external_origin": null
}
```

# DSA-80 — `review-and-merge`

PR #173 (`feat/dsa-80-command`) added `nph-command`, the command palette, in the contract accepted in Figma on
2026-11-12 (documentation frame `6076:4910`, component set `6068:3936`, root `6067:3610`), and the options `nph-dialog`
needs to host it:

- **The palette**, one tag that draws an `nph-dialog` in its own shadow root and the palette inside it: a native
  `role="combobox"` field in the look of the `nph-input` `large` in focus, the commands by group in the look of the
  `nph-dropdown-menu` item, the states (results, groups, search, empty, loading) and the footer of hints. The keyboard
  is the combobox of the APG over a listbox, with the first command active while typing, Up and Down that stop at the
  ends and skip a disabled command, Home, End, Enter, Esc and a held Tab. It reports `nph-run` and `nph-search`, and the
  close goes out in the `nph-close` of the dialog. Ctrl+K and Command+K are the application's by default, and
  `global-shortcut` turns the listener on. The panel is centered and the width stays at the ceiling while the list
  filters. It comes with the CSS, the tests (`nph-command.test.ts`), the Validation and Fixtures stories, the Docs
  page, the Storybook dictionary in en, pt-BR and es, the sheet and its Metadata, and P123 in
  `docs/decisoes-tecnicas.md`.
- **The options of `nph-dialog`**, each off by default so the dialog of P87 does not change: `hide-heading`,
  `no-padding` and `close-on-backdrop`; the origins `backdrop`, `open-key` and `command-run` in `nph-close`
  `detail.source`; and the public method `requestClose(source)`, which amends the sentence of P87 "no `show()` or
  `close()` method" (`open` stays the only way to open and close from code). The tests are in
  `nph-dialog.options.test.ts`; the test that pins the list of properties of the dialog and the API table of its Docs
  test grew with the new names, and the other tests of the dialog are untouched.
- **Not changed:** `nph-dropdown-menu`, `nph-input`, `nph-empty` and `nph-combobox`.

The PR created or changed no token and did not edit `design.md`. The dark contrast of the destructive item and of the
field focus border was already fixed in the base by DSA-81, so the palette has no local override. It was merged on
2026-11-14T21:58:06Z, at commit `ebd7099`. The PR head, `b46b790`, is an ancestor of the tip of the integration
branch.

## How the review went

**Copilot did not review the code: every answer of `copilot-pull-request-reviewer` on #173 was "unable to review" (quota
exhausted). Elvys reviewed the pull request and authorized the merge on 2026-11-14.**

Copilot was requested when the pull request opened, and its one answer, on `b46b790`, was a comment saying it "was
unable to review this pull request because the user who requested the review has insufficient remaining quota". So the
pull request has no review thread from Copilot, and the change was not reviewed by Copilot at any point.

Before the pull request, the advisor of the session reviewed the work twice, once on the plan and once on the
finished change. The second review asked for three things, all done before the pull request opened: a test of the focus
under a real click (it found that a click on a group label, a disabled command or the footer took the focus from the
field, fixed by a `mousedown` rule on the surface), a test of the open state after the element is put back in the page
and after the dialog is drawn again (the watch of the dialog is made again), and the three options, `requestClose` and
the new origins in the Docs page and dictionary of `nph-dialog`. The accessibility gate of the stories found two
defects in the component before that, the accessible name of a command and a scroll area with nothing focusable,
fixed in `2f1f22b`.

The proofs were run in sequence, with every exit code read, on `b46b790`, the final head: `build:tokens`,
`test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`, `test:spelling`, `test:operacao`,
`build-storybook`, `build:lib`, `test:package` and `git diff --check` all exit 0. **`test:spelling`: cspell on every
file except `design.md` = 0; `design.md` is unchanged in this PR; the full cspell of `design.md` does not end (more
than 60 minutes).** The Azure checks on the final head, `iatecbr.IATec.Nephos`, the Build Stage and the Test Stage,
were SUCCESS, and the merge state was CLEAN. No accessibility exception was opened in any story.

## Command

```text
git merge-base --is-ancestor b46b79047538ea1bd2932dbf619a5e49b8ec4d65 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `b46b790` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`ebd7099`.

## Still open

Four decisions wait for Indiane, recorded in the task and in P123; none blocked the merge:

- **D-1**: the panel is centered, not near the top, because there is no token for the offset.
- **D-2**: the width stays at the 560 ceiling while the list filters, instead of hugging the content.
- **D-3**: the rest of a searched destructive label keeps the destructive color, while DSA-46 D-3 makes it gray.
- **D-4**: the halo of the field focus (5) is larger than `command/search-padding` (4), and the outer pixel is clipped
  by the dialog window.

The change has not had a Copilot review.
