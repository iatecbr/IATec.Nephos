```json
{
  "tarefa": "PE-01",
  "gate": "convencao-no-repositorio",
  "data": "2026-09-09",
  "responsavel": "claude-codigo",
  "comando": "test -f contributing.md",
  "codigo_de_saida": 0,
  "sha": "ed7c009adf09599104bc9868fee79b1092ad63cb",
  "origem_externa": null
}
```

# PE-01 — `convencao-no-repositorio`

O `contributing.md` existe na branch padrão. Ele entrou pelo PR #25, no commit de
conteúdo `5fa4821`, e a `v/3.0.0` está no merge `ed7c009`. O arquivo escreve a
convenção de nome de branch — `feat/`, `fix/`, `docs/` e `chore/` com descrição em
kebab-case —, o formato `tipo(escopo): resumo curto` para commit e título de pull
request, e os cinco itens que a descrição do PR precisa informar.

## Comando

```
test -f contributing.md
```

## Saída

Sem saída. Este comando não imprime nada quando o arquivo existe, então o código de
saída é a prova. Capturado imediatamente depois dele:

```
$ test -f contributing.md
$ echo $?
0
```

## Contexto verificável

```
$ git rev-parse origin/v/3.0.0
ed7c009adf09599104bc9868fee79b1092ad63cb

$ git log -1 --format='%h %an %ad %s' ed7c009
ed7c009 Mauro Jr. Wed Sep 9 11:28:45 2026 -0300 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625

$ git log --oneline --merges origin/v/3.0.0 | head -3
ed7c009 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625
bf6c360 Merge pull request #24 from iatecbr/docs/m5-encerramento-f5-t01
b166b23 Merge pull request #23 from iatecbr/docs/m5-f5-t01-blocos

$ git show --stat --oneline ed7c009
ed7c009 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625

 AGENTS.md                 |  6 +++---
 GOVERNANCA.md             |  2 +-
 contributing.md           | 37 +++++++++++++++++++++++++++++++++++++
 docs/decisoes-tecnicas.md |  7 +++++--
 4 files changed, 46 insertions(+), 6 deletions(-)
```

O PR #25 foi aprovado por `maurocsjr` e mergeado por ele em 09/09/2026, conferido na
página do pull request: "maurocsjr approved these changes" e "maurocsjr merged commit
ed7c009 into v/3.0.0".
