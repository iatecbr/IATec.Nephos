# Nephos — instruções para Claude

> **Antes de criar ou modificar qualquer UI, leia e siga `GOVERNANCA.md` e o
> `design.md`. Antes de usar um componente, abra a ficha dele em
> `fichas/<nome>.md`.**

> Este arquivo espelha o `AGENTS.md`. Toda mudança de governança deve ser
> aplicada aos dois.

## Antes de agir

1. Leia `GOVERNANCA.md`, o `README.md`, o `design.md` e as fichas e notas
   aplicáveis.
2. Para regras visuais e valores de token, consulte o Figma
   `DS-IA-NEPHOS 5.0`. Sem evidência verificável, pare e peça confirmação.
3. Diferencie fato verificado, decisão vigente, proposta e pendência.
4. Confirme que cada token, componente, variante e estado existe nas fontes
   vigentes.

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

## Restrições duras

- Escreva Web Components em Lit com prefixo `nph-`.
- Use somente tokens semânticos nos componentes; nunca consuma valores
  literais, `core/*` ou `theme/*`.
- Use Font Awesome Classic; nunca use Duotone.
- Para cada componente, primeiro derive e aprove visualmente no Figma a
  referência estrutural do Obra configurada com tokens Nephos; depois
  implemente no repositório.
- Enquanto o licenciamento do Obra CE/shadcn estiver em validação, use-o apenas
  como referência visual e estrutural; nunca copie código, assets, tokens ou
  componentes para entregáveis do Nephos.
- Mantenha a ficha, o Figma, o Storybook e o contrato consistentes.
- Ao concluir, registre data, responsável, fonte de evidência, decisão alterada
  e documentos sincronizados.

## Nunca faça

- NUNCA use React, Vue, Angular, Svelte ou outro framework para escrever o
  Nephos.
- NUNCA use Tailwind, shadcn/ui, Radix ou outra biblioteca de componentes como
  dependência de código.
- NUNCA escreva valores literais no CSS de componente.
- NUNCA invente tokens, componentes, variantes, estados, combinações, métricas
  de progresso ou decisões de produto.
- NUNCA declare implementação, testes, Storybook, branch, commit ou publicação
  sem evidência verificável.

## Decisões técnicas vigentes

**Antes de criar ou modificar componentes, leia
[`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md). P01, P02, P03, P17 e
P19 são decisões vigentes e devem ser seguidas. Não as altere, substitua ou
reabra sem explicar o conflito técnico, registrar uma proposta de mudança e
solicitar revisão humana.**

Status das cinco: *decisão adotada pela Indiane em 24/08/2026 — aguardando
revisão de Elvys*. Elas valem para o trabalho atual. **Elvys não as aprovou**:
não escreva nem sugira em lugar nenhum que ele aprovou. Se ele der orientação
posterior que conflite com alguma, a orientação dele prevalece e a nota deve
ser atualizada.

Em resumo, e sem substituir a leitura da nota: Shadow DOM aberto (P01); CSS
custom properties como API pública e `::part` para partes internas, com classes
internas fora do contrato (P02); componente, CSS, story e teste juntos em
`src/components/<nome>/` (P03); JSON como formato-fonte dos tokens e CSS custom
properties como formato gerado (P17); `@storybook/web-components-vite` mantido,
com build no CI em pull requests como artefato privado (P19).

## Quando parar

Pare e peça confirmação quando faltar uma decisão, fonte de verdade, ficha
necessária, evidência visual ou quando fontes vigentes divergirem.

Nem tudo foi decidido. A nota registra, em cada decisão, o que ficou fora de
escopo, e registra os conflitos que continuam **abertos** — em especial o
formato canônico dos tokens diante do YAML do `design.md`. Não presuma o
resultado de um conflito aberto: pare e registre o impedimento.
