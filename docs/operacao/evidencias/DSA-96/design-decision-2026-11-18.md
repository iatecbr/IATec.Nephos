```json
{
  "task": "DSA-96",
  "gate": "design-decision",
  "date": "2026-11-18",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6662-55010",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner answered the open decisions D-1 to D-11 of DSA-90 and the header of the large grid, all as recommended by the market research of 2026-11-18, after previews in light and dark on the draft page of Figma. Figma changed the same day on page 1364:2: the large header 44 high (3093:2170, 3093:2190, 3093:2210), chevron-down on the year title of the month view (3093:2135, 3093:2190), the month and year views as sets with default and large at the height of the day view (7376:46410, 7376:46474), and six week rows in the grid nph-calendar (4015:28204). This evidence keeps the answers that change what the code of DSA-90 does today."
  }
}
```

# DSA-96 — `design-decision`

## The decisions
On 2026-11-18 the design owner answered the eleven questions DSA-90 left open, and one measure of the large grid. Each one had a recommendation from market research with sources and, where it changes the drawing, a preview in light and dark in Figma with the options numbered on the frame. She chose the recommendation in all of them.

Six answers change what the code of DSA-90 does today; they are below. The others already match the code (D-1 six rows, D-3, D-4, D-7, D-8, the rest of D-10, and D-11) and are not part of this task.

| Item | Answer | What the code does today | Figma |
|---|---|---|---|
| D-2 | The month and year cells take the size of the day: as high as the day of the size (36 on default, 44 on large) and a third of the week row wide (84 and about 103). The month and year views keep the height of the day view, with the four rows spread over it, so the arrows stay in place when the view changes | The cell keeps 84 × 36 on both sizes, the view grid is centered, and the panel takes the height of the open view (`nph-calendar.css`, section of the month and year views) | `7376:46410` (months), `7376:46474` (years), default and large |
| D-5 | In the range, Previous month only on the first month and Next month only on the last; the space of the other arrow stays, so the title stays centered on its grid. The two months move together, one month per click | Each month draws both arrows (`dayHeader` in `nph-calendar.ts`); the months move one month per click | Accepted range panels `6662:55039` and `6662:55042` |
| D-6 | Last 7 days and Last 30 days are the whole days up to yesterday, without today. A shortcut with any day outside min or max is disabled, except This month, cut by the max | Last 7 days and Last 30 days end today and include it; a shortcut partly outside the limit is cut by it, and only one with no allowed day is disabled (`shortcutPeriod`, `shortcutRange`, `shortcutDisabled` in `nph-date-picker.logic.ts`) | The narrow range panels `6662:55735` and `6662:55882` show 21 to 27 October with today on the 27th, so they now mark Custom |
| D-9 | The year title of the month view takes `chevron-down`, as the month title. In the range, the title of either month switches both columns together: the month view shows two consecutive years and the year view two consecutive spans; the chosen month comes back on the left, with the next month on the right | The year title takes `chevron-up`; the view opens only in place of the clicked month (`openView` with its slot) | `3093:2135`, `3093:2190` |
| D-10 (P10) | By default a period does not cross a day unavailable by rule; the product can allow it when it makes sense | Only the unavailable day itself cannot be picked; a period can cross it | — |
| Header of the large grid | 40 high on default, as today, and 44 on large (`control/height-large`), the height of its arrows | 40 on both sizes (`control/height-default` plus `space/inline-tight`); the 44 arrows of the large size pass it | `3093:2170`, `3093:2190`, `3093:2210` |

## A correction to DSA-90
The row of D-5 in DSA-90 says that in Figma each month carries both arrows. That was wrong: in the accepted range panels `6662:55039` and `6662:55042` the inner arrow of each month already had opacity 0, so Figma had the arrows only on the outer edges. The answer to D-5 confirms the drawing; the code that follows the DSA-90 row draws both arrows.

## Why
The sources are in the Sources section of DSA-96. In short:
- Views at the height of the day view: Mantine grows the month and year cell with the size; MUI X and Ant keep one height for every view. The answer joins the two, with no single source that does both.
- Arrows only on the outer edges: MUI X, Mantine and React Spectrum; MUI X keeps the hidden arrow in the layout and moves one month per click.
- Shortcuts without today: Polaris and Google Ads; MUI X disables a shortcut that does not pass validation. This month is the exception because, with the max on today, it would always be disabled.
- `chevron-down` on the year title: the same gesture as the month title, open the view above; in MUI X the up chevron means go back to the days.
- Both columns switch together: Mantine with more than one column.
- A period that does not cross an unavailable day: React Aria, by default.
- Header of 44 on large: Mantine and Carbon give the arrow the height of the day, and the large size is for touch (WCAG 2.5.5).
