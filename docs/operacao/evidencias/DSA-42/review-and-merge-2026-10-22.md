```json
{
  "task": "DSA-42",
  "gate": "review-and-merge",
  "date": "2026-10-22",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor d82d2c3bf2e6983ceab1cb3ac81b608c578a74c8 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "3835337466f18f7153d3ec737df144359f8ec4fb",
  "external_origin": null
}
```

# DSA-42 — `review-and-merge`

PR #94 (`claude/dsa-42-nph-tooltip-466e67`) brought the new `nph-tooltip` (any
element by `for` in the same root, opened on hover and on keyboard focus,
closed with Esc, four sides with `side`, top layer, motion), the `nph-label`
balloon on the same contract, the tooltip Docs page, both specs and the
generated Metadata, and P77, which amends P62.6 and P65. `elvysmarcos` reviewed
and merged it on 22-10-2026, at commit `3835337`, as `component-handoff.md`
gives Elvys the review and merge of his own pull requests. The PR head,
`d82d2c3`, is an ancestor of the default branch tip.

How the review went: a review was requested from `maurocsjr`, and he did not
give it. Copilot reviewed as `copilot-pull-request-reviewer` three times and as
`copilot-swe-agent` thirteen times, with empty review bodies that carry the
per-comment replies. The first review, on `ac0f502`, found eight issues (target
replacement, SVG targets, `ResizeObserver`, touch on an associated label, slow
crossing to the balloon, keyboard after touch, scroll in Shadow DOM and width on
a small viewport); all eight were fixed in `e06352c` with eight regression
tests. The second review, on `e06352c`, found five issues (detach before
clearing `observedRoot`, `sync()` closing a programmatic open and Esc, `rem`
limits, test viewport restore and the slow-crossing test); they were fixed in
`d82d2c3`. Both fix commits are by `copilot-swe-agent`, co-authored by Elvys.
The last review, on `d82d2c3`, lists no open issue and adds three previously
missed findings (see "Still open"). Elvys reviewed and merged.

## Command

```text
git merge-base --is-ancestor d82d2c3bf2e6983ceab1cb3ac81b608c578a74c8 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `d82d2c3` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `ab3cd5d61055f738e2afb70dcb11564e38e443ef`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#94](https://github.com/iatecbr/IATec.Nephos/pull/94) | `3835337` (2026-10-22T12:55:34Z) | `d82d2c3` | `elvysmarcos` |

## Proof commands recorded in the PR

Exit code `0`: `npm run build:tokens` (572 tokens), `test:tokens` (25 checks),
`test` (24 files, 988 tests), `typecheck`, `test:i18n`, `test:operacao` (45
tasks), `build-storybook`, `build:lib`, `test:package` (684 checks) and
`git diff --check`.

These were recorded in the PR description on `effb1cc`, before the merge of
`v/5.0.0` into the branch (`ac0f502`, toggle-group files only) and the Copilot
fixes in `e06352c` and `d82d2c3`; those fixes added regression tests, and the
merge came after them. The PR records no rerun.

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on
Portuguese words in the DSA-34, DSA-39, DSA-42, DSA-43 and DSA-45 records, none
of which is in the diff of the PR.

## Still open

D2 to D7 stay in the task's `pending_decisions`, with Indiane, unchanged. They
change no token and do not block the task. DSA-48 removes the cases behind D7
(its rules 4 and 5) but answers none of them.

Three findings from the last Copilot review were missed before the merge, were
not fixed at the merge and are still in `src/components/nph-tooltip/nph-tooltip.ts`:

- (a) Changing the tooltip's `id` after association leaves the old reference in
  the target's `aria-describedby`.
- (b) Scroll of slotted targets is not followed: the scroll-target walk climbs
  `parentNode` and the host, but never goes through `assignedSlot`.
- (c) Esc after a touch on an input can open the tooltip: the keydown handler
  does not exclude Escape.

They will be fixed, with regression tests, inside DSA-48, which adjusts the same
component.
