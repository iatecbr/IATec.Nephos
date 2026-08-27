/**
 * Storybook copy in English.
 *
 * Translated from `pt-BR.js`, which is the source. If the two disagree, the
 * Portuguese file wins and this one is wrong.
 *
 * Technical identifiers are never translated and never live in the dictionary.
 */
export default {
  barraLateral: {
    'comece-aqui': 'Start here',
    'comece-aqui-boas-vindas': 'Welcome',
    'comece-aqui-boas-vindas--boas-vindas': 'Welcome',
    'fundações': 'Foundations',
    'fundações-visão-geral': 'Overview',
    'fundações-visão-geral--visao-geral': 'Overview',
    componentes: 'Components',
    'componentes-nph-icon-docs': 'Docs',
    'componentes-nph-icon-docs--documentacao': 'Documentation',
    'componentes-nph-icon-docs--icons-overview': 'Icons Overview',
    'componentes-nph-icon-validação': 'Validation',
    'componentes-nph-icon-validação--variantes': 'Variants',
    'componentes-nph-icon-validação--tamanhos': 'Sizes',
    'componentes-nph-icon-validação--heranca-de-cor': 'Colour inheritance',
    'componentes-nph-icon-validação--acessibilidade': 'Accessibility',
    'componentes-nph-icon-validação--entrada-invalida': 'Invalid input',
  },

  boasVindas: {
    selo: 'IATEC · DESIGN SYSTEM',
    resumo:
      'A catalogue of components and foundations for building consistent, accessible and verifiable experiences.',
    comoNavegar: 'How to navigate',
    passos: [
      {
        titulo: '1. Start with the foundations',
        texto:
          'Check colour, typography, spacing, radius and icons before deciding how a piece should look.',
        destino: 'Foundations › Overview',
      },
      {
        titulo: '2. Look up the component',
        texto:
          'Each component gathers its states, variants, accessibility and runnable examples.',
        destino: 'Components › nph-icon',
      },
      {
        titulo: '3. Report a gap',
        texto:
          'If a case is not documented, do not improvise API, token, variant or behaviour.',
        destino: 'Canonical spec sheet and record',
      },
    ],
    estadoTitulo: 'Current state',
    estadoTexto:
      'Tokens are generated from the audited source. nph-icon is implemented and awaits a visual comparison between Figma and Storybook before final acceptance.',
  },

  fundacoes: {
    selo: 'FOUNDATIONS',
    titulo: 'The rules that keep the system coherent',
    resumo:
      'Foundations define the values and constraints that components consume. Storybook shows the result in code; Figma remains the visual source.',
    itens: [
      ['Colour', 'The core, theme and semantic layers, in light and dark modes.'],
      ['Typography', 'Text styles approved in Figma and documented in the contract.'],
      ['Spacing and radius', 'Semantic tokens for composition and controls.'],
      ['Icons', 'A curated core of 34 Font Awesome Pro icons.'],
    ],
    avisoTitulo: 'How to use this area',
    avisoTexto1: 'Check the contract in',
    avisoTexto2:
      'before creating or changing a component. If the documentation does not cover the case, report the gap instead of creating a new token, variant or rule.',
  },

  categorias: [
    'Navigation and menus',
    'Direction and disclosure',
    'Action',
    'State and communication',
    'Content and data',
  ],

  galeria: {
    titulo: 'Icons Overview',
    resumo1: 'The',
    resumo2:
      'approved icons of the Nephos core, grouped by the categories in design.md. The component contract is under',
    resumo3: 'Documentation',
    rotuloBusca: 'Search icons by name',
    exemploBusca: 'e.g. chevron',
    limpar: 'Clear',
    contador: (achados, total) => `${achados} of ${total} icons`,
    vazio:
      'No core icon matches this search. If the icon you need is not here, it is a gap: ask before adding it.',
  },

  docs: {
    resumo:
      'Provides an icon from the Nephos core with consistent size, family and accessibility, without introducing colour or artwork outside the approved set.',
    derivadaTitulo: 'This page is derived.',
    derivadaTexto1:
      'In case of divergence, the canonical sources prevail: design.md for the technical contract and docs/decisoes-tecnicas.md for decisions P01, P02, P03, P17, P19, P20 and P21. The nph-icon spec sheet and the DS-IA-NEPHOS 5.0 Figma file complete the component contract. No rule is created here.',
    derivadaTexto2:
      'Documentation status: P01, P02, P03, P17, P19 and P20 were adopted by Indiane on 24/08/2026; P21 was adopted on 26/08/2026, under a formal acceptance of risk. All of them await review by Elvys. The Figma approval on 26-08-2026 is visual and does not replace that review.',

    quandoUsarTitulo: 'When to use it',
    quandoUsar: [
      'A control or piece of content needs an icon that exists in the Nephos core.',
      'The icon reinforces a label, state or direction without replacing the textual information.',
    ],

    quandoNaoUsarTitulo: 'When not to use it',
    quandoNaoUsar: [
      'The action is domain-specific or has consequences: use a text label alongside the icon.',
      'The requested icon does not exist in the core: report the gap and wait for a decision.',
    ],

    apiTitulo: 'Approved public API',
    api: [
      ['name', (total) => `Required, in kebab-case and limited to the ${total} icons of the Nephos core.`],
      ['variant', () => 'regular by default, or solid only when name=star.'],
      ['size', () => 'sm, md or lg; free values are not accepted.'],
      [
        'label',
        () =>
          'Absent or empty makes the icon decorative and applies aria-hidden. A non-empty value provides its accessible name.',
      ],
      ['Slots and events', () => 'Exposes neither slots nor events.'],
      [
        'Interaction',
        () => 'Takes no focus, click or touch; the surrounding control defines the interaction.',
      ],
      [
        'Colour and customisation',
        () => 'Exposes no colour property and no initial ::part; inherits currentColor from the context.',
      ],
    ],

    nucleoTitulo: (total) => `A core of ${total} icons`,
    nucleoTexto:
      'The set is Font Awesome Pro and Classic is the default family. The full catalogue, with search, is under Icons Overview, in this same folder.',
    nucleoContagem: (n) => `${n} icons`,
    nucleoRegra:
      'solid exists only for star: Regular means not favourited, Solid means favourited. The other combinations with solid do not exist on purpose — never invent artwork to fill the matrix. Light, Thin and Sharp are forbidden. Duotone is allowed only in structural navigation, without mixing families within one group, and has no artwork available yet.',

    tamanhoTitulo: 'Size',
    tamanhoTexto:
      'Size is not a visual variant: it comes from a semantic token, and free values do not exist. The box is always square; the artwork is centred and scaled by height.',
    tamanhoTabela: [
      [
        'icon/size-sm',
        'Inside a control, a table cell, a field, and next to 14px text. When in doubt, this is the one.',
      ],
      [
        'icon/size-md',
        'Menu item, tab and highlighted action, where sm looks small next to the label. Do not use inside an ordinary button.',
      ],
      [
        'icon/size-lg',
        'Section heading, empty state, and an icon that carries meaning on its own. Do not use in dense screens or in lists.',
      ],
    ],
    tamanhoTransbordo:
      'eye, eye-slash and star are 18 wide by nature, above the 16 of the box: the box normalises height and alignment, not width. The artwork overflows centred, without clipping and without rescaling.',

    corTitulo: 'Colour',
    corTexto:
      'Colour is inherited from the context through currentColor. There is no icon colour token, and colour is not a property of the component. The gap to the text is space/inline-tight and belongs to the container that composes icon and text, not to the icon.',

    acessibilidadeTitulo: 'Accessibility',
    acessibilidade: [
      'With visible text beside it, the icon is decorative and takes aria-hidden — otherwise the screen reader reads it twice.',
      'With no visible text, aria-label is required.',
      'A meaningful icon requires 3:1 contrast (WCAG 1.4.11).',
      'The icon is not the touch target: the target is the surrounding control, with control/height-large on touch screens.',
      'An isolated icon takes no focus; the surrounding control defines keyboard behaviour.',
      'Icon and colour are never the only signal of state or action.',
    ],

    invalidaTitulo: 'Invalid input',
    invalidaTexto:
      'A name outside the core, a size outside the approved list, or variant=solid with another name render no icon and fail development validation. There is no visual fallback and no free size. The error is reported through console.error in development only.',
    invalidaPonteiro: 'The cases are demonstrated under Validation › Invalid input.',

    antiPadroesTitulo: 'Anti-patterns',
    antiPadroes: [
      'Do not use an icon alone to delete, approve, publish, export or perform any other domain-specific action.',
      'Do not put the Font Awesome Pro package, files or secret into versioned material.',
      'Do not create a visual variant just to fill a matrix.',
      'Do not use Duotone outside structural navigation, and do not mix Duotone and Classic in the same group.',
      'Do not use a name outside the 34 icons of the Nephos core.',
      'Do not define colour as a property; the icon inherits currentColor from the context.',
    ],

    referenciasTitulo: 'References',
    referencias: [
      'design.md — contrato_nph_icon, icone_regras, icone_acessibilidade, tokens_icon, icones_nucleo.',
      'docs/decisoes-tecnicas.md — P01, P02, P03, P17, P19, P20 and P21.',
      'nph-icon spec sheet — purpose, variants, states, accessibility, tokens and anti-patterns.',
      'Figma DS-IA-NEPHOS 5.0 — page NPH — Icon (346:2), frames Componentes — nph-icon (346:3) and Documentação — nph-icon (346:4).',
      'Storybook — Icons Overview, in this folder; Validation, in the folder next to it.',
    ],

    fonteRotulo: 'Source:',
    fonteFicha: 'nph-icon spec sheet',
    fonteFichaContrato:
      'nph-icon spec sheet; design.md › contrato_nph_icon; docs/decisoes-tecnicas.md › P21',
    fonteNucleo: 'design.md › icones_nucleo, icone_regras and icone_componente_figma',
    fonteTamanho:
      'design.md › tokens_icon, icone_regras.caixa and icones_terceira_leva.largura; docs/decisoes-tecnicas.md › P21',
    fonteCor:
      'design.md › icone_regras.cor and icone_regras.espaco_ate_o_texto; docs/decisoes-tecnicas.md › P21',
    fonteAcessibilidade: 'design.md › icone_acessibilidade; nph-icon spec sheet',
    fonteInvalida: 'nph-icon spec sheet; docs/decisoes-tecnicas.md › P21',
  },

  validacao: {
    variantesSecao: 'star',
    variantesRegular: 'regular — not favourited',
    variantesSolid: 'solid — favourited',
    variantesNota:
      'solid exists only for star. Any other name with variant="solid" renders nothing.',

    tamanhosTransbordoTitulo: 'Approved overflow',
    tamanhosEye: 'eye — 18 wide by nature',
    tamanhosCircleCheck: 'circle-check — width equal to height',
    tamanhosNota:
      'The box normalises height and alignment, not width: eye, eye-slash and star overflow centred, without clipping and without rescaling.',

    corNota: 'None of the icons above was painted. They all inherit the colour of the context.',

    acessDecorativoTitulo: 'With text beside it — decorative',
    acessDecorativoExemplo: 'Delete record',
    acessDecorativoNota:
      'Without label: aria-hidden on the host. The screen reader reads the text only once.',
    acessNomeadoTitulo: 'With no visible text — named',
    acessNomeadoRotulo: 'Search',
    acessNomeadoNota:
      'With label: role="img" and aria-label on the host. Only for a universal, recurring symbol; an action with consequences never stands alone.',
    acessFocoNota:
      'The icon never takes focus: keyboard and touch target belong to the surrounding control.',

    invalidaIntro:
      'The four cases below draw nothing and take up no space. Open the console to see one error per invalid property.',
    invalidaCasos: [
      'outside the core:',
      'solid exists only for star:',
      'a free size does not exist:',
      'size is required:',
    ],
  },
};
