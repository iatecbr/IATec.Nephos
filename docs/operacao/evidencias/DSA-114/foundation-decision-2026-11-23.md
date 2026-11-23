```json
{
  "task": "DSA-114",
  "gate": "foundation-decision",
  "date": "2026-11-23",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=8121-23528",
    "date": "2026-11-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Items 2, 3 and 8 of the nph-carousel check (test round without the approval page): the design owner wants a softer non-current indicator dot than color/subtle-foreground (#737373 light, #ababab dark). From the Figma preview 8121:23528, shown in light and dark, she chose option 3: a new semantic color token for the dot, on core/neutral/400 in light and core/surface/400 in dark; carousel/indicator-background points to it; the current dot stays on color/primary-border."
  }
}
```

# DSA-114 — `foundation-decision`

## The decision
On 2026-11-23 the design owner chose **option 3** of the Figma preview `8121:23528`, shown in light and dark: **a new semantic token, `color/marker`, for the non-current dot of the `nph-carousel` indicators.** It points to `core/neutral/400` (`#8f8f8f`) in light and to `core/surface/400` (`#6f7782`) in dark. `carousel/indicator-background` points to it. The current dot stays on `color/primary-border`.

## Why
She asked for a softer dot than `color/subtle-foreground` (`#737373` light, `#ababab` dark), one that still passes the 3:1 of WCAG 1.4.11 for a non-text mark. Her own reference, `#b7bbc1`, measures 1.93:1 over `#ffffff` and fails. Source: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

## The options of the preview
1. Keep `color/subtle-foreground`: 4.74:1 light, 8.23:1 dark over `color/background`.
2. Reuse `color/input`: 3.23:1 light, 6.58:1 dark. Refused: `color/input` is the field border, so the dot would use the color outside its function.
3. **Chosen.** A new semantic on values already in the core (token rule T9, no new value): 3.23:1 light, 4.18:1 dark over `color/background`.

## Contrast measured (WCAG formula)

| Surface | Light `#8f8f8f` | Dark `#6f7782` | Before, light `#737373` | Before, dark `#ababab` |
|---|---|---|---|---|
| `color/background` | 3.23:1 | 4.18:1 | 4.74:1 | 8.23:1 |
| `color/card` | 3.23:1 | 3.53:1 | 4.74:1 | 6.96:1 |
| `color/muted` | 2.78:1 | 2.81:1 | 4.08:1 | 5.55:1 |
| `color/accent`, hover of the target | 2.78:1 | 2.18:1 | 4.08:1 | 4.29:1 |

The preview measured only over `color/background`. Over `color/muted` the new dot is below 3:1 in both schemes, and so it is in hover, when the target takes `color/accent` behind the dot. The design owner kept option 3 after these figures were raised on 2026-11-23.
