```json
{
  "task": "DSA-76",
  "gate": "review-and-merge",
  "date": "2026-11-15",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor e5c37e2491af1d38325728f9228940cfa471007d origin/v/5.0.0",
  "exit_code": 0,
  "sha": "0a33391",
  "external_origin": null
}
```

# DSA-76 — `review-and-merge`

PR #174 (`feat/dsa-76-panel-menu`) added the panel menu, a navigation mode of `nph-sidebar`, in the contract accepted
in Figma on 2026-11-11 (documentation frame `5928:2591`, component sets `5607:97` and `5608:168`). It adds no new
public tag:

- **The mode**, chosen by the new property `navigation` (`flyout`, the default, or `panel-menu`). The same `items`
  serve both modes: a child with `options` is the subitem with a flyout in `flyout` and the subgroup in `panel-menu`,
  and a child gains `expanded?: boolean`, read only in the panel menu. In the panel menu the third level opens in
  place, as an accordion, and several groups can stay open at once. The group of the current page and its parents are
  born open. The open state is kept inside the sidebar by key, so it survives a new `items`: the person's choice wins,
  a new `expanded` written by the product seeds it, and otherwise the block that holds the current page is born open
  once. `nph-group-toggle` also fires for the subgroup.
- **The movement**, a block that grows in place in `panel-menu/expand-duration` and `panel-menu/expand-easing`, with
  the phases of `nph-collapsible` (P121); the subgroup arrow swaps `chevron-down` and `chevron-up` and turns 180
  degrees; with reduced motion nothing moves.
- **Loading**, one `nph-skeleton` row per first-level item with `aria-busy`. Collapsed keeps the rails and flyouts and
  mobile draws the panel menu inside the dialog, as the accepted contract asks.
- It comes with the CSS (only `--nph-panel-menu-*` and existing tokens), 37 new tests in `nph-sidebar.test.ts`, the
  `PanelMenu` story, the Docs page section, the Storybook dictionary in en, pt-BR and es, the sheet
  `fichas/nph-sidebar.md` with its Metadata, and P124 in `docs/decisoes-tecnicas.md`. The existing `nph-sidebar`
  tests stay green; the few that pin the list of properties, the defaults and the Docs page grew with the new names.
- **Not changed:** the flyout mode, collapsed and mobile modes, and the items, subitems and section labels already
  approved.

The PR created or changed no token and did not edit `design.md`. It was merged by Elvys on 2026-11-15T22:32:39Z, at
commit `0a33391cd01670e3eefcf824915f197b64db16da`. The PR head, `e5c37e2`, is an ancestor of the tip of the
integration branch.

## How the review went

**Copilot did not review the code. The request for its review on #174 was never registered by GitHub: there is no
pending reviewer, no `review_requested` event, no review, no comment and no thread from Copilot on the pull request.
The likely cause is that the Copilot review quota is exhausted. Elvys reviewed the pull request (as relayed by the
orchestrating session: "Revisei, pode mergear o #174", 2026-11-15) and merged it himself.**

The reviewer was asked for three times when the pull request opened, once of them through the REST API, and none
registered. So the change was not reviewed by Copilot at any point, and the pull request was not marked "Pronto para
merge": the comment on it says "Pronto para revisão" and says that the Copilot review did not happen.

Before the pull request, the advisor of the session reviewed the plan. It found five flaws, all fixed before the code
was committed: the open state did not survive a new `items` (redesigned as internal state kept by key, with the
precedence above), tests that depended on the clock (made deterministic by pausing the CSS transition and reading
phases), the sheets of the pieces by instance had not been read (read and listed in the context), the push refspec,
and a temporary spelling file that now exists only while the spelling proof runs.

The proofs were run in sequence, with every exit code read, on `e5c37e2`, the final head: `build:tokens`,
`test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`, `test:spelling`, `test:operacao`,
`build-storybook`, `build:lib`, `test:package` and `git diff --check` all exit 0 (9015 tests pass).
**`test:spelling`: cspell on every file except `design.md` = 0; `design.md` is unchanged in this PR; the full cspell of
`design.md` does not end (more than 60 minutes).** The Azure checks on the final head, the Build Stage and the Test
Stage (build 628188), were SUCCESS, and the merge state was CLEAN. The base `568848b` was contained in the head, by
merge. Auto-fix was denied by the app, so Azure was followed with `gh`. No accessibility exception was opened in any
story.

## Command

```text
git merge-base --is-ancestor e5c37e2491af1d38325728f9228940cfa471007d origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `e5c37e2` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`0a33391`.

## Still open

Three decisions wait for Indiane, recorded in the task and in P124; none blocked the merge:

- **D-1**: in the panel menu the section label has no vertical padding of its own, so the gaps are exactly the tokens
  (`panel-menu/label-gap`, `panel-menu/section-gap`); the label of the flyout navigation did not change.
- **D-2**: the arrow of the subgroup turns 180 degrees, but the group item of the first level (DSA-53) swaps the
  chevron without turning; whether it should turn too is for another task.
- **D-3**: a group the person closed stays closed also when the product sends a new list with a new current page
  inside it.

The change has not had a Copilot review.
