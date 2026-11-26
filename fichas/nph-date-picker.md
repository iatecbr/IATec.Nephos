---
piece: nph-date-picker
level: component
status: active
solves: >-
  Gives the person a date field they type in or fill from a calendar panel, in two modes: one date, or a
  period with shortcuts and two months, and takes part in the form that contains it.
use_when:
  - "When a form asks for a date the person types or checks in the calendar: a due date, a schedule date, the issue date of a document."
  - "When a period whose start and end go together needs confirmation, such as a report period, a validity or a vacation: use the range mode, with Apply."
  - "For a date the person knows by heart and that is far from today, such as a birth date: the field accepts typing, and the calendar is only on the button."
  - "default on a common form; compact on a dense screen with a pointer; large on a touch screen, for every field of the form."
  - "Set min and max when dates outside a window are not allowed, and unavailable for dates closed by a rule, such as a holiday."
do_not_use_when:
  - "For two single date fields for the start and the end of a period: use the range mode, which applies both dates together."
  - "For compact on a touch screen: 28 is small for a finger; use large."
  - "For the calendar as the only way to a date the person knows by heart: the field must accept typing, and it does."
  - "To choose only a month, only a year, a week, a quarter or a time: those types are outside the component."
  - "For a date grid that stays on the page with no field and no panel: use nph-calendar."
  - "For events laid over days: use nph-scheduler."
api:
  mode:
    type: enum
    values: [single, range]
    required: false
    default: single
    reflects: true
    constraint: >-
      The Figma `modo`: `data única` is single, `intervalo` is range. Single is one field and one month,
      and picking a day applies and closes. Range is the Start and End fields, the shortcuts, two months and
      a footer with Apply. Reflects so a selector or the layout of the consumer can read the mode from the
      host. A value outside the list draws nothing and emits console.error in development.
  size:
    type: enum
    values: [compact, default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma `tamanho`. The height of the field and of the calendar button: compact 28, default 38 for the field
      (date-picker/height) and 36 for the calendar button, and large 44. The compact field opens the default panel; default opens the default panel and large opens
      the large panel, whose footer buttons are the default size. Reflects so a selector or the layout of the
      consumer can read the size from the host. A value outside the list draws nothing and emits console.error in
      development.
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Single mode: the date, written YYYY-MM-DD. The value attribute is the initial value and the value of
      form.reset(). The piece writes it when the person picks or types a date, and fires change; setting it
      from code fires no event. Range ignores it. A text that is not a date that exists draws nothing and
      emits console.error in development.
  start:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Range mode: the first day of the period, written YYYY-MM-DD. The start attribute is the initial value
      and the value of form.reset(). The period counts only on Apply, or when the person leaves a typed field
      with the panel closed (D-13). Setting it from code fires no event. Single ignores it. An invalid date
      draws nothing and emits console.error in development.
  end:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Range mode: the last day of the period, written YYYY-MM-DD. The end attribute is the initial value and
      the value of form.reset(). The same day as the start is a valid period of one day. Setting it from code
      fires no event. Single ignores it. An invalid date draws nothing and emits console.error in development.
  min:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The first date that can be chosen, written YYYY-MM-DD. In the panel a day before it is disabled and the
      focus skips it; a typed date before it is an error that cites the limit (D-4); a shortcut is cut by it.
  max:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The last date that can be chosen, written YYYY-MM-DD. The same rules as min, on the other side.
  unavailable:
    type: "array or function"
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. A date unavailable by rule, such as a holiday: a list of YYYY-MM-DD, or a function that
      gets one date and says whether it is unavailable. In the panel the day fades its number, takes focus
      and is never chosen; a typed date that is unavailable is an error (D-4). A function that throws counts
      as available.
  allows-non-contiguous-ranges:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The property is allowsNonContiguousRanges, as in React Stately. Range only. Off by default: a period
      picked in the panel does not cross a day unavailable by rule (D-10). While only the Start is chosen, the
      days past the first unavailable day after it, or before the first one before it, are disabled and cannot
      be the End. On, a period may hold unavailable days. It goes to the calendar of the panel. A typed period,
      which keeps the rule of today for typed dates, and a shortcut are not checked (D-15).
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      Single mode: the visible label of the nph-field, already localized, such as Due date. It is the accessible
      name of the text. Without it the field renders and emits console.error in development, as nph-field does.
  start-label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The property is startLabel. Range mode: the visible label of the Start field, such as Start.
  end-label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The property is endLabel. Range mode: the visible label of the End field, such as End.
  error:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Single mode: an error sentence the screen owns, such as one from the server, shown on the field when the
      piece has no message of its own for it. The message of the piece wins. Filling it makes the field invalid;
      it is written through nph-field, below the text, with no icon.
  start-error:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The property is startError. Range mode: the same as error, on the Start field only. The error stays only
      on the field that has the problem.
  end-error:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The property is endError. Range mode: the same as error, on the End field only.
  name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      Single mode: the name of the entry in the form data, whose value is YYYY-MM-DD. Reflects because the
      form reads the attribute of the host. With no date, the entry is left out.
  start-name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The property is startName. Range mode: the name of the entry of the start. Left out while the start is
      empty. Reflects because the form reads the attribute of the host.
  end-name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The property is endName. Range mode: the name of the entry of the end. Left out while the end is empty.
      Reflects because the form reads the attribute of the host.
  required:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Goes to every field: nph-field shows the required mark, and an empty field is an error with its own
      message once the person leaves it (D-4). In the form the piece is valueMissing while the date is empty,
      or, in range, while the start or the end is empty. Reflects because the form and the selectors of the
      consumer read the attribute of the host.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The fields and the calendar button fade under state/disabled-opacity and respond to nothing; the panel
      does not open and an open panel closes. It wins over the error: a disabled field shows no error.
      Reflects because the form and the selectors of the consumer read the attribute of the host.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The panel is open. The calendar button and the keyboard open and close it; the consumer may set it.
      Opening and closing fire no event. A disabled picker, or one not connected, does not open: it is set
      back to false. Reflects so the page can see which panel is open.
  week-start:
    type: enum
    values: [sunday, monday]
    required: false
    default: sunday
    reflects: false
    constraint: >-
      The property is weekStart. The first column of the week in the panel. Sunday is the default and Monday
      is available (DSA-77 decision 8). A value outside the list draws nothing and emits console.error in
      development.
  now:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The date of today, written YYYY-MM-DD, for tests and stories. It sets the shortcuts, the focus on opening
      and the mark of today. Absent, the clock of the machine. An invalid date draws nothing and emits
      console.error in development.
  labels:
    type: object
    required: true
    default: "empty object"
    reflects: false
    constraint: >-
      Property only. Every text the piece writes, already localized, as one object with the keys listed below
      as labels.<key>. It holds the keys of nph-calendar too, which the piece hands to the grid. The piece
      writes no word of its own. The names of the months and weekdays and the order of day, month and year
      come from Intl, in the language of the nearest lang, crossing shadow roots, with en when there is none.
      Placeholders are written between braces: min, max, start and end. With no key at all the piece
      draws nothing and emits console.error in development. A label missing from an object that has others renders
      anyway and emits console.error in development, once, saying which keys are missing.
  labels.previousMonth:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the Previous month arrow of the grid.
  labels.nextMonth:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the Next month arrow of the grid.
  labels.previousYear:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The name of the previous arrow in the month view, which moves one year.
  labels.nextYear:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The name of the next arrow in the month view, which moves one year.
  labels.previousYears:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The name of the previous arrow in the year view, which moves twelve years.
  labels.nextYears:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The name of the next arrow in the year view, which moves twelve years.
  labels.today:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word added to the name of today in the grid, such as today.
  labels.selected:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word added to the name of the chosen day, and of each day of the period, in the grid.
  labels.unavailable:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word added to the name of a day unavailable by rule in the grid.
  labels.hint:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The format hint, such as dd/mm/aaaa. It is the help line of each field, linked to the text by
      aria-describedby through nph-field, and the placeholder of an empty text. It is written by the product,
      not derived from the language, and is never a name.
  labels.openCalendar:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name and the tooltip of the calendar button, such as Open calendar.
  labels.clearDate:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the clear button of the text, the end icon of nph-input, which shows only with a
      value.
  labels.dialogDate:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the panel in single mode.
  labels.dialogPeriod:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the panel in range mode.
  labels.shortcuts:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the list of shortcuts.
  labels.shortcutToday:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the shortcut Today.
  labels.shortcutYesterday:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the shortcut Yesterday.
  labels.shortcutLast7Days:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the shortcut Last 7 days.
  labels.shortcutLast30Days:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the shortcut Last 30 days.
  labels.shortcutThisMonth:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the shortcut This month.
  labels.shortcutLastMonth:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the shortcut Last month.
  labels.shortcutCustom:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the shortcut Custom.
  labels.clear:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the Clear button of the range footer.
  labels.cancel:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the Cancel button of the range footer.
  labels.apply:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the Apply button of the range footer.
  labels.period:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The sentence a live region announces after a choice of a period, with the placeholders start and end
      written between braces, such as start to end. The two dates come in the long form of the language. A
      period of one day is announced as that date alone.
  labels.errorRequired:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of an empty single field that is required, such as Enter the date. It is also the message of
      the form when the piece is valueMissing.
  labels.errorRequiredStart:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of an empty Start field that is required.
  labels.errorRequiredEnd:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of an empty End field that is required.
  labels.errorInvalid:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of a typed text that is not a date that exists. It is also the message of the form when the
      piece is badInput, for any typed text the piece does not accept.
  labels.errorMin:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of a typed date before the min, when there is no max, with the placeholder min, which is the
      min written as the field writes a date, such as The date must be on or after min.
  labels.errorMax:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of a typed date after the max, when there is no min, with the placeholder max.
  labels.errorBetween:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of a typed date outside the limits when both min and max exist, with the placeholders min
      and max.
  labels.errorUnavailable:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of a typed date that is unavailable by rule.
  labels.errorEndBeforeStart:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The message of an End typed before the Start, and of a Start typed after the End (on the Start field), with the placeholder start, which is the Start written as
      the field writes a date.
  focus:
    type: method
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      focus(options) on the host puts the focus on the text of the first field, as a click on its label does.
  change:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      A plain event with no detail, fired by the host; it bubbles and is composed. Single: when the person picks
      a day, or leaves the text with a different date or an empty text. Range: on Apply with a different period,
      and when the person leaves the Start or End text with the panel closed and a different date. Read the value,
      start and end from the host. It never fires when code sets value, start, end or open, nor when the date is
      the one the host already holds. The input and change of the inner text, and the nph-pick and
      nph-month-change of the inner grid, never leave the piece.
variants:
  mode:
    axis: behavior
    choose_when: "single for one date, a due date or a schedule date; range for a period whose start and end go together and need confirmation."
    do_not_combine_with: ["two single date fields for the start and the end of a period"]
  size:
    axis: size
    choose_when: "default on a common form; compact on a dense screen with a pointer; large on a touch screen, for every field of the form."
    do_not_combine_with: ["compact on a touch screen", "fields of different sizes in the same form"]
  panel:
    axis: layout
    choose_when: "The panel follows the mode and the width: single is one month; range is the shortcuts and two months; on a narrow screen the range shows one month with the shortcuts on top."
    do_not_combine_with: ["a compact field to get a compact panel: it opens the default panel"]
states:
  default:
    token: "date-picker/border, date-picker/border-bottom, color/background"
    changes_for_user: "The resting field, by the nph-input, with its border split: top and sides in date-picker/border, bottom line in date-picker/border-bottom; with the label, the hint as help and the calendar button after the text."
  hover:
    token: "color/input-hover"
    changes_for_user: "On field hover only the field border changes; the calendar button stays without background and with the light icon."
  focus:
    token: "focus/border, focus/halo"
    changes_for_user: "Keyboard focus on the text, the clear button or the calendar button shows the focus border and the halo."
  focus-clear:
    token: "focus/border, focus/halo"
    changes_for_user: "The clear button takes the focus; it exists only with a value."
  error:
    token: "status/error, status/error-text"
    changes_for_user: "The border of the field is status/error and the message shows below it, in status/error-text, with no icon, only on the field that has the problem."
  disabled:
    token: "state/disabled-opacity"
    changes_for_user: "The field and the calendar button fade and do not open the panel; the error is hidden, so disabled wins over error."
  open:
    token: "icon-button/secondary-ghost-background-hover, date-picker/panel-border, date-picker/panel-radius, color/popover, elevation/dropdown"
    changes_for_user: "The calendar button keeps the hover-active look with the solid icon and aria-expanded true, and the panel shows below the field."
  closed:
    token: "none"
    changes_for_user: "Only the field shows."
  shortcut-active:
    token: "color/accent, color/accent-foreground"
    changes_for_user: "The shortcut on the arrows or under the pointer takes the hover look of nph-option."
  shortcut-selected:
    token: "color/primary-surface, color/primary"
    changes_for_user: "The marked shortcut takes the surface fill and the check marker, and keeps both under the opacity when it is also disabled."
business_rules:
  - "The piece is form-associated. Single writes name, with the date as YYYY-MM-DD, when there is a date; range writes start-name and end-name, each when its date exists. Required, a typed text that is not accepted and form.reset() work as in a native field."
  - "Validity: while a field carries a message the piece wrote for a typed text that is not accepted (not a date, outside the limit, unavailable or an inverted period), the host is badInput, with the text of errorInvalid; with none of those, it is valueMissing while required and the date, or the start or the end, is empty, with the text of errorRequired. form.reset() brings value, start and end back to their attributes and clears the errors."
  - "Each date has its own nph-field. The nph-field names and describes one control, so the control row is the internal element nph-date-picker-control, which holds the nph-input and the calendar button and hands the field contract to the input. The calendar button keeps its own name."
  - "No input mask. The text is checked when the person leaves it, and the message comes through nph-field. The hint is the help line and the placeholder."
  - "Typed date rules (D-4): the order of day, month and year comes from the language through Intl, with the slash as separator; day and month may have or lack a leading zero and the year has four digits; the text is written back as two digits for day and month and four for the year. One message at a time, in this order: empty, invalid, outside the limit, unavailable, end before start. Empty is an error only when required. A date with a problem is not committed and the value it replaces stays; a typed value is never reordered. Only a typed End is compared with the Start."
  - "Single: a typed date that passes is committed when the person leaves the field and fires change. With the panel open it is committed at once and the panel moves to the date."
  - "Range, panel open: a typed Start or End goes to the panel, moves the months to it and marks the shortcut; nothing counts before Apply."
  - "Open (D-13): a typed Start or End with the panel closed is committed when the person leaves the field, even when it leaves an incomplete period, and fires change."
  - "A click in the field is not a click outside: the panel stays open."
  - "The panel is a surface of its own, not an nph-popover, because its widths stop at 400. It lives in the top layer, opens date-picker/panel-offset below the field, aligned to its start, flips above with the same gap when it does not fit and the room above is larger, and keeps the larger side and shrinks with an inner scroll when neither fits."
  - "Esc closes without change. A press outside closes like Cancel. Tab after the last item of the panel closes it like Cancel; the panel is not a focus trap. What was not applied is discarded."
  - "Focus on opening goes to a day of the grid: the date of the field, else today, else the nearest allowed day. On closing it goes back to the calendar button, the one of the End field in a range, after Esc in the panel, Cancel, Apply, a pick, the button and Tab; Esc with the focus in the field and a press outside leave it where it is."
  - "Single: picking a day applies, writes the text, closes and fires change once."
  - "Range: the panel keeps a draft. The first pick is the start, the second the end, and an end picked before the start reorders; the period counts only on Apply. The Start and End texts keep the period that was applied until Apply: a pick or a shortcut changes only what the panel holds, and start, end and change wait for Apply. Cancel, Esc, a press outside and Tab discard the draft."
  - "The shortcuts are seven fixed nph-option in a listbox the date picker owns, and the product cannot pass its own. They are Today, Yesterday, Last 7 days, Last 30 days, This month, Last month and Custom."
  - "Decided (D-6): Today and Yesterday are one day; Last 7 days and Last 30 days are the whole days up to yesterday, without today; This month runs from day 1 to the last day, cut by the max, the one cut the limits make; Last month is the whole previous month; Custom does not change the dates and moves the focus to the grid. A shortcut with any day outside the min or the max is disabled, with the disabled look of nph-option, except This month, which is disabled only when no day of it is allowed or the min falls inside it. Picking or typing dates marks Custom, or the shortcut whose period matches; on opening with a period the matching shortcut is marked, or Custom; on opening empty none is marked. A shortcut brings the months to its start."
  - "Decided (D-8): Clear does not close the panel; it empties the selection in the panel and clears the shortcut mark at once; the fields empty only on Apply."
  - "Decided (D-10): a third pick starts over, the date becomes the new start and the end is emptied; start and end on the same day is a valid period; Apply stays enabled: with nothing chosen it applies an empty period, and with only the start it applies that day and the End field shows the same date; with only the end the Start takes the same date."
  - "Decided (D-10): a period picked in the panel does not cross a day unavailable by rule unless allowsNonContiguousRanges is on: while only the start is chosen, the days past the first unavailable day after it, or before the first one before it, cannot be the end and are disabled. A typed period keeps the rule of today (it commits across an unavailable day, and an unavailable day itself is refused) and a shortcut fills its period whatever it holds; both wait for the design owner (D-15)."
  - "Decided (D-5, D-9, D-11): the two months of a range move together, one month per click, and stay consecutive, with Previous month only on the first month and Next month only on the last; the month of the start opens on the left, the current month when empty, and with only the end the month of the end opens on the right; the focus goes to the start day, the end day or today. The title of either month opens the month or the year view in both columns together."
  - "Decided (D-7): the range shows one month with the shortcuts on top when the width of the window does not fit the panel of the size in use (762 default, 874 large) plus the page margin, not at a fixed breakpoint. It is measured when the panel opens."
  - "Open (D-12): the shortcut column is 192, which is 12 steps of date-picker/panel-padding; the default header of the grid is 40, which is control/height-default plus space/inline-tight; the month and year cell is a third of the week row wide, which is 84 on default. The evidence draws these measures and no token holds them."
  - "Open (D-14): the page margin of D-7 is space/container-padding on each side."
  - "Open (D-15 to D-18): a typed period and a shortcut that hold an unavailable day keep the rule of today; the views of a range anchor on the first month shown, with arrows on the outer edges and one unit per click; This month with a min inside the month is disabled; a day that cannot be the End looks like a day outside the limits. None is drawn in Figma; the design owner decides."
  - "Decided (D-1, D-2, D-3, D-9): the grid draws six week rows, gives the month and year views the height of the day view and cells as high as the day, uses text/label-sm on the weekday names and climbs from months to years as a ladder with chevron-down on both titles; the rules are in the sheet of nph-calendar."
  - "Combined states: error and disabled, disabled wins; a chosen and disabled shortcut keeps its fill and marker under state/disabled-opacity; a chosen day cannot be disabled."
  - "Every text comes from the consumer, already localized, except the order of the date and the names of months and weekdays, which come from Intl."
domain_errors:
  - "A typed text that is not a date that exists, written in the order of the language with the slash: errorInvalid, on the field, with the value it had kept."
  - "A typed date outside min or max: errorMin, errorMax or errorBetween, citing the limit; a date unavailable by rule: errorUnavailable; an End typed before the Start, or a Start typed after the End: errorEndBeforeStart with the Start."
  - "An empty required field: errorRequired, errorRequiredStart or errorRequiredEnd."
  - "A mode, a size or a week-start outside the lists, a date property that does not exist: it draws nothing and emits console.error in development, one per cause while it lasts."
  - "labels with no key at all — the piece draws nothing and emits console.error in development."
  - "A missing label renders anyway and emits console.error in development, once, saying which keys are missing."
tokens:
  trigger: "date-picker/trigger-gap"
  panel_surface: "date-picker/panel-radius, date-picker/panel-border, border/width, color/popover, color/popover-foreground, elevation/dropdown"
  panel_padding: "date-picker/panel-padding"
  panel_offset: "date-picker/panel-offset"
  divider: "date-picker/divider, border/width"
  footer: "date-picker/footer-gap, date-picker/panel-padding"
  calendar_button_icon: "color/muted-foreground"
  grid: "calendar/day-radius, calendar/day-focus-radius, space/container-padding, space/inline, control/height-default, control/height-large"
  narrow_rule: "control/height-default, control/height-large, space/container-padding, border/width"
  motion: "motion/enter-duration, motion/enter-easing, motion/exit-duration, motion/exit-easing, motion/hover-duration"
  field: "layout/field-width, space/stack-tight, status/error-text, color/muted-foreground, color/input, date-picker/border, date-picker/border-bottom, date-picker/height, color/input-hover, status/error, state/disabled-opacity"
ai_hints:
  - "Use nph-date-picker for a date or a period in a form; for a grid that stays on the page use nph-calendar, and for events over days nph-scheduler."
  - "Give label for one date, or start-label and end-label with mode range; the label is the name, the hint is only help."
  - "Pass every text in labels, already localized, with the hint such as dd/mm/aaaa; the product writes the messages of the typed date and the shortcuts."
  - "Read value, or start and end, from the host on change; setting them from code fires nothing."
  - "Use range for a period, never two single date fields."
  - "Use min and max for a window and unavailable for a holiday; a typed date outside them gets a message that cites the limit."
  - "Use the same size for every field and button of a form, and large on a touch screen."
  - "Set name, or start-name and end-name, to send the dates in the form as YYYY-MM-DD."
accessibility:
  semantics: "Each date is an nph-field with a visible label naming the text; the hint is the description, linked to the text by aria-describedby through the field. The calendar button is an icon-only nph-button with its name as the tooltip, aria-haspopup dialog and aria-expanded true while the panel is open. The panel is a non-modal dialog named by dialogDate or dialogPeriod. The shortcuts are a listbox named by shortcuts, with nph-option as role option and aria-activedescendant on the list. A live region with role status and aria-live polite announces the chosen period. The host is form-associated."
  accessible_name: "The text: the label of its field. The hint is help, never a name. The calendar button: openCalendar. The clear button: clearDate. The panel: dialogDate or dialogPeriod. The shortcut list: shortcuts. The grid and its arrows: the labels of nph-calendar."
  keyboard:
    - "Tab goes through the text, the clear button when there is a value, and the calendar button; in a range, Start, then End, its clear button and the calendar button."
    - "Enter or Space on the calendar button opens the panel with the focus on a day, and again closes it."
    - "In the grid, the arrows change the day, Page Up and Page Down the month, with Shift the year, Home and End go to the start and the end of the week; Enter or Space on a day picks it."
    - "In the panel, Tab goes through the shortcut list, the header, the grid, and Clear, Cancel and Apply; Tab after the last item closes the panel like Cancel and returns the focus to the calendar button."
    - "The shortcut list is one Tab stop; Up and Down move through the enabled shortcuts, Home and End go to the first and the last, Enter and Space choose."
    - "Esc closes the panel without change; with the month or the year view open, the first Esc goes back to the days and the second closes."
  focus: "Each piece shows the focus border and the halo of its own component; the shortcut active by keyboard takes the hover look of nph-option. On opening the focus goes to a day, and on closing back to the calendar button, the End one in a range."
  contrast: "The label, the text, the hint and the error message pass 4.5:1 in both themes; the error message in status/error-text measures 6.88:1 and 6.96:1. The calendar icon in color/muted-foreground measures 6.69:1 and 9.81:1 over the field, and 5.76:1 and 5.11:1 over the hover background of the button. The panel border and the divider are decorative: the shadow separates the panel in light and the background in dark. The grid contrast is in the sheet of nph-calendar."
  color_alternative: "The error always brings the written message; open, the panel shows below the field and the button carries aria-expanded true; today has an outline and the chosen days a fill; the period is announced in words."
invalid_combinations:
  - "A mode, a size or a week-start outside the lists — the piece draws nothing."
  - "A value, start, end, min, max or now that is not YYYY-MM-DD or does not exist — the piece draws nothing."
  - "No label, or in range no start-label or end-label — the field has no name; nph-field emits console.error in development."
  - "value in range mode, or start and end in single mode — they are ignored."
  - "error on a disabled field — disabled wins and the error is hidden."
  - "A compact field to open a compact panel — it opens the default panel."
  - "Two single date fields for the start and the end of a period — use range."
relations:
  combines_with: [nph-field, nph-input, nph-button, nph-tooltip, nph-calendar, nph-option, nph-separator]
  parents: ["form", "a toolbar of filters"]
  children: [nph-field, nph-input, nph-button, nph-calendar, nph-option, nph-separator]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Two single date fields for the start and the end of a period."
  - "Compact on a touch screen."
  - "The calendar as the only way to a date the person knows by heart."
  - "Using the hint in place of the label."
  - "Using it to choose only a month, only a year, a week, a quarter or a time."
  - "Passing a color, a size of day or a text the piece writes itself."
  - "Reordering a typed End before the Start, or committing a typed date that has a problem."
  - "Writing the shortcuts in the product: the seven are fixed."
sources:
  design_md: "design.md, the date-picker/* and calendar/* tokens, color/popover, color/popover-foreground, color/border-subtle, color/muted-foreground, color/primary-surface, elevation/dropdown, border/width, space/container-padding, space/inline, space/inline-loose, status/error, status/error-text, state/disabled-opacity, control/height-* and the motion roles"
  decision: "P133 — nph-date-picker and nph-calendar: API and semantics"
  tests: "src/components/nph-date-picker/nph-date-picker.test.ts and nph-date-picker.logic.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-date-picker/nph-date-picker.stories.ts and nph-date-picker.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, documentation frame 6673:62837, root 6662:55010, sets 6666:32 and 6662:56378, grid 4015:28204 and day 4015:28020"
---

# nph-date-picker

## Function

**The problem it solves:** gives the person a date field they type in or fill from a calendar panel, in
two modes: a single date, and a period with shortcuts and two months. It takes part in the form that
contains it. The date grid is `nph-calendar`; each date sits in its own `nph-field`.

**When to use:**

- When a form asks for a date the person types or checks in the calendar: a due date, a schedule date,
  the issue date of a document.
- When a period whose start and end go together needs confirmation, such as a report period, a validity
  or a vacation: use `range`, with Apply.
- For a date the person knows by heart and that is far from today, such as a birth date: the field
  accepts typing, and the calendar is only on the button.
- `default` on a common form; `compact` on a dense screen with a pointer; `large` on a touch screen, for
  every field of the form.
- Set `min` and `max` when dates outside a window are not allowed, and `unavailable` for dates closed by
  a rule, such as a holiday.

**When NOT to use:**

- **Two single date fields for the start and the end of a period** — use `range`, which applies both
  dates together.
- **`compact` on a touch screen** — 28 is small for a finger; use `large`.
- **The calendar as the only way to a date the person knows by heart** — the field accepts typing.
- **To choose only a month, only a year, a week, a quarter or a time** — those types are outside the
  component.
- **For a date grid that stays on the page with no field and no panel** — use `nph-calendar`.
- **For events laid over days** — use `nph-scheduler`.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Mode | `single`, `range` | `single` for one date; `range` for a period whose start and end go together and need confirmation |
| Size | `compact`, `default`, `large` | `default` on a common form; `compact` on a dense screen with a pointer; `large` on a touch screen |
| Panel | one month; shortcuts and two months; narrow range | It follows the mode and the width: the range shows one month with the shortcuts on top on a narrow screen |

The mode is the Figma property `modo`, with `data única` and `intervalo`; the size is `tamanho`, with
`compact`, `default` and `large`; the Figma `estado` has `padrão`, `hover`, `foco`, `erro`,
`desabilitado`, `aberto` and `foco no ×`, and `conteúdo` has `vazio` and `preenchido`. In code the error
is the presence of a message, the disabled state is `disabled`, the open state is `open`, and empty or
filled is the date. The panel is the inner Figma piece `nph-date-picker / painel`, with the modes
`data única`, `intervalo` and `intervalo estreito`.

**By size and density:** `compact` is 28, `default` 38 for the field (`date-picker/height`) and 36 for the calendar button, and `large` 44, the height of the field and of the
calendar button. The compact field opens the default panel; `large` opens the large panel, whose footer
buttons are the default size, and the other panels have compact footer buttons. Density is `not_applicable`.
The panel measures, with six week rows (D-1), 286 by 334 for one date on default and 342 by 394 on large;
762 by 395 for the range on default and 874 by 463 on large; and 286 by 679 for the narrow range. The month
and year views keep the size of the panel (D-2).

**Do not combine with:** a mode, a size or a week-start outside the lists; `compact` on a touch screen;
fields of different sizes in one form; two single date fields for the start and the end of a period.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Field | Default | `date-picker/border`, `date-picker/border-bottom`, `color/background` | The resting field, the top and the sides in `date-picker/border` and the bottom line in `date-picker/border-bottom`, with the label, the hint as help and the calendar button after the text |
| Field | Hover | `color/input-hover` | Only the border changes; the calendar button stays without background and with the light icon |
| Field | Focus | `focus/border`, `focus/halo` | The border and the halo on the text, the clear button or the calendar button |
| Field | Error | `status/error`, `status/error-text` | The border and the message below it, with no icon, only on the field that has the problem |
| Field | Disabled | `state/disabled-opacity` | The field and the calendar button fade and do not open the panel; disabled wins over error |
| Calendar button | Open | `icon-button/secondary-ghost-background-hover` | The hover-active look with the solid icon, and `aria-expanded` true |
| Panel | Closed | none | Only the field shows |
| Panel | Open | `color/popover`, `date-picker/panel-border`, `date-picker/panel-radius`, `elevation/dropdown` | The panel shows below the field, the focus goes to a day |
| Shortcut | Active | `color/accent`, `color/accent-foreground` | The shortcut on the arrows or under the pointer takes the hover look of `nph-option` |
| Shortcut | Selected | `color/primary-surface`, `color/primary` | The fill and the check marker; kept under the opacity when also disabled |

The field states come by instance from `nph-field`, `nph-input` and `nph-button`. The calendar icon is
`color/muted-foreground`, light, and goes solid on the hover of the button itself and when open. The panel
enters with opacity and a slide of `date-picker/panel-offset` and leaves with the exit role of motion; with
reduced motion only the opacity changes, in `motion/hover-duration`.

**Feedback and focus:** on opening the focus goes to a day (the date of the field, else today, else the
nearest allowed day); on closing it goes back to the calendar button, the one of the End field in a range,
after Esc in the panel, Cancel, Apply, a pick, the button and Tab. Esc with the focus in the field and a
press outside leave the focus where it is.

**Business rule the piece carries:**

- The piece is form-associated: single writes `name`; range writes `start-name` and `end-name`; each entry
  is left out while its date is empty. Required, a typed text that is not accepted and `form.reset()` work as
  in a native field. The host is `badInput` while a field carries a message the piece wrote for a typed text that is not accepted,
  with the text of `errorInvalid`, and otherwise `valueMissing` while required and a date is empty, with the text of
  `errorRequired`. `form.reset()` returns `value`, `start` and `end` to their attributes and clears the errors.
- **The field and its control row.** `nph-field` names and describes one control. Here each field holds the
  internal element `nph-date-picker-control` (the Figma `date-picker / controle`), which holds the `nph-input`
  and the calendar button, and hands the label, the description, the invalid, the required and the disabled of
  the field to the input. The row is internal: it has no folder, no sheet and no entry in the package, and it
  is dropped from the manifest (P133). The calendar button keeps its own name. In a range the Start and End
  fields sit side by side, `date-picker/trigger-gap` apart, aligned at the top, and the single calendar button
  is in the End field.
- **The typed date (D-4).** No mask. The order of day, month and year comes from the language
  through `Intl`, so `en` writes month first and `pt-BR` and `es` day first, with the slash as separator. Day
  and month may be typed with or without a leading zero and the year has four digits; the text is written back
  with two digits for day and month and four for the year. The text is checked when the person leaves the
  field or clears it. One message at a time, in this order: empty, invalid, outside the limit, unavailable, end
  before start. An empty text is an error only when `required`. A date with a problem is not committed: the
  value it replaces stays and the field says what to fix, citing the limit through `errorMin`, `errorMax` or
  `errorBetween`. A typed value is never reordered; only a typed End is compared with the Start. Single commits
  a valid typed date when the person leaves the field, and at once with the panel open, moving the panel to it.
  In a range with the panel open a typed date goes to the panel and counts on Apply. A click in the field is not
  a click outside.
- **The panel.** A surface of its own, not an `nph-popover`, because its widths stop at 400. It lives in the top
  layer, opens `date-picker/panel-offset` below the field, aligned to its start, flips above with the same gap
  when it does not fit and the room above is larger, and keeps the larger side and shrinks with an inner scroll
  when neither fits. It follows a scroll and a resize, and hides while the field is out of the window. Esc closes
  without change; a press outside closes like Cancel; Tab after the last item closes like Cancel and returns the
  focus to the calendar button; it is not a focus trap. The surface does not clip its content, so a focus ring
  is not cut. It has no padding of its own: the grid brings its 16.
- **The range.** A draft: the first pick is the start, the second the end, an end before the start reorders,
  and the period counts only on Apply. A period picked in the panel does not cross a day unavailable by rule
  unless `allowsNonContiguousRanges` is on (D-10). The Start and End texts keep the applied period until Apply: a pick or a
  shortcut changes only what the panel holds, and `start`, `end` and `change` wait for Apply; Cancel, Esc, a
  press outside and Tab discard the draft. The body is the shortcut
  column and two months, top aligned, with no divider between them; below, an `nph-separator` edge to edge in
  `date-picker/divider`, then the footer in `date-picker/panel-padding`: Clear, secondary ghost, at the start;
  Cancel, secondary solid, and Apply, primary solid, at the end, `date-picker/footer-gap` apart. The footer
  buttons are compact in the default panel and default in the large one.
- **The shortcuts.** Seven nph-option fixed by the piece, in a listbox the date picker owns, which is the owner
  of its options as `nph-select` is of its own: Today, Yesterday, Last 7 days, Last 30 days, This month, Last
  month and Custom. The product passes their texts in `labels` and cannot pass its own shortcuts. The list is one
  Tab stop; Up and Down move through the enabled ones without wrapping, Home and End go to the first and the last,
  Enter and Space choose. A shortcut fills the band and waits for Apply. Last 7 days and Last 30 days end
  yesterday, without today. A shortcut with any day outside the `min` or the `max` is disabled, with the
  disabled look of `nph-option`; This month is the exception, which the `max` cuts (D-6).

**Decisions.** The design owner answered D-1 to D-11 on 2026-11-18, as recommended, and Figma draws the answers
(the evidence of DSA-96). What stays open is named in the task with its number:

| Decision | What the code does |
|---|---|
| D-1, D-2, D-3, D-9, D-10, D-11 | The grid rules, in the sheet of `nph-calendar`: six week rows, the views at the height of the day view, `text/label-sm` on the weekday names, the ladder of months and years, the selection cycle, picking a day outside the month |
| D-4 | A typed date outside the limits, unavailable, or an End before the Start is an error that says what to fix, with no reorder; one message at a time, in the order empty, invalid, limit, unavailable, end before start |
| D-5 | Previous month only on the first month and Next month only on the last, the other keeping its space, hidden; the two months move together, one month per click, and stay consecutive; the start month opens on the left, the current month when empty, and the focus on the start day or today |
| D-6 | Today and Yesterday are one day; Last 7 days and Last 30 days are the whole days up to yesterday, without today; This month is the whole month, cut by the max; Last month is the whole previous month; a shortcut with any day outside the limits is disabled, except This month; Custom keeps the dates and moves the focus to the grid; a manual choice marks Custom or the matching shortcut; none is marked when empty |
| D-7 | One month with the shortcuts on top when the width of the window does not fit the panel plus the page margin, measured when the panel opens; the rule is by width, not by a fixed breakpoint |
| D-8 | Clear empties the panel and the shortcut mark and stays open; the fields empty on Apply |
| D-10 | A third pick starts over; one day is valid; Apply stays enabled, with an empty period, with the start alone as one day, and with the end alone as one day; a period picked in the panel does not cross a day unavailable by rule unless `allowsNonContiguousRanges` is on |
| D-12 (open) | The shortcut column is 192 (12 steps of `date-picker/panel-padding`), the default header 40 (`control/height-default` plus `space/inline-tight`) and the month and year cell a third of the week row wide, 84 on default: measures with no token |
| D-13 (open) | A typed Start or End with the panel closed is committed when the field is left, even when the period stays incomplete |
| D-14 (open) | The page margin of D-7 is `space/container-padding` on each side |
| D-15 to D-18 (open) | A typed period and a shortcut that hold an unavailable day keep the rule of today (they commit and fill their period); the views of a range anchor on the first month shown, with the arrows on the outer edges, one unit per click; This month is disabled when the min falls inside the month; a day that cannot be the End looks like a day outside the limits |

**Domain error states:** a typed text that is not a date, a date outside `min` or `max`, a date unavailable
by rule and an End before the Start are messages on the field, each from `labels`; an empty required field has
its own message for the single field, the Start and the End. A mode, a size, a week-start or a date property
that does not exist draws nothing and emits `console.error` in development, one per cause while it lasts. A
missing label renders anyway and says which keys; `labels` with no key at all draws nothing.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Each date is an `nph-field` with a visible label naming the text; the hint is the description, linked by `aria-describedby` through the field. The calendar button is an icon-only `nph-button` with `aria-haspopup` dialog and `aria-expanded`. The panel is a non-modal dialog named by `dialogDate` or `dialogPeriod`. The shortcuts are a listbox named by `shortcuts`, with `nph-option` as role option and `aria-activedescendant` on the list. A live region with role `status` and `aria-live` polite announces the chosen period. The host is form-associated |
| Accessible name | The text: the label of its field; the hint is help, never a name. The calendar button: `openCalendar`, also its tooltip. The clear button: `clearDate`. The panel: `dialogDate` or `dialogPeriod`. The shortcut list: `shortcuts`. The grid and its arrows: the labels of `nph-calendar` |
| Keyboard | Tab goes through the text, the clear button when there is a value and the calendar button; in a range, the Start and then the End. Enter or Space on the button opens the panel with the focus on a day, and again closes it. In the grid the arrows, Page Up, Page Down with Shift, Home and End are those of `nph-calendar`. In the panel Tab goes through the shortcuts, the header, the grid, Clear, Cancel and Apply, and after the last it closes the panel like Cancel. The shortcut list is one Tab stop with Up, Down, Home, End, Enter and Space. Esc closes without change; in a month or year view the first Esc goes back to the days |
| Focus | Each piece shows the focus border and the halo of its own component; the shortcut active by keyboard takes the hover look of `nph-option`. On opening the focus goes to a day; on closing, back to the calendar button, the End one in a range |
| Contrast | The error message in `status/error-text` measures 6.88:1 and 6.96:1. The calendar icon in `color/muted-foreground` measures 6.69:1 and 9.81:1 over the field and 5.76:1 and 5.11:1 over the hover background of the button. The panel border and the divider are decorative: the shadow separates the panel in light and the background in dark. The contrast of the grid is in the sheet of `nph-calendar` |
| Alternative to color | The error always brings the written message; open, the panel shows below the field and the button carries `aria-expanded` true; today has an outline and the chosen days a fill; the period is announced in words |
| Announcement | After a choice the live region says the period, from `labels.period` with the two dates in the long form of the language, or the single date for one day |
| Touch target | The field is 28, 38 and 44 and the calendar button 28, 36 and 44. Shortcuts are 36. The footer buttons are 28 and, on `large`, 36. All pass the 24 by 24 minimum; on a touch screen use `large` |
| Known limits | (a) The shortcut list is the date picker's own listbox, with `nph-option` written directly in it; `nph-option` says it is written only inside the list that owns it, and here the owner is this list. (b) D-7 reads the width of the window, once, when the panel opens, and not the width of the column. (c) The clear button as a Tab stop and its 24 by 24 target on `large` belong to `nph-input` (DSA-16 D2). (d) The rules of the grid in the panel are in the sheet of `nph-calendar` |

## Relations

**Combines with:** `nph-field`, which gives each date its label, help and error; `nph-input`, the text, with
its clear button; `nph-button`, the calendar button, the footer and, through the grid, the arrows;
`nph-tooltip`, the name of the icon-only buttons; `nph-calendar`, the date grid of the panel; `nph-option`,
the shortcuts; and `nph-separator`, the footer divider.

**What is the parent:** a form, or a toolbar of filters, next to the screen that reads the date.

**What is the child:** an `nph-field` for each date, holding the internal control row, the `nph-input` and the
calendar button; in the panel, `nph-calendar`, seven `nph-option`, an `nph-separator` and the footer
`nph-button`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**Relation to `nph-calendar`:** the date grid is `nph-calendar`, its own exported element. `nph-date-picker`
hands it the labels, the limits and the period, and stops its `nph-pick` and `nph-month-change` inside.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Between the text and the calendar button, and between Start and End | `date-picker/trigger-gap` |
| Panel surface | `color/popover`, `color/popover-foreground`, `date-picker/panel-border`, `border/width`, `date-picker/panel-radius`, `elevation/dropdown` |
| Panel padding | `date-picker/panel-padding`, on the shortcut column and the footer; the grid brings its own `space/container-padding` |
| Panel offset | `date-picker/panel-offset` |
| Divider | `date-picker/divider`, `border/width` |
| Footer gap | `date-picker/footer-gap` |
| Calendar icon | `color/muted-foreground` |
| Grid | `calendar/day-radius`, `calendar/day-focus-radius`, `space/container-padding`, `space/inline`, `control/height-default`, `control/height-large` |
| Narrow rule | `control/height-default`, `control/height-large`, `space/container-padding`, `border/width` |
| Motion | `motion/enter-duration`, `motion/enter-easing`, `motion/exit-duration`, `motion/exit-easing`, `motion/hover-duration` |
| Field, by instance | `layout/field-width`, `space/stack-tight`, `status/error-text`, `color/muted-foreground`, `color/input`, `date-picker/border`, `date-picker/border-bottom`, `date-picker/height`, `color/input-hover`, `status/error`, `state/disabled-opacity` |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything comes from a
token, and the shadow is the `elevation/dropdown` style, with no token of its own. The panel outline and the
divider use the same color, `color/border-subtle`, through their component tokens. The piece has no `::part`
and no color property. The shell has no padding: do not add the 16 of the grid twice.

**AI hints:**

- Use `nph-date-picker` for a date or a period in a form; for a grid that stays on the page use
  `nph-calendar`, and for events over days `nph-scheduler`.
- Give `label` for one date, or `start-label` and `end-label` with `mode` `range`; the label is the name, the
  hint is only help.
- Pass every text in `labels`, already localized, with the hint such as dd/mm/aaaa; the product writes the
  messages of the typed date and the shortcut texts.
- Read `value`, or `start` and `end`, from the host on `change`; setting them from code fires nothing.
- Use `range` for a period, never two single date fields.
- Use `min` and `max` for a window and `unavailable` for a holiday; a typed date outside them gets a message
  that cites the limit.
- Use the same size for every field and button of a form, and `large` on a touch screen.
- Set `name`, or `start-name` and `end-name`, to send the dates in the form as `YYYY-MM-DD`.

## Examples

**Recommended case:** a due date: `single`, `label` Due date, filled, with `min` as today and `required`, in a
form with `name`.

**Alternative case:** a report period: `range` open with Custom marked and Apply in the footer; and an invalid
typed date, such as 31/02/2026, with the message that says what to fix.

## Anti-patterns

- **Do not use two single date fields for the start and the end of a period** — use `range`.
- **Do not use `compact` on a touch screen** — use `large`.
- **Do not leave the calendar as the only way to a date the person knows by heart** — the field accepts typing.
- **Do not use the hint in place of the label** — it is the help line.
- **Do not use it to choose only a month, only a year, a week, a quarter or a time.**
- **Do not reorder a typed End before the Start, and do not commit a typed date that has a problem.**
- **Do not write shortcuts in the product** — the seven are fixed.
- **Invalid combinations:** a mode, a size or a week-start outside the lists; a date property that is not
  `YYYY-MM-DD`; no label; `error` on a disabled field.
- **Do not create without a decision:** a month only, year only, week, quarter or time picker; product
  shortcuts; a color property; a mask on the input; an event for opening and closing.

## Sources and decisions

- **The repository `design.md`:** the `date-picker/*` and `calendar/*` tokens, the colors and focus tokens
  they point to, `elevation/dropdown`, `status/*`, `state/disabled-opacity` and the motion roles.
- **The decision that originated it:** P133, `nph-date-picker` and `nph-calendar`: API and semantics.
- **Tests:** `src/components/nph-date-picker/nph-date-picker.test.ts` and `nph-date-picker.logic.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-date-picker/nph-date-picker.stories.ts` and
  `nph-date-picker.docs.stories.ts`.
- **Figma:** the documentation frame (`6673:62837`), the root (`6662:55010`), the sets `6666:32` and
  `6662:56378`, the grid `4015:28204` and the day `4015:28020` in `DS-IA-NEPHOS 5.0`.
