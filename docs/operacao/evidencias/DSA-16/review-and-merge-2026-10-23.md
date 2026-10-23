```json
{
  "task": "DSA-16",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 29ff54f4439e945fd5668e0ed2d6f05d1c72a043 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "579b2fa3bd7a8d1bc226ae9e31b36eb857a36aa1",
  "external_origin": null
}
```

# DSA-16 — `review-and-merge`

PR #99 (`claude/dsa-16-nph-input-20ff0b`) brought `nph-input`, the first
form-associated piece. It came with its CSS and tests, the Validation stories,
the Docs page, the dictionary, the spec, the generated Metadata and P80. Elvys
merged it on 23-10-2026, at commit `579b2fa`, as `component-handoff.md` gives
Elvys the review and merge of his own pull requests. The PR head, `29ff54f`, is
an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human reviewed; Elvys merged.

A review was requested from `maurocsjr` at 2026-10-22T19:23:04Z. The request
was removed at 19:34:30Z, when Copilot was requested instead, and was not made
again. He gave no review, and no review was requested at the merge.

Copilot reviewed five times as `copilot-pull-request-reviewer` and ten times as
`copilot-swe-agent`. The `copilot-swe-agent` reviews have empty bodies and
carry the per-comment replies.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `07b489b` | Value and validity synced before events; `input[type=image]` as the default button; Enter cancellation; the sanitized value | `1462c69` |
| `1462c69` | `renderRoot` before connection; the resting border in `foco-limpar` with hover; validity of a disabled field | `07ea864` |
| `07ea864` | Re-render after `disabled` is reflected; plus one previously missed: the name did not follow when `nph-label` recreated its `<label>` | `9f5e387`, with the tests "re-enabling disabled by property…" and "updates the name when nph-label recreates its label…" |
| `446300e` | `disabled` inherited from a fieldset, with the exception of the first `legend`; Enter when an ancestor calls `stopPropagation()` | `29ff54f`, with the tests "recomputes disabled fieldset inheritance and respects the first legend" and "Enter submits when an ancestor only stops propagation" |
| `29ff54f` | No open issue; one previously missed, not fixed (see "Still open") | — |

Copilot found eleven issues in all. Ten are line findings and one was
previously missed, and all eleven were fixed. One more previously missed
finding stays open. `1462c69`, `07ea864`, `9f5e387` and `29ff54f` are by
`copilot-swe-agent`, co-authored by Elvys.

Between the third and fourth reviews, Elvys and Claude adjusted two of those
fixes in `787c9ad`:

- The Enter key was decided in a listener on `window`.
- The fieldset `disabled` state was kept apart from the attribute.

The same commit stopped the label observer from following text and updated
P80. `29ff54f` later redid both areas: Enter is now decided by `setTimeout(0)`
after propagation, and `disabledByFieldset` is recomputed on every render.

## Command

```text
git merge-base --is-ancestor 29ff54f4439e945fd5668e0ed2d6f05d1c72a043 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `29ff54f` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `23cb59830ff0209a1c32fe2b68e22b1b047b7f25`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#99](https://github.com/iatecbr/IATec.Nephos/pull/99) | `579b2fa` (2026-10-23T18:17:49Z) | `29ff54f` | `elvysmarcos` |

The merge `579b2fa` has two parents, `8eca16f` and `29ff54f`. Its tree is the
tree of the head plus the DSA-51 tokens that were already on the base.

## Proof commands

The PR recorded its proofs on the sync merge `eb90429`, and the record is in
`446300e`. These exited with `0`:

- `npm run build:tokens`
- `test:tokens` (25 checks)
- `typecheck`
- `test:i18n`
- `test:operacao` (47 tasks)
- `build-storybook`
- `build:lib`
- `test:package` (749 checks, 14 components)
- `git diff --check`

`npm test` exited with `1`: 1363 of 1364 tests passed. The one failure was the
base failure in `nph-tooltip.test.ts:1074`, outside this PR.

After that record, the Copilot fix `29ff54f` came in: +89 and −22 lines in
`nph-input.ts` and `nph-input.test.ts`. The PR records no rerun. The only check
run on `29ff54f` is `copilot-pull-request-reviewer`.

These were rerun at the closing, on the merge `579b2fa`, before PR #104 was
merged:

| Command | Exit code | Detail |
|---|---|---|
| `npm run typecheck` | `0` | |
| `build:lib` | `0` | |
| `test:package` | `0` | 749 checks |
| `test` | `1` | 1365 of 1366 tests, the same base failure in `nph-tooltip.test.ts:1074`. Every `nph-input` test passed |

PR #104 fixed that failure in `nph-tooltip`. After its merge, the commands ran
again on `23cb598`, the tip of `origin/v/5.0.0`, and all exited with `0`:

| Command | Detail |
|---|---|
| `npm run typecheck` | |
| `test` | 30 files, 1456 tests |
| `build:lib` | |
| `test:package` | 785 checks, 15 components, 64 documented import lines |

`npm run test:naming` exits with `1` on the known failures of the base, none of
which is in a file of this PR.

## Still open

D1 to D5 stay in the task's `pending_decisions`, with Indiane, unchanged. They
do not block the task.

The previously missed finding of the last Copilot review was not fixed at the
merge. In `src/components/nph-input/nph-input.ts`, switching `type` from
`email` to `text` and, in the same cycle, setting `value` or calling
`form.reset()` sanitizes the value by the old type and truncates it for good.
The existing test covers only the opposite direction.

The Docs demo of `nph-label` still uses a native `<input>`. It should switch to
`nph-input`.

P80 still describes the code, but it does not mention the exception of the
first `legend` in fieldset inheritance.
