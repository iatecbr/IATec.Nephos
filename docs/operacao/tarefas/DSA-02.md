```json
{
  "id": "DSA-02",
  "objetivo": "Ampliar o campo use do token status/error no design.md para cobrir a borda do campo de formulario.",
  "fase": "F4",
  "ordem_aprovada": 30,
  "responsavel": "claude-codigo",
  "estado": "aguardando-decisao",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "diff-restrito-ao-use",
      "descricao": "git diff mostra alteracao apenas no campo use de status/error no design.md; valor, alias, nome CSS e nao_use intactos.",
      "comando": "git diff -- design.md",
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    },
    {
      "id": "validacoes-do-projeto",
      "descricao": "As validacoes do repositorio passam depois da alteracao.",
      "comando": "npm run build:tokens && npm run test:tokens && npm run typecheck && npm test && npm run test:i18n && npm run test:operacao",
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [
    {
      "id": "D1",
      "pergunta": "Indiane autoriza acrescentar STROKE_COLOR ao escopo da variavel status/error no Figma? Sem isso a ligacao da borda nao e editavel pela interface.",
      "quem_decide": "indiane",
      "aberta_em": "2026-09-03"
    }
  ],
  "evidencias": [],
  "referencias_de_decisao": [],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "WORK BRAIN — 03 MEMÓRIA/decisoes/2026-09-03-tres-decisoes-visuais-do-nph-input.md",
    "data": "2026-09-03",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O use de status/error passa a cobrir a borda do campo de formulario, alem de icone, ponto, barra da mensagem e o asterisco do nph-label."
  },
  "revisao_git": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "contexto": null,
  "atualizado_em": "2026-09-03"
}
```

# DSA-02 — ampliar o `use` de `status/error`

## Objetivo
O campo `use` do token `status/error`, no `design.md`, passa a cobrir a borda do campo de
formulário. Percebe-se que existe quando o `nph-input` pode consumir o token para a borda
de erro sem violar o anti-padrão A2, que proíbe valor literal.

## Como se prova
**`diff-restrito-ao-use`** — o `git diff` toca **uma linha**: o `use` de `status/error`.
Valor, alias, nome CSS e `nao_use` ficam intactos. O texto atual está no `design.md`, na
região de `status/error`, e hoje diz "ícone, ponto, barra da mensagem" mais o asterisco
do `nph-label`.

**`validacoes-do-projeto`** — as validações do repositório passam depois da alteração.

O precedente é a ampliação feita para o asterisco do `nph-label` em 27-08-2026: mesma
forma, mesmo tipo de alteração.

## O que esta tarefa não faz
**Não é decisão nova** — é o registro de uma decisão já tomada pela Indiane em
03-09-2026. Não altera valor, alias, nome CSS nem `nao_use`. Não implementa o
`nph-input`. **Não altera o Figma**: acrescentar `STROKE_COLOR` ao escopo da variável é
alteração de token e depende da decisão D1.

## Fontes
- `design.md`, na seção de `status/error`
- `GOVERNANCA.md`, `AGENTS.md`

## Campos derivados, não sourced
`ordem_aprovada` = 30 vem da ordem das linhas da tabela de reconciliação M4 (linha 3 × 10).
Não está `pronta`, então não entra na fila. **`fase` = `F4` é derivada, não sourced**:
nenhuma fonte declara a fase desta tarefa; a atribuição vem de a alteração destravar a
construção de um componente prioritário. Confirmar com a Indiane.
