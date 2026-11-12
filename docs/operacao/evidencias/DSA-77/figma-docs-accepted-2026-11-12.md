```json
{
  "task": "DSA-77",
  "gate": "figma-docs-accepted",
  "date": "2026-11-12",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6151-11160",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner accepted the nph-scheduler documentation frame (6151:11160, page 1363:2), with COMPONENT_SET nph-scheduler (6142:1744) and COMPONENT_SET nph-scheduler event (6141:9258), with the Figma UX QA and the textual audit approved, and answered the twelve points of the approval page: the event color property with primary and the seven vertical colors, equal in every brand, with 7 semantic tokens and 7 component tokens per color; the name nph-scheduler and the tokens scheduler/*, keeping nph-calendar for the date grid of the date-picker; the extended descriptions of color/border-subtle and core/space/900 and scheduler/now-indicator-size on core/space/200; the container padding on space/container-padding; the minimum event height of 24 px on core/target-size/minimum; the same focus border and halo on the day, on the month and list rows and on the cancelled event; every event as a Tab stop, with no arrow keys on the grid; \"+N more\" going to the day view of that date, the week starting on Sunday with Monday available, and the chosen day of the mobile month filled as in the date-picker grid; the provisional pieces until the owner piece exists (mini month by instance of the date-picker grid, own empty icon and text until the nph-empty has a set, the repeat icon rotate-right until repeat enters the nph-icon); the focus of the primary nph-button in dark mode corrected in the owner piece, outside this task; past and tentative events outside v1, loading with nph-skeleton rows and empty and loading of the week with the seven days; the side panel valid for every desktop view, opened and closed by the same button. The specification, converted to text, is in the rest of this file."
  }
}
```

# DSA-77 — `figma-docs-accepted`

The documentation of the nph-scheduler (frame `6151:11160`, `4. DOCUMENTAÇÃO`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The nph-scheduler is a calendar of events in the work week (default), week, day, month and list views, on desktop and mobile, with an optional side panel (mini month and "My calendars") in every desktop view, a toolbar and the inner piece **event**. Its tokens came with this task and are on `v/5.0.0`.

Naming, by decision: the piece is `nph-scheduler` and its tokens are `scheduler/*`. The name `nph-calendar` stays for the date grid of the date-picker. The inner piece is `nph-scheduler · evento` in Figma and "event" in the prose.

What changed in the tokens with this task:

- New semantic group `event/<color>-*`: for each of the seven vertical colors (`sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh`), the roles `surface`, `on-surface`, `indicator`, `surface-hover`, `on-surface-hover`, `focus-border` and `focus-halo`. They point to the `core` color scale of each vertical, equal in every brand, by mode (table below). The primary color needs no new token: it uses the existing `color/primary-*` and `focus/*` tokens.
- New component group `scheduler/*`, in the semantic collection. Every token is an alias of an existing semantic token or of an `event/<color>-*` token, except two that point straight to core by decision: `scheduler/time-column-width` to `core/space/900` and `scheduler/now-indicator-size` to `core/space/200`. No new value entered the core (rule T9).
- Extended `use` of semantic tokens in `design.md`, where the accepted Figma uses them, and an entry for each `event/<color>-*` token. The description of `color/border-subtle` now covers the container outline, the grid lines and the cancelled event outline. The core scale entries are one-line entries without a description field, so the width rule of `core/space/900` (fixed width of a column in a table or in the scheduler) is recorded here and in the token table.
- Left without a component token: the pieces by instance use their own tokens (nph-button, nph-icon-button, nph-select, nph-checkbox, nph-avatar-stack, nph-popover, nph-skeleton, nph-icon, the date-picker grid in the mini month). The typography comes from text styles: `text/label-sm` for the event title, `text/caption` for the time. No shadow style: in dark mode the elevation is the background, `color/card` over `color/background`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. Names of the pieces in Portuguese are between backticks only here; in the prose they are in English.

## Purpose

Shows the calendar of a person or a group so they see what is coming, find a time and open an event. It serves a school, a church and an office, which plan by week and by month. The scheduler hands the click on the event to the screen: opening the detail, creating or editing an event belongs to the product.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-scheduler (`nph-scheduler`) | `6142:1744` | `vista` (work week, week, day, month, list) × `tamanho-de-tela` (desktop, mobile) × `estado` (default, empty, loading, day focus, event focus); boolean `lateral` (side panel). |
| nph-scheduler event set (`nph-scheduler · evento`) | `6141:9258` | `cor` (primary and the seven vertical colors) × `tipo` (1 h, short, long, recurring) × `estado` (default, hover, focus, open, cancelled, cancelled focus). |

The mini month is an instance of the date-picker grid. The toolbar buttons, the view select, the checkboxes, the avatar stack, the skeleton rows and the popover come by instance of the approved pieces. The matrix of the variants is in the frame `6151:11164`.

## Tokens

The first table lists the semantic group `event/<color>-*`. In every row, `<color>` is one of the seven verticals. The light value and the dark value point to the `core` scale of the same vertical.

| Token | Light | Dark | Function |
|---|---|---|---|
| `event/<color>-surface` | `core/<color>/50` | `core/<color>/900` | Background of the event. |
| `event/<color>-on-surface` | `core/<color>/700` | `core/<color>/100` | Title and time of the event. Required pair of `surface`. |
| `event/<color>-indicator` | `core/<color>/700` | `core/<color>/100` | Bar at the start of the event. |
| `event/<color>-surface-hover` | `core/<color>/100` | `core/<color>/800` | Event in hover and open, one tone above the surface. |
| `event/<color>-on-surface-hover` | `core/<color>/800` | `core/<color>/100` | Title and time in hover and open. Required pair of `surface-hover`. |
| `event/<color>-focus-border` | `core/<color>/700` | `core/<color>/100` | Focus border; it is the part that meets 3:1. |
| `event/<color>-focus-halo` | `core/<color>/200` | `core/<color>/700` | Focus halo, outside the border; decoration. |

Measured contrast: title and time 4.64:1 to 12.17:1 in light; hover title and time 7.68:1 to 12.60:1 in both modes; focus border 4.96:1 to 16.62:1 in light and 10.85:1 to 14.03:1 in dark, on the card. The color is the choice of the person for each calendar. It never means status. In the `Educacao` brand, `educacao` equals `primary`: do not use both together.

The second table lists the component group `scheduler/*` (primary color and structure). For each of the seven colors there is also `scheduler/event-<color>-background`, `-foreground`, `-indicator`, `-background-hover`, `-foreground-hover`, `-focus-border` and `-focus-halo`, each an alias of the `event/<color>-*` token of the same role (surface, on-surface, indicator, surface-hover, on-surface-hover, focus-border, focus-halo). The `<color>` value `primary` takes `scheduler/event-*` and `scheduler/focus-*` from the table below.

Each component token points to the semantic token that already has the function.

| Token | Points to | Where it is used, and why |
|---|---|---|
| `scheduler/border` | `color/border-subtle` | Outline of the scheduler container (1 px). |
| `scheduler/grid-line` | `color/border-subtle` | Grid line on the full hour in the week and day views, and the lines of the month grid. Decoration; there is no divider between events. |
| `scheduler/event-background` | `color/primary-surface` | Event body, primary color. |
| `scheduler/event-foreground` | `color/primary-on-surface` | Event title and time, primary color. |
| `scheduler/event-background-hover` | `color/primary-surface-hover` | Event in hover and open (same background, by decision). |
| `scheduler/event-foreground-hover` | `color/primary-on-surface-hover` | Event title and time in hover and open. |
| `scheduler/event-indicator` | `color/primary-border` | Bar at the start of the event, full height of the body. Absent in the cancelled event. |
| `scheduler/event-indicator-width` | `core/focus-width/sm` | Thickness of the event bar. |
| `scheduler/event-radius` | `radius/control` | Corner of the event body. |
| `scheduler/event-min-height` | `core/target-size/minimum` | Minimum height of an event (24 px, WCAG 2.5.8); the short event takes a little more than its duration. |
| `scheduler/event-padding-x` | `space/inline` | Side padding of the event content. |
| `scheduler/event-padding-y` | `space/inline-tight` | Top and bottom padding of the event content. |
| `scheduler/event-gap` | `space/inline-tight` | Gap between title and repeat icon. |
| `scheduler/event-icon-size` | `icon/size-sm` | Repeat icon of the recurring event. |
| `scheduler/event-border-width` | `border/width` | Neutral outline of the cancelled event. |
| `scheduler/event-cancelled-background` | `color/card` | Cancelled event body. |
| `scheduler/event-cancelled-border` | `color/border-subtle` | Cancelled event outline. |
| `scheduler/event-cancelled-foreground` | `color/muted-foreground` | Cancelled event title and time, struck through, with the "Cancelled:" text. |
| `scheduler/event-dot` | `color/primary-border` | Event dot of the month cell and of the compact mobile month. |
| `scheduler/event-dot-selected` | `color/primary-on-surface` | Event dot on the selected day. |
| `scheduler/time-column-width` | `core/space/900` | Fixed width of the time column in the week and day views. |
| `scheduler/time-foreground` | `color/muted-foreground` | Hour labels of the time column. |
| `scheduler/today-foreground` | `color/primary-text` | Number and name of today in the day header. |
| `scheduler/today-indicator` | `color/primary-border` | Today mark at the base of the day header. |
| `scheduler/today-indicator-width` | `core/focus-width/sm` | Thickness of the today mark. |
| `scheduler/now-indicator` | `color/primary-border` | Now line in the column of today. |
| `scheduler/now-indicator-width` | `core/focus-width/sm` | Thickness of the now line. |
| `scheduler/now-indicator-size` | `core/space/200` | Dot at the start of the now line. |
| `scheduler/now-foreground` | `color/primary-text` | Current time in the time column, centered on the now line. |
| `scheduler/background` | `color/card` | Container background. |
| `scheduler/radius` | `radius/surface` | Corner of the container. |
| `scheduler/border-width` | `border/width` | Thickness of the container outline. |
| `scheduler/padding` | `space/container-padding` | Breathing room of the container and of the side panel. |
| `scheduler/toolbar-padding-y` | `space/control-padding` | Top and bottom padding of the toolbar. |
| `scheduler/toolbar-gap` | `space/inline` | Gap between the toolbar items. |
| `scheduler/sidebar-gap` | `space/stack` | Gap between the mini month and "My calendars". |
| `scheduler/foreground` | `color/foreground` | Default text of the scheduler. |
| `scheduler/day-label-foreground` | `color/muted-foreground` | Weekday name in the day header and the month header. |
| `scheduler/day-label-padding-y` | `space/inline-tight` | Top and bottom padding of the weekday label. |
| `scheduler/day-header-gap` | `space/inline` | Gap between name, number and the avatar stack in the day header. |
| `scheduler/day-padding` | `space/inline` | Padding of the day (day header and month cell number). |
| `scheduler/day-radius` | `radius/control` | Corner of the day, also of its focus. |
| `scheduler/day-selected-background` | `color/primary-surface` | Selected day of the compact mobile month. |
| `scheduler/month-cell-padding-x` | `space/inline-tight` | Side padding of the month cell. |
| `scheduler/month-cell-padding-y` | `space/inline` | Top and bottom padding of the month cell. |
| `scheduler/month-cell-gap` | `space/inline-tight` | Gap between the event rows of the month cell. |
| `scheduler/more-height` | `control/height-compact` | Height of the "+N more" button. |
| `scheduler/list-gap` | `space/stack` | Gap between the days of the list view. |
| `scheduler/list-day-gap` | `space/inline` | Gap between the day heading and its rows. |
| `scheduler/list-item-gap` | `space/inline` | Gap between time and title in a list row. |
| `scheduler/list-item-padding` | `space/inline-tight` | Padding of a list row. |
| `scheduler/empty-gap` | `space/inline` | Gap between icon and text of the empty state. |
| `scheduler/empty-icon-size` | `icon/size-sm` | Icon of the empty state. |
| `scheduler/focus-border` | `focus/border` | Focus border (primary color) of the day, of the event, of the month and list rows, and of the cancelled event. |
| `scheduler/focus-border-width` | `border/width` | Thickness of the focus border. |
| `scheduler/focus-border-radius` | `focus/border-radius-control` | Corner of the focus border. |
| `scheduler/focus-halo` | `focus/halo` | Focus halo outside the border; decoration. |
| `scheduler/focus-halo-width` | `focus/ring-width` | Thickness of the focus halo. |
| `scheduler/focus-halo-radius` | `focus/radius-control-with-border` | Corner of the focus halo. |

Width and size rules: `scheduler/time-column-width` points straight to `core/space/900` (fixed width of a column of hours; no semantic token has the function of a fixed column width, and the description of `core/space/900` now says so). `scheduler/now-indicator-size` points to `core/space/200` (dot of the now line). The container padding stays on `space/container-padding`, by decision.

## Anatomy

From top to bottom and from left to right. Anatomy of the scheduler:

1. **Container** — background `scheduler/background`, outline of 1 px in `scheduler/border`, corner `scheduler/radius`. Side panel at the start and main area at the end, aligned to the top.
2. **Side panel (optional)** — turned on and off by the `lateral` property, in every desktop view. Mini month on top and "My calendars" below, stacked at the top and at the start, with margin `scheduler/padding` and gap `scheduler/sidebar-gap`. The width hugs the mini month.
3. **Toolbar** — at the top of the main area, items centered vertically. At the start: sidebar button, "Today", previous, next and the period label, which takes the free space. At the end: view select, "Filter" and "New event".
4. **Day header** — empty corner over the time column. In each day, name and number at the start and the people of the meetings of the day (`nph-avatar-stack`) at the end, centered vertically. Today has the number in `scheduler/today-foreground` and the today mark at the base of the day header (`scheduler/today-indicator`, `scheduler/today-indicator-width`).
5. **All-day band** — label in the time column, at the start; all-day and multi-day events in one bar, aligned to the top of the band.
6. **Time column** — at the start of the grid, with the full hour at the top of each hour slot, in `scheduler/time-foreground`, width `scheduler/time-column-width`.
7. **Day grid** — one column per day. In the week and day views the line is only on the full hour, in `scheduler/grid-line`, with no divider between events. Events are placed by time, aligned to the start of the column; simultaneous events sit side by side.
8. **Now line** — line `scheduler/now-indicator` of `scheduler/now-indicator-width` in the column of today, with the dot of `scheduler/now-indicator-size` at the start of the line, on the left edge of the day column, and the current time in `scheduler/now-foreground` in the time column, centered on the line height.
9. **Event** — instance of the event set, below.

Anatomy of the event:

1. **Body** — `scheduler/event-background`, corner `scheduler/event-radius`, minimum height `scheduler/event-min-height`. Bar at the start and content at the end, aligned to the top.
2. **Bar** — strip at the start, full height of the body, `scheduler/event-indicator` of `scheduler/event-indicator-width`. It disappears in the cancelled event.
3. **Content** — margin `scheduler/event-padding-x` at the sides and `scheduler/event-padding-y` on top and bottom. Title on top and time below, aligned to the top and to the start.
4. **Title and icon** — title in `text/label-sm`, one line, ellipsis when it does not fit. In the recurring event the repeat icon follows the title, in `scheduler/event-icon-size`, same color as the title, with gap `scheduler/event-gap`.
5. **Time** — below the title, in `text/caption`. It shows when the event has height for two lines. In the short event only the title stays; the time goes to the accessible name and to the detail.

The cancelled event has `scheduler/event-cancelled-background`, a neutral outline of `scheduler/event-border-width` in `scheduler/event-cancelled-border`, the title struck through with the text "Cancelled:" before it, in `scheduler/event-cancelled-foreground`, and no bar.

The compact mobile month shows the month grid with an event dot per day (`scheduler/event-dot`, `scheduler/event-dot-selected` on the selected day) and the list of the chosen day below. The chosen day is filled as in the date-picker grid (`scheduler/day-selected-background`).

## Properties

| Field | Rule |
|---|---|
| `vista` | work week (default), week, day, month and list. The view select in the toolbar changes the value. |
| `tamanho-de-tela` | desktop (default) and mobile. Under 768 px of width the scheduler becomes the compact month with the list of the day. The break is to be confirmed by the code. |
| `estado` | default, empty, loading, day focus and event focus. Empty and loading change only the events area; the toolbar stays active. Day focus and event focus show the keyboard focus on the day and on the event rows. |
| `lateral` | yes (default) or no. Shows or hides the side panel in every desktop view; the sidebar button in the toolbar toggles the same panel. |
| event `tipo` | 1 h (default), short, long and recurring. It shows the height and the icon of each case; in the code the height comes from the duration of the event. |
| event `estado` | default, hover, focus, open, cancelled and cancelled focus. |
| event `cor` | `primary` (default) and the seven vertical colors. The person chooses the color of each calendar; it is equal in every brand and does not mean status. Light: surface 50, text and bar 700; dark: surface 900, text and bar 100; hover and open one tone above. |
| Not a property | First day of the week (Sunday by default, Monday available) and time scale (outside v1). The now line shows when today is in the period shown. |
| Combined states | Rule T11 does not apply: the scheduler has neither disabled nor error. The cancelled event with focus is drawn: border and halo outside the neutral outline, in the color of the event. |

## Relations

| Piece | How it relates |
|---|---|
| `nph-date-picker` | The mini month is the date-picker grid, by instance (provisional until the owner piece exists). To choose a date in a form, use the date-picker, not the scheduler. |
| `nph-popover` | Opens the detail of the event at its side, at `popover/offset`. The event is the trigger; the popover has no button of its own. |
| `nph-button` | "Today" and "Filter" in secondary solid, "New event" in primary and the "+N more" of the month. By instance, with no override of background or outline. |
| `nph-icon-button` | Previous, next and the sidebar button, in secondary ghost. |
| `nph-select` | View select in the toolbar, with the options of the `vista` property. |
| `nph-checkbox` | One per calendar in "My calendars", to show or hide the events of that calendar. |
| `nph-avatar-stack` | The people of the meetings of the day, in the day header and in the list view, small size. |
| `nph-skeleton` | Loading state: rows in the place of the events. |
| `nph-empty` | Empty state. Until the nph-empty has a set, the empty state uses its own icon and text. |
| `nph-dropdown-menu` | Menu of "Filter", when it opens as a menu, at `space/inline-tight` from the button. |
| `nph-icon` | All icons. The repeat icon is `rotate-right` until `repeat` enters the nph-icon. |

## When to use

| Situation | Choice |
|---|---|
| See appointments | The work week with the side panel, to see the week and change the day in the mini month. |
| Plan the month | Month view: events in a row per day, with "+N more" when they do not fit. |
| Read in sequence | List view, also the best with a screen reader. |
| Mobile | `celular` size: compact month and the list of the chosen day. |
| Choose a date | Do not use the scheduler: use the date-picker. |
| Tasks with no time | Do not use the scheduler: use a list or a table. |

Required examples (light and dark): the work week with the side panel; the month on mobile with the list of the day; the empty week with the toolbar active; the list view; the open event with the popover and the "+N more" in default, hover and focus; the focus and the states of the event.

## Do

| Do | Why |
|---|---|
| Work week on entry | It is the view that best answers "what do I have this week" on desktop; the person changes it in the select. |
| The whole title in the data | The grid cuts with an ellipsis; the accessible name and the detail show the whole title. |
| Cancelled with text | Keep the event in the grid, with "Cancelled:" and the struck title, so the person knows it existed. |
| One primary in the toolbar | "New event" is the only primary action; "Today" and "Filter" are secondary solid. |
| List for reading | Offer the list view to whoever reads in sequence or uses a screen reader. |

## Do not

| Do not | Why |
|---|---|
| Cancelled only by color | Without "Cancelled:" and the strike, the neutral background says nothing to whoever does not see the color difference (WCAG 1.4.1). |
| Two primaries in the toolbar | "Today" in primary competes with "New event"; the toolbar loses the main action. |
| Status color on the event | Red, yellow and green mean error, warning and success; the color of the event is only the choice of the person. |
| Divider between events | In the week and day views the grid has a line only on the full hour; the space separates the events (soft style). |
| Scheduler to choose a date | In a form, use the date-picker. |

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | Title and time of the event (`color/primary-on-surface` on `color/primary-surface`): 4.64:1 to 12.17:1 in light and 13.43:1 to 13.94:1 in dark, across the brands. Today (`color/primary-text` on `color/card`): 8.11:1 to 16.62:1 in light and 6.52:1 to 10.73:1 in dark. The event bar and the now line (`color/primary-border`) pass 3:1 over the event and the card (WCAG 1.4.11). Grid lines and container outline are decoration. |
| visible focus | The focused event gets the focus border (`scheduler/focus-border`, `scheduler/focus-border-width`) outside the body and the halo (`scheduler/focus-halo`). Border and halo follow the color of the event: in primary, the brand focus; in the other colors, the tone of the color itself. The border meets the 3:1: 5.37:1 in the default brand and 4.14:1 in the worst brand (Gerencial, dark, on `color/card`). The same focus applies to the day (day header in the week and day views, cell in the month), to the event rows of the month and the list and to the cancelled event. The toolbar buttons follow the nph-button focus. |
| color is not the only signal | The cancelled event reads by the "Cancelled:" text and the struck title, besides the neutral background. Today reads by the color of the number, the mark at the base of the day header and the now line, and goes in the accessible name of the day. |
| accessible name | The event is a button. The name carries the whole title, the date, the time, the calendar and, when it applies, "cancelled" and "repeats". A title cut with an ellipsis stays whole in the accessible name and in the detail. Days carry the full name (weekday, month and day in full); the avatar group carries the names of the people. |
| open | The open event has the same background as hover (inherited decision). What says it is open is the visible popover beside it and `aria-expanded="true"` on the event. |
| target | The event has a minimum height of 24 px (WCAG 2.5.8): the short event takes a little more than its duration in the hour grid. The toolbar buttons follow the nph-button and the nph-icon-button. |
| keyboard | Tab goes through the toolbar, the side panel, the days and the events in time order; each event is a Tab stop. Enter or Space opens the detail; Esc closes it and returns the focus to the event. On the grid the arrow keys have no use; in the mini month the arrows of the date-picker grid apply. |
| dark theme | Outline and lines in white at 10% (`color/border-subtle` in dark) and elevation by the background: `color/card` over `color/background`, with no shadow. |

## Behavior

The scheduler hands the click on the event to the screen. The detail, the creation and the editing belong to the product.

| Key or situation | What happens |
|---|---|
| Tab and Shift+Tab | Goes through the toolbar (sidebar button, Today, previous, next, view select, Filter, New event), then the side panel (mini month and "My calendars") and the events of the grid, in start order; at the same time, left to right. Each event is a Tab stop, as in FullCalendar. Days are also Tab stops. This is a deliberate deviation from the APG grid (a single stop with arrow keys), decided by the design owner; arrow keys on the grid stay for later. |
| Arrow keys on the scheduler grid | No use in v1 (same deviation). Inside the mini month, the arrows, Page Up, Page Down, Home and End of the date-picker grid apply. |
| Enter or Space on the event | Opens the detail in the nph-popover beside the event, with `aria-expanded="true"`; the focus goes to the first focusable item of the detail. |
| Esc | With the detail open: closes it and returns the focus to the event. With the view select or the menu of "Filter" open: closes the list and returns the focus to the button. With nothing open: does nothing. |
| Click outside | Closes the detail; the focus stays where the person clicked. |
| Enter or Space on "+N more" | Goes to the day view of that date. |
| Pointer and focus | Hover only paints the event (`scheduler/event-background-hover`); it does not move the focus or open the detail. |
| Near the window edge | The detail flips to the other side of the event and shrinks when height is missing, as the nph-popover. |
| Title that does not fit | Cut on one line with an ellipsis; the whole title goes in the accessible name and in the detail. |
| Scroll | On a short desktop the toolbar and the day header stay in place and only the grid scrolls. The code confirms it. |
| Mobile | Under 768 px of width the scheduler changes to the `celular` size. The code confirms the break. |
| Now line | Follows the current time when today is in the period shown. The update interval stays with the code. |
| Week start | Sunday by default; Monday available. |
| Empty and loading | The toolbar stays active. Loading shows nph-skeleton rows in the place of the events, in lines; empty and loading of the week keep the seven days. |
| Past and tentative events | Outside v1. |
| Side panel | Valid in every desktop view; the sidebar button opens and closes the same panel. |
| Code | Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest. |

Combined states (rule T11):

- Disabled and error: do not apply; neither the scheduler nor the event has them.
- Cancelled with focus: the focus border and the halo go outside the neutral outline, in the color of the event (`scheduler/focus-*`, and `scheduler/event-<color>-focus-*` per color).
- Open and hover: the same background (`scheduler/event-background-hover`).

Limits:

| Case | Rule |
|---|---|
| Event height | Minimum 24 px; the short event takes a little more than its duration. |
| Simultaneous events | Side by side in the day column; the title is cut with an ellipsis and goes whole to the accessible name. |
| Many events in a month cell | The cell shows the rows that fit and "+N more", which goes to the day view. |
| Color | One of the seven verticals or primary, by calendar; never status. In `Educacao`, `educacao` equals `primary`: do not use both together. |
| Past and tentative events | Outside v1. |

Inherited decisions:

- Follows DSA-64 D-1: the secondary solid uses the same background inside and outside a dialog (`button/secondary-solid-background`); the scheduler does not redefine it.
- Follows DSA-47 D1 and DSA-52 D1: in hover-active the icon of the nph-button and of the nph-icon-button changes to solid; at rest it is light.
- Follows DSA-25 D1, D2 and D3: the "+N" count of the nph-avatar-stack uses `text/label-sm` in the small size, in `color/muted-foreground`, overlaps by `avatar/overlap`, with no extra ring.
- Follows DSA-24 D4: the avatar carries `border/width` in `color/border`, inside.
- Follows DSA-29 D3 and D5: in the view select, the label on one line with an ellipsis, and the chosen option in `color/primary-surface` with the check.
- Follows DSA-67 D-1: the detail of the event in the nph-popover stays at `popover/offset` from the event.
- Follows DSA-67 D-2 in part: there the open trigger is an nph-button and uses `button/secondary-solid-background-hover`; the event is not an nph-button, so the open event uses its own hover (`scheduler/event-background-hover`) with `aria-expanded="true"`.
- Follows DSA-45 D-1: the menu of "Filter", if it opens in an nph-dropdown-menu, stays at `space/inline-tight` from the button.

Icon and image:

- Sidebar button: `sidebar`, light, in the nph-icon-button secondary ghost; solid in hover-active by the piece.
- Previous and next: `chevron-left` and `chevron-right`, light, in the nph-icon-button; solid in hover-active by the piece.
- View select: `chevron-down`, light, of the nph-select.
- "Filter" and "New event": `filter` and `plus`, light, at the start of the nph-button, at `icon/size-sm`, same color as the label; solid in hover-active by the piece.
- Recurring event: `rotate-right`, light, at `scheduler/event-icon-size`, in the color of the title. Provisional: `repeat` is not in the nph-icon yet.
- Avatars: photo of the person in the nph-avatar, size `avatar/size-sm`, circle crop by the piece; export and crop follow the nph-avatar (DSA-24).
- Empty: no image of its own; it uses the nph-empty when it has a set in Figma. Until then, an icon and a text of its own, at `scheduler/empty-icon-size`.

## Decisions answered

1. Event color: the `color` property with `primary` (default) and the seven vertical colors, equal in every brand. Per color, seven semantic tokens `event/<color>-*` and seven component tokens `scheduler/event-<color>-*`. The color is the choice of the person for each calendar and never means status.
2. Name: `nph-scheduler` and tokens `scheduler/*`. `nph-calendar` stays for the date grid of the date-picker.
3. Descriptions: `color/border-subtle` (outline, cancelled event and grid lines of the scheduler) and `core/space/900` (fixed width of a column in a table and in the scheduler) extended; `scheduler/now-indicator-size` on `core/space/200`.
4. Container padding: stays `space/container-padding` (`scheduler/padding`).
5. Event height: minimum of 24 px (`scheduler/event-min-height` on `core/target-size/minimum`, WCAG 2.5.8); the short event takes a little more than its duration.
6. Focus: the day (day header in the week and day views, cell in the month), the event rows of the month and the list and the cancelled event get the same border and halo (`scheduler/focus-*`; per color, `scheduler/event-<color>-focus-*`).
7. Keyboard: each event is a Tab stop (as FullCalendar), not the APG grid with arrow keys; arrow keys on the grid stay for later. Days are also Tab stops.
8. "+N more" goes to the day view of that date; the week starts on Sunday, with Monday available; the chosen day on mobile is filled as in the date-picker grid.
9. Provisional until the owner piece: mini month by instance of the date-picker grid; empty state with its own icon and text until the nph-empty has a set; the side panel hugs the mini month; the repeat icon `rotate-right` (light) until `repeat` enters the nph-icon.
10. Focus of the primary nph-button in dark mode (2.71:1 in Gerencial, 2.88:1 in RH): corrected in the owner piece, in a separate adjustment. Outside this task.
11. Past and tentative events are outside v1; loading with nph-skeleton rows in lines; empty and loading of the week keep the seven days.
12. The side panel applies to every desktop view; the sidebar button opens and closes the same panel.

## Outside this task

The focus of the primary nph-button in dark mode (2.71:1 in Gerencial and 2.88:1 in RH) is corrected in the nph-button, in a separate adjustment. Nothing was changed in the nph-button with this task. The scheduler uses the nph-button by instance, with no override of background or outline, so the correction reaches it with no change here.
