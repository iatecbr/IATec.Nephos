```json
{
  "task": "DSA-33",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 56d35cb00f91d0dda151a38c5e02086a8f2f6f6b origin/v/5.0.0",
  "exit_code": 0,
  "sha": "78cdc6d05fc13256e861c20a75dff50c60f99cce",
  "external_origin": null
}
```

# DSA-33 — `review-and-merge`

PR #137 (`claude/dsa-33-docs-body-lg-2e2a78`) applied the answers of Indiane to DSA-33 (D1 to
D3) and to DSA-30 (D6 and D7). The `text` and `list` blocks of `src/shared/docs/page.ts` use
`text/body-lg`, and the `header` summary stays `text/body-md` (D1); `page.test.ts` proves both
roles by the computed size. The `nph-button` Docs page gained Anatomy, from the frame
`1197:5449`, between States and Accessibility, and its icon-only example of the frame uses
`plus` instead of `xmark`. The `nph-icon` Docs page gained Anatomy, from the frame `1130:956`,
after Invalid input, and the other two examples of the frame after the search field that
DSA-16 had delivered: `circle-info` next to text and an icon-only `nph-button` with
`magnifying-glass`. The Docs tests of both pieces prove the sections in the order of the model
and the examples of the frames. `docs/stories.md` §4.10 says the page follows the sections of
the frame in the order of the model (D3), and its Limit no longer says that those sections and
`text/body-lg` are missing; the protected list of components did not change. The visible text
is in the three dictionaries. The PR changes no token, sheet or technical decision. It was
merged on 2026-10-28T19:47:16Z, at commit `78cdc6d`. The PR head, `56d35cb`, is an ancestor
of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys's authorization.

No person was requested as reviewer. Copilot was requested twice, at 2026-10-28T19:26:57Z and
19:32:19Z, and reviewed twice as `copilot-pull-request-reviewer`. The answer to its thread
posted under `elvysmarcos` was written by the agent; it is not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `66865ed` | 1 (the text of the `circle-info` example had no text role) | Fixed in `56d35cb`: the container takes `text/body-md`, and the page test checks the computed size and line height against the token |
| 2 | `56d35cb` | No open issue; approval recommended | — |

The one thread was answered and resolved. Before the pull request, the branch merged
`v/5.0.0` at `2b8a33e` (`e213da4`). Round 2 reviewed the final head, `56d35cb`.

## Questions that followed the recommendation

- **Q1, D2.** DSA-16 had already put the `magnifying-glass` example inside `nph-input` on the
  `nph-icon` page, as D2 itself foresaw. No new decision was needed: the example stays, and
  the other two examples of the frame come after it.
- **Q2, Anatomy without a specimen.** The frame shows a specimen beside the Anatomy; the page
  uses only the table of parts, as the §4.10 block and the other pages do.
- **Q3, names of the frame.** The parts of `nph-icon` use the public API (`name`, `variant`),
  not the Portuguese names of the frame, as the API table already does.

## Command

```text
git merge-base --is-ancestor 56d35cb00f91d0dda151a38c5e02086a8f2f6f6b origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `56d35cb` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `78cdc6d05fc13256e861c20a75dff50c60f99cce`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#137](https://github.com/iatecbr/IATec.Nephos/pull/137) | `78cdc6d` (2026-10-28T19:47:16Z) | `56d35cb` | `elvysmarcos` |

The merge `78cdc6d` has two parents, `2b8a33e` and `56d35cb`.

## Proof commands

Run in sequence on the final head `56d35cb`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 128 files, 4431 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | 354 files, 0 issues |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

The Azure check (Build and Test Stage) passed on build 611423, for the head `56d35cb`.

## Known limits

- The sheet of `nph-button` ("Alternative case") still names the `xmark` "Close" example.
  DSA-33 changes no sheet; `xmark` is still on the page, in Sizes and States.
- Each example appears in one mode (§4.6); the frame shows light and dark, and the mode
  selector covers both.

## Still open

The task has no pending decision.
