```json
{
  "id": "DSA-96",
  "goal": "Bring nph-date-picker and nph-calendar to the six answers of 2026-11-18 that change what the code of DSA-90 does today (D-2, D-5, D-6, D-9, D-10 and the header of the large grid), as Figma has them since that day, with the tests, the specs, the metadata and the stories changed in the same work.",
  "phase": "F4",
  "approved_order": 950,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-date-picker",
  "dependencies": [
    "DSA-90"
  ],
  "gates": [
    {
      "id": "design-decision",
      "description": "The design owner answered D-1 to D-11 of DSA-90 and the header of the large grid, after previews in light and dark, and Figma has the answers on page 1364:2.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-96/design-decision-2026-11-18.md",
      "result": "passed",
      "verified_at": "2026-11-18",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "The component, the CSS, the tests, the specs, the metadata and the stories change together, pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor 475790c405e9e94edde4a27c9035d9c36d0a2a66 origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-96/review-and-merge-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-18",
      "question": "How a day that cannot be the End looks while only the Start is chosen (D-10, answered without a drawing). Until she answers, it is disabled like a day outside the min or the max: faded under state/disabled-opacity, skipped by the focus. If it should look unavailable, or differently, she decides. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-19"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-96/design-decision-2026-11-18.md",
    "docs/operacao/evidencias/DSA-96/review-and-merge-2026-11-19.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-18.md, nph-date-picker: the design owner answered D-1 to D-11 of DSA-90 and the header of the large grid as recommended, after previews in light and dark; Figma changed the same day",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:1x), lot B of the pending decisions of the v1 closing: Indiane answered D-15 to D-17 in the chat, all as recommended, after market research with sources; D-15 changes the code in DSA-115"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6662-55010",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Eleven answers and one measure, all as recommended by the market research of 2026-11-18. Six of them change what the code of DSA-90 does today: the month and year views (D-2), the arrows of the range (D-5), the shortcuts (D-6), the year title icon and the views in the range (D-9), a period across an unavailable day (D-10) and the header of the large grid. The answers, what the code does today and the Figma nodes are in the evidence of the design-decision gate, with a correction to the D-5 row of DSA-90."
  },
  "git_review": { "branch": "feat/dsa-96-date-picker", "commit": "475790c", "pr": 188 },
  "context": null,
  "updated_at": "2026-11-23"
}
```

# DSA-96 — nph-date-picker and nph-calendar after the answers to D-1 to D-11

## Goal
DSA-90 shipped the date picker with an interim rule for eleven open questions. The design owner answered them on 2026-11-18, all as recommended, and Figma now draws the answers. Six answers change what the code does today; this task brings the code to them.

## Where the decision is
The evidence of the `design-decision` gate has the six answers, what the code does today, why, and the Figma nodes, on page `1364:2`. The questions and the interim rule are in DSA-90, section "Decisions open with the design owner"; the evidence corrects its D-5 row.

## What changes
1. **Month and year views (D-2).** Today the month and year cell keeps its drawn size (84 × 36) on both sizes, the view is centered in the large panel, and the panel takes the height of the open view. New:
   - the cell is as high as the day of the size (`control/height-default`, `control/height-large`) and a third of the week row wide;
   - the view keeps the height of the day view, with the four rows spread over it: with six week rows, the gap between rows equals the cell height;
   - the arrows stay in place when the view changes.
   Figma: `7376:46410` (months) and `7376:46474` (years), `tamanho` default and large.
2. **Arrows of the range (D-5).** Today each month draws both arrows. New:
   - Previous month only on the first month, Next month only on the last.
   - The other arrow keeps its space, so the title stays centered on its grid. It is hidden from sight, from the Tab order and from the accessibility tree.
   - The two months still move together, one month per click.
   - Figma: the accepted range panels `6662:55039` and `6662:55042` already draw this; the D-5 row of DSA-90 described them wrongly.
3. **Shortcuts (D-6).** Today Last 7 days and Last 30 days end today and include it, and a shortcut partly outside the limit is cut by it. New:
   - Last 7 days and Last 30 days are the whole days up to yesterday, without today.
   - A shortcut with any day outside min or max is disabled, with the disabled look of nph-option.
   - The one exception is This month, which stays cut by the max.
   - The rest of the shortcut rules of DSA-90 stay.
4. **Year title and views in the range (D-9).**
   - The year title of the month view takes `chevron-down`, as the month title (Figma `3093:2135`, `3093:2190`); today it takes `chevron-up`.
   - In the range, the title of either month switches both columns together: the month view shows two consecutive years, and the year view two consecutive spans of twelve years.
   - A month chosen there comes back on the left, with the next month on the right.
   - Today the view opens only in place of the clicked month.
5. **A period across an unavailable day (D-10).** Today only the unavailable day itself cannot be picked, and a period can cross it. New rule: by default a period does not cross a day unavailable by rule.
   - While only the Start is chosen, a day past the first unavailable day after it, or before the first one before it, cannot be the End.
   - The product can allow a period across an unavailable day with a property, off by default, as `allowsNonContiguousRanges` of React Stately; the spec names it.
   - The rest of the pick cycle of DSA-90 stays.
   - A typed period that holds an unavailable day, and a shortcut that holds one, were answered on 2026-11-23 (D-15); the change is in DSA-115.
6. **Header of the large grid.**
   - Today the header is `control/height-default` plus `space/inline-tight` (40) on both sizes, and the large arrows (44) pass it.
   - New: 40 on default, as today, and `control/height-large` (44) on large (Figma `3093:2170`, `3093:2190`, `3093:2210`).
   - The large grid is 340 × 392 with six rows; the large single date panel (342 × 390 today) and the large range panel grow the same 4 px.
Where the specs, the metadata or the stories call these six rules provisional, they become decided. The other answers (D-1 six rows, D-3, D-4, D-7, D-8, the rest of D-10, D-11) already match the code and are not part of this task.

## Why there is no token
Every new measure has a token already: the large header and the large cell are `control/height-large`, the default cell `control/height-default`. D-12 (the default header 40, the shortcut column 192 and the cell width) stays open with the design owner; the header and the cell of this task do not wait for it.

## Order with other tasks
After DSA-90. It does not touch the nph-scheduler, which takes the grid `nph-calendar` only in its own adjustment task (DSA-77 D-1); the six rows already drawn in the scheduler page of Figma come from the owner grid.

## Decisions answered on 2026-11-23
Indiane answered D-15 to D-17 in the chat on 2026-11-23, in lot B of the pending decisions of the v1 closing, all as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-15 | Follow D-10: while a period may not cross an unavailable day (the property of D-10 off), a shortcut whose period holds one is disabled, and a typed period that holds one shows an error, as D-4. React Spectrum asks for an error on a range across an unavailable day (https://react-spectrum.adobe.com/react-spectrum/DateRangePicker.html ); MUI disables a shortcut that fails validation (https://mui.com/x/react-date-pickers/shortcuts/ ). | Changes in DSA-115. |
| D-16 | Confirmed: in the range, the first column is the year of the first month shown (or the block of twelve years that starts at the decade of that year); the arrows are only on the outer edges and move one year or twelve years per click; the cells of both columns are one sequence for the arrow keys and one Tab stop. The APG date picker has one Tab stop in the grid and the arrow keys to move in it (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/ ). | Nothing changes. |
| D-17 | Confirmed: with a min inside the month, This month is disabled, by the general rule of D-6. In MUI a shortcut that fails validation is disabled by default (https://mui.com/x/react-date-pickers/shortcuts/ ). | Nothing changes. |

## How it is proved
- `npm run test:operacao`, `npm run test:naming`, `npm run test:tokens`.
- The unit tests of `nph-calendar` and `nph-date-picker` cover the new rules: views at the day height, one arrow per edge in the range, shortcuts without today and disabled outside the limit, the year title icon, both columns switching in the range, the unavailable day inside a period, the large header height.
- The stories show the large views, the range in the month view and a period stopped by an unavailable day.

## What this task does not do
It does not create a token or change a token value. It does not change Figma. It does not answer D-12 and D-14 of DSA-90, which stay open with the design owner (D-13 was answered on 2026-11-23, with no change to the code). It does not change a typed period or a shortcut that holds an unavailable day: that is DSA-115 (D-15).

## Sources
https://raw.githubusercontent.com/react-component/picker/master/src/PickerPanel/DatePanel/index.tsx ; https://raw.githubusercontent.com/mui/mui-x/master/packages/x-date-pickers/src/DateCalendar/DayCalendar.tsx ; https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/dates/src/components/PickerControl/PickerControl.module.css ; https://raw.githubusercontent.com/mui/mui-x/master/packages/x-date-pickers/src/internals/constants/dimensions.ts ; https://raw.githubusercontent.com/mui/mui-x/master/packages/x-date-pickers-pro/src/PickersRangeCalendarHeader/PickersRangeCalendarHeader.tsx ; https://raw.githubusercontent.com/mui/mui-x/master/packages/x-date-pickers/src/internals/components/PickersArrowSwitcher/PickersArrowSwitcher.tsx ; https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/dates/src/components/MonthLevelGroup/MonthLevelGroup.tsx ; https://github.com/Shopify/polaris/blob/main/polaris.shopify.com/content/patterns/date-picking/variants/date-range.mdx ; https://developers.google.com/google-ads/api/docs/query/date-ranges ; https://mui.com/x/react-date-pickers/shortcuts/ ; https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/dates/src/components/Calendar/Calendar.tsx ; https://raw.githubusercontent.com/mui/mui-x/master/packages/x-date-pickers/src/PickersCalendarHeader/PickersCalendarHeader.tsx ; https://raw.githubusercontent.com/adobe/react-spectrum/main/packages/react-stately/src/calendar/useRangeCalendarState.ts ; https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/dates/src/components/CalendarHeader/CalendarHeader.module.css ; https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/date-picker/_flatpickr.scss ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
