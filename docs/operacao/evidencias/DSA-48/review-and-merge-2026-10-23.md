```json
{
  "task": "DSA-48",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor bec65200f79f1948eeb2748321575a57d7991760 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "c514ad7cac21a375285f901f349bd26785025367",
  "external_origin": null
}
```

# DSA-48 — `review-and-merge`

Three pull requests delivered DSA-48. The first, PR #97
(`claude/dsa-48-hotfix-tooltip-base`), fixed the typecheck errors and six tests
that had been broken on `v/5.0.0` since PR #94. The second, PR #98
(`claude/dsa-48-nph-tooltip-ajuste-62075c`), brought the six rules that Indiane
approved on 22-10-2026 to `nph-tooltip` and to the `nph-label` balloon: the
300 ms hover wait through `motion/hover-delay`, no wait on focus, Enter and
Space leaving the balloon alone, only on focusable elements, `relation="name"`
for an icon-only button, and the touch exception. It also fixed findings (a),
(b) and (c) left open by DSA-42 and amended P77. The third, PR #104
(`claude/dsa-48-hotfix-open-inert-a382f0`), fixed the one test that PR #98 left
red at its merge. `elvysmarcos` merged all three, as `component-handoff.md`
gives Elvys the review and merge of his own pull requests. The heads of the
three PRs are ancestors of the integration branch tip.

How the review went: Copilot reviewed; no human reviewed; Elvys merged.

- `maurocsjr`:
  - On #97, a review was requested from him at 2026-10-22T19:19:20Z and the
    request was removed at 19:34:09Z, when Copilot was requested instead.
  - On #98, a review was requested from him at 19:20:26Z, removed at 19:34:18Z
    and requested again at 19:38:54Z. That request was still open at the merge.
  - On #104, a review was requested from him at 2026-10-23T15:18:05Z and the
    request was removed at 18:19:18Z, when Copilot was requested instead.
  - He gave no review on any of the three.
- PR #97: Copilot reviewed it once, as `copilot-pull-request-reviewer`, on the
  head `c8da590`. The review said "Approval recommended", with no finding.
- PR #98: Copilot reviewed it five times as `copilot-pull-request-reviewer`
  and nine times as `copilot-swe-agent`. The `copilot-swe-agent` reviews have
  empty bodies and carry the per-comment replies.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `f311fb9` | An ancestor fieldset that is `disabled`; click focus on a text field after the wait is canceled | `bca4855`, with regression tests |
| `bca4855` | A tabbable `contenteditable`; the target moved into a disabled fieldset; the hover hold when focus opens during the wait; touch canceling the wait | `9c6178b`, with regression tests |
| `42e8ee7` | An `inert` ancestor; a `legend` swap in a disabled fieldset | `6ffcf9a`, then `4905d5c`, which added the test of an `inert` ancestor at mount |
| `4905d5c` | A `slot` change into an `inert` container | `bec6520`, with a regression test |
| `bec6520` | No open issue | — |

The fix commits `bca4855`, `9c6178b`, `6ffcf9a`, `4905d5c` and `bec6520` are
by `copilot-swe-agent`, co-authored by Elvys. In `42e8ee7`, the
`contenteditable` test of `9c6178b` was corrected in the test. The reviews of
`4905d5c` and `bec6520` each add one previously missed finding, and neither was
fixed (see "Still open").

- PR #104: Copilot reviewed it once, as `copilot-pull-request-reviewer`, on
  `38e3c91`. The review said "Approval recommended", with no finding. The only
  commit after that review is `8c6e503`, a sync with `v/5.0.0` at `579b2fa`.

## Command

```text
git merge-base --is-ancestor bec65200f79f1948eeb2748321575a57d7991760 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `bec6520`, the head of #98, is an ancestor of
`v/5.0.0`. The same command, with the head of #97 (`c8da590`) and with the head
of #104 (`8c6e503`), also exits with `0`. All three were checked against
`origin/v/5.0.0` at `c514ad7cac21a375285f901f349bd26785025367`.

## Merged PRs

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#97](https://github.com/iatecbr/IATec.Nephos/pull/97) | `bc9ae33` (2026-10-22T19:37:08Z) | `c8da590` | `elvysmarcos` |
| [#98](https://github.com/iatecbr/IATec.Nephos/pull/98) | `e65c07c` (2026-10-23T14:49:19Z) | `bec6520` | `elvysmarcos` |
| [#104](https://github.com/iatecbr/IATec.Nephos/pull/104) | `4bc59c0` (2026-10-23T20:05:22Z) | `8c6e503` | `elvysmarcos` |

## Proof commands

PR #97 recorded the following on its head `c8da590`, with exit code `0`:
`npm run typecheck`, `test` (1007 tests), `build:lib`, `test:package` (684
checks) and `git diff --check`. Nothing came in after that.

PR #98 recorded the following on `42e8ee7`, with exit code `0`:
`npm run build:tokens`, `test:tokens` (25 checks), `test` (26 files, 1182
tests), `typecheck`, `test:i18n`, `test:operacao` (47 tasks),
`build-storybook`, `build:lib`, `test:package` (720 checks) and
`git diff --check`. Three Copilot commits came in after that, `6ffcf9a`,
`4905d5c` and `bec6520`, and the PR records no rerun. At the merge `e65c07c`,
whose tree is the tree of `bec6520`, `npm test` exited with `1`. The one
failure was `nph-tooltip.test.ts:1074` ("an inert ancestor prevents a
consumer-opened balloon and keeps its ARIA reference"), a test from `4905d5c`
that failed every time: 1186 of 1187 tests passed. The cause was in the
component: `open` was not turned off when the target already took no focus at
mount.

PR #104 fixed this in the component. `attach()` calls `loseBalloon()` when it
associates a target that takes no focus while `open` is on. The PR has two new
regression tests and an adjusted mount step in the `contenteditable` test. It
recorded the following on its final head `8c6e503`, after the sync with
`579b2fa`, with exit code `0`: `npm run build:tokens`, `test:tokens` (25
checks), `test` (28 files, 1368 tests), `typecheck`, `test:i18n`,
`test:operacao` (48 tasks), `build-storybook`, `build:lib`, `test:package`
(749 checks) and `git diff --check`. Nothing came in after that.

These commands were rerun at the closing, on `c514ad7`, the tip of
`origin/v/5.0.0` after the merge of #104. All exited with `0`:
`npm run typecheck`, `test` (30 files, 1456 tests), `build:lib` and
`test:package` (785 checks, 15 components, 64 documented import lines).

`npm run test:naming` exits with `1` on PRs #98 and #104. The failures are
known failures of the base, in `scripts/test-package.mjs` and in Portuguese
words in `docs/operacao/` records, and none of those files is in the diff of
either PR.

## Still open

D2 stays in the task's `pending_decisions`, with Indiane, unchanged. It changes
no token and does not block the task. DSA-48 removes the cases behind D7 of
DSA-42 but answers none of D2 to D7, which stay with Indiane.

Copilot reported two previously missed findings on PR #98. Neither was fixed at
the merge, and both are still in `src/components/nph-tooltip/nph-tooltip.ts`.
They are left for a later task:

- Esc dismissal is lost when the pointer is over the target and the target
  loses focus during the wait.
- Changing the `slot` of an ancestor of the target to a slot under `inert` does
  not reevaluate whether the target can take focus.

P77 does not record the `inert` and `slot` behaviors that `6ffcf9a` and
`bec6520` added. This is a documentation gap, outside this closing.

In development mode, PR #104 makes Lit warn `change-in-update` once per page
when a tooltip mounts with `open` on over a target that takes no focus. The PR
documents this; the production build does not warn.
