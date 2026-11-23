```json
{
  "task": "DSA-108",
  "gate": "foundation-decision",
  "date": "2026-11-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0",
    "date": "2026-11-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Item 11 of the nph-rich-text-editor approval of 2026-11-22, approved as recommended: open the foundation task for the nine toolbar icons in the nph-icon, Font Awesome Classic Light; skeletons stay in Figma until then."
  }
}
```

# DSA-108 — `foundation-decision`

## The decision
On 2026-11-22 the design owner approved item 11 of the `nph-rich-text-editor` approval, as recommended: **open the foundation task** that adds to the `nph-icon` the icons `rotate-left`, `bold`, `italic`, `underline`, `strikethrough`, `list-ul`, `list-ol`, `block-quote` and `text-slash`, in Font Awesome Classic Light. The answer itself releases this task.

## Why
The rule is icon only by the `nph-icon`, and the toolbar needs these nine. The Figma `nph-icon` (`248:143`) has none of them, read by script; the toolbar shows a 16 × 16 `nph-skeleton` in each place until the icon exists. All nine exist in Font Awesome Classic Light with these names (for example https://fontawesome.com/icons/rotate-left?f=classic&s=light , https://fontawesome.com/icons/block-quote?f=classic&s=light , https://fontawesome.com/icons/text-slash?f=classic&s=light ). It is not a choice of look: the drawing is Font Awesome's. Recommendation refused: none was allowed (icon only by the `nph-icon`).

## What the code has today
`src/components/nph-icon/nph-icon.icons.ts`, read on `v/5.0.0` on 2026-11-22: `bold`, `italic` and `underline` are in the core (DSA-23 D1), and so are `rotate-right`, `link`, `ellipsis` and `chevron-down`, which the toolbar also uses. Missing: `rotate-left`, `strikethrough`, `list-ul`, `list-ol`, `block-quote` and `text-slash`.

## Weight and size in the editor
`light` at rest and `solid` in hover-active on the icon-only buttons (DSA-47 D1); on the toggle buttons, unchecked `light`, checked `solid`; always `icon/size-sm` (16). The weight rule belongs to the buttons; this task only makes the six names exist.

## Order
DSA-105 waits for this task (its blocker B1).
