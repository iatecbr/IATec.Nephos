---
sistema: Nephos
versao: 1.8
status: working contract of the `v/5.0.0` branch
fonte_tecnica_dos_valores: >-
  The audited values live in `src/tokens/source/*.tokens.json`,
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
  expectedCount, and npm run build:tokens shows the totals and fails when a
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
saida_alvo: semantic HTML + CSS custom properties, consuming the nph- Web Components in Lit directly. No PrimeNG.
regra_de_leitura: >-
  Before building or changing any UI, read "GOVERNANCA.md" and this file.
  Before using a component, open its spec.
  When facing a gap: ask. Never invent.
modos: [claro, escuro]

# ---------------------------------------------------------------
# LAYER 1 - PRIMITIVES. No component CSS consumes from here; a component
# token aliases one straight only by decision.
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
  slate:
    '50': { valor: '#f6f8fa', css: '--nph-core-slate-50' }
    '100': { valor: '#e6eaef', css: '--nph-core-slate-100' }
    '200': { valor: '#bfc6d1', css: '--nph-core-slate-200' }
    '300': { valor: '#8896aa', css: '--nph-core-slate-300' }
    '400': { valor: '#6f7d91', css: '--nph-core-slate-400' }
    '500': { valor: '#586679', css: '--nph-core-slate-500' }
    '600': { valor: '#445163', css: '--nph-core-slate-600' }
    '700': { valor: '#323e4e', css: '--nph-core-slate-700' }
    '800': { valor: '#222c3a', css: '--nph-core-slate-800' }
    '900': { valor: '#141c28', css: '--nph-core-slate-900' }
    '950': { valor: '#080f18', css: '--nph-core-slate-950' }
  surface:
    '25': { valor: '#fafcfe', css: '--nph-core-surface-25' }
    '50': { valor: '#f5f8fd', css: '--nph-core-surface-50' }
    '75': { valor: '#eff4fa', css: '--nph-core-surface-75' }
    '100': { valor: '#e9eff7', css: '--nph-core-surface-100' }
    '150': { valor: '#e1e8f2', css: '--nph-core-surface-150' }
    '200': { valor: '#d6dfeb', css: '--nph-core-surface-200' }
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
    escuro: core/slate/900
    use: "Page background and background of any area that is not a card. Also the active tab of the segmented nph-tabs and the counter inside its rail (tabs/item-background-active, tabs/counter-background-rail). Also the background of the nph-tree-table branch error row at rest and in focus (tree-table/row-background), as the table row. Also the background of the nph-rich-text-editor box (rich-text-editor/background)."
    nao_use: "On a card, popover or sidebar."
  color/foreground:
    css: '--nph-color-foreground'
    claro: core/base/black
    escuro: core/slate/100
    use: "Default text on the base background. Also the phrase of the nph-file-upload drop zone and the file name of the nph-file-upload-item, including over status/error-surface, status/warning-surface and status/success-surface (file-upload/foreground, file-upload-item/foreground): the neutral text measures 14.13:1 or more over those surfaces, and the status is also told by icon and text. Also the label of the nph-tree item and the texts of its error row (tree/item-foreground). Also the text of the nph-scheduler (scheduler/foreground). Also the title of the nph-collapsible trigger (collapsible/title-foreground). Also the label of the nph-menubar top item at rest, in focus and disabled (menubar/trigger-foreground). Also the title of the nph-timeline item, except on the pending item (timeline/title-foreground). Also the nph-chart: the value and the number of the highlight, the value label, the slice percentage, the donut total, the legend value and the error sentence (chart/foreground), and the legend item name on hover, with no background (chart/legend-item-foreground-hover). Also the message and the Try again action of the nph-tree-table branch error row at rest and in focus (tree-table/error-foreground). Also the text of the nph-rich-text-editor content: paragraph, headings, list and quote (rich-text-editor/foreground)."
    nao_use: "On color/primary or on a state color."
  color/primary:
    css: '--nph-color-primary'
    claro: theme/brand-600
    escuro: theme/brand-400
    use: "Background of the most important action on the screen. Comes from the active brand: Nephos is multi-brand and primary changes when the brand changes. Also the background of the solid nph-badge, which labels a state or category by its meaning, and of the active tab of the solid nph-tabs tab button (tabs/button-solid-background-active), and of the active rail button and the corner button of nph-sidebar (sidebar/rail-background-active), with color/primary-foreground on top (sidebar/rail-foreground-active). Also the decorative dot of the nph-timeline history item (timeline/dot-background), in a non-interactive piece, with aria-hidden: the item text carries the meaning. Also the check of the selected rich option (select/option-marker): 5.37:1 light and 4.59:1 dark over color/popover, 4.99:1 and 4.04:1 over the hover layer."
    nao_use: "Two primaries in the same decision block. Pinning a value of its own, ignoring the active brand."
  color/primary-foreground:
    css: '--nph-color-primary-foreground'
    claro: theme/brand-on-600
    escuro: theme/brand-on-400
    use: "Text and icon on color/primary."
    nao_use: "On any other background."
  color/secondary:
    css: '--nph-color-secondary'
    claro: core/surface/100
    escuro: core/slate/600
    use: "Alternative action that accompanies the primary one. Also the background of the solid nph-badge, which labels a state or category by its meaning."
    nao_use: "Destructive action."
  color/secondary-foreground:
    css: '--nph-color-secondary-foreground'
    claro: core/slate/950
    escuro: core/slate/100
    use: "Text on color/secondary. On the secondary nph-button and nph-badge, also text, icon and border on color/secondary-light and color/muted, the text of the ghost secondary nph-button, which has no background, and the number of the nph-tabs counter (tabs/counter-foreground)."
  color/secondary-hover:
    css: '--nph-color-secondary-hover'
    claro: core/surface/200
    escuro: core/slate/700
    use: "Hover surface of a secondary action. Keeps the change visible in both modes. Contrast with color/secondary-foreground: 14.30:1 in light and 8.98:1 in dark."
    nao_use: "Hover of primary, destructive, outline or ghost."
  color/accent:
    css: '--nph-color-accent'
    claro: core/surface/50
    escuro: core/slate/600
    use: "Temporary highlight: hover, focused item, active row. Also the hover background of the pending and completed nph-stepper step (stepper/item-background-hover); not on the step with an error nor with focus. Also the hover background of the nph-tree item (tree/item-background-hover); the item with focus does not take it. Also the background of the nph-collapsible trigger in hover (collapsible/trigger-background-hover). Also the background of the nph-resizable grip box while dragging (resizable/grip-background-active). Also the hover background of the nph-carousel indicator target (carousel/indicator-target-background-hover); the indicator with focus does not take it, and the current one has no hover. Also the hover layer of the rich option of the nph-select and nph-combobox list (select/option-background-hover), in hover and on the option active by the keyboard, at select/option-background-hover-opacity (0.5): the layer alone measures 1.03:1 light and 1.16:1 dark over color/popover, so the option active by the keyboard also takes the 1 px focus border and the 4 px halo outside it, in focus/border and focus/halo (select/option-focus-border, select/option-focus-halo). The plain option keeps the full color/accent until its own select task."
    nao_use: "Permanent block background: there it is color/muted. The arrow area of nph-select, nph-combobox and nph-tree-select has no background."
  color/accent-foreground:
    css: '--nph-color-accent-foreground'
    claro: core/slate/950
    escuro: core/slate/100
    use: "Text on color/accent. Also the label of the nph-tree item in hover (tree/item-foreground-hover). Also the grip icon of the nph-resizable while dragging (resizable/grip-foreground-active), over resizable/grip-background-active. Also the label, the start icon and the start dot of the rich option in hover and when active by the keyboard (select/option-foreground-hover), over the hover layer."
  color/muted:
    css: '--nph-color-muted'
    claro: core/surface/50
    escuro: core/slate/700
    use: "Permanent background without emphasis: table header, disabled area. Also the background of the outline secondary nph-button and the rail of the segmented nph-tabs (tabs/list-background). Also the background of the pending nph-stepper step marker (stepper/marker-background), decorative: the number carries the status. Also the tonal section of the nph-card (card/section-background): it separates by background, with no border. Also the background of the disabled nph-rich-text-editor box (rich-text-editor/background-disabled)."
    nao_use: "Hover: there it is color/accent, including the ghost secondary nph-button (button/secondary-ghost-background-hover, DSA-60). The nph-skeleton shape: there it is color/skeleton (skeleton/background, DSA-94); in dark, color/muted is the same as color/popover and the shape would vanish on a floating panel."
  color/skeleton:
    css: '--nph-color-skeleton'
    claro: core/surface/50
    escuro: core/slate/600
    use: "Background of the loading block (nph-skeleton) on a page, a card or a floating layer, only through skeleton/background. Same as color/muted in light; in dark one step above color/muted and color/popover, so the block does not vanish on a panel: 1.06:1 over color/popover, color/background and color/card in light; 1.35:1 over color/popover, 1.75:1 over color/card and 2.12:1 over color/background in dark. Decorative: the block carries no state and no text; the busy state of the region is told by aria-busy."
    nao_use: "Permanent background (color/muted). Interaction highlight (color/accent), which has the same two values with another function. Any piece other than the nph-skeleton shape."
  color/muted-foreground:
    css: '--nph-color-muted-foreground'
    claro: core/slate/600
    escuro: core/slate/200
    use: "Caption, helper text, placeholder, metadata. Also the icon of the info trigger of the nph-label, as the accepted Figma draws it, and the label and icon of the inactive nph-tabs tab (tabs/item-foreground). Also the number and the label of the pending nph-stepper step, the description (except on the step with an error) and “Optional” (stepper/marker-foreground, stepper/label-foreground, stepper/description-foreground). Also the chevron and the folder and file icon of the nph-tree item outside the selected state, in hover too (tree/toggle-foreground, tree/icon-foreground). Also the time column, the day label, the number of the days outside the shown month and the cancelled event text of the nph-scheduler (scheduler/time-foreground, scheduler/day-label-foreground, scheduler/event-cancelled-foreground). Also the description, the indicator and the start icon of the nph-collapsible trigger (collapsible/description-foreground, collapsible/indicator-foreground, collapsible/icon-foreground). Also the grip icon of the nph-resizable handle at rest, in hover, focus and disabled (resizable/grip-foreground): the grip passes 3:1 and shows that the handle can be dragged. Also the chevron of the nph-carousel arrows, by override on the nph-icon-button instance (carousel/control-foreground): 6.97:1 light and 4.69:1 dark over the arrow background, 6.00:1 and 3.40:1 in hover. Also the nph-carousel counter (carousel/counter-foreground). Also the description, the tonal section label, the list key and the meta footer of the nph-card (card/description-foreground). Also the title of the pending nph-timeline item, the item description and the word that marks the pending item as waiting (timeline/title-foreground-pending, timeline/description-foreground). Also the second line of the nph-rich-option choice card (rich-option/description-foreground), and the description and the secondary text of the rich option (select/option-description-foreground, select/option-secondary-foreground). Also the pending status icon at the start of the nph-accordion item (accordion/status-pending-icon), a neutral status icon, since there is no status/pending; the status tag with text at the end carries the meaning. Also the nph-chart: the labels of the axes, the goal, the categories, the direct series labels, the slice names and the donut total label, the comparison text of the change, the legend item name, the series name in the tooltip and the change icon in the neutral sense (chart/label-foreground, chart/legend-item-foreground, chart/tooltip-label-foreground, chart/delta-icon-neutral). Also the description of the nph-popconfirm (popconfirm/description-foreground). Also the placeholder and the counter of the nph-rich-text-editor (rich-text-editor/placeholder-foreground, rich-text-editor/counter-foreground): 8.07:1 light and 9.96:1 dark. Also the text prefix and suffix of the nph-input, such as R$, kg or @ (input/affix-foreground), in the tone of its placeholder."
    nao_use: "Text needed to complete the task. The meta line of nph-hover-card (date, time or short phrase below the description): there it is color/subtle-foreground."
  color/subtle-foreground:
    css: '--nph-color-subtle-foreground'
    claro: core/slate/500
    escuro: core/slate/200
    use: "Third level of text: metadata one step below color/muted-foreground, such as the meta line of nph-hover-card (date, time or short phrase) and its icon. 5.85:1 over color/popover in light, 6.31:1 in dark. Also the who and when line of the nph-timeline item (timeline/meta-foreground), 5.85:1 over color/background in light, the lowest of the item text; the word that marks the pending item as waiting stays on color/muted-foreground, because the person needs it to act. Also the icon of the nph-sidebar collapse button and the close X of the mobile menu on the neutral panel (sidebar/toggle-foreground): an icon of a control, 5.85:1 light and 8.20:1 dark at least over the panel (color/card)."
    nao_use: "Placeholder, caption or helper text (color/muted-foreground); text needed to complete the task. The non-current position marker: there it is color/marker."
  color/marker:
    css: '--nph-color-marker'
    claro: core/slate/400
    escuro: core/slate/400
    use: "Non-current position marker: the small dot that marks an item of a sequence without being the current one, a non-text mark (WCAG 1.4.11). The dot of the nph-carousel indicators (carousel/indicator-background). 4.18:1 over color/background and color/card in light; 4.09:1 over color/background and 3.37:1 over color/card in dark. Over color/muted it measures 3.93:1 in light and 2.59:1 in dark; the dark stays below 3:1."
    nao_use: "Text (color/subtle-foreground or color/muted-foreground). The current marker (color/primary-border). Over color/muted, where it does not reach 3:1."
  color/destructive:
    css: '--nph-color-destructive'
    claro: core/danger/600
    escuro: core/danger/400
    use: "Solid background of the action that deletes, revokes or cannot be undone: delete button, cancel subscription, revoke access. Also the background of the solid nph-badge, which labels a state or category by its meaning."
    nao_use: "Text over a neutral surface: there it is color/destructive-text. Validation error: there it is status/error, and for its text status/error-text."
  color/destructive-text:
    css: '--nph-color-destructive-text'
    claro: core/danger/600
    escuro: core/danger/100
    use: "Text and icon of a destructive action over a neutral surface (color/popover, color/background, color/card, color/dialog): the destructive item of a menu and of the nph-command. In dark, 5.90:1 over color/dialog and 7.94:1 over color/popover."
    nao_use: "Over color/destructive-surface (color/destructive-on-surface); over solid color/destructive (color/destructive-foreground); validation error text (status/error-text)."
  color/destructive-foreground:
    css: '--nph-color-destructive-foreground'
    claro: core/base/white
    escuro: core/slate/950
    use: "Text and icon on color/destructive."
    nao_use: "On another solid background. The dedicated alias exists because color/primary-foreground does not pass in every mode and brand."
  color/border:
    css: '--nph-color-border'
    claro: core/slate/200
    escuro: core/slate/400
    use: "Divider, outline of an area, table row. Also the base line and the hover line of the underline nph-tabs (tabs/underline-border-color, tabs/indicator-hover-color). Also the outline of the pending nph-stepper step marker and the nph-stepper connector after the current step (stepper/marker-border, stepper/connector-background), both decorative. Also the outline of the nph-collapsible card appearance (collapsible/card-border); the default flush appearance has no outline. Also the line of the nph-resizable handle at rest and disabled (resizable/handle-color). Also the outline of the clickable nph-card in hover (card/border-hover): only the outline rises one step; background and shadow stay. Also the divider at the base of the nph-tree-table branch error row (tree-table/border), as the rows of the nph-data-table. Also the bar at the start of a quote in the nph-rich-text-editor (rich-text-editor/quote-border), decorative: 1.72:1 light and 4.09:1 dark. Also the connector line of the pending nph-timeline item (timeline/connector-border-pending), decorative. Also the line that separates the nph-sidebar from the content (sidebar/border)."
    nao_use: "The line of the nph-separator (separator/border, which points to color/border-subtle). Form field border: there it is color/field-border and color/field-border-bottom (the bottom line meets 3:1); on checkbox and radio, color/input. The arrow area of nph-select, nph-combobox and nph-tree-select has no divider. The border and divider of nph-popover and nph-hover-card, the outline and the divider of the nph-popconfirm (popconfirm/border, popconfirm/divider), the outline and the divider of the nph-accordion (accordion/border, accordion/divider), the resting outline and the divider of the nph-card (card/border, card/divider), the divider between the toolbar and the text area of the nph-rich-text-editor (rich-text-editor/divider), and the divider between groups of a menu (nph-dropdown-menu and nph-context-menu): there it is color/border-subtle. The line of the nph-resizable handle in hover and dragging: there it is color/border-strong (the hover line of the underline nph-tabs stays here)."
  color/border-subtle:
    css: '--nph-color-border-subtle'
    claro: core/surface/200
    escuro: core/alpha/white-15
    use: "Soft border and divider of a surface: the outline and the divider of the nph-card (card/border, card/divider); the outline of the grouped nph-accordion and of each separated block, and the divider between its items (accordion/border, accordion/divider): 1.34:1 light, decorative, the trigger is recognized by its text and its indicator; border and divider of nph-popover, border of nph-hover-card, outline of a floating list and panel through color/dropdown-border (nph-dropdown-menu, nph-context-menu, the nph-navigation-menu panel and the loading nph-notification), the border of the nph-sidebar flyout panel (sidebar/flyout-border), and the divider between groups of nph-dropdown-menu and nph-context-menu. Softer than color/border; decorative: the shadow, the card background or the space between blocks completes the separation. Also the container outline, the grid lines (full hour only) and the cancelled event outline of the nph-scheduler (scheduler/border, scheduler/grid-line, scheduler/event-cancelled-border). Also the outline of the nph-rich-option choice card at rest, checked and in hover (rich-option/border): 1.34:1 light and 1.62:1 dark, decorative; the control inside the card is the boundary that meets 3:1. Also the outline of the nph-date-picker panel and the divider above its range footer (date-picker/panel-border, date-picker/divider). Also the outline of the option list of nph-select, nph-combobox and nph-multi-combobox and the outline of the nph-tree-select panel (tree-select/panel-border): decorative, the elevation/dropdown shadow and the background separate the layer, and each item carries its own contrast. Also the outline of the nph-chart data tooltip (chart/tooltip-border). Also the outline of the surface and of the arrow and the divider above the actions of the nph-popconfirm (popconfirm/border, popconfirm/divider); the divider is an nph-separator instance whose line color is overridden. Also the divider between the toolbar and the text area of the nph-rich-text-editor (rich-text-editor/divider): 1.34:1 light, decorative; the box border (color/input) is the boundary that meets 3:1, and the toolbar above completes the separation; the divider is an nph-separator instance whose line color is overridden. Also the line of the nph-separator, horizontal and vertical (separator/border): 1.34:1 light and 1.59:1 dark on color/background, decorative. Also the outline of the nph-sidebar panel with the neutral background in dark (sidebar/panel-border), decorative: in light that panel has no outline (core/alpha/black-0) and elevation/raised separates it from the page."
    nao_use: "nph-dialog (color/dialog-separator); the border of a field (color/field-border and color/field-border-bottom)."
  color/border-strong:
    css: '--nph-color-border-strong'
    claro: core/slate/500
    escuro: core/slate/200
    use: "Divider and outline of an area in interaction: today the line of the nph-resizable handle in hover and dragging (resizable/handle-color-hover). Passes 3:1 over color/background and color/card: 5.85:1 over color/background in light, 9.96:1 in dark. It does not replace accepted hover lines: the underline nph-tabs keeps color/border (tabs/indicator-hover-color), the outline of the clickable nph-card in hover keeps color/border (card/border-hover), strong enough for the soft style, and the done nph-file-upload-item keeps color/input (file-upload-item/border-done-hover)."
    nao_use: "At rest: there it is color/border. Field border: there it is color/field-border and color/field-border-bottom. Text: there it is color/muted-foreground, which points to the same primitives with another function."
  color/input:
    css: '--nph-color-input'
    claro: core/slate/400
    escuro: core/slate/200
    use: "Border of a form control with a full outline: nph-checkbox, nph-radio, the cell of nph-input-otp, the arrows of nph-pagination (pagination/arrow-border) and the disabled state of the fields (nph-input, nph-select, nph-combobox, nph-multi-combobox, nph-textarea and nph-date-picker, and nph-tree-select through them). Stronger than color/border on purpose: the boundary of a control must be identifiable. At rest, the fields use color/field-border and color/field-border-bottom through their own tokens (input/border, select/border and so on). Also the border of the completed nph-file-upload-item on hover (file-upload-item/border-done-hover): the whole item is the click area of the file name link. Also an outline that needs 3:1 outside a field, such as the hollow marker of the pending nph-timeline item (timeline/marker-border-pending): 4.18:1 light and 9.96:1 dark against the background, the only sign of the state besides the text. Also the border of the nph-rich-text-editor box (rich-text-editor/border): 4.18:1 light and 9.96:1 dark against the background."
    nao_use: "The line of the nph-resizable handle in hover and dragging: there it is color/border-strong. The outline of the option list of nph-select, nph-combobox and nph-multi-combobox and of the nph-tree-select panel: there it is color/border-subtle (tree-select/panel-border). The resting border of a field (nph-input, nph-select, nph-combobox, nph-multi-combobox, nph-textarea and nph-date-picker): there it is color/field-border on top and sides and color/field-border-bottom on the bottom line."
  color/field-border:
    css: '--nph-color-field-border'
    claro: core/slate/200
    escuro: core/slate/700
    use: "Top and sides of the resting border of a form field: nph-input, nph-select, nph-combobox, nph-multi-combobox, nph-textarea and nph-date-picker (input/border, select/border, combobox/border, multi-combobox/border, textarea/border, date-picker/border), and nph-tree-select and nph-field through them. Also in the state where the focus is on the clear button inside the field and in the read-only nph-textarea. Lighter on purpose (1.72:1 light, 1.58:1 dark on color/background): the bottom line carries the 3:1."
    nao_use: "Alone, without color/field-border-bottom: the field would lose its 3:1 boundary. Hover, focus, error and disabled: the border is whole, in color/input-hover, focus/border, status/error and color/input. Checkbox, radio and the nph-input-otp cell: color/input."
  color/field-border-bottom:
    css: '--nph-color-field-border-bottom'
    claro: core/slate/300
    escuro: core/slate/400
    use: "Bottom line of the resting border of a form field, the same fields as color/field-border (input/border-bottom, select/border-bottom, combobox/border-bottom, multi-combobox/border-bottom, textarea/border-bottom, date-picker/border-bottom). Stronger than the top and sides: it is the line that meets 3:1 for the boundary of the field (WCAG 1.4.11), 3.00:1 light and 4.09:1 dark on color/background. In CSS it is the color of the bottom border; the 1 px inner shadow of the Figma masters only draws it."
    nao_use: "Hover, focus, error and disabled: the border is whole, in one color. Any line outside a form field."
  color/dropdown-border:
    css: '--nph-color-dropdown-border'
    claro: color/border-subtle
    escuro: color/border-subtle
    use: "Outline of a floating list and panel: nph-dropdown-menu, nph-context-menu, the nph-navigation-menu panel and the loading variant of nph-notification. Same outline as nph-popover; the elevation/dropdown shadow completes the separation from the background. Decorative: the items are read by their text."
    nao_use: "The field of select, combobox, tree-select or date-picker (color/field-border and color/field-border-bottom at rest); the option list of nph-select, nph-combobox and nph-multi-combobox, which takes color/border-subtle straight; the nph-date-picker and nph-tree-select panels, which have their own outline (date-picker/panel-border and tree-select/panel-border, on color/border-subtle); the other variants of nph-notification (status/*-border; in neutral, color/border); the divider between groups (dropdown/separator, color/border-subtle)."
  dropdown/item-hover-icon-foreground:
    css: '--nph-dropdown-item-hover-icon-foreground'
    claro: color/primary
    escuro: color/primary
    use: "Start icon and submenu arrow of the nph-dropdown-menu item, type default, in hover; both turn solid. 4,78:1 in light and 6,26:1 in dark on color/primary-surface. USE only on those icons in that state. DO NOT USE on the label, which stays in color/popover-foreground, nor on the destructive item, which uses dropdown/item-destructive-foreground and, in hover, dropdown/item-destructive-hover-foreground."
  dropdown/separator:
    css: '--nph-dropdown-separator'
    claro: color/border-subtle
    escuro: color/border-subtle
    use: "Line of the divider between groups of nph-dropdown-menu and nph-context-menu. Decorative."
  separator/border:
    css: '--nph-separator-border'
    claro: color/border-subtle
    escuro: color/border-subtle
    use: "Line of the nph-separator, horizontal and vertical. Decorative and aria-hidden: it does not need 3:1."
    nao_use: "The border of a field (color/field-border and color/field-border-bottom); the lines of nph-dialog and nph-command (color/dialog-separator)."
  dropdown/panel-radius:
    css: '--nph-dropdown-panel-radius'
    alias: radius/overlay-anchored
    valor: 8
    use: "Radius of the panel of nph-dropdown-menu, nph-context-menu and nph-menubar, submenu included: a layer anchored to a trigger (radius/overlay-anchored)."
  dropdown/item-radius:
    css: '--nph-dropdown-item-radius'
    alias: radius/inner
    valor: 4
    use: "Radius of the item of nph-dropdown-menu and nph-context-menu: a piece nested in the 8 px panel with 4 px of breathing room (radius/inner)."
  dropdown/item-focus-border-radius:
    css: '--nph-dropdown-item-focus-border-radius'
    alias: focus/border-radius-inner
    valor: 5
    use: "Radius of the 1 px focus border around the menu item (item 4, border 5)."
  dropdown/item-focus-halo-radius:
    css: '--nph-dropdown-item-focus-halo-radius'
    alias: focus/radius-inner-with-border
    valor: 9
    use: "Radius of the focus halo around the focus border of the menu item (border 5, halo 9)."
  dropdown/item-destructive-foreground:
    css: '--nph-dropdown-item-destructive-foreground'
    claro: color/destructive-text
    escuro: color/destructive-text
    use: "Label, shortcut and icon of the destructive menu item without background: rest, focus and disabled."
  dropdown/item-destructive-hover-foreground:
    css: '--nph-dropdown-item-destructive-hover-foreground'
    claro: color/destructive-on-surface
    escuro: color/destructive-on-surface
    use: "Label, shortcut and icon of the destructive menu item in hover, over dropdown/item-destructive-hover-background."
  dropdown/item-destructive-hover-background:
    css: '--nph-dropdown-item-destructive-hover-background'
    claro: color/destructive-surface
    escuro: color/destructive-surface
    use: "Background of the destructive menu item in hover."
  dropdown/submenu-offset:
    css: '--nph-dropdown-submenu-offset'
    alias: core/space/100
    valor: 4
    use: "Gap between the panel and the submenu open beside it, in nph-context-menu and nph-menubar (nph-dropdown-menu does not nest a menu, P92). Straight to core by decision, as popover/offset and navigation-menu/panel-offset: no semantic token names the distance to a floating layer; space/inline-tight, also 4, is the space inside a unit and says DO NOT USE between independent elements."
  color/card:
    css: '--nph-color-card'
    claro: core/base/white
    escuro: core/slate/800
    use: "Card background. Also the background of the nph-scheduler container and of its cancelled event (scheduler/background, scheduler/event-cancelled-background). Also the background of the nph-collapsible card appearance (collapsible/card-background). Also the background of the nph-card, in hover too (card/background). Also the background of the nph-rich-option choice card (rich-option/background). Also the background of the grouped nph-accordion and of each block of the separated one (accordion/background); the flush appearance has no background. Also the 2 px stroke between neighbor colors of the nph-chart and the gap between the focused mark and its focus border: the card surface (chart/separator). Also the background of the nph-sidebar panel with the neutral background, the default (sidebar/panel-background): white in light, the card surface in dark."
    nao_use: "Shadow to simulate elevation in dark mode."
  color/card-foreground:
    css: '--nph-color-card-foreground'
    claro: core/slate/950
    escuro: core/slate/100
    use: "Text on color/card. Also the title, the content, the tonal section text, the list value and the arrow of the clickable nph-card (card/foreground, card/indicator-foreground). Also the title and the optional icon of the nph-rich-option choice card (rich-option/foreground): 19.23:1 light and 11.67:1 dark."
  color/popover:
    css: '--nph-color-popover'
    claro: core/base/white
    escuro: core/slate/700
    use: "Floating layer attached to a trigger, which does NOT block the page: popover, dropdown, context menu. Also the background of the nph-tree-select panel (tree-select/panel-background). Also the background of the nph-chart data tooltip (chart/tooltip-background). Also the surface and the arrow of the nph-popconfirm (popconfirm/background)."
    nao_use: "Fixed page content. Dialog, modal or side panel - those are color/dialog."
  color/popover-foreground:
    css: '--nph-color-popover-foreground'
    claro: core/slate/950
    escuro: core/slate/100
    use: "Text on color/popover. Also the label, the start icon and the start dot of the rich option of the nph-select and nph-combobox list and, on the disabled rich option, also its secondary text and description (select/option-foreground): 19.23:1 light and 8.98:1 dark. Also the title and the values of the nph-chart data tooltip (chart/tooltip-foreground). Also the title of the nph-popconfirm (popconfirm/title-foreground)."
  color/dialog:
    css: '--nph-color-dialog'
    claro: core/base/white
    escuro: core/slate/600
    use: "Background of dialog, modal and side panel - the layer that BLOCKS the page. In dark it rises to slate/600, one step above the popover: it is the highest level of the ramp, and in dark the ramp IS the elevation. USE always with overlay/scrim. Also the panel of the nph-command, which opens in a dialog (command/background)."
    nao_use: "Popover or dropdown menu - those are color/popover. Tooltip is color/tooltip."
  color/dialog-foreground:
    css: '--nph-color-dialog-foreground'
    claro: core/slate/950
    escuro: core/slate/100
    use: "Text and icon on color/dialog. 6,68:1 in dark."
  color/dialog-separator:
    css: '--nph-color-dialog-separator'
    claro: core/surface/150
    escuro: core/slate/500
    use: "Line of the nph-dialog header and footer. Softer than color/border, to separate long content, such as a list or a table, without weight. Decorative: the content does not depend on it. Also the lines between the field, the list and the footer of the nph-command, which opens in a dialog (command/divider)."
    nao_use: "Outside the nph-dialog and the nph-command. A divider of a page or table is color/border; the divider of the nph-card is color/border-subtle (card/divider)."
  color/secondary-on-dialog:
    css: '--nph-color-secondary-on-dialog'
    claro: color/secondary
    escuro: core/slate/800
    use: "Background of the solid secondary nph-button inside the nph-dialog, until DSA-70 lands. Indiane decided on 2026-11-09 (DSA-64 D-1) that the button keeps its own background inside the dialog (button/secondary-solid-background), so this token loses that use; whether it stays for another use is open."
    nao_use: "Outside the nph-dialog."
  color/secondary-on-dialog-hover:
    css: '--nph-color-secondary-on-dialog-hover'
    claro: color/secondary-hover
    escuro: core/slate/700
    use: "Hover-active of the solid secondary nph-button inside the nph-dialog, until DSA-70 lands (DSA-64 D-1: the button keeps its own hover inside the dialog); whether it stays for another use is open."
    nao_use: "Outside the nph-dialog."
  color/primary-surface:
    css: '--nph-color-primary-surface'
    claro: theme/brand-50
    escuro: theme/brand-900
    use: "Background of the main action in light emphasis: nph-button with light or outline emphasis. Also the light nph-badge, the hover of the ghost nph-button, the selected option of nph-select and nph-combobox, the hover of the nph-dropdown-menu item and the active tab of the light and outline nph-tabs tab button (tabs/button-light-background-active, tabs/button-outline-background-active). Follows the active brand. USE always with color/primary-on-surface. Exceptions: the selected nph-select and nph-combobox option keeps its label in color/popover-foreground and takes the check in color/primary (4.78:1 light, 6.26:1 dark); the hovered nph-dropdown-menu item keeps its label in color/popover-foreground, and the destructive item hovers in color/destructive-surface. DO NOT USE as page, card or area background — for that there are color/background, color/card and color/muted. Also the background of the completed nph-stepper step marker (stepper/marker-background-complete), always with color/primary-on-surface. Also the background of the nph-file-upload drop zone while a file is dragged over it (file-upload/background-dragging) and of the nph-file-upload-item while it uploads (file-upload-item/background-uploading), with color/primary-on-surface for the icon and the phrase of the zone. Exception: on the uploading nph-file-upload-item the text over it (name, format, size and status) stays on color/foreground and color/muted-foreground, as accepted by Indiane. Also the background of the selected item of lists and of the nph-tree (tree/item-background-selected), with color/primary-text on the label, the chevron and the icon: 7.21:1 at least, against 4.78:1 of color/primary-on-surface in light. Also the background of the nph-scheduler event and the selected day (scheduler/event-background, scheduler/day-selected-background). Also the tonal icon box at the start of the nph-card (card/icon-container-background), with color/primary-on-surface on the icon (card/icon-container-foreground): in dark the box almost disappears against the card (1.04:1 to 1.25:1) and the icon carries the sign (4.78:1 or more); the box is decorative (WCAG 1.4.11). Also the background of the nph-timeline circle marker, neutral, completed and current (timeline/marker-background, timeline/marker-background-primary), with color/primary-on-surface on the icon and on the center dot. Also the background of the start tile of the nph-accordion item (accordion/tile-background), with color/primary-on-surface on its icon (accordion/tile-foreground): 4.78:1 light and 13.79:1 dark; in dark the tile is 1.09:1 against the card and the icon carries the sign; the tile is decorative. The rich option (select/option-*) does not take it: the selected rich option shows only the check (select/option-marker) or the checked box, with no background, disabled too (DSA-91); the plain nph-select and nph-combobox option with marker=check keeps this background until its own select task."
  color/primary-on-surface:
    css: '--nph-color-primary-on-surface'
    claro: theme/brand-text-light
    escuro: theme/brand-100
    use: "Text, icon and border on color/primary-surface. Vivid brand color in light mode, light tone in dark mode. USE only on it, except for the exception. Exception: text of the ghost nph-button, which has no background. DO NOT USE on solid color/primary — there color/primary-foreground applies. Also the check of the completed nph-stepper step marker (stepper/marker-foreground-complete). Also the icon and the phrase of the nph-file-upload drop zone while a file is dragged over it (file-upload/icon-foreground-dragging, file-upload/foreground-dragging). Also the title and time of the nph-scheduler event and its selected dot, and the number of the selected day of the compact mobile month (scheduler/event-foreground, scheduler/event-dot-selected, scheduler/day-selected-foreground). Also the icon in the tonal icon box at the start of the nph-card (card/icon-container-foreground). Also the icon of the neutral and completed nph-timeline circle marker and the center dot of the current one (timeline/marker-foreground, timeline/marker-foreground-primary): 4.78:1 at least over color/primary-surface in the seven brands and both themes. Also the icon of the start tile of the nph-accordion item (accordion/tile-foreground): 4.78:1 light and 13.79:1 dark over color/primary-surface. Exception: the icon of the nph-sidebar collapse button and the close X of the mobile menu on the brand panel (sidebar/toggle-foreground-brand), whose background is color/primary-surface-hover: an icon of a control, it needs 3:1 and measures 4.26:1 light and 7.68:1 dark at least."
  color/primary-surface-hover:
    css: '--nph-color-primary-surface-hover'
    claro: theme/brand-100
    escuro: theme/brand-800
    use: "Surface of the main action in light emphasis, in the hover-active state. USE only in that state, with color/primary-on-surface-hover on top (color/primary-on-surface measures as low as 4.26:1 on it in light, below 4.5:1). DO NOT USE as resting background — there color/primary-surface applies. Also the hover and open background of the nph-scheduler event (scheduler/event-background-hover). Also the hover and open background of the nph-menubar top item (menubar/trigger-background-hover). Exception: the resting background of the nph-sidebar panel with the brand background (sidebar/panel-background-brand), a large surface in the brand color, not a state; the labels on it use the sidebar/item-* tokens."
  color/primary-on-surface-hover:
    css: '--nph-color-primary-on-surface-hover'
    claro: theme/brand-700
    escuro: theme/brand-100
    use: "Text, icon and border on color/primary-surface-hover. USE only in the hover-active state of light emphasis. DO NOT USE at rest — there color/primary-on-surface applies. Also the title and time of the nph-scheduler event in hover and open (scheduler/event-foreground-hover). Also the label of the nph-menubar top item in hover and open (menubar/trigger-foreground-hover)."
  color/primary-border:
    css: '--nph-color-primary-border'
    claro: theme/brand-600
    escuro: theme/brand-200
    use: "Outline of a chosen or active control, when the brand color marks the choice: selected item, the outline of the nph-switch when on (DSA-27 D4). Do not use for fill or text: those are color/primary and color/primary-foreground. DO NOT USE on the outline of the checked option card (nph-rich-option): there the choice reads by the control. Exception: a small position or progress marker, where color/primary does not reach 3:1 in dark: the nph-progress indicator (progress/indicator-background) and the current marker of the nph-carousel indicators (carousel/indicator-background-current). In light it is the same tone as the primary; in dark it is theme/brand-200, because the dark primary does not reach 3:1 as an outline in two of the seven brands, and theme/brand-300 fell below 3:1 on color/dialog in Gerencial (2.56:1), Igrejas (2.93:1) and Recursos Humanos (2.64:1); with brand-200 the lowest on color/dialog is 4.27:1 (DSA-84, same rule as focus/border in DSA-81). Also the ring of the current nph-stepper step (stepper/marker-border-current) and the 1 px connector line after a completed step (stepper/connector-background-complete; the code follows the status of the steps after DSA-85): a 1 px line reads as a border, so the no-fill rule does not apply to it. Also the border of the nph-file-upload drop zone while a file is dragged over it (file-upload/border-dragging), which marks the target. Also the 2 px bar that marks the selected item over color/primary-surface (tree/indicator-background, nph-tree), where color/primary does not reach 3:1 in dark. Also the event bar, the event dot, the today mark and the now line of the nph-scheduler (scheduler/event-indicator, scheduler/event-dot, scheduler/today-indicator, scheduler/now-indicator). Also the decorative connector line between nph-timeline markers (timeline/connector-border), on the neutral, completed, current, error, warning and avatar items, with aria-hidden: 5.37:1 light and 8.98:1 dark against the background; the pending item keeps color/border from the nph-separator. A 1 px line reads as a border, so the no-fill rule does not apply to it."
  color/link:
    css: '--nph-color-link'
    claro: theme/brand-600
    escuro: theme/brand-text-dark
    use: "Text of an action that reads as a link inside a composition, such as the resend-code action below the nph-input-otp: a ghost nph-button with the label in color/link and underlined; the trigger link of nph-hover-card; and the link inside the nph-table cell (table/link-foreground). Meets 4.5:1 on color/background in light and dark in the seven brands. Do not use for the label of a regular nph-button or for body text: those keep their own tokens. Also a link inside the nph-rich-text-editor content, always underlined (rich-text-editor/link-foreground): 4.96:1 light and 8.87:1 dark in the worst brand."
  color/primary-hover:
    css: '--nph-color-primary-hover'
    claro: theme/brand-700
    escuro: theme/brand-400-hover
    use: "Background of color/primary in the hover-active state of the solid nph-button, with color/primary-foreground on top (supersedes B4)."
    nao_use: "Text or icon on background, card or popover: in dark it fails 4.5:1 in four brands. Use color/primary-text."
  color/primary-text:
    css: '--nph-color-primary-text'
    claro: theme/brand-700
    escuro: theme/brand-text-dark
    use: "Brand-colored text and icon on background, card or popover: the current item of nph-navigation-menu, the active and open item and the flyout title of nph-sidebar-item and the active option of the nph-sidebar flyout panel, the checked item of single choice in nph-dropdown-menu, the label, the icon and the line of the active nph-tabs tab in the segmented and underline styles (tabs/item-foreground-active, tabs/indicator-color). In light it is the same tone as color/primary-hover; in dark it measures at least 4.5:1 in the seven brands. Also the number of the current nph-stepper step (stepper/marker-foreground-current). Also the label, the chevron and the folder and file icon of the selected nph-tree item (tree/item-foreground-selected, tree/toggle-foreground-selected, tree/icon-foreground-selected), over color/primary-surface: 7.21:1 at least. Also the number of today and the current time of the nph-scheduler (scheduler/today-foreground, scheduler/now-foreground). Also the number and the outline of today and of the current month in the nph-calendar grid of the nph-date-picker, bound to this semantic with no component token: 8.11:1 in light and 6.05:1 in dark in the default brand over color/popover, at least 5.98:1 in dark in every brand."
    nao_use: "Fill: the brand fill is color/primary. Link text: color/link."
  color/destructive-surface:
    css: '--nph-color-destructive-surface'
    claro: core/danger/50
    escuro: core/danger/900
    use: "Background of the destructive action in light emphasis: nph-button with light or outline emphasis, and the icon box of the destructive type of the nph-popconfirm (popconfirm/icon-box-background-destructive). Also the light nph-badge and the hover of the ghost nph-button. USE always with color/destructive-on-surface. DO NOT USE in a validation error message — there status/error-surface applies."
  color/destructive-on-surface:
    css: '--nph-color-destructive-on-surface'
    claro: core/danger/600
    escuro: core/danger/100
    use: "Text, icon and border on color/destructive-surface. USE only on it, except for the exception. Exception: text of the ghost nph-button, which has no background. DO NOT USE on solid color/destructive — there color/destructive-foreground applies. Also the icon of the destructive type of the nph-popconfirm on its icon box (popconfirm/icon-foreground-destructive, DSA-99): 5.89:1 in light and 13.41:1 in dark."
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
    use: "Background of color/destructive in the hover-active state of the solid nph-button, with color/destructive-foreground on top (supersedes B4)."
  color/secondary-surface-hover:
    css: '--nph-color-secondary-surface-hover'
    claro: core/surface/200
    escuro: core/slate/600
    use: "Surface of the alternative action in light emphasis, in the hover-active state. USE only in that state, with color/secondary-foreground on top. DO NOT USE on the solid secondary button — there color/secondary-hover applies."
  color/secondary-light:
    css: '--nph-color-secondary-light'
    claro: core/surface/50
    escuro: core/slate/700
    use: "Background of the alternative action in light emphasis: secondary light nph-button and nph-badge, with color/secondary-foreground. Also the counter of the inactive nph-tabs tab outside the rail (tabs/counter-background). DO NOT USE in outline — there it is color/muted."
  color/secondary-light-hover:
    css: '--nph-color-secondary-light-hover'
    claro: core/surface/100
    escuro: core/slate/600
    use: "Hover-active of the secondary light nph-button, with color/secondary-foreground on top. DO NOT USE in outline — there it is color/secondary-surface-hover."
  color/input-hover:
    css: '--nph-color-input-hover'
    claro: core/slate/500
    escuro: core/slate/100
    use: "The whole border of the form field when the pointer is over it, on all four sides. Stronger than the resting border (color/field-border and color/field-border-bottom), so the field responds to the mouse without changing size or weight. Do not use for a divider, a card outline or a message border. Also the border of the nph-rich-text-editor box in hover (rich-text-editor/border-hover)."
  color/accent-subtle:
    css: '--nph-color-accent-subtle'
    claro: core/surface/50
    escuro: core/slate/700
    use: "Hover surface of a selectable container: option card, item the person chooses. Do not use for the hover of a table row or simple list item: those stay in color/accent. The hover of the nph-dropdown-menu item is color/primary-surface. Also the hover layer of the nph-rich-option choice card (rich-option/background-hover), drawn over color/card at rich-option/background-hover-opacity (0.5): #F8F8F8 light and #262B32 dark on screen. The layer takes the opacity, never the whole card."
  color/tooltip:
    css: '--nph-color-tooltip'
    claro: core/slate/500
    escuro: core/slate/700
    use: "Background of the help balloon (nph-tooltip): dark surface, attached to a trigger, which does not block the page. USE only on nph-tooltip. DO NOT USE on popover, menu or dialog — those are color/popover and color/dialog."
  color/tooltip-foreground:
    css: '--nph-color-tooltip-foreground'
    claro: core/base/white
    escuro: core/slate/100
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
    escuro: theme/brand-200
    use: "1 px focus border of the control that receives focus with border and halo (rule 6), as on the secondary of the nph-button, on the info trigger of the nph-label, on the nph-tabs tab in every style (tabs/focus-border-color) and on every focusable piece of nph-sidebar (item, subitem, rail button, flyout option, collapse and close buttons): there color/primary fell below 3:1 against the dark panel in some brands. It is the one that meets the 3:1 minimum; the halo is decoration. The 3:1 is measured against the halo, the neighbor outside the border; the inside of the control (box or track) does not count. Applies to checkbox, radio and switch. In light mode every brand meets it against the halo, from 3,03:1 to 4,32:1 (`Sistemas` 4,26:1 since DSA-92, with the border at tone 600). In dark mode every brand meets it against the halo, from 5,02:1 to 6,74:1, and against color/dialog, from 4,27:1 to 7,59:1 (theme/brand-200 since DSA-81: brand-300 fell below 3:1 on the dialog in Gerencial, Recursos Humanos and Igrejas). Also the clickable nph-stepper step (stepper/focus-border), with no hover background under the focus. Also the focus border of the nph-tree item (tree/focus-border), drawn outside the row with the halo outside it (tree/focus-halo), with no hover background under the focus. Also the focus border of the nph-panel-menu subgroup (panel-menu/focus-border). Also the focus border of the nph-scheduler day, event (primary color), month and list rows and cancelled event (scheduler/focus-border). Also the focus border of the nph-collapsible trigger (collapsible/focus-border). Also the focus border of the nph-dropdown-menu item, shared by nph-context-menu and the nph-menubar panel: color/primary fell below 3:1 on color/popover in dark in 4 brands (Gerencial 1.83:1); with focus/border the lowest of the 7 brands and 2 themes is 4.32:1 (light, Comercial). Also the focus border of the nph-menubar top item, used directly. Also the border of the nph-rich-option choice card with keyboard focus (rich-option/focus-border): the card turns its own outline to it; against the halo it is 4.26:1 in `Sistemas` light and 5.02:1 dark, and against color/card 5.37:1 light and 9.88:1 dark. Also the 1 px focus border outside the rich option active by the keyboard (select/option-focus-border), with the halo outside it, as the nph-dropdown-menu item: against the halo it is 4.26:1 in `Sistemas` light and 5.02:1 dark, and against the hover layer inside it 5.01:1 light and 6.90:1 dark. Also the focus border of the nph-chart legend item and of the focused data (chart/focus-border). Also the focus border of the nph-tree-table row and branch error row (tree-table/focus-border), 1 px, inset 4 px inside the row and stopping 1 px above the base divider, as the nph-tree item: against the halo it is 4.26:1 in `Sistemas` light and 5.02:1 dark; against the row background 5.37:1 light and 11.70:1 dark, and against the hover and the selected background 3.85:1 light, the lowest of the seven brands (Comercial; `Sistemas` 4.78:1), and 10.76:1 dark. Also the focus border of the nph-rich-text-editor box (rich-text-editor/focus-border): against the background, 4.32:1 light and 8.20:1 dark in the worst brand; against the halo, it measures as the border above (3:1 or more in every brand and scheme). Also the focus border of both parts of the nph-split-button (split-button/focus-border), in every type, danger included: one focus color for the group, set on each part through the nph-button focus hook; against the halo, it measures as the border above (3:1 or more in every brand and scheme)."
  focus/halo:
    css: '--nph-focus-halo'
    claro: theme/brand-halo
    escuro: theme/brand-halo-dark
    use: "Focus HALO: the band outside the border. It is decoration and does not need to meet 3:1 — focus/border meets it. In light mode it points to theme/brand-halo and in dark mode to theme/brand-halo-dark, the tones chosen per brand so the focus border stays visible against the halo. It exists so the component does not point directly at the brand layer. Also the focus halo of the nph-panel-menu subgroup (panel-menu/focus-ring). Also the focus halo of the nph-scheduler day, event (primary color), month and list rows and cancelled event (scheduler/focus-halo). Also the focus halo of the nph-collapsible trigger (collapsible/focus-halo). Also the focus halo of the nph-tree item (tree/focus-halo). Also the focus halo around the nph-rich-option choice card (rich-option/focus-halo). Also the focus halo of the rich option active by the keyboard (select/option-focus-halo). Also the focus halo of the nph-chart legend item and of the focused data (chart/focus-halo). Also the focus halo of the nph-tree-table row and branch error row (tree-table/focus-halo), at the edge of the row and inside it, because the rows touch. Also the focus halo of the nph-rich-text-editor box (rich-text-editor/focus-halo). Also the focus halo of both parts of the nph-split-button (split-button/focus-halo), in every type: the danger part too, where the nph-button alone uses focus/halo-danger."
  focus/halo-info:
    css: '--nph-focus-halo-info'
    claro: core/info/200
    escuro: core/info/200
    use: "Focus HALO when the control is of the info type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark."
  focus/halo-warn:
    css: '--nph-focus-halo-warn'
    claro: core/warn/200
    escuro: core/warn/200
    use: "Focus HALO when the control is of the warn type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark."
  focus/halo-help:
    css: '--nph-focus-halo-help'
    claro: core/help/200
    escuro: core/help/200
    use: "Focus HALO when the control is of the help type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark."
  focus/halo-danger:
    css: '--nph-focus-halo-danger'
    claro: core/danger/200
    escuro: core/danger/200
    use: "Focus HALO when the control is of the danger type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark. The danger part of the nph-split-button uses focus/halo instead (split-button/focus-halo, DSA-109)."
  focus/halo-success:
    css: '--nph-focus-halo-success'
    claro: core/success/200
    escuro: core/success/200
    use: "Focus HALO when the control is of the success type. Decoration: the border meets the 3:1 minimum. Stays on the light tone of the same hue in both modes, so it does not vanish inside the border in dark."
  focus/halo-error:
    css: '--nph-focus-halo-error'
    claro: focus/halo-danger
    escuro: core/danger/600
    use: "Focus HALO when the field is invalid. Decoration; the border meets the contrast, and in this state it is status/error. Light tone in light mode (focus/halo-danger); in dark mode core/danger/600, so the error border shows against the halo (2.49:1 over color/background, 2.53:1 against status/error). The halo of the danger nph-button keeps focus/halo-danger. Renamed from focus/ring-error, for the same reason as focus/border. Also the focus halo around the nph-rich-option choice card in error (rich-option/focus-halo-error). Also the focus halo of the invalid nph-rich-text-editor box (rich-text-editor/focus-halo-error)."
  sidebar/background:
    css: '--nph-sidebar-background'
    claro: core/surface/50
    escuro: core/slate/950
    use: "Sidebar background."
  sidebar/foreground:
    css: '--nph-sidebar-foreground'
    claro: core/slate/700
    escuro: core/slate/300
    use: "Text of an unselected item."
  sidebar/accent:
    css: '--nph-sidebar-accent'
    claro: core/surface/100
    escuro: core/slate/700
    use: "Sidebar item on hover."
    nao_use: "Active item."
  sidebar/accent-foreground:
    css: '--nph-sidebar-accent-foreground'
    claro: core/slate/900
    escuro: core/slate/100
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
    claro: color/border
    escuro: color/border
    use: "Separates the sidebar from the content."
  sidebar/ring:
    css: '--nph-sidebar-ring'
    claro: core/slate/400
    escuro: core/slate/200
    use: "Focus ring inside the sidebar."
  scrollbar/track:
    css: '--nph-scrollbar-track'
    claro: core/surface/50
    escuro: core/slate/800
    use: "USE for the scrollbar track (the part the thumb runs along). DO NOT USE as a block or field background."
  scrollbar/thumb:
    css: '--nph-scrollbar-thumb'
    claro: core/surface/200
    escuro: core/slate/500
    use: "USE for the scrollbar thumb at rest. DO NOT USE for a border, divider or text. Known exception: the thumb measures 1,26:1 against scrollbar/track in light mode and 2,41:1 in dark mode; over color/popover, 1,34:1 and 1,86:1. All are below the 3:1 of WCAG 1.4.11, accepted for softness. Do not raise the tone and never use opacity to soften it."
  scrollbar/thumb-hover:
    css: '--nph-scrollbar-thumb-hover'
    claro: core/slate/300
    escuro: core/slate/400
    use: "Reference tone in Figma for the scrollbar thumb with the pointer over it or while dragging. In code, the native scrollbar may show the browser's own hover tone, and src/styles/scrollbar.css does not apply this token. DO NOT USE at rest."
  status/info:
    css: '--nph-status-info'
    claro: core/info/600
    escuro: core/info/400
    use: "Solid color of the state: icon, dot, message bar. Neutral information: system notice, contextual tip. Also the solid background of the nph-badge and of the nph-button, with status/on-solid. The `nao_use` still applies. Also the type icon of the default nph-popconfirm (popconfirm/icon-foreground, circle-question) on status/info-surface: the question is neutral information, not the confirmation that an action succeeded."
    nao_use: "error, risk or confirmation"
  status/info-surface:
    css: '--nph-status-info-surface'
    claro: core/info/50
    escuro: core/info/900
    use: "Background of the info message and of the icon box of the nph-popconfirm (popconfirm/icon-box-background). USE with status/info-foreground on the text, status/info on the icon and status/info-border on the border. DO NOT USE as a page background. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border. In the nph-popconfirm icon box there is no text and no border: only the solid icon in status/info (popconfirm/icon-foreground), above 3:1 in both themes."
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
    use: "Solid color of the state: icon, dot, message bar. Something may go wrong, or requires care before proceeding. Also the solid background of the nph-badge and of the nph-button, with status/on-solid. The `nao_use` still applies. Also the border of the nph-file-upload drop zone in the limit state in light mode (file-upload/border-limit; in dark mode core/alpha/warn-400-40) and its icon (file-upload/icon-foreground-limit): reaching the limit is a notice, not a failure. Also the warning status icon at the start of the nph-accordion item (accordion/status-warning-icon): decorative next to the status tag with text at the end; without the tag, it carries a hidden text. Also the type icon of the warning nph-popconfirm (popconfirm/icon-foreground-warning, triangle-exclamation) on status/warning-surface: a small piece of work may be lost."
    nao_use: "error that has already happened"
  status/warning-surface:
    css: '--nph-status-warning-surface'
    claro: core/warn/50
    escuro: core/warn/900
    use: "Background of the warning message and of the icon box of the nph-popconfirm (popconfirm/icon-box-background-warning). USE with status/warning-foreground on the text, status/warning on the icon and status/warning-border on the border. DO NOT USE as a page background. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border. In the nph-popconfirm icon box there is no text and no border: only the solid icon in status/warning (popconfirm/icon-foreground-warning), above 3:1 in both themes. Also the background of the nph-file-upload drop zone in the limit state (file-upload/background-limit); the phrase and the rule stay on color/muted-foreground (file-upload/muted-foreground), as accepted in Figma. Exception: the background of the nph-timeline warning marker (timeline/marker-background-warning), with status/warning-foreground on the triangle-exclamation icon and status/warning-border on the outline, without status/warning: the outline is discreet in light (1.66:1 against the background) and the icon carries the meaning (10.80:1 light, 13.61:1 dark)."
  status/warning-border:
    css: '--nph-status-warning-border'
    claro: core/warn/200
    escuro: core/warn/400
    use: "Message border. Always together with the other three roles of status/warning. Also the discreet outline of the nph-timeline warning marker (timeline/marker-border-warning), without status/warning (see status/warning-surface): 1.66:1 against the background in light, so the icon carries the meaning."
  status/warning-foreground:
    css: '--nph-status-warning-foreground'
    claro: core/warn/800
    escuro: core/warn/100
    use: "Text inside the message. Always together with the other three roles of status/warning. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border. Also the triangle-exclamation icon of the nph-timeline warning marker (timeline/marker-foreground-warning), over status/warning-surface, without status/warning (see status/warning-surface)."
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
    escuro: core/danger/300
    use: "Solid color of the state: icon, dot, message bar. Error that has already happened: validation failed, request broke. Also the border of an invalid field — the field that failed validation. And the asterisk that marks a required field in nph-label: there it is a notice of requirement, not an error. Also the background of the nph-stepper step marker with an error (stepper/marker-background-error). Also the border of the nph-file-upload drop zone in the error state in light mode (file-upload/border-error; in dark mode core/alpha/danger-400-40), and the icon and the reason of the error in the zone and in the nph-file-upload-item (file-upload/icon-foreground-error, file-upload/error-foreground, file-upload-item/icon-foreground-error, file-upload-item/error-foreground). Also the icon of the nph-tree error row (tree/error-icon-foreground). In dark it is core/danger/300 since DSA-84: core/danger/400 measured 2.61:1 on color/dialog, below the 3:1 of a control part; core/danger/300 measures 3.62:1. Also the border of the nph-rich-option choice card in error and in error with focus (rich-option/border-error): 6.88:1 light and 5.88:1 dark over color/card, as a border; the written message is the one of the nph-field. Also the error status icon at the start of the nph-accordion item (accordion/status-error-icon): decorative next to the status tag with text at the end; without the tag, it carries a hidden text. Also the change icon of the nph-chart highlight in the negative sense, declared by the screen (chart/delta-icon-negative), a declared extension with the arrow and the text; and the icon of the error state of the chart area (chart/error-icon-foreground). Also the icon of the nph-tree-table branch error row (tree-table/error-icon-foreground), next to the message in text: 6.88:1 light and 6.96:1 dark over the row, 5.74:1 at least over the hover background. Also the border of the invalid nph-rich-text-editor box (rich-text-editor/border-error)."
    nao_use: "destructive action by the user; error text over a neutral surface (status/error-text)"
  status/error-surface:
    css: '--nph-status-error-surface'
    claro: core/danger/50
    escuro: core/danger/900
    use: "Message background. Always together with the other three roles of status/error. Also the background of the nph-file-upload drop zone in the error state and of the nph-file-upload-item in the error status (file-upload/background-error, file-upload-item/background-error); the name, the status line and the reason stay on color/foreground, color/muted-foreground and status/error, as accepted in Figma. Also the background of the nph-timeline error marker (timeline/marker-background-error), with status/error-foreground on the circle-xmark icon and status/error-border on the outline, without status/error: the outline is discreet in light (1.93:1 against the background) and the icon carries the meaning (12.06:1 light, 13.41:1 dark)."
  status/error-border:
    css: '--nph-status-error-border'
    claro: core/danger/200
    escuro: core/danger/400
    use: "Message border. Always together with the other three roles of status/error. Also the border of the nph-file-upload-item in the error status in light mode (file-upload-item/border-error); in dark mode the item points to core/alpha/danger-400-40, so the border is soft as in light. Also the discreet outline of the nph-timeline error marker (timeline/marker-border-error), without status/error (see status/error-surface): 1.93:1 against the background in light, so the icon carries the meaning."
  status/error-foreground:
    css: '--nph-status-error-foreground'
    claro: core/danger/800
    escuro: core/danger/100
    use: "Text inside the message. Always together with the other three roles of status/error. Also the circle-xmark icon of the nph-timeline error marker (timeline/marker-foreground-error), over status/error-surface, without status/error (see status/error-surface)."
  status/error-text:
    css: '--nph-status-error-text'
    claro: core/danger/600
    escuro: core/danger/100
    use: "Validation error text over a neutral surface (color/popover, color/background, color/card, color/dialog): the error message of nph-field. In dark it is core/danger/100 (5.90:1 on color/dialog, the same as color/destructive-text); with the slate scale, core/danger/200 measures 4.19:1 there, below 4.5:1. Also the label and the reason (description) of the nph-stepper step with an error (stepper/label-foreground-error, stepper/description-foreground-error)."
    nao_use: "Destructive action; text over status/error-surface (status/error-foreground); icon, dot or bar (status/error)."
  status/success:
    css: '--nph-status-success'
    claro: core/success/600
    escuro: core/success/400
    use: "Solid color of the state: icon, dot, message bar. Confirmation that the action succeeded. Also the solid background of the nph-badge and of the nph-button, with status/on-solid. The `nao_use` still applies. Also the success status icon at the start of the nph-accordion item (accordion/status-success-icon): decorative next to the status tag with text at the end; without the tag, it carries a hidden text. Also the change icon of the nph-chart highlight in the positive sense, declared by the screen (chart/delta-icon-positive): a declared extension, the arrow and the text carry the reading, and the series color never carries state."
    nao_use: "permanent state such as an active badge"
  status/success-surface:
    css: '--nph-status-success-surface'
    claro: core/success/50
    escuro: core/success/900
    use: "Message background. Always together with the other three roles of status/success. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border. Also the background of the nph-file-upload-item in the sent status (file-upload-item/background-success); the text stays on color/foreground and color/muted-foreground, as accepted in Figma."
  status/success-border:
    css: '--nph-status-success-border'
    claro: core/success/200
    escuro: core/success/400
    use: "Message border. Always together with the other three roles of status/success. Also the border of the nph-file-upload-item in the sent status in light mode (file-upload-item/border-success); in dark mode the item points to core/alpha/success-400-40."
  status/success-foreground:
    css: '--nph-status-success-foreground'
    claro: core/success/800
    escuro: core/success/100
    use: "Text inside the message. Always together with the other three roles of status/success. Exception: in the light nph-badge only the -surface and -foreground pair applies, without -border."
  status/on-solid:
    css: '--nph-status-on-solid'
    claro: color/background
    escuro: core/slate/950
    use: "Text and icon on the solid status background (in dark mode core/slate/950: 4.99:1 over status/help, the lowest of the five solids): nph-badge and nph-button in the info, warn, help and success types. DO NOT USE on the light surface of the message — there status/<matiz>-foreground applies. Also the triangle of the nph-stepper step marker with an error, on status/error (stepper/marker-foreground-error)."
  status/info-hover:
    css: '--nph-status-info-hover'
    claro: core/info/700
    escuro: core/info/300
    use: "Background of status/info in the hover-active state of the solid nph-button, with status/on-solid on top (supersedes B4)."
  status/info-surface-hover:
    css: '--nph-status-info-surface-hover'
    claro: core/info/100
    escuro: core/info/800
  status/warning-hover:
    css: '--nph-status-warning-hover'
    claro: core/warn/700
    escuro: core/warn/300
    use: "Background of status/warning in the hover-active state of the solid nph-button, with status/on-solid on top (supersedes B4)."
  status/warning-surface-hover:
    css: '--nph-status-warning-surface-hover'
    claro: core/warn/100
    escuro: core/warn/800
  status/help-hover:
    css: '--nph-status-help-hover'
    claro: core/help/700
    escuro: core/help/300
    use: "Background of status/help in the hover-active state of the solid nph-button, with status/on-solid on top (supersedes B4)."
  status/help-surface-hover:
    css: '--nph-status-help-surface-hover'
    claro: core/help/100
    escuro: core/help/800
  status/success-hover:
    css: '--nph-status-success-hover'
    claro: core/success/700
    escuro: core/success/300
    use: "Background of status/success in the hover-active state of the solid nph-button, with status/on-solid on top (supersedes B4)."
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
    escuro: core/slate/950
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
    escuro: core/slate/950
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
    escuro: core/slate/950
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
    escuro: core/slate/950
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
    escuro: core/slate/950
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
    escuro: core/slate/950
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
  event/sistemas-surface:
    css: '--nph-event-sistemas-surface'
    claro: core/sistemas/50
    escuro: core/sistemas/900
    use: "Background of the nph-scheduler event in the `sistemas` vertical chosen for the calendar. Pair it with event/sistemas-on-surface (text) and event/sistemas-indicator (bar)."
    nao_use: "Text or bar color of the event, status color, or use outside the nph-scheduler."
  event/sistemas-on-surface:
    css: '--nph-event-sistemas-on-surface'
    claro: core/sistemas/700
    escuro: core/sistemas/100
    use: "Title and time of the nph-scheduler event in the `sistemas` vertical, on event/sistemas-surface. Required pair of event/sistemas-surface."
    nao_use: "Any surface other than event/sistemas-surface or event/sistemas-surface-hover."
  event/sistemas-indicator:
    css: '--nph-event-sistemas-indicator'
    claro: core/sistemas/700
    escuro: core/sistemas/100
    use: "Left bar of the nph-scheduler event in the `sistemas` vertical, on event/sistemas-surface. Required pair of event/sistemas-surface."
    nao_use: "Text, or a status signal."
  event/sistemas-surface-hover:
    css: '--nph-event-sistemas-surface-hover'
    claro: core/sistemas/100
    escuro: core/sistemas/800
    use: "Hover and open background of the nph-scheduler event in the `sistemas` vertical, one tone above event/sistemas-surface. Pair it with event/sistemas-on-surface-hover."
    nao_use: "Resting background."
  event/sistemas-on-surface-hover:
    css: '--nph-event-sistemas-on-surface-hover'
    claro: core/sistemas/800
    escuro: core/sistemas/100
    use: "Title and time of the nph-scheduler event in the `sistemas` vertical in hover and open, on event/sistemas-surface-hover. Required pair of event/sistemas-surface-hover."
    nao_use: "Resting text."
  event/sistemas-focus-border:
    css: '--nph-event-sistemas-focus-border'
    claro: core/sistemas/700
    escuro: core/sistemas/100
    use: "1 px focus border of the nph-scheduler event in the `sistemas` vertical (and of the cancelled event with focus); it is the part that meets 3:1. Pair it with event/sistemas-focus-halo."
    nao_use: "Another piece, or the primary event (there it is focus/border)."
  event/sistemas-focus-halo:
    css: '--nph-event-sistemas-focus-halo'
    claro: core/sistemas/200
    escuro: core/sistemas/700
    use: "Focus halo of the nph-scheduler event in the `sistemas` vertical, outside event/sistemas-focus-border. Decoration, with no 3:1. Required pair of event/sistemas-focus-border."
    nao_use: "Another piece, or the primary event (there it is focus/halo)."
  event/gerencial-surface:
    css: '--nph-event-gerencial-surface'
    claro: core/gerencial/50
    escuro: core/gerencial/900
    use: "Background of the nph-scheduler event in the `gerencial` vertical chosen for the calendar. Pair it with event/gerencial-on-surface (text) and event/gerencial-indicator (bar)."
    nao_use: "Text or bar color of the event, status color, or use outside the nph-scheduler."
  event/gerencial-on-surface:
    css: '--nph-event-gerencial-on-surface'
    claro: core/gerencial/700
    escuro: core/gerencial/100
    use: "Title and time of the nph-scheduler event in the `gerencial` vertical, on event/gerencial-surface. Required pair of event/gerencial-surface."
    nao_use: "Any surface other than event/gerencial-surface or event/gerencial-surface-hover."
  event/gerencial-indicator:
    css: '--nph-event-gerencial-indicator'
    claro: core/gerencial/700
    escuro: core/gerencial/100
    use: "Left bar of the nph-scheduler event in the `gerencial` vertical, on event/gerencial-surface. Required pair of event/gerencial-surface."
    nao_use: "Text, or a status signal."
  event/gerencial-surface-hover:
    css: '--nph-event-gerencial-surface-hover'
    claro: core/gerencial/100
    escuro: core/gerencial/800
    use: "Hover and open background of the nph-scheduler event in the `gerencial` vertical, one tone above event/gerencial-surface. Pair it with event/gerencial-on-surface-hover."
    nao_use: "Resting background."
  event/gerencial-on-surface-hover:
    css: '--nph-event-gerencial-on-surface-hover'
    claro: core/gerencial/800
    escuro: core/gerencial/100
    use: "Title and time of the nph-scheduler event in the `gerencial` vertical in hover and open, on event/gerencial-surface-hover. Required pair of event/gerencial-surface-hover."
    nao_use: "Resting text."
  event/gerencial-focus-border:
    css: '--nph-event-gerencial-focus-border'
    claro: core/gerencial/700
    escuro: core/gerencial/100
    use: "1 px focus border of the nph-scheduler event in the `gerencial` vertical (and of the cancelled event with focus); it is the part that meets 3:1. Pair it with event/gerencial-focus-halo."
    nao_use: "Another piece, or the primary event (there it is focus/border)."
  event/gerencial-focus-halo:
    css: '--nph-event-gerencial-focus-halo'
    claro: core/gerencial/200
    escuro: core/gerencial/700
    use: "Focus halo of the nph-scheduler event in the `gerencial` vertical, outside event/gerencial-focus-border. Decoration, with no 3:1. Required pair of event/gerencial-focus-border."
    nao_use: "Another piece, or the primary event (there it is focus/halo)."
  event/educacao-surface:
    css: '--nph-event-educacao-surface'
    claro: core/educacao/50
    escuro: core/educacao/900
    use: "Background of the nph-scheduler event in the `educacao` vertical chosen for the calendar. Pair it with event/educacao-on-surface (text) and event/educacao-indicator (bar)."
    nao_use: "Text or bar color of the event, status color, or use outside the nph-scheduler."
  event/educacao-on-surface:
    css: '--nph-event-educacao-on-surface'
    claro: core/educacao/700
    escuro: core/educacao/100
    use: "Title and time of the nph-scheduler event in the `educacao` vertical, on event/educacao-surface. Required pair of event/educacao-surface."
    nao_use: "Any surface other than event/educacao-surface or event/educacao-surface-hover."
  event/educacao-indicator:
    css: '--nph-event-educacao-indicator'
    claro: core/educacao/700
    escuro: core/educacao/100
    use: "Left bar of the nph-scheduler event in the `educacao` vertical, on event/educacao-surface. Required pair of event/educacao-surface."
    nao_use: "Text, or a status signal."
  event/educacao-surface-hover:
    css: '--nph-event-educacao-surface-hover'
    claro: core/educacao/100
    escuro: core/educacao/800
    use: "Hover and open background of the nph-scheduler event in the `educacao` vertical, one tone above event/educacao-surface. Pair it with event/educacao-on-surface-hover."
    nao_use: "Resting background."
  event/educacao-on-surface-hover:
    css: '--nph-event-educacao-on-surface-hover'
    claro: core/educacao/800
    escuro: core/educacao/100
    use: "Title and time of the nph-scheduler event in the `educacao` vertical in hover and open, on event/educacao-surface-hover. Required pair of event/educacao-surface-hover."
    nao_use: "Resting text."
  event/educacao-focus-border:
    css: '--nph-event-educacao-focus-border'
    claro: core/educacao/700
    escuro: core/educacao/100
    use: "1 px focus border of the nph-scheduler event in the `educacao` vertical (and of the cancelled event with focus); it is the part that meets 3:1. Pair it with event/educacao-focus-halo."
    nao_use: "Another piece, or the primary event (there it is focus/border)."
  event/educacao-focus-halo:
    css: '--nph-event-educacao-focus-halo'
    claro: core/educacao/200
    escuro: core/educacao/700
    use: "Focus halo of the nph-scheduler event in the `educacao` vertical, outside event/educacao-focus-border. Decoration, with no 3:1. Required pair of event/educacao-focus-border."
    nao_use: "Another piece, or the primary event (there it is focus/halo)."
  event/comercial-surface:
    css: '--nph-event-comercial-surface'
    claro: core/comercial/50
    escuro: core/comercial/900
    use: "Background of the nph-scheduler event in the `comercial` vertical chosen for the calendar. Pair it with event/comercial-on-surface (text) and event/comercial-indicator (bar)."
    nao_use: "Text or bar color of the event, status color, or use outside the nph-scheduler."
  event/comercial-on-surface:
    css: '--nph-event-comercial-on-surface'
    claro: core/comercial/700
    escuro: core/comercial/100
    use: "Title and time of the nph-scheduler event in the `comercial` vertical, on event/comercial-surface. Required pair of event/comercial-surface."
    nao_use: "Any surface other than event/comercial-surface or event/comercial-surface-hover."
  event/comercial-indicator:
    css: '--nph-event-comercial-indicator'
    claro: core/comercial/700
    escuro: core/comercial/100
    use: "Left bar of the nph-scheduler event in the `comercial` vertical, on event/comercial-surface. Required pair of event/comercial-surface."
    nao_use: "Text, or a status signal."
  event/comercial-surface-hover:
    css: '--nph-event-comercial-surface-hover'
    claro: core/comercial/100
    escuro: core/comercial/800
    use: "Hover and open background of the nph-scheduler event in the `comercial` vertical, one tone above event/comercial-surface. Pair it with event/comercial-on-surface-hover."
    nao_use: "Resting background."
  event/comercial-on-surface-hover:
    css: '--nph-event-comercial-on-surface-hover'
    claro: core/comercial/800
    escuro: core/comercial/100
    use: "Title and time of the nph-scheduler event in the `comercial` vertical in hover and open, on event/comercial-surface-hover. Required pair of event/comercial-surface-hover."
    nao_use: "Resting text."
  event/comercial-focus-border:
    css: '--nph-event-comercial-focus-border'
    claro: core/comercial/700
    escuro: core/comercial/100
    use: "1 px focus border of the nph-scheduler event in the `comercial` vertical (and of the cancelled event with focus); it is the part that meets 3:1. Pair it with event/comercial-focus-halo."
    nao_use: "Another piece, or the primary event (there it is focus/border)."
  event/comercial-focus-halo:
    css: '--nph-event-comercial-focus-halo'
    claro: core/comercial/200
    escuro: core/comercial/700
    use: "Focus halo of the nph-scheduler event in the `comercial` vertical, outside event/comercial-focus-border. Decoration, with no 3:1. Required pair of event/comercial-focus-border."
    nao_use: "Another piece, or the primary event (there it is focus/halo)."
  event/financeiro-surface:
    css: '--nph-event-financeiro-surface'
    claro: core/financeiro/50
    escuro: core/financeiro/900
    use: "Background of the nph-scheduler event in the `financeiro` vertical chosen for the calendar. Pair it with event/financeiro-on-surface (text) and event/financeiro-indicator (bar)."
    nao_use: "Text or bar color of the event, status color, or use outside the nph-scheduler."
  event/financeiro-on-surface:
    css: '--nph-event-financeiro-on-surface'
    claro: core/financeiro/700
    escuro: core/financeiro/100
    use: "Title and time of the nph-scheduler event in the `financeiro` vertical, on event/financeiro-surface. Required pair of event/financeiro-surface."
    nao_use: "Any surface other than event/financeiro-surface or event/financeiro-surface-hover."
  event/financeiro-indicator:
    css: '--nph-event-financeiro-indicator'
    claro: core/financeiro/700
    escuro: core/financeiro/100
    use: "Left bar of the nph-scheduler event in the `financeiro` vertical, on event/financeiro-surface. Required pair of event/financeiro-surface."
    nao_use: "Text, or a status signal."
  event/financeiro-surface-hover:
    css: '--nph-event-financeiro-surface-hover'
    claro: core/financeiro/100
    escuro: core/financeiro/800
    use: "Hover and open background of the nph-scheduler event in the `financeiro` vertical, one tone above event/financeiro-surface. Pair it with event/financeiro-on-surface-hover."
    nao_use: "Resting background."
  event/financeiro-on-surface-hover:
    css: '--nph-event-financeiro-on-surface-hover'
    claro: core/financeiro/800
    escuro: core/financeiro/100
    use: "Title and time of the nph-scheduler event in the `financeiro` vertical in hover and open, on event/financeiro-surface-hover. Required pair of event/financeiro-surface-hover."
    nao_use: "Resting text."
  event/financeiro-focus-border:
    css: '--nph-event-financeiro-focus-border'
    claro: core/financeiro/700
    escuro: core/financeiro/100
    use: "1 px focus border of the nph-scheduler event in the `financeiro` vertical (and of the cancelled event with focus); it is the part that meets 3:1. Pair it with event/financeiro-focus-halo."
    nao_use: "Another piece, or the primary event (there it is focus/border)."
  event/financeiro-focus-halo:
    css: '--nph-event-financeiro-focus-halo'
    claro: core/financeiro/200
    escuro: core/financeiro/700
    use: "Focus halo of the nph-scheduler event in the `financeiro` vertical, outside event/financeiro-focus-border. Decoration, with no 3:1. Required pair of event/financeiro-focus-border."
    nao_use: "Another piece, or the primary event (there it is focus/halo)."
  event/igrejas-surface:
    css: '--nph-event-igrejas-surface'
    claro: core/igrejas/50
    escuro: core/igrejas/900
    use: "Background of the nph-scheduler event in the `igrejas` vertical chosen for the calendar. Pair it with event/igrejas-on-surface (text) and event/igrejas-indicator (bar)."
    nao_use: "Text or bar color of the event, status color, or use outside the nph-scheduler."
  event/igrejas-on-surface:
    css: '--nph-event-igrejas-on-surface'
    claro: core/igrejas/700
    escuro: core/igrejas/100
    use: "Title and time of the nph-scheduler event in the `igrejas` vertical, on event/igrejas-surface. Required pair of event/igrejas-surface."
    nao_use: "Any surface other than event/igrejas-surface or event/igrejas-surface-hover."
  event/igrejas-indicator:
    css: '--nph-event-igrejas-indicator'
    claro: core/igrejas/700
    escuro: core/igrejas/100
    use: "Left bar of the nph-scheduler event in the `igrejas` vertical, on event/igrejas-surface. Required pair of event/igrejas-surface."
    nao_use: "Text, or a status signal."
  event/igrejas-surface-hover:
    css: '--nph-event-igrejas-surface-hover'
    claro: core/igrejas/100
    escuro: core/igrejas/800
    use: "Hover and open background of the nph-scheduler event in the `igrejas` vertical, one tone above event/igrejas-surface. Pair it with event/igrejas-on-surface-hover."
    nao_use: "Resting background."
  event/igrejas-on-surface-hover:
    css: '--nph-event-igrejas-on-surface-hover'
    claro: core/igrejas/800
    escuro: core/igrejas/100
    use: "Title and time of the nph-scheduler event in the `igrejas` vertical in hover and open, on event/igrejas-surface-hover. Required pair of event/igrejas-surface-hover."
    nao_use: "Resting text."
  event/igrejas-focus-border:
    css: '--nph-event-igrejas-focus-border'
    claro: core/igrejas/700
    escuro: core/igrejas/100
    use: "1 px focus border of the nph-scheduler event in the `igrejas` vertical (and of the cancelled event with focus); it is the part that meets 3:1. Pair it with event/igrejas-focus-halo."
    nao_use: "Another piece, or the primary event (there it is focus/border)."
  event/igrejas-focus-halo:
    css: '--nph-event-igrejas-focus-halo'
    claro: core/igrejas/200
    escuro: core/igrejas/700
    use: "Focus halo of the nph-scheduler event in the `igrejas` vertical, outside event/igrejas-focus-border. Decoration, with no 3:1. Required pair of event/igrejas-focus-border."
    nao_use: "Another piece, or the primary event (there it is focus/halo)."
  event/rh-surface:
    css: '--nph-event-rh-surface'
    claro: core/rh/50
    escuro: core/rh/900
    use: "Background of the nph-scheduler event in the `rh` vertical chosen for the calendar. Pair it with event/rh-on-surface (text) and event/rh-indicator (bar)."
    nao_use: "Text or bar color of the event, status color, or use outside the nph-scheduler."
  event/rh-on-surface:
    css: '--nph-event-rh-on-surface'
    claro: core/rh/700
    escuro: core/rh/100
    use: "Title and time of the nph-scheduler event in the `rh` vertical, on event/rh-surface. Required pair of event/rh-surface."
    nao_use: "Any surface other than event/rh-surface or event/rh-surface-hover."
  event/rh-indicator:
    css: '--nph-event-rh-indicator'
    claro: core/rh/700
    escuro: core/rh/100
    use: "Left bar of the nph-scheduler event in the `rh` vertical, on event/rh-surface. Required pair of event/rh-surface."
    nao_use: "Text, or a status signal."
  event/rh-surface-hover:
    css: '--nph-event-rh-surface-hover'
    claro: core/rh/100
    escuro: core/rh/800
    use: "Hover and open background of the nph-scheduler event in the `rh` vertical, one tone above event/rh-surface. Pair it with event/rh-on-surface-hover."
    nao_use: "Resting background."
  event/rh-on-surface-hover:
    css: '--nph-event-rh-on-surface-hover'
    claro: core/rh/800
    escuro: core/rh/100
    use: "Title and time of the nph-scheduler event in the `rh` vertical in hover and open, on event/rh-surface-hover. Required pair of event/rh-surface-hover."
    nao_use: "Resting text."
  event/rh-focus-border:
    css: '--nph-event-rh-focus-border'
    claro: core/rh/700
    escuro: core/rh/100
    use: "1 px focus border of the nph-scheduler event in the `rh` vertical (and of the cancelled event with focus); it is the part that meets 3:1. Pair it with event/rh-focus-halo."
    nao_use: "Another piece, or the primary event (there it is focus/border)."
  event/rh-focus-halo:
    css: '--nph-event-rh-focus-halo'
    claro: core/rh/200
    escuro: core/rh/700
    use: "Focus halo of the nph-scheduler event in the `rh` vertical, outside event/rh-focus-border. Decoration, with no 3:1. Required pair of event/rh-focus-border."
    nao_use: "Another piece, or the primary event (there it is focus/halo)."

# ---------------------------------------------------------------
# BRAND LAYER. One mode per vertical. The semantic layer consumes it; a
# component token consumes it straight only by decision.
# ---------------------------------------------------------------
tokens_theme:
  modos: [Sistemas, Gerencial, Educacao, Comercial, Financeiro, Igrejas, Recursos Humanos]
  nota: >-
    Nephos is multi-brand. The active brand is a dimension independent of the color scheme:
    a product can be in Educacao + dark without anything being re-authored.
    Component CSS never consumes these tokens. The semantic layer consumes them; a component
    token aliases one straight only by decision, when no semantic token has the same function.
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
    valor_por_modo: "core/slate/950 in `Sistemas`, `Comercial` and `Financeiro`; core/base/white in `Gerencial`, `Igrejas`, `Recursos Humanos` and `Educacao`"
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
    use: "Light tone of the active brand. Border of a piece in light emphasis in light mode. Consumed by semantic; a component token uses it straight only by decision, when no semantic token has the same function."
  theme/brand-300:
    css: '--nph-theme-brand-300'
    valor_por_modo: core/<vertical>/300
    use: "Tone 300 of the active brand. Created for the focus border in dark mode, where the 400 failed the 3:1 minimum in `Gerencial` and `Recursos Humanos`. Do not use for fill or text, except in a component token that uses it straight by decision."
  theme/brand-800:
    css: '--nph-theme-brand-800'
    valor_por_modo: core/<vertical>/800
    use: "Dark tone of the active brand. Text and icon on a light brand surface in light mode. Consumed only by semantic."
  theme/brand-900:
    css: '--nph-theme-brand-900'
    valor_por_modo: core/<vertical>/900
    use: "Darkest tone of the active brand. Background of a piece in light emphasis in dark mode. Consumed by semantic; a component token uses it straight only by decision, when no semantic token has the same function."
  theme/brand-focus:
    css: '--nph-theme-brand-focus'
    valor_por_modo: "core/<vertical>/500 in five verticals; core/sistemas/600 in `Sistemas`; core/educacao/700 in `Educacao`"
    use: "Brand tone used in the focus ring. Tone 500 in five verticals; `Sistemas` uses 600 because its 500 measured 2,92:1 against its halo and failed the 3:1 minimum of WCAG 2.2 AA criterion 1.4.11 (DSA-92); `Educação` uses 700 because its 500 measures 1,92:1 against white and fails the same minimum. Do not use for fill or text."
  theme/brand-halo:
    css: '--nph-theme-brand-halo'
    valor_por_modo: "core/<vertical>/100 in `Sistemas` and `Comercial`; core/<vertical>/200 in `Financeiro` and `Igrejas`; core/<vertical>/300 in `Gerencial`, `Educacao` and `Recursos Humanos`"
    use: "Focus halo tone in light mode, consumed only by focus/halo. In each brand it is the strongest tone at which the focus border still measures at least 3:1 against the halo. except `Sistemas`: it stays at tone 100, where the tone 600 border measures 4,26:1, because the decision of 2026-10-26 changed only the border (DSA-92). Do not use for fill, border or text."
  theme/brand-halo-dark:
    css: '--nph-theme-brand-halo-dark'
    valor_por_modo: "core/<vertical>/700 in `Sistemas`, `Comercial` and `Financeiro`; core/<vertical>/500 in `Gerencial` and `Recursos Humanos`; core/igrejas/600 in `Igrejas`; core/educacao/800 in `Educacao`"
    use: "Focus halo tone in dark mode, consumed only by focus/halo. In each brand it is darker than the dark focus border (theme/brand-200), which measures from 5,02:1 to 6,74:1 against it; `Educacao` uses 800. Do not use for fill, border or text."
  theme/brand-text-dark:
    css: '--nph-theme-brand-text-dark'
    valor_por_modo: "core/<vertical>/300 in `Educacao`; core/<vertical>/200 in `Sistemas`, `Comercial` and `Financeiro`; core/<vertical>/100 in `Gerencial`, `Igrejas` and `Recursos Humanos`"
    use: "Brand tone for text and icon on background, card, popover or dialog in dark mode, consumed by color/primary-text and color/link. In each brand it measures at least 4.5:1 on color/popover, on the nph-sidebar panel (theme/brand-800) and on color/dialog. Since DSA-84, one tone lighter in `Gerencial`, `Comercial`, `Financeiro` and `Recursos Humanos`, which fell below 4.5:1 on color/dialog (4.02:1 to 4.43:1). With the slate scale, one tone lighter also in `Sistemas` and `Igrejas`, which fell to 3.83:1 and 3.79:1 on color/dialog; now 4.99:1 and 5.68:1. Do not use for fill or border."
  theme/brand-text-light:
    css: '--nph-theme-brand-text-light'
    valor_por_modo: "core/<vertical>/600 in six verticals; core/educacao/800 in `Educacao`"
    use: "Brand tone for text and icon on background and surface in light mode, consumed by color/primary-on-surface. The same tone as theme/brand-600 in six verticals; `Educacao` uses 800, because its 700 measures 4.27:1 on color/muted, below the 4.5:1 of WCAG 1.4.3 for normal text, and its 800 measures 7.53:1. The solid button, the link and color/primary-border stay on theme/brand-600; the border of the primary outline nph-button uses color/primary-on-surface and follows the label. Do not use for solid fill."
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
  css_forma: "The `css` field of each role is a PREFIX, not the final name. Each role emits five custom properties: `-font-family`, `-font-size`, `-line-height`, `-font-weight` and `-letter-spacing`. Example: text/label-md emits --nph-text-label-md-font-size. They are five and not one because `letter-spacing` does not fit the CSS `font` shorthand and because a component often needs a single property (P62.2)."
  css_unidade_real: "All five come out in rem: the generator follows the `unidade_css` rule above (P62.4). The conversion uses a 16px root and applies to every dimension, EXCEPT core/radius and core/shadow-*, which follow `raio_regras.unidade_css: px` and `elevacao_regras.unidade_css: px` by their own rule."

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

tokens_texto_destaque:
  text/highlight-weight:
    css: '--nph-text-highlight-weight'
    alias: core/weight/semibold
    valor: 600
    use: "Weight of the highlighted stretch inside a text, such as the searched term in the nph-combobox list and in the nph-command list (command/highlight-weight). USE only on the stretch that repeats what the person typed; the rest of the text keeps the weight of its role. DO NOT USE for a whole title or label: use the text role."

# ---------------------------------------------------------------
# SPACING - primitives in core (invisible) and 7 intent tokens
# in the semantic collection. Component CSS consumes ONLY the
# semantic or component tokens; a component token aliases a primitive
# straight only by decision. Base 4px with a half-step of 2. Values in px; in CSS
# use rem, root 16px.
# ---------------------------------------------------------------
espacamento_regras:
  unidade_base: 4
  meio_passo: 2
  meio_passo_use: "Only chip, icon and table cell. It has no semantic token. Declared exception, by decision: the gap between the title line and the description of the nph-accordion trigger (accordion/title-gap, straight to core/space/50, DSA-97), the same gap in the nph-collapsible trigger (collapsible/title-gap, straight to core/space/50) and the gap between the two parts of the nph-split-button (split-button/gap, straight to core/space/50, DSA-109). Also by decision, in the nph-chart (DSA-101): the 2 px stroke between neighbor colors and the 2 px gap between the mark and the data focus border (chart/segment-gap, chart/focus-offset, straight to core/space/50), drawn lines, not a gap between boxes. Also by decision, the 2 px drop of the label from the top of the nph-checkbox, nph-radio and nph-switch (default size) and of the text block of the nph-rich-option (checkbox/label-offset, radio/label-offset, switch/label-offset, rich-option/content-offset, straight to core/space/50): it centers the first 20 px line on the 24 px target; the same 2 px drop of the content (icon, dot, label and check mark) of the rich option of the nph-select list (select/option-content-offset, straight to core/space/50), which lines the first line up with the center of the 24 px avatar or checkbox; space/inline-tight (4) has the function of a gap, not the value, and radius/subtle (2) is a radius."
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
  '1200': { valor: 96, rem: '6rem',     css: '--nph-core-space-1200' }
  '1500': { valor: 144, rem: '9rem',    css: '--nph-core-space-1500' }
  direto_por_decisao: 'A component token aliases a core space straight only by decision, when no semantic token has the same function; the origin in semantic.tokens.json says why. In the nph-timeline: 100 above and below the connector line (timeline/connector-gap), 200 on the history dot and the center dot (timeline/dot-size, as carousel/indicator-size) and 300 between the marker column and the text (timeline/content-gap). In the rich option: 200 on its padding and its start dot (select/option-padding, select/option-dot-size): space/inline and space/stack-snug are gaps, radius/container, radius/inset and focus/radius-inner are radii. In the nph-date-picker: 100 between the field and the open panel, below or above (date-picker/panel-offset, as popover/offset). In the nph-tree-select: 100 between the field and the panel (tree-select/panel-offset), as popover/offset: space/inline-tight and space/stack-tight are the gap of a unit and of a dense line, radius/inner is a radius and focus/ring-width the width of the halo; none names the distance from the anchor. In the nph-accordion: 50 between the title line and the description of the trigger (accordion/title-gap), a declared exception to the half-step rule above: space/stack-tight (4) and space/stack-snug (8) have the function and not the requested value, and radius/subtle (2) is a radius; it leaves when the accordion item becomes an instance of the nph-collapsible. 200 and 100 on the padding of the start tile (accordion/tile-padding, accordion/tile-padding-compact): no semantic token is the inner padding of a small piece; space/inline-tight, space/stack-tight, space/inline and space/stack-snug are gaps, radius/inner, radius/container and radius/inset are radii, focus/ring-width and focus/radius-inner are focus. In the nph-toast-region: 600 and 400 from the region to the edge of the screen, at the bottom and at the end on the default screen from 768 px (toast-region/inset), and at the bottom and on both sides on the compact screen below 768 px (toast-region/inset-compact): layout/margin-default, layout/margin-compact and layout/gutter are the side margin of the page and the gutter between columns, space/overlay-padding, space/surface-padding and space/container-padding are inner padding, space/stack is the gap between stacked items, and icon/size-lg and icon/size-sm are icon sizes, and the text/* sizes are type and line height. In the nph-chart (DSA-101): 50 on the 2 px stroke between neighbor colors and on the gap between the mark and the focus border (chart/segment-gap, chart/focus-offset): radius/subtle, the only general semantic of 2, is the radius of a small marker (switch/track-padding-sm belongs to another piece). 200 on the marker, the side padding of the legend item, the gap between the rows of a wrapped legend, the tooltip padding and the gap between the error sentence and its button (chart/marker-size, chart/legend-item-padding, chart/legend-row-gap, chart/tooltip-padding, chart/error-stack-gap): space/inline and space/stack-snug are gaps between pieces, radius/container, radius/inset and focus/radius-inner are radii. 600 on the height of the `sparkline` type, for a table cell (chart/sparkline-height): layout/gutter, layout/margin-default, icon/size-lg, space/overlay-padding and space/surface-padding have other functions. In the nph-tree-table branch error row: 300 on the sides of the error cell and above and below the row (tree-table/cell-padding-inline, tree-table/row-padding-block): space/control-padding is the inner horizontal padding of a button, field and select and does not cover the vertical breathing room, space/inline-loose is the gap between footer actions and layout/columns the grid count, and the text role sizes of 12 are typography; 800 on the minimum height of the row (tree-table/row-height), as table/row-height: no semantic token is a row height, and avatar/size-lg is an avatar, switch/track-width the switch track and icon/duotone-opacity (Figma only) an opacity. In the nph-popconfirm (DSA-99): 100 between the trigger and the surface (popconfirm/offset), as popover/offset; 400 on the arrow base and on its inset from the corner (popconfirm/arrow-width, popconfirm/arrow-inset) and 200 on its height (popconfirm/arrow-height), as popover/arrow-*; 600 on the content and actions padding in the md size (popconfirm/padding-md, popconfirm/footer-padding-md): space/surface-padding is the card, space/overlay-padding the layer that blocks the page, layout/gutter and layout/margin-default the page and icon/size-lg an icon; 200 on the padding of the icon box (popconfirm/icon-box-padding), as card/icon-container-padding. In the nph-rich-text-editor (DSA-105): 200 above and below the text area and below the footer (rich-text-editor/content-padding-y): space/inline is the gap between side-by-side elements and space/stack-snug the gap between a title and its description, and radius/container, radius/inset and focus/radius-inner are radii; 400 on the start padding of the quote text, after its bar (rich-text-editor/quote-padding-start): space/stack is the gap between stacked siblings, space/container-padding the padding of a panel, popover and dialog, layout/margin-compact the page margin and icon/size-sm an icon box; 600 on the list indent (rich-text-editor/list-indent): layout/gutter is the gutter between columns, layout/margin-default the page margin, icon/size-lg an icon box, space/overlay-padding the layer that blocks the page and space/surface-padding the card. In the nph-split-button (DSA-109): 50 between the main part and the arrow (split-button/gap), a declared exception to the half-step rule above: radius/subtle, the only general semantic of 2, is the radius of a small marker, not a gap, and in the space family the smallest is space/inline-tight, 4. In the nph-collapsible: 50 between the title line and the description of the trigger (collapsible/title-gap), the same as accordion/title-gap and for the same reason: space/stack-tight (4) and space/stack-snug (8) have the function, not the value. In the nph-checkbox, nph-radio, nph-switch (default size), nph-rich-option and the rich option of the nph-select list: 50 on the drop of the label or content from the top (checkbox/label-offset, radio/label-offset, switch/label-offset, rich-option/content-offset, select/option-content-offset), a declared exception to the half-step rule above: no semantic token is a 2 px offset; space/inline-tight (4) and space/stack-tight (4) are gaps with another value, and radius/subtle (2) is a radius.'

tokens_space:
  space/inline-tight:
    css: '--nph-space-inline-tight'
    alias: core/space/100
    valor: 4
    use: "Horizontal space INSIDE a unit: an icon and its text, a value and its unit. Exception: the top and bottom breathing room of the nph-badge, as Figma draws it, the offset between the nph-select trigger and its list, and the nph-tabs list as the accepted Figma draws it: the rail padding, the gap between tabs in the segmented and tab button styles, the top and bottom of the tab (segmented and tab button) and of its counter, and the gap to the scroll arrows (tabs/list-padding, tabs/list-gap, tabs/item-padding-y, tabs/counter-padding-y, tabs/scroll-gap). Also between the parts of a dense row of a list, tree or menu, and as breathing room around that list: the gap between the chevron target, the checkbox, the icon and the label of the nph-tree item and the breathing room around the tree (tree/item-gap, tree/toggle-padding, tree/padding). DO NOT USE between independent elements - there it is space/inline. Also the gap between the rows of the nph-panel-menu list, section, second and third level and loading rows (panel-menu/item-gap). Also the top and bottom padding and the gap of the nph-scheduler event, the day label padding, the sides and gap of the month cell and the list item padding (scheduler/event-padding-y, scheduler/event-gap, scheduler/day-label-padding-y, scheduler/month-cell-padding-x, scheduler/month-cell-gap, scheduler/list-item-padding). Also the breathing room around the nph-command list, as the nph-select list (DSA-29 D9), the breathing room of its search row around the field, the gap between the spinner and the text of its loading state and between the key and the word of each footer hint (command/list-padding, command/search-padding, command/status-gap, command/hint-gap). Also the top and bottom padding of the nph-collapsible trigger in the compact size and the gap between its icon, title and indicator (collapsible/trigger-padding-y-compact, collapsible/trigger-gap). Also the gap of the nph-resizable handle line around the grip box and the collapse button (resizable/handle-gap). Also the gap between the label and the secondary text of the rich option, on the same line (select/option-label-gap). Also the breathing room above and below the divider between the nph-accordion items (accordion/divider-spacing), by decision, as the vertical gap between list rows of panel-menu/item-gap and navigation-menu/group-gap. Also the nph-chart: the marker and the name in the legend item and in the tooltip, the icon, number and text of the change, the error icon and sentence, the series name 4 px from the last marker or bar, and the donut slice label 4 px from the box of the ring (chart/legend-item-gap, chart/tooltip-item-gap, chart/delta-gap, chart/error-gap, chart/series-label-gap). Also the gap between the icon, the message and the Try again action of the nph-tree-table branch error row (tree-table/error-gap), the parts of a dense row."
  space/inline:
    css: '--nph-space-inline'
    alias: core/space/200
    valor: 8
    use: "Horizontal space BETWEEN independent elements: buttons of a group, label and badge, items of a bar. Also the side padding of the nph-tree item (tree/item-padding-inline). Also the top and bottom breathing room of the nph-panel-menu subgroup and the gap between its label and its arrow (panel-menu/subgroup-padding-y, panel-menu/subgroup-gap), as the approved nph-sidebar sub item. Also the side padding of the nph-scheduler event, the gap of its toolbar and day header, the day padding, the top and bottom of the month cell and the gaps of the list and the empty state (scheduler/event-padding-x, scheduler/toolbar-gap, scheduler/day-header-gap, scheduler/day-padding, scheduler/month-cell-padding-y, scheduler/list-day-gap, scheduler/list-item-gap, scheduler/empty-gap). Also the padding of the nph-command hint footer (DSA-46 D-2) and the gap between its hints (command/footer-padding, command/footer-gap). Also the top and bottom padding of the nph-collapsible trigger in the default and large sizes (collapsible/trigger-padding-y), by decision, as in nph-navigation-menu. Also the gap between the nph-menubar top items (menubar/bar-gap). Also the gap between the slides of the nph-carousel track and between the pieces of its controls bar (carousel/slide-gap, carousel/control-gap). Also the gap between the pieces of the nph-card header and between its footer actions (card/header-item-gap, card/footer-gap). Also the gap between the control, the icon, the texts and the shortcut of the nph-rich-option choice card (rich-option/gap), and between the box, the start, the texts and the check of the rich option (select/option-gap). Also, in the nph-accordion item, the gap between the start tile, avatar or image and the title (accordion/media-gap), between the title and the tag (accordion/tag-gap) and between the end status and the indicator (accordion/end-gap). Also the nph-chart: the Y-axis label and the plot, the legend items side by side, the name and the value of the legend item and of the tooltip, and the tooltip 8 px from the data (chart/y-label-gap, chart/legend-gap, chart/legend-value-gap, chart/tooltip-value-gap, chart/tooltip-offset). Also the gap inside the error cell of the nph-tree-table branch error row, between the level indent(s), the chevron space and the error block (tree-table/cell-gap); the row itself has no gap: with the 28 px indent it keeps the 36 px step per level of the nph-table tree. Also the gap between the icon box and the text block of the nph-popconfirm (popconfirm/icon-gap): with the box, the icon and the text are two pieces. Also the gap between the text prefix or suffix and the value of the nph-input (input/affix-gap)."
  space/stack-tight:
    css: '--nph-space-stack-tight'
    alias: core/space/100
    valor: 4
    use: "Vertical space between a label and what it describes: label and field, title and subtitle. They are two lines of a single thing. Also the gap between the cut text and the button of the nph-collapsible preview type (collapsible/preview-gap). Also the gap between the title, the description and the who and when line of the nph-timeline item, three lines of one event (timeline/text-gap). Also the gap between the title and the second line of the nph-rich-option choice card and between the label and the description of the rich option (rich-option/text-gap, select/option-text-gap). Also the nph-chart: the plot and the X-axis label below it, the value 4 px from the bar end, the tooltip lines, the highlight value and its change, and the donut total and its label (chart/x-label-gap, chart/data-label-gap, chart/tooltip-gap, chart/highlight-gap)."
  space/stack:
    css: '--nph-space-stack'
    alias: core/space/400
    valor: 16
    use: "Default vertical space between sibling items: fields of a form, items of a list, rows of a panel. Also the gap between the main list and each section of the nph-panel-menu (panel-menu/section-gap). Also the gap between the side panel blocks and between the days of the list of the nph-scheduler (scheduler/sidebar-gap, scheduler/list-gap). Also the gap between the blocks of the nph-collapsible open content (collapsible/content-gap). Also the gap between the nph-carousel track and its controls bar (carousel/controls-offset). Also the gap between the header, the content and the tonal section of the nph-card (card/gap). Also the space below each nph-timeline item, while the connector line runs through it, and the gap between the item text and its action (timeline/item-gap, timeline/action-gap). Also the gap between the blocks of the separated nph-accordion (accordion/item-gap). Also the gap between the toasts stacked in the nph-toast-region, only space, no divider (toast-region/gap). Also the nph-chart: between the plot and the bottom line, or the legend below the plot (chart/section-gap). Also the gap between the text area and the footer of the nph-rich-text-editor (rich-text-editor/footer-gap)."
  space/section:
    css: '--nph-space-section'
    alias: core/space/700
    valor: 32
    use: "Between sections of the same page. If there is a new title, it is section. DO NOT USE between fields."
  space/control-padding:
    css: '--nph-space-control-padding'
    alias: core/space/300
    valor: 12
    use: "Inner horizontal padding of button, field and select - what is operated - the sides of the nph-badge and of the nph-tabs tab (tabs/item-padding-x). DO NOT USE on a card. Also the gap between the icon place and the text line of the nph-panel-menu loading row (panel-menu/skeleton-gap), as the approved nph-sidebar loading row. Also the top and bottom padding of the nph-scheduler toolbar (scheduler/toolbar-padding-y). Also the side padding of the nph-collapsible trigger, the side padding and the bottom padding of its open content (collapsible/trigger-padding-x, collapsible/content-padding-x, collapsible/content-padding-bottom), by decision: Nephos has no semantic for panel padding, and the same pair is used by nph-navigation-menu, nph-notification and nph-table. Also the end padding of the nph-combobox free text field, with and without the clear button (combobox/free-text-padding-end). Also the side padding of the nph-menubar top item, whose width hugs the label (menubar/trigger-padding-x). Also the side padding of the nph-rich-text-editor text area (rich-text-editor/content-padding-x), as the nph-textarea."
  space/container-padding:
    css: '--nph-space-container-padding'
    alias: core/space/400
    valor: 16
    use: "Inner padding of panel, popover and dialog, and of a card in the compact density - what contains; a card in the default density is space/surface-padding (24). DO NOT USE on a control. Also the side padding of the nph-file-upload-item and of the compact nph-file-upload drop zone (file-upload-item/padding-inline, file-upload/padding-compact-inline): the item and the zone are containers of controls, not controls. Also the padding of the nph-scheduler container and of its side panel (scheduler/padding). Also the inner padding of the nph-collapsible card appearance (collapsible/card-padding). Also the compact padding of the nph-card body and action footer and the padding of its tonal section (card/padding-compact, card/footer-padding-compact, card/section-padding). Also the inner padding of the nph-rich-option choice card (rich-option/padding): the card is the choice surface that holds a control, not the control, even when it carries the role and the focus of the choice; and it is a choice card, not a content card, so not space/surface-padding. Also the inner padding of the grouped nph-accordion and of each separated block, on the four sides (accordion/padding): the container of the items, not a control. Also the padding of the nph-popconfirm content and of its actions band in the sm size (popconfirm/padding-sm, popconfirm/footer-padding-sm); the md size is 24, straight to core/space/600 by decision."
  space/surface-padding:
    css: '--nph-space-surface-padding'
    alias: core/space/600
    valor: 24
    use: "Inner padding of a card in the default density: the body and the action footer of the nph-card (card/padding, card/footer-padding). In the compact density it is space/container-padding."
    nao_use: "Panel, popover or dialog: those are space/container-padding. The layer that blocks the page (dialog, modal, side panel): space/overlay-padding. The nph-rich-option choice card: space/container-padding (rich-option/padding)."
  space/stack-snug:
    css: '--nph-space-stack-snug'
    alias: core/space/200
    valor: 8
    use: "Vertical space between the title and the description of a header, and the extra room before the actions of the nph-dialog. DO NOT USE between fields of a form - there it is space/stack. Also the gap between the icon, the action line and the rule of the nph-file-upload drop zone in the default format (file-upload/gap). Also the gap between the section label and its items in the nph-panel-menu (panel-menu/label-gap): the vertical space after a header. Also the space between the nph-collapsible trigger and its open content (collapsible/content-padding-top), so the focus halo does not touch the content. Also the gap between title and description, between the label and the text of the tonal section and between the key-value rows of the nph-card (card/header-gap, card/section-gap, card/list-gap). Also the gap between the title and the description of the nph-popconfirm (popconfirm/text-gap). Also the gap between the blocks of the nph-rich-text-editor content (rich-text-editor/block-gap): from a heading to its paragraph, and between paragraphs by analogy."
  space/inline-loose:
    css: '--nph-space-inline-loose'
    alias: core/space/300
    valor: 12
    use: "Space between the actions of a footer, side by side or stacked: nph-dialog, alert, nph-popover, the nph-popconfirm (popconfirm/actions-gap), the range footer of the nph-date-picker (date-picker/footer-gap), the footer of the nph-rich-text-editor (rich-text-editor/footer-actions-gap) and the footer of the nph-textarea (DSA-107). DO NOT USE inside a regular group of buttons - there it is space/inline."
  space/overlay-padding:
    css: '--nph-space-overlay-padding'
    alias: core/space/600
    valor: 24
    use: "Inner padding of the layer that BLOCKS the page: dialog, modal and side panel. USE on the padding of the nph-dialog. DO NOT USE on card, popover or control - the card is space/surface-padding in the default density, the popover is space/container-padding."

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
  motivo: 'The seven shadows of the system are all drop shadows. A sunken field and a list well are solved with color/muted on the background plus a border (color/field-border and color/field-border-bottom on a field at rest). The 1 px inner shadow that draws the bottom line of a field in the Figma masters is a border in CSS, not a shadow. Inner shadow is vocabulary of the 2010s admin panel, which is among the anti-references.'

tokens_control:
  control/height-compact:
    css: '--nph-control-height-compact'
    alias: core/control-height/compact
    valor: 28
    use: "Control height in a dense screen: table, toolbar, filter. NEVER on a touch target - it fails WCAG 2.5.8. Exception: the tab inside the segmented nph-tabs rail (tabs/item-height), as the accepted Figma draws it: the tab sits in a rail of control/height-default and stays above 24 x 24. Also the height of the \"+N more\" button of the nph-scheduler month (scheduler/more-height). Also the minimum height of the nph-collapsible trigger in the compact size (collapsible/trigger-height-compact), on a dense screen only. Also the collapse button of the nph-resizable handle (nph-icon-button compact), by the T4 exception of 16-11: the handle is thin and the component is desktop only (out of mobile in v1); 28 stays above 24 x 24. On a tablet touch screen it stays compact until the design owner decides otherwise (DSA-86)."
  control/height-default:
    css: '--nph-control-height-default'
    alias: core/control-height/default
    valor: 36
    use: "Default height of button and of the other controls. When in doubt, it is this one. Form fields use control/height-field (38). Also the select and the go to page field of the nph-pagination (pagination/field-height), which stay at the height of its buttons. Also the height of the nph-tree item and of its error row (tree/item-height). Also the height of the nph-panel-menu subgroup (panel-menu/subgroup-height). Also the minimum height of the nph-collapsible trigger in the default size (collapsible/trigger-height). Also the side of the day cell in the nph-scheduler mini month (scheduler/mini-month-cell-size). Also the height of the nph-menubar top item (menubar/trigger-height)."
  control/height-field:
    css: '--nph-control-height-field'
    alias: core/control-height/field
    valor: 38
    use: "Default height of the form fields: nph-input, nph-select, nph-combobox, nph-multi-combobox (minimum height) and nph-date-picker (input/height, select/height, combobox/height, multi-combobox/height, date-picker/height), and nph-tree-select and nph-field through them. Button and the other controls stay at control/height-default (36), also the calendar button beside the nph-date-picker field."
    nao_use: "Button, icon button, tabs, chip, tree item, menubar and the cell of nph-input-otp: control/height-default. The compact and large sizes: control/height-compact and control/height-large. The fields of nph-pagination: pagination/field-height (36)."
  control/height-large:
    css: '--nph-control-height-large'
    alias: core/control-height/large
    valor: 44
    use: "Main form and touch-sensitive screen. Guarantees the 44px minimum target recommended by WCAG 2.2. Also the minimum height of the nph-collapsible trigger in the large size (collapsible/trigger-height-large)."

# ---------------------------------------------------------------
# HOW A COMPONENT TOKEN IS DOCUMENTED. A component token is documented in
# its own block `tokens_<piece>`, with `use:` and `nao_use:` per token; the
# semantic token says only its general role and stops listing consumers.
# Same practice as Carbon (component token documented in the Style tab of
# each piece: https://carbondesignsystem.com/elements/color/tokens/),
# Primer (description, uses and rules per token:
# https://unpkg.com/@primer/primitives@11.10.0/DESIGN_TOKENS_SPEC.md) and
# Salesforce SLDS (the hooks of a piece listed on its page:
# https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties.html).
# ---------------------------------------------------------------
tokens_avatar:
  avatar/size-sm:
    css: '--nph-avatar-size-sm'
    alias: core/avatar-size/100
    valor: 24
    use: "Avatar of 24. USE in a list option (nph-select, nph-combobox) and next to 14px text, and on the +N counter of nph-avatar-stack, which has the avatar shape (until the measure review). DO NOT USE as an icon size."
  avatar/size-md:
    css: '--nph-avatar-size-md'
    alias: core/avatar-size/200
    valor: 32
    use: "Avatar of 32. USE in a header, card and table row, and on the +N counter of nph-avatar-stack, which has the avatar shape (until the measure review). DO NOT USE as an icon size."
  avatar/size-lg:
    css: '--nph-avatar-size-lg'
    alias: core/avatar-size/300
    valor: 40
    use: "Avatar of 40. USE in a profile and to highlight a person, and on the +N counter of nph-avatar-stack, which has the avatar shape (until the measure review). DO NOT USE as an icon size."
  avatar/radius-sm:
    css: '--nph-avatar-radius-sm'
    alias: core/radius/300
    valor: 6
    use: "Corner of the 24 avatar. USE only on nph-avatar sm. The avatar is a square with rounded corners, never a circle. Also the corner of the nph-skeleton that imitates the avatar, and the +N counter of nph-avatar-stack, which has the avatar shape (until the measure review)."
  avatar/radius-md:
    css: '--nph-avatar-radius-md'
    alias: core/radius/400
    valor: 8
    use: "Corner of the 32 avatar. USE only on nph-avatar md. Also the corner of the nph-skeleton that imitates the avatar, and the +N counter of nph-avatar-stack, which has the avatar shape (until the measure review)."
  avatar/radius-lg:
    css: '--nph-avatar-radius-lg'
    alias: core/radius/450
    valor: 10
    use: "Corner of the 40 avatar. USE only on nph-avatar lg. Also the corner of the nph-skeleton that imitates the avatar, and the +N counter of nph-avatar-stack, which has the avatar shape (until the measure review)."
  avatar/overlap:
    css: '--nph-avatar-overlap'
    alias: core/avatar-overlap/100
    valor: -8
    use: "Overlap between neighboring avatars: -8. USE only in the space between items of nph-avatar-stack. DO NOT USE as space between other components."
  avatar/background:
    css: '--nph-avatar-background'
    alias: color/muted
    use: "Background of the nph-avatar without a photo (the icon). USE only on nph-avatar. DO NOT USE on another piece."
  avatar/border:
    css: '--nph-avatar-border'
    alias: color/border
    use: "Border of the nph-avatar, 1 px in border/width. USE only on nph-avatar. DO NOT USE on another piece."
  avatar/icon:
    css: '--nph-avatar-icon'
    alias: color/muted-foreground
    use: "Color of the icon inside the nph-avatar without photo (the avatar has no initials). USE only on nph-avatar. DO NOT USE on another piece."

tokens_avatar-stack:
  avatar-stack/overflow-background:
    css: '--nph-avatar-stack-overflow-background'
    alias: color/muted
    use: "Background of the +N counter of the nph-avatar-stack. USE only on the counter."
    nao_use: "Another piece: color/muted."
  avatar-stack/overflow-border:
    css: '--nph-avatar-stack-overflow-border'
    alias: color/border
    use: "Border of the +N counter of the nph-avatar-stack, 1 px in border/width. USE only on the counter."
  avatar-stack/overflow-foreground:
    css: '--nph-avatar-stack-overflow-foreground'
    alias: color/muted-foreground
    use: "Color of the number in the +N counter of the nph-avatar-stack. USE only on the counter."

tokens_table:
  table/background:
    css: '--nph-table-background'
    alias: color/background
    use: "Background of the nph-table and of its frame."
  table/foreground:
    css: '--nph-table-foreground'
    alias: color/foreground
    use: "Text of the cell and of the header."
  table/muted-foreground:
    css: '--nph-table-muted-foreground'
    alias: color/muted-foreground
    use: "Second line of the cell."
    nao_use: "The caption text: table/caption-foreground."
  table/caption-foreground:
    css: '--nph-table-caption-foreground'
    alias: color/muted-foreground
    use: "Text of the caption of the nph-table."
  table/muted-background:
    css: '--nph-table-muted-background'
    alias: color/muted
    use: "Neutral background behind the thumbnail and the photo of the expanded item."
  table/header-background:
    css: '--nph-table-header-background'
    alias: core/surface/25
    use: "Background of the header and of the footer. In dark it follows color/muted."
  table/row-striped-background:
    css: '--nph-table-row-striped-background'
    alias: core/surface/25
    use: "Background of the even row in the stripe state (faixa)."
    nao_use: "Row hover: table/row-hover-background."
  table/row-hover-background:
    css: '--nph-table-row-hover-background'
    alias: color/primary-surface
    use: "Background of the whole row under the pointer."
    nao_use: "Stripe: table/row-striped-background."
  table/border:
    css: '--nph-table-border'
    alias: color/border
    use: "Border of the frame, divider between rows and the vertical line of the grid."
    nao_use: "The line under the fixed header: table/sticky-divider-color."
  table/border-width:
    css: '--nph-table-border-width'
    alias: border/width
    valor: 1
    use: "Thickness of the frame, of the row divider and of the grid."
  table/radius:
    css: '--nph-table-radius'
    alias: radius/container
    use: "Corner of the frame of the nph-table (moldura com)."
    nao_use: "The thumbnail corner: table/thumbnail-radius."
  table/link-foreground:
    css: '--nph-table-link-foreground'
    alias: color/link
    use: "Link inside the cell, always underlined. In light and dark it follows color/link, as in Figma: theme/brand-text-dark in dark (DSA-70 T-1)."
  table/status-success-icon:
    css: '--nph-table-status-success-icon'
    alias: status/success
    use: "Icon of the positive status in the cell, always with the status name beside it."
    nao_use: "The error status: table/status-error-icon."
  table/rating-foreground:
    css: '--nph-table-rating-foreground'
    alias: brand/educacao
    use: "Star of the rating in the cell, with the score as a number beside it. Accepted exception to WCAG 1.4.11 in light, because the number carries the same information."
  table/row-height:
    css: '--nph-table-row-height'
    alias: core/space/800
    valor: 40
    use: "Height of the row at size default."
    nao_use: "Size large: table/row-height-large."
  table/row-height-large:
    css: '--nph-table-row-height-large'
    alias: control/height-large
    valor: 44
    use: "Height of the row at size large, for touch or more relaxed reading."
  table/cell-padding-block:
    css: '--nph-table-cell-padding-block'
    alias: space/inline
    valor: 8
    use: "Space above and below the composite cell."
    nao_use: "A cell with a button: table/action-cell-padding-block."
  table/cell-padding-inline:
    css: '--nph-table-cell-padding-inline'
    alias: space/control-padding
    valor: 12
    use: "Space on the sides of the cell at size default."
    nao_use: "Size large: table/container-padding."
  table/action-cell-padding-block:
    css: '--nph-table-action-cell-padding-block'
    alias: space/control-padding
    valor: 12
    use: "Space above and below a cell that holds a button."
  table/container-padding:
    css: '--nph-table-container-padding'
    alias: space/container-padding
    valor: 16
    use: "Space on the sides of the cell at size large."
  table/cell-gap:
    css: '--nph-table-cell-gap'
    alias: space/inline
    valor: 8
    use: "Space between the pieces of the cell, mixed actions included. Added to the tree indent."
    nao_use: "The space between the icons of the actions: table/cell-gap-tight."
  table/cell-gap-tight:
    css: '--nph-table-cell-gap-tight'
    alias: space/inline-tight
    valor: 4
    use: "Space between the icons of the actions in the cell."
  table/stack-gap:
    css: '--nph-table-stack-gap'
    alias: space/stack-tight
    valor: 4
    use: "Space between the caption and the table."
  table/empty-padding:
    css: '--nph-table-empty-padding'
    alias: space/section
    valor: 32
    use: "Space above and below the empty body, which holds the nph-empty with the header visible."
  table/caption-max-width:
    css: '--nph-table-caption-max-width'
    alias: layout/max-reading
    valor: 560
    use: "Width limit of the caption text."
  table/body-max-height:
    css: '--nph-table-body-max-height'
    alias: layout/max-list-height
    valor: 296
    use: "Height of the body before it scrolls. With the fixed header, the header stays in place."
  table/expand-indent:
    css: '--nph-table-expand-indent'
    alias: control/height-compact
    valor: 28
    use: "Indent of each level of the tree, plus table/cell-gap. A row without children keeps the space of the chevron, so the text aligns."
  table/icon-size:
    css: '--nph-table-icon-size'
    alias: icon/size-sm
    valor: 16
    use: "Icon inside the cell."
  table/thumbnail-size:
    css: '--nph-table-thumbnail-size'
    alias: image/size-sm
    valor: 32
    use: "Thumbnail in the cell."
    nao_use: "The photo of the expanded item: table/thumbnail-size-large."
  table/thumbnail-size-large:
    css: '--nph-table-thumbnail-size-large'
    alias: image/size-lg
    valor: 64
    use: "Photo of the expanded item."
  table/thumbnail-radius:
    css: '--nph-table-thumbnail-radius'
    alias: radius/inner
    valor: 4
    use: "Corner of the thumbnail and of the photo of the expanded item."
  table/focus-ring-width:
    css: '--nph-table-focus-ring-width'
    alias: core/focus-width/sm
    valor: 2
    use: "Thickness of the focus ring of the scroll area and of the truncated-text cell. USE only in the nph-table."
    nao_use: "The focus of every other piece: focus/ring-width."
  table/sticky-divider-color:
    css: '--nph-table-sticky-divider-color'
    alias: color/border
    use: "Color of the line under the fixed header."
  table/sticky-divider-width:
    css: '--nph-table-sticky-divider-width'
    alias: core/shadow-y/100
    valor: 1
    use: "Thickness of the line under the fixed header, drawn as a shadow."
  table/sticky-divider-spread:
    css: '--nph-table-sticky-divider-spread'
    alias: core/shadow-spread/0
    valor: 0
    use: "Spread of the line under the fixed header."
  table/sticky-divider-blur:
    css: '--nph-table-sticky-divider-blur'
    alias: core/shadow-blur/0
    valor: 0
    use: "Blur of the line under the fixed header: none, so it stays a line."
  table/caption-action-gap:
    css: '--nph-table-caption-action-gap'
    alias: space/inline
    valor: 8
    use: "Space between the caption and its main action."
  table/max-width:
    css: '--nph-table-max-width'
    alias: layout/max-app
    valor: 1440
    use: "Width of the wide table inside the horizontal scroll area."
  table/scrollbar-radius:
    css: '--nph-table-scrollbar-radius'
    alias: radius/full
    valor: 9999
    use: "Corner of the scrollbar thumb and track."
  table/scrollbar-thumb:
    css: '--nph-table-scrollbar-thumb'
    alias: scrollbar/thumb
    use: "Color of the scrollbar thumb."
  table/scrollbar-track:
    css: '--nph-table-scrollbar-track'
    alias: scrollbar/track
    use: "Background of the scrollbar track."
  table/scrollbar-width:
    css: '--nph-table-scrollbar-width'
    alias: space/inline-tight
    valor: 4
    use: "Width of the vertical scrollbar and height of the horizontal one."
  table/status-error-icon:
    css: '--nph-table-status-error-icon'
    alias: status/error
    use: "Icon of the error status in the cell, always with the status name beside it."
    nao_use: "The positive status: table/status-success-icon."

tokens_image:
  image/size-xs:
    css: '--nph-image-size-xs'
    alias: core/image-size/100
    valor: 24
    use: "Side of the nph-image at size xs, in the set but with no usage rule yet."
  image/size-sm:
    css: '--nph-image-size-sm'
    alias: core/image-size/200
    valor: 32
    use: "Side of the nph-image at size sm. Also the thumbnail of the nph-table (table/thumbnail-size)."
  image/size-md:
    css: '--nph-image-size-md'
    alias: core/image-size/300
    valor: 48
    use: "Side of the nph-image at size md."
  image/size-lg:
    css: '--nph-image-size-lg'
    alias: core/image-size/400
    valor: 64
    use: "Side of the nph-image at size lg. Also the photo of the expanded item of the nph-table (table/thumbnail-size-large)."
  image/size-xl:
    css: '--nph-image-size-xl'
    alias: core/image-size/500
    valor: 96
    use: "Side of the nph-image at size xl."
  image/size-2xl:
    css: '--nph-image-size-2xl'
    alias: core/image-size/600
    valor: 128
    use: "Side of the nph-image at size 2xl."
  image/radius-sm:
    css: '--nph-image-radius-sm'
    alias: radius/inner
    valor: 4
    use: "Corner of the nph-image at sizes xs and sm."
  image/radius-md:
    css: '--nph-image-radius-md'
    alias: core/radius/300
    valor: 6
    use: "Corner of the nph-image at sizes md and lg."
  image/radius-lg:
    css: '--nph-image-radius-lg'
    alias: core/radius/400
    valor: 8
    use: "Corner of the nph-image at sizes xl, 2xl and media."
  image/background:
    css: '--nph-image-background'
    alias: color/muted
    use: "Fill of the nph-image area, kept even without the image."
  image/foreground:
    css: '--nph-image-foreground'
    alias: color/muted-foreground
    use: "Spinner of the nph-image while it loads."
  image/border:
    css: '--nph-image-border'
    alias: color/border
    use: "Border of the nph-image. The loading state has no border."
  image/border-width:
    css: '--nph-image-border-width'
    alias: border/width
    valor: 1
    use: "Thickness of the border of the nph-image."
  image/focus-border:
    css: '--nph-image-focus-border'
    alias: focus/border
    use: "Focus ring of the nph-image, in focus/ring-width. The image only takes focus when it is clickable."
  image/overlay:
    css: '--nph-image-overlay'
    alias: overlay/on-media-strong
    use: "Veil over the nph-image in the hover state."
  image/on-overlay:
    css: '--nph-image-on-overlay'
    alias: overlay/on-media-foreground
    use: "Eye icon over the veil of the nph-image in the hover state."
  image/gap:
    css: '--nph-image-gap'
    alias: space/inline
    valor: 8
    use: "Space between the nph-image and the text beside it."
  image/media-width:
    css: '--nph-image-media-width'
    alias: core/layout-width/media
    valor: 256
    use: "Width of the nph-image at size media, which accepts the proportions 1:1, 4:3 and 16:9."
  image/icon-size-sm:
    css: '--nph-image-icon-size-sm'
    alias: icon/size-sm
    valor: 16
    use: "Eye icon of the hover veil on the small nph-image."
  image/icon-size-md:
    css: '--nph-image-icon-size-md'
    alias: icon/size-md
    valor: 20
    use: "Eye icon of the hover veil on the medium nph-image."
  image/icon-size-lg:
    css: '--nph-image-icon-size-lg'
    alias: icon/size-lg
    valor: 24
    use: "Eye icon of the hover veil on the large nph-image."
  image/illustration-light:
    css: '--nph-image-illustration-light'
    use: "Switch that shows the empty and error illustration of the light scheme: 1 in light, 0 in dark."
    nao_use: "Reading it as a size or a color."
  image/illustration-dark:
    css: '--nph-image-illustration-dark'
    use: "Switch that shows the empty and error illustration of the dark scheme: 0 in light, 1 in dark."
    nao_use: "Reading it as a size or a color."
  image/illustration-background:
    css: '--nph-image-illustration-background'
    alias: core/slate/100
    use: "Background of the gray line illustration of the nph-image, in empty and error."

tokens_switch:
  switch/track-width:
    css: '--nph-switch-track-width'
    alias: core/layout-width/switch-track
    valor: 40
    use: "Width of the nph-switch track: 40. USE only on the nph-switch track, with the height of icon/size-lg (24). DO NOT USE on another piece."
  switch/track-width-sm:
    css: '--nph-switch-track-width-sm'
    alias: core/layout-width/switch-track-sm
    valor: 32
    use: "Width of the small nph-switch track: 32. USE only on the track of the small size, with the height of switch/track-height-sm (16). DO NOT USE on another piece."
  switch/track-height-sm:
    css: '--nph-switch-track-height-sm'
    alias: icon/size-sm
    valor: 16
    use: "Height of the small nph-switch track: 16. USE only on the track of the small size, which fits the 20 px switch slot of the nph-dropdown-menu item. DO NOT USE on another piece."
  switch/thumb-size-sm:
    css: '--nph-switch-thumb-size-sm'
    alias: core/icon-size/50
    valor: 12
    use: "Knob of the small nph-switch: 12. USE only on the knob of the small size. DO NOT USE on another piece."
  switch/track-padding-sm:
    css: '--nph-switch-track-padding-sm'
    alias: core/space/50
    valor: 2
    use: "Gap between the track and the knob of the small nph-switch: 2. USE only on the track of the small size. DO NOT USE on another piece."
  switch/label-offset:
    css: '--nph-switch-label-offset'
    alias: core/space/50
    valor: 2
    use: "Drop of the nph-switch label from the top in the default size: 2. It centers the first 20 px line of the label on the 24 px track; a label of two lines keeps the track on the first line."
    nao_use: "Not in the small size, which already centers. Not as a gap between the track and the label (space/inline)."

tokens_skeleton:
  skeleton/line-height:
    css: '--nph-skeleton-line-height'
    alias: core/line-height/100
    valor: 16
    use: "Height of the nph-skeleton line bar: 16, centered in the skeleton/line-box-height box. USE only on the line shape of nph-skeleton. DO NOT USE on another piece."
  skeleton/line-box-height:
    css: '--nph-skeleton-line-box-height'
    alias: core/line-height/200
    valor: 20
    use: "Height of the box of the nph-skeleton line shape: 20, the line height of the text it stands for, with the 16 px bar (skeleton/line-height) centered in it."
    nao_use: "Not on the block or avatar shapes. Not as the height of the bar itself (skeleton/line-height)."
  skeleton/background:
    css: '--nph-skeleton-background'
    alias: color/skeleton
    use: "Background of the nph-skeleton shape: line, block and circle (DSA-94). USE only on nph-skeleton. DO NOT USE on another piece."

tokens_checkbox:
  checkbox/label-offset:
    css: '--nph-checkbox-label-offset'
    alias: core/space/50
    valor: 2
    use: "Drop of the nph-checkbox label from the top: 2. It centers the first 20 px line of the label on the 24 px target; a label of two lines keeps the box on the first line."
    nao_use: "Not as a gap between the box and the label (space/inline)."

tokens_radio:
  radio/label-offset:
    css: '--nph-radio-label-offset'
    alias: core/space/50
    valor: 2
    use: "Drop of the nph-radio label from the top: 2. It centers the first 20 px line of the label on the 24 px target; a label of two lines keeps the circle on the first line."
    nao_use: "Not as a gap between the circle and the label (space/inline)."

tokens_rich-option:
  rich-option/content-offset:
    css: '--nph-rich-option-content-offset'
    alias: core/space/50
    valor: 2
    use: "Drop of the content (the optional 20 px icon and the text block) of the nph-rich-option card from the top: 2. Icon and text drop together, in one wrapper, and the icon and the first 20 px line of the title center on the 24 px control. It was rich-option/text-offset until 2026-11-26 (DSA-91 D-4)."
    nao_use: "Not as the gap between the title and the second line (rich-option/text-gap)."

tokens_select:
  select/option-content-offset:
    css: '--nph-select-option-content-offset'
    alias: core/space/50
    valor: 2
    use: "Drop of the content of the rich option of the nph-select and nph-combobox list from the top: 2. The option aligns to the top; the start icon or dot, the label, the description and the check mark drop together, so the first 20 px line centers on the 24 px avatar or checkbox, which stay at the top. The check mark sits in a box of select/option-icon-size, centered on the first line (DSA-91 D-4)."
    nao_use: "Not on the avatar or the checkbox, which stay at the top; not as the gap between the label and the description (select/option-text-gap)."

tokens_sidebar:
  sidebar/flyout-item-radius:
    css: '--nph-sidebar-flyout-item-radius'
    alias: radius/inset
    valor: 8
    use: "Corner of the option of the nph-sidebar floating panel (2nd level when collapsed and 3rd level): 8, the same as the panel (sidebar/flyout-radius). Declared exception to the nested radius rule, by decision of the design owner."
    nao_use: "Not on the item and subitem of the fixed menu, which keep sidebar/item-radius (12)."
  sidebar/flyout-item-focus-border-radius:
    css: '--nph-sidebar-flyout-item-focus-border-radius'
    alias: focus/border-radius-container
    valor: 9
    use: "Corner of the 1 px focus border around the floating panel option: sidebar/flyout-item-radius + 1."
    nao_use: "Not on the focus of the fixed menu item (focus/border-radius-sidebar-item, 13). It aliases focus/border-radius-container because that semantic is the focus border around a base of 8, the same base as the option; focus/radius-inner-with-border (9) is the halo of a base of 4."
  sidebar/flyout-item-focus-halo-radius:
    css: '--nph-sidebar-flyout-item-focus-halo-radius'
    alias: focus/radius-container
    valor: 13
    use: "Corner of the focus halo around the focus border of the floating panel option: sidebar/flyout-item-radius + 5."
    nao_use: "Not on the focus of the fixed menu item (focus/radius-sidebar-item, 17). It aliases focus/radius-container because that semantic is the focus halo around a base of 8; focus/border-radius-sidebar-item (13) is the border of a base of 12."

tokens_scheme:
  scheme/is-light:
    css: '--nph-scheme-is-light'
    claro: 1
    escuro: 0
    use: "Color scheme flag, a BOOLEAN variable in Figma: 1 is true, 0 is false. True in light mode. USE to show the asset made for light mode, such as the light illustration of nph-empty. DO NOT USE for color: color comes from the color/* tokens, which already change with the scheme."
  scheme/is-dark:
    css: '--nph-scheme-is-dark'
    claro: 0
    escuro: 1
    use: "Color scheme flag, a BOOLEAN variable in Figma: 1 is true, 0 is false. True in dark mode. USE to show the asset made for dark mode, such as the dark illustration of nph-empty. DO NOT USE for color: color comes from the color/* tokens, which already change with the scheme."

# ---------------------------------------------------------------
# RADIUS - primitives in core (invisible) and intent tokens in the
# semantic collection. Component CSS consumes ONLY the semantic or
# component tokens; a component token aliases a primitive straight
# only by decision.
# ATTENTION: radius is in px, NOT in rem. There are TWO foundations like this -
# this one and shadow, which declares the same in elevacao_regras.
# Radius must not grow with the user font: the piece would change
# shape, not size.
# ---------------------------------------------------------------
raio_regras:
  padrao_do_sistema: radius/control
  unidade_css: px
  por_que_px: "Radius in rem would grow with the user font and a 6px button would become a capsule. Shape does not follow text size."
  aninhado: "Inner radius = outer radius - padding. If it gives zero or less, use radius/none. Inner NEVER equal to outer. Declared exception, by decision of the design owner: the option of the nph-sidebar floating panel (2nd level when collapsed and 3rd level) keeps 8, the same as the panel (sidebar/flyout-item-radius), with its focus at 9 and 13; the subtraction would give a square option (8 - 8 at the top and 8 - 10 on the sides, zero or less)."
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
  off-scale/5:  { valor: 5,  css: '--nph-core-radius-off-scale-5',  alias_de: 'radius/control-inner, focus/border-radius-inner' }
  off-scale/7:  { valor: 7,  css: '--nph-core-radius-off-scale-7',  alias_de: 'focus/border-radius-control' }
  off-scale/9:  { valor: 9,  css: '--nph-core-radius-off-scale-9',  alias_de: 'focus/radius-inner-with-border' }
  off-scale/11: { valor: 11, css: '--nph-core-radius-off-scale-11', alias_de: 'focus/radius-control-with-border' }
  off-scale/13: { valor: 13, css: '--nph-core-radius-off-scale-13', alias_de: 'focus/radius-container, focus/border-radius-sidebar-item' }
  off-scale/15: { valor: 15, css: '--nph-core-radius-off-scale-15', alias_de: 'focus/border-radius-surface' }
  off-scale/18: { valor: 18, css: '--nph-core-radius-off-scale-18', alias_de: 'focus/radius-surface' }
  off-scale/19: { valor: 19, css: '--nph-core-radius-off-scale-19', alias_de: 'focus/radius-surface-with-border' }
  direto_por_decisao: 'A component token aliases a core radius straight only by decision, when no semantic token has the same function; the origin in semantic.tokens.json says why. 450 on the day cell and on the month and year cell of the nph-calendar grid (calendar/day-radius): the design owner set the day at 10, radius/control (6) is the system default for what is operated, and the two semantics of 10 have other functions (radius/overlay, a large floating layer; focus/radius-control, the focus halo of a control). 600 on the focus halo of those cells, the cell radius plus focus/ring-width (calendar/day-focus-radius): radius/surface (14) is card, panel and sheet, not a halo, and no focus/radius-* exists for a base of 10. 400 on the nph-chart legend item (chart/legend-item-radius, DSA-101): radius/container is the corner of a container and radius/inset a fitted surface; the legend item is a 24 px target with no background. off-scale/9 and off-scale/13 on its focus border and halo (chart/legend-item-focus-border-radius, chart/legend-item-focus-halo-radius): focus/border-radius-container, focus/radius-inner-with-border, focus/border-radius-sidebar-item and focus/radius-container are the focus of other bases. 450 also on the day of the compact month of the nph-scheduler (scheduler/day-radius), the same radius as the day of the nph-calendar grid and for the same reason: radius/control (6) would leave two radii for the same piece. off-scale/11 and off-scale/15 on the focus border and halo of that day (scheduler/day-focus-border-radius, scheduler/day-focus-halo-radius): the ring follows the 10 px day (corner + 1 of the border; + 4 of the halo), and the semantic tokens of 11 and 15 are the focus of other bases (focus/radius-control-with-border, the halo of a control; focus/border-radius-surface, the border around a card).'

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
    use: "USE on a small marker that contains nothing: status bar, bar indicator, minimal tag, resize handle. DO NOT USE on a control. Also the corner of the nph-resizable grip box (resizable/grip-radius). Also the end of the nph-chart column, bar and top segment, a data mark that contains nothing (chart/bar-radius)."
  radius/inner:
    css: '--nph-radius-inner'
    alias: core/radius/200
    valor: 4
    use: "USE on an element nested inside a control or container (checkbox, thumbnail, the nph-navigation-menu item), on nph-tooltip, on the tab inside the segmented nph-tabs rail (tabs/item-radius) and on the inner corner of the junction of the parts of a control (split-button/inner-radius). Nested, the inner radius is always smaller than the outer. DO NOT USE on a surface or box fitted inside a card or a floating layer (the tonal section and the icon box of the nph-card, the icon box of the nph-popconfirm): there it is radius/inset. DO NOT USE on the item of nph-dropdown-menu or nph-context-menu: there it is dropdown/item-radius. Also the corner of the rich option and of its hover layer (select/option-radius), as the nph-select option (T6). Also the shape of the nph-skeleton that imitates a piece with this radius."
  radius/inset:
    css: '--nph-radius-inset'
    alias: core/radius/400
    valor: 8
    use: "Surface or box fitted inside a card or a floating layer: the tonal section and the start icon box of the nph-card (card/section-radius, card/icon-container-radius) and the icon box of the nph-popconfirm (popconfirm/icon-box-radius, DSA-99), 8 inside the 14 of its surface. A fixed value of the soft style, 8 inside the 14 of radius/surface, not the outer radius minus the padding (DSA-88). Also the corner of the start tile of the nph-accordion item (accordion/tile-radius), as the start icon box of the nph-card."
    nao_use: "A piece nested inside a control or container (checkbox, thumbnail, the nph-navigation-menu item): there it is radius/inner."
  radius/control:
    css: '--nph-radius-control'
    alias: core/radius/300
    valor: 6
    use: "SYSTEM DEFAULT. USE on button, field, select, textarea and anything that is operated. When in doubt, it is this one. Also the corner of the nph-tree item (tree/item-radius). Also the corner of the nph-scheduler event (scheduler/event-radius). Also the corner of the nph-collapsible trigger (collapsible/trigger-radius). Also the corner of the nph-menubar top item (menubar/trigger-radius). Also the corners of the nph-rich-text-editor box and the top corners of its toolbar (rich-text-editor/radius). Also the shape of the nph-skeleton that imitates that control."
  radius/control-inner:
    css: '--nph-radius-control-inner'
    alias: core/radius/off-scale/5
    valor: 5
    use: "Radius of a surface fitted inside a control with a border: radius/control minus border/width. USE on the arrow area of nph-select, nph-combobox and nph-tree-select, on the corners that touch the border, and on every piece that fills the end of a field. The arrow area has no background and no divider, so its radius only clips; the start corners stay radius/none."
  radius/container:
    css: '--nph-radius-container'
    alias: core/radius/400
    valor: 8
    use: "USE on a container with a medium corner inside the page: table, pagination, floating toolbar and notification (except the toast, which is radius/overlay). DO NOT USE on a layer anchored to a trigger (popover, menu, option list, panel): that is radius/overlay-anchored. DO NOT USE on a card or content panel: those are radius/surface; a box fitted inside a card is radius/inset. DO NOT USE on a control. Also the corner of the nph-file-upload drop zone and of the nph-file-upload-item (file-upload/radius, file-upload-item/radius)."
  radius/overlay:
    css: '--nph-radius-overlay'
    alias: core/radius/450
    valor: 10
    use: "USE on a large floating layer: dialog, modal, side panel, and the floating notice (toast) of nph-notification and the nph-command panel (command/radius). It is the BASE of the reference kit scale (--radius = 10). DO NOT USE on tooltip (radius/inner) nor on a layer anchored to a trigger (radius/overlay-anchored)."
  radius/overlay-anchored:
    css: '--nph-radius-overlay-anchored'
    alias: core/radius/400
    valor: 8
    use: "USE on a floating layer anchored to a trigger: popover, hover card, menu, flyout, panel and option list that open from a control, and the chart tooltip. One radius for the same function, below the dialog (10), as in shadcn (rounded-md), Atlassian and Radix. Each piece reads it through its own token, listed in its tokens_<piece> block or its task"
    nao_use: "The plain tooltip: radius/inner. Dialog, modal, side panel and toast: radius/overlay. A container inside the page: radius/container."
  radius/surface:
    css: '--nph-radius-surface'
    alias: core/radius/600
    valor: 14
    use: "USE on card, panel and sheet - the surface that carries content. Equivalent to the kit rounded-xl. DO NOT USE on a floating layer: dialog and modal are radius/overlay, the tooltip uses radius/inner, and a layer anchored to a trigger (popover, hover card, menu) uses radius/overlay-anchored. Also the corner of the nph-scheduler container (scheduler/radius). Also the corner of the nph-collapsible card appearance (collapsible/card-radius). Also the corner of the nph-card (card/radius). Also the corner of the nph-rich-option choice card and of its hover layer (rich-option/radius). Also the corner of the grouped nph-accordion and of each separated block (accordion/radius)."
  radius/full:
    css: '--nph-radius-full'
    alias: core/radius/full
    valor: 9999
    use: "Fully rounded shape. USE only on a small piece whose shape communicates a marker: badge, counter, switch knob, position marker (dot or pill) and circular target. Also the dot and pill of the nph-carousel indicators and their circular target (carousel/indicator-radius, carousel/indicator-target-radius). NEVER on a regular button, field or card. NEVER on an avatar: the avatar is a square with rounded corners (avatar/radius-*). Also the circle, the history dot and the center dot of the current item of the nph-timeline marker (timeline/marker-radius); the avatar marker keeps avatar/radius-sm. Also the round focus ring around the focused marker of the nph-chart line (chart/focus-point-radius)."

# ---------------------------------------------------------------
# ELEVATION - in Figma the level is an EFFECT STYLE; in code it is a
# DTCG token of type `shadow`, generated by the token build (PF-15). The shadow
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
    use: "Elevation hairline. USE when the piece only needs to separate from what is behind it without looking like it floats: fixed bar, table header, weighted divider. DO NOT USE on a card - a card is elevation/raised, or has no elevation when outlined."
  elevation/subtle:
    css: '--nph-elevation-subtle'
    camadas: ['0 1px 2px 0 shadow/color-light']
    equivale_a: 'shadow-xs of the reference kit'
    use: "Subtle elevation. USE on a control that rises slightly from the background: button, field, chip. It is the level the kit applies to the button. DO NOT USE on a floating layer."
  elevation/raised:
    css: '--nph-elevation-raised'
    camadas: ['0 1px 2px -1px shadow/color', '0 1px 3px 0 shadow/color']
    equivale_a: 'shadow-sm of the reference kit'
    use: "Card and panel that rise from the page background - permanent content. DO NOT USE on a floating layer. Also the grouped nph-accordion container; the separated blocks have no shadow. Also the nph-sidebar panel with the neutral background, expanded and collapsed: a permanent panel beside the page content; the brand background has no shadow."
  elevation/dropdown:
    css: '--nph-elevation-dropdown'
    camadas: ['0 2px 4px -2px shadow/color', '0 4px 6px -1px shadow/color']
    equivale_a: 'shadow-md of the reference kit'
    use: "Floating layer attached to a trigger, which opens and closes and does NOT block the page: popover, dropdown menu, tooltip, open select. Also the nph-popconfirm surface; in dark the shadow goes to zero."
  elevation/modal:
    css: '--nph-elevation-modal'
    camadas: ['0 4px 6px -4px shadow/color', '0 10px 15px -3px shadow/color']
    equivale_a: 'shadow-lg of the reference kit'
    use: "Layer that BLOCKS the page: dialog and side panel. Always accompanied by overlay/scrim. Without a scrim, it is not a modal."
  elevation/drawer:
    css: '--nph-elevation-drawer'
    camadas: ['0 8px 10px -6px shadow/color', '0 20px 25px -5px shadow/color']
    equivale_a: 'shadow-xl of the reference kit'
    use: "Large panel that enters from the edge of the screen: drawer, side sheet, command panel. Above modal in reach, not in blocking. DO NOT USE on a common dialog. Also the mobile nph-sidebar with the neutral background, which opens over the screen from the start edge."
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
    renomeado: 'focus-ring/error became focus-ring/invalid, in Figma and in code at the same time.'
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
# component CSS consumes them. They exist to BUILD the eight elevation
# styles. Component CSS uses the elevation/* style, never these; a
# component token aliases one straight only by decision.
# Documented from what the styles actually bind
# in Figma - it is not a proposal, it is a reading of the file.
# ---------------------------------------------------------------
tokens_core_sombra:
  regra: 'NEVER consume one of these in component CSS. They appear inside an elevation/* style, or in a component token that aliases one straight by decision. If you need a shadow, pick the style; if none fits, stop and ask - do not build a new shadow by hand.'
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
# SCRIM, FOCUS AND LAYOUT PRIMITIVES - a semantic token consumes them,
# or a component token aliases one straight by decision. Component CSS
# consumes the semantic or the component token, never these.
# ---------------------------------------------------------------
tokens_core_veu:
  regra: 'NEVER consume in component CSS. Use overlay/scrim, which switches between the modes by itself.'
  core/scrim/light: { valor: 'rgba(0,0,0,0.45)', css: '--nph-core-scrim-light', alias_de: 'overlay/scrim in light mode' }
  core/scrim/dark:  { valor: 'rgba(0,0,0,0.65)', css: '--nph-core-scrim-dark',  alias_de: 'overlay/scrim in dark mode' }

tokens_core_foco:
  regra: 'NEVER consume in component CSS. The focus ring comes from the focus-ring/* styles, which already bind the width and the color, or from the focus halo of rule 6. A component token aliases core/focus-width/* straight only by decision, when no semantic token has the same function.'
  core/focus-width/default: { valor: 4, css: '--nph-core-focus-width-default', alias_de: 'focus/ring-width' }
  core/focus-width/sm:      { valor: 2, css: '--nph-core-focus-width-sm', por_decisao: 'no semantic token; the 2 px focus border drawn inside an item (resizable/focus-border-width, notification/close-focus-border-width) and 2 px indicators' }

tokens_core_borda:
  regra: 'NEVER consume directly. Use border/width. A component token aliases core/border-width/thick or core/border-dash/* straight only by decision, when no semantic token has the same function.'
  core/border-width/default: { valor: 1, css: '--nph-core-border-width-default', alias_de: 'border/width' }
  core/border-width/thick:   { valor: 2, css: '--nph-core-border-width-thick', por_decisao: 'the 2 px series stroke of the nph-chart line, area and `sparkline` types (chart/line-width, DSA-101): it keeps the series width apart from the focus ring. A declared exception: the other 2 px strokes and indicators stay on core/focus-width/sm' }
  core/border-dash/length:   { valor: 8, css: '--nph-core-border-dash-length', por_decisao: 'the dash of the nph-chart goal line (chart/reference-dash, DSA-101); in code, the first number of stroke-dasharray. core/border-style/dashed stays out until the build handles strokeStyle' }
  core/border-dash/gap:      { valor: 4, css: '--nph-core-border-dash-gap', por_decisao: 'the gap between the dashes of the nph-chart goal line (chart/reference-dash-gap, DSA-101); in code, the second number of stroke-dasharray' }

tokens_core_opacidade:
  regra: 'NEVER consume in component CSS. A component token aliases a core opacity straight only by decision, when no semantic token has the same function: state/disabled-opacity (0.5) is the disabled control and state/hover-opacity (0.95) the old solid button hover.'
  core/opacity/16: { valor: 0.16, css: '--nph-core-opacity-16', por_decisao: 'notification/close-background-hover-opacity' }
  core/opacity/50: { valor: 0.5,  css: '--nph-core-opacity-50', por_decisao: 'the hover layer of the nph-rich-option choice card and of the rich option (rich-option/background-hover-opacity, select/option-background-hover-opacity): the layer takes it, never the whole piece' }

tokens_core_icon:
  regra: 'NEVER consume directly. Use icon/size-sm, -md and -lg, and switch/thumb-size-sm. Read from Figma when migrating the tokens to JSON. A component token aliases one straight only by decision, when no semantic token has the same function: core/icon-size/300 is also the marker size of the nph-stepper and of the nph-timeline (stepper/marker-size, timeline/marker-size), because icon/size-lg is a lone icon and no semantic token of 24 is a marker.'
  core/icon-size/50:  { valor: 12, css: '--nph-core-icon-size-50',  alias_de: 'switch/thumb-size-sm' }
  core/icon-size/100: { valor: 16, css: '--nph-core-icon-size-100', alias_de: 'icon/size-sm' }
  core/icon-size/200: { valor: 20, css: '--nph-core-icon-size-200', alias_de: 'icon/size-md' }
  core/icon-size/300: { valor: 24, css: '--nph-core-icon-size-300', alias_de: 'icon/size-lg' }

tokens_core_avatar:
  regra: 'NEVER consume directly. Use avatar/size-sm, -md and -lg, and avatar/overlap.'
  core/avatar-size/100:    { valor: 24, css: '--nph-core-avatar-size-100',    alias_de: 'avatar/size-sm' }
  core/avatar-size/200:    { valor: 32, css: '--nph-core-avatar-size-200',    alias_de: 'avatar/size-md' }
  core/avatar-size/300:    { valor: 40, css: '--nph-core-avatar-size-300',    alias_de: 'avatar/size-lg' }
  core/avatar-overlap/100: { valor: -8, css: '--nph-core-avatar-overlap-100', alias_de: 'avatar/overlap' }

tokens_core_control:
  regra: 'NEVER consume directly. Use control/height-compact, -default, -field and -large. Read from Figma when migrating the tokens to JSON. A component token aliases one straight only by decision, when no semantic token has the same function: core/control-height/compact is also the level indent and the chevron space of the nph-tree-table branch error row (tree-table/indent), because control/height-compact is the height of a control on a dense screen, not an indent.'
  core/control-height/compact: { valor: 28, css: '--nph-core-control-height-compact', alias_de: 'control/height-compact', por_decisao: 'tree-table/indent, the level indent of the nph-tree-table branch error row' }
  core/control-height/default: { valor: 36, css: '--nph-core-control-height-default', alias_de: 'control/height-default' }
  core/control-height/field:   { valor: 38, css: '--nph-core-control-height-field',   alias_de: 'control/height-field' }
  core/control-height/large:   { valor: 44, css: '--nph-core-control-height-large',   alias_de: 'control/height-large' }

tokens_core_layout:
  regra: 'NEVER consume in component CSS. Use the semantic layout/* tokens or the component token. A component token aliases core/layout-width/* or core/layout-height/* straight only by decision, when no semantic token has the same function.'
  core/layout-width/app:               { valor: 1440, css: '--nph-core-layout-width-app',               alias_de: 'layout/max-app' }
  core/layout-width/reading:           { valor: 560,  css: '--nph-core-layout-width-reading',           alias_de: 'layout/max-reading' }
  core/layout-width/sidebar-expanded:  { valor: 256,  css: '--nph-core-layout-width-sidebar-expanded',  alias_de: 'layout/sidebar-expanded' }
  core/layout-width/sidebar-collapsed: { valor: 80,   css: '--nph-core-layout-width-sidebar-collapsed', alias_de: 'layout/sidebar-collapsed' }
  core/layout-height/header:           { valor: 56,   css: '--nph-core-layout-height-header',           alias_de: 'layout/header-height' }
  core/layout-height/sidebar-logo:     { valor: 24,   css: '--nph-core-layout-height-sidebar-logo',     alias_de: 'sidebar/logo-max-height' }
  core/layout-height/sidebar-logo-mark: { valor: 32,  css: '--nph-core-layout-height-sidebar-logo-mark', alias_de: 'sidebar/logo-mark-size' }
  core/layout-width/tooltip:           { valor: 235, css: '--nph-core-layout-width-tooltip', alias_de: 'layout/max-tooltip-width' }
  core/layout-height/tooltip:          { valor: 44, css: '--nph-core-layout-height-tooltip', alias_de: 'layout/max-tooltip-height' }
  core/layout-width/field:             { valor: 320, css: '--nph-core-layout-width-field', alias_de: 'layout/field-width' }
  core/layout-width/input:             { valor: 280, css: '--nph-core-layout-width-input', alias_de: 'layout/input-width' }
  core/layout-width/multi-combobox:    { valor: 420, css: '--nph-core-layout-width-multi-combobox', alias_de: 'layout/multi-combobox-width' }
  core/layout-width/rich-option:       { valor: 320, css: '--nph-core-layout-width-rich-option', alias_de: 'layout/rich-option-width' }
  core/layout-width/separator:         { valor: 240, css: '--nph-core-layout-width-separator', alias_de: 'layout/separator-width' }
  core/layout-height/separator:        { valor: 48, css: '--nph-core-layout-height-separator', alias_de: 'layout/separator-height' }
  core/layout-height/list:             { valor: 296, css: '--nph-core-layout-height-list', alias_de: 'layout/max-list-height' }
  core/layout-height/textarea-min:     { valor: 76, css: '--nph-core-layout-height-textarea-min', alias_de: 'layout/textarea-min-height, layout/multiline-min-height' }
  core/layout-height/textarea-max:     { valor: 216, css: '--nph-core-layout-height-textarea-max', alias_de: 'layout/textarea-max-height, layout/multiline-max-height' }
  core/layout-width/dialog-min:        { valor: 320, css: '--nph-core-layout-width-dialog-min', alias_de: 'layout/dialog-min-width' }
  core/layout-width/dialog-sm:         { valor: 400, css: '--nph-core-layout-width-dialog-sm', alias_de: 'layout/dialog-sm' }
  core/layout-width/dialog-lg:         { valor: 720, css: '--nph-core-layout-width-dialog-lg', alias_de: 'layout/dialog-lg' }
  core/layout-width/dialog-content-sm: { valor: 352, css: '--nph-core-layout-width-dialog-content-sm', alias_de: 'layout/dialog-content-sm' }
  core/layout-width/dialog-content-md: { valor: 512, css: '--nph-core-layout-width-dialog-content-md', alias_de: 'layout/dialog-content-md' }
  core/layout-width/dialog-content-lg: { valor: 672, css: '--nph-core-layout-width-dialog-content-lg', alias_de: 'layout/dialog-content-lg' }
  core/layout-height/dialog-max:       { valor: 640, css: '--nph-core-layout-height-dialog-max', alias_de: 'layout/dialog-max-height' }
  core/layout-width/switch-track:      { valor: 40, css: '--nph-core-layout-width-switch-track', alias_de: 'switch/track-width' }
  core/layout-width/switch-track-sm:   { valor: 32, css: '--nph-core-layout-width-switch-track-sm', alias_de: 'switch/track-width-sm' }
  core/layout-width/stepper-text:      { valor: 160, css: '--nph-core-layout-width-stepper-text', alias_de: 'stepper/text-max-width' }
  core/layout-width/list-time-compact: { valor: 72, css: '--nph-core-layout-width-list-time-compact', alias_de: 'scheduler/list-time-width-compact' }
  core/layout-width/popconfirm-sm:     { valor: 304, css: '--nph-core-layout-width-popconfirm-sm', alias_de: 'popconfirm/width-sm' }
  core/layout-width/popconfirm-md:     { valor: 372, css: '--nph-core-layout-width-popconfirm-md', alias_de: 'popconfirm/width-md' }
  core/layout-height/chart:            { valor: 320, css: '--nph-core-layout-height-chart', alias_de: 'chart/plot-height', por_decisao: 'the reference height of the nph-chart plot area (DSA-101): layout/field-width, layout/rich-option-width and layout/dialog-min-width are 320, all widths' }
  core/layout-width/tree-column:       { valor: 240, css: '--nph-core-layout-width-tree-column', alias_de: 'tree-table/tree-column-min-width', por_decisao: 'the floor of the nph-tree-table tree column width; the page gives the width, as for any column (DSA-102 D-2): layout/separator-width and popover/width-sm are 240 with another function, the width of the separator and of the popover' }

# ---------------------------------------------------------------
# PRIMITIVES WITHOUT A CONSUMER - they exist in Figma and NO semantic
# variable, style or component uses them. They are here so the
# inventory is complete and verifiable, NOT because they have a defined
# use. Verified by reverse index.
# ---------------------------------------------------------------
tokens_core_sem_consumidor:
  estado: 'PENDING DECISION - they either get a defined role or leave the file. UX decision, not yet taken.'
  regra: 'DO NOT consume any of these and DO NOT invent a use for them. If you need a value that only exists here, stop and ask.'
  nao_gerar_em_json: 'While they are on this list, they must NOT go into the tokens JSON: generating CSS for a primitive without a role spreads debt.'

  radius:
    nota: 'Four steps above core/radius/600, which is the last step of the scale with a consumer (radius/surface).'
    '700':  { valor: 16 }
    '800':  { valor: 22 }
    '900':  { valor: 24 }
    '1000': { valor: 26 }

  space_degraus_altos:
    nota: 'Two steps above core/space/1100. 1200 and 1500 left this block in DSA-84: they now have consumers and are in tokens_core_space.'
    '1300': { valor: 112 }
    '1400': { valor: 128 }

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
    use: "Scrim behind dialog and side panel, and behind the mobile nph-sidebar through sidebar/scrim. USE whenever there is a modal. Stronger in dark because the background is already dark. The only alpha value outside the scale of 8."
  overlay/on-media:
    css: '--nph-overlay-on-media'
    alias: core/alpha/black-40
    claro: 'rgba(0,0,0,0.40)'
    escuro: 'rgba(0,0,0,0.40)'
    use: "Dark scrim over an image, so the text on top stays legible. USE on a cover, a card with a background photo and a gallery. Equal in both modes: legibility over the image does not depend on the theme."
  overlay/on-media-strong:
    css: '--nph-overlay-on-media-strong'
    alias: core/alpha/black-60
    claro: 'rgba(0,0,0,0.60)'
    escuro: 'rgba(0,0,0,0.60)'
    use: "Stronger dark veil over an image, for a layer that carries an icon or text over the media: the hover veil of the nph-image (image/overlay). Equal in both modes. For a plain scrim that only keeps text legible, use overlay/on-media."
  overlay/on-media-foreground:
    css: '--nph-overlay-on-media-foreground'
    alias: core/base/white
    claro: '#ffffff'
    escuro: '#ffffff'
    use: "Color of the icon or text drawn over overlay/on-media-strong: the eye icon of the nph-image on hover (image/on-overlay). Equal in both modes, because the veil does not change with the theme."
  focus/ring-width:
    css: '--nph-focus-ring-width'
    alias: core/focus-width/default
    valor: 4
    use: "The thickness of EVERY focus ring: 4px, equal in both modes. NEVER pick it by hand: apply one of the focus-ring/* styles or the focus halo of rule 6. DO NOT reduce it to 1 or 2 on a small piece - the ring is what makes the product keyboard-navigable. WCAG 2.2 asks for at least 2px. Also the thickness of the focus halo of the nph-panel-menu subgroup (panel-menu/focus-ring-width). Also the thickness of the focus halo of the nph-scheduler (scheduler/focus-halo-width). Also the thickness of the focus halo of the nph-collapsible trigger (collapsible/focus-halo-width). Also the thickness of the focus halo of the nph-tree item (tree/focus-halo-width). Also the thickness of the focus halo around the nph-rich-option choice card (rich-option/focus-ring-width). Also the thickness of the focus halo of the rich option active by the keyboard (select/option-focus-halo-width). Also the focus halo of the nph-chart legend item and of the focused data (chart/focus-halo-width). Also the thickness of the focus halo of the nph-tree-table row and branch error row (tree-table/focus-halo-width). Also the thickness of the focus halo of the nph-rich-text-editor box (rich-text-editor/focus-halo-width)."
  border/width:
    css: '--nph-border-width'
    alias: core/border-width/default
    valor: 1
    use: "Thickness of border and of control, box and line outline. Also the focus border of the nph-panel-menu subgroup and the group line of its nested levels (panel-menu/focus-border-width, panel-menu/guide-width). Also the thickness of the nph-scheduler container border, event border and focus border (scheduler/border-width, scheduler/event-border-width, scheduler/focus-border-width). Also the card outline and the focus border of the nph-collapsible (collapsible/card-border-width, collapsible/focus-border-width). Also the focus border of the nph-tree item (tree/focus-border-width). Also the line of the nph-resizable handle (resizable/handle-width). Also the outline and the divider of the nph-card (card/border-width). Also the outline of the pending, error and warning nph-timeline markers (timeline/marker-border-width); the nph-timeline connector line takes its thickness from the nph-separator. Also the outline of the nph-rich-option choice card, in every state (rich-option/border-width). Also the focus border of the rich option active by the keyboard (select/option-focus-border-width). Also the outline of the nph-tree-select panel (tree-select/panel-border-width). Also the outline of the grouped nph-accordion and of each separated block (accordion/border-width); the divider between its items takes its thickness from the nph-separator. Also the 1 px lines of the nph-chart: grid, axis, goal and crosshair, the outline of the hollow marker of a hidden series, the focus border and the tooltip outline (chart/grid-width, chart/axis-width, chart/reference-width, chart/crosshair-width, chart/legend-marker-hidden-width, chart/focus-border-width, chart/tooltip-border-width). Also the focus border and the base divider of the nph-tree-table branch error row (tree-table/focus-border-width, tree-table/border-width). Also the outline of the nph-popconfirm surface and arrow (popconfirm/border-width). Also the border of the nph-rich-text-editor box, the divider between its toolbar and its text area and the bar at the start of its quote (rich-text-editor/border-width, rich-text-editor/divider-width, rich-text-editor/quote-border-width)."
  focus/border-radius-control:
    css: '--nph-focus-border-radius-control'
    alias: core/radius/off-scale/7
    valor: 7
    use: "Radius of the 1 px focus border around a control with radius/control. Also the corner of the focus border of the nph-scheduler (scheduler/focus-border-radius). Also the corner of the focus border of the nph-collapsible trigger (collapsible/focus-border-radius). Also the corner of the focus border of the nph-tree item (tree/focus-border-radius). Also the corner of the focus border of the nph-tree-table row and branch error row (tree-table/focus-border-radius); the row itself has no corner."
  focus/radius-control:
    css: '--nph-focus-radius-control'
    alias: core/radius/450
    valor: 10
    use: "Radius of the focus halo around a control with radius/control: radius/control + focus/ring-width. Also the focus halo of the nph-rich-text-editor box (rich-text-editor/focus-halo-radius)."
  focus/radius-control-with-border:
    css: '--nph-focus-radius-control-with-border'
    alias: core/radius/off-scale/11
    valor: 11
    use: "Radius of the focus halo around the focus border of a control: focus/border-radius-control + focus/ring-width. Also the corner of the focus halo of the nph-scheduler (scheduler/focus-halo-radius). Also the corner of the focus halo of the nph-collapsible trigger (collapsible/focus-halo-radius). Also the corner of the focus halo of the nph-tree item (tree/focus-halo-radius). Also the corner of the focus halo of the nph-tree-table row and branch error row (tree-table/focus-halo-radius)."
  focus/radius-inner:
    css: '--nph-focus-radius-inner'
    alias: core/radius/400
    valor: 8
    use: "Radius of the focus halo around a piece with radius/inner: radius/inner + focus/ring-width."
  focus/border-radius-inner:
    css: '--nph-focus-border-radius-inner'
    alias: core/radius/off-scale/5
    valor: 5
    use: "Radius of the 1 px focus border around a piece with radius/inner. Also the focus border of the rich option active by the keyboard (select/option-focus-border-radius). Also the focus border around the focused nph-chart mark, with the 2 px gap (chart/focus-border-radius). Also the focus border at the inner corners of the junction of the nph-split-button parts (split-button/focus-border-inner-radius)."
  focus/radius-inner-with-border:
    css: '--nph-focus-radius-inner-with-border'
    alias: core/radius/off-scale/9
    valor: 9
    use: "Radius of the focus halo around the focus border of a piece with radius/inner: focus/border-radius-inner + focus/ring-width. Also the halo of the rich option active by the keyboard (select/option-focus-halo-radius). Also the halo around that focus border of the nph-chart mark (chart/focus-halo-radius). Also the focus halo at the inner corners of the junction of the nph-split-button parts (split-button/focus-halo-inner-radius)."
  focus/radius-surface:
    css: '--nph-focus-radius-surface'
    alias: core/radius/off-scale/18
    valor: 18
    use: "Radius of the focus halo around a piece with radius/surface: radius/surface + focus/ring-width. Without the 1 px focus border; with it (the clickable nph-card), the halo is focus/radius-surface-with-border. Also the focus halo around the nph-rich-option choice card (rich-option/focus-radius): the card turns its own outline to focus/border, with no extra border, so the halo keeps this radius."
  focus/border-radius-surface:
    css: '--nph-focus-border-radius-surface'
    alias: core/radius/off-scale/15
    valor: 15
    use: "Radius of the 1 px focus border around a piece with radius/surface: the clickable nph-card in focus."
  focus/radius-surface-with-border:
    css: '--nph-focus-radius-surface-with-border'
    alias: core/radius/off-scale/19
    valor: 19
    use: "Radius of the focus halo around the focus border of a piece with radius/surface: focus/border-radius-surface + focus/ring-width. The clickable nph-card in focus."
  state/disabled-opacity:
    css: '--nph-state-disabled-opacity'
    valor: 0.5
    use: "Opacity of the disabled control, applied to the WHOLE control. WCAG exempts a disabled element from the minimum contrast, but disabled is NEVER the only sign: the control also stops responding and, when there is a reason, it is stated in text. Also the whole disabled nph-tree item (tree/item-disabled-opacity). Also the whole disabled nph-panel-menu subgroup (panel-menu/subgroup-disabled-opacity). Also the opacity of the whole disabled nph-collapsible (collapsible/disabled-opacity). Also the whole disabled clickable nph-card (card/disabled-opacity). Also the whole disabled nph-rich-option choice card and the whole disabled rich option (rich-option/disabled-opacity, select/option-disabled-opacity). Also the whole disabled nph-rich-text-editor, with its toolbar and its footer actions (rich-text-editor/disabled-opacity)."
  state/hover-opacity:
    css: '--nph-state-hover-opacity'
    valor: 0.95
    use: "It was the solid hover of the nph-button (B4, `Registro`). The button now uses color/primary-hover, color/destructive-hover, color/secondary-hover and status/*-hover. DO NOT USE on button hover."
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
    valor: 560
    use: "Maximum width of running text - what is READ end to end. With text/body-lg it delivers about 74 characters per line, inside the 50 to 75 range. DO NOT USE on a table or data panel."
  layout/sidebar-expanded:
    css: '--nph-layout-sidebar-expanded'
    alias: core/layout-width/sidebar-expanded
    valor: 256
    use: "Width of the open sidebar. Applies to the application shell and to the documentation page in Figma."
  layout/sidebar-collapsed:
    css: '--nph-layout-sidebar-collapsed'
    alias: core/layout-width/sidebar-collapsed
    valor: 80
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
  layout/max-list-height:
    css: '--nph-layout-max-list-height'
    alias: core/layout-height/list
    valor: 296
    use: "Maximum height of the option list of nph-select, nph-combobox and nph-command (command/list-max-height) and of the nph-tree-select panel (tree-select/panel-max-height): it shows up to 8 options or tree rows; above it, the list or the tree scrolls inside the panel. DO NOT USE outside an option list or the nph-tree-select panel."
  layout/textarea-min-height:
    css: '--nph-layout-textarea-min-height'
    alias: core/layout-height/textarea-min
    valor: 76
    use: "Minimum height of nph-textarea: room for the text lines plus the padding of the field. Empty, the field shows that a long text fits. DO NOT USE outside nph-textarea."
  layout/textarea-max-height:
    css: '--nph-layout-textarea-max-height'
    alias: core/layout-height/textarea-max
    valor: 216
    use: "Maximum height of nph-textarea. Above it, the text scrolls inside the field. DO NOT USE outside nph-textarea."
  layout/multiline-min-height:
    css: '--nph-layout-multiline-min-height'
    alias: core/layout-height/textarea-min
    valor: 76
    use: "Minimum height of a multi-line text area: three lines of text/body-md plus the padding of the field. USE on the text area of the nph-rich-text-editor (rich-text-editor/content-min-height) and of the nph-textarea (DSA-107). Same value as layout/textarea-min-height, which no piece reads any more."
  layout/multiline-max-height:
    css: '--nph-layout-multiline-max-height'
    alias: core/layout-height/textarea-max
    valor: 216
    use: "Maximum height of a multi-line text area: ten lines; above it, the text scrolls inside. USE on the text area of the nph-rich-text-editor (rich-text-editor/content-max-height) and of the nph-textarea (DSA-107). Same value as layout/textarea-max-height, which no piece reads any more."
  layout/dialog-min-width:
    css: '--nph-layout-dialog-min-width'
    alias: core/layout-width/dialog-min
    valor: 320
    use: "Minimum width of the nph-dialog. The dialog hugs its content between this value and the ceiling of its size (layout/dialog-sm, -md, -lg)."
  layout/dialog-sm:
    css: '--nph-layout-dialog-sm'
    alias: core/layout-width/dialog-sm
    valor: 400
    use: "Width ceiling of the small nph-dialog. The dialog hugs its content up to here. USE for a choice or a short confirmation. DO NOT USE with a form."
  layout/dialog-md:
    css: '--nph-layout-dialog-md'
    alias: core/layout-width/reading
    valor: 560
    use: "Width ceiling of the default nph-dialog. The dialog hugs its content up to here. USE for a short form and most dialogs. Also the width ceiling of the nph-command (command/max-width), never a fixed width."
  layout/dialog-lg:
    css: '--nph-layout-dialog-lg'
    alias: core/layout-width/dialog-lg
    valor: 720
    use: "Width ceiling of the large nph-dialog. The dialog hugs its content up to here. USE with a table, a long list or a two-column form."
  layout/dialog-content-sm:
    css: '--nph-layout-dialog-content-sm'
    alias: core/layout-width/dialog-content-sm
    valor: 352
    use: "Width of the default content area of the small nph-dialog: the size ceiling minus the padding on both sides. Swapped content sets its own width, up to this value."
  layout/dialog-content-md:
    css: '--nph-layout-dialog-content-md'
    alias: core/layout-width/dialog-content-md
    valor: 512
    use: "Width of the default content area of the default nph-dialog: the size ceiling minus the padding on both sides. Swapped content sets its own width, up to this value."
  layout/dialog-content-lg:
    css: '--nph-layout-dialog-content-lg'
    alias: core/layout-width/dialog-content-lg
    valor: 672
    use: "Width of the default content area of the large nph-dialog: the size ceiling minus the padding on both sides. Swapped content sets its own width, up to this value."
  layout/dialog-max-height:
    css: '--nph-layout-dialog-max-height'
    alias: core/layout-height/dialog-max
    valor: 640
    use: "Maximum height of the nph-dialog. Above it, only the content scrolls; header and footer stay fixed. DO NOT USE outside the nph-dialog."
  layout/field-width:
    css: '--nph-layout-field-width'
    alias: core/layout-width/field
    valor: 320
    use: "Default width of the nph-field. The field stretches in its container, and the control fills the field (DSA-28 D6)."
    nao_use: "The control itself (nph-input, nph-select, nph-combobox): layout/input-width."
  layout/input-width:
    css: '--nph-layout-input-width'
    alias: core/layout-width/input
    valor: 280
    use: "Width of a form field (280). Also the width of the panel the field opens: the nph-tree-select panel in single selection, the same as its field (tree-select/panel-width). Also the default width of the nph-rich-text-editor (rich-text-editor/width), which stretches inside the nph-field."
  layout/multi-combobox-width:
    css: '--nph-layout-multi-combobox-width'
    alias: core/layout-width/multi-combobox
    valor: 420
    use: "Width of the nph-multi-combobox field and of the panel a multiple-choice field opens: the nph-tree-select field and panel in multiple selection (tree-select/panel-width-multiple). DO NOT USE on nph-select or nph-combobox: they use layout/input-width."
  layout/rich-option-width:
    css: '--nph-layout-rich-option-width'
    alias: core/layout-width/rich-option
    valor: 320
    use: "Width of the nph-rich-option choice card (320). USE only on the card; the rich option takes the list width."
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
  excecao: "Disclosure content that grows in place: the content of the nph-collapsible, the panel of the nph-accordion item and the block of a group and of a subgroup of the nph-panel-menu animate their grid rows in motion/expand-*; with reduced motion they open at once, with no transition. The rest of the expand role keeps the rule (DSA-78 D-3, widened by DSA-98)."
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
  loop:  { valor: 800, css: '--nph-core-duration-loop', use: "Continuous loop of the spinner: 800 ms per turn, infinite repetition. OUTSIDE the transition scale, which ends at 400 and describes movement that starts and ends; a loop repeats (PF-05)." }
  loop-long: { valor: 1400, css: '--nph-core-duration-loop-long', use: "Long continuous loop: one pass of the indeterminate nph-progress bar, 1400 ms, infinite repetition. OUTSIDE the transition scale, like loop. Consumed by motion/loop-long-duration." }
  delay: { valor: 300, css: '--nph-core-duration-delay', use: "Wait before reacting to the pointer: 300 ms. OUTSIDE the transition scale, because it is not movement; it is still time before it (DSA-48)." }
  long-press: { valor: 700, css: '--nph-core-duration-long-press', use: "Long-press wait: 700 ms. OUTSIDE the transition scale, because it is not movement; it is still time. Consumed by motion/long-press-delay." }
  delay-medium: { valor: 500, css: '--nph-core-duration-delay-medium', use: "Medium wait before reacting to the pointer: 500 ms. OUTSIDE the transition scale, because it is not movement; it is still time. Consumed by motion/hover-close-delay." }

tokens_core_easing:
  standard: { valor: 'cubic-bezier(0.4, 0, 0.2, 1)', css: '--nph-core-easing-standard', use: "Accelerates and decelerates. What changes in place." }
  enter:    { valor: 'cubic-bezier(0, 0, 0.2, 1)',   css: '--nph-core-easing-enter',    use: "Only decelerates. What APPEARS: arrives fast and brakes as it settles." }
  exit:     { valor: 'cubic-bezier(0.4, 0, 1, 1)',   css: '--nph-core-easing-exit',     use: "Only accelerates. What DISAPPEARS: starts slowly and leaves fast." }
  linear:   { valor: 'linear', css: '--nph-core-easing-linear', fonte_json: 'cubicBezier [0, 0, 1, 1] - the exact equivalent, because cubicBezier is the DTCG type the system uses for curves (PF-16)', css_gerado: 'cubic-bezier(0, 0, 1, 1)', use: "Constant speed. ONLY progress and spinner. DO NOT USE in an interface transition." }

tokens_motion:
  regra_do_par: "Each motion role is TWO tokens: -duration and -easing. They go together and NEVER mix between roles - do not use the enter duration with the exit curve. Shape aligned with Figma: each token is a variable and a custom property. The loop role came in with the spinner (PF-05). The exceptions are the waits - motion/hover-delay (DSA-48), motion/hover-close-delay and motion/long-press-delay - and motion/long-press-tolerance, a distance: none of them is a movement, so each is a single token with no curve."

  motion/hover-delay:
    css: '--nph-motion-hover-delay'
    alias: core/duration/delay
    valor: 300
    use: "How long the pointer rests on an element before a help layer, such as the tooltip, opens. Keyboard focus does not wait. A single token: it has no curve, because nothing moves during the wait."
    nao_use: "The preview of nph-hover-card, which waits longer before it opens (hover-card/open-delay, core/duration/delay-long, 600 ms). Closing a panel: motion/hover-close-delay."

  motion/hover-close-delay:
    css: '--nph-motion-hover-close-delay'
    alias: core/duration/delay-medium
    valor: 500
    use: "How long a panel opened by hover stays open after the pointer leaves it, before it closes, so the pointer can reach the panel on a diagonal. Keyboard focus does not wait. Consumed by navigation-menu/close-delay."
    nao_use: "nph-hover-card, which closes faster (hover-card/close-delay, core/duration/delay, 300 ms)."

  motion/long-press-delay:
    css: '--nph-motion-long-press-delay'
    alias: core/duration/long-press
    valor: 700
    use: "How long the finger rests before a long press opens a menu, such as nph-context-menu on touch. A right click does not wait. Consumed by context-menu/long-press-delay."

  motion/long-press-tolerance:
    css: '--nph-motion-long-press-tolerance'
    alias: core/space/off-scale/10
    valor: 10
    use: "How far the finger may move during a long press without cancelling it: 10 px. Beyond it, the gesture is a scroll and the menu does not open. Consumed by context-menu/long-press-tolerance."

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
    use: "State change that STAYS: selection, checkbox, toggle, tab change. Also the status change and the hover of the nph-stepper step (stepper/state-duration)."
  motion/state-easing:
    css: '--nph-motion-state-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "The curve of the state role. USE always together with motion/state-duration."

  motion/enter-duration:
    css: '--nph-motion-enter-duration'
    alias: core/duration/300
    valor: 250
    use: "Layer that APPEARS from outside: popover, menu, tooltip, dialog, side panel. Also the toast entering the nph-toast-region (toast-region/enter-duration). Also the nph-chart data tooltip, by opacity only (chart/tooltip-enter-duration). Also the entrance of the nph-popconfirm (popconfirm/enter-duration)."
  motion/enter-easing:
    css: '--nph-motion-enter-easing'
    alias: core/easing/enter
    valor: 'cubic-bezier(0, 0, 0.2, 1)'
    use: "The curve of the enter role - decelerates as it arrives. USE always together with motion/enter-duration."

  motion/exit-duration:
    css: '--nph-motion-exit-duration'
    alias: core/duration/200
    valor: 150
    use: "The same layer leaving. Faster than the entrance on purpose: whoever closed it has already decided. Also the toast leaving the nph-toast-region (toast-region/exit-duration). Also the nph-chart data tooltip leaving, by opacity only (chart/tooltip-exit-duration). Also the exit of the nph-popconfirm (popconfirm/exit-duration)."
  motion/exit-easing:
    css: '--nph-motion-exit-easing'
    alias: core/easing/exit
    valor: 'cubic-bezier(0.4, 0, 1, 1)'
    use: "The curve of the exit role - accelerates as it leaves. USE always together with motion/exit-duration."

  motion/expand-duration:
    css: '--nph-motion-expand-duration'
    alias: core/duration/300
    valor: 250
    use: "Piece that grows or shrinks IN PLACE: accordion, expandable panel, table row that opens. Also the turn of the arrow and the growth of the block of the nph-panel-menu subgroup and group (panel-menu/expand-duration). Also the growth of the nph-collapsible content and the turn of its indicator (collapsible/expand-duration)."
  motion/expand-easing:
    css: '--nph-motion-expand-easing'
    alias: core/easing/standard
    valor: 'cubic-bezier(0.4, 0, 0.2, 1)'
    use: "The curve of the expand role. USE always together with motion/expand-duration. Also the curve of the nph-panel-menu expansion (panel-menu/expand-easing). Also the curve of the nph-collapsible growth and turn (collapsible/expand-easing)."

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

  motion/loop-long-duration:
    css: '--nph-motion-loop-long-duration'
    alias: core/duration/loop-long
    valor: 1400
    use: "Long continuous loop: the indeterminate nph-progress bar, one pass every 1400 ms, with infinite repetition. USE always together with motion/loop-long-easing."
    nao_use: "The spinner, which turns in motion/loop-duration (800 ms)."
  motion/loop-long-easing:
    css: '--nph-motion-loop-long-easing'
    alias: core/easing/linear
    valor: 'cubic-bezier(0, 0, 1, 1)'
    use: "The curve of the long loop role - constant speed. USE always together with motion/loop-long-duration."

# ---------------------------------------------------------------
# ICONS - Font Awesome Pro library. The question that comes BEFORE the
# token: can this icon stand alone? An icon is a recognition
# shortcut; it does not replace a label. The icon INHERITS the text
# color - there is no icon color token.
# ---------------------------------------------------------------
icone_regras:
  acervo: Font Awesome Pro
  familia_padrao: 'Classic Light'
  familia_ativo: 'Classic Solid'
  familia_padrao_regra: 'Classic is the default family. Every content, action, state, feedback and direction icon is Classic - Light in the normal state, Solid on the active item inside a group. At 16 px, Light draws a 1.0 px stroke, the same weight as the text, so the Solid of the active item stands out; Regular draws 1.5 px.'
  duotone_navegacao: 'Duotone is ALLOWED, and ONLY in structural navigation: menu, sidebar, navigation group, shortcut and location indicator. It serves to mark the navigation territory, together with sidebar/*, width and position.'
  duotone_proibido_fora_da_navegacao: 'OUTSIDE structural navigation, Duotone remains forbidden. DO NOT USE on a button, field, feedback, validation, alert, table or destructive action.'
  duotone_nao_mistura: 'NEVER mix Duotone and Classic inside the same navigation group. The whole group is of a single family.'
  estilos_proibidos: [thin, sharp]
  historico_duotone: 'SUPERSEDED. The previous rule said: `Classic. NAO existe Duotone no Nephos: o bars, unico icone de navegacao do nucleo, nao existe em Duotone no acervo, e uma regra cujo unico caso nao pode ser cumprido nao e regra.` (Classic. There is NO Duotone in Nephos: bars, the only navigation icon of the core, does not exist in Duotone in the library, and a rule whose only case cannot be met is not a rule.) Preserved as a record; it is NOT the current rule. See duotone_navegacao.'
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
    use: "DEFAULT. Inside a control, table cell, field, and next to 14px text. When in doubt, it is this one. Also the chevron, the spinner that replaces it and the folder, file and error icons of the nph-tree (tree/toggle-icon-size, tree/icon-size). Also the arrow of the nph-panel-menu subgroup (panel-menu/subgroup-icon-size). Also the repeat icon of the nph-scheduler event and the icon of its empty state (scheduler/event-icon-size, scheduler/empty-icon-size). Also the indicator and the start icon of the nph-collapsible trigger (collapsible/indicator-size, collapsible/icon-size). Also the grip box and the grip icon of the nph-resizable (resizable/grip-size). Also the start icon of the compact nph-card and the arrow of the clickable nph-card (card/icon-size-dense, card/indicator-size). Also the icon box inside the nph-timeline circle marker (timeline/marker-icon-size). Also the check of the selected rich option (select/option-marker-size). Also the icon of the start tile of the nph-accordion item in the compact and default sizes (accordion/tile-icon-size). Also the change icon of the nph-chart highlight and the icon of its error state (chart/delta-icon-size, chart/error-icon-size). Also the error icon of the nph-tree-table branch error row (tree-table/error-icon-size). Also the type icon of the nph-popconfirm in the sm size (popconfirm/icon-size-sm), inside its 32 px box."
  icon/size-md:
    css: '--nph-icon-size-md'
    alias: core/icon-size/200
    valor: 20
    use: "Menu item, tab and highlighted action, where 16 is small next to the label. DO NOT USE inside a button with text. On the icon-only nph-button, the icon follows the box: md in default. Also the icon place of the nph-panel-menu loading row (panel-menu/skeleton-icon-size). Also the optional icon of the nph-rich-option choice card and the start box of the rich option, which also holds the start dot (rich-option/icon-size, select/option-icon-size). Also the icon inside the nph-avatar without photo (the inner nph-icon takes icon/size-* by the same size), at the md avatar."
  icon/size-lg:
    css: '--nph-icon-size-lg'
    alias: core/icon-size/300
    valor: 24
    use: "Section header, empty state, an icon that carries meaning alone and the large icon-only nph-button. DO NOT USE on a dense screen or in a list, except on the start tile of the nph-accordion item in the large size (accordion/tile-icon-size-large). Also the icon of the nph-file-upload drop zone (file-upload/icon-size); the zone is a section area, not a list. Also the start icon of the nph-card in the default density (card/icon-size), also when cards form a collection list: the card is a surface, not a list row; a dense list uses the compact card. Also the type icon of the nph-popconfirm in the md size (popconfirm/icon-size-md), inside its 40 px box: a floating layer with one icon that carries the type, not a list. Also the icon inside the nph-avatar without photo (the inner nph-icon takes icon/size-* by the same size), at the lg avatar."

icones_nucleo:
  navegacao_e_menus:
    familia: 'Classic Light'
    icones: [bars, house, sidebar]
  direcao_e_revelacao:
    familia: 'Classic Light'
    icones: [angle-left, arrow-down-to-line, arrow-left, arrow-left-to-line, arrow-pointer, arrow-right, arrow-up, caret-up, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, circle-chevron-down, circle-chevron-left, circle-down, circle-up, ellipsis, eye, eye-slash, square-chevron-left, triple-chevrons-left]
    nota: 'ellipsis (horizontal) means OMITTED ITEMS - pagination, breadcrumb. Do not confuse with ellipsis-vertical, which means MORE ACTIONS ON THIS ROW and lives in action.'
  acao:
    familia: 'Classic Light'
    icones: [align-center, align-left, align-right, arrow-down-arrow-up, arrow-up-arrow-down, arrow-up-from-bracket, block-quote, bold, check, circle-half-stroke, cloud-arrow-up, download, ellipsis-vertical, filter, filter-slash, gear, grid-2, grip-vertical, italic, link, list, list-ol, list-ul, magnifying-glass, minus, paper-plane, paperclip, pen, pen-to-square, plus, print, repeat, right-from-bracket, right-to-bracket, rotate-left, rotate-right, share, share-from-square, strikethrough, text-slash, thumbs-down, thumbs-up, thumbtack, thumbtack-slash, trash, trash-can, underline, user-circle-minus, user-circle-plus, user-minus, xmark]
  estado_e_comunicacao:
    familia: 'Classic Light'
    icones: [alarm-clock, badge-check, bell, circle-check, circle-info, circle-notch, circle-question, circle-xmark, heart, lock, question, star, triangle-exclamation]
    variantes: {todos: 'Light is the default; Solid is available for every name in the library.'}
    nota: 'The first five are one for each system state. Every state carries an icon besides the color. circle-notch is the spinner: a ring with a cut, made for continuous rotation with core/easing/linear.'
  conteudo_e_dados:
    familia: 'Classic Light'
    icones: [calendar, calendar-days, circle-user, clipboard, clock, comment, envelope, file, file-image, file-lines, files, folder, folder-open, font-awesome, globe, inbox, key, location-dot, suitcase, tag, trophy, user]

icones_segunda_leva:
  pendente: false
  icones: [pen-to-square, trash-can, eye, eye-slash, arrow-up-from-bracket, download, star, gear, filter, filter-slash, circle-notch]

icones_terceira_leva:
  pendente: false
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
  variant: "light (default) or solid."
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
  serie_por_vertical: 'When the series IS the vertical, use brand/*, with a mandatory direct label: the color confirms a name already written. The seven brand colors at the 500 tone identify a business area, not a series: NEVER use brand/* as a generic categorical palette. In light, chart/1 to chart/4 use, by design choice, the same 500 tone as `Sistemas`, `Educação`, `Financeiro` and `Igrejas`: a generic series carries no meaning, and the label, the marker shape or the position with the legend names it.'
  texto_do_grafico: 'Axis label and legend use chart/label-foreground, which points to color/muted-foreground. Title uses chart/foreground, which points to color/foreground. A chart text reads these two tokens, not the semantics directly.'
  verificacao: 'Each pair compared under typical vision, protanopia, deuteranopia and tritanopia. Worst pair: 7,3 in light (chart/1 and chart/5, under tritanopia), below the adopted limit of 15, and 14,2 in dark. In light the 500 tones are a design choice: in that pair the marker shape, the label or the position with the legend separates the series, never the color alone. Minimum contrast against the background: 4,62:1 in dark (WCAG 1.4.11 requires 3:1); in light chart/2 sits at 1,92:1, below that minimum, and the series is also identified by the marker shape, the label or the position with the legend.'
  nao_coberto: 'Grayscale reading. The series separates by hue, not by lightness.'

tokens_chart:
  chart/1:
    css: '--nph-chart-1'
    claro: core/sistemas/500
    escuro: core/sistemas/200
    use: "First series of a categorical chart. Always the first: the order is fixed."
    nao_use: "To mean a state. Outside a chart."
  chart/2:
    css: '--nph-chart-2'
    claro: core/educacao/500
    escuro: core/educacao/300
    use: "Second series of a categorical chart."
    nao_use: "As the first series, nor to mean a state."
  chart/3:
    css: '--nph-chart-3'
    claro: core/financeiro/500
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
    claro: core/surface/100
    escuro: core/slate/600
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
    claro: core/surface/150
    escuro: core/slate/700
    use: "Grid line. Lighter than color/border on purpose: the grid guides reading, it does not delimit an area."
    nao_use: "On the axis. The axis is chart/axis and must meet 3:1."
  chart/axis:
    css: '--nph-chart-axis'
    claro: core/slate/400
    escuro: core/slate/400
    use: "Axis line and scale ticks. Meets 3:1 against the background in both modes, because the axis is graphical content required to understand the data."
    nao_use: "On a grid line: making the two equal erases the chart hierarchy."
  chart/reference:
    css: '--nph-chart-reference'
    claro: core/slate/700
    escuro: core/slate/200
    use: "Goal, target, mean or limit line. ALWAYS dashed and ALWAYS labeled. This is how state comes into the chart."
    nao_use: "For a data series: a reference is a comparison, not a measure."
  chart/empty:
    css: '--nph-chart-empty'
    claro: core/surface/100
    escuro: core/slate/700
    use: "Fill of an area without data and empty state of the chart."
    nao_use: "For the zero value: zero is data and goes in the series color."
  chart/muted:
    css: '--nph-chart-muted'
    claro: core/slate/500
    escuro: core/slate/300
    use: "Dimmed series when another is highlighted, and the Others grouping from the seventh category on."
    nao_use: "For a disabled control: disabled is state/disabled-opacity on the whole control."
  chart/track:
    css: '--nph-chart-track'
    claro: core/slate/200
    escuro: core/slate/600
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
6. Visible focus is mandatory on every focusable element and is **NEVER** removed. It is the `focus/ring` ring, through a `focus-ring/*` style, or, where the accepted Figma draws border and halo — as on the `nph-button` and on the `info` trigger of the `nph-label` —, the focus border of `border/width`, flush, with the halo of `focus/ring-width` outside (see `focus-ring/default`). There, the focus border meets **3:1** against the halo, its outside neighbor; the inside of the control does not count (see `focus/border`).
7. Every surface that carries text meets **4,5:1**; every control boundary meets **3:1** (WCAG 2.1 AA).
8. **NEVER** create a new token, component, icon or pattern to work around a gap. See §8.

---

## 2. Color — selection criteria

When two tokens seem to fit, this is what decides.

| Question | Rule |
|---|---|
| `muted` × `accent` | `muted` is permanent; `accent` is temporary. If the state disappears when the mouse leaves, it is `accent`. No exception: the hover of the ghost secondary `nph-button` is `color/accent` too, through `button/secondary-ghost-background-hover` (DSA-60). |
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
| `container-padding` × `surface-padding` | `surface-padding` (24) is the inner padding of a card in the default density (nph-card); `container-padding` (16) is panel, popover, dialog and the compact card. |
| `control-padding` × `container-padding` | A control is what is **operated** (button, field, select). A container is what **contains** (compact card, panel, popover). The `nph-badge` uses `control-padding` on the sides. |
| `container-padding` × page margin | Inside a panel or popover it is `container-padding`; the nph-card is `surface-padding` (24) in the default density and `container-padding` in the compact one. The page margin **is not a space token**: it is `layout/margin-compact`, `-default` or `-wide`, which change by breakpoint. |

**Padding is not gap.** Padding is the breathing room inside a box; gap is the distance between boxes. The value may coincide; the intent does not.

**Only one step at a time.** If 16 is tight, the next is 20, then 24. Skipping a step is a symptom of a grouping problem — a card, a divider or a title is missing.

**Touch target.** On a touch-sensitive screen the control uses `control/height-large`. WCAG 2.2 (2.5.8) requires 24×24px and recommends 44×44px; `control/height-compact` fails.

---

## 2d. Radius — selection criteria

The curve says what the piece is. The question is not how much to round.

| The piece… | Token |
|---|---|
| is **operated** | `radius/control` (6) — system default; the day of the nph-calendar grid has its own radius (`calendar/day-radius`, 10), and so does the day of the nph-scheduler compact month (`scheduler/day-radius`, 10) |
| **contains** with a medium corner inside the page (table, pagination, floating toolbar, notification) | `radius/container` (8) |
| **floats anchored** to a trigger (popover, hover card, menus, nph-sidebar flyout, nph-date-picker and nph-navigation-menu panels, option lists, nph-chart tooltip) | `radius/overlay-anchored` (8); the plain tooltip is `radius/inner` (4) |
| **floats large** | `radius/overlay` (10) |
| **carries content** without floating | `radius/surface` (14) |
| is a **marker** | `radius/subtle` (2) for a bar indicator, or `radius/full` for a dot, a pill or a circular target |
| is **touching an edge** | `radius/none` (0) |
| is **fitted inside** a card or a floating layer (tonal section, icon box of the nph-card and of the nph-popconfirm) | `radius/inset` (8) |
| is **nested** inside a control or container (checkbox, thumbnail, the nph-navigation-menu item) | `radius/inner` (4) |

| Question | Rule |
|---|---|
| `control` × `container` | A button inside a card: the button is `control`, the card is `container`. |
| `container` × `overlay-anchored` × `overlay` | A table or pagination is `container`; a layer anchored to a trigger (popover, hover card, menus, panels, option lists) is `overlay-anchored`; tooltip is `inner`. Dialog, modal and side panel are `overlay`. |
| `inset` × `inner` | `inset` is a surface or box fitted inside a card or a floating layer (the nph-card tonal section and icon box, the nph-popconfirm icon box). `inner` is a piece nested inside a control or container (checkbox, thumbnail, the nph-navigation-menu item). |
| `subtle` × `inner` | `subtle` is a marker that contains nothing. `inner` is a nested element with content. |
| `full` × `control` | `full` only on a small piece whose shape communicates a marker, or on a circular target. Button and field are never a pill. |

**Nested radius:** inner = outer − padding. Container at 8 with padding 4 → inner 4. With padding 8 → inner 0 (`radius/none`). Inner never equal to outer. Exception: `radius/inset` (8) inside the card (14) and inside the nph-popconfirm surface (14) is a fixed value of the soft style, not the subtraction (DSA-88, DSA-99). Exception: the option of the nph-sidebar floating panel keeps 8, the same as the panel (sidebar/flyout-item-radius), by decision of the design owner.

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

**Border and shadow together, only with the soft border.** In light, a card with `elevation/raised` takes, at rest, only the soft outline `color/border-subtle` (the raised nph-card, `card/border`, and the grouped nph-accordion, `accordion/border`), never `color/border`: the outline is decorative and the shadow separates. The clickable nph-card in hover raises the outline to `color/border` (`card/border-hover`) and keeps the shadow. The outlined card has the outline and no shadow.

---

## 2f. Grid and layout — selection criteria

**12 columns at every breakpoint.** If the composition does not fit, change how many columns the block occupies — not how many columns exist.

| Question | Rule |
|---|---|
| `layout/gutter` × `space/stack` | The gutter aligns **columns**. `space/stack` separates **items** inside a column. Different things, even with the same value. |
| `layout/max-app` × `layout/max-reading` | Will it be **read** end to end? `max-reading` (560). Will it be **operated**? `max-app` (1440). |
| Page margin | Only `layout/margin-compact`, `-default` and `-wide`, which change by breakpoint. There is no space token for this: `space/page-margin` was removed for duplicating the value without responding to the breakpoint. |

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

**Animate opacity and transform.** Width, height and layout position stutter in large lists and tables. **The exception is disclosure content that grows in place** (`expand` role): the content of the nph-collapsible, the panel of the nph-accordion item and the block of a group and of a subgroup of the nph-panel-menu animate their grid rows in `motion/expand-*` (DSA-78 D-3, widened by DSA-98). With reduced motion they do not move: they open at once, with no transition, instead of dropping to 100. The rest of the `expand` role keeps the rule.

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
| Light × Solid | Inside a Classic group: Light is the normal state, Solid marks the **current** item. |

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

1. **Elevation lightens.** The `slate` scale is the ramp: sidebar `950` → background `900` → card `800` → popover `700` → dialog `600`. Shadow is not perceived on a dark background — **NEVER** use shadow to simulate elevation in dark.
2. **No pure black or white.** The background is `slate/900`, not `#000000`. Text is `slate/100`, not white. Absolute black with white text causes halation.
3. **The border lightens much more than symmetry suggests.** `color/border` in light is `slate/200`; in dark it is **not** `slate/700` (it would give 1,58:1 and fail) — it is `slate/400`.

**Known limitation:** `color/border` on `color/popover` gives 2,59:1 in dark. On a floating layer, use `color/input` as the border, or let elevation do the separating. Exception: the nph-popover, the nph-hover-card, the nph-popconfirm (`popconfirm/border`, `popconfirm/divider`), the nph-date-picker panel (`date-picker/panel-border`, `date-picker/divider`) and, through `color/dropdown-border`, the nph-dropdown-menu, the nph-context-menu, the nph-navigation-menu panel and the loading nph-notification use `color/border-subtle`, and so do the option list of nph-select, nph-combobox and nph-multi-combobox and the nph-tree-select panel (`tree-select/panel-border`); there the border is decorative and the `elevation/dropdown` shadow separates the layer from the background. The nph-card and the nph-accordion also use `color/border-subtle` (`card/border`, `card/divider`, `accordion/border`, `accordion/divider`), decorative: in dark the card background, one step above the page, or the space between blocks separates it.

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
| A1 | Consume `tokens_core` directly in component CSS — a component token aliases a primitive straight only by decision, when no semantic token has the same function |
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
| A25 | Consume `core/space/*` in component CSS — components use the 7 semantic ones or their own component token |
| A26 | Use 6, 10, 14 or 18px because "it looked better" |
| A27 | Push an element with a margin to fix alignment |
| A28 | Use the 2px half-step outside chip, icon or table cell (declared exceptions: accordion/title-gap, DSA-97; collapsible/title-gap; split-button/gap, DSA-109) |
| A29 | A component defining its own control height |
| A30 | Use `control/height-compact` on a touch-sensitive screen |
| A31 | Solve with distance what needed a card, divider or title |
| A32 | Write a literal `border-radius` — only `var(--nph-radius-*)` |
| A33 | Consume `core/radius/*` in component CSS |
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
| A48 | Strong border (`color/border`) and shadow together on the card at rest in light mode |
| A49 | Change the column count between breakpoints |
| A50 | Use a gutter value outside `layout/gutter` |
| A51 | Let a panel or table stretch beyond `layout/max-app` |
| A52 | Documentation paragraph without `layout/max-reading` |
| A53 | A layout defining its own sidebar width or header height |
| A54 | Use `layout/gutter` to separate items of a list |
| A55 | Create a breakpoint outside the four |
| A56 | Apply the grid style and then position everything outside it |
| A57 | Write a literal duration or curve — only `var(--nph-motion-*)` |
| A58 | Combine duration and curve outside the motion roles |
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
| A70 | Use Thin |
| A70b | Use Sharp, or any family outside Classic and Duotone |
| A70c | Use Duotone outside structural navigation — on a button, field, feedback, validation, alert, table or destructive action |
| A70d | Mix Duotone and Classic inside the same navigation group |
| A71 | Paint the icon with a color other than that of the context |
| A72 | Mix Solid and Light in the same group without one marking the active state |
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

> **[Confirmed]** Approved anti-references.

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
| `Lista de componentes — Nephos v1` (component list), in the vault | Scope: the public components and the waves |

> **Current decision.** The directory organization is in
> [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) (P03). The P03
> directory pattern is already applied in each component of `src/components/`.
> The corresponding specs are in `fichas/`.

---

## 10. Open items of this document

| # | What | Who decides |
|---|---|---|
| 1 | ~~Identity~~ Resolved: personality **institutional, human and efficient**; primary user: development professionals who build and maintain IATec corporate interfaces, with Moses as the main technical consumer;  references with a defined function | UX |
| 2 | ~~Anti-references (§6) — proposal~~ Resolved | UX |
| 3 | ~~Typography foundation~~ Resolved: 14 roles, base 14px, Noto Sans + IBM Plex Mono | UX |
| 3b | ~~**Responsive typography**~~ Resolved: **the scale is fixed in the interface** | UX |
| 3c | ~~**Italic and underline**~~ Resolved: **they are a rule, not a role** | UX |
| 3d | ~~Spacing foundation~~ Resolved: base 4 with a half-step of 2, 7 semantic intent tokens and 3 control heights | UX |
| 3e | ~~**Responsive spacing and maximum widths**~~ Resolved: **`space/*` is fixed**, the page margin is `layout/margin-*`, and the maximum widths are `layout/max-app` and `max-reading` | UX |
| 3f | ~~Radius foundation~~ Resolved: 8 steps, 6px default on controls, full shape restricted to markers | UX |
| 3g | ~~**Radius on a partial corner**~~ Resolved: **it is a rule, not a token** — see `regras_raio_parcial` | UX |
| 3h | ~~Shadow and elevation foundation~~ Resolved: 8 levels, two layers where applicable, transparent shadow in dark, plus the modal scrim | UX |
| 3i | ~~**The modal has no step in the dark ramp**~~ Resolved: **`color/dialog` at `surface/600`** | UX |
| 3j | ~~**Inner shadow**~~ Resolved: **it does not come in** — a sunken field uses `color/muted` on the background and a border (`color/field-border` and `color/field-border-bottom` at rest) | UX |
| 3k | ~~Grid and layout foundation~~ Resolved: 12 columns, 4 breakpoints, two maximum widths and the shell measures | UX |
| 3l | **Shell behavior** — at which breakpoint the bar collapses — is layout anatomy and depends on a real screen or an approved mock | UX |
| 3m | ~~Motion foundation~~ Resolved: durations, curves, roles and the reduced motion rule. **The seven foundations are closed** | UX |
| 3n | ~~**Loop duration**~~ **Resolved: 800 ms per turn of the spinner**, with the `linear` curve and infinite repetition. It entered the code as `core/duration/loop` and the `motion/loop-*` role. The indeterminate bar of `nph-progress` got its own value on 2026-11-05: 1400 ms, `linear`, as `core/duration/loop-long` and the `motion/loop-long-*` role (DSA-65) | UX |
| 3o | ~~**Icons**~~ Resolved: rules, sizes, contract, library and the complete core, in three batches | UX |
| 4 | ~~Chart colors — they do not exist~~ Resolved: four families of semantic tokens, verified under the three vision deficiencies | UX |
| 5 | ~~Alpha — transparencies without a token~~ Resolved: 19 alpha primitives in black and white, plus `overlay/scrim`, `overlay/on-media` and `state/disabled-opacity` | UX |
| 6 | ~~Which file is canonical: the CSS or this YAML~~ Decided: Figma is the visual source; this `design.md` is the human and agentic contract; JSON will be the versioned technical source of audited values; CSS custom properties will be generated from the JSON. See `docs/decisoes-tecnicas.md` (P17). | UX, with engineering review |
| 7 | ~~Directory path (§9)~~ Decided: pattern recorded in `docs/decisoes-tecnicas.md` (P03), applied from the first component on. | UX, with engineering review |
| 8 | ~~Dark mode was calculated, not seen~~ Resolved: `Cor` page in Figma, light and dark side by side | UX |
| 9 | **Hatching pattern** for a chart printed in black and white. The categorical series separates by hue, not by lightness | UX |
