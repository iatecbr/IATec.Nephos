```json
{
  "task": "DSA-29",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 53c6df2630ea4026da139ac46649276a1924345e origin/v/5.0.0",
  "exit_code": 0,
  "sha": "d0b4cf738237e9d01466a8b6fe165e595c7ce896",
  "external_origin": null
}
```

# DSA-29 — `review-and-merge`

PR #114 (`claude/dsa-29-nph-select-84cd97`) brought the `nph-select`, the field that opens
a closed list of options to pick one, and the `nph-option` it shares with the coming
combobox pieces. It came with both components, their CSS and tests, the Validation and
Docs stories, the dictionary in en, pt-BR and es, the two specs and their generated
Metadata, and P91. The PR changes no token. Elvys merged it on 24-10-2026, at commit
`d0b4cf7`. The PR head, `53c6df2`, is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested four times and reviewed four
times as `copilot-pull-request-reviewer`. The two replies by `elvysmarcos` on 23-10-2026
are the agent's answers to the round 1 threads, not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `529c58c` | Two threads: the open list did not follow the scroll of an ancestor reached through a slot; the list did not reopen after an invalid entry | Fixed in `ceaabde`, with a regression test each. The scroll listeners walk the flat tree through `assignedSlot`, as in `nph-tooltip` |
| 2 | `ceaabde` | Three findings in the summary, with no thread: reduced motion kept the full duration; a disabled or hidden option could be the chosen one; a click outside the list could choose | Fixed in `0ec4531`, answered in a PR comment, with a regression test each. Reduced motion uses `--nph-motion-hover-duration` (`design.md` 2g) |
| 3 | `0ec4531` | Two findings in the summary, with no thread: Space right after arrow navigation during typeahead did not choose; a disabled invalid select with keyboard focus kept the error border and halo | The first fixed in `b29ad9b` with a regression test that fails on the old code. The second does not reproduce in Chromium, where the trigger loses focus when it leaves the Tab order; `b29ad9b` adds the CSS rule as a defense, and its test passes on both codes |
| 4 | `b29ad9b` | No open issue; approval recommended | — |

After round 4, the branch merged `v/5.0.0` three times, to bring the merged PRs of other
pieces. None of these commits changes code of the PR:

- `5779cc3`, PR #113 (DSA-47): one conflict in the list of decisions at the top of
  `docs/decisoes-tecnicas.md`, resolved keeping P88 and P91.
- `1379212`, PR #110 (DSA-41): conflicts in the four places of
  `docs/decisoes-tecnicas.md` where P85 and P91 enter, resolved keeping both, P85 before
  P91; and in the three dictionaries, resolved by a three-way merge per key, with every
  key of both sides kept.
- `53c6df2`, PR #111 (DSA-38): conflicts in the same four places, resolved keeping P93
  and P91, P93 before P91.

Before the PR opened, the branch merged `v/5.0.0` at `1a4e7d5` and `1266e42`.

## Command

```text
git merge-base --is-ancestor 53c6df2630ea4026da139ac46649276a1924345e origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `53c6df2` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `d0b4cf738237e9d01466a8b6fe165e595c7ce896`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#114](https://github.com/iatecbr/IATec.Nephos/pull/114) | `d0b4cf7` (2026-10-24T22:45:32Z) | `53c6df2` | `elvysmarcos` |

The merge `d0b4cf7` has two parents, `c67700b` and `53c6df2`.

## Proof commands

Run on the final head `53c6df2`, after `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 2470 tests in 44 files |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1002 checks, 22 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records. None of those files is in the diff of the PR.

On the head `1379212`, the first run of `npm test` failed to import 12 test files while
Vite optimized `lit/directives/live.js`, which came with DSA-41; the second run passed
every test. The run on the final head passed the first time.

The piece was also checked by hand in Storybook, in light and dark mode: the open list,
the arrow area and the divider, the examples with avatar, the list height and the Docs
page, with no warning of `nph-select` or `nph-option` in the console.

## Still open

D-1 to D-3 stay in the task's `pending_decisions`, with Indiane, unchanged. None changes
a token or blocks the task:

- D-1: the arrow area of the disabled trigger. The code keeps `color/accent`, under the
  opacity of the piece.
- D-2: the list near the bottom of the window. The code turns it up, `space/inline-tight`
  above the trigger, when it does not fit below and fits above.
- D-3: an option both selected and disabled. The code keeps `color/primary-surface` and
  the check, under the opacity of the disabled option.
