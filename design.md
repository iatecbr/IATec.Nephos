---
sistema: Nephos
versao: 1.7
data: 2026-08-25
status: sincronizado com o Figma em 2026-08-25; contrato de trabalho da branch `v/3.0.0`
fonte_tecnica_dos_valores: >-
  Desde 24-08-2026 os valores auditados vivem em `src/tokens/source/*.tokens.json`,
  e o CSS é gerado a partir deles em `src/tokens/generated/tokens.css`. Este arquivo
  continua sendo o contrato de USO — o que cada token significa, quando usar, quando
  não usar e por quê. Se um valor aqui divergir do JSON, o JSON e o Figma prevalecem.
  Ver `docs/tokens.md` e a decisão P20 em `docs/decisoes-tecnicas.md`.
consumo_de_tema: >-
  Marca e esquema de cor são dimensões independentes, expostas como dois atributos
  no elemento raiz: `data-nph-brand` (sistemas, gerencial, educacao, comercial,
  financeiro, igrejas, rh) e `data-nph-color-scheme` (light, dark).
escopo_migrado_para_json: >-
  292 itens: 139 primitivos core, 6 variáveis theme nos sete modos e os 147
  semânticos nos dois modos. Os 289 itens da migração-base entraram em 24-08-2026;
  três tokens de Button aprovados no Figma foram adicionados em 25-08-2026, no commit
  505e36d. Os 20 primitivos da P46 ficaram fora por decisão registrada. Os demais
  primitivos, os estilos de efeito e os estilos de texto estão adiados — adiado não
  significa sem consumidor.
escopo_verificado: [cor, tipografia, espacamento, raio, elevacao, grid, movimento, cor_de_grafico]
escopo_a_validar: []
camadas: [core, theme, semantic]
prefixo_componente: nph-
prefixo_css: --nph-
consumidor: Moses
leitores: [Moses, desenvolvimento]
nao_use_como: introdução visual ou conteúdo de portal; para isso, consultar Fundações, Figma e SITE Nephos
saida_alvo: HTML semantico + CSS custom properties, consumindo os Web Components nph- em Lit diretamente. Sem PrimeNG. (decidido por Indiane em 18-08-2026)
regra_de_leitura: >-
  Antes de construir ou alterar qualquer UI, leia "GOVERNANCA.md" e este arquivo.
  Antes de usar um componente, abra a ficha dele.
  Diante de lacuna: pergunte. Nunca invente.
modos: [claro, escuro]

# ---------------------------------------------------------------
# CAMADA 1 - PRIMITIVOS. Nenhum componente consome daqui.
# ---------------------------------------------------------------
tokens_core:
  sistemas:
    '50': { valor: '#ebf2fe', css: '--nph-core-sistemas-50' }
    '100': { valor: '#d8e6fd', css: '--nph-core-sistemas-100' }
    '200': { valor: '#b1cdfb', css: '--nph-core-sistemas-200' }
    '300': { valor: '#89b4fa', css: '--nph-core-sistemas-300' }
    '400': { valor: '#629bf8', css: '--nph-core-sistemas-400' }
    '500': { valor: '#3b82f6', css: '--nph-core-sistemas-500' }
    '600': { valor: '#2f68c5', css: '--nph-core-sistemas-600' }
    '700': { valor: '#234e94', css: '--nph-core-sistemas-700' }
    '800': { valor: '#183462', css: '--nph-core-sistemas-800' }
    '900': { valor: '#0c1a31', css: '--nph-core-sistemas-900' }
    '950': { valor: '#060d19', css: '--nph-core-sistemas-950' }
  gerencial:
    '50': { valor: '#e6ebf0', css: '--nph-core-gerencial-50' }
    '100': { valor: '#ccd6e0', css: '--nph-core-gerencial-100' }
    '200': { valor: '#99adc2', css: '--nph-core-gerencial-200' }
    '300': { valor: '#6685a3', css: '--nph-core-gerencial-300' }
    '400': { valor: '#335c85', css: '--nph-core-gerencial-400' }
    '500': { valor: '#003366', css: '--nph-core-gerencial-500' }
    '600': { valor: '#002952', css: '--nph-core-gerencial-600' }
    '700': { valor: '#001f3d', css: '--nph-core-gerencial-700' }
    '800': { valor: '#001429', css: '--nph-core-gerencial-800' }
    '900': { valor: '#000a14', css: '--nph-core-gerencial-900' }
    '950': { valor: '#00050a', css: '--nph-core-gerencial-950' }
  educacao:
    '50': { valor: '#fff6ea', css: '--nph-core-educacao-50' }
    '100': { valor: '#ffeed5', css: '--nph-core-educacao-100' }
    '200': { valor: '#ffddab', css: '--nph-core-educacao-200' }
    '300': { valor: '#ffcb81', css: '--nph-core-educacao-300' }
    '400': { valor: '#ffba57', css: '--nph-core-educacao-400' }
    '500': { valor: '#ffa92d', css: '--nph-core-educacao-500' }
    '600': { valor: '#cc8724', css: '--nph-core-educacao-600' }
    '700': { valor: '#99651b', css: '--nph-core-educacao-700' }
    '800': { valor: '#664412', css: '--nph-core-educacao-800' }
    '900': { valor: '#332209', css: '--nph-core-educacao-900' }
    '950': { valor: '#1a1104', css: '--nph-core-educacao-950' }
  comercial:
    '50': { valor: '#ecf3f4', css: '--nph-core-comercial-50' }
    '100': { valor: '#d8e6e9', css: '--nph-core-comercial-100' }
    '200': { valor: '#b2cdd3', css: '--nph-core-comercial-200' }
    '300': { valor: '#8bb5bd', css: '--nph-core-comercial-300' }
    '400': { valor: '#659ca7', css: '--nph-core-comercial-400' }
    '500': { valor: '#3e8391', css: '--nph-core-comercial-500' }
    '600': { valor: '#326974', css: '--nph-core-comercial-600' }
    '700': { valor: '#254f57', css: '--nph-core-comercial-700' }
    '800': { valor: '#19343a', css: '--nph-core-comercial-800' }
    '900': { valor: '#0c1a1d', css: '--nph-core-comercial-900' }
    '950': { valor: '#060d0e', css: '--nph-core-comercial-950' }
  financeiro:
    '50': { valor: '#edf1ed', css: '--nph-core-financeiro-50' }
    '100': { valor: '#dbe3db', css: '--nph-core-financeiro-100' }
    '200': { valor: '#b8c8b6', css: '--nph-core-financeiro-200' }
    '300': { valor: '#94ac92', css: '--nph-core-financeiro-300' }
    '400': { valor: '#71916d', css: '--nph-core-financeiro-400' }
    '500': { valor: '#4d7549', css: '--nph-core-financeiro-500' }
    '600': { valor: '#3e5e3a', css: '--nph-core-financeiro-600' }
    '700': { valor: '#2e462c', css: '--nph-core-financeiro-700' }
    '800': { valor: '#1f2f1d', css: '--nph-core-financeiro-800' }
    '900': { valor: '#0f170f', css: '--nph-core-financeiro-900' }
    '950': { valor: '#080c07', css: '--nph-core-financeiro-950' }
  igrejas:
    '50': { valor: '#f2e9ed', css: '--nph-core-igrejas-50' }
    '100': { valor: '#e5d4db', css: '--nph-core-igrejas-100' }
    '200': { valor: '#cca8b7', css: '--nph-core-igrejas-200' }
    '300': { valor: '#b27d92', css: '--nph-core-igrejas-300' }
    '400': { valor: '#99516e', css: '--nph-core-igrejas-400' }
    '500': { valor: '#7f264a', css: '--nph-core-igrejas-500' }
    '600': { valor: '#661e3b', css: '--nph-core-igrejas-600' }
    '700': { valor: '#4c172c', css: '--nph-core-igrejas-700' }
    '800': { valor: '#330f1e', css: '--nph-core-igrejas-800' }
    '900': { valor: '#19080f', css: '--nph-core-igrejas-900' }
    '950': { valor: '#0d0407', css: '--nph-core-igrejas-950' }
  rh:
    '50': { valor: '#ede9f2', css: '--nph-core-rh-50' }
    '100': { valor: '#dbd2e5', css: '--nph-core-rh-100' }
    '200': { valor: '#b7a6cc', css: '--nph-core-rh-200' }
    '300': { valor: '#9379b2', css: '--nph-core-rh-300' }
    '400': { valor: '#6f4d99', css: '--nph-core-rh-400' }
    '500': { valor: '#4b207f', css: '--nph-core-rh-500' }
    '600': { valor: '#3c1a66', css: '--nph-core-rh-600' }
    '700': { valor: '#2d134c', css: '--nph-core-rh-700' }
    '800': { valor: '#1e0d33', css: '--nph-core-rh-800' }
    '900': { valor: '#0f0619', css: '--nph-core-rh-900' }
    '950': { valor: '#08030d', css: '--nph-core-rh-950' }
  neutral:
    '50': { valor: '#f1f1f1', css: '--nph-core-neutral-50' }
    '100': { valor: '#e3e3e3', css: '--nph-core-neutral-100' }
    '200': { valor: '#c7c7c7', css: '--nph-core-neutral-200' }
    '300': { valor: '#ababab', css: '--nph-core-neutral-300' }
    '400': { valor: '#8f8f8f', css: '--nph-core-neutral-400' }
    '500': { valor: '#737373', css: '--nph-core-neutral-500' }
    '600': { valor: '#5c5c5c', css: '--nph-core-neutral-600' }
    '700': { valor: '#454545', css: '--nph-core-neutral-700' }
    '800': { valor: '#2e2e2e', css: '--nph-core-neutral-800' }
    '900': { valor: '#171717', css: '--nph-core-neutral-900' }
    '950': { valor: '#0c0c0c', css: '--nph-core-neutral-950' }
  surface:
    '50': { valor: '#edeeef', css: '--nph-core-surface-50' }
    '100': { valor: '#dbdde0', css: '--nph-core-surface-100' }
    '200': { valor: '#b7bbc1', css: '--nph-core-surface-200' }
    '300': { valor: '#9399a1', css: '--nph-core-surface-300' }
    '400': { valor: '#6f7782', css: '--nph-core-surface-400' }
    '500': { valor: '#4b5563', css: '--nph-core-surface-500' }
    '600': { valor: '#3c444f', css: '--nph-core-surface-600' }
    '700': { valor: '#2d333b', css: '--nph-core-surface-700' }
    '800': { valor: '#1e2228', css: '--nph-core-surface-800' }
    '900': { valor: '#0f1114', css: '--nph-core-surface-900' }
    '950': { valor: '#08080a', css: '--nph-core-surface-950' }
  info:
    '50': { valor: '#e6f3f9', css: '--nph-core-info-50' }
    '100': { valor: '#cce6f4', css: '--nph-core-info-100' }
    '200': { valor: '#9acee9', css: '--nph-core-info-200' }
    '300': { valor: '#67b5dd', css: '--nph-core-info-300' }
    '400': { valor: '#359dd2', css: '--nph-core-info-400' }
    '500': { valor: '#0284c7', css: '--nph-core-info-500' }
    '600': { valor: '#026a9f', css: '--nph-core-info-600' }
    '700': { valor: '#014f77', css: '--nph-core-info-700' }
    '800': { valor: '#013550', css: '--nph-core-info-800' }
    '900': { valor: '#001a28', css: '--nph-core-info-900' }
    '950': { valor: '#000d14', css: '--nph-core-info-950' }
  warn:
    '50': { valor: '#fdeee7', css: '--nph-core-warn-50' }
    '100': { valor: '#fbdece', css: '--nph-core-warn-100' }
    '200': { valor: '#f7bc9e', css: '--nph-core-warn-200' }
    '300': { valor: '#f29b6d', css: '--nph-core-warn-300' }
    '400': { valor: '#ee793d', css: '--nph-core-warn-400' }
    '500': { valor: '#ea580c', css: '--nph-core-warn-500' }
    '600': { valor: '#bb460a', css: '--nph-core-warn-600' }
    '700': { valor: '#8c3507', css: '--nph-core-warn-700' }
    '800': { valor: '#5e2305', css: '--nph-core-warn-800' }
    '900': { valor: '#2f1202', css: '--nph-core-warn-900' }
    '950': { valor: '#170901', css: '--nph-core-warn-950' }
  help:
    '50': { valor: '#f4ebfd', css: '--nph-core-help-50' }
    '100': { valor: '#e9d6fb', css: '--nph-core-help-100' }
    '200': { valor: '#d4adf7', css: '--nph-core-help-200' }
    '300': { valor: '#be85f2', css: '--nph-core-help-300' }
    '400': { valor: '#a95cee', css: '--nph-core-help-400' }
    '500': { valor: '#9333ea', css: '--nph-core-help-500' }
    '600': { valor: '#7629bb', css: '--nph-core-help-600' }
    '700': { valor: '#581f8c', css: '--nph-core-help-700' }
    '800': { valor: '#3b145e', css: '--nph-core-help-800' }
    '900': { valor: '#1d0a2f', css: '--nph-core-help-900' }
    '950': { valor: '#0f0517', css: '--nph-core-help-950' }
  danger:
    '50': { valor: '#fce9e9', css: '--nph-core-danger-50' }
    '100': { valor: '#f8d4d4', css: '--nph-core-danger-100' }
    '200': { valor: '#f1a8a8', css: '--nph-core-danger-200' }
    '300': { valor: '#ea7d7d', css: '--nph-core-danger-300' }
    '400': { valor: '#e35151', css: '--nph-core-danger-400' }
    '500': { valor: '#dc2626', css: '--nph-core-danger-500' }
    '600': { valor: '#b01e1e', css: '--nph-core-danger-600' }
    '700': { valor: '#841717', css: '--nph-core-danger-700' }
    '800': { valor: '#580f0f', css: '--nph-core-danger-800' }
    '900': { valor: '#2c0808', css: '--nph-core-danger-900' }
    '950': { valor: '#160404', css: '--nph-core-danger-950' }
  success:
    '50': { valor: '#e8f6ed', css: '--nph-core-success-50' }
    '100': { valor: '#d0eddb', css: '--nph-core-success-100' }
    '200': { valor: '#a2dab7', css: '--nph-core-success-200' }
    '300': { valor: '#73c892', css: '--nph-core-success-300' }
    '400': { valor: '#45b56e', css: '--nph-core-success-400' }
    '500': { valor: '#16a34a', css: '--nph-core-success-500' }
    '600': { valor: '#12823b', css: '--nph-core-success-600' }
    '700': { valor: '#0d622c', css: '--nph-core-success-700' }
    '800': { valor: '#09411e', css: '--nph-core-success-800' }
    '900': { valor: '#04210f', css: '--nph-core-success-900' }
    '950': { valor: '#021007', css: '--nph-core-success-950' }
  base:
    white: { valor: '#ffffff', css: '--nph-core-base-white' }
    black: { valor: '#000000', css: '--nph-core-base-black' }
  font:
    sans: { valor: 'Noto Sans', css: '--nph-core-font-sans' }
    mono: { valor: 'IBM Plex Mono', css: '--nph-core-font-mono' }
  size:
    '100': { valor: 12, rem: '0.75rem',  css: '--nph-core-size-100' }
    '200': { valor: 14, rem: '0.875rem', css: '--nph-core-size-200' }
    '300': { valor: 16, rem: '1rem',     css: '--nph-core-size-300' }
    '400': { valor: 18, rem: '1.125rem', css: '--nph-core-size-400' }
    '500': { valor: 20, rem: '1.25rem',  css: '--nph-core-size-500' }
    '600': { valor: 24, rem: '1.5rem',   css: '--nph-core-size-600' }
    '700': { valor: 30, rem: '1.875rem', css: '--nph-core-size-700' }
    '800': { valor: 36, rem: '2.25rem',  css: '--nph-core-size-800' }
  line-height:
    '100': { valor: 16, css: '--nph-core-line-height-100' }
    '200': { valor: 20, css: '--nph-core-line-height-200' }
    '300': { valor: 24, css: '--nph-core-line-height-300' }
    '400': { valor: 28, css: '--nph-core-line-height-400' }
    '500': { valor: 32, css: '--nph-core-line-height-500' }
    '600': { valor: 36, css: '--nph-core-line-height-600' }
    '700': { valor: 44, css: '--nph-core-line-height-700' }
  weight:
    regular:  { valor: 400, css: '--nph-core-weight-regular' }
    medium:   { valor: 500, css: '--nph-core-weight-medium' }
    semibold: { valor: 600, css: '--nph-core-weight-semibold' }
    bold:     { valor: 700, css: '--nph-core-weight-bold' }
  tracking:
    tight:  { valor: -0.2, css: '--nph-core-tracking-tight' }
    normal: { valor: 0,    css: '--nph-core-tracking-normal' }
    wide:   { valor: 0.4,  css: '--nph-core-tracking-wide' }

# ---------------------------------------------------------------
# CAMADA 2 - SEMANTICOS. E daqui que componente e agente consomem.
# ---------------------------------------------------------------
tokens_semantic:
  color/background:
    css: '--nph-color-background'
    claro: core/base/white
    escuro: core/surface/900
    use: "Fundo da página e de área que não seja cartão."
    nao_use: "Em cartão, popover ou barra lateral."
  color/foreground:
    css: '--nph-color-foreground'
    claro: core/base/black
    escuro: core/neutral/100
    use: "Texto padrão sobre o fundo base."
    nao_use: "Sobre color/primary ou sobre cor de estado."
  color/primary:
    css: '--nph-color-primary'
    claro: theme/brand-600
    escuro: theme/brand-400
    use: "Fundo da ação mais importante da tela. Vem da marca ativa: o Nephos e multimarcas e primary muda quando a marca muda."
    nao_use: "Dois primarios no mesmo bloco de decisao. Fixar um valor proprio, ignorando a marca ativa."
  color/primary-foreground:
    css: '--nph-color-primary-foreground'
    claro: theme/brand-on-600
    escuro: theme/brand-on-400
    use: "Texto e ícone sobre color/primary."
    nao_use: "Sobre qualquer outro fundo."
  color/secondary:
    css: '--nph-color-secondary'
    claro: core/neutral/100
    escuro: core/surface/600
    use: "Ação alternativa que acompanha a primária."
    nao_use: "Ação destrutiva."
  color/secondary-foreground:
    css: '--nph-color-secondary-foreground'
    claro: core/neutral/900
    escuro: core/neutral/100
    use: "Texto sobre color/secondary."
  color/secondary-hover:
    css: '--nph-color-secondary-hover'
    claro: core/neutral/200
    escuro: core/surface/700
    use: "Superfície de hover de ação secondary. Mantém a mudança visível nos dois modos."
    nao_use: "Hover de primary, destructive, outline ou ghost."
  color/accent:
    css: '--nph-color-accent'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Realce temporário: hover, item focado, linha ativa."
    nao_use: "Fundo permanente de bloco."
  color/accent-foreground:
    css: '--nph-color-accent-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Texto sobre color/accent."
  color/muted:
    css: '--nph-color-muted'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Fundo permanente sem ênfase: cabeçalho de tabela, área desabilitada."
    nao_use: "Hover."
  color/muted-foreground:
    css: '--nph-color-muted-foreground'
    claro: core/neutral/500
    escuro: core/neutral/300
    use: "Legenda, texto auxiliar, placeholder, metadado."
    nao_use: "Texto necessário para concluir a tarefa."
  color/destructive:
    css: '--nph-color-destructive'
    claro: core/danger/600
    escuro: core/danger/400
    use: "Ação que apaga, revoga ou não tem volta."
    nao_use: "Erro de validação."
  color/destructive-foreground:
    css: '--nph-color-destructive-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Texto e ícone sobre color/destructive."
    nao_use: "Sobre outro fundo sólido. O alias próprio existe porque color/primary-foreground não passa em todos os modos e marcas."
  color/border:
    css: '--nph-color-border'
    claro: core/neutral/200
    escuro: core/surface/400
    use: "Divisor, contorno de cartão, linha de tabela."
    nao_use: "Borda de campo de formulário."
  color/input:
    css: '--nph-color-input'
    claro: core/neutral/200
    escuro: core/surface/300
    use: "Borda de campo: input, select, textarea, checkbox."
  color/card:
    css: '--nph-color-card'
    claro: core/base/white
    escuro: core/surface/800
    use: "Fundo de cartão."
    nao_use: "Sombra para simular elevação no modo escuro."
  color/card-foreground:
    css: '--nph-color-card-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Texto sobre color/card."
  color/popover:
    css: '--nph-color-popover'
    claro: core/base/white
    escuro: core/surface/700
    use: "Camada flutuante presa a um gatilho, que NAO bloqueia a pagina: popover, dropdown, tooltip, menu de contexto."
    nao_use: "Conteudo fixo da pagina. Dialogo, modal ou painel lateral - esses sao color/dialog."
  color/popover-foreground:
    css: '--nph-color-popover-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Texto sobre color/popover."
  color/dialog:
    css: '--nph-color-dialog'
    claro: core/base/white
    escuro: core/surface/600
    use: "Fundo de dialogo, modal e painel lateral - a camada que BLOQUEIA a pagina. No escuro sobe para surface/600, um degrau acima do popover: e o nivel mais alto da rampa, e no escuro a rampa E a elevacao. USE sempre com overlay/scrim."
    nao_use: "Popover, tooltip ou menu suspenso - esses sao color/popover."
  color/dialog-foreground:
    css: '--nph-color-dialog-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Texto e icone sobre color/dialog. 7,68:1 no escuro."
  focus/ring:
    css: '--nph-focus-ring'
    claro: theme/brand-700
    escuro: theme/brand-400
    use: "Anel de foco de teclado, em todo elemento focável."
    nao_use: "Remover."
  focus/ring-error:
    css: '--nph-focus-ring-error'
    claro: core/danger/200
    escuro: core/danger/400
    use: "Anel de foco em campo que falhou validação."
    nao_use: "Sozinho, sem mensagem de texto."
  sidebar/background:
    css: '--nph-sidebar-background'
    claro: core/neutral/50
    escuro: core/surface/950
    use: "Fundo da barra lateral."
  sidebar/foreground:
    css: '--nph-sidebar-foreground'
    claro: core/neutral/700
    escuro: core/neutral/300
    use: "Texto de item não selecionado."
  sidebar/accent:
    css: '--nph-sidebar-accent'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Item da barra lateral em hover."
    nao_use: "Item ativo."
  sidebar/accent-foreground:
    css: '--nph-sidebar-accent-foreground'
    claro: core/neutral/900
    escuro: core/neutral/100
    use: "Texto do item em hover."
  sidebar/primary:
    css: '--nph-sidebar-primary'
    claro: theme/brand-600
    escuro: theme/brand-600
    use: "Item ativo da barra lateral."
    nao_use: "Mais de um item por vez."
  sidebar/primary-foreground:
    css: '--nph-sidebar-primary-foreground'
    claro: theme/brand-on-600
    escuro: theme/brand-on-600
    use: "Texto do item ativo."
  sidebar/border:
    css: '--nph-sidebar-border'
    claro: core/neutral/200
    escuro: core/surface/400
    use: "Separa a barra lateral do conteúdo."
  sidebar/ring:
    css: '--nph-sidebar-ring'
    claro: core/neutral/300
    escuro: core/neutral/200
    use: "Anel de foco dentro da barra lateral."
  status/info:
    css: '--nph-status-info'
    claro: core/info/600
    escuro: core/info/400
    use: "Cor sólida do estado: ícone, ponto, barra da mensagem. Informação neutra: aviso do sistema, dica contextual."
    nao_use: "erro, risco ou confirmação"
  status/info-surface:
    css: '--nph-status-info-surface'
    claro: core/info/50
    escuro: core/info/900
    use: "Fundo da mensagem. Sempre em conjunto com os outros três papéis de status/info."
  status/info-border:
    css: '--nph-status-info-border'
    claro: core/info/200
    escuro: core/info/400
    use: "Borda da mensagem. Sempre em conjunto com os outros três papéis de status/info."
  status/info-foreground:
    css: '--nph-status-info-foreground'
    claro: core/info/800
    escuro: core/info/100
    use: "Texto dentro da mensagem. Sempre em conjunto com os outros três papéis de status/info."
  status/warning:
    css: '--nph-status-warning'
    claro: core/warn/600
    escuro: core/warn/400
    use: "Cor sólida do estado: ícone, ponto, barra da mensagem. Algo pode dar errado, ou exige cuidado antes de seguir."
    nao_use: "erro que já aconteceu"
  status/warning-surface:
    css: '--nph-status-warning-surface'
    claro: core/warn/50
    escuro: core/warn/900
    use: "Fundo da mensagem. Sempre em conjunto com os outros três papéis de status/warning."
  status/warning-border:
    css: '--nph-status-warning-border'
    claro: core/warn/200
    escuro: core/warn/400
    use: "Borda da mensagem. Sempre em conjunto com os outros três papéis de status/warning."
  status/warning-foreground:
    css: '--nph-status-warning-foreground'
    claro: core/warn/800
    escuro: core/warn/100
    use: "Texto dentro da mensagem. Sempre em conjunto com os outros três papéis de status/warning."
  status/help:
    css: '--nph-status-help'
    claro: core/help/600
    escuro: core/help/400
    use: "Cor sólida do estado: ícone, ponto, barra da mensagem. Ajuda e orientação: explicação, tour, conteúdo de apoio."
    nao_use: "estado do sistema"
  status/help-surface:
    css: '--nph-status-help-surface'
    claro: core/help/50
    escuro: core/help/900
    use: "Fundo da mensagem. Sempre em conjunto com os outros três papéis de status/help."
  status/help-border:
    css: '--nph-status-help-border'
    claro: core/help/200
    escuro: core/help/400
    use: "Borda da mensagem. Sempre em conjunto com os outros três papéis de status/help."
  status/help-foreground:
    css: '--nph-status-help-foreground'
    claro: core/help/800
    escuro: core/help/100
    use: "Texto dentro da mensagem. Sempre em conjunto com os outros três papéis de status/help."
  status/error:
    css: '--nph-status-error'
    claro: core/danger/600
    escuro: core/danger/400
    use: "Cor sólida do estado: ícone, ponto, barra da mensagem. Erro que já aconteceu: validação falhou, requisição quebrou. Também o asterisco que marca campo obrigatório no nph-label: ali é aviso de exigência, não erro."
    nao_use: "ação destrutiva do usuário"
  status/error-surface:
    css: '--nph-status-error-surface'
    claro: core/danger/50
    escuro: core/danger/900
    use: "Fundo da mensagem. Sempre em conjunto com os outros três papéis de status/error."
  status/error-border:
    css: '--nph-status-error-border'
    claro: core/danger/200
    escuro: core/danger/400
    use: "Borda da mensagem. Sempre em conjunto com os outros três papéis de status/error."
  status/error-foreground:
    css: '--nph-status-error-foreground'
    claro: core/danger/800
    escuro: core/danger/100
    use: "Texto dentro da mensagem. Sempre em conjunto com os outros três papéis de status/error."
  status/success:
    css: '--nph-status-success'
    claro: core/success/600
    escuro: core/success/400
    use: "Cor sólida do estado: ícone, ponto, barra da mensagem. Confirmação de que a ação deu certo."
    nao_use: "estado permanente como selo de ativo"
  status/success-surface:
    css: '--nph-status-success-surface'
    claro: core/success/50
    escuro: core/success/900
    use: "Fundo da mensagem. Sempre em conjunto com os outros três papéis de status/success."
  status/success-border:
    css: '--nph-status-success-border'
    claro: core/success/200
    escuro: core/success/400
    use: "Borda da mensagem. Sempre em conjunto com os outros três papéis de status/success."
  status/success-foreground:
    css: '--nph-status-success-foreground'
    claro: core/success/800
    escuro: core/success/100
    use: "Texto dentro da mensagem. Sempre em conjunto com os outros três papéis de status/success."
  brand/sistemas:
    css: '--nph-brand-sistemas'
    claro: core/sistemas/500
    escuro: core/sistemas/400
    use: "Identifica a vertical Sistemas: cabeçalho de produto, selo, série de gráfico."
    nao_use: "Servir de atalho para o primario. Quando esta e a marca ativa, quem entrega a cor ao botao e color/primary, que ja vem de theme/*."
  brand/sistemas-foreground:
    css: '--nph-brand-sistemas-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Texto sobre brand/sistemas."
  brand/gerencial:
    css: '--nph-brand-gerencial'
    claro: core/gerencial/500
    escuro: core/gerencial/400
    use: "Identifica a vertical Gerencial: cabeçalho de produto, selo, série de gráfico."
    nao_use: "Servir de atalho para o primario. Quando esta e a marca ativa, quem entrega a cor ao botao e color/primary, que ja vem de theme/*."
  brand/gerencial-foreground:
    css: '--nph-brand-gerencial-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Texto sobre brand/gerencial."
  brand/educacao:
    css: '--nph-brand-educacao'
    claro: core/educacao/500
    escuro: core/educacao/400
    use: "Identifica a vertical Educação: cabeçalho de produto, selo, série de gráfico."
    nao_use: "Servir de atalho para o primario. Quando esta e a marca ativa, quem entrega a cor ao botao e color/primary, que ja vem de theme/*."
  brand/educacao-foreground:
    css: '--nph-brand-educacao-foreground'
    claro: core/base/white
    escuro: core/base/white
    use: "Texto sobre a marca Educacao. Branco, como nas outras seis - mas somente sobre brand/educacao-strong."
    nao_use: "Sobre o ambar cru (#ffa92d): daria 1.92:1 e reprova."
  brand/comercial:
    css: '--nph-brand-comercial'
    claro: core/comercial/500
    escuro: core/comercial/400
    use: "Identifica a vertical Comercial: cabeçalho de produto, selo, série de gráfico."
    nao_use: "Servir de atalho para o primario. Quando esta e a marca ativa, quem entrega a cor ao botao e color/primary, que ja vem de theme/*."
  brand/comercial-foreground:
    css: '--nph-brand-comercial-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Texto sobre brand/comercial."
  brand/financeiro:
    css: '--nph-brand-financeiro'
    claro: core/financeiro/500
    escuro: core/financeiro/400
    use: "Identifica a vertical Financeiro: cabeçalho de produto, selo, série de gráfico."
    nao_use: "Servir de atalho para o primario. Quando esta e a marca ativa, quem entrega a cor ao botao e color/primary, que ja vem de theme/*."
  brand/financeiro-foreground:
    css: '--nph-brand-financeiro-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Texto sobre brand/financeiro."
  brand/igrejas:
    css: '--nph-brand-igrejas'
    claro: core/igrejas/500
    escuro: core/igrejas/400
    use: "Identifica a vertical Igrejas: cabeçalho de produto, selo, série de gráfico."
    nao_use: "Servir de atalho para o primario. Quando esta e a marca ativa, quem entrega a cor ao botao e color/primary, que ja vem de theme/*."
  brand/igrejas-foreground:
    css: '--nph-brand-igrejas-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Texto sobre brand/igrejas."
  brand/rh:
    css: '--nph-brand-rh'
    claro: core/rh/500
    escuro: core/rh/400
    use: "Identifica a vertical Recursos Humanos: cabeçalho de produto, selo, série de gráfico."
    nao_use: "Servir de atalho para o primario. Quando esta e a marca ativa, quem entrega a cor ao botao e color/primary, que ja vem de theme/*."
  brand/rh-foreground:
    css: '--nph-brand-rh-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Texto sobre brand/rh."
  brand/sistemas-strong:
    css: '--nph-brand-sistemas-strong'
    claro: core/sistemas/600
    escuro: core/sistemas/500
    use: "Use no lugar de brand/sistemas quando a superfície carregar texto branco em tamanho normal. O 500 só passa em texto grande (3.68:1); o 600 passa (5.37:1)."
  brand/educacao-strong:
    css: '--nph-brand-educacao-strong'
    claro: core/educacao/700
    escuro: core/educacao/700
    use: "Superficie de Educacao que carrega texto. O 500 da 1.92:1 com branco e o 600 da 2.98:1 - os dois reprovam. O 700 da 4.96:1 e passa em AA."
    nao_use: "Serie de grafico ou selo sem texto - ali a cor da vertical e o 500."
  brand/comercial-strong:
    css: '--nph-brand-comercial-strong'
    claro: core/comercial/600
    escuro: core/comercial/500
    use: "Mesma regra do brand/sistemas-strong. O 500 de Comercial (#3e8391) da 4.32:1; o 600 da 6.16:1. Financeiro nao precisa de variante: o 500 (#4d7549) ja da 5.25:1."

# ---------------------------------------------------------------
# CAMADA DE MARCA. Um modo por vertical. So a camada semantica consome.
# ---------------------------------------------------------------
tokens_theme:
  modos: [Sistemas, Gerencial, Educacao, Comercial, Financeiro, Igrejas, Recursos Humanos]
  nota: >-
    O Nephos e multimarcas. A marca ativa e uma dimensao independente do esquema
    de cor: um produto pode estar em Educacao + escuro sem que nada seja reautorado.
    Estes tokens nao sao consumidos por componente - so pela camada semantica.
  theme/brand-400:
    css: '--nph-theme-brand-400'
    valor_por_modo: "core/<vertical>/400 em seis verticais; core/educacao/700 em Educacao"
    use: "Tom da marca no modo escuro. Alimenta color/primary e focus/ring. Educacao usa o 700 porque o ambar e a vertical mais clara do sistema e o 400 nao sustenta texto branco."
  theme/brand-500:
    css: '--nph-theme-brand-500'
    valor_por_modo: core/<vertical>/500
    use: "A cor da marca como ela e."
  theme/brand-600:
    css: '--nph-theme-brand-600'
    valor_por_modo: "core/<vertical>/600 em seis verticais; core/educacao/700 em Educacao"
    use: "Tom da marca no modo claro. Alimenta color/primary e sidebar/primary. O 500 de algumas verticais nao passa com texto branco; em Educacao nem o 600 passa (2.98:1), so o 700 (4.96:1)."
  theme/brand-700:
    css: '--nph-theme-brand-700'
    valor_por_modo: "core/<vertical>/700 em seis verticais; core/educacao/800 em Educacao"
    use: "Tom da marca para o anel de foco no modo claro, onde o 500 e o 600 de algumas verticais nao alcancam 3:1 contra fundo branco. Em Educacao e o 800, para o anel nao coincidir com o proprio primario."
  theme/brand-on-600:
    css: '--nph-theme-brand-on-600'
    valor_por_modo: core/base/white
    use: "Texto sobre o tom da marca no modo claro. Branco nas sete verticais - a diferenca de Educacao foi resolvida escurecendo o fundo, nao clareando o texto."
  theme/brand-on-400:
    css: '--nph-theme-brand-on-400'
    valor_por_modo: "core/neutral/950 em Sistemas, Comercial e Financeiro; core/base/white em Gerencial, Igrejas, Recursos Humanos e Educacao"
    use: "Texto sobre o tom da marca no modo escuro. Varia por vertical porque a luminancia do tom varia: onde o 400 e claro, o texto e escuro."

# ---------------------------------------------------------------
# TIPOGRAFIA - os 14 papeis. Todo texto usa um deles. Nenhum texto
# sem papel. Nao ha camada de marca: as sete verticais compartilham
# a familia. Valores em px; em CSS use a coluna rem de core/size.
# ---------------------------------------------------------------
tipografia_regras:
  familia_interface: core/font/sans
  familia_mono: core/font/mono
  corpo_padrao: text/body-md
  unidade_css: rem, raiz 16px
  piso: 12px
  enfase: "<strong> no HTML. Nao existe papel de enfase e nao se usa label para destacar palavra em paragrafo."
  pesos_por_regiao: no maximo 2
  css_forma: "O campo `css` de cada papel e um PREFIXO, nao o nome final. Cada papel emite cinco custom properties: `-font-family`, `-font-size`, `-line-height`, `-font-weight` e `-letter-spacing`. Exemplo: text/label-md emite --nph-text-label-md-font-size. Sao cinco e nao uma porque `letter-spacing` nao cabe no atalho `font` do CSS e porque componente costuma precisar de uma propriedade isolada. Migrado em 27-08-2026; confirmar na revisao tecnica."
  css_unidade_real: "As cinco saem em rem desde 28-08-2026, quando o gerador passou a cumprir a regra `unidade_css` acima (P62.4, decisao de Elvys). Antes saiam em px. A conversao usa raiz 16px e vale para todo dimension, EXCETO core/radius, que segue `raio_regras.unidade_css: px` por regra propria."

tokens_typography:
  text/heading-xl:
    css: '--nph-text-heading-xl'
    valores: { size: 30, line-height: 36, weight: 600, tracking: -0.2, family: sans }
    use: "Abertura de pagina ampla e capa de documentacao. NAO USE dentro de tela de trabalho."
  text/heading-lg:
    css: '--nph-text-heading-lg'
    valores: { size: 24, line-height: 32, weight: 600, tracking: -0.2, family: sans }
    use: "Titulo principal da tela, um por pagina. E o primeiro degrau que a WCAG conta como texto grande."
  text/heading-md:
    css: '--nph-text-heading-md'
    valores: { size: 20, line-height: 28, weight: 600, tracking: 0, family: sans }
    use: "Titulo de secao e de cartao. NAO e texto grande para a WCAG: exige 4,5:1."
  text/heading-sm:
    css: '--nph-text-heading-sm'
    valores: { size: 16, line-height: 24, weight: 600, tracking: 0, family: sans }
    use: "Subsecao e cabecalho de grupo. NAO USE como rotulo de campo - rotulo e label-md."
  text/heading-xs:
    css: '--nph-text-heading-xs'
    valores: { size: 14, line-height: 20, weight: 600, tracking: 0, family: sans }
    use: "Titulo pequeno dentro de uma peca: titulo de cartao, cabecalho de coluna de tabela, titulo de alerta. Mesmo corpo do label-md, com peso acima. NAO USE em rotulo de campo nem em botao - esses sao label-md."
  text/heading-2xs:
    css: '--nph-text-heading-2xs'
    valores: { size: 12, line-height: 16, weight: 600, tracking: 0, family: sans }
    use: "Titulo no piso da escala: cabecalho de coluna em tabela densa, titulo de secao dentro de popover. NAO USE quando houver espaco para heading-xs."
  text/body-lg:
    css: '--nph-text-body-lg'
    valores: { size: 16, line-height: 24, weight: 400, tracking: 0, family: sans }
    use: "Leitura longa: documentacao e portal. Altura de linha 1,5; linha de 60 a 80 caracteres."
  text/body-md:
    css: '--nph-text-body-md'
    valores: { size: 14, line-height: 20, weight: 400, tracking: 0, family: sans }
    use: "Corpo padrao da interface: formulario, tabela, painel e mensagem do sistema, inclusive erro de validacao."
  text/body-sm:
    css: '--nph-text-body-sm'
    valores: { size: 12, line-height: 16, weight: 400, tracking: 0, family: sans }
    use: "Texto acessorio que acompanha outro conteudo. NUNCA informacao essencial."
  text/label-lg:
    css: '--nph-text-label-lg'
    valores: { size: 16, line-height: 24, weight: 500, tracking: 0, family: sans }
    use: "Aba, item de menu principal e rotulo de destaque. NAO USE como titulo."
  text/label-md:
    css: '--nph-text-label-md'
    valores: { size: 14, line-height: 20, weight: 500, tracking: 0, family: sans }
    use: "Botao, rotulo de campo e item de menu. E o papel padrao de todo controle."
  text/label-sm:
    css: '--nph-text-label-sm'
    valores: { size: 12, line-height: 16, weight: 500, tracking: 0.4, family: sans }
    use: "Cabecalho de coluna de tabela, chip e selo. E etiqueta, nao frase."
  text/caption:
    css: '--nph-text-caption'
    valores: { size: 12, line-height: 16, weight: 400, tracking: 0.4, family: sans }
    use: "Legenda, ajuda abaixo do campo, contador e data. NAO USE em mensagem de erro."
  text/code:
    css: '--nph-text-code'
    valores: { size: 14, line-height: 20, weight: 400, tracking: 0, family: mono }
    use: "Codigo, identificador, chave, hash e caminho - o que se le caractere a caractere. NAO USE em numero de tabela."

# ---------------------------------------------------------------
# ESPACAMENTO - primitivos em core (invisiveis) e 7 tokens de
# intencao na colecao semantic. Componente consome SO os
# semanticos. Base 4px com meio-passo de 2. Valores em px; em CSS
# use rem, raiz 16px.
# ---------------------------------------------------------------
espacamento_regras:
  unidade_base: 4
  meio_passo: 2
  meio_passo_use: "Somente chip, icone e celula de tabela. Nao tem token semantico."
  unidade_css: rem, raiz 16px
  padding_vs_gap: "Padding e o respiro dentro de uma caixa. Gap e a distancia entre caixas. Tokens diferentes porque as decisoes sao diferentes."
  passo_por_vez: "Se um degrau aperta, suba um. Pular degrau e sintoma de problema de agrupamento, nao de espaco."

tokens_core_space:
  '0':    { valor: 0,  rem: '0',       css: '--nph-core-space-0' }
  '50':   { valor: 2,  rem: '0.125rem', css: '--nph-core-space-50' }
  '100':  { valor: 4,  rem: '0.25rem',  css: '--nph-core-space-100' }
  '200':  { valor: 8,  rem: '0.5rem',   css: '--nph-core-space-200' }
  '300':  { valor: 12, rem: '0.75rem',  css: '--nph-core-space-300' }
  '400':  { valor: 16, rem: '1rem',     css: '--nph-core-space-400' }
  '500':  { valor: 20, rem: '1.25rem',  css: '--nph-core-space-500' }
  '600':  { valor: 24, rem: '1.5rem',   css: '--nph-core-space-600' }
  '700':  { valor: 32, rem: '2rem',     css: '--nph-core-space-700' }
  '800':  { valor: 40, rem: '2.5rem',   css: '--nph-core-space-800' }
  '900':  { valor: 48, rem: '3rem',     css: '--nph-core-space-900' }
  '1000': { valor: 64, rem: '4rem',     css: '--nph-core-space-1000' }
  '1100': { valor: 80, rem: '5rem',     css: '--nph-core-space-1100' }

tokens_space:
  space/inline-tight:
    css: '--nph-space-inline-tight'
    alias: core/space/100
    valor: 4
    use: "Espaco horizontal DENTRO de uma unidade: icone e seu texto, valor e sua unidade. NAO USE entre elementos independentes - ai e space/inline."
  space/inline:
    css: '--nph-space-inline'
    alias: core/space/200
    valor: 8
    use: "Espaco horizontal ENTRE elementos independentes: botoes de um grupo, rotulo e selo, itens de uma barra."
  space/stack-tight:
    css: '--nph-space-stack-tight'
    alias: core/space/100
    valor: 4
    use: "Espaco vertical entre um rotulo e o que ele descreve: rotulo e campo, titulo e subtitulo. Sao duas linhas de uma coisa so."
  space/stack:
    css: '--nph-space-stack'
    alias: core/space/400
    valor: 16
    use: "Espaco vertical padrao entre itens irmaos: campos de um formulario, itens de uma lista, linhas de um painel."
  space/section:
    css: '--nph-space-section'
    alias: core/space/700
    valor: 32
    use: "Entre secoes de uma mesma pagina. Se ha um titulo novo, e section. NAO USE entre campos."
  space/control-padding:
    css: '--nph-space-control-padding'
    alias: core/space/300
    valor: 12
    use: "Padding horizontal interno de botao, campo e select - o que se opera. NAO USE em cartao."
  space/container-padding:
    css: '--nph-space-container-padding'
    alias: core/space/400
    valor: 16
    use: "Padding interno de cartao, painel, popover e dialogo - o que contem. NAO USE em controle."

regras_raio_parcial:
  preferido: 'O conteiner carrega o raio e RECORTA (overflow: hidden). Os filhos ficam em radius/none e nao precisam saber que estao dentro de algo curvo. Vale para tabela, lista, acordeao e qualquer pilha.'
  excecao: 'Quando recortar nao da - grupo de botoes com borda propria - o PRIMEIRO e o ULTIMO item recebem o raio do conteiner so nos cantos EXTERNOS; os do meio ficam em radius/none.'
  nunca: 'Dar o raio cheio a todos os filhos e deixar o conteiner reto: a curva aparece repetida por dentro e o grupo deixa de parecer uma peca so.'
  sem_token: 'NAO existe token de canto parcial. Raio no CSS ja e por canto; um token que empacota quatro cantos so acrescenta uma camada.'

regras_italico_sublinhado:
  italico_nao_e_papel: 'A Noto Sans tem italico real em Regular, Medium e SemiBold. Aplique por semantica no HTML, herdando o papel em uso.'
  use_italico_em: ['citacao textual', 'termo estrangeiro nao incorporado', 'nome de obra ou publicacao', 'variavel matematica ou nome cientifico']
  nao_use_italico_em: ['enfase - enfase e <strong>', 'titulo, rotulo, botao, item de menu', 'paragrafo inteiro', 'mensagem de erro ou de estado']
  sublinhado: 'EXCLUSIVO de link. Sublinhar texto que nao e link quebra a unica convencao que a web inteira tem, e faz a pessoa tentar clicar no que nao clica.'

regras_densidade:
  modo_de_densidade: 'NAO existe. Compacto e control/height-compact mais o espacamento proprio da tabela. Um modo do sistema inteiro dobraria cada token semantico de espaco e teria de ser conferido em cada componente.'

regras_sombra_interna:
  existe: false
  motivo: 'As sete sombras do sistema sao todas projetadas. Campo afundado e poco de lista se resolvem com color/muted no fundo mais color/input na borda. Sombra interna e vocabulario do painel administrativo dos anos 2010, que esta nas anti-referencias.'

tokens_control:
  control/height-compact:
    css: '--nph-control-height-compact'
    alias: core/control-height/compact
    valor: 28
    use: "Altura de controle em tela densa: tabela, barra de ferramentas, filtro. NUNCA em alvo de toque - reprova a WCAG 2.5.8."
  control/height-default:
    css: '--nph-control-height-default'
    alias: core/control-height/default
    valor: 36
    use: "Altura padrao de botao, campo e select. Na duvida, e esta."
  control/height-large:
    css: '--nph-control-height-large'
    alias: core/control-height/large
    valor: 44
    use: "Formulario principal e tela sensivel ao toque. Garante o alvo minimo de 44px recomendado pela WCAG 2.2."

# ---------------------------------------------------------------
# RAIO - primitivos em core (invisiveis) e 8 tokens de intencao na
# colecao semantic. Componente consome SO os semanticos.
# ATENCAO: raio e em px, NAO em rem. E a unica fundacao assim.
# Raio nao deve crescer com a fonte do usuario: a peca mudaria de
# forma, nao de tamanho.
# ---------------------------------------------------------------
raio_regras:
  padrao_do_sistema: radius/control
  unidade_css: px
  por_que_px: "Raio em rem cresceria com a fonte do usuario e um botao de 6px viraria capsula. Forma nao acompanha tamanho de texto."
  aninhado: "Raio interno = raio externo - padding. Se der zero ou menos, use radius/none. Interno NUNCA igual ao externo."
  varia_por_modo: false

tokens_core_radius:
  '0':    { valor: 0,    css: '--nph-core-radius-0' }
  '100':  { valor: 2,    css: '--nph-core-radius-100' }
  '200':  { valor: 4,    css: '--nph-core-radius-200' }
  '300':  { valor: 6,    css: '--nph-core-radius-300' }
  '400':  { valor: 8,    css: '--nph-core-radius-400' }
  '450':  { valor: 10,   css: '--nph-core-radius-450' }
  '500':  { valor: 12,   css: '--nph-core-radius-500' }
  '600':  { valor: 14,   css: '--nph-core-radius-600' }
  full:   { valor: 9999, css: '--nph-core-radius-full' }

tokens_radius:
  radius/none:
    css: '--nph-radius-none'
    alias: core/radius/0
    valor: 0
    use: "Canto reto. USE no que encosta na borda da tela ou de outro elemento: barra lateral, cabecalho fixo, tabela de largura total, celula. NAO USE em peca solta sobre o fundo."
  radius/subtle:
    css: '--nph-radius-subtle'
    alias: core/radius/100
    valor: 2
    use: "USE em marcador pequeno que nao contem nada: barra de estado, indicador, tag minima, alca de redimensionamento. NAO USE em controle."
  radius/inner:
    css: '--nph-radius-inner'
    alias: core/radius/200
    valor: 4
    use: "USE em elemento aninhado dentro de um controle ou conteiner: checkbox, icone com fundo, item dentro de popover, miniatura. Raio interno e sempre menor que o externo."
  radius/control:
    css: '--nph-radius-control'
    alias: core/radius/300
    valor: 6
    use: "PADRAO DO SISTEMA. USE em botao, campo, select, textarea e qualquer coisa que se opere. Na duvida, e este."
  radius/container:
    css: '--nph-radius-container'
    alias: core/radius/400
    valor: 8
    use: "USE em popover, tooltip e menu suspenso - a camada flutuante presa a um gatilho. NAO USE em cartao ou painel: esses sao radius/surface. NAO USE em controle."
  radius/overlay:
    css: '--nph-radius-overlay'
    alias: core/radius/450
    valor: 10
    use: "USE em camada flutuante grande: dialogo, modal, painel lateral. E a BASE da escala do kit de referencia (--radius = 10), da qual control e container derivam. Popover e tooltip NAO entram aqui - esses sao radius/container."
  radius/surface:
    css: '--nph-radius-surface'
    alias: core/radius/600
    valor: 14
    use: "USE em cartao, painel e folha - a superficie que carrega conteudo e NAO flutua. Equivale ao rounded-xl do kit. NAO USE em camada flutuante."
  radius/full:
    css: '--nph-radius-full'
    alias: core/radius/full
    valor: 9999
    use: "Forma totalmente arredondada. USE somente em peca pequena cuja forma comunica marcador: selo, contador, avatar, botao do switch. NUNCA em botao comum, campo ou cartao."

# ---------------------------------------------------------------
# ELEVACAO - o nivel e um ESTILO DE EFEITO, nao uma variavel: uma
# sombra de duas camadas nao cabe em uma variavel. As cores de
# sombra sao semanticas e ficam TRANSPARENTES no modo escuro, onde
# a elevacao vem da rampa surface (ver secao 3 deste arquivo).
# Componente usa elevation/*; NUNCA escolhe shadow/* a mao.
# ---------------------------------------------------------------
elevacao_regras:
  claro: "A elevacao e a sombra."
  escuro: "A sombra zera. A elevacao vem da rampa surface (sidebar 950, fundo 900, cartao 800, popover 700, dialogo 600) e da borda."
  unidade_css: px
  camadas_por_nivel: '2 na faixa do meio; 1 nos extremos (hairline, subtle, spotlight)'
  opacidade: 'Constante na faixa do meio: raised, dropdown, modal e drawer usam shadow/color a 10%, e ali os niveis crescem em deslocamento e desfoque, nao em opacidade. Nos extremos varia: hairline e subtle usam shadow/color-light a 5%, spotlight usa shadow/color-strong a 25%. Os tres valores vieram do kit de referencia.'
  spread_negativo: 'Encolhe a sombra e a mantem ancorada sob a peca, em vez de vazar pelas laterais.'
  alinhamento: 'Os sete niveis com sombra batem exatamente na geometria E na opacidade do kit shadcn: hairline=2xs, subtle=xs, raised=sm, dropdown=md, modal=lg, drawer=xl, spotlight=2xl. Nomes por intencao sao do Nephos; os numeros foram alinhados para que trocar o estilo de um componente adaptado seja 1:1.'
  um_nivel_por_peca: "Nao empilhar elevacao dentro de elevacao."
  sombra_nao_e_estado: "Hover e foco se resolvem com cor e anel de foco, nunca subindo o nivel."
  modal_exige_veu: overlay/scrim

tokens_elevation:
  elevation/none:
    css: '--nph-elevation-none'
    valor: none
    use: "Peca encostada no fundo, ou dentro de um conteiner que ja esta elevado. NAO empilhe elevacao dentro de elevacao."
  elevation/hairline:
    css: '--nph-elevation-hairline'
    camadas: ['0 1px 0 0 shadow/color-light']
    equivale_a: 'shadow-2xs do kit de referencia'
    use: "Fio de elevacao. USE quando a peca precisa apenas se separar do que esta atras sem parecer flutuar: barra fixa, cabecalho de tabela, divisor com peso. NAO USE em cartao - cartao e elevation/raised."
  elevation/subtle:
    css: '--nph-elevation-subtle'
    camadas: ['0 1px 2px 0 shadow/color-light']
    equivale_a: 'shadow-xs do kit de referencia'
    use: "Elevacao sutil. USE em controle que sobe de leve do fundo: botao, campo, chip. E o nivel que o kit aplica no botao. NAO USE em camada flutuante."
  elevation/raised:
    css: '--nph-elevation-raised'
    camadas: ['0 1px 2px -1px shadow/color', '0 1px 3px 0 shadow/color']
    equivale_a: 'shadow-sm do kit de referencia'
    use: "Cartao e painel que sobem do fundo da pagina - conteudo permanente. NAO USE em camada flutuante."
  elevation/dropdown:
    css: '--nph-elevation-dropdown'
    camadas: ['0 2px 4px -2px shadow/color', '0 4px 6px -1px shadow/color']
    equivale_a: 'shadow-md do kit de referencia'
    use: "Camada flutuante presa a um gatilho, que abre e fecha e NAO bloqueia a pagina: popover, menu suspenso, tooltip, select aberto."
  elevation/modal:
    css: '--nph-elevation-modal'
    camadas: ['0 4px 6px -4px shadow/color', '0 10px 15px -3px shadow/color']
    equivale_a: 'shadow-lg do kit de referencia'
    use: "Camada que BLOQUEIA a pagina: dialogo e painel lateral. Sempre acompanhada de overlay/scrim. Sem veu, nao e modal."
  elevation/drawer:
    css: '--nph-elevation-drawer'
    camadas: ['0 8px 10px -6px shadow/color', '0 20px 25px -5px shadow/color']
    equivale_a: 'shadow-xl do kit de referencia'
    use: "Painel grande que entra pela borda da tela: gaveta, folha lateral, painel de comando. Acima de modal em alcance, nao em bloqueio. NAO USE em dialogo comum."
  focus-ring/default:
    css: '--nph-focus-ring-default'
    camadas: ['0 0 0 3px focus/ring']
    use: "O anel de foco de teclado. USE em TODO elemento operavel que recebe foco: botao, campo, select, checkbox, link, aba, item de menu. A cor vem da marca ativa. NUNCA remova o anel. NAO USE dentro da barra lateral - la e focus-ring/sidebar."
  focus-ring/error:
    css: '--nph-focus-ring-error'
    camadas: ['0 0 0 3px focus/ring-error']
    use: "O anel de foco em campo que falhou a validacao. USE junto com mensagem de texto e icone - o anel NUNCA e o unico sinal do erro."
  focus-ring/sidebar:
    css: '--nph-focus-ring-sidebar'
    camadas: ['0 0 0 3px sidebar/ring']
    use: "O anel de foco dentro da barra lateral, onde o fundo e outro. USE em item de navegacao, botao de recolher e busca da barra."
  elevation/spotlight:
    css: '--nph-elevation-spotlight'
    camadas: ['0 25px 50px -12px shadow/color-strong']
    equivale_a: 'shadow-2xl do kit de referencia'
    use: "Nivel maximo, para a peca que toma a tela inteira: paleta de comando, busca em foco total. USE no maximo uma por tela. NAO empilhe com outro nivel."

# ---------------------------------------------------------------
# ALFA - escala de 19 degraus em preto e em branco, completa e
# igual a do kit de referencia. TODA transparencia do sistema sai
# daqui. A escala e COMPLETA de proposito: primitivo tem escopo
# vazio, nao aparece em seletor nenhum, e cortar degrau so criaria
# uma decisao por ocorrencia ao adaptar componente. Excecao
# registrada: o veu do modal usa 45% e 65%, fora da escala.
# ---------------------------------------------------------------
tokens_core_alpha:
  degraus: [0, 0.01, 3.33, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100]
  degraus_de_projeto: [0, 5, 10, 20, 40, 60, 80, 100]
  nota: 'Os degraus 0.01 e 3.33 nao sao valores de projeto: 0.01 e tecnica do Figma para tornar area clicavel, 3.33 e um trinta avos. Existem para receber componente importado do kit.'
  black: 'core/alpha/black-<degrau>'
  white: 'core/alpha/white-<degrau>'

# ---------------------------------------------------------------
# PRIMITIVOS DE SOMBRA - nao sao tokens de projeto e nenhum
# componente os consome. Existem para MONTAR os oito estilos de
# elevacao. Componente usa o estilo elevation/*, nunca estes.
# Documentados em 24-08-2026 a partir do que os estilos ligam de
# fato no Figma - nao e proposta, e leitura do arquivo.
# ---------------------------------------------------------------
tokens_core_sombra:
  regra: 'NUNCA consuma um destes num componente. Eles so aparecem dentro de um estilo elevation/*. Se voce precisa de uma sombra, escolha o estilo; se nenhum serve, pare e pergunte - nao monte uma sombra nova a mao.'
  spread_e_negativo: 'Todo shadow-spread e zero ou negativo. Spread negativo encolhe a sombra em relacao a caixa, e o que impede a mancha de escapar pelas laterais em sombra de raio grande.'

  shadow-y:
    '100': { valor: 1,  css: '--nph-core-shadow-y-100',  usado_em: [elevation/raised, elevation/hairline, elevation/subtle] }
    '200': { valor: 2,  css: '--nph-core-shadow-y-200',  usado_em: [elevation/dropdown] }
    '300': { valor: 4,  css: '--nph-core-shadow-y-300',  usado_em: [elevation/dropdown, elevation/modal] }
    '350': { valor: 8,  css: '--nph-core-shadow-y-350',  usado_em: [elevation/drawer] }
    '400': { valor: 10, css: '--nph-core-shadow-y-400',  usado_em: [elevation/modal] }
    '500': { valor: 20, css: '--nph-core-shadow-y-500',  usado_em: [elevation/drawer] }
    '600': { valor: 25, css: '--nph-core-shadow-y-600',  usado_em: [elevation/spotlight] }

  shadow-blur:
    '0':   { valor: 0,  css: '--nph-core-shadow-blur-0',   usado_em: [elevation/hairline] }
    '100': { valor: 2,  css: '--nph-core-shadow-blur-100', usado_em: [elevation/raised, elevation/subtle] }
    '200': { valor: 3,  css: '--nph-core-shadow-blur-200', usado_em: [elevation/raised] }
    '300': { valor: 4,  css: '--nph-core-shadow-blur-300', usado_em: [elevation/dropdown] }
    '400': { valor: 6,  css: '--nph-core-shadow-blur-400', usado_em: [elevation/dropdown, elevation/modal] }
    '450': { valor: 10, css: '--nph-core-shadow-blur-450', usado_em: [elevation/drawer] }
    '500': { valor: 15, css: '--nph-core-shadow-blur-500', usado_em: [elevation/modal] }
    '600': { valor: 25, css: '--nph-core-shadow-blur-600', usado_em: [elevation/drawer] }
    '700': { valor: 50, css: '--nph-core-shadow-blur-700', usado_em: [elevation/spotlight] }

  shadow-spread:
    '0':   { valor: 0,   css: '--nph-core-shadow-spread-0',   usado_em: [elevation/raised, elevation/hairline, elevation/subtle] }
    '100': { valor: -1,  css: '--nph-core-shadow-spread-100', usado_em: [elevation/raised, elevation/dropdown] }
    '200': { valor: -2,  css: '--nph-core-shadow-spread-200', usado_em: [elevation/dropdown] }
    '300': { valor: -3,  css: '--nph-core-shadow-spread-300', usado_em: [elevation/modal] }
    '400': { valor: -4,  css: '--nph-core-shadow-spread-400', usado_em: [elevation/modal] }
    '500': { valor: -5,  css: '--nph-core-shadow-spread-500', usado_em: [elevation/drawer] }
    '600': { valor: -6,  css: '--nph-core-shadow-spread-600', usado_em: [elevation/drawer] }
    '700': { valor: -12, css: '--nph-core-shadow-spread-700', usado_em: [elevation/spotlight] }

  mapa_dos_estilos:
    nota: 'Cada linha e uma camada de sombra, na ordem y / blur / spread / cor. Cinco estilos tem duas camadas; tres tem uma.'
    elevation/none:      'sem efeito'
    elevation/hairline:  ['1 / 0 / 0 / shadow/color-light']
    elevation/subtle:    ['1 / 2 / 0 / shadow/color-light']
    elevation/raised:    ['1 / 2 / -1 / shadow/color', '1 / 3 / 0 / shadow/color']
    elevation/dropdown:  ['2 / 4 / -2 / shadow/color', '4 / 6 / -1 / shadow/color']
    elevation/modal:     ['4 / 6 / -4 / shadow/color', '10 / 15 / -3 / shadow/color']
    elevation/drawer:    ['8 / 10 / -6 / shadow/color', '20 / 25 / -5 / shadow/color']
    elevation/spotlight: ['25 / 50 / -12 / shadow/color-strong']

# ---------------------------------------------------------------
# PRIMITIVOS DE VEU, FOCO E LAYOUT - cada um tem exatamente um
# consumidor semantico. Componente consome o semantico.
# ---------------------------------------------------------------
tokens_core_veu:
  regra: 'NUNCA consuma direto. Use overlay/scrim, que troca sozinho entre os modos.'
  core/scrim/light: { valor: 'rgba(0,0,0,0.45)', css: '--nph-core-scrim-light', alias_de: 'overlay/scrim no modo claro' }
  core/scrim/dark:  { valor: 'rgba(0,0,0,0.65)', css: '--nph-core-scrim-dark',  alias_de: 'overlay/scrim no modo escuro' }

tokens_core_foco:
  regra: 'NUNCA consuma direto. O anel de foco vem dos estilos focus-ring/*, que ja ligam a largura e a cor.'
  core/focus-width/default: { valor: 3, css: '--nph-core-focus-width-default', alias_de: 'focus/ring-width' }

tokens_core_icon:
  regra: 'NUNCA consuma direto. Use icon/size-sm, -md e -lg. Lido do Figma em 24-08-2026, ao migrar os tokens para JSON.'
  core/icon-size/100: { valor: 16, css: '--nph-core-icon-size-100', alias_de: 'icon/size-sm' }
  core/icon-size/200: { valor: 20, css: '--nph-core-icon-size-200', alias_de: 'icon/size-md' }
  core/icon-size/300: { valor: 24, css: '--nph-core-icon-size-300', alias_de: 'icon/size-lg' }

tokens_core_control:
  regra: 'NUNCA consuma direto. Use control/height-compact, -default e -large. Lido do Figma em 24-08-2026, ao migrar os tokens para JSON.'
  core/control-height/compact: { valor: 28, css: '--nph-core-control-height-compact', alias_de: 'control/height-compact' }
  core/control-height/default: { valor: 36, css: '--nph-core-control-height-default', alias_de: 'control/height-default' }
  core/control-height/large:   { valor: 44, css: '--nph-core-control-height-large',   alias_de: 'control/height-large' }

tokens_core_layout:
  regra: 'NUNCA consuma direto. Use os layout/* semanticos.'
  core/layout-width/app:               { valor: 1440, css: '--nph-core-layout-width-app',               alias_de: 'layout/max-app' }
  core/layout-width/reading:           { valor: 720,  css: '--nph-core-layout-width-reading',           alias_de: 'layout/max-reading' }
  core/layout-width/sidebar-expanded:  { valor: 280,  css: '--nph-core-layout-width-sidebar-expanded',  alias_de: 'layout/sidebar-expanded' }
  core/layout-width/sidebar-collapsed: { valor: 64,   css: '--nph-core-layout-width-sidebar-collapsed', alias_de: 'layout/sidebar-collapsed' }
  core/layout-height/header:           { valor: 56,   css: '--nph-core-layout-height-header',           alias_de: 'layout/header-height' }

# ---------------------------------------------------------------
# PRIMITIVOS SEM CONSUMIDOR - existem no Figma e NENHUMA variavel
# semantica, estilo ou componente os usa. Estao aqui para o
# inventario ficar completo e verificavel, NAO porque tenham uso
# definido. Verificado por indice reverso em 24-08-2026.
# ---------------------------------------------------------------
tokens_core_sem_consumidor:
  estado: 'PENDENTE DE DECISAO - ficam com um papel definido ou saem do arquivo. Decisao da Indiane, ainda nao tomada.'
  regra: 'NAO consuma nenhum destes e NAO invente um uso para eles. Se precisar de um valor que so existe aqui, pare e pergunte.'
  nao_gerar_em_json: 'Enquanto estiverem nesta lista, NAO devem entrar no JSON de tokens: gerar CSS para um primitivo sem papel espalha divida.'

  radius:
    nota: 'Quatro degraus acima de core/radius/600, que e o ultimo com consumidor (radius/surface).'
    '700':  { valor: 16 }
    '800':  { valor: 22 }
    '900':  { valor: 24 }
    '1000': { valor: 26 }

  space_degraus_altos:
    nota: 'Quatro degraus acima de core/space/1100.'
    '1200': { valor: 96 }
    '1300': { valor: 112 }
    '1400': { valor: 128 }
    '1500': { valor: 144 }

  space_fora_de_escala:
    nota: 'Doze valores que NAO pertencem a escala de base 4 com meio-passo de 2. Nenhum tem consumidor e nenhum tem justificativa registrada. NAO os trate como escala.'
    valores: [3, 5, 5.5, 6, 7, 7.5, 8.5, 9, 9.5, 10, 14, 15.5]

tokens_alpha:
  shadow/color:
    css: '--nph-shadow-color'
    alias_claro: core/alpha/black-10
    alias_escuro: core/alpha/black-0
    claro: 'rgba(0,0,0,0.10)'
    escuro: 'rgba(0,0,0,0)'
    use: "A cor das sombras da faixa do meio - raised, dropdown, modal e drawer. NUNCA escolha a mao: use o estilo elevation/*. No escuro e transparente, porque la a elevacao vem da rampa surface."
  shadow/color-light:
    css: '--nph-shadow-color-light'
    alias_claro: core/alpha/black-5
    alias_escuro: core/alpha/black-0
    claro: 'rgba(0,0,0,0.05)'
    escuro: 'rgba(0,0,0,0)'
    use: "A cor das duas sombras mais leves - hairline e subtle. 5% e nao 10%: nesse alcance a sombra e um fio, e 10% a faria pesada. NUNCA escolha a mao."
  shadow/color-strong:
    css: '--nph-shadow-color-strong'
    alias_claro: core/alpha/black-25
    alias_escuro: core/alpha/black-0
    claro: 'rgba(0,0,0,0.25)'
    escuro: 'rgba(0,0,0,0)'
    use: "A cor do nivel maximo, spotlight. 25%: a peca que toma a tela inteira precisa se descolar de tudo. NUNCA escolha a mao."
  overlay/scrim:
    css: '--nph-overlay-scrim'
    alias_claro: core/scrim/light
    alias_escuro: core/scrim/dark
    claro: 'rgba(0,0,0,0.45)'
    escuro: 'rgba(0,0,0,0.65)'
    use: "Veu atras de dialogo e painel lateral. USE sempre que houver modal. Mais forte no escuro porque o fundo ja e escuro. Unico valor de alfa fora da escala de 8."
  overlay/on-media:
    css: '--nph-overlay-on-media'
    alias: core/alpha/black-40
    claro: 'rgba(0,0,0,0.40)'
    escuro: 'rgba(0,0,0,0.40)'
    use: "Veu escuro sobre imagem, para o texto por cima continuar legivel. USE em capa, cartao com foto de fundo e galeria. Igual nos dois modos: a legibilidade sobre a imagem nao depende do tema."
  focus/ring-width:
    css: '--nph-focus-ring-width'
    alias: core/focus-width/default
    valor: 3
    use: "A espessura de TODO anel de foco: 3px, igual nos dois modos. NUNCA escolha a mao: aplique um dos estilos focus-ring/*. NAO reduza para 1 ou 2 em peca pequena - o anel e o que torna o produto navegavel por teclado. A WCAG 2.2 pede no minimo 2px."
  state/disabled-opacity:
    css: '--nph-state-disabled-opacity'
    valor: 0.5
    use: "Opacidade do controle desabilitado, aplicada ao controle INTEIRO. A WCAG isenta elemento desabilitado do contraste minimo, mas desabilitado NUNCA e o unico sinal: o controle tambem para de responder e, quando houver motivo, ele e dito em texto."
  state/hover-opacity:
    css: '--nph-state-hover-opacity'
    valor: 0.95
    use: "Opacidade da superfície de hover de primary e destructive. Aplique somente à superfície; texto, ícone e foco permanecem em 100%."
    nao_use: "Secondary, outline, ghost, foco, disabled ou texto isolado."

# ---------------------------------------------------------------
# GRID E LAYOUT - 12 colunas em TODA quebra. O que muda com a tela
# e a margem, nunca a contagem. Os pontos de quebra sao valores de
# BUILD: media query nao aceita variavel CSS. E o unico valor do
# Nephos que nao chega ao componente como custom property.
# ---------------------------------------------------------------
grid_regras:
  colunas: 12
  colunas_variam_por_quebra: false
  calha: 24
  calha_varia_por_quebra: false
  margem_varia_por_quebra: true
  pontos_de_quebra_sao_de_build: true
  calha_nao_e_espacamento: "layout/gutter alinha colunas. O espaco entre itens dentro de uma coluna vem de space/*."

tokens_breakpoint:
  md:  { valor: 768,  css: '--nph-breakpoint-md',  use: "Tablet deitado e janela lado a lado. Abaixo de 768 e a faixa base, sem ponto proprio. Valor de build." }
  lg:  { valor: 1024, css: '--nph-breakpoint-lg',  use: "Laptop. Onde a maior parte do trabalho acontece. Valor de build." }
  xl:  { valor: 1280, css: '--nph-breakpoint-xl',  use: "Desktop. Valor de build." }
  xxl: { valor: 1600, css: '--nph-breakpoint-xxl', use: "Tela ampla. Existe porque tela corporativa e grande e sem este ponto a tabela estica sem limite. Valor de build." }

tokens_layout:
  layout/columns:
    css: '--nph-layout-columns'
    valor: 12
    use: "12 colunas em TODA quebra. Se a composicao nao cabe, muda quantas colunas o bloco ocupa - nunca quantas colunas existem."
  layout/gutter:
    css: '--nph-layout-gutter'
    alias: core/space/600
    valor: 24
    use: "Calha entre colunas, igual em toda quebra. NAO USE como espaco entre itens de uma lista - isso e space/stack."
  layout/margin-compact:
    css: '--nph-layout-margin-compact'
    alias: core/space/400
    valor: 16
    use: "Margem lateral da pagina abaixo de 768px."
  layout/margin-default:
    css: '--nph-layout-margin-default'
    alias: core/space/600
    valor: 24
    use: "Margem lateral da pagina de 768 a 1279px. E a margem padrao."
  layout/margin-wide:
    css: '--nph-layout-margin-wide'
    alias: core/space/900
    valor: 48
    use: "Margem lateral da pagina a partir de 1280px. Da respiro em tela grande sem esticar o conteudo."
  layout/max-app:
    css: '--nph-layout-max-app'
    alias: core/layout-width/app
    valor: 1440
    use: "Largura maxima da area de aplicacao: painel, tabela, formulario - o que se OPERA. Acima disso o conteudo centraliza em vez de esticar."
  layout/max-reading:
    css: '--nph-layout-max-reading'
    alias: core/layout-width/reading
    valor: 720
    use: "Largura maxima de texto corrido - o que se LE de ponta a ponta. Entrega a medida de 60 a 80 caracteres exigida pela tipografia. NAO USE em tabela ou painel de dados."
  layout/sidebar-expanded:
    css: '--nph-layout-sidebar-expanded'
    alias: core/layout-width/sidebar-expanded
    valor: 280
    use: "Largura da barra lateral aberta. Vale para o shell da aplicacao e para a pagina de documentacao no Figma."
  layout/sidebar-collapsed:
    css: '--nph-layout-sidebar-collapsed'
    alias: core/layout-width/sidebar-collapsed
    valor: 64
    use: "Largura da barra lateral recolhida, so com icone."
  layout/header-height:
    css: '--nph-layout-header-height'
    alias: core/layout-height/header
    valor: 56
    use: "Altura da barra superior. Cabe um control/height-default (36) com respiro."

grades_por_quebra:
  base: { margem: 16, estilo_figma: grid/compact }
  md:   { margem: 24, estilo_figma: grid/default }
  lg:   { margem: 24, estilo_figma: grid/default }
  xl:   { margem: 48, estilo_figma: grid/wide }
  xxl:  { margem: 48, estilo_figma: grid/wide, conteudo_limitado_a: 1440 }

# ---------------------------------------------------------------
# MOVIMENTO - o componente escolhe o PAPEL, nunca a dupla duracao +
# curva. Escala curta por decisao: animacao longa e anti-referencia
# aprovada. Movimento REDUZIDO e obrigatorio em tudo que anima.
# ---------------------------------------------------------------
movimento_regras:
  pergunta_antes: "Esta animacao explica o que mudou? Se nao responde de onde a peca veio, para onde foi, ou o que virou o que, ela nao deve existir."
  saida_mais_rapida_que_entrada: true
  entrada: 250
  saida: 150
  linear_so_em: [progresso, girador]
  anime_apenas: [opacidade, transformacao]
  nao_anime: "Largura, altura e posicao de layout - trava em lista e tabela grandes."
  movimento_nunca_e_unico_sinal: true

movimento_reduzido:
  obrigatorio: true
  norma: WCAG 2.3.3
  deslize: opacidade
  escala: opacidade
  giro: "Para. Indicador estatico ou progresso determinado."
  duracao: core/duration/100
  nao_muda: "Cor de estado, anel de foco e qualquer indicacao que nao seja movimento. Reduzir movimento NAO e remover feedback."

tokens_core_duration:
  '100': { valor: 100, css: '--nph-core-duration-100', use: "Retorno imediato: hover, foco, cor de fundo." }
  '200': { valor: 150, css: '--nph-core-duration-200', use: "Troca de estado, e saida de camada." }
  '300': { valor: 250, css: '--nph-core-duration-300', use: "Camada que aparece, e expansao." }
  '400': { valor: 400, css: '--nph-core-duration-400', use: "Movimento grande. NUNCA em interacao repetida." }

tokens_core_easing:
  standard: { valor: 'cubic-bezier(0.4, 0, 0.2, 1)', css: '--nph-core-easing-standard', use: "Acelera e desacelera. O que muda no proprio lugar." }
  enter:    { valor: 'cubic-bezier(0, 0, 0.2, 1)',   css: '--nph-core-easing-enter',    use: "So desacelera. O que APARECE: chega rapido e freia ao assentar." }
  exit:     { valor: 'cubic-bezier(0.4, 0, 1, 1)',   css: '--nph-core-easing-exit',     use: "So acelera. O que SOME: parte devagar e vai embora rapido." }
  linear:   { valor: 'linear',                        css: '--nph-core-easing-linear',   use: "Velocidade constante. SO progresso e girador. NAO USE em transicao de interface." }

tokens_motion:
  regra_do_par: "Cada papel de movimento sao DOIS tokens: -duration e -easing. Andam juntos e NUNCA se misturam entre papeis - nao use a duracao de enter com a curva de exit. Forma alinhada ao Figma em 24-08-2026, por decisao da Indiane: cada token e uma variavel e uma custom property. Nenhum valor mudou."

  motion/hover-duration:
    css: '--nph-motion-hover-duration'
    alias: core/duration/100
    valor: 100
    use: "Hover, foco e mudanca de cor de fundo. Precisa parecer instantaneo — quem passa o mouse ja esta indo para a proxima coisa."
  motion/hover-easing:
    css: '--nph-motion-hover-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "A curva do papel hover. USE sempre junto de motion/hover-duration."

  motion/state-duration:
    css: '--nph-motion-state-duration'
    alias: core/duration/200
    valor: 150
    use: "Troca de estado que FICA: selecao, checkbox, alternancia, mudanca de aba."
  motion/state-easing:
    css: '--nph-motion-state-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "A curva do papel state. USE sempre junto de motion/state-duration."

  motion/enter-duration:
    css: '--nph-motion-enter-duration'
    alias: core/duration/300
    valor: 250
    use: "Camada que APARECE vinda de fora: popover, menu, tooltip, dialogo, painel lateral."
  motion/enter-easing:
    css: '--nph-motion-enter-easing'
    alias: core/easing/enter
    valor: 'cubic-bezier(0, 0, 0.2, 1)'
    use: "A curva do papel enter - desacelera ao chegar. USE sempre junto de motion/enter-duration."

  motion/exit-duration:
    css: '--nph-motion-exit-duration'
    alias: core/duration/200
    valor: 150
    use: "A mesma camada saindo. Mais rapida que a entrada de proposito: quem fechou ja decidiu."
  motion/exit-easing:
    css: '--nph-motion-exit-easing'
    alias: core/easing/exit
    valor: 'cubic-bezier(0.4, 0, 1, 1)'
    use: "A curva do papel exit - acelera ao sair. USE sempre junto de motion/exit-duration."

  motion/expand-duration:
    css: '--nph-motion-expand-duration'
    alias: core/duration/300
    valor: 250
    use: "Peca que cresce ou encolhe NO PROPRIO LUGAR: acordeao, painel expansivel, linha de tabela que abre."
  motion/expand-easing:
    css: '--nph-motion-expand-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "A curva do papel expand. USE sempre junto de motion/expand-duration."

# ---------------------------------------------------------------
# ICONES - acervo Font Awesome Pro. A pergunta que vem ANTES do
# token: este icone pode andar sozinho? Icone e atalho de
# reconhecimento; nao substitui rotulo. O icone HERDA a cor do
# texto - nao existe token de cor de icone.
# ---------------------------------------------------------------
icone_regras:
  acervo: Font Awesome Pro
  familia_padrao: 'Classic Regular'
  familia_ativo: 'Classic Solid'
  familia_padrao_regra: 'Classic e a familia padrao. Todo icone de conteudo, acao, estado, feedback e direcao e Classic - Regular no normal, Solid no item ativo dentro de um grupo.'
  duotone_navegacao: 'Duotone e PERMITIDO, e SOMENTE em navegacao estrutural: menu, sidebar, grupo de navegacao, atalho e indicador de localizacao. Serve para marcar o territorio da navegacao, junto de sidebar/*, largura e posicao.'
  duotone_proibido_fora_da_navegacao: 'FORA da navegacao estrutural, Duotone continua proibido. NAO USE em botao, campo, feedback, validacao, alerta, tabela ou acao destrutiva.'
  duotone_nao_mistura: 'NUNCA misture Duotone e Classic dentro do mesmo grupo de navegacao. O grupo inteiro e de uma familia so.'
  estilos_proibidos: [light, thin, sharp]
  historico_duotone: 'SUPERADA em 24-08-2026, por decisao da Indiane. A regra anterior dizia: "Classic. NAO existe Duotone no Nephos: o bars, unico icone de navegacao do nucleo, nao existe em Duotone no acervo, e uma regra cujo unico caso nao pode ser cumprido nao e regra." Preservada como registro; NAO e regra atual. Ver duotone_navegacao.'
  cor: "Herda do contexto via currentColor. NAO existe token de cor de icone."
  caixa: "Sempre quadrada. O desenho do Font Awesome nao e quadrado por natureza: e centralizado e escalado pela altura."
  espaco_ate_o_texto: space/inline-tight
  alinhamento: "Centraliza na caixa de linha do texto, nao na altura da letra."
  nunca_e_unico_sinal: true
  pode_andar_sozinho: "So simbolo universal e recorrente: fechar, buscar, menu, voltar, mais opcoes. Sempre com rotulo acessivel."
  nunca_anda_sozinho: "Acao com consequencia (excluir, aprovar, publicar, exportar) e qualquer acao especifica do dominio."

icone_acessibilidade:
  contraste: "3:1 para icone significativo - WCAG 1.4.11."
  sem_texto_visivel: "aria-label obrigatorio."
  com_texto_ao_lado: "aria-hidden no icone, senao o leitor de tela le duas vezes."
  alvo_de_toque: "O icone nao e o alvo. O alvo e o controle em volta, com control/height-large em tela de toque."

icone_licenca:
  token: "Variavel de ambiente do CI e gerenciador de senhas. NUNCA em arquivo versionado, documentacao ou portal."
  arquivos: "NAO commitar o pacote Pro. So a referencia no package.json."
  build: "O pacote e puxado no build. O produto compilado pode conter os icones - isso e uso licenciado."

icone_componente_figma:
  conjunto: 'icon'
  onde: 'Figma DS-IA-NEPHOS 5.0, pagina Icones, quadro "Componentes — icon"'
  criado_em: '24-08-2026'
  variantes: 35
  icones_distintos: 34
  propriedade_nome: '34 valores, um por icone do nucleo.'
  propriedade_estilo: 'regular (padrao) e solid. Solid existe SOMENTE para star, unico icone com arte Solid no arquivo. As demais combinacoes com solid nao existem de proposito. NUNCA invente arte para preencher a matriz de variantes.'
  tamanho_nao_e_variante: 'O tamanho NAO e variante do componente. Vem dos tokens icon/size-sm (16), icon/size-md (20) e icon/size-lg (24). No codigo e uma custom property, nao uma variante. A caixa e sempre quadrada; o desenho e centralizado e escalado pela altura.'
  cor: 'O preenchimento ja esta ligado a variavel no componente. NAO pinte a mao.'
  duotone_futuro: 'estilo=duotone NAO foi criado. O Font Awesome Pro nao esta instalado no ambiente do Figma - so existem as familias Free, e Duotone so vem no Pro. Quando o Pro estiver disponivel, acrescente estilo=duotone APENAS aos icones aprovados de navegacao estrutural. Ver duotone_navegacao e duotone_nao_mistura.'
  curadoria: 'Concluida em 24-08-2026. Cinco categorias: Navegacao e menus (1), Direcao e revelacao (9), Acao (15), Estado e comunicacao (8), Conteudo e dados (2).'

tokens_icon:
  icon/size-sm:
    css: '--nph-icon-size-sm'
    alias: core/icon-size/100
    valor: 16
    use: "PADRAO. Dentro de controle, celula de tabela, campo, e ao lado de texto de 14px. Na duvida, e este."
  icon/size-md:
    css: '--nph-icon-size-md'
    alias: core/icon-size/200
    valor: 20
    use: "Item de menu, aba e acao de destaque, onde 16 fica pequeno ao lado do rotulo. NAO USE dentro de botao comum."
  icon/size-lg:
    css: '--nph-icon-size-lg'
    alias: core/icon-size/300
    valor: 24
    use: "Cabecalho de secao, estado vazio e icone que carrega significado sozinho. NAO USE em tela densa nem em lista."

icones_nucleo:
  navegacao_e_menus:
    familia: 'Classic Regular'
    icones: [bars]
  direcao_e_revelacao:
    familia: 'Classic Regular'
    icones: [chevron-down, chevron-up, chevron-right, chevron-left, arrow-left, arrow-right, eye, eye-slash, ellipsis]
    nota: 'ellipsis (horizontal) significa ITENS OMITIDOS - paginacao, trilha. Nao confundir com ellipsis-vertical, que significa MAIS ACOES NESTA LINHA e fica em acao.'
  acao:
    familia: 'Classic Regular'
    icones: [xmark, check, plus, minus, magnifying-glass, ellipsis-vertical, arrow-up-arrow-down, grip-vertical, pen-to-square, trash-can, arrow-up-from-bracket, download, gear, filter, filter-slash]
  estado_e_comunicacao:
    familia: 'Classic Regular'
    icones: [circle-info, triangle-exclamation, circle-xmark, circle-check, circle-question, star, circle-notch]
    variantes: {star: 'Regular marca nao favoritado; Solid marca favoritado. E a unica peca do nucleo com duas variantes.'}
    nota: 'Os cinco primeiros sao um para cada estado do sistema. Todo estado carrega icone alem da cor. circle-notch e o girador: anel com corte, feito para rotacao continua com core/easing/linear.'
  conteudo_e_dados:
    familia: 'Classic Regular'
    icones: [calendar-days, user]

icones_segunda_leva:
  pendente: false
  entrou_em: '2026-08-20'
  icones: [pen-to-square, trash-can, eye, eye-slash, arrow-up-from-bracket, download, star, gear, filter, filter-slash, circle-notch]

icones_terceira_leva:
  pendente: false
  entrou_em: '2026-08-20'
  icones: [minus, ellipsis, arrow-right]
  motivo: 'Cada um exigido por componente ja comprometido na lista v1: minus pelo nph-checkbox indeterminado e pelo decremento do nph-input numerico; ellipsis pelo nph-pagination; arrow-right como par do arrow-left, que ja estava no nucleo.'
  trocas: 'circle-notch entrou no lugar de spinner: o spinner classico gira em oito passos discretos e a fundacao de movimento fixou rotacao continua. filter-slash foi acrescentado para limpar filtro.'
  largura: 'eye, eye-slash e star tem 18 de largura natural, acima dos 16 da caixa. A caixa normaliza altura e alinhamento, nao largura.'

icones_nomenclatura:
  versao: 'Font Awesome 6'
  aviso: 'O FA5 usava outros nomes: times, search, info-circle, exclamation-triangle, ellipsis-v.'
  fora_da_lista: 'Se o componente precisa de um icone que nao esta na lista, e lacuna: pergunte antes de acrescentar.'

contrato_nph_icon:
  name: "Nome do icone no acervo, em kebab-case. So o que existe no Font Awesome."
  variant: "regular (padrao) ou solid."
  size: "sm, md ou lg. Sem valor livre."
  label: "Rotulo acessivel. Vazio marca o icone como decorativo e aplica aria-hidden."
  cor: "NAO e propriedade. Herda do contexto."

# ---------------------------------------------------------------
# COR DE GRAFICO - quatro familias. Todas sao alias de primitivos
# que ja existiam: nenhum primitivo novo. A pergunta que o dado faz
# decide a familia. Categorica para "qual", sequencial para
# "quanto", divergente para "quanto acima ou abaixo", apoio para a
# moldura. COR NUNCA IDENTIFICA SOZINHA: toda serie carrega rotulo
# direto, forma de marcador ou posicao ordenada.
# ---------------------------------------------------------------
chart_regras:
  maximo_categorias: 6
  excedente: 'Da setima categoria em diante, agrupe em "Outros" com chart/muted.'
  ordem: 'Fixa. chart/1 e sempre a primeira serie. Dois graficos com as mesmas categorias na mesma tela usam as mesmas cores.'
  segundo_canal: 'Obrigatorio. Ate 4 series, rotulo direto no dado. Em linha e dispersao, forma de marcador. Acima disso, posicao ordenada com a legenda encostada no dado.'
  estado: 'A serie NUNCA carrega estado. Uma barra vermelha nao significa ruim. Estado entra por chart/reference e por marcador com token de estado.'
  marca_ativa: 'A serie de grafico NAO segue a marca ativa. Um grafico que troca de cor junto com o tema deixa de ser comparavel entre verticais.'
  serie_por_vertical: 'Quando a serie E a vertical, use brand/*, com rotulo direto obrigatorio. As sete cores de marca ficam a 10,1 de distancia perceptual entre si: basta para confirmar, nao basta para identificar. NUNCA use brand/* como paleta categorica generica.'
  texto_do_grafico: 'Rotulo de eixo e legenda usam color/muted-foreground. Titulo usa color/foreground. Nao existe token de texto proprio de grafico.'
  verificacao: 'Cada par comparado sob visao comum, protanopia, deuteranopia e tritanopia. Pior par: 18,0 no claro e 14,2 no escuro. Contraste minimo contra o fundo: 3,52:1 no claro e 4,62:1 no escuro (WCAG 1.4.11 exige 3:1).'
  nao_coberto: 'Leitura em escala de cinza. A serie separa por matiz, nao por luminosidade.'

tokens_chart:
  chart/1:
    css: '--nph-chart-1'
    claro: core/sistemas/700
    escuro: core/sistemas/200
    use: "Primeira serie de um grafico categorico. Sempre a primeira: a ordem e fixa."
    nao_use: "Para significar estado. Fora de grafico."
  chart/2:
    css: '--nph-chart-2'
    claro: core/educacao/700
    escuro: core/educacao/300
    use: "Segunda serie de um grafico categorico."
    nao_use: "Como primeira serie, nem para significar estado."
  chart/3:
    css: '--nph-chart-3'
    claro: core/financeiro/400
    escuro: core/financeiro/200
    use: "Terceira serie de um grafico categorico."
    nao_use: "Para significar sucesso: e uma serie, nao um estado."
  chart/4:
    css: '--nph-chart-4'
    claro: core/igrejas/500
    escuro: core/igrejas/300
    use: "Quarta serie de um grafico categorico."
    nao_use: "Para significar erro ou perda."
  chart/5:
    css: '--nph-chart-5'
    claro: core/info/500
    escuro: core/info/500
    use: "Quinta serie de um grafico categorico. Unico token de serie com o mesmo valor nos dois modos."
    nao_use: "Para significar informacao: a matiz e vizinha de status/info, mas o papel e outro."
  chart/6:
    css: '--nph-chart-6'
    claro: core/help/500
    escuro: core/help/300
    use: "Sexta e ultima serie de um grafico categorico."
    nao_use: "Para significar ajuda. Como setima serie nao existe, agrupe o excedente em chart/muted."
  chart/1-soft:
    css: '--nph-chart-1-soft'
    claro: core/sistemas/200
    escuro: core/sistemas/800
    use: "Lavagem sob a primeira serie: area sob a curva, faixa de confianca, halo de selecao."
    nao_use: "Em banda empilhada nem em marca que carregue identidade: ali vai chart/1 cheio."
  chart/2-soft:
    css: '--nph-chart-2-soft'
    claro: core/educacao/200
    escuro: core/educacao/800
    use: "Lavagem sob a segunda serie."
    nao_use: "Em banda empilhada nem em marca que carregue identidade."
  chart/3-soft:
    css: '--nph-chart-3-soft'
    claro: core/financeiro/200
    escuro: core/financeiro/800
    use: "Lavagem sob a terceira serie."
    nao_use: "Em banda empilhada nem em marca que carregue identidade."
  chart/4-soft:
    css: '--nph-chart-4-soft'
    claro: core/igrejas/200
    escuro: core/igrejas/800
    use: "Lavagem sob a quarta serie."
    nao_use: "Em banda empilhada nem em marca que carregue identidade."
  chart/5-soft:
    css: '--nph-chart-5-soft'
    claro: core/info/200
    escuro: core/info/800
    use: "Lavagem sob a quinta serie."
    nao_use: "Em banda empilhada nem em marca que carregue identidade."
  chart/6-soft:
    css: '--nph-chart-6-soft'
    claro: core/help/200
    escuro: core/help/800
    use: "Lavagem sob a sexta serie."
    nao_use: "Em banda empilhada nem em marca que carregue identidade."
  chart/seq-1:
    css: '--nph-chart-seq-1'
    claro: core/sistemas/100
    escuro: core/sistemas/900
    use: "Degrau 1 de 5 da escala sequencial: o MENOR valor."
    nao_use: "Para categoria: sequencial expressa quantidade, nao tipo."
  chart/seq-2:
    css: '--nph-chart-seq-2'
    claro: core/sistemas/300
    escuro: core/sistemas/700
    use: "Degrau 2 de 5 da escala sequencial."
    nao_use: "Para categoria."
  chart/seq-3:
    css: '--nph-chart-seq-3'
    claro: core/sistemas/500
    escuro: core/sistemas/500
    use: "Degrau 3 de 5 da escala sequencial: o meio."
    nao_use: "Para categoria."
  chart/seq-4:
    css: '--nph-chart-seq-4'
    claro: core/sistemas/700
    escuro: core/sistemas/300
    use: "Degrau 4 de 5 da escala sequencial."
    nao_use: "Para categoria."
  chart/seq-5:
    css: '--nph-chart-seq-5'
    claro: core/sistemas/900
    escuro: core/sistemas/100
    use: "Degrau 5 de 5 da escala sequencial: o MAIOR valor."
    nao_use: "Para categoria."
  chart/div-1:
    css: '--nph-chart-div-1'
    claro: core/danger/700
    escuro: core/danger/300
    use: "Degrau 1 de 7 da escala divergente: extremo negativo."
    nao_use: "Para categoria. Em escala divergente vermelho-verde."
  chart/div-2:
    css: '--nph-chart-div-2'
    claro: core/danger/500
    escuro: core/danger/500
    use: "Degrau 2 de 7 da escala divergente: negativo forte."
    nao_use: "Para categoria."
  chart/div-3:
    css: '--nph-chart-div-3'
    claro: core/danger/200
    escuro: core/danger/700
    use: "Degrau 3 de 7 da escala divergente: negativo leve."
    nao_use: "Para categoria."
  chart/div-4:
    css: '--nph-chart-div-4'
    claro: core/neutral/100
    escuro: core/surface/600
    use: "Centro da escala divergente. Marca o zero real, a meta atingida, o sem desvio. Unica cor da escala que nao significa direcao."
    nao_use: "Centrado na media da amostra: o mesmo dado mudaria de sinal quando a amostra mudasse."
  chart/div-5:
    css: '--nph-chart-div-5'
    claro: core/sistemas/200
    escuro: core/sistemas/700
    use: "Degrau 5 de 7 da escala divergente: positivo leve."
    nao_use: "Para categoria."
  chart/div-6:
    css: '--nph-chart-div-6'
    claro: core/sistemas/500
    escuro: core/sistemas/500
    use: "Degrau 6 de 7 da escala divergente: positivo forte."
    nao_use: "Para categoria."
  chart/div-7:
    css: '--nph-chart-div-7'
    claro: core/sistemas/700
    escuro: core/sistemas/300
    use: "Degrau 7 de 7 da escala divergente: extremo positivo."
    nao_use: "Para categoria."
  chart/grid:
    css: '--nph-chart-grid'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Linha de grade. Mais leve que color/border de proposito: a grade orienta a leitura, nao delimita area."
    nao_use: "No eixo. O eixo e chart/axis e precisa cumprir 3:1."
  chart/axis:
    css: '--nph-chart-axis'
    claro: core/neutral/400
    escuro: core/surface/400
    use: "Linha de eixo e marcas de escala. Cumpre 3:1 contra o fundo nos dois modos, porque o eixo e conteudo grafico exigido para entender o dado."
    nao_use: "Em linha de grade: igualar as duas apaga a hierarquia do grafico."
  chart/reference:
    css: '--nph-chart-reference'
    claro: core/neutral/700
    escuro: core/neutral/200
    use: "Linha de meta, alvo, media ou limite. SEMPRE tracejada e SEMPRE rotulada. E por aqui que estado entra no grafico."
    nao_use: "Para uma serie de dado: referencia e comparacao, nao medida."
  chart/empty:
    css: '--nph-chart-empty'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Preenchimento de area sem dado e estado vazio do grafico."
    nao_use: "Para o valor zero: zero e dado e vai na cor da serie."
  chart/muted:
    css: '--nph-chart-muted'
    claro: core/neutral/500
    escuro: core/neutral/400
    use: "Serie atenuada quando outra esta em destaque, e o agrupamento Outros a partir da setima categoria."
    nao_use: "Para controle desabilitado: desabilitado e state/disabled-opacity no controle inteiro."
  chart/track:
    css: '--nph-chart-track'
    claro: core/neutral/200
    escuro: core/surface/600
    use: "Fundo da trilha em medidor, barra de progresso e grafico de bala: a parte ainda nao preenchida."
    nao_use: "Como area sem dado: ali vai chart/empty."

fundacoes_pendentes: []
---
# design.md — Nephos

> **Para o Moses.** Este arquivo é o contrato do sistema. O YAML acima dá os **valores**; o texto abaixo dá o **critério**. Você precisa dos dois.
>
> **Ordem de consulta:** 1) este arquivo · 2) a ficha do componente que você vai usar · 3) se a resposta não estiver em nenhum dos dois, **pergunte** — ver §8.

---

## 1. Regras rígidas

Imperativo absoluto. Não são preferências.

1. Todo componente é um Web Component com prefixo **estrito** `nph-`. A classe CSS correspondente é `.nph-<nome-do-componente>`.
2. **NUNCA** use React, Vue, Angular, Svelte ou qualquer framework de componente. **NUNCA** use Tailwind ou qualquer CSS utilitário. **NUNCA** instale shadcn/ui, Radix ou qualquer biblioteca de componentes — shadcn é referência visual, jamais dependência de código.
3. **NUNCA** escreva valor literal de cor, espaçamento, fonte ou raio no CSS de componente. Somente `var(--nph-*)`.
4. Componente consome **somente** `tokens_semantic`. **NUNCA** consuma `tokens_core` diretamente.
5. Cor **NUNCA** é o único indicador. Todo estado carrega ícone e texto além da cor.
6. O anel de foco (`focus/ring`) é obrigatório em todo elemento focável e **NUNCA** é removido.
7. Toda superfície que carrega texto respeita **4,5:1**; todo limite de controle respeita **3:1** (WCAG 2.1 AA).
8. **NUNCA** crie token, componente, ícone ou padrão novo para contornar uma lacuna. Ver §8.

---

## 2. Cor — critérios de escolha

Quando dois tokens parecem servir, é isto que decide.

| Dúvida | Regra |
|---|---|
| `muted` × `accent` | `muted` é permanente; `accent` é temporário. Se o estado some quando o mouse sai, é `accent`. |
| `destructive` × `status/error` | `destructive` é o que o **usuário vai fazer**. `status/error` é o que o **sistema já reportou**. Botão "Excluir" é `destructive`; a mensagem "CPF inválido" é `status/error`. |
| `border` × `input` | `border` é divisor e contorno. `input` é limite de controle de formulário — mais visível por exigência da WCAG 1.4.11. |
| `card` × `popover` | `card` é conteúdo fixo na página. `popover` é camada flutuante. |
| `brand/*` × `color/primary` | `brand/*` identifica a vertical quando as sete marcas precisam aparecer ao mesmo tempo. `color/primary` é a ação primária e vem da **marca ativa**, pela coleção `theme`. |
| Entre os cinco estados | `info` = você precisa saber · `warning` = pode dar errado (antes) · `error` = deu errado (depois) · `success` = deu certo (evento, não estado permanente) · `help` = deixa eu explicar |

---

## 2b. Tipografia — critérios de escolha

Todo texto usa um dos catorze papéis de `tokens_typography`. Quando dois parecem servir, é isto que decide.

| Dúvida | Regra |
|---|---|
| `body-md` × `label-md` | Os dois são 14/20. `body` é frase; `label` é etiqueta. Tem verbo e ponto final, é `body`. Nomeia um controle ou campo, é `label`. |
| `body-lg` × `body-md` | `body-lg` é para ler; `body-md` é para operar. Parágrafo de documentação é `lg`. Texto em formulário, tabela ou painel é `md`. |
| `body-sm` × `caption` | Os dois são 12px. `body-sm` acompanha um conteúdo; `caption` explica outro elemento — ajuda do campo, legenda, contador, data. |
| `caption` × `body-md` | Mensagem de erro que o usuário precisa ler para corrigir é `body-md`. `caption` é acessório. |
| `heading-sm` × `label-lg` | Os dois são 16/24. Muda o peso: `heading-sm` (600) abre uma seção; `label-lg` (500) nomeia um item. |
| `heading-md` × `heading-lg` | `heading-lg` é o título da tela, um por página. Seção dentro dela é `heading-md`. |
| `label-sm` × `caption` | Os dois são 12px com entreletra aberta. `label-sm` (500) é etiqueta; `caption` (400) é frase curta. |
| `code` × o resto | `code` é só o que se lê caractere a caractere. Número em coluna de tabela **não** é `code` — é `tnum` na Noto Sans. |

**Ênfase** dentro de um parágrafo é `<strong>` no HTML. Não existe papel de ênfase, e `label` não serve para destacar palavra em texto corrido.

**Texto grande na WCAG** é ≥ 24px, ou ≥ 18,66px em negrito. Só `heading-lg` e `heading-xl` se qualificam. `heading-md`, mesmo em peso 600, exige 4,5:1.

**Piso de 12px.** `body-sm` e `caption` são acessórios e nunca carregam informação essencial.

---

## 2c. Espaçamento — critérios de escolha

Espaço agrupa. A pergunta não é quanto fica bonito, e sim **o que estas duas coisas são uma para a outra**.

| Relação | Token |
|---|---|
| São a mesma unidade | `space/inline-tight` (horizontal) · `space/stack-tight` (vertical) |
| São irmãs independentes | `space/inline` (horizontal) · `space/stack` (vertical) |
| São assuntos diferentes | `space/section` |

| Dúvida | Regra |
|---|---|
| `inline-tight` × `stack-tight` | Mesmo valor (4), eixos diferentes. `inline` é horizontal, `stack` é vertical. |
| `inline-tight` × `inline` | Dentro de uma unidade é `tight`; entre unidades é `inline`. Ícone no botão é `tight`; botão ao lado de botão é `inline`. |
| `stack` × `section` | 16 é entre itens da mesma lista; 32 é entre assuntos. Se há título novo, é `section`. |
| `control-padding` × `container-padding` | Controle é o que se **opera** (botão, campo, select). Contêiner é o que **contém** (cartão, painel, popover). |
| `container-padding` × margem da página | Dentro do cartão é `container-padding`. A margem da página **não é token de espaço**: é `layout/margin-compact`, `-default` ou `-wide`, que mudam por ponto de quebra. |

**Padding não é gap.** Padding é o respiro dentro de uma caixa; gap é a distância entre caixas. O valor pode coincidir; a intenção não.

**Só um passo por vez.** Se 16 aperta, o próximo é 20, depois 24. Pular degrau é sintoma de problema de agrupamento — falta um cartão, uma divisória ou um título.

**Alvo de toque.** Em tela sensível ao toque o controle usa `control/height-large`. A WCAG 2.2 (2.5.8) exige 24×24px e recomenda 44×44px; `control/height-compact` reprova.

---

## 2d. Raio — critérios de escolha

A curva diz o que a peça é. A pergunta não é quanto arredondar.

| A peça… | Token |
|---|---|
| se **opera** | `radius/control` (6) — padrão do sistema |
| **contém** e flutua preso a um gatilho | `radius/container` (8) |
| **flutua grande** | `radius/overlay` (10) |
| **carrega conteúdo** sem flutuar | `radius/surface` (14) |
| é **marcador** | `radius/subtle` (2) ou `radius/full` |
| está **encostada** | `radius/none` (0) |
| está **aninhada** | `radius/inner` (4) |

| Dúvida | Regra |
|---|---|
| `control` × `container` | Botão dentro de cartão: botão é `control`, cartão é `container`. |
| `container` × `overlay` | Popover e tooltip são `container`. Diálogo, modal e painel lateral são `overlay`. |
| `subtle` × `inner` | `subtle` é marcador que não contém nada. `inner` é elemento aninhado com conteúdo. |
| `full` × `control` | `full` só em peça pequena cuja forma comunica marcador. Botão e campo nunca são pill. |

**Raio aninhado:** interno = externo − padding. Contêiner em 8 com padding 4 → interno 4. Com padding 8 → interno 0 (`radius/none`). Interno nunca igual ao externo.

**Raio é px, não rem.** É a única fundação assim. Em rem, o canto cresceria com a fonte do usuário e a peça mudaria de forma.

**Raio não varia por modo.** Forma não é tema.

---

## 2e. Elevação — critérios de escolha

| Dúvida | Regra |
|---|---|
| `raised` × `dropdown` | `raised` é conteúdo **permanente** na página. `dropdown` **abre e fecha**, preso a um gatilho. Se some ao clicar fora, é `dropdown`. |
| `dropdown` × `modal` | `dropdown` está ancorado e **não bloqueia** a página. `modal` **bloqueia** e vem com véu. |
| `none` × `raised` | Peça dentro de um cartão é `none`. Elevação não se soma. |
| tooltip × diálogo | Tooltip é `dropdown`, por menor que seja. Diálogo é `modal`, por menor que seja. O que decide é bloquear ou não. |

**Um nível por peça.** Não empilhar elevação dentro de elevação.

**Sombra não é estado.** Hover e foco se resolvem com cor e anel de foco, nunca subindo o nível.

**No escuro não há sombra.** A elevação vem da rampa `surface` e da borda — ver §3. As cores de sombra ficam transparentes sozinhas; o estilo de efeito é o mesmo nos dois modos.

**Modal exige `overlay/scrim`.** Sem véu, o conteúdo de trás continua parecendo disponível.

**Borda e sombra juntas, não.** No claro, o cartão usa uma ou outra.

---

## 2f. Grid e layout — critérios de escolha

**12 colunas em toda quebra.** Se a composição não cabe, muda quantas colunas o bloco ocupa — não quantas colunas existem.

| Dúvida | Regra |
|---|---|
| `layout/gutter` × `space/stack` | A calha alinha **colunas**. `space/stack` separa **itens** dentro de uma coluna. Coisas diferentes, mesmo com o valor igual. |
| `layout/max-app` × `layout/max-reading` | Vai ser **lido** de ponta a ponta? `max-reading` (720). Vai ser **operado**? `max-app` (1440). |
| Margem da página | Só `layout/margin-compact`, `-default` e `-wide`, que mudam por ponto de quebra. Não existe token de espaço para isso: `space/page-margin` foi removido em 20-08-2026 por duplicar o valor sem responder à quebra. |

**Margem cresce, calha não.** 16 · 24 · 48 conforme a tela; calha 24 sempre.

**Ponto de quebra é de build.** Media query não aceita variável CSS — os quatro valores entram na compilação. É o único valor do sistema que não chega ao componente como `var()`.

**O shell é do sistema.** Barra lateral 280 e 64, barra superior 56. Nenhum layout escolhe as suas.

---

## 2g. Movimento — critérios de escolha

**A pergunta vem antes do token:** esta animação explica o que mudou? Se não responde de onde a peça veio ou o que virou o quê, ela não deve existir.

| Dúvida | Regra |
|---|---|
| `hover` × `state` | `hover` some quando o ponteiro sai. `state` é mudança que **fica**. |
| `enter` × `expand` | `enter` vem **de fora** e flutua. `expand` cresce **no lugar**, empurrando o conteúdo abaixo. |
| `enter` × `exit` | Mesma camada, momentos opostos — e curvas opostas. Não use `enter` na saída. |
| `state` × `expand` | Mudou de aparência é `state`; mudou de tamanho é `expand`. |
| qualquer um × `linear` | `linear` não é papel. É a curva de progresso e girador. |

**Sair é mais rápido que entrar:** 150 contra 250. Na entrada o usuário precisa ver de onde a peça veio; na saída ele já decidiu.

**A curva declara a direção:** o que aparece freia, o que some acelera, o que muda no lugar faz os dois.

**Anime opacidade e transformação.** Largura, altura e posição de layout travam em lista e tabela grandes.

**Movimento reduzido é obrigatório.** Deslize e escala viram opacidade; giro para; duração cai para 100. Cor de estado e anel de foco **não** mudam — reduzir movimento não é remover feedback.

**Movimento nunca é o único sinal de um estado** — mesma lógica da regra 5.

---

## 2h. Ícones — critérios de escolha

**A pergunta vem antes do token: este ícone pode andar sozinho?**

| Situação | Regra |
|---|---|
| Pode andar sozinho | Só símbolo universal e recorrente — fechar, buscar, menu, voltar, mais opções. Sempre com rótulo acessível |
| Nunca anda sozinho | Ação com consequência (excluir, aprovar, publicar, exportar) e qualquer ação do domínio |
| Ao lado do texto | O ícone reforça, não repete |

| Dúvida | Regra |
|---|---|
| `size-sm` × `size-md` | Dentro de um controle ou célula é `sm`. Ao lado de rótulo em menu ou aba é `md`. |
| `size-md` × `size-lg` | `lg` só quando o ícone carrega significado sozinho. Em lista, nunca. |
| Regular × Solid | Dentro de um grupo Classic: Regular é o normal, Solid marca o item **atual**. |

**O ícone herda a cor do texto** via `currentColor`. Não existe token de cor de ícone.

**Ícone nunca é o único sinal de um estado** — mesma lógica da regra 5.

**Sem texto visível, `aria-label`.** Com texto ao lado, `aria-hidden` — senão o leitor de tela lê duas vezes.

---

## 2i. Cor de gráfico — critérios de escolha

**A pergunta que o dado faz decide a família.**

| A pergunta é… | Família | Tokens |
|---|---|---|
| "qual?" — tipos sem ordem entre si | Categórica | `chart/1` a `chart/6`, mais os `-soft` |
| "quanto?" — quantidade com uma direção | Sequencial | `chart/seq-1` a `chart/seq-5` |
| "quanto acima ou abaixo?" — desvio com centro | Divergente | `chart/div-1` a `chart/div-7` |
| é a moldura do gráfico | Apoio | `grid`, `axis`, `reference`, `empty`, `muted`, `track` |

| Dúvida | Regra |
|---|---|
| Uma série só | `chart/1`. **Nunca** `color/primary`: o gráfico trocaria de cor a cada marca e o painel deixaria de ser comparável entre verticais. |
| Sete ou mais categorias | Seis em `chart/1`–`chart/6`, o resto agrupado em "Outros" com `chart/muted`. Não existe `chart/7`. |
| A série é uma vertical | `brand/*`, com rótulo direto obrigatório. Não é a categórica. |
| Cheio × `-soft` | Cheio identifica; `-soft` acompanha. Banda empilhada é sempre cheio. |
| Categórica × sequencial | Sequencial impõe uma ordem. Se as categorias não têm ordem, usá-la inventa uma. |
| Destacar uma série | Mande as outras para `chart/muted`. Não invente um tom mais forte fora da escala. |

**Cor nunca identifica sozinha.** Até quatro séries, rótulo direto no dado; em linha e dispersão, forma de marcador; acima disso, posição ordenada com a legenda encostada no dado. É a regra 5 aplicada a gráfico.

**A série não carrega estado.** Uma barra vermelha não significa "ruim". Estado entra por `chart/reference` e por marcador com token de estado.

**Divergente é vermelho ↔ azul.** Nunca vermelho ↔ verde. E o centro cai no zero real, não no meio da amostra.

---

## 3. Modo escuro

Não é inversão. Três regras:

1. **Elevação clareia.** A escala `surface` é a rampa: barra lateral `950` → fundo `900` → cartão `800` → popover `700` → diálogo `600`. Sombra não é percebida sobre fundo escuro — **NUNCA** use sombra para simular elevação no escuro.
2. **Sem preto nem branco puro.** Fundo é `surface/900`, não `#000000`. Texto é `neutral/100`, não branco. Preto absoluto com texto branco causa halação.
3. **Borda clareia muito mais do que a simetria sugere.** `color/border` no claro é `neutral/200`; no escuro **não** é `neutral/700` (daria 2,04:1 e reprovaria) — é `surface/400`.

**Limitação conhecida:** `color/border` sobre `color/popover` dá 2,81:1 no escuro. Em camada flutuante, use `color/input` como borda, ou deixe a elevação separar.

---

## 4. Acessibilidade

| Critério | Mínimo | Onde se aplica |
|---|---|---|
| Contraste de texto | 4,5:1 | qualquer texto sobre qualquer superfície |
| Contraste de texto grande | 3:1 | ≥ 24px, ou ≥ 18,66px em negrito |
| Contraste de componente | 3:1 | borda de campo, ícone significativo, indicador de estado |
| Foco visível | obrigatório | todo elemento focável |
| Alternativa à cor | obrigatório | todo estado, sem exceção |

Casos de marca ja resolvidos, e a razao de existirem os tokens `-strong`. A correcao e sempre no fundo, nunca clareando o texto:

- Branco sobre `brand/educacao` (`#ffa92d`) da **1,92:1**, e sobre o 600 da **2,98:1** - os dois reprovam. O tom desce para o **700** (`#99651b`, 4,96:1). Use `brand/educacao-strong`; no modo Educacao da colecao `theme`, o primario ja e o 700 nos dois esquemas.
- Branco sobre `brand/sistemas` (`#3b82f6`) da 3,68:1 - so texto grande. Use `brand/sistemas-strong` (600, 5,37:1).
- Branco sobre `brand/comercial` (`#3e8391`) da 4,32:1 - so texto grande. Use `brand/comercial-strong` (600, 6,16:1).
- Branco sobre `brand/financeiro` (`#4d7549`) da 5,25:1 e sobre `brand/rh` (`#4b207f`) da 11,59:1 - passam em texto normal, sem variante.

Educacao e a unica vertical cujo primario **nao clareia** no modo escuro: usa o 700 nos dois esquemas, porque o 400 do ambar nao sustenta texto branco. Contra o fundo escuro da 3,81:1, acima dos 3:1 exigidos para o limite de um componente.

---

## 5. Anti-padrões

Nunca faça. Cada linha é um erro prevenido.

| # | Nunca |
|---|---|
| A1 | Consumir `tokens_core` direto em componente |
| A2 | Escrever hexadecimal, `rgb()` ou `hsl()` no CSS de componente |
| A3 | Dois botões `color/primary` no mesmo bloco de decisão |
| A4 | Fixar `color/primary` num valor proprio, ignorando a marca ativa |
| A5 | Usar `color/destructive` em erro de validação |
| A6 | Usar cor como único indicador de estado |
| A7 | Remover o anel de foco |
| A8 | Usar `color/muted-foreground` em texto essencial (está no mínimo da norma) |
| A9 | Simular elevação com sombra no modo escuro |
| A10 | Inverter tons mecanicamente entre claro e escuro |
| A11 | Usar `success` como selo permanente de "ativo" |
| A12 | Criar um tom novo "só desta vez" |
| A13 | Usar botão para navegação simples — navegação é link |
| A14 | Mais de dois pesos tipográficos na mesma região |
| A15 | Tratar referência visual (shadcn) como dependência de código |
| A16 | Escrever tamanho, peso ou altura de linha literal — só `var(--nph-text-*)` |
| A17 | Criar um degrau de tamanho fora dos oito de `core/size` |
| A18 | Usar `body-sm` ou `caption` em informação essencial |
| A19 | Tratar `heading-md` como texto grande e afrouxar o contraste para 3:1 |
| A20 | Trocar para a monoespaçada só para alinhar número em coluna |
| A21 | Usar `label` para dar ênfase dentro de um parágrafo |
| A22 | Mais de um `heading-lg` na mesma página |
| A23 | Usar variante da família (Condensed, Display, SemiCondensed) |
| A24 | Escrever `margin`, `padding` ou `gap` literal — só `var(--nph-space-*)` |
| A25 | Consumir `core/space/*` em componente — componente usa os 7 semânticos |
| A26 | Usar 6, 10, 14 ou 18px porque "ficou melhor" |
| A27 | Empurrar um elemento com margem para corrigir alinhamento |
| A28 | Usar o meio-passo de 2px fora de chip, ícone ou célula de tabela |
| A29 | Um componente definir sua própria altura de controle |
| A30 | Usar `control/height-compact` em tela sensível ao toque |
| A31 | Resolver com distância o que precisava de cartão, divisória ou título |
| A32 | Escrever `border-radius` literal — só `var(--nph-radius-*)` |
| A33 | Consumir `core/radius/*` em componente |
| A34 | Usar 3, 5 ou 10px de raio porque "ficou melhor" |
| A35 | Usar `radius/full` em botão comum, campo ou cartão |
| A36 | Dar o mesmo raio ao elemento de dentro e ao contêiner |
| A37 | Arredondar o que encosta na borda da tela, da tabela ou de outro elemento |
| A38 | Definir raio em rem |
| A39 | Variar o raio entre claro e escuro — forma não é tema |
| A40 | Escrever `box-shadow` literal — só `var(--nph-elevation-*)` |
| A41 | Escolher uma cor de `shadow/*` à mão em vez de usar o estilo de elevação |
| A42 | Simular elevação com sombra no modo escuro *(reforça o A9)* |
| A43 | Empilhar elevação dentro de elevação |
| A44 | Diálogo sem `overlay/scrim` |
| A45 | Subir o nível de elevação no hover ou no foco |
| A46 | Criar uma sombra fora dos oito níveis |
| A47 | Tingir a sombra com a cor da marca |
| A48 | Borda e sombra juntas no cartão em modo claro |
| A49 | Mudar a contagem de colunas entre pontos de quebra |
| A50 | Usar um valor de calha fora de `layout/gutter` |
| A51 | Deixar painel ou tabela esticar além de `layout/max-app` |
| A52 | Parágrafo de documentação sem `layout/max-reading` |
| A53 | Um layout definir sua própria largura de barra lateral ou altura de cabeçalho |
| A54 | Usar `layout/gutter` para separar itens de uma lista |
| A55 | Criar um ponto de quebra fora dos quatro |
| A56 | Aplicar o estilo de grade e depois posicionar tudo fora dela |
| A57 | Escrever duração ou curva literal — só `var(--nph-motion-*)` |
| A58 | Combinar duração e curva fora dos cinco papéis |
| A59 | Usar 180 ou 320ms porque "ficou melhor" |
| A60 | Dar à saída a mesma duração da entrada, ou mais |
| A61 | Usar `linear` em transição que não seja progresso ou girador |
| A62 | Transicionar largura, altura ou posição em lista e tabela grandes |
| A63 | Animar algo que não explica uma mudança |
| A64 | Componente que anima sem tratar movimento reduzido |
| A65 | Comunicar um estado só pela animação |
| A66 | Usar `core/duration/400` em interação repetida |
| A67 | Ícone sozinho em ação com consequência — excluir, aprovar, publicar, exportar |
| A68 | Usar tamanho de ícone fora de `icon/size-sm`, `-md` e `-lg` |
| A69 | Misturar Font Awesome com ícone de outra fonte ou desenhado à mão |
| A70 | Usar Light ou Thin |
| A70b | Usar Sharp, ou qualquer família fora de Classic e Duotone |
| A70c | Usar Duotone fora da navegação estrutural — em botão, campo, feedback, validação, alerta, tabela ou ação destrutiva |
| A70d | Misturar Duotone e Classic dentro do mesmo grupo de navegação |
| A71 | Pintar o ícone com cor que não seja a do contexto |
| A72 | Misturar Solid e Regular no mesmo grupo sem que um marque estado ativo |
| A73 | Ícone sem texto visível e sem `aria-label` |
| A74 | Ícone que só repete o rótulo ao lado |
| A75 | Comunicar um estado só pelo ícone |
| A76 | Commitar arquivos do pacote Font Awesome Pro no repositório |
| A77 | Passar de seis séries num gráfico categórico em vez de agrupar em "Outros" |
| A78 | Usar as sete `brand/*` como paleta categórica genérica |
| A79 | Escala divergente vermelho ↔ verde |
| A80 | Centrar a escala divergente na média da amostra em vez do zero real |
| A81 | Deixar a cor da série como único canal, sem rótulo, forma nem ordem |
| A82 | Amarrar a série de gráfico à marca ativa, ou usar `color/primary` como cor de série |
| A83 | Usar `chart/N-soft` em banda empilhada ou em qualquer marca que carregue identidade |
| A84 | Usar cor de estado para significar estado dentro de uma série |
| A85 | Usar `chart/empty` para o valor zero |
| A86 | Igualar `chart/grid` e `chart/axis`, apagando a hierarquia do gráfico |

---

## 6. Anti-referências

O que o Nephos **não** deve parecer.

| Não parecer | Por quê |
|---|---|
| Painel administrativo dos anos 2010 — cinza sobre cinza, borda em tudo | Hierarquia se faz com espaço, não com linha |
| Site institucional colorido — gradiente, cor de marca em toda superfície | Cor precisa significar algo, não decorar |
| Interface de consumo — animação longa, ilustração grande, tom informal | O usuário está trabalhando, muitas horas por dia |
| Tema escuro "gamer" — preto absoluto, acento neon, saturação alta | Cansa em jornada longa e reprova em contraste |

> **[Confirmado]** Anti-referências aprovadas por Indiane em 19-08-2026.

---

## 7. Nomenclatura

- **Token:** nome em inglês, descrição em português. `color/primary`, `status/error`.
- **CSS:** `--nph-` + o nome do token com `/` virando `-`. `color/primary` → `--nph-color-primary`.
- **Componente:** `nph-<nome-em-kebab-case>`. Classe: `.nph-<nome>`.
- **Variante de componente:** segue o vocabulário shadcn, que o time já fala.
- **Papel tipográfico:** `text/<grupo>-<tamanho>`, como `text/body-md`. No Figma é um **estilo de texto**, não uma variável — cor tem três camadas de variável, tipografia tem primitivo em `core` mais o estilo.

**Aviso ao agente:** os nomes seguem shadcn e nomeiam **posição**, não intenção. `primary` não diz para que serve. **A intenção está no campo `use` de cada token no YAML.** Neste sistema, ler só o nome não basta.

---

## 8. Procedimento para lacunas

Esta é a seção que impede invenção. Siga na ordem.

1. **Procure em `tokens_semantic`.** O campo `use` de cada token diz para que ele serve.
2. **Não achou?** Abra a ficha do componente mais próximo. A seção "Relações" dela diz o que combina.
3. **Ainda não achou?** **PARE.** Não escolha o token mais parecido. Não crie valor novo. Não adapte um componente.
4. **Devolva uma pergunta**, neste formato:

```
LACUNA — <o que eu precisava>
Contexto: <a tela, o fluxo, a ação>
O que existe hoje: <o token ou componente mais próximo, e por que não serve>
Decisão necessária: <a pergunta objetiva>
Quem decide: <UX / engenharia / produto>
```

5. **Marque a saída como incompleta.** Não entregue tela com lacuna preenchida por suposição sem declarar que foi suposição.

> Herdar ou perguntar. Nunca inventar.

---

## 9. Ponteiros

Antes de construir ou modificar um componente, **abra o arquivo de metadados dele**.

| Onde | O quê |
|---|---|
| `Template de ficha — peças do Nephos.md` | O gabarito de toda ficha: metade YAML com os valores, metade Markdown com o critério. Copie a partir dele; não invente estrutura |
| `fichas/<nome-do-componente>.md` | Função, variantes, estados, combinações inválidas, acessibilidade, tokens, relações, anti-padrões |
| `fichas/blocos/<nome>.md` | Composição, quando usar, quando não, em que layout aparece |
| Storybook | Estados e variantes renderizados |
| Lista de componentes — Nephos v1 | Escopo: os 75 componentes e as 6 ondas |

> **Decisão vigente — revisada e aprovada por Elvys em 28/08/2026.** A
> organização de diretórios está em
> [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) (P03). Até o
> primeiro componente, os caminhos acima permanecem ponteiros de documentação; o
> padrão de diretórios será aplicado quando a peça existir.

---

## 10. Pendências deste documento

| # | O quê | Quem decide |
|---|---|---|
| 1 | ~~Identidade~~ Resolvida em 19-08-2026: personalidade **institucional, humana e eficiente**; usuário primário: profissionais de desenvolvimento que constroem e mantêm interfaces corporativas do IATec, com Moses como consumidor técnico principal;  referências com função definida | Indiane |
| 2 | ~~Anti-referências (§6) — proposta~~ Resolvidas em 19-08-2026, por decisão de Indiane | Indiane |
| 3 | ~~Fundação de tipografia~~ Resolvida em 20-08-2026: 14 papéis, base 14px, Noto Sans + IBM Plex Mono | Indiane |
| 3b | ~~**Tipografia responsiva**~~ Resolvida em 20-08-2026: **a escala é fixa na interface** | Indiane |
| 3c | ~~**Itálico e sublinhado**~~ Resolvida em 20-08-2026: **são regra, não papel** | Indiane |
| 3d | ~~Fundação de espaçamento~~ Resolvida em 20-08-2026: base 4 com meio-passo de 2, 7 tokens semânticos de intenção e 3 alturas de controle | Indiane |
| 3e | ~~**Espaçamento responsivo e larguras máximas**~~ Resolvidas em 20-08-2026: **`space/*` é fixo**, a margem da página é `layout/margin-*`, e as larguras máximas são `layout/max-app` e `max-reading` | Indiane |
| 3f | ~~Fundação de raio~~ Resolvida em 20-08-2026: 8 degraus, padrão 6px em controle, forma total restrita a marcador | Indiane |
| 3g | ~~**Raio em canto parcial**~~ Resolvida em 20-08-2026: **é regra, não token** — ver `regras_raio_parcial` | Indiane |
| 3h | ~~Fundação de sombra e elevação~~ Resolvida em 20-08-2026: 8 níveis, duas camadas quando aplicável, sombra transparente no escuro, mais o véu do modal | Indiane |
| 3i | ~~**O modal não tem degrau na rampa do escuro**~~ Resolvida em 20-08-2026: **`color/dialog` em `surface/600`** | Indiane |
| 3j | ~~**Sombra interna**~~ Resolvida em 20-08-2026: **não entra** — campo afundado usa `color/muted` no fundo e `color/input` na borda | Indiane |
| 3k | ~~Fundação de grid e layout~~ Resolvida em 20-08-2026: 12 colunas, 4 pontos de quebra, duas larguras máximas e as medidas do shell | Indiane |
| 3l | **Comportamento do shell** — em que quebra a barra recolhe — é anatomia de layout e depende de tela real ou mock aprovado | Indiane |
| 3m | ~~Fundação de movimento~~ Resolvida em 20-08-2026: 4 durações, 4 curvas, 5 papéis e a regra de movimento reduzido. **As sete fundações estão fechadas** | Indiane |
| 3n | **Duração do laço** de girador e barra indeterminada fica acima da escala e não tem valor definido | Indiane |
| 3o | ~~**Ícones**~~ Resolvida em 20-08-2026: regras, tamanhos, contrato, acervo e o núcleo completo de **34 ícones**, em três levas | Indiane |
| 4 | ~~Cores de gráfico — não existem~~ Resolvida em 20-08-2026: quatro famílias, 30 tokens semânticos, verificados sob as três deficiências de visão | Indiane |
| 5 | ~~Alfa — transparências sem token~~ Resolvida em 20-08-2026: 19 primitivos de alfa em preto e branco, mais `overlay/scrim`, `overlay/on-media` e `state/disabled-opacity` | Indiane |
| 6 | ~~Qual arquivo é canônico: o CSS ou este YAML~~ Decidido em 24-08-2026: Figma é a fonte visual; este `design.md` é o contrato humano e agêntico; JSON será a fonte técnica versionada de valores auditados; CSS custom properties serão geradas do JSON. Ver `docs/decisoes-tecnicas.md` (P17). | Indiane — revisado e aprovado por Elvys em 28-08-2026 |
| 7 | ~~Caminho dos diretórios (§9)~~ Decidido em 24-08-2026: padrão registrado em `docs/decisoes-tecnicas.md` (P03), aplicado a partir do primeiro componente. | Indiane — revisado e aprovado por Elvys em 28-08-2026 |
| 8 | ~~Modo escuro foi calculado, nao visto~~ Resolvido em 18-08-2026: pagina `Cor` no Figma, claro e escuro lado a lado | Indiane |
| 9 | **Padrão de hachura** para gráfico impresso em preto e branco. A série categórica separa por matiz, não por luminosidade | Indiane |
