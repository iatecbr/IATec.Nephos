```json
{
  "task": "DSA-39",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 477e86e8c2f978391f61d1722431476d35a02960 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "fe018f1faca6793de0c60f699bf52903da4937b9",
  "external_origin": null
}
```

# DSA-39 — `review-and-merge`

PR #112 (`claude/dsa-39-nph-slider-0eb846`) brought the `nph-slider`, the control that picks
a value or a range on a continuous scale of numbers. It came with the component, its CSS and
tests, the Validation and Docs stories, the dictionary in en, pt-BR and es, the spec and its
generated Metadata, and P94. The PR changes no token. Elvys merged it on 24-10-2026, at
commit `fe018f1`. The PR head, `477e86e`, is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested five times and reviewed five
times as `copilot-pull-request-reviewer`. The replies by `elvysmarcos` on 23-10-2026 are
the agent's answers to the Copilot threads, not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `78240cd` | Nine threads: a decimal `max` out of reach; an inverted `start`/`end` pair that jumped on the first key; focus landing on the minus button instead of the first thumb; a drag that went on after the slider was disabled; two thumbs on the same value that could not be dragged apart; a stale accessible name after `label` or `text` changed or the mode switched; the field in `single` ignoring the associated labels; the fields inside `nph-field` without the help or error text | Fixed in `673ec17`, with a regression test each. The drag is checked with real mouse input through the Chrome DevTools Protocol |
| 2 | `673ec17` | One thread and four previously missed findings in the summary: the count of marks had no bound; the disabled slider kept the error border and the focus halo; the balloon stayed in place when the scale changed; `range` trimmed the `name` sent to the form; Enter did not apply the typed number | Fixed in `71dd7c6`, with a regression test each; the four in the summary answered in a PR comment. `marks` draws at most 100 steps, recorded in P94 and in the spec |
| 3 | `6a6a36b` | Three threads: a new text in an external `nph-label` did not rename the field; `form.reset()` kept an unconfirmed draft in the field; the balloon closing when a drag captured the pointer | Fixed in `db21b0e`, with a regression test each. The third does not reproduce with a real mouse drag; the code holds the balloon open during the drag as a defense, and the thread says so |
| 4 | `db21b0e` | No open issue; one previously missed finding in the summary: the field name included label content hidden with `aria-hidden` | Fixed in `af723c5`, with a regression test, and answered in a PR comment |
| 5 | `af723c5` | No open issue; two previously missed findings in the summary: a decimal tie rounded to the wrong step; any render dropped an unconfirmed draft in the field | Fixed in `552178a`, with a regression test each, and answered in a PR comment |

The two fixes of round 5 entered with regression tests and green proofs, but with no
Copilot review on the final head: round 5 was the last one of the limit, and Elvys merged
without a sixth round. No Copilot review covers `552178a` or the merges after it.

Besides the findings, `ff45a6e` changed the width of the field beside the track (D5) from
one part each to three parts for the track and one for the field, after the Price range
example showed the track narrower than its two fields. Copilot reviewed it in round 2.

After round 5, the branch merged `v/5.0.0` four times, to bring the merged PRs of other
pieces. None of these commits changes code of the PR:

- `b3e513d`, PR #113 (DSA-47): one conflict in the list of decisions at the top of
  `docs/decisoes-tecnicas.md`, resolved keeping P88 and P94.
- `48dd5b5`, PR #110 (DSA-41): conflicts in the four places of
  `docs/decisoes-tecnicas.md` where P85 and P94 enter, resolved keeping both, P85 before
  P94; and in the three dictionaries, resolved by a three-way merge per key, with every
  key of both sides kept.
- `34ce24f`, PR #111 (DSA-38): conflicts in the same four places, resolved keeping P93
  and P94, P93 before P94.
- `477e86e`, PR #114 (DSA-29): conflicts in three of those places, resolved keeping P91
  and P94, P91 before P94; and in the three dictionaries, resolved as in `48dd5b5`.

Before the PR opened, the branch merged `v/5.0.0` at `6703675`; during round 3 it merged
it at `6a6a36b`.

## Command

```text
git merge-base --is-ancestor 477e86e8c2f978391f61d1722431476d35a02960 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `477e86e` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `fe018f1faca6793de0c60f699bf52903da4937b9`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#112](https://github.com/iatecbr/IATec.Nephos/pull/112) | `fe018f1` (2026-10-24T22:53:17Z) | `477e86e` | `elvysmarcos` |

The merge `fe018f1` has two parents, `1976be1` and `477e86e`.

## Proof commands

Run on the final head `477e86e`, after `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 2650 tests in 46 files |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1052 checks, 23 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records. None of those files is in the diff of the PR.

The same proofs passed on `552178a` and on each merge after it, before each push.

The piece was also checked by hand in Storybook, in light and dark mode: the matrix, the
optional parts, the field inside `nph-field`, the drag with the balloon and the Docs page.

## Still open

D1 to D5 stay in the task's `pending_decisions`, with Indiane, unchanged. None changes a
token or blocks the task:

- D1: the order of the parts beside the track. The code draws
  `[start field] [minus] [minimum] track [maximum] [plus] [end field]`.
- D2: which thumb minus and plus move in `range`. The code moves the thumb used last, the
  start one by default.
- D3: the length of the vertical track. The code uses `layout/input-width`.
- D4: one mark per step or a subset. The code draws one label per step, up to 100 steps.
- D5: the width of the field. The field shares the line with the track, one part for the
  field and three for the track.
