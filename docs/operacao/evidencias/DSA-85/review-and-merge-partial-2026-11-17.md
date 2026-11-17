```json
{
  "task": "DSA-85",
  "gate": "review-and-merge",
  "date": "2026-11-17",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor fbe57196cdaa9835820fa70dabf3224820abf7bf origin/v/5.0.0",
  "exit_code": 0,
  "sha": "d7556a5",
  "external_origin": null
}
```

# DSA-85 — `review-and-merge`, partial

Two pull requests applied in the code the answers Indiane gave on 2026-11-16 on the Figma previews, in every row
of the table of the task except the one of the `nph-command` offset:

- **PR #177** (`feat/dsa-85-respostas`, head `76640b7`, merge `e9632b9`): the CSS of `nph-scheduler` reads
  `scheduler/hour-height`, `month-row-min-height`, `list-time-width`, `list-time-width-compact` and
  `mini-month-cell-size` (the mini month cell goes from 28 to 36), which makes the base green again; the connector
  of `nph-stepper` follows the status of the step before it, and on the narrow width a step in error gives
  `nph-progress` the error status; `nph-collapsible` hides the button of the preview type when the text fits in three
  lines; the rail button of a group that holds the current page shows the active look, and the arrow of a first-level
  group of the panel menu turns 180 degrees; the token build takes a `%` dimension and stops on a unit other than `px`
  and `%`; the sheets, the Storybook dictionary in en, pt-BR and es, and P115 to P124 follow.
- **PR #179** (same branch, head `fbe5719`, merge `d7556a5`): the icons `sidebar` and `repeat` in `nph-icon`
  (the edit of the `icones_nucleo` list in `design.md` authorized by Elvys on 2026-11-17, in its own commit, as in
  P119 item 14), the collapse buttons of `nph-sidebar` and `nph-scheduler` drawing `sidebar`, and the recurring
  event drawing `repeat`.

Neither PR changes a token. Both heads are ancestors of the tip of the integration branch.

**The gate stays `pending`.** The `nph-command` row needs the tokens `command/offset-top` and
`core/layout-offset/top`, which are not on `v/5.0.0`; the code agent never creates a token (pending decision `T-2`,
Indiane, in Figma). When they are in, the panel opens at that distance from the top by a change of its CSS and this
gate can pass. `D-1` and `D-2` are open for Indiane and do not block.

## How the review went

Elvys reviewed and merged #177 and #179. Copilot did not review either PR: it was requested with
`gh pr edit --add-reviewer @copilot` on both and the account is out of quota, so there is no Copilot review and no
review thread.

The proofs were run on the final head of each PR: build:tokens, test:tokens, test, typecheck, test:i18n,
test:naming, test:spelling (everything except `design.md`, which makes cspell hang; the two names added there are
icon names), test:operacao, build-storybook, build:lib, test:package and `git diff --check` all exit 0 (212 files,
9349 tests on `fbe5719`). The Azure Build and Storybook passed on both heads. The Azure Test stage failed on both with
`ERR_NETWORK_CHANGED` and `Failed to fetch dynamically imported module` while Chromium loaded test files, and with
15 s timeouts in `nph-scheduler.docs.stories`, `nph-pagination.docs.stories` and `nph-data-table.docs.stories`; those
stories take 0.6 s to 2 s locally. The stage was run again once on #177, with the same kinds of failure. It was not
run again on #179. The next Azure run on `v/5.0.0` is the one that counts.

## Command

```text
git merge-base --is-ancestor fbe57196cdaa9835820fa70dabf3224820abf7bf origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `fbe5719` is an ancestor of `v/5.0.0`, and so is `76640b7`. Checked against
`origin/v/5.0.0` at `d7556a5`.

## Still open

- **T-2**: the tokens of the `nph-command` offset, for Indiane (see above).
- **D-1** and **D-2**, for Indiane: the narrow bar of `nph-stepper` with a step in error, and the active look of the
  group rail button with no `aria-current`.
