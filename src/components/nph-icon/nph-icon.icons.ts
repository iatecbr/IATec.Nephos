/**
 * Closed map of the Nephos core icons.
 *
 * Domain source: `design.md`, block `icones_nucleo` — distinct names in
 * five categories, all with the `regular` and `solid` variants. Do not add a
 * name, family or variant here without a recorded decision: outside the list
 * is a gap, not an absence.
 *
 * The drawings come from Font Awesome Pro line 6, SVG packages `regular` and
 * `solid`. Each artwork uses a deep import to keep icons that do not belong to
 * the core out of the bundle. No file of the asset collection is versioned.
 */
import type { IconDefinition } from '@fortawesome/pro-regular-svg-icons';

import { faBars as rBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import { faBars as sBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import { faChevronDown as rChevronDown } from '@fortawesome/pro-regular-svg-icons/faChevronDown';
import { faChevronDown as sChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import { faChevronUp as rChevronUp } from '@fortawesome/pro-regular-svg-icons/faChevronUp';
import { faChevronUp as sChevronUp } from '@fortawesome/pro-solid-svg-icons/faChevronUp';
import { faChevronRight as rChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faChevronRight as sChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import { faChevronLeft as rChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronLeft as sChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faArrowLeft as rArrowLeft } from '@fortawesome/pro-regular-svg-icons/faArrowLeft';
import { faArrowLeft as sArrowLeft } from '@fortawesome/pro-solid-svg-icons/faArrowLeft';
import { faArrowRight as rArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { faArrowRight as sArrowRight } from '@fortawesome/pro-solid-svg-icons/faArrowRight';
import { faEye as rEye } from '@fortawesome/pro-regular-svg-icons/faEye';
import { faEye as sEye } from '@fortawesome/pro-solid-svg-icons/faEye';
import { faEyeSlash as rEyeSlash } from '@fortawesome/pro-regular-svg-icons/faEyeSlash';
import { faEyeSlash as sEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import { faEllipsis as rEllipsis } from '@fortawesome/pro-regular-svg-icons/faEllipsis';
import { faEllipsis as sEllipsis } from '@fortawesome/pro-solid-svg-icons/faEllipsis';
import { faXmark as rXmark } from '@fortawesome/pro-regular-svg-icons/faXmark';
import { faXmark as sXmark } from '@fortawesome/pro-solid-svg-icons/faXmark';
import { faCheck as rCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { faCheck as sCheck } from '@fortawesome/pro-solid-svg-icons/faCheck';
import { faPlus as rPlus } from '@fortawesome/pro-regular-svg-icons/faPlus';
import { faPlus as sPlus } from '@fortawesome/pro-solid-svg-icons/faPlus';
import { faMinus as rMinus } from '@fortawesome/pro-regular-svg-icons/faMinus';
import { faMinus as sMinus } from '@fortawesome/pro-solid-svg-icons/faMinus';
import { faMagnifyingGlass as rMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
import { faMagnifyingGlass as sMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons/faMagnifyingGlass';
import { faEllipsisVertical as rEllipsisVertical } from '@fortawesome/pro-regular-svg-icons/faEllipsisVertical';
import { faEllipsisVertical as sEllipsisVertical } from '@fortawesome/pro-solid-svg-icons/faEllipsisVertical';
import { faArrowUpArrowDown as rArrowUpArrowDown } from '@fortawesome/pro-regular-svg-icons/faArrowUpArrowDown';
import { faArrowUpArrowDown as sArrowUpArrowDown } from '@fortawesome/pro-solid-svg-icons/faArrowUpArrowDown';
import { faGripVertical as rGripVertical } from '@fortawesome/pro-regular-svg-icons/faGripVertical';
import { faGripVertical as sGripVertical } from '@fortawesome/pro-solid-svg-icons/faGripVertical';
import { faPenToSquare as rPenToSquare } from '@fortawesome/pro-regular-svg-icons/faPenToSquare';
import { faPenToSquare as sPenToSquare } from '@fortawesome/pro-solid-svg-icons/faPenToSquare';
import { faTrashCan as rTrashCan } from '@fortawesome/pro-regular-svg-icons/faTrashCan';
import { faTrashCan as sTrashCan } from '@fortawesome/pro-solid-svg-icons/faTrashCan';
import { faArrowUpFromBracket as rArrowUpFromBracket } from '@fortawesome/pro-regular-svg-icons/faArrowUpFromBracket';
import { faArrowUpFromBracket as sArrowUpFromBracket } from '@fortawesome/pro-solid-svg-icons/faArrowUpFromBracket';
import { faDownload as rDownload } from '@fortawesome/pro-regular-svg-icons/faDownload';
import { faDownload as sDownload } from '@fortawesome/pro-solid-svg-icons/faDownload';
import { faGear as rGear } from '@fortawesome/pro-regular-svg-icons/faGear';
import { faGear as sGear } from '@fortawesome/pro-solid-svg-icons/faGear';
import { faFilter as rFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as sFilter } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { faFilterSlash as rFilterSlash } from '@fortawesome/pro-regular-svg-icons/faFilterSlash';
import { faFilterSlash as sFilterSlash } from '@fortawesome/pro-solid-svg-icons/faFilterSlash';
import { faCircleInfo as rCircleInfo } from '@fortawesome/pro-regular-svg-icons/faCircleInfo';
import { faCircleInfo as sCircleInfo } from '@fortawesome/pro-solid-svg-icons/faCircleInfo';
import { faTriangleExclamation as rTriangleExclamation } from '@fortawesome/pro-regular-svg-icons/faTriangleExclamation';
import { faTriangleExclamation as sTriangleExclamation } from '@fortawesome/pro-solid-svg-icons/faTriangleExclamation';
import { faCircleXmark as rCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { faCircleXmark as sCircleXmark } from '@fortawesome/pro-solid-svg-icons/faCircleXmark';
import { faCircleCheck as rCircleCheck } from '@fortawesome/pro-regular-svg-icons/faCircleCheck';
import { faCircleCheck as sCircleCheck } from '@fortawesome/pro-solid-svg-icons/faCircleCheck';
import { faCircleQuestion as rCircleQuestion } from '@fortawesome/pro-regular-svg-icons/faCircleQuestion';
import { faCircleQuestion as sCircleQuestion } from '@fortawesome/pro-solid-svg-icons/faCircleQuestion';
import { faStar as rStar } from '@fortawesome/pro-regular-svg-icons/faStar';
import { faStar as sStar } from '@fortawesome/pro-solid-svg-icons/faStar';
import { faCircleNotch as rCircleNotch } from '@fortawesome/pro-regular-svg-icons/faCircleNotch';
import { faCircleNotch as sCircleNotch } from '@fortawesome/pro-solid-svg-icons/faCircleNotch';
import { faCalendarDays as rCalendarDays } from '@fortawesome/pro-regular-svg-icons/faCalendarDays';
import { faCalendarDays as sCalendarDays } from '@fortawesome/pro-solid-svg-icons/faCalendarDays';
import { faUser as rUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { faUser as sUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faHouse as rHouse } from '@fortawesome/pro-regular-svg-icons/faHouse';
import { faHouse as sHouse } from '@fortawesome/pro-solid-svg-icons/faHouse';
import { faAngleLeft as rAngleLeft } from '@fortawesome/pro-regular-svg-icons/faAngleLeft';
import { faAngleLeft as sAngleLeft } from '@fortawesome/pro-solid-svg-icons/faAngleLeft';
import { faArrowDownToLine as rArrowDownToLine } from '@fortawesome/pro-regular-svg-icons/faArrowDownToLine';
import { faArrowDownToLine as sArrowDownToLine } from '@fortawesome/pro-solid-svg-icons/faArrowDownToLine';
import { faArrowUp as rArrowUp } from '@fortawesome/pro-regular-svg-icons/faArrowUp';
import { faArrowUp as sArrowUp } from '@fortawesome/pro-solid-svg-icons/faArrowUp';
import { faCaretUp as rCaretUp } from '@fortawesome/pro-regular-svg-icons/faCaretUp';
import { faCaretUp as sCaretUp } from '@fortawesome/pro-solid-svg-icons/faCaretUp';
import { faChevronsDown as rChevronsDown } from '@fortawesome/pro-regular-svg-icons/faChevronsDown';
import { faChevronsDown as sChevronsDown } from '@fortawesome/pro-solid-svg-icons/faChevronsDown';
import { faChevronsLeft as rChevronsLeft } from '@fortawesome/pro-regular-svg-icons/faChevronsLeft';
import { faChevronsLeft as sChevronsLeft } from '@fortawesome/pro-solid-svg-icons/faChevronsLeft';
import { faCircleChevronDown as rCircleChevronDown } from '@fortawesome/pro-regular-svg-icons/faCircleChevronDown';
import { faCircleChevronDown as sCircleChevronDown } from '@fortawesome/pro-solid-svg-icons/faCircleChevronDown';
import { faCircleChevronLeft as rCircleChevronLeft } from '@fortawesome/pro-regular-svg-icons/faCircleChevronLeft';
import { faCircleChevronLeft as sCircleChevronLeft } from '@fortawesome/pro-solid-svg-icons/faCircleChevronLeft';
import { faCircleDown as rCircleDown } from '@fortawesome/pro-regular-svg-icons/faCircleDown';
import { faCircleDown as sCircleDown } from '@fortawesome/pro-solid-svg-icons/faCircleDown';
import { faCircleUp as rCircleUp } from '@fortawesome/pro-regular-svg-icons/faCircleUp';
import { faCircleUp as sCircleUp } from '@fortawesome/pro-solid-svg-icons/faCircleUp';
import { faSquareChevronLeft as rSquareChevronLeft } from '@fortawesome/pro-regular-svg-icons/faSquareChevronLeft';
import { faSquareChevronLeft as sSquareChevronLeft } from '@fortawesome/pro-solid-svg-icons/faSquareChevronLeft';
import { faAnglesLeft as rTripleChevronsLeft } from '@fortawesome/pro-regular-svg-icons/faAnglesLeft';
import { faAnglesLeft as sTripleChevronsLeft } from '@fortawesome/pro-solid-svg-icons/faAnglesLeft';
import { faArrowDownArrowUp as rArrowDownArrowUp } from '@fortawesome/pro-regular-svg-icons/faArrowDownArrowUp';
import { faArrowDownArrowUp as sArrowDownArrowUp } from '@fortawesome/pro-solid-svg-icons/faArrowDownArrowUp';
import { faCircleHalfStroke as rCircleHalfStroke } from '@fortawesome/pro-regular-svg-icons/faCircleHalfStroke';
import { faCircleHalfStroke as sCircleHalfStroke } from '@fortawesome/pro-solid-svg-icons/faCircleHalfStroke';
import { faCloudArrowUp as rCloudArrowUp } from '@fortawesome/pro-regular-svg-icons/faCloudArrowUp';
import { faCloudArrowUp as sCloudArrowUp } from '@fortawesome/pro-solid-svg-icons/faCloudArrowUp';
import { faGrid2 as rGrid2 } from '@fortawesome/pro-regular-svg-icons/faGrid2';
import { faGrid2 as sGrid2 } from '@fortawesome/pro-solid-svg-icons/faGrid2';
import { faLink as rLink } from '@fortawesome/pro-regular-svg-icons/faLink';
import { faLink as sLink } from '@fortawesome/pro-solid-svg-icons/faLink';
import { faList as rList } from '@fortawesome/pro-regular-svg-icons/faList';
import { faList as sList } from '@fortawesome/pro-solid-svg-icons/faList';
import { faPaperPlane as rPaperPlane } from '@fortawesome/pro-regular-svg-icons/faPaperPlane';
import { faPaperPlane as sPaperPlane } from '@fortawesome/pro-solid-svg-icons/faPaperPlane';
import { faPaperclip as rPaperclip } from '@fortawesome/pro-regular-svg-icons/faPaperclip';
import { faPaperclip as sPaperclip } from '@fortawesome/pro-solid-svg-icons/faPaperclip';
import { faPen as rPen } from '@fortawesome/pro-regular-svg-icons/faPen';
import { faPen as sPen } from '@fortawesome/pro-solid-svg-icons/faPen';
import { faPrint as rPrint } from '@fortawesome/pro-regular-svg-icons/faPrint';
import { faPrint as sPrint } from '@fortawesome/pro-solid-svg-icons/faPrint';
import { faRightToBracket as rRightToBracket } from '@fortawesome/pro-regular-svg-icons/faRightToBracket';
import { faRightToBracket as sRightToBracket } from '@fortawesome/pro-solid-svg-icons/faRightToBracket';
import { faRotateRight as rRotateRight } from '@fortawesome/pro-regular-svg-icons/faRotateRight';
import { faRotateRight as sRotateRight } from '@fortawesome/pro-solid-svg-icons/faRotateRight';
import { faShare as rShare } from '@fortawesome/pro-regular-svg-icons/faShare';
import { faShare as sShare } from '@fortawesome/pro-solid-svg-icons/faShare';
import { faShareFromSquare as rShareFromSquare } from '@fortawesome/pro-regular-svg-icons/faShareFromSquare';
import { faShareFromSquare as sShareFromSquare } from '@fortawesome/pro-solid-svg-icons/faShareFromSquare';
import { faThumbsDown as rThumbsDown } from '@fortawesome/pro-regular-svg-icons/faThumbsDown';
import { faThumbsDown as sThumbsDown } from '@fortawesome/pro-solid-svg-icons/faThumbsDown';
import { faThumbsUp as rThumbsUp } from '@fortawesome/pro-regular-svg-icons/faThumbsUp';
import { faThumbsUp as sThumbsUp } from '@fortawesome/pro-solid-svg-icons/faThumbsUp';
import { faThumbtack as rThumbtack } from '@fortawesome/pro-regular-svg-icons/faThumbtack';
import { faThumbtack as sThumbtack } from '@fortawesome/pro-solid-svg-icons/faThumbtack';
import { faThumbtackSlash as rThumbtackSlash } from '@fortawesome/pro-regular-svg-icons/faThumbtackSlash';
import { faThumbtackSlash as sThumbtackSlash } from '@fortawesome/pro-solid-svg-icons/faThumbtackSlash';
import { faTrash as rTrash } from '@fortawesome/pro-regular-svg-icons/faTrash';
import { faTrash as sTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { faPersonCircleMinus as rUserCircleMinus } from '@fortawesome/pro-regular-svg-icons/faPersonCircleMinus';
import { faPersonCircleMinus as sUserCircleMinus } from '@fortawesome/pro-solid-svg-icons/faPersonCircleMinus';
import { faPersonCirclePlus as rUserCirclePlus } from '@fortawesome/pro-regular-svg-icons/faPersonCirclePlus';
import { faPersonCirclePlus as sUserCirclePlus } from '@fortawesome/pro-solid-svg-icons/faPersonCirclePlus';
import { faUserMinus as rUserMinus } from '@fortawesome/pro-regular-svg-icons/faUserMinus';
import { faUserMinus as sUserMinus } from '@fortawesome/pro-solid-svg-icons/faUserMinus';
import { faAlarmClock as rAlarmClock } from '@fortawesome/pro-regular-svg-icons/faAlarmClock';
import { faAlarmClock as sAlarmClock } from '@fortawesome/pro-solid-svg-icons/faAlarmClock';
import { faBadgeCheck as rBadgeCheck } from '@fortawesome/pro-regular-svg-icons/faBadgeCheck';
import { faBadgeCheck as sBadgeCheck } from '@fortawesome/pro-solid-svg-icons/faBadgeCheck';
import { faBell as rBell } from '@fortawesome/pro-regular-svg-icons/faBell';
import { faBell as sBell } from '@fortawesome/pro-solid-svg-icons/faBell';
import { faHeart as rHeart } from '@fortawesome/pro-regular-svg-icons/faHeart';
import { faHeart as sHeart } from '@fortawesome/pro-solid-svg-icons/faHeart';
import { faLock as rLock } from '@fortawesome/pro-regular-svg-icons/faLock';
import { faLock as sLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faQuestion as rQuestion } from '@fortawesome/pro-regular-svg-icons/faQuestion';
import { faQuestion as sQuestion } from '@fortawesome/pro-solid-svg-icons/faQuestion';
import { faCalendar as rCalendar } from '@fortawesome/pro-regular-svg-icons/faCalendar';
import { faCalendar as sCalendar } from '@fortawesome/pro-solid-svg-icons/faCalendar';
import { faCircleUser as rCircleUser } from '@fortawesome/pro-regular-svg-icons/faCircleUser';
import { faCircleUser as sCircleUser } from '@fortawesome/pro-solid-svg-icons/faCircleUser';
import { faClipboard as rClipboard } from '@fortawesome/pro-regular-svg-icons/faClipboard';
import { faClipboard as sClipboard } from '@fortawesome/pro-solid-svg-icons/faClipboard';
import { faClock as rClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faClock as sClock } from '@fortawesome/pro-solid-svg-icons/faClock';
import { faComment as rComment } from '@fortawesome/pro-regular-svg-icons/faComment';
import { faComment as sComment } from '@fortawesome/pro-solid-svg-icons/faComment';
import { faEnvelope as rEnvelope } from '@fortawesome/pro-regular-svg-icons/faEnvelope';
import { faEnvelope as sEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faFile as rFile } from '@fortawesome/pro-regular-svg-icons/faFile';
import { faFile as sFile } from '@fortawesome/pro-solid-svg-icons/faFile';
import { faFiles as rFiles } from '@fortawesome/pro-regular-svg-icons/faFiles';
import { faFiles as sFiles } from '@fortawesome/pro-solid-svg-icons/faFiles';
import { faFolder as rFolder } from '@fortawesome/pro-regular-svg-icons/faFolder';
import { faFolder as sFolder } from '@fortawesome/pro-solid-svg-icons/faFolder';
import { faFolderOpen as rFolderOpen } from '@fortawesome/pro-regular-svg-icons/faFolderOpen';
import { faFolderOpen as sFolderOpen } from '@fortawesome/pro-solid-svg-icons/faFolderOpen';
import { faFontAwesome as rFontAwesome } from '@fortawesome/pro-regular-svg-icons/faFontAwesome';
import { faFontAwesome as sFontAwesome } from '@fortawesome/pro-solid-svg-icons/faFontAwesome';
import { faGlobe as rGlobe } from '@fortawesome/pro-regular-svg-icons/faGlobe';
import { faGlobe as sGlobe } from '@fortawesome/pro-solid-svg-icons/faGlobe';
import { faInbox as rInbox } from '@fortawesome/pro-regular-svg-icons/faInbox';
import { faInbox as sInbox } from '@fortawesome/pro-solid-svg-icons/faInbox';
import { faKey as rKey } from '@fortawesome/pro-regular-svg-icons/faKey';
import { faKey as sKey } from '@fortawesome/pro-solid-svg-icons/faKey';
import { faLocationDot as rLocationDot } from '@fortawesome/pro-regular-svg-icons/faLocationDot';
import { faLocationDot as sLocationDot } from '@fortawesome/pro-solid-svg-icons/faLocationDot';
import { faSuitcase as rSuitcase } from '@fortawesome/pro-regular-svg-icons/faSuitcase';
import { faSuitcase as sSuitcase } from '@fortawesome/pro-solid-svg-icons/faSuitcase';
import { faTag as rTag } from '@fortawesome/pro-regular-svg-icons/faTag';
import { faTag as sTag } from '@fortawesome/pro-solid-svg-icons/faTag';
import { faTrophy as rTrophy } from '@fortawesome/pro-regular-svg-icons/faTrophy';
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

/** `regular` is the default; `solid` exists for every core name. */
export const NPH_ICON_VARIANTS = ['regular', 'solid'] as const;

export type NphIconVariant = (typeof NPH_ICON_VARIANTS)[number];

/** Size comes from a semantic token. There is no free value. */
export const NPH_ICON_SIZES = ['sm', 'md', 'lg'] as const;

export type NphIconSize = (typeof NPH_ICON_SIZES)[number];

type IconGlyph = Readonly<Record<NphIconVariant, IconDefinition>>;

function glyph(regular: IconDefinition, solid: IconDefinition): IconGlyph {
  return { regular, solid };
}

/**
 * Closed matrix: each approved name explicitly declares its `regular` and
 * `solid` artwork. The `satisfies` prevents names outside the core and
 * incomplete combinations at compile time.
 */
const GLYPHS = {
  bars: glyph(rBars, sBars),
  'chevron-down': glyph(rChevronDown, sChevronDown),
  'chevron-up': glyph(rChevronUp, sChevronUp),
  'chevron-right': glyph(rChevronRight, sChevronRight),
  'chevron-left': glyph(rChevronLeft, sChevronLeft),
  'arrow-left': glyph(rArrowLeft, sArrowLeft),
  'arrow-right': glyph(rArrowRight, sArrowRight),
  eye: glyph(rEye, sEye),
  'eye-slash': glyph(rEyeSlash, sEyeSlash),
  ellipsis: glyph(rEllipsis, sEllipsis),
  xmark: glyph(rXmark, sXmark),
  check: glyph(rCheck, sCheck),
  plus: glyph(rPlus, sPlus),
  minus: glyph(rMinus, sMinus),
  'magnifying-glass': glyph(rMagnifyingGlass, sMagnifyingGlass),
  'ellipsis-vertical': glyph(rEllipsisVertical, sEllipsisVertical),
  'arrow-up-arrow-down': glyph(rArrowUpArrowDown, sArrowUpArrowDown),
  'grip-vertical': glyph(rGripVertical, sGripVertical),
  'pen-to-square': glyph(rPenToSquare, sPenToSquare),
  'trash-can': glyph(rTrashCan, sTrashCan),
  'arrow-up-from-bracket': glyph(rArrowUpFromBracket, sArrowUpFromBracket),
  download: glyph(rDownload, sDownload),
  gear: glyph(rGear, sGear),
  filter: glyph(rFilter, sFilter),
  'filter-slash': glyph(rFilterSlash, sFilterSlash),
  'circle-info': glyph(rCircleInfo, sCircleInfo),
  'triangle-exclamation': glyph(rTriangleExclamation, sTriangleExclamation),
  'circle-xmark': glyph(rCircleXmark, sCircleXmark),
  'circle-check': glyph(rCircleCheck, sCircleCheck),
  'circle-question': glyph(rCircleQuestion, sCircleQuestion),
  star: glyph(rStar, sStar),
  'circle-notch': glyph(rCircleNotch, sCircleNotch),
  'calendar-days': glyph(rCalendarDays, sCalendarDays),
  user: glyph(rUser, sUser),
  house: glyph(rHouse, sHouse),
  'angle-left': glyph(rAngleLeft, sAngleLeft),
  'arrow-down-to-line': glyph(rArrowDownToLine, sArrowDownToLine),
  'arrow-up': glyph(rArrowUp, sArrowUp),
  'caret-up': glyph(rCaretUp, sCaretUp),
  'chevrons-down': glyph(rChevronsDown, sChevronsDown),
  'chevrons-left': glyph(rChevronsLeft, sChevronsLeft),
  'circle-chevron-down': glyph(rCircleChevronDown, sCircleChevronDown),
  'circle-chevron-left': glyph(rCircleChevronLeft, sCircleChevronLeft),
  'circle-down': glyph(rCircleDown, sCircleDown),
  'circle-up': glyph(rCircleUp, sCircleUp),
  'square-chevron-left': glyph(rSquareChevronLeft, sSquareChevronLeft),
  'triple-chevrons-left': glyph(rTripleChevronsLeft, sTripleChevronsLeft),
  'arrow-down-arrow-up': glyph(rArrowDownArrowUp, sArrowDownArrowUp),
  'circle-half-stroke': glyph(rCircleHalfStroke, sCircleHalfStroke),
  'cloud-arrow-up': glyph(rCloudArrowUp, sCloudArrowUp),
  'grid-2': glyph(rGrid2, sGrid2),
  link: glyph(rLink, sLink),
  list: glyph(rList, sList),
  'paper-plane': glyph(rPaperPlane, sPaperPlane),
  paperclip: glyph(rPaperclip, sPaperclip),
  pen: glyph(rPen, sPen),
  print: glyph(rPrint, sPrint),
  'right-to-bracket': glyph(rRightToBracket, sRightToBracket),
  'rotate-right': glyph(rRotateRight, sRotateRight),
  share: glyph(rShare, sShare),
  'share-from-square': glyph(rShareFromSquare, sShareFromSquare),
  'thumbs-down': glyph(rThumbsDown, sThumbsDown),
  'thumbs-up': glyph(rThumbsUp, sThumbsUp),
  thumbtack: glyph(rThumbtack, sThumbtack),
  'thumbtack-slash': glyph(rThumbtackSlash, sThumbtackSlash),
  trash: glyph(rTrash, sTrash),
  'user-circle-minus': glyph(rUserCircleMinus, sUserCircleMinus),
  'user-circle-plus': glyph(rUserCirclePlus, sUserCirclePlus),
  'user-minus': glyph(rUserMinus, sUserMinus),
  'alarm-clock': glyph(rAlarmClock, sAlarmClock),
  'badge-check': glyph(rBadgeCheck, sBadgeCheck),
  bell: glyph(rBell, sBell),
  heart: glyph(rHeart, sHeart),
  lock: glyph(rLock, sLock),
  question: glyph(rQuestion, sQuestion),
  calendar: glyph(rCalendar, sCalendar),
  'circle-user': glyph(rCircleUser, sCircleUser),
  clipboard: glyph(rClipboard, sClipboard),
  clock: glyph(rClock, sClock),
  comment: glyph(rComment, sComment),
  envelope: glyph(rEnvelope, sEnvelope),
  file: glyph(rFile, sFile),
  files: glyph(rFiles, sFiles),
  folder: glyph(rFolder, sFolder),
  'folder-open': glyph(rFolderOpen, sFolderOpen),
  'font-awesome': glyph(rFontAwesome, sFontAwesome),
  globe: glyph(rGlobe, sGlobe),
  inbox: glyph(rInbox, sInbox),
  key: glyph(rKey, sKey),
  'location-dot': glyph(rLocationDot, sLocationDot),
  suitcase: glyph(rSuitcase, sSuitcase),
  tag: glyph(rTag, sTag),
  trophy: glyph(rTrophy, sTrophy),
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
