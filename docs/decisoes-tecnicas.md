# Decisões técnicas — Nephos

Esta é a **fonte única** das decisões técnicas P01, P02, P03, P17, P19, P20,
P21, P62, P63, P64, P65, P66 e P68. Em caso de divergência entre este arquivo e qualquer outro documento
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
| **P62.5** | O raio continua em `px` | 28/08/2026 | Baixo. Converter depois é uma linha no gerador, mas exige alterar `raio_regras` no `design.md` | Adotada por Indiane em 28/08/2026. **Revisada e aprovada por Mauro em 09/09/2026, no PR #25, mergeado em `ed7c009`.** Resolve a contradição de escopo da P62.4 |
| **P01** | Shadow DOM aberto | 24/08/2026 | Alto. Todo componente depende | Aprovada, 28/08/2026 |
| **P02** | Custom properties como API pública | 24/08/2026 | Alto | Aprovada, 28/08/2026 |
| **P03** | Padrão de diretórios e TypeScript | 24/08/2026 | Médio | Aprovada, 28/08/2026 |
| **P17** | Papel de cada fonte de verdade | 24/08/2026 | Alto | Aprovada, 28/08/2026 |
| **P19** | Storybook, testes e publicação | 24/08/2026 | Médio | Aprovada, 28/08/2026 |
| **P20** | Style Dictionary v5 e contrato de tema | 24/08/2026 | Alto | Aprovada, 28/08/2026 |
| **P21** | Plano técnico do `nph-icon` | 26/08/2026 | Já implementado e mergeado sob aceitação de risco | Aprovada, 28/08/2026 |
| **P63** | Metadata gerada a partir da ficha | 28/09/2026 | Médio. Mudar local ou formato depois exige gerar de novo e ajustar quem lê; a ficha não muda | Adotada por Indiane em 28/09/2026. **Revisada e aprovada por Mauro em 30/09/2026, no chat da equipe.** |
| **P64** | Idioma do código | 28/09/2026 | Médio. Vale para todo código novo; a migração do que existe só troca nomes | Adotada por Indiane em 28/09/2026. **Revisada e aprovada por Mauro em 30/09/2026, no chat da equipe.** Emenda de 02/10/2026 aprovada por Mauro no PR #49, com merge em 05/10/2026. |
| **P65** | API e semântica do `nph-tooltip` | 05/10/2026 | Baixo agora. O `nph-label` é o primeiro consumidor; mudar depois exige refazer o gatilho dele | Comportamento e escopo (L11.5) e anatomia (L11.6, L11.7 e o quadro aceito) adotados por Indiane em 01/10/2026. API e semântica aprovadas por `maurocsjr` no PR #51, com merge em 05/10/2026 |
| **P66** | API e semântica de `nph-spinner`, `nph-separator` e `nph-kbd` | 05/10/2026 | Baixo agora. O `nph-button` (Lote B) e o `nph-rich-option` serão os primeiros consumidores | Anatomia e comportamento: quadros aceitos por Indiane em 01/10/2026. API e semântica: proposta técnica, revisão no PR por `maurocsjr` |
| **P68** | API e semântica de `nph-badge` e `nph-button` | 05/10/2026 | Baixo agora. Nenhuma peça consome as duas ainda | Anatomia e comportamento: quadros aceitos por Indiane em 01/10/2026, completados em 02/10/2026. API e semântica: proposta técnica, revisão no PR por `maurocsjr` |

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

**Divergência resolvida no primeiro componente.** A configuração do Storybook
inclui as stories em `src/components/**/*.stories.ts`, e a estrutura passou a
usar TypeScript conforme este padrão. O histórico desta divergência explica o
escopo da P03; não autoriza alteração futura.

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
   fechado dos 93 ícones aprovados. O pacote é Font Awesome Pro na linha 6,
   usando os pacotes SVG `regular` e `solid`; cada nome aprovado tem as duas
   artes. A versão exata só é fixada após consulta autenticada ao registro, no
   momento autorizado de instalação.
2. O contrato público aprovado é `name` obrigatório, `variant=regular` por
   padrão, com `solid` disponível para cada nome do acervo aprovado, `size`
   obrigatório em `sm|md|lg` e `label` opcional. `label` ausente, vazio ou
   somente com espaços após `trim` torna o ícone decorativo. Não há slots,
   eventos, foco, clique, toque, propriedade de cor ou `::part` inicial.
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
   do núcleo fechado de 93 ícones, e de `Validação`, para variantes, tamanhos,
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

**Emenda I7, 08/09/2026 — absorvida pela matriz de 14/09/2026.** A redação
original da P21 restringia `solid` ao `star`. A I7 autorizou `circle-info` em
`solid` porque o contorno `regular` some ao lado do texto, principalmente no
modo claro; `regular` continua o padrão. Em 14/09/2026 a documentação Figma
aprovada ampliou `solid` a todos os 93 nomes; os itens 1 e 2 já descrevem esse
acervo. Esta nota registra o motivo da I7 e não reabre nem reduz o mapa vigente.

---

## P62 — `nph-label`: exceção à P01, tipografia e API

**Status.** Quatro decisões adotadas pela Indiane em 27/08/2026. Elvys revisou
em 28/08/2026: aprovou P62.1, P62.2 e P62.3 como estavam registradas; a P62.4
ele resolveu de outra forma — ver a subseção. A **P62.5**, adotada por Indiane
em 28/08/2026 para resolver a contradição de escopo da P62.4, **foi revisada e
aprovada por Mauro em 09/09/2026**, no PR #25. As três primeiras nasceram de um
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
acrescentar `'radius'` fora da constante `NO_CONVERSION` (antes `SEM_CONVERSAO`;
renomeada pela P64 em 29/09/2026) em
`scripts/build-tokens.mjs` e rodar `npm run build:tokens`. Mas exigiria alterar
o `raio_regras` do `design.md` junto, e aí deixa de ser mudança de pipeline e
vira mudança de contrato visual.

**Status.** Decisão adotada por Indiane em 28/08/2026 — revisão documental das
evidências concluída pelo Copilot em 09/09/2026. A revisão confirmou a compatibilidade
com `raio_regras` do `design.md`, a separação dos 8 tokens de raio dos 92 `dimension`
convertidos e o custo descrito para uma mudança futura.

**Revisada e aprovada por Mauro em 09/09/2026**, no PR #25, sobre o commit `5fa4821`,
mergeado na `v/3.0.0` em `ed7c009`. São duas evidências distintas e ambas necessárias:
a revisão documental do Copilot conferiu as evidências, e a aprovação de Mauro é o rito
de revisão humana que as demais decisões técnicas passaram. Com ela, a P62.5 deixa de
ser a única decisão da P62 sem revisão registrada.

---

## P63 — Metadata gerada a partir da ficha

**Decisão.**

- A ficha em `fichas/<nome>.md` continua sendo a fonte do contrato da peça. A
  **Metadata** é uma cópia derivada, em JSON, do YAML da ficha.
- A leitura acontece **no build**. O arquivo é gerado por
  `node scripts/verificar-operacao.mjs --gerar-metadata`, é versionado e
  **nunca** é editado à mão.
- O local é `src/shared/metadata/<peca>.json`. Só ficha com `status: vigente`
  gera arquivo.
- O JSON espelha o YAML inteiro, na ordem da ficha, com recuo de 2 espaços, fim
  de linha LF e quebra de linha final.
- A regra `V32` do verificador reprova Metadata que não bate com a ficha, JSON
  sem ficha vigente e ficha fora da gramática do leitor.

**Motivo.** Código, Storybook, teste e um futuro servidor de consulta precisam
ler o contrato sem interpretar Markdown. Gerar a cópia a partir da ficha entrega
esse formato sem abrir uma segunda fonte: a `V27` continua reprovando `meta.ts`
e `metadata.ts` dentro de `src/components/`.

**Escopo.** O YAML da ficha é lido por `scripts/spec-lib.mjs` (antes `ficha-lib.mjs`; renomeado pela P64 em 02/10/2026), que cobre só o
subconjunto que o gabarito usa e recusa, com o número da linha, o que não
reconhece. Nenhuma dependência nova entra. Tarefa, contexto e evidência
continuam em JSON, como decidido em 02/09/2026.

**Impacto.** Quem muda uma ficha vigente roda `--gerar-metadata` no mesmo
commit. Sem isso, `npm run test:operacao` reprova pela `V32`.

**Fora de escopo.** A aba de Metadata no Storybook, o servidor de consulta
(MCP) e a conferência do bloco `api` da ficha contra o código.

**Status.** Decisão adotada pela Indiane em 28/09/2026, por delegação —
revisada e aprovada por Mauro em 30/09/2026, no chat da equipe.

---

## P64 — Idioma do código

**Decisão.**

- Os **nomes do código** — variável, constante, função, classe, parâmetro e
  propriedade interna — são escritos em **inglês**.
- **Comentário, mensagem de erro e saída para quem mantém o repositório**
  continuam em **PT-BR**, a língua da equipe e da documentação interna.
- Vale para todo o código versionado: `scripts/`, `src/`, `stories/` e
  `.storybook/`.

**Fora da regra**, porque é contrato de dados ou de interface e mudar quebraria
quem já usa:

- as chaves do JSON de tarefa, contexto e evidência, as chaves do JSON dos tokens
  e as chaves do YAML das fichas;
- as bandeiras da linha de comando, os nomes de script do `package.json` e os
  nomes de arquivo citados em comando gravado em `docs/operacao/` (hoje, só
  `scripts/verificar-operacao.mjs`);
- os nomes públicos, que já são inglês: tags `nph-*`, propriedades, custom
  properties e os atributos `data-nph-*`;
- o texto que aparece para quem lê: título e nome de story, descrição de teste,
  mensagens e os dicionários de `.storybook/i18n/`;
- o registro histórico, que continua citando o nome da época.

**Motivo.** Até aqui não havia regra, e a prática estava misturada: o
`verificar-operacao.mjs` era todo em PT-BR, o `build-tokens.mjs` misturava os dois
idiomas, e os componentes tinham API em inglês e funções internas em PT-BR. A
revisão do PR #41 apontou isso. A regra segue o que a P20 já fixa para tokens e
tema e o que `fichas/_modelo.md` fixa para as fichas: identificador em inglês,
todo o resto em português.

**Impacto.** Código novo nasce na regra. O código existente migra por pasta, na
tarefa `DSA-07`, sem mudar comportamento: a saída dos scripts é idêntica antes e
depois, e os arquivos gerados não mudam. `scripts/` migrou em 29/09/2026.

**Emenda de 02/10/2026 — nomes de arquivo.** Nome de arquivo técnico em
português mantinha a mistura de idiomas que a P64 tirou dos identificadores. Os
arquivos renomeados não são citados por comando gravado em `docs/operacao/` nem
por schema; a documentação vigente que os cita muda junto. Nome de arquivo
técnico de código (`src/`, `stories/`, `.storybook/`, `scripts/`) também segue
a regra. Ficam: o que comando gravado em `docs/operacao/` cita, os diretórios
do contrato do verificador (`fichas/`, `docs/operacao/tarefas/`, `evidencias/`,
`contextos/`, e as mesmas subpastas dentro dos fixtures) e a documentação, que
inclui os nomes dos arquivos de evidência. Os casos de fixture do verificador
e do teste de invariância também passam para o inglês. Prova: `npm run test:naming`, com as exceções
de contrato em `scripts/naming-exceptions.json`. Adotada pela Indiane em
02/10/2026; aprovada por Mauro no PR #49.

**Status.** Decisão adotada pela Indiane em 28/09/2026 — revisada e aprovada
por Mauro em 30/09/2026, no chat da equipe. Emenda de 02/10/2026 aprovada por
Mauro no PR #49, com merge em 05/10/2026.

---

## P65 — `nph-tooltip`: API e semântica

**Decisão.**

- O `nph-tooltip` é um Web Component com **Shadow DOM aberto** (P01). O CSS
  fica em `nph-tooltip.css`, importado `?inline`, como no `nph-icon`.
- **API pública: duas propriedades.**

  | Propriedade | Papel |
  |---|---|
  | `text` | String, padrão vazio. O texto do balão, já localizado pela aplicação consumidora. Vazio ou só espaços: nada é mostrado |
  | `open` | Booleana, padrão `false`, reflete no atributo. Mostra o balão |

- **Sem slot, sem evento, sem posicionamento e sem gatilho próprios.** Quem
  abre, fecha e posiciona é o consumidor. O primeiro é o gatilho `info` do
  `nph-label`, que abre por clique, Enter ou Espaço e fecha com Esc ou clique
  fora; o balão não abre no hover.
- **Semântica de toggletip.** O host é uma região viva `role="status"` desde a
  montagem, aberto ou fechado: o leitor de tela só anuncia mudança dentro de
  uma região que já existia. O balão não é focável; o foco fica no gatilho.
- **Anatomia só por token semântico:** fundo `color/tooltip`; texto
  `text/body-sm` em `color/tooltip-foreground`; raio `radius/inner`; padding
  `space/inline-tight` em cima e embaixo e `space/inline` nas laterais;
  `elevation/dropdown`; sem borda e sem seta. Largura até
  `layout/max-tooltip-width` e altura até `layout/max-tooltip-height`.
- **O texto não é cortado.** Ele acompanha a largura até o máximo e quebra só
  entre palavras: sem reticências, sem hifenização automática, sem palavra
  partida. Cabe em até duas linhas; texto mais longo é erro de conteúdo.

**Fonte.** Comportamento e escopo: decisão de Indiane em 01/10/2026, L11.5 do
Registro de decisões (vault). Anatomia: L11.6 e L11.7 e o quadro `nph-tooltip`
(`1237:5`) aceito no Figma `DS-IA-NEPHOS 5.0`, com o componente `1237:3`. O
padding segue o redesenho aceito no mesmo dia; a L11.5 ainda cita
`space/container-padding`, que o redesenho substituiu. A API (`text`, `open`)
e a semântica (`role="status"`) são proposta técnica desta implementação.

**Limite conhecido.** `elevation/dropdown` sai em `:root` com
`var(--nph-shadow-color)`. Numa subárvore com outro `data-nph-color-scheme`, a
sombra fica com a cor da raiz. É uma pendência do gerador de tokens, e não
desta peça.

**Status.** Anatomia e comportamento adotados por Indiane em 01/10/2026; API e
semântica aprovadas por Mauro no PR #51 (DSA-08), com merge em 05/10/2026.

---

## P66 — `nph-spinner`, `nph-separator` e `nph-kbd`: API e semântica

**Decisão.** As três peças são Web Components com **Shadow DOM aberto** (P01),
CSS em arquivo próprio importado `?inline`, como o `nph-icon`. Nenhuma tem slot,
evento, foco, clique, propriedade de cor ou `::part`. Anatomia só por token
semântico. Entrada inválida não renderiza nada e emite `console.error` só em
desenvolvimento, sem fallback visual — a mesma regra da P21, adotada aqui por
decisão própria, como pede o `docs/stories.md` (§2.5).

- **`nph-spinner`**
  - `size`: `sm` (padrão) ou `md`, reflete no atributo. O padrão segue o quadro
    aceito e supera o "sem padrão" da ficha de 31/08/2026.
  - `label`: string opcional. Não vazia depois do `trim` e com `size` válido, o
    host recebe `role="img"` e `aria-label`. Sem isso, `aria-hidden="true"`. É o
    padrão do `nph-icon` (P21, item 2).
  - O desenho é o `circle-notch` do `nph-icon`, no mesmo `size`. Gira em
    `motion/loop-duration` e `motion/loop-easing`. Com `prefers-reduced-motion:
    reduce` o giro para (WCAG 2.3.3).
  - Literais escritos: `rotate(0)` e `rotate(1turn)` no `@keyframes`. São a
    definição geométrica da volta, não uma decisão visual.
- **`nph-separator`**
  - `orientation`: `horizontal` (padrão) ou `vertical`, reflete no atributo.
  - Uma linha de `border/width` em `color/border`. O host fica `aria-hidden` e
    sem role: é decorativo.
  - Preenche o contêiner. A horizontal preenche a largura em pai de bloco ou
    flex em coluna. A vertical preenche a altura em pai flex em linha ou grid.
    Fora disso, quem usa dá o comprimento.
  - `layout/separator-width` e `layout/separator-height` não são consumidos. Os
    dois são o comprimento FIXED do mestre `762:6`, e o quadro aceito manda "a
    instância preenche o contêiner".
- **`nph-kbd`**
  - `text`: string, padrão vazio. É a propriedade `tecla` do Figma. O nome é
    `text`, como no `nph-label` (P62.3) e no `nph-tooltip` (P65), e não `key`,
    que frameworks consumidores reservam. "K" é só conteúdo de exemplo do
    Figma.
  - Vazio ou só espaços: nada é mostrado (0 × 0), sem erro. É o estado de
    montagem antes de o consumidor preencher o texto.
  - O texto fica dentro de `<kbd>`, e o leitor de tela lê a tecla por ele. A
    combinação junta uma peça por tecla.
  - A borda é traço por dentro, como no Figma, feita com `box-shadow: inset` em
    `border/width`. A altura fica igual à do componente aceito: a linha de
    `text/label-sm` mais `space/inline-tight` em cima e embaixo. O único zero
    escrito é `margin: 0`, que tira a margem padrão do `<kbd>`.

**Fonte.** Quadros aceitos no Figma `DS-IA-NEPHOS 5.0` em 01/10/2026:
`nph-spinner` (`1195:22210`, conjunto `281:11`), `nph-separator` (`1196:674`,
conjunto `762:6`) e `nph-kbd` (`1193:20`, componente `772:3`). Os três têm QA UX
de Figma e auditoria textual aprovados. Os nomes `text` e `orientation`, o
padrão vazio do `text`, a semântica `role="img"` do spinner e a regra de
entrada inválida são proposta técnica desta implementação.

**Fora de escopo.** O girador dentro do `nph-button` (Lote B). Indicador de
progresso conhecido. Separador com texto. Combinação de teclas numa peça só.

**Status.** Anatomia e comportamento aceitos por Indiane em 01/10/2026; API e
semântica em revisão no PR do Lote A.

---

## P68 — `nph-badge` e `nph-button`: API e semântica

**Decisão.** As duas peças são Web Components com **Shadow DOM aberto** (P01),
CSS em arquivo próprio importado `?inline`, como o `nph-icon`. Nenhuma tem slot,
evento próprio, propriedade de cor ou `::part`. Anatomia só por token semântico.
Entrada inválida não renderiza nada e emite `console.error` só em
desenvolvimento, um por causa e acumulando — a regra da P21, adotada aqui por
decisão própria, como na P66. Os nomes seguem a P64.

- **Nomes comuns às duas.** O `tipo` do Figma é `severity`, e a `enfase` é
  `emphasis`. `severity` é o nome do PrimeNG, que é a fonte dos valores
  (`primary`, `secondary`, `info`, `warn`, `help`, `danger`, `success`; B1 do
  Registro de decisões). `type` não é usado: no botão, ele é o atributo nativo
  que decide o envio de formulário. As duas peças usam o mesmo nome para a mesma
  escolha.
- **`nph-badge`**
  - `severity`: os tipos acima, padrão `primary`, reflete no atributo.
  - `emphasis`: `solid` (padrão) ou `light`, reflete no atributo. Os padrões são
    os do conjunto `878:30`.
  - `text`: string, padrão vazio. É o nome acessível. Vazio ou só espaços: nada é
    mostrado (0 × 0), sem erro. É o estado de montagem, como no `nph-kbd` (P66), e
    a regra do quadro: se não há o que escrever, não há selo.
  - `icon`: string, padrão vazio. Um nome do núcleo do `nph-icon`, antes do texto,
    em `icon/size-sm`, na cor do texto e decorativo.
  - Só texto, sem role. Não recebe clique, foco nem hover: o hover saiu do Figma
    em 02/10/2026, porque o selo não é clicável.
  - O texto fica numa linha (`white-space: nowrap`): uma ou duas palavras.
- **`nph-button`**
  - `severity` (padrão `primary`), `emphasis` (`solid`, padrão, `outline`,
    `light` ou `ghost`) e `size` (`compact`, padrão, `default` ou `large`).
    `outline`, `light` e `ghost` só existem em `primary`, `secondary` e `danger`
    (B1). O padrão `compact` é o do quadro aceito (`1197:5449`, seção 5) e da
    variante padrão do conjunto `461:13009`. Os três refletem no atributo, como
    `disabled` e `loading`: o CSS interno seleciona por eles.
  - `text`: o que acontece ao clicar, e o nome acessível. Fica numa linha
    (`white-space: nowrap`), porque a altura é fixa no token de controle.
  - `icon-start` e `icon-end` (propriedades `iconStart` e `iconEnd`): um nome do
    núcleo cada, em `icon/size-sm` quando há texto, e podem conviver (B6).
  - **Só ícone (B5).** Sem texto e com um ícone, o botão é quadrado, na altura do
    controle, sem respiro lateral, e o ícone acompanha a caixa: `sm` no
    `compact`, `md` no `default` e `lg` no `large` (conjunto `498:15671`). O
    `label` é obrigatório e vira o `aria-label` do botão nativo; com texto, ele
    não é usado.
  - Um `<button type="button">` nativo dentro do shadow root, com
    `delegatesFocus`. Teclado nativo: Tab entra e sai; Enter e Espaço acionam. O
    clique é o `click` nativo, que atravessa o shadow root e chega ao host.
  - **Foco** só em `:focus-visible`: borda de `border/width` encostada, com raio
    `focus/border-radius-control`, e halo de `focus/ring-width` por fora, com raio
    `focus/radius-control-with-border`, sem mudar o tamanho. A borda tem a cor do
    tipo (`color/primary`, `status/info`, `status/warning`, `status/help`,
    `color/destructive`, `status/success`) e, no `secondary`, `focus/border`. O
    halo é `focus/halo` no `primary` e no `secondary`, e `focus/halo-<matiz>` nos
    demais. Igual em todas as ênfases.
  - **Hover** (`hover-active`) nos tokens de hover de cada par: `color/*-hover` e
    `status/*-hover` no sólido, por decisão de 02/10/2026, que supera a B4;
    `*-surface-hover` e `*-on-surface-hover` no `outline` e no `light`; a
    superfície do tipo no `ghost`.
  - `disabled`: `disabled` nativo. O botão sai do Tab, não dispara clique e fica
    em `state/disabled-opacity`, nas cores do repouso.
  - `loading` (o `carregando` do Figma): o girador do `nph-spinner` entra no lugar
    do ícone de início, o de fim some e o texto fica. No só ícone, o girador
    substitui o ícone: `sm` no `compact` e `md` no `default` e no `large`. O botão
    continua focável, com `aria-disabled="true"` e `aria-busy="true"`, e o clique
    não chega a quem usa. O girador é decorativo.
  - Em `disabled` e em `loading`, um ouvinte no botão nativo e outro, de captura,
    no host param o `click`, também o de `click()` chamado no host.
  - Entrada inválida: `severity`, `emphasis` ou `size` fora da lista; `outline`,
    `light` ou `ghost` em `info`, `warn`, `help` ou `success`; ícone fora do
    núcleo; sem texto e com dois ícones; sem texto, com um ícone e sem `label`.
    **Sem texto e sem ícone é montagem**: nada, sem erro, como no `nph-kbd`.
- **Literais escritos, e por quê.** `transparent` (o `ghost` não tem fundo);
  `nowrap`; `calc(-1 * ...)`, que põe a borda e o halo do foco por fora; e
  `inset 0 0 0` no `box-shadow` da borda do `outline`, que é traço por dentro,
  como no `nph-kbd`. Nenhum é valor visual.

**Limites conhecidos.**

- **L-a — subárvore com outro esquema ou outra marca.** `status/on-solid` (alias
  de `color/background`) e `focus/halo` (alias de `theme/brand-200`) saem só em
  `:root`. Numa parte da tela com outro `data-nph-color-scheme` ou outro
  `data-nph-brand`, os dois ficam com o valor da raiz: o texto sólido de `info`,
  `warn`, `help` e `success`, nas duas peças, e o halo do `primary` e do
  `secondary`. É a mesma pendência do gerador de tokens que a P65 registra para a
  sombra. Quando o gerador redeclarar esses invariantes por esquema, as duas
  peças corrigem sozinhas: elas consomem os mesmos nomes de token.
- **L-b — `use` do `design.md` mais estreito que o Figma aceito.** O quadro e os
  conjuntos aceitos usam tokens onde o `use` ainda não cita esse uso:
  `color/primary-surface` e `color/destructive-surface` (o `use` cita
  "nph-button com ênfase light ou outline") também servem ao hover do `ghost` e
  ao badge `light`; `color/primary-on-surface` ("somente sobre ela") também no
  `ghost` sem fundo; `color/muted` (`nao_use: "Hover."`) no hover do `ghost`
  secondary e como fundo do `outline` secondary; `status/<matiz>` (ícone, ponto,
  barra) como fundo sólido de badge e button; `status/<matiz>-surface` e
  `-foreground` ("sempre em conjunto com os outros três papéis") no badge
  `light`, sem `-border`. As peças seguem o Figma; a ampliação do `use` é
  decisão pendente da Indiane, e este PR não muda o `design.md`.

**Fonte.** Quadros aceitos no Figma `DS-IA-NEPHOS 5.0` em 01/10/2026 e
completados em 02/10/2026: `nph-badge` (`1196:1100`, conjunto `878:30`; o hover
saiu) e `nph-button` (`1197:5449`, conjuntos `461:13009` e `498:15671`; o hover
sólido passou aos tokens de hover). Os dois têm QA UX de Figma e auditoria
textual aprovados em 02/10/2026. Registro de decisões (vault): B1, B5 e B6. Os
nomes `severity`, `emphasis`, `text`, `icon`, `iconStart`, `iconEnd`, `label` e
`loading`, a semântica do `loading` e a regra de entrada inválida são proposta
técnica desta implementação.

**Fora de escopo.** Envio de formulário (`type="submit"`, elemento associado a
formulário), link com cara de botão, grupo de botões, botão de largura fluida,
texto em mais de uma linha, selo clicável e selo com contagem.

**Status.** Anatomia e comportamento aceitos por Indiane em 01/10/2026 e
completados em 02/10/2026; API e semântica em revisão no PR do Lote B.

---

## Como mudar uma destas decisões

Não altere, substitua ou reabra P01, P02, P03, P17, P19, P20, P21, P62, P63, P64, P65, P66 ou P68 sem:

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
