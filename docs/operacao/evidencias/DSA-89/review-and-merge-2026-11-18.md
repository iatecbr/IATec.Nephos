```json
{
  "task": "DSA-89",
  "gate": "review-and-merge",
  "date": "2026-11-18",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 3be61aeabf422ffbf545eef659d4f0a904b81330 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "ef60e68",
  "external_origin": null
}
```

# DSA-89 — `review-and-merge`

PR 185 (`feat/dsa-89-timeline`) brought the `nph-timeline`, a vertical list of events in order linked by a connector
line, in the contract accepted in Figma (frame `5237:3423`).

- **Component.** `src/components/nph-timeline/`: the element, its CSS, the browser tests, the Validation stories
  (including `Brands`), the Docs page and its test, and the demonstration scenes. The events are the `items` property;
  the types are `process` and `history`; the markers are the dot, the circle (six statuses) and the avatar. The item
  takes a meta line (who and when, with the date in `time`), an optional action, and rich content in a slot named as
  its `id`. The list has "Show more", a loading state, an empty state and a live region. The connector line is an
  `nph-separator` held by the item and painted from outside, on a whole pixel with no `transform`.
- **Spec and decision.** `fichas/nph-timeline.md`, the generated Metadata, and P132 in `docs/decisoes-tecnicas.md`. The
  Storybook dictionary has the three languages.
- **Not changed:** the tokens, `design.md`, `nph-separator`, `nph-stepper`, `nph-card` and the other pieces the
  timeline uses. No token was created or changed.

It was merged on 2026-11-18T23:56Z at commit `ef60e68`. The PR head, `3be61ae`, is an ancestor of the tip of the
integration branch.

## How the review went

**Elvys reviewed and merged PR 185; Copilot did not review (out of quota).**

The request for the Copilot review (`gh pr edit 185 --add-reviewer @copilot`) did not register on the pull request, so
the change was not reviewed by Copilot at any point and there is no round of fixes from it.

Before the pull request, the advisor of the session reviewed the work. Its findings changed the code and the record in
these points, each with a test where it is code: the loading state keeps the name given by `labelledBy`; a "Show more"
request that ended with no new event is not the answer to a later growth; `labelledBy` wins over `label`, and a test
mounts both; and a test proves that a disabled action puts only the button under the disabled opacity.

**Proofs and Azure.** The 12 proofs were run in sequence on the final head `3be61ae`, every exit code read:
`build:tokens`, `test:tokens`, `test` (228 files, 10175 tests), `typecheck`, `test:i18n`, `test:naming`,
`test:operacao`, `build-storybook`, `build:lib`, `test:package` and `git diff --check` exit 0, and `test:spelling` ran as
cspell only on the changed files, never on `design.md`, with no finding. In the first run of `test`, the hover-delay
test of `nph-tooltip` failed once; it passed alone and in a second full run. The base `origin/v/5.0.0` was contained in
the head. Azure on `3be61ae` (build 633446): the Build stage, the Test stage and the Storybook build passed. The earlier
build 633366 (head `839072c`) had the Test stage red only for infrastructure, `ERR_NETWORK_CHANGED` and, on the
single rerun, 15 second timeouts in the docs stories of other pieces; none was a file of this task.

## Command

```text
git merge-base --is-ancestor 3be61aeabf422ffbf545eef659d4f0a904b81330 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `3be61ae` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `ef60e68`.

## Still open

- **D-1 to D-3** wait for Indiane, as recorded in the task and in P132: the number of skeleton rows of the loading state
  (the code draws three), the look of the item that takes the focus on the last batch of "Show more" (the code draws no
  ring), and the current status on the history type (the code draws the current look with no `aria-current`). None blocks
  anything.
- **Known limits, recorded in P132.** Nothing else is pending for this task.

The change has not had a Copilot review.
