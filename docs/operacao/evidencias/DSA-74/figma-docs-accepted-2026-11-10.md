```json
{
  "task": "DSA-74",
  "gate": "figma-docs-accepted",
  "date": "2026-11-10",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5311-8328",
    "date": "2026-11-10",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-file-upload documentation frame (5311:8328), COMPONENT_SET nph-file-upload (5297:7473) and COMPONENT_SET nph-file-upload-item (5298:7669), with the Figma UX QA and the textual audit approved, and approved the points of the approval page: the dashed border as a style token (core/border-style/dashed and file-upload/border-style; in Figma the dash is 6 and the gap is 4, in code dashed); the spacing straight to core (file-upload/padding on core/space/700; file-upload/padding-compact-block, file-upload/gap-compact, file-upload-item/padding-block and file-upload-item/gap on core/space/300; file-upload-item/actions-gap on core/space/100); file-upload-item/thumbnail-radius on core/radius/300; file-upload-item/border-uploading, background-done and border-done per theme on the primitive; the icon box and the uploading icon on the primitive; the state border in dark at 40% (file-upload/border-error, file-upload/border-limit, file-upload-item/border-error and file-upload-item/border-success: light on the semantic token, dark on the new alpha); the dragging icon on color/primary-on-surface; file-lines and file-image (light and solid) in nph-icon, with the file item of the file type using file-lines; the compact format only in a container of 668 px or more (below it, the default format, with a container query) and the list with no scroll of its own (it grows with the page, up to the limit of files); and the other points of the appendix as recommended."
  }
}
```

# DSA-74 — `figma-docs-accepted`

The documentation of `nph-file-upload` (frame `5311:8328`) was accepted in Figma on 2026-11-10, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The file upload enters the first version of Nephos. Its tokens came with this task and are on `v/5.0.0`, except the two border-style tokens, which wait for the build (see below).

What changed in the tokens with this task:

- New: 64 semantic tokens, `file-upload/*` (28) and `file-upload-item/*` (36). Every layer of the two Figma sets is bound to them; the visual did not change. No semantic token was created outside these two families.
- New in core: `core/alpha/danger-400-40`, `core/alpha/success-400-40` and `core/alpha/warn-400-40`, the color of `core/danger/400`, `core/success/400` and `core/warn/400` at 40%, written as `rgba(r, g, b, 0.4)`, in the pattern of `core/alpha/white-10`. A new value goes first to core (rule T9). Dark state borders use them, soft as in light: in dark the status borders measure 4.86 to 6.58:1 against 1.42 to 1.69:1 in light, and at 40% they measure 1.79 to 2.14:1. The border is a reinforcement (the icon and the text tell the state; WCAG 1.4.11 and 1.4.1). Primer and Carbon use 40% and Radix uses about 41%.
- Declared deviation from rule 2 of T9: `status/error-border`, `status/success-border` and `status/warning-border` have the function, but changing their dark value would drag the other pieces. Light points to the current semantic token and dark to the alpha. The foundation decides later whether to create `status/*-border-muted`, as Primer does.
- **Two tokens that exist in Figma wait for the build and are not in the repository**: `core/border-style/dashed` (string `dashed`) and `file-upload/border-style` (points to `core/border-style/dashed`, the dashed border of the zone in every state). They need the `strokeStyle` type, which `HANDLED_TYPES` in `scripts/tokens-lib.mjs` does not list; the build refuses an unlisted type. The task has the gate `stroke-style-token` for it. In Figma the dash is 6 and the gap is 4; in CSS it is `border-style: dashed`. Until the gate passes, the drop zone uses `border-style: dashed`.
- Tokens straight to core by decision, because no semantic token has their function: `file-upload/padding` on `core/space/700` (32; `space/section` is also 32 but is the space between sections); `file-upload/padding-compact-block`, `file-upload/gap-compact`, `file-upload-item/padding-block` and `file-upload-item/gap` on `core/space/300` (12; `space/inline` is 8); `file-upload-item/actions-gap` on `core/space/100` (4; `space/inline-tight` is for inside a unit); `file-upload-item/thumbnail-radius` on `core/radius/300` (6; `radius/control` is for what is operated; the precedent `table/thumbnail-radius` is 4).
- Tokens per theme on the primitive by decision: `file-upload-item/border-uploading` (`theme/brand-200` light, `theme/brand-400` dark; there is no semantic token of a light brand border), `file-upload-item/thumbnail-background-uploading` (`theme/brand-100`, `theme/brand-800`; `color/primary-surface-hover` is only for hover and its description forbids resting use), `file-upload-item/icon-foreground-uploading` (`theme/brand-600`, `theme/brand-100`; `color/primary-on-surface` is only over `color/primary-surface`), `file-upload-item/thumbnail-background-success` (`core/success/100`, `core/success/800`; `status/success-surface-hover` is for hover), `file-upload-item/thumbnail-background-error` (`core/danger/100`, `core/danger/800`; `color/destructive-surface-hover` is for hover), `file-upload-item/background-done` (`core/neutral/50`, `core/surface/700`; `color/accent-subtle` has the value but is for hover) and `file-upload-item/border-done` (`core/neutral/100`, `core/alpha/white-10`; `color/dialog-separator` has the value but is a dialog line). If another piece asks for the same step, the foundation creates function semantic tokens (such as `*-surface-strong`).
- Left without a component token: the size of the `circle-xmark` of the reason (`icon/size-sm`), the icons of the item (`icon/size-sm`), the width of the focus halo (`focus/ring-width`) and of the focus border of the item; `file-upload/list-gap` belongs to the composition (zone and list), not to the zone.
- The `use` of sixteen semantic tokens in `design.md` now names nph-file-upload where the accepted Figma uses them: `color/primary-surface`, `color/primary-on-surface`, `color/primary-border`, `color/input`, `color/foreground`, `status/error-surface`, `status/warning-surface`, `status/success-surface`, `status/error-border`, `status/success-border`, `status/error`, `status/warning`, `icon/size-lg`, `space/container-padding`, `radius/container` and `space/stack-snug`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks (`formato`, `padrão`, `compacta`, `estado`, `vazio`, `hover`, `foco`, `arrastando`, `erro`, `limite`, `desabilitado`, `pronto`, `enviando`, `enviado`, `concluído`, `concluído-hover`, `concluído-foco`, `tipo`, `arquivo`, `imagem`).

## Purpose

Receives files in a form, by the button or by drag and drop, and shows each file in a list with the state of its upload.

Use it when the field accepts several files in one record and the person needs to see, before choosing, the formats, the size and the number accepted. It does not replace the single file field (nph-input-file): for one file, use the field, not this zone. It does not replace the view of the files of a record outside the form, in table columns: that is a composition with nph-data-table. Inside the form, a file already saved shows as a done item.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-file-upload` (the drop zone) | `5297:7473` | `formato` (`padrão`, `compacta`) × `estado` (`vazio`, `hover`, `foco`, `arrastando`, `erro`, `limite`, `desabilitado`). |
| `nph-file-upload-item` (the file item) | `5298:7669` | `estado` (`pronto`, `enviando`, `enviado`, `erro`, `concluído`, `concluído-hover`, `concluído-foco`) × `tipo` (`arquivo`, `imagem`). |

The zone has the nph-button "Choose files" (secondary solid) and the nph-icon `cloud-arrow-up`. The item has nph-icon, nph-image (type image), nph-spinner, nph-button "Try again" (secondary ghost) and nph-icon-button (secondary ghost) to remove. The label, the required asterisk and the help text belong to nph-field.

## Tokens

The first value is light and the second is dark; one value means the same in both. All tokens are semantic, in two families.

### Drop zone (`file-upload/*`)

| Token | Points to | Part |
|---|---|---|
| `file-upload/background` | `color/background` | Zone background on empty, hover, focus and disabled |
| `file-upload/background-dragging` | `color/primary-surface` | Zone background while dragging, a temporary highlight |
| `file-upload/background-error` | `status/error-surface` | Zone background on error |
| `file-upload/background-limit` | `status/warning-surface` | Zone background on limit |
| `file-upload/border` | `color/border` | Dashed border on empty, hover, focus and disabled |
| `file-upload/border-dragging` | `color/primary-border` | Border while dragging: it marks the target |
| `file-upload/border-error` | `status/error` · `core/alpha/danger-400-40` | Border on error; in dark, the status color at 40% |
| `file-upload/border-limit` | `status/warning` · `core/alpha/warn-400-40` | Border on limit; in dark, the status color at 40% |
| `file-upload/border-width` | `border/width` | Border thickness |
| `file-upload/radius` | `radius/container` | Zone corner |
| `file-upload/padding` | `core/space/700` (32) | Inner padding of the default format |
| `file-upload/gap` | `space/stack-snug` | Gap between icon, action line and rule, default format |
| `file-upload/padding-compact-block` | `core/space/300` (12) | Top and bottom padding, compact format |
| `file-upload/padding-compact-inline` | `space/container-padding` | Side padding, compact format |
| `file-upload/gap-compact` | `core/space/300` (12) | Gap between icon, texts and button, compact format |
| `file-upload/gap-text-compact` | `space/stack-tight` | Gap between the phrase and the rule, compact format |
| `file-upload/icon-size` | `icon/size-lg` | Zone icon (24) |
| `file-upload/icon-foreground` | `color/muted-foreground` | Zone icon on empty, hover, focus and disabled |
| `file-upload/icon-foreground-dragging` | `color/primary-on-surface` | Zone icon while dragging, the pair of `color/primary-surface` |
| `file-upload/icon-foreground-error` | `status/error` | Zone icon on error |
| `file-upload/icon-foreground-limit` | `status/warning` | Zone icon on limit |
| `file-upload/foreground` | `color/foreground` | Zone phrase |
| `file-upload/foreground-dragging` | `color/primary-on-surface` | Zone phrase while dragging |
| `file-upload/muted-foreground` | `color/muted-foreground` | Zone rule, and the phrase on limit |
| `file-upload/error-foreground` | `status/error` | Reason of the error in the zone |
| `file-upload/error-gap` | `space/inline-tight` | Gap between the icon and the reason |
| `file-upload/list-gap` | `space/stack` | Gap between the zone and the list, and between the items |
| `file-upload/disabled-opacity` | `state/disabled-opacity` | Opacity of the whole disabled zone |

Not in the repository yet: `file-upload/border-style` → `core/border-style/dashed` (gate `stroke-style-token`).

### File item (`file-upload-item/*`)

| Token | Points to | Part |
|---|---|---|
| `file-upload-item/background` | `color/background` | Background of the ready item |
| `file-upload-item/border` | `color/border` | Border of the ready item |
| `file-upload-item/background-uploading` | `color/primary-surface` | Background of the uploading item |
| `file-upload-item/border-uploading` | `theme/brand-200` · `theme/brand-400` | Border of the uploading item |
| `file-upload-item/background-success` | `status/success-surface` | Background of the sent item |
| `file-upload-item/border-success` | `status/success-border` · `core/alpha/success-400-40` | Border of the sent item; in dark, the status color at 40% |
| `file-upload-item/background-error` | `status/error-surface` | Background of the item with an error |
| `file-upload-item/border-error` | `status/error-border` · `core/alpha/danger-400-40` | Border of the item with an error; in dark, the status color at 40% |
| `file-upload-item/background-done` | `core/neutral/50` · `core/surface/700` | Background of done, done-hover and done-focus |
| `file-upload-item/border-done` | `core/neutral/100` · `core/alpha/white-10` | Border of done and done-focus |
| `file-upload-item/border-done-hover` | `color/input` | Border of done-hover: the whole item is the click area of the name link |
| `file-upload-item/focus-border` | `focus/border` | Focus border of the item, on done-focus |
| `file-upload-item/focus-halo` | `focus/halo` | Focus halo of the item, on done-focus |
| `file-upload-item/focus-border-radius` | `focus/border-radius-container` | Corner of the focus border |
| `file-upload-item/focus-halo-radius` | `focus/radius-container` | Corner of the halo |
| `file-upload-item/border-width` | `border/width` | Border thickness of the item |
| `file-upload-item/radius` | `radius/container` | Item corner |
| `file-upload-item/padding-block` | `core/space/300` (12) | Top and bottom padding of the item |
| `file-upload-item/padding-inline` | `space/container-padding` | Side padding of the item |
| `file-upload-item/gap` | `core/space/300` (12) | Gap between the box, the texts and the actions |
| `file-upload-item/text-gap` | `space/stack-tight` | Gap between the name and the status line |
| `file-upload-item/status-gap` | `space/inline-tight` | Gap between the status icon and its text |
| `file-upload-item/actions-gap` | `core/space/100` (4) | Gap between "Try again" and the remove button |
| `file-upload-item/thumbnail-size` | `image/size-sm` | Size of the icon box and of the thumbnail (32) |
| `file-upload-item/thumbnail-radius` | `core/radius/300` (6) | Corner of the icon box |
| `file-upload-item/thumbnail-background` | `color/muted` | Icon box background, ready. On done, done-hover and done-focus the box has no background (her choice on the piece, with no token) |
| `file-upload-item/thumbnail-background-uploading` | `theme/brand-100` · `theme/brand-800` | Icon box background, uploading |
| `file-upload-item/thumbnail-background-success` | `core/success/100` · `core/success/800` | Icon box background, sent |
| `file-upload-item/thumbnail-background-error` | `core/danger/100` · `core/danger/800` | Icon box background, error |
| `file-upload-item/icon-foreground` | `color/muted-foreground` | Type icon in ready and done, and the done icon |
| `file-upload-item/icon-foreground-uploading` | `theme/brand-600` · `theme/brand-100` | Type icon while uploading, over the box |
| `file-upload-item/icon-foreground-success` | `status/success` | Type icon and status icon, sent |
| `file-upload-item/icon-foreground-error` | `status/error` | Type icon and status icon, error |
| `file-upload-item/foreground` | `color/foreground` | File name; in done, the name is a link and keeps this color |
| `file-upload-item/muted-foreground` | `color/muted-foreground` | Format, size and status |
| `file-upload-item/error-foreground` | `status/error` | Reason of the error in the item |

Typography uses text styles, with no token: `text/label-md` (file name), `text/body-md` (phrase of the zone) and `text/body-sm` (rule, format, size and status). No effect style.

## Anatomy

In the zone, in the default format from top to bottom (icon, phrase and button, rule), centered; in the compact format from start to end (icon, texts, button), centered vertically. In the item, from start to end: icon box or thumbnail, texts and actions, centered vertically; the texts align to the start with the name on top and the status line below.

1. **Zone** — drop area with background `file-upload/background`, a dashed border (`file-upload/border-style`, see the gate) of `file-upload/border-width` in `file-upload/border` and corner `file-upload/radius`. It receives the dropped file.
2. **Icon** — `cloud-arrow-up` of nph-icon, in both formats: light on empty and disabled, solid on hover, focus, dragging, error and limit. In the default format, centered at the top of the stack; in the compact format, at the start of the row, centered vertically.
3. **Phrase and button** — "Drag files here or" and the nph-button secondary solid "Choose files", which opens the picker. While dragging, the phrase becomes "Drop to add the files" and the button disappears, with its place kept. In the default format, phrase and button are stacked and centered; in the compact format, the phrase sits at the start with the rule below it and the button at the end of the row.
4. **Rule** — formats, maximum size and limit in one line ("PDF, PNG or JPG · up to 5 MB · up to 5 files"), in `file-upload/muted-foreground`. On error it becomes the reason in `file-upload/error-foreground` with the icon `circle-xmark`. On limit it says how to free space. In the default format it sits centered at the base of the stack; in the compact format, under the phrase, aligned to the start.
5. **Item** — `nph-file-upload-item`: a box with the icon `file-lines`, or the nph-image thumbnail in the image type; the name, cut on one line with an ellipsis; format and size; the status in text, with nph-spinner while uploading, `circle-check` on sent and done, and `circle-xmark` on error.
6. **Item actions** — "Try again", an nph-button secondary ghost with `rotate-right`, only on error; and the ×, an nph-icon-button secondary ghost, in every item state. They sit at the end of the row, centered vertically, with "Try again" before the ×.

## Properties

| Field | Rule |
|---|---|
| `formato` | `padrão` (the default of the set): icon, phrase, button and rule in a column. `compacta`: everything in one row, for a form with other fields. It is the format of the zone, not the control size. |
| `estado` (zone) | `vazio` (default), `hover`, `foco`, `arrastando`, `erro`, `limite` and `desabilitado`. On hover and focus the button changes and the icon turns solid; the zone border does not change. On dragging, background, border, phrase and icon go to the brand colors and the button disappears, with its place kept so the height does not change. On error, the background goes to `status/error-surface`, the border to `status/error` in light and to the status color at 40% in dark (`core/alpha/danger-400-40`), and the rule becomes the reason. On limit, the background goes to `status/warning-surface` and the border to `status/warning` in light and to `core/alpha/warn-400-40` in dark; the phrase says the limit and the button is disabled. On disabled, the whole zone is under `state/disabled-opacity`. |
| `estado` (item) | `pronto` (default), `enviando`, `enviado`, `erro`, `concluído`, `concluído-hover` and `concluído-foco`. Ready shows when the upload happens together with the form. Uploading shows nph-spinner and the percentage, with no bar. Done is the file already saved: the name opens the file; on hover the name is underlined and the border is `file-upload-item/border-done-hover` (→ `color/input`); on focus the ring draws the whole row. |
| `tipo` (item) | `arquivo` (default) shows the `file-lines` icon in the box, in the color of the state; `imagem` shows the nph-image thumbnail. nph-icon also has `file-image`, for an image; there is no icon per extension, because the type is already written in the name. |
| Not a property | Required: asterisk on the nph-field label. Help: nph-field help text. Automatic upload or upload with the form: set in code; ready exists in the upload with the form. Size of the button and of the ×: follows the form. Long name: cut on one line with an ellipsis. |

## Behavior

There is no APG pattern for file upload. The base is the native file field, the APG Button pattern and WCAG 2.2 (2.4.3, 2.5.7 and 4.1.3).

| Input | What it does |
|---|---|
| Tab and Shift+Tab | The order is the "Choose files" button, then each item in visual order; inside the item, the name link (done), "Try again" (error) and the ×. The zone takes no focus. A deviation from the market: Carbon and Polaris make the whole zone a button; Nephos follows Salt, React Aria and GOV.UK (only the button). |
| Enter and Space | On the button, they open the system file picker. On the name link, Enter opens the file and Space does nothing (link behavior). On the ×, they remove the file or cancel the upload, with the name "Remove X" or "Cancel upload of X". On "Try again", they send the file again. |
| Focus after choosing files | When the picker closes, the focus goes back to the "Choose files" button. |
| Focus after removing | It goes to the × of the next item; with no next item, to the × of the previous one; with the list empty, to the "Choose files" button. |
| Focus on "Try again" | The button disappears, because the item goes back to uploading; the focus goes to the × of the same item ("Cancel upload of X"), so it is not lost. No design system consulted documents this; it follows WCAG 2.4.3. |
| Screen reader | One `aria-live="polite"` region of the component announces added ("2 files added"), sent, error ("Error: X not sent. Reason.") and removed, without moving the focus. The progress stays in the visible text "Uploading · 64%" and in `role="progressbar"` on the item, with no announcement per percent. The error of the zone (limit, format) is tied to the button by `aria-describedby`. |
| Drag and drop | Dragging is never the only way: the button is the click alternative (WCAG 2.5.7). |
| Esc, click outside, window edge | They do not apply: the component opens no floating layer and the file picker belongs to the system. |
| Pointer and focus | The pointer over the "Choose files" button paints the button and turns the zone icon solid (the zone hover state); the focus on the button does the same, with the ring on the button (the zone focus state). Away from the button the zone does not react to the pointer, and hover does not move the focus. Focus shows only on the "Choose files" button, on the name link, on "Try again" and on the ×, with the Nephos ring. Dragging is a state of its own. |

Combined states (rule T11 of the design system):

- Selected or checked + disabled: does not apply; the zone and the item have no selection.
- Error or limit + disabled (zone): disabled wins; the state border and the state background go away and only `file-upload/disabled-opacity` remains. The item has no disabled state; with the whole form disabled, the code follows the same rule (disabled wins).

Limits:

| Case | Rule |
|---|---|
| Minimum | The compact format is the minimum form of the zone (66 high). |
| Width of the compact format | The compact format only applies in a container of at least 668 px, its drawn width; below that the zone uses the default format, stacked (drawn at 480). The compact format does not break into lines. Use a container query (Pend. 19). |
| Maximum | Limit of files reached: limit state, with the phrase that says how to free space and the button disabled. A file above the maximum size: the item goes to error, with the reason in text. |
| Long text | The file name is cut on one line with an ellipsis; the whole name reaches the screen reader through the accessible name of the link and of the ×. The reason of the error and the status wrap to lines and the item grows (86 high on error). |
| Empty | With no files, only the zone shows, in the empty state; the list is not drawn. |
| Many items | The list grows downward, one item below the other in `file-upload/list-gap`, up to the limit of files of the rule. It has no scroll of its own: it scrolls with the page (Pend. 20). |
| Short window | Does not apply: the component opens no floating layer; the zone and the list stay in the page flow. |

Inherited decisions:

- The pieces are the zone (format × state) and the item (state × file or image type). Outside the component: web address, confirmation on removal, automatic upload as the default, an extra state for a server error, and a single file (nph-input-file, decision map line 140).
- The trigger is a real nph-button inside the zone; the whole zone does not open the picker; hover and focus come from the button.
- The dashed border comes only from the stroke style; typography from the `text/*` styles; the zone icon at `icon/size-lg`; the error border in `status/error` in light and in `core/alpha/danger-400-40` in dark.
- Follows rule T11 as the other components (disabled wins).

Icon and image:

- Zone: `cloud-arrow-up` of nph-icon at `file-upload/icon-size` (`icon/size-lg`, 24), in both formats: light on empty and disabled, solid on hover, focus, dragging, error and limit. On error, `circle-xmark` light of nph-icon at `icon/size-sm` (16), before the reason.
- Item: in the box of the file type, `file-lines` light at `icon/size-sm` (16), in the color of the state (accepted in Pend. 2: `file-lines` for any document and `file-image` for an image, light and solid, new in nph-icon; no icon per extension; Font Awesome has `file-doc` only in the Pro set). Status: nph-spinner sm (16) while uploading, `circle-check` light (16) on sent and done, `circle-xmark` light (16) on error. Actions: `rotate-right` light (16) on "Try again" and `xmark` light on the icon button, through the tokens of their own pieces. The own icons of the item (`file-lines`, `circle-check` and `circle-xmark`) stay light in every state; `rotate-right` and `xmark` follow the weight of nph-button and nph-icon-button.
- Image thumbnail: nph-image sm, 1:1, 32 × 32 (`file-upload-item/thumbnail-size` → `image/size-sm`), corner `image/radius-sm`. The thumbnail is generated from the chosen file at 64 × 64 (2×, for a high density screen), with a crop that covers the box, centered (`object-fit: cover`); the original image does not go into the thumbnail.

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | The text of the zone and of the item meets 4.5:1 in both themes (WCAG 1.4.3); the text of the disabled zone is exempt, because the control is inactive. The dashed border of the zone does not identify the control: the button does, by its label (WCAG 1.4.11). The zone border stays in `file-upload/border` (1.69:1, accepted because the zone is not the control). |
| state border | The colored borders of the item (uploading, sent, error) and the border of done on hover are a reinforcement: the state comes from the text and the icon (WCAG 1.4.11 and 1.4.1). In dark, the state border uses the status color at 40%, soft as in light. |
| visible focus | The zone takes no focus of its own: the focus comes from the "Choose files" button, with the nph-button ring. On done, the name is the link that opens the file, and the ring in `focus/border` and `focus/halo` draws the whole row, above 3:1 over the background in both themes. The × and "Try again" show the ring of their own piece. The name is a link with the click area stretched across the row and the × a separate button, to avoid a control inside a control (WCAG 4.1.2). |
| color is not the only sign | Every colored state has text and an icon: on the zone error, the rule becomes the reason with `circle-xmark`; on the item error, the reason comes with `circle-xmark`; sent and done bring `circle-check` and the word; the limit says what to do (WCAG 1.4.1 and 3.3.1). |
| target size | The button and the × use the size of the form, default or large, never compact; target of at least 24 × 24 (WCAG 2.5.8). Dragging has the button as an alternative (WCAG 2.5.7). |
| accessible name | The button uses the visible text (WCAG 2.5.3). The × carries the file name: "Cancel upload of relatorio-anual-2026.pdf" while uploading and "Remove relatorio-anual-2026.pdf" in the other states. Decorative icons stay `aria-hidden`. Upload complete and error are announced as a status (WCAG 4.1.3); the progress stays in the visible text, with no announcement per percent. |

## Relations and context

| With | Rule |
|---|---|
| nph-field | The label, the required asterisk and the help text belong to it, and the zone takes the place of the control. The reason of the error stays in the zone itself, in the place of the rule. |
| Inside pieces | The state of the zone belongs to the component; the state of each file belongs to the item. Each inner piece (nph-button, nph-icon-button, nph-spinner, nph-image, nph-icon) controls its own color and its own focus. |
| List | The list sits right below the zone, with `space/stack` between the zone and the list and between the items. The items are separated by the space and by their own border, with no nph-separator. |
| Long name | It is cut on one line with an ellipsis. The whole name reaches the screen reader through the accessible name of the link and of the ×. |

## When to use

| Situation | Choice |
|---|---|
| A form where the person attaches files to a record and reviews the list before saving | nph-file-upload |
| The files are the center of the section | Default format |
| The zone shares the form with other fields | Compact format, in a container of 668 px or more |
| Upload together with the form is the common path | Item in ready |
| Each file is worth on its own, with no save button | Automatic upload |

## Required examples

Empty (the rule shows before the choice), the list in use (an upload in progress, an error in the item and a done file) and the limit reached (the button is disabled and the rule says how to free space). Each in light and dark. The documentation also shows the zone in the nph-field with the list below it, the long name cut on one line, the focus on the zone, on the done item and on the ×, the two formats, the wrong error shown only by color and the wrong compact ×.

## Do

| Do | Why |
|---|---|
| Show on the zone the rule of format, size and limit | The person knows what is accepted before choosing |
| Say the reason of the error on the item and offer "Try again" | The person solves it without losing the other files |
| Give the × the name of the file | Whoever uses a screen reader knows what will be removed |
| Use on the button and on the × the same size as the rest of the form | Sibling fields with different heights look like an error |

## Do not

| Do not | Use instead |
|---|---|
| Show the error only by the color of the zone: the person does not know what happened | The reason in place of the rule, with `circle-xmark` |
| Use the compact size on the button or on the ×: in the form, the × is lower than the sibling fields and the target shrinks | Default or large, as the form |

## Appendix points answered

| Point | Answer |
|---|---|
| 1. How done opens the file | The name is a link that opens the file, with the click area stretched across the row; the × stays a sibling button; the focus of the link draws the ring on the whole row. A row as a button with the × inside would be a control inside a control (WCAG 4.1.2). |
| 2. Icon per file type | Only `file-lines` (any document) and `file-image` (image) in nph-icon, light, in the color of the state; no icon per extension. |
| 3. Zone height while dragging | The button goes away and its place is kept, with no focus and out of the screen reader; the height stays at 186. A height that changes pushes the page (CLS). |
| 4. × of the item | nph-icon-button secondary ghost in every state, named "Remove X" or "Cancel upload of X"; target of at least 24 (WCAG 2.5.8). |
| 5. Zone border at 1.69:1 | Accepted: the zone is not the control, the button is (WCAG 1.4.11). |
| 6. Image type with a thumbnail | Kept in the type axis, with the state colors of the item; if nph-image does not enter the first version, the image type uses the `file-image` icon in the box, as the file type. |
| 7. State border description promising 3:1 | On the item the border is a reinforcement (the state comes from the text and the icon); the description of `status/*-border` is corrected outside this component. |
| 8. Icon box corner | 6, straight to `core/radius/300`. |
| 9. Limit as a warning | The orange border, the phrase and the disabled button; red only when trying to pass the limit. |
| 10. Disabled by 50% opacity | Accepted, with a real `disabled` on the button, and no double effect. |
| 11. Progress with no bar | nph-spinner and "Uploading · 64%", with no announcement per percent (the progress stays in the visible text and in `role="progressbar"`). |
| 12. Color of the reason of the error | `status/error` (5.89:1 light and 4.86:1 dark). |
| 13. Component tokens | Created with this task (this file); the hidden layers "(dark · patch L16)" of the item stay hidden in Figma, with no effect, and go away only with her acceptance. |
| 14. State borders in dark | The status color at 40%, with the three new primitives in the core. |
| 15. Zone error only by color | The rule becomes the reason in `status/error` with `circle-xmark`. |
| 16. Base text of the item | Uploading and error in the file type use `relatorio-anual-2026.pdf` and `PDF · 2,4 MB`; the reason of the error is "Network failure while uploading."; format error and size error are separate messages. |
| 17. Icon box background | The primitive per theme (`theme/brand-100·800`, `core/success/100·800`, `core/danger/100·800`) and the uploading icon on `theme/brand-600·100`. |
| 18. Text and icon over the state surfaces | The name and the status of the item, the phrase of the zone on error and the rule stay on `color/foreground` and `color/muted-foreground`, and on limit the phrase and the rule stay on `color/muted-foreground` (neutral text measures 13.31:1 or more); the dragging icon goes from `color/primary` to `color/primary-on-surface`, the pair of the phrase (6.26:1 to 13.79:1 in dark). |
| 19. Width of the compact format | Only in a container of at least 668 px; below it, the default format, stacked; a container query. |
| 20. List with many items | No scroll of its own: it grows downward and scrolls with the page, up to the limit of files of the rule. |
