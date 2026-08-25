# Tokens — fonte, geração e consumo

> **Status:** a migração-base dos 289 itens auditados foi concluída em
> 24/08/2026 e mergeada na `v/3.0.0`. Em 25/08/2026, três tokens aprovados no
> Figma para `nph-button` foram sincronizados localmente: a fonte técnica soma
> 292 itens. Nenhum componente `nph-*` foi implementado.

Esta nota explica **como os tokens vivem no repositório**. O que cada token
significa, quando usar e quando não usar está no [`design.md`](../design.md), que
não duplica valores. Os valores nascem no Figma `DS-IA-NEPHOS 5.0`.

## Fonte de verdade por responsabilidade (P17)

| Camada | Papel |
|---|---|
| **Figma `DS-IA-NEPHOS 5.0`** | Fonte visual. Define e valida valores, modos, aliases e intenção. |
| **`design.md`** | Contrato humano e agêntico: uso, acessibilidade, nomenclatura, anti-padrões. **Não é o arquivo de geração.** |
| **`src/tokens/source/*.tokens.json`** | Fonte técnica versionada dos valores auditados. **É o que se edita.** |
| **`src/tokens/generated/tokens.css`** | Artefato gerado. **NUNCA edite à mão.** |

## Arquivos

```text
src/tokens/
  source/
    core.tokens.json       139 primitivos
    theme.tokens.json        6 variáveis de marca, sete modos
    semantic.tokens.json   147 tokens semânticos, dois esquemas de cor
  generated/
    tokens.css             422 declarações — GERADO
scripts/
  tokens-lib.mjs           funções puras: forma canônica, classificação, índice
  build-tokens.mjs         gerador
  test-invariancia.mjs     prova do classificador
```

## Como gerar

```bash
npm run build:tokens
```

```bash
npm run test:tokens
```

O build é determinístico: duas execuções sobre a mesma fonte produzem arquivo
idêntico. Isso permite, no CI futuro, reexecutar a geração e falhar se o `git
diff` não for vazio — a garantia de que ninguém editou o CSS à mão.

## Formato

DTCG — `$type`, `$value`, `$description`. Os tipos usados são **`color`**,
**`dimension`**, **`duration`**, **`cubicBezier`** e **`number`**.

O DTCG ainda **não tem modos nativos**. Os modos vivem em
`$extensions["com.iatec.nephos"].modes`, e o gerador os aplica antes de entregar
a árvore ao Style Dictionary. `$value` guarda sempre o valor do modo padrão, para
que qualquer ferramenta genérica resolva algo correto.

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

**Um token sem bloco `modes` é invariante entre os modos da sua camada.**

## Invariante × variante

A classificação compara **alias e valor final** entre os modos, numa
representação **canônica** — nunca por identidade de objeto, nunca por ordem de
chave, nunca pelo `$type`. Está provada em `scripts/test-invariancia.mjs`.

Dos 147 semânticos: **53 invariantes** e **94 variantes**. Os 94 são todos
`color`. Entre os 53 há **9 tokens `color`** — a invariância não é uma
propriedade do tipo.

## Atualização de 25-08-2026 — tokens de Button

Os três tokens abaixo foram aprovados no Figma e sincronizados na fonte técnica:

| Token | Tipo DTCG | Claro | Escuro |
|---|---|---|---|
| `color/destructive-foreground` | `color` | `{core.base.white}` | `{core.neutral.950}` |
| `color/secondary-hover` | `color` | `{core.neutral.200}` | `{core.surface.700}` |
| `state/hover-opacity` | `number` | `0.95` | `0.95` |

`state/disabled-opacity` permanece `number = 0.5`.

No Figma, opacidade é informada como percentual: 95 e 50. No JSON e no CSS,
ela é uma fração: `0.95` e `0.5`. O gerador já emite tokens do tipo `number`
corretamente; não existe transformação adicional de opacidade.

**Invariante não quer dizer fixo.** `sidebar/primary` tem o mesmo alias em claro
e escuro, então sai uma vez em `:root` — mas o que sai é
`var(--nph-theme-brand-600)`, que continua trocando com `data-nph-brand`.

## Consumo — dois atributos independentes

Marca e esquema de cor são **dimensões independentes**: um produto pode estar em
Educação + escuro sem nada ser reautorado.

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

| Atributo | Valores | Padrão |
|---|---|---|
| `data-nph-brand` | `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh` | `sistemas` |
| `data-nph-color-scheme` | `light`, `dark` | `light` |

Os valores de `data-nph-brand` são os nomes das verticais da IATec. As chaves
internas do JSON usam `claro` e `escuro`, espelhando os modos do Figma; o
mapeamento para `light`/`dark` está declarado em `modeSet.valorPublico`.

Omitir os dois atributos entrega Sistemas no claro, porque cada bloco padrão é
emitido também em `:root`.

## Estrutura do CSS gerado

```css
:root { --nph-core-sistemas-600: #2f68c5; }                       /* camada 1 */
:root, [data-nph-brand="sistemas"] { --nph-theme-brand-600: var(--nph-core-sistemas-600); }
[data-nph-brand="educacao"]        { --nph-theme-brand-600: var(--nph-core-educacao-700); }
:root { --nph-sidebar-primary: var(--nph-theme-brand-600); }      /* invariantes */
:root, [data-nph-color-scheme="light"] { --nph-color-primary: var(--nph-theme-brand-600); }
[data-nph-color-scheme="dark"]         { --nph-color-primary: var(--nph-theme-brand-400); }
```

Aliases viram `var()`, nunca literais. Só a camada `core` carrega valor literal.

## Validações do gerador

O build **falha** — com código 1 e mensagem específica — quando:

**Na fonte**

1. aparece um `$type` fora dos cinco tratados;
2. um token declara `modes` e falta valor para algum modo da camada;
3. uma referência `{...}` aponta para token que não existe em nenhuma fonte;
4. a contagem de tokens de uma camada não bate com `contagemEsperada`.

**Na saída**

5. sobra referência `{...}` não resolvida;
6. algum valor sai como `[object Object]`;
7. um token que é referência na fonte sai achatado em literal;
8. um invariante é emitido mais de uma vez, ou um variante não é emitido uma vez
   por modo.

## O que está fora desta rodada

| Item | Situação |
|---|---|
| 20 primitivos da **P46** | **Excluídos por decisão registrada** — `core/radius` 700–1000, `core/space` 1200–1500 e os 12 fora de escala. Enquanto estiverem nessa lista, não entram no JSON. |
| 151 demais primitivos `core` | **Adiados.** Não são alcançáveis a partir da camada `semantic`, o que **não** significa que não tenham consumidor. Destes, **24 são `core/sombra`, com consumidor conhecido** nos estilos `elevation/*`. Os outros 127 seguem adiados sem juízo sobre consumidor. |
| 11 estilos de efeito · 14 estilos de texto | **Adiados.** Não são variáveis; exigem outro caminho de extração. |

## Limitação conhecida da ferramenta

O Style Dictionary 5.5.2 serializa `duration` na forma estruturada do DTCG
(`{ value, unit }`) como `[object Object]`. A fonte **permanece estruturada**,
como manda o DTCG; a conversão para `250ms` acontece só na saída, pelo
transformador `nephos/duration/css` registrado em `scripts/build-tokens.mjs`. A
validação 6 existe para que essa classe de falha nunca passe silenciosa.

## Como alterar um valor

1. Altere no **Figma** — ele é a fonte visual.
2. Atualize `src/tokens/source/*.tokens.json`.
3. Rode `npm run build:tokens` e confira que passou.
4. Registre evidência, data e responsável, conforme o `GOVERNANCA.md`.

Nunca edite `src/tokens/generated/`. Nunca escreva valor literal no CSS de um
componente: componentes consomem **apenas tokens semânticos**.
