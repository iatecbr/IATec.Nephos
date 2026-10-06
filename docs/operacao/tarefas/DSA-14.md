```json
{
  "id": "DSA-14",
  "objetivo": "Publicar a Metadata de cada peca em ingles, sem deixar de ser derivada da ficha, para que agente de IA e consumidor leiam um contrato num idioma so.",
  "fase": "F0",
  "ordem_aprovada": 140,
  "responsavel": "claude-codigo",
  "estado": "aguardando-decisao",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "metadata-em-ingles",
      "descricao": "Toda Metadata em src/shared/metadata/ tem chaves e texto em ingles, e o verificador confirma que ela continua derivada da ficha vigente (V32).",
      "comando": "node scripts/verificar-operacao.mjs",
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Gerador, fichas ou decisao tecnica que mudarem revisados por maurocsjr e mergeados na v/5.0.0.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [
    {
      "pergunta": "Qual caminho leva a Metadata ao ingles: (a) o YAML das fichas passa a ser escrito em ingles e a Metadata segue copia exata (P63 intacta); (b) a ficha ganha o texto em ingles ao lado do portugues e o gerador publica so o ingles; ou (c) a Metadata passa a ser publicada nos tres idiomas, como sugere a revisao do PR #56?",
      "quem_decide": "indiane"
    }
  ],
  "evidencias": [],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p63",
    "docs/decisoes-tecnicas.md#p64",
    "PR #56, revisao de maurocsjr em 2026-10-06: Metadata para IA em ingles, se nao houver os tres idiomas",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-06.md, Metadata em ingles vira tarefa propria"
  ],
  "origem_externa": null,
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-06"
}
```

# DSA-14 — Metadata em inglês

## Objetivo
A Metadata de toda peça vigente, em `src/shared/metadata/<peca>.json`, sai em
inglês, nas chaves e no texto, e continua gerada da ficha por
`node scripts/verificar-operacao.mjs --gerar-metadata`. Quem lê a Metadata não
encontra português.

## Por que aguarda decisão
Pela P63, a Metadata é cópia exata do YAML da ficha, e o YAML está em
português. Passar a Metadata para o inglês muda a ficha, o gerador ou a própria
P63. O caminho é a decisão pendente; a ordem 140 só põe a tarefa na fila e não
fixa prioridade.

## Como se prova
**`metadata-em-ingles`** — `node scripts/verificar-operacao.mjs` sai 0, com a
`V32` conferindo que cada Metadata bate com a ficha vigente, e nenhuma Metadata
traz chave ou texto em português.

**`revisao-e-merge`** — o que mudar (gerador, fichas, decisão técnica) passa
pelos comandos de prova, é revisado por `maurocsjr` e mergeado na `v/5.0.0`.

## O que esta tarefa não faz
Não muda o conteúdo das fichas, só o idioma. Não cria a aba de Metadata no
Storybook nem o servidor de consulta, que estão fora de escopo da P63. Não muda
as stories, que seguem a emenda de 06/10/2026 da P64.

## Fontes
- `docs/decisoes-tecnicas.md` — P63 e P64
- `scripts/verificar-operacao.mjs` e `scripts/spec-lib.mjs`
- `src/shared/metadata/`
- `fichas/` e `fichas/_modelo.md`
