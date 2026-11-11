/**
 * `nph-file-upload` — the drop zone that receives files in a form, with the list of the files right
 * below it, each one with the state of its upload.
 *
 * Contract accepted in Figma (documentation frame `5311:8328`, sets `5297:7473` and `5298:7669`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-74, sheet
 * `fichas/nph-file-upload.md`, `design.md` and decision P119 — nph-file-upload: API and semantics. The
 * piece has two tags: this one, the zone and the list, and `nph-file-upload-item`, the row of one file.
 * It is CONTROLLED: the page owns the list. The zone keeps no list, sends nothing over the network and
 * has no form association; it validates what the person chooses, tells the page, draws the list the
 * page gives it, moves the focus and announces the changes:
 * - `files`: the list, property only, as `{ id, name, size?, format?, kind?, status?, progress?,
 *   reason?, href?, thumbnail?, file? }`. `id` (unique) and `name` are required. `status` is `ready`
 *   (default; the upload happens together with the form), `uploading`, `sent`, `error` or `done`; an
 *   `uploading` entry needs `progress` from 0 to 100. `size` is in bytes; `format` falls back to the
 *   extension of the name. `kind` is `file` or `image`, an image when the `file` is one. `href` opens a
 *   `done` file. A `thumbnail` is the address of the image of an `image` kind; without it, and with a
 *   `file`, the zone makes it, 64 × 64 with a centered crop (a canvas), and gives the address back when
 *   the entry leaves;
 * - `format` (the Figma `formato`): `default` (stacked and centered) or `compact` (one row). The compact
 *   format only applies when the zone is at least 668 px wide (a container query on the host); below
 *   that the zone uses the default format and never breaks into lines. Reflects, so the CSS and the
 *   consumer can read it;
 * - `accept`, `max-size` (`maxSize`, bytes) and `max-files` (`maxFiles`): what the zone accepts, the
 *   way the native file field says it (`.pdf`, `image/*`, `image/png`). The zone is in the limit state
 *   when `max-files` is reached;
 * - the choice: the "Choose files" `nph-button`, secondary solid, opens the system file picker, and the
 *   zone receives the dropped files. Dragging is never the only way: the button is the alternative
 *   (WCAG 2.5.7). The whole zone is not a button and takes no focus;
 * - `nph-file-upload-add` (`bubbles`, `composed`, `detail: { files, rejected }`): fires when the PERSON
 *   chooses or drops at least one file, never when code sets `files`. `files` are the ones that pass,
 *   `rejected` the ones that do not, each with its `reason`: `type`, `size` or `count`, checked in that
 *   order. The page adds the accepted files to `files`, shows a file above the size as an entry in
 *   `error` with its reason, and says the others in `error`;
 * - `error`: the reason of an error of the zone, already localized. Filled in, the zone is in error: the
 *   reason takes the place of the rule, with `circle-xmark`. Inside `nph-field`, `invalid` with the
 *   message of the field in `description` does the same: the zone never turns red without a reason;
 * - `nph-file-upload-remove` and `nph-file-upload-retry`: the events of the item, which cross the zone.
 *   The zone removes nothing: the page takes the entry out of `files`, and only then the focus moves;
 * - `disabled`: the whole zone at `file-upload/disabled-opacity`, with a real `disabled` on the button
 *   and on the buttons of the items. Disabled wins over error, limit and dragging (rule T11);
 * - `size`: `default` (default) or `large`, the size of the form for the button and the remove button;
 *   `compact` is invalid. `label`, `description`, `invalid` and `required` are the field–control
 *   contract of P83: the label names the group of the zone, the description describes it, `invalid`
 *   puts the zone in error and `required` reflects, with no effect of its own (the asterisk is the
 *   label's);
 * - the texts, already localized by the consuming application: `prompt`, `button-text`,
 *   `dragging-text`, `rule`, `limit-text`, `limit-rule`, `uploading-text` (`{progress}`), `sent-text`,
 *   `done-text`, `retry-text`, `remove-label` and `cancel-label` (`{name}`), and the messages of the
 *   live region: `added-text` (`{count}`), `sent-announcement` (`{name}`), `error-announcement`
 *   (`{name}`, `{reason}`) and `removed-announcement` (`{name}`);
 * - no slot, no `::part` and no color property. `focus()` on the host goes to the button.
 *
 * STATES OF THE ZONE — `empty`, `hover`, `focus`, `dragging`, `error`, `limit` and `disabled` of the Figma
 * set. Hover and focus come from the button: it changes and the icon turns solid, the border does not.
 * Dragging: background, border, phrase and icon go to the brand colors, the phrase becomes
 * `dragging-text` and the button is hidden with its place kept, so the height does not change. Limit:
 * warning colors, the phrase says the limit, the rule says how to free space and the button is disabled.
 * By precedence: disabled, dragging, error, limit, empty.
 *
 * KEYBOARD — Tab goes to the button, then to each item in visual order. After the picker closes the focus
 * returns to the button. After the page removes an item the focus goes to the remove button of the next
 * item, else of the previous one, else to the button; after "Try again" it goes to the remove button of
 * the same item, because the retry button leaves. The focus moves only if it was lost: it never takes the
 * focus away from where the person went.
 *
 * SCREEN READER — one `aria-live="polite"` region of the piece announces what was added, sent, failed and
 * removed, by comparing the list before and after, without moving the focus; nothing is announced on the
 * first render, and a file that arrives `done` is not "added". The progress stays in the visible text and
 * in `role="progressbar"` on the item, with no announcement per percent. The zone is a `group` named by
 * `label`, described by the rule or the reason and by `description`: the id reference sits in this root
 * because `nph-button` forwards no `aria-describedby` into its own (P119, D-2).
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P66 rule): a
 * `files` that is not a list, an entry without `id` or `name`, a repeated `id`, a `status` or `kind`
 * outside the list, an `uploading` without `progress`, an unsafe `href`, a `format` or `size` outside the
 * list and a `max-size` or `max-files` that is not a positive number. A text the piece needs and the
 * consumer did not give draws without it and warns once, since it may arrive after the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-file-upload-item/nph-file-upload-item';
import '../nph-icon/nph-icon';
import {
  NPH_FILE_UPLOAD_ITEM_KINDS,
  NPH_FILE_UPLOAD_ITEM_SIZES,
  NPH_FILE_UPLOAD_ITEM_STATUSES,
  fill,
  isSafeFileHref,
} from '../nph-file-upload-item/nph-file-upload-item';
import type { NphFileUploadItem, NphFileUploadKind, NphFileUploadStatus } from '../nph-file-upload-item/nph-file-upload-item';
import uploadCss from './nph-file-upload.css?inline';

const TAG = 'nph-file-upload';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_FILE_UPLOAD_FORMATS = ['default', 'compact'] as const;
export type NphFileUploadFormat = (typeof NPH_FILE_UPLOAD_FORMATS)[number];

/** Why a file was not accepted, in the order the zone checks them. */
export const NPH_FILE_UPLOAD_REJECTIONS = ['type', 'size', 'count'] as const;
export type NphFileUploadRejection = (typeof NPH_FILE_UPLOAD_REJECTIONS)[number];

/** The side, in pixels, of the thumbnail the zone makes: twice the 32 px box, for a high density screen. */
export const NPH_FILE_UPLOAD_THUMBNAIL_SIDE = 64;

/** One file of the list. The page owns it. */
export interface NphFileUploadEntry {
  /** Unique identity, the one the events carry. */
  id: string;
  /** The file name. */
  name: string;
  /** The size in bytes. */
  size?: number;
  /** The format shown, "PDF". Falls back to the extension of the name. */
  format?: string;
  /** `file` or `image`. Falls back to `image` when `file` is an image. */
  kind?: NphFileUploadKind;
  /** `ready` (default), `uploading`, `sent`, `error` or `done`. */
  status?: NphFileUploadStatus;
  /** From 0 to 100, required while `uploading`. */
  progress?: number;
  /** The reason of the error, already localized. */
  reason?: string;
  /** The address that opens a `done` file. */
  href?: string;
  /** The address of the thumbnail of an `image` kind. */
  thumbnail?: string;
  /** The chosen file; an image gives the zone the source of its thumbnail. */
  file?: File;
}

/** A file the zone did not accept, and why. */
export interface NphFileUploadRejected {
  file: File;
  reason: NphFileUploadRejection;
}

/** The detail of `nph-file-upload-add`. */
export interface NphFileUploadAddDetail {
  /** The files that pass `accept`, `max-size` and `max-files`. */
  files: File[];
  /** The ones that do not, each with its reason. */
  rejected: NphFileUploadRejected[];
}

/** Whether a file matches `accept`, written as the native file field does: `.pdf`, `image/*`, `image/png`. */
export function matchesAccept(file: { name: string; type: string }, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token !== '');
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

/**
 * Sorts what the person chose into the files that pass and the ones that do not, with the reason. By
 * file, in this order: the type, the size, then the room left by `max-files`.
 */
export function classify(
  chosen: readonly File[],
  rules: { accept: string; maxSize: number | null; room: number },
): NphFileUploadAddDetail {
  const files: File[] = [];
  const rejected: NphFileUploadRejected[] = [];
  let room = rules.room;
  for (const file of chosen) {
    if (!matchesAccept(file, rules.accept)) {
      rejected.push({ file, reason: 'type' });
    } else if (rules.maxSize !== null && file.size > rules.maxSize) {
      rejected.push({ file, reason: 'size' });
    } else if (room <= 0) {
      rejected.push({ file, reason: 'count' });
    } else {
      files.push(file);
      room -= 1;
    }
  }
  return { files, rejected };
}

/**
 * The thumbnail of an image: a square of `side` pixels cut from the center of the picture, as an address
 * of an object the caller must give back with `URL.revokeObjectURL`. `null` when the file cannot be read
 * as a picture. The original never goes into the thumbnail.
 */
export async function makeThumbnail(file: Blob, side = NPH_FILE_UPLOAD_THUMBNAIL_SIDE): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext('2d');
    if (context === null) {
      bitmap.close();
      return null;
    }
    const cut = Math.min(bitmap.width, bitmap.height);
    context.drawImage(bitmap, (bitmap.width - cut) / 2, (bitmap.height - cut) / 2, cut, cut, 0, 0, side, side);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    return blob === null ? null : URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** What the live region compares: the part of an entry that the announcements talk about. */
interface Snapshot {
  name: string;
  status: NphFileUploadStatus;
  reason: string;
}

/** The state of the zone the CSS reads: hover and focus are not here, they come from the button. */
type ZoneState = 'disabled' | 'dragging' | 'error' | 'limit' | 'empty';

/** What waits for the page to change the list before the focus moves. */
type PendingFocus = { kind: 'remove'; id: string; index: number } | { kind: 'retry'; id: string };

export class NphFileUpload extends LitElement {
  static override styles = unsafeCSS(uploadCss);

  static override properties = {
    files: { attribute: false },
    format: { type: String, reflect: true },
    accept: { type: String },
    maxSize: { type: Number, attribute: 'max-size' },
    maxFiles: { type: Number, attribute: 'max-files' },
    disabled: { type: Boolean, reflect: true },
    error: { type: String },
    size: { type: String },
    label: { type: String },
    description: { type: String },
    invalid: { type: Boolean, reflect: true },
    /* `required` reflects like the native attribute, so the CSS of the field reads it. */
    required: { type: Boolean, reflect: true },
    prompt: { type: String },
    buttonText: { type: String, attribute: 'button-text' },
    draggingText: { type: String, attribute: 'dragging-text' },
    rule: { type: String },
    limitText: { type: String, attribute: 'limit-text' },
    limitRule: { type: String, attribute: 'limit-rule' },
    uploadingText: { type: String, attribute: 'uploading-text' },
    sentText: { type: String, attribute: 'sent-text' },
    doneText: { type: String, attribute: 'done-text' },
    retryText: { type: String, attribute: 'retry-text' },
    removeLabel: { type: String, attribute: 'remove-label' },
    cancelLabel: { type: String, attribute: 'cancel-label' },
    addedText: { type: String, attribute: 'added-text' },
    sentAnnouncement: { type: String, attribute: 'sent-announcement' },
    errorAnnouncement: { type: String, attribute: 'error-announcement' },
    removedAnnouncement: { type: String, attribute: 'removed-announcement' },
    dragging: { state: true },
    pointerOnButton: { state: true },
    focusOnButton: { state: true },
    announcement: { state: true },
    thumbnails: { state: true },
  };

  /** The list of files. The page owns it. */
  declare files: readonly NphFileUploadEntry[];

  /** `default` (default) or `compact`. The compact only applies from 668 px of width. */
  declare format: NphFileUploadFormat;

  /** The accepted types, as the native file field says it. */
  declare accept: string;

  /** The largest size of a file, in bytes. */
  declare maxSize: number | null;

  /** The most files in the list. */
  declare maxFiles: number | null;

  /** Disabled wins over error, limit and dragging. */
  declare disabled: boolean;

  /** The reason of an error of the zone, already localized. Filled in, the zone is in error. */
  declare error: string;

  /** `default` (default) or `large`: the size of the form for the buttons. */
  declare size: string;

  /** The accessible name of the group of the zone. Written by `nph-field`. */
  declare label: string;

  /** The accessible description of the zone. Written by `nph-field`; with `invalid` it is the reason. */
  declare description: string;

  /** The field is invalid. With a reason to say, the zone is in error. Written by `nph-field`. */
  declare invalid: boolean;

  /** Required by the field. Reflects and has no effect of its own: the asterisk is the label's. */
  declare required: boolean;

  declare prompt: string;
  declare buttonText: string;
  declare draggingText: string;
  declare rule: string;
  declare limitText: string;
  declare limitRule: string;
  declare uploadingText: string;
  declare sentText: string;
  declare doneText: string;
  declare retryText: string;
  declare removeLabel: string;
  declare cancelLabel: string;
  declare addedText: string;
  declare sentAnnouncement: string;
  declare errorAnnouncement: string;
  declare removedAnnouncement: string;

  /** Files are being dragged over the zone. Not API. */
  declare protected dragging: boolean;
  declare protected pointerOnButton: boolean;
  declare protected focusOnButton: boolean;
  /** The text of the live region. Not API. */
  declare protected announcement: string;
  /** The thumbnails made by the zone, by entry id. Not API. */
  declare protected thumbnails: ReadonlyMap<string, string>;

  private problem: string | null = null;
  private reported = '';
  private warned = new Set<string>();
  private previous: Map<string, Snapshot> | null = null;
  private pending: PendingFocus | null = null;
  private dragDepth = 0;
  /** The message that waits for the region to be cleared before it is written. */
  private publish: string | null = null;
  private publishFrame = 0;
  /** The picture each thumbnail was made from, so a new file for the same id makes a new thumbnail. */
  private made = new Map<string, { source: Blob; url: string | null }>();

  constructor() {
    super();
    this.files = [];
    this.format = 'default';
    this.accept = '';
    this.maxSize = null;
    this.maxFiles = null;
    this.disabled = false;
    this.error = '';
    this.size = 'default';
    this.label = '';
    this.description = '';
    this.invalid = false;
    this.required = false;
    this.prompt = '';
    this.buttonText = '';
    this.draggingText = '';
    this.rule = '';
    this.limitText = '';
    this.limitRule = '';
    this.uploadingText = '';
    this.sentText = '';
    this.doneText = '';
    this.retryText = '';
    this.removeLabel = '';
    this.cancelLabel = '';
    this.addedText = '';
    this.sentAnnouncement = '';
    this.errorAnnouncement = '';
    this.removedAnnouncement = '';
    this.dragging = false;
    this.pointerOnButton = false;
    this.focusOnButton = false;
    this.announcement = '';
    this.thumbnails = new Map();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* The thumbnails were given back when the zone left: a zone moved to another place makes them again. */
    if (this.hasUpdated) this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const { url } of this.made.values()) {
      if (url !== null) URL.revokeObjectURL(url);
    }
    this.made.clear();
    this.thumbnails = new Map();
    cancelAnimationFrame(this.publishFrame);
    this.publishFrame = 0;
    this.publish = null;
    this.dragDepth = 0;
    this.dragging = false;
    /* What waited for the page or for the pointer is not wanted by a zone that left. */
    this.pending = null;
    this.pointerOnButton = false;
    this.focusOnButton = false;
  }

  /** The focus of the host goes to the "Choose files" button, which is where the zone is operated. */
  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector<HTMLElement>('.choose')?.focus(options);
  }

  /* ----- validation -------------------------------------------------------- */

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    if (!(NPH_FILE_UPLOAD_FORMATS as readonly string[]).includes(this.format)) {
      return `format "${String(this.format)}" does not exist. Use "default" or "compact".`;
    }
    if (!(NPH_FILE_UPLOAD_ITEM_SIZES as readonly string[]).includes(this.size)) {
      return `size "${String(this.size)}" does not exist. The buttons follow the form: "default" or "large", never "compact".`;
    }
    for (const [name, value] of [
      ['max-size', this.maxSize],
      ['max-files', this.maxFiles],
    ] as const) {
      if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value <= 0)) {
        return `${name} ${String(value)} is not a positive number.`;
      }
    }
    if (!Array.isArray(this.files)) {
      return '`files` is not a list. Give it the files, each with an `id` and a `name`.';
    }
    const ids = new Set<string>();
    for (const [index, entry] of this.files.entries()) {
      const where = `file ${String(index + 1)}`;
      if (entry === null || typeof entry !== 'object' || text(entry.id) === '' || text(entry.name) === '') {
        return `${where} has no \`id\` or no \`name\`: both are required.`;
      }
      if (ids.has(entry.id)) {
        return `the id "${entry.id}" of ${where} is repeated: an \`id\` is unique in the list.`;
      }
      ids.add(entry.id);
      const status = entry.status ?? 'ready';
      if (!(NPH_FILE_UPLOAD_ITEM_STATUSES as readonly string[]).includes(status)) {
        return `status "${String(status)}" of ${where} does not exist. Use ${NPH_FILE_UPLOAD_ITEM_STATUSES.map((value) => `"${value}"`).join(', ')}.`;
      }
      if (entry.kind !== undefined && !(NPH_FILE_UPLOAD_ITEM_KINDS as readonly string[]).includes(entry.kind)) {
        return `kind "${String(entry.kind)}" of ${where} does not exist. Use "file" or "image".`;
      }
      if (status === 'uploading') {
        const progress = entry.progress;
        if (typeof progress !== 'number' || !Number.isFinite(progress) || progress < 0 || progress > 100) {
          return `${where} is uploading and its \`progress\` ${String(progress)} is outside 0 to 100.`;
        }
      }
      const href = text(entry.href);
      if (href !== '' && !isSafeFileHref(href)) {
        return `${where} has an unsafe \`href\`.`;
      }
    }
    return null;
  }

  /* ----- what the zone is -------------------------------------------------- */

  /** The reason the zone says: its own, or the message of the field when the field is invalid. */
  private get reason(): string {
    const own = text(this.error);
    if (own !== '') return own;
    return this.invalid ? text(this.description) : '';
  }

  private get atLimit(): boolean {
    return this.maxFiles !== null && this.files.length >= this.maxFiles;
  }

  /** The state of the zone, by precedence (rule T11): disabled, dragging, error, limit, empty. */
  private get state(): ZoneState {
    if (this.disabled) return 'disabled';
    if (this.dragging) return 'dragging';
    if (this.reason !== '') return 'error';
    if (this.atLimit) return 'limit';
    return 'empty';
  }

  private kindOf(entry: NphFileUploadEntry): NphFileUploadKind {
    if (entry.kind !== undefined) return entry.kind;
    return entry.file?.type.startsWith('image/') === true ? 'image' : 'file';
  }

  /* ----- life cycle -------------------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    this.problem = this.validate();
    if (this.problem !== null) {
      /* One message per cause: a re-render with the same input stays silent. */
      if (this.problem !== this.reported) {
        devMessage('error', this.problem);
      }
      this.reported = this.problem;
    } else {
      this.reported = '';
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.problem === null);
    if (this.problem === null && (changed.has('files') || this.previous === null)) {
      this.compare();
    }
  }

  protected override updated(changed: PropertyValues): void {
    if (this.problem !== null) {
      return;
    }
    this.warnMissingTexts();
    if (this.publish !== null && this.publishFrame === 0) {
      this.publishFrame = requestAnimationFrame(() => {
        this.publishFrame = 0;
        if (this.publish !== null) this.announcement = this.publish;
        this.publish = null;
      });
    }
    /* A zone that left the page makes no thumbnail: nobody would give it back. */
    if (this.isConnected) this.syncThumbnails();
    if (changed.has('files')) {
      void this.settleFocus();
    }
  }

  /** The texts the consumer owes the zone: drawn without them, and said once, since they may arrive later. */
  private warnMissingTexts(): void {
    if (text(this.buttonText) === '') {
      this.warnOnce('button-text', 'the zone has no `button-text`: the button has no name. Give it the text, already localized.');
    }
    if (this.atLimit && text(this.limitText) === '') {
      this.warnOnce('limit-text', 'the limit of files is reached and the zone has no `limit-text`. Give it the phrase.');
    }
  }

  private warnOnce(key: string, message: string): void {
    if (!this.warned.has(key)) {
      this.warned.add(key);
      devMessage('warn', message);
    }
  }

  /* ----- the live region --------------------------------------------------- */

  /**
   * Compares the list with the one before and writes what changed in the live region. Nothing is said on
   * the first list the zone draws, and a file that arrives `done` is a file the person already had.
   */
  private compare(): void {
    const now = new Map<string, Snapshot>();
    for (const entry of this.files) {
      now.set(entry.id, { name: text(entry.name), status: entry.status ?? 'ready', reason: text(entry.reason) });
    }
    const before = this.previous;
    this.previous = now;
    if (before === null) {
      return;
    }
    const messages: string[] = [];
    let added = 0;
    for (const [id, entry] of now) {
      const old = before.get(id);
      if (old === undefined) {
        if (entry.status === 'error') {
          messages.push(this.errorMessage(entry));
        } else if (entry.status !== 'done') {
          added += 1;
        }
      } else if (old.status !== entry.status) {
        if (entry.status === 'sent') messages.push(fill(text(this.sentAnnouncement), { name: entry.name }));
        if (entry.status === 'error') messages.push(this.errorMessage(entry));
      }
    }
    if (added > 0) {
      messages.unshift(fill(text(this.addedText), { count: String(added) }));
    }
    for (const [id, old] of before) {
      if (!now.has(id)) messages.push(fill(text(this.removedAnnouncement), { name: old.name }));
    }
    const said = messages.filter((message) => message !== '').join(' ');
    if (said !== '') {
      /* The region is cleared first and the message comes in a later frame: the same text twice in a row
         (`1 files added`, a failure again after Try again) is a new node, and is announced again. */
      this.announcement = '';
      /* Two changes inside one frame are said together: the second never takes the first one's place. */
      this.publish = this.publish === null ? said : `${this.publish} ${said}`;
    }
  }

  private errorMessage(entry: Snapshot): string {
    return fill(text(this.errorAnnouncement), { name: entry.name, reason: entry.reason });
  }

  /* ----- thumbnails -------------------------------------------------------- */

  /** Makes the thumbnail of each image entry that has none, and gives back the ones of entries that left. */
  private syncThumbnails(): void {
    const ids = new Set<string>();
    let next: ReadonlyMap<string, string> = this.thumbnails;
    const forget = (id: string): void => {
      if (next.has(id)) {
        const copy = new Map(next);
        copy.delete(id);
        next = copy;
      }
    };
    for (const entry of this.files) {
      ids.add(entry.id);
      const file = entry.file;
      if (this.kindOf(entry) !== 'image' || text(entry.thumbnail) !== '' || file === undefined || !file.type.startsWith('image/')) {
        /* An entry that stopped needing a thumbnail gives its own back at once, not when it leaves. */
        const stale = this.made.get(entry.id);
        if (stale !== undefined) {
          if (stale.url !== null) URL.revokeObjectURL(stale.url);
          this.made.delete(entry.id);
          forget(entry.id);
        }
        continue;
      }
      const made = this.made.get(entry.id);
      if (made?.source === file) continue;
      if (made?.url) URL.revokeObjectURL(made.url);
      /* The old picture is not shown while the new one is made, nor when it cannot be read. */
      forget(entry.id);
      const record = { source: file as Blob, url: null as string | null };
      this.made.set(entry.id, record);
      void makeThumbnail(file).then((url) => {
        /* The entry changed or left while the picture was being read: the address is not wanted. */
        if (this.made.get(entry.id) !== record) {
          if (url !== null) URL.revokeObjectURL(url);
          return;
        }
        record.url = url;
        if (url !== null) {
          this.thumbnails = new Map(this.thumbnails).set(entry.id, url);
        }
      });
    }
    for (const [id, made] of [...this.made]) {
      if (!ids.has(id)) {
        if (made.url !== null) URL.revokeObjectURL(made.url);
        this.made.delete(id);
        forget(id);
      }
    }
    if (next !== this.thumbnails) this.thumbnails = next;
  }

  /* ----- focus ------------------------------------------------------------- */

  private items(): NphFileUploadItem[] {
    return [...this.renderRoot.querySelectorAll<NphFileUploadItem>('nph-file-upload-item')];
  }

  /** The focus is free when it is on nothing or inside the zone: the zone never takes it from elsewhere. */
  private get focusIsFree(): boolean {
    const active = (this.getRootNode() as Document | ShadowRoot).activeElement;
    return active === null || active === document.body || active === this;
  }

  /** Moves the focus after the page changed the list, if the change is the one the person asked for. */
  private async settleFocus(): Promise<void> {
    const pending = this.pending;
    if (pending === null) {
      return;
    }
    await this.updateComplete;
    if (!this.isConnected) {
      return;
    }
    const items = this.items();
    await Promise.all(items.map((item) => item.updateComplete));
    if (pending.kind === 'remove') {
      if (this.files.some((entry) => entry.id === pending.id)) {
        return;
      }
      this.pending = null;
      if (!this.focusIsFree) return;
      const target = items[Math.min(pending.index, items.length - 1)];
      if (target === undefined) {
        this.focus();
      } else {
        target.focusRemove();
      }
      return;
    }
    const item = items.find((candidate) => candidate.fileId === pending.id);
    if (item === undefined) {
      this.pending = null;
      return;
    }
    if (item.status !== 'error') {
      this.pending = null;
      if (this.focusIsFree) item.focusRemove();
    }
  }

  private onRemove(event: CustomEvent<{ id: string }>): void {
    const id = event.detail.id;
    const index = this.files.findIndex((entry) => entry.id === id);
    this.pending = index === -1 ? null : { kind: 'remove', id, index };
  }

  private onRetry(event: CustomEvent<{ id: string }>): void {
    this.pending = { kind: 'retry', id: event.detail.id };
  }

  /* ----- the choice -------------------------------------------------------- */

  /** Sorts what the person chose and tells the page. Never fires for code, and never for no file. */
  private receive(chosen: readonly File[]): void {
    if (chosen.length === 0) {
      return;
    }
    const room = this.maxFiles === null ? Number.POSITIVE_INFINITY : Math.max(0, this.maxFiles - this.files.length);
    const detail = classify(chosen, { accept: text(this.accept), maxSize: this.maxSize, room });
    this.dispatchEvent(new CustomEvent<NphFileUploadAddDetail>('nph-file-upload-add', { detail, bubbles: true, composed: true }));
  }

  private openPicker(): void {
    this.renderRoot.querySelector<HTMLInputElement>('.input')?.click();
  }

  /** The picker closed, with files or without: the focus is back on the button. */
  private onPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const chosen = [...(input.files ?? [])];
    /* The same file chosen twice must still fire `change`. */
    input.value = '';
    this.receive(chosen);
    this.focus();
  }

  private hasFiles(event: DragEvent): boolean {
    return event.dataTransfer !== null && [...event.dataTransfer.types].includes('Files');
  }

  private onDragEnter(event: DragEvent): void {
    if (!this.hasFiles(event)) return;
    event.preventDefault();
    this.dragDepth += 1;
    if (!this.disabled) this.dragging = true;
  }

  private onDragOver(event: DragEvent): void {
    if (!this.hasFiles(event)) return;
    /* Without it the browser would open the file instead of handing it to the zone. */
    event.preventDefault();
    if (event.dataTransfer !== null) event.dataTransfer.dropEffect = this.disabled ? 'none' : 'copy';
  }

  private onDragLeave(event: DragEvent): void {
    if (!this.hasFiles(event)) return;
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) this.dragging = false;
  }

  private onDrop(event: DragEvent): void {
    if (!this.hasFiles(event)) return;
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging = false;
    if (this.disabled) return;
    this.receive([...(event.dataTransfer?.files ?? [])]);
  }

  /* ----- hover and focus of the button, which are the hover and focus of the zone ----- */

  private onButtonFocusIn(event: FocusEvent): void {
    const inner = (event.currentTarget as HTMLElement).shadowRoot?.activeElement;
    this.focusOnButton = inner?.matches(':focus-visible') ?? false;
  }

  /* ----- rendering --------------------------------------------------------- */

  private renderRule(state: ZoneState): TemplateResult | typeof nothing {
    if (state === 'error') {
      return html`<span class="rule" id="rule"
        ><nph-icon class="rule-icon" name="circle-xmark" variant="light" size="sm"></nph-icon
        ><span class="rule-text">${this.reason}</span></span
      >`;
    }
    const rule = state === 'limit' ? text(this.limitRule) : text(this.rule);
    return rule === '' ? nothing : html`<span class="rule" id="rule"><span class="rule-text">${rule}</span></span>`;
  }

  private renderItem(entry: NphFileUploadEntry): TemplateResult {
    const status = entry.status ?? 'ready';
    return html`<li class="entry">
      <nph-file-upload-item
        .fileId=${entry.id}
        .name=${entry.name}
        .status=${status}
        .kind=${this.kindOf(entry)}
        .format=${entry.format ?? null}
        .bytes=${entry.size ?? null}
        .progress=${entry.progress ?? null}
        .reason=${entry.reason ?? null}
        .href=${entry.href ?? null}
        .thumbnail=${text(entry.thumbnail) || (this.thumbnails.get(entry.id) ?? null)}
        .size=${this.size}
        .disabled=${this.disabled}
        .uploadingText=${this.uploadingText}
        .sentText=${this.sentText}
        .doneText=${this.doneText}
        .retryText=${this.retryText}
        .removeLabel=${this.removeLabel}
        .cancelLabel=${this.cancelLabel}
        @nph-file-upload-remove=${(event: CustomEvent<{ id: string }>) => this.onRemove(event)}
        @nph-file-upload-retry=${(event: CustomEvent<{ id: string }>) => this.onRetry(event)}
      ></nph-file-upload-item>
    </li>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null) {
      return nothing;
    }
    const state = this.state;
    const label = text(this.label);
    const description = text(this.description);
    const hasRule = state === 'error' || (state === 'limit' ? text(this.limitRule) : text(this.rule)) !== '';
    /* The message of an invalid field is already the reason the zone says: it is not said twice. */
    const extra = description !== '' && description !== this.reason ? description : '';
    const describedBy = [hasRule ? 'rule' : '', extra !== '' ? 'description' : ''].filter((id) => id !== '').join(' ');
    const hot = !this.disabled && (this.pointerOnButton || this.focusOnButton);
    const solid = state === 'dragging' || state === 'error' || state === 'limit' || hot;
    const phrase =
      state === 'dragging' ? text(this.draggingText) : state === 'limit' && text(this.limitText) !== '' ? text(this.limitText) : text(this.prompt);
    return html`<div class="root">
      <div class="live" aria-live="polite" aria-atomic="true">${this.announcement}</div>
      <div
        class="zone"
        role=${label === '' ? nothing : 'group'}
        aria-label=${label === '' ? nothing : label}
        aria-describedby=${describedBy === '' ? nothing : describedBy}
        aria-disabled=${this.disabled ? 'true' : nothing}
        data-state=${state}
        data-format=${this.format}
        @dragenter=${(event: DragEvent) => this.onDragEnter(event)}
        @dragover=${(event: DragEvent) => this.onDragOver(event)}
        @dragleave=${(event: DragEvent) => this.onDragLeave(event)}
        @drop=${(event: DragEvent) => this.onDrop(event)}
      >
        <nph-icon class="zone-icon" name="cloud-arrow-up" variant=${solid ? 'solid' : 'light'} size="lg"></nph-icon>
        <span class="phrase">${phrase}</span>
        <span class="action" ?inert=${state === 'dragging'}>
          <nph-button
            class="choose"
            severity="secondary"
            emphasis="solid"
            size=${this.size}
            text=${text(this.buttonText)}
            ?disabled=${this.disabled || this.atLimit}
            @click=${() => this.openPicker()}
            @pointerenter=${() => {
              this.pointerOnButton = true;
            }}
            @pointerleave=${() => {
              this.pointerOnButton = false;
            }}
            @focusin=${(event: FocusEvent) => this.onButtonFocusIn(event)}
            @focusout=${() => {
              this.focusOnButton = false;
            }}
          ></nph-button>
        </span>
        ${this.renderRule(state)}
        ${extra === '' ? nothing : html`<span class="hidden" id="description">${extra}</span>`}
        <input
          class="input"
          type="file"
          multiple
          hidden
          tabindex="-1"
          accept=${text(this.accept) === '' ? nothing : text(this.accept)}
          ?disabled=${this.disabled}
          @change=${(event: Event) => this.onPicked(event)}
          @cancel=${() => this.focus()}
        />
      </div>
      ${this.files.length === 0 ? nothing : html`<ul class="list">${this.files.map((entry) => this.renderItem(entry))}</ul>`}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphFileUpload);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-file-upload': NphFileUpload;
  }
  interface HTMLElementEventMap {
    'nph-file-upload-add': CustomEvent<NphFileUploadAddDetail>;
  }
}
