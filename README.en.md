<!-- i18n: lang=en | source=README.md | source-sha256=5657d6fcceffd973c2fbe223e077ab81cba90c3338bb11e025a4a88deb690002 | status=revisado -->

# Nephos 5.0

[Português (BR)](README.md) · **English** · [Español](README.es.md)

> Translated from the Brazilian Portuguese source, [`README.md`](README.md).
> If the two disagree, the Portuguese file prevails.

Nephos is IATec's Design System. It connects foundations defined in Figma, Web
Components written in Lit, browsable documentation, and visual and behavioural
validation.

> **Under construction.** Whatever is already available for use — components,
> variants, states and rules — lives in Storybook, generated from the code
> itself. Run `npm run storybook` to browse it. This README does not track
> progress counts: phase progress is internal record keeping, not usage
> documentation.

## What Nephos delivers

- Web Components prefixed with `nph-`, written in Lit.
- Tokens and usage rules defined in the `design.md` contract.
- Documentation for components, blocks, layouts and templates.
- Stories and validation in Storybook.
- Consumption examples for Vue, Angular and Blazor.

Nephos does not depend on PrimeNG, shadcn/ui, Radix, Tailwind or any other
component framework. The Obra UI kit is a visual and structural reference, not a
code dependency.

## Running Storybook

Requires Node.js and npm. Validated with Node 24.18.0 and npm 11.16.0.

```bash
npm install
```

```bash
npm run storybook
```

Storybook starts at `http://localhost:6006`.

To build the static version into `storybook-static/`:

```bash
npm run build-storybook
```

## Tokens

The values audited in Figma live in `src/tokens/source/*.tokens.json`. The CSS is
**generated** from them and **must never be edited by hand**.

```bash
npm run build:tokens
```

```bash
npm run test:tokens
```

Format, modes, validations and scope are detailed in
[`docs/tokens.en.md`](docs/tokens.en.md).

### Consuming the themes

Brand and colour scheme are **independent dimensions**. Put both attributes on
the root element and import the generated CSS:

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

| Attribute | Values | Default |
|---|---|---|
| `data-nph-brand` | `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh` | `sistemas` |
| `data-nph-color-scheme` | `light`, `dark` | `light` |

Omitting both gives you Sistemas in light mode.

The CI workflow and publishing do not exist yet — their direction is set by P19,
in [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md), which is kept in
Portuguese only.

## Technical decisions in force

Decisions P01, P02, P03, P17, P19, P20 and P21 are recorded in
[`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md).

**Status: adopted by Indiane on 24/08/2026, pending review by Elvys.** The rules
are to be followed in current work, unless a technical conflict is identified or
Elvys gives later guidance.

| | Subject | Decision |
|---|---|---|
| **P01** | Component encapsulation | Open Shadow DOM |
| **P02** | Customisation and CSS surface | CSS custom properties as the public API; `::part` for internal parts; internal classes are not API |
| **P03** | Project layout | `src/components/<nome>/` holding implementation, CSS, story and test together; `src/tokens/` with `source` and `generated`; `src/styles/`; `src/shared/`; `docs/` |
| **P17** | Token format and consumption | JSON as the versioned source format; CSS custom properties as the generated format |
| **P19** | Storybook, tests and publishing | Keep `@storybook/web-components-vite`; build on CI for pull requests, as a private artefact |
| **P20** | Generation tool and theme contract | Style Dictionary v5; `data-nph-brand` and `data-nph-color-scheme` (`light`/`dark`); `com.iatec.nephos` namespace |
| **P21** | Technical plan for the first component | The `nph-icon` contract; strict TypeScript; stories next to the component; Vitest in browser mode |

That note carries the rationale, scope, impact and out-of-scope items for each
decision. It is the source of the rule: if it disagrees with this README, the
note prevails.

The package manager is **npm** and the Storybook framework is
**`@storybook/web-components-vite`**. Both started as bootstrap choices and were
confirmed by P19.

### What remains out of scope

Still outside the repository: the CI workflow, public publishing and deployment.
Also out: the 20 primitives from P46 and, deferred to a future round, the
remaining primitives, the effect styles and the text styles — deferred does not
mean unused.

## Sources of truth

| Subject | Source |
|---|---|
| Token values and visual decisions | Figma `DS-IA-NEPHOS 5.0` |
| Technical contract and usage rules | `design.md`, at the root of this repository |
| Versioned token values | `src/tokens/source/*.tokens.json`; see [`docs/tokens.en.md`](docs/tokens.en.md) |
| Technical decisions P01, P02, P03, P17, P19, P20 and P21 | [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) |
| Governance, precedence and preflight | `GOVERNANCA.md` |
| Agent instructions | `AGENTS.md` and `CLAUDE.md` |
| Delivered implementation | Branch, commit, PR and Storybook in this repository |
| Spec sheet and selection rule for a piece | `fichas/<nome>.md`, not created yet |

Where something is missing or in conflict, do not invent a decision: stop and
ask for confirmation.

## Per-component flow

1. In Figma `DS-IA-NEPHOS 5.0`, clone the structurally equivalent component from
   the Obra UI kit.
2. Configure the piece using Nephos tokens only and get it visually approved in
   Figma.
3. Create or complete its spec sheet, covering variants, states, accessibility,
   relationships and anti-patterns.
4. Implement the Web Component in Lit in this repository.
5. Create stories for variants and states, and validate behaviour, keyboard,
   focus and accessibility.

No component may be implemented in the repository before it is approved in
Figma.

## First P0 slice

1. `nph-button`
2. `nph-label`
3. `nph-input`
4. `nph-field`
5. `nph-checkbox`

Other components are not part of P0 by default. The full v1 list is not closed
yet.

## Taxonomy

| Level | Description |
|---|---|
| Component | A reusable, public, isolated piece. |
| Block | A reusable composition of components serving one interface function. |
| Layout | A recurring spatial structure of a screen. |
| Template | The structure of a flow or screen type, combining layouts and blocks. |

Blocks, layouts and templates may only be documented after being extracted from
a real screen or an approved mock.

## Language versions

This repository publishes its usage documentation in Portuguese (BR), English
and Spanish. Portuguese is the source; see [`docs/i18n.md`](docs/i18n.md) for the
convention.

## Licence

Unlicense. See `LICENSE`.
