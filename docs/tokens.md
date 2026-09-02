# Tokens — fonte, geração e consumo

**Português (BR)** · [English](tokens.en.md) · [Español](tokens.es.md)

> **A fonte técnica soma 364 tokens**, dos quais 217 semânticos. A migração-base
> de 289 itens foi concluída em 24/08/2026; os três tokens aprovados no Figma
> para `nph-button` entraram em 25/08/2026, no commit `505e36d`, levando a fonte
> a 292. Cada camada declara a própria contagem em `contagemEsperada`, e
> `npm run build:tokens` reprova quando a camada diverge do que declarou.
>
> Em 27/08/2026 entrou a **camada de tipografia**: as duas famílias de fonte em
> `core` e os **14 papéis de texto** em `semantic`, cada um com cinco
> propriedades — 141 `core`, 6 `theme` e 217 `semantic`. O motivo foi concreto: o
> `nph-label` é o primeiro componente feito de texto puro, e sem `text/label-md`
> em código ele não podia existir sem valor literal.

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
    core.tokens.json       141 primitivos
    theme.tokens.json        6 variáveis de marca, sete modos
    semantic.tokens.json   217 tokens semânticos, dois esquemas de cor
  generated/
    tokens.css             494 declarações — GERADO
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

## Atualização de 27-08-2026 — camada de tipografia

Os 14 papéis de texto saíram da lista de adiados. Cada papel emite **cinco**
custom properties, não uma:

```css
--nph-text-label-md-font-family
--nph-text-label-md-font-size
--nph-text-label-md-line-height
--nph-text-label-md-font-weight
--nph-text-label-md-letter-spacing
```

São cinco porque `letter-spacing` não cabe no atalho `font` do CSS e porque um
componente muitas vezes precisa de uma propriedade isolada. O campo `css` de
cada papel no `design.md` passa a ser lido como **prefixo**, não como nome
final.

A família é a única parte que vira alias: `--nph-text-label-md-font-family`
aponta para `--nph-core-font-sans`. Tamanho, altura de linha, peso e
espaçamento são literais no papel, exatamente como o `design.md` já os escrevia
no bloco `valores`.

O formato de cinco propriedades foi aprovado por Elvys em 28/08/2026 (P62.2).

A ressalva de unidade **deixou de existir**: as dimensões saíam em `px`, e a
partir de 28/08/2026 saem em `rem` — ver a seção abaixo.

## Atualização de 28-08-2026 — dimensões em `rem`

O gerador emitia `px` para todo `dimension`, enquanto o `design.md` já prometia
`unidade_css: rem, raiz 16px`. **Decisão de Elvys na P62.4, em 28/08/2026:** o
contrato não muda; o código passa a cumpri-lo.

O transform `nephos/dimension/rem` divide o valor por **16** e emite `rem`.
Valor zero sai como `0`, sem unidade.

```css
--nph-core-space-400: 1rem;        /* era 16px */
--nph-core-control-height-default: 2.25rem;  /* era 36px */
--nph-text-body-md-font-size: 0.875rem;      /* era 14px */
--nph-text-heading-xl-letter-spacing: -0.0125rem;  /* era -0.2px */
```

**Raio continua em `px` — decisão de Indiane em 28/08/2026, registrada como
P62.5.** O `raio_regras` do `design.md` declara `unidade_css: px` e explica o
motivo: raio em `rem` cresceria com a fonte do usuário, e a peça mudaria de
**forma**, não de tamanho — um botão de 6px viraria cápsula. `px` e `rem` se
comportam igual no zoom do navegador; a diferença aparece só na preferência de
fonte do usuário. É a única fundação que o contrato declara em `px`, e a P62.5
a confirma em vez de alterá-la.

O valor computado não muda com a raiz padrão de 16px: `1rem` continua
resolvendo para `16px`. O que muda é que agora a interface acompanha a
preferência de tamanho de fonte do usuário.

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
| 11 estilos de efeito | **Adiados.** Não são variáveis; exigem outro caminho de extração. |
| 14 estilos de texto | **Migrados em 27/08/2026.** Deixaram de ser adiados. Não são variáveis do Figma: os valores foram lidos dos estilos de texto e conferidos contra `tokens_typography` do `design.md`, item a item, sem divergência. Cada papel virou cinco tokens em `semantic.text`, e as duas famílias entraram em `core.font`. |

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
