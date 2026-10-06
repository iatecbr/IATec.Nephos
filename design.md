---
sistema: Nephos
versao: 1.8
data: 2026-09-02
status: synced with Figma on 2026-08-25; working contract of the `v/5.0.0` branch
fonte_tecnica_dos_valores: >-
  Since 24-08-2026 the audited values live in `src/tokens/source/*.tokens.json`,
  and the CSS is generated from them in `src/tokens/generated/tokens.css`. This file
  remains the USAGE contract — what each token means, when to use it, when
  not to use it and why. If a value here diverges from the JSON, the JSON and Figma prevail.
  See `docs/tokens.md` and decision P20 in `docs/decisoes-tecnicas.md`.
consumo_de_tema: >-
  Brand and color scheme are independent dimensions, exposed as two attributes
  on the root element: `data-nph-brand` (`sistemas`, `gerencial`, `educacao`, `comercial`,
  `financeiro`, `igrejas`, `rh`) and `data-nph-color-scheme` (`light`, `dark`).
escopo_migrado_para_json: >-
  The core, theme (in the seven modes) and semantic (in the two modes) layers, in
  src/tokens/source/*.tokens.json. Each layer declares its own count in
  contagemEsperada, and npm run build:tokens shows the totals and fails when a
  layer diverges; this contract does not repeat the numbers. The P46 primitives
  were left out by a recorded decision. The other primitives remain deferred —
  deferred does not mean without a consumer. The focus rings came in as
  focus-ring/invalid, default and sidebar: see the note in the tokens_elevation block. What
  came in on each date is in docs/tokens.md.
escopo_verificado: [cor, tipografia, espacamento, raio, elevacao, grid, movimento, cor_de_grafico]
escopo_a_validar: []
camadas: [core, theme, semantic]
prefixo_componente: nph-
prefixo_css: --nph-
consumidor: Moses
leitores: [Moses, desenvolvimento]
nao_use_como: visual introduction or portal content; for that, see `Fundações` (Foundations), Figma and SITE Nephos
saida_alvo: semantic HTML + CSS custom properties, consuming the nph- Web Components in Lit directly. No PrimeNG. (decided by Indiane on 18-08-2026)
regra_de_leitura: >-
  Before building or changing any UI, read "GOVERNANCA.md" and this file.
  Before using a component, open its spec.
  When facing a gap: ask. Never invent.
modos: [claro, escuro]

# ---------------------------------------------------------------
# LAYER 1 - PRIMITIVES. No component consumes from here.
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
# LAYER 2 - SEMANTIC. This is what components and agents consume.
# ---------------------------------------------------------------
tokens_semantic:
  color/background:
    css: '--nph-color-background'
    claro: core/base/white
    escuro: core/surface/900
    use: "Page background and background of any area that is not a card."
    nao_use: "On a card, popover or sidebar."
  color/foreground:
    css: '--nph-color-foreground'
    claro: core/base/black
    escuro: core/neutral/100
    use: "Default text on the base background."
    nao_use: "On color/primary or on a state color."
  color/primary:
    css: '--nph-color-primary'
    claro: theme/brand-600
    escuro: theme/brand-400
    use: "Background of the most important action on the screen. Comes from the active brand: Nephos is multi-brand and primary changes when the brand changes. Also the background of the solid nph-badge, which labels a state or category by its meaning."
    nao_use: "Two primaries in the same decision block. Pinning a value of its own, ignoring the active brand."
  color/primary-foreground:
    css: '--nph-color-primary-foreground'
    claro: theme/brand-on-600
    escuro: theme/brand-on-400
    use: "Text and icon on color/primary."
    nao_use: "On any other background."
  color/secondary:
    css: '--nph-color-secondary'
    claro: core/surface/200
    escuro: core/surface/600
    use: "Alternative action that accompanies the primary one. Also the background of the solid nph-badge, which labels a state or category by its meaning."
    nao_use: "Destructive action."
  color/secondary-foreground:
    css: '--nph-color-secondary-foreground'
    claro: core/surface/900
    escuro: core/surface/100
    use: "Text on color/secondary. On the secondary nph-button and nph-badge, also text, icon and border on color/secondary-light and color/muted, and the text of the ghost secondary nph-button, which has no background."
  color/secondary-hover:
    css: '--nph-color-secondary-hover'
    claro: core/surface/300
    escuro: core/surface/700
    use: "Hover surface of a secondary action. Keeps the change visible in both modes."
    nao_use: "Hover of primary, destructive, outline or ghost."
  color/accent:
    css: '--nph-color-accent'
    claro: core/neutral/100
    escuro: core/surface/600
    use: "Temporary highlight: hover, focused item, active row."
    nao_use: "Permanent block background."
  color/accent-foreground:
    css: '--nph-color-accent-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Text on color/accent."
  color/muted:
    css: '--nph-color-muted'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Permanent background without emphasis: table header, disabled area. Also the background of the outline secondary nph-button and the hover of the ghost secondary."
    nao_use: "Hover, except that of the ghost secondary nph-button."
  color/muted-foreground:
    css: '--nph-color-muted-foreground'
    claro: core/neutral/600
    escuro: core/surface/200
    use: "Caption, helper text, placeholder, metadata. Also the icon of the info trigger of the nph-label, as the accepted Figma draws it (decision of 06-10-2026)."
    nao_use: "Text needed to complete the task."
  color/destructive:
    css: '--nph-color-destructive'
    claro: core/danger/600
    escuro: core/danger/400
    use: "Action that deletes, revokes or cannot be undone. Also the background of the solid nph-badge, which labels a state or category by its meaning."
    nao_use: "Validation error."
  color/destructive-foreground:
    css: '--nph-color-destructive-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Text and icon on color/destructive."
    nao_use: "On another solid background. The dedicated alias exists because color/primary-foreground does not pass in every mode and brand."
  color/border:
    css: '--nph-color-border'
    claro: core/neutral/200
    escuro: core/surface/400
    use: "Divider, card outline, table row."
    nao_use: "Form field border."
  color/input:
    css: '--nph-color-input'
    claro: core/neutral/400
    escuro: core/surface/300
    use: "Field border: input, select, textarea, checkbox."
  color/card:
    css: '--nph-color-card'
    claro: core/base/white
    escuro: core/surface/800
    use: "Card background."
    nao_use: "Shadow to simulate elevation in dark mode."
  color/card-foreground:
    css: '--nph-color-card-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Text on color/card."
  color/popover:
    css: '--nph-color-popover'
    claro: core/base/white
    escuro: core/surface/700
    use: "Floating layer attached to a trigger, which does NOT block the page: popover, dropdown, context menu."
    nao_use: "Fixed page content. Dialog, modal or side panel - those are color/dialog."
  color/popover-foreground:
    css: '--nph-color-popover-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Text on color/popover."
  color/dialog:
    css: '--nph-color-dialog'
    claro: core/base/white
    escuro: core/surface/600
    use: "Background of dialog, modal and side panel - the layer that BLOCKS the page. In dark it rises to surface/600, one step above the popover: it is the highest level of the ramp, and in dark the ramp IS the elevation. USE always with overlay/scrim."
    nao_use: "Popover or dropdown menu - those are color/popover. Tooltip is color/tooltip."
  color/dialog-foreground:
    css: '--nph-color-dialog-foreground'
    claro: core/neutral/950
    escuro: core/neutral/100
    use: "Text and icon on color/dialog. 7,68:1 in dark."
  color/primary-surface:
    css: '--nph-color-primary-surface'
    claro: theme/brand-50
    escuro: theme/brand-900
    use: "Background of the main action in light emphasis: nph-button with light or outline emphasis. Also the light nph-badge and the hover of the ghost nph-button. Follows the active brand. USE always with color/primary-on-surface. DO NOT USE as page, card or area background — for that there are color/background, color/card and color/muted."
  color/primary-on-surface:
    css: '--nph-color-primary-on-surface'
    claro: theme/brand-600
    escuro: theme/brand-100
    use: "Text, icon and border on color/primary-surface. Vivid brand color in light mode, light tone in dark mode. USE only on it, except for the exception. Exception: text of the ghost nph-button, which has no background. DO NOT USE on solid color/primary — there color/primary-foreground applies."
  color/primary-surface-hover:
    css: '--nph-color-primary-surface-hover'
    claro: theme/brand-100
    escuro: theme/brand-800
    use: "Surface of the main action in light emphasis, in the hover-active state. USE only in that state, with color/primary-on-surface on top. DO NOT USE as resting background — there color/primary-surface applies."
  color/primary-on-surface-hover:
    css: '--nph-color-primary-on-surface-hover'
    claro: theme/brand-700
    escuro: theme/brand-100
    use: "Text, icon and border on color/primary-surface-hover. USE only in the hover-active state of light emphasis. DO NOT USE at rest — there color/primary-on-surface applies."
  color/primary-border:
    css: '--nph-color-primary-border'
    claro: theme/brand-600
    escuro: theme/brand-300
  color/primary-hover:
    css: '--nph-color-primary-hover'
    claro: theme/brand-700
    escuro: theme/brand-400-hover
    use: "Background of color/primary in the hover-active state of the solid nph-button, with color/primary-foreground on top (decision of 02-10-2026, supersedes B4)."
  color/destructive-surface:
    css: '--nph-color-destructive-surface'
    claro: core/danger/50
    escuro: core/danger/900
    use: "Background of the destructive action in light emphasis: nph-button with light or outline emphasis. Also the light nph-badge and the hover of the ghost nph-button. USE always with color/destructive-on-surface. DO NOT USE in a validation error message — there status/error-surface applies."
  color/destructive-on-surface:
    css: '--nph-color-destructive-on-surface'
    claro: core/danger/600
    escuro: core/danger/100
    use: "Text, icon and border on color/destructive-surface. USE only on it, except for the exception. Exception: text of the ghost nph-button, which has no background. DO NOT USE on solid color/destructive — there color/destructive-foreground applies."
  color/destructive-surface-hover:
    css: '--nph-color-destructive-surface-hover'
    claro: core/danger/100
    escuro: core/danger/800
    use: "Surface of the destructive action in light emphasis, in the hover-active state. USE only in that state, with color/destructive-on-surface on top. DO NOT USE as resting background — there color/destructive-surface applies."
  color/destructive-on-surface-hover:
    css: '--nph-color-destructive-on-surface-hover'
    claro: core/danger/700
    escuro: core/danger/100
    use: "Text, icon and border on color/destructive-surface-hover. USE only in the hover-active state of light emphasis. DO NOT USE at rest — there color/destructive-on-surface applies."
  color/destructive-hover:
    css: '--nph-color-destructive-hover'
    claro: core/danger/700
    escuro: core/danger/300
    use: "Background of color/destructive in the hover-active state of the solid nph-button, with color/destructive-foreground on top (decision of 02-10-2026, supersedes B4)."
  color/secondary-surface-hover:
    css: '--nph-color-secondary-surface-hover'
    claro: core/surface/200
    escuro: core/surface/600
    use: "Surface of the alternative action in light emphasis, in the hover-active state. USE only in that state, with color/secondary-foreground on top. DO NOT USE on the solid secondary button — there color/secondary-hover applies."
  color/secondary-light:
    css: '--nph-color-secondary-light'
    claro: core/surface/50
    escuro: core/surface/700
    use: "Background of the alternative action in light emphasis: secondary light nph-button and nph-badge, with color/secondary-foreground. DO NOT USE in outline — there it is color/muted."
  color/secondary-light-hover:
    css: '--nph-color-secondary-light-hover'
    claro: core/surface/100
    escuro: core/surface/600
    use: "Hover-active of the secondary light nph-button, with color/secondary-foreground on top. DO NOT USE in outline — there it is color/secondary-surface-hover."
  color/input-hover:
    css: '--nph-color-input-hover'
    claro: core/neutral/500
    escuro: core/surface/200
  color/accent-subtle:
    css: '--nph-color-accent-subtle'
    claro: core/neutral/50
    escuro: core/surface/700
  color/tooltip:
    css: '--nph-color-tooltip'
    claro: core/neutral/600
    escuro: core/neutral/700
    use: "Background of the help balloon (nph-tooltip): dark surface, attached to a trigger, which does not block the page. USE only on nph-tooltip. DO NOT USE on popover, menu or dialog — those are color/popover and color/dialog."
  color/tooltip-foreground:
    css: '--nph-color-tooltip-foreground'
    claro: core/base/white
    escuro: core/neutral/100
    use: "Text on color/tooltip. USE only inside nph-tooltip. DO NOT USE on another background."
  focus/ring:
    css: '--nph-focus-ring'
    claro: theme/brand-700
    escuro: theme/brand-400
    use: "Keyboard focus ring, on every focusable element, except where the focus is border and halo (rule 6)."
    nao_use: "Removing it."
  focus/ring-error:
    css: '--nph-focus-ring-error'
    claro: core/danger/200
    escuro: core/danger/400
    use: "Focus ring on a field that failed validation."
    nao_use: "Alone, without a text message."
  focus/border:
    css: '--nph-focus-border'
    claro: theme/brand-focus
    escuro: theme/brand-300
    use: "1 px focus border of the control that receives focus with border and halo (rule 6), as on the secondary of the nph-button and on the info trigger of the nph-label. It is the one that meets the 3:1 minimum; the halo is decoration."
  focus/halo:
    css: '--nph-focus-halo'
    claro: theme/brand-200
    escuro: theme/brand-200
    use: "Focus HALO: the light band outside the border. It is decoration and does not need to meet 3:1 — focus/border meets it. Points to the brand 200 tone in both modes. Created on 03-09-2026 so the component stops pointing directly at the brand layer."
  focus/halo-info:
    css: '--nph-focus-halo-info'
    claro: core/info/200
    escuro: core/info/200
    use: "Focus HALO when the control is of the info type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark. Created on 03-09-2026 by decision of Indiane."
  focus/halo-warn:
    css: '--nph-focus-halo-warn'
    claro: core/warn/200
    escuro: core/warn/200
    use: "Focus HALO when the control is of the warn type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark. Created on 03-09-2026 by decision of Indiane."
  focus/halo-help:
    css: '--nph-focus-halo-help'
    claro: core/help/200
    escuro: core/help/200
    use: "Focus HALO when the control is of the help type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark. Created on 03-09-2026 by decision of Indiane."
  focus/halo-danger:
    css: '--nph-focus-halo-danger'
    claro: core/danger/200
    escuro: core/danger/200
    use: "Focus HALO when the control is of the danger type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark. Created on 03-09-2026 by decision of Indiane."
  focus/halo-success:
    css: '--nph-focus-halo-success'
    claro: core/success/200
    escuro: core/success/200
    use: "Focus HALO when the control is of the success type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark. Created on 03-09-2026 by decision of Indiane."
  focus/halo-error:
    css: '--nph-focus-halo-error'
    claro: focus/halo-danger
    escuro: focus/halo-danger
    use: "Focus HALO when the field is invalid. Decoration; the border meets the contrast, and in this state it is status/error. Light tone in both modes. Renamed from focus/ring-error on 03-09-2026, for the same reason as focus/border."
  sidebar/background:
    css: '--nph-sidebar-background'
    claro: core/neutral/50
    escuro: core/surface/950
    use: "Sidebar background."
  sidebar/foreground:
    css: '--nph-sidebar-foreground'
    claro: core/neutral/700
    escuro: core/neutral/300
    use: "Text of an unselected item."
  sidebar/accent:
    css: '--nph-sidebar-accent'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Sidebar item on hover."
    nao_use: "Active item."
  sidebar/accent-foreground:
    css: '--nph-sidebar-accent-foreground'
    claro: core/neutral/900
    escuro: core/neutral/100
    use: "Text of the item on hover."
  sidebar/primary:
    css: '--nph-sidebar-primary'
    claro: theme/brand-600
    escuro: theme/brand-600
    use: "Active sidebar item."
    nao_use: "More than one item at a time."
  sidebar/primary-foreground:
    css: '--nph-sidebar-primary-foreground'
    claro: theme/brand-on-600
    escuro: theme/brand-on-600
    use: "Text of the active item."
  sidebar/border:
    css: '--nph-sidebar-border'
    claro: core/neutral/200
    escuro: core/surface/400
    use: "Separates the sidebar from the content."
  sidebar/ring:
    css: '--nph-sidebar-ring'
    claro: core/neutral/300
    escuro: core/neutral/200
    use: "Focus ring inside the sidebar."
  status/info:
    css: '--nph-status-info'
    claro: core/info/600
    escuro: core/info/400
    use: "Solid color of the state: icon, dot, message bar. Neutral information: system notice, contextual tip. Also the solid background of the nph-badge and of the nph-button, with status/on-solid. The `nao_use` still applies."
    nao_use: "error, risk or confirmation"
  status/info-surface:
    css: '--nph-status-info-surface'
    claro: core/info/50
    escuro: core/info/900
    use: "Message background. Always together with the other three roles of status/info. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/info-border:
    css: '--nph-status-info-border'
    claro: core/info/200
    escuro: core/info/400
    use: "Message border. Always together with the other three roles of status/info."
  status/info-foreground:
    css: '--nph-status-info-foreground'
    claro: core/info/800
    escuro: core/info/100
    use: "Text inside the message. Always together with the other three roles of status/info. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/warning:
    css: '--nph-status-warning'
    claro: core/warn/600
    escuro: core/warn/400
    use: "Solid color of the state: icon, dot, message bar. Something may go wrong, or requires care before proceeding. Also the solid background of the nph-badge and of the nph-button, with status/on-solid. The `nao_use` still applies."
    nao_use: "error that has already happened"
  status/warning-surface:
    css: '--nph-status-warning-surface'
    claro: core/warn/50
    escuro: core/warn/900
    use: "Message background. Always together with the other three roles of status/warning. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/warning-border:
    css: '--nph-status-warning-border'
    claro: core/warn/200
    escuro: core/warn/400
    use: "Message border. Always together with the other three roles of status/warning."
  status/warning-foreground:
    css: '--nph-status-warning-foreground'
    claro: core/warn/800
    escuro: core/warn/100
    use: "Text inside the message. Always together with the other three roles of status/warning. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/help:
    css: '--nph-status-help'
    claro: core/help/600
    escuro: core/help/400
    use: "Solid color of the state: icon, dot, message bar. Help and guidance: explanation, tour, support content. Also the solid background of the nph-badge and of the nph-button, with status/on-solid. The `nao_use` still applies."
    nao_use: "system state"
  status/help-surface:
    css: '--nph-status-help-surface'
    claro: core/help/50
    escuro: core/help/900
    use: "Message background. Always together with the other three roles of status/help. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/help-border:
    css: '--nph-status-help-border'
    claro: core/help/200
    escuro: core/help/400
    use: "Message border. Always together with the other three roles of status/help."
  status/help-foreground:
    css: '--nph-status-help-foreground'
    claro: core/help/800
    escuro: core/help/100
    use: "Text inside the message. Always together with the other three roles of status/help. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/error:
    css: '--nph-status-error'
    claro: core/danger/600
    escuro: core/danger/400
    use: "Solid color of the state: icon, dot, message bar. Error that has already happened: validation failed, request broke. Also the border of an invalid field — the field that failed validation. And the asterisk that marks a required field in nph-label: there it is a notice of requirement, not an error."
    nao_use: "destructive action by the user"
  status/error-surface:
    css: '--nph-status-error-surface'
    claro: core/danger/50
    escuro: core/danger/900
    use: "Message background. Always together with the other three roles of status/error."
  status/error-border:
    css: '--nph-status-error-border'
    claro: core/danger/200
    escuro: core/danger/400
    use: "Message border. Always together with the other three roles of status/error."
  status/error-foreground:
    css: '--nph-status-error-foreground'
    claro: core/danger/800
    escuro: core/danger/100
    use: "Text inside the message. Always together with the other three roles of status/error."
  status/success:
    css: '--nph-status-success'
    claro: core/success/600
    escuro: core/success/400
    use: "Solid color of the state: icon, dot, message bar. Confirmation that the action succeeded. Also the solid background of the nph-badge and of the nph-button, with status/on-solid. The `nao_use` still applies."
    nao_use: "permanent state such as an active badge"
  status/success-surface:
    css: '--nph-status-success-surface'
    claro: core/success/50
    escuro: core/success/900
    use: "Message background. Always together with the other three roles of status/success. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/success-border:
    css: '--nph-status-success-border'
    claro: core/success/200
    escuro: core/success/400
    use: "Message border. Always together with the other three roles of status/success."
  status/success-foreground:
    css: '--nph-status-success-foreground'
    claro: core/success/800
    escuro: core/success/100
    use: "Text inside the message. Always together with the other three roles of status/success. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/on-solid:
    css: '--nph-status-on-solid'
    claro: color/background
    escuro: color/background
    use: "Text and icon on the solid status background: nph-badge and nph-button in the info, warn, help and success types. DO NOT USE on the light surface of the message — there status/<matiz>-foreground applies."
  status/info-hover:
    css: '--nph-status-info-hover'
    claro: core/info/700
    escuro: core/info/300
    use: "Background of status/info in the hover-active state of the solid nph-button, with status/on-solid on top (decision of 02-10-2026, supersedes B4)."
  status/info-surface-hover:
    css: '--nph-status-info-surface-hover'
    claro: core/info/100
    escuro: core/info/800
  status/warning-hover:
    css: '--nph-status-warning-hover'
    claro: core/warn/700
    escuro: core/warn/300
    use: "Background of status/warning in the hover-active state of the solid nph-button, with status/on-solid on top (decision of 02-10-2026, supersedes B4)."
  status/warning-surface-hover:
    css: '--nph-status-warning-surface-hover'
    claro: core/warn/100
    escuro: core/warn/800
  status/help-hover:
    css: '--nph-status-help-hover'
    claro: core/help/700
    escuro: core/help/300
    use: "Background of status/help in the hover-active state of the solid nph-button, with status/on-solid on top (decision of 02-10-2026, supersedes B4)."
  status/help-surface-hover:
    css: '--nph-status-help-surface-hover'
    claro: core/help/100
    escuro: core/help/800
  status/success-hover:
    css: '--nph-status-success-hover'
    claro: core/success/700
    escuro: core/success/300
    use: "Background of status/success in the hover-active state of the solid nph-button, with status/on-solid on top (decision of 02-10-2026, supersedes B4)."
  status/success-surface-hover:
    css: '--nph-status-success-surface-hover'
    claro: core/success/100
    escuro: core/success/800
  brand/sistemas:
    css: '--nph-brand-sistemas'
    claro: core/sistemas/500
    escuro: core/sistemas/400
    use: "Identifies the `Sistemas` vertical: product header, badge, chart series."
    nao_use: "Serving as a shortcut to the primary. When this is the active brand, color/primary delivers the color to the button, and it already comes from theme/*."
  brand/sistemas-foreground:
    css: '--nph-brand-sistemas-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Text on brand/sistemas."
  brand/gerencial:
    css: '--nph-brand-gerencial'
    claro: core/gerencial/500
    escuro: core/gerencial/400
    use: "Identifies the `Gerencial` vertical: product header, badge, chart series."
    nao_use: "Serving as a shortcut to the primary. When this is the active brand, color/primary delivers the color to the button, and it already comes from theme/*."
  brand/gerencial-foreground:
    css: '--nph-brand-gerencial-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Text on brand/gerencial."
  brand/educacao:
    css: '--nph-brand-educacao'
    claro: core/educacao/500
    escuro: core/educacao/400
    use: "Identifies the `Educação` vertical: product header, badge, chart series."
    nao_use: "Serving as a shortcut to the primary. When this is the active brand, color/primary delivers the color to the button, and it already comes from theme/*."
  brand/educacao-foreground:
    css: '--nph-brand-educacao-foreground'
    claro: core/base/white
    escuro: core/base/white
    use: "Text on the `Educacao` brand. White, as in the other six - but only on brand/educacao-strong."
    nao_use: "On the raw amber (#ffa92d): it would give 1.92:1 and fail."
  brand/comercial:
    css: '--nph-brand-comercial'
    claro: core/comercial/500
    escuro: core/comercial/400
    use: "Identifies the `Comercial` vertical: product header, badge, chart series."
    nao_use: "Serving as a shortcut to the primary. When this is the active brand, color/primary delivers the color to the button, and it already comes from theme/*."
  brand/comercial-foreground:
    css: '--nph-brand-comercial-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Text on brand/comercial."
  brand/financeiro:
    css: '--nph-brand-financeiro'
    claro: core/financeiro/500
    escuro: core/financeiro/400
    use: "Identifies the `Financeiro` vertical: product header, badge, chart series."
    nao_use: "Serving as a shortcut to the primary. When this is the active brand, color/primary delivers the color to the button, and it already comes from theme/*."
  brand/financeiro-foreground:
    css: '--nph-brand-financeiro-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Text on brand/financeiro."
  brand/igrejas:
    css: '--nph-brand-igrejas'
    claro: core/igrejas/500
    escuro: core/igrejas/400
    use: "Identifies the `Igrejas` vertical: product header, badge, chart series."
    nao_use: "Serving as a shortcut to the primary. When this is the active brand, color/primary delivers the color to the button, and it already comes from theme/*."
  brand/igrejas-foreground:
    css: '--nph-brand-igrejas-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Text on brand/igrejas."
  brand/rh:
    css: '--nph-brand-rh'
    claro: core/rh/500
    escuro: core/rh/400
    use: "Identifies the `Recursos Humanos` vertical: product header, badge, chart series."
    nao_use: "Serving as a shortcut to the primary. When this is the active brand, color/primary delivers the color to the button, and it already comes from theme/*."
  brand/rh-foreground:
    css: '--nph-brand-rh-foreground'
    claro: core/base/white
    escuro: core/neutral/950
    use: "Text on brand/rh."
  brand/sistemas-strong:
    css: '--nph-brand-sistemas-strong'
    claro: core/sistemas/600
    escuro: core/sistemas/500
    use: "Use instead of brand/sistemas when the surface carries white text at normal size. The 500 only passes for large text (3.68:1); the 600 passes (5.37:1)."
  brand/educacao-strong:
    css: '--nph-brand-educacao-strong'
    claro: core/educacao/700
    escuro: core/educacao/700
    use: "`Educacao` surface that carries text. The 500 gives 1.92:1 with white and the 600 gives 2.98:1 - both fail. The 700 gives 4.96:1 and passes AA."
    nao_use: "Chart series or badge without text - there the vertical color is the 500."
  brand/comercial-strong:
    css: '--nph-brand-comercial-strong'
    claro: core/comercial/600
    escuro: core/comercial/500
    use: "Same rule as brand/sistemas-strong. The `Comercial` 500 (#3e8391) gives 4.32:1; the 600 gives 6.16:1. `Financeiro` does not need a variant: the 500 (#4d7549) already gives 5.25:1."

# ---------------------------------------------------------------
# BRAND LAYER. One mode per vertical. Only the semantic layer consumes it.
# ---------------------------------------------------------------
tokens_theme:
  modos: [Sistemas, Gerencial, Educacao, Comercial, Financeiro, Igrejas, Recursos Humanos]
  nota: >-
    Nephos is multi-brand. The active brand is a dimension independent of the color scheme:
    a product can be in Educacao + dark without anything being re-authored.
    These tokens are not consumed by components - only by the semantic layer.
  theme/brand-400:
    css: '--nph-theme-brand-400'
    valor_por_modo: "core/<vertical>/400 in six verticals; core/educacao/700 in `Educacao`"
    use: "Brand tone in dark mode. Feeds color/primary and focus/ring. `Educacao` uses the 700 because amber is the lightest vertical in the system and the 400 does not sustain white text."
  theme/brand-500:
    css: '--nph-theme-brand-500'
    valor_por_modo: core/<vertical>/500
    use: "The brand color as it is."
  theme/brand-600:
    css: '--nph-theme-brand-600'
    valor_por_modo: "core/<vertical>/600 in six verticals; core/educacao/700 in `Educacao`"
    use: "Brand tone in light mode. Feeds color/primary and sidebar/primary. The 500 of some verticals does not pass with white text; in `Educacao` not even the 600 passes (2.98:1), only the 700 (4.96:1)."
  theme/brand-700:
    css: '--nph-theme-brand-700'
    valor_por_modo: "core/<vertical>/700 in six verticals; core/educacao/800 in `Educacao`"
    use: "Brand tone for the focus ring in light mode, where the 500 and the 600 of some verticals do not reach 3:1 against a white background. In `Educacao` it is the 800, so the ring does not coincide with the primary itself."
  theme/brand-on-600:
    css: '--nph-theme-brand-on-600'
    valor_por_modo: core/base/white
    use: "Text on the brand tone in light mode. White in all seven verticals - the `Educacao` difference was solved by darkening the background, not by lightening the text."
  theme/brand-on-400:
    css: '--nph-theme-brand-on-400'
    valor_por_modo: "core/neutral/950 in `Sistemas`, `Comercial` and `Financeiro`; core/base/white in `Gerencial`, `Igrejas`, `Recursos Humanos` and `Educacao`"
    use: "Text on the brand tone in dark mode. Varies by vertical because the luminance of the tone varies: where the 400 is light, the text is dark."
  theme/brand-50:
    css: '--nph-theme-brand-50'
    valor_por_modo: core/<vertical>/50
    use: "Lightest tone of the active brand. Background of a piece in light emphasis: light button, band, badge. Consumed only by semantic."
  theme/brand-100:
    css: '--nph-theme-brand-100'
    valor_por_modo: core/<vertical>/100
    use: "Very light tone of the active brand. Text and icon on a dark brand surface in dark mode. Consumed only by semantic."
  theme/brand-200:
    css: '--nph-theme-brand-200'
    valor_por_modo: core/<vertical>/200
    use: "Light tone of the active brand. Border of a piece in light emphasis in light mode. Consumed only by semantic."
  theme/brand-300:
    css: '--nph-theme-brand-300'
    valor_por_modo: core/<vertical>/300
    use: "Tone 300 of the active brand. Created on 03-09-2026 for the focus border in dark mode, where the 400 failed the 3:1 minimum in `Gerencial` and `Recursos Humanos`. Do not use for fill or text."
  theme/brand-800:
    css: '--nph-theme-brand-800'
    valor_por_modo: core/<vertical>/800
    use: "Dark tone of the active brand. Text and icon on a light brand surface in light mode. Consumed only by semantic."
  theme/brand-900:
    css: '--nph-theme-brand-900'
    valor_por_modo: core/<vertical>/900
    use: "Darkest tone of the active brand. Background of a piece in light emphasis in dark mode. Consumed only by semantic."
  theme/brand-focus:
    css: '--nph-theme-brand-focus'
    valor_por_modo: "core/<vertical>/500 in six verticals; core/educacao/700 in `Educacao`"
    use: "Brand tone used in the focus ring. Tone 500 in six verticals; `Educação` uses 700 because its 500 measures 1,92:1 against white and fails the 3:1 minimum of WCAG 2.2 AA criterion 1.4.11. Decision by Indiane on 03-09-2026. Do not use for fill or text."
  theme/brand-400-hover:
    css: '--nph-theme-brand-400-hover'
    valor_por_modo: "core/<vertical>/300 in `Sistemas`, `Comercial` and `Financeiro`; core/<vertical>/500 in `Gerencial`, `Igrejas` and `Recursos Humanos`; core/educacao/800 in `Educacao`"

# ---------------------------------------------------------------
# TYPOGRAPHY - the 14 roles. Every text uses one of them. No text
# without a role. There is no brand layer: the seven verticals share
# the family. Values in px; in CSS use the rem column of core/size.
# ---------------------------------------------------------------
tipografia_regras:
  familia_interface: core/font/sans
  familia_mono: core/font/mono
  corpo_padrao: text/body-md
  unidade_css: rem, root 16px
  piso: 12px
  enfase: "<strong> in HTML. There is no emphasis role and label is not used to highlight a word in a paragraph."
  pesos_por_regiao: at most 2
  css_forma: "The `css` field of each role is a PREFIX, not the final name. Each role emits five custom properties: `-font-family`, `-font-size`, `-line-height`, `-font-weight` and `-letter-spacing`. Example: text/label-md emits --nph-text-label-md-font-size. They are five and not one because `letter-spacing` does not fit the CSS `font` shorthand and because a component often needs a single property. Migrated on 27-08-2026; confirm in the technical review."
  css_unidade_real: "All five come out in rem since 28-08-2026, when the generator started to follow the `unidade_css` rule above (P62.4, decision by Elvys). Before that they came out in px. The conversion uses a 16px root and applies to every dimension, EXCEPT core/radius and core/shadow-*, which follow `raio_regras.unidade_css: px` and `elevacao_regras.unidade_css: px` by their own rule."

tokens_typography:
  text/heading-xl:
    css: '--nph-text-heading-xl'
    valores: { size: 30, line-height: 36, weight: 600, tracking: -0.2, family: sans }
    use: "Wide page opening and documentation cover. DO NOT USE inside a work screen."
  text/heading-lg:
    css: '--nph-text-heading-lg'
    valores: { size: 24, line-height: 32, weight: 600, tracking: -0.2, family: sans }
    use: "Main title of the screen, one per page. It is the first step that WCAG counts as large text."
  text/heading-md:
    css: '--nph-text-heading-md'
    valores: { size: 20, line-height: 28, weight: 600, tracking: 0, family: sans }
    use: "Section and card title. It is NOT large text for WCAG: it requires 4,5:1."
  text/heading-sm:
    css: '--nph-text-heading-sm'
    valores: { size: 16, line-height: 24, weight: 600, tracking: 0, family: sans }
    use: "Subsection and group header. DO NOT USE as a field label - a label is label-md."
  text/heading-xs:
    css: '--nph-text-heading-xs'
    valores: { size: 14, line-height: 20, weight: 600, tracking: 0, family: sans }
    use: "Small title inside a piece: card title, table column header, alert title. Same size as label-md, with a heavier weight. DO NOT USE on a field label or on a button - those are label-md."
  text/heading-2xs:
    css: '--nph-text-heading-2xs'
    valores: { size: 12, line-height: 16, weight: 600, tracking: 0, family: sans }
    use: "Title at the floor of the scale: column header in a dense table, section title inside a popover. DO NOT USE when there is room for heading-xs."
  text/body-lg:
    css: '--nph-text-body-lg'
    valores: { size: 16, line-height: 24, weight: 400, tracking: 0, family: sans }
    use: "Long reading: documentation and portal. Line height 1,5; line of 60 to 80 characters."
  text/body-md:
    css: '--nph-text-body-md'
    valores: { size: 14, line-height: 20, weight: 400, tracking: 0, family: sans }
    use: "Default body of the interface: form, table, panel and system message, including validation error."
  text/body-sm:
    css: '--nph-text-body-sm'
    valores: { size: 12, line-height: 16, weight: 400, tracking: 0, family: sans }
    use: "Accessory text that accompanies other content. NEVER essential information."
  text/label-lg:
    css: '--nph-text-label-lg'
    valores: { size: 16, line-height: 24, weight: 500, tracking: 0, family: sans }
    use: "Tab, main menu item and highlighted label. DO NOT USE as a title."
  text/label-md:
    css: '--nph-text-label-md'
    valores: { size: 14, line-height: 20, weight: 500, tracking: 0, family: sans }
    use: "Button, field label and menu item. It is the default role of every control."
  text/label-sm:
    css: '--nph-text-label-sm'
    valores: { size: 12, line-height: 16, weight: 500, tracking: 0.4, family: sans }
    use: "Table column header, chip and badge. It is a tag, not a sentence."
  text/caption:
    css: '--nph-text-caption'
    valores: { size: 12, line-height: 16, weight: 400, tracking: 0.4, family: sans }
    use: "Caption, help below the field, counter and date. DO NOT USE in an error message."
  text/code:
    css: '--nph-text-code'
    valores: { size: 14, line-height: 20, weight: 400, tracking: 0, family: mono }
    use: "Code, identifier, key, hash and path - what is read character by character. DO NOT USE for a number in a table."

# ---------------------------------------------------------------
# SPACING - primitives in core (invisible) and 7 intent tokens
# in the semantic collection. Components consume ONLY the
# semantic ones. Base 4px with a half-step of 2. Values in px; in CSS
# use rem, root 16px.
# ---------------------------------------------------------------
espacamento_regras:
  unidade_base: 4
  meio_passo: 2
  meio_passo_use: "Only chip, icon and table cell. It has no semantic token."
  unidade_css: rem, root 16px
  padding_vs_gap: "Padding is the breathing room inside a box. Gap is the distance between boxes. Different tokens because the decisions are different."
  passo_por_vez: "If a step is tight, go up one. Skipping a step is a symptom of a grouping problem, not of space."

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
    use: "Horizontal space INSIDE a unit: an icon and its text, a value and its unit. Exception: the top and bottom breathing room of the nph-badge, as Figma draws it. DO NOT USE between independent elements - there it is space/inline."
  space/inline:
    css: '--nph-space-inline'
    alias: core/space/200
    valor: 8
    use: "Horizontal space BETWEEN independent elements: buttons of a group, label and badge, items of a bar."
  space/stack-tight:
    css: '--nph-space-stack-tight'
    alias: core/space/100
    valor: 4
    use: "Vertical space between a label and what it describes: label and field, title and subtitle. They are two lines of a single thing."
  space/stack:
    css: '--nph-space-stack'
    alias: core/space/400
    valor: 16
    use: "Default vertical space between sibling items: fields of a form, items of a list, rows of a panel."
  space/section:
    css: '--nph-space-section'
    alias: core/space/700
    valor: 32
    use: "Between sections of the same page. If there is a new title, it is section. DO NOT USE between fields."
  space/control-padding:
    css: '--nph-space-control-padding'
    alias: core/space/300
    valor: 12
    use: "Inner horizontal padding of button, field and select - what is operated - and the sides of the nph-badge. DO NOT USE on a card."
  space/container-padding:
    css: '--nph-space-container-padding'
    alias: core/space/400
    valor: 16
    use: "Inner padding of card, panel, popover and dialog - what contains. DO NOT USE on a control."

regras_raio_parcial:
  preferido: 'The container carries the radius and CLIPS (overflow: hidden). The children stay at radius/none and do not need to know they are inside something curved. Applies to table, list, accordion and any stack.'
  excecao: 'When clipping is not possible - a button group with its own border - the FIRST and the LAST item receive the container radius only on the OUTER corners; the middle ones stay at radius/none.'
  nunca: 'Giving the full radius to all children and leaving the container square: the curve appears repeated inside and the group no longer looks like a single piece.'
  sem_token: 'There is NO partial-corner token. Radius in CSS is already per corner; a token that bundles four corners only adds a layer.'

regras_italico_sublinhado:
  italico_nao_e_papel: 'Noto Sans has a real italic in Regular, Medium and SemiBold. Apply it by semantics in the HTML, inheriting the role in use.'
  use_italico_em: ['literal quotation', 'foreign term not incorporated', 'name of a work or publication', 'mathematical variable or scientific name']
  nao_use_italico_em: ['emphasis - emphasis is <strong>', 'title, label, button, menu item', 'whole paragraph', 'error or state message']
  sublinhado: 'EXCLUSIVE to links. Underlining text that is not a link breaks the only convention the entire web has, and makes the person try to click what does not click.'

regras_densidade:
  modo_de_densidade: 'It does NOT exist. Compact is control/height-compact plus the table own spacing. A system-wide mode would double every semantic space token and would have to be checked in every component.'

regras_sombra_interna:
  existe: false
  motivo: 'The seven shadows of the system are all drop shadows. A sunken field and a list well are solved with color/muted on the background plus color/input on the border. Inner shadow is vocabulary of the 2010s admin panel, which is among the anti-references.'

tokens_control:
  control/height-compact:
    css: '--nph-control-height-compact'
    alias: core/control-height/compact
    valor: 28
    use: "Control height in a dense screen: table, toolbar, filter. NEVER on a touch target - it fails WCAG 2.5.8."
  control/height-default:
    css: '--nph-control-height-default'
    alias: core/control-height/default
    valor: 36
    use: "Default height of button, field and select. When in doubt, it is this one."
  control/height-large:
    css: '--nph-control-height-large'
    alias: core/control-height/large
    valor: 44
    use: "Main form and touch-sensitive screen. Guarantees the 44px minimum target recommended by WCAG 2.2."

# ---------------------------------------------------------------
# RADIUS - primitives in core (invisible) and 8 intent tokens in the
# semantic collection. Components consume ONLY the semantic ones.
# ATTENTION: radius is in px, NOT in rem. There are TWO foundations like this -
# this one and shadow, which declares the same in elevacao_regras.
# Radius must not grow with the user font: the piece would change
# shape, not size.
# ---------------------------------------------------------------
raio_regras:
  padrao_do_sistema: radius/control
  unidade_css: px
  por_que_px: "Radius in rem would grow with the user font and a 6px button would become a capsule. Shape does not follow text size."
  aninhado: "Inner radius = outer radius - padding. If it gives zero or less, use radius/none. Inner NEVER equal to outer."
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
  off-scale/7:  { valor: 7,  css: '--nph-core-radius-off-scale-7',  alias_de: 'focus/border-radius-control' }
  off-scale/11: { valor: 11, css: '--nph-core-radius-off-scale-11', alias_de: 'focus/radius-control-with-border' }
  off-scale/18: { valor: 18, css: '--nph-core-radius-off-scale-18', alias_de: 'focus/radius-surface' }

tokens_radius:
  radius/none:
    css: '--nph-radius-none'
    alias: core/radius/0
    valor: 0
    use: "Square corner. USE on what touches the edge of the screen or of another element: sidebar, fixed header, full-width table, cell. DO NOT USE on a loose piece over the background."
  radius/subtle:
    css: '--nph-radius-subtle'
    alias: core/radius/100
    valor: 2
    use: "USE on a small marker that contains nothing: status bar, indicator, minimal tag, resize handle. DO NOT USE on a control."
  radius/inner:
    css: '--nph-radius-inner'
    alias: core/radius/200
    valor: 4
    use: "USE on an element nested inside a control or container: checkbox, icon with background, item inside a popover, thumbnail. The inner radius is always smaller than the outer. It is also the radius of the help balloon (nph-tooltip)."
  radius/control:
    css: '--nph-radius-control'
    alias: core/radius/300
    valor: 6
    use: "SYSTEM DEFAULT. USE on button, field, select, textarea and anything that is operated. When in doubt, it is this one."
  radius/container:
    css: '--nph-radius-container'
    alias: core/radius/400
    valor: 8
    use: "USE on popover and dropdown menu - the floating layer attached to a trigger. The tooltip uses radius/inner. DO NOT USE on a card or panel: those are radius/surface. DO NOT USE on a control."
  radius/overlay:
    css: '--nph-radius-overlay'
    alias: core/radius/450
    valor: 10
    use: "USE on a large floating layer: dialog, modal, side panel. It is the BASE of the reference kit scale (--radius = 10), from which control and container derive. Popover does NOT go here - it is radius/container; tooltip is radius/inner."
  radius/surface:
    css: '--nph-radius-surface'
    alias: core/radius/600
    valor: 14
    use: "USE on card, panel and sheet - the surface that carries content and does NOT float. Equivalent to the kit rounded-xl. DO NOT USE on a floating layer."
  radius/full:
    css: '--nph-radius-full'
    alias: core/radius/full
    valor: 9999
    use: "Fully rounded shape. USE only on a small piece whose shape communicates a marker: badge, counter, switch knob. NEVER on a regular button, field or card. NEVER on an avatar: the avatar is a square with rounded corners (avatar/radius-*)."

# ---------------------------------------------------------------
# ELEVATION - in Figma the level is an EFFECT STYLE; in code it is a
# DTCG token of type `shadow`, generated since 03-09-2026 (PF-15). The shadow
# colors are semantic and become TRANSPARENT in dark mode, where
# elevation comes from the surface ramp (see section 3 of this file).
# Components use elevation/*; they NEVER pick shadow/* by hand.
# ---------------------------------------------------------------
elevacao_regras:
  claro: "Elevation is the shadow."
  escuro: "The shadow goes to zero. Elevation comes from the surface ramp (sidebar 950, background 900, card 800, popover 700, dialog 600) and from the border."
  unidade_css: px
  camadas_por_nivel: '2 in the middle band; 1 at the extremes (hairline, subtle, spotlight)'
  opacidade: 'Constant in the middle band: raised, dropdown, modal and drawer use shadow/color at 10%, and there the levels grow in offset and blur, not in opacity. At the extremes it varies: hairline and subtle use shadow/color-light at 5%, spotlight uses shadow/color-strong at 25%. The three values came from the reference kit.'
  spread_negativo: 'Shrinks the shadow and keeps it anchored under the piece, instead of leaking out the sides.'
  alinhamento: 'The seven levels with a shadow match the geometry AND the opacity of the shadcn kit exactly: hairline=2xs, subtle=xs, raised=sm, dropdown=md, modal=lg, drawer=xl, spotlight=2xl. Intent names are Nephos own; the numbers were aligned so that swapping the style of an adapted component is 1:1.'
  um_nivel_por_peca: "Do not stack elevation inside elevation."
  sombra_nao_e_estado: "Hover and focus are solved with color and visible focus, never by raising the level."
  modal_exige_veu: overlay/scrim

tokens_elevation:
  elevation/none:
    css: '--nph-elevation-none'
    valor: none
    use: "Piece resting on the background, or inside a container that is already elevated. DO NOT stack elevation inside elevation."
  elevation/hairline:
    css: '--nph-elevation-hairline'
    camadas: ['0 1px 0 0 shadow/color-light']
    equivale_a: 'shadow-2xs of the reference kit'
    use: "Elevation hairline. USE when the piece only needs to separate from what is behind it without looking like it floats: fixed bar, table header, weighted divider. DO NOT USE on a card - a card is elevation/raised."
  elevation/subtle:
    css: '--nph-elevation-subtle'
    camadas: ['0 1px 2px 0 shadow/color-light']
    equivale_a: 'shadow-xs of the reference kit'
    use: "Subtle elevation. USE on a control that rises slightly from the background: button, field, chip. It is the level the kit applies to the button. DO NOT USE on a floating layer."
  elevation/raised:
    css: '--nph-elevation-raised'
    camadas: ['0 1px 2px -1px shadow/color', '0 1px 3px 0 shadow/color']
    equivale_a: 'shadow-sm of the reference kit'
    use: "Card and panel that rise from the page background - permanent content. DO NOT USE on a floating layer."
  elevation/dropdown:
    css: '--nph-elevation-dropdown'
    camadas: ['0 2px 4px -2px shadow/color', '0 4px 6px -1px shadow/color']
    equivale_a: 'shadow-md of the reference kit'
    use: "Floating layer attached to a trigger, which opens and closes and does NOT block the page: popover, dropdown menu, tooltip, open select."
  elevation/modal:
    css: '--nph-elevation-modal'
    camadas: ['0 4px 6px -4px shadow/color', '0 10px 15px -3px shadow/color']
    equivale_a: 'shadow-lg of the reference kit'
    use: "Layer that BLOCKS the page: dialog and side panel. Always accompanied by overlay/scrim. Without a scrim, it is not a modal."
  elevation/drawer:
    css: '--nph-elevation-drawer'
    camadas: ['0 8px 10px -6px shadow/color', '0 20px 25px -5px shadow/color']
    equivale_a: 'shadow-xl of the reference kit'
    use: "Large panel that enters from the edge of the screen: drawer, side sheet, command panel. Above modal in reach, not in blocking. DO NOT USE on a common dialog."
  focus-ring/default:
    css: '--nph-focus-ring-default'
    camadas: ['0 0 0 4px focus/ring']
    use: "The keyboard focus ring. USE on EVERY operable element that receives focus: button, field, select, checkbox, link, tab, menu item - except where the focus is border and halo (rule 6). The color comes from the active brand. NEVER remove the visible focus. DO NOT USE inside the sidebar - there it is focus-ring/sidebar. Where the accepted Figma draws border and halo, they apply in place of the ring. On the nph-button, the focus border is border/width in the color of the type (color/primary, status/info, status/warning, status/help, color/destructive or status/success) and focus/border on the secondary, with radius focus/border-radius-control; the halo is focus/ring-width in focus/halo on the primary and the secondary, and in focus/halo-<matiz> on the others, with radius focus/radius-control-with-border. On the info trigger of the nph-label, border focus/border and halo focus/halo."
  focus-ring/invalid:
    css: '--nph-focus-ring-invalid'
    camadas: ['0 0 0 4px focus/ring-error']
    use: "The focus ring on a field that failed validation. USE together with a text message and an icon - the ring is NEVER the only sign of the error. The STYLE is `invalid`; the COLOR it consumes is `focus/ring-error` - different names on purpose, because both flattened into the same --nph-focus-ring-error."
  focus-ring/sidebar:
    css: '--nph-focus-ring-sidebar'
    camadas: ['0 0 0 4px sidebar/ring']
    use: "The focus ring inside the sidebar, where the background is different. USE on a navigation item, collapse button and the bar search."
  elevation/spotlight:
    css: '--nph-elevation-spotlight'
    camadas: ['0 25px 50px -12px shadow/color-strong']
    equivale_a: 'shadow-2xl of the reference kit'
    use: "Maximum level, for the piece that takes the whole screen: command palette, full-focus search. USE at most one per screen. DO NOT stack with another level."

  nota_focus_ring:
    renomeado: 'focus-ring/error became focus-ring/invalid on 03-09-2026, in Figma and in code at the same time. Decision by Indiane.'
    motivo: 'The old name flattened into `--nph-focus-ring-error`, the SAME name that tokens_alpha gives to focus/ring-error, already published as the ring COLOR. Two different things with a single name. The style was renamed, not the color: a published custom property, which P02 defines as public API, is not broken to accommodate one that did not exist yet.'
    leitura: 'The shadow is `invalid`; the color it consumes is still `focus/ring-error`. `invalid` is the HTML and ARIA term for the state.'

# ---------------------------------------------------------------
# ALPHA - 19-step scale in black and in white, complete and
# equal to that of the reference kit. EVERY transparency in the system comes
# from here. The scale is COMPLETE on purpose: a primitive has an empty
# scope, does not appear in any picker, and cutting a step would only create
# a per-occurrence decision when adapting a component. Recorded
# exception: the modal scrim uses 45% and 65%, outside the scale.
# ---------------------------------------------------------------
tokens_core_alpha:
  degraus: [0, 0.01, 3.33, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100]
  degraus_de_projeto: [0, 5, 10, 20, 40, 60, 80, 100]
  nota: 'Steps 0.01 and 3.33 are not design values: 0.01 is a Figma technique to make an area clickable, 3.33 is one thirtieth. They exist to receive components imported from the kit.'
  black: 'core/alpha/black-<degrau>'
  white: 'core/alpha/white-<degrau>'

# ---------------------------------------------------------------
# SHADOW PRIMITIVES - they are not design tokens and no
# component consumes them. They exist to BUILD the eight elevation
# styles. Components use the elevation/* style, never these.
# Documented on 24-08-2026 from what the styles actually bind
# in Figma - it is not a proposal, it is a reading of the file.
# ---------------------------------------------------------------
tokens_core_sombra:
  regra: 'NEVER consume one of these in a component. They only appear inside an elevation/* style. If you need a shadow, pick the style; if none fits, stop and ask - do not build a new shadow by hand.'
  spread_e_negativo: 'Every shadow-spread is zero or negative. Negative spread shrinks the shadow relative to the box, which is what keeps the smudge from escaping out the sides in a large-radius shadow.'

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
    nota: 'Each line is a shadow layer, in the order y / blur / spread / color. Five styles have two layers; three have one.'
    elevation/none:      'no effect'
    elevation/hairline:  ['1 / 0 / 0 / shadow/color-light']
    elevation/subtle:    ['1 / 2 / 0 / shadow/color-light']
    elevation/raised:    ['1 / 2 / -1 / shadow/color', '1 / 3 / 0 / shadow/color']
    elevation/dropdown:  ['2 / 4 / -2 / shadow/color', '4 / 6 / -1 / shadow/color']
    elevation/modal:     ['4 / 6 / -4 / shadow/color', '10 / 15 / -3 / shadow/color']
    elevation/drawer:    ['8 / 10 / -6 / shadow/color', '20 / 25 / -5 / shadow/color']
    elevation/spotlight: ['25 / 50 / -12 / shadow/color-strong']

# ---------------------------------------------------------------
# SCRIM, FOCUS AND LAYOUT PRIMITIVES - each one has exactly one
# semantic consumer. Components consume the semantic one.
# ---------------------------------------------------------------
tokens_core_veu:
  regra: 'NEVER consume directly. Use overlay/scrim, which switches between the modes by itself.'
  core/scrim/light: { valor: 'rgba(0,0,0,0.45)', css: '--nph-core-scrim-light', alias_de: 'overlay/scrim in light mode' }
  core/scrim/dark:  { valor: 'rgba(0,0,0,0.65)', css: '--nph-core-scrim-dark',  alias_de: 'overlay/scrim in dark mode' }

tokens_core_foco:
  regra: 'NEVER consume directly. The focus ring comes from the focus-ring/* styles, which already bind the width and the color, or from the focus halo of rule 6.'
  core/focus-width/default: { valor: 4, css: '--nph-core-focus-width-default', alias_de: 'focus/ring-width' }

tokens_core_borda:
  regra: 'NEVER consume directly. Use border/width.'
  core/border-width/default: { valor: 1, css: '--nph-core-border-width-default', alias_de: 'border/width' }

tokens_core_icon:
  regra: 'NEVER consume directly. Use icon/size-sm, -md and -lg. Read from Figma on 24-08-2026, when migrating the tokens to JSON.'
  core/icon-size/100: { valor: 16, css: '--nph-core-icon-size-100', alias_de: 'icon/size-sm' }
  core/icon-size/200: { valor: 20, css: '--nph-core-icon-size-200', alias_de: 'icon/size-md' }
  core/icon-size/300: { valor: 24, css: '--nph-core-icon-size-300', alias_de: 'icon/size-lg' }

tokens_core_control:
  regra: 'NEVER consume directly. Use control/height-compact, -default and -large. Read from Figma on 24-08-2026, when migrating the tokens to JSON.'
  core/control-height/compact: { valor: 28, css: '--nph-core-control-height-compact', alias_de: 'control/height-compact' }
  core/control-height/default: { valor: 36, css: '--nph-core-control-height-default', alias_de: 'control/height-default' }
  core/control-height/large:   { valor: 44, css: '--nph-core-control-height-large',   alias_de: 'control/height-large' }

tokens_core_layout:
  regra: 'NEVER consume directly. Use the semantic layout/* tokens.'
  core/layout-width/app:               { valor: 1440, css: '--nph-core-layout-width-app',               alias_de: 'layout/max-app' }
  core/layout-width/reading:           { valor: 720,  css: '--nph-core-layout-width-reading',           alias_de: 'layout/max-reading' }
  core/layout-width/sidebar-expanded:  { valor: 280,  css: '--nph-core-layout-width-sidebar-expanded',  alias_de: 'layout/sidebar-expanded' }
  core/layout-width/sidebar-collapsed: { valor: 64,   css: '--nph-core-layout-width-sidebar-collapsed', alias_de: 'layout/sidebar-collapsed' }
  core/layout-height/header:           { valor: 56,   css: '--nph-core-layout-height-header',           alias_de: 'layout/header-height' }
  core/layout-width/tooltip:           { valor: 235, css: '--nph-core-layout-width-tooltip', alias_de: 'layout/max-tooltip-width' }
  core/layout-height/tooltip:          { valor: 44, css: '--nph-core-layout-height-tooltip', alias_de: 'layout/max-tooltip-height' }
  core/layout-width/field:             { valor: 320, css: '--nph-core-layout-width-field', alias_de: 'layout/field-width' }
  core/layout-width/input:             { valor: 280, css: '--nph-core-layout-width-input', alias_de: 'layout/input-width' }
  core/layout-width/rich-option:       { valor: 320, css: '--nph-core-layout-width-rich-option', alias_de: 'layout/rich-option-width' }
  core/layout-width/separator:         { valor: 240, css: '--nph-core-layout-width-separator', alias_de: 'layout/separator-width' }
  core/layout-height/separator:        { valor: 48, css: '--nph-core-layout-height-separator', alias_de: 'layout/separator-height' }

# ---------------------------------------------------------------
# PRIMITIVES WITHOUT A CONSUMER - they exist in Figma and NO semantic
# variable, style or component uses them. They are here so the
# inventory is complete and verifiable, NOT because they have a defined
# use. Verified by reverse index on 24-08-2026.
# ---------------------------------------------------------------
tokens_core_sem_consumidor:
  estado: 'PENDING DECISION - they either get a defined role or leave the file. Decision by Indiane, not yet taken.'
  regra: 'DO NOT consume any of these and DO NOT invent a use for them. If you need a value that only exists here, stop and ask.'
  nao_gerar_em_json: 'While they are on this list, they must NOT go into the tokens JSON: generating CSS for a primitive without a role spreads debt.'

  radius:
    nota: 'Four steps above core/radius/600, which is the last step of the scale with a consumer (radius/surface).'
    '700':  { valor: 16 }
    '800':  { valor: 22 }
    '900':  { valor: 24 }
    '1000': { valor: 26 }

  space_degraus_altos:
    nota: 'Four steps above core/space/1100.'
    '1200': { valor: 96 }
    '1300': { valor: 112 }
    '1400': { valor: 128 }
    '1500': { valor: 144 }

  space_fora_de_escala:
    nota: 'Twelve values that do NOT belong to the base-4 scale with a half-step of 2. None has a consumer and none has a recorded justification. DO NOT treat them as a scale.'
    valores: [3, 5, 5.5, 6, 7, 7.5, 8.5, 9, 9.5, 10, 14, 15.5]

tokens_alpha:
  shadow/color:
    css: '--nph-shadow-color'
    alias_claro: core/alpha/black-10
    alias_escuro: core/alpha/black-0
    claro: 'rgba(0,0,0,0.10)'
    escuro: 'rgba(0,0,0,0)'
    use: "The color of the middle-band shadows - raised, dropdown, modal and drawer. NEVER pick it by hand: use the elevation/* style. In dark it is transparent, because there elevation comes from the surface ramp."
  shadow/color-light:
    css: '--nph-shadow-color-light'
    alias_claro: core/alpha/black-5
    alias_escuro: core/alpha/black-0
    claro: 'rgba(0,0,0,0.05)'
    escuro: 'rgba(0,0,0,0)'
    use: "The color of the two lightest shadows - hairline and subtle. 5% and not 10%: at this reach the shadow is a hairline, and 10% would make it heavy. NEVER pick it by hand."
  shadow/color-strong:
    css: '--nph-shadow-color-strong'
    alias_claro: core/alpha/black-25
    alias_escuro: core/alpha/black-0
    claro: 'rgba(0,0,0,0.25)'
    escuro: 'rgba(0,0,0,0)'
    use: "The color of the maximum level, spotlight. 25%: the piece that takes the whole screen needs to detach from everything. NEVER pick it by hand."
  overlay/scrim:
    css: '--nph-overlay-scrim'
    alias_claro: core/scrim/light
    alias_escuro: core/scrim/dark
    claro: 'rgba(0,0,0,0.45)'
    escuro: 'rgba(0,0,0,0.65)'
    use: "Scrim behind dialog and side panel. USE whenever there is a modal. Stronger in dark because the background is already dark. The only alpha value outside the scale of 8."
  overlay/on-media:
    css: '--nph-overlay-on-media'
    alias: core/alpha/black-40
    claro: 'rgba(0,0,0,0.40)'
    escuro: 'rgba(0,0,0,0.40)'
    use: "Dark scrim over an image, so the text on top stays legible. USE on a cover, a card with a background photo and a gallery. Equal in both modes: legibility over the image does not depend on the theme."
  focus/ring-width:
    css: '--nph-focus-ring-width'
    alias: core/focus-width/default
    valor: 4
    use: "The thickness of EVERY focus ring: 4px, equal in both modes. NEVER pick it by hand: apply one of the focus-ring/* styles or the focus halo of rule 6. DO NOT reduce it to 1 or 2 on a small piece - the ring is what makes the product keyboard-navigable. WCAG 2.2 asks for at least 2px."
  border/width:
    css: '--nph-border-width'
    alias: core/border-width/default
    valor: 1
    use: "Thickness of border and of control, box and line outline."
  focus/border-radius-control:
    css: '--nph-focus-border-radius-control'
    alias: core/radius/off-scale/7
    valor: 7
    use: "Radius of the 1 px focus border around a control with radius/control."
  focus/radius-control:
    css: '--nph-focus-radius-control'
    alias: core/radius/450
    valor: 10
    use: "Radius of the focus halo around a control with radius/control: radius/control + focus/ring-width."
  focus/radius-control-with-border:
    css: '--nph-focus-radius-control-with-border'
    alias: core/radius/off-scale/11
    valor: 11
    use: "Radius of the focus halo around the focus border of a control: focus/border-radius-control + focus/ring-width."
  focus/radius-inner:
    css: '--nph-focus-radius-inner'
    alias: core/radius/400
    valor: 8
    use: "Radius of the focus halo around a piece with radius/inner: radius/inner + focus/ring-width."
  focus/radius-surface:
    css: '--nph-focus-radius-surface'
    alias: core/radius/off-scale/18
    valor: 18
    use: "Radius of the focus halo around a piece with radius/surface: radius/surface + focus/ring-width."
  state/disabled-opacity:
    css: '--nph-state-disabled-opacity'
    valor: 0.5
    use: "Opacity of the disabled control, applied to the WHOLE control. WCAG exempts a disabled element from the minimum contrast, but disabled is NEVER the only sign: the control also stops responding and, when there is a reason, it is stated in text."
  state/hover-opacity:
    css: '--nph-state-hover-opacity'
    valor: 0.95
    use: "It was the solid hover of the nph-button (B4, `Registro`). Since 02-10-2026, the button uses color/primary-hover, color/destructive-hover, color/secondary-hover and status/*-hover. DO NOT USE on button hover."
    nao_use: "Button hover; secondary, outline, ghost, focus, disabled or isolated text."

# ---------------------------------------------------------------
# GRID AND LAYOUT - 12 columns at EVERY breakpoint. What changes with the screen
# is the margin, never the count. The breakpoints are BUILD
# values: a media query does not accept a CSS variable. It is the only Nephos
# value that does not reach the component as a custom property.
# ---------------------------------------------------------------
grid_regras:
  colunas: 12
  colunas_variam_por_quebra: false
  calha: 24
  calha_varia_por_quebra: false
  margem_varia_por_quebra: true
  pontos_de_quebra_sao_de_build: true
  calha_nao_e_espacamento: "layout/gutter aligns columns. The space between items inside a column comes from space/*."

tokens_breakpoint:
  md:  { valor: 768,  css: '--nph-breakpoint-md',  use: "Landscape tablet and side-by-side window. Below 768 is the base band, with no breakpoint of its own. Build value." }
  lg:  { valor: 1024, css: '--nph-breakpoint-lg',  use: "Laptop. Where most of the work happens. Build value." }
  xl:  { valor: 1280, css: '--nph-breakpoint-xl',  use: "Desktop. Build value." }
  xxl: { valor: 1600, css: '--nph-breakpoint-xxl', use: "Wide screen. It exists because corporate screens are large and without this breakpoint the table stretches without limit. Build value." }

tokens_layout:
  layout/columns:
    css: '--nph-layout-columns'
    valor: 12
    use: "12 columns at EVERY breakpoint. If the composition does not fit, change how many columns the block occupies - never how many columns exist."
  layout/gutter:
    css: '--nph-layout-gutter'
    alias: core/space/600
    valor: 24
    use: "Gutter between columns, equal at every breakpoint. DO NOT USE as space between items of a list - that is space/stack."
  layout/margin-compact:
    css: '--nph-layout-margin-compact'
    alias: core/space/400
    valor: 16
    use: "Side margin of the page below 768px."
  layout/margin-default:
    css: '--nph-layout-margin-default'
    alias: core/space/600
    valor: 24
    use: "Side margin of the page from 768 to 1279px. It is the default margin."
  layout/margin-wide:
    css: '--nph-layout-margin-wide'
    alias: core/space/900
    valor: 48
    use: "Side margin of the page from 1280px. Gives breathing room on a large screen without stretching the content."
  layout/max-app:
    css: '--nph-layout-max-app'
    alias: core/layout-width/app
    valor: 1440
    use: "Maximum width of the application area: panel, table, form - what is OPERATED. Above that the content centers instead of stretching."
  layout/max-reading:
    css: '--nph-layout-max-reading'
    alias: core/layout-width/reading
    valor: 720
    use: "Maximum width of running text - what is READ end to end. Delivers the 60 to 80 character measure required by typography. DO NOT USE on a table or data panel."
  layout/sidebar-expanded:
    css: '--nph-layout-sidebar-expanded'
    alias: core/layout-width/sidebar-expanded
    valor: 280
    use: "Width of the open sidebar. Applies to the application shell and to the documentation page in Figma."
  layout/sidebar-collapsed:
    css: '--nph-layout-sidebar-collapsed'
    alias: core/layout-width/sidebar-collapsed
    valor: 64
    use: "Width of the collapsed sidebar, icon only."
  layout/header-height:
    css: '--nph-layout-header-height'
    alias: core/layout-height/header
    valor: 56
    use: "Height of the top bar. Fits a control/height-default (36) with breathing room."
  layout/max-tooltip-width:
    css: '--nph-layout-max-tooltip-width'
    alias: core/layout-width/tooltip
    valor: 235
    use: "Maximum width of nph-tooltip. USE only on the help balloon: up to here it follows the text, then it wraps the line. DO NOT USE on popover, menu or running text — running text is layout/max-reading."
  layout/max-tooltip-height:
    css: '--nph-layout-max-tooltip-height'
    alias: core/layout-height/tooltip
    valor: 44
    use: "Maximum height of nph-tooltip: at most two lines of text. The text must fit whole, without an ellipsis and without breaking a word. DO NOT USE outside the help balloon."
  layout/field-width:
    css: '--nph-layout-field-width'
    alias: core/layout-width/field
    valor: 320
  layout/input-width:
    css: '--nph-layout-input-width'
    alias: core/layout-width/input
    valor: 280
  layout/rich-option-width:
    css: '--nph-layout-rich-option-width'
    alias: core/layout-width/rich-option
    valor: 320
  layout/separator-width:
    css: '--nph-layout-separator-width'
    alias: core/layout-width/separator
    valor: 240
  layout/separator-height:
    css: '--nph-layout-separator-height'
    alias: core/layout-height/separator
    valor: 48

grades_por_quebra:
  base: { margem: 16, estilo_figma: grid/compact }
  md:   { margem: 24, estilo_figma: grid/default }
  lg:   { margem: 24, estilo_figma: grid/default }
  xl:   { margem: 48, estilo_figma: grid/wide }
  xxl:  { margem: 48, estilo_figma: grid/wide, conteudo_limitado_a: 1440 }

# ---------------------------------------------------------------
# MOTION - the component picks the ROLE, never the duration +
# curve pair. Short scale by decision: long animation is an approved
# anti-reference. REDUCED motion is mandatory in everything that animates.
# ---------------------------------------------------------------
movimento_regras:
  pergunta_antes: "Does this animation explain what changed? If it does not answer where the piece came from, where it went, or what turned into what, it should not exist."
  saida_mais_rapida_que_entrada: true
  entrada: 250
  saida: 150
  linear_so_em: [progresso, girador]
  anime_apenas: [opacidade, transformacao]
  nao_anime: "Width, height and layout position - it stutters in large lists and tables."
  movimento_nunca_e_unico_sinal: true

movimento_reduzido:
  obrigatorio: true
  norma: WCAG 2.3.3
  deslize: opacidade
  escala: opacidade
  giro: "Stops. Static indicator or determinate progress."
  duracao: core/duration/100
  nao_muda: "State color, visible focus and any indication that is not motion. Reducing motion is NOT removing feedback."

tokens_core_duration:
  '100': { valor: 100, css: '--nph-core-duration-100', use: "Immediate feedback: hover, focus, background color." }
  '200': { valor: 150, css: '--nph-core-duration-200', use: "State change, and layer exit." }
  '300': { valor: 250, css: '--nph-core-duration-300', use: "Layer that appears, and expansion." }
  '400': { valor: 400, css: '--nph-core-duration-400', use: "Large movement. NEVER in a repeated interaction." }
  loop:  { valor: 800, css: '--nph-core-duration-loop', use: "Continuous loop of the spinner: 800 ms per turn, infinite repetition. OUTSIDE the transition scale, which ends at 400 and describes movement that starts and ends; a loop repeats. Decision by Indiane on 02-09-2026 (PF-05)." }

tokens_core_easing:
  standard: { valor: 'cubic-bezier(0.4, 0, 0.2, 1)', css: '--nph-core-easing-standard', use: "Accelerates and decelerates. What changes in place." }
  enter:    { valor: 'cubic-bezier(0, 0, 0.2, 1)',   css: '--nph-core-easing-enter',    use: "Only decelerates. What APPEARS: arrives fast and brakes as it settles." }
  exit:     { valor: 'cubic-bezier(0.4, 0, 1, 1)',   css: '--nph-core-easing-exit',     use: "Only accelerates. What DISAPPEARS: starts slowly and leaves fast." }
  linear:   { valor: 'linear', css: '--nph-core-easing-linear', fonte_json: 'cubicBezier [0, 0, 1, 1] - the exact equivalent, because cubicBezier is the DTCG type the system uses for curves (PF-16)', css_gerado: 'cubic-bezier(0, 0, 1, 1)', use: "Constant speed. ONLY progress and spinner. DO NOT USE in an interface transition." }

tokens_motion:
  regra_do_par: "Each motion role is TWO tokens: -duration and -easing. They go together and NEVER mix between roles - do not use the enter duration with the exit curve. Shape aligned with Figma on 24-08-2026, by decision of Indiane: each token is a variable and a custom property. No value changed. There are SIX roles since 03-09-2026, when the spinner loop came in (PF-05)."

  motion/hover-duration:
    css: '--nph-motion-hover-duration'
    alias: core/duration/100
    valor: 100
    use: "Hover, focus and background color change. It needs to feel instantaneous — whoever hovers is already heading to the next thing."
  motion/hover-easing:
    css: '--nph-motion-hover-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "The curve of the hover role. USE always together with motion/hover-duration."

  motion/state-duration:
    css: '--nph-motion-state-duration'
    alias: core/duration/200
    valor: 150
    use: "State change that STAYS: selection, checkbox, toggle, tab change."
  motion/state-easing:
    css: '--nph-motion-state-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "The curve of the state role. USE always together with motion/state-duration."

  motion/enter-duration:
    css: '--nph-motion-enter-duration'
    alias: core/duration/300
    valor: 250
    use: "Layer that APPEARS from outside: popover, menu, tooltip, dialog, side panel."
  motion/enter-easing:
    css: '--nph-motion-enter-easing'
    alias: core/easing/enter
    valor: 'cubic-bezier(0, 0, 0.2, 1)'
    use: "The curve of the enter role - decelerates as it arrives. USE always together with motion/enter-duration."

  motion/exit-duration:
    css: '--nph-motion-exit-duration'
    alias: core/duration/200
    valor: 150
    use: "The same layer leaving. Faster than the entrance on purpose: whoever closed it has already decided."
  motion/exit-easing:
    css: '--nph-motion-exit-easing'
    alias: core/easing/exit
    valor: 'cubic-bezier(0.4, 0, 1, 1)'
    use: "The curve of the exit role - accelerates as it leaves. USE always together with motion/exit-duration."

  motion/expand-duration:
    css: '--nph-motion-expand-duration'
    alias: core/duration/300
    valor: 250
    use: "Piece that grows or shrinks IN PLACE: accordion, expandable panel, table row that opens."
  motion/expand-easing:
    css: '--nph-motion-expand-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "The curve of the expand role. USE always together with motion/expand-duration."

  motion/loop-duration:
    css: '--nph-motion-loop-duration'
    alias: core/duration/loop
    valor: 800
    use: "Continuous loop: the spinner in rotation, with infinite repetition. USE always together with motion/loop-easing."
  motion/loop-easing:
    css: '--nph-motion-loop-easing'
    alias: core/easing/linear
    valor: 'cubic-bezier(0, 0, 1, 1)'
    use: "The curve of the loop role - constant speed, with no start or end. USE always together with motion/loop-duration. It is this role that makes the spinner consumable without touching core/*, as rule 4 requires."

# ---------------------------------------------------------------
# ICONS - Font Awesome Pro library. The question that comes BEFORE the
# token: can this icon stand alone? An icon is a recognition
# shortcut; it does not replace a label. The icon INHERITS the text
# color - there is no icon color token.
# ---------------------------------------------------------------
icone_regras:
  acervo: Font Awesome Pro
  familia_padrao: 'Classic Regular'
  familia_ativo: 'Classic Solid'
  familia_padrao_regra: 'Classic is the default family. Every content, action, state, feedback and direction icon is Classic - Regular in the normal state, Solid on the active item inside a group.'
  duotone_navegacao: 'Duotone is ALLOWED, and ONLY in structural navigation: menu, sidebar, navigation group, shortcut and location indicator. It serves to mark the navigation territory, together with sidebar/*, width and position.'
  duotone_proibido_fora_da_navegacao: 'OUTSIDE structural navigation, Duotone remains forbidden. DO NOT USE on a button, field, feedback, validation, alert, table or destructive action.'
  duotone_nao_mistura: 'NEVER mix Duotone and Classic inside the same navigation group. The whole group is of a single family.'
  estilos_proibidos: [light, thin, sharp]
  historico_duotone: 'SUPERSEDED on 24-08-2026, by decision of Indiane. The previous rule said: `Classic. NAO existe Duotone no Nephos: o bars, unico icone de navegacao do nucleo, nao existe em Duotone no acervo, e uma regra cujo unico caso nao pode ser cumprido nao e regra.` (Classic. There is NO Duotone in Nephos: bars, the only navigation icon of the core, does not exist in Duotone in the library, and a rule whose only case cannot be met is not a rule.) Preserved as a record; it is NOT the current rule. See duotone_navegacao.'
  cor: "Inherits from the context via currentColor. There is NO icon color token."
  caixa: "Always square. The Font Awesome drawing is not square by nature: it is centered and scaled by height."
  espaco_ate_o_texto: space/inline-tight
  alinhamento: "Centers on the text line box, not on the letter height."
  nunca_e_unico_sinal: true
  pode_andar_sozinho: "Only a universal and recurring symbol: close, search, menu, back, more options. Always with an accessible label."
  nunca_anda_sozinho: "An action with consequences (delete, approve, publish, export) and any domain-specific action."

icone_acessibilidade:
  contraste: "3:1 for a meaningful icon - WCAG 1.4.11."
  sem_texto_visivel: "aria-label required."
  com_texto_ao_lado: "aria-hidden on the icon, otherwise the screen reader reads it twice."
  alvo_de_toque: "The icon is not the target. The target is the surrounding control, with control/height-large on a touch screen."

icone_licenca:
  token: "CI environment variable and password manager. NEVER in a versioned file, documentation or portal."
  arquivos: "DO NOT commit the Pro package. Only the reference in package.json."
  build: "The package is pulled at build time. The compiled product may contain the icons - that is licensed use."

icone_componente_figma:
  conjunto: 'icon'
  onde: 'Figma DS-IA-NEPHOS 5.0, page `Icones`, frame `Componentes — icon`'
  regra_de_leitura: 'Consult Figma to state the current matrix: names, variants, categories, bindings and counts. This contract does not record canvas state nor library availability.'
  tamanho_nao_e_variante: 'The size comes from the tokens icon/size-sm (16), icon/size-md (20) and icon/size-lg (24). In code it is a custom property, not a variant. The box is always square; the drawing is centered and scaled by height.'
  cor: 'The fill inherits currentColor from the context. DO NOT paint it by hand.'
  duotone: 'Only create Duotone for an approved structural navigation icon, after current evidence in Figma and a human decision. If the change expands the API, the core or the implemented artwork, explain the conflict and follow the P21 review process before changing the contract or the code.'

tokens_icon:
  icon/size-sm:
    css: '--nph-icon-size-sm'
    alias: core/icon-size/100
    valor: 16
    use: "DEFAULT. Inside a control, table cell, field, and next to 14px text. When in doubt, it is this one."
  icon/size-md:
    css: '--nph-icon-size-md'
    alias: core/icon-size/200
    valor: 20
    use: "Menu item, tab and highlighted action, where 16 is small next to the label. DO NOT USE inside a button with text. On the icon-only nph-button, the icon follows the box: md in default."
  icon/size-lg:
    css: '--nph-icon-size-lg'
    alias: core/icon-size/300
    valor: 24
    use: "Section header, empty state, an icon that carries meaning alone and the large icon-only nph-button. DO NOT USE on a dense screen or in a list."

icones_nucleo:
  navegacao_e_menus:
    familia: 'Classic Regular'
    icones: [bars, house]
  direcao_e_revelacao:
    familia: 'Classic Regular'
    icones: [angle-left, arrow-down-to-line, arrow-left, arrow-right, arrow-up, caret-up, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, circle-chevron-down, circle-chevron-left, circle-down, circle-up, ellipsis, eye, eye-slash, square-chevron-left, triple-chevrons-left]
    nota: 'ellipsis (horizontal) means OMITTED ITEMS - pagination, breadcrumb. Do not confuse with ellipsis-vertical, which means MORE ACTIONS ON THIS ROW and lives in action.'
  acao:
    familia: 'Classic Regular'
    icones: [arrow-down-arrow-up, arrow-up-arrow-down, arrow-up-from-bracket, check, circle-half-stroke, cloud-arrow-up, download, ellipsis-vertical, filter, filter-slash, gear, grid-2, grip-vertical, link, list, magnifying-glass, minus, paper-plane, paperclip, pen, pen-to-square, plus, print, right-to-bracket, rotate-right, share, share-from-square, thumbs-down, thumbs-up, thumbtack, thumbtack-slash, trash, trash-can, user-circle-minus, user-circle-plus, user-minus, xmark]
  estado_e_comunicacao:
    familia: 'Classic Regular'
    icones: [alarm-clock, badge-check, bell, circle-check, circle-info, circle-notch, circle-question, circle-xmark, heart, lock, question, star, triangle-exclamation]
    variantes: {todos: 'Regular is the default; Solid is available for every name in the library.'}
    nota: 'The first five are one for each system state. Every state carries an icon besides the color. circle-notch is the spinner: a ring with a cut, made for continuous rotation with core/easing/linear.'
  conteudo_e_dados:
    familia: 'Classic Regular'
    icones: [calendar, calendar-days, circle-user, clipboard, clock, comment, envelope, file, files, folder, folder-open, font-awesome, globe, inbox, key, location-dot, suitcase, tag, trophy, user]

icones_segunda_leva:
  pendente: false
  entrou_em: '2026-08-20'
  icones: [pen-to-square, trash-can, eye, eye-slash, arrow-up-from-bracket, download, star, gear, filter, filter-slash, circle-notch]

icones_terceira_leva:
  pendente: false
  entrou_em: '2026-08-20'
  icones: [minus, ellipsis, arrow-right]
  motivo: 'Each one required by a component already committed in the v1 list: minus by the indeterminate nph-checkbox and by the decrement of the numeric nph-input; ellipsis by nph-pagination; arrow-right as the pair of arrow-left, which was already in the core.'
  trocas: 'circle-notch came in instead of spinner: the classic spinner turns in eight discrete steps and the motion foundation set continuous rotation. filter-slash was added to clear a filter.'
  largura: 'eye, eye-slash and star have a natural width of 18, above the 16 of the box. The box normalizes height and alignment, not width.'

icones_nomenclatura:
  versao: 'Font Awesome 6'
  aviso: 'FA5 used other names: times, search, info-circle, exclamation-triangle, ellipsis-v.'
  fora_da_lista: 'If the component needs an icon that is not on the list, it is a gap: ask before adding.'

contrato_nph_icon:
  name: "Name of the icon in the library, in kebab-case. Only what exists in Font Awesome."
  variant: "regular (default) or solid."
  size: "sm, md or lg. No free value."
  label: "Accessible label. Empty marks the icon as decorative and applies aria-hidden."
  cor: "It is NOT a property. Inherits from the context."

# ---------------------------------------------------------------
# CHART COLOR - four families. All are aliases of primitives
# that already existed: no new primitive. The question the data asks
# decides the family. Categorical for "which", sequential for
# "how much", diverging for "how much above or below", support for the
# frame. COLOR NEVER IDENTIFIES ALONE: every series carries a direct
# label, marker shape or ordered position.
# ---------------------------------------------------------------
chart_regras:
  maximo_categorias: 6
  excedente: 'From the seventh category on, group into "Others" with chart/muted.'
  ordem: 'Fixed. chart/1 is always the first series. Two charts with the same categories on the same screen use the same colors.'
  segundo_canal: 'Mandatory. Up to 4 series, direct label on the data. In line and scatter, marker shape. Above that, ordered position with the legend next to the data.'
  estado: 'The series NEVER carries state. A red bar does not mean bad. State comes in through chart/reference and through a marker with a state token.'
  marca_ativa: 'The chart series does NOT follow the active brand. A chart that changes color along with the theme is no longer comparable across verticals.'
  serie_por_vertical: 'When the series IS the vertical, use brand/*, with a mandatory direct label. The seven brand colors sit at a perceptual distance of 10,1 from one another: enough to confirm, not enough to identify. NEVER use brand/* as a generic categorical palette.'
  texto_do_grafico: 'Axis label and legend use color/muted-foreground. Title uses color/foreground. There is no chart-specific text token.'
  verificacao: 'Each pair compared under typical vision, protanopia, deuteranopia and tritanopia. Worst pair: 18,0 in light and 14,2 in dark. Minimum contrast against the background: 3,52:1 in light and 4,62:1 in dark (WCAG 1.4.11 requires 3:1).'
  nao_coberto: 'Grayscale reading. The series separates by hue, not by lightness.'

tokens_chart:
  chart/1:
    css: '--nph-chart-1'
    claro: core/sistemas/700
    escuro: core/sistemas/200
    use: "First series of a categorical chart. Always the first: the order is fixed."
    nao_use: "To mean a state. Outside a chart."
  chart/2:
    css: '--nph-chart-2'
    claro: core/educacao/700
    escuro: core/educacao/300
    use: "Second series of a categorical chart."
    nao_use: "As the first series, nor to mean a state."
  chart/3:
    css: '--nph-chart-3'
    claro: core/financeiro/400
    escuro: core/financeiro/200
    use: "Third series of a categorical chart."
    nao_use: "To mean success: it is a series, not a state."
  chart/4:
    css: '--nph-chart-4'
    claro: core/igrejas/500
    escuro: core/igrejas/300
    use: "Fourth series of a categorical chart."
    nao_use: "To mean error or loss."
  chart/5:
    css: '--nph-chart-5'
    claro: core/info/500
    escuro: core/info/500
    use: "Fifth series of a categorical chart. The only series token with the same value in both modes."
    nao_use: "To mean information: the hue is a neighbor of status/info, but the role is different."
  chart/6:
    css: '--nph-chart-6'
    claro: core/help/500
    escuro: core/help/300
    use: "Sixth and last series of a categorical chart."
    nao_use: "To mean help. Since a seventh series does not exist, group the excess into chart/muted."
  chart/1-soft:
    css: '--nph-chart-1-soft'
    claro: core/sistemas/200
    escuro: core/sistemas/800
    use: "Wash under the first series: area under the curve, confidence band, selection halo."
    nao_use: "On a stacked band or on a mark that carries identity: there the full chart/1 goes."
  chart/2-soft:
    css: '--nph-chart-2-soft'
    claro: core/educacao/200
    escuro: core/educacao/800
    use: "Wash under the second series."
    nao_use: "On a stacked band or on a mark that carries identity."
  chart/3-soft:
    css: '--nph-chart-3-soft'
    claro: core/financeiro/200
    escuro: core/financeiro/800
    use: "Wash under the third series."
    nao_use: "On a stacked band or on a mark that carries identity."
  chart/4-soft:
    css: '--nph-chart-4-soft'
    claro: core/igrejas/200
    escuro: core/igrejas/800
    use: "Wash under the fourth series."
    nao_use: "On a stacked band or on a mark that carries identity."
  chart/5-soft:
    css: '--nph-chart-5-soft'
    claro: core/info/200
    escuro: core/info/800
    use: "Wash under the fifth series."
    nao_use: "On a stacked band or on a mark that carries identity."
  chart/6-soft:
    css: '--nph-chart-6-soft'
    claro: core/help/200
    escuro: core/help/800
    use: "Wash under the sixth series."
    nao_use: "On a stacked band or on a mark that carries identity."
  chart/seq-1:
    css: '--nph-chart-seq-1'
    claro: core/sistemas/100
    escuro: core/sistemas/900
    use: "Step 1 of 5 of the sequential scale: the LOWEST value."
    nao_use: "For a category: sequential expresses quantity, not type."
  chart/seq-2:
    css: '--nph-chart-seq-2'
    claro: core/sistemas/300
    escuro: core/sistemas/700
    use: "Step 2 of 5 of the sequential scale."
    nao_use: "For a category."
  chart/seq-3:
    css: '--nph-chart-seq-3'
    claro: core/sistemas/500
    escuro: core/sistemas/500
    use: "Step 3 of 5 of the sequential scale: the middle."
    nao_use: "For a category."
  chart/seq-4:
    css: '--nph-chart-seq-4'
    claro: core/sistemas/700
    escuro: core/sistemas/300
    use: "Step 4 of 5 of the sequential scale."
    nao_use: "For a category."
  chart/seq-5:
    css: '--nph-chart-seq-5'
    claro: core/sistemas/900
    escuro: core/sistemas/100
    use: "Step 5 of 5 of the sequential scale: the HIGHEST value."
    nao_use: "For a category."
  chart/div-1:
    css: '--nph-chart-div-1'
    claro: core/danger/700
    escuro: core/danger/300
    use: "Step 1 of 7 of the diverging scale: negative extreme."
    nao_use: "For a category. In a red-green diverging scale."
  chart/div-2:
    css: '--nph-chart-div-2'
    claro: core/danger/500
    escuro: core/danger/500
    use: "Step 2 of 7 of the diverging scale: strong negative."
    nao_use: "For a category."
  chart/div-3:
    css: '--nph-chart-div-3'
    claro: core/danger/200
    escuro: core/danger/700
    use: "Step 3 of 7 of the diverging scale: light negative."
    nao_use: "For a category."
  chart/div-4:
    css: '--nph-chart-div-4'
    claro: core/neutral/100
    escuro: core/surface/600
    use: "Center of the diverging scale. Marks the real zero, the target reached, the no-deviation point. The only color of the scale that does not mean a direction."
    nao_use: "Centered on the sample mean: the same data would change sign when the sample changed."
  chart/div-5:
    css: '--nph-chart-div-5'
    claro: core/sistemas/200
    escuro: core/sistemas/700
    use: "Step 5 of 7 of the diverging scale: light positive."
    nao_use: "For a category."
  chart/div-6:
    css: '--nph-chart-div-6'
    claro: core/sistemas/500
    escuro: core/sistemas/500
    use: "Step 6 of 7 of the diverging scale: strong positive."
    nao_use: "For a category."
  chart/div-7:
    css: '--nph-chart-div-7'
    claro: core/sistemas/700
    escuro: core/sistemas/300
    use: "Step 7 of 7 of the diverging scale: positive extreme."
    nao_use: "For a category."
  chart/grid:
    css: '--nph-chart-grid'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Grid line. Lighter than color/border on purpose: the grid guides reading, it does not delimit an area."
    nao_use: "On the axis. The axis is chart/axis and must meet 3:1."
  chart/axis:
    css: '--nph-chart-axis'
    claro: core/neutral/400
    escuro: core/surface/400
    use: "Axis line and scale ticks. Meets 3:1 against the background in both modes, because the axis is graphical content required to understand the data."
    nao_use: "On a grid line: making the two equal erases the chart hierarchy."
  chart/reference:
    css: '--nph-chart-reference'
    claro: core/neutral/700
    escuro: core/neutral/200
    use: "Goal, target, mean or limit line. ALWAYS dashed and ALWAYS labeled. This is how state comes into the chart."
    nao_use: "For a data series: a reference is a comparison, not a measure."
  chart/empty:
    css: '--nph-chart-empty'
    claro: core/neutral/100
    escuro: core/surface/700
    use: "Fill of an area without data and empty state of the chart."
    nao_use: "For the zero value: zero is data and goes in the series color."
  chart/muted:
    css: '--nph-chart-muted'
    claro: core/neutral/500
    escuro: core/neutral/400
    use: "Dimmed series when another is highlighted, and the Others grouping from the seventh category on."
    nao_use: "For a disabled control: disabled is state/disabled-opacity on the whole control."
  chart/track:
    css: '--nph-chart-track'
    claro: core/neutral/200
    escuro: core/surface/600
    use: "Track background in a meter, progress bar and bullet chart: the part not yet filled."
    nao_use: "As an area without data: there chart/empty goes."

fundacoes_pendentes: []
---
# design.md — Nephos

> **For Moses.** This file is the system contract. The YAML above gives the **values**; the text below gives the **criteria**. You need both.
>
> **Lookup order:** 1) this file · 2) the spec of the component you are going to use · 3) if the answer is in neither, **ask** — see §8.

---

## 1. Hard rules

Absolute imperative. They are not preferences.

1. Every component is a Web Component with the **strict** prefix `nph-`. The corresponding CSS class is `.nph-<nome-do-componente>`.
2. **NEVER** use React, Vue, Angular, Svelte or any component framework. **NEVER** use Tailwind or any utility CSS. **NEVER** install shadcn/ui, Radix or any component library — shadcn is a visual reference, never a code dependency.
3. **NEVER** write a literal color, spacing, font or radius value in component CSS. Only `var(--nph-*)`.
4. Components consume **only** `tokens_semantic`. **NEVER** consume `tokens_core` directly.
5. Color is **NEVER** the only indicator. Every state carries an icon and text besides the color.
6. Visible focus is mandatory on every focusable element and is **NEVER** removed. It is the `focus/ring` ring, through a `focus-ring/*` style, or, where the accepted Figma draws border and halo — as on the `nph-button` and on the `info` trigger of the `nph-label` —, the focus border of `border/width`, flush, with the halo of `focus/ring-width` outside (see `focus-ring/default`).
7. Every surface that carries text meets **4,5:1**; every control boundary meets **3:1** (WCAG 2.1 AA).
8. **NEVER** create a new token, component, icon or pattern to work around a gap. See §8.

---

## 2. Color — selection criteria

When two tokens seem to fit, this is what decides.

| Question | Rule |
|---|---|
| `muted` × `accent` | `muted` is permanent; `accent` is temporary. If the state disappears when the mouse leaves, it is `accent`. Exception: the hover of the ghost secondary `nph-button` is `color/muted`, as Figma draws it. |
| `destructive` × `status/error` | `destructive` is what the **user is going to do**. `status/error` is what the **system has already reported**. The "Delete" button is `destructive`; the message "Invalid CPF" is `status/error`. On the `nph-badge`, the danger type labels a negative state of an item, such as rejected; the system message stays `status/error`. |
| `border` × `input` | `border` is divider and outline. `input` is the boundary of a form control — more visible as required by WCAG 1.4.11. |
| `card` × `popover` | `card` is fixed content on the page. `popover` is a floating layer. |
| `brand/*` × `color/primary` | `brand/*` identifies the vertical when the seven brands need to appear at the same time. `color/primary` is the primary action and comes from the **active brand**, through the `theme` collection. |
| Among the five states | `info` = you need to know · `warning` = may go wrong (before) · `error` = went wrong (after) · `success` = went right (event, not permanent state) · `help` = let me explain |

---

## 2b. Typography — selection criteria

Every text uses one of the fourteen roles of `tokens_typography`. When two seem to fit, this is what decides.

| Question | Rule |
|---|---|
| `body-md` × `label-md` | Both are 14/20. `body` is a sentence; `label` is a tag. If it has a verb and a period, it is `body`. If it names a control or field, it is `label`. |
| `body-lg` × `body-md` | `body-lg` is for reading; `body-md` is for operating. A documentation paragraph is `lg`. Text in a form, table or panel is `md`. |
| `body-sm` × `caption` | Both are 12px. `body-sm` accompanies content; `caption` explains another element — field help, caption, counter, date. |
| `caption` × `body-md` | An error message the user needs to read to fix something is `body-md`. `caption` is accessory. |
| `heading-sm` × `label-lg` | Both are 16/24. The weight changes: `heading-sm` (600) opens a section; `label-lg` (500) names an item. |
| `heading-md` × `heading-lg` | `heading-lg` is the screen title, one per page. A section inside it is `heading-md`. |
| `label-sm` × `caption` | Both are 12px with open letter spacing. `label-sm` (500) is a tag; `caption` (400) is a short sentence. |
| `code` × the rest | `code` is only what is read character by character. A number in a table column is **not** `code` — it is `tnum` in Noto Sans. |

**Emphasis** inside a paragraph is `<strong>` in HTML. There is no emphasis role, and `label` does not serve to highlight a word in running text.

**Large text in WCAG** is ≥ 24px, or ≥ 18,66px in bold. Only `heading-lg` and `heading-xl` qualify. `heading-md`, even at weight 600, requires 4,5:1.

**12px floor.** `body-sm` and `caption` are accessory and never carry essential information.

---

## 2c. Spacing — selection criteria

Space groups. The question is not how much looks nice, but **what these two things are to each other**.

| Relationship | Token |
|---|---|
| They are the same unit | `space/inline-tight` (horizontal) · `space/stack-tight` (vertical) |
| They are independent siblings | `space/inline` (horizontal) · `space/stack` (vertical) |
| They are different subjects | `space/section` |

| Question | Rule |
|---|---|
| `inline-tight` × `stack-tight` | Same value (4), different axes. `inline` is horizontal, `stack` is vertical. Exception: the top and bottom breathing room of the `nph-badge` is `inline-tight`, as Figma draws it. |
| `inline-tight` × `inline` | Inside a unit it is `tight`; between units it is `inline`. An icon in a button is `tight`; a button next to a button is `inline`. |
| `stack` × `section` | 16 is between items of the same list; 32 is between subjects. If there is a new title, it is `section`. |
| `control-padding` × `container-padding` | A control is what is **operated** (button, field, select). A container is what **contains** (card, panel, popover). The `nph-badge` uses `control-padding` on the sides. |
| `container-padding` × page margin | Inside the card it is `container-padding`. The page margin **is not a space token**: it is `layout/margin-compact`, `-default` or `-wide`, which change by breakpoint. |

**Padding is not gap.** Padding is the breathing room inside a box; gap is the distance between boxes. The value may coincide; the intent does not.

**Only one step at a time.** If 16 is tight, the next is 20, then 24. Skipping a step is a symptom of a grouping problem — a card, a divider or a title is missing.

**Touch target.** On a touch-sensitive screen the control uses `control/height-large`. WCAG 2.2 (2.5.8) requires 24×24px and recommends 44×44px; `control/height-compact` fails.

---

## 2d. Radius — selection criteria

The curve says what the piece is. The question is not how much to round.

| The piece… | Token |
|---|---|
| is **operated** | `radius/control` (6) — system default |
| **contains** and floats attached to a trigger | `radius/container` (8); the tooltip is `radius/inner` (4) |
| **floats large** | `radius/overlay` (10) |
| **carries content** without floating | `radius/surface` (14) |
| is a **marker** | `radius/subtle` (2) or `radius/full` |
| is **touching an edge** | `radius/none` (0) |
| is **nested** | `radius/inner` (4) |

| Question | Rule |
|---|---|
| `control` × `container` | A button inside a card: the button is `control`, the card is `container`. |
| `container` × `overlay` | Popover is `container`; tooltip is `inner`. Dialog, modal and side panel are `overlay`. |
| `subtle` × `inner` | `subtle` is a marker that contains nothing. `inner` is a nested element with content. |
| `full` × `control` | `full` only on a small piece whose shape communicates a marker. Button and field are never a pill. |

**Nested radius:** inner = outer − padding. Container at 8 with padding 4 → inner 4. With padding 8 → inner 0 (`radius/none`). Inner never equal to outer.

**Radius is px, not rem.** Shadow too — they are the two foundations like this, and both for the same reason. In rem, the corner would grow with the user font and the piece would change shape.

**Radius does not vary by mode.** Shape is not theme.

---

## 2e. Elevation — selection criteria

| Question | Rule |
|---|---|
| `raised` × `dropdown` | `raised` is **permanent** content on the page. `dropdown` **opens and closes**, attached to a trigger. If it disappears when you click outside, it is `dropdown`. |
| `dropdown` × `modal` | `dropdown` is anchored and **does not block** the page. `modal` **blocks** and comes with a scrim. |
| `none` × `raised` | A piece inside a card is `none`. Elevation does not add up. |
| tooltip × dialog | Tooltip is `dropdown`, however small. Dialog is `modal`, however small. What decides is blocking or not. |

**One level per piece.** Do not stack elevation inside elevation.

**Shadow is not state.** Hover and focus are solved with color and visible focus, never by raising the level.

**In dark there is no shadow.** Elevation comes from the `surface` ramp and from the border — see §3. The shadow colors become transparent by themselves; the effect style is the same in both modes.

**A modal requires `overlay/scrim`.** Without a scrim, the content behind keeps looking available.

**Border and shadow together, no.** In light, the card uses one or the other.

---

## 2f. Grid and layout — selection criteria

**12 columns at every breakpoint.** If the composition does not fit, change how many columns the block occupies — not how many columns exist.

| Question | Rule |
|---|---|
| `layout/gutter` × `space/stack` | The gutter aligns **columns**. `space/stack` separates **items** inside a column. Different things, even with the same value. |
| `layout/max-app` × `layout/max-reading` | Will it be **read** end to end? `max-reading` (720). Will it be **operated**? `max-app` (1440). |
| Page margin | Only `layout/margin-compact`, `-default` and `-wide`, which change by breakpoint. There is no space token for this: `space/page-margin` was removed on 20-08-2026 for duplicating the value without responding to the breakpoint. |

**Margin grows, gutter does not.** 16 · 24 · 48 depending on the screen; gutter always 24.

**A breakpoint is a build value.** A media query does not accept a CSS variable — the four values go into the compilation. It is the only value of the system that does not reach the component as `var()`.

**The shell belongs to the system.** Sidebar 280 and 64, top bar 56. No layout picks its own.

---

## 2g. Motion — selection criteria

**The question comes before the token:** does this animation explain what changed? If it does not answer where the piece came from or what turned into what, it should not exist.

| Question | Rule |
|---|---|
| `hover` × `state` | `hover` disappears when the pointer leaves. `state` is a change that **stays**. |
| `enter` × `expand` | `enter` comes **from outside** and floats. `expand` grows **in place**, pushing the content below. |
| `enter` × `exit` | Same layer, opposite moments — and opposite curves. Do not use `enter` on the exit. |
| `state` × `expand` | A change of appearance is `state`; a change of size is `expand`. |
| any of them × `linear` | `linear` is not a role. It is the curve for progress and spinner. |

**Leaving is faster than entering:** 150 versus 250. On entry the user needs to see where the piece came from; on exit they have already decided.

**The curve declares the direction:** what appears brakes, what disappears accelerates, what changes in place does both.

**Animate opacity and transform.** Width, height and layout position stutter in large lists and tables.

**Reduced motion is mandatory.** Slide and scale become opacity; rotation stops; duration drops to 100. State color and visible focus do **not** change — reducing motion is not removing feedback.

**Motion is never the only sign of a state** — same logic as rule 5.

---

## 2h. Icons — selection criteria

**The question comes before the token: can this icon stand alone?**

| Situation | Rule |
|---|---|
| Can stand alone | Only a universal and recurring symbol — close, search, menu, back, more options. Always with an accessible label |
| Never stands alone | An action with consequences (delete, approve, publish, export) and any domain action |
| Next to text | The icon reinforces, it does not repeat |

| Question | Rule |
|---|---|
| `size-sm` × `size-md` | Inside a control or cell it is `sm`. Next to a label in a menu or tab it is `md`. |
| `size-md` × `size-lg` | `lg` only when the icon carries meaning alone. In a list, never. |
| Regular × Solid | Inside a Classic group: Regular is the normal state, Solid marks the **current** item. |

**The icon inherits the text color** via `currentColor`. There is no icon color token.

**An icon is never the only sign of a state** — same logic as rule 5.

**Without visible text, `aria-label`.** With text next to it, `aria-hidden` — otherwise the screen reader reads it twice.

---

## 2i. Chart color — selection criteria

**The question the data asks decides the family.**

| The question is… | Family | Tokens |
|---|---|---|
| "which?" — types with no order among them | Categorical | `chart/1` to `chart/6`, plus the `-soft` ones |
| "how much?" — quantity with one direction | Sequential | `chart/seq-1` to `chart/seq-5` |
| "how much above or below?" — deviation with a center | Diverging | `chart/div-1` to `chart/div-7` |
| it is the frame of the chart | Support | `grid`, `axis`, `reference`, `empty`, `muted`, `track` |

| Question | Rule |
|---|---|
| A single series | `chart/1`. **Never** `color/primary`: the chart would change color with each brand and the panel would no longer be comparable across verticals. |
| Seven or more categories | Six in `chart/1`–`chart/6`, the rest grouped into "Others" with `chart/muted`. There is no `chart/7`. |
| The series is a vertical | `brand/*`, with a mandatory direct label. It is not the categorical one. |
| Full × `-soft` | Full identifies; `-soft` accompanies. A stacked band is always full. |
| Categorical × sequential | Sequential imposes an order. If the categories have no order, using it invents one. |
| Highlighting a series | Send the others to `chart/muted`. Do not invent a stronger tone outside the scale. |

**Color never identifies alone.** Up to four series, direct label on the data; in line and scatter, marker shape; above that, ordered position with the legend next to the data. It is rule 5 applied to charts.

**The series does not carry state.** A red bar does not mean "bad". State comes in through `chart/reference` and through a marker with a state token.

**Diverging is red ↔ blue.** Never red ↔ green. And the center falls on the real zero, not on the middle of the sample.

---

## 3. Dark mode

It is not an inversion. Three rules:

1. **Elevation lightens.** The `surface` scale is the ramp: sidebar `950` → background `900` → card `800` → popover `700` → dialog `600`. Shadow is not perceived on a dark background — **NEVER** use shadow to simulate elevation in dark.
2. **No pure black or white.** The background is `surface/900`, not `#000000`. Text is `neutral/100`, not white. Absolute black with white text causes halation.
3. **The border lightens much more than symmetry suggests.** `color/border` in light is `neutral/200`; in dark it is **not** `neutral/700` (it would give 2,04:1 and fail) — it is `surface/400`.

**Known limitation:** `color/border` on `color/popover` gives 2,81:1 in dark. On a floating layer, use `color/input` as the border, or let elevation do the separating.

---

## 4. Accessibility

| Criterion | Minimum | Where it applies |
|---|---|---|
| Text contrast | 4,5:1 | any text on any surface |
| Large text contrast | 3:1 | ≥ 24px, or ≥ 18,66px in bold |
| Component contrast | 3:1 | field border, meaningful icon, state indicator |
| Visible focus | mandatory | every focusable element |
| Alternative to color | mandatory | every state, without exception |

Brand cases already solved, and the reason the `-strong` tokens exist. The fix is always on the background, never by lightening the text:

- White on `brand/educacao` (`#ffa92d`) gives **1,92:1**, and on the 600 it gives **2,98:1** - both fail. The tone goes down to the **700** (`#99651b`, 4,96:1). Use `brand/educacao-strong`; in the `Educacao` mode of the `theme` collection, the primary is already the 700 in both schemes.
- White on `brand/sistemas` (`#3b82f6`) gives 3,68:1 - large text only. Use `brand/sistemas-strong` (600, 5,37:1).
- White on `brand/comercial` (`#3e8391`) gives 4,32:1 - large text only. Use `brand/comercial-strong` (600, 6,16:1).
- White on `brand/financeiro` (`#4d7549`) gives 5,25:1 and on `brand/rh` (`#4b207f`) gives 11,59:1 - they pass for normal text, without a variant.

`Educacao` is the only vertical whose primary **does not lighten** in dark mode: it uses the 700 in both schemes, because the amber 400 does not sustain white text. Against the dark background it gives 3,81:1, above the 3:1 required for the boundary of a component.

---

## 5. Anti-patterns

Never do it. Each row is a prevented error.

| # | Never |
|---|---|
| A1 | Consume `tokens_core` directly in a component |
| A2 | Write hexadecimal, `rgb()` or `hsl()` in component CSS |
| A3 | Two `color/primary` buttons in the same decision block |
| A4 | Pin `color/primary` to a value of its own, ignoring the active brand |
| A5 | Use `color/destructive` for a validation error |
| A6 | Use color as the only state indicator |
| A7 | Remove the visible focus |
| A8 | Use `color/muted-foreground` on essential text (it is at the minimum of the standard) |
| A9 | Simulate elevation with shadow in dark mode |
| A10 | Invert tones mechanically between light and dark |
| A11 | Use `success` as a permanent "active" badge |
| A12 | Create a new tone "just this once" |
| A13 | Use a button for simple navigation — navigation is a link |
| A14 | More than two type weights in the same region |
| A15 | Treat a visual reference (shadcn) as a code dependency |
| A16 | Write a literal size, weight or line height — only `var(--nph-text-*)` |
| A17 | Create a size step outside the eight of `core/size` |
| A18 | Use `body-sm` or `caption` for essential information |
| A19 | Treat `heading-md` as large text and loosen the contrast to 3:1 |
| A20 | Switch to the monospace font just to align a number in a column |
| A21 | Use `label` to give emphasis inside a paragraph |
| A22 | More than one `heading-lg` on the same page |
| A23 | Use a variant of the family (Condensed, Display, SemiCondensed) |
| A24 | Write a literal `margin`, `padding` or `gap` — only `var(--nph-space-*)` |
| A25 | Consume `core/space/*` in a component — components use the 7 semantic ones |
| A26 | Use 6, 10, 14 or 18px because "it looked better" |
| A27 | Push an element with a margin to fix alignment |
| A28 | Use the 2px half-step outside chip, icon or table cell |
| A29 | A component defining its own control height |
| A30 | Use `control/height-compact` on a touch-sensitive screen |
| A31 | Solve with distance what needed a card, divider or title |
| A32 | Write a literal `border-radius` — only `var(--nph-radius-*)` |
| A33 | Consume `core/radius/*` in a component |
| A34 | Use a 3, 5 or 10px radius because "it looked better" |
| A35 | Use `radius/full` on a regular button, field or card |
| A36 | Give the same radius to the inner element and to the container |
| A37 | Round what touches the edge of the screen, the table or another element |
| A38 | Define radius in rem |
| A39 | Vary the radius between light and dark — shape is not theme |
| A40 | Write a literal `box-shadow` — only `var(--nph-elevation-*)` |
| A41 | Pick a `shadow/*` color by hand instead of using the elevation style |
| A42 | Simulate elevation with shadow in dark mode *(reinforces A9)* |
| A43 | Stack elevation inside elevation |
| A44 | Dialog without `overlay/scrim` |
| A45 | Raise the elevation level on hover or focus |
| A46 | Create a shadow outside the eight levels |
| A47 | Tint the shadow with the brand color |
| A48 | Border and shadow together on the card in light mode |
| A49 | Change the column count between breakpoints |
| A50 | Use a gutter value outside `layout/gutter` |
| A51 | Let a panel or table stretch beyond `layout/max-app` |
| A52 | Documentation paragraph without `layout/max-reading` |
| A53 | A layout defining its own sidebar width or header height |
| A54 | Use `layout/gutter` to separate items of a list |
| A55 | Create a breakpoint outside the four |
| A56 | Apply the grid style and then position everything outside it |
| A57 | Write a literal duration or curve — only `var(--nph-motion-*)` |
| A58 | Combine duration and curve outside the five roles |
| A59 | Use 180 or 320ms because "it looked better" |
| A60 | Give the exit the same duration as the entrance, or more |
| A61 | Use `linear` in a transition that is not progress or spinner |
| A62 | Transition width, height or position in large lists and tables |
| A63 | Animate something that does not explain a change |
| A64 | A component that animates without handling reduced motion |
| A65 | Communicate a state only through animation |
| A66 | Use `core/duration/400` in a repeated interaction |
| A67 | Icon alone on an action with consequences — delete, approve, publish, export |
| A68 | Use an icon size outside `icon/size-sm`, `-md` and `-lg` |
| A69 | Mix Font Awesome with an icon from another source or drawn by hand |
| A70 | Use Light or Thin |
| A70b | Use Sharp, or any family outside Classic and Duotone |
| A70c | Use Duotone outside structural navigation — on a button, field, feedback, validation, alert, table or destructive action |
| A70d | Mix Duotone and Classic inside the same navigation group |
| A71 | Paint the icon with a color other than that of the context |
| A72 | Mix Solid and Regular in the same group without one marking the active state |
| A73 | Icon without visible text and without `aria-label` |
| A74 | Icon that only repeats the label next to it |
| A75 | Communicate a state only through the icon |
| A76 | Commit files of the Font Awesome Pro package to the repository |
| A77 | Go beyond six series in a categorical chart instead of grouping into "Others" |
| A78 | Use the seven `brand/*` as a generic categorical palette |
| A79 | Red ↔ green diverging scale |
| A80 | Center the diverging scale on the sample mean instead of the real zero |
| A81 | Leave the series color as the only channel, without label, shape or order |
| A82 | Tie the chart series to the active brand, or use `color/primary` as a series color |
| A83 | Use `chart/N-soft` on a stacked band or on any mark that carries identity |
| A84 | Use a state color to mean a state inside a series |
| A85 | Use `chart/empty` for the zero value |
| A86 | Make `chart/grid` and `chart/axis` equal, erasing the chart hierarchy |

---

## 6. Anti-references

What Nephos must **not** look like.

| Do not look like | Why |
|---|---|
| 2010s admin panel — gray on gray, borders on everything | Hierarchy is made with space, not with lines |
| Colorful institutional website — gradients, brand color on every surface | Color needs to mean something, not decorate |
| Consumer interface — long animation, large illustration, informal tone | The user is working, many hours a day |
| "Gamer" dark theme — absolute black, neon accent, high saturation | Tiring over a long workday and fails on contrast |

> **[Confirmed]** Anti-references approved by Indiane on 19-08-2026.

---

## 7. Naming

- **Token:** name in English, description in Portuguese. `color/primary`, `status/error`.
- **CSS:** `--nph-` + the token name with `/` becoming `-`. `color/primary` → `--nph-color-primary`.
- **Component:** `nph-<nome-em-kebab-case>`. Class: `.nph-<nome>`.
- **Component variant:** follows the shadcn vocabulary, which the team already speaks.
- **Type role:** `text/<grupo>-<tamanho>`, as in `text/body-md`. In Figma it is a **text style**, not a variable — color has three variable layers, typography has a primitive in `core` plus the style.

**Notice to the agent:** the names follow shadcn and name **position**, not intent. `primary` does not say what it is for. **The intent is in the `use` field of each token in the YAML.** In this system, reading only the name is not enough.

---

## 8. Procedure for gaps

This is the section that prevents invention. Follow it in order.

1. **Look in `tokens_semantic`.** The `use` field of each token says what it is for.
2. **Not found?** Open the spec of the closest component. Its "Relationships" (`Relações`) section says what combines.
3. **Still not found?** **STOP.** Do not pick the most similar token. Do not create a new value. Do not adapt a component.
4. **Return a question**, in this format:

```
GAP — <what I needed>
Context: <the screen, the flow, the action>
What exists today: <the closest token or component, and why it does not fit>
Decision needed: <the objective question>
Who decides: <UX / engineering / product>
```

5. **Mark the output as incomplete.** Do not deliver a screen with a gap filled by assumption without declaring that it was an assumption.

> Inherit or ask. Never invent.

---

## 9. Pointers

Before building or modifying a component, **open its metadata file**.

| Where | What |
|---|---|
| `fichas/_modelo.md` | The template of every spec: half YAML with the values, half Markdown with the criteria. Copy from it; do not invent structure |
| `fichas/<nome-do-componente>.md` | Function, variants, states, invalid combinations, accessibility, tokens, relationships, anti-patterns |
| `fichas/blocos/<nome>.md` | Composition, when to use, when not, in which layout it appears |
| Storybook | Rendered states and variants |
| `Lista de componentes — Nephos v1` (component list), in the vault | Scope: the 75 public components and the 6 waves, closed on 26-08-2026 |

> **Current decision — reviewed and approved by Elvys on 28/08/2026.** The
> directory organization is in
> [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) (P03). The P03
> directory pattern is already applied in each component of `src/components/`.
> The corresponding specs are in `fichas/`.

---

## 10. Open items of this document

| # | What | Who decides |
|---|---|---|
| 1 | ~~Identity~~ Resolved on 19-08-2026: personality **institutional, human and efficient**; primary user: development professionals who build and maintain IATec corporate interfaces, with Moses as the main technical consumer;  references with a defined function | Indiane |
| 2 | ~~Anti-references (§6) — proposal~~ Resolved on 19-08-2026, by decision of Indiane | Indiane |
| 3 | ~~Typography foundation~~ Resolved on 20-08-2026: 14 roles, base 14px, Noto Sans + IBM Plex Mono | Indiane |
| 3b | ~~**Responsive typography**~~ Resolved on 20-08-2026: **the scale is fixed in the interface** | Indiane |
| 3c | ~~**Italic and underline**~~ Resolved on 20-08-2026: **they are a rule, not a role** | Indiane |
| 3d | ~~Spacing foundation~~ Resolved on 20-08-2026: base 4 with a half-step of 2, 7 semantic intent tokens and 3 control heights | Indiane |
| 3e | ~~**Responsive spacing and maximum widths**~~ Resolved on 20-08-2026: **`space/*` is fixed**, the page margin is `layout/margin-*`, and the maximum widths are `layout/max-app` and `max-reading` | Indiane |
| 3f | ~~Radius foundation~~ Resolved on 20-08-2026: 8 steps, 6px default on controls, full shape restricted to markers | Indiane |
| 3g | ~~**Radius on a partial corner**~~ Resolved on 20-08-2026: **it is a rule, not a token** — see `regras_raio_parcial` | Indiane |
| 3h | ~~Shadow and elevation foundation~~ Resolved on 20-08-2026: 8 levels, two layers where applicable, transparent shadow in dark, plus the modal scrim | Indiane |
| 3i | ~~**The modal has no step in the dark ramp**~~ Resolved on 20-08-2026: **`color/dialog` at `surface/600`** | Indiane |
| 3j | ~~**Inner shadow**~~ Resolved on 20-08-2026: **it does not come in** — a sunken field uses `color/muted` on the background and `color/input` on the border | Indiane |
| 3k | ~~Grid and layout foundation~~ Resolved on 20-08-2026: 12 columns, 4 breakpoints, two maximum widths and the shell measures | Indiane |
| 3l | **Shell behavior** — at which breakpoint the bar collapses — is layout anatomy and depends on a real screen or an approved mock | Indiane |
| 3m | ~~Motion foundation~~ Resolved on 20-08-2026: 4 durations, 4 curves, 5 roles and the reduced motion rule. **The seven foundations are closed** | Indiane |
| 3n | ~~**Loop duration**~~ **Resolved on 02-09-2026: 800 ms per turn of the spinner**, with the `linear` curve and infinite repetition. It entered the code on 03-09-2026 as `core/duration/loop` and the `motion/loop-*` role. **The indeterminate bar still has no value** — `nph-progress` was deferred | Indiane |
| 3o | ~~**Icons**~~ Resolved on 20-08-2026: rules, sizes, contract, library and the complete core of **34 icons**, in three batches | Indiane |
| 4 | ~~Chart colors — they do not exist~~ Resolved on 20-08-2026: four families, 30 semantic tokens, verified under the three vision deficiencies | Indiane |
| 5 | ~~Alpha — transparencies without a token~~ Resolved on 20-08-2026: 19 alpha primitives in black and white, plus `overlay/scrim`, `overlay/on-media` and `state/disabled-opacity` | Indiane |
| 6 | ~~Which file is canonical: the CSS or this YAML~~ Decided on 24-08-2026: Figma is the visual source; this `design.md` is the human and agentic contract; JSON will be the versioned technical source of audited values; CSS custom properties will be generated from the JSON. See `docs/decisoes-tecnicas.md` (P17). | Indiane — reviewed and approved by Elvys on 28-08-2026 |
| 7 | ~~Directory path (§9)~~ Decided on 24-08-2026: pattern recorded in `docs/decisoes-tecnicas.md` (P03), applied from the first component on. | Indiane — reviewed and approved by Elvys on 28-08-2026 |
| 8 | ~~Dark mode was calculated, not seen~~ Resolved on 18-08-2026: `Cor` page in Figma, light and dark side by side | Indiane |
| 9 | **Hatching pattern** for a chart printed in black and white. The categorical series separates by hue, not by lightness | Indiane |
