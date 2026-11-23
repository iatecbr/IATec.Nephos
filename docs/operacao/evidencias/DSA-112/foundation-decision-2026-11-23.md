```json
{
  "task": "DSA-112",
  "gate": "foundation-decision",
  "date": "2026-11-23",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7995-6038",
    "date": "2026-11-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Item 10 of the nph-split-button approval of 2026-11-23, approved as recommended: inside the nph-toolbar each part of the split is an action of the bar."
  }
}
```

# DSA-112 — `foundation-decision`

## The decision
On 2026-11-23 the design owner approved item 10 of the `nph-split-button` approval, as recommended: **inside the `nph-toolbar`, each part of the split is an action of the bar; the side arrows go from the main part to the arrow, and Down Arrow on the arrow opens the menu.** The answer itself releases this task, once the split exists in the code.

## Why
The APG puts a menu button in a toolbar as a common control (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ ). Today the bar has one Tab stop and does not write the size on the split (P104, items 3 and 5; `fichas/nph-toolbar.md`). Caveat recorded: in a vertical bar, Down Arrow on the arrow competes with the vertical navigation. The refused alternative: the whole group is one action of the bar.
