```json
{
  "task": "DSA-54",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 41b9cec6ec691f53a1d263e6117345dbdf78a182 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "32ed1793dcb4694f5599f02cec82f052b53cb9b1",
  "external_origin": null
}
```

# DSA-54 — `review-and-merge`

PR #131 (`claude/dsa-54-nph-pagination-4a7569`) brought `nph-pagination`: the bar
that takes the person from one page to another in a long list and shows where in
the list they are, in six types, with the arrows, the window of numbers, items per
page and go to page.

The PR also brought:

- the `arrow-left-to-line` icon, light and solid, in `design.md`, in the
  `nph-icon` core and in `conferir-nph-icon-figma.cjs`;
- the CSS and the tests;
- four Validation stories and the Docs page;
- the dictionary in en, pt-BR and es;
- the spec and its generated Metadata;
- P99;
- the language exceptions for the Figma names quoted in the DSA-54 evidence and
  task.

The PR changes no token.

Elvys merged it on 28-10-2026, at commit `32ed179`. The merge is his because
`component-handoff.md` gives Elvys the merge of the pull requests Claude opens.
The PR head, `41b9cec`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys.

No review was requested from a person. Copilot was requested three times, at
2026-10-28T11:53:57Z, 12:01:45Z and 12:08:54Z. It reviewed three heads, as
`copilot-pull-request-reviewer`.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `5a227e1` | Inside another component's shadow root, the numbers ignored the language of the page; the `{start}` and `{end}` markers of `page-label` came from the current page, not from the page each number leads to | `dfa8632`, with two regression tests |
| `dfa8632` | With a large page count, wider numbers moved the arrows | `e275291`, with a regression test from page 1 to page 1,000,000 |
| `e275291` | No open finding; it recalled D-1, which waits for Indiane | — |

The two threads were answered and resolved; the finding of the second round,
which came without a thread, was answered in a comment. Each regression test was
seen failing without its fix.

After `e275291` only the sync merge `41b9cec` entered. It brought `v/5.0.0` at
`429a75f`, with PR #132, which made `test:naming` green on the base. It had no
change of the PR's own.

## Command

```text
git merge-base --is-ancestor 41b9cec6ec691f53a1d263e6117345dbdf78a182 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `41b9cec` is an ancestor of `v/5.0.0`. Checked
against `origin/v/5.0.0` at `32ed1793dcb4694f5599f02cec82f052b53cb9b1`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#131](https://github.com/iatecbr/IATec.Nephos/pull/131) | `32ed179` (2026-10-28T13:27:04Z) | `41b9cec` | `elvysmarcos` |

## Proof commands

Run on the final head `41b9cec`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | 25 checks |
| `npm test` | |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | green |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline (build 610794) passed: the Build stage, the
Test stage, with 66 of 66 files and 4137 of 4137 tests, and the overall check.
The first two attempts of the Test stage failed to load one test file of another
piece, a different one each time; the third attempt passed in full.

## Still open

D-1 to D-5 stay in the task's `pending_decisions`, with Indiane, unchanged. They
change no token and do not block the task:

- D-1: native buttons painted with the pagination tokens, instead of
  `nph-button`, which the evidence names and which has no color property;
- D-2: the text role of the numbers, the position text and the labels;
- D-3: the icons of the previous and next arrows;
- D-4: the order of the simple, compact and range types;
- D-5: where the outline of the bar ends.
