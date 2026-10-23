# Technical decisions — Nephos

This is the **single source** of the technical decisions P01, P02, P03, P17, P19, P20,
P21, P62, P63, P64, P65, P66, P67, P68, P69, P70, P71, P72, P73, P74, P75, P76, P77, P78 and P80. If this file and any other document in the
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
| **P62.6** | `info` and `infoLabel` in `nph-label`: the information trigger | 06/10/2026 | Medium. `nph-field` will assemble the label with the trigger; changing the API later requires redoing both | Anatomy and behavior: L8 to L11, adopted by Indiane on 08/09/2026 and 01/10/2026. API and semantics approved by `maurocsjr` in PR #58, merged in `455ead8`. **Amended by P77 (21/10/2026)**: how the balloon opens, closes and sits |
| **P01** | Open Shadow DOM | 24/08/2026 | High. Every component depends on it | Approved, 28/08/2026 |
| **P02** | Custom properties as public API | 24/08/2026 | High | Approved, 28/08/2026 |
| **P03** | Directory pattern and TypeScript | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P17** | Role of each source of truth | 24/08/2026 | High | Approved, 28/08/2026 |
| **P19** | Storybook, tests and publishing | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P20** | Style Dictionary v5 and theme contract | 24/08/2026 | High | Approved, 28/08/2026 |
| **P21** | Technical plan of `nph-icon` | 26/08/2026 | Already implemented and merged under risk acceptance | Approved, 28/08/2026. Light amendment: under review in the pull request that brings it. |
| **P63** | Metadata generated from the spec | 28/09/2026 | Medium. Changing location or format later requires generating again and adjusting whoever reads it; the spec does not change | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** |
| **P64** | Code language | 28/09/2026 | Medium. Applies to all new code; migrating what exists only swaps names | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** Amendment of 02/10/2026 approved by Mauro in PR #49, merged on 05/10/2026. Amendment of 06/10/2026 adopted by Indiane: the language part approved by Mauro in PR #59, merged in `addb034`, and the Storybook naming item in PR #56, merged in `455ead8`. Amendment of 15/10/2026 (American English) adopted by Indiane, reviewed in the pull request that brings it. |
| **P65** | API and semantics of `nph-tooltip` | 05/10/2026 | Low now. `nph-label` is the first consumer; changing later requires redoing its trigger | Behavior and scope (L11.5) and anatomy (L11.6, L11.7 and the accepted frame) adopted by Indiane on 01/10/2026. API and semantics approved by `maurocsjr` in PR #51, merged on 05/10/2026. **Amended by P77 (21/10/2026)**: opening, closing, placement and semantics |
| **P66** | API and semantics of `nph-spinner`, `nph-separator` and `nph-kbd` | 05/10/2026 | Low now. `nph-button` (Batch B) and `nph-rich-option` will be the first consumers | Anatomy and behavior: frames accepted by Indiane on 01/10/2026. API and semantics approved by `maurocsjr` in PR #54, merged in `d01da7b` |
| **P67** | Dependent invariants redeclared in each scheme root | 05/10/2026 | Medium. Changes where the generator emits 14 tokens and fixes how a part of the screen switches brand | Consumption decided by Indiane on 05/10/2026. Generator approved by `maurocsjr` in PR #55, merged in `7dd370d` |
| **P68** | API and semantics of `nph-badge` and `nph-button` | 05/10/2026 | Low now. No piece consumes either of them yet | Anatomy and behavior: frames accepted by Indiane on 01/10/2026, completed on 02/10/2026. API and semantics approved by `maurocsjr` in PR #56, merged in `455ead8` |
| **P69** | API and semantics of `nph-skeleton` | 15/10/2026 | Low now. No piece consumes it yet; `nph-avatar` will share its avatar sizes and radii | Anatomy and behavior: frame accepted by Indiane on 08/10/2026. API and semantics reviewed in the pull request that brings them |
| **P70** | Package entry points and the Usage section | 15/10/2026 | Medium. Every `Docs` page shows the import line, so changing the path later changes every page and every consumer | Adopted by Indiane on 15/10/2026 (DSA-30, D2). Reviewed in the pull request that brings it |
| **P71** | `Docs` page lists read from the Metadata | 15/10/2026 | Low. The lists move from the dictionary to the Metadata; the sheet does not change its format | Adopted by Indiane on 15/10/2026 (DSA-30, D1). Reviewed in the pull request that brings it |
| **P72** | Accessibility gate in the tests | 15/10/2026 | Medium. Two new dependencies and a gate on every story; the earlier, the fewer violations to fix | Adopted by Indiane on 15/10/2026 (DSA-30, D3). Reviewed in the pull request that brings it |
| **P73** | API and semantics of `nph-togglebutton` | 19/10/2026 | Low now. Only `nph-toggle-group` (DSA-23, PR #92) consumes it, and it consumes its event, so changing the event name or the state name later requires redoing both | Anatomy and behavior: board accepted by Indiane on 07/10/2026, motion answered on 19/10/2026 (D6). API and semantics reviewed in the pull request that brings them |
| **P74** | API and semantics of `nph-avatar` | 20/10/2026 | Low now. No piece consumes it yet; `nph-select` (DSA-29) and `nph-avatar-stack` (DSA-25) will, so changing `src`, `label` or `size`, or the border over the photo, later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 06/10/2026, D1 to D4 answered on 19/10/2026. API and semantics reviewed in the pull request that brings them |
| **P75** | Package `@iatec/nephos`: first release candidate | 19/10/2026 | High and public. The name, the `exports` paths and the `rc` tag are what every consumer writes in a lockfile and in an import line | Approved by Elvys on 19/10/2026. Amends P70, adopted by Indiane on 15/10/2026: her confirmation is requested in the pull request that brings it |
| **P76** | API and semantics of `nph-toggle-group` | 20/10/2026 | Low now. No piece consumes it yet; a toolbar will, so changing `label`, `selection`, `value` or the event `nph-value-change`, or the `value` attribute each button carries, later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 08/10/2026, D1 to D3 answered on 19/10/2026. API and semantics reviewed in the pull request that brings them |
| **P77** | `nph-tooltip`: any element, opened on hover and on keyboard focus (amends P65 and P62.6) | 21/10/2026 | Medium. `nph-button` (DSA-43) and the value balloon of the slider (DSA-39) will attach the balloon with `for`, so changing `for`, `side` or the rule of opening later requires redoing both | Anatomy and behavior: board accepted by Indiane on 20/10/2026, D1 answered on 20/10/2026; the plan is approved by Elvys on 21/10/2026. API and semantics approved by Elvys's merge of PR #94 (`3835337`). **Amended on 22/10/2026 (DSA-48)**: hover delay, keyboard, only focusable elements and `relation`; rules accepted by Indiane on 22/10/2026, the plan approved by Elvys the same day, API and semantics reviewed in the pull request that brings them |
| **P78** | API and semantics of `nph-avatar-stack` | 22/10/2026 | Low now. No piece consumes it yet; a list of people, a card or a table row will, so changing `count`, `label` or the slot of `nph-avatar` children later requires redoing them | Anatomy and behavior: frame accepted by Indiane on 08/10/2026, D1 to D3 answered on 19/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P80** | API and semantics of `nph-input`, the reference of the form controls | 22/10/2026 | Medium. `nph-field` (DSA-28), `nph-checkbox`, `nph-radio` and `nph-input-otp` copy its form association, its native events and its name by reference, so changing them later requires redoing those pieces | Anatomy and behavior: frame accepted by Indiane on 01/10/2026, D1 to D7 answered on 16/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |

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

**Amended by P75 (19/10/2026).** P75 publishes release candidates of the package to a
private feed. Public publishing, GitHub Pages and the CI workflow stay out of scope.

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

*Amended by P77 (21/10/2026): the balloon opens on hover and on keyboard focus, above the label, with no click toggle, and the trigger is described by the tooltip instead of controlling it. The paragraphs this changes are marked below; the text is kept as it was written.*

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
  `nph-tooltip`, unique per instance. *(Superseded by P77: no `aria-expanded` and no `aria-controls`; the `id` is the one of the trigger, and the tooltip describes it with `aria-describedby`.)* The icon is `circle-info` `solid` `sm`,
  decorative. The `nph-tooltip` exists from mount, closed, because the
  `role="status"` region must exist before opening (P65). The open state is
  internal and is not API. *(Superseded by P77: the host of the tooltip is a `role="tooltip"` and the open state belongs to the tooltip.)*
- **Open and close.** *(Superseded by P77: the balloon opens on hover and on keyboard focus and closes with Esc, when the pointer leaves or on blur; a click does nothing, and touch never opens it. The `nph-tooltip` does all of it; the label keeps no listener.)* Click, Enter or Space toggle, through the native behavior
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
  form, as the `use` of `color/tooltip` asks ("does not block the page"). *(Superseded by P77: above the label by default, centered on the information icon, placed by the `nph-tooltip` in the top layer, flipping when it does not fit.)*
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
- **L-c — no `z-index`.** *(Resolved by P77: the balloon is in the top layer and flips when it does not fit.)* There is no layer token. A positioned sibling that
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

*Amended by P77 (21/10/2026): the tooltip opens and closes by itself, on hover and on keyboard focus, on any element; it is a `role="tooltip"`; it places itself. The paragraphs this changes are marked below; the text is kept as it was written. `text`, the anatomy and the rule of the text stay.*

**Decision.**

- `nph-tooltip` is a Web Component with **open Shadow DOM** (P01). The CSS
  lives in `nph-tooltip.css`, imported `?inline`, as in `nph-icon`.
- **Public API: two properties.**

  | Property | Role |
  |---|---|
  | `text` | String, default empty. The bubble text, already localized by the consuming application. Empty or only spaces: nothing is shown |
  | `open` | Boolean, default `false`, reflected to the attribute. Shows the bubble |

- **No slot, no event, no positioning and no trigger of its own.** *(Superseded by P77: it finds its element by `for`, opens, closes and places itself; `open` stays as the state.)* Whoever
  opens, closes and positions it is the consumer. The first is the `info` trigger of
  `nph-label`, which opens on click, Enter or Space and closes with Esc or a click
  outside; the bubble does not open on hover.
- **Toggletip semantics.** *(Superseded by P77: the host is a `role="tooltip"`.)* The host is a `role="status"` live region from
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

**Amended by P75 (19/10/2026).** The package name is `@iatec/nephos` (the import line is
`import '@iatec/nephos/nph-<name>';`), `private` is removed, and `lit` and `@fortawesome/*`
are peer dependencies. The text above is kept as it was written.

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
   avoids a collision with the native `change`. `nph-toggle-group` (DSA-23, PR #92)
   consumes it. A `click()` called on the host toggles the piece and fires the event too, as
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
`size` property. A slot. The pieces `nph-switch` and `nph-checkbox`,
which are planned.

**Status.** Anatomy and behavior accepted by Indiane on 07/10/2026; motion answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge
is the approval.

---

## P75 — Package `@iatec/nephos`: first release candidate

This decision **amends P19 and P70**. P19 left public publishing and the CI workflow out
of scope, and P70 fixed the package name as `nephos`, kept `private` as `true` and left
publishing to a registry, the version policy and how a consumer obtains the package out of
scope. The scope of P19 on public publishing stays as it was: the feed below is private.

**Technical conflict.** The products that will consume Nephos (Angular, Vue, React and
Blazor applications) need to install it, and nothing in the repository lets them: the name is
not scoped, the package is private, `lit` and Font Awesome Pro are `dependencies` that a
consumer cannot pin, and there is no build, no types and no manifest. P70 promised the entry
points and a test that the import line resolves; this decision delivers both and the
publication around them.

**Decision.**

1. **Name, visibility and version.** The package is `@iatec/nephos`. `private` is removed.
   The version is `5.0.0-rc.1`.
2. **Where and under which tag.** Release candidates are published to the Azure DevOps
   Artifacts feed `IATec.Community`
   (`https://sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/`), by an
   Azure Pipeline that is a separate pull request. `publishConfig` carries the registry and the
   npm dist-tag `rc`: a release candidate never takes `latest`. Azure Artifacts versions are
   immutable, so each publish bumps the counter (`rc.2`, `rc.3`, ...); a published version is
   never replaced.
3. **Scope of `rc.1`: the 10 components that exist on `v/5.0.0`**: `nph-badge`,
   `nph-button`, `nph-icon`, `nph-kbd`, `nph-label`, `nph-separator`, `nph-skeleton`,
   `nph-spinner`, `nph-togglebutton` and `nph-tooltip`. A component that is added later enters
   by adding its folder: the build and the `exports` pattern take it without a change.
4. **Custom elements only.** There is no React, Vue, Angular or Blazor wrapper: `AGENTS.md`
   forbids framework authoring, and a custom element is consumed by all four. The package
   ships `.d.ts` declarations, with each tag in `HTMLElementTagNameMap`, and a Custom
   Elements Manifest, `custom-elements.json`, written by `@custom-elements-manifest/analyzer`
   with its Lit plugin. The consumption guide per framework is `docs/consuming.md`.
5. **Peers.** `lit` (`^3.3.3`) and `@fortawesome/pro-light-svg-icons` and
   `@fortawesome/pro-solid-svg-icons` (`^6.7.2`) are `peerDependencies`. They stay in
   `devDependencies` at the versions the repository uses, so Storybook and the tests run as
   before. The Font Awesome Pro license stays with whoever installs it (P70): **every
   consumer, and every CI that installs the package, needs a Font Awesome Pro npm token.**
6. **Public entry points (`exports`).** `./nph-*` (one per component, `types` and `import`),
   `./tokens.css`, `./scrollbar.css`, `./custom-elements.json` and `./package.json`.
   `scrollbar.css` is public because `docs/tokens.md` already tells whoever consumes the
   tokens to load it right after them. The generated token CSS is copied to `dist/` as it
   is: no token is created or changed by the build.
7. **Layout of `dist/`.** `dist/<tag>/<tag>.js` and `dist/<tag>/<tag>.d.ts`, one ES module
   per component and ESM only; code that several components share and is not a component goes
   to `dist/shared/`, so no component is defined twice. `dist/tokens.css`,
   `dist/scrollbar.css` and `dist/custom-elements.json` complete it. `lit` and
   `@fortawesome/*` are external. The `?inline` CSS is a string inside the module (P70).
8. **The global CSS of `nph-label`.** `nph-label` has no Shadow DOM (P62.1), so its CSS is a
   plain `import './nph-label.css'`. The library build turns that import into a module that
   adopts the stylesheet once on the document, with `document.adoptedStyleSheets`, and falls
   back to a `<style>` element where constructable stylesheets do not exist. One line,
   `import '@iatec/nephos/nph-label'`, is enough in Vite, in the Angular CLI and in a bundle
   served to Blazor. `adoptedStyleSheets` was chosen over a `<style>` element because it is not
   blocked by a `style-src` Content Security Policy without `unsafe-inline`. The rule is
   document-wide: a `nph-label` inside the shadow root of another component is not reached.
   `import.meta.env` is replaced by the build, so a consumer without Vite does not break.
9. **`sideEffects` is `true`.** Importing a component registers it, and importing
   `tokens.css` loads it: both are side effects. The value is written down, and not left as
   the default, because a list that covers only `dist/` makes the bundler of this repository
   (Storybook included) drop `import '../nph-icon/nph-icon'` and ship components that never
   register.
10. **The proof.** `npm run build:lib` writes `dist/`; `npm run test:package` checks that
    every component folder resolves through `exports` in JavaScript and in declarations, has
    its tag in `HTMLElementTagNameMap` and in the manifest, that every import line the
    documentation shows resolves, that importing a component registers every component it
    renders, and that `dist/` carries no story, test, local path or `import.meta.env`;
    `npm run pack:check` runs `publint` and `@arethetypeswrong/cli` on the packed tarball.
    This is the check P70 promised for the import line of each page.
11. **Files this decision adds** outside the paths P03 lists: `vite.config.lib.ts`,
    `tsconfig.build.json`, `custom-elements-manifest.config.mjs`, `scripts/build-lib.mjs`
    and `scripts/test-package.mjs`; three development dependencies, `publint`,
    `@arethetypeswrong/cli` and `@custom-elements-manifest/analyzer`.

**Reason.** A design system consumed by products has to be installable, typed and
described. Custom elements keep the one implementation that AGENTS.md allows, and a private
feed with a release-candidate tag lets the products try it without a version that promises
stability.

**Known limit.** Font Awesome publishes each icon as a CommonJS file (`faBars.js`), and
`nph-icon` imports one file per approved icon and style. A browser cannot load those through an import map.
A consumer without a bundler step, as in Blazor, bundles `@iatec/nephos` into one file first.
Inlining the icon data in the package would remove the step, and would also put Font Awesome
Pro artwork in a package, which P70 did not allow; that is a decision for a later release.

**Out of scope.** The Azure Pipeline that builds and publishes (a separate pull request). A
release that takes the `latest` tag, and any public registry. Framework wrappers. The
Usage section of each `Docs` page (P70, DSA-35), which this decision unblocks. A root entry
point (`import '@iatec/nephos'`) that registers everything.

**Status.** Approved by Elvys on 19/10/2026. It amends P70, which Indiane adopted on
15/10/2026: her confirmation is requested in the review of the pull request that brings
this decision. Reviewed in that pull request; the merge is the approval.

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

## P76 — `nph-toggle-group`: API and semantics

**Decision.** `nph-toggle-group` is a Web Component with **open Shadow DOM** (P01), CSS in
its own file imported `?inline`, as in `nph-icon`. Its shadow root holds only the default
slot, and the host is the row. It has no `::part`, no color property, no size property and no
form association. Anatomy only through semantic tokens: the group consumes one,
`space/inline`. Invalid input renders nothing and emits `console.error` only in development,
one per cause — the rule of P21, adopted here by its own decision, as in P66, P68, P73 and
P74. The names follow P64.

1. **Properties.** The Figma frame has two properties, `texto` and `mostrar 3º`, and leaves
   single and multiple selection to code. The mapping below is a technical proposal of this
   implementation.

   | Figma | API |
   |---|---|
   | the name of the group (`aria-label`) | `label`, String |
   | single or multiple selection, "behavior, resolved in code" | `selection`, `single` (default) or `multiple` |
   | the value the group receives (D3) | `value`, a list of strings; the attribute is words separated by spaces |
   | `texto` | not a property: it is the presence of `text` on each button (P73) |
   | `mostrar 3º` | not a property: three is only the limit of the Figma set (D2) |
   | `marcado`, `state`, `desabilitado`, `invalido` | not properties of the group: they stay on each `nph-togglebutton` |

2. **The default slot and the `value` attribute.** The group takes `nph-togglebutton`
   children. Each child names itself with a `value` **attribute**, which the group reads with
   `getAttribute('value')`, trimmed: a non-empty word with no whitespace, unique in the group.
   `nph-togglebutton` does not declare it: it ignores the attribute, it has no `value`
   property and no type for it, and **P73 is not amended**. The cost is a contract that lives
   in the group and not in the button; the gain is that a component already merged stays as
   it is. A child that is not an `nph-togglebutton`, or a button without `value`, is not part
   of the selection, and neither is a button whose `value` has whitespace inside
   (`"bold italic"`): the attribute of the group reads words separated by spaces, so a value of
   two words would be emitted as one item and lost when the list is written back with
   `join(' ')`. Such a button is treated as one with an empty or repeated value: not
   selectable, with a warning in development.

3. **`value` and the source of truth.** The group is the source of truth of the selection:
   in `willUpdate` and when the slot changes, it writes `pressed` on every child from `value`,
   so a `pressed` attribute in the markup of a child does not survive. With no value, none is
   checked (D3). Single selection holds zero or one item, and a second one is dropped with a
   warning. Setting `value` from code moves the checks and never fires the event. Changing
   only the `value` attribute of a direct child raises no `slotchange`, so the group also
   observes that attribute (a `MutationObserver` on the host, filtered to the direct buttons,
   connected and disconnected with the element); on a change it writes `pressed` again and
   checks the composition, and it never fires the event.

4. **Single selection (D3).** Checking a button unchecks the others, and one button stays
   checked once a choice is made. A click on the checked button does nothing: the group
   listens to `click` in the **capture** phase and stops it before it reaches the button, so
   the button does not toggle, does not flicker, `nph-change` does not fire and no group
   event fires. Enter and Space on the native button produce the same `click`, and `click()`
   on the button host too. Cost: that click does not reach a listener of the consumer, as the
   click on a disabled `nph-togglebutton` does not, in P73. A disabled button is left to its
   own rule. Multiple selection has no such block: each button toggles on its own.

5. **The event `nph-value-change`.** When the person changes the selection, the group fires
   `nph-value-change`, with `bubbles`, `composed` and no `cancelable`, and `detail: { value }`,
   the list of checked values in the order of the buttons. The name is different from
   `nph-change` because `HTMLElementEventMap['nph-change']` is already typed with `{ pressed }`
   by `nph-togglebutton`, and one name cannot carry two types; the group also does not stop the
   `nph-change` of each button, so an ancestor still hears both. A change of `value` from code
   never fires it.

6. **Semantics.** The host is `role="group"`, set in `willUpdate` as `nph-icon` and
   `nph-avatar` do, and its name is `label`, which becomes its `aria-label`. A name the consumer
   puts on the host with `aria-label` or `aria-labelledby` also counts; the second works only on
   the host, because an id reference does not cross a shadow root. The buttons stay buttons with
   `aria-pressed`. In single selection the group is **not** a `radiogroup`: P73 fixes
   `aria-pressed` and rejects `aria-checked`, and the accepted frame separates the piece from the
   controls that choose. **Known limit:** the screen reader reads the state of each button and
   does not announce that the choice is exclusive.

7. **Keyboard.** One Tab stop per button, in order, with no arrow keys and no roving tabindex.
   A disabled button leaves the order. The accepted frame says each button shows its own focus
   and that the group does not receive focus, and it asks for no arrow keys; a roving tabindex
   across several groups is the work of a toolbar (WAI-ARIA Authoring Practices, Toolbar). The
   group has no `tabindex` and no `delegatesFocus`. D5 of the task asks Indiane to confirm.

8. **Box.** `display: inline-flex` with `gap` `space/inline` (8 px), `align-items: stretch`,
   no wrap, no background, border, outline, opacity or transition. The height comes from each
   button, `control/height-default`. `space/inline` is wider than the border and the halo of
   one button (`2 × border/width + focus/ring-width`), so a focused button is not covered by
   its neighbor.

9. **Invalid input and composition.** Two causes render nothing, take no space, leave
   `data-nph-rendered` out and emit one `console.error` each, only in development: a
   `selection` that is not `single` or `multiple`, and no name (no `label`, no `aria-label` and
   no `aria-labelledby`). Problems in the composition render the group anyway and emit one
   `console.warn` each, only in development, and the same problem is not repeated while it
   lasts: fewer than two buttons (D2, there is no maximum), a child that is not an
   `nph-togglebutton`, a button without `value`, a button whose `value` has more than one
   word, a repeated `value`, a value that matches no button, buttons with text mixed with
   icon-only buttons (D4), and more than one value in single selection.

10. **Icons (D1).** The Alignment and Formatting examples need `align-left`, `align-center`,
    `align-right`, `bold`, `italic` and `underline`. They enter the block `icones_nucleo` of
    `design.md`, category `acao`, and the closed map of `nph-icon`, in `light` and `solid`,
    Font Awesome Pro 6.7.2. The task does it; no token is created or changed.

11. **The package (P75).** `nph-toggle-group` is the first tag with two parts after the
    prefix. P75 says a component added later enters by adding its folder, but three checks
    of the package assumed one part, `nph-[a-z]+`: the filter of the Custom Elements Manifest in
    `custom-elements-manifest.config.mjs`, and the two expressions of `scripts/test-package.mjs`
    that read the tag and the imports of a component. They now take
    `nph-[a-z]+(?:-[a-z]+)*`, so the promise of P75 holds; without it `npm run test:package`
    fails for the group (the tag is not in the manifest, and its bare import is not found).
    No other line of those files changes.

**Divergence between sources, resolved.** The Description of the accepted frame says each
button holds its own state and the group only gathers and spaces the buttons. D3, answered
later and repeated in the task, says the group coordinates single selection and each button
no longer holds that choice alone. The code follows D3.

**Points for review.**

- **Reading `value` from an attribute** and not adding a property to `nph-togglebutton`, with
  the cost above.
- **The first slot of the repository.** The other pieces have none.
- **The name `nph-value-change`**, and not `nph-change` with a union type.
- **`role="group"` on the host**, and the known limit of single selection.
- **The click blocked in capture** on the checked button, which hides that click from the
  consumer.
- **Use and do-not-use lists.** "For a single option, use `nph-togglebutton`, without a
  group" is listed under "When to use" in the accepted frame; the sheet and the page put it in
  "When not to use", where a redirection reads as what it is.
- **Pending decisions D4 and D5**, with Indiane: what the group does when text and icon only
  are mixed, and arrow keys. The code follows the defaults above meanwhile.

**Source.** Frame `nph-toggle-group` (`1580:61`, set `1580:60`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 08/10/2026, with the Figma UX QA and the textual
audit approved; D1 to D3 answered on 19/10/2026. The names `label`, `selection` and `value`, the
`value` attribute of each button, the event `nph-value-change`, the semantics of the host, the
capture rule for the click and the invalid input and composition rules are a technical proposal
of this implementation.

**Out of scope.** A toolbar and the roving tabindex across groups. `nph-switch` and
`nph-checkbox`, which are planned. A `size`, `disabled` or `invalid` property on the group, a
maximum, an orientation, a form association and a color property. Moving `value` into
`nph-togglebutton`. The Usage section of the page (P70, DSA-35), the page lists read from the
Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 08/10/2026; D1 to D3 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge
is the approval.

---

## P77 — `nph-tooltip`: any element, opened on hover and on keyboard focus

This decision **amends P65 and P62.6**. P65 fixed a balloon that only the `info` trigger of
`nph-label` used, that the consumer opened, closed and positioned, and that was a `role="status"`
live region; P62.6 fixed that trigger as a button that toggled the balloon by click, below the
label. Indiane redefined the piece on 19/10/2026 and accepted the new board on 20/10/2026
(DSA-42). The text of P65 and P62.6 is kept as it was written; the paragraphs this decision
replaces carry a "Superseded by P77" mark.

**Technical conflict.** The new contract (a balloon for **any** element, opened by the pointer
and by the keyboard focus, closed by the pointer leaving, by blur and by Esc, flipping when it
does not fit) cannot be met with a component that the consumer opens and positions, nor with a
live region that announces on activation. The board also leaves open how another element
attaches the balloon in code ("is defined in the spec"), which DSA-39 (the value balloon of the
slider) and DSA-43 (the icon-only button) both wait for.

**Decision.**

1. **API: four properties, no event, no slot, no `::part`.** *(Superseded by the amendment of 22/10/2026, DSA-48: a fifth property, `relation`, says whether the balloon describes or names the element.)*

   | Property | Role |
   |---|---|
   | `text` | String, empty by default. The balloon content, already localized. Unchanged from P65 |
   | `for` | String, reflected. The `id` of the element that opens the balloon, looked up in the **same root** as the tooltip |
   | `side` | `top` (default), `bottom`, `left` or `right`. The **preferred** side |
   | `open` | Boolean, reflected, `false` by default. The state. The tooltip turns it on and off; the consumer may turn it on to show the balloon open, and the closing rules still hold |

   **Why `side` is code API and not a Figma property.** The task says the Figma component gets no
   side property and that the code "implements the placement as behavior" (`DSA-42.md`,
   decision D1). The balloon has no arrow, so it looks the same on any side, and a Figma variant
   would draw nothing different. That is what "behavior" means there: the side is not a variant.
   It does not say the code has no way to ask for one, and the board requires the four sides
   ("top, bottom, left and right"). Without `side`, `left` and `right` could never be reached,
   because a flip only goes to the opposite side. So `side` is a preferred side, with the flip as
   behavior. If a reading of D1 as "no side API at all" prevails, the fallback is automatic
   placement only (top, then bottom, then the side with more room).
2. **How an element attaches the balloon: `for`.** The tooltip is a sibling of the element, in the
   same root, and `for` is the `id` of the element (`<nph-tooltip for="delete" text="Delete">`),
   like the native `<label for>`. The lookup uses `getRootNode()`, never `document`: inside the
   shadow root of another component, the element is looked up there. A component that needs the
   balloon on an element inside its own shadow root renders its own `nph-tooltip` next to it, with
   `for` pointing at the internal `id`; that is how `nph-label` does it (it has no shadow root, so
   the root is the document or the shadow root that contains the label), and how DSA-39 and DSA-43
   are to do it. Wrapping the element in a slot was refused: it breaks flex layouts and the
   `nph-toggle-group` slot, and a reference from a slotted element to text in the shadow root of
   the wrapper does not exist in ARIA. An attribute on the element (`tooltip="..."`) was refused:
   every component would reimplement it, and the board says "any element".
3. **Opening.** *(Superseded by the amendment of 22/10/2026, DSA-48: the pointer waits `motion/hover-delay`, focus does not; only an element that receives focus opens it; Enter and Space do not bring the focus hold back.)* On hover, only with a mouse or a pen, and on keyboard focus, with no delay. Focus
   opens it only when the element that has the focus matches `:focus-visible` and the last pointer
   action on the element was not a touch (a tap that focuses a button, or a field, does not open
   it; the next key press makes the keyboard count again). Touch never opens it: without hover,
   essential information never lives only in the balloon. A click, Enter or Space on the element
   does nothing to the balloon.
4. **Closing.** The balloon has two independent holds: the pointer (over the element or over the
   balloon) and the focus (visible focus on the element). It is open while either holds and closes
   when both are gone. Esc, listened to on the document in the capture phase and only while open,
   closes it, drops both holds and stops the key (`stopPropagation` and `preventDefault`), so the
   dialog around does not close with it; it stays closed until the pointer and the focus have both
   left once. With the balloon closed, Esc is not intercepted. There is no hover delay token, and
   the board asks for none to open. *(Superseded by the amendment of 22/10/2026, DSA-48: the token `motion/hover-delay` exists and the pointer waits it.)* The distance between the element and the balloon is
   `space/inline`, so the pointer leaves the element before it reaches the balloon: the exit
   transition is the window. Coming back into the element or the balloon during the exit cancels
   the closing (WCAG 1.4.13, the balloon stays open while the pointer is over it).
5. **Placement and layer.** The balloon is a `popover="manual"` in the top layer: it needs no
   `z-index`, which resolves the limit L-c of P62.6, and no ancestor with `overflow` clips it.
   JavaScript measures the element and the balloon and places it: top by default, the opposite side
   when the preferred one does not fit, the side with the most room when neither does, centered on
   the element on the cross axis and never outside the window. It places again on scroll and on
   resize while open, and while the element is outside the window the balloon is not drawn: it
   returns with the element, instead of staying stuck to the edge of the window. CSS anchor positioning is not used: its support is uneven and it does not
   cross shadow roots. No library is added. The distance is `space/inline`, which is wider than the
   outer reach of a focus drawing (`border/width` plus `focus/ring-width`), so the balloon never
   covers the focus of the element.
6. **Motion.** It enters on `motion/enter-duration` with `motion/enter-easing` and leaves on
   `motion/exit-duration` with `motion/exit-easing` (the board names the durations; `design.md` makes
   the pair one role). Only opacity moves. The balloon leaves the top layer when the exit ends. With
   reduced motion, the duration is that of `motion/hover-duration`, the semantic alias of
   `core/duration/100`, as in `nph-togglebutton`; the curve stays and the balloon still appears and
   still leaves.
7. **Semantics.** *(Superseded by the amendment of 22/10/2026, DSA-48: with `relation="name"` the `id` goes to the `aria-labelledby` of the element instead, and the reference follows a change of the tooltip `id`.)* The host is a `role="tooltip"` from mount, open or closed (WAI-ARIA 1.2; APG
   Tooltip pattern), with an `id` (generated when the consumer gives none). The tooltip adds that
   `id` to the `aria-describedby` of the element, keeping what is there, and removes only its own on
   disconnect or when `for` changes. The balloon never takes focus and has no focusable child. The
   `role="status"` live region of P65 is gone: the description is read when the element receives
   focus. **Finding recorded:** Chromium computes the description of the element from the text
   inside the shadow root of the referenced host only while the balloon is shown (`display: none`
   contributes no text), so the host also carries `aria-label` with the same text, which the browser
   reads in both states. The proof is the description the browser itself computes, read through the
   accessibility tree, in the tests.
8. **`nph-label`.** The label keeps its API (`text`, `required`, `for`, `info`, `infoLabel`) and its
   button, 24 by 24, focus drawing and tokens. It gives the button an `id`, drops `aria-expanded`,
   `aria-controls`, the open state and every listener, and renders
   `<nph-tooltip for="<button id>" text="<info>">`. The balloon opens on hover and on focus of the
   icon, above the label by default. A click on the icon does nothing. Its CSS loses the position
   of the balloon and the `position: relative` of the root.
9. **Anatomy and the rule of the text** stay as in P65: `color/tooltip`, `text/body-sm` in
   `color/tooltip-foreground`, `radius/inner`, `space/inline-tight` vertically and `space/inline`
   horizontally, `elevation/dropdown`, up to `layout/max-tooltip-width` and
   `layout/max-tooltip-height`, no border and no arrow, text that fits whole in up to two lines. The
   Figma component binds `border/width` but draws no stroke; no border is drawn.
10. **Invalid input** follows P21 and P76: `for` empty or matching no element in the same root (after
    one more frame, so an element rendered right after the tooltip is found) and a `side` that is not
    one of the four draw nothing and emit `console.error` only in development, one per cause.

**Breaking changes, and the release candidate.** `@iatec/nephos` is published as `5.0.0-rc.N`, and
`docs/consuming.md` says that the API can still change between release candidates (P75). So the
change is made without a compatibility layer and without touching `package.json`; the counter is the
pipeline's. What a consumer of `rc.1` must know:

- `nph-label` keeps its markup and API; its balloon now opens on hover and on keyboard focus, above
  the label, a click does not toggle it, and touch never opens it.
- A bare `<nph-tooltip open text="...">` draws nothing: it needs `for`.
- The host of `nph-tooltip` is a `role="tooltip"` and takes no room in the flow (it was a
  `role="status"` inline block). No CSS that positioned it holds.
- `open` is still a reflected boolean, but the tooltip now sets it.

**Reason.** A tooltip that every consumer opens by hand would be reimplemented in each component that
needs one; a single behavior, with one way to attach it, is what a design system is for.

**Known limits.**

- **An element whose focus lives in a shadow root** (a custom element with `delegatesFocus`) opens
  the balloon on hover and on focus, but `aria-describedby` on the host does not reach the
  focusable element inside. The component that owns the shadow root renders its own tooltip next to
  the inner element. For the icon-only `nph-button`, whose name stays on its own button, this
  matters little.
- **A disabled element** may not receive pointer events, so the balloon may not open over it.
  *(Superseded by the amendment of 22/10/2026, DSA-48: a disabled element gets no balloon, by rule.)*
- **Duplicate reading.** An icon-only button whose accessible name equals the balloon text may be
  read twice by a screen reader. *(Superseded by the amendment of 22/10/2026, DSA-48: `relation="name"` makes the balloon the name, read once.)*
- **No touch.** The information of the balloon is never available on touch, by design.
- **Esc in capture.** While a balloon is open, the focused element does not see the Esc key.
- **Left and right are physical** (`left` is always the left of the screen); there is no right-to-left
  mirroring.

**Source.** Board `nph-tooltip` (`1241:3`, frame `1237:5`, component `1237:3`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 20/10/2026, with the textual audit approved; the
redefinition of 19/10/2026 and D1 of 20/10/2026 are in `docs/operacao/tarefas/DSA-42.md`. The names
`for` and `side`, the role, the layer, the placement rules, the holds and the touch rule are a
technical proposal of this implementation, reviewed with the plan on 21/10/2026.

**Out of scope.** A hover delay or a configurable one. *(Superseded by the amendment of 22/10/2026, DSA-48: the hover delay is in, from the token; a configurable one stays out.)* A tooltip with an action, a link or focus
(`nph-popover`). Collisions with the layers of other popovers. A right-to-left mirror. Wrappers or
an attribute on the element. The Usage section of the page (P70, DSA-35), the page lists read from
the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Pending for Indiane (DSA-42, D2 to D7), none of them blocks.** The distance of the balloon of the
icon-only button (`space/inline` here, `space/inline-tight` in the evidence of DSA-43); the
alignment on the cross axis (centered here); what the open balloon does on scroll and on resize
(it follows here, and is not drawn while the element is out of the window); the motion shape (opacity only here); what a click on the information icon does
(nothing here); the limits of a disabled element and of the duplicate reading.

**Status.** Anatomy and behavior accepted by Indiane on 20/10/2026. API and semantics are reviewed
in the pull request that brings them; the merge is the approval.

### Amendment of 22/10/2026 — DSA-48: hover delay, keyboard, focusable elements and the accessible name

**Technical conflict.** On 22/10/2026 Indiane approved six rules for the balloon, after a benchmark
of tooltip patterns, and the Figma documentation (frame `1237:5`, component `1237:3`) shows them
(`docs/operacao/evidencias/DSA-48/figma-docs-accepted-2026-10-22.md`): keyboard focus opens at once;
the pointer opens after 300 ms; click, Enter and Space run the action and neither open nor close the
balloon; the balloon goes only on an element that receives focus; on an icon-only button the balloon
text is the accessible name of the action, announced once; on touch the icon-only button has no
visible name, an accepted exception. Items 1, 3, 4 and 7 above, and two known limits, cannot hold
them. The 300 ms became the token `motion/hover-delay` (DSA-48, D1). The amendment also fixes the
three findings of the last Copilot review of PR #94 that were missed before its merge.

**Decision.**

1. **API: five properties.** `relation` joins `text`, `for`, `side` and `open`: `description`, the
   default, or `name`. It is not reflected. The default keeps the behavior of every current
   consumer. Any other value draws nothing, writes no reference and emits `console.error` in
   development, like an invalid `side`; `name` with empty text emits one too.
2. **The wait.** A mouse or a pen opens the balloon after resting `motion/hover-delay` on the
   element. The component reads the token from the computed style of its host, in JavaScript, when
   the pointer enters: the value is the token, never a number in the code. Without the token
   (`tokens.css` not loaded) it opens with no wait and emits `console.error` once in development.
   Leaving before the wait ends opens nothing. Keyboard focus and `open` set by the consumer do not
   wait. While the balloon is still on screen (open, or leaving), coming back into the element keeps
   it, with no new wait. With reduced motion the wait stays: it is not movement.
3. **Click, Enter, Space, Esc and Tab.** A key press restores the focus hold of an element that
   matches `:focus-visible` (P77 item 3), except Enter and Space, which run the action, Esc, which
   dismisses, and Tab, which moves the focus anyway. So Enter and Space after a focus by click do not
   open the balloon, and they never close it. A pointer press on the element during the wait, touch
   included, cancels it, and a new wait starts only when the pointer leaves and enters again; an open
   balloon does not close on click. The focus that a pointer press on the element or its label gives
   (a text field matches `:focus-visible` on a mouse click) does not open the balloon either; the next
   key press makes the keyboard count again. If the balloon opens by focus or by `open` while a wait
   is pending, the wait ends and the pointer hold is taken at once, so a blur does not let the timer
   open it again. Esc during the wait cancels it too, without being intercepted. Whether a click
   during the wait should cancel it is open with Indiane (DSA-48, D2), with this as the default.
4. **Only an element that receives focus.** The balloon opens, by hover, focus or `open`, only when
   the element is not disabled (`:disabled`, or a `disabled` attribute on a custom element) and is
   in the Tab order (`tabIndex >= 0`, or a `contenteditable` element that is the editing root and has
   no `tabindex`, which the browser tabs to while its `tabIndex` reads `-1`) or is a host that
   delegates its focus. An element that does not
   receive focus emits `console.error` once in development; a disabled one does not, because it is a
   passing state. An element disabled while its balloon is open loses it at once. The root observer
   watches `disabled`, `tabindex` and `contenteditable`, and checks the element again only when the
   change can touch it: its own attributes, `disabled` on an ancestor `<fieldset>` (the `:disabled`
   check keeps the exception of the first `<legend>`), `contenteditable` on an ancestor, and a move of
   the element or of an ancestor in the tree. The
   reference stays on a disabled element: an icon-only button still needs its name.
5. **The accessible name.** With `relation="name"` the tooltip adds its `id` to the
   `aria-labelledby` of the element, and not to its `aria-describedby`, keeping what is there. The
   host already mirrors the text in `aria-label` (item 7), which the name computation reads through
   `aria-labelledby` with the balloon closed or open; the tests read the name and the description the
   browser itself computes. A reference the consumer wrote is never removed. The `info` icon of
   `nph-label` keeps the description: its balloon is an explanation, and its name is `infoLabel`.
6. **The three findings of PR #94.** (a) The tooltip keeps the `id`, the attribute and the element it
   wrote, and moves the reference when its own `id` changes (the root observer already sees that
   attribute); a removed `id` is generated again. (b) The scroll targets are collected through the
   flat tree: a slotted node goes through its `assignedSlot`, so a scroller inside the shadow root
   around a slot is followed; Chromium does not deliver that scroll to `window`. (c) Esc no longer
   restores the focus hold, so Esc after a touch on an input does not open the balloon, and the key
   reaches the page.

**Breaking changes, and the release candidate.** Under P75, without a compatibility layer:

- The pointer opens the balloon after 300 ms, not at once.
- An element that does not receive focus (a `<span>`, an `<svg>` without `tabindex`) or a disabled
  one gets no balloon; it used to.
- Enter and Space after a focus by click no longer open the balloon.
- `relation` is new and additive; with the default nothing else changes. `nph-label` keeps its API
  and semantics. The icon-only `nph-button` (DSA-43) renders its own tooltip with `relation="name"`
  next to its inner `<button>`.

**Known limits, updated.** The disabled element and the duplicate reading leave the list: they are
rules now. A host with a closed shadow root is not seen as focusable from outside and gets no
balloon; the component that owns it renders the tooltip inside, as item 2 already asks. The other
limits stay.

**Pending for Indiane.** DSA-42 D2 to D6 are unchanged; this amendment answers none of them. Rules 4
and 5 remove the two cases behind DSA-42 D7, and Indiane confirms whether D7 closes. DSA-48 D2 asks
whether a click during the wait cancels it.

**Source.** `docs/operacao/tarefas/DSA-48.md` and its `figma-docs-accepted` evidence; the last
Copilot review of PR #94 on `d82d2c3`, recorded in
`docs/operacao/evidencias/DSA-42/review-and-merge-2026-10-22.md`. The property name `relation`, the
reading of the token in JavaScript, the keys excluded from the focus hold and the click during the
wait are a technical proposal of this implementation, approved with the plan on 22/10/2026.

**Status.** Rules accepted by Indiane on 22/10/2026. The API and semantics of the amendment are
reviewed in the pull request that brings them; the merge is the approval.

---

## P78 — `nph-avatar-stack`: API and semantics

**Decision.** `nph-avatar-stack` is a Web Component with **open Shadow DOM** (P01), CSS in its
own file imported `?inline`, as in `nph-icon`. Its shadow root holds one hidden wrapper with the
default slot and the count, and the host is the row. It has no `::part`, no event, no color
property and no form association. Anatomy only through semantic tokens. Invalid input renders
nothing and emits `console.error` only in development, one per cause — the rule of P21, adopted
here by its own decision, as in P66, P68, P73, P74 and P76. The names follow P64.

1. **Properties.** The Figma properties are `size`, `mostrar 3º`, `mostrar 4º`, `mostrar 5º`,
   `mostrar contagem` and `contagem`. The mapping below is a technical proposal of this
   implementation.

   | Figma | API |
   |---|---|
   | `size` | `size`, `sm` (default), `md` or `lg`, reflected to the attribute |
   | `mostrar 3º`, `mostrar 4º`, `mostrar 5º` | not properties: the number of `nph-avatar` children |
   | `mostrar contagem` and `contagem` | `count`, Number, `0` by default |
   | the name of the group | `label`, String |
   | the type of each avatar (photo or no photo) | not a property of the group: the `src` of each avatar (P74) |

   `count` is a number and not the text of the Figma `contagem`: the evidence says the text is
   always "+N", so the group writes the `+` and the digits, with no thousands separator. Above
   zero the count is drawn; zero, or a removed attribute (which Lit reads as `null`), draws
   none. A count that is not a whole number from zero up is invalid input.

2. **The default slot and a single size.** The group takes `nph-avatar` children, each with its
   own `src`. The group is the source of truth of the size, as `nph-toggle-group` is of `pressed`
   (P76): in `updated` and on `slotchange` it writes its `size` on every child avatar, so a
   `size` written on a child does not survive. Changing only the `size` attribute of a child
   raises no `slotchange`, so the group also observes `size` and `label` on its direct avatars (a
   `MutationObserver` on the host, connected and disconnected with the element) and writes the
   size again; its own write comes back once through the observer and writing it again changes
   nothing. An invalid group writes nothing on its avatars.

3. **Overlap and paint order.** A negative `gap` does not exist in CSS, so every avatar but the
   first, and the count, takes `margin-inline-start: var(--nph-avatar-overlap)` (-8 px), through
   `::slotted(nph-avatar:not(:first-child))`. There is no `z-index`: every `nph-avatar` is
   positioned (it anchors its border overlay, P74), so the next one paints over the previous
   one, and the count is positioned too, so it paints over the last avatar (D2). The separation
   is the border of each avatar (D3): the group draws no ring, background or border.

4. **The count.** A box after the slot: `block-size` and `min-inline-size` `avatar/size-*`,
   `border-radius` `avatar/radius-*`, `padding-inline` `space/inline-tight`, a real border
   `border/width` in `color/border` inside the box (`box-sizing: border-box`; it has no photo to
   draw over, so it needs no overlay as the avatar does), background `color/muted`, text
   `color/muted-foreground`, `text/label-sm` in `sm` and `md` and `text/label-md` in `lg` (D1),
   through the five properties of each role (P62.2). It grows with the number.

5. **Semantics.** The host is a `role="img"`, set in `willUpdate` as `nph-avatar` does, and its
   name is `label`, which becomes its `aria-label`; a name the consumer puts on the host with
   `aria-label` or `aria-labelledby` also counts, as in P76. The group is read as one image with
   the names and the total ("Ana, Bruno, Carla and 3 more"), written by the consumer in its
   language: the component composes no sentence. The slot and the count sit in one wrapper with
   `aria-hidden="true"` and `display: contents`, so the avatars and the count stay out of the
   accessibility tree and the avatars stay flex items of the host. **Finding recorded:** the role
   alone does not hide them. In Chromium an `nph-avatar` with a `label` of its own, slotted in a
   `role="img"` host, is still exposed as an image with its name; with the wrapper it is not. The
   proof is the node the browser itself computes, read through the accessibility tree, in the
   tests. The group is never focusable and has no `tabindex`. With invalid input the host takes
   `aria-hidden="true"` and no role.

6. **Box.** `display: inline-flex`, `align-items: center` and `vertical-align: middle`, with no
   background, border, outline, opacity or transition. The space to a text next to it,
   `space/inline`, is given by the consumer.

7. **Invalid input and composition.** Three causes render nothing, take no space, leave
   `data-nph-rendered` out and emit one `console.error` each, only in development: a `size` that is
   not `sm`, `md` or `lg`; a `count` that is not a whole number from zero up; and no name (no
   `label`, no `aria-label` and no `aria-labelledby`). Problems in the composition render the group
   anyway and emit one `console.warn` each, only in development, not repeated while they last:
   fewer than two avatars, more than five (all of them are drawn: the group does not hide an
   avatar or add it to the count), a child that is not an `nph-avatar`, and an avatar with a
   `label` of its own.

**Known limit.** The group does not check that `label` and `count` agree: whoever uses it writes
both.

**Points for review.**

- **`count` as a number**, and not the text of the Figma `contagem`.
- **More than five avatars draws all of them**, with a warning, and does not move the extra ones
  into the count, which would couple two inputs and leave `label` behind.
- **No name renders nothing**, as in P76, and not a decorative group as in P74: the count is
  information only the name carries, and the text next to a group, such as a team name, does not
  say who or how many.
- **The `aria-hidden` wrapper** in place of the role alone, with the finding above.
- **Writing `size` on the children**, which a consumer cannot override inside the group.

**Source.** Frame `nph-avatar-stack` (`1579:46`, set `1579:45`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 08/10/2026, with the Figma UX QA and the textual audit
approved; D1 to D3 answered on 19/10/2026. The names `count` and `label`, the slot of `nph-avatar`
children, the size written on them, the semantics of the host and its wrapper, and the invalid
input and composition rules are a technical proposal of this implementation, approved with the
plan by Elvys on 22/10/2026.

**Out of scope.** A list of people that the group opens, and the control around it. A data
property with the people, an automatic count, a maximum in code, a property per avatar, a ring
and a color property. Widening the `use` text in `design.md` for the tokens of the count: it is
the pending decision D4 of DSA-25, with Indiane, as D5 of DSA-24 is for the avatar, and the
component consumes them either way. The Usage section of the page (P70, DSA-35), the page lists
read from the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 08/10/2026; D1 to D3 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P80 — `nph-input`: API and semantics, the reference of the form controls

**Decision.** `nph-input` is a Web Component with **open Shadow DOM** (P01) and
`delegatesFocus`, CSS in its own file imported `?inline`, as in `nph-icon`. It has no slot, no
`::part` and no color property. Anatomy only through semantic tokens. It is the **first piece of
the repository associated with a form**, and this decision also fixes the pattern that
`nph-checkbox` (DSA-17), `nph-radio` (DSA-18) and `nph-input-otp` (DSA-41) copy, each recording
only what changes; there is no shared helper yet. What the field writes on the control (`label`,
`description`, `invalid`, `required`, `disabled`) is the field contract, recorded in P83
(DSA-28); this decision says how the input takes it. Invalid input renders nothing and emits
`console.error` only in development, one per cause — the rule of P21, adopted here by its own
decision, as in P66, P68, P73, P74 and P76. The names follow P64.

1. **Properties.** The Figma set has `size`, `state` and six properties for the icons, the value
   and the placeholder. The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `size` | `size`, `default` or `large`, reflected: the internal CSS selects the height by it |
   | `state` `erro` | `invalid`, Boolean, reflected: error border and `aria-invalid` on the inner field |
   | `state` `disabled` | `disabled`, Boolean, reflected: native `disabled` on the inner field and the clear button |
   | `state` `hover`, `foco`, `foco-limpar`, `erro-foco` | not properties: interaction, drawn by the CSS |
   | `ícone início` + `⮑ ícone início` | `icon-start`: `none` (default) or a core name of `nph-icon`. The Figma default, on with `magnifying-glass`, would put a magnifier in every field |
   | `ícone fim` + `⮑ ícone fim` | `icon-end`: `none` (default) or a core name; it turns on the clear button, and the name only swaps the art (D2) |
   | `texto do valor` | `value`, the current value |
   | `texto do placeholder` | `placeholder` |
   | the types of D1 | `type`: `text` (default), `email`, `tel`, `url` or `search` |
   | the accessible name of the clear button | `clear-label`, required with `icon-end` |
   | the form | `name` (reflected), `required` (reflected), `autocomplete` (WCAG 1.3.5) |
   | the field contract (P83) | `label` and `description`, text never visible |

2. **Form association.** `static formAssociated = true` and `attachInternals()`. It is what
   makes the host **labelable**: `<label for>` pointing to the host — what `nph-label for`
   renders (P62.1) — moves the focus to the inner native `<input>` through `delegatesFocus`,
   and `host.labels` lists it.
   - **Value.** `setFormValue(value)` on every change. A disabled host, by its attribute or by a
     disabled `<fieldset>`, is left out of the form data by the browser.
   - **`name` reflects.** The form reads the **attribute** of the host: without it, `el.name =
     'x'` set by code leaves the entry out of the submission (proved in Chromium).
   - **`value`: the attribute is the default, the property is the current value**, as in the
     native `<input>`. The property is declared with `attribute: false`; the host observes the
     `value` attribute by hand and applies it only while the field is not dirty. Typing and
     setting the property make it dirty; `form.reset()` (`formResetCallback`) clears the flag
     and goes back to the attribute. `formStateRestoreCallback` puts the value back on history
     navigation.
   - **Validity.** The host mirrors the flags **and** the message of the inner field:
     `setValidity(input.validity, input.validationMessage, input)`. It covers `required` empty
     and the format of `email` and `url`. The message is the browser's, in the person's
     language: no `nph-*` knows a language. `invalid` is **not** a constraint and adds no
     `customError`: the sentence belongs to `nph-field`, and `setValidity` would need one. A
     form whose messages are written by `nph-field` uses `novalidate` when the browser balloon
     is not wanted.
   - **Native surface**, as getters and methods, not reactive properties: `form`, `labels`,
     `validity`, `validationMessage`, `willValidate`, `checkValidity()` and `reportValidity()`.
   - **Value and validity before the events.** The host takes the value of the inner field in a
     `input` listener of its own, in capture, and writes the form value and the validity before
     any listener of the consumer runs; setting `value`, a reset and clearing do the same. The
     value is the one the native field keeps after its sanitizing (a line break, the spaces of
     an `email`). While the inner field does not validate (disabled), the host clears its
     validity, and mirrors it again when the field is enabled.
   - **Enter submits.** The inner field has no form owner, so the browser would not submit the
     form on Enter. The host does what HTML does: it clicks the default button of the form (the
     first submit button in tree order whose form is this one, `input type="image"` and buttons
     associated by the `form` attribute included, so the submitter, `formaction` and the
     validation apply), does nothing when that button is disabled, and calls `requestSubmit()`
     when there is none. With no form, Enter does nothing. It decides at the **end of the
     propagation**, as the default action of a native field: a consumer that cancels Enter, in
     capture or in bubbling, keeps the form. A microtask would decide between two listeners of
     the same event, too early.

3. **Accessible name and description.** The focused element is the inner field, and an `id`
   does not cross the shadow root. The inner field takes, in this order:
   1. the labels associated with the host (`internals.labels`), as **element references**
      (`ariaLabelledByElements`). A reference from inside a shadow root to an element of an
      outer scope is valid. The name follows the text of the label, because it is a reference
      and not a copy, and the `aria-hidden` asterisk of `nph-label` stays out of it. The host
      recomputes it after the first frame (the label may render after the input), on focus, when
      `label` changes and when a label of its root is added, removed or pointed elsewhere (a
      `MutationObserver` on the root, filtered to `for` and `id`). **Proved in Chromium**, by the accessibility tree read through the
      DevTools protocol in `nph-input.test.ts`: the inner field is a `textbox` named by the
      label, with or without the asterisk; a label that wraps the host names it too. `nph-input-otp`
      (DSA-41) can follow the same path;
   2. `label`, as the `aria-label` of the inner field. It is what `nph-field` writes (P83), since
      its label is not associated with `for`.

   With no name at all, the field **renders** and warns once in development: the label may
   arrive after the first render, and there is no event that says so. `description` goes into
   an internal element referenced by `aria-describedby`, hidden by clipping and not by
   `display: none`, which the browser does not read (P77).

4. **Events: the native ones, an exception to the reasoning of P73 item 3.** P73 gave
   `nph-togglebutton` an `nph-change` because its `click` did not say the new value and the
   prefix avoided the native `change`. These pieces are **form controls**: the consumer reads
   `event.target.value`, as frameworks do with a native field, and an `nph-*` event would need
   a typed key in `HTMLElementEventMap` that `nph-change` (P73) and `nph-value-change` (P76)
   already take with another `detail`. So the input fires `input` and `change` and no event of
   its own. The `input` of the inner field is `composed` and reaches the host on its own; the
   `change` is not, so the host fires it again (`bubbles`, not `composed`). Setting `value` from
   code fires neither. The same rule holds for the form controls of the field contract (P83).

5. **The clear button (D2).** A native `<button type="button">` after the field, named by
   `clear-label`, with the `nph-icon` of `icon-end`, decorative. It shows only with a value and
   when the field is enabled, and it stays in the Tab order: the frame draws `foco-limpar`
   (D2-item of the task, with Indiane). A click, Enter or Space empties the value, moves the
   focus back to the field — the button disappears, and the focus cannot fall on the page —
   and fires `input` and `change`, as typing does. `icon-end` without `clear-label` draws the
   field without the button and one error, as `info` without `info-label` in P62.6. In a
   `search` field, the cancel button of the browser is hidden, so the one of the piece is the
   only one.

6. **States (D4, D5).** The container border is `color/input`, `color/input-hover` on hover and
   `focus/border` with the halo `focus/halo` attached outside, at `focus/radius-control`, while
   the inner field has the focus. `foco-limpar` is the focus on the clear button, keyboard only:
   the container keeps its border, and the border (`focus/border-radius-control`) and the halo
   (`focus/radius-control-with-border`) sit around the 24 × 24 target. `erro` keeps
   `status/error` on hover and on focus, with the halo `focus/halo-error`; with `erro` and the
   focus on the clear button, the target takes the usual focus. `disabled` wins over
   everything: `color/input`, `color/muted` and `state/disabled-opacity` on the whole host,
   selected by `:host(:disabled)`, which also matches a disabled `<fieldset>`. The field shows
   its focus on a pointer click too: a text field always shows where the caret is. There is
   no motion: the evidence does not ask for it (D4-item of the task).

7. **Box (D6).** The host is `inline-flex`, `layout/input-width` wide, with no minimum; the
   parent stretches it with its own `inline-size`, as `nph-field` will (P83).

8. **Invalid input.** A `type` outside the five (rendering a password as text would be a risk),
   a `size` outside the two and an icon value outside `none` and the core render nothing, take
   no space, leave `data-nph-rendered` out, contribute nothing to the form data and emit one
   `console.error` each, accumulating.

**Points for review.**

- **Form association**, the first of the repository, and the pattern the other controls copy.
- **The name by element reference**, and not a copy of the text: tools that compute the name
  from attributes (axe-core of P72, the role queries of Playwright) may not follow it; the proof
  is the accessibility tree of Chromium. Setting it writes an empty `aria-labelledby` on the
  inner field; check it when the gate of P72 lands.
- **Native events** instead of `nph-*`, and the departure from the reasoning of P73 item 3.
- **Enter submits** by clicking the default button, decided at the end of the propagation.
- **One `MutationObserver` per field on its root**, to follow labels that are recreated; it
  watches the tree and the `for` and `id` attributes, not the text.
- **`icon-start` and `icon-end` off by default**, unlike the Figma booleans.

**Known limits.** Autofill by browsers and password managers inside a shadow root varies.
Forced colors and right-to-left are not treated yet.

**Source.** Frame `nph-input` (`1195:532`, set `622:18359`) of the Figma file `DS-IA-NEPHOS
5.0`, accepted by Indiane on 01/10/2026, with the Figma UX QA and the textual audit approved on
02/10/2026; D1 to D7 answered on 16/10/2026. The API names, the form association, the name by
reference, the native events, the Enter rule and the invalid input rules are a technical
proposal of this implementation, approved in the plan by Elvys on 22/10/2026.

**Out of scope.** Password, number and mask (D1). A read-only state, `maxlength`, `minlength`,
`pattern` and `inputmode`. A `customError` from `invalid`. An event of its own. Motion. A shared
helper for the form controls. The Usage section of the page (P70, DSA-35) and the page lists read
from the Metadata (P71, DSA-34), as on every Docs page.

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026; D1 to D7 answered on
16/10/2026. API and semantics are reviewed in the pull request that brings them; the merge is
the approval.

---

## How to change one of these decisions

Do not change, replace or reopen P01, P02, P03, P17, P19, P20, P21, P62, P63, P64, P65, P66, P67, P68, P69, P70, P71, P72, P73, P74, P75, P76, P77, P78 or P80 without:

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
