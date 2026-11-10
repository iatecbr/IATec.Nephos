```json
{
  "id": "DSA-74",
  "goal": "Implement the nph-file-upload, a drop zone to choose or drop files in a form with the list of the files right below it, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 730,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-file-upload",
  "dependencies": [
    "DSA-03",
    "DSA-09",
    "DSA-13",
    "DSA-28",
    "DSA-51"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-file-upload documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-74/figma-docs-accepted-2026-11-10.md",
      "result": "passed",
      "verified_at": "2026-11-10",
      "verified_by": "indiane"
    },
    {
      "id": "stroke-style-token",
      "description": "The build accepts the strokeStyle type and the two border-style tokens that exist in Figma are in the repository: core.border-style.dashed (dashed) and file-upload.border-style pointing to {core.border-style.dashed}. Add strokeStyle to HANDLED_TYPES in scripts/tokens-lib.mjs and create the two tokens, as in Figma (approved decision; in Figma the dash is 6 and the gap is 4; in CSS dashed). Until then the drop zone uses border-style: dashed.",
      "command": "npm run build:tokens && npm run test:tokens",
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-74/figma-docs-accepted-2026-11-10.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-10.md, nph-file-upload: visual acceptance, Figma UX QA and textual audit approved, documentation accepted (item 1), and items 2 to 11 of the approval page approved (dashed border style token, spacing straight to core, thumbnail radius, the three uploading and done tokens per theme on the primitive, icon box and uploading icon on the primitive, state borders in dark at 40%, dragging icon on color/primary-on-surface, file-lines and file-image in nph-icon, compact format only in a container of 668 px or more, list with no scroll of its own, the other points of the appendix as recommended)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5311-8328",
    "date": "2026-11-10",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-file-upload documentation frame (5311:8328) was accepted as the API and behavior specification of nph-file-upload. COMPONENT_SET nph-file-upload (5297:7473) and COMPONENT_SET nph-file-upload-item (5298:7669). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-10"
}
```

# DSA-74 — nph-file-upload, the drop zone and the list of files

## Goal
The `nph-file-upload` exists in `src/components/nph-file-upload/`, with a spec, tests and stories, in the contract accepted in Figma: a drop zone with a button that opens the file picker, and the list of the files right below it, each one with its upload state. It has two parts, the drop zone (`nph-file-upload`) and the file item (`nph-file-upload-item`).

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-74/figma-docs-accepted-2026-11-10.md`. It carries the Figma documentation converted to text, with the tokens of each part, the default behavior, the combined states, the limits, the inherited decisions, the icon and image rules and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Parts**: the drop zone (icon, phrase and button, rule) and the file item (icon box or thumbnail, name, format and size, status line, actions). The zone has two formats, default (stacked and centered) and compact (one row), and seven states: empty, hover, focus, dragging, error, limit and disabled. The item has seven states: ready, uploading, sent, error, done, done-hover and done-focus, and two types, file and image.
- **Trigger**: the real nph-button secondary solid "Choose files" inside the zone opens the file picker. The whole zone is not a button and takes no focus. The zone receives the dropped file and shows the dragging state. Dragging is never the only way: the button is the alternative (WCAG 2.5.7).
- **Zone states**: hover and focus come from the button (the button changes and the icon turns solid; the zone border does not change). Dragging: background, border, phrase and icon go to the brand colors, the phrase becomes "Drop to add the files" and the button disappears, with its place kept so the height does not change (186 in the default format). Error: the rule becomes the reason, with `circle-xmark`, in `file-upload/error-foreground`; background and border go to the error colors. Limit: background and border go to the warning colors, the phrase says the limit, the rule says how to free space and the button is disabled. Disabled: the whole zone under `file-upload/disabled-opacity`, with a real `disabled` on the button.
- **Item states**: ready appears when the upload happens together with the form. Uploading shows nph-spinner and "Uploading · 64%", with no bar. Sent shows `circle-check`. Error shows the reason with `circle-xmark` and "Try again". Done is the file already saved: the name is a link that opens the file; on hover the name is underlined and the border is `file-upload-item/border-done-hover`; on focus the ring draws the whole row.
- **Item type**: file shows `file-lines` in the box, in the color of the state; image shows an nph-image thumbnail (32 x 32, 1:1, `file-upload-item/thumbnail-size`), cut from the chosen file at 64 x 64 with `object-fit: cover`.
- **Keyboard and roles** (APG Button pattern, WCAG 2.2): the order is the "Choose files" button, then each item in visual order; inside the item, the name link (done), "Try again" (error) and the remove button. Enter and Space on the button open the picker; Enter on the name link opens the file, Space does nothing; on the remove button they remove the file or cancel the upload, named "Remove X" or "Cancel upload of X"; on "Try again" they send again. After the picker closes, the focus returns to the button. After a removal, the focus goes to the remove button of the next item, then of the previous one, then to the button when the list is empty. After "Try again" the focus goes to the remove button of the same item ("Cancel upload of X"), because the button disappears (WCAG 2.4.3, not documented by the design systems consulted).
- **Screen reader**: one `aria-live="polite"` region of the component announces added ("2 files added"), sent, error ("Error: X not sent. Reason.") and removed, without moving the focus. The progress stays in the visible text and in `role="progressbar"` on the item, with no announcement per percent. The zone error (limit, format) is tied to the button by `aria-describedby`. Decorative icons are `aria-hidden`.
- **Width**: the compact format only applies when the container is at least 668 px wide; below that the zone uses the default format, stacked; it never breaks into lines. Use a container query (Pend. 19). The default format is drawn at 480.
- **List**: no scroll of its own. It grows downward, item below item, with `file-upload/list-gap`, and scrolls with the page, up to the limit of files of the rule (Pend. 20). With no files, only the zone appears.
- **Combined states** (rule T11): zone in error or in limit + disabled: disabled wins, with no state border and no state background, only `file-upload/disabled-opacity`. Selected or checked does not apply. The item has no disabled state; with the whole form disabled, the code follows the same rule.
- **Inherited decisions**: the trigger is a real nph-button inside the zone; the dashed border comes from the stroke style only; typography comes from the `text/*` styles (`text/label-md` for the file name, `text/body-md` for the phrase of the zone, `text/body-sm` for the rule, format, size and status); the zone icon is `icon/size-lg`; the error, limit and sent borders are `status/*` in light and the status color at 40% in dark (`core/alpha/*-400-40`). The icon box has no background on done, done-hover and done-focus (her choice on the piece, with no token). Outside the component: web address, confirmation on removal, automatic upload as the default, an extra state for a server error, and a single file (nph-input-file).
- **Icon and image**: the zone icon is `cloud-arrow-up` of nph-icon at `file-upload/icon-size` (24), light on empty and disabled, solid on hover, focus, dragging, error and limit; in the error, `circle-xmark` light at `icon/size-sm` before the reason. In the item: `file-lines` (file type) or the thumbnail (image type), `circle-check` and `circle-xmark` light at 16, nph-spinner sm at 16, `rotate-right` on "Try again" and `xmark` on the remove button, with the weight of their own pieces. `file-lines` and `file-image` (light and solid) are new in nph-icon.

## Open points for the code
- The API that sets the format, the state, the accepted formats and size, the file limit, and the items with their state and type; and how the code tells "upload with the form" from "automatic upload".
- The `file-lines` and `file-image` icons (light and solid) go into nph-icon with this task; the Figma nph-icon set already has them.
- The hidden texts and the live region messages ("2 files added", "Error: X not sent. Reason.", "Uploading · 64%", "Upload complete, click to open"): who provides and translates them.
- The size and the type of the validation: where the format and size rules run and how the reason of each error is chosen (format and size are separate messages).
- How the thumbnail of the image type is generated (64 x 64, `object-fit: cover`) and what the image type does if nph-image is not in the first version (the `file-image` icon in the box, as the file type).
- How the container query for the 668 px switch is written and what the zone does between 480 and 668.
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.

## Tokens that stay without a component token
The size of the `circle-xmark` of the reason and of the icons of the item uses `icon/size-sm`; the width of the focus halo uses `focus/ring-width`; the width of the focus border of the item is the one of `focus/border`'s rule (1 px); `file-upload/list-gap` belongs to the composition (zone and list), not to the zone.

## Why it is ready
The 64 tokens (`file-upload/*` 28 and `file-upload-item/*` 36) and the three new primitives `core/alpha/danger-400-40`, `core/alpha/success-400-40` and `core/alpha/warn-400-40` came with this task and are on `v/5.0.0`. Two tokens that exist in Figma wait for the build: `core/border-style/dashed` and `file-upload/border-style` (gate `stroke-style-token`). The pieces inside are done: nph-icon (DSA-03), nph-spinner (DSA-09), nph-button (DSA-13), nph-field (DSA-28) and nph-image (DSA-51).

## How it is proved
**`figma-docs-accepted`** — passed. **`stroke-style-token`** — `npm run build:tokens` and `npm run test:tokens` pass with `strokeStyle` handled and the two tokens in the source. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value, except the two `border-style` tokens of the gate `stroke-style-token`. It does not change Figma. It does not change nph-button, nph-icon-button, nph-spinner or nph-image. It does not build the single-file field (nph-input-file) nor the file list in table columns (that is a composition with nph-data-table).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, documentation frame `5311:8328` and the evidence of the `figma-docs-accepted` gate
- Component sets: drop zone `5297:7473`, file item `5298:7669`
- WAI-ARIA APG, Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- Salt, File drop zone: https://www.saltdesignsystem.com/salt/components/file-drop-zone/accessibility
- React Aria, DropZone: https://react-aria.adobe.com/DropZone
- GOV.UK, File upload: https://design-system.service.gov.uk/components/file-upload/
- Carbon, File uploader: https://carbondesignsystem.com/components/file-uploader/usage/
- WCAG 2.2: Focus Order, Dragging Movements and Status Messages
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
