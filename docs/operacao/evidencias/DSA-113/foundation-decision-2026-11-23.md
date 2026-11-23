```json
{
  "task": "DSA-113",
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
    "converted_decision": "Item 7 of the nph-split-button approval of 2026-11-23, approved as recommended: open the foundation task for color/primary-on-surface of the Educacao brand in light, up to 4.5:1 over color/muted."
  }
}
```

# DSA-113 — `foundation-decision`

## The decision
On 2026-11-23 the design owner approved item 7 of the `nph-split-button` approval, as recommended: **open the foundation task to adjust the tone of `color/primary-on-surface` of the brand `Educacao`, in light, up to 4.5:1 or more over `color/muted`.**

## Why
Measured by WCAG, only the primary ghost over a gray surface falls below 4.5:1 (4.27:1); outline and light have a background of their own (4.64:1), and the `nph-button` alone fails the same way. Source: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

Caveat recorded: changing the tone of a brand changes every component that uses the pair, and the measure was made only on the button label. The refused alternative: keep it and record the limit in the `nph-button` (ghost over `color/muted`).

## What it does not decide
The new tone. It is a visual choice of the design owner, in Figma, with a preview (blocker B1 of the task).
