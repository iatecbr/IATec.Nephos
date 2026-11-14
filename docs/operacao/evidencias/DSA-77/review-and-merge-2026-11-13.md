```json
{
  "task": "DSA-77",
  "gate": "review-and-merge",
  "date": "2026-11-13",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 996b5d6a6113db94171ee002b0679e549e30ac3e origin/v/5.0.0",
  "exit_code": 0,
  "sha": "39bcaa3",
  "external_origin": null
}
```

# DSA-77 — `review-and-merge`

PR #171 (`feat/dsa-77-scheduler`) implemented `nph-scheduler` in the contract accepted in Figma on 2026-11-12
(documentation frame `6151:11160`, component sets `6142:1744` and `6141:9258`):

- **`nph-scheduler`**, a calendar of events in the work week (default), week, day, month and list views, on
  desktop and mobile, with an optional side panel (mini month and "My calendars"), a toolbar and the inner event.
  The event takes the color of its calendar (`primary` and the seven vertical colors) and has the 1 h, short, long
  and recurring types and the default, hover, open and cancelled states. Under 768 px of the width of the element
  it becomes the compact month with the list of the chosen day. Each day and each event is a Tab stop, in the order
  of the document; the mini month and the compact month keep the arrows, Page Up, Page Down, Home and End. It
  hands the click on the event to the screen (`nph-event-click`, cancelable). It comes with the component, the
  CSS, a pure logic module (`nph-scheduler.logic.ts`) for the civil calendar, the reading of the events and the
  layout of a day, the tests, the Validation stories and the Docs page, the Storybook dictionary in en, pt-BR and
  es, the sheet `fichas/nph-scheduler.md`, its generated Metadata and P120 in `docs/decisoes-tecnicas.md`. It
  consumes the `scheduler/*` and `event/<color>-*` tokens already on `v/5.0.0` and creates or changes none.
- **The detail of the event** belongs to the product. The scheduler does not draw it: when the screen puts content
  in the `detail` slot it hosts one `nph-popover` beside the event (decision D-6, below).
- **Outside the folder of the piece**, each one listed in the pull request: `'nph-scheduler': 'labels'` in
  `DATA_BY_PROPERTY` of `src/shared/docs/usage.test.ts`, the `token-schema` entries for the names of the verticals
  in `scripts/naming-exceptions.json`, the `contract-term` entry for `sistemas` in the sheet in
  `scripts/language-exceptions.json`, and `comercial`, `financeiro` and `igrejas` in the `nephos-portuguese`
  dictionary of `cspell.config.yaml`.

The PR does not change `design.md`, a token, `nph-icon` (the `sidebar` icon is not in it: the sidebar button keeps
the place of the icon with an `nph-skeleton`, as `nph-sidebar` does, and the recurring event uses `rotate-right`)
or any other piece. It was merged on 2026-11-14T02:08:53Z (2026-11-13 in Brazil), at commit `39bcaa3`, under
Elvys's standing authorization of 2026-11-07. The PR head, `996b5d6`, is an ancestor of the tip of the integration
branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened and again after each round of
fixes, and reviewed as `copilot-pull-request-reviewer`. There were three reviews, one round with findings that the
code had to answer:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `ac0b4cc` | Six threads: a calendar with an empty name was accepted and left its events with no checkbox; a midnight end only counted on the next day; the Tab stop of the mini month and of the compact month stayed on the selected day after the arrows; `loading` kept the events of the last period in the week, work week and day views; the focus of a list row ignored the color of its calendar; the sheet promised to leave out a calendar with a color that does not exist, while the code keeps it with `primary` | `71a3181`, each with a regression test (the calendar with no name and the midnight end in `nph-scheduler.logic.test.ts`; the Tab stop, the loading state and the focus color in `nph-scheduler.test.ts`); the sheet and the generated Metadata separate leaving out from the fallback, and P120 says the same. The six threads were answered and resolved |
| `71a3181` | No open issue | Not applicable |
| `996b5d6` | No open issue, no open thread | Not applicable |

Before the first Copilot request, a review of the whole component (life cycle, focus, keyboard, right-to-left,
inherited language, announcements, invalid input) found and fixed, each with a test: the calendars drawn in "My
calendars" came from the raw list, the work week of a Sunday showed the week before, the `input` of the calendar
checkbox left the scheduler, an open detail came back by itself when the person returned to its period, the
loading status region was created with its text, and `scheduler/empty-icon-size` was not read. The accessibility
gate of P72 also asked for the name of each event, day and row to start with the text the person sees (WCAG
2.5.3), for the month line to keep the 24 px minimum of an event, and for the Validation stories to stack the
schedulers instead of putting them in a table cell, where a calendar clipped by the scroll of the table failed the
target size. No accessibility exception was opened.

The proofs were run on `996b5d6`, the final head, in sequence: `build:tokens`, `test:tokens`, `test` (201 files,
8661 tests), `typecheck`, `test:i18n`, `test:naming`, `test:operacao`, `build-storybook`, `build:lib`,
`test:package` and `git diff --check` all exit 0. **`test:spelling`: cspell on every file except `design.md` = 0
(528 files); `design.md` is unchanged in this PR; the full cspell of `design.md` does not end on the base, a
problem of the base under investigation by the orchestrator session.** The orchestrator session accepted that
reading for this gate. The base had `test:naming` and `test:spelling` red because of the DSA-80 and DSA-81 texts
until PR #170 (DSA-78) fixed them; the PR was synchronized with it by merge. The Azure Build and Test was SUCCESS
on the final head and the merge state was CLEAN, as the orchestrator session reported before the merge.

## Command

```text
git merge-base --is-ancestor 996b5d6a6113db94171ee002b0679e549e30ac3e origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `996b5d6` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`39bcaa3`.

## Still open

Seven decisions wait for Indiane, recorded in the task and in P120; none blocked the merge:

- **D-1**: the mini month and the compact month are the scheduler's own date grid until the date-picker grid
  exists, and the compact month may or may not keep the arrow keys.
- **D-2**: the `sidebar` icon, and `repeat` for the recurring event, are not in `nph-icon`; the foundation task
  that adds them is hers to free.
- **D-3**: the measures that no token states (the hour at twice the minimum event height, the cell of the mini
  month, the time of a list row and of a phone row, the minimum of a month row).
- **D-4**: the swatch of the color of a calendar beside its checkbox in "My calendars".
- **D-5**: a day hands its date to the screen (`nph-day-click`) and does nothing else.
- **D-6**: the scheduler hosts the `nph-popover` of the detail and the screen gives the content in the `detail`
  and `detail-footer` slots; the alternative is the click event only.
- **D-7**: the all-day band comes before the grid in the document, so Tab reaches an all-day event of a later day
  before a timed event of an earlier one.

The focus of the primary `nph-button` in dark mode stays in its own adjustment, outside this task.
