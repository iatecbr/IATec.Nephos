```json
{
  "task": "DSA-55",
  "gate": "review-and-merge",
  "date": "2026-10-29",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 76552944d5822fe6c5ec0880941c8d96a44b526b origin/v/5.0.0",
  "exit_code": 0,
  "sha": "00f542e417cb3789960565deaa88e78a998da21c",
  "external_origin": null
}
```

# DSA-55 — `review-and-merge`

PR #146 (`feat/dsa-55-toolbar`) brought `nph-toolbar`: the bar that gathers, in one line, the
actions for one area of the screen, in the bulk, page, tools and floating types, and the
strip of applied filters below the page bar, in three sizes. The bar writes its size on the
pieces it holds, follows the W3C ARIA Authoring Practices toolbar pattern with a roving
tabindex, and moves the focus and announces the removal of a filter in the applied filters
strip.

The PR also brought:

- the CSS and the tests;
- seven Validation stories and the Docs page, with its test;
- the dictionary in en, pt-BR and es;
- the spec and its generated Metadata;
- P104.

The PR changes no token: it consumes the 14 `toolbar/*` tokens already on `v/5.0.0`, with
`elevation/dropdown` and `text/label-md`, and a test checks each one. In the bulk bar it
points the secondary ghost hover tokens of `nph-button` at
`toolbar/bulk-action-background-hover`, as `nph-dialog` does with the secondary color of its
buttons.

It was merged on 29-10-2026, at commit `00f542e`, by Elvys's authorization. The PR head,
`7655294`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested six times, at
2026-10-29T21:08:15Z, 21:17:00Z, 21:24:44Z, 21:32:59Z, 21:41:14Z and 22:03:18Z. It reviewed
six heads, as `copilot-pull-request-reviewer`. The reviews in the `elvysmarcos` name are the
replies to the threads, sent by the session through that account; they are not a code review.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `b42bec4` | A toggle button added to or removed from a group did not move the Tab stop; a clear button removed with the chips stopped the announcement and the focus; in a shadow root the focus was read from the document; a disabled neighbor chip took the focus | `9e5f10e`, with four regression tests |
| `9e5f10e` | A disabled ancestor fieldset left the bar with no Tab stop; in a shadow root, a focus taken outside it before a late removal was taken back | `bfeb593`, with two regression tests |
| `bfeb593` | No open thread; in the body of the review: an empty or hidden action could hold the Tab stop; two late removals overwrote each other; `$&` in the text of a chip was read as a replacement pattern | `0321396`, with three regression tests |
| `0321396` | No open issue; the summary pointed at a read-only neighbor chip, which has no X to focus | `d85a123`, with a regression test |
| `d85a123` | No open issue; the summary pointed at a hidden or undrawn neighbor chip | `7655294`, a sixth round that Elvys asked for, with a regression test |
| `7655294` | No open issue | — |

The six threads of the first two rounds were answered and are resolved; the findings of
rounds three and four, which came without a thread, were answered in comments. Each
regression test was seen failing on the head before its fix.

## Command

```text
git merge-base --is-ancestor 76552944d5822fe6c5ec0880941c8d96a44b526b origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `7655294` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `00f542e417cb3789960565deaa88e78a998da21c`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#146](https://github.com/iatecbr/IATec.Nephos/pull/146) | `00f542e` (2026-10-29T22:11:05Z) | `7655294` | `elvysmarcos` |

## Proof commands

Run on the final head `7655294`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 139 files, 5472 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline (build 612805) passed: the Build stage, the Test stage
and the overall check. On the earlier head `d85a123`, a first run of `npm test` failed once
on a timing test of `nph-tooltip`, another piece, and passed when run again.

## Still open

D-1 to D-5 stay in the task's `pending_decisions`, with Indiane, unchanged. They change no
token and do not block the task:

- D-1: the bulk hover on the secondary ghost actions only; the danger ghost action keeps its
  own;
- D-2: the arrow keys wrap at the ends, and the search field stays out of them, as a Tab stop
  of its own;
- D-3: the applied filters strip is a group, with a Tab stop on each X and on the clear
  button, and no arrow keys;
- D-4: the announcement of the clear button when it empties the strip;
- D-5: the bar does not collapse by itself on a narrow screen; the consumer composes it.

Two known limits, recorded in the pull request and not blocking: the bar does not observe the
visibility of its ancestors, so an action that becomes visible with no change of attribute
takes the Tab stop only at the next recalculation, and, when no action is visible, the drawn
ones keep the stop on purpose; and the announcement of the status region was proved by test,
not yet with a real screen reader.
