```json
{
  "id": "DSA-60",
  "objetivo": "Exemplo de validacao do verificador operacional.",
  "fase": "F4",
  "ordem_aprovada": 10,
  "responsavel": "claude-codigo",
  "estado": "pronta",
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
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [],
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

# DSA-60 — ordem duplicada A

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
