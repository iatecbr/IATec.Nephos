```json
{
  "id": "DSA-34",
  "goal": "Make each Docs page read use_when and do_not_use_when from the Metadata of its sheet, with a test that fails a page whose lists differ, after bringing the sheets level with the accepted frames (P71).",
  "phase": "F4",
  "approved_order": 360,
  "owner": "elvys",
  "state": "blocked",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "The sheets, the generated Metadata, the Docs pages, the equality test and the dictionaries pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "PR #84 (audit/storybook-impeccable) changes src/shared/docs/page.ts, .storybook/ and the dictionaries; starting before its merge means conflicts.",
      "owner": "elvys",
      "what_resolves": "PR #84 merged into v/5.0.0.",
      "opened_at": "2026-10-15"
    }
  ],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p71",
    "docs/decisoes-tecnicas.md#p63",
    "docs/operacao/tarefas/DSA-30.md, D1, answered by Indiane on 2026-10-15",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 and D2 of DSA-34",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane approved the merged lists of nph-button, nph-badge, nph-icon and nph-label (B2 closed)"
  ],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-16"
}
```

# DSA-34 — Docs lists read from the Metadata

## Goal
Every `Docs` page shows the `use_when` and `do_not_use_when` of `src/shared/metadata/<piece>.json`, and a test fails the page that differs.

## Decisions answered
Indiane answered D1 and D2. The task waits for B1. B2 is closed: the approved lists are below.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The English lists come from the Metadata. The `pt-BR` and `es` pages take the translation of each item from `.storybook/i18n/pt-BR.json` and `es.json`. | Keys each translation to its Metadata item. A test fails when an item has no translation in `pt-BR` or `es`, or when the number of items differs from the Metadata. The sheet and the Metadata stay English only (DSA-14). |
| D2 | Two items that say the same thing may become one. Claude proposes the merged list of each component, Indiane approves it, and the approved list comes into this task in English (B2). | Writes the approved lists into the sheets and generates the Metadata again. It does not merge, reword or drop an item on its own. |

## Approved lists (B2)
Indiane approved these lists on 2026-10-16, item by item. Each sheet takes
them in this order as `use_when` and `do_not_use_when`.

Where a sheet item and a frame item said the same thing, they became one, with
the frame text, which `.storybook/i18n/*.json` already translates. Spelling
is American English (DSA-30, D8), so "colour" becomes "color".

Two `nph-button` items come only from the sheet and have no dictionary entry
yet. Their approved `pt-BR` text is given; the `es` entry follows it.

### nph-button

`use_when`
1. "To start an action identified by text, such as save or send."
2. "Highlighting the main action of a block over the alternatives, through emphasis." New entry, `pt-BR`: "Destacar a ação principal do bloco sobre as alternativas, pela ênfase."
3. "Write in the text what happens on click."
4. "Choose the severity by the meaning of the action, never by color."
5. "Choose the emphasis by how much the action stands out: solid, outline, light or ghost."
6. "Use size large on touch screens."
7. "Without text, use the icon-only button and give it an accessible name."

`do_not_use_when`
1. "To show a field error: validation belongs to the field (nph-field)."
2. "Icon only on an action with consequences, such as delete or publish."
3. "To navigate to another destination."
4. "Labeling a state: use nph-badge." New entry, `pt-BR`: "Marcar um estado: use nph-badge."
5. "size compact as the main target on a touch screen."
6. "Enlarging the icon to add emphasis."
7. "Using color as the only signal of intent, focus or state."
8. "Creating a severity, emphasis or size outside the matrix, or painting the button by hand."

Items 2 and 5 of `use_when` stay apart: one is about the main action, the
other about the four emphases.

### nph-badge

`use_when`
1. "To label the status or the category of an item."
2. "Choose the severity by meaning. A permanent status uses secondary or primary; success confirms an event that has just happened."
3. "Write one or two words."
4. "Turn the icon on only to reinforce the word."
5. "Give one status per item."

`do_not_use_when`
1. "As a button: the badge takes no click and no focus. Use nph-button."
2. "success as a permanent badge: use secondary or primary."
3. "A badge without text, with only an icon."
4. "Two status badges on the same item."
5. "A sentence inside the badge: supporting text stays outside the component."
6. "Painting the background or the text by hand: the color comes from the severity and the emphasis."

### nph-icon

`use_when`
1. "A control or piece of content needs an icon that exists in the Nephos core."
2. "The icon reinforces a label, state or direction without replacing the textual information."

`do_not_use_when`
1. "The action is domain-specific or has consequences: use a text label alongside the icon."
2. "The requested icon does not exist in the core: report the gap and wait for a decision."
3. "The Font Awesome Pro package, files or secret in versioned material."
4. "A visual variant created just to fill a matrix."
5. "Duotone outside structural navigation, or Duotone and Classic mixed in the same group."
6. "Color defined as a property: the icon inherits currentColor from the context."

### nph-label

`use_when`
1. "To give a form control a visible name, on its own or inside an nph-field."
2. "required=true when filling in the field is mandatory, with the asterisk explained in a legend on the form."
3. "info=true to show the information icon after the text."
4. "Keep the label in color/foreground, even when the field has an error."

`do_not_use_when`
1. "Using it for a sentence with a verb and a full stop: that is body text."
2. "Using it as a section or group title: that is heading-sm."
3. "Using it for emphasis inside a paragraph: that is <strong>."
4. "Putting help or an error message in the label: they belong to nph-field."
5. "Using the field's example text instead of the label."
6. "Painting the label or the asterisk with color/destructive: it mixes up required and error."

Item 2 of `use_when` also covers the frame item "Explain the asterisk in a
visible legend on the form", which leaves the dictionary.

## How it is proved
**`review-and-merge`** passes when the sheets of `nph-badge`, `nph-button`, `nph-icon` and `nph-label` hold every item of their accepted frames; `node scripts/verificar-operacao.mjs --gerar-metadata` ran in the same commit and `V32` passes; the `useDontUse` block of each `Docs` page reads the Metadata; a test fails a page whose lists differ from the Metadata; `npm test`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `npm run test:operacao`, `npm run build-storybook` and `git diff --check` exit 0; and the pull request is merged into `v/5.0.0`.

## What this task does not do
It does not create the Metadata tab in Storybook (P63). It does not edit `src/shared/metadata/` by hand. It does not remove an item that Indiane accepted.

## Sources
- `docs/decisoes-tecnicas.md` P63, P71
- `fichas/nph-badge.md`, `fichas/nph-button.md`, `fichas/nph-icon.md`, `fichas/nph-label.md`
- `src/shared/metadata/`
- `src/shared/docs/page.ts`, `useDontUse`
- `src/components/*/*.docs.stories.ts` and `*.docs.test.ts`
- `.storybook/i18n/*.json`
- `docs/stories.md` §4.8, §4.10
