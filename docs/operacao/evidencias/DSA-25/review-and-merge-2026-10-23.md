```json
{
  "task": "DSA-25",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 85c13569748b2c96188a7c744a7b5cc9cb06ed6b origin/v/5.0.0",
  "exit_code": 0,
  "sha": "9dd6e19ce171a3e94edb982bff67bbf8b1eb07ec",
  "external_origin": null
}
```

# DSA-25 — `review-and-merge`

PR #96 (`claude/dsa-25-nph-avatar-stack-8e424e`) brought `nph-avatar-stack`,
the group of overlapping `nph-avatar` children with the count of who does not
show. It came with its CSS and tests, five Validation stories, the Docs page,
the dictionary in en, pt-BR and es, the spec and its generated Metadata, P78
and the limit in §4.10 of `docs/stories.md`. The PR changes no token. Elvys
merged it on 23-10-2026, at commit `9dd6e19`, as `component-handoff.md` gives
Elvys the review and merge of his own pull requests. The PR head, `85c1356`, is
an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human reviewed; Elvys merged.

A review was requested from `maurocsjr` at 2026-10-22T18:35:40Z. The request
was removed at 19:33:37Z, before Copilot was requested at 19:33:48Z, and was
not made again. He gave no review, and no review was requested at the merge.

Copilot reviewed five times as `copilot-pull-request-reviewer` and four times
as `copilot-swe-agent`. The `copilot-swe-agent` reviews have empty bodies and
carry the per-comment replies.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `ff9cf16` | `labelApplied` kept when `aria-label` changes from outside; a last `slotchange` syncing the children after the group turns invalid | `0fe4f44`, with regression tests |
| `0fe4f44` | The child observer propagating an invalid `size` before the group's pending validation | `093067f`, with a regression test |
| `093067f` | No open issue; one previously missed: `label` set by property on a child after mount does not reach the composition warnings, as `aria-label` is outside the observer filter | — |
| `093067f`, requested again | The same issue, now as an open finding: "Observe avatar label changes after mounting" | `85c1356`: the observer follows `aria-label`, with a regression test that sets, clears and sets `label` again by property |
| `85c1356` | No open issue | — |

All four findings were fixed: three line findings and the previously missed
one, which came back as a line finding. `0fe4f44`, `093067f` and `85c1356` are
by `copilot-swe-agent`, co-authored by Elvys, and touch only
`nph-avatar-stack.ts` and `nph-avatar-stack.test.ts`.

The last review asked for a final human review of P78, the accessible
semantics and the async sync of the children. That review is Elvys's review
and merge of the PR.

## Command

```text
git merge-base --is-ancestor 85c13569748b2c96188a7c744a7b5cc9cb06ed6b origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `85c1356` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `0ffef17a5518a66373a0e5c9787a0fc08ad1f4dd`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#96](https://github.com/iatecbr/IATec.Nephos/pull/96) | `9dd6e19` (2026-10-23T11:02:59Z) | `85c1356` | `elvysmarcos` |

The merge `9dd6e19` has two parents, `bc9ae33` and `85c1356`. Its tree is the
tree of the head.

## Proof commands

The PR recorded its proofs on `9315e37`, after it synced with `v/5.0.0` at
`bc9ae33` (PR #97). These exited with `0`:

- `npm run build:tokens` (575 tokens, no diff in `src/tokens`)
- `test:tokens` (25 checks)
- `test` (26 files, 1138 tests)
- `typecheck`
- `test:i18n`
- `test:operacao` (47 tasks)
- `build-storybook`
- `build:lib`
- `test:package` (718 checks, 13 components)
- `git diff --check`

After that record, the three Copilot fixes `0fe4f44`, `093067f` and `85c1356`
came in, and the PR records no rerun. The only check run on `85c1356` is
`copilot-pull-request-reviewer`.

These were rerun at the closing, on ``0ffef17``, the tip of `origin/v/5.0.0`
after the merge of PR #104, and all exited with `0`:

| Command | Detail |
|---|---|
| `npm run typecheck` | |
| `test` | 30 files, 1456 tests |
| `build:lib` | |
| `test:package` | 785 checks, 15 components, 64 documented import lines |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs:180` and on
Portuguese words in `docs/operacao/` records. The result is the same as on the
base, and none of those files is in the diff of the PR.

## Still open

D4 stays in the task's `pending_decisions`, with Indiane, unchanged. It
changes no token and does not block the task.

The group does not check that `label` and `count` tell the same story. This is
the known limit recorded in the PR.

P74's "Out of scope" still calls `nph-avatar-stack` (DSA-25) planned. That
text is historical and kept.
