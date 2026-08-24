# Nephos - instrucoes para agentes

> **Antes de criar ou modificar qualquer UI, leia e siga `GOVERNANCA.md` e o
> `design.md`. Antes de usar um componente, abra a ficha dele em
> `fichas/<nome>.md`.**

> Este arquivo e o `CLAUDE.md` sao espelhos. Toda mudanca de governanca deve ser
> aplicada aos dois.

## Preflight obrigatorio

Antes de analisar, propor, editar ou implementar:

1. Leia `GOVERNANCA.md`, o `README.md`, o `design.md` e a ficha e nota de
   fundacao aplicaveis.
2. Consulte o Figma `DS-IA-NEPHOS 5.0` para afirmar ou alterar valores de
   tokens e decisoes visuais. Sem acesso, peca exportacao ou confirmacao
   verificavel.
3. Declare as fontes lidas, as restricoes aplicaveis, as lacunas ou conflitos
   e a evidencia existente no repositorio.
4. Verifique que cada token, componente, variante e estado existe na fonte
   vigente.
5. Pare e peca confirmacao diante de lacuna de decisao, ficha necessaria,
   fonte de verdade ausente ou conflito entre fontes vigentes.

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

## Regras obrigatorias

- Todo componente e um Web Component escrito com Lit e com prefixo `nph-`.
- Componentes consomem somente tokens semanticos; nunca consomem valores
  literais, `core/*` ou `theme/*`.
- Use Font Awesome Classic. Duotone nao faz parte do Nephos.
- Para cada componente, primeiro derive a referencia estrutural do Obra no
  Figma, configure-a com tokens Nephos e obtenha aprovacao visual. So entao
  implemente no repositorio.
- Enquanto o licenciamento do Obra CE/shadcn estiver em validacao, use-o apenas
  como referencia visual e estrutural; nunca copie codigo, assets, tokens ou
  componentes para entregaveis do Nephos.
- Registre data, responsavel, fonte de evidencia, decisao alterada e
  documentos sincronizados ao concluir.

## Proibicoes

- NUNCA implemente o Nephos com React, Vue, Angular, Svelte ou outro framework.
  Eles sao ambientes de consumo, nao a tecnologia de autoria.
- NUNCA use Tailwind ou outro framework de CSS utilitario.
- NUNCA instale shadcn/ui, Radix ou outra biblioteca de componentes. O Obra e
  referencia visual e estrutural, nao dependencia de codigo.
- NUNCA escreva valores literais de cor, espacamento, raio, elevacao,
  tipografia ou movimento no CSS de componente.
- NUNCA invente tokens, componentes, variantes, estados, combinacoes,
  metricas de progresso ou decisoes de produto.
- NUNCA declare branch, commit, Storybook, componente ou publicacao como
  existente sem evidencia verificavel no repositorio.

## Limites ainda dependentes de decisao tecnica

O que existe hoje neste repositorio e o shell do Storybook com a pagina
"Nephos - Em construcao". Nenhum componente, token em codigo, teste, pipeline
ou publicacao foi definido.

npm e `@storybook/web-components-vite` sao escolhas **provisorias** de
bootstrap, a confirmar com Elvys. Nao as trate como arquitetura definitiva e
nao derive delas estrutura de diretorios, formato de token, teste ou
publicacao.

Antes do primeiro componente, veja "Pendencias antes do primeiro componente"
no `README.md`: P01, P02, P03, P17 e P19 continuam **pendentes**. Nao as feche
nem presuma seu resultado. Diante de lacuna, pare e registre o impedimento.
