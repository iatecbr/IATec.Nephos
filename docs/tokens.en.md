<!-- i18n: lang=en | source=docs/tokens.md | source-sha256=9be63d11f05ace9c427cb5fdf7f4a4b0995f0c49eb6d26abbd92ccd047feed05 -->

# Tokens — source, generation and consumption

[Português (BR)](tokens.md) · **English** · [Español](tokens.es.md)

> Translated from the Brazilian Portuguese source, [`tokens.md`](tokens.md).
> If the two disagree, the Portuguese file prevails.

> **The technical source totals 292 tokens**, 147 of them semantic. The 289-item
> base migration was completed on 24/08/2026; the three tokens approved in Figma
> for `nph-button` landed on 25/08/2026, in commit `505e36d`. `npm run
> build:tokens` checks that total on every generation — if it diverges, the build
> fails.

This note explains **how tokens live in the repository**. What each token means,
when to use it and when not to, is in [`design.md`](../design.md), which does not
duplicate values. Values originate in Figma `DS-IA-NEPHOS 5.0`.

## Source of truth by responsibility (P17)

| Layer | Role |
|---|---|
| **Figma `DS-IA-NEPHOS 5.0`** | Visual source. Defines and validates values, modes, aliases and intent. |
| **`design.md`** | Human and agent-facing contract: usage, accessibility, naming, anti-patterns. **Not the generation file.** |
| **`src/tokens/source/*.tokens.json`** | Versioned technical source of audited values. **This is what you edit.** |
| **`src/tokens/generated/tokens.css`** | Generated artifact. **NEVER edit by hand.** |

## Files

```text
src/tokens/
  source/
    core.tokens.json       139 primitives
    theme.tokens.json        6 brand variables, seven modes
    semantic.tokens.json   147 semantic tokens, two colour schemes
  generated/
    tokens.css             422 declarations — GENERATED
scripts/
  tokens-lib.mjs           pure functions: canonical form, classification, index
  build-tokens.mjs         generator
  test-invariancia.mjs     proof of the classifier
```

## How to generate

```bash
npm run build:tokens
```

```bash
npm run test:tokens
```

The build is deterministic: two runs over the same source produce an identical
file. That allows a future CI to re-run generation and fail when `git diff` is
not empty — the guarantee that nobody hand-edited the CSS.

## Format

DTCG — `$type`, `$value`, `$description`. The types in use are **`color`**,
**`dimension`**, **`duration`**, **`cubicBezier`** and **`number`**.

DTCG has **no native modes** yet. Modes live under
`$extensions["com.iatec.nephos"].modes`, and the generator applies them before
handing the tree to Style Dictionary. `$value` always holds the default mode's
value, so that any generic tool resolves something correct.

```json
"brand-600": {
  "$type": "color",
  "$value": "{core.sistemas.600}",
  "$extensions": { "com.iatec.nephos": { "modes": {
    "sistemas": "{core.sistemas.600}",
    "educacao": "{core.educacao.700}"
  } } }
}
```

**A token with no `modes` block is invariant across the modes of its layer.**

## Invariant vs. variant

Classification compares **alias and final value** across modes, in a
**canonical** representation — never by object identity, never by key order,
never by `$type`. It is proven in `scripts/test-invariancia.mjs`.

Of the 147 semantic tokens: **53 invariant** and **94 variant**. All 94 are
`color`. Among the 53 there are **9 `color` tokens** — invariance is not a
property of the type.

## Update of 25-08-2026 — Button tokens

The three tokens below were approved in Figma and synchronised into the
technical source:

| Token | DTCG type | Light | Dark |
|---|---|---|---|
| `color/destructive-foreground` | `color` | `{core.base.white}` | `{core.neutral.950}` |
| `color/secondary-hover` | `color` | `{core.neutral.200}` | `{core.surface.700}` |
| `state/hover-opacity` | `number` | `0.95` | `0.95` |

`state/disabled-opacity` stays at `number = 0.5`.

In Figma, opacity is expressed as a percentage: 95 and 50. In JSON and CSS it is
a fraction: `0.95` and `0.5`. The generator already emits `number` tokens
correctly; there is no additional opacity transform.

**Invariant does not mean fixed.** `sidebar/primary` has the same alias in light
and dark, so it is emitted once under `:root` — but what is emitted is
`var(--nph-theme-brand-600)`, which still changes with `data-nph-brand`.

## Consumption — two independent attributes

Brand and colour scheme are **independent dimensions**: a product can be in
Educação + dark without anything being re-authored.

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

| Attribute | Values | Default |
|---|---|---|
| `data-nph-brand` | `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh` | `sistemas` |
| `data-nph-color-scheme` | `light`, `dark` | `light` |

The `data-nph-brand` values are the names of IATec's business verticals. The
internal JSON keys use `claro` and `escuro`, mirroring the Figma modes; the
mapping to `light`/`dark` is declared in `modeSet.valorPublico`.

Omitting both attributes gives Sistemas in light, because every default block is
also emitted under `:root`.

## Structure of the generated CSS

```css
:root { --nph-core-sistemas-600: #2f68c5; }                       /* layer 1 */
:root, [data-nph-brand="sistemas"] { --nph-theme-brand-600: var(--nph-core-sistemas-600); }
[data-nph-brand="educacao"]        { --nph-theme-brand-600: var(--nph-core-educacao-700); }
:root { --nph-sidebar-primary: var(--nph-theme-brand-600); }      /* invariants */
:root, [data-nph-color-scheme="light"] { --nph-color-primary: var(--nph-theme-brand-600); }
[data-nph-color-scheme="dark"]         { --nph-color-primary: var(--nph-theme-brand-400); }
```

Aliases become `var()`, never literals. Only the `core` layer carries literal
values.

## Generator validations

The build **fails** — with exit code 1 and a specific message — when:

**In the source**

1. a `$type` outside the five handled ones appears;
2. a token declares `modes` and a value is missing for some mode of the layer;
3. a `{...}` reference points to a token that exists in no source;
4. the token count of a layer does not match `contagemEsperada`.

**In the output**

5. an unresolved `{...}` reference remains;
6. some value comes out as `[object Object]`;
7. a token that is a reference in the source comes out flattened into a literal;
8. an invariant is emitted more than once, or a variant is not emitted once per
   mode.

## Out of scope for this round

| Item | Status |
|---|---|
| 20 primitives from **P46** | **Excluded by recorded decision** — `core/radius` 700–1000, `core/space` 1200–1500 and the 12 off-scale ones. While they are on that list, they do not enter the JSON. |
| The other 151 `core` primitives | **Deferred.** They are not reachable from the `semantic` layer, which does **not** mean they have no consumer. Of these, **24 are `core/sombra`, with a known consumer** in the `elevation/*` styles. The other 127 remain deferred with no judgement about consumers. |
| 11 effect styles · 14 text styles | **Deferred.** They are not variables; they require a different extraction path. |

## Known tool limitation

Style Dictionary 5.5.2 serialises `duration` in the structured DTCG form
(`{ value, unit }`) as `[object Object]`. The source **stays structured**, as
DTCG requires; conversion to `250ms` happens only on output, through the
`nephos/duration/css` transform registered in `scripts/build-tokens.mjs`.
Validation 6 exists so that this class of failure never passes silently.

## How to change a value

1. Change it in **Figma** — it is the visual source.
2. Update `src/tokens/source/*.tokens.json`.
3. Run `npm run build:tokens` and confirm it passed.
4. Record evidence, date and owner, as required by `GOVERNANCA.md`.

Never edit `src/tokens/generated/`. Never write a literal value in a component's
CSS: components consume **semantic tokens only**.
