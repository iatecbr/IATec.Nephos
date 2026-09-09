---
peca: nph-radio
nivel: componente
status: vigente
titulo: "nph-radio"
tipo: ficha de componente
criado: 2026-09-09
atualizado: 2026-09-09
resolve: >-
  Escolha exclusiva dentro de um grupo: marcar uma opcao desmarca a anterior.
  Carrega o proprio texto ao lado, que e o nome do controle.
use_quando:
  - "As opcoes se excluem entre si: forma de pagamento, tipo de vinculo, turno."
  - "O grupo e pequeno e cabe na tela, ate cinco ou seis opcoes."
  - "Todas as opcoes precisam ficar visiveis ao mesmo tempo, para a pessoa comparar antes de escolher."
nao_use_quando:
  - "A pessoa pode marcar mais de uma coisa: isso e nph-checkbox."
  - "Existe uma opcao so. Opcao sozinha nao e escolha, e o radio nao se desmarca: use nph-checkbox."
  - "A escolha acontece na hora, sem confirmar: seria o interruptor, que ainda nao existe no sistema."
  - "A lista e longa ou vem de busca: isso e nph-select ou nph-combobox."
api:
  label:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      Texto da opcao, ja localizado pela aplicacao. E o nome acessivel do
      controle. Vazio e sem nome alternativo falha na validacao de
      desenvolvimento.
  checked:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      Marca a opcao. Dentro de um grupo, marcar uma limpa as demais: quem tira a
      marca e a escolha de outra opcao, nunca um segundo clique na mesma.
  name:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: true
    restricao: >-
      Identifica o grupo. Radios com o mesmo name formam um grupo de escolha
      exclusiva. Sem ele nao ha exclusividade, e a peca deixa de ser um radio.
  value:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: true
    restricao: "O valor enviado quando esta opcao e a escolhida."
  disabled:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      Aplica state/disabled-opacity ao controle inteiro, texto incluido. Nao
      combina com o estado de erro.
  mostrar_rotulo:
    tipo: boolean
    obrigatoria: false
    padrao: true
    reflete: false
    restricao: >-
      Liga e desliga o texto ao lado sem criar variante. Desligado, a peca
      encolhe para 24x24 e o nome acessivel passa a ser obrigatorio por outro
      caminho. No Figma e a propriedade mostrar rotulo.
  slots: nao_se_aplica
  eventos: "change, quando esta opcao passa a ser a escolhida do grupo"
  size: >-
    Nao e propriedade. O circulo e sempre 16, e e isso que impede dois radios de
    tamanhos diferentes no mesmo formulario.
  indeterminado: >-
    Nao existe. Em escolha exclusiva ou a pessoa escolheu, ou nao escolheu. O
    traco do meio e do nph-checkbox, onde reflete um grupo com parte marcada.
variantes:
  marcado:
    eixo: aparencia
    valores: [false, true]
    escolha_quando: "true na opcao escolhida do grupo; false nas demais"
    nao_combine_com: []
  state:
    eixo: aparencia
    valores: [default, hover, foco, erro, erro-focus, disabled]
    escolha_quando: "erro apenas quando o nph-field em volta estiver invalido"
    nao_combine_com: [erro com disabled]
estados:
  default:
    token: color/input
    muda_para_a_pessoa: "Opcao em repouso, disponivel para escolha"
  hover:
    token: color/input-hover
    muda_para_a_pessoa: "A borda escurece. Marcado, o circulo tambem clareia por state/hover-opacity"
  foco:
    token: focus/border
    muda_para_a_pessoa: "A borda muda e um anel focus/halo aparece por fora, com espessura focus/ring-width"
  erro:
    token: status/error
    muda_para_a_pessoa: "A borda fica vermelha. A mensagem que explica mora no nph-field em volta"
  erro-focus:
    token: focus/halo-error
    muda_para_a_pessoa: "Borda vermelha mais o anel de erro por fora, quando a pessoa chega com o teclado"
  disabled:
    token: state/disabled-opacity
    muda_para_a_pessoa: "A opcao inteira desbota e para de responder"
  sucesso:
    token: nao_existe
    muda_para_a_pessoa: "Nao existe radio verde. Nenhuma fonte do Nephos o define"
regras_de_negocio:
  - "Um radio nunca aparece sozinho. Escolha exclusiva exige duas opcoes ou mais"
  - "Marcar uma opcao desmarca a anterior do mesmo name. A peca nao se desmarca por clique proprio"
  - "Quando o vazio precisa ser uma resposta valida, ele e uma opcao explicita do grupo, do tipo Nenhuma"
  - "O nome do grupo e a mensagem de erro sao do nph-field em volta, nunca do radio"
erros_de_dominio:
  - "label vazio e sem nome alternativo: falha na validacao de desenvolvimento"
  - "radio sem name: nao ha grupo, e a exclusividade deixa de existir"
  - "grupo obrigatorio submetido sem nenhuma opcao marcada: o erro e do campo, e o radio recebe state=erro"
tokens:
  tamanho_do_circulo: icon/size-sm
  curva_do_circulo: radius/full
  respiro_interno_que_gera_o_ponto: space/inline-tight
  cor_do_ponto: color/primary-foreground
  fundo_desmarcado: color/background
  fundo_marcado: color/primary
  borda_parada: color/input
  borda_hover: color/input-hover
  borda_foco: focus/border
  borda_erro: status/error
  anel_de_foco: focus/halo
  anel_de_erro: focus/halo-error
  espessura_do_anel: focus/ring-width
  area_de_clique: "24x24, obtida por space/inline-tight nos quatro lados"
  espaco_ate_o_texto: space/inline
  texto: text/label-md
  cor_do_texto: color/foreground
  opacidade_hover: state/hover-opacity
  opacidade_desabilitado: state/disabled-opacity
dicas_para_ia:
  - "Escolha exclusiva e esta peca. Escolha independente e o nph-checkbox. A pergunta que separa: a pessoa pode marcar duas?"
  - "Se voce ia gerar um radio so, pare: ou faltam opcoes, ou a peca certa e a caixa de marcacao."
  - "Nao procure propriedade de tamanho nem estado indeterminado: nao existem nesta peca."
  - "O grupo nao e um componente. Nao procure nph-radio-group: e composicao de varios nph-radio dentro de um nph-field."
  - "Acima de cinco ou seis opcoes, troque para nph-select em vez de alongar o grupo."
  - "Para o radio sem texto, desligue mostrar rotulo. Nao apague o texto nem deixe a peca sem nome."
acessibilidade:
  semantica: "input type=radio nativo; o grupo e um fieldset com legend, ou um role=radiogroup rotulado"
  nome_acessivel: "O texto ao lado e a origem do nome. Sem texto visivel, aria-label passa a ser obrigatorio"
  teclado:
    - "O grupo inteiro recebe uma parada de tabulacao so, na opcao marcada, ou na primeira quando nenhuma estiver"
    - "As setas movem a escolha entre as opcoes do grupo e ja selecionam"
    - "Tab sai do grupo, nao navega dentro dele"
  foco: "Anel focus/halo por fora do circulo, espessura focus/ring-width; focus/halo-error no estado invalido"
  contraste: >-
    Medido em 09-09-2026, 126 pares nos dois esquemas e nas sete marcas.
    Contorno do circulo 3,23 no claro e 6,58 no escuro; hover 4,74 e 9,81; foco
    3,68 e 8,98; erro 6,88 e 5,01. Ponto sobre o circulo marcado 5,37 e 7,05.
    Texto 21 e 14,73. O minimo e 3:1 para limite de controle e 4,5:1 para texto.
  alvo_de_toque: "24x24, o minimo do criterio 2.5.8. O texto ao lado tambem aciona a opcao"
  alternativa_a_cor: >-
    A escolha nunca e so a cor: o ponto no centro e a forma que a comunica. O
    estado invalido nunca e so a borda vermelha, porque a mensagem em texto e
    obrigatoria e mora no nph-field.
combinacoes_invalidas:
  - "erro com disabled: um controle que a pessoa nao pode operar nao pode cobrar conserto dela"
  - "um radio sozinho no grupo: nao e escolha, e nao ha como voltar atras"
  - "radio e checkbox misturados no mesmo grupo de escolha"
  - "grupo sem nome proprio, contando com o texto de cada opcao para explicar o conjunto"
  - "radio sem texto visivel e sem nome acessivel"
  - "esperar que um segundo clique desmarque a opcao"
relacoes:
  combina_com: [nph-field, nph-label, nph-rich-option]
  pai: [nph-field, formulario]
  filho: []
  complementa_bloco: [pendente]
  aparece_em: [pendente]
anti_padroes:
  - "Usar um radio sozinho"
  - "Deixar o radio vermelho sem nenhuma frase explicando"
  - "Mostrar erro num radio desligado"
  - "Deixar o grupo sem nome"
  - "Misturar radio e caixa de marcacao no mesmo grupo"
  - "Alongar o grupo em vez de trocar para nph-select"
  - "Pintar a versao escura a mao em vez de deixar o modo resolver"
fontes:
  design_md: "design.md, no repositorio"
  decisao: "Aprovacao visual da Indiane em 09-09-2026, nos dois modos. Linha 19 do Mapa de decisao (vault), entra, de 26-08-2026"
  testes: nao_existe
  evidencia_de_uso: nao_existe
  storybook: nao_existe
  figma: "pagina NPH — Radio (846:2) — conjunto mestre 848:66, catalogo 850:2, documentacao 868:130"
tags: [nephos, ds-agentico, ficha, componente, nph-radio]
---

> **Referencias marcadas `(vault)`** estao em `02 PROJETOS/DS-Agentico/`, no WORK BRAIN —
> fora deste repositorio.

# nph-radio

> **O principio que rege esta peca: escolher uma cancela a outra.** E dessa frase que
> sai tudo o mais — nao existe indeterminado, nao existe desmarcar sozinho, e a peca
> nunca aparece sozinha.
>
> A API esta no bloco YAML acima.

## Funcao

- **Problema que resolve:** oferecer uma escolha exclusiva entre poucas opcoes, com
  todas visiveis ao mesmo tempo.
- **Quando usar:** as opcoes se excluem, o grupo cabe na tela, e a pessoa precisa
  comparar antes de decidir.
- **Quando NAO usar:** a pessoa pode marcar mais de uma (`nph-checkbox`), existe uma
  opcao so (`nph-checkbox`), a escolha vale na hora sem confirmar (interruptor, que
  nao existe), ou a lista e longa (`nph-select`, `nph-combobox`).

## Variantes

**12 variantes:** `marcado` (false, true) × `state` (default, hover, foco, erro,
erro-focus, disabled).

- **Variantes por aparencia:** as duas acima.
- **Variantes por tamanho:** nao existem. O circulo e sempre 16.
- **Variantes por densidade:** nao existem.
- **Escolha esta variante quando:** `marcado=true` na opcao escolhida do grupo;
  `state=erro` apenas quando o `nph-field` em volta estiver invalido.
- **Nao combine com:** `erro` e `disabled` ao mesmo tempo.

**Fora das 12 existe `mostrar rotulo`, que e propriedade e nao variante.** A regra de
matriz vale aqui: e **variante** a presenca de uma parte que precisa ser comparada
lado a lado; e **propriedade** o que e conteudo. Texto e conteudo.

**O que veio do kit de referencia e o que nao veio.** O kit separa `Radio - Nova` de
`Radio Group - Nova`, e e o grupo que carrega o texto. Aqui o texto e do proprio
radio, e o grupo e composicao — nao vira peca. O kit tambem desabilita com duas
opacidades diferentes, 0,3 e 0,5; o Nephos usa uma so.

## Estados

- **Estados suportados, e o token de cada um:** estao no YAML, um token por estado.
- **A regra que organiza tudo:** a borda diz o estado, o preenchimento diz a escolha.
  Marcado ou nao, o estado sempre aparece na borda.
- **Regras de feedback e foco:** o anel de foco fica por fora do circulo e nunca e
  removido. `erro` e `erro-focus` sao estados separados porque uma opcao obrigatoria
  em branco fica vermelha mesmo sem ninguem estar nela.
- **Regra de negocio que a peca carrega:** a exclusividade dentro do `name`, e a
  impossibilidade de voltar ao vazio por conta propria.
- **Estados de erro do dominio:** estao no YAML.

**Desabilitado e do controle inteiro**, texto incluido — diferente do `nph-field`,
onde o rotulo do campo nao desbota. Aqui o texto **e** o rotulo do controle.

## Acessibilidade

O texto ao lado e a origem do nome acessivel. Sem ele, `aria-label` passa a ser
obrigatorio, e e por isso que desligar `mostrar rotulo` nao e uma decisao de
aparencia.

**O teclado e o ponto em que esta peca mais difere da caixa de marcacao, e o Figma nao
prova isso.** O grupo inteiro recebe **uma** parada de tabulacao; as setas movem a
escolha entre as opcoes e ja selecionam. Uma caixa de marcacao recebe uma parada cada.
Implementar o radio com o comportamento da caixa e o erro mais provavel aqui.

**A escolha nunca e so a cor:** o ponto no centro e a forma que a comunica.

## Relacoes

**Pai: o `nph-field`, ou o formulario.** Use o `nph-field` quando o grupo precisar de
nome proprio — "Forma de pagamento" — ou de mensagem de erro. A mensagem e do campo.

**Ao lado: os outros radios do mesmo grupo.** E a unica peca do sistema em que
aparecer sozinha e proibicao, nao recomendacao.

**Filho: nada.** O ponto e forma, nao uma peca de outro conjunto — diferente do
`nph-checkbox`, que usa uma instancia de `nph-icon` dentro.

**Consequencia registrada:** o `nph-rich-option` pode usar este radio com o texto
desligado, quando o cartao for de escolha exclusiva. Hoje ele usa o `nph-checkbox`.
Trocar isso e outra tarefa, e precisa de decisao.

## Tokens, intencao e Dicas para IA

Os tokens estao no YAML, todos da camada semantica.

**Duas medidas merecem frase.** O circulo consome `icon/size-sm` para o tamanho — o
mesmo caminho do `nph-checkbox` — e `radius/full` para a curva, que e o que o deixa
redondo. **O ponto de dentro nao tem tamanho proprio:** ele ocupa o que sobra do
circulo depois de `space/inline-tight` nos quatro lados. 16 menos 4 menos 4 da 8, e os
dois numeros vem de token. Foi assim para nao inventar um degrau de 8 que o sistema
nao tem.

**O ponto nao e icone.** O nucleo curado tem 34 nomes e nenhum circulo cheio. Desenha-
lo como forma e o que o kit de referencia tambem faz, e nao abre excecao a regra I3.

As Dicas para IA estao no YAML.

## Exemplos

| Situacao | Como montar |
|---|---|
| Escolha comum | Dois ou mais radios com o mesmo `name`, dentro de um `nph-field` com o nome do grupo |
| Com padrao razoavel | Uma opcao ja com `checked`, para a pessoa nao ter de decidir antes de entender |
| Quando o vazio e resposta | Acrescente uma opcao explicita `Nenhuma`; nao conte com desmarcar |
| Dentro de tabela ou cartao | `mostrar rotulo` desligado, com `aria-label` |
| Grupo reprovado | `state=erro` nas opcoes, e a mensagem no `nph-field` |

## Anti-padroes

Estao no YAML. O que merece frase: **usar um radio sozinho.** Marcou, nao volta atras
— e a pessoa fica presa a uma escolha que ela talvez so quisesse experimentar. Se o
caso e ligar e desligar algo, a peca e o `nph-checkbox`.

## Fontes e decisoes

- **Aprovacao visual:** Indiane, 09-09-2026, nos dois modos.
- **Escopo:** linha 19 do Mapa de decisao (vault), `entra`, decidido em 26-08-2026.
- **Logica de tokens:** decisao da Indiane em 09-09-2026 — a peca segue a mesma logica
  do `nph-checkbox`. A borda do marcado continua `color/input`; `color/primary-border`,
  criado no mesmo dia para o `nph-rich-option`, nao entra aqui.
- **Decisoes herdadas:** L5 (desabilitado e do controle), F1 (a mensagem de erro e a
  chave do estado invalido, no `nph-field`), e a regra de matriz da L8.

## O que ainda separa a ficha do codigo

**Nada existe em codigo.** Nao ha implementacao, story nem teste do `nph-radio`.

O passo 3 do gate e o plano tecnico. Antes dele, o comportamento de teclado precisa
estar decidido por escrito: uma parada de tabulacao por grupo e navegacao por setas
nao se provam no Figma, e sao o ponto em que esta peca mais difere do `nph-checkbox`.

**Achado de fundacao, herdado e nao bloqueante:** o tamanho do anel de foco, 24x24,
e a unica medida ainda nao ligada a token — aqui e no `nph-checkbox`. A curva ja
esta ligada.

**Nenhuma decisao desta ficha esta pendente.**
