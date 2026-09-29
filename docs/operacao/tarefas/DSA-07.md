```json
{
  "id": "DSA-07",
  "objetivo": "Registrar a convencao de idioma do codigo e migrar o codigo versionado para ela, sem mudar comportamento.",
  "fase": "F0",
  "ordem_aprovada": 100,
  "responsavel": "claude-codigo",
  "estado": "em-revisao",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "convencao-registrada",
      "descricao": "A P64 existe em docs/decisoes-tecnicas.md com o escopo decidido, a regra esta no AGENTS.md e a revisao tecnica foi registrada.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    },
    {
      "id": "migracao-sem-mudanca-de-comportamento",
      "descricao": "Em cada PR da migracao, a saida (stdout, stderr e codigo) dos scripts e identica antes e depois, os artefatos gerados nao mudam de conteudo, nenhum arquivo novo aparece e a bateria sai com 0. Cobre scripts, src, stories e .storybook.",
      "comando": "npm run build:tokens && node scripts/verificar-operacao.mjs --gerar-metadata && git diff --quiet && node -e \"process.exit(require('child_process').execSync('git ls-files --others --exclude-standard').length?1:0)\" && npm run typecheck && npm test && npm run test:tokens && npm run test:i18n && npm run test:operacao && node scripts/verificar-operacao.mjs --exemplos && npm run build-storybook",
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p64"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://github.com/iatecbr/IATec.Nephos/pull/41",
    "data": "2026-09-28",
    "autoria": "maurocsjr",
    "trecho": null,
    "decisao_convertida": "Na revisao aprovada do PR #41, maurocsjr observou que codigo deve seguir o padrao em ingles; em 28-09-2026 Indiane decidiu tratar a convencao numa tarefa propria e adotar: nomes do codigo em ingles, comentario e mensagem em PT-BR, em todo o codigo versionado; fase F0 e ordem 100. O bloqueio pelo merge do PR #41 caiu em a30be89."
  },
  "revisao_git": {
    "branch": "chore/idioma-do-codigo-scripts",
    "commit": "9ae9fa4",
    "pr": "42"
  },
  "contexto": null,
  "atualizado_em": "2026-09-29"
}
```

# DSA-07 — convenção de idioma do código

## Objetivo

O repositório tem uma regra escrita sobre o idioma do código, e o código versionado
a segue. Percebe-se porque a P64 existe, o `AGENTS.md` cita a regra e a bateria
passa igual antes e depois da migração.

## Como se prova

**`convencao-registrada`** — a P64 está em `docs/decisoes-tecnicas.md` e a revisão
técnica fica registrada nela, como nas demais. O `AGENTS.md` traz a regra.

**`migracao-sem-mudanca-de-comportamento`** — em cada PR, a saída dos scripts é
comparada antes e depois e tem de ser idêntica, e o comando do gate sai com 0. O juiz
de arquivo é `git diff` vazio e nenhum arquivo não rastreado: com `core.autocrlf`,
o `git status` marca `tokens.css` depois do build sem mudança de conteúdo.

## O que esta tarefa não faz

- Não muda chave de dados, bandeira da linha de comando, nome de arquivo já citado
  nem nome público.
- Não muda comportamento nem texto de mensagem.
- Não reescreve registro histórico.

## Fontes

- `docs/decisoes-tecnicas.md` — P64
- `AGENTS.md` — Regras obrigatórias
- PR #41 — comentário de `maurocsjr`
- PR #42 — primeiro PR da migração (`scripts/`)