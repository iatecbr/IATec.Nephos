<!-- i18n: lang=es | source=README.md | source-sha256=4ce2c0eeff51f18a19ed79801c4c52ace7846d41032b30bda54fa2df3d2340cf | status=revisado -->

# Nephos 5.0

[Português (BR)](README.md) · [English](README.en.md) · **Español**

> Traducido de la fuente en portugués de Brasil, [`README.md`](README.md).
> Si ambos difieren, prevalece el archivo en portugués.

Nephos es el Design System de IATec. Conecta fundamentos definidos en Figma, Web
Components escritos en Lit, documentación consultable y validación visual y de
comportamiento.

> **En construcción.** Lo que ya está disponible para usar — componentes,
> variantes, estados y reglas — está en Storybook, generado a partir del propio
> código. Ejecute `npm run storybook` para consultarlo. Este README no mantiene
> conteo de progreso: el avance por fase es registro interno, no documentación
> de uso.

## Qué entrega Nephos

- Web Components con prefijo `nph-`, escritos en Lit.
- Tokens y reglas de uso definidos en el contrato `design.md`.
- Documentación de componentes, bloques, layouts y templates.
- Stories y validación en Storybook.
- Ejemplos de consumo para Vue, Angular y Blazor.

Nephos no depende de PrimeNG, shadcn/ui, Radix, Tailwind ni de ningún otro
framework de componentes. El UI kit Obra es una referencia visual y estructural,
no una dependencia de código.

## Cómo ejecutar Storybook

Requiere Node.js y npm. Validado con Node 24.18.0 y npm 11.16.0.

```bash
npm install
```

```bash
npm run storybook
```

Storybook se levanta en `http://localhost:6006`.

Para generar la versión estática en `storybook-static/`:

```bash
npm run build-storybook
```

## Tokens

Los valores auditados en Figma viven en `src/tokens/source/*.tokens.json`. El CSS
se **genera** a partir de ellos y **nunca debe editarse a mano**.

```bash
npm run build:tokens
```

```bash
npm run test:tokens
```

El formato, los modos, las validaciones y el alcance están detallados en
[`docs/tokens.es.md`](docs/tokens.es.md).

### Consumir los temas

Marca y esquema de color son **dimensiones independientes**. Ponga los dos
atributos en el elemento raíz e importe el CSS generado:

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

| Atributo | Valores | Valor por defecto |
|---|---|---|
| `data-nph-brand` | `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh` | `sistemas` |
| `data-nph-color-scheme` | `light`, `dark` | `light` |

Omitir ambos entrega Sistemas en claro.

El workflow de CI y la publicación todavía no existen — su dirección está fijada
por la P19, en [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md), que se
mantiene solo en portugués.

## Decisiones técnicas vigentes

Las decisiones P01, P02, P03, P17, P19, P20 y P21 están registradas en
[`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md).

**Estado: adoptada por Indiane el 24/08/2026 (P21 el 26/08/2026) — revisada y
aprobada por Elvys el 28/08/2026.** Las reglas deben seguirse en el trabajo
actual, salvo orientación posterior de Elvys que las sustituya.

| | Tema | Decisión |
|---|---|---|
| **P01** | Encapsulamiento de los componentes | Shadow DOM abierto |
| **P02** | Personalización y exposición de CSS | CSS custom properties como API pública; `::part` para partes internas; las clases internas no son API |
| **P03** | Organización del proyecto | `src/components/<nome>/` con implementación, CSS, story y prueba juntos; `src/tokens/` con `source` y `generated`; `src/styles/`; `src/shared/`; `docs/` |
| **P17** | Formato y consumo de tokens | JSON como formato fuente versionado; CSS custom properties como formato generado |
| **P19** | Storybook, pruebas y publicación | Mantener `@storybook/web-components-vite`; build en CI para pull requests, como artefacto privado |
| **P20** | Herramienta de generación y contrato de temas | Style Dictionary v5; `data-nph-brand` y `data-nph-color-scheme` (`light`/`dark`); namespace `com.iatec.nephos` |
| **P21** | Plan técnico del primer componente | El contrato de `nph-icon`; TypeScript estricto; stories junto al componente; Vitest en modo browser |

Esa nota trae el motivo, el alcance, el impacto y lo que quedó fuera de alcance
en cada decisión. Es la fuente de la regla: si difiere de este README, prevalece
la nota.

El package manager es **npm** y el framework de Storybook es
**`@storybook/web-components-vite`**. Ambos entraron como elección de bootstrap y
fueron consolidados por la P19.

### Qué sigue fuera de alcance

Siguen fuera del repositorio: el workflow de CI, la publicación pública y el
deploy. También quedan fuera los 20 primitivos de la P46 y, aplazados para una
ronda futura, los demás primitivos — aplazado no significa sin consumidor. Los 11
estilos de efecto dejaron de estar aplazados el 03-09-2026 — los ocho niveles de
elevación y los tres anillos de foco.

## Fuentes de verdad

| Tema | Fuente |
|---|---|
| Valores de token y decisiones visuales | Figma `DS-IA-NEPHOS 5.0` |
| Contrato técnico y reglas de uso | `design.md`, en la raíz de este repositorio |
| Valores de token versionados | `src/tokens/source/*.tokens.json`; ver [`docs/tokens.es.md`](docs/tokens.es.md) |
| Decisiones técnicas P01, P02, P03, P17, P19, P20 y P21 | [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) |
| Gobernanza, precedencia y preflight | `GOVERNANCA.md` |
| Instrucciones para agentes | `AGENTS.md` y `CLAUDE.md` |
| Implementación entregada | Branch, commit, PR y Storybook de este repositorio |
| Ficha y regla de elección de una pieza | `fichas/<nome>.md`, con la plantilla en `fichas/_modelo.md` |

Ante una laguna o un conflicto, no invente una decisión: deténgase y pida
confirmación.

## Flujo por componente

1. Clonar en Figma `DS-IA-NEPHOS 5.0` el componente estructuralmente equivalente
   del UI kit Obra.
2. Configurar la pieza solo con tokens Nephos y aprobarla visualmente en Figma.
3. Crear o completar su ficha, incluyendo variantes, estados, accesibilidad,
   relaciones y antipatrones.
4. Implementar el Web Component en Lit en el repositorio.
5. Crear stories para variantes y estados, y validar comportamiento, teclado,
   foco y accesibilidad.

Ningún componente puede implementarse en el repositorio antes de su aprobación
en Figma.

## Primer recorte P0

1. `nph-button`
2. `nph-label`
3. `nph-input`
4. `nph-field`
5. `nph-checkbox`

Los demás componentes no entran en el P0 por defecto. La lista completa de la v1
— 75 componentes públicos en 6 ondas — se cerró el 26-08-2026 y se mantiene
fuera de este repositorio.

## Taxonomía

| Nivel | Descripción |
|---|---|
| Componente | Pieza reutilizable, pública y aislada. |
| Bloque | Composición reutilizable de componentes para una función de interfaz. |
| Layout | Estructura espacial recurrente de una pantalla. |
| Template | Estructura de un flujo o tipo de pantalla que combina layouts y bloques. |

Bloques, layouts y templates solo pueden documentarse después de extraerse de
una pantalla real o de un mock aprobado.

## Versiones de idioma

Este repositorio publica su documentación de uso en portugués (BR), inglés y
español. El portugués es la fuente; ver [`docs/i18n.md`](docs/i18n.md) para la
convención.

## Licencia

Unlicense. Ver `LICENSE`.
