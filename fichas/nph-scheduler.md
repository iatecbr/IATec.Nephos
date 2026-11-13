---
piece: nph-scheduler
level: component
status: active
solves: >-
  Shows the calendar of a person or a group as events in the work week, week, day, month and list
  views, on desktop and on a phone, so the person sees what is coming, finds a time and opens an
  event, while the screen owns the detail, the creation and the editing of the event.
use_when:
  - "The person needs to see what is coming in a week, a day or a month and to find a free time: the work week with the side panel, the view the piece opens in."
  - "The person plans by the month: the month view, with the events in a row per day and +N more when they do not fit."
  - "The person reads the events in sequence, or uses a screen reader: the list view."
  - "The screen is a phone: below 768 px of the width of the element the piece is the compact month with the list of the chosen day."
  - "Several calendars share one grid and the person turns each one on and off in My calendars: give each calendar its color."
  - "The screen opens the detail of an event beside it: put the content in the detail slot and open it with open-event."
do_not_use_when:
  - "To choose a date in a form: use the date picker, not the scheduler."
  - "For tasks with no time of day: use a list or a table."
  - "To mark an event by status, such as error, warning or success: the color of an event is the choice of the calendar, never a status."
  - "To show a cancelled event only by color: the piece writes Cancelled: and strikes the title, and keeps it in the grid."
  - "To open the detail, create or edit an event inside the piece: that belongs to the screen, which gets the click on the event."
  - "For past or tentative events, a time scale or the arrow keys on the grid: they are outside this version."
api:
  events:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only, and the screen owns it. The events, as a list of { id, title, start, end,
      allDay, calendar, cancelled, recurring, people }. id (unique) and title are required. start
      and end are wall-clock text, YYYY-MM-DDTHH:mm, or YYYY-MM-DD for an all-day event, whose end
      is the last day, included; a text with a time zone is refused. end absent: the event ends when
      it starts. calendar is the id of a calendar, which gives the color and the name; absent, the
      color is primary and the event has no calendar name. cancelled and recurring are booleans.
      people is a list of { name, src }, shown as avatars in the day header and in the list row. An
      event that cannot be drawn, such as a repeated id, a date that does not exist, an end before
      the start or a calendar that does not exist, is left out and emits console.error in
      development, one per cause. The empty state is not a property: it is a period with no visible
      event.
  calendars:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The calendars, as a list of { id, name, color, visible }. id (unique), name and
      color are required. color is primary or one of sistemas, gerencial, educacao, comercial,
      financeiro, igrejas and rh, equal in every brand and never a status. visible is true by
      default; false hides the events of the calendar. The checkbox of My calendars turns it on and
      off: the piece replaces calendars with a new list and never changes the objects of the screen.
      A calendar with no id, a repeated id or no name is left out and emits console.error in
      development, and the events that point to it are left out too (the calendar does not exist). A
      color outside the list is not a reason to leave it out: the calendar stays, its events take
      primary, and console.error says so in development.
  labels:
    type: object
    required: true
    default: "empty object"
    reflects: false
    constraint: >-
      Property only. Every text the piece writes, already localized by the screen, as one object with
      the keys listed below as labels.<key>. The piece writes no word of its own. A missing label
      renders anyway and emits console.error in development, once, saying which keys are missing.
      Placeholders are written between braces: count and date.
  filter-items:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The property is filterItems. The items of the Filter menu, as the items of
      nph-dropdown-menu. Without them the Filter button only fires nph-filter-click.
  view:
    type: enum
    values: [work-week, week, day, month, list]
    required: false
    default: work-week
    reflects: true
    constraint: >-
      The Figma property `vista`. Reflects because the internal CSS selects the layout by it. The
      piece writes it when the person changes the view and fires nph-view-change; setting it from
      code fires nothing. A value outside the list draws nothing and emits console.error in
      development. On a phone the view stays the compact month, whatever the value.
  date:
    type: string
    required: false
    default: "today"
    reflects: false
    constraint: >-
      The day the period is built around, YYYY-MM-DD. Absent, today. The piece writes it when the
      person moves the period and fires nph-date-change; setting it from code fires nothing. A date
      that does not exist draws nothing and emits console.error in development.
  week-start:
    type: enum
    values: [sunday, monday]
    required: false
    default: sunday
    reflects: false
    constraint: >-
      The property is weekStart. The first day of the week. It is not taken from the language. A
      value outside the list draws nothing and emits console.error in development.
  hide-side-panel:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The inverse of the Figma boolean `lateral`. Hides the side panel, with the mini month and My
      calendars, in every desktop view; the sidebar button in the toolbar toggles the same panel,
      writes this attribute and fires nph-side-panel-change. Reflects because the internal CSS
      selects the grid by it. The phone has no side panel.
  loading:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Skeleton rows in the place of the events; the toolbar stays active and the week keeps its days.
      The events area is marked busy and the loading label is announced. Reflects because the
      internal CSS selects the loading look by it.
  now:
    type: string
    required: false
    default: "the clock of the machine"
    reflects: false
    constraint: >-
      An instant, YYYY-MM-DDTHH:mm, that stands for the clock: the now line and today are the same
      in a story and a test. Absent, the clock of the machine, read again every minute. An instant
      that does not exist draws nothing and emits console.error in development.
  open-event:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The property is openEvent. The id of the event whose detail is open. The piece writes it when
      the person opens an event and takes the attribute off when the detail closes. With content in the detail
      slot it opens the nph-popover beside the event, with the title of the event as heading, and
      writes aria-expanded true on the event. Without content in the slots nothing opens. Reflects
      so the page can see which detail is open.
  labels.today:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the Today button, which goes to the current day.
  labels.previous:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the previous period button.
  labels.next:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the next period button.
  labels.newEvent:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the New event button on desktop and its accessible name on a phone, where
      the button is icon only.
  labels.filter:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the Filter button and the accessible name of its menu.
  labels.sidePanel:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the sidebar button, its tooltip and the name of the side panel.
  labels.view:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the view select.
  labels.viewWorkWeek:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the work week option of the view select.
  labels.viewWeek:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the week option of the view select.
  labels.viewDay:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the day option of the view select.
  labels.viewMonth:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the month option of the view select.
  labels.viewList:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the list option of the view select.
  labels.allDay:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The label of the all-day band and the time of an all-day event in the lists and in the
      accessible name.
  labels.cancelled:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text written before the struck title of a cancelled event, such as Cancelled:.
  labels.cancelledName:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word that says cancelled in the accessible name of the event.
  labels.repeats:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word that says the event repeats in the accessible name of the event.
  labels.more:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The text of the more button of a month cell, with the marker {count}, such as +{count}
      more.
  labels.moreName:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the group of the more button, with the markers {count} and
      {date}, such as {count} more events on {date}.
  labels.myCalendars:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The heading of the list of calendars in the side panel.
  labels.miniPrevious:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the previous month button of the mini month.
  labels.miniNext:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The accessible name of the next month button of the mini month.
  labels.emptyTitle:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The title of the empty state, such as No events this week.
  labels.emptyHint:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The hint of the empty state, below the title.
  labels.loading:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The status text announced while the events load.
  labels.todayName:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The word that says today in the accessible name of the current day.
  nph-view-change:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person changes the view in the select or goes to the day view by +N more, with
      detail { view }. It bubbles and is composed. Setting view from code fires nothing.
  nph-date-change:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person moves the date, with detail { date, source }. date is YYYY-MM-DD. source
      is today, previous, next, mini-month, month or more. It bubbles and is composed. Setting date
      from code fires nothing.
  nph-event-click:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person activates an event, with detail { id, source }, source being pointer or
      keyboard. It bubbles, is composed and is cancelable: preventDefault keeps the detail from
      opening. The screen decides what the click does.
  nph-event-close:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the detail closes because of the person, with detail { id, source }. source is
      escape, outside, focus-out, toggle or close-button. It bubbles and is composed. Esc gives the
      focus back to the event.
  nph-day-click:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person activates a day of the grid, with detail { date }. It bubbles and is
      composed. The piece does nothing else with the click: the screen decides.
  nph-new-event:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person activates New event, with detail { date }, the day the period is built
      around. It bubbles and is composed. The piece creates no event.
  nph-filter-click:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person activates Filter and filter-items is empty. It bubbles and is composed.
  nph-filter-select:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person chooses an item of the Filter menu, with detail { value, checked }.
      checked is a boolean, or null for an item that has no selection. It bubbles and is composed.
  nph-calendar-toggle:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person turns a calendar of My calendars on or off, with detail { id, visible }.
      It bubbles and is composed. The piece has already replaced calendars with a new list.
  nph-side-panel-change:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person toggles the side panel with the sidebar button, with detail { open }. It
      bubbles and is composed. Setting hide-side-panel from code fires nothing.
  detail:
    type: slot
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The body of the detail of the open event, drawn by the screen inside the nph-popover that the
      piece opens beside the event. The piece does not draw the detail: with no content in this slot
      and in detail-footer, an event opens nothing.
  detail-footer:
    type: slot
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The actions of the detail, in the footer of the nph-popover, as nph-button elements. The
      divider comes with the footer.
variants:
  view:
    axis: appearance
    choose_when: "work-week, the default, to answer what the person has this week; week when the weekend matters; day for one day in hours; month to plan; list to read in sequence."
    do_not_combine_with: ["a view outside the list: the piece draws nothing", "another view on a phone: the compact month stays"]
  screen:
    axis: size
    choose_when: "desktop, with the toolbar, the side panel and the grid, when the element is 768 px wide or more; phone, the compact month with the list of the chosen day, below that. It is read from the element, not from the window."
    do_not_combine_with: ["the side panel on a phone", "Today, Filter and the sidebar button on a phone"]
  side-panel:
    axis: appearance
    choose_when: "shown, the default, in every desktop view, so the person changes the day in the mini month and turns calendars on and off; hidden when the screen needs the width."
    do_not_combine_with: ["hide-side-panel on a phone: there is no panel to hide"]
  event-color:
    axis: appearance
    choose_when: "primary, the default, for the calendar with no color of its own; one of sistemas, gerencial, educacao, comercial, financeiro, igrejas or rh when the person tells calendars apart by color. The color belongs to the calendar and is equal in every brand."
    do_not_combine_with: ["a color as a status", "educacao together with primary in the brand Educacao, where they are the same color"]
  event-type:
    axis: size
    choose_when: "The height comes from the duration: one hour, a short event, a long event and an all-day or multi-day bar. A recurring event adds the repeat icon. The height never goes below the minimum target."
    do_not_combine_with: ["a time with a time zone"]
  week-start:
    axis: appearance
    choose_when: "sunday, the default; monday when the people of the screen start the week there."
    do_not_combine_with: []
states:
  default:
    token: "scheduler/background, scheduler/border, scheduler/border-width, scheduler/radius, scheduler/padding, scheduler/foreground"
    changes_for_user: "The container with the toolbar, the optional side panel and the period: the events in their color, today marked in the day header and by the now line."
  empty:
    token: "scheduler/empty-gap, scheduler/foreground, scheduler/day-label-foreground"
    changes_for_user: "A period with no visible event shows the calendar icon, the title and the hint over the grid. The toolbar stays active and the week keeps its days."
  loading:
    token: "scheduler/month-cell-gap, scheduler/event-padding-x"
    changes_for_user: "Skeleton rows take the place of the events; the toolbar stays active and the week keeps its days. The events area is busy and the loading label is announced."
  day-focus:
    token: "scheduler/focus-border, scheduler/focus-border-width, scheduler/focus-border-radius, scheduler/focus-halo, scheduler/focus-halo-width, scheduler/focus-halo-radius"
    changes_for_user: "The keyboard focus on a day, the day header in the week and day views and the cell in the month, draws the focus border and the halo."
  event-focus:
    token: "scheduler/focus-border, scheduler/focus-halo, scheduler/event-<color>-focus-border, scheduler/event-<color>-focus-halo"
    changes_for_user: "The keyboard focus on an event, on a month line, on a list row and on a cancelled event draws the same border and halo, in the color of the event."
  event-hover:
    token: "scheduler/event-background-hover, scheduler/event-foreground-hover, scheduler/event-<color>-background-hover, scheduler/event-<color>-foreground-hover"
    changes_for_user: "The pointer over an event paints it one tone above; it does not move the focus or open the detail."
  event-open:
    token: "scheduler/event-background-hover, scheduler/event-foreground-hover"
    changes_for_user: "The open event has the background of hover and aria-expanded true; the visible popover beside it is what says it is open."
  event-cancelled:
    token: "scheduler/event-cancelled-background, scheduler/event-cancelled-border, scheduler/event-cancelled-foreground, scheduler/event-border-width"
    changes_for_user: "A neutral body with an outline, no bar, the text Cancelled: before the struck title. With the keyboard focus, the border and the halo go outside the outline, in the color of the event."
  today:
    token: "scheduler/today-foreground, scheduler/today-indicator, scheduler/today-indicator-width, scheduler/now-indicator, scheduler/now-indicator-width, scheduler/now-indicator-size, scheduler/now-foreground"
    changes_for_user: "Today has the number in color and a mark at the base of the day header; the now line with its dot crosses the column of today, with the current time in the time column."
business_rules:
  - "The piece is controlled: the screen owns events, calendars, the view and the date. The piece fires an event when the person acts and writes view, date, hide-side-panel, open-event and calendars as the person changes them; setting them from code fires nothing."
  - "The color of an event is the color of its calendar: primary or one of the vertical colors. It is the choice of the person, equal in every brand, and never a status."
  - "An instant is wall-clock text, YYYY-MM-DDTHH:mm, and an all-day date is YYYY-MM-DD. A text with a time zone is refused, because the piece has no zone to read it in."
  - "The piece does not draw the detail of an event. It hands the click to the screen and, when the screen puts content in the detail slot, opens the nph-popover beside the event."
  - "Below 768 px of the width of the element the piece is the compact month with the list of the chosen day; the view select offers the same views and the compact month stays."
  - "Each day and each event is a Tab stop, in the order of the document: toolbar, side panel, days from left to right, events in start order. There are no arrow keys on the grid; the mini month and the compact month keep the arrows of a date grid."
  - "+N more goes to the day view of that date and gives the focus to the day."
  - "The language of the dates is the nearest lang, crossing shadow roots; without one, en. The first day of the week is the property, not the language."
  - "The height of an event comes from its duration, never below the minimum target; simultaneous events sit side by side and the title is cut on one line, whole in the accessible name."
  - "The grid scrolls on its own: the toolbar and the day header stay in place, and the first view of a period is the hour of its first event, the now line or the early morning."
domain_errors:
  - "A view, a week-start, a date or a now that does not exist: the piece draws nothing and emits console.error in development, one per cause while it lasts."
  - "An event with a repeated id, a start or end that does not exist, an end before the start, a time zone or a calendar that does not exist: the event is left out, with its own console.error in development."
  - "A calendar with no id, a repeated id or no name: the calendar is left out, and so are the events that point to it, each with its own console.error in development."
  - "A calendar with a color outside the list: the calendar stays and its events take primary, with its own console.error in development."
  - "A label the piece needs and the screen did not give: it renders anyway and emits console.error in development, once, saying which keys are missing."
tokens:
  container: "scheduler/background, scheduler/border, scheduler/border-width, scheduler/radius, scheduler/padding, scheduler/foreground"
  toolbar: "scheduler/toolbar-padding-y, scheduler/toolbar-gap, scheduler/sidebar-gap"
  day: "scheduler/day-label-foreground, scheduler/day-label-padding-y, scheduler/day-header-gap, scheduler/day-padding, scheduler/day-radius, scheduler/today-foreground, scheduler/today-indicator, scheduler/today-indicator-width"
  time_grid: "scheduler/time-column-width, scheduler/time-foreground, scheduler/grid-line, scheduler/now-indicator, scheduler/now-indicator-width, scheduler/now-indicator-size, scheduler/now-foreground"
  event_primary: "scheduler/event-background, scheduler/event-foreground, scheduler/event-background-hover, scheduler/event-foreground-hover, scheduler/event-indicator, scheduler/event-indicator-width"
  event_shape: "scheduler/event-radius, scheduler/event-min-height, scheduler/event-padding-x, scheduler/event-padding-y, scheduler/event-gap, scheduler/event-icon-size, scheduler/event-border-width"
  event_cancelled: "scheduler/event-cancelled-background, scheduler/event-cancelled-border, scheduler/event-cancelled-foreground"
  event_colors: "scheduler/event-<color>-background, scheduler/event-<color>-foreground, scheduler/event-<color>-indicator, scheduler/event-<color>-background-hover, scheduler/event-<color>-foreground-hover, scheduler/event-<color>-focus-border, scheduler/event-<color>-focus-halo, for each of sistemas, gerencial, educacao, comercial, financeiro, igrejas and rh"
  event_semantic: "event/<color>-surface, event/<color>-on-surface, event/<color>-indicator, event/<color>-surface-hover, event/<color>-on-surface-hover, event/<color>-focus-border, event/<color>-focus-halo, which the scheduler/event-<color>-* tokens alias"
  month: "scheduler/month-cell-padding-x, scheduler/month-cell-padding-y, scheduler/month-cell-gap, scheduler/more-height"
  list: "scheduler/list-gap, scheduler/list-day-gap, scheduler/list-item-gap, scheduler/list-item-padding"
  compact_month: "scheduler/event-dot, scheduler/event-dot-size, scheduler/event-dot-selected, scheduler/day-selected-background, scheduler/day-selected-foreground"
  empty: "scheduler/empty-gap, scheduler/empty-icon-size"
  focus: "scheduler/focus-border, scheduler/focus-border-width, scheduler/focus-border-radius, scheduler/focus-halo, scheduler/focus-halo-width, scheduler/focus-halo-radius"
  typography: "text/label-sm (the event title), text/caption (the event time), text/label-md and text/label-md-strong (the day numbers and the title of the chosen day), text/heading-sm (the month label on a phone), text/body-md (the list row and the container)"
  other_semantic: "the CSS also reads control/height-default, control/height-compact, icon/size-sm, icon/size-md, radius/control, radius/full, space/inline-tight, space/stack-snug, color/secondary-foreground and icon-button/secondary-ghost-background-hover directly, for the sidebar button, the mini month cell and the calendar dot, where no scheduler/* token has the role"
ai_hints:
  - "Use nph-scheduler to show the events of a calendar over time; to choose a date in a form use the date picker, and for tasks with no time use a list or a table."
  - "Own the data: set events, calendars and labels, and change view and date when nph-view-change and nph-date-change fire. The piece writes them itself when the person acts, and fires nothing when code sets them."
  - "Give every text the piece owes in labels, already localized, including the names read by the screen reader; a missing label renders and says which one."
  - "Write each instant as YYYY-MM-DDTHH:mm and each all-day date as YYYY-MM-DD, with no time zone."
  - "Give each calendar a color of the list: it is the choice of the person and never a status."
  - "Open the detail on nph-event-click: put the content in the detail slot and set open-event to the id; the piece draws the popover, the focus and aria-expanded."
  - "Create and edit events in the screen: nph-new-event and nph-day-click only say the day."
  - "Set a height for the scheduler, or let the screen give it one, so the grid scrolls inside the piece."
  - "Leave the phone alone: below 768 px the piece is the compact month and the same properties work."
accessibility:
  semantics: "A section named by the period label. The event is a button whose name starts with its visible text, the Cancelled: prefix and the title, and carries the whole title, the time when it is written, the date, the time when it is not written, the calendar and, when it applies, cancelled and repeats; with a detail in the slot it has aria-haspopup dialog and aria-expanded. Each day of the grid is a button whose name starts with its visible text, the short weekday and the number, then the full date, with the word for today, and has aria-current date on today. The mini month and the compact month are a grid with column headers, and the list view has one heading per day and a list of rows. The avatars of the meetings carry the names of the people. A polite status announces the new period, and the loading label is a status while loading."
  accessible_name: "The event: the visible text first (the Cancelled: prefix and the title, then the time when the row writes it), then the date, the time when the row does not write it, the calendar, cancelled and repeats, even when the title is cut with an ellipsis. The list row writes the time first, and the name follows. The day: the visible short weekday and number, then the full date, with the word for today. The icon buttons: the previous, next, new event and side panel labels. The view select: the view label."
  keyboard:
    - "Tab and Shift+Tab: the toolbar (sidebar button, Today, previous, next, view select, Filter, New event), then the side panel (mini month and My calendars), then the days from left to right, then the events in start order, left to right at the same start. Each day and each event is a Tab stop."
    - "Enter and Space on an event: hand the click to the screen; with a detail in the slot, open it in the nph-popover and move the focus into it."
    - "Esc with the detail open: close it and return the focus to the event. Esc with the view select or the Filter menu open: close the list and return the focus to the button. With nothing open it does nothing."
    - "Enter and Space on +N more: go to the day view of that date and focus the day."
    - "The arrow keys have no use on the grid. In the mini month and the compact month, the arrows move by day and week, Page Up and Page Down by month, or by year with Shift, and Home and End to the start and the end of the week."
    - "A press outside closes the detail and the focus stays where the person clicked."
  focus: "The day, the event, the month and list rows and the cancelled event show the same border and halo, outside the part, in the color of the event: scheduler/focus-* in primary and scheduler/event-<color>-focus-* in the other colors. The toolbar buttons follow nph-button. Hover only paints the event and moves no focus."
  contrast: "The title and the time of an event meet 4.5:1 on its background in both themes; the bar, the now line and the focus border meet 3:1. Today meets 4.5:1 on the card. The grid lines and the outline of the container are decoration."
  color_alternative: "The cancelled event reads by Cancelled: and the struck title, besides the neutral body. Today reads by the number, the mark at the base of the day header, the now line and the word in the name of the day. The color of an event never carries meaning: the calendar name is in the accessible name."
invalid_combinations:
  - "A view outside work-week, week, day, month and list — the piece draws nothing."
  - "A week-start outside sunday and monday — the piece draws nothing."
  - "A date or a now that does not exist — the piece draws nothing."
  - "An instant with a time zone — the event is left out."
  - "Two events with the same id, or an end before the start — the event is left out."
  - "A calendar color outside primary and the vertical colors — the calendar stays and its events take primary, with an error in development."
  - "A calendar with no name — the calendar is left out, because its checkbox has no text."
  - "educacao and primary together in the brand Educacao — they are the same color."
  - "A color used as a status — the color is the choice of the calendar."
relations:
  combines_with: [nph-popover, nph-button, nph-select, nph-checkbox, nph-avatar, nph-avatar-stack, nph-dropdown-menu, nph-tooltip, nph-skeleton, nph-icon]
  parents: ["a screen", "a page of the product"]
  children: [nph-button, nph-select, nph-option, nph-checkbox, nph-avatar, nph-avatar-stack, nph-popover, nph-dropdown-menu, nph-tooltip, nph-skeleton, nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Choosing a date in a form with the scheduler."
  - "Using the color of an event as a status."
  - "Showing a cancelled event only by color, or taking it out of the grid."
  - "Two primary buttons in the toolbar: New event is the only one."
  - "A divider between events in the week and day views: the line is only on the full hour."
  - "Drawing the detail, or creating and editing the event, inside the piece."
  - "Passing a time with a time zone, or writing the texts of the piece by hand in another place than labels."
  - "Relying on the arrow keys on the grid: each day and each event is a Tab stop."
sources:
  design_md: "design.md, the scheduler/* tokens and the event/<color>-* tokens, the colors they point to and the global focus/* tokens"
  decision: "P120 — nph-scheduler: API and semantics"
  tests: "src/components/nph-scheduler/nph-scheduler.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-scheduler/nph-scheduler.stories.ts and nph-scheduler.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-scheduler documentation 6151:11160, sets 6142:1744 and 6141:9258"
---

# nph-scheduler

## Function

**The problem it solves:** shows the calendar of a person or a group as events over time, so the
person sees what is coming, finds a time and opens an event. It serves a school, a church and an
office, which plan by week and by month. The piece hands the click on the event to the screen:
opening the detail, creating and editing an event belong to the product.

The piece is one tag, `nph-scheduler`. The toolbar, the side panel, the day header, the all-day
band, the time column, the day grid, the now line, the event, the month cell, the month line, the
list row and the compact month are inner parts, drawn in its shadow root. The event is the Figma
`nph-scheduler · evento`; it opens the `nph-popover` through `for`, which looks the trigger up in the
same root as the popover, so the events and the popover live together. `nph-calendar` stays the
name of the date grid of the date picker.

**When to use:**

- The person needs to see what is coming in a week, a day or a month and to find a free time: the
  work week with the side panel, the view the piece opens in.
- The person plans by the month: the month view, with a row per event and `+N more` when they do
  not fit.
- The person reads in sequence, or uses a screen reader: the list view.
- The screen is a phone: below 768 px of the width of the element the piece is the compact month
  with the list of the chosen day.
- Several calendars share one grid and the person turns each one on and off in My calendars.
- The screen opens the detail of an event beside it: the content goes in the `detail` slot.

**When NOT to use:**

- **To choose a date in a form** — use the date picker.
- **For tasks with no time of day** — use a list or a table.
- **To mark an event by status** — the color of an event is the choice of the calendar, never
  error, warning or success.
- **To show a cancelled event only by color** — the piece writes `Cancelled:` and strikes the title.
- **To open the detail, create or edit an event inside the piece** — that belongs to the screen.
- **For past or tentative events, a time scale or arrow keys on the grid** — they are outside this
  version.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| `view` | `work-week`, `week`, `day`, `month`, `list` | `work-week`, the default, to answer what the person has this week; `week` when the weekend matters; `day` for one day in hours; `month` to plan; `list` to read in sequence |
| Screen | desktop, phone | Desktop when the element is 768 px wide or more; phone below that, the compact month with the list of the chosen day. It is read from the element, not from the window |
| Side panel | shown, hidden (`hide-side-panel`) | Shown by default in every desktop view; hidden when the screen needs the width |
| Event `color` | `primary`, `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh` | The color of the calendar of the event, equal in every brand; `primary` when the calendar has none |
| Event type | one hour, short, long, recurring, all day | The height comes from the duration, never below the minimum target; the recurring event adds the repeat icon |
| `week-start` | `sunday`, `monday` | `sunday` by default; `monday` when the people of the screen start the week there |

The Figma properties are `vista` and `tamanho-de-tela` (`desktop`, `celular`), `estado` and the
boolean `lateral` for the scheduler, and `cor`, `tipo` and `estado` for the event. In code, the
state comes from what the screen sets (`loading`, `events`, `open-event`) and from the person.

**By density:** `not_applicable`.

**Do not combine with:** a color as a status; `educacao` together with `primary` in the brand
Educacao, where they are the same color; another view on a phone, where the compact month stays.

## States

The scheduler has the default, empty and loading states, and the keyboard focus on a day.

| State | Token | What changes for the person |
|---|---|---|
| default | `scheduler/background`, `scheduler/border` | The toolbar, the optional side panel and the period, with today marked |
| empty | `scheduler/empty-gap`, `scheduler/day-label-foreground` | A period with no visible event: the calendar icon, the title and the hint; the toolbar stays active |
| loading | `scheduler/month-cell-gap`, `scheduler/event-padding-x` | Skeleton rows in the place of the events; the toolbar stays active and the week keeps its days |
| day focus | `scheduler/focus-border`, `scheduler/focus-halo` | The border and the halo on the day header, in the week and day views, or on the cell, in the month |

The event has its own states.

| State | Token | What changes for the person |
|---|---|---|
| default | `scheduler/event-background`, `scheduler/event-foreground`, `scheduler/event-indicator` | The body, the bar at the start, the title and, when it fits, the time |
| hover | `scheduler/event-background-hover`, `scheduler/event-foreground-hover` | Painted one tone above; no focus and no detail |
| focus | `scheduler/focus-border`, `scheduler/focus-halo`, `scheduler/event-<color>-focus-border` | The border and the halo outside the body, in the color of the event |
| open | `scheduler/event-background-hover` | The same background as hover, `aria-expanded` true and the popover beside it |
| cancelled | `scheduler/event-cancelled-background`, `scheduler/event-cancelled-border`, `scheduler/event-cancelled-foreground` | Neutral, outlined, no bar, `Cancelled:` before the struck title |
| cancelled focus | `scheduler/focus-border`, `scheduler/focus-halo` | The border and the halo go outside the neutral outline, in the color of the event |

**Combined states (rule T11):** the scheduler has neither disabled nor error, so the rule does not
apply. The cancelled event with focus is drawn: border and halo outside the neutral outline. The
open event and the hovered event share one background.

**Business rule the piece carries:** the screen owns the data, the view and the date; the piece
fires an event when the person acts and fires nothing when code sets a property. The color of an
event is the color of its calendar and never a status.

**Domain error states:** a view, a week start, a date or an instant that does not exist, which
draw nothing; an event, or a calendar with no id, a repeated id or no name, which is left out; a calendar color outside the list, which keeps the calendar with primary; a label that is
missing, which renders and says which. All with `console.error` in development, one per cause.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A section named by the period label. The event is a button; with a detail in the slot it has `aria-haspopup="dialog"` and `aria-expanded`. Each day is a button with its full name. The mini month and the compact month are a grid; the list view has a heading per day. A polite status announces the new period |
| Accessible name | The event starts with its visible text (`Cancelled:` and the title, then the time when it is written), then the date, the time when it is not written, the calendar, `cancelled` and `repeats`, even when the title is cut; the list row writes the time first. The day starts with the visible short weekday and number, then the full date, with the word for today. The avatars: the names of the people |
| Keyboard | Tab goes through the toolbar, the side panel, the days from left to right and the events in start order; each day and each event is a Tab stop. Enter or Space opens the detail; Esc closes it and gives the focus back to the event. No arrow keys on the grid; the arrows, Page Up, Page Down, Home and End work in the mini month and the compact month |
| Focus | The same border and halo on the day, the event, the month and list rows and the cancelled event, in the color of the event. The toolbar buttons follow `nph-button` |
| Contrast | The title and the time meet 4.5:1 in both themes; the bar, the now line and the focus border meet 3:1; the grid lines and the outline are decoration |
| Alternative to color | `Cancelled:` and the strike; the number, the mark and the now line for today; the calendar name in the accessible name |
| Target size | The event has a minimum height of 24 px: the short event takes a little more than its duration (WCAG 2.5.8) |
| Live region | One polite status announces the new period when the person changes the date or the view; the loading label is a status while loading |
| Provisional | The sidebar button keeps the place of the `sidebar` icon with an `nph-skeleton`; it is a native button with the look of the secondary ghost, with `aria-expanded` and a tooltip |

## Relations

**Combines with:** `nph-popover`, `nph-button`, `nph-select`, `nph-checkbox`, `nph-avatar`,
`nph-avatar-stack`, `nph-dropdown-menu`, `nph-tooltip`, `nph-skeleton` and `nph-icon`.

**What is the parent:** a screen of the product.

**What is the child:** `nph-button` (Today, previous, next, Filter, New event, `+N more` and the
buttons of the mini month), `nph-select` (the view), `nph-checkbox` (one per calendar),
`nph-avatar` and `nph-avatar-stack` (the people), `nph-popover` (the detail), `nph-dropdown-menu`
(the Filter menu), `nph-tooltip`, `nph-skeleton` and `nph-icon`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Container and side panel | `scheduler/background`, `scheduler/border`, `scheduler/border-width`, `scheduler/radius`, `scheduler/padding`, `scheduler/sidebar-gap` |
| Toolbar | `scheduler/toolbar-padding-y`, `scheduler/toolbar-gap` |
| Day header and today | `scheduler/day-*`, `scheduler/today-*` |
| Time grid and now line | `scheduler/time-*`, `scheduler/grid-line`, `scheduler/now-*` |
| Event, primary | `scheduler/event-*`, `scheduler/event-cancelled-*` |
| Event, other colors | `scheduler/event-<color>-*`, which alias `event/<color>-*` |
| Month and list | `scheduler/month-*`, `scheduler/more-height`, `scheduler/list-*` |
| Compact month | `scheduler/event-dot*`, `scheduler/day-selected-*` |
| Empty | `scheduler/empty-*` |
| Focus | `scheduler/focus-*` |
| Typography | `text/label-sm`, `text/caption`, `text/label-md`, `text/label-md-strong`, `text/heading-sm`, `text/body-md` |

**Usage restrictions:** the component does not choose size, color or radius: everything comes from
a token, and each color of an event is bound to its own `scheduler/event-<color>-*`, never to the
semantic token it points to. The piece has no shadow: in dark mode the elevation is the background,
`color/card` over `color/background`. The CSS also reads a few semantic tokens directly, for the
sidebar button, the cell of the mini month and the calendar dot, where no `scheduler/*` token has
the role; they are listed in the YAML. The height of the hour is twice the minimum height of an
event, so a half hour fits the minimum.

**Provisional parts:** the mini month and the compact month are the date grid of the scheduler
itself, until the date picker has its grid; the sidebar button draws an `nph-skeleton` where the
`sidebar` icon goes, until the icon enters `nph-icon`; the empty state uses its own `calendar`
icon, title and hint, until `nph-empty` has its set in Figma; the repeat icon is `rotate-right`
until `repeat` enters `nph-icon`.

**AI hints:**

- Use `nph-scheduler` to show the events of a calendar over time; to choose a date use the date
  picker, and for tasks with no time use a list or a table.
- Own the data: set `events`, `calendars` and `labels`, and follow `view` and `date` with
  `nph-view-change` and `nph-date-change`.
- Give every text the piece owes in `labels`, already localized.
- Write each instant as `YYYY-MM-DDTHH:mm` and each all-day date as `YYYY-MM-DD`, with no time
  zone.
- Give each calendar a color of the list; it is never a status.
- Open the detail on `nph-event-click`: content in the `detail` slot and `open-event` set to the
  id.
- Create and edit events in the screen.
- Give the scheduler a height, so the grid scrolls inside it.

## Examples

**Recommended case:** the work week with the side panel, a calendar per color, the now line in
today's column, an all-day event in the band and a cancelled event; the screen listens to
`nph-event-click` and puts the detail in the slot.

**Alternative case:** the month view with `+N more` in a busy day; the list view for reading in
sequence; the empty week with the toolbar active; the compact month with the list of the day on a
phone; the open event with the popover beside it.

## Anti-patterns

- **Do not choose a date in a form with the scheduler** — use the date picker.
- **Do not use the color of an event as a status** — it is the choice of the calendar.
- **Do not show a cancelled event only by color, or take it out of the grid.**
- **Do not put two primary buttons in the toolbar** — New event is the only one.
- **Do not draw a divider between events** — the line is only on the full hour.
- **Do not draw the detail, or create and edit events, inside the piece.**
- **Do not pass a time with a time zone**, and do not write the texts of the piece anywhere but
  `labels`.
- **Do not rely on arrow keys on the grid** — each day and each event is a Tab stop.
- **Invalid combinations:** a view or a week start outside the lists; a date or an instant that does
  not exist; a repeated event `id`; a calendar with no name; a calendar color outside the list (the
  calendar stays, with primary).
- **Do not create without a decision:** an event status, a past or tentative event, a time scale,
  arrow keys on the grid, or a token, new or changed.

## Sources and decisions

- **The repository `design.md`:** the `scheduler/*` tokens and the `event/<color>-*` tokens, the
  colors they point to and the global `focus/*` tokens.
- **The decision that originated it:** P120 — `nph-scheduler`: API and semantics. The documentation
  was accepted in Figma (frame `6151:11160`, sets `6142:1744` and `6141:9258`); the property names,
  the data by property, the events, the slots, the labels and the keyboard order are a technical
  proposal of this implementation.
- **Tests:** `src/components/nph-scheduler/nph-scheduler.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-scheduler/nph-scheduler.stories.ts` (Validation) and
  `nph-scheduler.docs.stories.ts` (Docs).
- **Figma:** `nph-scheduler` documentation frame (`6151:11160`), sets `6142:1744` and `6141:9258`,
  in `DS-IA-NEPHOS 5.0`.
