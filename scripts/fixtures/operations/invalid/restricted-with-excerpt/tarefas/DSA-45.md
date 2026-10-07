```json
{
  "id": "DSA-45",
  "goal": "Exemplo de validacao do verificador operacional.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "claude-code",
  "state": "blocked",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "file-exists",
      "description": "O artefato previsto existe e esta versionado.",
      "command": "npm run test:operacao",
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "Exemplo de bloqueio aberto, usado so como fixture.",
      "owner": "indiane",
      "what_resolves": "A decisao registrada que fecha o bloqueio.",
      "opened_at": "2026-09-02"
    }
  ],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [],
  "external_origin": {
    "classification": "internal-restricted",
    "url_or_id": "sistema-interno/exemplo",
    "date": "2026-08-17",
    "author": "exemplo",
    "excerpt": "Conteudo copiado de origem restrita — e exatamente isto que a regra proibe.",
    "converted_decision": null
  },
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-09-02"
}
```

# DSA-45 — origem restrita com trecho copiado

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
