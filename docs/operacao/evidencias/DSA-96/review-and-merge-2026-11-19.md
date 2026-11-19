```json
{
  "task": "DSA-96",
  "gate": "review-and-merge",
  "date": "2026-11-19",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 475790c405e9e94edde4a27c9035d9c36d0a2a66 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "04d9b3f",
  "external_origin": null
}
```

# DSA-96 — `review-and-merge`

PR 188 (`feat/dsa-96-date-picker`) brought the `nph-date-picker` and the `nph-calendar` to the six answers the design owner gave on
2026-11-18 (the evidence of the `design-decision` gate): the month and year views at the height of the day view (D-2), one arrow on each
outer edge of the range (D-5), the shortcuts without today and disabled outside the limits (D-6), `chevron-down` on the year title and
both columns switching together in a range (D-9), a period that does not cross an unavailable day (D-10) and the header of the large grid
at 44.

- **Components.** `src/components/nph-calendar/` and `src/components/nph-date-picker/`: the CSS, the elements, the pure logic
  (`periodReach`, `mergeLimits`, the shortcut periods), the tests, the Validation stories and the demonstration frames. The new boolean
  property `allowsNonContiguousRanges` (attribute `allows-non-contiguous-ranges`, off by default) is on both elements.
- **Spec and decision.** `fichas/nph-calendar.md`, `fichas/nph-date-picker.md`, the generated Metadata, and P135 in
  `docs/decisoes-tecnicas.md`, with supersession notes in P133. The Storybook dictionary has the three languages.
- **Labels.** The six rules, and D-1, D-3, D-4, D-7, D-8 and D-11, which the evidence records as answered as recommended, were
  called decided in the sheets and in the header comment of the date picker.
- **Not changed:** the tokens, `design.md`, the `nph-scheduler`, and the pieces of DSA-91. No token was created or changed.

It was merged on 2026-11-19T12:50Z at commit `04d9b3f`, by Elvys. The PR head, `475790c`, is an ancestor of the tip of the integration
branch.

## How the review went

**Elvys reviewed and merged PR 188, with Azure Test red on infrastructure only (build 633784, Failed to fetch dynamically imported module; fix in PR 184); Copilot did not review (out of quota).**

The request for the Copilot review (`gh pr edit 188 --add-reviewer @copilot`) did not register a reviewer (`reviewRequests` stayed
empty), and the change was not reviewed by Copilot at any point, so there is no round of fixes from it.

Before the pull request, the advisor of the session reviewed the plan and the delivery. Its findings changed the work in these points:
the window of the End kept out of `min` and `max` and enforced in the pick, the hover preview and the Tab stop; the stale sentences in P133
swept; the base merged before the final run.

**Proofs.** The 12 proofs were run in sequence, every exit code read: `build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
`test:naming`, `test:spelling` (cspell only on the changed files, never on `design.md`), `test:operacao`, `build-storybook`, `build:lib`,
`test:package` and `git diff --check` all exit 0, on `a429ba4`, the head of the pull request after the merge with DSA-91. The sync that
came after, with `a08043b`, brought only `docs/operacao/**`, so only `test:operacao`, `test:naming` and `git diff --check` were run on
`475790c`, and all exit 0.

**Azure, build 633784, on `475790c`.** Build and Storybook (633785) were SUCCESS. The Test stage failed twice, only for infrastructure: the
first attempt was canceled at the 30 minute limit with `net::ERR_NETWORK_CHANGED` on the script requests and no red test; the one rerun of
the stage, through the Azure DevOps API, failed with 32 test files that did not load (`Failed to fetch dynamically imported module`,
among them `nph-calendar.test.ts` and `nph-date-picker.docs.stories.ts`, which pass locally) and the timing test of `nph-tooltip`
(`crossing the gap: entering the balloon during the exit cancels the close`), with no assertion of this task. Elvys merged with that
result; the fix for the infrastructure is in PR 184.

## Command

```text
git merge-base --is-ancestor 475790c405e9e94edde4a27c9035d9c36d0a2a66 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `475790c` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `04d9b3f`.

## Still open

- **D-15 to D-18** wait for Indiane, each with the provisional rule the code follows, recorded in the task and in P135: a typed period and a
  shortcut that hold an unavailable day keep the rule of today; the month and year views of a range (the first column, the arrows on the
  outer edges, the keys); This month disabled with a min inside the month; the look of a day that cannot be the End.
- **D-12 to D-14** stay open in DSA-90: the measures with no token, a typed Start or End with the panel closed, and the page margin of the
  narrow switch.
- A period typed with an unavailable day keeps the rule of today.

The change has not had a Copilot review.
