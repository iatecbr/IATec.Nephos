```json
{
  "task": "DSA-16",
  "gate": null,
  "date": "2026-10-07",
  "owner": "claude-code",
  "command": "npx storybook dev -p 6035 --no-open; read through getComputedStyle and getBoundingClientRect in the integrated browser",
  "exit_code": null,
  "sha": null,
  "external_origin": null
}
```

# DSA-16 — `nph-input` in Storybook

Proof of the `Validation` stories and of the `Docs` page opened in the integrated
browser (Chromium), on the `feat/lote-c-input-checkbox-radio` branch, through
`npx storybook dev -p 6035`. The scheme was switched by the global selector
(`globals=colorScheme:light|dark`, which applies `data-nph-color-scheme` at the root),
in the default brand. Each story was loaded in a same-origin frame and read through
`getComputedStyle` and `getBoundingClientRect`.

This evidence is not a gate evidence. The name does not follow `<gate>-<data>`.

| Story | Measurement | Color |
|---|---|---|
| `Sizes`, `Content`, `Invalid`, `Disabled`, `Label association`, `Required`, `Long content`, `Docs › Documentation` | every piece renders, in light and dark; no field without an accessible name | — |
| the same, at 375 px | no horizontal scrolling | — |
| Validation stories at 188 px (zoom 200 %) | no horizontal scrolling; the field shrinks to its container (`max-inline-size: 100%`) | — |
| `Docs › Documentation` at 188 px | it scrolls (110 px), like the `Docs` pages of `nph-icon` and `nph-button` on the base, because of the tables of `src/shared/docs/page.ts` | — |
| `Content`, keyboard | Tab enters the field (border in `focus/border`, halo outside); a second Tab reaches the clear target, with its own border and halo, and the field border stays `color/input` | — |
| `Invalid`, keyboard, dark | border `status/error` and the error halo | — |
| rest colors against Figma | border, background, value, start icon, clear icon, disabled background, disabled opacity and error border: 0 differences in light and dark | light `#8f8f8f` border, `#ffffff` background, `#000000` value, `#5c5c5c` icons, `#e3e3e3` disabled, `#b01e1e` error; dark `#9399a1`, `#0f1114`, `#e3e3e3`, `#b7bbc1`, `#2d333b`, `#e35151` |
| `Invalid input` | the three fields do not render; the console shows one error per cause | — |

The twelve color tokens used by the piece resolve, in the browser, to the same
values as the variables of the Figma file `DS-IA-NEPHOS 5.0`, read on the same day,
in both schemes. Hover and focus colors are proven by the tests, which compare each
part with its token.
After the first inspection, the hover rules leave error and focus alone: with the pointer over a piece in error, the border stays `status/error` (light `#b01e1e`, read on the checkbox `Matrix`), and over a focused piece it stays `focus/border`. The tests cover both cases.
