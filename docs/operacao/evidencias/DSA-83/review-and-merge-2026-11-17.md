```json
{
  "task": "DSA-83",
  "gate": "review-and-merge",
  "date": "2026-11-17",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor bc55cec201975a1891bd1b7e51d96ba60eb60db8 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "e855156",
  "external_origin": null
}
```

# DSA-83 — `review-and-merge`

PR #178 (`feat/dsa-83-menubar`) added `nph-menubar`, the menu bar, in the contract accepted in Figma on 2026-11-16
(documentation frame `6432:8686`, component sets `6410:7769` and `6402:4299`, root `6410:7413`), and the two changes in
approved pieces that the task names:

- **The bar**, one tag with a row of top items that each open a panel, the APG menubar pattern (roving tabindex,
  `role="menubar"`, `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-keyshortcuts`). The panel and the submenu
  of one level are drawn by the piece itself with the same `dropdown/*` tokens and the same look as `nph-dropdown-menu`
  (P126, which follows P113 for `nph-context-menu`), because the unmodified `nph-dropdown-menu` cannot open a second
  panel beside an item. The items that do not fit go into a last `More` item; `narrow` swaps the bar for the `bars`
  button, which opens the same panel. It reports `nph-item-select`. It comes with the CSS, the tests, the Validation
  and Fixtures stories, the Docs page, the Storybook dictionary in en, pt-BR and es, the sheet and its Metadata, and
  P126 in `docs/decisoes-tecnicas.md`.
- **The focus border of the item** of `nph-dropdown-menu` and `nph-context-menu`, from `color/primary` to
  `focus/border`: the lowest contrast of the 7 brands and 2 themes is 4.32:1, and `color/primary` fell below 3:1 in
  dark in 4 brands. Tests and the two sheets follow.
- **The submenu gap of `nph-context-menu`**, from 0 to `dropdown/submenu-offset`, read from the token.
- **Not changed:** the tokens and `design.md`. No token was created or changed.

It was merged by Elvys on 2026-11-17T11:35:16Z, at commit `e855156`. The PR head, `bc55cec`, is an ancestor of the tip
of the integration branch.

## How the review went

**Copilot did not review the code, and #178 has no review recorded on GitHub: no review and no requested reviewer
appear on the pull request. Elvys reviewed and merged it on 2026-11-17.**

The pull request has no requested reviewer and no review thread from Copilot, so the change was not reviewed by
Copilot at any point. The review by Elvys was not written on the pull request.

Before the pull request, the advisor of the session reviewed the plan and the finished change. The accessibility gate
of the stories found one defect before the pull request opened, the checked single choice in `color/primary-hover`,
which fell to 1.01:1 in dark in the Brands story; it is now `color/primary-text`.

**The Azure Test Stage of the pull request was red on the final head, `bc55cec`.** The Build Stage and the Storybook
build passed, and the Test Stage ended with one error, "Bash exited with code 1" (build 629910). The log could not be
read from this session. The same head failed locally in one test only, `nph-scheduler.test.ts` "every scheduler token is
read by the CSS", a red that was already in the base and that DSA-85 fixed. The cause on Azure is therefore the same
test by inference, not confirmed from its log. The merge was done with that stage red.

After the merge, the proofs were run in sequence, with every exit code read, on `d7556a5`, the tip of `v/5.0.0` with
the DSA-85 fix: `build:tokens`, `test:tokens`, `test` (212 files, 9349 tests), `typecheck`, `test:i18n`,
`test:naming`, `test:spelling`, `test:operacao`, `build-storybook`, `build:lib`, `test:package` and `git diff --check`
all exit 0. **`test:spelling`: cspell on every file except `design.md` = 0; `design.md` is unchanged in this PR; the
full cspell of `design.md` does not end (more than 60 minutes).** No accessibility exception was opened in any story.

## Command

```text
git merge-base --is-ancestor bc55cec201975a1891bd1b7e51d96ba60eb60db8 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `bc55cec` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `d7556a5`.

## Still open

Four decisions wait for Indiane, recorded in the task and in P126; none blocked the merge:

- **D-1**: a top item that is open and in keyboard focus at once shows the two accepted looks together; Figma draws
  them apart.
- **D-2**: Enter closes a checkbox and a radio and Space does not, as the contract says for the keys; a click on a
  multiple choice keeps the panel open, as the other menus do.
- **D-3**: a click opens the panel with the first item focused and the ring not shown, as P92 and P113 do; the contract
  says no item highlighted.
- **D-4**: the panel is not an instance of `nph-dropdown-menu` in code (P126).

Elvys also confirms the `SUPPLEMENTARY_TEXT_EXCEPTION` of the Docs page, as recorded in the pull request.

The change has not had a Copilot review.
