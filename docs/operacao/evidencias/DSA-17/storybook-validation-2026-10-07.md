```json
{
  "task": "DSA-17",
  "gate": null,
  "date": "2026-10-07",
  "owner": "claude-code",
  "command": "npx storybook dev -p 6035 --no-open; read through getComputedStyle and getBoundingClientRect in the integrated browser",
  "exit_code": null,
  "sha": null,
  "external_origin": null
}
```

# DSA-17 — `nph-checkbox` in Storybook

Proof of the `Validation` stories and of the `Docs` page opened in the integrated
browser (Chromium), on the `feat/lote-c-input-checkbox-radio` branch, through
`npx storybook dev -p 6035`. The scheme was switched by the global selector
(`globals=colorScheme:light|dark`, which applies `data-nph-color-scheme` at the root),
in the default brand. Each story was loaded in a same-origin frame and read through
`getComputedStyle` and `getBoundingClientRect`.

This evidence is not a gate evidence. The name does not follow `<gate>-<data>`.

| Story | Measurement | Color |
|---|---|---|
| `Matrix`, `Hidden text`, `Long text`, `Indeterminate`, `Group`, `Docs › Documentation` | every piece renders, in light and dark; no box without an accessible name | — |
| the same, at 375 px and at 188 px (zoom 200 %) | no horizontal scrolling in Validation; a long word breaks inside the piece (`overflow-wrap: anywhere`) | — |
| `Matrix`, dark, screenshot | unchecked, checked and indeterminate in default, error and disabled | — |
| rest colors against Figma | background and border unchecked and checked, mark, text, error border and disabled opacity: 0 differences in light and dark | light `#ffffff` / `#2f68c5` box, `#8f8f8f` border, `#ffffff` mark, `#b01e1e` error; dark `#0f1114` / `#629bf8`, `#9399a1`, `#0c0c0c`, `#e35151` |
| indeterminate | the `minus` mark | — |

The twelve color tokens used by the piece resolve, in the browser, to the same
values as the variables of the Figma file `DS-IA-NEPHOS 5.0`, read on the same day,
in both schemes. Hover and focus colors are proven by the tests, which compare each
part with its token.
After the first inspection, the hover rules leave error and focus alone: with the pointer over a piece in error, the border stays `status/error` (light `#b01e1e`, read on the checkbox `Matrix`), and over a focused piece it stays `focus/border`. The tests cover both cases.
