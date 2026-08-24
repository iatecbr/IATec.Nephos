# Nephos - instrucoes para Claude

> **Antes de criar ou modificar qualquer UI, leia e siga `GOVERNANCA.md` e o
> `design.md`. Antes de usar um componente, abra a ficha dele em
> `fichas/<nome>.md`.**

> Este arquivo espelha o `AGENTS.md`. Toda mudanca de governanca deve ser
> aplicada aos dois.

## Antes de agir

1. Leia `GOVERNANCA.md`, o `README.md`, o `design.md` e as fichas e notas
   aplicaveis.
2. Para regras visuais e valores de token, consulte o Figma
   `DS-IA-NEPHOS 5.0`. Sem evidencia verificavel, pare e peca confirmacao.
3. Diferencie fato verificado, decisao vigente, proposta e pendencia.
4. Confirme que cada token, componente, variante e estado existe nas fontes
   vigentes.

## Salvaguardas contra erro documental

1. Estado vigente e fonte canonica vencem sessoes, listas e decisoes historicas
   ou superadas. Historico explica o passado; nunca cria regra atual.
2. Decisao delegada continua aberta ate ter evidencia verificavel na fonte
   apropriada. Nao a declare fechada por haver responsavel, recomendacao ou
   conversa previa.
3. Feche pendencia somente com decisao ou evidencia, data, responsavel e
   localizacao verificavel. Feche apenas a parte comprovada.
4. Ao criar, unificar, remover ou tornar interno um componente, confira lista
   vigente, numeracao, total, formula de progresso, itens restantes, plano,
   contrato e documentos derivados. Conte somente a lista completa; nao some o
   P0 uma segunda vez.
5. Atualize primeiro a fonte canonica. Documento historico ou superado so
   recebe anotacao de superacao para evitar contradicao; nao o reescreva como
   regra atual.
6. Se uma verificacao falhar, corrija o metodo e execute-a novamente antes de
   declarar resultado.

## Restricoes duras

- Escreva Web Components em Lit com prefixo `nph-`.
- Use somente tokens semanticos nos componentes; nunca consuma valores
  literais, `core/*` ou `theme/*`.
- Use Font Awesome Classic; nunca use Duotone.
- Para cada componente, primeiro derive e aprove visualmente no Figma a
  referencia estrutural do Obra configurada com tokens Nephos; depois
  implemente no repositorio.
- Enquanto o licenciamento do Obra CE/shadcn estiver em validacao, use-o apenas
  como referencia visual e estrutural; nunca copie codigo, assets, tokens ou
  componentes para entregaveis do Nephos.
- Mantenha a ficha, o Figma, o Storybook e o contrato consistentes.
- Ao concluir, registre data, responsavel, fonte de evidencia, decisao alterada
  e documentos sincronizados.

## Nunca faca

- NUNCA use React, Vue, Angular, Svelte ou outro framework para escrever o
  Nephos.
- NUNCA use Tailwind, shadcn/ui, Radix ou outra biblioteca de componentes como
  dependencia de codigo.
- NUNCA escreva valores literais no CSS de componente.
- NUNCA invente tokens, componentes, variantes, estados, combinacoes, metricas
  de progresso ou decisoes de produto.
- NUNCA declare implementacao, testes, Storybook, branch, commit ou publicacao
  sem evidencia verificavel.

## Quando parar

Pare e peca confirmacao quando faltar uma decisao, fonte de verdade, ficha
necessaria, evidencia visual ou quando fontes vigentes divergirem.

npm e `@storybook/web-components-vite` sao escolhas **provisorias** de
bootstrap, a confirmar com Elvys. Nao presuma a partir delas diretorios,
distribuicao de tokens, testes ou publicacao. As pendencias P01, P02, P03, P17
e P19, listadas no `README.md`, continuam abertas: nao as feche nem presuma
seu resultado.
