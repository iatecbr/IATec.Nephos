```json
{
  "task": "DSA-73",
  "gate": "review-and-merge",
  "date": "2026-11-11",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 406d9fa4c1df869b6253d6045e0ec55d1732cf17 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "972c0c3",
  "external_origin": null
}
```

# DSA-73 — `review-and-merge`

PR #166 (`feat/dsa-73-stepper`) implemented `nph-stepper` in the contract accepted in Figma on 2026-11-10
(documentation frame `5569:6530`, component sets `5541:1622` and `5540:581`):

- **`nph-stepper`**, a piece of its own, horizontal only: from 2 to 7 steps, each with a label, an optional
  description (the reason, on a step with an error) and the word "Optional"; the statuses completed, current,
  pending and error, from the position or set by the page; linear by default and non-linear as an option;
  `steps` (property only), `current`, `non-linear`, `label`, the hidden status texts `completed-label`,
  `pending-label` and `error-label`, `optional-label` and `step-text`; a clickable step is a link with `href`
  and a button without it, and a button fires `nph-step-select`; a `nav` with an ordered list, `aria-current`
  on the current step, only the clickable steps in the Tab order; a cut label with the whole text in
  `nph-tooltip`; below 600 px of its own width the piece draws `nph-progress` of the steps type; the text column
  gives up its room first, the marker and the connector keep their structural minimum, and the list scrolls
  sideways below that; the invalid input that draws nothing and reports only in development. It consumes the
  `stepper/*` tokens already on `v/5.0.0` and creates or changes none. It comes with the component, CSS, tests,
  the Validation stories and Docs page, the Storybook dictionary in en, pt-BR and es, the sheet
  `fichas/nph-stepper.md`, its generated Metadata and P117 in `docs/decisoes-tecnicas.md`.
- `nph-checkbox.test.ts` and `nph-switch.test.ts`: two asserts on `design.md`, tied to the whole line or to a
  window of 600 characters, failed on the base after the token commits `add2227` and `0d366fd` appended
  sentences to the `use` of some tokens. They now match the start of the `use` and look for the sentence inside
  the entry of the token. Only test files changed, with Elvys's authorization through the orchestrator session.

The PR does not change `nph-icon`, `nph-tooltip`, `nph-progress`, `design.md` or any token. It was merged on
2026-11-11T18:49:10Z, at commit `972c0c3`, under Elvys's standing authorization of 2026-11-07. The PR head,
`406d9fa`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-11T18:20:43Z) and
again after each round of fixes (18:31:40Z and 18:39:54Z), and reviewed as `copilot-pull-request-reviewer`. The
entries of `elvysmarcos` in the review list are the replies to the Copilot threads, posted with Elvys's
account by the session that fixed them; they are not a code review. There were two rounds with findings that
the code had to answer, and a last one with no new finding:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `e88c0d9` | One thread: with seven steps near 600 px and the text at its maximum, the steps shrank below their own marker and connector and overlapped | `dde036a`: structural minimum on each step and item, scrolling when the minimums do not fit, with a regression test at 600, 608 and 700 px |
| `dde036a` | Two threads: the scroller that takes `tabindex="0"` when it scrolls had no focus indicator with forced colors; the word "Optional" went past the step area when the text column was squeezed | `406d9fa`, each with a regression test (an outline in `Highlight` with forced colors; one line and an ellipsis for "Optional") |
| `406d9fa` | No finding | Not applicable |

Before the first round, an internal review of the work found that the label of the current step could be cut
in a squeezed stepper; it was fixed in `4a2154d` with a regression test. The proofs were run on `406d9fa`, the
final head: all twelve exit 0, with 7520 tests in 179 files in `npm test`. The branch took no merge of the
base, which stayed at `1b98a1d` during the whole PR. `npm test` failed on the base in the two tests above; the
PR fixed them in `e88c0d9`, as a commit of its own, and recorded it in its description. The Azure Build and Test
were SUCCESS on the final head.

## Command

```text
git merge-base --is-ancestor 406d9fa4c1df869b6253d6045e0ec55d1732cf17 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `406d9fa` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`972c0c3`.

## Still open

Five decisions wait for Indiane, recorded in the task and in P117; none blocks the merge:

- **D-1**: the brand and error colors on `color/dialog` in dark fall below the contrast minimum for every
  component on a dialog; the stepper keeps its tokens.
- **D-2**: the 600 px of the narrow width is not one of the four breakpoints of `design.md`, and a query takes
  no custom property, so the CSS writes `37.5rem` in a container query on the stepper.
- **D-3**: on the narrow width `nph-progress` shows the position only, so a step with an error does not show as
  an error.
- **D-4**: the balloon of a cut label on a pending step of the linear stepper needs a focusable `span` with no
  role, and the hover background paints only the steps that can be activated.
- **D-5**: a status set against the position, such as a pending step before the current one, keeps the
  connector the position gives.
