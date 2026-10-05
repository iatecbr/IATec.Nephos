```json
{
  "tarefa": "DSA-13",
  "gate": "documentacao-figma-aceita",
  "data": "2026-10-02",
  "responsavel": "indiane",
  "comando": null,
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1197-5449",
    "data": "2026-10-02",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-button (1197:5449), na pagina NPH — Button, foi aceito como especificacao de API e comportamento do nph-button. COMPONENT_SET: nph-button (461:13009) e nph-button — so icone (498:15671), variantes tipo, enfase, size e state, com icone de inicio e de fim. O aceite de 01-10-2026 foi completado em 02-10-2026: o hover solido passou aos tokens de hover, o que supera a B4."
  }
}
```

# DSA-13 — `documentacao-figma-aceita`

Indiane aceitou a documentacao do quadro `nph-button` (`1197:5449`) em
01-10-2026, no arquivo `DS-IA-NEPHOS 5.0`, pagina `NPH — Button`. Em 02-10-2026
ela decidiu que o hover das enfases solidas usa os tokens de hover ("button usa
os tokens de hover"), o que supera a B4, e aprovou esse hover visualmente no
mesmo dia. O QA UX de Figma teve revisao independente aprovada em 02-10-2026, e
a auditoria textual foi aprovada na rodada 2, no mesmo dia.

Os COMPONENT_SET sao `nph-button` (`461:13009`), com texto, e
`nph-button — so icone` (`498:15671`), com as variantes `tipo`, `enfase`,
`size` e `state`. As enfases `outline`, `light` e `ghost` existem so nos tipos
`primary`, `secondary` e `danger` (B1).

Nao ha saida de comando. A aceitacao e observacao humana, registrada com a
data, a autoria, a URL do frame e os conjuntos. Conteudo restrito do Figma nao
entra nesta evidencia.

## Fonte da aceitacao

WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-01.md`: aceite da documentacao dos
11 componentes, entre eles o `nph-button`. `2026-10-02.md`: hover solido nos
tokens de hover e o aceite visual dele, QA UX de Figma com revisao independente
aprovada e auditoria textual aprovada.
