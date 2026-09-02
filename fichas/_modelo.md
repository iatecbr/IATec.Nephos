---
titulo: "Modelo de ficha — Nephos"
tipo: template do contrato agêntico
criado: 2026-08-31
atualizado: 2026-08-31
status: aguardando revisão
leitura_obrigatoria: true
precedencia: 5
aplica_se_a: [componente, bloco, layout, template]
fontes:
  - "TRABALHO/DESIGN SYSTEM/02 — Componentes/Template de ficha — peças do Nephos.md — versão 1.0, de 20-08-2026"
  - "`Documentos obrigatórios de um Design System agêntico — especificação para o Nephos` (vault) — o modelo de 9 seções"
  - "`Índice — DS-Agentico` (vault)"
tags: [nephos, ds-agentico, ficha, template]
---

> **Referências marcadas `(vault)`** estão em `02 PROJETOS/DS-Agentico/`, no WORK BRAIN —
> fora deste repositório. Elas eram wikilinks do Obsidian e foram convertidas em
> referência explícita na migração de 31-08-2026.

# Modelo de ficha — Nephos

> **Por que o modelo vem antes das fichas.** Uma estrutura padrão preenchida treze
> vezes vale mais que treze documentos que divergem. O agente aprende a forma uma vez
> e passa a saber onde procurar em qualquer peça.
>
> Volta para `Índice — DS-Agentico` (vault).

**Como usar.** Copie o gabarito da seção 4. Preencha **tudo**. Campo que não se
aplica recebe `nao_se_aplica`; campo ainda não decidido recebe `pendente` — nunca
fique em branco, porque branco o agente lê como "não existe" e inventa.

**Onde salvar:** nesta pasta — `fichas/<nome>.md`, **no repositório**. Este modelo também
é canônico aqui, em `fichas/_modelo.md`. **Decisão da Indiane em 31-08-2026 (PI-01):** as
fichas de componente e o gabarito vivem no repositório, que é onde o `AGENTS.md`, o
`CLAUDE.md` e o `design.md` já mandavam abri-las, e onde está quem as consome.

**No vault existe apenas um ponteiro** para cada uma. Se você encontrar critério de peça
escrito lá, é erro: a fonte é este diretório.

**O que não entra.** Histórico, justificativa longa, conversa de reunião ou decisão
superada. Ficha é contrato enxuto: decisão consolidada, valor verificável, ponteiro e
procedimento.

**E a ficha não documenta aparência.** "Botão com fundo azul e cantos arredondados" é
o que dá para ver — falta o que importa.

## 1. As duas metades

| Metade | O que carrega | Quem lê |
|---|---|---|
| **YAML** no topo | Os **valores**: tokens, variantes, estados, combinações inválidas | A máquina, sem interpretar prosa |
| **Markdown** abaixo | O **critério**: quando escolher esta peça e não a parecida, o que nunca fazer | O agente e a pessoa, ao decidir |

As duas são obrigatórias. O YAML sozinho descreve a peça e não ensina a escolhê-la; o
Markdown sozinho não é verificável.

**A API mora no YAML, e só ali.** Decisão da Indiane em 31-08-2026: propriedade, tipo,
obrigatoriedade, valor padrão e restrição são **valores**, e valor é a metade da
máquina. **Não existe seção "API" em Markdown** — as nove seções são nove em todas as
fichas. O texto explica *quando escolher a peça*; o YAML diz *o que ela aceita*.

## 2. As seis regras de escrita

1. **Imperativo absoluto nas regras.** "O espaçamento é **estrito** de 4px" — a
   palavra "estrito" avisa ao agente que a regra não se quebra. "Prefira" e
   "geralmente" convidam à exceção.
2. **A seção de anti-padrões é obrigatória.** Ficha sem "nunca faça" está incompleta,
   mesmo parecendo completa. É a seção com maior retorno por linha escrita.
3. **Combinações inválidas não são opcionais.** É o que impede a invenção de variantes
   que não funcionariam.
4. **Só token semântico.** Nenhuma ficha cita `core/*`, `theme/*` ou valor literal.
5. **Nomes de identificador em inglês; todo o resto em português.**
6. **Documente também o que não é seu.** Componente de terceiro usado como está
   precisa de ficha — a documentação do fornecedor diz o que ele faz, não **quando
   escolhê-lo dentro do Nephos**. Essa camada é sua.

E uma regra de migração: **migrar não é copiar.** O conteúdo atual foi escrito para
pessoas lerem. Ao trazer para cá, reescreva no formato de decisão, em vez de copiar
descrição visual.

## 3. As nove seções

> **Fundação não usa este modelo.** Decisão da Indiane em 31-08-2026: as oito fichas de
> fundação têm **forma própria** — significado de cada token · regra de uso ·
> anti-padrões · o que a fundação não cobre · Dicas para IA · fontes e decisões.
> "Variantes", "Estados" e "Relações" não descrevem uma fundação: cor não tem estado de
> hover, ela **é** o que o hover usa. Ver `Fundação — cor` (vault), que é o gabarito das
> outras sete.

| # | Seção | O que responde |
|---|---|---|
| 1 | Função | o problema que resolve · quando usar · quando **não** usar |
| 2 | Variantes | as variantes · escolha esta quando · não combine com |
| 3 | Estados | os estados · **qual token cada estado usa** · o que muda para a pessoa · feedback e foco |
| 4 | Acessibilidade | semântica · nome acessível · teclado e foco · contraste |
| 5 | Relações | combina com · **o que é pai, o que é filho** · **qual bloco complementa** · em que layouts aparece |
| 6 | Tokens, intenção e **Dicas para IA** | tokens semânticos · restrições de uso · **quando escolher esta peça e não a parecida** |
| 7 | Exemplos | caso recomendado · caso alternativo |
| 8 | Anti-padrões | não usar para · não combinar com · combinações inválidas · não criar sem decisão |
| 9 | Fontes e decisões | `design.md` · a decisão que originou · testes · evidência de uso |

## 4. O gabarito — copie a partir daqui

```markdown
---
peca: nph-<nome>                      # ou o nome do bloco, layout ou template
nivel: componente                     # componente | fundacao | bloco | layout | template
status: rascunho                      # rascunho | vigente | descontinuado
resolve: >-
  Uma frase: o problema que esta peça resolve.
use_quando: []                        # situações concretas
nao_use_quando: []                    # cada item aponta a peça certa para o caso
api:                                  # o CONTRATO PÚBLICO da peça. Não vira seção
  <propriedade>:                      #   em Markdown: API é valor, e valor mora aqui
    tipo: ""                          # string | boolean | number | enum
    valores: []                       # só quando tipo=enum; a lista fechada
    obrigatoria: false                # true | false
    padrao: ""                        # o valor assumido quando nada é passado
    reflete: false                    # true quando vira atributo no DOM, e por quê
    restricao: ""                     # o limite de uso, quando houver
variantes:
  <nome-da-variante>:
    eixo: aparencia                   # aparencia | tamanho | densidade
    escolha_quando: ""
    nao_combine_com: []
estados:
  <nome-do-estado>:
    token: ""                         # QUAL token semântico este estado usa
    muda_para_a_pessoa: ""
regras_de_negocio: []                 # regra do domínio que a peça carrega
erros_de_dominio: []                  # estados de erro do produto, não só visuais
tokens:                               # SÓ camada semântica
  <propriedade>: <token>
dicas_para_ia: []                     # frases de escolha, em linguagem natural
acessibilidade:
  semantica: ""                       # elemento ou role
  nome_acessivel: ""                  # de onde sai o nome
  teclado: []                         # teclas e o que cada uma faz
  foco: ""
  contraste: ""                       # pendente até a PI-05 fixar o nível de WCAG
  alternativa_a_cor: ""               # como o estado é percebido sem cor
combinacoes_invalidas: []             # cada item: o que não pode e por quê
relacoes:
  combina_com: []
  pai: []                             # o que costuma conter esta peça
  filho: []                           # o que esta peça costuma conter
  complementa_bloco: []               # o elo com a Fase 5
  aparece_em: []                      # blocos, layouts ou templates
  # nos níveis de composição, acrescente:
  # exige: []                         # peças obrigatórias
  # variacoes_aceitaveis: []
  # contexto_de_layout: ""
anti_padroes: []
fontes:
  design_md: ""
  decisao: ""                         # a decisão que originou a peça, com data
  testes: ""
  evidencia_de_uso: ""                # onde ela já é usada de verdade
  storybook: ""
  figma: ""
---

# <nome da peça>

## Função

- **Problema que resolve:**
- **Quando usar:**
- **Quando NÃO usar:**

## Variantes

- **Variantes por aparência:**
- **Variantes por tamanho:**
- **Variantes por densidade:**
- **Escolha esta variante quando:**
- **Não combine com:**

## Estados

- **Estados suportados, e o token de cada um:**
- **O que muda para a pessoa usuária:**
- **Regras de feedback e foco:**
- **Regra de negócio que a peça carrega:**
- **Estados de erro do domínio:**

## Acessibilidade

- **Semântica necessária:**
- **Nome acessível e rótulos:**
- **Teclado e foco:**
- **Contraste:**
- **Alternativa à cor:**

## Relações

- **Combina com:**
- **O que é pai (onde esta peça aparece dentro):**
- **O que é filho (o que ela contém):**
- **Qual bloco esta peça complementa:**
- **Aparece nos layouts:**

## Tokens, intenção e Dicas para IA

- **Tokens semânticos usados:**
- **Restrições de uso:**
- **Dicas para IA:**
  - <uma frase por linha, dizendo QUANDO escolher esta peça e não a parecida>

## Exemplos

- **Caso recomendado:**
- **Caso alternativo:**

## Anti-padrões

- **Não usar para:**
- **Não combinar com:**
- **Combinações inválidas, e por quê:**
- **Não criar nem adaptar sem decisão:**

## Fontes e decisões

- **`design.md` do repositório:**
- **A decisão que originou, com data e responsável:**
- **Testes:**
- **Evidência de uso:**
- **Storybook:**
- **Figma:**
```

## 5. O que muda em bloco, layout e template

**Mesmo gabarito** — eles não ganham estrutura própria —, com quatro acréscimos em
`relacoes` e na seção Relações:

| Acréscimo | O que responde |
|---|---|
| `exige` | Que peças a composição **obriga**. Sem elas, não é aquela composição |
| `variacoes_aceitaveis` | O que pode mudar sem virar outra coisa |
| `contexto_de_layout` | Em que layout ela costuma aparecer |
| Objetivo da composição | Que objetivo de interface ela resolve — não a aparência |

**O critério que separa componente de bloco:** componente é reutilizável em qualquer
contexto; bloco resolve uma situação específica. Um botão é componente. "Barra de
ações de uma listagem — filtrar, exportar, criar novo" é bloco.

**Restrição de origem:** bloco, layout e template só são documentados depois de
**extraídos** de padrão real ou de mock aprovado. Nenhum dos três nasce porque
apareceu em uma referência.

## 6. As três seções que não são negociáveis

- **Relações** é o que amarra os níveis. Sem ela, o agente sabe montar a peça e **não
  sabe onde encaixá-la** — e o resultado é uma tela que reúne componentes corretos sem
  formar uma interface coerente.
- **Anti-padrões** corta o espaço de erro. É o que impede a IA de inventar variantes
  que não funcionariam. Documento sem "nunca faça" está incompleto, mesmo parecendo
  completo.
- **Dicas para IA** é a mais fácil de esquecer, porque parece repetir a lista de
  tokens. Não repete: **a lista diz o que a peça consome; a dica diz quando escolher
  esta peça e não a parecida.** Exemplo: "use para a ação principal do formulário;
  para navegação simples, use link".

## 7. Quando a ficha está pronta

A peça sai da fila quando:

1. a ficha responde a **todos** os itens, sem campo em branco;
2. os tokens citados são semânticos e foram auditados;
3. cada estado nomeia o token que usa;
4. existe página no Figma com propósito, anatomia, variantes, estados e limites de uso;
5. existe história no Storybook cobrindo **cada variante e cada estado** — uma por
   variante e por estado, não uma por componente;
6. Figma e Storybook não divergem — ou a divergência está registrada com a decisão que
   falta;
7. as Dicas para IA existem e dizem quando escolher esta peça, não o que ela é;
8. o bloco `api` está completo e **confere com o código**, quando a peça já estiver
   implementada — propriedade por propriedade, não por impressão.

Checklist incompleto significa peça **em andamento**, não peça entregue.

## 8. Por onde começar

**Pelas fichas do `nph-icon` e do `nph-label`.** São os dois componentes já
implementados e integrados na branch principal: têm mais evidência no repositório e
calibram o formato para os três seguintes.

> A versão 1.0 deste template, de 20-08-2026, recomendava começar pelo `nph-input`,
> por ser o componente mais denso e o melhor teste do gabarito. O raciocínio continua
> bom, mas foi **superado pela decisão da Indiane em 30-08-2026**: evidência real de
> código pesa mais que densidade, nesta altura do projeto. O `nph-input` é a quinta
> ficha.

---

*Procedência: a estrutura, as duas metades, as regras de escrita, o gabarito base e o
critério de pronto são **evidência** — vêm de `Template de ficha — peças do Nephos.md`,
versão 1.0, de 20-08-2026. As nove seções, os acréscimos de estado, densidade,
relação de pai e filho, Dicas para IA e "Fontes e decisões" são **exigência da régua**.
A ordem de preenchimento é **decisão humana** da Indiane, em 30-08-2026. O destino do
nível de contraste é **pendência** — PI-05. O destino do arquivo foi decidido pela
Indiane em 31-08-2026: repositório, em `fichas/`.*
