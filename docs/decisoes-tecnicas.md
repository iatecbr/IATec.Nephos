# Technical decisions — Nephos

This is the **single source** of the technical decisions P01, P02, P03, P17, P19, P20,
P21, P62, P63, P64, P65 and P67. If this file and any other document in the
repository disagree, this one prevails.

## Technical review queue — Elvys

Record of everything that was waiting for his review, in a single place. The **If he
disagrees** column stated the cost of changing course, to prioritize the reading; the
**Elvys's review** column records the outcome.

**Review completed on 28/08/2026**, item by item, in a working session with
Claude Code. Elvys approved all the decisions below as they were recorded,
except P62.4, which he resolved differently from what was recorded (see the
P62.4 subsection for the detail).

| # | Decision | Adopted on | If he disagrees | Elvys's review |
|---|---|---|---|---|
| **P62.3** | `for` and `text` as the API of `nph-label` | 27/08/2026 | **Cheap now, expensive later.** `nph-input` and `nph-field` will be built on top of them | Approved, 28/08/2026 |
| **P62.2** | Format of the typography tokens: five properties per role | 27/08/2026 | Medium. The values do not change, only the emission and the CSS that consumes them | Approved, 28/08/2026 |
| **P62.1** | `nph-label` without Shadow DOM — exception to P01 | 27/08/2026 | High. It is the only way the native association works; without it the label loses its function | Approved, 28/08/2026 |
| **P62.4** | Dimensions in `px`, not `rem` | 27/08/2026 | High and old. Applies to the whole system, not just typography | Resolved by his own decision: migrate the generator to `rem` — 28/08/2026. **Implemented on 28/08/2026** |
| **P62.5** | The radius stays in `px` | 28/08/2026 | Low. Converting later is one line in the generator, but requires changing `raio_regras` in `design.md` | Adopted by Indiane on 28/08/2026. **Reviewed and approved by Mauro on 09/09/2026, in PR #25, merged in `ed7c009`.** Resolves the scope contradiction of P62.4 |
| **P01** | Open Shadow DOM | 24/08/2026 | High. Every component depends on it | Approved, 28/08/2026 |
| **P02** | Custom properties as public API | 24/08/2026 | High | Approved, 28/08/2026 |
| **P03** | Directory pattern and TypeScript | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P17** | Role of each source of truth | 24/08/2026 | High | Approved, 28/08/2026 |
| **P19** | Storybook, tests and publishing | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P20** | Style Dictionary v5 and theme contract | 24/08/2026 | High | Approved, 28/08/2026 |
| **P21** | Technical plan of `nph-icon` | 26/08/2026 | Already implemented and merged under risk acceptance | Approved, 28/08/2026 |
| **P63** | Metadata generated from the spec | 28/09/2026 | Medium. Changing location or format later requires generating again and adjusting whoever reads it; the spec does not change | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** |
| **P64** | Code language | 28/09/2026 | Medium. Applies to all new code; migrating what exists only swaps names | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** Amendment of 02/10/2026 approved by Mauro in PR #49, merged on 05/10/2026. |
| **P65** | API and semantics of `nph-tooltip` | 05/10/2026 | Low now. `nph-label` is the first consumer; changing later requires redoing its trigger | Behavior and scope (L11.5) and anatomy (L11.6, L11.7 and the accepted frame) adopted by Indiane on 01/10/2026. API and semantics approved by `maurocsjr` in PR #51, merged on 05/10/2026 |
| **P67** | Dependent invariants redeclared in each scheme root | 05/10/2026 | Medium. Changes where the generator emits 14 tokens and fixes how a part of the screen switches brand | Consumption decided by Indiane on 05/10/2026. Technical proposal, review in the PR by `maurocsjr` |

**Outside this note, still awaiting his confirmation:** license, CI variable,
credential and platform of **Font Awesome Pro**. See `PO-001` in the vault.

> **Status of all decisions in this note:**
> *Decision adopted by Indiane on 24/08/2026 (P21 on 26/08/2026, P62 on
> 27/08/2026) — reviewed and approved by Elvys on 28/08/2026, item by item,
> except P62.4.*
>
> Elvys formally reviewed and approved P01, P02, P03, P17, P19, P20, P21, P62.1,
> P62.2 and P62.3 as they were recorded. For P62.4, he did not approve
> recording the divergence without a correction: he decided to migrate the generator to `rem`
> (see P62.4). These decisions apply to the current work and remain
> revisable: changing them now requires the same rite as always —
> technical conflict explained, proposal recorded, human review.

Before this note, the five were recorded as open pending items,
delegated to Elvys. They left that state on 24/08/2026, to unblock the
continuity of the work. The record that they were pending items is preserved on
purpose: they are **current and revisable** decisions, not closed decisions.

---

## P01 — Component encapsulation

**Decision.** Future components with the `nph-` prefix will use **open Shadow
DOM**.

**Reason.** It encapsulates the internal styles and protects the visual implementation,
while keeping inspection, debugging and testing feasible.

**Scope.** It only starts to apply when the first component is created.

**Impact.** Every `nph-*` component is born with Shadow DOM in open mode.
Outside styles do not leak into the component, and the internal CSS does not leak
into the page. This makes P02 mandatory: without a public customization
API, encapsulation would make the component impossible to theme.

**Out of scope.** Closed Shadow DOM, which must not be used. Creating any
component in this task.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P02 — Customization and CSS exposure

**Decision.** The public visual customization API will use **CSS custom
properties**, for tokens and for customization. Internal parts that
need to be styled from outside may be exposed with **`::part`**.
Internal CSS classes **are not public API**.

**Reason.** It allows theming and the planned adjustments without turning internal
classes into a contract with the consumer — which would freeze the implementation and
prevent refactoring.

**Scope.** It only starts to apply when the first component is created.

**Impact.** It defines the boundary between what is contract and what is internal:
custom properties and `::part` are stable and versioned; class names
inside the Shadow DOM may change at any time. A consumer that
depends on an internal class breaks without warning, and that does not count as a regression.

**Out of scope.** Creating styles, parts or components in this task. Defining
which specific parts each component will expose — that is decided in the spec of
each piece.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P03 — Project organization

**Decision.** The future directory pattern is this one, without creating unnecessary
empty directories:

```text
src/
  components/
    <nome-do-componente>/
      <nome-do-componente>.ts
      <nome-do-componente>.css
      <nome-do-componente>.stories.ts
      <nome-do-componente>.test.ts
  tokens/
    source/
    generated/
  styles/
  shared/
docs/
```

The structure Storybook already created is preserved. Stories and tests sit
next to the component they belong to.

**Reason.** Keep the implementation, style, story and test of a piece in the same
place, so that the component is readable and movable as a unit.

**Scope.** Future pattern. None of these directories is created now, except
`docs/`, which exists because this note lives in it.

**Impact.** `src/tokens/source/` and `src/tokens/generated/` materialize P17:
the versioned JSON goes in `source/`, the generated CSS goes in `generated/`.

**Out of scope.** Creating `src/`, `src/components/`, `src/tokens/`,
`src/styles/` or `src/shared/` in this task. Creating components.

**Divergence resolved in the first component.** The Storybook configuration
includes the stories in `src/components/**/*.stories.ts`, and the structure started
using TypeScript according to this pattern. The history of this divergence explains the
scope of P03; it does not authorize future changes.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P17 — Token format and consumption

**Decision.** Tokens versioned in the repository will use **JSON** as the
source format. **CSS custom properties** will be the **generated** format for
consumption in the browser.

**Canonical source by responsibility.**

- **Figma** is the visual source: it defines and validates values, modes, aliases and
  design intent.
- `design.md` is the human and agentic contract: it explains usage, accessibility,
  naming and constraints. It is not the generation file.
- **JSON** will be the versioned technical source of the audited values that enter
  the repository.
- The **CSS custom properties** will be generated from the JSON and must not be edited
  by hand.

Until the Figma ↔ documentation audit is finished, no value enters the
JSON. **Do not create tokens with fictitious or unaudited values.**

**Reason.** JSON is tool-readable and serves as the source to generate other
formats; CSS custom properties are what the browser consumes and what P02
defines as public API.

**Scope.** No token value enters the repository before the audit.

**Impact.** It creates a generation step between source and consumption: the JSON is
edited, the CSS is generated and must not be edited by hand. The generation tool
has not been chosen yet.

**Out of scope.** Creating token files, migrating values from Figma to
code, choosing a generation tool and writing the token build script.

**Compatibility with [`design.md`](../design.md).** The existing YAML in
`design.md` remains as documentation of the contract until its migration and
validation in the repository. After the audit, the JSON will be the technical source of the
values; `design.md` will keep explaining the criteria and must point to the
JSON, without duplicating values that could diverge.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P19 — Storybook, tests and publishing

**Decision.**

- Keep `@storybook/web-components-vite`.
- `npm run storybook` for local development.
- `npm run build-storybook` as build validation.
- Stories will sit next to the components when these are created.
- The Storybook build must run in CI on pull requests, once the
  workflow is created.
- Initially, the result will be made available only as a **private CI
  artifact**.

**Reason.** Consolidate as a working choice what is already configured and
working, and fix build validation before there are components, without
exposing anything publicly while the system is under construction.

**Scope.** The two commands apply from now on. CI applies from the moment
the workflow exists.

**Impact.** It ends the provisional status of `@storybook/web-components-vite`,
which until 24/08/2026 was listed as a bootstrap choice to be confirmed. npm remains
the package manager by the same continuity decision. CI and its private
artifact are rules for the future workflow; this note does not state that they already
exist.

**Out of scope.** Public publishing, GitHub Pages, external environment, deploy
and definitive test configuration. Creating the CI workflow. Interaction and
accessibility tests will be defined with the first real component.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P20 — Generation tool and public theme contract

This decision **complements P17**, which fixed JSON as the source format and CSS
custom properties as the generated format, but left the tool open.

**Decision.**

- The generation tool is **Style Dictionary v5**.
- The public theming contract is **two independent attributes**:
  `data-nph-brand` and `data-nph-color-scheme`.
- The public values of `data-nph-color-scheme` are **`light`** and **`dark`**.
- The values of `data-nph-brand` are the names of the verticals: `sistemas`,
  `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh`.
- The namespace of the DTCG extensions is **`com.iatec.nephos`**.

**Reason.** The tool was chosen by requirement, not by popularity:
it must support **layers**, **aliases** and **modes**. Style Dictionary treats
aliases as first-class syntax and, with `outputReferences`, emits
`var(--outro-token)` instead of flattening the alias into a literal — the requirement that
eliminates the alternatives. Layers come from the organization of the source files; modes
come from one output per mode, each with its own selector. It is pure Node, with no
coupling to a Figma plugin, consistent with the npm already fixed by P19.

Technical identifiers stay in English. Brand values stay in
Portuguese because they are proper names of the verticals, not technical terms.

**Scope.** Applies from now on to `src/tokens/`. It does not change P17, which remains
the source of the rule on format and responsibility per layer.

**Impact.**

1. `style-dictionary` comes in as the first `devDependency` outside Storybook.
2. `src/tokens/generated/` now contains a versioned, generated artifact, which
   must **never** be edited by hand. The build is deterministic so that, in the
   future CI, an empty `git diff` check is possible.
3. Brand and scheme become an **HTML contract**: the consumer puts both
   attributes on the root element. Omitting both delivers Sistemas in light.
4. DTCG has no native modes; the mode format in
   `$extensions["com.iatec.nephos"].modes` is a Nephos convention. Switching
   tools preserves the JSON, but requires rewriting the step that applies the modes.
5. **Recorded limitation:** Style Dictionary 5.5.2 serializes `duration` in
   the DTCG structured form as `[object Object]`. The source remains
   structured; the conversion happens only at output, through a custom transformer. There is
   a validation that aborts the build if `[object Object]` reappears.

**Out of scope.** Creating a CI workflow. Publishing. Generating formats other than CSS.
Migrating effect styles, text styles or the postponed primitives.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P21 — Technical plan of the first component: `nph-icon`

**Decision.** For the first component, adopt the decisions below until there is a
concrete technical conflict or a later review by Elvys:

1. Implement `nph-icon` in Lit, with open Shadow DOM, inline SVG and a closed
   map of the 93 approved icons. The package is Font Awesome Pro on line 6,
   using the `regular` and `solid` SVG packages; each approved name has both
   artworks. The exact version is only pinned after an authenticated query to the registry, at
   the authorized moment of installation.
2. The approved public contract is `name` required, `variant=regular` by
   default, with `solid` available for each name of the approved collection, `size`
   required in `sm|md|lg` and `label` optional. `label` absent, empty or
   containing only spaces after `trim` makes the icon decorative. There are no slots,
   events, focus, click, touch, color property or initial `::part`.
3. The drawing of `eye`, `eye-slash` and `star` may overflow horizontally,
   centered and without clipping or rescaling, inside a square box scaled by
   height. `space/inline-tight` belongs to the container that composes icon and text.
4. Invalid input renders no icon and emits `console.error` only in
   development. There is no visual fallback or free size.
5. Adopt strict TypeScript, stories next to the component and Vitest in
   browser mode as the validation base of the first component. The implementation
   includes story discovery in `src/components/**`, in-browser tests for
   `currentColor` and custom properties, and `build-storybook`.
6. The policy adopted for credentials is: no value in a versioned file;
   local configuration protected from Git; reference to the variable
   `FONTAWESOME_NPM_AUTH_TOKEN` only where needed; and the CI secret
   configured outside the repository. The future CI validates installation, tests and
   `build-storybook` on pull requests, with a private artifact.
7. Indiane accepts the risk of starting the implementation before Elvys's review.
   The local protection rule was applied through an `.npmrc` ignored by Git; this
   does not replace Elvys's later review of license, CI and platform.
8. The Storybook organization of `nph-icon` separates `Docs / Documentação`, for
   reading the contract, from `Docs / Icons Overview`, for the searchable catalog
   of the closed core of 93 icons, and from `Validação`, for variants, sizes,
   color inheritance, accessibility and invalid input. The documentation page is
   derived and points to the canonical sources; it installs no addon, MDX or new
   dependency, does not change the public API and creates no icon, token or variant. Search
   is a behavior of the Storybook page, not of the Web Component.

**Reason.** The technical plan was prepared and reviewed against the working clone,
the approved contract of the component and decisions P01, P02, P03, P17 and P19. The
decisions remove ambiguities of API, behavior, tests and security. The
protection against accidental inclusion of the local configuration was applied; the
technical review by Elvys remains later and mandatory.

**Scope.** This note decides the implementation plan of `nph-icon`. It does not create
dependencies, component files, CI, secrets, local configuration or
publishing.

**Impact.**

- Claude — code may implement P21 before Elvys's review, without exposing
  or versioning a credential and without creating CI.
- Copilot updates the spec and the Register with the implementation evidence,
  Storybook and tests after the verifiable delivery.
- CI remains nonexistent until its technical creation in a change of its own.

**Out of scope.** Creating or exposing a credential, configuring a secret, creating a
workflow, publishing Storybook or implementing another component.

**Status.** Decision adopted by Indiane on 26/08/2026 — implementation
authorized under formal risk acceptance; organization of `Docs / Documentação`,
`Docs / Icons Overview` and `Validação` approved by Indiane on 26/08/2026;
reviewed and approved by Elvys on 28/08/2026.

**Amendment I7, 08/09/2026 — absorbed by the matrix of 14/09/2026.** The original
wording of P21 restricted `solid` to `star`. I7 authorized `circle-info` in
`solid` because the `regular` outline disappears next to text, especially in
light mode; `regular` remains the default. On 14/09/2026 the approved Figma documentation
extended `solid` to all 93 names; items 1 and 2 already describe that
collection. This note records the reason for I7 and neither reopens nor reduces the current map.

---

## P62 — `nph-label`: exception to P01, typography and API

**Status.** Four decisions adopted by Indiane on 27/08/2026. Elvys reviewed them
on 28/08/2026: he approved P62.1, P62.2 and P62.3 as recorded; P62.4
he resolved differently — see the subsection. **P62.5**, adopted by Indiane
on 28/08/2026 to resolve the scope contradiction of P62.4, **was reviewed and
approved by Mauro on 09/09/2026**, in PR #25. The first three arose from a
concrete problem during implementation; the fourth is an old divergence
that the implementation exposed.

### P62.1 — `nph-label` does not use Shadow DOM

**Decision.** `nph-label` is the **only Nephos component without Shadow DOM**.
It renders in the light DOM. P01 remains valid for all the others.

**Reason.** The native association between label and control does not cross the
Shadow DOM boundary. From inside it, `for` does not reach an `id` of the
document, clicking the label does not move the cursor to the field and the screen reader does not
announce the field name. Since this is the reason a label exists, the
encapsulation gives way.

**Discarded alternative.** Delegating the association to `nph-field`, which would keep
P01 intact. It was refused because it would block the P0 cut: `nph-field` is 4th in the queue
and does not exist yet, and `nph-label` would be ready and useless until then.

**Limit.** It is an exception for one piece, not the opening of a precedent. Any other
component that wants to leave Shadow DOM needs its own decision.

### P62.2 — Typography: five custom properties per role

**Decision.** Each of the 14 text roles emits five custom properties, with
the `css` field of `design.md` read as a **prefix**, not as the final name:

```css
--nph-text-label-md-font-family   /* alias to --nph-core-font-sans */
--nph-text-label-md-font-size
--nph-text-label-md-line-height
--nph-text-label-md-font-weight
--nph-text-label-md-letter-spacing
```

**Reason.** `letter-spacing` does not fit in the CSS `font` shorthand, and a component
often needs an isolated property. In the generator, the change is one
line: `fontFamily` goes into `TIPOS_TRATADOS`, and Style Dictionary's own `fontFamily/css`
transform handles the emission. Weight stayed as `number`, not
`fontWeight`, because DTCG accepts a word or a number in that type and the Nephos
source always stores a number.

**Why now.** The 14 styles had been postponed since the base migration.
`nph-label` is the first component made of pure text: without `text/label-md` in
code, it could only exist with a literal value, which A2 forbids. The same blocker
applied to `nph-input`, `nph-field` and `nph-checkbox`.

**Origin of the values.** Read from the 14 text styles of the Figma file
`DS-IA-NEPHOS 5.0` on 27/08/2026 and checked against `tokens_typography` in
`design.md`, item by item, with no divergence. Layers: `core` 139 → 141,
`semantic` 147 → 217, total 292 → **364**.

### P62.3 — API of `nph-label`: `required`, `for` and `text`

**Decision.** Three public properties. `required` was planned in the component
register; `for` and `text` were not and come from P62.1.

| Property | Role |
|---|---|
| `required` | Boolean, default `false`. Adds the asterisk at the end of the text |
| `for` | Mirrors the native `<label>` attribute. It is the mechanism of the association |
| `text` | The label text. It is a property, and not content between the tags, because without Shadow DOM there is no `slot` and Lit would replace the consumer's children |

**This is the most urgent decision in the queue.** `nph-input` and `nph-field` will be
built on top of it. Changing later costs much more than changing now.

**Accessibility tied to this decision.** The asterisk carries `aria-hidden` and is
decorative. The required state reaches the screen reader through the control itself,
with `required`, and not through hidden text in the label: the state belongs to the
field, and hidden text would require a Portuguese string inside the component,
forbidden by the trilingual plan. **Consequence: `nph-input` will have to carry
`required`.**

### P62.4 — Dimensions are emitted in `px`, not `rem`

> **Read the historical record below as history.** The original decision —
> record the divergence without correcting it — **was replaced** by Elvys's
> decision on 28/08/2026 and is already implemented. For the current state, go straight to
> **Elvys's decision — 28/08/2026** and **Implementation — 28/08/2026**, at the end of
> this subsection. What comes before describes the situation of 27/08/2026 and **is not the
> state of the repository today**.

**Original decision, 27/08/2026 — SUPERSEDED.** Record the divergence instead of
correcting it at that moment.

**The fact, on 27/08/2026.** `design.md` declared `unidade_css: rem, raiz
16px` and **no layer of the generator complied with it**: space, radius, control
height, icon size and the newly migrated typography were all emitted in `px`. The
typography migration merely followed what already existed. **This stopped being true
on 28/08/2026:** today 92 of the 100 `dimension` tokens are emitted in `rem`, and only
`core/radius` remains in `px`, by P62.5.

**Reason for not correcting it in that PR.** Switching to `rem` affects every `dimension`
of the system, not just typography, and it is a pipeline decision. Correcting it inside a
component PR would hide a global change inside a local delivery. That is
why the correction came later, in its own PR.

**What was open, and no longer is.** Either the generator would start emitting `rem`,
or `design.md` would start declaring `px`. The contract promised one thing and the
code delivered another. Resolved below.

**Elvys's decision — 28/08/2026.** Resolves the divergence: the **generator migrates
to `rem`**. `design.md` (`unidade_css: rem, raiz 16px`) does not change — it is the
code that starts complying with the contract already written. This replaces the "record
without correcting" above; the divergence is no longer just noted.

**Scope of this decision.** It sets the direction, not the implementation. It affects every
`dimension` layer of Style Dictionary — space, radius, control height, icon
size and typography (P62.2) —, not just typography. The migration itself (change in the
generator, and revalidation of the deterministic output of each layer) is a task of its own,
outside this note.

**Implementation — 28/08/2026.** Carried out under Indiane's authorization. The
`nephos/dimension/rem` transform in `scripts/build-tokens.mjs` divides by 16 and
emits `rem`; zero is emitted as `0`. **92 of the 100 `dimension` tokens** were converted
— space, control height, icon size, layout width and height,
focus thickness and the 42 typography ones. The 8 radius ones are left out by P62.5.

The 8 primitives of `core/radius` were left out, by the decision recorded in
**P62.5**, below.

---

### P62.5 — The radius stays in `px`

**Indiane's decision, 28/08/2026.** `core/radius` stays out of the P62.4
conversion. The other 92 `dimension` tokens go to `rem`; the 8 radius ones remain
in `px`.

**Why this decision exists.** The scope of P62.4 cites "radius" among the
affected families and, in the same paragraph, determines that `design.md` **does not
change**. For the radius, the two things do not fit together: `raio_regras` in
`design.md` declares `unidade_css: px`. Converting the radius would require changing the
contract that P62.4 itself orders to preserve.

**Why `px` and not `rem`.**

1. **The rule has a written reason, and the reason is still valid.** `design.md`
   explains: `"Raio em rem cresceria com a fonte do usuario e um botao de 6px viraria capsula. Forma nao acompanha tamanho de texto."`
   (a radius in rem would grow with the user's font and a 6px button would turn into a capsule; shape does not follow text size). `px` and `rem` behave
   the same under browser zoom; the difference only shows when the
   user enlarges the font — and then a radius in `rem` **deforms** the button instead of
   following it.
2. **The mention of "radius" in P62.4 is incidental, not reasoned.** It appears
   in an enumeration of the families of the `dimension` layer. The part of P62.4 that was
   actually decided is the other one: the code starts complying with the contract. Here, the
   contract says `px`.
3. **`core/radius/full` is `9999px`**, which in `rem` would become `624.9375rem` —
   a value nobody would write on purpose, and a sign that the family was not
   considered when the list was written.

**What this decision does NOT do.** It does not change `raio_regras` in `design.md`: it
confirms it. It creates no new exception — the radius was already the only foundation declared in
`px`. It does not touch the other three `unidade_css` rules.

**Cost of changing course.** Low and symmetric: converting the radius later means
moving `'radius'` out of the `NO_CONVERSION` constant (formerly `SEM_CONVERSAO`;
renamed by P64 on 29/09/2026) in
`scripts/build-tokens.mjs` and running `npm run build:tokens`. But it would require changing
`raio_regras` in `design.md` along with it, and then it stops being a pipeline change and
becomes a visual contract change.

**Status.** Decision adopted by Indiane on 28/08/2026 — documentary review of the
evidence completed by Copilot on 09/09/2026. The review confirmed the compatibility
with `raio_regras` in `design.md`, the separation of the 8 radius tokens from the 92 converted `dimension`
tokens and the cost described for a future change.

**Reviewed and approved by Mauro on 09/09/2026**, in PR #25, on commit `5fa4821`,
merged into `v/3.0.0` in `ed7c009`. These are two distinct pieces of evidence and both are necessary:
Copilot's documentary review checked the evidence, and Mauro's approval is the
human review rite that the other technical decisions went through. With it, P62.5 is no longer
the only P62 decision without a recorded review.

---

## P63 — Metadata generated from the spec

**Decision.**

- The spec in `fichas/<nome>.md` remains the source of the piece's contract. The
  **Metadata** is a derived copy, in JSON, of the spec's YAML.
- Reading happens **at build time**. The file is generated by
  `node scripts/verificar-operacao.mjs --gerar-metadata`, is versioned and is
  **never** edited by hand.
- The location is `src/shared/metadata/<peca>.json`. Only a spec with `status: vigente`
  generates a file.
- The JSON mirrors the whole YAML, in the spec's order, with 2-space indentation, LF
  line endings and a final newline.
- The verifier rule `V32` fails Metadata that does not match the spec, JSON
  without a current spec, and a spec outside the reader's grammar.

**Reason.** Code, Storybook, tests and a future query server need to
read the contract without parsing Markdown. Generating the copy from the spec delivers
that format without opening a second source: `V27` still fails `meta.ts`
and `metadata.ts` inside `src/components/`.

**Scope.** The spec's YAML is read by `scripts/spec-lib.mjs` (formerly `ficha-lib.mjs`; renamed by P64 on 02/10/2026), which covers only the
subset the template uses and rejects, with the line number, what it does not
recognize. No new dependency comes in. Task, context and evidence
remain in JSON, as decided on 02/09/2026.

**Impact.** Whoever changes a current spec runs `--gerar-metadata` in the same
commit. Without it, `npm run test:operacao` fails by `V32`.

**Out of scope.** The Metadata tab in Storybook, the query server
(MCP) and checking the spec's `api` block against the code.

**Status.** Decision adopted by Indiane on 28/09/2026, by delegation —
reviewed and approved by Mauro on 30/09/2026, in the team chat.

---

## P64 — Code language

**Decision.**

- **Code names** — variable, constant, function, class, parameter and
  internal property — are written in **English**.
- **Comments, error messages and output for whoever maintains the repository**
  remain in **PT-BR**, the language of the team and of the internal documentation.
  *(Superseded by the amendment of 06/10/2026, below: they move to English.)*
- Applies to all versioned code: `scripts/`, `src/`, `stories/` and
  `.storybook/`.

**Outside the rule**, because it is a data or interface contract and changing it would break
whoever already uses it:

- the keys of the task, context and evidence JSON, the keys of the token JSON
  and the keys of the specs' YAML;
- the command-line flags, the script names in `package.json` and the
  file names cited in a command recorded in `docs/operacao/` (today, only
  `scripts/verificar-operacao.mjs`);
- the public names, which are already English: `nph-*` tags, properties, custom
  properties and the `data-nph-*` attributes;
- the text shown to whoever reads: story title and name, test description,
  messages and the dictionaries in `.storybook/i18n/`; *(test description and
  messages: superseded by the amendment of 06/10/2026, below)*
- the historical record, which keeps citing the name of the time.

**Reason.** Until now there was no rule, and practice was mixed:
`verificar-operacao.mjs` was entirely in PT-BR, `build-tokens.mjs` mixed both
languages, and the components had an English API and internal functions in PT-BR. The
review of PR #41 pointed this out. The rule follows what P20 already fixes for tokens and
theme and what `fichas/_modelo.md` fixes for the specs: identifiers in English,
everything else in Portuguese.

**Impact.** New code is born under the rule. Existing code migrates folder by folder, in
task `DSA-07`, without changing behavior: the output of the scripts is identical before and
after, and the generated files do not change. `scripts/` migrated on 29/09/2026.

**Amendment of 02/10/2026 — file names.** A technical file name in
Portuguese kept the language mix that P64 removed from identifiers. The
renamed files are not cited by a command recorded in `docs/operacao/` nor
by a schema; the current documentation that cites them changes along with them. Technical
code file names (`src/`, `stories/`, `.storybook/`, `scripts/`) also follow
the rule. What stays: what a command recorded in `docs/operacao/` cites, the directories
of the verifier contract (`fichas/`, `docs/operacao/tarefas/`, `evidencias/`,
`contextos/`, and the same subfolders inside the fixtures) and the documentation, which
includes the names of the evidence files. The fixture cases of the verifier
and of the invariance test also move to English. Proof: `npm run test:naming`, with the contract
exceptions in `scripts/naming-exceptions.json`. Adopted by Indiane on
02/10/2026; approved by Mauro in PR #49.

**Amendment of 06/10/2026 — language of the documentation, comments and
messages.** The repository now has a single language for whoever reads it, person or
agent: English.

- **In English:** all the code, including **comments**, **messages**
  (console, `throw`, `Error`, process output, `fail`/`warn`, assertion
  messages) and **test descriptions** (`describe`, `it`, `test`), which are code text
  and not text shown to whoever uses Storybook; the **specs**; **all the
  DS documentation the agent reads** — `design.md`, `AGENTS.md`, `CLAUDE.md`,
  `GOVERNANCA.md`, `contributing.md`, the `README.md` and all of `docs/`, including
  `docs/operacao/` (tasks and evidence); and **Storybook**, with English as the
  source and default language.
- **The English spec is the source.** The component frame in Figma, in
  Portuguese, is the version for people; if the two diverge, the spec prevails.
- **Stays out, in Portuguese:** Figma; the team's working vault;
  commits, pull request descriptions and comments for reviewers; the translated values
  of the `pt-BR` and `es` dictionaries in `.storybook/i18n/` and the `pt-BR` and
  `es` translations of the public documentation; the historical record, which keeps citing the name
  and the text of the time.
- **Contract keys do not change now.** Key and enum value of the task, context and evidence
  JSON, key of the specs' YAML (and of the Metadata) and
  key, mode and brand of the token JSON — `objetivo`, `estado`,
  `aguardando-decisao`, `use_quando`, `modos`, `claro`, `escuro` — remain in
  Portuguese until their own task, `DSA-15`, which migrates last. Text that cites
  one of them puts it between backticks.
- **The translation is faithful:** it changes no rule, number or decision.

**Proof.** `npm run test:naming` now fails Portuguese in comments,
messages and test descriptions in `src/`, `stories/`, `.storybook/` and `scripts/`,
including comments inside `html`, `svg` and `css` templates. The documentation is
checked by the same command, by vocabulary (`scripts/language-lib.mjs`), in
two groups — documentation and specs —, which stay in warning mode until the translation of
each one lands. A text exception goes into `scripts/naming-exceptions.json` (code)
or into `scripts/language-exceptions.json` (documentation), only with the classes
`prose-text` and `contract-term`, which never cover a technical name. Adopted by
Indiane on 06/10/2026.

**Status.** Decision adopted by Indiane on 28/09/2026 — reviewed and approved
by Mauro on 30/09/2026, in the team chat. Amendment of 02/10/2026 approved by
Mauro in PR #49, merged on 05/10/2026. Amendment of 06/10/2026 adopted by
Indiane, under review in the pull request that brings it.

---

## P65 — `nph-tooltip`: API and semantics

**Decision.**

- `nph-tooltip` is a Web Component with **open Shadow DOM** (P01). The CSS
  lives in `nph-tooltip.css`, imported `?inline`, as in `nph-icon`.
- **Public API: two properties.**

  | Property | Role |
  |---|---|
  | `text` | String, default empty. The bubble text, already localized by the consuming application. Empty or only spaces: nothing is shown |
  | `open` | Boolean, default `false`, reflected to the attribute. Shows the bubble |

- **No slot, no event, no positioning and no trigger of its own.** Whoever
  opens, closes and positions it is the consumer. The first is the `info` trigger of
  `nph-label`, which opens on click, Enter or Space and closes with Esc or a click
  outside; the bubble does not open on hover.
- **Toggletip semantics.** The host is a `role="status"` live region from
  mount, open or closed: the screen reader only announces a change inside
  a region that already existed. The bubble is not focusable; focus stays on the trigger.
- **Anatomy only through semantic tokens:** background `color/tooltip`; text
  `text/body-sm` in `color/tooltip-foreground`; radius `radius/inner`; padding
  `space/inline-tight` top and bottom and `space/inline` on the sides;
  `elevation/dropdown`; no border and no arrow. Width up to
  `layout/max-tooltip-width` and height up to `layout/max-tooltip-height`.
- **The text is not truncated.** It follows the width up to the maximum and wraps only
  between words: no ellipsis, no automatic hyphenation, no broken
  word. It fits in up to two lines; longer text is a content error.

**Source.** Behavior and scope: Indiane's decision on 01/10/2026, L11.5 of the
decision register (vault). Anatomy: L11.6 and L11.7 and the `nph-tooltip` frame
(`1237:5`) accepted in the Figma file `DS-IA-NEPHOS 5.0`, with component `1237:3`. The
padding follows the redesign accepted on the same day; L11.5 still cites
`space/container-padding`, which the redesign replaced. The API (`text`, `open`)
and the semantics (`role="status"`) are a technical proposal of this implementation.

**Known limit.** `elevation/dropdown` is emitted in `:root` with
`var(--nph-shadow-color)`. In a subtree with another `data-nph-color-scheme`, the
shadow keeps the root's color. It is a pending item of the token generator, and not
of this piece. *Resolved by P67.*

**Status.** Anatomy and behavior adopted by Indiane on 01/10/2026; API and
semantics approved by Mauro in PR #51 (DSA-08), merged on 05/10/2026.

---

## P67 — Dependent invariants in each scheme root

This decision **complements P20** without changing it. P20 still fixes the two
attributes as the theme contract; P67 says how they apply in a part of the screen.

**Technical conflict.** A custom property with `var()` resolves on the element that
declares it, and the child inherits the already resolved value. The generator emitted the invariants
once, only in `:root`. In a part of the screen with another brand or another scheme, the
invariant that points to `theme/*` or to a variant kept the root's
value. Measured in the browser: in `data-nph-brand="educacao"`, `--nph-focus-halo`
came out as `#b1cdfb`, the Sistemas halo. In the shadow (`elevation/*`), the color stayed the light
one in a dark part — the limit recorded in P65.

**Decision.**

- An invariant is **dependent** when some reference of it points to
  `theme/*`, to a variant or to another dependent (fixed point, in
  `scripts/tokens-lib.mjs`, `dependents()`).
- The generator emits the dependents in `:root, [data-nph-color-scheme]`: every scheme
  root redeclares them, and the `var()` resolves there the local brand and scheme. The
  other invariants stay only in `:root`.
- **Consumption, decided by Indiane on 05/10/2026:** a part of the screen with another
  brand carries `data-nph-brand` **and** `data-nph-color-scheme` on the same element. Only
  the scheme in a part of the screen also works. Only the brand, without the scheme on the same
  element, is not supported.
- New generator validation: a dependent outside the scheme block, or an
  independent one inside it, fails the build.

**Reason.** Redeclaring only the dependents, and not all invariants, preserves the
consumer's customization (P02): an independent invariant customized in
`:root` still reaches any part of the screen. Requiring both attributes
together dispenses with `@scope` and does not ask for a recent browser.

**Limit.** A dependent customized only in `:root` does not reach a part of the
screen with `data-nph-color-scheme`: there it is redeclared. To customize it,
declare it on the scheme element as well.

**Impact.** The generated CSS moves lines from one block to another, without changing any
value. The proof is in `src/shared/tokens/tokens-cascade.test.ts`: a part of the
screen with brand and scheme resolves every brand and semantic token the same as the root
with the same attributes, in the seven brands and both schemes. The gate command
of DSA-04 (`conferir-tokens-figma.cjs`) now accepts both invariant
blocks.

**Rite.** This decision touches the limit of P65 and the use of P20, so it follows the
rite of the section "How to change one of these decisions": the technical conflict is above, the
proposal is this section, and the human review is the one by `maurocsjr` in the PR. The text of the
P65 decision does not change; only its limit gets the annotation.

**Status.** Consumption decided by Indiane on 05/10/2026; generator under review in the PR.

---

## How to change one of these decisions

Do not change, replace or reopen P01, P02, P03, P17, P19, P20, P21, P62, P63, P64, P65 or P67 without:

1. explaining the concrete technical conflict;
2. recording a change proposal;
3. requesting human review.

This applies to people and to agents.

## Where these decisions appear

| Document | What it says about them |
|---|---|
| [`../README.md`](../README.md) | Summary and pointer to this note |
| [`../AGENTS.md`](../AGENTS.md) | Mandatory reading rule before touching a component |
| [`../CLAUDE.md`](../CLAUDE.md) | Claude-only instruction; the common rule is in `AGENTS.md` |
| [`../GOVERNANCA.md`](../GOVERNANCA.md) | Current state of the repository |
| [`../design.md`](../design.md) | Foundations contract; §9 and §10 aligned with P03 and P17 |
| [`tokens.md`](tokens.md) | How P17 and P20 are applied: source, generation, consumption and validations |
| [`../fichas/<nome>.md`](../fichas/) | How the decision reaches the component: contract, variants, states and tokens |
