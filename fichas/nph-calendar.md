---
piece: nph-calendar
level: component
status: active
solves: >-
  Draws the days of a month, or of two consecutive months, with a header, the weekdays and the month
  and year views, so the person picks one date or one period. It is the owner piece of the date grid.
use_when:
  - "As the date grid of nph-date-picker, which opens it in its panel: single for one date, range with two months for a period."
  - "As the date grid of another piece, such as the mini month of nph-scheduler, once an adjustment task of that piece replaces its own grid (DSA-77 D-1)."
  - "On its own in the page, when the person picks a day or a period in a grid that stays visible and there is no text field to type in: the piece fires nph-pick and takes no part in a form."
  - "Choose range with months 2 for a period and single with months 1 for one date."
  - "Choose size large on a touch screen."
  - "Set min and max when days outside a window are not allowed, and unavailable for days that are not available by a rule, such as a holiday."
do_not_use_when:
  - "For a date field the person types in, in a form: use nph-date-picker, which composes this grid with the field, the panel and the form."
  - "To choose only a month, only a year, a week, a quarter or a time: those types are outside the component."
  - "For events laid over days: use nph-scheduler."
  - "For a form value, a name or validation: the grid is not form-associated; use nph-date-picker."
  - "Two grids with two single dates for the start and the end of a period: use range, which applies both dates together."
api:
  mode:
    type: enum
    values: [single, range]
    required: false
    default: single
    reflects: true
    constraint: >-
      The Figma `modo`: `data única` is single, `intervalo` is range. Single chooses one date in
      value; range chooses a period in start and end. Reflects so a selector or the layout of the
      consumer can read the mode from the host. A value outside the list draws nothing and emits
      console.error in development.
  size:
    type: enum
    values: [default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma `tamanho`. The day, the weekday cell and the arrows are control/height-default (36)
      on default and control/height-large (44) on large, for a touch screen. The header is 40 on default
      and control/height-large (44) on large, the height of its arrows. The month and year cell is as high
      as the day and a third of the week row wide, and the view keeps the height of the day view (D-2).
      Reflects because the internal CSS selects the measures by it.
      A value outside the list draws nothing and emits console.error in development.
  months:
    type: number
    values: [1, 2]
    required: false
    default: 1
    reflects: true
    constraint: >-
      How many consecutive months are drawn side by side: 1, or 2 for the period of a range. The two
      months move together, one month per click, and stay consecutive; Previous month is only on the first
      and Next month only on the last, and the other keeps its space, hidden (D-5). The month and year views
      draw one column per month, so both switch together (D-9). The piece does not tie it to mode; the date
      picker uses 2 only in range, on a screen wide enough. Reflects because the layout of the consumer
      reads how many grids it holds. A value outside the list draws nothing and emits console.error in
      development.
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Single mode: the chosen date, written YYYY-MM-DD. An instant that starts with a date is read as
      its day. The piece writes it when the person picks; setting it from code fires no event. Range
      ignores it. A text that is not a date that exists draws nothing and emits console.error in
      development.
  start:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Range mode: the first day of the period, written YYYY-MM-DD. The piece writes it when the person
      picks, and the pick cycle decides which pick writes it (D-10). Setting it from code fires no event.
      Single ignores it. An invalid date draws nothing and emits console.error in development.
  end:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Range mode: the last day of the period, written YYYY-MM-DD. Empty while only the start is chosen.
      The same day as the start is a valid period of one day. Setting it from code fires no event.
      Single ignores it. An invalid date draws nothing and emits console.error in development.
  min:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The first day that can be chosen, written YYYY-MM-DD. A day before it is disabled under
      state/disabled-opacity and the focus skips it. The arrow that leads to a month with no allowed
      day is disabled, and a month or a year is disabled only when none of its days is allowed. With
      today outside the limit, the focus opens on the nearest allowed day.
  max:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The last day that can be chosen, written YYYY-MM-DD. The same rules as min, on the other side.
  month:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The first month shown, written YYYY-MM or as any day of it. Empty, the grid follows the date. With
      one month, the month of the chosen date, else today. With two months, the month of the start on the
      left; with only the end, the month of the end on the right and the month before on the left; with
      nothing, the current month on the left (D-5, D-11). The piece writes it back as the first day of the
      month, YYYY-MM-DD, when the person changes the months, and fires nph-month-change; setting it from
      code fires nothing. Setting it back to empty makes the grid follow the date again. A text that is
      not a month draws nothing and emits console.error in development.
  week-start:
    type: enum
    values: [sunday, monday]
    required: false
    default: sunday
    reflects: false
    constraint: >-
      The property is weekStart. The first column of the week, and where Home and End go. Sunday is the
      default and Monday is available (DSA-77 decision 8). A value outside the list draws nothing and
      emits console.error in development.
  now:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The date of today, written YYYY-MM-DD, for tests and stories. Absent, the clock of the machine.
      An invalid date draws nothing and emits console.error in development.
  unavailable:
    type: "array or function"
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. A date unavailable by rule, such as a holiday: a list of YYYY-MM-DD, or a function
      that gets one date and says whether it is unavailable. The day fades its number with no opacity
      on the cell, takes focus, carries aria-disabled true and is never chosen. A function that throws
      counts as available. A day outside min and max is disabled, not unavailable.
  allows-non-contiguous-ranges:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The property is allowsNonContiguousRanges, as in React Stately. Off by default: a period does not
      cross a day unavailable by rule (D-10). While only the Start is chosen, a day past the first
      unavailable day after it, or before the first one before it, cannot be the End: it is disabled, the
      focus skips it, and a pick refuses it. The window is not a limit: the arrows of the months and the
      month and year cells ignore it. On, a period may hold unavailable days. Single ignores it. A period
      that is already complete, one typed, and a shortcut are not checked.
  labels:
    type: object
    required: true
    default: "empty object"
    reflects: false
    constraint: >-
      Property only. Every text the piece writes, already localized, as one object with the keys listed
      below as labels.<key>. The piece writes no word of its own. The names of the months and of the
      weekdays are not labels: they come from Intl, in the language of the nearest lang, crossing shadow
      roots, with en when there is none. A missing label renders anyway and emits console.error in
      development, once, saying which keys are missing.
  labels.previousMonth:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the Previous month arrow in the day view.
  labels.nextMonth:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the Next month arrow in the day view.
  labels.previousYear:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the previous arrow in the month view, which moves one year.
  labels.nextYear:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the next arrow in the month view, which moves one year.
  labels.previousYears:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the previous arrow in the year view, which moves twelve years.
  labels.nextYears:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the next arrow in the year view, which moves twelve years.
  labels.today:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word added to the accessible name of today, such as today.
  labels.selected:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word added to the accessible name of the chosen day, and of every day of the chosen period,
      such as selected.
  labels.unavailable:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word added to the accessible name of a day unavailable by rule, such as unavailable.
  focusDate:
    type: method
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      focusDate(date) puts the focus on a day and shows its month first. date is written YYYY-MM-DD
      and is optional; absent, or not a date, it is the default day: the chosen date (the start, else
      the end), else today. A day outside min and max goes to the nearest allowed day. It goes back to
      the day view when the month or the year view is open. It is for the panel that holds the grid;
      showing a month by it fires nph-month-change.
  nph-pick:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person picks a day, by click, Enter or Space, with detail { date, start, end }.
      date is the day picked. In single, start is the chosen date and end is empty. In range, start and
      end are the period after the pick, with end empty while only the start is chosen. The piece has
      already written value, or start and end. It bubbles and is composed. It never fires for a day
      outside min and max or for a day unavailable by rule, and never when code sets the properties.
  nph-month-change:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person changes the first month shown, with detail { month }, the first day of that
      month, YYYY-MM-DD. The arrows, Page Up and Page Down, an arrow key that crosses past the months
      shown and picking a month in the month view fire it. It bubbles and is composed. It never fires
      when code sets month.
variants:
  mode:
    axis: behavior
    choose_when: "single for one date, a due date or a schedule date; range for a period whose start and end go together."
    do_not_combine_with: ["a mode outside the list"]
  size:
    axis: size
    choose_when: "default in general use; large on a touch screen, where the day, the weekday cell and the arrows are 44."
    do_not_combine_with: ["a size outside the list", "compact: the date picker field has it, the grid does not"]
  months:
    axis: content
    choose_when: "1 for one date and for a range on a narrow screen; 2 for a range on a screen wide enough, the two months side by side."
    do_not_combine_with: ["a number of months outside 1 and 2"]
  week-start:
    axis: behavior
    choose_when: "sunday by default; monday when the product starts the week there."
    do_not_combine_with: ["a value outside the list"]
states:
  day-default:
    token: "color/foreground"
    changes_for_user: "The number of a day of the month, no background."
  day-hover:
    token: "color/accent, color/accent-foreground"
    changes_for_user: "The day takes the accent background under the pointer; the hover does not move the focus."
  day-focus:
    token: "focus/border, focus/halo, focus/ring-width, calendar/day-focus-radius, border/width"
    changes_for_user: "A border of border/width in focus/border inside the cell and a halo of focus/ring-width in focus/halo outside it, at the focus radius."
  day-disabled:
    token: "state/disabled-opacity, color/muted-foreground"
    changes_for_user: "A day outside min or max fades, accepts no choice and the focus skips it. While only the Start of a period is chosen, a day that cannot be the End, past an unavailable day, fades the same way (D-10)."
  day-unavailable:
    token: "color/muted-foreground, focus/border, focus/halo"
    changes_for_user: "A date unavailable by rule fades only its number, with no opacity on the cell. It takes the keyboard focus, with the focus border and halo, and Enter does not choose it."
  day-outside-month:
    token: "color/muted-foreground"
    changes_for_user: "A day of the previous or next month shows, with its number muted, and picking it chooses that date (D-11)."
  day-today:
    token: "color/primary-text, border/width, text/label-md"
    changes_for_user: "A 1 px outline and the number in color/primary-text, in medium weight."
  day-selected:
    token: "color/primary, color/primary-foreground, text/label-md"
    changes_for_user: "The chosen day, or the start or the end of the period, takes the primary fill with the number in medium weight; the fill wins over the outline of today."
  day-selected-focus:
    token: "color/primary, color/primary-foreground, focus/ring-width, focus/halo"
    changes_for_user: "The ring inside the cell is color/primary-foreground over the fill, and the halo marks the focus."
  range-band:
    token: "color/primary-surface"
    changes_for_user: "A band behind the start and the end joins the middle of the period, straight across the turn of the week; a day outside the month has no band behind it."
  range-middle:
    token: "color/primary-surface, color/primary-on-surface, radius/none"
    changes_for_user: "A day between the start and the end is square, in the surface fill; today in it keeps the outline and the medium number, and a middle day outside the month keeps the fill with the number in color/muted-foreground."
  range-preview:
    token: "color/accent, color/foreground, radius/none"
    changes_for_user: "With the start chosen and no end, the pointer or the arrow keys on a day draw a square band in the accent fill from the start to that day, in either direction. There is no preview on touch."
  view-cell:
    token: "color/foreground, color/accent, color/accent-foreground, color/primary, color/primary-foreground, color/primary-text, focus/border, focus/halo, calendar/day-radius, calendar/day-focus-radius"
    changes_for_user: "The month or year cell follows the day: hover in the accent fill, the current month or year with the outline and the number in color/primary-text, the chosen one in the primary fill, and the focus border and halo."
  view-cell-disabled:
    token: "state/disabled-opacity, color/muted-foreground"
    changes_for_user: "A month or a year with no allowed day fades, accepts no choice and the focus skips it."
business_rules:
  - "The piece owns the date grid: nph-date-picker uses it in its panel, and the mini month of nph-scheduler will use it when an adjustment task of the scheduler replaces its own grid (DSA-77 D-1). That replacement is not done with this piece."
  - "The piece is its own exported element, not an inner part of nph-date-picker. It is not form-associated: it writes value, or start and end, on itself and fires nph-pick."
  - "Dates are written YYYY-MM-DD. An instant that starts with a date is read as its day."
  - "Each grid is one Tab stop, in the order header, grid, header, grid. Inside a grid the arrows change the day, up and down move a week, Page Up and Page Down change the month and Shift with them the year, Home and End go to the start and the end of the week."
  - "A day outside min and max is disabled and skipped by the arrows; Home, End and the pages go to the nearest allowed day. A date unavailable by rule takes focus and cannot be chosen."
  - "The arrow keys cross the edge of a month, and in a range cross between the two grids, from the last day of the left month to the first day of the right month and back. A key that leaves the months shown moves them."
  - "Range pick cycle: the first pick is the start; with only the start, the next pick is the end, and an end before the start reorders so the earlier day becomes the start; the same day twice is a valid period of one day; a pick after a complete period starts over, the day becomes the new start and the end is emptied (D-10)."
  - "A period does not cross a day unavailable by rule unless allowsNonContiguousRanges is on (D-10). While only the start is chosen, the first unavailable day after it closes the days beyond on that side, and the first one before it closes the days before; a closed day is disabled, skipped by the arrows and refused by a pick. The window is looked for only as far as the months shown and the day asked about, so a function rule is called a bounded number of times. A complete period, a typed one and a shortcut are not checked."
  - "The month title opens the month view in place of the days; the year title of the month view, with chevron-down as the month title, opens the year view; the span of twelve years in the year view is plain text. Picking a year opens the months of that year, and picking a month opens the days of that month (D-2 and D-9)."
  - "In a range the title of either month switches both columns together: the month view shows two consecutive years and the year view two consecutive spans of twelve years, anchored on the first month shown. A month or a year chosen in either column comes back on the left, with the next on the right. The two columns are one sequence for the keys, as the two grids of days are, and one Tab stop (D-9)."
  - "In a range Previous month is only on the first month and Next month only on the last; the other arrow keeps its space and is hidden from sight, from the Tab order and from the accessibility tree. The arrows of the views follow the same rule and move one year, or twelve years, per click (D-5)."
  - "The month and year cell is as high as the day (control/height-default or control/height-large) and a third of the week row wide. The view keeps the height of the day view: the first row is one cell high and the other three are two, with the cell at the bottom, so the gap between rows is one cell and the arrows stay where they are when the view changes (D-2)."
  - "The header is 40 high on default and control/height-large (44) on large, the height of its arrows; the day view is 284 by 332 on default and 340 by 392 on large."
  - "Esc in the month or the year view goes back to the days, with the focus on the title, and takes the key: the second Esc is for the piece that holds the grid."
  - "Decided (D-1): a month always draws six week rows, filled with days of the previous and the next month, so the height does not jump."
  - "Decided (D-3): the weekday names use text/label-sm."
  - "Decided (D-5): the two months of a range move together and stay consecutive, one month per click; the month of the start opens on the left, the current month when empty, and the focus on the start day, or on today when empty."
  - "Decided (D-9): in the month view the arrows move one year and in the year view twelve years; the year view opens on the block of twelve years that starts at the decade of the shown year, and the arrows then move by whole blocks; the keys inside the 4 by 3 grid are the arrows, Home and End by row, and Page Up and Page Down as the arrows; on opening a view the focus goes to the chosen item, else to the item of the title, else to the nearest enabled item."
  - "Decided (D-11): picking a day outside the month chooses that date; in single the shown month moves to it, in range the two months stay. Each grid is one Tab stop, and with only the end filled the month of the end is on the right and the focus on the end day."
  - "Open (D-12): the default header is 40 high (control/height-default plus space/inline-tight) and the month and year cell is a third of the week row wide (7 of the default cell over 3): measures the evidence draws and no token holds. The large header and the cell height are control/height-large and the day, which have tokens."
  - "Decided (D-16, D-18): in the views of a range the first column is the year of the first month shown, the arrows are only on the outer edges and move one unit per click, and the 24 cells are one sequence for the keys; a day that cannot be the End looks like a day outside the limits, disabled at 0.5 opacity and out of focus."
  - "Every text comes from the consumer, already localized, except the names of the months and the weekdays, which come from Intl."
domain_errors:
  - "A mode, a size, a months or a week-start outside the lists draws nothing and emits console.error in development, one per cause while it lasts."
  - "A value, start, end, min, max or now that is not a date written YYYY-MM-DD, or a date that does not exist such as 2026-02-30, draws nothing and emits console.error in development."
  - "A month that is not YYYY-MM or a day draws nothing and emits console.error in development."
  - "A missing label renders anyway and emits console.error in development, once, saying which keys are missing."
tokens:
  day: "calendar/day-radius, control/height-default, control/height-large, text/body-md, text/label-md, color/foreground"
  day_focus: "calendar/day-focus-radius, focus/border, focus/halo, focus/ring-width, border/width"
  day_states: "color/accent, color/accent-foreground, color/muted-foreground, color/primary, color/primary-foreground, color/primary-surface, color/primary-on-surface, color/primary-text, radius/none, state/disabled-opacity"
  weekday: "text/label-sm, color/muted-foreground"
  header: "control/height-default, space/inline-tight, control/height-large, space/inline, calendar/title-foreground (color/foreground on the year range), color/secondary-foreground, text/label-md"
  grid: "space/container-padding, space/inline"
ai_hints:
  - "Use nph-calendar when a date or a period is picked in a grid; for a field the person types in and a panel that opens, use nph-date-picker, which already holds this grid."
  - "Give mode single with value for one date, or mode range with months 2, start and end for a period."
  - "Read the pick from nph-pick, with detail date, start and end, or read value, start and end from the host; setting them from code fires no event."
  - "Pass every text in labels, already localized: the arrows, the words today, selected and unavailable. The names of months and weekdays come from the lang of the page."
  - "Use min and max for days outside a window and unavailable for a holiday or a day closed by a rule; the first is skipped by the focus and the second takes it."
  - "Call focusDate when a panel opens around the grid, so the focus lands on the chosen date or on today."
  - "Do not replace the grid of nph-scheduler with it yet: that is a later adjustment task of the scheduler (DSA-77 D-1)."
accessibility:
  semantics: "Each month is a grid named by its month title: a table with role grid, the weekdays as column headers with the long name as abbr, each day a gridcell with aria-selected and a button inside. Today carries aria-current date. A day unavailable by rule carries aria-disabled true and a day outside min and max is a disabled button. The month and year views are grids of twelve buttons. The arrows and the titles are nph-button. A live region with role status and aria-live polite is apart from the title button."
  accessible_name: "A day: the long date in the language of the page, then the words today, selected and unavailable when they apply, each from labels. The arrows: the labels previousMonth, nextMonth, previousYear, nextYear, previousYears and nextYears, which are also their tooltip. The title button: its own text. A month cell: the long month with the year; a year cell: the year."
  keyboard:
    - "Tab reaches the arrows, the title and then the grid; the grid is one Tab stop, the day that holds the roving focus."
    - "Left and Right change the day, reversed in right-to-left writing; Up and Down go to the same weekday in the previous or next week."
    - "Page Up and Page Down go to the previous or next month, on the same day or on the last day of the month; with Shift, the same month in the previous or next year."
    - "Home and End go to the first and the last day of the week, by week-start."
    - "Enter and Space on a day pick it; they do nothing on a day unavailable by rule."
    - "In the month and year views the arrows move one cell or one row, Home and End go to the start and the end of the row, Page Up and Page Down do what the header arrows do, and Enter or Space chooses. A disabled cell is skipped."
    - "Esc in the month or the year view goes back to the days; with the days shown, Esc is not taken."
  focus: "Each day shows a border in focus/border and a halo in focus/halo; a chosen day takes the ring in color/primary-foreground. The focus lands on the chosen date or today, on the nearest allowed day when that one is outside the limit, and on opening a view on the chosen item. Hover paints a day and never moves the focus."
  contrast: "The day number in color/foreground over the surface passes 4.5:1 in both themes. The weekday names and a day outside the month in color/muted-foreground measure 6.69:1 and 6.61:1. The chosen day, the start and the end measure 5.37:1 and 7.05:1. The middle of a range measures 4.78:1 and 13.79:1. The outline and the number of today and of the current month in color/primary-text measure 8.11:1 and 6.05:1 on the default brand, and at least 5.98:1 in dark in every brand. The focus border carries the 3:1."
  color_alternative: "Today has an outline; the chosen day, the start and the end have a fill; the middle of a range has a band; a day unavailable by rule says unavailable in its name; a disabled day fades and takes no choice."
invalid_combinations:
  - "A mode, a size, a months or a week-start outside the lists — the grid draws nothing."
  - "A date that is not written YYYY-MM-DD, or that does not exist — the grid draws nothing."
  - "A month that is not YYYY-MM or a day — the grid draws nothing."
  - "Labels missing — the grid renders without those texts and says which keys."
  - "Wrapping the grid in a form to read it as a field: it is not form-associated; use nph-date-picker."
relations:
  combines_with: [nph-button, nph-tooltip, nph-date-picker, nph-scheduler]
  parents: ["the panel of nph-date-picker", "a page, next to or inside a surface the screen draws"]
  children: [nph-button, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using it as the date field of a form instead of nph-date-picker."
  - "Using it to choose only a month, only a year, a week, a quarter or a time."
  - "Passing a color, a radius or a size of day: everything comes from a token."
  - "Replacing the grid of nph-scheduler with it before the adjustment task of the scheduler."
  - "Writing the labels without translating them, or leaving the arrows without a name."
  - "Marking a holiday with min and max: a day outside them is skipped by the focus; use unavailable."
sources:
  design_md: "design.md, the calendar/* tokens, color/foreground, color/muted-foreground, color/accent, color/accent-foreground, color/primary, color/primary-foreground, color/primary-surface, color/primary-on-surface, color/primary-text, focus/*, state/disabled-opacity, control/height-*, space/container-padding, space/inline, text/body-md, text/label-md and text/label-sm"
  decision: "P133 — nph-date-picker and nph-calendar: API and semantics"
  tests: "src/components/nph-calendar/nph-calendar.test.ts and nph-calendar.logic.test.ts"
  usage_evidence: "the panel of nph-date-picker uses it; no other screen consumes it yet"
  storybook: "src/components/nph-calendar/nph-calendar.stories.ts and nph-calendar.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, documentation frame 6673:62837, root 6662:55010, sets 6666:32 and 6662:56378, grid 4015:28204 and day 4015:28020"
---

# nph-calendar

## Function

**The problem it solves:** draws the days of a month, or of two consecutive months, with a header,
the weekdays and the month and year views, so the person picks one date or one period. It is the owner
piece of the date grid, and its own element: `nph-date-picker` opens it in its panel, and the mini
month of `nph-scheduler` will use it once an adjustment task of the scheduler replaces its own grid
(DSA-77 D-1; that replacement is not done here).

**When to use:**

- As the date grid of `nph-date-picker`, in its panel: `single` for one date, `range` with two months
  for a period.
- As the date grid of another piece, such as the mini month of `nph-scheduler`, once its adjustment
  task replaces the grid it has.
- On its own in the page, when the person picks a day or a period in a grid that stays visible and
  there is no text field to type in: the piece fires `nph-pick` and takes no part in a form.
- Choose `range` with `months` 2 for a period and `single` with `months` 1 for one date.
- Choose `size` `large` on a touch screen.
- Set `min` and `max` when days outside a window are not allowed, and `unavailable` for days that are
  not available by a rule, such as a holiday.

**When NOT to use:**

- **For a date field the person types in, in a form** — use `nph-date-picker`, which composes this
  grid with the field, the panel and the form.
- **To choose only a month, only a year, a week, a quarter or a time** — those types are outside the
  component.
- **For events laid over days** — use `nph-scheduler`.
- **For a form value, a name or validation** — the grid is not form-associated; use `nph-date-picker`.
- **Two grids with two single dates for the start and the end of a period** — use `range`, which applies
  both dates together.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Mode | `single`, `range` | `single` for one date; `range` for a period whose start and end go together |
| Size | `default`, `large` | `default` in general use; `large` on a touch screen |
| Months | `1`, `2` | `1` for one date and for a range on a narrow screen; `2` for a range on a screen wide enough |
| Week start | `sunday`, `monday` | `sunday` by default; `monday` when the product starts the week there |

The mode is the Figma property `modo`, with `data única` and `intervalo`; the size is `tamanho`, with
`default` and `large`. The day has its own states in Figma, listed in the table of States, and the
`estado` value `desabilitado foco` is the day unavailable by rule.

**By size and density:** `default` is a day of `control/height-default` and `large` of
`control/height-large`. The header is 40 on `default` and `control/height-large` (44) on `large`, the
height of its arrows. The month and year cell is as high as the day, on both sizes (D-2). Density is
`not_applicable`.

**Do not combine with:** a mode, a size, a months or a week-start outside the lists; `compact`, which
the date picker field has and the grid does not.

## States

The day, by part of the grid:

| State | Token | What changes for the person |
|---|---|---|
| Day, current month | `color/foreground` | The number, no background |
| Hover | `color/accent`, `color/accent-foreground` | The accent background under the pointer; it does not move the focus |
| Focus | `focus/border`, `focus/halo`, `focus/ring-width`, `calendar/day-focus-radius`, `border/width` | A border inside the cell and a halo outside it |
| Disabled (outside `min` or `max`, or closed by the window of the End) | `state/disabled-opacity`, `color/muted-foreground` | The whole day fades; no choice; the focus skips it |
| Unavailable by rule | `color/muted-foreground`, `focus/border`, `focus/halo` | Only the number fades; no opacity on the cell; it takes focus and cannot be chosen |
| Outside the month | `color/muted-foreground` | The number is muted; the day keeps hover, disabled and pick (D-11) |
| Today | `color/primary-text`, `border/width`, `text/label-md` | A 1 px outline and the number in `color/primary-text`, medium |
| Today and focus | `focus/border`, `focus/halo`, `color/primary-text` | The focus border and halo, the number kept |
| Selected | `color/primary`, `color/primary-foreground`, `text/label-md` | The primary fill, the number in medium; the fill wins over the outline of today |
| Selected and focus | `color/primary`, `color/primary-foreground`, `focus/ring-width`, `focus/halo` | The inside ring in `color/primary-foreground`, and the halo |
| Range start and end | `color/primary`, `color/primary-foreground`, `color/primary-surface` | The primary fill; behind the cell, a band that joins the middle |
| Range middle | `color/primary-surface`, `color/primary-on-surface`, `radius/none` | Square, in the surface fill |
| Range middle and today | `color/primary-surface`, `color/primary-on-surface`, `color/primary-text`, `radius/none` | Square, the fill kept, the outline of today and the medium number |
| Range middle, outside the month | `color/primary-surface`, `color/muted-foreground`, `radius/none` | The fill is kept and the number is muted |
| Preview | `color/accent`, `color/foreground`, `radius/none` | A square band from the start to the pointer or to the day on the arrows |

The month and year cell follows the day: default in `color/foreground`; hover in `color/accent` with
`color/accent-foreground`; the current month or year with the outline and the number in
`color/primary-text`, medium; chosen in `color/primary` with `color/primary-foreground`; the focus
border, halo and ring as the day; disabled under `state/disabled-opacity` with the label in
`color/muted-foreground`. The corner of the day and of the cell is `calendar/day-radius`, and of the
halo `calendar/day-focus-radius`; the middle of a range and the preview are square.

**The range bands and the preview.** The band behind the start and the end and the fill of the middle
run straight across the turn of the week, with no rounding. A day outside the month has no band behind
it, and a middle day outside the month keeps the fill. A band shows only when the period has an end after
its start; a period of one day has none. The preview shows while the start is chosen and the end is not:
the pointer or the arrow keys on a day draw the band from the start to that day, in either direction,
the start excluded. There is no preview on touch.

**Limits and the day unavailable by rule.** Outside `min` or `max` the day is disabled and the focus
skips it; the arrow whose month has no allowed day is disabled and has no tooltip. With today outside the
limit, the grid opens with the focus on the nearest allowed day. A date unavailable by rule, which comes
from `unavailable`, takes the keyboard focus with `aria-disabled` true and Enter does not choose it; a
day that is both outside the limits and unavailable is disabled.

**A period across an unavailable day (D-10).** `allowsNonContiguousRanges` is off by default. With only
the start chosen, the days past the first unavailable day after it, and before the first one before it,
are disabled like a day outside the limits, so the end can only be a day the period reaches without
crossing an unavailable one. The window is kept apart from `min` and `max`: the arrows of the months and
the month and year cells ignore it. On, nothing is closed. A complete period, a typed one and a shortcut
are not checked.

**The month and year views.** The month title is an `nph-button` with `chevron-down` that opens the
month view in place of the days: a header with the arrows and the year as the title, an `nph-button`
with `chevron-down` too, over a grid of 4 rows by 3 columns. The year title opens the year view: the
arrows and a span of twelve years as plain text, over the same grid. The ladder is the D-9 rule. Each cell
is as high as the day and a third of the week row wide, and the view has the height of the day view, with
the four rows spread over it (the gap between rows is one cell), so the panel does not change its height
and the arrows stay in place when the view changes, on both sizes (D-2). With two months the title of
either one switches both columns together, to two consecutive years or to two consecutive spans of twelve
years (D-9).

**The arrows of a range (D-5).** With two months, Previous month is only on the first month and Next month
only on the last. The other arrow keeps its space, so each title stays centered on its grid, and is hidden
with `visibility`, which takes it out of sight, of the Tab order and of the accessibility tree. The two
months still move together, one month per click.

**Feedback and focus:** a pick writes `value`, or `start` and `end`, and fires `nph-pick`; a change of
months writes `month` and fires `nph-month-change`. Hover paints and never moves the focus. Esc in a view
goes back to the days.

**Business rule the piece carries:**

- The grid is the owner piece: `nph-date-picker` uses it and the scheduler will use it later (DSA-77
  D-1). It is its own exported element and is not form-associated.
- Dates are written `YYYY-MM-DD`; an instant that starts with a date is read as its day.
- Each grid is one Tab stop, in the order header, grid, header, grid. The arrows cross between the
  months and, in a range, between the two grids; a key that leaves the months shown moves them.
- The range pick cycle: the first pick is the start; the next is the end, and an end before the start
  reorders; the same day twice is a period of one day; a pick after a complete period starts over; and a
  period does not cross an unavailable day unless `allowsNonContiguousRanges` is on (D-10).
- Every text comes from the consumer, already localized; only the month and weekday names come from
  `Intl`.

**Decisions that touch the grid.** The design owner answered D-1 to D-11 on 2026-11-18, as recommended, and
Figma draws the answers (the evidence of DSA-96). What stays open is named in the task with its number:

| Decision | What the code does |
|---|---|
| D-1 | Always six week rows, filled with days of the previous and next month; the day view is 284 by 332 on default and 340 by 392 on large |
| D-2 | The month and year cells are as high as the day and a third of the week row wide; the view keeps the height of the day view, with the four rows spread over it; picking a year opens the months of that year, and picking a month opens its days |
| D-3 | The weekday names use `text/label-sm` |
| D-5 | Previous month only on the first month of a range and Next month only on the last, the other keeping its space, hidden; the two months move together, one month per click, and stay consecutive; the start month opens on the left |
| D-9 | The ladder: month title to months, year title to years, both with `chevron-down`; arrows by one year and by twelve years; the year view opens on the block of twelve that starts at the decade of the shown year; focus on the chosen item; in a range both columns switch together |
| D-10 | A third pick starts over; one day is a valid period; an end picked before the start reorders; a period does not cross a day unavailable by rule unless `allowsNonContiguousRanges` is on |
| D-11 | A day outside the month can be picked; in single the shown month moves to it, in range the two months stay; one Tab stop per grid; the arrows cross between the grids |
| D-12 (open) | The default header is 40 and the month and year cell is a third of the week row wide: measures drawn in Figma that no token holds |
| D-16, D-18 | The views of a range anchor on the first month shown, with the arrows on the outer edges and one unit per click; a day that cannot be the end looks like a day outside the limits |

**Domain error states:** a mode, a size, a months, a week-start, a date or a month that does not exist
draws nothing and emits `console.error` in development, one per cause while it lasts. A missing label
renders anyway and says which keys.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Each month is a table with role `grid`, named by its month title; the weekdays are column headers with the long name as `abbr`; each day is a `gridcell` with `aria-selected` and a button inside. Today carries `aria-current` date. A day unavailable by rule carries `aria-disabled` true; a day outside `min` and `max` is a disabled button. The month and year views are grids of twelve buttons. A live region with role `status` and `aria-live` polite sits apart from the title button |
| Accessible name | A day: the long date in the language of the page, then `today`, `selected` and `unavailable` from `labels` when they apply. The arrows: their label, which is also the tooltip. The title: its own text. A month cell: the long month and year; a year cell: the year |
| Live region | In the day view it says the title of each month shown, joined by a comma; in the month view, the year of each column; in the year view, the span of twelve years of each column |
| Keyboard | Tab reaches the arrows, the title and the grid, which is one Tab stop. Left and Right change the day, reversed in right-to-left writing; Up and Down move a week. Page Up and Page Down change the month, with Shift the year. Home and End go to the first and last day of the week. Enter and Space pick a day, and do nothing on a day unavailable by rule. In a view the arrows move one cell or one row, Home and End go to the start and the end of the row, Page Up and Page Down act as the header arrows, Enter and Space choose, and a disabled cell is skipped. Esc in a view goes back to the days |
| Focus | A border in `focus/border` and a halo in `focus/halo`; a chosen day takes the ring in `color/primary-foreground`. It lands on the chosen date, else today, else the nearest allowed day; on opening a view, on the chosen item, else the item of the title, else the nearest enabled item |
| Contrast | The day number over the surface passes 4.5:1 in both themes. The weekday names and a day outside the month: 6.69:1 and 6.61:1. The chosen day, the start and the end: 5.37:1 and 7.05:1. The middle of a range: 4.78:1 and 13.79:1. Today and the current month in `color/primary-text`: 8.11:1 and 6.05:1 on the default brand, and at least 5.98:1 in dark in every brand. The focus border carries the 3:1 |
| Alternative to color | Today has an outline; the chosen day, the start and the end have a fill; the middle has a band; an unavailable day says so in its name; a disabled day fades and takes no choice |
| Touch target | The day and the arrows are 36 on `default` and 44 on `large`; the month and year cell is as high as the day and a third of the week row wide (84 by 36 on `default`, about 103 by 44 on `large`). All pass the 24 by 24 minimum |
| Known limits | (a) With no `min` or `max`, the year view offers blocks of twelve years without end, from the decade of the shown year. (b) The `unavailable` function runs for each day on each draw. (c) The grid is not form-associated and owns no name or validation. (d) The scheduler keeps its own grid until its adjustment task (DSA-77 D-1) |

## Relations

**Combines with:** `nph-button`, which draws the arrows and the titles; `nph-tooltip`, the name of the
arrows, through the label of the button; `nph-date-picker`, which opens the grid in its panel; and
`nph-scheduler`, which will use it for its mini month.

**What is the parent:** the panel of `nph-date-picker`, or a page or a surface the screen draws.

**What is the child:** `nph-button` for the arrows and the titles, with their tooltip. The days, the
weekdays and the cells of the views are the piece's own.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**Relation to `nph-scheduler`:** the scheduler keeps its own date grid. Replacing it with `nph-calendar`,
its day radius from 6 to 10 and its day focus are an adjustment task of the scheduler (DSA-77 D-1), not
part of this piece.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Day and cell corner | `calendar/day-radius` |
| Focus halo corner | `calendar/day-focus-radius` |
| Day size | `control/height-default`, `control/height-large` |
| Day and month label | `text/body-md`, `text/label-md` where the day is today or chosen |
| Weekday names | `text/label-sm`, `color/muted-foreground` (D-3) |
| Header | `control/height-default` plus `space/inline-tight` on default, `control/height-large` on large, `space/inline`, `color/secondary-foreground`, `calendar/title-foreground` on the year range, `text/label-md` |
| Grid | `space/container-padding`, `space/inline` |
| Day colors | `color/foreground`, `color/muted-foreground`, `color/accent`, `color/accent-foreground`, `color/primary`, `color/primary-foreground`, `color/primary-surface`, `color/primary-on-surface`, `color/primary-text`, `radius/none` |
| Focus | `focus/border`, `focus/halo`, `focus/ring-width`, `border/width` |
| Disabled | `state/disabled-opacity` |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything comes
from a token, with no `::part` and no color property. The grid binds semantics directly, with no color
token of its own. The weekday names use `text/label-sm` (D-3).

**AI hints:**

- Use `nph-calendar` when a date or a period is picked in a grid; for a field the person types in and a
  panel that opens, use `nph-date-picker`, which already holds this grid.
- Give `mode` `single` with `value` for one date, or `range` with `months` 2, `start` and `end` for a
  period.
- Read the pick from `nph-pick`, with `detail` `date`, `start` and `end`, or read `value`, `start` and
  `end` from the host; setting them from code fires no event.
- Pass every text in `labels`, already localized: the arrows and the words today, selected and
  unavailable. The names of months and weekdays come from the `lang` of the page.
- Use `min` and `max` for days outside a window and `unavailable` for a holiday or a day closed by a rule;
  the first is skipped by the focus and the second takes it.
- Turn `allowsNonContiguousRanges` on only when a period may hold a day closed by a rule, such as a
  vacation across a holiday; by default a period stops before it.
- Call `focusDate` when a panel opens around the grid, so the focus lands on the chosen date or on today.
- Do not replace the grid of `nph-scheduler` with it yet: that is a later adjustment task of the scheduler
  (DSA-77 D-1).

## Examples

**Recommended case:** the panel of a due date: `single`, `months` 1, `value` set, `min` as today, inside
`nph-date-picker`.

**Alternative case:** a period on a page: `range`, `months` 2, `start` and `end`, with `unavailable` as a
function that says a holiday, and `size` `large` on a touch screen.

## Anti-patterns

- **Do not use it as the date field of a form** — use `nph-date-picker`.
- **Do not use it to choose only a month, only a year, a week, a quarter or a time.**
- **Do not pass a color, a radius or a size of day** — everything comes from a token.
- **Do not replace the grid of `nph-scheduler` with it before the adjustment task of the scheduler.**
- **Do not leave the arrows without a name** — write the labels, already translated.
- **Do not mark a holiday with `min` and `max`** — a day outside them is skipped by the focus; use
  `unavailable`.
- **Invalid combinations:** a mode, a size, a months or a week-start outside the lists; a date that is not
  `YYYY-MM-DD` or does not exist; a month that is not `YYYY-MM`.
- **Do not create without a decision:** a month only, year only, week, quarter or time grid; a color
  property; a way to pass a day from code that fires `nph-pick`; a text from the piece itself.

## Sources and decisions

- **The repository `design.md`:** the `calendar/*` tokens, the colors and focus tokens the grid binds,
  `state/disabled-opacity`, `control/height-*`, `space/container-padding`, `space/inline` and the text
  roles `text/body-md`, `text/label-md` and `text/label-sm`.
- **The decision that originated it:** P133, `nph-date-picker` and `nph-calendar`: API and semantics.
- **Tests:** `src/components/nph-calendar/nph-calendar.test.ts` and `nph-calendar.logic.test.ts`.
- **Usage evidence:** the panel of `nph-date-picker` uses it; no other screen consumes it yet.
- **Storybook:** `src/components/nph-calendar/nph-calendar.stories.ts` and
  `nph-calendar.docs.stories.ts`.
- **Figma:** the documentation frame (`6673:62837`) and the root (`6662:55010`), the sets `6666:32` and
  `6662:56378`, the grid `4015:28204` and the day `4015:28020` in `DS-IA-NEPHOS 5.0`.
