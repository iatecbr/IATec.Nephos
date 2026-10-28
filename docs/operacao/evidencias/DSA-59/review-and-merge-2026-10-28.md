```json
{
  "task": "DSA-59",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor db15bee9c44738ffee1a276098c16563a6f19a7d origin/v/5.0.0",
  "exit_code": 0,
  "sha": "74054ef0a075410f7f073e24f7097df606e95224",
  "external_origin": null
}
```

# DSA-59 — `review-and-merge`

PR #139 (`claude/strange-goldberg-ae2bb1`) brought the size `compact` of `nph-input`, the
28 px field for the search of the compact `nph-toolbar` and for the compact table. The field
takes `input/height-compact` and, in every state, `input/clear-padding-end` as its end
padding. Everything else is the same as in the other sizes.

The PR also brought:

- the tests of the measures, of the clear target and of the clear focus ring, which goes past
  the field and is not clipped;
- the `compact` column in the Validation matrix and in the Docs matrix, and the `compact`
  search in light and dark mode in the Sizes section;
- the dictionary in en, pt-BR and es;
- the spec and its generated Metadata;
- the amendment of 28/10/2026 to P80.

The PR changes no token: it consumes the two `input/*` tokens that came with the task on
`v/5.0.0`.

It was merged on 28-10-2026, at commit `74054ef`, by Elvys's authorization. The PR head,
`db15bee`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested three times, at
2026-10-28T20:18:22Z, 20:28:37Z and 20:35:04Z. It reviewed three heads, as
`copilot-pull-request-reviewer`. The two reviews in the `elvysmarcos` name on `5c38fd2` and
`d17ef21` are the replies to the threads, sent by the session through that account; they are
not a code review.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `5c38fd2` | A `size` with spaces passed the trim and was accepted, but the CSS did not match it, so the field drew the measures of `default`; this held for `large` too, since DSA-16 | `2f52ffd`: `size` is no longer trimmed, as in `nph-button`, with regression tests for `" compact "` and `"large "` |
| `bcf74ee` | The Docs references named `design.md` as the source of the `input/*` tokens; the amendment of P80 said there was no breaking change | `d17ef21`: the references point to `src/tokens/source/semantic.tokens.json` in the three languages, with a regression test; the amendment records the breaking change and its migration |
| `d17ef21` | No finding | — |

The three threads were answered and are resolved. After round three, only sync merges
entered, with no change of the PR's own: `b43bad7` and `db15bee`. They brought PR #138
(DSA-34), whose Docs pages read their lists from the Metadata, and the closing of DSA-34. The
merges had no conflict, and the regenerated Metadata did not change. An earlier sync, `bcf74ee`,
brought PR #134 (DSA-57) and the closing of DSA-57.

## Command

```text
git merge-base --is-ancestor db15bee9c44738ffee1a276098c16563a6f19a7d origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `db15bee` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `74054ef0a075410f7f073e24f7097df606e95224`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#139](https://github.com/iatecbr/IATec.Nephos/pull/139) | `74054ef` (2026-10-28T20:59:25Z) | `db15bee` | `elvysmarcos` |

## Proof commands

Run on the final head `db15bee`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 133 files, 4836 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | 365 files, 0 issues |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline (build 611533) passed: the Build stage, the Test stage
and the overall check. On the earlier head `bcf74ee`, one local run of `npm test` failed on the
known timing test of `nph-tooltip`, which PR #136 fixes. The second run on the same head
passed in full.

## Still open

D1 stays in the task's `pending_decisions`, with Indiane. It does not block the task:

- D1: the end padding of 5 px in a compact field with no clear button, or with the button
  hidden because there is no value. The code follows the evidence ("in every state")
  literally.
