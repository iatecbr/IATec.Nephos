```json
{
  "task": "DSA-81",
  "gate": "figma-preview-accepted",
  "date": "2026-11-13",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6312-15466",
    "date": "2026-11-13",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner chose option 1 for the destructive text in dark (core/danger/200, an existing primitive) and option A for the focus border in dark (theme/brand-200 in all 7 brands), on the preview frame 6312:15466 (page 988:6952), light and dark."
  }
}
```

# DSA-81 — `figma-preview-accepted`

The preview frame `6312:15466` showed, in light and dark, the nph-command panel on the dark dialog surface with the current and the candidate values. Light does not change. Contrast measured by script on the Figma variables.

| Semantic, dark | Before | After (accepted) | On `color/dialog` (#3C444F) | Other neighbors |
|---|---|---|---|---|
| `color/destructive-text` | `core/danger/300` #EA7D7D, 3.62:1 | `core/danger/200` #F1A8A8 | 5.12:1 | 6.62:1 on `color/popover`, 8.30:1 on `color/card`, 9.82:1 on `color/background` |
| `focus/border` | `theme/brand-300` | `theme/brand-200`, all 7 brands | 4.27:1 (Gerencial) to 7.59:1 (Educação) | 8.2:1 or more on `color/background`; 5.02:1 or more against `focus/halo` |

Per brand, `theme/brand-200` on `color/dialog`: Sistemas 6.10, Gerencial 4.27, Educação 7.59, Comercial 5.89, Financeiro 5.62, Igrejas 4.62, Recursos Humanos 4.38. Against the halo: 5.02, 5.47, 6.74, 5.38, 5.90, 5.43, 5.15.

Rejected: option 2 (a new primitive `core/danger/250` #EF9999, 4.54:1) and option B (`theme/brand-200` only in Gerencial, Recursos Humanos and Igrejas, with a new theme token). No new value entered the core (rule T9). Not changed here: `status/error-text` also uses `core/danger/300` in dark; it was not part of this decision.
