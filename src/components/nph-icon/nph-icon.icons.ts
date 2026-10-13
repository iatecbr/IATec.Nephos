/**
 * Closed map of the Nephos core icons.
 *
 * Domain source: `design.md`, block `icones_nucleo` — distinct names in
 * five categories, all with the `light` and `solid` variants. Do not add a
 * name, family or variant here without a recorded decision: outside the list
 * is a gap, not an absence.
 *
 * The drawings come from Font Awesome Pro line 6, SVG packages `light` and
 * `solid`. Each artwork uses a deep import to keep icons that do not belong to
 * the core out of the bundle. No file of the asset collection is versioned.
 */
import type { IconDefinition } from '@fortawesome/pro-light-svg-icons';

import { faBars as lBars } from '@fortawesome/pro-light-svg-icons/faBars';
import { faBars as sBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import { faChevronDown as lChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronDown as sChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import { faChevronUp as lChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faChevronUp as sChevronUp } from '@fortawesome/pro-solid-svg-icons/faChevronUp';
import { faChevronRight as lChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { faChevronRight as sChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import { faChevronLeft as lChevronLeft } from '@fortawesome/pro-light-svg-icons/faChevronLeft';
import { faChevronLeft as sChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faArrowLeft as lArrowLeft } from '@fortawesome/pro-light-svg-icons/faArrowLeft';
import { faArrowLeft as sArrowLeft } from '@fortawesome/pro-solid-svg-icons/faArrowLeft';
import { faArrowRight as lArrowRight } from '@fortawesome/pro-light-svg-icons/faArrowRight';
import { faArrowRight as sArrowRight } from '@fortawesome/pro-solid-svg-icons/faArrowRight';
import { faEye as lEye } from '@fortawesome/pro-light-svg-icons/faEye';
import { faEye as sEye } from '@fortawesome/pro-solid-svg-icons/faEye';
import { faEyeSlash as lEyeSlash } from '@fortawesome/pro-light-svg-icons/faEyeSlash';
import { faEyeSlash as sEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import { faEllipsis as lEllipsis } from '@fortawesome/pro-light-svg-icons/faEllipsis';
import { faEllipsis as sEllipsis } from '@fortawesome/pro-solid-svg-icons/faEllipsis';
import { faXmark as lXmark } from '@fortawesome/pro-light-svg-icons/faXmark';
import { faXmark as sXmark } from '@fortawesome/pro-solid-svg-icons/faXmark';
import { faCheck as lCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faCheck as sCheck } from '@fortawesome/pro-solid-svg-icons/faCheck';
import { faPlus as lPlus } from '@fortawesome/pro-light-svg-icons/faPlus';
import { faPlus as sPlus } from '@fortawesome/pro-solid-svg-icons/faPlus';
import { faMinus as lMinus } from '@fortawesome/pro-light-svg-icons/faMinus';
import { faMinus as sMinus } from '@fortawesome/pro-solid-svg-icons/faMinus';
import { faMagnifyingGlass as lMagnifyingGlass } from '@fortawesome/pro-light-svg-icons/faMagnifyingGlass';
import { faMagnifyingGlass as sMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons/faMagnifyingGlass';
import { faEllipsisVertical as lEllipsisVertical } from '@fortawesome/pro-light-svg-icons/faEllipsisVertical';
import { faEllipsisVertical as sEllipsisVertical } from '@fortawesome/pro-solid-svg-icons/faEllipsisVertical';
import { faArrowUpArrowDown as lArrowUpArrowDown } from '@fortawesome/pro-light-svg-icons/faArrowUpArrowDown';
import { faArrowUpArrowDown as sArrowUpArrowDown } from '@fortawesome/pro-solid-svg-icons/faArrowUpArrowDown';
import { faGripVertical as lGripVertical } from '@fortawesome/pro-light-svg-icons/faGripVertical';
import { faGripVertical as sGripVertical } from '@fortawesome/pro-solid-svg-icons/faGripVertical';
import { faPenToSquare as lPenToSquare } from '@fortawesome/pro-light-svg-icons/faPenToSquare';
import { faPenToSquare as sPenToSquare } from '@fortawesome/pro-solid-svg-icons/faPenToSquare';
import { faTrashCan as lTrashCan } from '@fortawesome/pro-light-svg-icons/faTrashCan';
import { faTrashCan as sTrashCan } from '@fortawesome/pro-solid-svg-icons/faTrashCan';
import { faArrowUpFromBracket as lArrowUpFromBracket } from '@fortawesome/pro-light-svg-icons/faArrowUpFromBracket';
import { faArrowUpFromBracket as sArrowUpFromBracket } from '@fortawesome/pro-solid-svg-icons/faArrowUpFromBracket';
import { faDownload as lDownload } from '@fortawesome/pro-light-svg-icons/faDownload';
import { faDownload as sDownload } from '@fortawesome/pro-solid-svg-icons/faDownload';
import { faGear as lGear } from '@fortawesome/pro-light-svg-icons/faGear';
import { faGear as sGear } from '@fortawesome/pro-solid-svg-icons/faGear';
import { faFilter as lFilter } from '@fortawesome/pro-light-svg-icons/faFilter';
import { faFilter as sFilter } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { faFilterSlash as lFilterSlash } from '@fortawesome/pro-light-svg-icons/faFilterSlash';
import { faFilterSlash as sFilterSlash } from '@fortawesome/pro-solid-svg-icons/faFilterSlash';
import { faCircleInfo as lCircleInfo } from '@fortawesome/pro-light-svg-icons/faCircleInfo';
import { faCircleInfo as sCircleInfo } from '@fortawesome/pro-solid-svg-icons/faCircleInfo';
import { faTriangleExclamation as lTriangleExclamation } from '@fortawesome/pro-light-svg-icons/faTriangleExclamation';
import { faTriangleExclamation as sTriangleExclamation } from '@fortawesome/pro-solid-svg-icons/faTriangleExclamation';
import { faCircleXmark as lCircleXmark } from '@fortawesome/pro-light-svg-icons/faCircleXmark';
import { faCircleXmark as sCircleXmark } from '@fortawesome/pro-solid-svg-icons/faCircleXmark';
import { faCircleCheck as lCircleCheck } from '@fortawesome/pro-light-svg-icons/faCircleCheck';
import { faCircleCheck as sCircleCheck } from '@fortawesome/pro-solid-svg-icons/faCircleCheck';
import { faCircleQuestion as lCircleQuestion } from '@fortawesome/pro-light-svg-icons/faCircleQuestion';
import { faCircleQuestion as sCircleQuestion } from '@fortawesome/pro-solid-svg-icons/faCircleQuestion';
import { faStar as lStar } from '@fortawesome/pro-light-svg-icons/faStar';
import { faStar as sStar } from '@fortawesome/pro-solid-svg-icons/faStar';
import { faCircleNotch as lCircleNotch } from '@fortawesome/pro-light-svg-icons/faCircleNotch';
import { faCircleNotch as sCircleNotch } from '@fortawesome/pro-solid-svg-icons/faCircleNotch';
import { faCalendarDays as lCalendarDays } from '@fortawesome/pro-light-svg-icons/faCalendarDays';
import { faCalendarDays as sCalendarDays } from '@fortawesome/pro-solid-svg-icons/faCalendarDays';
import { faUser as lUser } from '@fortawesome/pro-light-svg-icons/faUser';
import { faUser as sUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faHouse as lHouse } from '@fortawesome/pro-light-svg-icons/faHouse';
import { faHouse as sHouse } from '@fortawesome/pro-solid-svg-icons/faHouse';
import { faAngleLeft as lAngleLeft } from '@fortawesome/pro-light-svg-icons/faAngleLeft';
import { faAngleLeft as sAngleLeft } from '@fortawesome/pro-solid-svg-icons/faAngleLeft';
import { faArrowDownToLine as lArrowDownToLine } from '@fortawesome/pro-light-svg-icons/faArrowDownToLine';
import { faArrowDownToLine as sArrowDownToLine } from '@fortawesome/pro-solid-svg-icons/faArrowDownToLine';
import { faArrowUp as lArrowUp } from '@fortawesome/pro-light-svg-icons/faArrowUp';
import { faArrowUp as sArrowUp } from '@fortawesome/pro-solid-svg-icons/faArrowUp';
import { faCaretUp as lCaretUp } from '@fortawesome/pro-light-svg-icons/faCaretUp';
import { faCaretUp as sCaretUp } from '@fortawesome/pro-solid-svg-icons/faCaretUp';
import { faChevronsDown as lChevronsDown } from '@fortawesome/pro-light-svg-icons/faChevronsDown';
import { faChevronsDown as sChevronsDown } from '@fortawesome/pro-solid-svg-icons/faChevronsDown';
import { faChevronsLeft as lChevronsLeft } from '@fortawesome/pro-light-svg-icons/faChevronsLeft';
import { faChevronsLeft as sChevronsLeft } from '@fortawesome/pro-solid-svg-icons/faChevronsLeft';
import { faCircleChevronDown as lCircleChevronDown } from '@fortawesome/pro-light-svg-icons/faCircleChevronDown';
import { faCircleChevronDown as sCircleChevronDown } from '@fortawesome/pro-solid-svg-icons/faCircleChevronDown';
import { faCircleChevronLeft as lCircleChevronLeft } from '@fortawesome/pro-light-svg-icons/faCircleChevronLeft';
import { faCircleChevronLeft as sCircleChevronLeft } from '@fortawesome/pro-solid-svg-icons/faCircleChevronLeft';
import { faCircleDown as lCircleDown } from '@fortawesome/pro-light-svg-icons/faCircleDown';
import { faCircleDown as sCircleDown } from '@fortawesome/pro-solid-svg-icons/faCircleDown';
import { faCircleUp as lCircleUp } from '@fortawesome/pro-light-svg-icons/faCircleUp';
import { faCircleUp as sCircleUp } from '@fortawesome/pro-solid-svg-icons/faCircleUp';
import { faSquareChevronLeft as lSquareChevronLeft } from '@fortawesome/pro-light-svg-icons/faSquareChevronLeft';
import { faSquareChevronLeft as sSquareChevronLeft } from '@fortawesome/pro-solid-svg-icons/faSquareChevronLeft';
import { faAnglesLeft as lTripleChevronsLeft } from '@fortawesome/pro-light-svg-icons/faAnglesLeft';
import { faAnglesLeft as sTripleChevronsLeft } from '@fortawesome/pro-solid-svg-icons/faAnglesLeft';
import { faArrowDownArrowUp as lArrowDownArrowUp } from '@fortawesome/pro-light-svg-icons/faArrowDownArrowUp';
import { faArrowDownArrowUp as sArrowDownArrowUp } from '@fortawesome/pro-solid-svg-icons/faArrowDownArrowUp';
import { faCircleHalfStroke as lCircleHalfStroke } from '@fortawesome/pro-light-svg-icons/faCircleHalfStroke';
import { faCircleHalfStroke as sCircleHalfStroke } from '@fortawesome/pro-solid-svg-icons/faCircleHalfStroke';
import { faCloudArrowUp as lCloudArrowUp } from '@fortawesome/pro-light-svg-icons/faCloudArrowUp';
import { faCloudArrowUp as sCloudArrowUp } from '@fortawesome/pro-solid-svg-icons/faCloudArrowUp';
import { faGrid2 as lGrid2 } from '@fortawesome/pro-light-svg-icons/faGrid2';
import { faGrid2 as sGrid2 } from '@fortawesome/pro-solid-svg-icons/faGrid2';
import { faLink as lLink } from '@fortawesome/pro-light-svg-icons/faLink';
import { faLink as sLink } from '@fortawesome/pro-solid-svg-icons/faLink';
import { faList as lList } from '@fortawesome/pro-light-svg-icons/faList';
import { faList as sList } from '@fortawesome/pro-solid-svg-icons/faList';
import { faPaperPlane as lPaperPlane } from '@fortawesome/pro-light-svg-icons/faPaperPlane';
import { faPaperPlane as sPaperPlane } from '@fortawesome/pro-solid-svg-icons/faPaperPlane';
import { faPaperclip as lPaperclip } from '@fortawesome/pro-light-svg-icons/faPaperclip';
import { faPaperclip as sPaperclip } from '@fortawesome/pro-solid-svg-icons/faPaperclip';
import { faPen as lPen } from '@fortawesome/pro-light-svg-icons/faPen';
import { faPen as sPen } from '@fortawesome/pro-solid-svg-icons/faPen';
import { faPrint as lPrint } from '@fortawesome/pro-light-svg-icons/faPrint';
import { faPrint as sPrint } from '@fortawesome/pro-solid-svg-icons/faPrint';
import { faRightToBracket as lRightToBracket } from '@fortawesome/pro-light-svg-icons/faRightToBracket';
import { faRightToBracket as sRightToBracket } from '@fortawesome/pro-solid-svg-icons/faRightToBracket';
import { faRotateRight as lRotateRight } from '@fortawesome/pro-light-svg-icons/faRotateRight';
import { faRotateRight as sRotateRight } from '@fortawesome/pro-solid-svg-icons/faRotateRight';
import { faShare as lShare } from '@fortawesome/pro-light-svg-icons/faShare';
import { faShare as sShare } from '@fortawesome/pro-solid-svg-icons/faShare';
import { faShareFromSquare as lShareFromSquare } from '@fortawesome/pro-light-svg-icons/faShareFromSquare';
import { faShareFromSquare as sShareFromSquare } from '@fortawesome/pro-solid-svg-icons/faShareFromSquare';
import { faThumbsDown as lThumbsDown } from '@fortawesome/pro-light-svg-icons/faThumbsDown';
import { faThumbsDown as sThumbsDown } from '@fortawesome/pro-solid-svg-icons/faThumbsDown';
import { faThumbsUp as lThumbsUp } from '@fortawesome/pro-light-svg-icons/faThumbsUp';
import { faThumbsUp as sThumbsUp } from '@fortawesome/pro-solid-svg-icons/faThumbsUp';
import { faThumbtack as lThumbtack } from '@fortawesome/pro-light-svg-icons/faThumbtack';
import { faThumbtack as sThumbtack } from '@fortawesome/pro-solid-svg-icons/faThumbtack';
import { faThumbtackSlash as lThumbtackSlash } from '@fortawesome/pro-light-svg-icons/faThumbtackSlash';
import { faThumbtackSlash as sThumbtackSlash } from '@fortawesome/pro-solid-svg-icons/faThumbtackSlash';
import { faTrash as lTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import { faTrash as sTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { faPersonCircleMinus as lUserCircleMinus } from '@fortawesome/pro-light-svg-icons/faPersonCircleMinus';
import { faPersonCircleMinus as sUserCircleMinus } from '@fortawesome/pro-solid-svg-icons/faPersonCircleMinus';
import { faPersonCirclePlus as lUserCirclePlus } from '@fortawesome/pro-light-svg-icons/faPersonCirclePlus';
import { faPersonCirclePlus as sUserCirclePlus } from '@fortawesome/pro-solid-svg-icons/faPersonCirclePlus';
import { faUserMinus as lUserMinus } from '@fortawesome/pro-light-svg-icons/faUserMinus';
import { faUserMinus as sUserMinus } from '@fortawesome/pro-solid-svg-icons/faUserMinus';
import { faAlarmClock as lAlarmClock } from '@fortawesome/pro-light-svg-icons/faAlarmClock';
import { faAlarmClock as sAlarmClock } from '@fortawesome/pro-solid-svg-icons/faAlarmClock';
import { faBadgeCheck as lBadgeCheck } from '@fortawesome/pro-light-svg-icons/faBadgeCheck';
import { faBadgeCheck as sBadgeCheck } from '@fortawesome/pro-solid-svg-icons/faBadgeCheck';
import { faBell as lBell } from '@fortawesome/pro-light-svg-icons/faBell';
import { faBell as sBell } from '@fortawesome/pro-solid-svg-icons/faBell';
import { faHeart as lHeart } from '@fortawesome/pro-light-svg-icons/faHeart';
import { faHeart as sHeart } from '@fortawesome/pro-solid-svg-icons/faHeart';
import { faLock as lLock } from '@fortawesome/pro-light-svg-icons/faLock';
import { faLock as sLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faQuestion as lQuestion } from '@fortawesome/pro-light-svg-icons/faQuestion';
import { faQuestion as sQuestion } from '@fortawesome/pro-solid-svg-icons/faQuestion';
import { faCalendar as lCalendar } from '@fortawesome/pro-light-svg-icons/faCalendar';
import { faCalendar as sCalendar } from '@fortawesome/pro-solid-svg-icons/faCalendar';
import { faCircleUser as lCircleUser } from '@fortawesome/pro-light-svg-icons/faCircleUser';
import { faCircleUser as sCircleUser } from '@fortawesome/pro-solid-svg-icons/faCircleUser';
import { faClipboard as lClipboard } from '@fortawesome/pro-light-svg-icons/faClipboard';
import { faClipboard as sClipboard } from '@fortawesome/pro-solid-svg-icons/faClipboard';
import { faClock as lClock } from '@fortawesome/pro-light-svg-icons/faClock';
import { faClock as sClock } from '@fortawesome/pro-solid-svg-icons/faClock';
import { faComment as lComment } from '@fortawesome/pro-light-svg-icons/faComment';
import { faComment as sComment } from '@fortawesome/pro-solid-svg-icons/faComment';
import { faEnvelope as lEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';
import { faEnvelope as sEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faFile as lFile } from '@fortawesome/pro-light-svg-icons/faFile';
import { faFile as sFile } from '@fortawesome/pro-solid-svg-icons/faFile';
import { faFiles as lFiles } from '@fortawesome/pro-light-svg-icons/faFiles';
import { faFiles as sFiles } from '@fortawesome/pro-solid-svg-icons/faFiles';
import { faFolder as lFolder } from '@fortawesome/pro-light-svg-icons/faFolder';
import { faFolder as sFolder } from '@fortawesome/pro-solid-svg-icons/faFolder';
import { faFolderOpen as lFolderOpen } from '@fortawesome/pro-light-svg-icons/faFolderOpen';
import { faFolderOpen as sFolderOpen } from '@fortawesome/pro-solid-svg-icons/faFolderOpen';
import { faFontAwesome as lFontAwesome } from '@fortawesome/pro-light-svg-icons/faFontAwesome';
import { faFontAwesome as sFontAwesome } from '@fortawesome/pro-solid-svg-icons/faFontAwesome';
import { faGlobe as lGlobe } from '@fortawesome/pro-light-svg-icons/faGlobe';
import { faGlobe as sGlobe } from '@fortawesome/pro-solid-svg-icons/faGlobe';
import { faInbox as lInbox } from '@fortawesome/pro-light-svg-icons/faInbox';
import { faInbox as sInbox } from '@fortawesome/pro-solid-svg-icons/faInbox';
import { faKey as lKey } from '@fortawesome/pro-light-svg-icons/faKey';
import { faKey as sKey } from '@fortawesome/pro-solid-svg-icons/faKey';
import { faLocationDot as lLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot';
import { faLocationDot as sLocationDot } from '@fortawesome/pro-solid-svg-icons/faLocationDot';
import { faSuitcase as lSuitcase } from '@fortawesome/pro-light-svg-icons/faSuitcase';
import { faSuitcase as sSuitcase } from '@fortawesome/pro-solid-svg-icons/faSuitcase';
import { faTag as lTag } from '@fortawesome/pro-light-svg-icons/faTag';
import { faTag as sTag } from '@fortawesome/pro-solid-svg-icons/faTag';
import { faTrophy as lTrophy } from '@fortawesome/pro-light-svg-icons/faTrophy';
import { faTrophy as sTrophy } from '@fortawesome/pro-solid-svg-icons/faTrophy';

/**
 * The core names (`design.md`, block `icones_nucleo`).
 * The array order is not contract; lookup is by key.
 */
export const NPH_ICON_NAMES = [
  'bars',
  'chevron-down',
  'chevron-up',
  'chevron-right',
  'chevron-left',
  'arrow-left',
  'arrow-right',
  'eye',
  'eye-slash',
  'ellipsis',
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
  'circle-info',
  'triangle-exclamation',
  'circle-xmark',
  'circle-check',
  'circle-question',
  'star',
  'circle-notch',
  'calendar-days',
  'user',
  'house',
  'angle-left',
  'arrow-down-to-line',
  'arrow-up',
  'caret-up',
  'chevrons-down',
  'chevrons-left',
  'circle-chevron-down',
  'circle-chevron-left',
  'circle-down',
  'circle-up',
  'square-chevron-left',
  'triple-chevrons-left',
  'arrow-down-arrow-up',
  'circle-half-stroke',
  'cloud-arrow-up',
  'grid-2',
  'link',
  'list',
  'paper-plane',
  'paperclip',
  'pen',
  'print',
  'right-to-bracket',
  'rotate-right',
  'share',
  'share-from-square',
  'thumbs-down',
  'thumbs-up',
  'thumbtack',
  'thumbtack-slash',
  'trash',
  'user-circle-minus',
  'user-circle-plus',
  'user-minus',
  'alarm-clock',
  'badge-check',
  'bell',
  'heart',
  'lock',
  'question',
  'calendar',
  'circle-user',
  'clipboard',
  'clock',
  'comment',
  'envelope',
  'file',
  'files',
  'folder',
  'folder-open',
  'font-awesome',
  'globe',
  'inbox',
  'key',
  'location-dot',
  'suitcase',
  'tag',
  'trophy',
] as const;

export type NphIconName = (typeof NPH_ICON_NAMES)[number];

/** `light` is the default; `solid` exists for every core name. */
export const NPH_ICON_VARIANTS = ['light', 'solid'] as const;

export type NphIconVariant = (typeof NPH_ICON_VARIANTS)[number];

/** Size comes from a semantic token. There is no free value. */
export const NPH_ICON_SIZES = ['sm', 'md', 'lg'] as const;

export type NphIconSize = (typeof NPH_ICON_SIZES)[number];

type IconGlyph = Readonly<Record<NphIconVariant, IconDefinition>>;

function glyph(light: IconDefinition, solid: IconDefinition): IconGlyph {
  return { light, solid };
}

/**
 * Closed matrix: each approved name explicitly declares its `light` and
 * `solid` artwork. The `satisfies` prevents names outside the core and
 * incomplete combinations at compile time.
 */
const GLYPHS = {
  bars: glyph(lBars, sBars),
  'chevron-down': glyph(lChevronDown, sChevronDown),
  'chevron-up': glyph(lChevronUp, sChevronUp),
  'chevron-right': glyph(lChevronRight, sChevronRight),
  'chevron-left': glyph(lChevronLeft, sChevronLeft),
  'arrow-left': glyph(lArrowLeft, sArrowLeft),
  'arrow-right': glyph(lArrowRight, sArrowRight),
  eye: glyph(lEye, sEye),
  'eye-slash': glyph(lEyeSlash, sEyeSlash),
  ellipsis: glyph(lEllipsis, sEllipsis),
  xmark: glyph(lXmark, sXmark),
  check: glyph(lCheck, sCheck),
  plus: glyph(lPlus, sPlus),
  minus: glyph(lMinus, sMinus),
  'magnifying-glass': glyph(lMagnifyingGlass, sMagnifyingGlass),
  'ellipsis-vertical': glyph(lEllipsisVertical, sEllipsisVertical),
  'arrow-up-arrow-down': glyph(lArrowUpArrowDown, sArrowUpArrowDown),
  'grip-vertical': glyph(lGripVertical, sGripVertical),
  'pen-to-square': glyph(lPenToSquare, sPenToSquare),
  'trash-can': glyph(lTrashCan, sTrashCan),
  'arrow-up-from-bracket': glyph(lArrowUpFromBracket, sArrowUpFromBracket),
  download: glyph(lDownload, sDownload),
  gear: glyph(lGear, sGear),
  filter: glyph(lFilter, sFilter),
  'filter-slash': glyph(lFilterSlash, sFilterSlash),
  'circle-info': glyph(lCircleInfo, sCircleInfo),
  'triangle-exclamation': glyph(lTriangleExclamation, sTriangleExclamation),
  'circle-xmark': glyph(lCircleXmark, sCircleXmark),
  'circle-check': glyph(lCircleCheck, sCircleCheck),
  'circle-question': glyph(lCircleQuestion, sCircleQuestion),
  star: glyph(lStar, sStar),
  'circle-notch': glyph(lCircleNotch, sCircleNotch),
  'calendar-days': glyph(lCalendarDays, sCalendarDays),
  user: glyph(lUser, sUser),
  house: glyph(lHouse, sHouse),
  'angle-left': glyph(lAngleLeft, sAngleLeft),
  'arrow-down-to-line': glyph(lArrowDownToLine, sArrowDownToLine),
  'arrow-up': glyph(lArrowUp, sArrowUp),
  'caret-up': glyph(lCaretUp, sCaretUp),
  'chevrons-down': glyph(lChevronsDown, sChevronsDown),
  'chevrons-left': glyph(lChevronsLeft, sChevronsLeft),
  'circle-chevron-down': glyph(lCircleChevronDown, sCircleChevronDown),
  'circle-chevron-left': glyph(lCircleChevronLeft, sCircleChevronLeft),
  'circle-down': glyph(lCircleDown, sCircleDown),
  'circle-up': glyph(lCircleUp, sCircleUp),
  'square-chevron-left': glyph(lSquareChevronLeft, sSquareChevronLeft),
  'triple-chevrons-left': glyph(lTripleChevronsLeft, sTripleChevronsLeft),
  'arrow-down-arrow-up': glyph(lArrowDownArrowUp, sArrowDownArrowUp),
  'circle-half-stroke': glyph(lCircleHalfStroke, sCircleHalfStroke),
  'cloud-arrow-up': glyph(lCloudArrowUp, sCloudArrowUp),
  'grid-2': glyph(lGrid2, sGrid2),
  link: glyph(lLink, sLink),
  list: glyph(lList, sList),
  'paper-plane': glyph(lPaperPlane, sPaperPlane),
  paperclip: glyph(lPaperclip, sPaperclip),
  pen: glyph(lPen, sPen),
  print: glyph(lPrint, sPrint),
  'right-to-bracket': glyph(lRightToBracket, sRightToBracket),
  'rotate-right': glyph(lRotateRight, sRotateRight),
  share: glyph(lShare, sShare),
  'share-from-square': glyph(lShareFromSquare, sShareFromSquare),
  'thumbs-down': glyph(lThumbsDown, sThumbsDown),
  'thumbs-up': glyph(lThumbsUp, sThumbsUp),
  thumbtack: glyph(lThumbtack, sThumbtack),
  'thumbtack-slash': glyph(lThumbtackSlash, sThumbtackSlash),
  trash: glyph(lTrash, sTrash),
  'user-circle-minus': glyph(lUserCircleMinus, sUserCircleMinus),
  'user-circle-plus': glyph(lUserCirclePlus, sUserCirclePlus),
  'user-minus': glyph(lUserMinus, sUserMinus),
  'alarm-clock': glyph(lAlarmClock, sAlarmClock),
  'badge-check': glyph(lBadgeCheck, sBadgeCheck),
  bell: glyph(lBell, sBell),
  heart: glyph(lHeart, sHeart),
  lock: glyph(lLock, sLock),
  question: glyph(lQuestion, sQuestion),
  calendar: glyph(lCalendar, sCalendar),
  'circle-user': glyph(lCircleUser, sCircleUser),
  clipboard: glyph(lClipboard, sClipboard),
  clock: glyph(lClock, sClock),
  comment: glyph(lComment, sComment),
  envelope: glyph(lEnvelope, sEnvelope),
  file: glyph(lFile, sFile),
  files: glyph(lFiles, sFiles),
  folder: glyph(lFolder, sFolder),
  'folder-open': glyph(lFolderOpen, sFolderOpen),
  'font-awesome': glyph(lFontAwesome, sFontAwesome),
  globe: glyph(lGlobe, sGlobe),
  inbox: glyph(lInbox, sInbox),
  key: glyph(lKey, sKey),
  'location-dot': glyph(lLocationDot, sLocationDot),
  suitcase: glyph(lSuitcase, sSuitcase),
  tag: glyph(lTag, sTag),
  trophy: glyph(lTrophy, sTrophy),
} satisfies Readonly<Record<NphIconName, IconGlyph>>;

const NAMES = new Set<string>(NPH_ICON_NAMES);
const VARIANTS = new Set<string>(NPH_ICON_VARIANTS);
const SIZES = new Set<string>(NPH_ICON_SIZES);

export function isCoreName(value: string): value is NphIconName {
  return NAMES.has(value);
}

export function isVariant(value: string): value is NphIconVariant {
  return VARIANTS.has(value);
}

export function isSize(value: string): value is NphIconSize {
  return SIZES.has(value);
}

/** Returns the declared artwork for a valid core combination. */
export function findGlyph(name: NphIconName, variant: NphIconVariant): IconDefinition {
  return GLYPHS[name][variant];
}
