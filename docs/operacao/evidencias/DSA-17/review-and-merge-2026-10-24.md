```json
{
  "task": "DSA-17",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor ad9a552fa93203624c92a758824d77e565e4b13e origin/v/5.0.0",
  "exit_code": 0,
  "sha": "915588067efb4edd68d9c13973f711100ca137b8",
  "external_origin": null
}
```

# DSA-17 — `review-and-merge`

PR #117 (`claude/dsa-17-nph-checkbox-4f2a40`) brought the `nph-checkbox`, the checkbox with
its own text, in the contract accepted in Figma (frame `1194:1033`, set `740:18776`). It is a
native `<input type="checkbox">` inside a `<label>` in the shadow root, associated with the form
through `ElementInternals`, with `checked` and `indeterminate`, the native `input` and `change`
events, `nphFieldRole` `option` for `nph-field`, the focus border and halo over the 24 × 24
touch area, and the motion of the state role. It came with the CSS, the tests, the Validation
stories, the Docs page, the dictionary in en, pt-BR and es, the spec and its generated Metadata,
and P81. It also brought the follow-up recorded in DSA-28: the group of checkboxes in the
`nph-field` demonstration uses the real `nph-checkbox`. The PR changes no token. Elvys merged
it on 24-10-2026 (local time; 2026-10-25T00:32:00Z), at commit `9155880`. The PR head,
`ad9a552`, is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested four times, at
2026-10-24T23:12:53Z, 2026-10-25T00:03:55Z, 00:16:34Z and 00:23:40Z, and reviewed four times as
`copilot-pull-request-reviewer`. The answers to its threads posted under `elvysmarcos` were
written by the agent; they are not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `d312316` | 4 threads | Fixed in `05c1dbc`, each with a regression test |
| 2 | `844fc5c` | 4 threads | Fixed in `716f8a7`, each with a regression test; the late cancel of an outside label click is recorded as a known limit in P81 |
| 3 | `9aa0e18` | 1 thread | Fixed in `ad9a552`, with regression tests for the three events |
| 4 | `ad9a552` | No open issue; approval recommended | — |

All 9 threads were answered and resolved. The mark-centering fix was checked by undoing it:
its regression test failed without it (13 against 12). The other regression tests reproduce
the reported case directly. Between rounds the branch merged `v/5.0.0` at `325f49b` and
`0bfe4ab`, keeping the entries of the other tasks in `docs/decisoes-tecnicas.md` and in
`.storybook/i18n/*.json`. Round 4 reviewed the final head, `ad9a552`.

## Command

```text
git merge-base --is-ancestor ad9a552fa93203624c92a758824d77e565e4b13e origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `ad9a552` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `915588067efb4edd68d9c13973f711100ca137b8`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#117](https://github.com/iatecbr/IATec.Nephos/pull/117) | `9155880` (2026-10-25T00:32:00Z) | `ad9a552` | `elvysmarcos` |

The merge `9155880` has two parents, `0bfe4ab` and `ad9a552`.

## Proof commands

Run on the final head `ad9a552`, after `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 3016 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1119 checks, 25 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records of other tasks (DSA-34, 42, 43, 45 and 47). None of those
files is in the diff of the PR.

## Still open

D7 stays in the task's `pending_decisions`, with Indiane. It changes no token and does not
block the task:

- D7: on which part a checked or indeterminate box on hover takes `state/hover-opacity`;
  today the box only (fill, border and mark), not the text.

`nph-radio` (DSA-18, PR #109) is not on `v/5.0.0` yet: the spec and the Docs page of the
checkbox say it is planned, and the group of radios in the `nph-field` demonstration keeps its
stand-in.
