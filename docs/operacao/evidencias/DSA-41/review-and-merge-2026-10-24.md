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

## Still open

The round 5 finding of Copilot has no decision. When a consumer cancels the `paste` in a
bubbling listener (a listener without capture on the host or on the form), the field has
already replaced the code and fired `input`: `onPaste`
(`src/components/nph-input-otp/nph-input-otp.ts`) only sees a cancel made before it, in
capture. Elvys decides between a small PR with the fix and recording it in P85 as a known
limit.

D1 to D4 stay in the task's `pending_decisions`, with Indiane, unchanged. None changes a
token or blocks the task:

- D1: the state measures the evidence does not name (hover border, halo width, opacity
  token, `disabled` over error). The code follows the `nph-input`.
- D2: whether the field can be restricted to digits, with the numeric keyboard.
- D3: `masked` on the host, applied to every cell.
- D4: the link look of the `nph-button` for the resend action, which this delivery does
  not show.
