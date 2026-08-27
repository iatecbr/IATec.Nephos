/**
 * Textos de Storybook en espanol.
 *
 * Traducido de `pt-BR.js`, que es la fuente. Si ambos difieren, gana el archivo
 * en portugues y este esta equivocado.
 *
 * Los identificadores tecnicos nunca se traducen ni viven en el diccionario.
 */
export default {
  barraLateral: {
    'comece-aqui': 'Empiece aquí',
    'comece-aqui-boas-vindas': 'Bienvenida',
    'comece-aqui-boas-vindas--boas-vindas': 'Bienvenida',
    'fundações': 'Fundamentos',
    'fundações-visão-geral': 'Visión general',
    'fundações-visão-geral--visao-geral': 'Visión general',
    componentes: 'Componentes',
    'componentes-nph-icon-docs': 'Docs',
    'componentes-nph-icon-docs--documentacao': 'Documentación',
    'componentes-nph-icon-docs--icons-overview': 'Icons Overview',
    'componentes-nph-icon-validação': 'Validación',
    'componentes-nph-icon-validação--variantes': 'Variantes',
    'componentes-nph-icon-validação--tamanhos': 'Tamaños',
    'componentes-nph-icon-validação--heranca-de-cor': 'Herencia de color',
    'componentes-nph-icon-validação--acessibilidade': 'Accesibilidad',
    'componentes-nph-icon-validação--entrada-invalida': 'Entrada inválida',
  },

  boasVindas: {
    selo: 'IATEC · DESIGN SYSTEM',
    resumo:
      'Catálogo de componentes y fundamentos para construir experiencias consistentes, accesibles y verificables.',
    comoNavegar: 'Cómo navegar',
    passos: [
      {
        titulo: '1. Empiece por los fundamentos',
        texto:
          'Consulte color, tipografía, espacio, radio e iconos antes de decidir la apariencia de una pieza.',
        destino: 'Fundamentos › Visión general',
      },
      {
        titulo: '2. Consulte el componente',
        texto:
          'Cada componente reúne estados, variantes, accesibilidad y ejemplos ejecutables.',
        destino: 'Componentes › nph-icon',
      },
      {
        titulo: '3. Registre una laguna',
        texto:
          'Si un caso no está documentado, no improvise API, token, variante ni comportamiento.',
        destino: 'Ficha y Registro canónicos',
      },
    ],
    estadoTitulo: 'Estado actual',
    estadoTexto:
      'Los tokens se generan a partir de la fuente auditada. nph-icon está implementado y espera la comparación visual entre Figma y Storybook antes de la aceptación final.',
  },

  fundacoes: {
    selo: 'FUNDAMENTOS',
    titulo: 'Las reglas que mantienen coherente al sistema',
    resumo:
      'Los fundamentos definen los valores y las restricciones que consumen los componentes. Storybook muestra el resultado en código; Figma sigue siendo la fuente visual.',
    itens: [
      ['Color', 'Las capas core, theme y semantic, en los modos claro y oscuro.'],
      ['Tipografía', 'Estilos de texto aprobados en Figma y documentados en el contrato.'],
      ['Espaciado y radio', 'Tokens semánticos para composición y controles.'],
      ['Iconos', 'Núcleo curado de 34 iconos Font Awesome Pro.'],
    ],
    avisoTitulo: 'Cómo usar esta área',
    avisoTexto1: 'Consulte el contrato en',
    avisoTexto2:
      'antes de crear o modificar un componente. Si la documentación no cubre el caso, registre la laguna en lugar de crear un token, variante o regla nueva.',
  },

  categorias: [
    'Navegación y menús',
    'Dirección y revelación',
    'Acción',
    'Estado y comunicación',
    'Contenido y datos',
  ],

  galeria: {
    titulo: 'Icons Overview',
    resumo1: 'Los',
    resumo2:
      'iconos aprobados del núcleo Nephos, agrupados por las categorías de design.md. El contrato del componente está en',
    resumo3: 'Documentación',
    rotuloBusca: 'Buscar icono por nombre',
    exemploBusca: 'ej.: chevron',
    limpar: 'Limpiar',
    contador: (achados, total) => `${achados} de ${total} iconos`,
    vazio:
      'Ningún icono del núcleo corresponde a la búsqueda. Si el icono que necesita no está aquí, es una laguna: pregunte antes de agregarlo.',
  },

  docs: {
    resumo:
      'Entrega un icono del núcleo Nephos con tamaño, familia y accesibilidad consistentes, sin introducir color ni arte fuera del acervo aprobado.',
    derivadaTitulo: 'Esta página es derivada.',
    derivadaTexto1:
      'En caso de divergencia, prevalecen las fuentes canónicas: design.md para el contrato técnico y docs/decisoes-tecnicas.md para las decisiones P01, P02, P03, P17, P19, P20 y P21. La ficha nph-icon y el Figma DS-IA-NEPHOS 5.0 completan el contrato del componente. Aquí no se crea ninguna regla.',
    derivadaTexto2:
      'Estado documental: P01, P02, P03, P17, P19 y P20 fueron adoptadas por Indiane el 24/08/2026; la P21 se adoptó el 26/08/2026, con aceptación formal de riesgo. Todas esperan revisión de Elvys. La aprobación de Figma del 26-08-2026 es visual y no sustituye esa revisión.',

    quandoUsarTitulo: 'Cuándo usarlo',
    quandoUsar: [
      'Un control o contenido necesita un icono existente en el núcleo Nephos.',
      'El icono refuerza una etiqueta, estado o dirección sin sustituir la información textual.',
    ],

    quandoNaoUsarTitulo: 'Cuándo no usarlo',
    quandoNaoUsar: [
      'La acción es específica del dominio o tiene consecuencias: use una etiqueta textual junto al icono.',
      'El icono solicitado no existe en el núcleo: registre la laguna y espere una decisión.',
    ],

    apiTitulo: 'API pública aprobada',
    api: [
      ['name', (total) => `Obligatorio, en kebab-case y limitado a los ${total} iconos del núcleo Nephos.`],
      ['variant', () => 'regular por defecto, o solid solo cuando name=star.'],
      ['size', () => 'sm, md o lg; no acepta valor libre.'],
      [
        'label',
        () =>
          'Ausente o vacío vuelve decorativo al icono y aplica aria-hidden. Un valor no vacío entrega su nombre accesible.',
      ],
      ['Slots y eventos', () => 'No expone slots ni eventos.'],
      [
        'Interacción',
        () => 'No recibe foco, clic ni toque; el control que lo contiene define la interacción.',
      ],
      [
        'Color y personalización',
        () => 'No expone propiedad de color ni ::part inicial; hereda currentColor del contexto.',
      ],
    ],

    nucleoTitulo: (total) => `Núcleo de ${total} iconos`,
    nucleoTexto:
      'El acervo es Font Awesome Pro y Classic es la familia por defecto. El catálogo completo, con búsqueda, está en Icons Overview, en esta misma carpeta.',
    nucleoContagem: (n) => `${n} iconos`,
    nucleoRegra:
      'solid existe solo para star: Regular marca no favorito, Solid marca favorito. Las demás combinaciones con solid no existen a propósito — nunca invente arte para completar la matriz. Light, Thin y Sharp están prohibidos. Duotone se permite solo en navegación estructural, sin mezclar familias en el mismo grupo, y todavía no tiene arte disponible.',

    tamanhoTitulo: 'Tamaño',
    tamanhoTexto:
      'El tamaño no es una variante visual: viene de un token semántico, y no existe valor libre. La caja es siempre cuadrada; el dibujo se centra y se escala por la altura.',
    tamanhoTabela: [
      [
        'icon/size-sm',
        'Dentro de un control, celda de tabla, campo, y junto a texto de 14px. En la duda, es este.',
      ],
      [
        'icon/size-md',
        'Ítem de menú, pestaña y acción destacada, donde sm queda pequeño junto a la etiqueta. No lo use dentro de un botón común.',
      ],
      [
        'icon/size-lg',
        'Encabezado de sección, estado vacío e icono que carga significado por sí solo. No lo use en pantalla densa ni en lista.',
      ],
    ],
    tamanhoTransbordo:
      'eye, eye-slash y star tienen 18 de ancho natural, por encima de los 16 de la caja: la caja normaliza altura y alineación, no ancho. El dibujo desborda centrado, sin recorte y sin reescalado.',

    corTitulo: 'Color',
    corTexto:
      'El color se hereda del contexto vía currentColor. No existe token de color de icono y el color no es propiedad del componente. El espacio hasta el texto es space/inline-tight y pertenece al contenedor que compone icono y texto, no al icono.',

    acessibilidadeTitulo: 'Accesibilidad',
    acessibilidade: [
      'Con texto visible al lado, el icono es decorativo y recibe aria-hidden — si no, el lector de pantalla lo lee dos veces.',
      'Sin texto visible, aria-label es obligatorio.',
      'Un icono significativo exige contraste 3:1 (WCAG 1.4.11).',
      'El icono no es el objetivo táctil: el objetivo es el control alrededor, con control/height-large en pantalla táctil.',
      'El icono aislado no recibe foco; el control que lo envuelve define el teclado.',
      'Icono y color nunca son la única señal de estado o acción.',
    ],

    invalidaTitulo: 'Entrada inválida',
    invalidaTexto:
      'Un name fuera del núcleo, un size fuera de la lista aprobada o variant=solid con otro nombre no renderizan icono y fallan en la validación de desarrollo. No hay fallback visual ni tamaño libre. El error sale por console.error solo en desarrollo.',
    invalidaPonteiro: 'Los casos están demostrados en Validación › Entrada inválida.',

    antiPadroesTitulo: 'Antipatrones',
    antiPadroes: [
      'No usar un icono solo para eliminar, aprobar, publicar, exportar u otra acción específica del dominio.',
      'No usar el paquete, archivo o secreto de Font Awesome Pro en material versionado.',
      'No crear una variante visual solo para completar una matriz.',
      'No usar Duotone fuera de la navegación estructural ni mezclar Duotone y Classic en el mismo grupo.',
      'No usar un name fuera de los 34 iconos del núcleo Nephos.',
      'No definir el color como propiedad; el icono hereda currentColor del contexto.',
    ],

    referenciasTitulo: 'Referencias',
    referencias: [
      'design.md — contrato_nph_icon, icone_regras, icone_acessibilidade, tokens_icon, icones_nucleo.',
      'docs/decisoes-tecnicas.md — P01, P02, P03, P17, P19, P20 y P21.',
      'ficha nph-icon — función, variantes, estados, accesibilidad, tokens y antipatrones.',
      'Figma DS-IA-NEPHOS 5.0 — página NPH — Icon (346:2), frames Componentes — nph-icon (346:3) y Documentação — nph-icon (346:4).',
      'Storybook — Icons Overview, en esta carpeta; Validación, en la carpeta de al lado.',
    ],

    fonteRotulo: 'Fuente:',
    fonteFicha: 'ficha nph-icon',
    fonteFichaContrato:
      'ficha nph-icon; design.md › contrato_nph_icon; docs/decisoes-tecnicas.md › P21',
    fonteNucleo: 'design.md › icones_nucleo, icone_regras y icone_componente_figma',
    fonteTamanho:
      'design.md › tokens_icon, icone_regras.caixa y icones_terceira_leva.largura; docs/decisoes-tecnicas.md › P21',
    fonteCor:
      'design.md › icone_regras.cor y icone_regras.espaco_ate_o_texto; docs/decisoes-tecnicas.md › P21',
    fonteAcessibilidade: 'design.md › icone_acessibilidade; ficha nph-icon',
    fonteInvalida: 'ficha nph-icon; docs/decisoes-tecnicas.md › P21',
  },

  validacao: {
    variantesSecao: 'star',
    variantesRegular: 'regular — no favorito',
    variantesSolid: 'solid — favorito',
    variantesNota:
      'solid existe solo para star. Cualquier otro nombre con variant="solid" no renderiza.',

    tamanhosTransbordoTitulo: 'Desbordamiento aprobado',
    tamanhosEye: 'eye — 18 de ancho natural',
    tamanhosCircleCheck: 'circle-check — ancho igual a la altura',
    tamanhosNota:
      'La caja normaliza altura y alineación, no ancho: eye, eye-slash y star desbordan centrados, sin recorte y sin reescalado.',

    corNota: 'Ningún icono de arriba fue pintado. Todos heredan el color del contexto.',

    acessDecorativoTitulo: 'Con texto al lado — decorativo',
    acessDecorativoExemplo: 'Eliminar registro',
    acessDecorativoNota:
      'Sin label: aria-hidden en el host. El lector de pantalla lee el texto una sola vez.',
    acessNomeadoTitulo: 'Sin texto visible — nombrado',
    acessNomeadoRotulo: 'Buscar',
    acessNomeadoNota:
      'Con label: role="img" y aria-label en el host. Solo para símbolo universal y recurrente; una acción con consecuencias nunca anda sola.',
    acessFocoNota:
      'El icono nunca recibe foco: el teclado y el objetivo táctil pertenecen al control de alrededor.',

    invalidaIntro:
      'Los cuatro casos siguientes no dibujan nada y no ocupan espacio. Abra la consola para ver un error por propiedad inválida.',
    invalidaCasos: [
      'fuera del núcleo:',
      'solid existe solo en star:',
      'un tamaño libre no existe:',
      'size es obligatorio:',
    ],
  },
};
