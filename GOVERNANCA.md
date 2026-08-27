---
titulo: Governança e preflight obrigatório para IA — Nephos
tipo: norma operacional
versao: 1.3
data: 2026-08-25
status: vigente
origem: migrado do vault de trabalho em 2026-08-24, para a branch `v/3.0.0`
leitura_obrigatoria: true
precedencia: 1
---

# Governança e preflight obrigatório para IA — Nephos

> **Leitura obrigatória antes de qualquer análise, proposta, edição ou implementação no Nephos.** Leia somente as fontes aplicáveis à tarefa. Se faltar a fonte vigente necessária para uma decisão, pare e peça confirmação; não complete lacunas por inferência. A ausência de implementação prévia não bloqueia a tarefa cujo objetivo autorizado seja criar essa implementação.

## 1. Fonte única por assunto

| Assunto | Fonte vigente | Não usar como fonte de regra atual |
|---|---|---|
| Precedência e regra de trabalho | Esta nota | Notas de sessão, relatórios de reunião, roteiro ou estudos |
| Valores de token e decisão visual | Figma `DS-IA-NEPHOS 5.0`; a nota específica da fundação explica o uso | Kit Obra como se fosse implementação direta, valor literal ou exemplo antigo |
| Contrato técnico para código | `design.md`, na raiz deste repositório | Valores literais, exemplos antigos ou notas de contexto |
| Valor de token no repositório | `src/tokens/source/*.tokens.json`, gerado para `src/tokens/generated/tokens.css`; ver [`docs/tokens.md`](docs/tokens.md) | O CSS gerado, que nunca é fonte; valor literal escrito à mão em componente |
| Decisões técnicas P01, P02, P03, P17 e P19 | [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) | A §9 e a §10 do `design.md`, que remetem a esta nota; qualquer texto que ainda chame as cinco de pendência |
| Ordem e evidência das fases | Registro de planejamento mantido pela Indiane, **fora deste repositório**. O agente não tem acesso a ele: se a tarefa depender dessa ordem, pare e pergunte | Percentual sem fórmula ou checklist histórico |
| Escopo de componentes | O recorte P0 no `README.md`. A lista completa da v1 **ainda não está fechada** e é mantida fora deste repositório | Qualquer lista de componentes não publicada aqui |
| Implementação entregue | Branch, commit, PR e Storybook deste repositório | Declaração em nota sem evidência no repositório |

Em conflito, prevalece a fonte da linha correspondente. Uma fonte histórica só pode registrar o que ocorreu; ela não prescreve o que fazer agora.

## 2. Estado vigente

- Gate 0 e Fase 1 estão **concluídos documentalmente**; a evidência visual está no Figma `DS-IA-NEPHOS 5.0`.
- O contrato técnico é o `design.md` na raiz deste repositório.
- Contagens vigentes das fundações: **463 variáveis**, **14 estilos de texto**, **11 estilos de efeito**, **34 ícones no núcleo**, **7 tokens semânticos de espaço**, **8 tokens semânticos de raio** e **19 primitivos de alfa**.
- Ícones: o pacote é **Font Awesome Pro** e **Classic** é a família padrão. **Duotone é permitido somente em navegação estrutural** — menu, sidebar, grupo de navegação, atalho e indicador de localização. Fora da navegação continua proibido: botão, campo, feedback, validação, alerta, tabela e ação destrutiva. Não misture Duotone e Classic no mesmo grupo de navegação. Light, Thin e Sharp seguem proibidos. A chave de licença fica em variável de ambiente e nunca entra no repositório. *Decisão da Indiane em 24-08-2026; substitui a regra anterior, que proibia Duotone por completo.*
- O corte da v1 e as decisões de componentes **não estão fechados**. Só o recorte P0 do `README.md` está decidido.
- **`nph-icon` é o primeiro componente implementado**, com stories e testes, na `v/3.0.0` desde o PR #6 (merge `437dd60`). O PR #7 registrou a P21 (`8fe4271`) e o PR #8 organizou a navegação do Storybook (`79187c0`). Os demais componentes continuam não implementados.
- **Migração-base de tokens em 24-08-2026**, na branch `feat/tokens-json`: **289 itens** — 139 primitivos `core`, 6 variáveis `theme` nos sete modos e os 144 semânticos nos dois modos. Conferidos contra o Figma token a token e modo a modo, com **zero divergências**. Em 25-08-2026, três tokens aprovados para `nph-button` elevaram o total técnico para **292 itens**, dos quais **147 são semânticos**, no commit `505e36d`. Os **20 primitivos da P46** ficaram fora por decisão registrada. Os demais primitivos, os estilos de efeito e os estilos de texto estão **adiados** — adiado **não** significa sem consumidor: os 24 de `core/sombra`, por exemplo, têm consumidor conhecido nos estilos `elevation/*`.
- As decisões técnicas **P01, P02, P03, P17, P19 e P20 deixaram de ser pendências em 24/08/2026** e estão registradas em [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md), com o status *decisão adotada pela Indiane em 24/08/2026 — aguardando revisão de Elvys*. São regras vigentes: siga-as, não as trate como lacuna. **Elvys não as aprovou** — não registre nem sugira aprovação dele. Para alterá-las, explique o conflito técnico, registre uma proposta e peça revisão humana.
- O P17 fixa a fonte canônica por responsabilidade: o **Figma** é a fonte visual; o `design.md` é o contrato humano e agêntico, não o arquivo de geração; o **JSON** é a fonte técnica versionada dos valores auditados; o **CSS custom properties** é gerado do JSON e não se edita à mão. A ferramenta de geração, o namespace de extensão e os atributos públicos `data-nph-brand` e `data-nph-color-scheme` estão fixados pelo **P20**. Só entra no JSON valor com evidência verificável de leitura do Figma.

## 3. Como medir avanço

O avanço até entrega usa as oito fases com o mesmo peso, sem contar o Gate 0 como uma nona fase:

`(F0 + F1 + F2 + F3 + F4 + F5 + F6 + F7) / 8`

O Gate 0 é uma condição de passagem para Fase 0; nunca é somado novamente ao percentual total. Um item só pode ser marcado concluído quando registrar: data, responsável, fonte de evidência e localização verificável. Checkboxes do plano medem apenas o próprio plano, não o projeto inteiro.

## 4. Preflight obrigatório

Antes de agir, a IA deve:

1. Ler esta nota, o `README.md`, o `design.md` e a ficha do componente, quando forem aplicáveis.
2. Para afirmar valor ou regra visual, consultar o Figma `DS-IA-NEPHOS 5.0` ou pedir exportação/confirmação verificável quando não houver acesso.
3. Identificar a fonte vigente de cada afirmação que pretende usar.
4. Distinguir explicitamente fato verificado, decisão vigente, proposta e pendência.
5. Conferir que token, componente e variante existem na fonte vigente.
6. Parar e perguntar quando faltar decisão, ficha necessária à tarefa, fonte de verdade ou houver conflito entre fontes vigentes. Ausência de branch, commit ou Storybook bloqueia apenas a **alegação** de que existem; não bloqueia uma tarefa autorizada de criá-los.
7. Atualizar simultaneamente as fontes afetadas quando uma decisão mudar: contrato, nota de fundação, plano/estado e documentação derivada.
8. Ao encerrar, registrar evidência, data, responsável, decisão alterada e documentos sincronizados.

## 5. Salvaguardas contra erro documental

Estas regras nasceram da auditoria de 21-08-2026 e são obrigatórias para toda
IA que consulte ou altere esta documentação:

1. **Estado vigente vence histórico.** Use o bloco **Estado vigente** e a fonte
   canônica do assunto para prescrever ações. Sessões anteriores, relatórios,
   listas superadas e decisões marcadas como históricas ou superadas só
   explicam o passado; nunca crie regra atual a partir delas.
2. **Delegado não é fechado.** Uma decisão delegada a uma pessoa, à engenharia
   ou ao jurídico permanece aberta até registrar a evidência exigida na fonte
   apropriada. Não a declare concluída por haver responsável, intenção,
   recomendação ou conversa prévia.
3. **Pendência só fecha com prova.** Antes de mover uma pendência para
   encerrada, registre decisão ou evidência, data, responsável e localização
   verificável. Se a regra tiver partes independentes, feche somente a parte
   comprovada e mantenha as demais abertas.
4. **Toda mudança de escopo exige análise de impacto.** Ao criar, unificar,
   remover ou tornar interno um componente, confira e atualize, quando
   aplicável: lista vigente, numeração, total de componentes, fórmula e
   denominador do progresso, itens restantes, plano, contrato e documentos
   derivados. Valide a contagem na lista completa, sem contar um recorte
   prioritário duas vezes.
5. **Edite a fonte certa antes das cópias.** Atualize primeiro a fonte
   canônica. Documentos históricos ou superados só recebem anotação de
   superação quando necessário para não contradizer a regra atual; não
   reescreva o passado nem presuma que tenham a mesma estrutura da fonte
   vigente.
6. **Validação falha não é validação.** Se uma busca, script ou verificação
   falhar, investigue a causa, corrija o método e execute-a novamente antes de
   declarar o resultado. Registre apenas verificações que realmente passaram.
