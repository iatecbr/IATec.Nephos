```json
{
  "id": "DSA-45",
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
  "evidencias": [],
  "referencias_de_decisao": [],
  "origem_externa": {
    "classificacao": "interna-restrita",
    "url_ou_id": "sistema-interno/exemplo",
    "data": "2026-08-17",
    "autoria": "exemplo",
    "trecho": "Conteudo copiado de origem restrita — e exatamente isto que a regra proibe.",
    "decisao_convertida": null
  },
  "revisao_git": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "contexto": null,
  "atualizado_em": "2026-09-02"
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
