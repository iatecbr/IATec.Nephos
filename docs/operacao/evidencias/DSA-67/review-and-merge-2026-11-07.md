```json
{
  "task": "DSA-67",
  "gate": "review-and-merge",
  "date": "2026-11-07",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 6a1ef8901df8c813ab17336e73a5334411956ec1 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "747d15c9275e15d90700067abfd6cc4fb24eca57",
  "external_origin": null
}
```

# DSA-67 — `review-and-merge`

PR #155 (`feat/dsa-67-popover`) implemented `nph-popover` in the contract accepted in Figma on
2026-11-06 (documentation frame `4749:5857`, set `4727:1544`):

- the non-modal floating surface anchored to a trigger found by `for` in the same root, on four sides
  (`bottom`, `top`, `right`, `left`) and three alignments (`start`, `center`, `end`), with an optional
  decorative arrow, in three widths (`sm`, `md`, `lg`, 240, 320 and 400), with an optional description,
  body (default slot), close button (`closable` and `close-label`) and footer (`footer` slot, with the
  divider that comes with it);
- the layer: `popover="manual"` in the top layer, placed by JavaScript from the trigger, turned to the
  opposite side when the one asked for does not fit, kept inside the window, following the trigger on
  scroll and resize; `inert` while it leaves;
- the closes and the focus: Esc (in the bubbling phase, after the controls of the body, and for the last
  popover shown), a press outside, the close button, the footer action (the consumer sets `open` to
  `false`) and the focus leaving the trigger and the popover; the event `nph-close` with the source; the
  focus rule of P87 on open and the focus back to the trigger on close; an inactive trigger opens
  nothing;
- the trigger writes: `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` (the popover host,
  which follows the id the consumer gives it);
- `nph-button` (amends P68, scoped to `aria-haspopup="dialog"`): the trigger of an open popover draws
  the `hover-active` state, icons included, and hands `aria-haspopup` and `aria-expanded` to its native
  button, with no new variant and no new property;
- `nph-field`: the error message moves from `status/error` to `status/error-text`; light is unchanged and
  dark goes from 3.37:1 to 4.69:1 over the popover;
- the component, CSS, tests, the Validation stories and Docs page, the Storybook dictionary in en, pt-BR
  and es, the sheet `fichas/nph-popover.md` and its generated Metadata, the edits of the sheets of
  `nph-button` and `nph-field`, and P111 in `docs/decisoes-tecnicas.md`.

The PR changes no token and does not edit `design.md`, `nph-dialog`, `nph-label`, `nph-dropdown-menu`
or `nph-navigation-menu`. The group selection demo of `nph-checkbox` reads `space/inline-loose` and went
from 16 to 12 with no change of code; no test asserted the 16 (recorded in P111). It was merged on
2026-11-08T00:51:36Z (2026-11-07 at UTC-3), at commit `747d15c`, under Elvys's standing authorization
of 2026-11-07. The PR head, `6a1ef89`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-07T23:24:21Z)
and again after each round of fixes (23:37:08Z, 23:50:30Z, 00:03:06Z and 00:24:17Z on 2026-11-08), and
reviewed as `copilot-pull-request-reviewer`. The threads were answered in a general PR comment per round,
with the finding, the fixing commit and the regression test; Elvys resolved the threads himself. Four
rounds had findings that the code had to answer, and the fifth had none. Every defect got a regression
test that fails on the code before the fix:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `1967726` | The footer actions of the demos did not close the popover; Esc in the capture phase closed the popover before an open `nph-select` list; Shift+Tab from the trigger left without closing; reopening during the exit did not bring the focus back into the surface | `c1cac01` |
| `2437aeb` | A demo that was left blurred the focus of another page; with two popovers open, the first listener took the Esc for both; a text node edited in place did not show the body; the surface stayed focusable and clickable during the exit | `827cd71` |
| `827cd71` | A body forwarded through the `<slot>` of a consumer component was taken as outside; a trigger replaced by another node with the same id was not wired again | `6a50740` |
| `1d63e08` | The divider ignored an override of `popover/border-width`; the demo queue could take the focus the person had moved; `aria-controls` kept an old id and the cleanup could remove the consumer's id; `open` set from code opened over an inactive trigger | `6a1ef89` |
| `6a1ef89` | No open issue, no open thread | — |

Between the third and fourth rounds, `3285faa` made the focus test of the Docs page patient (see the
Azure pipeline below). After `c1cac01` the branch also received merges of `origin/v/5.0.0`, with no change
of the component: `2437aeb`, `5dc21ae` and `1d63e08`. The merges `5dc21ae` (DSA-62, P110) conflicted in
`docs/decisoes-tecnicas.md` and in the three Storybook dictionaries, solved by keeping both sides with the
text of neither changed. All 14 threads of the PR are resolved.

## Command

```text
git merge-base --is-ancestor 6a1ef8901df8c813ab17336e73a5334411956ec1 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `6a1ef89` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `747d15c9275e15d90700067abfd6cc4fb24eca57`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#155](https://github.com/iatecbr/IATec.Nephos/pull/155) | `747d15c` (2026-11-08T00:51:36Z) | `6a1ef89` | `elvysmarcos` |

## Proof commands

Run on `6a1ef89`, the final head, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 163 files, 6647 tests, with the accessibility gate of the stories; see the note below |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

Each earlier head with a change of content (`f0a1c46`, `2437aeb`, `827cd71`, `1d63e08`, `3285faa`) ran
the same twelve proofs with `0`. On `6a1ef89`, the first run of `npm test` failed two assertions of
`nph-navigation-menu.test.ts` ("a hover wait follows its trigger when the items are reordered…" and
"items that become invalid during a hover wait cancel it…"), a piece of DSA-62 that this PR does not
touch. The file passed three times alone, and the whole `npm test` passed again on the same head.

## Azure pipeline

On the final head `6a1ef89` (build 620338), the Build stage passed. The Test stage failed on the first
attempt with one test of another piece, `nph-navigation-menu.test.ts` ("the pointer › leaving the trigger
closes the panel after the same wait, not before"): a timing test of the base, which is unstable under
load. It is neither `net::ERR_NETWORK_CHANGED` nor the `nph-tooltip` timing test of P106. The Test stage
was run again, with no change of code, by authorization of the orchestrator, and passed: the Build
stage, the Test stage and the overall check. The base fix, a deterministic wait with a fake clock, is
PR #158 (`fix/nph-navigation-menu-hover-tests`), outside this task.

Earlier failures of the pipeline, each on a head before the final one:

- Build 620322, head `2437aeb`: one test of `nph-sidebar-item` ("Brands: closing a group hides its
  subitem…", `locator.click: Timeout 142ms exceeded` after 14.9 s), a piece this PR does not touch. The
  next push started another run.
- Build 620327, head `827cd71`: a test of this PR, the focus test of the Docs page, which waited 3 s for
  an opening queued behind others on a loaded agent. It was a defect of the test, not of the component:
  `3285faa` made the demo queue skip pages that were left and the test wait up to 15 s. Build 620335, on
  `3285faa`, passed.

## Still open

D-1 to D-4 stay in the task's `pending_decisions`, unchanged. None blocks the task:

- D-1, with Indiane: with the arrow, the accepted contract gives the offset as 4 and the arrow as 16 by 8
  and does not say where they meet. The code keeps the tip 4 from the trigger and puts the surface one
  arrow height further. Should the surface be 4 from the trigger, with the arrow over the gap?
- D-2, with Indiane: the open look and the ARIA of the native button apply only to a trigger that carries
  `aria-haspopup="dialog"`, so the trigger of `nph-dropdown-menu` keeps its look. Should it look open too?
  It belongs to a round of that piece.
- D-3, with Indiane: `aria-controls` points to the popover host, not to the surface, because an id
  reference does not cross a shadow root.
- D-4, with Indiane: the title is drawn in `text/label-lg`, which matches the accepted core typography,
  while `design.md` says that role is not for titles. A role or tokens for the popover title are hers
  to give.
- Not opened as a decision, known limits recorded in the sheet and in P111: the surface does not constrain
  its height, so one taller than the window does not scroll; an `nph-select` that has the focus with its
  list closed uses the Esc itself, so the popover closes on the next one; a popover inside a dialog is
  out of scope.
