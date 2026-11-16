```json
{
  "task": "DSA-84",
  "gate": "figma-preview-accepted",
  "date": "2026-11-16",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6753-17854",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner chose the recommended option 1 on the foundation previews F1 (6762:19442, DSA-73 D-1) and F3 (6763:19639, DSA-77 D-3), in the parent frame 6753:17854 (page 988:6952), light and dark."
  }
}
```

# DSA-84 — `figma-preview-accepted`

The previews showed, in light and dark, the current and the candidate values, with the contrast of each pair measured by script on the Figma variables. Light does not change.

## F1 — dark contrast on `color/dialog` (#3C444F)

| Token, dark | Before | After (accepted) | On `color/dialog` | Minimum |
|---|---|---|---|---|
| `status/error-text` | `core/danger/300`, 3.62:1 | `core/danger/200` | 5.12:1 | 4.5:1 (text) |
| `status/error` | `core/danger/400`, 2.61:1 | `core/danger/300` | 3.62:1; the icon on it 6.96:1 | 3:1 (control part) |
| `color/primary-border` | `theme/brand-300`: Gerencial 2.56, Igrejas 2.93, Recursos Humanos 2.64 | `theme/brand-200`, all 7 brands | 4.27:1 (Gerencial) to 7.59:1 (Educação) | 3:1 (control part) |
| `theme/brand-text-dark` (read by `color/primary-text` and `color/link`) | Gerencial `200` 4.27, Comercial `300` 4.43, Financeiro `300` 4.02, Recursos Humanos `200` 4.38 | Gerencial `core/gerencial/100` 6.69, Comercial `core/comercial/200` 5.89, Financeiro `core/financeiro/200` 5.62, Recursos Humanos `core/rh/100` 6.74 | as listed | 4.5:1 (text) |

Sistemas, Educação and Igrejas keep their `theme/brand-text-dark` tone: they already pass. All targets are existing primitives: no new core value (rule T9). The change reaches every component that reads these semantics in dark, always one tone lighter and more legible: the active tab label, links, the active sidebar items, the scheduler event bar, the progress segments, the tree indicator, the completed stepper connector, and the error texts of progress and file-upload.

## F3 — component tokens of nph-scheduler

| Token | Points to | Value | Before (derived in the code) |
|---|---|---|---|
| `scheduler/hour-height` | `core/space/900` | 48 | 2 × `scheduler/event-min-height` |
| `scheduler/mini-month-cell-size` | `control/height-default` | 36, as drawn in Figma | `control/height-compact` (28) |
| `scheduler/list-time-width` | `core/space/1500` | 144 | 3 × `scheduler/time-column-width` |
| `scheduler/list-time-width-compact` | `core/layout-width/list-time-compact` (new) | 72 | 1.5 × `scheduler/time-column-width` |
| `scheduler/month-row-min-height` | `core/space/1200` | 96 | 4 × `scheduler/event-min-height` |

Rule T9, step by step: only the mini-month cell has a semantic token with the same function (control height). The other four have none, so they point straight to the core, reusing the value that exists. Only 72 is a new core value, created first in the core. `core/space/1200` and `core/space/1500` existed in Figma and not in the code; they enter the sources here.

Rejected: option 2 of F1 (keep the dark values) and option 2 of F3 (keep the derived measures).
