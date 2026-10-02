/**
 * Textos do Storybook em portugues do Brasil — IDIOMA-FONTE.
 *
 * Toda frase nasce aqui. `en.js` e `es.js` sao traducoes deste arquivo e nunca
 * decidem conteudo: se divergirem, este vence e a traducao esta errada.
 *
 * Identificadores tecnicos NAO entram no dicionario: `nph-icon`, nomes de
 * token, atributos, comandos e caminhos aparecem literalmente na story, iguais
 * em qualquer idioma.
 */
export default {
  /*
   * Rotulos da barra lateral, por id de entrada. Uma entrada sem chave aqui
   * mantem o nome original — e o caso de `nph-icon`, que e nome tecnico.
   */
  sidebar: {
    'comece-aqui': 'Comece aqui',
    'comece-aqui-boas-vindas': 'Boas-vindas',
    'comece-aqui-boas-vindas--boas-vindas': 'Boas-vindas',
    'fundações': 'Fundações',
    'fundações-visão-geral': 'Visão geral',
    'fundações-visão-geral--visao-geral': 'Visão geral',
    componentes: 'Componentes',
    'componentes-nph-icon-docs': 'Docs',
    'componentes-nph-icon-docs--documentacao': 'Documentação',
    'componentes-nph-icon-docs--icons-overview': 'Icons Overview',
    'componentes-nph-icon-validação': 'Validação',
    'componentes-nph-icon-validação--variantes': 'Variantes',
    'componentes-nph-icon-validação--tamanhos': 'Tamanhos',
    'componentes-nph-icon-validação--heranca-de-cor': 'Herança de cor',
    'componentes-nph-icon-validação--acessibilidade': 'Acessibilidade',
    'componentes-nph-icon-validação--entrada-invalida': 'Entrada inválida',
  },

  /*
   * Seletor de modo da barra de ferramentas. Um modo por vez: moldura e pagina
   * trocam juntas.
   */
  colorScheme: {
    light: 'Modo claro',
    dark: 'Modo escuro',
    toLight: 'Mudar para o modo claro',
    toDark: 'Mudar para o modo escuro',
  },

  welcome: {
    badge: 'IATEC · DESIGN SYSTEM',
    summary:
      'Catálogo de componentes e fundações para construir experiências consistentes, acessíveis e verificáveis.',
    howToNavigate: 'Como navegar',
    steps: [
      {
        title: '1. Comece pelas fundações',
        text:
          'Consulte cor, tipografia, espaço, raio e ícones antes de decidir a aparência de uma peça.',
        destination: 'Fundações › Visão geral',
      },
      {
        title: '2. Consulte o componente',
        text:
          'Cada componente reúne estados, variantes, acessibilidade e exemplos executáveis.',
        destination: 'Componentes › nph-icon',
      },
      {
        title: '3. Registre uma lacuna',
        text:
          'Se um caso não estiver documentado, não improvise API, token, variante ou comportamento.',
        destination: 'Ficha e Registro canônicos',
      },
    ],
    statusTitle: 'Estado atual',
    statusText:
      'Os tokens são gerados a partir da fonte auditada. O nph-icon está implementado e aguarda comparação visual entre Figma e Storybook antes do aceite final.',
  },

  foundations: {
    badge: 'FUNDAÇÕES',
    title: 'Regras que mantêm o sistema coerente',
    summary:
      'As fundações definem os valores e as restrições que os componentes consomem. O Storybook mostra o resultado em código; o Figma continua sendo a fonte visual.',
    items: [
      ['Cor', 'Camadas core, theme e semantic, nos modos claro e escuro.'],
      ['Tipografia', 'Estilos de texto aprovados no Figma e documentados no contrato.'],
      ['Espaçamento e raio', 'Tokens semânticos para composição e controles.'],
      ['Ícones', 'Núcleo curado de ícones Font Awesome Pro.'],
    ],
    noticeTitle: 'Como usar esta área',
    noticeText1: 'Consulte o contrato em',
    noticeText2:
      'antes de criar ou alterar um componente. Se a documentação não cobrir o caso, registre a lacuna em vez de criar token, variante ou regra nova.',
  },

  /* Categorias do nucleo. A ordem vem de `icones_nucleo`, no design.md. */
  categories: [
    'Navegação e menus',
    'Direção e revelação',
    'Ação',
    'Estado e comunicação',
    'Conteúdo e dados',
  ],

  gallery: {
    title: 'Icons Overview',
    summary1: 'Os',
    summary2:
      'ícones aprovados do núcleo Nephos, agrupados pelas categorias do design.md. O contrato do componente está em',
    summary3: 'Documentação',
    searchLabel: 'Buscar ícone por nome',
    searchExample: 'ex.: chevron',
    clear: 'Limpar',
    counter: (found, total) => `${found} de ${total} ícones`,
    empty:
      'Nenhum ícone do núcleo corresponde à busca. Se o ícone que você precisa não está aqui, é lacuna: pergunte antes de acrescentar.',
  },

  docs: {
    summary:
      'Disponibiliza um ícone do núcleo Nephos com tamanho, família e acessibilidade consistentes, sem introduzir cor ou arte fora do acervo aprovado.',
    onThisPage: 'Nesta página',
    apiHeader: ['Propriedade', 'Regra'],
    sizeHeader: ['Token', 'Quando usar'],
    coreHeader: ['Categoria', 'Ícones'],
    sizeCaption: 'Os tamanhos aprovados, com instâncias reais do nph-icon.',
    overflowNoteTitle: 'Exceção de largura',
    solidNoteTitle: 'Estilos e famílias',
    invalidNoteTitle: 'Onde ver os casos',
    derivedTitle: 'Esta página é derivada.',
    derivedText1:
      'Em caso de divergência, prevalecem as fontes canônicas: design.md para o contrato técnico e docs/decisoes-tecnicas.md para as decisões P01, P02, P03, P17, P19, P20 e P21. A ficha nph-icon e o Figma DS-IA-NEPHOS 5.0 completam o contrato do componente. Nenhuma regra é criada aqui.',

    whenToUseTitle: 'Quando usar',
    whenToUse: [
      'Um controle ou conteúdo precisa de um ícone existente no núcleo Nephos.',
      'O ícone reforça um rótulo, estado ou direção sem substituir a informação textual.',
    ],

    whenNotToUseTitle: 'Quando não usar',
    whenNotToUse: [
      'A ação é específica do domínio ou tem consequência: use rótulo textual junto ao ícone.',
      'O ícone solicitado não existe no núcleo: registre a lacuna e aguarde decisão.',
    ],

    apiTitle: 'API pública aprovada',
    api: [
      ['name', (total) => `Obrigatório, em kebab-case e limitado aos ${total} ícones do núcleo Nephos.`],
      ['variant', () => 'regular por padrão; solid quando o contexto pede maior presença visual. Os dois existem para todos os nomes do núcleo.'],
      ['size', () => 'sm, md ou lg; não aceita valor livre.'],
      [
        'label',
        () =>
          'Ausente ou vazio torna o ícone decorativo e aplica aria-hidden. Valor não vazio fornece seu nome acessível.',
      ],
      ['Slots e eventos', () => 'Não expõe slots nem eventos.'],
      [
        'Interação',
        () => 'Não recebe foco, clique ou toque; o controle que o contém define a interação.',
      ],
      [
        'Cor e personalização',
        () => 'Não expõe propriedade de cor nem ::part inicial; herda currentColor do contexto.',
      ],
    ],

    coreTitle: (total) => `Núcleo de ${total} ícones`,
    coreText:
      'O acervo é Font Awesome Pro e Classic é a família padrão. O catálogo completo, com busca, está em Icons Overview, nesta mesma pasta.',
    coreCount: (n) => `${n} ícones`,
    coreRule:
      'regular e solid existem para todos os nomes do núcleo; regular é o padrão, e solid entra quando o contexto pede maior presença visual. Nunca invente arte fora do acervo. Light, Thin e Sharp são proibidos. Duotone é permitido somente em navegação estrutural, sem misturar famílias no mesmo grupo, e ainda não tem arte disponível.',

    sizeTitle: 'Tamanho',
    sizeText:
      'O tamanho não é variante visual: vem de token semântico, e não existe valor livre. A caixa é sempre quadrada; o desenho é centralizado e escalado pela altura.',
    sizeTable: [
      [
        'icon/size-sm',
        'Dentro de controle, célula de tabela, campo, e ao lado de texto de 14px. Na dúvida, é este.',
      ],
      [
        'icon/size-md',
        'Item de menu, aba e ação de destaque, onde o sm fica pequeno ao lado do rótulo. Não use dentro de botão comum.',
      ],
      [
        'icon/size-lg',
        'Cabeçalho de seção, estado vazio e ícone que carrega significado sozinho. Não use em tela densa nem em lista.',
      ],
    ],
    sizeOverflow:
      'eye, eye-slash e star têm 18 de largura natural, acima dos 16 da caixa: a caixa normaliza altura e alinhamento, não largura. O desenho transborda centralizado, sem corte e sem reescala.',

    colorTitle: 'Cor',
    colorText:
      'A cor herda do contexto via currentColor. Não existe token de cor de ícone e a cor não é propriedade do componente. O espaço até o texto é space/inline-tight e pertence ao contêiner que compõe ícone e texto, não ao ícone.',

    accessibilityTitle: 'Acessibilidade',
    accessibility: [
      'Com texto visível ao lado, o ícone é decorativo e recebe aria-hidden — senão o leitor de tela lê duas vezes.',
      'Sem texto visível, aria-label é obrigatório.',
      'Ícone significativo exige contraste 3:1 (WCAG 1.4.11).',
      'O ícone não é o alvo de toque: o alvo é o controle em volta, com control/height-large em tela de toque.',
      'O ícone isolado não recebe foco; o controle que o envolve define o teclado.',
      'Ícone e cor nunca são o único sinal de estado ou ação.',
    ],

    invalidTitle: 'Entrada inválida',
    invalidText:
      'name fora do núcleo, size ausente ou fora da lista aprovada, ou variant inexistente não renderizam ícone e falham na validação de desenvolvimento. Não há fallback visual nem tamanho livre. O erro sai por console.error apenas em desenvolvimento.',
    invalidPointer: 'Os casos estão demonstrados em Validação › Entrada inválida.',

    antiPatternsTitle: 'Anti-padrões',
    antiPatterns: [
      'Não usar ícone sozinho para excluir, aprovar, publicar, exportar ou outra ação específica do domínio.',
      'Não usar o pacote, arquivo ou segredo do Font Awesome Pro em material versionado.',
      'Não criar variante visual apenas para preencher uma matriz.',
      'Não usar Duotone fora de navegação estrutural nem misturar Duotone e Classic no mesmo grupo.',
      'Não usar um name fora do núcleo de ícones do Nephos.',
      'Não definir cor como propriedade; o ícone herda currentColor do contexto.',
    ],

    referencesTitle: 'Referências',
    references: [
      'design.md — contrato_nph_icon, icone_regras, icone_acessibilidade, tokens_icon, icones_nucleo.',
      'docs/decisoes-tecnicas.md — P01, P02, P03, P17, P19, P20 e P21.',
      'ficha nph-icon — função, variantes, estados, acessibilidade, tokens e anti-padrões.',
      'Figma DS-IA-NEPHOS 5.0 — página NPH — Icon (346:2), frames nph-icon (1130:956) e Raiz — nph-icon (1138:1694).',
      'Storybook — Icons Overview, nesta pasta; Validação, na pasta ao lado.',
    ],

    sourceLabel: 'Fonte:',
    sourceSpec: 'ficha nph-icon',
    sourceSpecContract:
      'ficha nph-icon; design.md › contrato_nph_icon; docs/decisoes-tecnicas.md › P21',
    sourceCore: 'design.md › icones_nucleo, icone_regras e icone_componente_figma',
    sourceSize:
      'design.md › tokens_icon, icone_regras.caixa e icones_terceira_leva.largura; docs/decisoes-tecnicas.md › P21',
    sourceColor:
      'design.md › icone_regras.cor e icone_regras.espaco_ate_o_texto; docs/decisoes-tecnicas.md › P21',
    sourceAccessibility: 'design.md › icone_acessibilidade; ficha nph-icon',
    sourceInvalid: 'ficha nph-icon; docs/decisoes-tecnicas.md › P21',
  },

  validation: {
    variantsSection: 'regular e solid',
    variantsRegular: 'regular — padrão',
    variantsSolid: 'solid — mais presença visual',
    variantsNote:
      'regular e solid existem para todos os nomes do núcleo.',

    sizesOverflowTitle: 'Transbordo aprovado',
    sizesEye: 'eye — 18 de largura natural',
    sizesCircleCheck: 'circle-check — largura igual à altura',
    sizesNote:
      'A caixa normaliza altura e alinhamento, não largura: eye, eye-slash e star transbordam centralizados, sem corte e sem reescala.',

    colorNote: 'Nenhum ícone acima foi pintado. Todos herdam a cor do contexto.',

    a11yDecorativeTitle: 'Com texto ao lado — decorativo',
    a11yDecorativeExample: 'Excluir registro',
    a11yDecorativeNote:
      'Sem label: aria-hidden no host. O leitor de tela lê o texto uma vez só.',
    a11yNamedTitle: 'Sem texto visível — nomeado',
    a11yNamedLabel: 'Buscar',
    a11yNamedNote:
      'Com label: role="img" e aria-label no host. Só para símbolo universal e recorrente; ação com consequência nunca anda sozinha.',
    a11yFocusNote:
      'O ícone nunca recebe foco: teclado e alvo de toque pertencem ao controle em volta.',

    invalidIntro:
      'Os quatro casos abaixo não desenham nada e não ocupam espaço. Abra o console para ver um erro por propriedade inválida.',
    invalidCases: [
      'fora do núcleo:',
      'variant inexistente:',
      'tamanho livre não existe:',
      'size é obrigatório:',
    ],
  },
};
