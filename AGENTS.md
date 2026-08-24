# Nephos — instruções para agentes

> **Antes de criar ou modificar qualquer UI, leia e siga `GOVERNANCA.md` e o
> `design.md`. Antes de usar um componente, abra a ficha dele em
> `fichas/<nome>.md`.**

> Este arquivo e o `CLAUDE.md` são espelhos. Toda mudança de governança deve ser
> aplicada aos dois.

## Preflight obrigatório

Antes de analisar, propor, editar ou implementar:

1. Leia `GOVERNANCA.md`, o `README.md`, o `design.md` e a ficha e nota de
   fundação aplicáveis.
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
- Use Font Awesome Classic. Duotone não faz parte do Nephos.
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

## Limites ainda dependentes de decisão técnica

O que existe hoje neste repositório é o shell do Storybook com a página
"Nephos — Em construção". Nenhum componente, token em código, teste, pipeline
ou publicação foi definido.

npm e `@storybook/web-components-vite` são escolhas **provisórias** de
bootstrap, a confirmar com Elvys. Não as trate como arquitetura definitiva e
não derive delas estrutura de diretórios, formato de token, teste ou
publicação.

Antes do primeiro componente, veja "Pendências antes do primeiro componente"
no `README.md`: P01, P02, P03, P17 e P19 continuam **pendentes**. Não as feche
nem presuma seu resultado. Diante de lacuna, pare e registre o impedimento.
