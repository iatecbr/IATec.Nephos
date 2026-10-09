# Component development guide

This note has no translations: it is an internal instruction for those who
maintain the repository, not usage documentation. See [`i18n.md`](i18n.md).

## What it is for

This guide says **how a Nephos component is built in this repository** — what
the code must declare, how the stories prove the contract and what the tests
must cover.

It decides nothing. Every rule below was **extracted from practice that already
exists in the repository**, and each one declares where it came from and how
far it holds.

## What this guide is not

- **It is not the sheet.** The sheet of the piece is canonical at
  `fichas/<name>.md`, with the template at
  [`../fichas/_modelo.md`](../fichas/_modelo.md). This guide does not repeat a
  component's contract: it says how code, stories and tests behave in front of
  it.
- **It is not the token contract.** That is [`../design.md`](../design.md).
- **It is not the technical decision.** The numbered decisions live in
  [`decisoes-tecnicas.md`](decisoes-tecnicas.md). Here they are cited, never
  rewritten.
- **It is not a second contract.** Storybook is a surface derived from the
  sheet — see [`operacao/README.md`](operacao/README.md), §7.

## How to read

Each rule closes with two lines:

- **Source** — where the practice exists in the repository, with file and
  passage.
- **Limit** — how far it holds, and how many components support it.

**A rule without verifiable practice in this repository is not here.** What is
missing is in §7, by name.

When a rule is supported by a single component, that is written in the Limit.
A single case does not become a general norm for convenience.

---

## 1. The order

No component enters the repository before visual approval in Figma. The
sequence that the sources **of this repository** support is:

**Approved Figma → complete sheet, with no pending item → code, stories and
tests.**

**Source:** [`../README.md`](../README.md), "Component flow", steps 2 to 5, and
the sentence *"No component may be implemented in the repository before its
approval in Figma"*; [`../AGENTS.md`](../AGENTS.md), "Mandatory rules":
*"first derive the structural reference from Obra in Figma, configure it with
Nephos tokens and obtain visual approval. Only then implement in the
repository"*. What counts as a complete sheet is in
[`../fichas/_modelo.md`](../fichas/_modelo.md), §7, criterion 1: *"the sheet
answers every item, with no blank field"*.

**Limit:** this guide covers the third step — code, stories and tests.

**Figma × Storybook comparison, evidence and acceptance are not prescribed by
this guide.** They depend on the planning record and on the applicable external
gates: [`../GOVERNANCA.md`](../GOVERNANCA.md), §1, declares that *"order and
evidence of the phases"* live in a *"planning record kept by Indiane, outside
this repository"*, and that whoever depends on that order must stop and ask.
This guide does not reproduce it.

**A technical plan is also not a general step of this flow:** the repository
has a single case, **P21**, for `nph-icon`, and one case is not a template —
see §7.

---

## 2. The component

### 2.1 A Web Component in Lit, registered under a guard

Every component is a Web Component written with Lit, with the strict `nph-`
prefix. The file ends by registering the tag **only once** and declaring the
type:

```ts
const TAG = 'nph-icon';

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-icon': NphIcon;
  }
}
```

The guard exists because the story, the test and the consumer may import the
module more than once on the same page.

**Source:** `src/components/nph-icon/nph-icon.ts` and
`src/components/nph-label/nph-label.ts`, final blocks;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P03**;
[`../AGENTS.md`](../AGENTS.md), "Mandatory rules".
**Limit:** two components. It holds for a public `nph-*` component.

### 2.2 The file opens by declaring the contract and where it comes from

The opening block does not describe what the code does — the code already says
that. It declares **the approved contract and its source**: the sheet,
`design.md` and the numbered or dated decision.

```ts
/**
 * `nph-icon` — the first Nephos component.
 *
 * Approved contract (sheet `nph-icon`, `design.md` `contrato_nph_icon`, P21):
 * - `name` required, kebab-case, restricted to the core icons;
 * ...
 */
```

Whoever opens the file six months later needs to know **who decided that**,
without leaving it.

**Source:** `nph-icon.ts`, lines 1-17; `nph-label.ts`, lines 1-56;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**.
**Limit:** two components.

### 2.3 An exception to a technical decision is written in the file itself

When a piece needs to depart from a current decision, the reason, the
discarded alternative and the date stay in the file — in the component and in
its CSS.

`nph-label` is the only component without Shadow DOM, a declared exception to
**P01** and recorded as **P62.1**. The reason is written in both files: the
native association between label and control does not cross the Shadow DOM
boundary, and without it the label loses its function.

**Source:** `nph-label.ts`, lines 17-23; `nph-label.css`, lines 3-10;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P01** and **P62.1**.
**Limit:** one component. This rule describes **how to record** an exception —
it does **not authorize opening** any. Opening an exception is a human
decision, with technical review.

### 2.4 A property that reflects says why

`reflect: true` puts the property in the DOM and makes it reachable by a
selector. That is a consequence of the contract, not a detail: write the
reason next to it.

```ts
/* `size` reflects because the internal CSS selects the box by it. */
size: { type: String, reflect: true },
```

**Source:** `nph-icon.ts`, declaration of `size`; `nph-label.test.ts`, case
*"required reflects to an attribute, so the consumer's CSS can target it"*.
**Limit:** one component documents it in the code, the other in the test. The
practice is to record the reason somewhere verifiable — there is no single
form.

### 2.5 Invalid input does not render, and complains once per cause

When the contract is violated, the component **draws nothing** — no visual
fallback — and emits one error per cause, **only in development**. Validation
accumulates: each rejected property emits its own error, not just the first.
Whoever develops needs to see every cause at once.

**Source:** `nph-icon.ts`, `devError` and `resolveDrawing`;
`nph-icon.css`, the `:host` rule that hides the element without artwork;
`nph-icon.test.ts`, cases *"accumulates one error per invalid property"* and
*"leaves no visual fallback: nothing inside the shadow root"*;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**, item 4.
**Limit:** one component. **P21** fixed this behavior **for `nph-icon`**.
Another piece that needs it decides on its own, and records it.

---

## 3. The CSS

### 3.1 The CSS opens by saying what is not contract

An internal class and selector **are not public API** — **P02** defines that
the contract is the custom property and the `::part`. The file declares this at
the opening, together with the rule that no literal design value enters.

**Source:** `nph-icon.css`, lines 1-9; `nph-label.css`, lines 1-19;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P02**.
**Limit:** two components.

### 3.2 Only semantic tokens

No hexadecimal, measure, radius, shadow, duration or text role written by
hand. Everything comes from `var(--nph-*)`, in the semantic layer.

The only quantity that appears literal is a **box relation** — `100%`, `auto`,
the thickness of a frame border —, which is not a visual decision.

**Source:** `nph-icon.css` and `nph-label.css`, in full;
[`../design.md`](../design.md), rules 3 and 4 and anti-patterns **A2** and
**A25**.
**Limit:** two components.

---

## 4. The stories

### 4.1 Two roles: `Validation` proves, `Docs` explains

`Components/<piece>/Validation` proves the contract with the real component
rendered. `Components/<piece>/Docs` is reading and catalog — and proves
nothing. In the Portuguese sidebar, the two appear as
`Componentes › <piece> › Validação` and `Docs` (§4.2).

**`Validation` is mandatory. `Docs` is not.**

**Source:** [`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**, item 8,
approved on 28/08/2026; `nph-icon.stories.ts` and `nph-icon.docs.stories.ts`.
**Limit:** two components have both roles: `nph-icon` and `nph-label`.
`Docs` enters when there is something to offer — in `nph-icon`, the catalog of
the core; in `nph-label`, the page of the frame accepted in Figma, by Indiane's
decision of 05/10/2026 (Claude writes the Storybook documentation of the
components of the batch). Do not invent a reading page for a piece that has
nothing to offer.

### 4.2 The title and the name state the claim

Title in `Components/<piece>/Validation` or `Components/<piece>/Docs`. The story
name describes **what the page claims**, not the appearance: `Color
inheritance`, `Invalid input`, `Association with the control`, `What the label
does not do`.

Title, story name, story export and page anchor are **identifiers in English**
(P64, amendment of 06/10/2026): the Storybook ID and permalink come from them,
the same in any language. The label the person reads in the sidebar comes from
the dictionary, in the `sidebar` subtree of `.storybook/i18n/`, with the story
or group ID as the key: `en.json` carries the English labels; `pt-BR.json` and
`es.json` carry the translation — `pt-BR.json` carries `Componentes`,
`Validação`, `Herança de cor`. A new story goes in
with the `sidebar` key in the three languages.

**Source:** [`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P64**, amendment of
06/10/2026; `nph-icon.stories.ts`, `nph-icon.docs.stories.ts` and
`nph-label.stories.ts`, fields `title` and `name`; `.storybook/i18n/*.json`,
`sidebar` key.
**Limit:** the rule applies to every story in the repository.

### 4.3 The file opens by saying what the pages prove

The top block declares what that file proves and **which decision it
verifies**, with a date when there is one:

```ts
/**
 * VALIDATION stories for `nph-label`.
 *
 * Each page proves a part of the approved contract (27-08-2026, 08-09-2026 and
 * 01-10-2026): the `required` x `info` matrix of component set `374:6`, the
 * parity with Figma in both color schemes, the focus and the open balloon of
 * the information trigger (frame `1194:1482`), the association with the
 * control and the absence of its own state for the text.
 */
```

**Source:** `nph-icon.stories.ts` 1-14; `nph-icon.docs.stories.ts` 1-13;
`nph-label.stories.ts` 1-16.
**Limit:** two components, three files.

### 4.4 Each story says, in one line, what it proves

```ts
/** Color is not a property: it comes from `currentColor`. */
export const ColorInheritance: Story = { /* ... */ };
```

**Source:** the stories of the three files.
**Limit:** two components.

### 4.5 Coverage, not quantity

**Each variant and each state appears in some verifiable story.** One story may
cover more than one combination, and no combination is left out. The criterion
is **traceable coverage**, not the quantity of files, pages or stories.

In practice: `nph-label` covers `required` × `info` in one `Matrix` page;
`nph-icon` covers variant, size, color inheritance, accessibility and invalid
input in five pages, one per claim.

**Source:** [`../fichas/_modelo.md`](../fichas/_modelo.md), §7, criterion 5,
decision of 09-09-2026; `nph-label.stories.ts`, `Matrix` story;
`nph-icon.stories.ts`, the five pages.
**Limit:** two components. The rule does not impose a file structure.

### 4.6 Light and dark without duplicating a story

The color scheme switches by `data-nph-color-scheme`, the public theme contract
of **P20**. The same piece appears in both contexts, in the same story — a
component is not duplicated per mode.

**Source:** `nph-label.stories.ts`, `frame()` function and header;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P20**.
**Limit:** one component. Only `nph-label` has a mode story. The frame beats
Storybook's global mode (§6.4) for every semantic token: the invariants that
depend on brand or scheme are also redeclared at each scheme root (**P67**). A
frame with another brand carries `data-nph-brand` and `data-nph-color-scheme`
on the same element.

### 4.7 The frame is not a precedent

The scenery that wraps the demonstration — breathing room, grid, caption —
**does not hold as a precedent for component CSS**, and that is written where
the frame is defined.

When the frame is shared between pages, it lives in a file that does **not**
end in `.stories.ts`, so that Storybook's glob does not index it.

**Source:** `nph-label.stories.ts`, `page()` function; `nph-icon.stories.ts`,
header; `nph-icon.demo.ts`, lines 1-12.
**Limit:** two components declare the non-precedent; one uses a separate file.

### 4.8 The explanatory text comes from the dictionary

A story is **never** duplicated per language: it reads the chosen language and
fetches the text from `.storybook/i18n/`. Technical identifiers — `nph-*` tags,
token names, attributes, commands — appear literal and identical in any
language.

**No visible text is hand-written in a story.** All visible text — explanation,
caption, section title and the example content passed to the piece — is born in
`en.json`, the source, and has a translation in `pt-BR.json` and `es.json`; the
story reads it with `translations(locale)`, through the `t(context)` shortcut.
This also holds for the example content of the `Validation` stories: the text
of a demonstration label, button or badge comes from the dictionary.

**Source:** [`i18n.md`](i18n.md), "Storybook" section;
`.storybook/i18n/index.js`, lines 1-12;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P64**, amendment of
06/10/2026; `nph-spinner.stories.ts` and `nph-badge.stories.ts`, `t()`
function; `nph-label.stories.ts`, `labelValidation` key, and
`nph-tooltip.stories.ts`, `tooltipValidation` key; review by `maurocsjr` in
PR #54, which asked for a translation key for the example text.
**Proof:** `npm run test:naming` fails a story title and name in Portuguese and
Portuguese text written in the story — between tags, in text attributes and in
a literal with a space —, and says where to move the text.
**Limit:** the rule applies to every story in the repository.

### 4.9 On a reading page, every rule points to where it came from

Each block of the `Docs` page closes with the origin footer. Nothing is decided
on a Storybook page.

```ts
/** Origin footer. Every rule shown points to where it came from. */
export function source(label, origin) { /* ... */ }
```

**Source:** `src/shared/docs/page.ts`, `source()` function;
`nph-icon.docs.stories.ts`, where each section closes with `source(...)`.
**Limit:** one component.

### 4.10 Content page: the same blocks on every `Docs` page

A component's reading page is assembled from the blocks of
`src/shared/docs/page.ts`, so that all of them read the same way. The page
follows the order and the sections of the Figma documentation frame: the
component with its labelled matrix first, no anti-patterns section, and "use"
and "do not use" once, in a single `useDontUse` block, side by side.

| Block | Rule |
|---|---|
| `header` | the h1 is `text/heading-lg`, one per page; the summary is `text/body-md` |
| `matrix` | right after `header`: real instances with columns and rows named by property and value, as in the Figma frame; border without background; the area scrolls by keyboard when it does not fit |
| `index` | one `#id` link per section, in a named `nav`; no anchor without a section |
| `section` | `<section id>` with an h2 in `text/heading-md` and a line below; more breathing room before the title than after |
| `text` and `list` | `text/body-md`, with a limited reading width |
| `demo` | real instances in an area **without background**, with border only, and a caption below |
| `table` | with a header; the term in `text/code`, the description in `text/body-sm` |
| `note` | the exception to the rule becomes a note (`role="note"`), in the `status/*` colors, never a plain paragraph |
| `useDontUse` | when to use and when not to use side by side, in one block, in the `status/success-*` and `status/error-*` colors |
| `source` | the origin footer, in `text/caption`, with a thin line above |

#### Reference model: the `nph-badge` page

The `Docs` page of `nph-badge` is the **model** for every component `Docs`
page. A new page copies its order; a page that already exists is aligned to it.
The order is fixed:

1. `header`: the h1 with the component name and its summary.
2. `matrix`: the labelled matrix of real instances.
3. `note` of the page's origin (`info`): the page is derived from the Figma
   frame and the sheet, and which one prevails in case of divergence.
4. `index`: "On this page", one link per section below.
5. Sections, in this order, each ending with its `source`:
   1. **When to use**: a single `useDontUse` block.
   2. **API**: `table` of properties, with the term in `text/code`.
   3. **Sections of the component itself**, in this order: **Variants**
      (`demo` of the real instances, with a caption), **Sizes** and **States**
      (each only if the component has them, `demo` with a caption), then any
      other section that is only the component's own, such as core, color,
      relations and context, or invalid input.
   4. **Anatomy**: `table` of the parts.
   5. **Accessibility**: `table` of criteria.
   6. **Examples**: one `demo` per example, each with its caption.
   7. **References**: `list`, with no `source`.

Each section has a stable English `id`, the same in any language. The page does
not repeat a block that the model does not have (no anti-patterns section, no
second "use / do not use").

**Sections of the component itself** come after API and before Anatomy
(decided by Indiane on 08-10-2026). Anatomy, Accessibility, Examples and
References stay in the same position on every page.

The blocks use only `--nph-*`. The page carries no process text: review state,
names of approvers and pending items stay in the operational record.

**Source:** `src/shared/docs/page.ts` and `page.test.ts`; the Figma
documentation model (`1134:12862`, DS-IA-NEPHOS 5.0); the `Documentation`
story of `nph-badge` (the model) and its `nph-badge.docs.test.ts`. Chosen as the
model by Indiane on 08-10-2026.
**Limit:** the Docs pages of the components with code. `nph-badge`, `nph-button`,
`nph-icon` and `nph-label` follow the model.

---

## 5. The tests

### 5.1 The test proves the contract, in a real browser

The test does not check appearance: it checks **what the sheet promises**. It
runs in Chromium, with Vitest in browser mode.

**Source:** `nph-icon.test.ts` and `nph-label.test.ts`, headers;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**, item 5.
**Limit:** two components.

### 5.2 The test confronts the code with `design.md`

This is the strongest practice in the repository. The test **imports the
contract as text** and compares:

```ts
import designMd from '../../../design.md?raw';
```

In `nph-icon`, the list of names is extracted from `icones_nucleo:` in
`design.md` and compared with the component's closed map — if the source
changes there, the test fails here. In `nph-label`, the test verifies that the
`use` of `status/error` authorizes the asterisk and that anti-pattern **A5**
remains in force.

**Source:** `nph-icon.test.ts`, `namesFromDesignMd` function and the group that
checks the closed core; `nph-label.test.ts`, *"token contract"* group.
**Limit:** two components.

### 5.3 The test pins the reactive API

The list of properties is checked against the approved one, through
`elementProperties`:

```ts
expect(propriedades).toEqual(['label', 'name', 'size', 'variant']);
```

That way, a new property does not enter without someone failing a test.

**Source:** `nph-icon.test.ts`, *"the reactive API is exactly name, variant,
size and label"*; `nph-label.test.ts`, *"the public API is exactly text,
required, for, info and infoLabel"*.
**Limit:** two components.

### 5.4 The test confirms that the token exists in the generated CSS

Consuming a token that the generator does not emit leaves the piece without
value, silently. The test opens the generated CSS and checks.

**Source:** `nph-label.test.ts`, *"the text/label-md role exists in the
generated CSS"*.
**Limit:** one component.

### 5.5 The test covers the absence

What the piece does **not** have and does **not** do is tested with the same
weight as what it does: absence of focus, of a slot, of an invented event, of a
refused property.

**Source:** `nph-icon.test.ts`, *"absence of interaction"* group;
`nph-label.test.ts`, *"what the label does NOT have"* group.
**Limit:** two components.

---

## 6. Storybook and repository

### 6.1 The story lives next to the component

`src/components/<name>/<name>.stories.ts`. Storybook's glob points there.

**Source:** `.storybook/main.js`; [`decisoes-tecnicas.md`](decisoes-tecnicas.md),
**P03** and **P19**.
**Limit:** two components.

### 6.2 The preview loads the generated CSS, which nobody edits

Without it, a token custom property would resolve empty and no box would have a
size. The file is **generated** from the JSON: never edit
`src/tokens/generated/tokens.css` by hand.

The preview also loads the Nephos fonts — Noto Sans and IBM Plex Mono — through
`@fontsource`, with no external call, and applies the page font, background and
color through `--nph-*`. The tokens only declare the family: without this
loading, the page falls back to the browser's default font.

**Source:** `.storybook/preview.js`;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P17** and **P20**.
**Limit:** a rule written and applied; it does not depend on a component.

### 6.3 Branch, commit and PR follow `contributing.md`

**Source:** [`../contributing.md`](../contributing.md).
**Limit:** a convention recorded in the repository; no component supports it
yet.

### 6.4 Mode selector: one mode at a time

The toolbar has a single mode selector, next to the language. It changes the
`colorScheme` global (`light` or `dark`), and both sides switch together: the
frame, through the `manager.js` theme, and the page, through the
`data-nph-color-scheme` that the `preview.js` decorator applies at the root.
There is no light frame with a dark page, nor the reverse.

The frame follows the Solutions identity, with the `#1FBFFF` highlight and the
`#031A24` ink on top of it. Those hex values live only in `.storybook/manager.js`
and `.storybook/manager-head.html`. In light mode, the blue appears only as a
background: text and icon stay neutral, because `#1FBFFF` on white does not
pass the contrast check. The page continues with only `--nph-*`.

`manager-head.html` depends on internal Storybook attributes (`data-nodetype`,
`data-selected`). When updating Storybook, check the selected sidebar item in
both modes.

**Source:** `.storybook/manager.js`, `.storybook/manager-head.html`,
`.storybook/preview.js`; [`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P20**.
**Limit:** a Storybook rule; it does not change a component API.

---

## 7. What this guide does not cover

**Components without verifiable code in `src/components/` do not support
implementation rules in this guide.** Today that holds for `nph-spinner`,
`nph-button` and `nph-field`: none of the three has code in
`src/components/`, and therefore no rule in this guide rests on them.

**Source:** `git ls-tree --name-only origin/v/3.0.0 src/components/` returns
`src/components/nph-icon` and `src/components/nph-label`, and nothing else.
**Limit:** the statement is about the absence of code in the repository, and
nothing beyond that.

The other gaps, named so they do not look like rules:

| What is missing | Why it is not here |
|---|---|
| How the Figma × Storybook comparison is measured | The step exists in the gate, but **no artifact in this repository** records a measurement. Without verifiable practice, it does not become a rule |
| Template for a technical plan | There is only one, **P21**, for `nph-icon`. One case is not a template |
| PR size, screenshot, preview link | `contributing.md` asks for a small PR **with no number**, and does not address screenshots or previews. **P19** foresees Storybook as a private CI artifact, and **CI does not exist** |
| The complete battery of validations | The commands are in `package.json` — `build:tokens`, `test:tokens`, `typecheck`, `test`, `test:i18n`, `build-storybook` and `test:operacao`. The obligation to run all of them, and in what order, **has no source in this repository** |
| `meta.ts` and `metadata.ts` | **Forbidden.** Verifier rule `V27` rejects both names inside `src/components/`. The sheet is the source; the Metadata derives from it, generated in `src/shared/metadata/` by `node scripts/verificar-operacao.mjs --gerar-metadata` (P63) |

---

## 8. Open divergences

Recorded here because whoever builds a component will run into them. **This
guide does not pick a side.**

| Subject | The sources, and what each one says |
|---|---|
| `variant="solid"` in `nph-icon` | [`../design.md`](../design.md), **P21** and the sheet define `regular` as the default and `solid` as available for each core name. Decision **I7** originated the expansion and `DSA-03` was completed |

---

*Provenance: all the rules in this guide are **verifiable practice** of this
repository, read at baseline `20882bf` on 09-09-2026, file by file. The cited
numbered decisions — P01, P02, P03, P17, P19, P20, P21 and P62.1 — are not
rewritten here: the source is [`decisoes-tecnicas.md`](decisoes-tecnicas.md).
Where a rule is supported by a single component, the Limit says so. What has no
verifiable practice is in §7 as a gap, and not as a rule.*
