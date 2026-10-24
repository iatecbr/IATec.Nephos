```json
{
  "task": "DSA-41",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 33630024ca2335914a6a1188edbc9f8724e7749c origin/v/5.0.0",
  "exit_code": 0,
  "sha": "1d14864efd34f474ef7fb7450176a03a7a2d936c",
  "external_origin": null
}
```

# DSA-41 — `review-and-merge`

PR #110 (`claude/dsa-41-nph-input-otp-d795bb`) brought the `nph-input-otp`, the short code
field with one cell per character, in the contract accepted in Figma (board `1633:122`). A
single native `<input>` sits over the row of cells, which only draw; the field is
form-associated (P80) and takes `label`, `description` and `invalid` from the `nph-field`
(P83). It came with the CSS, the tests, the Validation stories, the Docs page with the three
required examples (two of them inside the real `nph-field`), the dictionary in en, pt-BR and
es, the spec and its generated Metadata, and P85. The PR changes no token. Elvys merged it on
24-10-2026, at commit `1d14864`. The PR head, `3363002`, is an ancestor of the integration
branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested five times, at
2026-10-23T21:22:39Z, 21:43:31Z, 21:52:43Z, 21:58:54Z and 22:05:14Z, and reviewed five
times as `copilot-pull-request-reviewer`. The answers to its threads posted under
`elvysmarcos` were written by the agent; they are not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `bc3674b` | 5 threads | Fixed in `18c4cba`, each with a regression test |
| 2 | `a3e13e8` | 5 threads | Fixed in `96e6fb3`, each with a regression test |
| 3 | `0dbc027` | 1 thread | Fixed in `5cf85c6`, with a regression test |
| 4 | `5cf85c6` | No thread; 1 finding in the summary | Fixed in `e22fe03`, with a regression test |
| 5 | `e22fe03` | No thread; 1 finding in the summary | No decision before the merge; see "Still open" |

All 11 threads were answered and resolved. Round 5 reached the limit of five rounds with
its finding open. After it, the branch merged `v/5.0.0` at `153af0f` (DSA-47), with one
conflict in the list of decisions at the top of `docs/decisoes-tecnicas.md`, resolved
keeping P88 and P85. That merge, `3363002`, is the head Elvys merged; Copilot did not review
it, and it changes no line of the component.

## Command

```text
git merge-base --is-ancestor 33630024ca2335914a6a1188edbc9f8724e7749c origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `3363002` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `1d14864efd34f474ef7fb7450176a03a7a2d936c`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#110](https://github.com/iatecbr/IATec.Nephos/pull/110) | `1d14864` (2026-10-24T22:21:29Z) | `3363002` | `elvysmarcos` |

The merge `1d14864` has two parents, `163fbe2` and `3363002`.

## Proof commands

Run on the final head `3363002`, after `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 2111 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 907 checks, 19 components |
| `git diff --check origin/v/5.0.0 HEAD` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records of other tasks. None of those files is in the diff of
the PR.

The field was also checked by hand in Storybook, in light and dark mode: the matrix, the
states, the characters, typing and pasting (`48a-2` becomes `48a2`, with the active cell
marked), the three examples with the real `nph-field` and the Docs page, with no warning
in the console.

## Resolved after the merge

The round 5 finding of Copilot, open when PR #110 was merged, is resolved by
[PR #116](https://github.com/iatecbr/IATec.Nephos/pull/116). When a consumer canceled the
`paste` in a bubbling listener (a listener without capture on the host or on the form), the
field had already replaced the code and fired `input`. Elvys chose a small PR with the fix.

The field no longer touches the `paste` event: it keeps the whole pasted text in
`beforeinput` (`insertFromPaste`) and replaces the value in its own `input` listener. The
browser fires those only when no one canceled the paste, by any means (`preventDefault()` in
capture or in bubbling, `onpaste` returning `false`, `returnValue`, or a canceled
`beforeinput`). A paste with no letter or digit is refused in `beforeinput`, so the caret
stays, and after a paste the caret goes to the end. The tests paste for real (clipboard and
Ctrl/Cmd+V), and P85, item 3, records the rule.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `a20a8a0` | 3 threads | Fixed in `5c28b1b`, replacing the deferred approach, each with a regression test |
| 2 | `9f2657b` | 1 thread | Fixed in `cdae903`, with a regression test |
| 3 | `a0b3bc4` | 1 thread | Fixed in `f769f4c`, with a regression test |
| 4 | `f989c65` | No open issue; approval recommended | — |

All 5 threads were answered and resolved. The final head, `0a62f44`, only merges
`v/5.0.0` at `191fe6e` over `f989c65`, with no conflict; the round 4 review covers it. Run
on `0a62f44` after `npm ci`, the proof commands of this evidence exited with `0` (2659
tests; `test:package` with 1052 checks and 23 components), and `npm run test:naming`
exited with `1` only on files outside the PR.

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#116](https://github.com/iatecbr/IATec.Nephos/pull/116) | `106adec` (2026-10-24T23:15:15Z) | `0a62f44` | `elvysmarcos` |

`git merge-base --is-ancestor 0a62f44687e3cefe45fbc15bde71cef31959cd09 origin/v/5.0.0`
exits with `0`, checked against `origin/v/5.0.0` at
`106adec18d52255295ea2d770400725582460c30`.

## Still open

D1 to D4 stay in the task's `pending_decisions`, with Indiane, unchanged. None changes a
token or blocks the task:

- D1: the state measures the evidence does not name (hover border, halo width, opacity
  token, `disabled` over error). The code follows the `nph-input`.
- D2: whether the field can be restricted to digits, with the numeric keyboard.
- D3: `masked` on the host, applied to every cell.
- D4: the link look of the `nph-button` for the resend action, which this delivery does
  not show.
