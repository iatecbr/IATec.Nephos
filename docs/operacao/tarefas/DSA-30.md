```json
{
  "id": "DSA-30",
  "goal": "Record Indiane's answers to the eight Storybook documentation questions left open by the Storybook audit, each in its canonical source, before anyone changes the Docs pages, the tests or the tokens they touch.",
  "phase": "F4",
  "approved_order": 310,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "decisions-recorded",
      "description": "Indiane answered D1–D8, and each answer is in its canonical source: docs/stories.md, design.md (through Claude in Figma when a token is involved), docs/decisoes-tecnicas.md or the figma-docs-accepted evidence of DSA-03 and DSA-13.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p19",
    "docs/decisoes-tecnicas.md#p20",
    "docs/decisoes-tecnicas.md#p63",
    "docs/decisoes-tecnicas.md#p64",
    "docs/decisoes-tecnicas.md#p67",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-15.md, Indiane answered D1–D8 of DSA-30 and accepted the Figma preview 1843:2976"
  ],
  "external_origin": null,
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-15"
}
```

# DSA-30 — Storybook documentation questions for Indiane

## Goal
Each of D1–D8 has Indiane's answer in its canonical source, and the agenda below
can be closed item by item. This task decides nothing. It holds the evidence,
the options and the sources that disagree, so that the answers can be given
without reopening the audit.

## Where this comes from
A critique and audit of the Storybook, over `v/5.0.0` at `8edeb33`, found
these eight items. The audit's other P1 and P2 fixes (accessibility, frame,
entry pages, labelled Validation pages, polish) need no decision and are on the
branch `audit/storybook-impeccable`. These eight stayed out because each one
needs a decision, touches a token or finds two current sources that disagree.
The evidence below was read on `v/5.0.0` unless it says otherwise.

## Decisions (answered by Indiane on 2026-10-15)
All eight are answered below each question; the options stay for the record.
The task is `ready`: what remains is recording each answer in its canonical
source and the work that follows from it.

| ID | Topic | Sources that disagree |
|---|---|---|
| D1 | Docs page lists: sheet or Figma transcription | The sheet (`fichas/<piece>.md`, P63) × the dictionary transcribed from the accepted Figma frame |
| D2 | Usage section with markup and import | The fixed model in `docs/stories.md` §4.10 × the audit; no publishable import path exists (P19) |
| D3 | axe accessibility gate | P19 "with the first real component" × 8 components with no definition |
| D4 | Brand global in Storybook | `docs/stories.md` §6.4 "a single mode selector" × P20/P67 and the known limit in `fichas/nph-button.md` |
| D5 | `layout/max-reading` and the line length | `design.md` (720 delivers 60–80 characters) × the measured line length |
| D6 | `body-md` or `body-lg` in Docs prose | `docs/stories.md` §4.10 × `design.md` §2b |
| D7 | Anatomy and Examples in button and icon | `docs/stories.md` §4.10 (they follow the model) × the two Docs pages |
| D8 | British or American English | `.storybook/i18n/en.json` and `README.md` × `design.md`, the sheets and the decisions |

### D1 — Docs page lists: the sheet or the Figma transcription

**Evidence.**
- `fichas/nph-badge.md:8-16`: `use_when` has 3 items and `do_not_use_when` has
  4. `src/shared/metadata/nph-badge.json` is the same, as P63 requires.
- `.storybook/i18n/en.json:293-308`: the badge Docs page shows 5 and 6.
- The other pages differ too. Sheet compared with page, in "use" / "do not use"
  counts: `nph-button` 3/4 against 6/7 (`en.json:463`, `:472`); `nph-label` 1/3
  against 5/6 (`en.json:839`, `dont`); `nph-icon` 2/2 against 2/6
  (`en.json:153`, `:158`).
- The page text was transcribed from the accepted Figma frames (commit
  `2a8373f`). The page's own note says that the sheet prevails when they
  disagree (`en.json:290`).
- P63 leaves out "the Metadata tab in Storybook"
  (`docs/decisoes-tecnicas.md:678`). The Metadata is in English only (DSA-14),
  while `docs/stories.md:331-336` (§4.8) requires all visible text to come from
  the dictionary, in three languages.

**Sources that disagree.** The canonical sheet (P63) and the accepted Figma
documentation frame, as transcribed into `.storybook/i18n/*.json`.

**Options.**
- **A.** The page reads `use_when` and `do_not_use_when` from
  `src/shared/metadata/<piece>.json`. It widens P63 and needs a new technical
  decision. It also needs an answer for `pt-BR` and `es`, because the Metadata
  is in English only.
- **B.** The dictionary stays. The sheet takes the lists of the accepted frame,
  through a sheet PR with the Metadata generated again.
- **C.** The dictionary stays and is cut down to the sheet's lists.
- **D.** Both stay, and a test checks that the English dictionary list and the
  Metadata list are the same.

**Answer (Indiane, 2026-10-15): A + D.** The Docs page reads `use_when` and
`do_not_use_when` from the Metadata of the sheet, and a test checks that the
page and the sheet are the same. Figma is the source only at the start: once
the tests pass and the sheet exists, the repository sheet is the source,
because the source of an agentic design system cannot depend on a tool. Before
that, the sheet is brought level with the accepted Figma frame, without
removing any item she accepted. Rejected: B (Figma as the permanent source)
and C (cutting the page down). Not covered by the answer: how `pt-BR` and `es`
read lists while the Metadata is English only; raise it as a new question if
the implementation needs it.

### D2 — Usage section with markup and an import line

**Evidence.**
- The model order in `docs/stories.md:385-411` has no Usage section, and "the
  page does not repeat a block that the model does not have" (`:409-411`).
  The page "follows the order and the sections of the Figma documentation
  frame" (`:367-369`), model `1134:12862`.
- `package.json:2-4`: `"name": "nephos"`, `"private": true`, with no `exports`
  field. P19 leaves out public publishing (`docs/decisoes-tecnicas.md:228`).
  `README.md:66` documents only the import of the generated CSS.
- So an import line written today would name a path that a consumer cannot
  install.

**Sources that disagree.** The fixed model in §4.10 and its Figma model frame
against the audit's request. P19 also leaves the import path undefined.

**Options.**
- **A.** No Usage section. The model stays as it is.
- **B.** A Usage section with markup only (for example a
  `<nph-badge severity="success">` element). The import line waits for
  publishing.
- **C.** Markup and import line, with the package name and `exports` decided
  now. That goes beyond P19.
- With B or C: the Figma documentation model gets the section first, and its
  position in the order has to be chosen (after the matrix, after API or before
  Examples).

**Answer (Indiane, 2026-10-15): C.** A Usage section with markup and an import
line, the import line read from `package.json`. The section enters the Figma
documentation model first, after API. Reviewed against research on agentic
design systems. The package is `nephos` (the name `package.json` already has),
and each component is imported with `import 'nephos/nph-<name>';`.

Code work that follows (Elvys):
- `package.json` gets `exports` with `./nph-*` pointing to a JavaScript build,
  without `?inline`, so that the import line above resolves.
- Option C goes beyond P19: the package is `private` and P19 leaves publishing
  out of scope. Record it in `docs/decisoes-tecnicas.md`, as "How it is proved"
  already asks.

Already done in Figma (2026-10-15): the model `1134:12862` and the 22 component
frames have the section "6. Usage" right after "5. Properties" (the API
section), and the following sections are renumbered up to 11. The visible text
is an attribute (`text`), because the components have no slot (P62.3, P65,
P66, P68). There is no need to open Figma; the markup in the frames is:
- `nph-badge`: `<nph-badge severity="secondary" text="Selo"></nph-badge>`
- `nph-button`: `<nph-button severity="primary" text="Salvar"></nph-button>`
- `nph-icon`: `<nph-icon name="magnifying-glass" size="sm"></nph-icon>`
- `nph-kbd`: `<nph-kbd text="Ctrl"></nph-kbd>`
- `nph-label`: `<nph-label for="email" text="E-mail"></nph-label>`
- `nph-separator`: `<nph-separator></nph-separator>`
- `nph-spinner`: `<nph-spinner size="md" label="Carregando"></nph-spinner>`
- `nph-tooltip`: opened by `nph-label`, so the frame shows
  `<nph-label for="cpf" text="CPF" info="Só os números." info-label="Sobre o CPF"></nph-label>`
  and imports only `nephos/nph-label`.
- The 14 components without code show the bare tag from the `piece` of their
  task (for example `<nph-switch></nph-switch>`); their attributes come with
  the sheet. The `nph-combobox` and `nph-multi-combobox` tag names are
  provisional. `nph-rich-option` waits for its sheet.

### D3 — An axe accessibility gate

**Evidence.**
- `docs/decisoes-tecnicas.md:229-230` (P19, out of scope): "Interaction and
  accessibility tests will be defined with the first real component." The
  first was `nph-icon` (PR #6). `src/components/` now has 8: `nph-badge`,
  `nph-button`, `nph-icon`, `nph-kbd`, `nph-label`, `nph-separator`,
  `nph-spinner` and `nph-tooltip`.
- `vitest.config.ts:12-20`: Vitest in browser mode with Chromium, over
  `src/**/*.test.ts`. `package.json:21-32` has neither `axe-core` nor the
  Storybook accessibility addon. Accessibility is proved only by assertions
  written per component.
- P19 is a current decision: changing it needs the technical conflict, a
  recorded proposal and a human review (`AGENTS.md:216-219`). A new dependency
  goes through a PR.

**Sources that disagree.** P19's condition ("the first real component") has
passed, and the repository has no definition. It is an expired deferral rather
than two texts in conflict.

**Options.**
- **A.** `axe-core` in the Vitest browser tests: each component test fails on a
  violation. This is a gate.
- **B.** The Storybook accessibility addon, as a panel only. Not a gate.
- **C.** Both: the panel while writing, the Vitest check as the gate.
- **D.** Keep it deferred, with a new trigger recorded in P19.
- With A or C: the rule set (WCAG 2.1 AA or 2.2 AA), the scope (component
  tests, Validation stories, Docs pages) and how a known exception is recorded.

**Answer (Indiane, 2026-10-15): C.** The Storybook accessibility addon is tied
to the tests and set to fail the build, with the WCAG 2.2 AA rules.

### D4 — A brand global in Storybook

**Evidence.**
- `.storybook/preview.js:35`, `:72-89`: the only globals are `locale` and
  `colorScheme`. Nothing sets `data-nph-brand`, so every page resolves `:root`,
  which is the `sistemas` brand (`src/tokens/generated/tokens.css:239-241`).
- P20 lists seven brand values (`docs/decisoes-tecnicas.md:248`). P67 requires
  `data-nph-brand` and `data-nph-color-scheme` on the same element
  (`docs/decisoes-tecnicas.md:922`).
- `docs/stories.md:526-532` (§6.4): "a single mode selector", "one mode at a
  time". `docs/stories.md:305-309` (§4.6): a frame with another brand carries
  both attributes.
- `fichas/nph-button.md:177`, `:279-281`, `:295`: in dark mode, `color/primary`
  falls below 3:1 against the background in `Gerencial`, `Recursos Humanos` and
  `Igrejas` (open item of 02-10-2026). None of those brands is rendered anywhere
  in Storybook today.

**Sources that disagree.** §6.4 (one selector) against a second selector, and
the sheet's known limit, which cannot be seen in the only brand Storybook
shows.

**Options.**
- **A.** A brand global in the toolbar, with the seven values. The decorator
  sets `data-nph-brand` beside `data-nph-color-scheme` on the root (P67), and
  §6.4 changes.
- **B.** No global. A Validation story per component where the brand matters,
  with the seven brands in both schemes, each frame carrying both attributes.
- **C.** Both.
- **D.** Neither: `sistemas` only, with the limit written on the page.
- With A or C: whether the Storybook frame (the `manager.js` theme, `#1FBFFF`)
  follows the brand or stays Solutions.

**Answer (Indiane, 2026-10-15): B.** No brand global. A Validation story per
component where the brand matters, with the seven brands in light and dark.

### D5 — `layout/max-reading` and the line length

**Evidence.**
- `design.md:1549-1553`: `layout/max-reading` is 720 and "delivers the 60 to
  80 character measure required by typography". `design.md:922-925`:
  `text/body-lg` asks for a "line of 60 to 80 characters".
  `src/tokens/generated/tokens.css:122`: `45rem`.
- `src/shared/docs/page.ts:44-45` applies it to the summary (`:71`), `text`
  (`:212`) and `list` (`:217`). On `audit/storybook-impeccable` it also applies
  to table descriptions.
- **Measurement, 14-10-2026.** Chromium, Noto Sans 400 from `@fontsource`, a
  720px block, with the 32 strings of `.storybook/i18n/en.json` longer than
  140 characters (6,300 characters). Characters per rendered line:

  | Role | Size / line height | Lines | Mean | Median | Range |
  |---|---|---|---|---|---|
  | `body-md` | 14 / 20 | 57 | 108.8 | 109 | 97–119 |
  | `body-lg` | 16 / 24 | 66 | 95.0 | 96 | 80–103 |

  Scaled from the same measurement, 60 to 80 characters is about 397–529px in
  `body-md` and about 455–606px in `body-lg`.

**Sources that disagree.** `design.md` says 720 gives 60–80 characters. The
measurement gives 95–109 in either role.

**Options.**
- **A.** Keep 720, and correct the `use` text of `layout/max-reading` and
  `text/body-lg`.
- **B.** Change the value of `core/layout-width/reading` in Figma. It reaches
  every consumer of `layout/max-reading`.
- **C.** A new measure for documentation text, created in Figma.
- B and C are token changes: they go through Figma and Claude in Figma, never
  through an agent in the repository. The answer depends on D6.

**Answer (Indiane, 2026-10-15): B.** The value of `layout/max-reading` changes
from 720 to 560 px, about 74 characters per line in `body-lg`. The width comes
from option 5 of the Figma comparison frame `1838:7473`. No new measure.
Already done: `core/layout-width/reading` is 560 in Figma, and commit
`c4605e8` on `v/5.0.0` carries it to `src/tokens/source/core.tokens.json`,
`src/tokens/generated/tokens.css` and `design.md` (value and `use` text).
Indiane accepted the preview `1843:2976`, including the nine components not
built yet that now take 560 (Dialog, Alert Dialog, Drawer, Alert, Accordion,
Table, Data Table, Chart and File Upload).

### D6 — `body-md` or `body-lg` in Docs prose

**Evidence.**
- `docs/stories.md:374`: the `header` summary is `text/body-md`.
  `docs/stories.md:378`: `text` and `list` are `text/body-md`.
  `src/shared/docs/page.ts:71`, `:212`, `:217` follow it.
- `design.md:2070` (§2b): "`body-lg` is for reading; `body-md` is for
  operating. A documentation paragraph is `lg`." `design.md:922-929`:
  `body-lg` is "Long reading: documentation and portal"; `body-md` is the
  "default body of the interface".
- §4.10 says the page follows the Figma documentation frame
  (`docs/stories.md:367-369`). The repository does not record which role that
  frame uses.

**Sources that disagree.** `docs/stories.md` §4.10 and `design.md` §2b. P17
makes `design.md` the human and agentic contract (`AGENTS.md:251-253`), and
§4.10 cites the Figma model frame.

**Options.**
- **A.** `body-lg` for Docs paragraphs and lists. §4.10 and `page.ts` follow
  `design.md`.
- **B.** `body-md` stays, and `design.md` §2b names the component Docs page as
  an exception, or narrows "documentation paragraph" to the portal.
- **C.** `body-lg` for the summary only, and `body-md` for the rest.

**Answer (Indiane, 2026-10-15): A.** Docs page paragraphs and lists use
`body-lg`, from option 5 of the Figma comparison frame `1838:7473`. In Figma,
the paragraph and list texts of the model `1134:12862` and of the 22 component
documentation frames are already `body-lg`; tables, captions and demos did not
change.

### D7 — Anatomy and Examples in `nph-button` and `nph-icon`

**Evidence.**
- `docs/stories.md:404-406` puts Anatomy and Examples in the model, and
  `:413-415` says they "stay in the same position on every page".
  `docs/stories.md:423-424`: "`nph-badge`, `nph-button`, `nph-icon` and
  `nph-label` follow the model".
- `src/components/nph-button/nph-button.docs.stories.ts:40-49`: sections
  `when-to-use`, `api`, `severity-and-emphasis`, `sizes`, `states`,
  `accessibility`, `examples`, `references`. No Anatomy.
- `src/components/nph-icon/nph-icon.docs.stories.ts:85-94`: `when-to-use`,
  `api`, `core`, `size`, `color`, `invalid-input`, `accessibility`,
  `references`. No Anatomy and no Examples.
- `nph-badge` (`:41-49`) and `nph-label` (`:48-57`) have both.
- The `figma-docs-accepted` evidence records the frame and the set, not their
  sections: `nph-button` frame `1197:5449`
  (`docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md:16`),
  `nph-icon` frame `346:4`
  (`docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md:16`).
  The sheets have an Examples section (`fichas/nph-button.md:344`,
  `fichas/nph-icon.md:254`). This agenda was prepared without access to Figma.

**Sources that disagree.** §4.10 and its Limit against the two pages. Only the
accepted frames can say which side is right.

**Options.**
- **A.** The frames have both sections: the pages are missing them, and a code
  PR adds them from the frames.
- **B.** The frames do not have them: the §4.10 Limit is corrected (a text fix),
  and the frames stay as accepted.
- **C.** The frames do not have them, but the model requires them: the frames
  get the sections in Figma, Indiane accepts them again, and the pages follow.

**Answer (from Figma, confirmed by Indiane on 2026-10-15): A.** Both accepted
frames have Anatomy and Examples: `nph-button` `1197:5449` and `nph-icon`
`1130:956`. The Docs pages are missing them, and a code change adds them from
the frames. Note: the `figma-docs-accepted` evidence of DSA-03 points to the
frame `346:4`, which no longer exists; the current `nph-icon` frame is
`1130:956`.

**The two sections, converted from the accepted frames (read on 2026-10-15).**
There is no need to open Figma. In both frames, Anatomy is section 3 and
Examples is section 9 ("Required examples"), after the Usage section, and
each example is shown in light and in dark mode. Visible text is translated from Portuguese.

`nph-button` (`1197:5449`), Anatomy. The demo is one button,
`tipo=primary`, `enfase=solid`, `size=compact`, labeled "Button".
1. Container: height `control/height-compact`, `-default` or `-large`; radius
   `radius/control`; inner space `space/control-padding`.
2. Text: `text/label-md`, the same in every size; it says what happens on
   click.
3. Start icon (optional): `icon/size-sm` when there is text; gap to the text
   `space/inline-tight`.
4. End icon (optional): the same rule as the start icon.
5. Focus ring: shown in the focus state, for keyboard users.

`nph-button` (`1197:5449`), Examples. All `size=default`, `state=default`,
without icons unless noted.
- "Save" (`primary`, `solid`) and "Cancel" (`secondary`, `outline`). Caption:
  "Form actions: primary and secondary."
- "Delete account" (`danger`, `solid`). Caption: "An action with a
  consequence, always with text."
- Icon-only button (`secondary`, `ghost`, icon `plus`). Caption: "A universal
  action without text, with an accessible name."

`nph-icon` (`1130:956`), Anatomy. The demo is `circle-info`, `light`,
`icon/size-lg`.
1. Name: `nome` selects an icon available in the set.
2. Style: `estilo` takes `light` or `solid`.
3. Size: the box is square; width and height are bound to the same size token.
4. Fill: inherits the semantic color of the context; it has no color of its
   own.
5. Composition: the parent control provides focus, state, touch target and the
   accessible name when the icon stands for an action.

`nph-icon` (`1130:956`), Examples.
- An `nph-input` (`size=default`) with the start icon `magnifying-glass` and
  the placeholder "Search". Caption: "magnifying-glass in a search field,
  inside the control, at `icon/size-sm`."
- `circle-info` (`light`) next to the text "Review the data before sending."
  Caption: "circle-info next to text: icon and label form one unit, with
  `space/inline-tight` between them."
- Icon-only button (`secondary`, `ghost`, icon `magnifying-glass`). Caption:
  "No visible text: a universal symbol inside a control; the accessible name
  belongs to the control."

### D8 — British or American English

**Evidence.**
- `.storybook/i18n/en.json` (925 lines) uses British spelling in prose:
  `colour` 28 times, `behaviour` 2, `centre`/`centred` 4, `normalises` 2,
  `customisation` 1, `full stop` 1. American `color` appears once in prose
  (`en.json:341`, "in the brand color."); every other `color` is an
  identifier (`color/foreground`, `currentColor`, `colorScheme`).
- The sidebar label `Colour inheritance` (`en.json:16`) sits on the story ID
  `color-inheritance`.
- `design.md`, `docs/stories.md`, `docs/decisoes-tecnicas.md` and every sheet
  have `colour` 0 times; `fichas/nph-badge.md:11` writes "recognize".
  `README.md:65` writes "colour scheme" and has `color` 3 times;
  `docs/tokens.md` has both (`colour` 8, `color` 21).
- The token API is American (`color/*`, P20, P64). No rule names a variant:
  P64, `docs/i18n.md` and `AGENTS.md` say "English" only.

**Sources that disagree.** `en.json` and parts of `README.md` and
`docs/tokens.md` (British) against `design.md`, the sheets, the decisions and
the token names (American).

**Options.**
- **A.** American in all prose, the same as the identifiers.
- **B.** British in prose, with identifiers staying American.
- **C.** No rule; leave it as it is.
- With A or B: whether `npm run test:naming` checks it. A change to `README.md`
  or `docs/tokens.md` brings the `pt-BR`/`es` pairs, `npm run i18n:update` and
  `npm run test:i18n` with it.

**Answer (Indiane, 2026-10-15): A.** American English in all prose, the same as
the identifiers, checked by the cspell spell checker set to American English.

## How it is proved
**`decisions-recorded`** passes when each of D1–D8 has an answer with a date,
Indiane as the owner and the place where it was recorded: `docs/stories.md`
(D1, D2, D4, D6, D7), `design.md` through Claude in Figma (D5, D6),
`docs/decisoes-tecnicas.md` (D1 option A, D2 option C, D3, D4) or the DSA-03 and
DSA-13 evidence (D7). The task closes with one evidence file per answer in
`docs/operacao/evidencias/DSA-30/`. The work that follows each answer is a task
of its own.

## Relations with other tasks
- DSA-03 and DSA-13 hold the accepted frames that D7 asks about.
- DSA-14 made the Metadata English-only, which affects D1 option A.
- The branch `audit/storybook-impeccable` changes `src/shared/docs/page.ts` and
  `.storybook/i18n/*.json`. Changes that come from D1, D5, D6 and D8 should
  start after that branch is merged, to avoid conflicts.

## What this task does not do
It does not change code, stories, tests, the dictionary or the sheets. It does
not create a token or change a token value. It does not reopen P19, P20, P63 or
P67. It only writes the questions that would reopen them. The `approved_order`
310 places it at the end of the queue and does not set a priority.

## Sources
- `docs/stories.md` §4.6, §4.8, §4.10, §6.4
- `design.md` §2b, `text/body-*`, `layout/max-reading`
- `docs/decisoes-tecnicas.md` P19, P20, P63, P64, P67
- `fichas/nph-badge.md`, `fichas/nph-button.md`, `fichas/nph-icon.md`
- `.storybook/i18n/en.json`, `.storybook/preview.js`, `src/shared/docs/page.ts`
- `src/components/nph-{badge,button,icon,label}/*.docs.stories.ts`
- `docs/operacao/evidencias/DSA-03/`, `docs/operacao/evidencias/DSA-13/`
