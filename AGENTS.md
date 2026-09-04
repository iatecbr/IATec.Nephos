# Nephos — instruções para agentes

> **Antes de criar ou modificar qualquer UI, leia e siga `GOVERNANCA.md` e o
> `design.md`. Antes de usar um componente, abra a ficha dele em
> `fichas/<nome>.md`.**

> **Este é o contrato comum de todos os agentes.** O `CLAUDE.md` não é espelho
> deste arquivo: ele acrescenta apenas o que é exclusivo do Claude e remete a
> este para todo o resto. Regra que vale para qualquer agente muda aqui, e só
> aqui.

## Preflight obrigatório

Antes de analisar, propor, editar ou implementar:

1. Leia `GOVERNANCA.md`, o `README.md`, o `design.md`,
   `docs/decisoes-tecnicas.md`, a ficha do componente em `fichas/<nome>.md` e a
   nota de fundação aplicável. O gabarito de ficha é `fichas/_modelo.md`.
   Quando `product.md` existir com conteúdo aprovado, leia-o também. Quando
   `docs/operacao/` existir, abra a tarefa indicada e as evidências dela antes
   de qualquer contexto curto de sessão.
2. Consulte o Figma `DS-IA-NEPHOS 5.0` para afirmar ou alterar valores de
   tokens e decisões visuais. Sem acesso, peça exportação ou confirmação
   verificável.
3. Declare as fontes lidas, as restrições aplicáveis, as lacunas ou conflitos
   e a evidência existente no repositório.
4. Verifique que cada token, componente, variante e estado existe na fonte
   vigente.
5. Pare e peça confirmação diante de lacuna de decisão, ficha necessária,
   fonte de verdade ausente ou conflito entre fontes vigentes.

## Salvaguardas contra erro documental

1. Estado vigente e fonte canônica vencem sessões, listas e decisões históricas
   ou superadas. Histórico explica o passado; nunca cria regra atual.
2. Decisão delegada continua aberta até ter evidência verificável na fonte
   apropriada. Não a declare fechada por haver responsável, recomendação ou
   conversa prévia.
3. Feche pendência somente com decisão ou evidência, data, responsável e
   localização verificável. Feche apenas a parte comprovada.
4. Ao criar, unificar, remover ou tornar interno um componente, confira lista
   vigente, numeração, total, fórmula de progresso, itens restantes, plano,
   contrato e documentos derivados. Conte somente a lista completa; não some o
   P0 uma segunda vez.
5. Atualize primeiro a fonte canônica. Documento histórico ou superado só
   recebe anotação de superação para evitar contradição; não o reescreva como
   regra atual.
6. Se uma verificação falhar, corrija o método e execute-a novamente antes de
   declarar resultado.

## Regras obrigatórias

- Todo componente é um Web Component escrito com Lit e com prefixo `nph-`.
- Componentes consomem somente tokens semânticos; nunca consomem valores
  literais, `core/*` ou `theme/*`.
- Use **Font Awesome Pro**. **Classic** é a família padrão: todo ícone de
  conteúdo, ação, estado, feedback e direção. **Duotone é permitido somente em
  navegação estrutural** — menu, sidebar, grupo de navegação, atalho e
  indicador de localização. Fora da navegação, Duotone é proibido: nada de
  botão, campo, feedback, validação, alerta, tabela ou ação destrutiva. Nunca
  misture Duotone e Classic no mesmo grupo de navegação. Light, Thin e Sharp
  continuam proibidos. A chave de licença fica em variável de ambiente e
  **nunca** entra no repositório.
- Para cada componente, primeiro derive a referência estrutural do Obra no
  Figma, configure-a com tokens Nephos e obtenha aprovação visual. Só então
  implemente no repositório.
- Enquanto o licenciamento do Obra CE/shadcn estiver em validação, use-o apenas
  como referência visual e estrutural; nunca copie código, assets, tokens ou
  componentes para entregáveis do Nephos.
- Registre data, responsável, fonte de evidência, decisão alterada e
  documentos sincronizados ao concluir.

## Proibições

- NUNCA implemente o Nephos com React, Vue, Angular, Svelte ou outro framework.
  Eles são ambientes de consumo, não a tecnologia de autoria.
- NUNCA use Tailwind ou outro framework de CSS utilitário.
- NUNCA instale shadcn/ui, Radix ou outra biblioteca de componentes. O Obra é
  referência visual e estrutural, não dependência de código.
- NUNCA escreva valores literais de cor, espaçamento, raio, elevação,
  tipografia ou movimento no CSS de componente.
- NUNCA invente tokens, componentes, variantes, estados, combinações,
  métricas de progresso ou decisões de produto.
- NUNCA declare branch, commit, Storybook, componente ou publicação como
  existente sem evidência verificável no repositório.

## Onde o agente pode escrever

| Pode escrever | Nunca escreve |
|---|---|
| `src/components/<nome>/` — implementação, CSS, story e teste da peça (P03) | `src/tokens/generated/` — é gerado por `npm run build:tokens` |
| `src/tokens/source/*.tokens.json` — só com evidência de leitura do Figma | `.npmrc` — configuração local de credencial, fora do Git |
| `src/styles/` e `src/shared/` — padrão P03; criar só quando a peça exigir | `storybook-static/` — artefato de build |
| `fichas/<nome>.md` — a partir de `fichas/_modelo.md` | `.env` e variantes — segredo nunca entra no repositório |
| `.storybook/i18n/` — os dicionários de idioma, um arquivo por idioma | `.claude/` e `.agents/` — ferramentas locais, ignoradas pelo Git |
| `scripts/` — gerador e validações, sempre por decisão registrada | Qualquer arquivo fora deste repositório |
| `docs/` e `stories/` | |

Fora desta lista, pare e peça autorização. Espalhar arquivo em diretório novo
sem decisão registrada é o mesmo que inventar estrutura.

## Versões em uso — consulte, não presuma

O modelo conhece a versão do treino dele, não a deste repositório. Antes de usar
uma API, confira a versão aqui e, na dúvida, leia a documentação da versão.

| Dependência | Versão declarada em `package.json` |
|---|---|
| `lit` | ^3.3.3 |
| `@fortawesome/pro-regular-svg-icons` e `pro-solid-svg-icons` | 6.7.2 (fixas) |
| `storybook` e `@storybook/web-components-vite` | ^10.5.10 |
| `style-dictionary` | ^5.5.2 |
| `vite` | ^8.2.2 |
| `vitest` e `@vitest/browser-playwright` | ^4.1.11 |
| `playwright` | ^1.62.1 |
| `typescript` | ^5.9.3 |

Ambiente validado: Node 24.18.0 e npm 11.16.0. O package manager é **npm**.
Quando esta tabela e o `package.json` divergirem, vale o `package.json` — e a
tabela está errada e precisa ser corrigida no mesmo PR.

## Decisões técnicas vigentes

**P01, P02, P03, P17, P19, P20 e P21 são decisões vigentes e devem ser seguidas. Não as
altere, substitua ou reabra sem explicar o conflito técnico, registrar uma
proposta de mudança e solicitar revisão humana.**

Status: *decisão adotada pela Indiane em 24/08/2026 (P21 em 26/08/2026) —
revisada e aprovada por Elvys em 28/08/2026*. Elas valem para o trabalho
atual. A P62 (`nph-label`, tipografia e dimensões, registrada em
27/08/2026) também foi revisada por Elvys em 28/08/2026: aprovou P62.1, P62.2
e P62.3 como estavam registradas; a P62.4 ele resolveu decidindo migrar o
gerador de `px` para `rem` — **migração implementada em 28/08/2026 e mergeada
no PR #12**. A **P62.5**, adotada pela Indiane em 28/08/2026, mantém
`core/radius` em `px` e **aguarda revisão de Elvys**: não converta o raio. Ver
`docs/decisoes-tecnicas.md`. Se ele der orientação posterior que conflite com
alguma, a orientação dele prevalece e a nota deve ser atualizada.

Em resumo, e sem substituir a leitura da nota: Shadow DOM aberto (P01); CSS
custom properties como API pública e `::part` para partes internas, com classes
internas fora do contrato (P02); componente, CSS, story e teste juntos em
`src/components/<nome>/` (P03); JSON como formato-fonte dos tokens e CSS custom
properties como formato gerado (P17); `@storybook/web-components-vite` mantido (P19); Style Dictionary v5 como gerador, com `data-nph-brand` e `data-nph-color-scheme` como contrato público de tema (P20); e o plano técnico do `nph-icon`, com o contrato do componente e a base de validação (P21).
Quando o workflow de CI for criado, ele executará o build em pull requests e
disponibilizará um artefato privado (P19).

O repositório tem **404 tokens técnicos** em `src/tokens/source/*.tokens.json` —
168 em `core`, 6 em `theme` e 230 em `semantic` —, com o CSS gerado em
`src/tokens/generated/tokens.css`: **nunca edite o CSS gerado**. Dois
componentes estão implementados, com stories e testes: `nph-icon`, desde o PR
#6, e `nph-label`, desde o PR #10. As fichas de componente são canônicas em
`fichas/<nome>.md`, com o gabarito em `fichas/_modelo.md`, desde o PR #13.
**O workflow de CI e a publicação continuam inexistentes.** A nota registra, em
cada decisão, o que ficou fora de escopo. O P17 também fixa a fonte canônica por
responsabilidade: o Figma é a fonte visual, o `design.md` é o contrato humano e
agêntico, o JSON é a fonte técnica dos valores auditados e o CSS é gerado do
JSON, nunca editado à mão. Diante de lacuna, pare e registre o impedimento.
