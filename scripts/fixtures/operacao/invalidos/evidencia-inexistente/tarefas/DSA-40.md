```json
{
  "id": "DSA-40",
  "objetivo": "Exemplo de validacao do verificador operacional.",
  "fase": "F4",
  "ordem_aprovada": 10,
  "responsavel": "claude-codigo",
  "estado": "bloqueada",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "arquivo-existe",
      "descricao": "O artefato previsto existe e esta versionado.",
      "comando": "npm run test:operacao",
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [
    {
      "id": "B1",
      "o_que_trava": "Exemplo de bloqueio aberto, usado so como fixture.",
      "dono": "indiane",
      "o_que_resolve": "A decisao registrada que fecha o bloqueio.",
      "aberto_em": "2026-09-02"
    }
  ],
  "decisoes_pendentes": [],
  "evidencias": [
    "scripts/fixtures/operacao/invalidos/evidencia-inexistente/evidencias/DSA-40/nao-existe.md"
  ],
  "referencias_de_decisao": [],
  "origem_externa": null,
  "revisao_git": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "contexto": null,
  "atualizado_em": "2026-09-02"
}
```

# DSA-40 — ponteiro de evidencia quebrado

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
