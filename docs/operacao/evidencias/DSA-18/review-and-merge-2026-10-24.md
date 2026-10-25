```json
{
  "task": "DSA-18",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 8ec3211afff35c94179d7690d067cbdbb7e5cd95 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "0aa728c587a5e84de9d1ecc444d99f50d970e2bd",
  "external_origin": null
}
```

# DSA-18 — `review-and-merge`

PR #109 (`claude/dsa-18-nph-radio-266b51`) brought the `nph-radio`, the circle the person checks
to choose one option in a group, in the contract accepted in Figma (frame `1196:311`, set
`848:66`). The host is the control: it is associated with the form through `ElementInternals`,
with the `radio` role and its state set through the internals, no inner input, the group by
`name` in the same root and form, one Tab stop per group, the arrow keys and Space, the native
`input` and `change` events, `nphFieldRole` `radio` for `nph-field`, the focus border and halo
over the 24 × 24 touch area, and the motion of the state role. It came with the CSS, the tests
(including the radio inside the real `nph-field`), the Validation stories, the Docs page, the
dictionary in en, pt-BR and es, the spec and its generated Metadata, and P82. The PR changes no
token. Elvys merged it on 24-10-2026 (local time; 2026-10-25T01:15:54Z), at commit `0aa728c`.
The PR head, `8ec3211`, is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested at the opening of the PR and again
after each round of fixes, and reviewed six times as `copilot-pull-request-reviewer`. The
answers to its threads posted under `elvysmarcos` were written by the agent; they are not a code
review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `63e9456` | 4 threads | Fixed in `cab4029`, each with a regression test: the removed `value` attribute, the restore state, a radio that is not drawn submitting, an empty `aria-labelledby` |
| 2 | `cab4029` | 1 thread | Fixed in `57121d6`, with a regression test: the restore and autocomplete modes |
| 3 | `0abc9ff` | 2 threads | Fixed in `4bce017`, each with a regression test: a hidden radio and the arrow keys, a change of `name` off the page |
| 4 | `383056b` | 1 thread | Fixed in `a4b0e5c`, with a regression test: radios that connect in one batch |
| 5 | `a4b0e5c` | No open issue; 2 earlier issues in the summary | Fixed in `90ad072`, each with a regression test: the `hidden` attribute, a batch connection inside a form; answered in a PR comment |
| 6 | `d837f03` | 3 threads | Recorded as known limits in P82 and in the spec, with a follow-up, by Elvys's decision of 24-10-2026, in `a7e891d`: the form value on a `value` change, `visibility: hidden`, a cancelled `keydown` |

All 11 threads were answered and resolved. Between rounds the branch merged `v/5.0.0` several
times, last at `9155880` and `6e09cd9`, keeping the entries of the other tasks in
`docs/decisoes-tecnicas.md` and in `.storybook/i18n/*.json`; after `a7e891d` only those
synchronization merges entered, so no further round was requested.

## Command

```text
git merge-base --is-ancestor 8ec3211afff35c94179d7690d067cbdbb7e5cd95 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `8ec3211` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `0aa728c587a5e84de9d1ecc444d99f50d970e2bd`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#109](https://github.com/iatecbr/IATec.Nephos/pull/109) | `0aa728c` (2026-10-25T01:15:54Z) | `8ec3211` | `elvysmarcos` |

The merge `0aa728c` has two parents, `6e09cd9` and `8ec3211`.

## Proof commands

Run on the final head `8ec3211`, after `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 3183 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1141 checks, 26 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese words in
`docs/operacao/` records of other tasks (DSA-34, 42, 43, 45 and 47). None of those files is in
the diff of the PR.

The test `src/components/nph-tooltip/nph-tooltip.test.ts:815` fails now and then in the full
suite, also with no test of the radio in the run; it passed on the final head. It belongs to
`nph-tooltip`, which the PR does not touch.

## Still open

D6 and D7 stay in the task's `pending_decisions`, with Indiane. They change no token and do not
block the task:

- D6: whether the circle aligns with the first line of a wrapping text by its center (today) or
  by the top edge.
- D7: what the piece does with `invalid` and `disabled` together; today disabled wins.

The three known limits of round 6 have a follow-up recorded in P82: sync the form value in the
`value` setter, treat `visibility: hidden` as hidden, and return early on a cancelled `keydown`.
The spec and the Docs page of `nph-checkbox`, and the group of radios in the `nph-field`
demonstration, still treat `nph-radio` as planned; that text fix is the orchestrator's at the
end of the wave.
