```json
{
  "task": "DSA-107",
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
    "converted_decision": "Items 9 and 6 of the nph-rich-text-editor approval of 2026-11-22, approved as recommended: new semantics layout/multiline-min-height and layout/multiline-max-height, with the nph-textarea moving to them in a task of its own; 12 px between the editor footer actions, with the nph-textarea footer at 8 px in a pending decision of its own."
  }
}
```

# DSA-107 — `foundation-decision`

## The decisions
On 2026-11-22 the design owner approved, as recommended:

- **Item 9.** The editor area takes the new semantics `layout/multiline-min-height` and `layout/multiline-max-height` (three and ten lines, the same primitives as the `nph-textarea`). Their effect, written in the item: the `nph-textarea` stays on `layout/textarea-*` and moves to the new ones in a task of its own. This is that task.
- **Item 6.** The editor footer actions go from 8 to 12 px (`space/inline-loose`). Its effect, written in the item: the `nph-textarea` footer stays at 8 px in the same footer, in a pending decision of its own. That is D-1 of this task.

## Why item 9
`layout/textarea-min-height` and `layout/textarea-max-height` say "DO NOT USE outside nph-textarea", and their primitives say "do not consume directly": both doors were closed to the editor. The market research of 2026-11-22 found no system with a height rule of its own for an editor (Primer and MUI measure a multi-line area in lines, with a minimum and a maximum: https://primer.style/product/components/textarea/ ; https://mui.com/material-ui/react-text-field/ ) and said that only changing the description works when the semantic name describes the function; the name cites the textarea, so new general semantics (T9: from the general to the specific; https://www.figma.com/resource-library/design-tokens/ ). Refused alternative: only a new description of `layout/textarea-*` covering the editor.

## Why D-1 stays open
The approval decided the editor footer, not the `nph-textarea` one; the item said the textarea goes to a pending decision of its own. D-1 asks it, with the recommendation and the sources in the task.

## What the code has today
Read on `v/5.0.0` on 2026-11-22: `nph-textarea.css` reads `--nph-layout-textarea-min-height` and `--nph-layout-textarea-max-height` on the field, and `--nph-space-inline` between the footer actions; the spec says "space/inline between the actions".
