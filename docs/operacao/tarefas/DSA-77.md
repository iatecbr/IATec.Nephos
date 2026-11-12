```json
{
  "id": "DSA-77",
  "goal": "Implement the nph-scheduler, a calendar of events in work week, week, day, month and list views with its inner event piece, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 760,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-scheduler",
  "dependencies": [
    "DSA-03",
    "DSA-13",
    "DSA-17",
    "DSA-24",
    "DSA-25",
    "DSA-26",
    "DSA-29",
    "DSA-40",
    "DSA-43",
    "DSA-45",
    "DSA-67"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-scheduler documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-77/figma-docs-accepted-2026-11-12.md",
      "result": "passed",
      "verified_at": "2026-11-12",
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
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-77/figma-docs-accepted-2026-11-12.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-12.md, nph-scheduler: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, and the twelve points of the approval page approved (event color property with primary and seven vertical colors, name nph-scheduler and tokens scheduler/*, extended descriptions of color/border-subtle and core/space/900, container padding, minimum event height of 24 px, same focus on day, month and list rows and cancelled event, each event a Tab stop, \"+N more\" to the day view, provisional pieces until the owner piece, focus of the primary nph-button in dark mode outside this task, past and tentative events outside v1, side panel in every desktop view)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6151-11160",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-scheduler documentation frame (6151:11160, page 1363:2) was accepted as the API and behavior specification of the nph-scheduler and of its inner event. COMPONENT_SET nph-scheduler (6142:1744) and COMPONENT_SET nph-scheduler event (6141:9258). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-12"
}
```

# DSA-77 — the nph-scheduler

## Goal
The `nph-scheduler` exists (`src/components/nph-scheduler/`), with spec, tests and stories, in the contract accepted in Figma: a calendar of events in the work week (default), week, day, month and list views, on desktop and mobile, with an optional side panel (mini month and "My calendars") in every desktop view, a toolbar and the inner event piece. The scheduler hands the click on the event to the screen; opening the detail, creating or editing an event belongs to the product. The name `nph-calendar` stays for the date grid of the date-picker.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-77/figma-docs-accepted-2026-11-12.md`. It carries the Figma documentation converted to text, with the tokens, the default behavior, the combined states, the inherited decisions, the icon rules and the twelve decisions. There is no need to open Figma.

## Specification to follow closely
- **Parts**: container, optional side panel, toolbar, day header, all-day band, time column, day grid, now line and event. The event has a body, a bar, the content (title and time) and, in the recurring one, the repeat icon. Toolbar buttons, view select, checkboxes, avatar stack, skeleton rows and popover come by instance of the approved pieces, by instance and with no override of background or outline.
- **Views and size**: `vista` work week (default), week, day, month and list; `tamanho-de-tela` desktop (default) and mobile. On mobile the scheduler becomes the compact month with the list of the chosen day, filled as in the date-picker grid.
- **States**: default, empty, loading, day focus and event focus. Empty and loading change only the events area and keep the toolbar active; loading uses nph-skeleton rows in lines; empty and loading of the week keep the seven days. The `lateral` boolean shows or hides the side panel in every desktop view, and the sidebar button toggles the same panel.
- **Event**: `cor` primary (default) and the seven vertical colors, equal in every brand, never status; `tipo` 1 h, short, long and recurring (the height comes from the duration, with a minimum of 24 px); `estado` default, hover, focus, open, cancelled and cancelled focus. Bind every value to its `scheduler/*` token, never to the semantic it points to. The cancelled event is neutral, struck through, with the text "Cancelled:" and no bar. The open event has the same background as hover and carries `aria-expanded="true"`.
- **Color**: in the `Educacao` brand, `educacao` equals `primary`: do not use both together.
- **Keyboard** (a deliberate deviation from the APG grid, decided by the design owner): each day and each event is a Tab stop, in this order: toolbar, side panel, days from left to right, events in start order (same start time: left to right); Enter or Space on the event opens the detail in the nph-popover and moves the focus into it; Esc closes the detail and returns the focus to the event; Esc also closes the view select and the "Filter" menu, returning the focus to the button; click outside closes the detail. No arrow keys on the grid; the mini month keeps the arrows, Page Up, Page Down, Home and End of the date-picker grid. Enter or Space on "+N more" goes to the day view of that date. The week starts on Sunday, with Monday available.
- **Accessible name**: the event is a button; the name carries the whole title, the date, the time, the calendar and, when it applies, "cancelled" and "repeats". The days carry the full name and the avatar group carries the names of the people.
- **Focus**: the event, the day (day header in the week and day views, cell in the month), the event rows of the month and the list and the cancelled event get the same border and halo (`scheduler/focus-*`; per color, `scheduler/event-<color>-focus-*`).
- **Provisional until the owner piece**: the mini month by instance of the date-picker grid; the view select on mobile (v1 draws only the compact month; another view on mobile waits for a design); the empty state with the `calendar` icon, the title "No events this week" and the hint "Events appear here when they are created." until the nph-empty has a set in Figma (the nph-empty exists in code, DSA-40; only its Figma set is missing); the repeat icon `rotate-right` (light) until `repeat` enters the nph-icon.
- **Limits**: past and tentative events are outside v1; time scale outside v1.

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- The break between desktop and mobile (768 px of width is the proposal, to be confirmed by the code).
- The update interval of the now line.
- Scroll on a short desktop: the toolbar and the day header stay in place and only the grid scrolls (to be confirmed by the code).
- How the mini month, which is an instance of the date-picker grid, is built while the date-picker grid has no task of its own, and how the host reads the chosen date.
- How the host passes the calendars of "My calendars", the color of each calendar and the people of the meetings of the day, and how the texts are provided and translated.

## Tokens that stay without a component token
The pieces by instance use their own tokens: nph-button, nph-icon-button, nph-select, nph-checkbox, nph-avatar-stack, nph-popover, nph-skeleton, nph-icon and the date-picker grid in the mini month. The typography comes from the text styles (`text/label-sm` for the event title and `text/caption` for the time). The scheduler has no shadow style: in dark mode the elevation is the background, `color/card` over `color/background`.

## Why it is ready
The tokens (`event/<color>-*` and `scheduler/*`) came with this task and are on `v/5.0.0`. All of them are aliases of semantic tokens or of the `event/<color>-*` group, except six that point straight to core by decision: `scheduler/event-indicator-width`, `scheduler/today-indicator-width` and `scheduler/now-indicator-width` on `core/focus-width/sm`, `scheduler/time-column-width` on `core/space/900`, `scheduler/now-indicator-size` on `core/space/200` and `scheduler/event-min-height` on `core/target-size/minimum`; the evidence says why for each one. No new value entered the core. The pieces used by instance are done: nph-icon (DSA-03), nph-button (DSA-13, DSA-43), nph-checkbox (DSA-17), nph-avatar and nph-avatar-stack (DSA-24, DSA-25), nph-skeleton (DSA-26), nph-select (DSA-29), nph-empty (DSA-40), nph-dropdown-menu (DSA-45) and nph-popover (DSA-67). The date-picker grid has no task in the repository yet; the mini month is provisional until it exists.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not open the detail of the event, create or edit events: that belongs to the product. It does not build the date-picker grid.

## Outside this task
The focus of the primary nph-button in dark mode (2.71:1 in Gerencial and 2.88:1 in RH) is corrected in the nph-button, in a separate adjustment. Nothing was changed in the nph-button with this task; the scheduler uses it by instance and receives the correction with no change here.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, documentation frame `6151:11160`, matrix `6151:11164` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-scheduler `6142:1744` and nph-scheduler event `6141:9258`
- WAI-ARIA APG, Grid pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- WAI-ARIA APG, Date Picker Dialog example: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
- FullCalendar, Accessibility: https://fullcalendar.io/docs/accessibility
- Floating UI, flip and size: https://floating-ui.com/docs/flip and https://floating-ui.com/docs/size
- WCAG 2.2: Contrast (Minimum), Non-text Contrast, Use of Color, Target Size (Minimum) and Content on Hover or Focus
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
