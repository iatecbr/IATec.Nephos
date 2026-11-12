```json
{
  "task": "DSA-72",
  "gate": "review-and-merge",
  "date": "2026-11-11",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 779ad65e1dfaf7ba125c360bd8af1b3ce21e775d origin/v/5.0.0",
  "exit_code": 0,
  "sha": "c4ccdfd",
  "external_origin": null
}
```

# DSA-72 — `review-and-merge`

PR #165 (`feat/dsa-72-sidebar`) implemented `nph-sidebar` in the contract accepted in Figma on 2026-11-09
(documentation frame `4633:27036`, page `1367:2`, component sets `4605:9647`, `4605:9612`, `4605:9599`,
`4605:9589` and `4605:9594`):

- **`nph-sidebar`**, a piece of its own, with the item, the subitem and the rail button used by instance:
  the modes expanded, collapsed and mobile (a modal `<dialog>` with `sidebar/scrim` as its backdrop), the states
  ready and loading, `items` as data (property only, two levels in the list and the third in a flyout panel),
  the flyout panel as a `popover` drawn right after its opener, the logo, the search (`nph-input` on the
  `sidebar/search-*` tokens), the collapse button, the close button, the corner button, the empty and error
  messages, and the events `nph-mode-change`, `nph-close`, `nph-group-toggle`, `nph-search-change`,
  `nph-corner-action` and `nph-item-select`. It consumes the `sidebar/*` tokens already on `v/5.0.0` and
  creates or changes none. It comes with the component, CSS, tests, the Validation stories and Docs page, the
  Storybook dictionary in en, pt-BR and es, the sheet `fichas/nph-sidebar.md`, its generated Metadata and P116
  in `docs/decisoes-tecnicas.md`.
- `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button` (amendments of P98): the focus border
  on `focus/border`; more actions in the `nph-button` secondary; the subitem with `options` as a disclosure
  button; the rail button with `type="group"`, `expanded` and `nph-toggle`, the counter above the top end corner
  and a 4 px outline; `controls` in the three, which hands the element to the button as `ariaControlsElements`.
  Their sheets, Docs and Validation pages were updated.
- `nph-button`: one public focus hook, `--nph-button-focus-border`, read once on the focus border; with it
  unset nothing changes in the seven severities (a test proves it). `nph-sidebar` sets it on the close button.

The PR does not change `nph-icon`, `nph-input`, `nph-skeleton`, `nph-tooltip`, `design.md` or any token. It was
merged on 2026-11-11T22:24:11Z, at commit `c4ccdfd`, under Elvys's standing authorization of 2026-11-07. The PR
head, `779ad65`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-11T18:11:32Z) and
again after each round of fixes, and reviewed as `copilot-pull-request-reviewer`. The entries of `elvysmarcos`
in the review list are the replies to the Copilot threads, posted with Elvys's account by the session that fixed
them; they are not a code review. There were five rounds with findings that the code had to answer, and two
last reviews with no new finding:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `a6f5e7b` | Three threads: the `display: flex` of `.panel` undid the `display: none` of the closed mobile dialog; the options of a scrolling flyout shrank below `control/height-default`; the demonstration marked two pages as current | `0b6f4fa`, the first two with a regression test, the third by letting the demonstration mark one page |
| `31d5097` | Three threads: the counter of an active first rail button was clipped on top; the minimum width of the flyout could pass the window with a large font; the Docs page opened every flyout at once, over the content | `ac40408`, each with a regression test (the list takes the room of the counter, the minimum gives way to the window, the flyouts open only while their example is on the screen) |
| `ac40408` | One thread: the observer of the demonstration was not disconnected when it was removed | `41f6db1`, with a test that removes the page and checks the observers and the presses still waiting |
| `41f6db1` | No finding | Not applicable |
| `86462c8` | One thread: without a logo, the collapse and close buttons went to the start of the row | `895c267`, with regression tests in the three modes, with and without a logo |
| `895c267` | No finding | Not applicable |
| `779ad65` | No finding | Not applicable |

Before the first round, an internal review of the work led to the focus closing the flyout only when it leaves
the panel and the opener that holds it (`7ef10b2`). The branch took three merges of the base (`31d5097`,
`be902a8` and `86462c8`), resolved by joining the entries of `docs/decisoes-tecnicas.md` and of the Storybook
dictionary. The proofs were run on `779ad65`, the final head: all twelve exit 0. At the first proofs `npm test`
failed on the base in two tests of `nph-checkbox` and `nph-switch`, which read `design.md`; the pull request of
DSA-73 fixed them, and they were not touched here. The Azure Test failed on the way with network errors and with
one test of `nph-sidebar-item` that clicked fourteen groups with a pointer; it was hardened in `779ad65` with
`click()`, with no change to the assertion. The Azure Build and Test were SUCCESS on the final head.

## Command

```text
git merge-base --is-ancestor 779ad65e1dfaf7ba125c360bd8af1b3ce21e775d origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `779ad65` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`c4ccdfd`.

## Still open

Four decisions wait for Indiane, recorded in the task and in P116; none blocks the merge:

- **D-1**: the `sidebar` icon in `nph-icon`; until then the collapse button shows a skeleton in its place.
- **D-2**: the logo on a dark background, which the brand has not confirmed.
- **D-3**: in the collapsed menu nothing shows that the current page is inside a group until its flyout panel
  opens.
- **D-4**: the measures Figma does not give: the width of the flyout panel, the gap between lines, the padding
  of the group label and the gap of the logo row.
