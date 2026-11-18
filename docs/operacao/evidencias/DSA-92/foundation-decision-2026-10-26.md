```json
{
  "task": "DSA-92",
  "gate": "foundation-decision",
  "date": "2026-10-26",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0",
    "date": "2026-10-26",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "In the Figma UX QA of the nph-pagination, the light focus border failed WCAG 2.2 criterion 1.4.11 in the `Sistemas` brand: focus/border (`Sistemas` tone 500) against the halo (`Sistemas` tone 100) measured 2.92:1. On a preview in light and dark, the design owner chose option 1: the light focus border uses `Sistemas` tone 600. Figma applied it to theme/brand-focus (VariableID:574:2), `Sistemas` mode, the same day; the descriptions of theme/brand-focus, focus/border and theme/brand-halo were aligned to it on 2026-11-18. It is a foundation change and applies to every component that uses focus/border."
  }
}
```

# DSA-92 — `foundation-decision`

## The decision
On 2026-10-26 the design owner approved, in chat, option 1 of a Figma preview in light and dark: **the light focus border uses tone 600 of the `Sistemas` brand**. Dark mode does not change. It applies to every component that uses `focus/border`, because it changes the foundation token, not a component token.

## Why
In the Figma UX QA of the `nph-pagination` (round 2), the light focus border failed WCAG 2.2 criterion 1.4.11 (non-text contrast) in `Sistemas`. The border `focus/border` points to `theme/brand-focus`, which was `core/sistemas/500` (`#3B82F6`). Against the halo `focus/halo` (`theme/brand-halo`, `core/sistemas/100`, `#D8E6FD`) it measured 2.92:1, below 3:1. `design.md` recorded this as a known limit, because no halo tone reaches 3:1 with tone 500. The preview offered two options: 1, the border in tone 600 (recommended); 2, a lighter halo in tone 50, which still left 2.92:1 against the tone 100 active background of the `nph-pagination`.

## What Figma has today
- `theme/brand-focus` (`VariableID:574:2`), mode `Sistemas`: `core/sistemas/600` (`#2F68C5`) since 2026-10-26. The other six brands did not change.
- No new token. Only `focus/border` in light reads `theme/brand-focus`; dark reads `theme/brand-200`.
- The descriptions of `theme/brand-focus`, `focus/border` and `theme/brand-halo` were aligned to tone 600 on 2026-11-18: the halo description no longer says that `Sistemas` does not reach 3:1.

## Contrast measured in Figma after the change (light)
Measured on 2026-10-26 in the seven brands, the focus border against three neighbors: the halo, the active background of the `nph-pagination` and white.

| Brand | Border against the halo | Border against the active background | Border against white |
|---|---|---|---|
| `Sistemas` | 4.26:1 | 4.26:1 | 5.37:1 |
| `Gerencial` | 3.27:1 | 8.56:1 | 12.61:1 |
| `Educação` | 3.33:1 | 4.36:1 | 4.96:1 |
| `Comercial` | 3.38:1 | 3.38:1 | 4.32:1 |
| `Financeiro` | 3.03:1 | 4.05:1 | 5.31:1 |
| `Igrejas` | 4.32:1 | 6.48:1 | 9.22:1 |
| `Recursos Humanos` | 3.10:1 | 7.93:1 | 11.59:1 |

All seven brands meet 3:1 against the halo; `Financeiro` and `Recursos Humanos` with little margin. Only the `Sistemas` row comes from this change; the other rows are the values the code already has. Dark mode did not change.

Checked again on 2026-11-18 with the hex values of `src/tokens/generated/tokens.css` and the WCAG formula: `#2F68C5` against `#D8E6FD` 4.26:1 and against `#FFFFFF` 5.37:1; `#3B82F6` against the same 2.92:1 and 3.68:1. In the six other brands, the border against the halo and against white in the code gives the same values as the table.

## After the decision
The Figma UX QA of the `nph-pagination`, round 3, approved the focus in the seven brands, light and dark (2026-10-26). The code still has tone 500: tests pin the old limit, so the token, the tests and the texts change together in DSA-92.

## Sources
- WORK BRAIN, `03 MEMÓRIA/diario/2026/2026-10-26.md`: the QA round 2 finding, the decision (option 1) and the measures of the seven brands
- WORK BRAIN, `03 MEMÓRIA/diario/2026/2026-11-18.md`: the Figma descriptions aligned to tone 600, and the request of the design owner to open this task
- Figma `DS-IA-NEPHOS 5.0`, variable `theme/brand-focus` (`VariableID:574:2`)
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- `docs/operacao/evidencias/DSA-91/figma-docs-accepted-2026-11-18.md`, section "Tokens": the difference between the code value and the value Figma reads
