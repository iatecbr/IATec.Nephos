<!-- i18n: lang=es | source=docs/tokens.md | source-sha256=2707e4c18bbea8bdf6cbf8945bb9bd3f01fd99ed8a78656d33731d239d8a1cc1 | status=rascunho -->

# Tokens — fuente, generación y consumo

[Português (BR)](tokens.md) · [English](tokens.en.md) · **Español**

> **Traducción en borrador.** Todavía no revisada por una persona. Donde difiera
> de la fuente en portugués, la fuente tiene razón.

> Traducido de la fuente en portugués de Brasil, [`tokens.md`](tokens.md).
> Si ambos difieren, prevalece el archivo en portugués.

> **La fuente técnica suma 364 tokens**, de los cuales 217 son semánticos. La
> migración base de 289 ítems se concluyó el 24/08/2026; los tres tokens
> aprobados en Figma para `nph-button` entraron el 25/08/2026, en el commit
> `505e36d`, llevando la fuente a 292. El comando `npm run build:tokens` verifica
> ese total en cada generación — si difiere, falla.
>
> El 27/08/2026 entró la **capa de tipografía**: las dos familias tipográficas en
> `core` y los **14 papeles de texto** en `semantic`, cada uno con cinco
> propiedades — 141 `core`, 6 `theme` y 217 `semantic`. El motivo fue concreto:
> `nph-label` es el primer componente hecho de texto puro, y sin `text/label-md`
> en código no podía existir sin un valor literal.

Esta nota explica **cómo viven los tokens en el repositorio**. Qué significa cada
token, cuándo usarlo y cuándo no, está en [`design.md`](../design.md), que no
duplica valores. Los valores nacen en Figma `DS-IA-NEPHOS 5.0`.

## Fuente de verdad por responsabilidad (P17)

| Capa | Papel |
|---|---|
| **Figma `DS-IA-NEPHOS 5.0`** | Fuente visual. Define y valida valores, modos, alias e intención. |
| **`design.md`** | Contrato humano y para agentes: uso, accesibilidad, nomenclatura, antipatrones. **No es el archivo de generación.** |
| **`src/tokens/source/*.tokens.json`** | Fuente técnica versionada de los valores auditados. **Es lo que se edita.** |
| **`src/tokens/generated/tokens.css`** | Artefacto generado. **NUNCA lo edite a mano.** |

## Archivos

```text
src/tokens/
  source/
    core.tokens.json       141 primitivos
    theme.tokens.json        6 variables de marca, siete modos
    semantic.tokens.json   217 tokens semánticos, dos esquemas de color
  generated/
    tokens.css             494 declaraciones — GENERADO
scripts/
  tokens-lib.mjs           funciones puras: forma canónica, clasificación, índice
  build-tokens.mjs         generador
  test-invariancia.mjs     prueba del clasificador
```

## Cómo generar

```bash
npm run build:tokens
```

```bash
npm run test:tokens
```

El build es determinista: dos ejecuciones sobre la misma fuente producen un
archivo idéntico. Eso permite que un CI futuro reejecute la generación y falle si
el `git diff` no queda vacío — la garantía de que nadie editó el CSS a mano.

## Formato

DTCG — `$type`, `$value`, `$description`. Los tipos usados son **`color`**,
**`dimension`**, **`duration`**, **`cubicBezier`** y **`number`**.

DTCG todavía **no tiene modos nativos**. Los modos viven en
`$extensions["com.iatec.nephos"].modes`, y el generador los aplica antes de
entregar el árbol a Style Dictionary. `$value` guarda siempre el valor del modo
por defecto, para que cualquier herramienta genérica resuelva algo correcto.

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

**Un token sin bloque `modes` es invariante entre los modos de su capa.**

## Invariante × variante

La clasificación compara **alias y valor final** entre los modos, en una
representación **canónica** — nunca por identidad de objeto, nunca por orden de
clave, nunca por el `$type`. Está probada en `scripts/test-invariancia.mjs`.

De los 147 semánticos: **53 invariantes** y **94 variantes**. Los 94 son todos
`color`. Entre los 53 hay **9 tokens `color`** — la invariancia no es una
propiedad del tipo.

## Actualización del 25-08-2026 — tokens de Button

Los tres tokens siguientes fueron aprobados en Figma y sincronizados en la fuente
técnica:

| Token | Tipo DTCG | Claro | Oscuro |
|---|---|---|---|
| `color/destructive-foreground` | `color` | `{core.base.white}` | `{core.neutral.950}` |
| `color/secondary-hover` | `color` | `{core.neutral.200}` | `{core.surface.700}` |
| `state/hover-opacity` | `number` | `0.95` | `0.95` |

`state/disabled-opacity` permanece en `number = 0.5`.

En Figma la opacidad se informa como porcentaje: 95 y 50. En el JSON y en el CSS
es una fracción: `0.95` y `0.5`. El generador ya emite tokens de tipo `number`
correctamente; no existe transformación adicional de opacidad.

**Invariante no quiere decir fijo.** `sidebar/primary` tiene el mismo alias en
claro y oscuro, así que sale una vez en `:root` — pero lo que sale es
`var(--nph-theme-brand-600)`, que sigue cambiando con `data-nph-brand`.

## Actualización del 27-08-2026 — capa de tipografía

Los 14 papeles de texto salieron de la lista de aplazados. Cada papel emite
**cinco** custom properties, no una:

```css
--nph-text-label-md-font-family
--nph-text-label-md-font-size
--nph-text-label-md-line-height
--nph-text-label-md-font-weight
--nph-text-label-md-letter-spacing
```

Son cinco porque `letter-spacing` no cabe en el atajo `font` de CSS y porque un
componente muchas veces necesita una propiedad aislada. El campo `css` de cada
papel en `design.md` pasa a leerse como **prefijo**, no como nombre final.

La familia es la única parte que se convierte en alias:
`--nph-text-label-md-font-family` apunta a `--nph-core-font-sans`. Tamaño, altura
de línea, peso y espaciado son literales en el papel, exactamente como
`design.md` ya los escribía en el bloque `valores`.

El formato de cinco propiedades fue aprobado por Elvys el 28/08/2026 (P62.2).

La salvedad de unidad **ya no existe**: las dimensiones salían en `px` y, desde
el 28/08/2026, salen en `rem` — ver la sección de abajo.

## Actualización del 28-08-2026 — dimensiones en `rem`

El generador emitía `px` para todo `dimension`, mientras `design.md` ya prometía
`unidade_css: rem, raiz 16px`. **Decisión de Elvys en la P62.4, el 28/08/2026:**
el contrato no cambia; el código pasa a cumplirlo.

El transform `nephos/dimension/rem` divide el valor por **16** y emite `rem`. El
valor cero sale como `0`, sin unidad.

```css
--nph-core-space-400: 1rem;        /* era 16px */
--nph-core-control-height-default: 2.25rem;  /* era 36px */
--nph-text-body-md-font-size: 0.875rem;      /* era 14px */
--nph-text-heading-xl-letter-spacing: -0.0125rem;  /* era -0.2px */
```

**El radio sigue en `px`, y no es un olvido.** El bloque `raio_regras` de
`design.md` declara `unidade_css: px` y explica el motivo: el radio en `rem`
crecería con la fuente del usuario y la pieza cambiaría de **forma**, no de
tamaño — un botón de 6px se volvería cápsula. Es la única fundación que el
contrato declara en `px`, así que `core/radius` queda fuera de la conversión,
por regla escrita y no por excepción improvisada.

El valor computado no cambia con la raíz por defecto de 16px: `1rem` sigue
resolviendo a `16px`. Lo que cambia es que ahora la interfaz acompaña la
preferencia de tamaño de fuente del usuario.

## Consumo — dos atributos independientes

Marca y esquema de color son **dimensiones independientes**: un producto puede
estar en Educação + oscuro sin que nada se reautore.

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

| Atributo | Valores | Valor por defecto |
|---|---|---|
| `data-nph-brand` | `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh` | `sistemas` |
| `data-nph-color-scheme` | `light`, `dark` | `light` |

Los valores de `data-nph-brand` son los nombres de las verticales de IATec. Las
claves internas del JSON usan `claro` y `escuro`, reflejando los modos de Figma;
el mapeo a `light`/`dark` está declarado en `modeSet.valorPublico`.

Omitir los dos atributos entrega Sistemas en claro, porque cada bloque por
defecto se emite también en `:root`.

## Estructura del CSS generado

```css
:root { --nph-core-sistemas-600: #2f68c5; }                       /* capa 1 */
:root, [data-nph-brand="sistemas"] { --nph-theme-brand-600: var(--nph-core-sistemas-600); }
[data-nph-brand="educacao"]        { --nph-theme-brand-600: var(--nph-core-educacao-700); }
:root { --nph-sidebar-primary: var(--nph-theme-brand-600); }      /* invariantes */
:root, [data-nph-color-scheme="light"] { --nph-color-primary: var(--nph-theme-brand-600); }
[data-nph-color-scheme="dark"]         { --nph-color-primary: var(--nph-theme-brand-400); }
```

Los alias se convierten en `var()`, nunca en literales. Solo la capa `core` lleva
valor literal.

## Validaciones del generador

El build **falla** — con código 1 y mensaje específico — cuando:

**En la fuente**

1. aparece un `$type` fuera de los cinco tratados;
2. un token declara `modes` y falta el valor para algún modo de la capa;
3. una referencia `{...}` apunta a un token que no existe en ninguna fuente;
4. el conteo de tokens de una capa no coincide con `contagemEsperada`.

**En la salida**

5. queda una referencia `{...}` sin resolver;
6. algún valor sale como `[object Object]`;
7. un token que es referencia en la fuente sale aplanado como literal;
8. un invariante se emite más de una vez, o un variante no se emite una vez por
   modo.

## Qué queda fuera de esta ronda

| Ítem | Situación |
|---|---|
| 20 primitivos de la **P46** | **Excluidos por decisión registrada** — `core/radius` 700–1000, `core/space` 1200–1500 y los 12 fuera de escala. Mientras estén en esa lista, no entran en el JSON. |
| Los otros 151 primitivos `core` | **Aplazados.** No son alcanzables desde la capa `semantic`, lo que **no** significa que no tengan consumidor. De estos, **24 son `core/sombra`, con consumidor conocido** en los estilos `elevation/*`. Los otros 127 siguen aplazados sin juicio sobre consumidor. |
| 11 estilos de efecto | **Aplazados.** No son variables; exigen otro camino de extracción. |
| 14 estilos de texto | **Migrados el 27/08/2026.** Dejaron de estar aplazados. No son variables de Figma: los valores se leyeron de los estilos de texto y se cotejaron contra `tokens_typography` de `design.md`, ítem por ítem, sin divergencia. Cada papel se convirtió en cinco tokens en `semantic.text`, y las dos familias entraron en `core.font`. |

## Limitación conocida de la herramienta

Style Dictionary 5.5.2 serializa `duration` en la forma estructurada del DTCG
(`{ value, unit }`) como `[object Object]`. La fuente **permanece estructurada**,
como manda el DTCG; la conversión a `250ms` ocurre solo en la salida, mediante el
transformador `nephos/duration/css` registrado en `scripts/build-tokens.mjs`. La
validación 6 existe para que esa clase de fallo nunca pase en silencio.

## Cómo cambiar un valor

1. Cámbielo en **Figma** — es la fuente visual.
2. Actualice `src/tokens/source/*.tokens.json`.
3. Ejecute `npm run build:tokens` y verifique que pasó.
4. Registre evidencia, fecha y responsable, conforme al `GOVERNANCA.md`.

Nunca edite `src/tokens/generated/`. Nunca escriba un valor literal en el CSS de
un componente: los componentes consumen **solo tokens semánticos**.
