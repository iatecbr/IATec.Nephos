# Guia de desenvolvimento de componentes

Esta nota existe só em `pt-BR`: é instrução interna para quem mantém o
repositório, não documentação de uso. Ver [`i18n.md`](i18n.md).

## Para que serve

Este guia diz **como se constrói um componente do Nephos neste repositório** — o
que o código precisa declarar, como as stories provam o contrato e o que os
testes têm de cobrir.

Ele não decide nada. Toda regra abaixo foi **extraída de prática que já existe
no repositório**, e cada uma declara de onde veio e até onde vale.

## O que este guia não é

- **Não é a ficha.** A ficha da peça é canônica em `fichas/<nome>.md`, com o
  gabarito em [`../fichas/_modelo.md`](../fichas/_modelo.md). Este guia não
  repete o contrato de um componente: diz como código, stories e testes se
  comportam diante dele.
- **Não é o contrato de token.** Isso é o [`../design.md`](../design.md).
- **Não é a decisão técnica.** As decisões numeradas moram em
  [`decisoes-tecnicas.md`](decisoes-tecnicas.md). Aqui elas são citadas, nunca
  reescritas.
- **Não é um segundo contrato.** O Storybook é superfície derivada da ficha —
  ver [`operacao/README.md`](operacao/README.md), §7.

## Como ler

Cada regra fecha com duas linhas:

- **Fonte** — onde a prática existe no repositório, com arquivo e trecho.
- **Limite** — até onde ela vale, e quantos componentes a sustentam.

**Regra sem prática verificável neste repositório não está aqui.** O que falta
está na §7, nomeado.

Quando uma regra é sustentada por um componente só, isso está escrito no Limite.
Um caso não vira norma geral por conveniência.

---

## 1. A ordem

Nenhum componente entra no repositório antes da aprovação visual no Figma. A
sequência que as fontes **deste repositório** sustentam é:

**Figma aprovado → ficha completa, sem pendência → código, stories e testes.**

**Fonte:** [`../README.md`](../README.md), "Fluxo por componente", passos 2 a 5, e
a frase *"Nenhum componente pode ser implementado no repositório antes de sua
aprovação no Figma"*; [`../AGENTS.md`](../AGENTS.md), "Regras obrigatórias":
*"primeiro derive a referência estrutural do Obra no Figma, configure-a com tokens
Nephos e obtenha aprovação visual. Só então implemente no repositório"*. O que
conta como ficha completa está em [`../fichas/_modelo.md`](../fichas/_modelo.md),
§7, critério 1: *"a ficha responde a todos os itens, sem campo em branco"*.

**Limite:** este guia cobre o terceiro passo — código, stories e testes.

**Comparação Figma × Storybook, evidência e aceite não são prescritos por este
guia.** Dependem do registro de planejamento e dos gates externos aplicáveis: o
[`../GOVERNANCA.md`](../GOVERNANCA.md), §1, declara que *"ordem e evidência das
fases"* vivem em *"registro de planejamento mantido pela Indiane, fora deste
repositório"*, e que quem depender dessa ordem deve parar e perguntar. Este guia
não a reproduz.

**Plano técnico também não é etapa geral deste fluxo:** o repositório tem um caso
só, a **P21**, do `nph-icon`, e um caso não é gabarito — ver §7.

---

## 2. O componente

### 2.1 Um Web Component em Lit, registrado sob guarda

Todo componente é um Web Component escrito com Lit, com prefixo estrito `nph-`.
O arquivo termina registrando a tag **uma vez só** e declarando o tipo:

```ts
const TAG = 'nph-icon';

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-icon': NphIcon;
  }
}
```

A guarda existe porque a story, o teste e o consumidor podem importar o módulo
mais de uma vez na mesma página.

**Fonte:** `src/components/nph-icon/nph-icon.ts` e
`src/components/nph-label/nph-label.ts`, blocos finais;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P03**;
[`../AGENTS.md`](../AGENTS.md), "Regras obrigatórias".
**Limite:** dois componentes. Vale para componente público `nph-*`.

### 2.2 O arquivo abre declarando o contrato e de onde ele vem

O bloco de abertura não descreve o que o código faz — isso o código já diz. Ele
declara **o contrato aprovado e a fonte dele**: a ficha, o `design.md` e a
decisão numerada ou datada.

```ts
/**
 * `nph-icon` — primeiro componente do Nephos.
 *
 * Contrato aprovado (ficha `nph-icon`, `design.md` `contrato_nph_icon`, P21):
 * - `name` obrigatorio, kebab-case, restrito aos icones do nucleo;
 * ...
 */
```

Quem abre o arquivo seis meses depois precisa saber **quem decidiu aquilo**, sem
sair dele.

**Fonte:** `nph-icon.ts`, linhas 1-17; `nph-label.ts`, linhas 1-54;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**.
**Limite:** dois componentes.

### 2.3 Exceção a decisão técnica se escreve no próprio arquivo

Quando uma peça precisa sair de uma decisão vigente, o motivo, a alternativa
descartada e a data ficam no arquivo — no componente e no CSS dele.

O `nph-label` é o único componente sem Shadow DOM, exceção declarada à **P01** e
registrada como **P62.1**. O motivo está escrito nos dois arquivos: a associação
nativa entre rótulo e controle não atravessa a fronteira do Shadow DOM, e sem
ela o rótulo perde a função.

**Fonte:** `nph-label.ts`, linhas 17-23; `nph-label.css`, linhas 3-10;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P01** e **P62.1**.
**Limite:** um componente. Esta regra descreve **como registrar** uma exceção —
ela **não autoriza abrir** nenhuma. Abrir exceção é decisão humana, com revisão
técnica.

### 2.4 Propriedade que reflete diz por quê

`reflect: true` põe a propriedade no DOM e a torna alcançável por seletor. Isso
é consequência de contrato, não detalhe: escreva o motivo ao lado.

```ts
/* `size` reflete porque o CSS interno seleciona a caixa por ele. */
size: { type: String, reflect: true },
```

**Fonte:** `nph-icon.ts`, declaração de `size`; `nph-label.test.ts`, caso
*"required reflete para atributo, para o CSS do consumidor poder mirar"*.
**Limite:** um componente documenta no código, o outro no teste. A prática é
registrar o motivo em algum lugar verificável — não há forma única.

### 2.5 Entrada inválida não renderiza, e reclama uma vez por causa

Quando o contrato é violado, o componente **não desenha nada** — sem fallback
visual — e emite um erro por causa, **somente em desenvolvimento**. A validação
acumula: cada propriedade reprovada emite o próprio erro, e não só a primeira.
Quem desenvolve precisa ver todas as causas de uma vez.

**Fonte:** `nph-icon.ts`, `devError` e `resolveDrawing`;
`nph-icon.css`, a regra `:host` que esconde o elemento sem arte;
`nph-icon.test.ts`, casos *"acumula um erro por propriedade invalida"* e
*"nao deixa fallback visual: nada dentro do shadow root"*;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**, item 4.
**Limite:** um componente. A **P21** fixou este comportamento **para o
`nph-icon`**. Outra peça que precise dele decide por conta própria, e registra.

---

## 3. O CSS

### 3.1 O CSS abre dizendo o que não é contrato

Classe e seletor internos **não são API pública** — a **P02** define que o
contrato é a custom property e o `::part`. O arquivo declara isso na abertura,
junto com a regra de que nenhum valor literal de design entra.

**Fonte:** `nph-icon.css`, linhas 1-9; `nph-label.css`, linhas 1-19;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P02**.
**Limite:** dois componentes.

### 3.2 Só token semântico

Nenhum hexadecimal, medida, raio, sombra, duração ou papel de texto escrito à
mão. Tudo sai de `var(--nph-*)`, na camada semântica.

A única quantidade que aparece literal é **relação de caixa** — `100%`, `auto`,
a espessura de uma borda de moldura —, que não é decisão visual.

**Fonte:** `nph-icon.css` e `nph-label.css`, integralmente;
[`../design.md`](../design.md), regras 3 e 4 e anti-padrões **A2** e **A25**.
**Limite:** dois componentes.

---

## 4. As stories

### 4.1 Dois papéis: `Validação` prova, `Docs` explica

`Componentes/<peça>/Validação` prova o contrato com o componente real
renderizado. `Componentes/<peça>/Docs` é leitura e catálogo — e não prova nada.

**`Validação` é obrigatória. `Docs` não é.**

**Fonte:** [`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**, item 8,
aprovada em 28/08/2026; `nph-icon.stories.ts` e `nph-icon.docs.stories.ts`.
**Limite:** dois componentes têm os dois papéis: o `nph-icon` e o `nph-label`.
`Docs` entra quando houver o que oferecer — no `nph-icon`, o catálogo do núcleo;
no `nph-label`, a página do quadro aceito no Figma, por decisão de Indiane de
05/10/2026 (Claude escreve a documentação do Storybook dos componentes do
lote). Não invente uma página de leitura para uma peça que não tem o que
oferecer.

### 4.2 O título e o nome dizem a afirmação

Título em `Componentes/<peça>/<papel>`. Nome de story em português, descrevendo
**o que a página afirma**, não a aparência: `Herança de cor`, `Entrada
inválida`, `Associação com o controle`, `O que o rótulo não faz`.

**Fonte:** `nph-icon.stories.ts`, `nph-icon.docs.stories.ts` e
`nph-label.stories.ts`, campos `title` e `name`.
**Limite:** dois componentes, três arquivos.

### 4.3 O arquivo abre dizendo o que as páginas provam

O bloco de topo declara o que aquele arquivo prova e **qual decisão ele
verifica**, com data quando houver:

```ts
/**
 * Stories de VALIDACAO do `nph-label`.
 *
 * Cada pagina prova uma parte do contrato aprovado (27-08-2026, 08-09-2026 e
 * 01-10-2026): a matriz `required` x `info` do conjunto `374:6`, a paridade com
 * o Figma nos dois esquemas de cor, o foco e o balao aberto do gatilho de
 * informacao (quadro `1194:1482`), a associacao com o controle e a ausencia de
 * estado proprio do texto.
 */
```

**Fonte:** `nph-icon.stories.ts` 1-14; `nph-icon.docs.stories.ts` 1-13;
`nph-label.stories.ts` 1-16.
**Limite:** dois componentes, três arquivos.

### 4.4 Cada story diz, em uma linha, o que prova

```ts
/** A cor nao e propriedade: vem de `currentColor`. */
export const HerancaDeCor: Story = { /* ... */ };
```

**Fonte:** as onze stories dos três arquivos.
**Limite:** dois componentes.

### 4.5 Cobertura, não quantidade

**Cada variante e cada estado aparece em alguma story verificável.** Uma mesma
story pode cobrir mais de uma combinação, e nenhuma combinação fica de fora. O
critério é **cobertura rastreável**, não quantidade de arquivos, páginas ou
stories.

Na prática: o `nph-label` cobre `required` × `info` numa página `Matriz`; o
`nph-icon` cobre variante, tamanho, herança de cor, acessibilidade e entrada
inválida em cinco páginas por afirmação.

**Fonte:** [`../fichas/_modelo.md`](../fichas/_modelo.md), §7, critério 5,
decisão de 09-09-2026; `nph-label.stories.ts`, story `Matriz`;
`nph-icon.stories.ts`, as cinco páginas.
**Limite:** dois componentes. A regra não impõe estrutura de arquivo.

### 4.6 Claro e escuro sem duplicar story

O esquema de cor troca por `data-nph-color-scheme`, o contrato público de tema
da **P20**. A mesma peça aparece nos dois contextos, na mesma story — não se
duplica componente por modo.

**Fonte:** `nph-label.stories.ts`, função `frame()` e cabeçalho;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P20**.
**Limite:** um componente. Só o `nph-label` tem story de modo. O quadro vence o
modo global do Storybook (§6.4) para todos os tokens semânticos: os invariantes
que dependem de marca ou de esquema também são redeclarados em cada raiz de
esquema (**P67**). Um quadro com outra marca leva `data-nph-brand` e
`data-nph-color-scheme` no mesmo elemento.

### 4.7 A moldura não é precedente

O cenário que envolve a demonstração — respiro, grade, legenda — **não vale como
precedente para CSS de componente**, e isso fica escrito onde a moldura é
definida.

Quando a moldura é compartilhada entre páginas, ela mora em um arquivo que
**não** termina em `.stories.ts`, para o glob do Storybook não indexá-la.

**Fonte:** `nph-label.stories.ts`, função `page()`; `nph-icon.stories.ts`,
cabeçalho; `nph-icon.demo.ts`, linhas 1-12.
**Limite:** dois componentes declaram o não-precedente; um usa arquivo separado.

### 4.8 O texto explicativo vem do dicionário

Uma story **nunca** é duplicada por idioma: ela lê o idioma escolhido e busca o
texto em `.storybook/i18n/`. Isso vale também para o conteúdo de exemplo das
stories de `Validação`: o texto de um rótulo, de um botão ou de um selo de
demonstração vem do dicionário. Identificadores técnicos — tags `nph-*`, nomes de
token, atributos, comandos — aparecem literais e iguais em qualquer idioma.

**Fonte:** [`i18n.md`](i18n.md), seção "Storybook"; `.storybook/i18n/index.js`,
linhas 1-12; `nph-icon.stories.ts` e `nph-icon.docs.stories.ts`, na leitura do
dicionário; `nph-label.stories.ts`, chave `labelValidation`; revisão de
`maurocsjr` no PR #54, que pediu chave de tradução para o texto de exemplo.
**Limite:** o `nph-icon`, o `nph-label` e o `nph-tooltip` cumprem a regra.

### 4.9 Numa página de leitura, toda regra aponta de onde veio

Cada bloco da página `Docs` fecha com o rodapé de origem. Nada é decidido numa
página de Storybook.

```ts
/** Rodape de origem. Toda regra exibida aponta de onde veio. */
export function source(label, origin) { /* ... */ }
```

**Fonte:** `src/shared/docs/page.ts`, função `source()`;
`nph-icon.docs.stories.ts`, onde cada seção fecha com `source(...)`.
**Limite:** um componente.

### 4.10 Página de conteúdo: os mesmos blocos em toda página `Docs`

A página de leitura de um componente é montada com os blocos de
`src/shared/docs/page.ts`, para que todas se leiam do mesmo jeito:

| Bloco | Regra |
|---|---|
| `header` | o h1 é `text/heading-lg`, um por página; o resumo é `text/body-md` |
| `index` | um link `#id` por seção, num `nav` nomeado; nenhuma âncora sem seção |
| `section` | `<section id>` com h2 em `text/heading-md` e linha embaixo; respiro maior antes do título do que depois |
| `text` e `list` | `text/body-md`, com largura de leitura limitada |
| `demo` | instâncias reais numa área **sem fundo**, só com borda, e legenda embaixo |
| `table` | com cabeçalho; o termo em `text/code`, a descrição em `text/body-sm` |
| `note` | a exceção à regra vira nota (`role="note"`), nas cores `status/*`, nunca um parágrafo comum |
| `useDontUse` e `dontDo` | quando usar e quando não usar lado a lado, nas cores `status/success-*` e `status/error-*` |
| `source` | o rodapé de origem, em `text/caption`, com linha fina acima |

Os blocos usam só `--nph-*`. A página não traz texto de processo: estado de
revisão, nomes de quem aprova e pendências ficam no registro operacional.

**Fonte:** `src/shared/docs/page.ts` e `page.test.ts`;
`nph-icon.docs.stories.ts`, story `Documentação`, e `nph-icon.docs.test.ts`.
**Limite:** um componente usa o modelo.

---

## 5. Os testes

### 5.1 O teste prova o contrato, em navegador de verdade

O teste não confere aparência: confere **o que a ficha promete**. Roda em
Chromium, com Vitest em modo browser.

**Fonte:** `nph-icon.test.ts` e `nph-label.test.ts`, cabeçalhos;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P21**, item 5.
**Limite:** dois componentes.

### 5.2 O teste confronta o código com o `design.md`

Esta é a prática mais forte do repositório. O teste **importa o contrato como
texto** e compara:

```ts
import designMd from '../../../design.md?raw';
```

No `nph-icon`, a lista dos nomes é extraída de `icones_nucleo:` no
`design.md` e comparada com o mapa fechado do componente — se a fonte mudar lá,
o teste reprova aqui. No `nph-label`, o teste verifica que o `use` de
`status/error` autoriza o asterisco e que o anti-padrão **A5** continua vigente.

**Fonte:** `nph-icon.test.ts`, função `namesFromDesignMd` e grupo que confere o núcleo
fechado; `nph-label.test.ts`, grupo *"contrato de token"*.
**Limite:** dois componentes.

### 5.3 O teste fixa a API reativa

A lista de propriedades é conferida contra a aprovada, por `elementProperties`:

```ts
expect(propriedades).toEqual(['label', 'name', 'size', 'variant']);
```

Assim, propriedade nova não entra sem alguém reprovar um teste.

**Fonte:** `nph-icon.test.ts`, *"a API reativa e exatamente name, variant, size e
label"*; `nph-label.test.ts`, *"a API publica e exatamente text, required, for,
info e infoLabel"*.
**Limite:** dois componentes.

### 5.4 O teste confirma que o token existe no CSS gerado

Consumir um token que o gerador não emite deixa a peça sem valor, em silêncio.
O teste abre o CSS gerado e confere.

**Fonte:** `nph-label.test.ts`, *"o papel text/label-md existe no CSS gerado"*.
**Limite:** um componente.

### 5.5 O teste cobre a ausência

O que a peça **não** tem e **não** faz é testado com o mesmo peso do que ela
faz: ausência de foco, de slot, de evento inventado, de propriedade recusada.

**Fonte:** `nph-icon.test.ts`, grupo *"ausencia de interacao"*;
`nph-label.test.ts`, grupo *"o que o rotulo NAO tem"*.
**Limite:** dois componentes.

---

## 6. Storybook e repositório

### 6.1 A story mora junto do componente

`src/components/<nome>/<nome>.stories.ts`. O glob do Storybook aponta para lá.

**Fonte:** `.storybook/main.js`; [`decisoes-tecnicas.md`](decisoes-tecnicas.md),
**P03** e **P19**.
**Limite:** dois componentes.

### 6.2 O preview carrega o CSS gerado, que ninguém edita

Sem ele, uma custom property de token resolveria vazio e nenhuma caixa teria
tamanho. O arquivo é **gerado** a partir do JSON: nunca se edita
`src/tokens/generated/tokens.css` à mão.

O preview também carrega as fontes do Nephos — Noto Sans e IBM Plex Mono —
pelo `@fontsource`, sem chamada externa, e aplica fonte, fundo e cor da página
por `--nph-*`. Os tokens só declaram a família: sem esse carregamento, a página
cai na fonte padrão do navegador.

**Fonte:** `.storybook/preview.js`;
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P17** e **P20**.
**Limite:** regra escrita e aplicada; não depende de componente.

### 6.3 Branch, commit e PR seguem o `contributing.md`

**Fonte:** [`../contributing.md`](../contributing.md).
**Limite:** convenção registrada no repositório; nenhum componente a sustenta
ainda.

### 6.4 Seletor de modo: um modo por vez

A barra de ferramentas tem um seletor único de modo, ao lado do idioma. Ele muda
o global `colorScheme` (`light` ou `dark`), e os dois lados trocam juntos: a
moldura, pelo tema do `manager.js`, e a página, pelo `data-nph-color-scheme` que
o decorator do `preview.js` aplica na raiz. Não existe moldura clara com página
escura, nem o contrário.

A moldura segue a identidade Solutions, com o destaque `#1FBFFF` e a tinta
`#031A24` por cima. Esses hex vivem só em `.storybook/manager.js` e
`.storybook/manager-head.html`. No modo claro, o azul aparece só como fundo:
texto e ícone ficam em neutro, porque `#1FBFFF` sobre branco não passa no
contraste. A página continua só com `--nph-*`.

O `manager-head.html` depende de atributos internos do Storybook
(`data-nodetype`, `data-selected`). Ao atualizar o Storybook, confira o item
selecionado da barra lateral nos dois modos.

**Fonte:** `.storybook/manager.js`, `.storybook/manager-head.html`,
`.storybook/preview.js`; [`decisoes-tecnicas.md`](decisoes-tecnicas.md), **P20**.
**Limite:** regra do Storybook; não muda API de componente.

---

## 7. O que este guia não cobre

**Componentes sem código verificável em `src/components/` não sustentam regras
de implementação neste guia.** Hoje isso vale para `nph-spinner`, `nph-button` e
`nph-field`: nenhum dos três tem código em `src/components/`, e por isso nenhuma
regra deste guia se apoia neles.

**Fonte:** `git ls-tree --name-only origin/v/3.0.0 src/components/` devolve
`src/components/nph-icon` e `src/components/nph-label`, e nada mais.
**Limite:** a afirmação é sobre ausência de código no repositório, e nada além
disso.

As demais lacunas, nomeadas para não parecerem regra:

| O que falta | Por que não está aqui |
|---|---|
| Como se mede a comparação Figma × Storybook | O passo existe no gate, mas **nenhum artefato deste repositório** registra uma medição. Sem prática verificável, não vira regra |
| Gabarito de plano técnico | Existe um só, a **P21**, para o `nph-icon`. Um caso não é gabarito |
| Tamanho de PR, captura de tela, link de pré-visualização | O `contributing.md` pede PR pequeno **sem número**, e não trata de captura nem de pré-visualização. A **P19** prevê o Storybook como artefato privado de CI, e **a CI não existe** |
| A bateria completa de validações | Os comandos estão no `package.json` — `build:tokens`, `test:tokens`, `typecheck`, `test`, `test:i18n`, `build-storybook` e `test:operacao`. A obrigação de rodar todos, e em que ordem, **não tem fonte neste repositório** |
| `meta.ts` e `metadata.ts` | **Proibidos.** A regra `V27` do verificador reprova os dois nomes dentro de `src/components/`. A ficha é a fonte; a Metadata deriva dela, gerada em `src/shared/metadata/` por `node scripts/verificar-operacao.mjs --gerar-metadata` (P63) |

---

## 8. Divergências abertas

Registradas aqui porque quem for construir um componente vai esbarrar nelas.
**Este guia não escolhe lado.**

| Assunto | As fontes, e o que cada uma diz |
|---|---|
| `variant="solid"` no `nph-icon` | O [`../design.md`](../design.md), a **P21** e a ficha definem `regular` como padrão e `solid` como disponível para cada nome do núcleo. A decisão **I7** originou a ampliação e a `DSA-03` foi concluída |

---

*Procedência: todas as regras deste guia são **prática verificável** deste
repositório, lidas na baseline `20882bf` em 09-09-2026, arquivo a arquivo. As
decisões numeradas citadas — P01, P02, P03, P17, P19, P20, P21 e P62.1 — não são
reescritas aqui: a fonte é [`decisoes-tecnicas.md`](decisoes-tecnicas.md). Onde
uma regra é sustentada por um componente só, o Limite diz isso. O que não tem
prática verificável está na §7 como lacuna, e não como regra.*
