```json
{
  "task": "DSA-43",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor cbe122faae16c3906d920e4e1d804b5e1629f9ae origin/v/5.0.0",
  "exit_code": 0,
  "sha": "0c56f6d22762fc0fcfc620fa9a6e0f49a99ad7ca",
  "external_origin": null
}
```

# DSA-43 — `review-and-merge`

PR #103 (`claude/dsa-43-nph-icon-button-91e130`) brought the icon-only `nph-button` to
the `nph-icon-button` contract: the `shape` attribute (`square` or `circular`) and the
required tooltip, which the button renders next to its native button with the `label` as
text and `relation="name"`. It came with the tests, the Shapes and Tooltip Validation
stories, the Icon only section and the three required examples of the Docs page, the
dictionary in en, pt-BR and es, the spec and its generated Metadata, and P86, which amends
P68. The review also changed `nph-tooltip`: it takes the focus hold when it attaches to an
element that already has keyboard focus, and its demonstrations use a native button with
one balloon. The PR changes no token. Elvys merged it on 23-10-2026, at commit `0c56f6d`.
The PR head, `cbe122f`, is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

A review by `maurocsjr` was requested when the PR opened and removed at
2026-10-23T18:18:49Z, under the wave's rule that Copilot reviews. Copilot was requested
six times, from 2026-10-23T18:19:02Z to 21:14:14Z, and reviewed six times as
`copilot-pull-request-reviewer`. Elvys allowed the sixth round, past the limit of five.

| Reviewed head | Findings | Answer |
|---|---|---|
| `13988a1` | A click on the open balloon reached the consumer's click listeners on the host; switching between text and icon only rebuilt the native button and lost its focus | Fixed in `de2e90c`, with a regression test for each |
| `de2e90c` | A tooltip rendered while the button already had keyboard focus stayed closed; the `nph-tooltip` demonstrations paired an icon-only `nph-button` with a second tooltip, showing two balloons | Fixed in `52d5ff1`: the tooltip takes the existing focus hold; the demonstrations use a native button with one balloon; regression tests in both pieces |
| `d9f9995` | The focus hold was taken only on the first update, not on every attach; a tooltip mounted after a click or a tap on a text field opened | Fixed in `5b933aa`, with two regression tests |
| `4b5198f` | The record of how the focus arrived started with the first tooltip, so the first balloon of a page missed it | Fixed in `38c897e`: the record starts when the module loads; regression test in a fresh page, `nph-button.first-tooltip.test.ts` |
| `38c897e` | No open thread; one issue in the summary: a focus move between two controls of the same shadow root was not seen by a `focusin` on the document | Elvys's decision: fixed in the PR, in `9c1cf1e`, with two regression tests in a shadow root (keyboard and tap) |
| `cbe122f` | No open issue; approval recommended | — |

Every thread was answered in Portuguese and resolved. Between the reviews, the branch
merged `v/5.0.0` with no conflict in code; the conflicts were in
`docs/decisoes-tecnicas.md`, resolved keeping the entries of the other tasks (P80, P83,
P84, P90).

## Command

```text
git merge-base --is-ancestor cbe122faae16c3906d920e4e1d804b5e1629f9ae origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `cbe122f` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `0c56f6d22762fc0fcfc620fa9a6e0f49a99ad7ca`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#103](https://github.com/iatecbr/IATec.Nephos/pull/103) | `0c56f6d` (2026-10-23T21:20:22Z) | `cbe122f` | `elvysmarcos` |

The merge `0c56f6d` has two parents, `b11f5b6` and `cbe122f`.

## Proof commands

Run on the final head `cbe122f`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 1780 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 860 checks, 17 components |
| `git diff --check origin/v/5.0.0 HEAD` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records. The result is the same as on the base, and none of
those files is in the diff of the PR.

## Still open

D1 and D2 stay in the task's `pending_decisions`, with Indiane, unchanged. They change no
token and do not block the task:

- D1: whether the three demonstrations of what not to do go on the Docs page as negative
  examples, or stay only in the spec.
- D2: inside a dialog, with keyboard focus on an icon-only button, the first Esc closes the
  balloon and not the dialog; P86 records it as a known limit.

Follow-ups recorded elsewhere:

- The distance of the balloon of the icon-only button (`space/inline` in the code,
  `space/inline-tight` in the DSA-43 evidence) is DSA-42 D2, with Indiane.
- Whether the icon-only button also swaps its icon to solid in `hover-active` is DSA-47 D1.
