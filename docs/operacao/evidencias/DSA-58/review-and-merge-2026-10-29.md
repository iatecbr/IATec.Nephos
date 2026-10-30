```json
{
  "task": "DSA-58",
  "gate": "review-and-merge",
  "date": "2026-10-29",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 0dc524b1555bb7768c7072025ec38cef7bdcbe0b origin/v/5.0.0",
  "exit_code": 0,
  "sha": "c4ea3c95e7737936f8bccf68617b73af7da9ec00",
  "external_origin": null
}
```

# DSA-58 — `review-and-merge`

PR #147 (`feat/dsa-58-data-table`) brought `nph-data-table`: the table to search, sort, select
and act on records. It extends the class of `nph-table` and keeps its cells, frame, fixed
header, grid, stripe and expanding row. It adds the sortable header with `aria-sort`, the
selection column of `nph-checkbox` with the selected row, the page and bulk `nph-toolbar` in
two slots, the more of each row with its `nph-dropdown-menu`, the switch column, the loading
and empty by search states, and the footer with `nph-pagination` in three layouts.

The PR also brought:

- the CSS and the tests;
- eight Validation stories and the Docs page, with its test;
- the dictionary in en, pt-BR and es;
- the spec and its generated Metadata;
- P105;
- protected extension points in `nph-table`, which draw by default what it drew before, and
  its development messages under the tag that reports them; the tests of `nph-table` did not
  change;
- the Custom Elements Manifest plugin reads the module of a superclass as its source file, so
  the inheritance points at `dist/nph-table/nph-table.js`.

The PR changes no token: it consumes the 13 `data-table/*` tokens already on `v/5.0.0`, with
the `table/*` tokens of `nph-table` and `focus/border`, and a test checks each one.

It was merged on 29-10-2026, at commit `c4ea3c9`, by Elvys's authorization. The PR head,
`0dc524b`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested six times, at
2026-10-29T23:13:37Z, 23:21:23Z, 23:28:37Z, 2026-10-30T00:12:17Z, 00:44:53Z and 00:51:34Z. It
reviewed six heads, as `copilot-pull-request-reviewer`. The reviews in the `elvysmarcos` name
are the replies to the threads, sent by the session through that account; they are not a code
review.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `f96e6f2` | The sortable header kept the cell padding in size large; the actions cell made the row taller than its token; items per page counted from a page past the total; wide without `page-sizes` lost the navigation | `c9683e5`, with four regression tests |
| `c9683e5` | No open thread; in the body of the review: the selection and switch cells made the row taller; the focus was lost when the header box was disabled; another bulk bar in the slot did not get the count; the focus was lost when the footer left | `794850e`, with four regression tests |
| `794850e` | With no other place, the focus left the table: the scroll area as the last place | `e684767`, with a regression test |
| `e684767` | No open issue; the summary pointed at the focus when the footer layout changes and at the switch of the demonstration after a new render | `4c50fd3`, with two regression tests |
| `4c50fd3` | The demonstration did not update the rows of the table when the switch turned | `0dc524b`, with a regression test |
| `0dc524b` | No open issue | — |

The five threads were answered and are resolved; the findings that came without a thread were
answered in comments on the pull request.

## Command

```text
git merge-base --is-ancestor 0dc524b1555bb7768c7072025ec38cef7bdcbe0b origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `0dc524b` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `c4ea3c95e7737936f8bccf68617b73af7da9ec00`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#147](https://github.com/iatecbr/IATec.Nephos/pull/147) | `c4ea3c9` (2026-10-30T01:00:25Z) | `0dc524b` | `elvysmarcos` |

## Proof commands

Run on the final head `0dc524b`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 143 files, 5618 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline (build 612890) passed: the Build stage, the Test stage
and the overall check. On the earlier head `e684767`, a run of `npm test` stalled on a loaded
machine, with failures spread over pieces the PR did not change; it was stopped and the
proofs were run again on the next head.

## Still open

D-1 to D-6 stay in the task's `pending_decisions`, with Indiane, unchanged. They do not block
the task:

- D-1: there is no breakpoint token for 850 and 420 px, so the footer follows
  `pagination-layout`, set by the consumer, and does not switch by itself;
- D-2: the `nph-icon` core has no down arrow, so descending is `arrow-up` turned half a turn;
- D-3: a click sorts another column ascending and turns the sorted one around;
- D-4: the header box checks and unchecks the rows drawn on the page;
- D-5: the skeleton rows while loading are the rows shown, or the page size;
- D-6: the switch column sits at the end of the row, before the actions.

One known limit, recorded in the pull request and not blocking: the last Copilot summary
mentioned edge cases of focus and accessible names without naming a case or opening a thread.
