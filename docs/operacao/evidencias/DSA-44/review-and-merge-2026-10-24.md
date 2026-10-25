```json
{
  "task": "DSA-44",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor ffbecfdb1a20ddd5a54ffa73e9fef5dd5d8634aa origin/v/5.0.0",
  "exit_code": 0,
  "sha": "768db03de985bf53e738d2c892ef65bb92494307",
  "external_origin": null
}
```

# DSA-44 — `review-and-merge`

PR #115 (`claude/dsa-44-nph-dialog-07ca69`) brought the `nph-dialog`, the modal window, in
the contract accepted in Figma (board `1368:27`). It is a native `<dialog>` opened with
`showModal()`, over the `overlay/scrim` veil, with heading, description, close button,
content, footer and lines, the cancelable `nph-close` event, the focus rule, the scroll lock
of the page and the stacked actions below the `md` breakpoint. It came with the CSS, the
tests, the Validation stories, the hidden Fixtures story, the Docs page, the dictionary in
en, pt-BR and es, the spec and its generated Metadata, and P87. It also brought the rule of
Q1 to `nph-button.css` (`:host(:not([data-nph-icon-only])) .control { flex: 1 }`), with its
scope tests, after DSA-47. The PR changes no token. Elvys merged it on 24-10-2026 (local
time; 2026-10-25T00:12:08Z), at commit `768db03`. The PR head, `ffbecfd`, is an ancestor of
the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested seven times, at
2026-10-24T22:21:24Z, 22:35:43Z, 22:37:04Z, 22:48:01Z, 22:59:48Z, 23:09:51Z and 23:19:29Z,
and reviewed seven times as `copilot-pull-request-reviewer`; the review of 22:36:35Z was an
error of Copilot, with no review, and was requested again. The answers to its threads
posted under `elvysmarcos` were written by the agent; they are not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `bdf302a` | 5 threads | Fixed in `18b14bf`, each with a regression test |
| 2 | `18b14bf` | 4 threads (after one attempt that failed) | Fixed in `13f4523`, each with a regression test |
| 3 | `13f4523` | 2 threads | Fixed in `ee9e3c3`, each with a regression test; opened D6 |
| 4 | `ee9e3c3` | 2 threads | Fixed in `26432e7`, each with a regression test |
| 5 | `26432e7` | 1 thread; 2 findings in the summary | Elvys chose a sixth round; fixed in `52d010b`, each with a regression test |
| 6 | `ffbecfd` | No open issue; approval recommended | — |

All 14 threads were answered and resolved. Each fix was checked by undoing it: its
regression test failed without it. Between rounds the branch merged `v/5.0.0` at `1d14864`,
`e2f7841`, `1976be1`, `191fe6e` and `325f49b`, keeping the entries of the other tasks in
`docs/decisoes-tecnicas.md` and in `.storybook/i18n/*.json`. Round 6 reviewed the final
head, `ffbecfd`.

## Command

```text
git merge-base --is-ancestor ffbecfdb1a20ddd5a54ffa73e9fef5dd5d8634aa origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `ffbecfd` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `768db03de985bf53e738d2c892ef65bb92494307`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#115](https://github.com/iatecbr/IATec.Nephos/pull/115) | `768db03` (2026-10-25T00:12:08Z) | `ffbecfd` | `elvysmarcos` |

The merge `768db03` has two parents, `325f49b` and `ffbecfd`.

## Proof commands

Run on the final head `ffbecfd`, after `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 2805 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1091 checks, 24 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records of other tasks (DSA-34, 42, 43, 45 and 47). None of those
files is in the diff of the PR.

The dialog was also checked in the static Storybook: the stacked footer at 375 px, with the
primary on top and both buttons at the width of the footer, and a window of 375 × 260, where
the content keeps its row, the focus halo of a field shows whole and the window scrolls to
the last action, with no error in the console.

## Still open

D1, D2, D4, D5 and D6 stay in the task's `pending_decisions`, with Indiane. None changes a
token or blocks the task:

- D1: whether `stacked` is the consumer's choice or what every dialog does below `md`.
- D2: the margin to the edge of a small window, today `layout/margin-compact`.
- D4: the extent of the lines and the spaces around them and next to the close button.
- D5: whether a click on the veil closes the dialog; today it does not.
- D6: the minimum height of the content in a window too short for everything, today one
  control row (`control/height-large`).

D3, the highlight icon, keeps `status` out of this delivery until Indiane answers it.
