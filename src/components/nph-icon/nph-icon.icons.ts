/**
 * Mapa FECHADO dos icones do nucleo Nephos.
 *
 * Fonte do dominio: `design.md`, bloco `icones_nucleo` — 34 nomes distintos em
 * cinco categorias. A unica combinacao `solid` que existe e `star`, conforme
 * `icone_componente_figma.propriedade_estilo`. NUNCA acrescente nome, familia
 * ou variante aqui sem decisao registrada: fora da lista e lacuna, nao ausencia.
 *
 * Os desenhos vem do Font Awesome Pro linha 6, pacotes SVG `regular` e `solid`.
 * A importacao e profunda, um modulo por icone, para que apenas os 34 entrem no
 * pacote final. Nenhum arquivo do acervo e versionado.
 */
import type { IconDefinition } from '@fortawesome/pro-regular-svg-icons';

/* Navegacao e menus */
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';

/* Direcao e revelacao */
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-regular-svg-icons/faChevronUp';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { faEye } from '@fortawesome/pro-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/pro-regular-svg-icons/faEyeSlash';
import { faEllipsis } from '@fortawesome/pro-regular-svg-icons/faEllipsis';

/* Acao */
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { faPlus } from '@fortawesome/pro-regular-svg-icons/faPlus';
import { faMinus } from '@fortawesome/pro-regular-svg-icons/faMinus';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
import { faEllipsisVertical } from '@fortawesome/pro-regular-svg-icons/faEllipsisVertical';
import { faArrowUpArrowDown } from '@fortawesome/pro-regular-svg-icons/faArrowUpArrowDown';
import { faGripVertical } from '@fortawesome/pro-regular-svg-icons/faGripVertical';
import { faPenToSquare } from '@fortawesome/pro-regular-svg-icons/faPenToSquare';
import { faTrashCan } from '@fortawesome/pro-regular-svg-icons/faTrashCan';
import { faArrowUpFromBracket } from '@fortawesome/pro-regular-svg-icons/faArrowUpFromBracket';
import { faDownload } from '@fortawesome/pro-regular-svg-icons/faDownload';
import { faGear } from '@fortawesome/pro-regular-svg-icons/faGear';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilterSlash } from '@fortawesome/pro-regular-svg-icons/faFilterSlash';

/* Estado e comunicacao */
import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons/faCircleInfo';
import { faTriangleExclamation } from '@fortawesome/pro-regular-svg-icons/faTriangleExclamation';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { faCircleCheck } from '@fortawesome/pro-regular-svg-icons/faCircleCheck';
import { faCircleQuestion } from '@fortawesome/pro-regular-svg-icons/faCircleQuestion';
import { faStar } from '@fortawesome/pro-regular-svg-icons/faStar';
import { faCircleNotch } from '@fortawesome/pro-regular-svg-icons/faCircleNotch';

/* Conteudo e dados */
import { faCalendarDays } from '@fortawesome/pro-regular-svg-icons/faCalendarDays';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';

/* A unica arte Solid do nucleo: star favoritado. */
import { faStar as faStarSolid } from '@fortawesome/pro-solid-svg-icons/faStar';

/**
 * Os 34 nomes do nucleo, na ordem das categorias do `design.md`.
 * A ordem e documental; a busca e por chave.
 */
export const NPH_ICON_NAMES = [
  /* navegacao_e_menus */
  'bars',
  /* direcao_e_revelacao */
  'chevron-down',
  'chevron-up',
  'chevron-right',
  'chevron-left',
  'arrow-left',
  'arrow-right',
  'eye',
  'eye-slash',
  'ellipsis',
  /* acao */
  'xmark',
  'check',
  'plus',
  'minus',
  'magnifying-glass',
  'ellipsis-vertical',
  'arrow-up-arrow-down',
  'grip-vertical',
  'pen-to-square',
  'trash-can',
  'arrow-up-from-bracket',
  'download',
  'gear',
  'filter',
  'filter-slash',
  /* estado_e_comunicacao */
  'circle-info',
  'triangle-exclamation',
  'circle-xmark',
  'circle-check',
  'circle-question',
  'star',
  'circle-notch',
  /* conteudo_e_dados */
  'calendar-days',
  'user',
] as const;

export type NphIconName = (typeof NPH_ICON_NAMES)[number];

/** `regular` e o padrao; `solid` existe somente para `star`. */
export const NPH_ICON_VARIANTS = ['regular', 'solid'] as const;

export type NphIconVariant = (typeof NPH_ICON_VARIANTS)[number];

/** Tamanho vem de token semantico. Nao existe valor livre. */
export const NPH_ICON_SIZES = ['sm', 'md', 'lg'] as const;

export type NphIconSize = (typeof NPH_ICON_SIZES)[number];

interface ArteDoIcone {
  readonly regular: IconDefinition;
  readonly solid?: IconDefinition;
}

/**
 * Combinacoes que existem. A ausencia de `solid` nao e lacuna a preencher:
 * e a regra do nucleo. NUNCA invente arte para completar a matriz.
 */
const ARTE: Readonly<Record<NphIconName, ArteDoIcone>> = {
  bars: { regular: faBars },
  'chevron-down': { regular: faChevronDown },
  'chevron-up': { regular: faChevronUp },
  'chevron-right': { regular: faChevronRight },
  'chevron-left': { regular: faChevronLeft },
  'arrow-left': { regular: faArrowLeft },
  'arrow-right': { regular: faArrowRight },
  eye: { regular: faEye },
  'eye-slash': { regular: faEyeSlash },
  ellipsis: { regular: faEllipsis },
  xmark: { regular: faXmark },
  check: { regular: faCheck },
  plus: { regular: faPlus },
  minus: { regular: faMinus },
  'magnifying-glass': { regular: faMagnifyingGlass },
  'ellipsis-vertical': { regular: faEllipsisVertical },
  'arrow-up-arrow-down': { regular: faArrowUpArrowDown },
  'grip-vertical': { regular: faGripVertical },
  'pen-to-square': { regular: faPenToSquare },
  'trash-can': { regular: faTrashCan },
  'arrow-up-from-bracket': { regular: faArrowUpFromBracket },
  download: { regular: faDownload },
  gear: { regular: faGear },
  filter: { regular: faFilter },
  'filter-slash': { regular: faFilterSlash },
  'circle-info': { regular: faCircleInfo },
  'triangle-exclamation': { regular: faTriangleExclamation },
  'circle-xmark': { regular: faCircleXmark },
  'circle-check': { regular: faCircleCheck },
  'circle-question': { regular: faCircleQuestion },
  star: { regular: faStar, solid: faStarSolid },
  'circle-notch': { regular: faCircleNotch },
  'calendar-days': { regular: faCalendarDays },
  user: { regular: faUser },
};

const NOMES = new Set<string>(NPH_ICON_NAMES);
const VARIANTES = new Set<string>(NPH_ICON_VARIANTS);
const TAMANHOS = new Set<string>(NPH_ICON_SIZES);

export function ehNomeDoNucleo(valor: string): valor is NphIconName {
  return NOMES.has(valor);
}

export function ehVariante(valor: string): valor is NphIconVariant {
  return VARIANTES.has(valor);
}

export function ehTamanho(valor: string): valor is NphIconSize {
  return TAMANHOS.has(valor);
}

/**
 * Devolve a arte da combinacao, ou `undefined` quando ela nao existe —
 * o caso de `solid` em qualquer nome que nao seja `star`.
 */
export function buscarArte(
  name: NphIconName,
  variant: NphIconVariant,
): IconDefinition | undefined {
  const arte = ARTE[name];
  return variant === 'solid' ? arte.solid : arte.regular;
}
