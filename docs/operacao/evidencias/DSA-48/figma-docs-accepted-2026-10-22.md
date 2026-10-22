```json
{
  "task": "DSA-48",
  "gate": "figma-docs-accepted",
  "date": "2026-10-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1237-5",
    "date": "2026-10-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "On 22-10-2026 Indiane approved six rules for the nph-tooltip after a benchmark of tooltip patterns: keyboard focus opens the balloon at once, the pointer opens it after 300 ms, Enter and Space only run the action and neither open nor close the balloon, the balloon goes only on elements that receive focus, on an icon-only button the balloon text is the accessible name of the action, and on touch the icon-only button has no visible name. The documentation in frame 1237:5 and the description of component 1237:3 were updated the same day. No COMPONENT_SET: single COMPONENT 1237:3, with the text property `texto`."
  }
}
```

# DSA-48 — `figma-docs-accepted`

On 22-10-2026 Indiane approved six rules for the `nph-tooltip`. They change the
contract that DSA-42 delivered on 20-10-2026. The Figma documentation (frame
`1237:5`) and the description of the component `1237:3` were updated the same
day.

There is no command output. The decision is a human observation, recorded with the
date, the authorship and the Figma nodes.

## The rules, converted to text

| # | Rule | Figma node |
|---|---|---|
| 1 | Keyboard focus on the element opens the balloon at once. | `1241:57`, `1241:18` |
| 2 | The pointer opens the balloon after 300 ms over the element. Focus has no delay. | `1241:57`, `1241:18`, `1241:277` |
| 3 | Click, Enter and Space run the action of the element and do not open the balloon. Enter and Space also do not close it: it closes when focus leaves, when the pointer leaves the element and the balloon, or with Esc. | `1241:57`, `1241:18` |
| 4 | The balloon goes only on an element that receives focus. A disabled button and loose text get no balloon: without focus, a keyboard user never sees it. | `1858:8229`, `2577:299` |
| 5 | On an icon-only button, the balloon text is the accessible name of the action: the same text the screen reader announces, once only. On other elements, the balloon complements the accessible name and does not replace it. | `1241:65`, `1858:8229`, `1241:199` |
| 6 | On touch the balloon does not open, so the icon-only button has no visible name. This is accepted as an exception: the name lives in the accessible name, the icon must be easy to recognize, and an ambiguous action uses a button with text. | `1241:65`, description of `1237:3`; Indiane's decision recorded in the WORK BRAIN daily note of 22-10-2026 |

## What stays as in DSA-42

- Esc closes; the balloon stays open while the pointer is over it.
- Enters on `motion/enter-duration`, leaves on `motion/exit-duration`.
- Top by default, flipping when it does not fit.
- No action, link or field inside the balloon (description of `1237:3`); at most two lines, no ellipsis.

## Token

The 300 ms delay is the token `motion/hover-delay`, created in Figma on 22-10-2026
after Indiane answered D1: semantic collection, both modes, alias of the primitive
`core/duration/delay` (300). The tooltip description (`1241:18`) and the
component description (`1237:3`) name it.
