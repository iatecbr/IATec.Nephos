# Technical decisions — Nephos

This is the **single source** of the technical decisions P01, P02, P03, P17, P19, P20,
P21, P62, P63, P64, P65, P66, P67, P68, P69, P70, P71, P72, P73 and P74. If this file and any other document in the
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
| **P62.6** | `info` and `infoLabel` in `nph-label`: the information trigger | 06/10/2026 | Medium. `nph-field` will assemble the label with the trigger; changing the API later requires redoing both | Anatomy and behavior: L8 to L11, adopted by Indiane on 08/09/2026 and 01/10/2026. API and semantics approved by `maurocsjr` in PR #58, merged in `455ead8` |
| **P01** | Open Shadow DOM | 24/08/2026 | High. Every component depends on it | Approved, 28/08/2026 |
| **P02** | Custom properties as public API | 24/08/2026 | High | Approved, 28/08/2026 |
| **P03** | Directory pattern and TypeScript | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P17** | Role of each source of truth | 24/08/2026 | High | Approved, 28/08/2026 |
| **P19** | Storybook, tests and publishing | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P20** | Style Dictionary v5 and theme contract | 24/08/2026 | High | Approved, 28/08/2026 |
| **P21** | Technical plan of `nph-icon` | 26/08/2026 | Already implemented and merged under risk acceptance | Approved, 28/08/2026. Light amendment: under review in the pull request that brings it. |
| **P63** | Metadata generated from the spec | 28/09/2026 | Medium. Changing location or format later requires generating again and adjusting whoever reads it; the spec does not change | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** |
| **P64** | Code language | 28/09/2026 | Medium. Applies to all new code; migrating what exists only swaps names | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** Amendment of 02/10/2026 approved by Mauro in PR #49, merged on 05/10/2026. Amendment of 06/10/2026 adopted by Indiane: the language part approved by Mauro in PR #59, merged in `addb034`, and the Storybook naming item in PR #56, merged in `455ead8`. Amendment of 15/10/2026 (American English) adopted by Indiane, reviewed in the pull request that brings it. |
| **P65** | API and semantics of `nph-tooltip` | 05/10/2026 | Low now. `nph-label` is the first consumer; changing later requires redoing its trigger | Behavior and scope (L11.5) and anatomy (L11.6, L11.7 and the accepted frame) adopted by Indiane on 01/10/2026. API and semantics approved by `maurocsjr` in PR #51, merged on 05/10/2026 |
| **P66** | API and semantics of `nph-spinner`, `nph-separator` and `nph-kbd` | 05/10/2026 | Low now. `nph-button` (Batch B) and `nph-rich-option` will be the first consumers | Anatomy and behavior: frames accepted by Indiane on 01/10/2026. API and semantics approved by `maurocsjr` in PR #54, merged in `d01da7b` |
| **P67** | Dependent invariants redeclared in each scheme root | 05/10/2026 | Medium. Changes where the generator emits 14 tokens and fixes how a part of the screen switches brand | Consumption decided by Indiane on 05/10/2026. Generator approved by `maurocsjr` in PR #55, merged in `7dd370d` |
| **P68** | API and semantics of `nph-badge` and `nph-button` | 05/10/2026 | Low now. No piece consumes either of them yet | Anatomy and behavior: frames accepted by Indiane on 01/10/2026, completed on 02/10/2026. API and semantics approved by `maurocsjr` in PR #56, merged in `455ead8` |
| **P69** | API and semantics of `nph-skeleton` | 15/10/2026 | Low now. No piece consumes it yet; `nph-avatar` will share its avatar sizes and radii | Anatomy and behavior: frame accepted by Indiane on 08/10/2026. API and semantics reviewed in the pull request that brings them |
| **P70** | Package entry points and the Usage section | 15/10/2026 | Medium. Every `Docs` page shows the import line, so changing the path later changes every page and every consumer | Adopted by Indiane on 15/10/2026 (DSA-30, D2). Reviewed in the pull request that brings it |
| **P71** | `Docs` page lists read from the Metadata | 15/10/2026 | Low. The lists move from the dictionary to the Metadata; the sheet does not change its format | Adopted by Indiane on 15/10/2026 (DSA-30, D1). Reviewed in the pull request that brings it |
| **P72** | Accessibility gate in the tests | 15/10/2026 | Medium. Two new dependencies and a gate on every story; the earlier, the fewer violations to fix | Adopted by Indiane on 15/10/2026 (DSA-30, D3). Reviewed in the pull request that brings it |
| **P73** | API and semantics of `nph-togglebutton` | 19/10/2026 | Low now. No piece consumes it yet; `nph-toggle-group` (DSA-23) will consume its event, so changing the event name or the state name later requires redoing both | Anatomy and behavior: board accepted by Indiane on 07/10/2026, motion answered on 19/10/2026 (D6). API and semantics reviewed in the pull request that brings them |
| **P74** | API and semantics of `nph-avatar` | 20/10/2026 | Low now. No piece consumes it yet; `nph-select` (DSA-29) and `nph-avatar-stack` (DSA-25) will, so changing `src`, `label` or `size`, or the border over the photo, later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 06/10/2026, D1 to D4 answered on 19/10/2026. API and semantics reviewed in the pull request that brings them |

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

**Annotation of 15/10/2026.** P70 defines the package entry points and the import
line of each component. Public publishing stays out of scope.

**Annotation of 15/10/2026.** P72 defines the accessibility tests: the deferral to
"the first real component" is closed.

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

**Amendment — Light as the default style.** The `regular` SVG package was replaced
by `light` (`@fortawesome/pro-light-svg-icons`, same pinned version), and
`variant=regular` by `variant=light` as the default; `solid` is unchanged. This
replaces `regular` in items 1 and 2 and the sentence "`regular` remains the
default" of amendment I7, which stay above as the record. `regular` is no longer a
valid value and has no alias. Reason: at 16 px Regular draws a 1.5 px stroke and
Light 1.0 px, the same weight as the text, so the Solid of the active item stands
out. Thin and Sharp remain forbidden; Duotone is unchanged.

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

*Amended by P62.6.*

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

### P62.6 — Information trigger: `info` and `infoLabel`

**Conflict with P62.3.** P62.3 fixed three public properties (`required`,
`for` and `text`). L8 of the decision register (08/09/2026) says that gaining `info`
is a contract change, and L9 and L11 (01/10/2026) give the trigger focus and a balloon.
This decision extends the API to five properties, through the rite of "How to change one
of these decisions": the conflict is here, the proposal is this section, and the human
review is the one by `maurocsjr` in the PR. The text of P62.3 does not change; it only gains the
annotation "Amended by P62.6".

**Decision.**

- **API: two new properties, neither reflects** (they are content, like `text`).

  | Property | Role |
  |---|---|
  | `info` | String, empty by default. The text of the explanation, already localized by the consuming application. It is the `text` of `nph-tooltip` |
  | `infoLabel` (`info-label`) | String, empty by default. The accessible name of the trigger (L11.3) |

  The trigger appears only with both filled, after `trim`. `info` without
  `infoLabel` is invalid input: the trigger does not appear and `console.error` is emitted in
  development, once per cause. The label remains: it is the name of the
  control and cannot disappear because of the help. This adapts the invalid input
  rule of `docs/stories.md` (§2.5, which says to draw nothing) only to the invalid
  part, as §2.5 itself asks for another piece: decide and record.
  `infoLabel` without `info` is an assembly state: nothing, no error (decision of
  01/10/2026: an empty `infoLabel` omits the trigger).
- **Semantics.** The trigger is a native `<button type="button">` **after** the
  `<label>`, outside it: inside, it would enter the accessible name of the control. It carries
  `aria-label` = `infoLabel`, `aria-expanded` and `aria-controls` with the `id` of the
  `nph-tooltip`, unique per instance. The icon is `circle-info` `solid` `sm`,
  decorative. The `nph-tooltip` exists from mount, closed, because the
  `role="status"` region must exist before opening (P65). The open state is
  internal and is not API.
- **Open and close.** Click, Enter or Space toggle, through the native behavior
  of the button; on opening, the trigger receives `focus()` (in Safari, clicking a
  button does not give it focus, and without focus Esc would not reach it). No hover. They close:
  - **Esc** (L11.5), in a `keydown` listener on the trigger itself, never on the
    document. With the balloon open, it closes and stops propagation — the dialog that
    contains the form does not close along with it; with the balloon closed, it does not intercept;
  - **click outside** (L11.5), outside the trigger and the balloon. Clicking the label
    text closes and moves focus to the control (P62.1). A `pointerdown` listener on the
    document, in capture, only while open, removed on closing and on disconnecting;
  - **Tab out**: `focusout` of the trigger closes when focus goes to an
    element outside the `nph-label`. It is the keyboard reading of the "click outside"
    of L11.5: without it, the balloon would stay open over the next field, with no Esc to
    close it. Reading confirmed by Indiane on 06/10/2026; the implementation is
    reviewed in the PR. A click on the balloon, which is not focusable, does not close it.
- **Anatomy, only through tokens** (component set `374:6` and frame `1194:1482`). Only with the
  trigger, the host receives `data-nph-info`, and the root becomes `inline-flex`,
  centered, with a `gap` of `space/inline-tight` and `position: relative`; without it, the
  root stays `inline-block`. The trigger is 24 × 24, the artwork of
  `icon/size-sm` with `space/inline-tight` around it (WCAG 2.5.8), with no background or
  border, in `color/muted-foreground`. Focus, only on `:focus-visible`, is the border
  of `border/width` in `focus/border` with radius `focus/border-radius-control` and
  the halo of `focus/ring-width` in `focus/halo` with radius
  `focus/radius-control-with-border`, both outside — the same drawing as the
  focus of `nph-button` in Figma (L9). The balloon sits below the label, aligned
  to the start, at `space/inline`, in `position: absolute`: it does not push the
  form, as the `use` of `color/tooltip` asks ("does not block the page").
  The width is that of the text, up to the maximum of `nph-tooltip`.
- **Literals and why:** `transparent` (trigger without background), `calc(-1 * …)`
  to put border and halo outside, `position` and `inset` of the balloon, and the
  button resets (`margin: 0`, `border: 0`, `font: inherit`), because the element lives in the
  light DOM and an application stylesheet can reach `button`. No visual value.

**Known limits.**

- **L-a — `use` of `color/muted-foreground`.** The `use` in `design.md`
  ("Caption, helper text, placeholder, metadata") does not mention the icon of the
  trigger, which the accepted Figma uses (contrast of 6.69:1 in light and 9.81:1 in
  dark, L8). The code follows Figma. Indiane decided on 06/10/2026 to extend the
  `use` to the trigger icon, in PR #57; with it, this limit is resolved.
- **L-b — rule 6 of `design.md`.** Rule 6 and `focus-ring/default` still
  speak only of the `focus/ring` ring. The alignment to focus by border and halo is in
  PR #57, which already mentions the `info` trigger; this one goes in after it.
  *Resolved by PR #57:* rule 6 now names the focus border and halo, and cites the
  `info` trigger of the `nph-label`.
- **L-c — no `z-index`.** There is no layer token. A positioned sibling that
  comes later in the DOM can end up on top of the balloon. The balloon also does not flip
  upward near the edge of the screen.

**Source.** Anatomy and behavior: L8 to L11 of the decision register (vault),
accepted by Indiane on 08/09/2026 and 01/10/2026, and the `nph-label` frame
(`1194:1482`) with component set `374:6`, in the Figma file `DS-IA-NEPHOS 5.0`. The API
(`info`, `infoLabel`), the semantics and the adaptation of §2.5 are a technical proposal
of this implementation. Closing by Tab is a reading of L11.5, confirmed by
Indiane on 06/10/2026.

**Status.** Anatomy and behavior adopted by Indiane on 01/10/2026; API and
semantics approved by `maurocsjr` in PR #58 (DSA-04), merged in `455ead8`.

---

## P63 — Metadata generated from the spec

**Decision.**

- The spec in `fichas/<name>.md` remains the source of the piece's contract. The
  **Metadata** is a derived copy, in JSON, of the spec's YAML.
- Reading happens **at build time**. The file is generated by
  `node scripts/verificar-operacao.mjs --gerar-metadata`, is versioned and is
  **never** edited by hand.
- The location is `src/shared/metadata/<piece>.json`. Only a spec with `status: active`
  (renamed in DSA-15) generates a file.
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

**Annotation of 15/10/2026.** P71 makes the `Docs` pages read `use_when` and
`do_not_use_when` from the Metadata. The Metadata tab stays out of scope.

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
- the text shown to whoever reads: test description, messages and the text of
  the dictionaries in `.storybook/i18n/`; *(test description and messages:
  superseded by the amendment of 06/10/2026, below)*
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
  one of them puts it between backticks. On 06/10/2026 `DSA-15` moved the contract
  keys to English, with the map in `docs/operacao/tarefas/DSA-15.md`; the keys of
  `design.md` and the brand names stay as they are.
- **Storybook naming.** Story title, story name, story export and page anchor
  are identifiers in English: the Storybook ID and permalink come from them.
  The visible text of a story comes only from the dictionaries in
  `.storybook/i18n/`, and no visible text is hand-written in a story. The
  sidebar label comes from the `sidebar` subtree, whose keys are the story and
  group IDs, in English. The Storybook IDs and URLs change once, in this
  amendment. Proof: `npm run test:naming`, which reads the title, the name and
  the `sidebar` key as identifiers and fails Portuguese text hand-written in a
  story. Adopted by Indiane on 06/10/2026, from Mauro's review in PR #56.
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

**Amendment of 15/10/2026 — American English.** No rule named the variant, and
the repository mixed both: `.storybook/i18n/en.json` and parts of `README.md` and
`docs/tokens.md` are British (`colour`, `behaviour`, `centre`), while `design.md`,
the specs, this note and every identifier are American (`color/*`, P20).

- The English of this repository is **American English**, in prose as in
  identifiers. It covers everything this decision puts in English: the code text,
  the specs, the documentation and the `en.json` dictionary.
- **Proof:** the cspell spell checker, set to American English (`en-US`), run by
  an npm script. Its dependency, configuration and script, and the fixes of the
  British spellings, go through a pull request of their own; a change to
  `README.md` or `docs/tokens.md` brings its `pt-BR` and `es` pairs.
- Story IDs do not change: they come from identifiers, which were already
  American.
- **Stays out:** the `pt-BR` and `es` translations, and the historical record,
  which keeps the text of its time.

Adopted by Indiane on 15/10/2026 (DSA-30, D8).

**Status.** Decision adopted by Indiane on 28/09/2026 — reviewed and approved
by Mauro on 30/09/2026, in the team chat. Amendment of 02/10/2026 approved by
Mauro in PR #49, merged on 05/10/2026. Amendment of 06/10/2026 adopted by
Indiane: the language of the documentation, comments and messages approved by
Mauro in PR #59, merged in `addb034`; the Storybook naming item approved by
Mauro in PR #56, merged in `455ead8`. Amendment of 15/10/2026 adopted by
Indiane; reviewed in the pull request that brings it.

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

## P66 — `nph-spinner`, `nph-separator` and `nph-kbd`: API and semantics

**Decision.** The three pieces are Web Components with **open Shadow DOM** (P01),
CSS in its own file imported `?inline`, as in `nph-icon`. None has a slot,
event, focus, click, color property or `::part`. Anatomy only through semantic
tokens. Invalid input renders nothing and emits `console.error` only in
development, with no visual fallback — the same rule as P21, adopted here by
its own decision, as `docs/stories.md` (§2.5) asks.

- **`nph-spinner`**
  - `size`: `sm` (default) or `md`, reflected to the attribute. The default follows the
    accepted frame and supersedes the `sem padrão` of the spec of 31/08/2026.
  - `label`: optional string. When not empty after `trim` and with a valid `size`, the
    host gets `role="img"` and `aria-label`. Without it, `aria-hidden="true"`. It is the
    pattern of `nph-icon` (P21, item 2).
  - The drawing is the `circle-notch` of `nph-icon`, in the same `size`. It spins with
    `motion/loop-duration` and `motion/loop-easing`. With `prefers-reduced-motion:
    reduce` the spin stops (WCAG 2.3.3).
  - Written literals: `rotate(0)` and `rotate(1turn)` in the `@keyframes`. They are the
    geometric definition of the turn, not a visual decision.
- **`nph-separator`**
  - `orientation`: `horizontal` (default) or `vertical`, reflected to the attribute.
  - One line of `border/width` in `color/border`. The host is `aria-hidden` and
    has no role: it is decorative.
  - It fills the container. The horizontal one fills the width in a block parent or
    a column flex. The vertical one fills the height in a row flex parent or grid.
    Outside that, whoever uses it gives the length.
  - `layout/separator-width` and `layout/separator-height` are not consumed. The
    two are the FIXED length of master `762:6`, and the accepted frame says
    `a instância preenche o contêiner`.
- **`nph-kbd`**
  - `text`: string, default empty. It is the Figma property `tecla`. The name is
    `text`, as in `nph-label` (P62.3) and in `nph-tooltip` (P65), and not `key`,
    which consuming frameworks reserve. `K` is only example content from
    Figma.
  - Empty or only spaces: nothing is shown (0 × 0), with no error. It is the
    mount state before the consumer fills in the text.
  - The text sits inside `<kbd>`, and the screen reader reads the key through it. A
    combination joins one piece per key.
  - The border is an inside stroke, as in Figma, made with `box-shadow: inset` in
    `border/width`. The height stays equal to that of the accepted component: the line of
    `text/label-sm` plus `space/inline-tight` top and bottom. The only written
    zero is `margin: 0`, which removes the default margin of `<kbd>`.

**Source.** Frames accepted in the Figma file `DS-IA-NEPHOS 5.0` on 01/10/2026:
`nph-spinner` (`1195:22210`, set `281:11`), `nph-separator` (`1196:674`,
set `762:6`) and `nph-kbd` (`1193:20`, component `772:3`). All three have Figma UX QA
and textual audit approved. The names `text` and `orientation`, the
empty default of `text`, the `role="img"` semantics of the spinner and the
invalid input rule are a technical proposal of this implementation.

**Out of scope.** The spinner inside `nph-button` (Batch B). Determinate progress
indicator. Separator with text. Key combination in a single piece.

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026; API and
semantics approved by Mauro in PR #54 (Batch A), merged in `d01da7b`.

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

**Status.** Consumption decided by Indiane on 05/10/2026; generator approved by
Mauro in PR #55, merged in `7dd370d`.

---

## P68 — `nph-badge` and `nph-button`: API and semantics

**Decision.** The two pieces are Web Components with **open Shadow DOM** (P01),
CSS in its own file imported `?inline`, as in `nph-icon`. Neither has a slot,
event of its own, color property or `::part`. Anatomy only through semantic
tokens. Invalid input renders nothing and emits `console.error` only in
development, one per cause and accumulating — the rule of P21, adopted here by
its own decision, as in P66. The names follow P64.

- **Names common to both.** The Figma `tipo` is `severity`, and the `enfase` is
  `emphasis`. `severity` is the PrimeNG name, which is the source of the values
  (`primary`, `secondary`, `info`, `warn`, `help`, `danger`, `success`; B1 of
  the decision register). `type` is not used: on the button, it is the native
  attribute that decides form submission. The two pieces use the same name for
  the same choice.
- **`nph-badge`**
  - `severity`: the types above, default `primary`, reflected to the attribute.
  - `emphasis`: `solid` (default) or `light`, reflected to the attribute. The
    defaults are those of set `878:30`.
  - `text`: string, default empty. It is the accessible name. Empty or only
    spaces: nothing is shown (0 × 0), with no error. It is the mount state, as in
    `nph-kbd` (P66), and the rule of the frame: if there is nothing to write,
    there is no badge.
  - `icon`: string, default empty. A name from the `nph-icon` core, before the
    text, in `icon/size-sm`, in the text color and decorative.
  - Text only, no role. It receives no click, focus or hover: the hover left
    Figma on 02/10/2026, because the badge is not clickable.
  - The text stays on one line (`white-space: nowrap`): one or two words.
- **`nph-button`**
  - `severity` (default `primary`), `emphasis` (`solid`, default, `outline`,
    `light` or `ghost`) and `size` (`compact`, `default`, default, or `large`).
    `outline`, `light` and `ghost` exist only in `primary`, `secondary` and
    `danger` (B1). The `default` default is Indiane's decision on 05/10/2026,
    through T4 (`compact` is tied to the dense context), and supersedes the
    `padrão compact` of the accepted frame (`1197:5449`, section 5). The three
    are reflected to the attribute, as are `disabled` and `loading`: the internal
    CSS selects by them.
  - `text`: what happens on click, and the accessible name. It stays on one line
    (`white-space: nowrap`), because the height is fixed by the control token.
  - `icon-start` and `icon-end` (properties `iconStart` and `iconEnd`): one core
    name each, in `icon/size-sm` when there is text, and they can coexist (B6).
  - **Icon only (B5).** With no text and one icon, the button is square, at the
    control height, with no side padding, and the icon follows the box: `sm` in
    `compact`, `md` in `default` and `lg` in `large` (set `498:15671`). The
    `label` is required and becomes the `aria-label` of the native button; with
    text, it is not used. The name `label` is Indiane's decision on 05/10/2026:
    it supersedes the `aria-label` approved on 02/09/2026, because an
    `aria-label` placed on the host does not name the button inside the shadow
    root, and it follows `nph-icon` and `nph-spinner`.
  - A native `<button type="button">` inside the shadow root, with
    `delegatesFocus`. Native keyboard: Tab enters and leaves; Enter and Space
    activate. The click is the native `click`, which crosses the shadow root and
    reaches the host.
  - **Focus** only on `:focus-visible`: a `border/width` border close to the
    box, with radius `focus/border-radius-control`, and a `focus/ring-width` halo
    outside, with radius `focus/radius-control-with-border`, without changing the
    size. The border has the color of the type (`color/primary`, `status/info`,
    `status/warning`, `status/help`, `color/destructive`, `status/success`) and,
    in `secondary`, `focus/border`. The halo is `focus/halo` in `primary` and in
    `secondary`, and `focus/halo-<hue>` in the others. The same in every
    emphasis.
  - **Hover** (`hover-active`) on the hover tokens of each pair: `color/*-hover`
    and `status/*-hover` in solid, by the decision of 02/10/2026, which
    supersedes B4; `*-surface-hover` and `*-on-surface-hover` in `outline` and in
    `light`; the surface of the type in `ghost`.
  - `disabled`: native `disabled`. The button leaves the Tab order, does not fire
    a click and stays at `state/disabled-opacity`, in the resting colors.
  - `loading` (the Figma `carregando`): the `nph-spinner` spinner takes the place
    of the start icon, the end icon disappears and the text stays. In icon only,
    the spinner replaces the icon: `sm` in `compact` and `md` in `default` and in
    `large`. The button stays focusable, with `aria-disabled="true"` and
    `aria-busy="true"`, and the click does not reach the consumer. The spinner is
    decorative.
  - In `disabled` and in `loading`, a listener on the native button and another,
    in the capture phase, on the host stop the `click`, including one from
    `click()` called on the host.
  - Invalid input: `severity`, `emphasis` or `size` outside the list; `outline`,
    `light` or `ghost` in `info`, `warn`, `help` or `success`; an icon outside
    the core; no text and two icons; no text, one icon and no `label`. **No text
    and no icon is the mount state**: nothing, with no error, as in `nph-kbd`.
- **Written literals, and why.** `transparent` (`ghost` has no background);
  `nowrap`; `calc(-1 * ...)`, which places the focus border and halo outside;
  and `inset 0 0 0` in the `box-shadow` of the `outline` border, which is an
  inside stroke, as in `nph-kbd`. None is a visual value.

**Known limits.**

- **L-a — subtree with another scheme or another brand.** `status/on-solid`
  (alias of `color/background`) and `focus/halo` (alias of `theme/brand-200`)
  are emitted only in `:root`. In a part of the screen with another
  `data-nph-color-scheme` or another `data-nph-brand`, both keep the root's
  value: the solid text of `info`, `warn`, `help` and `success`, in both pieces,
  and the halo of `primary` and `secondary`. It is the same pending item of the
  token generator that P65 records for the shadow. When the generator redeclares
  these invariants per scheme, both pieces fix themselves: they consume the same
  token names. *Resolved by P67:* both are emitted in each scheme root, and a
  part of the screen with another brand carries `data-nph-brand` and
  `data-nph-color-scheme` on the same element. The tests of both pieces measure
  this.
- **L-b — `use` in `design.md` narrower than the accepted Figma.** The accepted
  frame and sets use tokens where the `use` does not yet cite that use:
  `color/primary-surface` and `color/destructive-surface` (the `use` cites
  "nph-button with light or outline emphasis") also serve the `ghost` hover and
  the `light` badge; `color/primary-on-surface` ("USE only on it") also in the
  `ghost` with no background; `color/muted` (`nao_use: "Hover."`) in the hover of
  the `secondary` `ghost` and as the background of the `secondary` `outline`;
  `status/<hue>` (icon, dot, bar) as the solid background of badge and button;
  `status/<hue>-surface` and `-foreground` ("Always together with the other
  three roles") in the `light` badge, without `-border`. The pieces follow
  Figma; widening the `use` is a pending decision of Indiane, and this PR does
  not change `design.md`. *Resolved by PR #57:* the `use` of each of these
  tokens now cites these uses.

**Source.** Frames accepted in the Figma file `DS-IA-NEPHOS 5.0` on 01/10/2026
and completed on 02/10/2026: `nph-badge` (`1196:1100`, set `878:30`; the hover
left) and `nph-button` (`1197:5449`, sets `461:13009` and `498:15671`; the solid
hover moved to the hover tokens). Both have Figma UX QA and textual audit
approved on 02/10/2026. Decision register (vault): B1, B5 and B6. The names
`severity`, `emphasis`, `text`, `icon`, `iconStart`, `iconEnd` and `loading`,
the semantics of `loading` and the invalid input rule are a technical proposal
of this implementation. The `label` and the `default` default `size` are
Indiane's decisions on 05/10/2026.

**Out of scope.** Form submission (`type="submit"`, form-associated element),
link that looks like a button, button group, fluid-width button, text on more
than one line, clickable badge and badge with a count.

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026 and
completed on 02/10/2026; API and semantics approved by Mauro in PR #56
(Batch B), merged in `455ead8`.

---

## P69 — `nph-skeleton`: API and semantics

**Decision.** `nph-skeleton` is a Web Component with **open Shadow DOM** (P01), CSS
in its own file imported `?inline`, as in `nph-icon`. It has no slot, event, focus,
click, color property or `::part`. Anatomy only through semantic tokens. Invalid
input renders nothing and emits `console.error` only in development, with no visual
fallback — the same rule as P21, adopted here by its own decision, as in P66.

- `shape`: `line` (default), `block`, `avatar-sm`, `avatar-md` or `avatar-lg`,
  reflected to the attribute. It is the Figma property `forma`, whose values are
  `linha`, `bloco`, `avatar sm`, `avatar md` and `avatar lg`. One property, as in
  the accepted frame: a second `size` property would be valid only for the avatar
  and meaningless for `line` and `block`.
- The piece is a rectangle in `color/muted`, with no border, no text and no
  animation. It is still, so there is no reduced-motion rule.
- `line` takes `skeleton/line-height` and `radius/inner`; `block` takes
  `radius/control`; `avatar-*` takes `avatar/size-*` and `avatar/radius-*`, the
  same pair as `nph-avatar`, with rounded corners and never a circle.
- The width of `line` and `block` comes from the container: both fill it in a block
  parent or a column flex parent. The height of `block` follows the content that
  will come in, so the consumer gives it; without one, the block takes no height.
- **Line height, literal reading.** The line takes only its own
  `skeleton/line-height`; the space between lines comes from the consumer. Whether
  the line should take the whole line box of the text it replaces is an open
  question of Indiane (D1 of DSA-26), and the answer changes one declaration in the
  CSS.
- The host is `aria-hidden="true"` and has no role: the piece is decorative. The
  loading container, not the piece, carries `aria-busy` while it waits.

**Source.** Frame `nph-skeleton` (`1578:38`, set `1578:37`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 08/10/2026, with the Figma UX QA and the
textual audit approved in round 2. The names `shape`, `avatar-sm`, `avatar-md` and
`avatar-lg`, the semantics of the host and the invalid input rule are a technical
proposal of this implementation.

**Out of scope.** Any animation or pulse. A default height for `block`. A `size`
property. Setting `aria-busy` on the container. The `nph-avatar` piece itself,
which this one only holds the place of.

**Status.** Anatomy and behavior accepted by Indiane on 08/10/2026. API and
semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P70 — Package entry points and the Usage section

This decision **narrows the out of scope of P19** without changing it: publishing
stays out; the import path of a component is defined here.

**Technical conflict.** The `Docs` pages show markup but not how a consumer brings a
component into a page. `package.json` has the name `nephos`, is `private` and has no
`exports` field, and P19 leaves publishing out of scope. A Usage section with an import
line (DSA-30, D2) would name a path that does not resolve.

**Decision.**

- The package is `nephos`, the name `package.json` already has. Each component is
  imported by its tag: `import 'nephos/nph-<name>';`.
- `package.json` gets an `exports` field with the pattern `./nph-*`, pointing to a
  JavaScript build of each component in `dist/`, the build output that `.gitignore`
  already excludes. The build is not versioned.
- The import line alone registers the component with its CSS: the build carries what
  the source imports with `?inline`, so the consumer needs no Vite loader. `nph-label`,
  whose CSS is global because it has no Shadow DOM (P62.1), is the case the build has
  to solve without a second import line.
- `lit` and `@fortawesome/*` stay outside the build: they are already in
  `dependencies`, so the consumer installs them, and the Font Awesome Pro license stays
  with whoever installs it. The generated token CSS is still imported on its own, as the
  `README.md` says.
- `private` stays `true`.
- Each component `Docs` page has a **Usage** section right after **API**, the position of
  section "6. Usage" in the Figma documentation model (`1134:12862`). It shows the markup
  of the accepted frame and the import line. The page reads the package name from
  `package.json`; nobody writes it by hand.
- The visible text in the markup is an attribute, because the components have no slot
  (P62.3, P65, P66, P68).

**Reason.** A design system read by agents has to say, on the page, how the piece is
consumed. The import line has to be true on the day it is written, so the entry points
come before the section.

**Impact.** The JavaScript build, its script and the `exports` field go through a pull
request of their own, with a test that the import line of each page resolves. The model of
`docs/stories.md`, §4.10, gets the Usage section after API.

**Out of scope.** Publishing to a registry, the version policy, how a consumer obtains
the built package, and the CI workflow stay as P19 left them.

**Rite.** This decision touches the out of scope of P19, so it follows the rite of the
section "How to change one of these decisions": the technical conflict is above, the
proposal is this section, and the human review is the pull request. The text of P19 does
not change; only its out of scope gets the annotation.

**Status.** Adopted by Indiane on 15/10/2026 (DSA-30, D2). Reviewed in the pull request
that brings it; the merge is the approval.

---

## P71 — `Docs` page lists read from the Metadata

This decision **extends P63** without changing it: P63 already names Storybook as a
reader of the Metadata.

**Technical conflict.** The "use" and "do not use" lists of the `Docs` pages were
transcribed from the accepted Figma frames into `.storybook/i18n/*.json`, while the sheet
is the source of the piece (P63; P64, amendment of 06/10/2026). Four pages differ from
their sheet: `nph-badge`, `nph-button`, `nph-icon` and `nph-label` (DSA-30, D1).

**Decision.**

- A component `Docs` page reads `use_when` and `do_not_use_when` from
  `src/shared/metadata/<piece>.json`, the generated copy of the sheet.
- A test fails when the lists a page shows differ from the Metadata of its sheet.
- Figma is the source of a piece's lists only at the start. Once the sheet exists and the
  tests pass, the sheet in this repository is the source: the source of an agentic design
  system does not depend on a tool.
- Before a page moves to the Metadata, its sheet is brought level with the accepted Figma
  frame, without removing any item that Indiane accepted, and the Metadata is generated
  again.

**Reason.** Two copies of the same list drift apart, and they already did. The sheet is
the copy that agents read, so it is the one the page shows.

**Open.** The Metadata is in English only (DSA-14), and `docs/stories.md`, §4.8, asks for
every visible text in the three languages. How the `pt-BR` and `es` pages show the lists
is not decided by this note; it is a question for Indiane before the code.

**Out of scope.** The Metadata tab in Storybook, as P63 left it. Any other block of the
page.

**Status.** Adopted by Indiane on 15/10/2026 (DSA-30, D1). Reviewed in the pull request
that brings it; the merge is the approval.

---

## P72 — Accessibility gate in the tests

This decision **closes a deferral of P19**: "interaction and accessibility tests will be
defined with the first real component".

**Technical conflict.** The first real component was `nph-icon` (PR #6), and
`src/components/` now has nine. Accessibility is proved only by assertions written per
component; `package.json` has neither `axe-core` nor the Storybook accessibility addon
(DSA-30, D3).

**Decision.**

- The Storybook accessibility addon (`@storybook/addon-a11y`) runs inside the tests,
  through the Storybook Vitest integration (`@storybook/addon-vitest`), and a violation
  fails the run.
- The rule set is WCAG 2.2 AA.
- The scope is every story, `Validation` and `Docs`: the `Docs` page is also read by
  people.
- The addon panel stays available while a story is written; the panel is not the gate.
- A known exception is written in the story itself, with the reason, the discarded
  alternative and the date, as `docs/stories.md`, §2.3, records an exception. Opening an
  exception is a human decision.

**Reason.** An assertion written per component proves what its author thought of. A rule
set run on every story catches what nobody thought of, and failing the run is what makes
it a gate.

**Impact.** The two dependencies, the test configuration and the fixes of the violations
found go through a pull request of their own. The assertions written per component stay.

**Out of scope.** Interaction tests, which P19 deferred in the same sentence. The CI
workflow, as P19 left it.

**Rite.** This decision touches the out of scope of P19, so it follows the rite of the
section "How to change one of these decisions": the technical conflict is above, the
proposal is this section, and the human review is the pull request. The text of P19 does
not change; only its out of scope gets the annotation.

**Status.** Adopted by Indiane on 15/10/2026 (DSA-30, D3). Reviewed in the pull request
that brings it; the merge is the approval.

---

## P73 — `nph-togglebutton`: API and semantics

**Decision.** `nph-togglebutton` is a Web Component with **open Shadow DOM** (P01), CSS
in its own file imported `?inline`, as in `nph-icon`. It has no slot, no `::part`, no
color property and no size property. Anatomy only through semantic tokens. Invalid input
renders nothing and emits `console.error` only in development, one per cause — the rule of
P21, adopted here by its own decision, as in P66 and P68. The names follow P64.

1. **Properties.** The Figma property names are in Portuguese and the code API is in
   English (P64). The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `marcado` | `pressed`, Boolean, reflected to the attribute |
   | `invalido` | `invalid`, Boolean, reflected to the attribute |
   | `desabilitado` | `disabled`, Boolean, reflected to the attribute |
   | the label text | `text`, String |
   | `ícone início` and `ícone fim` | `icon-start` and `icon-end`, String |
   | the accessible name of the icon-only piece | `label`, String |

   `label` becomes the `aria-label` of the native button, as in P68: an `aria-label` on
   the host would not name the button inside the shadow root. `state` and `texto` are not
   properties: `state` is the interaction, and `texto` is the presence of `text`.

2. **Semantics: `aria-pressed`.** The piece is a native `<button type="button">` inside
   the shadow root, with `delegatesFocus` and `aria-pressed` following `pressed`.
   `role="switch"` and `aria-checked` are not used: the accepted board separates the piece
   from `nph-switch` and `nph-checkbox`, and says it is a button that holds a state.
   `aria-pressed` is the semantics of exactly that. The piece is not form-associated: a
   choice that goes with a submission is `nph-checkbox`, as the board says.

3. **The event `nph-change`.** The piece fires `nph-change` when the person toggles it by
   click, Enter or Space. The event bubbles, crosses the shadow root (`composed`), is not
   cancelable, and carries `detail: { pressed: boolean }` with the new value. A change of
   `pressed` made from code never fires it, so a consumer that sets the property does not
   receive its own echo. It is the **first custom event of the repository**. The native
   `click` does not say the new value without reading the element, and the prefix `nph-`
   avoids a collision with the native `change`. `nph-toggle-group` (DSA-23, planned) will
   consume it. A `click()` called on the host toggles the piece and fires the event too, as
   a click of the person does; a disabled piece neither toggles nor fires, also for
   `click()`. The event is typed in `HTMLElementEventMap`, so a consumer gets `detail`
   typed.

4. **Icons.** `icon-start` and `icon-end` take `auto` (default), `none` or a name from the
   `nph-icon` core. `auto` is the pair of the board: `xmark` when off and `check` when on.
   Both glyphs are rendered, stacked, and cross-fade by opacity, so the change is the
   motion of D6 and not a swap of nodes. `none` turns the icon off. A core name is one
   fixed icon, with no swap. The board says that the icon changes in the instance, so the
   consumer may give another one; a single property per side covers the board's boolean
   (on by default) and the consumer's icon, without four properties. The icons are
   `icon/size-sm` and `aria-hidden`.

5. **`disabled` wins over `invalid`.** The board draws `desabilitado` only with `state`
   `default` and not invalid. In runtime, `disabled` suppresses the error border: it is
   listed in the sheet as an invalid combination, and is not a `console.error` case.

6. **Icon only.** With no text, the piece shows one icon, from `icon-start`; `icon-end` is
   ignored. It requires `label`. It is **50 by 36 px**, as the board measures it from the
   variables of set `1512:719`, and it is **not square**: the rule of `nph-button`, which
   makes the icon-only box square, is not copied.

7. **Invalid input.** The piece draws nothing and emits one `console.error` per cause, only
   in development, when: there is no `text` and no `label`; `icon-start` or `icon-end` is
   not `auto`, `none` or a core name; the piece is icon only and `icon-start` is `none`.
   `icon-end` is validated even when the piece is icon only, although it is ignored in the
   drawing. An empty string is invalid; removing the attribute leaves the property `null`,
   and the piece reads `null` as `auto`. The check runs again only when `text`, `label`,
   `icon-start` or `icon-end` changes, so toggling does not repeat the same error.

8. **Motion.** The off-to-on change animates the background, the border, the icon color,
   the label color and the opacity of the icons on `motion/state-duration` and
   `motion/state-easing`, always as a pair (D6). Width, height and position never animate.
   Under `prefers-reduced-motion` the change takes `motion/hover-duration`, and the color
   still changes.

**Reduced motion and `core/duration/100`.** The evidence of D6 and `movimento_reduzido` in
`design.md` name `core/duration/100`. Rule 4 of `design.md` forbids a component from
consuming `core/*`, and the anti-pattern A57 allows only `var(--nph-motion-*)` for a
duration or a curve. `motion/hover-duration` is the semantic alias of
`core/duration/100`, with the same value, 100 ms, so the piece uses it and no token is
created or changed. It touches the anti-pattern A58 (combine duration and curve outside the motion
roles): the pair rule says each role is two tokens that never mix, and the piece uses the
duration of the `hover` role with the curve of the `state` role. The two curves have the same value, `cubic-bezier(0.4, 0, 0.2, 1)`.
**Open question of Indiane**, recorded as D7 of the task DSA-22: approve this
substitution, or create a semantic alias for it. It does not block the pull request.

**Points for review.**

- **D6 against `movimento_regras.anime_apenas`.** `design.md` lists only opacity and
  transform as animatable; D6 animates background, border and colors. The accepted
  evidence prevails, and `design.md` does not change.
- **`use` of tokens in `design.md` narrower than the accepted board.** `color/muted` (the
  track), `color/background` (the inner area), `space/inline-tight` (on four sides) and the
  focus tokens of this piece. `design.md` does not change in this pull request; widening the
  `use` is a decision of Indiane, through Claude in Figma, as P68 recorded for L-b.
- **Contrast, measured and known limits.** The component test measures the seven brands in
  light and dark. The off label is `color/muted-foreground` on `color/muted`, and `design.md`
  marks that token as not for text needed to complete the task; it measures 5.76:1 in light and
  6.61:1 in dark, so it passes 4.5:1. The outline of the pressed inner area, `color/primary-border`
  on the track, passes 3:1 in all 14 brand and scheme pairs: the lowest value is 3.31:1 in dark
  gerencial, and 4.27:1 in light educacao. The error border, `status/error` on `color/background`,
  measures 6.88:1 in light and 5.01:1 in dark. The focus border is `color/primary`, and `design.md`
  says only `focus/border` guarantees 3:1 against the halo. It does not pass 3:1 in two ways: against
  the page background, only in dark gerencial (2.71:1) and dark rh (2.88:1); against the halo, in all
  seven brands in dark (1.76:1 to 2.94:1). In light it passes, and the lowest value is 3.33:1 against
  the halo, in educacao. The piece follows the accepted board, which draws the border in
  `color/primary`; moving it to `focus/border` is a decision of Indiane, through Claude in Figma.

**Source.** Board `nph-togglebutton` (`1512:27498`, set `1512:719`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 07/10/2026, with the Figma UX QA approved on
07/10/2026 and the textual audit on 08/10/2026; the motion, answered by Indiane on
19/10/2026 (D6). The names `pressed`, `invalid`, `text`, `label`, `icon-start` and
`icon-end` and the mapping from the Figma properties, `aria-pressed`, the event
`nph-change`, the values `auto` and `none`, the cross-fade of the two icons, the rule that
`disabled` wins and the invalid input rule are a technical proposal of this implementation.

**Out of scope.** Form association and form submission. The Usage section of the page
(P70, DSA-35). The page lists read from the Metadata (P71, DSA-34). The accessibility gate
(P72, DSA-32). The brand story (DSA-36). `aria-invalid`, which is not valid on a button. A
`size` property. A slot. The pieces `nph-switch`, `nph-checkbox` and `nph-toggle-group`,
which are planned.

**Status.** Anatomy and behavior accepted by Indiane on 07/10/2026; motion answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge
is the approval.

---

## P74 — `nph-avatar`: API and semantics

**Decision.** `nph-avatar` is a Web Component with **open Shadow DOM** (P01), CSS in its
own file imported `?inline`, as in `nph-icon`. It has no slot, no `::part`, no event, no
color property and no shape property. Anatomy only through semantic tokens. Invalid input
renders nothing and emits `console.error` only in development, one per cause — the rule of
P21, adopted here by its own decision, as in P66, P68 and P73. The names follow P64.

1. **Properties.** The Figma property names are in English for `size` and in Portuguese
   for `tipo`, and the code API is in English (P64). The mapping below is a technical
   proposal of this implementation.

   | Figma | API |
   |---|---|
   | `size` | `size`, `sm` (default), `md` or `lg`, reflected to the attribute |
   | the photo of the person | `src`, String |
   | the accessible name | `label`, String |
   | `tipo`: `foto` or `sem foto` | not a property: it derives from `src` |

   `size` reflects because the internal CSS selects the box by it. `tipo` derives from
   `src`: a non-empty `src`, after trim, is `foto`; without it, the piece is `sem foto`.
   The precedent is P73, where the presence of `text` derives the Figma `texto`. The
   default is **inverted on purpose**: in Figma the default of `tipo` is `foto`, while in
   code the absence of `src` is the natural default, so `<nph-avatar>` with no attribute
   draws `sem foto`. A consumer that passes `src` gets `foto`; swapping the type of one
   avatar is adding or removing its `src`.

2. **Semantics.** Without `label`, or with a `label` of only whitespace, the host takes
   `aria-hidden="true"` and no role: the avatar is decorative, as `nph-icon` is, because the
   person's name is next to it. With a `label` that has text, the host takes `role="img"`
   and `aria-label`. The name is on the host and not on the inner image, which always has
   `alt=""`. The avatar is never focusable, has no `tabindex` and is not a button. A missing
   `label` and a missing `src` are not errors: the empty avatar that `nph-select` (DSA-29,
   D4) shows before a choice, `<nph-avatar size="sm">` with no attribute, is valid and
   silent. `nph-avatar-stack` (DSA-25) reads the group's names itself and passes no `label`
   to its avatars.

3. **Photo lifecycle.** The person icon (`nph-icon` `user`, style `light`, at the
   `icon/size-*` of the same size, D1 and D2) shows while the photo loads and stays if the
   photo fails; the photo takes its place on `load` (D3). The `<img>` is rendered only for a
   non-empty `src` after trim, and a new `src` starts the wait again. The piece emits no
   event, for the load or for the failure, and no error: a photo that does not load is not a
   failure of the avatar.

4. **Border.** The border (`border/width` in `color/border`, D4) is drawn by the avatar's
   own `::after`, inside the frame and over the photo, with the corner of the frame
   (`border-radius: inherit`) and `pointer-events: none`. The paint order is structural:
   `:host::after` paints after the shadow content, so it comes above the `<img>`. The test
   reads the computed style of the pseudo-element and does not read pixels. It is the
   separation that `nph-avatar-stack` (DSA-25) uses between overlapped avatars: the stack
   draws no ring. There is no property for it.

5. **Host box.** The host is exactly the avatar size, `avatar/size-sm`, `-md` or `-lg`
   (24, 32 and 40 px), with `box-sizing: border-box`, `display: inline-flex`, `flex: none`
   and `vertical-align: middle`, and it clips its content. It adds no height or width, so a
   consumer can count on it: the 40 px option row with an avatar in DSA-29 D9 and the
   overlap of `nph-avatar-stack` depend on a box of exactly 24, 32 or 40.

6. **Absences.** No slot, no `::part`, no event, no initials, no `shape` property and no
   form association. The Figma frame has no initials: the fallback is only the photo and the
   person icon. The count of a group ("+N") is a piece of `nph-avatar-stack` made with the
   tokens of the avatar; the avatar has no counting mode.

7. **Invalid input.** An invalid `size` renders nothing, takes no space, leaves
   `data-nph-rendered` out and emits one `console.error` per cause, only in development. A
   valid value set afterwards makes the piece draw. No `src` and no `label` is valid and emits
   nothing.

**Source.** Frame `nph-avatar` (`1434:30`, set `1434:29`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 06/10/2026, with the Figma UX QA and the textual
audit approved; D1 to D4 answered on 19/10/2026. The names `src` and `label`, the derivation
of `tipo` from `src`, the semantics of the host, the lifecycle of the photo and the invalid
input rule are a technical proposal of this implementation.

**Out of scope.** `nph-avatar-stack` (DSA-25) and `nph-select` (DSA-29), which are planned.
Initials. A circle or any other shape. Widening the `use` text in `design.md` for the tokens
the avatar consumes (`color/muted`, `color/muted-foreground`, `color/border`, `icon/size-*`
and `avatar/radius-*`, which `nph-skeleton` also consumes): it is the pending decision D5 of
DSA-24, with Indiane, and the component keeps consuming them either way. The Usage section of
the page (P70, DSA-35), the page lists read from the Metadata (P71, DSA-34) and the
accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 06/10/2026; D1 to D4 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge
is the approval.

---

## How to change one of these decisions

Do not change, replace or reopen P01, P02, P03, P17, P19, P20, P21, P62, P63, P64, P65, P66, P67, P68, P69, P70, P71, P72, P73 or P74 without:

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
| [`../fichas/<name>.md`](../fichas/) | How the decision reaches the component: contract, variants, states and tokens |
