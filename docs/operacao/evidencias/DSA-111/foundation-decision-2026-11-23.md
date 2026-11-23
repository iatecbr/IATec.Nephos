```json
{
  "task": "DSA-111",
  "gate": "foundation-decision",
  "date": "2026-11-23",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7735-2",
    "date": "2026-11-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Item 9 of the nph-split-button approval of 2026-11-23, approved as recommended: the nph-dropdown-menu gains an end alignment, as the nph-popover."
  }
}
```

# DSA-111 — `foundation-decision`

## The decision
On 2026-11-23 the design owner approved item 9 of the `nph-split-button` approval, as recommended: **the `nph-dropdown-menu` gains an end alignment, as the `align` (start, center, end) of the `nph-popover`.** The answer itself releases this task.

## Why
The visual accepted with the proposals (Pend. 9) puts the menu of the split on the end edge of the group; today the menu aligns to the start edge of its trigger (`fichas/nph-dropdown-menu.md`; P92), and the end edge of the arrow is the end edge of the group. The option reuses a pattern already accepted in the `nph-popover` (P111) and serves other triggers on the right. Caveat recorded: it changes the API of an approved component. The refused alternative: the split computes the position by itself, with no change to the `nph-dropdown-menu`. No external source read decides: the APG menu button does not treat position (https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ ); by analogy, Material 3 asks to "align the menu with the trailing button" (https://m3.material.io/components/split-button/guidelines ).

## In Figma
The root of the split (`7735:2`, composition `7742:307`) and the documentation (`7995:6038`, section 6) show the open menu aligned to the end edge of the group, 4 px below.
