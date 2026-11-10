```json
{
  "task": "DSA-71",
  "gate": "review-and-merge",
  "date": "2026-11-09",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 205d905f450b299053758be55073273c6018af9c origin/v/5.0.0",
  "exit_code": 0,
  "sha": "88cb22b",
  "external_origin": null
}
```

# DSA-71 — `review-and-merge`

PR #162 (`feat/dsa-71-tabs`) implemented `nph-tabs` in the contract accepted in Figma on 2026-11-09
(documentation frame `3483:11200`, component sets `3472:9192`, `3472:8748` and `3472:8747`):

- **`nph-tabs`**, a piece of its own: five styles (segmented, underline, and the solid, light and outline
  tab button); an optional start icon, counter and tag on each tab, in that order; `tabs` (property only),
  `value`, `variant`, `activation`, `label`, `scroll-previous-label` and `scroll-next-label`; the panel of each
  tab is the slot named by its `value`, and the piece draws the `tabpanel` in its own root; the event
  `nph-tab-change`; the keyboard of the APG Tabs pattern, with one Tab stop, wrap, Home and End, and automatic
  or manual activation; the underline scrolls with `nph-button` arrows at both ends, and the other styles cut
  a label that does not fit, with the whole text in an `nph-tooltip`; the invalid input that draws nothing and
  reports only in development. It consumes the fifty `tabs/*` tokens already on `v/5.0.0` and creates or
  changes none. It comes with the component, CSS, tests, the Validation stories and Docs page, the Storybook
  dictionary in en, pt-BR and es, the sheet `fichas/nph-tabs.md`, its generated Metadata and P115 in
  `docs/decisoes-tecnicas.md`.
- `cspell.config.yaml`: the ARIA words `tablist` and `tabpanel`.

The PR does not change `nph-badge`, `nph-icon`, `nph-button` or `nph-tooltip`. It was merged on
2026-11-10T02:57:25Z (2026-11-09 in Brazil), at commit `88cb22b`, under Elvys's standing authorization of
2026-11-07. The PR head, `205d905`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-10T01:08:05Z) and
again after each round of fixes (01:44:26Z, 02:17:29Z, 02:27:10Z and 02:38:03Z), and reviewed as
`copilot-pull-request-reviewer`. The entries of `elvysmarcos` in the review list are the replies to the
Copilot threads, posted with Elvys's account by the session that fixed them; they are not a code review.
There were three rounds with findings that the code had to answer, and a last one with no new finding:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `d39c3df` | Three threads: the scroller clipped the focus border and halo of the first and last tab; a panel with a `tabindex="-1"` button or a disabled `nph-button` counted as having a focusable item; the balloon of a cut tab closed when the pointer crossed to it | `f8017df`, each with a regression test |
| `f8017df` | No finding | Not applicable |
| `8f8eae3` | One thread: a panel with a readonly `nph-chip` whose label fits lost its `tabindex="0"`, since the chip has no target | `2abc814`, with a regression test (the search for a Tab target goes inside the shadow roots of the components of the consumer) |
| `2abc814` | Three threads: a list removed and put back while the pointer lent a Tab stop kept two Tab stops; a `dir` that changed after the mount left the arrows and the scroll on the wrong side; a shadow host with a negative `tabindex` was not left out of the Tab count | `205d905`, each with a regression test (checked in Chromium that such a host takes its whole shadow tree out of the Tab order) |
| `205d905` | No finding | Not applicable |

The proofs were run on `205d905`, the final head: all twelve exit 0, with 7315 tests in 175 files in
`npm test`. The branch took two merges of `origin/v/5.0.0`, `8f8eae3` (PR #163, DSA-70) and `3fd9f67`
(documentation of operation only); the first had one conflict, in `docs/decisoes-tecnicas.md`, resolved as the
union of P114 and P115, and the proofs were run again after each merge. The Azure Build and Test were SUCCESS on
the final head. While PR #163 was not merged, `npm test` failed on the base in one test of `nph-context-menu`
(`nph-context-menu.test.ts:1493`, the tokens `--nph-context-menu-long-press-*` already in `tokens.css`),
which the DSA-70 fixed; the PR recorded it and no other piece was changed for it. The Azure Test also needed a
rerun for `ERR_NETWORK_CHANGED`, with no test failing in the code.

## Command

```text
git merge-base --is-ancestor 205d905f450b299053758be55073273c6018af9c origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `205d905` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`88cb22b`.

## Still open

Five decisions wait for Indiane, recorded in the task and in P115; none blocks the merge:

- **D-1**: the balloon of a cut tab needs a temporary `tabindex="0"` on the tab under the pointer, since
  `nph-tooltip` only opens on an element with `tabIndex` of 0 or more.
- **D-2**: the text of the names of the two scroll arrows (`scroll-previous-label` and `scroll-next-label`),
  which the icon-only `nph-button` requires and the documentation does not give.
- **D-3**: the number above 99 shows `99+`; the documentation only cites it as an example.
- **D-4**: the segmented and tab button styles cut the label with a balloon instead of scrolling.
- **D-5**: the scroll arrows keep their name for the screen reader, since `aria-hidden` on `nph-button` fails
  the gate (`aria-hidden-focus`).
