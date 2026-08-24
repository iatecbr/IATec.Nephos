---
titulo: Governança e preflight obrigatório para IA — Nephos
tipo: norma operacional
versao: 1.2
data: 2026-08-21
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
| Ordem e evidência das fases | Registro de planejamento mantido pela Indiane, **fora deste repositório**. O agente não tem acesso a ele: se a tarefa depender dessa ordem, pare e pergunte | Percentual sem fórmula ou checklist histórico |
| Escopo de componentes | O recorte P0 no `README.md`. A lista completa da v1 **ainda não está fechada** e é mantida fora deste repositório | Qualquer lista de componentes não publicada aqui |
| Implementação entregue | Branch, commit, PR e Storybook deste repositório | Declaração em nota sem evidência no repositório |

Em conflito, prevalece a fonte da linha correspondente. Uma fonte histórica só pode registrar o que ocorreu; ela não prescreve o que fazer agora.

## 2. Estado vigente

- Gate 0 e Fase 1 estão **concluídos documentalmente**; a evidência visual está no Figma `DS-IA-NEPHOS 5.0`.
- O contrato técnico é o `design.md` na raiz deste repositório.
- Contagens vigentes das fundações: **460 variáveis**, **14 estilos de texto**, **11 estilos de efeito**, **34 ícones no núcleo**, **7 tokens semânticos de espaço**, **8 tokens semânticos de raio** e **19 primitivos de alfa**.
- Duotone não faz parte do Nephos. A família permitida é somente **Font Awesome Classic**.
- O corte da v1 e as decisões de componentes **não estão fechados**. Só o recorte P0 do `README.md` está decidido.
- **Nenhum componente do Nephos foi implementado.** O que existe neste repositório é o shell do Storybook com a página “Nephos — Em construção”. As decisões técnicas listadas em *Decisões técnicas a confirmar* e *Pendências antes do primeiro componente*, no `README.md`, continuam abertas.

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
