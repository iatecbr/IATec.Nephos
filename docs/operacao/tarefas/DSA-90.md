```json
{
  "id": "DSA-90",
  "goal": "Implement the nph-date-picker, a date field with a calendar in single date and range modes, and its date grid nph-calendar, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 890,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-date-picker",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-13",
    "DSA-16",
    "DSA-28",
    "DSA-29",
    "DSA-42",
    "DSA-47",
    "DSA-48",
    "DSA-59",
    "DSA-60",
    "DSA-64",
    "DSA-67",
    "DSA-77"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-date-picker documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-90/figma-docs-accepted-2026-11-17.md",
      "result": "passed",
      "verified_at": "2026-11-17",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "A month that spans six weeks has no drawing: the grid in Figma has five week rows (284 × 296). Recommended: always six rows, filled with days of the next month, so the panel does not jump in height and the two months of the range stay aligned (Ant Design keeps six rows; MUI X documents six as the usual fixed count). Alternative: the height follows the month (four, five or six rows: February 2026 starts on Sunday and fills four; with Monday as the first day the count changes). It needs a Figma preview, in light and dark (the day view becomes 284 × 332 on default). The accepted five-row drawing cannot hold a six-week month, so until she answers the code draws six rows, the only interim that shows every day. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-2",
      "question": "The grids of the month and year views are drawn on default only (284 × 224, lower than the day view); their header exists on large too (308 × 40). Recommended: on large the month and year cells grow with the size (Mantine applies the size to the whole calendar), the panel keeps the height of the day view when the view changes (no market source read on this point; it keeps the arrows in place), picking a year opens the month view of that year and picking a month opens the day view of that month (Ant Design and Mantine code). Alternative: the views keep their own height and the panel shrinks. It needs a Figma preview of the large views and of the two heights, in light and dark. Until she answers, the code keeps the accepted drawing: the view grids at their drawn size and height on both panel sizes, centered in the large panel, the large header as drawn, and picking a year or a month goes as recommended. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-3",
      "question": "The weekday names are bound in Figma to core/size/100 (12), core/weight/medium and core/tracking/normal, with no text style and no line height; no text role has these exact values, and core/size/100 is not in core.tokens.json. Recommended: text/label-sm (12, line height 16, weight 500), the role of a tag, which adds a 0.4 px tracking, because design.md asks every text to use a role; the Figma owner grid takes the text styles in the scheduler adjustment task. Alternative: bring core/size/100 to the code and set the weekday names outside the roles. Until she answers, the code uses text/label-sm. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-4",
      "question": "What happens to a typed date outside the min or max, a typed date unavailable by rule and, in the range, an End typed before the Start (the reorder decided for the panel covers picking only). Recommended: an error on the field that says what to fix and cites the limit, with no reorder of a typed value, one message at a time in this order: empty, invalid, outside the limit, unavailable, end before start (GOV.UK date input for the messages and the order; MUI X validation and React Aria for the limits and unavailable dates as field errors; for an End typed before the Start, no market source was reread). Example messages, translated by the product: The date must be on or after 01/03/2026. The date must be on or before 31/12/2026. Choose a date between 01/03/2026 and 31/12/2026. This date is not available, choose another day. The end must be on or after the start (05/03/2026). Also recommended (no market source read): the field accepts day and month with or without a leading zero and a four-digit year, with the slash as separator, and an empty field is an error only when the field is required. Alternative: reorder typed values too, as Ant Design does. Until she answers, the code follows the recommendation. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-5",
      "question": "The two months of the range: in Figma each month carries both arrows. Recommended: the two months move together and are always consecutive, with Previous month only on the first and Next month only on the second; on opening, the month of Start on the left (empty: the current month on the left), and focus on the Start day (empty: today) (React Aria pageBehavior moves the visible months together; Mantine numberOfColumns shows consecutive months; for the arrows only on the outer edges, no market source was reread). Alternative: with an empty field, the current month on the right and the previous one on the left, for report filters that look back. The arrows need a Figma preview, in light and dark. Until she answers, the code keeps the accepted drawing, both arrows on each month, moves the two months together, and opens the months and puts the focus as recommended. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-6",
      "question": "The period of each shortcut and what Custom does. Recommended: Today and Yesterday are one day; Last 7 days and Last 30 days end today and include it; This month runs from day 1 to the last day of the month, cut by the max; Last month is the whole previous month; Custom does not change the dates and moves focus to the grid; picking or typing dates by hand marks Custom, or the shortcut whose range matches; on opening with a period, the matching shortcut is marked, or Custom; on opening empty, none is marked (no market source read on this point); choosing a shortcut brings the months to the range; a shortcut outside the min or max is disabled (Mantine examples for the periods, MUI X shortcuts for the disabled shortcut; for marking Custom by hand, no market source was reread). Alternative: Last N days without today, written in the label. Until she answers, the code follows the recommendation. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-7",
      "question": "When the range switches to one month with the shortcuts on top. Recommended: when the available width does not fit the range panel of the size in use (762 px default, 874 px large) plus the page margin, not at a fixed breakpoint, so it also works in a narrow column on desktop (React Spectrum shows more months only if the screen space allows). Alternative: a fixed breakpoint, such as below 768 px. Until she answers, the code follows the recommendation. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-8",
      "question": "What Clear does in the range footer. Recommended: Clear does not close the panel; it empties the selection in the panel and clears the shortcut mark at once; the Start and End fields only empty on Apply, and Cancel brings the previous period back, so nothing counts before Apply. Alternative: Clear empties the fields and closes at once (MUI X action bar). Until she answers, the code follows the recommendation. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-9",
      "question": "The month and year views: Figma draws the arrows in the three views, the year title of the month view as an nph-button with chevron-up and the twelve-year span of the year view as plain text, with no rule for what they do. Recommended, as a ladder: the month title opens the month view, the year title of the month view opens the year view, and the span of the year view stays text (Mantine Calendar levels); in the month view the arrows move one year (Previous year, Next year) and in the year view twelve years (Previous 12 years, Next 12 years); on opening, the year view shows the block of twelve years that starts at the decade of the shown year, as drawn (2020 to 2031 for 2026), and the arrows then move by whole blocks (no market source read; Ant Design and Mantine show a decade of ten); inside the 4 rows by 3 columns grid the arrow keys move one cell or one row, Home and End go to the start and the end of the row, Page Up and Page Down do what the header arrows do, Enter or Space chooses, and a disabled cell is skipped (MUI X YearCalendar); on opening a view, focus goes to the chosen item or, with none, to the item of the title, and to the nearest enabled item when that one is disabled (Mantine focusAfterLevelChange); the live region announces the year in the month view and the twelve-year span in the year view; a month or a year is disabled only when none of its days is allowed (MUI X YearCalendar, for the min and max); in the range, the view opens in place of the month whose title was chosen while the other month stays, and a month chosen through the title of the second month stays in the second position, the first becoming the month before (no market source read on these points). The year title icon would change from chevron-up to chevron-down, which needs a Figma preview, in light and dark. Until she answers, the code follows the recommendation and keeps the icon as drawn. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-10",
      "question": "The selection cycle of the range: Figma has no rule for a third pick, a one-day period or Apply with nothing or only the Start chosen (Apply is enabled in every open variant). Recommended: a third pick after Start and End starts over, the date becomes the new Start and the End is cleared (Mantine use-dates-state); Start and End on the same day is a valid one-day period (MUI X date-range-manager); Apply stays enabled, with nothing chosen it applies an empty period and with only the Start it applies that one day (no market source read on Apply; it follows the rule that nothing counts before Apply). Alternatives: Apply disabled until both dates exist, which needs a disabled Apply drawn in Figma; a one-day period not allowed, the Mantine default (allowSingleDateInRange off); a third pick that moves the active end instead of starting over, as MUI X does. Until she answers, the code follows the recommendation. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-90/figma-docs-accepted-2026-11-17.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-15.md and 2026-11-16.md, nph-date-picker: redesign with the corrections of the design owner (soft style, rounder corners, range mode with shortcuts and two months, solid icon on the calendar button hover, calendar icon color)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-17.md, nph-date-picker: green light (visual acceptance) and the 10 approval items approved as recommended: documentation accepted, calendar/day-radius, calendar/day-focus-radius, date-picker/panel-radius and date-picker/panel-offset straight to the core by decision, the floating layer radius semantic as a later foundation task, the scheduler day radius in a later adjustment task, today and the current month on color/primary-text in the owner grid, a date unavailable by rule focusable and never chosen, and the calendar button unchanged on field hover"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6673-62837",
    "date": "2026-11-17",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-date-picker documentation frame (6673:62837, page 1364:2) was accepted as the API and behavior specification of nph-date-picker, with the visual acceptance of the root (6662:55010). COMPONENT_SET nph-date-picker (6666:32), 78 variants; COMPONENT_SET of the nph-date-picker panel (6662:56378), 6 variants; the date grid nph-calendar (4015:28204) with its day (4015:28020). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-17"
}
```

# DSA-90 — nph-date-picker, a date field with a calendar

## Goal
The `nph-date-picker` in `src/components/nph-date-picker/`, with CSS, tests, stories and the spec `fichas/nph-date-picker.md`, in the contract accepted in Figma: a date field the person types in or fills from a calendar panel, in two modes, a single date (one field, one month; picking the day applies and closes) and a range (Start and End fields, shortcuts, two months and a footer with Apply). The task also builds the date grid `nph-calendar` (header, weekdays, days, month and year views), the owner piece that the nph-scheduler mini month will reuse.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-90/figma-docs-accepted-2026-11-17.md`. It carries the Figma documentation converted to text, with the 9 tokens, the anatomy part by part (with the token of each layer, day state by day state), the measured contrast, the default behavior, the combined states, the inherited decisions, the icon and image rules, the limits, what the date picker asks of each piece it uses and the 10 decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Field**: each date in its own nph-field (label, help, error), 320 wide (`layout/field-width`). The control row: an nph-input that stretches, then the calendar button, `date-picker/trigger-gap` apart, centered vertically. The `dd/mm/aaaa` hint is in the help text, linked by `aria-describedby`. The clear button is the end icon of the nph-input and shows only with a value. No input mask; the value is validated when the person leaves the field, and the error comes through the nph-field (`status/error-text`, border `status/error`).
- **Range trigger**: Start and End side by side, `date-picker/trigger-gap` apart, aligned at the top; a single calendar button, in the End field. The error stays only on the field with the problem.
- **Calendar button**: icon-only nph-button, secondary, ghost, as tall as the field, `calendar` icon in `color/muted-foreground` (light; solid on its own hover and when open), tooltip "Open calendar" as its name. Open: `aria-haspopup="dialog"` and `aria-expanded="true"` on the host, so it keeps the hover-active look (`fichas/nph-button.md`, open trigger). On field hover only the field border changes; the button stays without background and light (item 10).
- **Sizes**: `compact` 28, `default` 36 (the default), `large` 44 (touch). The compact field opens the default panel.
- **Panel**: a surface of its own (not an nph-popover: its widths stop at 400), `date-picker/panel-offset` below the field, aligned to the start of the trigger, flipping above with the same gap when there is no room, and shrinking with an inner scroll when neither fits. Background `color/popover`, outline `border/width` in `date-picker/panel-border`, corner `date-picker/panel-radius`, shadow `elevation/dropdown` in light and none in dark. The shell has no padding: the grid brings its own 16 (`space/container-padding`); do not add 16 twice.
- **Range panel**: body (shortcut column 192 wide, padding `date-picker/panel-padding`, seven nph-option of 36 with no gap; two months side by side, top aligned, no divider between them), then a divider edge to edge in `date-picker/divider` (an nph-separator, with `--nph-color-border` redefined in its scope, as `nph-popover.css` does for `popover/divider`), then the footer (padding `date-picker/panel-padding`): Clear secondary ghost at the start; Cancel secondary solid and Apply primary solid at the end, `date-picker/footer-gap` apart; buttons compact in the default panel and default in the large panel. On a narrow screen the range shows one month with the shortcuts on top (the `intervalo estreito` panel; when: decision D-7). How the two months move and which open: decision D-5. The period of each shortcut and Custom: decision D-6.
- **Grid `nph-calendar`**: padding `space/container-padding`, gap `space/inline`; header with Previous month and Next month (icon-only buttons with tooltips, `chevron-left` and `chevron-right`, solid on hover) and the month title, an nph-button secondary ghost with `chevron-down` that opens the month view (4 rows × 3 columns); in the month view the title is an nph-button with `chevron-up`, and in the year view it is plain text. The arrows are icon-only nph-button secondary ghost, square, in the size of the panel. What the arrows and the titles do in the month and year views, their names and the keyboard there: decision D-9; a weekday row starting on Sunday; five week rows of seven days as drawn (a six-week month: decision D-1), the days of the next and previous month shown. Day: 36 (default) or 44 (large); month and year cell 84 × 36, drawn on default only (decision D-2); both with corner `calendar/day-radius` and focus halo `calendar/day-focus-radius`; the day states and colors are in the evidence table (today and the current month on `color/primary-text`, number and outline, item 8; the range middle and the preview square, `radius/none`; the band runs straight across the turn of the week; no band on a day outside the month). Type: the number and the month and year label use `text/body-md` (`text/label-md` where the evidence says medium), the exact values bound in Figma; the weekday names: decision D-3.
- **Unavailable days** (item 9): outside the min or max, disabled (`state/disabled-opacity`) and skipped by focus; unavailable by rule, such as a holiday, faded number with no opacity on the cell, focusable with `aria-disabled="true"`, Enter does not choose it, and its focus shows the focus border and halo (the `desabilitado foco` day). With today outside the limit, the panel opens with focus on the nearest allowed day.
- **Keyboard and roles**: the default behavior table of the evidence (APG Date Picker Dialog, with the deviations it names). The grid is one Tab stop with arrows, Page Up and Page Down (Shift for the year), Home and End; Esc closes without change (with the month or year view open, the first Esc goes back to the days); click outside closes like Cancel; Tab inside the panel is not trapped and closes the panel after the last item, focus back to the calendar button (in the range, the End button), discarding what was not applied, as Cancel. The shortcut list is one Tab stop with ↑ and ↓; a shortcut fills the band and waits for Apply. Single date: picking a day applies and closes. Range: first pick the start, then the end (a third pick, one day and Apply with only the Start: decision D-10); the end before the start reorders; the period counts only on Apply; Clear empties the period (when the fields empty: decision D-8). A typed date outside the limits, unavailable, or an End before the Start: decision D-4. The month name and the chosen period are announced by a live region apart from the title button (`aria-live="polite"`); the day label says today, chosen or unavailable.
- **Combined states (T11)**: error + disabled, disabled wins; a chosen and disabled shortcut keeps its fill and marker under the opacity. A chosen day cannot be disabled.
- **Motion**: the panel enters with opacity and a 4 px slide (`motion/enter-*`) and leaves with `motion/exit-*`; with reduced motion, opacity only (DSA-29 D2).
- **Images**: none.

## Decisions open with the design owner
The reviews of 17-11 found these questions with no drawing or rule in Figma. Each one has a recommendation from market research with sources and says what the code does until she answers (last column): the recommendation, or the accepted drawing where the recommendation would change it (D-2, D-5 and the year title icon of D-9); D-1 draws six rows, the only interim that shows every day. None blocks the pull request. The ones marked preview need a Figma preview, in light and dark, before she decides.

| ID | Question | Recommended | Preview | Until she answers, the code |
|---|---|---|---|---|
| D-1 | A month that spans six weeks | Always six rows | yes | Six rows: the five drawn rows cannot hold a six-week month |
| D-2 | Month and year views on large; panel height; where picking a year or a month goes | Cells grow on large; the panel keeps the day view height; year → months, month → days | yes | The accepted drawing; year → months, month → days |
| D-3 | Text role of the weekday names | `text/label-sm` | no | `text/label-sm` |
| D-4 | Typed date outside the limit, unavailable, or End before Start | An error that says what to fix, citing the limit; no reorder of typed values | no | The recommendation |
| D-5 | How the two months of the range move and which months open | Together and consecutive, arrows only on the outer edges; the Start month on the left | yes | The accepted drawing (both arrows on each month); months and focus as recommended |
| D-6 | Period of each shortcut and what Custom does | Last N days include today; This month is the whole month; a manual pick marks Custom | no | The recommendation |
| D-7 | When the range switches to one month | When the available width does not fit the panel | no | The recommendation |
| D-8 | What Clear does | It empties the panel selection and stays open; the fields empty on Apply | no | The recommendation |
| D-9 | What the arrows, the titles and the keys do in the month and year views | A ladder: month title → months → years; arrows by one year and by twelve years; focus on the chosen item | yes (year title icon) | The recommendation, with the year title icon as drawn |
| D-10 | A third pick, a one-day period and Apply with nothing or only the Start | A third pick starts over; one day is valid; Apply stays enabled | no | The recommendation |

Sources: https://raw.githubusercontent.com/react-component/picker/master/src/PickerPanel/DatePanel/index.tsx ; https://mui.com/x/api/date-pickers/date-calendar/ ; https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/dates/src/components/Calendar/Calendar.tsx ; https://raw.githubusercontent.com/react-component/picker/master/src/PickerPanel/index.tsx ; https://react-spectrum.adobe.com/react-spectrum/DateRangePicker.html ; https://design-system.service.gov.uk/components/date-input/ ; https://mui.com/x/react-date-pickers/validation/ ; https://react-aria.adobe.com/DateRangePicker ; https://ant.design/components/date-picker ; https://mantine.dev/dates/date-picker/ ; https://mui.com/x/react-date-pickers/shortcuts/ ; https://mui.com/x/react-date-pickers/custom-components/ ; https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/dates/src/hooks/use-dates-state/use-dates-state.ts ; https://raw.githubusercontent.com/mui/mui-x/master/packages/x-date-pickers-pro/src/internals/utils/date-range-manager.ts ; https://raw.githubusercontent.com/mui/mui-x/master/packages/x-date-pickers/src/YearCalendar/YearCalendar.tsx

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- The value format of the properties (the value, the min and the max, the range start and end), how the product sets Monday as the first day of the week (DSA-77, decision 8: Sunday by default, Monday available), how the product marks a date unavailable by rule (a list, a function or an event), and the events for a chosen date and an applied period. The spec names them.
- How the nph-field names the date text when its slot holds the control row (nph-input and calendar button) instead of one control: the field writes the name and the description on the nph-input, and the calendar button keeps its own name. The spec names the path.
- The shortcut list: the spec of nph-option says it is written only as a child of the list that owns it, such as nph-select. Here the owner is the date picker shortcut list (`role="listbox"`); the spec names whether the date picker hosts nph-option directly or through a list element. How the product passes its own shortcuts, if it can, is named there too.
- Whether `nph-calendar` is its own exported element (so the scheduler can reuse it) or an inner part of `nph-date-picker`. The spec names it.
- The translation strings: weekday and month names, the month title format, "Open calendar", "Previous month", "Next month", the seven shortcut labels, "Clear", "Cancel", "Apply", the arrow names of the month and year views (decision D-9), the error messages of decision D-4 and who writes them (default strings of the date picker or the product), the day labels (today, chosen, unavailable) and the live region text of the period (for example "9 to 20 May 2026"). The display format of the date (`dd/mm/aaaa` in Portuguese) comes from the locale. The spec names them.
- The focus border of Apply in dark (the primary nph-button) is fixed in the owner piece, apart (DSA-77, decision 10); Apply inherits it.

## Why it is ready
The 9 tokens (`calendar/*` and `date-picker/*`) came with this task and are on `v/5.0.0`: 5 aliases of semantics and 4 straight to the core by decision (`calendar/day-radius` `core/radius/450`, `calendar/day-focus-radius` `core/radius/600`, `date-picker/panel-radius` `core/radius/600`, `date-picker/panel-offset` `core/space/100`: no semantic of the same value has the function; the evidence says why for each). No new semantic or primitive. Every piece it uses is done: `nph-icon` (DSA-03), `nph-separator` (DSA-10), `nph-button` (DSA-13, icon only DSA-47, ghost hover DSA-60, secondary solid DSA-64), `nph-input` (DSA-16, compact DSA-59), `nph-field` (DSA-28), `nph-select` and `nph-option` (DSA-29), `nph-tooltip` (DSA-42, DSA-48), `nph-popover` (DSA-67, the shell and the footer it follows), `nph-scheduler` (DSA-77, which leaves the date grid to this task).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the nph-scheduler: replacing the scheduler date grid with `nph-calendar` (DSA-77 D-1), its day radius from 6 to 10 px and its day focus (item 7) are an adjustment task of the scheduler, after this one. It does not create the radius semantic for floating layers: that is a foundation task (item 6). It does not build a month only, year only, week, quarter or time picker.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1364:2`, documentation frame `6673:62837`, root `6662:55010`, appendix `6680:32` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-date-picker `6666:32`; nph-date-picker panel `6662:56378`; grid `4015:28204`, day `4015:28020`
- WAI-ARIA APG, Date Picker Dialog example: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
- WAI-ARIA APG, Listbox: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- React Aria, RangeCalendar: https://react-aria.adobe.com/RangeCalendar
- MUI X, Date Range Picker: https://mui.com/x/react-date-pickers/date-range-picker/
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-field.md`, `fichas/nph-input.md`, `fichas/nph-button.md`, `fichas/nph-option.md`, `fichas/nph-select.md`, `fichas/nph-separator.md`, `fichas/nph-popover.md`, `fichas/nph-tooltip.md`, `fichas/nph-scheduler.md`
