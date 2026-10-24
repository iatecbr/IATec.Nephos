```json
{
  "task": "DSA-38",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor f4e98c64f06e7cfd274c8a55ce6db37b729c6aa9 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "e2f784187b634a2ff243bfaf11ef5bcf9a2183b9",
  "external_origin": null
}
```

# DSA-38 — `review-and-merge`

PR #111 (`claude/dsa-38-nph-textarea-4ada6c`) brought the `nph-textarea`, the multi-line
text field with an optional footer for a counter and actions. It came with the component,
its CSS and tests, the Validation and Docs stories, the dictionary in en, pt-BR and es,
the spec and its generated Metadata, and P93. The PR changes no token. Elvys merged it on
24-10-2026, at commit `e2f7841`. The PR head, `f4e98c6`, is an ancestor of the
integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested five times and reviewed five
times as `copilot-pull-request-reviewer`. The two replies by `elvysmarcos` on 23-10-2026
are the agent's answers to the round 1 threads, not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `d6e6d5b` | Two threads: an action defined after the first render of a disabled textarea was not disabled; an action moved between two disabled textareas could end enabled | Fixed in `1b03ed5`. The owner and the forced `disabled` are shared by every instance, as in `nph-field`, and a late definition is synchronized on upgrade. Two of the three new tests fail on the old code |
| 2 | `1b03ed5` | One finding in the summary, with no thread: an action defined while the textarea was out of the page was not upgraded | Fixed in `3ba33cd`, answered in a PR comment. The first of the two new tests fails on the old code |
| 3 | `3ba33cd` | No thread; the summary noted that the published proofs were from an older head | The proofs table of the PR was updated to the head |
| 4 | `7db3db0` | No open issue; approval recommended | — |
| 5 | `73cf7cc` | No open issue; approval recommended | — |

After round 5, the branch merged `v/5.0.0` at `f4e98c6`, to bring PR #110 (DSA-41). The
conflict was in the four places of `docs/decisoes-tecnicas.md` where P85 and P93 enter,
resolved keeping both, P85 before P93. That commit changes no code of the PR. Before it,
the branch merged `v/5.0.0` three times: at `74c6ca2` and `73cf7cc`, with one conflict
each in the list of decisions at the top of `docs/decisoes-tecnicas.md`, resolved keeping
P79 and P86, then P88, with P93; and at `7db3db0`, with no conflict.

## Command

```text
git merge-base --is-ancestor f4e98c64f06e7cfd274c8a55ce6db37b729c6aa9 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `f4e98c6` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `e2f784187b634a2ff243bfaf11ef5bcf9a2183b9`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#111](https://github.com/iatecbr/IATec.Nephos/pull/111) | `e2f7841` (2026-10-24T22:35:28Z) | `f4e98c6` | `elvysmarcos` |

The merge `e2f7841` has two parents, `89fbfd2` and `f4e98c6`.

## Proof commands

Run on the final head `f4e98c6`, after `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 2281 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 927 checks, 20 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records, 36 in all. None of those files is in the diff of the
PR.

The growth was also checked by hand in Storybook: the empty field is 76 px high, and a
long text stops at 216 px and scrolls inside. The three examples were seen in light and
dark mode, and the footer in every state, with no warning of the piece in the console.

## Still open

D-1 to D-5 stay in the task's `pending_decisions`, with Indiane, unchanged. None changes
a token or blocks the task:

- D-1: the inner padding of the box. The code uses `space/control-padding` on the sides
  and `space/inline` at the top and bottom.
- D-2: focus in `readonly`. The code keeps the focus border and halo.
- D-3: the arrangement of the footer. The code puts the counter at the start and the
  actions at the end, inside the box.
- D-4: the default width outside `nph-field`. The code uses `layout/input-width`.
- D-5: the opacity of a disabled action. The code keeps both opacities, so a disabled
  action reads fainter than the field.
