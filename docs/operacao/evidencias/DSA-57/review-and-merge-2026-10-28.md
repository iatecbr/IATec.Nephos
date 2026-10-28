```json
{
  "task": "DSA-57",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 53b18ed3753b06474530eb6993413d0283a3c7d2 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "5b9b09497c07b333bbe46bf40454c442cc25f669",
  "external_origin": null
}
```

# DSA-57 — `review-and-merge`

PR #134 (`claude/dsa-57-nph-chip`) brought `nph-chip`: the small rounded piece for an
applied filter, a value chosen in a field or a quick filter that the person checks and
unchecks, in two types (removable and selectable), six severities, two sizes and the
content of an icon, an avatar or a counter.

The PR also brought:

- the CSS and the tests;
- six Validation stories and the Docs page, with its test;
- the dictionary in en, pt-BR and es;
- the spec and its generated Metadata;
- P100;
- two Figma state names, `inválido` and `somente`, in the `nephos-portuguese`
  dictionary of `cspell.config.yaml`.

The PR changes no token: it consumes the 62 `chip/*` tokens already on `v/5.0.0`, and
a test checks each one.

It was merged on 28-10-2026, at commit `5b9b094`, by Elvys's authorization. The PR
head, `53b18ed`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested five times, at
2026-10-28T17:01:19Z, 17:08:00Z, 17:15:02Z, 17:23:06Z and 19:16:40Z. It reviewed five
heads, as `copilot-pull-request-reviewer`. The two reviews in the `elvysmarcos` name
on `bc62aba` and `ca544f1` are the replies to the threads of the first round, sent by
the session through that account; they are not a code review.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `bc62aba` | A marked and disabled chip still drew the focus ring; a chip removed and reinserted did not observe its label again | `ca544f1`, with two regression tests |
| `ca544f1` | An update made while the chip was disconnected recorded the label without an observer; the balloon of a cut label repeated the name of the selectable chip as its description | `84cf144`, with regression tests; the balloon became the name (`relation="name"`), followed by the counter |
| `84cf144` | A new text in a label of the same size was not measured again; the ring of a cut label focused when the chip became disabled | `2d74e30`: the measure runs on each update, with a regression test; the CSS draws no ring on a disabled host, as a guard, because Chromium already takes the focus away |
| `2d74e30` | No finding | — |
| `658c084` | No finding | — |

The two threads of the first round were answered and are resolved; the findings of
rounds two and three, which came without a thread, were answered in comments. Each
regression test was seen failing without its fix, except the guard of round three,
which the test records as the browser behavior.

`658c084` is the one change of the PR's own after round four: the American English
spelling that `test:spelling` (DSA-37) asked for. After round five only sync merges
entered, with no change of the PR's own: `13e91f9`, `f569b4b`, `98eb9f1` and
`53b18ed`. They brought PR #135 (DSA-56), PR #133 (DSA-37), PR #137 (DSA-33), the
tasks DSA-58 and DSA-59 and their tokens; the conflicts, in `docs/decisoes-tecnicas.md`
and `cspell.config.yaml`, were resolved keeping both sides.

## Command

```text
git merge-base --is-ancestor 53b18ed3753b06474530eb6993413d0283a3c7d2 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `53b18ed` is an ancestor of `v/5.0.0`. Checked
against `origin/v/5.0.0` at `5b9b09497c07b333bbe46bf40454c442cc25f669`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#134](https://github.com/iatecbr/IATec.Nephos/pull/134) | `5b9b094` (2026-10-28T20:22:24Z) | `53b18ed` | `elvysmarcos` |

## Proof commands

Run on the final head `53b18ed`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 132 files, 4591 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline (build 611485) passed: the Build stage, the Test
stage and the overall check. On earlier heads, the Test stage failed twice for reasons
outside the chip: a test file of another piece that did not load, a timing test of
`nph-tooltip`, and runs that hung until the 30-minute limit of the agent.

## Still open

D-1 to D-5 stay in the task's `pending_decisions`, with Indiane, unchanged. They
change no token and do not block the task:

- D-1: the counter drawn as a pill of its own with the `chip/counter-*` tokens, instead
  of `nph-badge`, which the evidence names and which has no paint hook;
- D-2: the avatar in the `sm` size;
- D-3: the cut label made focusable, with its balloon;
- D-4: the X of the invalid chip with the error pair;
- D-5: the order icon, text, counter and X.
