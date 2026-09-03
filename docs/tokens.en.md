<!-- i18n: lang=en | source=docs/tokens.md | source-sha256=e736fbc0c88402dc5d62ac34580dec2b8813c095cc5c51ff4b460319af18b782 | status=revisado -->

# Tokens — source, generation and consumption

[Português (BR)](tokens.md) · **English** · [Español](tokens.es.md)

> Translated from the Brazilian Portuguese source, [`tokens.md`](tokens.md).
> If the two disagree, the Portuguese file prevails.

> **The technical source totals 404 tokens**, 230 of them semantic. The 289-item
> base migration was completed on 24/08/2026; the three tokens approved in Figma
> for `nph-button` landed on 25/08/2026, in commit `505e36d`, taking the source
> to 292. Each layer declares its own count in `contagemEsperada`, and
> `npm run build:tokens` fails when a layer diverges from what it declared.
>
> On 27/08/2026 the **typography layer** landed: the two font families in `core`
> and the **14 text roles** in `semantic`, each with five properties — 141
> `core`, 6 `theme` and 217 `semantic`. The reason was concrete: `nph-label` is
> the first component made of pure text, and without `text/label-md` in code it
> could not exist without a literal value.
>
> On 03/09/2026 **shadow** and the missing **motion** pieces landed: 24
> primitives and the 8 elevation styles (PF-15), `core/duration/400` and
> `core/easing/linear` (PF-16) and the spinner-loop pair (PF-05) — 168 `core`,
> 6 `theme` and 230 `semantic`. The 3 focus rings landed on the same date, after
> a name change the 03-09-2026 section explains.

This note explains **how tokens live in the repository**. What each token means,
when to use it and when not to, is in [`design.md`](../design.md), which does not
duplicate values. Values originate in Figma `DS-IA-NEPHOS 5.0`.

## Source of truth by responsibility (P17)

| Layer | Role |
|---|---|
| **Figma `DS-IA-NEPHOS 5.0`** | Visual source. Defines and validates values, modes, aliases and intent. |
| **`design.md`** | Human and agent-facing contract: usage, accessibility, naming, anti-patterns. **Not the generation file.** |
| **`src/tokens/source/*.tokens.json`** | Versioned technical source of audited values. **This is what you edit.** |
| **`src/tokens/generated/tokens.css`** | Generated artefact. **NEVER edit by hand.** |

## Files

```text
src/tokens/
  source/
    core.tokens.json       168 primitives
    theme.tokens.json        6 brand variables, seven modes
    semantic.tokens.json   230 semantic tokens, two colour schemes
  generated/
    tokens.css             534 declarations — GENERATED
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

DTCG — `$type`, `$value`, `$description`. The seven handled types are
**`color`**, **`dimension`**, **`duration`**, **`cubicBezier`**, **`number`**,
**`fontFamily`** and **`shadow`**.

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

Of the 230 semantic tokens: **136 invariant** and **94 variant**. All 94 are
`color`. Among the 136 there are **9 `color` tokens** — invariance is not a
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

## Update of 27-08-2026 — typography layer

The 14 text roles left the deferred list. Each role emits **five** custom
properties, not one:

```css
--nph-text-label-md-font-family
--nph-text-label-md-font-size
--nph-text-label-md-line-height
--nph-text-label-md-font-weight
--nph-text-label-md-letter-spacing
```

Five, because `letter-spacing` does not fit in the CSS `font` shorthand and
because a component often needs one property in isolation. The `css` field of
each role in `design.md` is now read as a **prefix**, not as the final name.

The family is the only part that becomes an alias:
`--nph-text-label-md-font-family` points to `--nph-core-font-sans`. Size, line
height, weight and letter spacing are literals on the role, exactly as
`design.md` already wrote them in the `valores` block.

The five-property shape was approved by Elvys on 28/08/2026 (P62.2).

The unit caveat **is gone**: dimensions used to come out in `px`, and from
28/08/2026 they come out in `rem` — see the section below.

## Update of 28-08-2026 — dimensions in `rem`

The generator emitted `px` for every `dimension`, while `design.md` already
promised `unidade_css: rem, raiz 16px`. **Elvys's decision in P62.4, on
28/08/2026:** the contract does not change; the code starts honouring it.

The `nephos/dimension/rem` transform divides the value by **16** and emits
`rem`. A zero value comes out as `0`, with no unit.

```css
--nph-core-space-400: 1rem;        /* was 16px */
--nph-core-control-height-default: 2.25rem;  /* was 36px */
--nph-text-body-md-font-size: 0.875rem;      /* was 14px */
--nph-text-heading-xl-letter-spacing: -0.0125rem;  /* was -0.2px */
```

**Radius and shadow stay in `px`.** Radius by Indiane's decision on 28/08/2026,
recorded as P62.5; the shadow geometry since 03/09/2026, per
`elevacao_regras.unidade_css: px`.
The `raio_regras` block in `design.md` declares `unidade_css: px` and gives the
reason: radius in `rem` would grow with the user's font, and the piece would
change **shape**, not size — a 6px button would turn into a pill. `px` and `rem`
behave identically under browser zoom; the difference only shows up in the
user's font-size preference. They are the **two** foundations the contract declares
in `px`, and for the same reason: the shadow foundation says, in so many words,
"offset, blur and spread in px, like the radius; a shadow must not grow with the
user's font". P62.5 confirms the radius rule rather than changing it. The text
that called radius the *only* foundation in `px` had been wrong ever since
`elevacao_regras` existed, and was corrected on 03/09/2026.

The computed value does not change at the default 16px root: `1rem` still
resolves to `16px`. What changes is that the interface now follows the user's
font-size preference.

## Update of 03-09-2026 — shadow, elevation and the spinner loop

Three foundation gaps landed in the same PR: **PF-15** (shadow), **PF-16** (the
two missing motion pieces) and **PF-05** (the loop duration).

### What was missing, and it was not what it looked like

The earlier diagnosis said the effect styles "are not variables and require a
different extraction path". That was not it. Style Dictionary v5, already fixed
by P20, treats shadow as a **native type**, and `shadow/css/shorthand` was
already in the `css` group the generator uses. One line was missing: `shadow`
was not in `TIPOS_TRATADOS`. No new dependency was added.

### The 24 primitives, and why they land together

In Figma, every layer of the `elevation/*` styles **binds its geometry to
variables** — `core/shadow-y`, `core/shadow-blur` and `core/shadow-spread` — and
only the colour comes from a semantic token. Porting the style with the numbers
written by hand would be a poorer translation than what the file holds. The 24
primitives leave the deferred list because the consumer the scope table already
named now exists.

**The geometry is emitted in `px`,** per `elevacao_regras.unidade_css: px`. It is
the second family outside the `rem` conversion, alongside `core/radius`.

### Why the generator assembles the shadow itself

`shadow/css/shorthand` builds the right shorthand, but what writes the
references is `outputReferences`, which works **by value**: it looks for the
resolved value inside the finished string and swaps it for the `var()`. In a
shadow that lands on the wrong slot whenever two parts share a value — and they
do. In `elevation/hairline` (0 · 1 · 0 · 0) the X offset, the blur and the
spread are all zero, and the output came out with
`var(--nph-core-shadow-blur-0)` **in the X slot**. The computed CSS was right by
coincidence, and the binding was wrong: touching the blur would move the offset.

Hence `nephos/shadow/css`, which builds the shorthand from `original.$value` —
where the references still are — and puts each part in **its** slot.
`outputReferences` is switched off for `shadow`, otherwise it would substitute
again. Validation 7 was extended to prove it: on a composite value it counts how
many `var()` the output carries against how many references the source declares.

### Motion: the sixth role

`core/duration/400` and `core/easing/linear` were already in `design.md` and in
anti-patterns A61 and A66, and had never entered the JSON — forgotten execution,
not a decision. `linear` enters as `cubicBezier [0, 0, 1, 1]`, the exact
equivalent, because `cubicBezier` is the type the system uses for curves; the
CSS comes out as `cubic-bezier(0, 0, 1, 1)`.

The spinner loop — **800 ms, `linear` curve, infinite repetition**, decided by
Indiane on 02/09/2026 in a study with 600, 800 and 1000 side by side — enters as
`core/duration/loop` **and as a sixth role**: `motion/loop-duration` and
`motion/loop-easing`.

Six roles, and not five, for a contract reason: a component consumes **only** the
semantic layer. Stopping at `core/duration/loop` would close PF-05 and leave
`nph-spinner` blocked, because implementing it would require consuming `core/*`.
The role also settles an earlier contradiction: the "agent test" in the motion
notes answered `core/easing/linear` for the spinner — a `core` token — and now it
answers a role.

**The indeterminate bar still has no value.** `nph-progress` was deferred and
there is no piece to decide about.

### The name collision, and how it was settled

All 11 styles landed — but the three focus rings only after a name change.
`design.md` gave the **same CSS name** to two different things:

| Token | CSS name | What it is |
|---|---|---|
| `focus/ring-error` | `--nph-focus-ring-error` | the ring's **colour**, published since the base migration |
| `focus-ring/error` | `--nph-focus-ring-error` | the ring's **shadow** |

The collision comes from the naming convention: `/` becomes `-`, and
`focus-ring/error` and `focus/ring-error` flatten onto the same identifier. It
does not show up in Figma, because there styles and variables are separate
namespaces. What found it was the new validation — the build failed, with the
name and the count.

**Indiane's decision on 03/09/2026: rename the style, not the colour.** The
style `focus-ring/error` is now **`focus-ring/invalid`**, in Figma and in code at
the same time. The published colour did not change.

Three reasons. You do not break an already published custom property — which P02
defines as public API — to accommodate one that did not exist yet. Renaming in
both places at once keeps the style name in Figma identical to the token name,
without the silent drift that would appear if only the code changed. And
`invalid` is the HTML and ARIA term for this state, consistent with `design.md`,
which describes the case as "campo que falhou a validacao".

The result reads by itself: the shadow is `invalid`, and the colour it uses is
still `error`.

```css
--nph-focus-ring-invalid: 0px 0px 0px var(--nph-focus-ring-width) var(--nph-focus-ring-error);
```

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

1. a `$type` outside the seven handled ones appears;
2. a token declares `modes` and a value is missing for some mode of the layer;
3. a `{...}` reference points to a token that exists in no source;
4. the token count of a layer does not match `contagemEsperada`.

**In the output**

5. an unresolved `{...}` reference remains;
6. some value comes out as `[object Object]`;
7. a token that is a reference in the source comes out flattened into a literal
   — on a scalar value, by requiring the output to start with `var(`; on a
   composite value, by counting how many `var()` the output carries against how
   many references the source declares;
8. an invariant is emitted more than once, or a variant is not emitted once per
   mode.

## Out of scope for this round

| Item | Status |
|---|---|
| 20 primitives from **P46** | **Excluded by recorded decision** — `core/radius` 700–1000, `core/space` 1200–1500 and the 12 off-scale ones. While they are on that list, they do not enter the JSON. |
| The other 127 `core` primitives | **Deferred.** They are not reachable from the `semantic` layer, which does **not** mean they have no consumer. They remain deferred with no judgement about consumers. |
| 24 `core/sombra` primitives | **Migrated on 03/09/2026.** The consumer the row above already named — the `elevation/*` styles — now exists. |
| 11 effect styles | **Migrated on 03/09/2026.** No longer deferred: they became `shadow` tokens — 8 elevation levels and 3 focus rings. |
| 14 text styles | **Migrated on 27/08/2026.** No longer deferred. They are not Figma variables: the values were read from the text styles and checked against `tokens_typography` in `design.md`, item by item, with no divergence. Each role became five tokens in `semantic.text`, and the two families landed in `core.font`. |

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
