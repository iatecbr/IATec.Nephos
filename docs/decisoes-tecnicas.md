# Decisões técnicas — Nephos

Esta é a **fonte única** das decisões técnicas P01, P02, P03, P17, P19, P20,
P21 e P62. Em caso de divergência entre este arquivo e qualquer outro documento
do repositório, prevalece este.

## Fila de revisão técnica — Elvys

Registro de tudo que esperava revisão dele, em um lugar só. A coluna **Se ele
discordar** dizia o custo de mudar de ideia, para priorizar a leitura; a coluna
**Revisão de Elvys** registra o resultado.

**Revisão concluída em 28/08/2026**, item a item, em sessão de trabalho com
Claude Code. Elvys aprovou como estavam registradas todas as decisões abaixo,
exceto a P62.4, que ele resolveu de forma diferente da registrada (ver a
subseção P62.4 para o detalhe).

| # | Decisão | Adotada em | Se ele discordar | Revisão de Elvys |
|---|---|---|---|---|
| **P62.3** | `for` e `text` como API do `nph-label` | 27/08/2026 | **Barato agora, caro depois.** O `nph-input` e o `nph-field` serão construídos sobre elas | Aprovada, 28/08/2026 |
| **P62.2** | Formato dos tokens de tipografia: cinco propriedades por papel | 27/08/2026 | Médio. Os valores não mudam, só a emissão e o CSS que os consome | Aprovada, 28/08/2026 |
| **P62.1** | `nph-label` sem Shadow DOM — exceção à P01 | 27/08/2026 | Alto. É a única forma de a associação nativa funcionar; sem ela o rótulo perde a função | Aprovada, 28/08/2026 |
| **P62.4** | Dimensões em `px`, e não `rem` | 27/08/2026 | Alto e antigo. Vale para o sistema inteiro, não só tipografia | Resolvida por decisão própria: migrar o gerador para `rem` — 28/08/2026. **Implementada em 28/08/2026** |
| **P62.5** | O raio continua em `px` | 28/08/2026 | Baixo. Converter depois é uma linha no gerador, mas exige alterar `raio_regras` no `design.md` | **Nova — adotada por Indiane em 28/08/2026, aguardando revisão de Elvys.** Resolve a contradição de escopo da P62.4 |
| **P01** | Shadow DOM aberto | 24/08/2026 | Alto. Todo componente depende | Aprovada, 28/08/2026 |
| **P02** | Custom properties como API pública | 24/08/2026 | Alto | Aprovada, 28/08/2026 |
| **P03** | Padrão de diretórios e TypeScript | 24/08/2026 | Médio | Aprovada, 28/08/2026 |
| **P17** | Papel de cada fonte de verdade | 24/08/2026 | Alto | Aprovada, 28/08/2026 |
| **P19** | Storybook, testes e publicação | 24/08/2026 | Médio | Aprovada, 28/08/2026 |
| **P20** | Style Dictionary v5 e contrato de tema | 24/08/2026 | Alto | Aprovada, 28/08/2026 |
| **P21** | Plano técnico do `nph-icon` | 26/08/2026 | Já implementado e mergeado sob aceitação de risco | Aprovada, 28/08/2026 |

**Fora desta nota, ainda aguardam confirmação dele:** licença, variável de CI,
credencial e plataforma do **Font Awesome Pro**. Ver `PO-001` no vault.

> **Status de todas as decisões desta nota:**
> *Decisão adotada pela Indiane em 24/08/2026 (P21 em 26/08/2026, P62 em
> 27/08/2026) — revisada e aprovada por Elvys em 28/08/2026, item a item,
> exceto a P62.4.*
>
> Elvys revisou e aprovou formalmente P01, P02, P03, P17, P19, P20, P21, P62.1,
> P62.2 e P62.3 como estavam registradas. Para a P62.4, ele não aprovou o
> registro da divergência sem correção: decidiu migrar o gerador para `rem`
> (ver P62.4). Essas decisões valem para o trabalho atual e continuam
> revisáveis: para alterá-las agora é preciso o mesmo rito de sempre —
> conflito técnico explicado, proposta registrada, revisão humana.

Antes desta nota, as cinco estavam registradas como pendências em aberto,
delegadas a Elvys. Deixaram esse estado em 24/08/2026, para destravar a
continuidade do trabalho. O registro de que foram pendências é preservado de
propósito: elas são decisões **vigentes e revisáveis**, não decisões fechadas.

---

## P01 — Encapsulamento dos componentes

**Decisão.** Componentes futuros com prefixo `nph-` usarão **Shadow DOM
aberto**.

**Motivo.** Encapsula os estilos internos e protege a implementação visual,
mantendo inspeção, depuração e testes viáveis.

**Escopo.** Só passa a ser aplicada ao criar o primeiro componente.

**Impacto.** Todo componente `nph-*` nasce com Shadow DOM em modo aberto.
Estilos de fora não vazam para dentro do componente, e o CSS interno não vaza
para a página. Isso torna o P02 obrigatório: sem uma API pública de
personalização, o encapsulamento deixaria o componente impossível de tematizar.

**Fora de escopo.** Shadow DOM fechado, que não deve ser usado. Criar qualquer
componente nesta tarefa.

**Status.** Decisão adotada pela Indiane em 24/08/2026 — revisada e aprovada
por Elvys em 28/08/2026.

---

## P02 — Personalização e exposição de CSS

**Decisão.** A API pública de personalização visual usará **CSS custom
properties**, para tokens e para personalização. Partes internas que
precisarem ser estilizadas de fora poderão ser expostas com **`::part`**.
Classes CSS internas **não são API pública**.

**Motivo.** Permite tematização e os ajustes previstos sem transformar classes
internas em contrato com o consumidor — o que congelaria a implementação e
impediria refatoração.

**Escopo.** Só passa a ser aplicada ao criar o primeiro componente.

**Impacto.** Define a fronteira entre o que é contrato e o que é interno:
custom properties e `::part` são estáveis e versionados; nomes de classe
dentro do Shadow DOM podem mudar a qualquer momento. Um consumidor que
depender de classe interna quebra sem aviso, e isso não conta como regressão.

**Fora de escopo.** Criar estilos, partes ou componentes nesta tarefa. Definir
quais partes específicas cada componente exporá — isso é decidido na ficha de
cada peça.

**Status.** Decisão adotada pela Indiane em 24/08/2026 — revisada e aprovada
por Elvys em 28/08/2026.

---

## P03 — Organização do projeto

**Decisão.** O padrão futuro de diretórios é este, sem criar diretórios vazios
desnecessários:

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

A estrutura que o Storybook já criou é preservada. Stories e testes ficam
próximos do componente a que pertencem.

**Motivo.** Manter implementação, estilo, story e teste de uma peça no mesmo
lugar, para que o componente seja legível e movível como uma unidade.

**Escopo.** Padrão futuro. Nenhum destes diretórios é criado agora, exceto
`docs/`, que existe porque esta nota vive nele.

**Impacto.** `src/tokens/source/` e `src/tokens/generated/` materializam o P17:
o JSON versionado fica em `source/`, o CSS gerado fica em `generated/`.

**Fora de escopo.** Criar `src/`, `src/components/`, `src/tokens/`,
`src/styles/` ou `src/shared/` nesta tarefa. Criar componentes.

**Divergência conhecida, a resolver no primeiro componente.** A configuração
atual do Storybook aponta para `../stories/**/*.stories.js`, e a página em
construção vive em `stories/`, na raiz. Quando o primeiro componente for
criado, o glob precisará passar a incluir `src/components/**`. O padrão também
pede `.ts`, enquanto o shell atual é `.js` — o que exigirá TypeScript no
projeto. Nada disso foi alterado nesta tarefa, por decisão de escopo.

**Status.** Decisão adotada pela Indiane em 24/08/2026 — revisada e aprovada
por Elvys em 28/08/2026.

---

## P17 — Formato e consumo de tokens

**Decisão.** Tokens versionados no repositório usarão **JSON** como
formato-fonte. **CSS custom properties** serão o formato **gerado** para
consumo no browser.

**Fonte canônica por responsabilidade.**

- O **Figma** é a fonte visual: define e valida valores, modos, aliases e
  intenção de design.
- O `design.md` é o contrato humano e agêntico: explica uso, acessibilidade,
  nomenclatura e restrições. Ele não é o arquivo de geração.
- O **JSON** será a fonte técnica versionada dos valores auditados que entram
  no repositório.
- As **CSS custom properties** serão geradas do JSON e não devem ser editadas
  à mão.

Enquanto a auditoria Figma ↔ documentação não terminar, nenhum valor entra no
JSON. **Não criar tokens com valores fictícios ou não auditados.**

**Motivo.** JSON é legível por ferramenta e serve de fonte para gerar outros
formatos; CSS custom properties são o que o browser consome e o que o P02
define como API pública.

**Escopo.** Nenhum valor de token entra no repositório antes da auditoria.

**Impacto.** Cria uma etapa de geração entre a fonte e o consumo: o JSON é
editado, o CSS é gerado e não deve ser editado à mão. A ferramenta de geração
ainda não foi escolhida.

**Fora de escopo.** Criar arquivos de token, migrar valores do Figma para
código, escolher ferramenta de geração e escrever o script de build de tokens.

**Compatibilidade com o [`design.md`](../design.md).** O YAML existente no
`design.md` permanece como documentação do contrato até sua migração e
validação no repositório. Depois da auditoria, o JSON será a fonte técnica dos
valores; o `design.md` continuará explicando o critério e deverá apontar para o
JSON, sem duplicar valores que possam divergir.

**Status.** Decisão adotada pela Indiane em 24/08/2026 — revisada e aprovada
por Elvys em 28/08/2026.

---

## P19 — Storybook, testes e publicação

**Decisão.**

- Manter `@storybook/web-components-vite`.
- `npm run storybook` para desenvolvimento local.
- `npm run build-storybook` como validação de build.
- Stories ficarão junto dos componentes quando eles forem criados.
- O build do Storybook deverá ser executado no CI em pull requests, quando o
  workflow for criado.
- Inicialmente, o resultado será disponibilizado apenas como **artefato privado
  do CI**.

**Motivo.** Consolidar como escolha de trabalho o que já está configurado e
funcionando, e fixar a validação de build antes de haver componentes, sem
expor nada publicamente enquanto o sistema está em construção.

**Escopo.** Os dois comandos valem desde já. O CI vale a partir do momento em
que o workflow existir.

**Impacto.** Encerra o caráter provisório de `@storybook/web-components-vite`,
que até 24/08/2026 constava como escolha de bootstrap a confirmar. O npm segue
como package manager pela mesma decisão de continuidade. O CI e seu artefato
privado são regras para o workflow futuro; esta nota não declara que eles já
existem.

**Fora de escopo.** Publicação pública, GitHub Pages, ambiente externo, deploy
e configuração definitiva de testes. Criar o workflow de CI. Testes de
interação e acessibilidade serão definidos com o primeiro componente real.

**Status.** Decisão adotada pela Indiane em 24/08/2026 — revisada e aprovada
por Elvys em 28/08/2026.

---

## P20 — Ferramenta de geração e contrato público de temas

Esta decisão **complementa o P17**, que fixou JSON como formato-fonte e CSS
custom properties como formato gerado, mas deixou a ferramenta em aberto.

**Decisão.**

- A ferramenta de geração é o **Style Dictionary v5**.
- O contrato público de tematização são **dois atributos independentes**:
  `data-nph-brand` e `data-nph-color-scheme`.
- Os valores públicos de `data-nph-color-scheme` são **`light`** e **`dark`**.
- Os valores de `data-nph-brand` são os nomes das verticais: `sistemas`,
  `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh`.
- O namespace das extensões DTCG é **`com.iatec.nephos`**.

**Motivo.** A ferramenta foi escolhida por requisito, não por popularidade:
precisa suportar **camadas**, **aliases** e **modos**. O Style Dictionary trata
aliases como sintaxe de primeira classe e, com `outputReferences`, emite
`var(--outro-token)` em vez de achatar o alias em literal — o requisito que
elimina as alternativas. Camadas saem da organização dos arquivos-fonte; modos
saem de uma saída por modo, cada uma com seu seletor. É Node puro, sem
acoplamento a plugin do Figma, coerente com o npm já fixado pelo P19.

Os identificadores técnicos ficam em inglês. Os valores de marca ficam em
português porque são nomes próprios das verticais, não termos técnicos.

**Escopo.** Vale desde já para `src/tokens/`. Não altera o P17, que continua
sendo a fonte da regra sobre formato e responsabilidade por camada.

**Impacto.**

1. `style-dictionary` entra como a primeira `devDependency` fora do Storybook.
2. `src/tokens/generated/` passa a conter artefato versionado e gerado, que
   **nunca** deve ser editado à mão. O build é determinístico para permitir, no
   CI futuro, uma checagem de `git diff` vazio.
3. Marca e esquema viram **contrato de HTML**: o consumidor põe os dois
   atributos no elemento raiz. Omitir os dois entrega Sistemas no claro.
4. O DTCG não tem modos nativos; o formato de modos em
   `$extensions["com.iatec.nephos"].modes` é convenção do Nephos. Trocar de
   ferramenta preserva o JSON, mas exige reescrever o passo que aplica os modos.
5. **Limitação registrada:** o Style Dictionary 5.5.2 serializa `duration` na
   forma estruturada do DTCG como `[object Object]`. A fonte permanece
   estruturada; a conversão acontece só na saída, por transformador próprio. Há
   validação que aborta o build se `[object Object]` reaparecer.

**Fora de escopo.** Criar workflow de CI. Publicação. Gerar formatos além de CSS.
Migrar estilos de efeito, estilos de texto ou os primitivos adiados.

**Status.** Decisão adotada pela Indiane em 24/08/2026 — revisada e aprovada
por Elvys em 28/08/2026.

---

## P21 — Plano técnico do primeiro componente: `nph-icon`

**Decisão.** Para o primeiro componente, adotar as decisões abaixo até haver
conflito técnico concreto ou revisão posterior de Elvys:

1. Implementar `nph-icon` em Lit, com Shadow DOM aberto, SVG inline e um mapa
   fechado dos 34 ícones aprovados. O pacote é Font Awesome Pro na linha 6,
   usando os pacotes SVG `regular` e `solid`; `solid` permanece exclusivo de
   `star`. A versão exata só é fixada após consulta autenticada ao registro, no
   momento autorizado de instalação.
2. O contrato público aprovado é `name` obrigatório, `variant=regular` por
   padrão (`solid` somente para `star`), `size` obrigatório em `sm|md|lg` e
   `label` opcional. `label` ausente, vazio ou somente com espaços após `trim`
   torna o ícone decorativo. Não há slots, eventos, foco, clique, toque,
   propriedade de cor ou `::part` inicial.
3. O desenho de `eye`, `eye-slash` e `star` pode transbordar horizontalmente,
   centralizado e sem corte ou reescala, dentro de caixa quadrada escalada pela
   altura. `space/inline-tight` pertence ao contêiner que compõe ícone e texto.
4. Entrada inválida não renderiza ícone e emite `console.error` apenas em
   desenvolvimento. Não há fallback visual ou tamanho livre.
5. Adotar TypeScript estrito, stories junto do componente e Vitest em modo
   browser como base de validação do primeiro componente. A implementação
   inclui descoberta de stories em `src/components/**`, testes em navegador para
   `currentColor` e custom properties, e `build-storybook`.
6. A política adotada para credenciais é: nenhum valor em arquivo versionado;
   configuração local protegida do Git; referência à variável
   `FONTAWESOME_NPM_AUTH_TOKEN` somente onde necessária; e segredo de CI
   configurado fora do repositório. O CI futuro valida instalação, testes e
   `build-storybook` em pull request, com artefato privado.
7. Indiane aceita o risco de iniciar a implementação antes da revisão de Elvys.
   A regra de proteção local foi aplicada por `.npmrc` ignorado pelo Git; isso
   não substitui a revisão posterior de Elvys sobre licença, CI e plataforma.
8. A organização do Storybook do `nph-icon` separa `Docs / Documentação`, para
   leitura do contrato, de `Docs / Icons Overview`, para o catálogo pesquisável
   do núcleo fechado de 34 ícones, e de `Validação`, para variantes, tamanhos,
   herança de cor, acessibilidade e entrada inválida. A página documental é
   derivada e aponta às fontes canônicas; não instala addon, MDX ou dependência
   nova, não altera a API pública e não cria ícone, token ou variante. A busca
   é comportamento da página Storybook, não do Web Component.

**Motivo.** O plano técnico foi preparado e revisado contra o clone de trabalho,
o contrato aprovado do componente e as decisões P01, P02, P03, P17 e P19. As
decisões removem ambiguidades de API, comportamento, testes e segurança. A
proteção contra inclusão acidental da configuração local foi aplicada; a
revisão técnica de Elvys continua posterior e obrigatória.

**Escopo.** Esta nota decide o plano de implementação do `nph-icon`. Não cria
dependências, arquivos de componente, CI, segredos, configuração local ou
publicação.

**Impacto.**

- Claude — código pode implementar a P21 antes da revisão de Elvys, sem expor
  ou versionar credencial e sem criar CI.
- Copilot atualiza a ficha e o Registro com a evidência de implementação,
  Storybook e testes após a entrega verificável.
- O CI continua inexistente até sua criação técnica em alteração própria.

**Fora de escopo.** Criar ou expor credencial, configurar segredo, criar
workflow, publicar Storybook ou implementar outro componente.

**Status.** Decisão adotada pela Indiane em 26/08/2026 — implementação
autorizada sob aceitação formal de risco; organização de `Docs / Documentação`,
`Docs / Icons Overview` e `Validação` aprovada pela Indiane em 26/08/2026;
revisada e aprovada por Elvys em 28/08/2026.

---

## P62 — `nph-label`: exceção à P01, tipografia e API

**Status.** Quatro decisões adotadas pela Indiane em 27/08/2026. Elvys revisou
em 28/08/2026: aprovou P62.1, P62.2 e P62.3 como estavam registradas; a P62.4
ele resolveu de outra forma — ver a subseção. A **P62.5**, adotada por Indiane
em 28/08/2026 para resolver a contradição de escopo da P62.4, **aguarda revisão
de Elvys**. As três primeiras nasceram de um
problema concreto durante a implementação; a quarta é uma divergência antiga
que a implementação expôs.

### P62.1 — O `nph-label` não usa Shadow DOM

**Decisão.** O `nph-label` é o **único componente do Nephos sem Shadow DOM**.
Ele renderiza na luz. A P01 continua valendo para todos os demais.

**Motivo.** A associação nativa entre rótulo e controle não atravessa a
fronteira do Shadow DOM. De dentro dela, `for` não alcança um `id` do
documento, o clique no rótulo não leva o cursor ao campo e o leitor de tela não
anuncia o nome do campo. Como isso é a razão de existir de um rótulo, o
encapsulamento cede.

**Alternativa descartada.** Delegar a associação ao `nph-field`, que manteria a
P01 intacta. Foi recusada por travar o recorte P0: o `nph-field` é o 4º da fila
e ainda não existe, e o `nph-label` ficaria pronto e inútil até lá.

**Limite.** É exceção de uma peça, não abertura de precedente. Qualquer outro
componente que queira sair do Shadow DOM precisa de decisão própria.

### P62.2 — Tipografia: cinco custom properties por papel

**Decisão.** Cada um dos 14 papéis de texto emite cinco custom properties, com
o campo `css` do `design.md` lido como **prefixo**, não como nome final:

```css
--nph-text-label-md-font-family   /* alias para --nph-core-font-sans */
--nph-text-label-md-font-size
--nph-text-label-md-line-height
--nph-text-label-md-font-weight
--nph-text-label-md-letter-spacing
```

**Motivo.** `letter-spacing` não cabe no atalho `font` do CSS, e componente
costuma precisar de uma propriedade isolada. No gerador, a mudança é de uma
linha: `fontFamily` entra em `TIPOS_TRATADOS`, e o transform `fontFamily/css`
do próprio Style Dictionary cuida da emissão. Peso ficou como `number`, e não
`fontWeight`, porque o DTCG aceita palavra ou número nesse tipo e a fonte do
Nephos sempre grava número.

**Por que agora.** Os 14 estilos estavam adiados desde a migração-base. O
`nph-label` é o primeiro componente feito de texto puro: sem `text/label-md` em
código, ele só existiria com valor literal, o que A2 proíbe. O mesmo bloqueio
valia para `nph-input`, `nph-field` e `nph-checkbox`.

**Origem dos valores.** Lidos dos 14 estilos de texto do Figma
`DS-IA-NEPHOS 5.0` em 27/08/2026 e conferidos contra `tokens_typography` do
`design.md`, item a item, sem divergência. Camadas: `core` 139 → 141,
`semantic` 147 → 217, total 292 → **364**.

### P62.3 — API do `nph-label`: `required`, `for` e `text`

**Decisão.** Três propriedades públicas. `required` estava prevista no registro
de componentes; `for` e `text` não estavam e saem da P62.1.

| Propriedade | Papel |
|---|---|
| `required` | Booleana, padrão `false`. Acrescenta o asterisco ao fim do texto |
| `for` | Espelha o atributo nativo de `<label>`. É o mecanismo da associação |
| `text` | O texto do rótulo. É propriedade, e não conteúdo entre as tags, porque sem Shadow DOM não existe `slot` e o Lit substituiria os filhos do consumidor |

**Esta é a decisão mais urgente da fila.** O `nph-input` e o `nph-field` serão
construídos sobre ela. Mudar depois custa muito mais do que mudar agora.

**Acessibilidade ligada a esta decisão.** O asterisco leva `aria-hidden` e é
decorativo. A obrigatoriedade chega ao leitor de tela pelo próprio controle,
com `required`, e não por texto escondido no rótulo: o estado pertence ao
campo, e texto escondido exigiria uma string em português dentro do componente,
proibido pelo plano trilíngue. **Consequência: o `nph-input` terá de carregar
`required`.**

### P62.4 — Dimensões saem em `px`, não em `rem`

> **Leia o registro histórico abaixo como histórico.** A decisão original —
> registrar a divergência sem corrigi-la — **foi substituída** pela decisão de
> Elvys em 28/08/2026 e já está implementada. Para o estado atual, vá direto a
> **Decisão de Elvys — 28/08/2026** e a **Implementação — 28/08/2026**, no fim
> desta subseção. O que vem antes descreve a situação de 27/08/2026 e **não é o
> estado do repositório hoje**.

**Decisão original, 27/08/2026 — SUPERADA.** Registrar a divergência em vez de
corrigi-la naquele momento.

**O fato, em 27/08/2026.** O `design.md` declarava `unidade_css: rem, raiz
16px` e **nenhuma camada do gerador cumpria isso**: espaço, raio, altura de
controle, tamanho de ícone e a tipografia recém-migrada saíam todos em `px`. A
migração de tipografia apenas seguiu o que já existia. **Isso deixou de valer
em 28/08/2026:** hoje 92 dos 100 tokens `dimension` saem em `rem`, e só
`core/radius` continua em `px`, pela P62.5.

**Motivo de não corrigir naquele PR.** Mudar para `rem` afeta todo `dimension`
do sistema, não só a tipografia, e é decisão de pipeline. Corrigir dentro de um
PR de componente esconderia uma mudança global dentro de uma entrega local. Por
isso a correção veio depois, em PR próprio.

**O que ficava aberto, e não está mais.** Ou o gerador passaria a emitir `rem`,
ou o `design.md` passaria a declarar `px`. O contrato prometia uma coisa e o
código entregava outra. Resolvido abaixo.

**Decisão de Elvys — 28/08/2026.** Resolve a divergência: o **gerador migra
para `rem`**. O `design.md` (`unidade_css: rem, raiz 16px`) não muda — é o
código que passa a cumprir o contrato já escrito. Isso substitui o "registrar
sem corrigir" acima; a divergência deixou de ser só anotada.

**Escopo desta decisão.** Fixa o rumo, não a implementação. Afeta toda camada
`dimension` do Style Dictionary — espaço, raio, altura de controle, tamanho de
ícone e tipografia (P62.2) —, não só a tipografia. A migração em si (mudança no
gerador, e revalidação da saída determinística de cada camada) é tarefa própria,
fora desta nota.

**Implementação — 28/08/2026.** Executada por autorização de Indiane. O
transform `nephos/dimension/rem` em `scripts/build-tokens.mjs` divide por 16 e
emite `rem`; zero sai como `0`. Converteram-se **92 dos 100 tokens `dimension`**
— espaço, altura de controle, tamanho de ícone, largura e altura de layout,
espessura de foco e os 42 de tipografia. Os 8 de raio ficam de fora pela P62.5.

Os 8 primitivos de `core/radius` ficaram de fora, por decisão registrada na
**P62.5**, abaixo.

---

### P62.5 — O raio continua em `px`

**Decisão de Indiane, 28/08/2026.** `core/radius` fica fora da conversão da
P62.4. Os outros 92 tokens `dimension` vão para `rem`; os 8 de raio continuam
em `px`.

**Por que existe esta decisão.** O escopo da P62.4 cita "raio" entre as
famílias afetadas e, no mesmo parágrafo, determina que o `design.md` **não
muda**. Para o raio, as duas coisas não cabem juntas: o `raio_regras` do
`design.md` declara `unidade_css: px`. Converter o raio exigiria alterar o
contrato que a própria P62.4 manda preservar.

**Por que `px` e não `rem`.**

1. **A regra tem motivo escrito, e o motivo continua válido.** O `design.md`
   explica: *"Raio em rem cresceria com a fonte do usuario e um botao de 6px
   viraria capsula. Forma nao acompanha tamanho de texto."* `px` e `rem` se
   comportam igual no zoom do navegador; a diferença aparece só quando o
   usuário aumenta a fonte — e aí o raio em `rem` **deforma** o botão em vez de
   acompanhá-lo.
2. **A menção a "raio" na P62.4 é incidental, não fundamentada.** Ela aparece
   numa enumeração das famílias da camada `dimension`. A parte da P62.4 que foi
   de fato decidida é a outra: o código passa a cumprir o contrato. Aqui, o
   contrato diz `px`.
3. **`core/radius/full` vale `9999px`**, que em `rem` viraria `624.9375rem` —
   valor que ninguém escreveria de propósito, e sinal de que a família não foi
   considerada quando a lista foi escrita.

**O que esta decisão NÃO faz.** Não altera o `raio_regras` do `design.md`: ela
o confirma. Não cria exceção nova — o raio já era a única fundação declarada em
`px`. Não toca as outras três regras `unidade_css`.

**Custo de mudar de ideia.** Baixo e simétrico: converter o raio depois é
acrescentar `'radius'` fora da constante `SEM_CONVERSAO` em
`scripts/build-tokens.mjs` e rodar `npm run build:tokens`. Mas exigiria alterar
o `raio_regras` do `design.md` junto, e aí deixa de ser mudança de pipeline e
vira mudança de contrato visual.

**Status.** Decisão adotada por Indiane em 28/08/2026 — aguardando revisão de
Elvys.

---

## Como mudar uma destas decisões

Não altere, substitua ou reabra P01, P02, P03, P17, P19, P20, P21 ou P62 sem:

1. explicar o conflito técnico concreto;
2. registrar uma proposta de mudança;
3. solicitar revisão humana.

Isso vale para pessoas e para agentes.

## Onde estas decisões aparecem

| Documento | O que ele diz sobre elas |
|---|---|
| [`../README.md`](../README.md) | Resumo e ponteiro para esta nota |
| [`../AGENTS.md`](../AGENTS.md) | Regra de leitura obrigatória antes de mexer em componente |
| [`../CLAUDE.md`](../CLAUDE.md) | Instrução exclusiva do Claude; a regra comum está no `AGENTS.md` |
| [`../GOVERNANCA.md`](../GOVERNANCA.md) | Estado vigente do repositório |
| [`../design.md`](../design.md) | Contrato das fundações; §9 e §10 alinhadas ao P03 e ao P17 |
| [`tokens.md`](tokens.md) | Como o P17 e o P20 são aplicados: fonte, geração, consumo e validações |
| [`../fichas/<nome>.md`](../fichas/) | Como a decisão chega ao componente: contrato, variantes, estados e tokens |
