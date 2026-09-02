```json
{
  "id": "DSA-13",
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

# DSA-13 — campo obrigatorio ausente

## Objetivo
Falta o campo objetivo no bloco de maquina, de proposito.

## Como se prova
O verificador reprova em V04.

## O que esta tarefa nao faz
Nada: e fixture invalida.

## Fontes
- `docs/operacao/README.md`
