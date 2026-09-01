---
peca: nph-icon
nivel: componente
status: vigente
titulo: "nph-icon"
tipo: ficha de componente
criado: 2026-08-31
atualizado: 2026-08-31
resolve: >-
  Disponibiliza um ícone do núcleo Nephos com tamanho, família e acessibilidade
  consistentes, sem introduzir cor ou arte fora do acervo aprovado.
use_quando:
  - "Um controle ou conteúdo precisa de um ícone que existe no núcleo de 34."
  - "O ícone reforça um rótulo, estado ou direção sem substituir a informação textual."
nao_use_quando:
  - "A ação tem consequência ou é específica do domínio — use rótulo textual junto."
  - "O ícone que você precisa não existe no núcleo: registre a lacuna e pergunte."

api:
  name:
    tipo: string
    obrigatoria: true
    padrao: nenhum
    reflete: false
    restricao: >-
      Em kebab-case, e limitado aos 34 nomes do núcleo. Nome fora do núcleo não
      renderiza e emite erro só em desenvolvimento.
  variant:
    tipo: enum
    valores: [regular, solid]
    obrigatoria: false
    padrao: regular
    reflete: false
    restricao: >-
      `solid` só existe para `star`. Com outro nome não há arte, e o ícone não
      renderiza. Light, Thin e Sharp não existem no contrato.
  size:
    tipo: enum
    valores: [sm, md, lg]
    obrigatoria: true
    padrao: nenhum
    reflete: true
    restricao: >-
      Reflete como atributo porque o CSS interno seleciona a caixa por ele. Não
      aceita valor livre e não tem padrão — ausente, o ícone não renderiza.
  label:
    tipo: string
    obrigatoria: false
    padrao: vazio
    reflete: false
    restricao: >-
      Ausente, vazio ou só com espaços torna o ícone decorativo e aplica
      `aria-hidden`. Valor não vazio vira o nome acessível.
  slots: nenhum
  eventos: nenhum
  cor: >-
    Não é propriedade. Herda `currentColor` do contexto — não existe token de cor
    de ícone.

variantes:
  variant:
    eixo: aparencia
    escolha_quando: "regular por padrão; solid apenas no `star` favoritado"
    nao_combine_com: ["nomes sem arte solid", "light, thin, sharp"]
  size:
    eixo: tamanho
    escolha_quando: "sm dentro de controle e célula; md em menu e aba; lg quando o ícone carrega significado sozinho"
    nao_combine_com: ["valor livre de tamanho"]

estados:
  nao_se_aplica:
    token: nao_se_aplica
    muda_para_a_pessoa: "O estado pertence ao controle que consome o ícone, não ao ícone"

regras_de_negocio: []
erros_de_dominio: []

tokens:
  tamanho: [icon/size-sm, icon/size-md, icon/size-lg]
  cor: currentColor

dicas_para_ia:
  - "Ação com consequência nunca leva ícone sozinho — põe texto."
  - "Na dúvida de tamanho, `size=sm`."
  - "Não procure propriedade de cor: ela não existe, o ícone herda do contexto."
  - "Ícone ao lado de texto é decorativo: deixe `label` vazio."
  - "Ícone sozinho num controle: o `label` vai no controle, não no ícone."

acessibilidade:
  semantica: "Sem papel próprio. Decorativo por padrão"
  nome_acessivel: "Vem de `label`; vazio marca como decorativo e aplica aria-hidden"
  teclado: []
  foco: "Nunca recebe foco. O foco pertence ao controle envolvente"
  contraste: "Ícone significativo: 3:1 contra o fundo (WCAG 1.4.11)"
  alternativa_a_cor: "Ícone nunca é o único sinal de um estado"

combinacoes_invalidas:
  - "`variant=solid` com nome diferente de `star` — não há arte"
  - "`size` ausente — não há padrão"
  - "Duotone fora de navegação estrutural"

relacoes:
  combina_com: [nph-button, nph-spinner]
  pai: [nph-button, "os controles que o contêm"]
  filho: []
  complementa_bloco: [pendente]
  aparece_em: [pendente]

anti_padroes:
  - "Ícone sozinho em ação com consequência"
  - "Pintar o ícone com cor que não seja a do contexto"
  - "Usar tamanho fora dos três tokens"
  - "Simular Duotone com arte ou variante vazia"

fontes:
  design_md: "design.md, no repositório"
  decisao: "P21, adotada por Indiane em 26-08-2026"
  testes: "src/components/nph-icon/nph-icon.test.ts"
  evidencia_de_uso: "branch v/3.0.0, PR #6, merge 437dd60"
  storybook: "src/components/nph-icon/nph-icon.stories.ts"
  figma: "página NPH — Icon (346:2)"
tags: [nephos, ds-agentico, ficha, componente, nph-icon]
---

> **Referências marcadas `(vault)`** estão em `02 PROJETOS/DS-Agentico/`, no WORK BRAIN —
> fora deste repositório. Elas eram wikilinks do Obsidian e foram convertidas em
> referência explícita na migração de 31-08-2026.

# nph-icon

> **A API está no bloco YAML acima**, e é lá que ela mora — decisão da Indiane em
> 31-08-2026. Este texto responde **quando escolher esta peça**, não o que ela aceita.
>
> As regras de acervo, família, tamanho e cor são da `Fundação — ícones` (vault). Esta ficha
> não as repete: aponta.
>
> Volta para `Índice — DS-Agentico` (vault).

## Função

**O problema que resolve:** dá aos controles e ao conteúdo do Nephos um ícone curado,
acessível e consistente, sem abrir espaço para arte ou cor fora do acervo aprovado.

**Quando usar:** quando um controle ou conteúdo precisa de um dos **34 ícones do
núcleo**, para reforçar um rótulo, um estado, uma direção ou uma ação universal
recorrente.

**Quando NÃO usar:**

- **Como substituto de rótulo** em ação com consequência — excluir, aprovar, publicar,
  exportar — ou em qualquer ação específica do domínio. Ali vai texto.
- **Quando o ícone não existe no núcleo.** É lacuna: pergunte, não desenhe.
- **Quando o ícone só repete o rótulo ao lado.** Se o texto já diz tudo, o ícone ocupa
  espaço sem acrescentar.

## Variantes

**Por aparência — `variant`:** `regular` é o padrão. `solid` **só existe para o `star`**,
e marca o item favoritado. É a aplicação da regra de que Solid marca o item atual dentro
de um grupo Classic.

**Por tamanho — `size`:** `sm` dentro de controle, célula de tabela e campo; `md` em item
de menu, aba e ação de destaque; `lg` quando o ícone carrega significado sozinho —
estado vazio, cabeçalho de seção. **Na dúvida, `sm`.**

**Por densidade:** `nao_se_aplica`. O ícone não tem eixo de densidade; quem muda de
densidade é o controle em volta.

**Não combine com:** `solid` em nome que não seja `star`, tamanho livre, e as famílias
Light, Thin e Sharp — que não existem no contrato.

## Estados

**Estados suportados: `nao_se_aplica`.** O ícone não tem estado próprio — **o estado
pertence ao controle que o consome**. Hover, foco, selecionado e desabilitado são do
botão, do item de menu, da linha da tabela.

**Por isso não há token de estado nesta ficha.** O ícone herda `currentColor`: quando o
contexto muda de estado, a cor do ícone acompanha sem que ele saiba disso.

**O que muda para a pessoa:** o ícone reforça a informação disponível sem duplicá-la.

**Feedback e foco:** **o ícone nunca recebe foco.** O foco e o alvo de toque pertencem ao
controle envolvente — o ícone de 16 não é o alvo.

**Caixa e ícones largos:** `eye`, `eye-slash` e `star` podem transbordar
horizontalmente, centralizados, **sem corte e sem reescala**. A caixa continua quadrada e
o desenho é escalado pela altura.

**Entrada inválida:** `name` fora do núcleo, `size` ausente ou fora da lista, ou
`variant` inexistente **não renderizam ícone** e emitem erro de desenvolvimento no
console — **somente em ambiente de desenvolvimento**. Cada reprovação emite o próprio
erro, para quem estiver desenvolvendo ver todas as causas, não a primeira.

> ⚠️ **Pendência aberta — PF-08.** Estados e foco do ícone **dentro de um botão só de
> ícone** não estão decididos. Ver `Pendências do Nephos` (vault).

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | Sem papel próprio. **Decorativo por padrão** |
| Nome acessível | Vem de `label`. **Ausente, vazio ou só com espaços → decorativo, com `aria-hidden`** |
| Ícone ao lado de texto | `label` vazio. Senão o leitor de tela lê a mesma coisa duas vezes |
| Ícone sem texto visível | O rótulo acessível é **obrigatório** — e quando o ícone está dentro de um controle, ele vai **no controle** |
| Teclado e foco | **Nunca recebe foco isolado** |
| Contraste | Ícone significativo: **3:1** contra o fundo — WCAG 1.4.11 |
| Alternativa à cor | **Ícone nunca é o único sinal** de um estado. Estado carrega ícone, cor e texto |

## Relações

**Combina com:** `nph-button` e `nph-spinner`.

**O que é pai — onde este ícone aparece dentro:** os controles que o contêm.
`nph-button` é o primeiro, e o `nph-spinner` usa a arte `circle-notch` deste núcleo.

**O que é filho:** nada. O `nph-icon` é folha — não contém outra peça.

**Qual bloco complementa:** `pendente`. A Fase 5 não começou e nenhum bloco foi extraído
de tela real.

**Aparece nos layouts:** `pendente`, pelo mesmo motivo.

**A dependência que ordena a fila:** `nph-icon` vem **antes** de `nph-icon-button`, de
`nph-spinner` e de `nph-badge`.

## Tokens, intenção e Dicas para IA

**Tokens semânticos usados:** `icon/size-sm`, `icon/size-md` e `icon/size-lg`.

**Restrições de uso:**

- A cor herda `currentColor`. **Não existe token de cor de ícone**, e o componente não
  consome `core/*` diretamente.
- `space/inline-tight`, o espaço entre ícone e texto, **é do contêiner que compõe os
  dois** — não do `nph-icon`.

**Dicas para IA:**

- **Ação com consequência nunca leva ícone sozinho.** Excluir, aprovar, publicar,
  exportar: põe texto.
- **Na dúvida de tamanho, `size=sm`.** É o que acompanha o texto de corpo e cabe em
  qualquer controle.
- **Não procure propriedade de cor** — ela não existe. Se você quer mudar a cor do
  ícone, mude a cor do contexto.
- **Ícone ao lado de texto é decorativo:** deixe `label` vazio.
- **Ícone sozinho dentro de um controle:** o rótulo acessível vai **no controle**, não no
  ícone.
- **`size` é obrigatório e não tem padrão.** Esquecer significa ícone que não aparece.
- **Se o ícone que você precisa não está nos 34: sinalize a lacuna, não desenhe.**

## Exemplos

**Caso recomendado:** `magnifying-glass` em uma ação de busca, com o rótulo acessível no
controle e o ícone decorativo.

**Caso alternativo:** `circle-notch` como arte do `nph-spinner` — o mesmo núcleo servindo
outro componente, em vez de arte nova.

## Anti-padrões

- **Não usar para:** comunicar sozinho uma ação destrutiva ou de domínio.
- **Não combinar com:** família proibida, Duotone fora de navegação estrutural, ícone
  fora do núcleo.
- **Combinações inválidas, e por quê:** `variant=solid` com nome diferente de `star` —
  não existe a arte, e o ícone não renderiza · `size` ausente — não há padrão, e o ícone
  não renderiza · Duotone em botão, campo, feedback, alerta, tabela ou ação destrutiva —
  proibido pela fundação.
- **Não criar nem adaptar sem decisão:** arte, nome, variante, token de cor, tamanho
  livre ou qualquer configuração de licença.

## Fontes e decisões

### Estado da implementação — evidência verificada em 31-08-2026

| O quê | Evidência |
|---|---|
| Implementado e integrado | Está na branch padrão `v/3.0.0`, pelo **PR #6**, merge `437dd60`, em 27-08-2026 |
| A API do código | `name`, `variant`, `size` e `label` — **exatamente o contrato desta ficha**, conferido propriedade por propriedade em `src/components/nph-icon/nph-icon.ts` |
| O núcleo no código | `NPH_ICON_NAMES` tem **34 nomes**, batendo com o núcleo curado |
| `size` reflete no DOM | Confirmado no código, com o motivo escrito lá: o CSS interno seleciona a caixa por ele |
| Erro de entrada inválida | Confirmado: só em ambiente de desenvolvimento |
| Stories | 5 em `nph-icon.stories.ts` |
| Testes | 30 casos declarados em `nph-icon.test.ts` |
| Aprovação visual | Indiane, em **26-08-2026**, na página `NPH — Icon` (`346:2`) |

> **Uma divergência que encontrei, e como resolvi.** A ficha antiga em
> `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-icon.md` diz que o gate restante é
> "comparar Figma × Storybook e registrar o aceite". **O `Estado vigente — Nephos` (vault)
> registra que a comparação foi feita e aceita pela Indiane em 26-08-2026.** O Estado é
> a fonte única de estado, e é ele que vale — a ficha antiga ficou para trás e é memória.

| O quê | Onde |
|---|---|
| Contrato técnico | `design.md`, no repositório |
| A decisão que originou | **P21**, adotada por Indiane em 26-08-2026, com Lit, Shadow DOM aberto, SVG inline, mapa fechado dos 34 ícones e Font Awesome Pro 6.7.2 |
| Decisões posteriores ao plano técnico | `size` obrigatório · erro de entrada inválida só em desenvolvimento · `space/inline-tight` é do contêiner · `label` só com espaços é decorativo · `eye`, `eye-slash` e `star` podem transbordar |
| Testes | `src/components/nph-icon/nph-icon.test.ts` |
| Storybook | `src/components/nph-icon/nph-icon.stories.ts` |
| Figma | página `NPH — Icon` (`346:2`), frames `346:3` e `346:4` |
| Regras de acervo, família, tamanho e cor | `Fundação — ícones` (vault) |
| A ficha de origem, agora memória | `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-icon.md` |
| O que está aberto | `Pendências do Nephos` (vault) — **PF-08**, **PF-10**, **PO-001** e **PE-04** |

**Licença.** Nenhuma credencial é versionada. Licença, variável de CI, plataforma e
política de credencial continuam pendentes de confirmação do Elvys — **PE-04**.

---

*Procedência: função, variantes, estados, acessibilidade, relações, exemplos e
anti-padrões são **evidência** — vêm da ficha de origem, reescritas no modelo de nove
seções, sem alteração de regra. O bloco `api` e a tabela de estado da implementação são
**evidência verificada no repositório** em 31-08-2026, propriedade por propriedade. As
Dicas para IA são **novas**, destiladas dos critérios já escritos. A P21 e as decisões
posteriores são **decisão humana** da Indiane, em 26-08-2026. PF-08 é **pendência**.
Nenhuma alteração foi feita em código, tokens, testes, Figma ou repositório.*
