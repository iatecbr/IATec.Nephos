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
  barraLateral: {
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

  boasVindas: {
    selo: 'IATEC · DESIGN SYSTEM',
    resumo:
      'Catálogo de componentes e fundações para construir experiências consistentes, acessíveis e verificáveis.',
    comoNavegar: 'Como navegar',
    passos: [
      {
        titulo: '1. Comece pelas fundações',
        texto:
          'Consulte cor, tipografia, espaço, raio e ícones antes de decidir a aparência de uma peça.',
        destino: 'Fundações › Visão geral',
      },
      {
        titulo: '2. Consulte o componente',
        texto:
          'Cada componente reúne estados, variantes, acessibilidade e exemplos executáveis.',
        destino: 'Componentes › nph-icon',
      },
      {
        titulo: '3. Registre uma lacuna',
        texto:
          'Se um caso não estiver documentado, não improvise API, token, variante ou comportamento.',
        destino: 'Ficha e Registro canônicos',
      },
    ],
    estadoTitulo: 'Estado atual',
    estadoTexto:
      'Os tokens são gerados a partir da fonte auditada. O nph-icon está implementado e aguarda comparação visual entre Figma e Storybook antes do aceite final.',
  },

  fundacoes: {
    selo: 'FUNDAÇÕES',
    titulo: 'Regras que mantêm o sistema coerente',
    resumo:
      'As fundações definem os valores e as restrições que os componentes consomem. O Storybook mostra o resultado em código; o Figma continua sendo a fonte visual.',
    itens: [
      ['Cor', 'Camadas core, theme e semantic, nos modos claro e escuro.'],
      ['Tipografia', 'Estilos de texto aprovados no Figma e documentados no contrato.'],
      ['Espaçamento e raio', 'Tokens semânticos para composição e controles.'],
      ['Ícones', 'Núcleo curado de 34 ícones Font Awesome Pro.'],
    ],
    avisoTitulo: 'Como usar esta área',
    avisoTexto1: 'Consulte o contrato em',
    avisoTexto2:
      'antes de criar ou alterar um componente. Se a documentação não cobrir o caso, registre a lacuna em vez de criar token, variante ou regra nova.',
  },

  /* Categorias do nucleo. A ordem vem de `icones_nucleo`, no design.md. */
  categorias: [
    'Navegação e menus',
    'Direção e revelação',
    'Ação',
    'Estado e comunicação',
    'Conteúdo e dados',
  ],

  galeria: {
    titulo: 'Icons Overview',
    resumo1: 'Os',
    resumo2:
      'ícones aprovados do núcleo Nephos, agrupados pelas categorias do design.md. O contrato do componente está em',
    resumo3: 'Documentação',
    rotuloBusca: 'Buscar ícone por nome',
    exemploBusca: 'ex.: chevron',
    limpar: 'Limpar',
    contador: (achados, total) => `${achados} de ${total} ícones`,
    vazio:
      'Nenhum ícone do núcleo corresponde à busca. Se o ícone que você precisa não está aqui, é lacuna: pergunte antes de acrescentar.',
  },

  docs: {
    resumo:
      'Disponibiliza um ícone do núcleo Nephos com tamanho, família e acessibilidade consistentes, sem introduzir cor ou arte fora do acervo aprovado.',
    derivadaTitulo: 'Esta página é derivada.',
    derivadaTexto1:
      'Em caso de divergência, prevalecem as fontes canônicas: design.md para o contrato técnico e docs/decisoes-tecnicas.md para as decisões P01, P02, P03, P17, P19, P20 e P21. A ficha nph-icon e o Figma DS-IA-NEPHOS 5.0 completam o contrato do componente. Nenhuma regra é criada aqui.',
    derivadaTexto2:
      'Estado documental: P01, P02, P03, P17, P19 e P20 são decisões adotadas pela Indiane em 24/08/2026; a P21 foi adotada em 26/08/2026, com aceitação formal de risco. Todas aguardam revisão de Elvys. A aprovação do Figma em 26-08-2026 é visual e não substitui essa revisão.',

    quandoUsarTitulo: 'Quando usar',
    quandoUsar: [
      'Um controle ou conteúdo precisa de um ícone existente no núcleo Nephos.',
      'O ícone reforça um rótulo, estado ou direção sem substituir a informação textual.',
    ],

    quandoNaoUsarTitulo: 'Quando não usar',
    quandoNaoUsar: [
      'A ação é específica do domínio ou tem consequência: use rótulo textual junto ao ícone.',
      'O ícone solicitado não existe no núcleo: registre a lacuna e aguarde decisão.',
    ],

    apiTitulo: 'API pública aprovada',
    api: [
      ['name', (total) => `Obrigatório, em kebab-case e limitado aos ${total} ícones do núcleo Nephos.`],
      ['variant', () => 'regular por padrão ou solid somente quando name=star.'],
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

    nucleoTitulo: (total) => `Núcleo de ${total} ícones`,
    nucleoTexto:
      'O acervo é Font Awesome Pro e Classic é a família padrão. O catálogo completo, com busca, está em Icons Overview, nesta mesma pasta.',
    nucleoContagem: (n) => `${n} ícones`,
    nucleoRegra:
      'solid existe somente para star: Regular marca não favoritado, Solid marca favoritado. As demais combinações com solid não existem de propósito — nunca invente arte para preencher a matriz. Light, Thin e Sharp são proibidos. Duotone é permitido somente em navegação estrutural, sem misturar famílias no mesmo grupo, e ainda não tem arte disponível.',

    tamanhoTitulo: 'Tamanho',
    tamanhoTexto:
      'O tamanho não é variante visual: vem de token semântico, e não existe valor livre. A caixa é sempre quadrada; o desenho é centralizado e escalado pela altura.',
    tamanhoTabela: [
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
    tamanhoTransbordo:
      'eye, eye-slash e star têm 18 de largura natural, acima dos 16 da caixa: a caixa normaliza altura e alinhamento, não largura. O desenho transborda centralizado, sem corte e sem reescala.',

    corTitulo: 'Cor',
    corTexto:
      'A cor herda do contexto via currentColor. Não existe token de cor de ícone e a cor não é propriedade do componente. O espaço até o texto é space/inline-tight e pertence ao contêiner que compõe ícone e texto, não ao ícone.',

    acessibilidadeTitulo: 'Acessibilidade',
    acessibilidade: [
      'Com texto visível ao lado, o ícone é decorativo e recebe aria-hidden — senão o leitor de tela lê duas vezes.',
      'Sem texto visível, aria-label é obrigatório.',
      'Ícone significativo exige contraste 3:1 (WCAG 1.4.11).',
      'O ícone não é o alvo de toque: o alvo é o controle em volta, com control/height-large em tela de toque.',
      'O ícone isolado não recebe foco; o controle que o envolve define o teclado.',
      'Ícone e cor nunca são o único sinal de estado ou ação.',
    ],

    invalidaTitulo: 'Entrada inválida',
    invalidaTexto:
      'name fora do núcleo, size fora da lista aprovada ou variant=solid com outro nome não renderizam ícone e falham na validação de desenvolvimento. Não há fallback visual nem tamanho livre. O erro sai por console.error apenas em desenvolvimento.',
    invalidaPonteiro: 'Os casos estão demonstrados em Validação › Entrada inválida.',

    antiPadroesTitulo: 'Anti-padrões',
    antiPadroes: [
      'Não usar ícone sozinho para excluir, aprovar, publicar, exportar ou outra ação específica do domínio.',
      'Não usar o pacote, arquivo ou segredo do Font Awesome Pro em material versionado.',
      'Não criar variante visual apenas para preencher uma matriz.',
      'Não usar Duotone fora de navegação estrutural nem misturar Duotone e Classic no mesmo grupo.',
      'Não usar um name fora dos 34 ícones do núcleo Nephos.',
      'Não definir cor como propriedade; o ícone herda currentColor do contexto.',
    ],

    referenciasTitulo: 'Referências',
    referencias: [
      'design.md — contrato_nph_icon, icone_regras, icone_acessibilidade, tokens_icon, icones_nucleo.',
      'docs/decisoes-tecnicas.md — P01, P02, P03, P17, P19, P20 e P21.',
      'ficha nph-icon — função, variantes, estados, acessibilidade, tokens e anti-padrões.',
      'Figma DS-IA-NEPHOS 5.0 — página NPH — Icon (346:2), frames Componentes — nph-icon (346:3) e Documentação — nph-icon (346:4).',
      'Storybook — Icons Overview, nesta pasta; Validação, na pasta ao lado.',
    ],

    fonteRotulo: 'Fonte:',
    fonteFicha: 'ficha nph-icon',
    fonteFichaContrato:
      'ficha nph-icon; design.md › contrato_nph_icon; docs/decisoes-tecnicas.md › P21',
    fonteNucleo: 'design.md › icones_nucleo, icone_regras e icone_componente_figma',
    fonteTamanho:
      'design.md › tokens_icon, icone_regras.caixa e icones_terceira_leva.largura; docs/decisoes-tecnicas.md › P21',
    fonteCor:
      'design.md › icone_regras.cor e icone_regras.espaco_ate_o_texto; docs/decisoes-tecnicas.md › P21',
    fonteAcessibilidade: 'design.md › icone_acessibilidade; ficha nph-icon',
    fonteInvalida: 'ficha nph-icon; docs/decisoes-tecnicas.md › P21',
  },

  validacao: {
    variantesSecao: 'star',
    variantesRegular: 'regular — não favoritado',
    variantesSolid: 'solid — favoritado',
    variantesNota:
      'solid existe somente para star. Qualquer outro nome com variant="solid" não renderiza.',

    tamanhosTransbordoTitulo: 'Transbordo aprovado',
    tamanhosEye: 'eye — 18 de largura natural',
    tamanhosCircleCheck: 'circle-check — largura igual à altura',
    tamanhosNota:
      'A caixa normaliza altura e alinhamento, não largura: eye, eye-slash e star transbordam centralizados, sem corte e sem reescala.',

    corNota: 'Nenhum ícone acima foi pintado. Todos herdam a cor do contexto.',

    acessDecorativoTitulo: 'Com texto ao lado — decorativo',
    acessDecorativoExemplo: 'Excluir registro',
    acessDecorativoNota:
      'Sem label: aria-hidden no host. O leitor de tela lê o texto uma vez só.',
    acessNomeadoTitulo: 'Sem texto visível — nomeado',
    acessNomeadoRotulo: 'Buscar',
    acessNomeadoNota:
      'Com label: role="img" e aria-label no host. Só para símbolo universal e recorrente; ação com consequência nunca anda sozinha.',
    acessFocoNota:
      'O ícone nunca recebe foco: teclado e alvo de toque pertencem ao controle em volta.',

    invalidaIntro:
      'Os quatro casos abaixo não desenham nada e não ocupam espaço. Abra o console para ver um erro por propriedade inválida.',
    invalidaCasos: [
      'fora do núcleo:',
      'solid só existe em star:',
      'tamanho livre não existe:',
      'size é obrigatório:',
    ],
  },
};
