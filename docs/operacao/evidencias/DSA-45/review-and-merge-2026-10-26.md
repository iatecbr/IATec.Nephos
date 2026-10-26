```json
{
  "task": "DSA-45",
  "gate": "review-and-merge",
  "date": "2026-10-26",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 4c4ff5a887c26f2257573082fb874d1ee7617475 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "0a3c08014a686cbf4b61f908c68bccacde0311f6",
  "external_origin": null
}
```

# DSA-45 — `review-and-merge`

PR #118 (`claude/dsa-45-nph-dropdown-menu-6256e3`) brought the `nph-dropdown-menu`, the
floating menu of secondary actions that opens attached to a button, with its item, group
label, separator and profile header as entries of `items` and `header`. It came with the
component, its CSS and tests, the Validation and Docs stories, the dictionary in en, pt-BR
and es, the spec and its generated Metadata, P92, and the `right-from-bracket` icon of
`nph-icon` with its line in the action icon list of `design.md`. The PR changes no token.
Elvys merged it on 26-10-2026, at commit `0a3c080`. The PR head, `4c4ff5a`, is an ancestor
of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested when the PR opened and again
after each round of fixes, and reviewed six times as `copilot-pull-request-reviewer`.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `99bde57` | Five threads: single choice after an empty group, a trigger in `loading` opened by the arrows, a second Esc during the exit, `open` before the trigger existed, the panel wider than the window | Fixed in `4753f5b`, with a regression test each, all failing on the old code |
| 2 | `4753f5b` | Two threads and two findings in the summary: `for` set right after `append()`, groups with no label, a new trigger while open, the scroll position on repositioning | Fixed in `da5ee41`. Three tests fail on the old code; the scroll position does not reproduce in Chromium, so the change stays as a defense and its test passes on both codes |
| 3 | `da5ee41` | One thread: Tab out of a menu far from its trigger in the DOM | Fixed in `57673d8`, with four regression tests, three failing on the old code |
| 4 | `57673d8` | One finding in the summary: a long status in the header left the panel | Fixed in `6a2c9e0`, with a regression test that fails on the old CSS |
| 5 | `6a2c9e0` | Two findings in the summary: Space right after a typed character, repositioning when the content changes while open | Fixed in `03f94ec`. The first test fails on the old code; the second does not reproduce in Chromium and stays as a defense |
| 6 | `f82eec8` | Two threads: an `nph-button` that goes into `loading` while the menu is open, a trigger clipped by a scrolling ancestor | After the round limit, the orchestrator decided to record both as known limits with a follow-up: P92 and the spec in `4c4ff5a`, which changes no code |

Before the merge, the branch merged `v/5.0.0` twice, to bring the merged work of other
tasks. Neither commit changes code of the PR:

- `b39396c`, PR #109 (DSA-18): conflicts in the two lists of decisions of
  `docs/decisoes-tecnicas.md`, resolved keeping P82 and P92, and in the three
  dictionaries, resolved by taking the base and adding the keys of this piece.
- `f82eec8`, the tokens of DSA-49 and DSA-53 and the operations records up to `e839be0`:
  no conflict.

## Command

```text
git merge-base --is-ancestor 4c4ff5a887c26f2257573082fb874d1ee7617475 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `4c4ff5a` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `0a3c08014a686cbf4b61f908c68bccacde0311f6`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#118](https://github.com/iatecbr/IATec.Nephos/pull/118) | `0a3c080` (2026-10-26T19:54:50Z) | `4c4ff5a` | `elvysmarcos` |

The merge `0a3c080` has two parents, `e839be0` and `4c4ff5a`.

## Proof commands

Run one at a time on the final head `4c4ff5a`, after `npm ci`, and again after every
commit of the PR. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 3333 tests in 54 files |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1213 checks, 27 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records. None of those files is in the diff of the PR.

The piece was also checked by hand in the static Storybook, in light and dark mode: the
three examples, the item options with the solid hover and the Docs matrix.

## Still open

D-1 to D-6 stay in the task's `pending_decisions`, with Indiane, unchanged. None changes a
token or blocks the task:

- D-1: the distance between the trigger and the menu. The code uses `space/inline-tight`.
- D-2: the motion of opening and closing. The code uses the motion of the `nph-select` list.
- D-3: the inner box and track do not take their own hover on item hover. Known limit,
  with a follow-up task for an API in `nph-checkbox` and `nph-switch`.
- D-4: the switch in a slot of `icon/size-md`, with the track overflowing it.
- D-5: the single choice highlight only on the checked item.
- D-6: hover paints only; the focus moves by keyboard.

Known limits recorded in P92, each with a follow-up: an `nph-button` that goes into
`loading` while the menu is open does not close it by a press; a trigger clipped by a
scrolling ancestor, still inside the window, keeps the menu drawn; `aria-haspopup` and
`aria-expanded` on an `nph-button` do not reach its inner button; a nested menu is out of
scope.
