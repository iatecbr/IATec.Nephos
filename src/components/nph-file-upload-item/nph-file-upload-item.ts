/**
 * `nph-file-upload-item` — one file of the list under the drop zone, with the state of its upload.
 *
 * Contract accepted in Figma (documentation frame `5311:8328`, set `5298:7669`), recorded as text in
 * the evidence of the `figma-docs-accepted` gate of DSA-74, sheet `fichas/nph-file-upload.md`,
 * `design.md` and decision P119 — nph-file-upload: API and semantics. The item is the second part of
 * the piece; `nph-file-upload` draws one item per entry of its `files` and is the usual parent, but the
 * item is a public tag and also works alone, as the row of a list of files already saved:
 * - `name`: the file name, cut on one line with an ellipsis; the whole name is the accessible name of
 *   the link and of the remove button. Required;
 * - `status` (the Figma `estado`): `ready` (the upload happens together with the form), `uploading`,
 *   `sent`, `error` and `done` (the file is already saved). `done-hover` and `done-focus` of the set are
 *   interaction states of `done`, not values. `ready` is the default;
 * - `kind` (the Figma `tipo`): `file` (default), with the `file-lines` icon in a box, or `image`, with
 *   the `thumbnail` in `nph-image`; an image with no `thumbnail` yet shows the `file-image` icon;
 * - `format` and `bytes`: the second line, "PDF · 2.4 MB". `format` falls back to the extension of the
 *   name, in capitals; `bytes` is the size in bytes, written with `Intl` in the language of the
 *   element;
 * - `progress`: 0 to 100, required while `uploading`. The visible text and `role="progressbar"` carry
 *   it; nothing announces each percent;
 * - `reason`: the text of the error, already localized. `href`: the address that opens the file, on
 *   `done`: the name becomes a link whose click area stretches across the row; without it the name is
 *   text and the item warns once in development;
 * - `thumbnail`: the address of the image of the `image` kind. The parent makes it 64 × 64 for a high
 *   density screen; the frame is `image/size-sm`;
 * - `size`: `default` (default) or `large`, the size of the form for "Try again" and the remove button;
 *   `compact` is invalid;
 * - `disabled`: the zone is disabled and, with it, the whole form: disabled wins (rule T11), so the item
 *   takes the ready look, under `file-upload/disabled-opacity`, the buttons are disabled and the name is
 *   no link;
 * - `file-id`: the identity the events carry;
 * - the texts, already localized by the consuming application: `uploading-text` (with `{progress}`),
 *   `sent-text`, `done-text`, `retry-text`, `remove-label` and `cancel-label` (with `{name}`);
 * - events, `bubbles` and `composed`, only when the person acts: `nph-file-upload-remove`
 *   (`detail: { id, cancel }`, `cancel` while uploading) and `nph-file-upload-retry` (`detail: { id }`).
 *   The item removes nothing and retries nothing: the page does;
 * - methods `focusRemove()` and `focusRetry()`, for the parent that moves the focus after a change;
 * - no slot, no `::part` and no color property.
 *
 * SEMANTICS — the item has no role of its own. Its lines are the name, the format and size, and the
 * status line; the icons are `aria-hidden`. The status line of an upload in progress is a
 * `role="progressbar"` named by the file name, with the visible text as its value text. The remove
 * button is named "Remove X" or "Cancel upload of X". The name link is the click area of the whole row
 * (a link with a stretched area and a sibling button, never a control inside a control).
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P66 rule):
 * a `name` that is empty, a `status`, `kind` or `size` outside the list, an `uploading` with no
 * `progress` from 0 to 100 and an unsafe `href`. A text the item needs and the consumer did not give
 * draws without it and warns once, since it may arrive after the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-icon/nph-icon';
import '../nph-image/nph-image';
import '../nph-spinner/nph-spinner';
import itemCss from './nph-file-upload-item.css?inline';

const TAG = 'nph-file-upload-item';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_FILE_UPLOAD_ITEM_STATUSES = ['ready', 'uploading', 'sent', 'error', 'done'] as const;
export type NphFileUploadStatus = (typeof NPH_FILE_UPLOAD_ITEM_STATUSES)[number];

export const NPH_FILE_UPLOAD_ITEM_KINDS = ['file', 'image'] as const;
export type NphFileUploadKind = (typeof NPH_FILE_UPLOAD_ITEM_KINDS)[number];

/** The sizes of the form: `compact` never reaches the item, its target would be lower than the fields. */
export const NPH_FILE_UPLOAD_ITEM_SIZES = ['default', 'large'] as const;
export type NphFileUploadItemSize = (typeof NPH_FILE_UPLOAD_ITEM_SIZES)[number];

/** The protocols the address of a saved file may take; a relative path and a fragment resolve to the page's. */
export const NPH_FILE_UPLOAD_LINK_PROTOCOLS = ['http:', 'https:', 'blob:'] as const;

/** The detail of `nph-file-upload-remove`. `cancel` is true while the file is uploading. */
export interface NphFileUploadRemoveDetail {
  id: string;
  cancel: boolean;
}

/** The detail of `nph-file-upload-retry`. */
export interface NphFileUploadRetryDetail {
  id: string;
}

/**
 * Whether an address may open a saved file. It is parsed as the browser would — tabs and line breaks
 * inside the scheme are dropped — so `java\nscript:` is caught as `javascript:`.
 */
export function isSafeFileHref(href: string): boolean {
  try {
    return (NPH_FILE_UPLOAD_LINK_PROTOCOLS as readonly string[]).includes(new URL(href, document.baseURI).protocol);
  } catch {
    return false;
  }
}

/** The extension of a file name in capitals, "PDF" for `report.pdf`, or an empty text when it has none. */
export function formatOf(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || dot === name.length - 1) return '';
  return name.slice(dot + 1).toUpperCase();
}

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/** A size in bytes as "2.4 MB", the decimal mark of `locale`. Units are the international symbols. */
export function formatBytes(bytes: number, locale: string): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < UNITS.length - 1) {
    value /= 1000;
    unit += 1;
  }
  let number: string;
  try {
    number = new Intl.NumberFormat(locale, { maximumFractionDigits: unit === 0 ? 0 : 1 }).format(value);
  } catch {
    number = String(Math.round(value * 10) / 10);
  }
  return `${number} ${UNITS[unit] as string}`;
}

/**
 * The language of an element: the closest `lang` of the element or of an ancestor, crossing the shadow
 * roots through their hosts (`HTMLElement.lang` is only the attribute of the element itself), then the
 * document's, then the browser's.
 */
export function languageOf(element: HTMLElement): string {
  let node: Node | null = element;
  while (node !== null) {
    if (node instanceof HTMLElement && node.lang !== '') return node.lang;
    node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
  }
  return document.documentElement.lang || navigator.language || 'en';
}

/** Fills the `{name}` markers of a text with the values, leaving an unknown marker as it is. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (marker, key: string) => values[key] ?? marker);
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

export class NphFileUploadItem extends LitElement {
  static override styles = unsafeCSS(itemCss);

  /* Host focus goes to the first focusable part: the name link, "Try again" or the remove button. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    name: { type: String },
    status: { type: String },
    kind: { type: String },
    format: { type: String },
    bytes: { type: Number },
    progress: { type: Number },
    reason: { type: String },
    href: { type: String },
    thumbnail: { type: String },
    size: { type: String },
    disabled: { type: Boolean, reflect: true },
    fileId: { type: String, attribute: 'file-id' },
    uploadingText: { type: String, attribute: 'uploading-text' },
    sentText: { type: String, attribute: 'sent-text' },
    doneText: { type: String, attribute: 'done-text' },
    retryText: { type: String, attribute: 'retry-text' },
    removeLabel: { type: String, attribute: 'remove-label' },
    cancelLabel: { type: String, attribute: 'cancel-label' },
  };

  /** The file name. Required. */
  declare name: string;

  /** `ready` (default), `uploading`, `sent`, `error` or `done`. */
  declare status: NphFileUploadStatus;

  /** `file` (default) or `image`. */
  declare kind: NphFileUploadKind;

  /** The format shown, "PDF". Falls back to the extension of the name. */
  declare format: string | null;

  /** The size in bytes. */
  declare bytes: number | null;

  /** The progress from 0 to 100, required while `uploading`. */
  declare progress: number | null;

  /** The reason of the error, already localized. */
  declare reason: string | null;

  /** The address that opens the file, on `done`. */
  declare href: string | null;

  /** The address of the thumbnail of the `image` kind. */
  declare thumbnail: string | null;

  /** `default` (default) or `large`, the size of the form. */
  declare size: NphFileUploadItemSize;

  /** The zone is disabled: the buttons are, the name is no link and the item takes the ready look. */
  declare disabled: boolean;

  /** The identity the events carry. */
  declare fileId: string | null;

  declare uploadingText: string | null;
  declare sentText: string | null;
  declare doneText: string | null;
  declare retryText: string | null;
  declare removeLabel: string | null;
  declare cancelLabel: string | null;

  private problem: string | null = null;
  private reported = '';
  private warned = new Set<string>();

  constructor() {
    super();
    this.name = '';
    this.status = 'ready';
    this.kind = 'file';
    this.format = null;
    this.bytes = null;
    this.progress = null;
    this.reason = null;
    this.href = null;
    this.thumbnail = null;
    this.size = 'default';
    this.disabled = false;
    this.fileId = null;
    this.uploadingText = null;
    this.sentText = null;
    this.doneText = null;
    this.retryText = null;
    this.removeLabel = null;
    this.cancelLabel = null;
  }

  /* ----- validation -------------------------------------------------------- */

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    if (text(this.name) === '') {
      return '`name` is empty. It is the name of the file, required.';
    }
    if (!(NPH_FILE_UPLOAD_ITEM_STATUSES as readonly string[]).includes(this.status)) {
      return `status "${String(this.status)}" does not exist. Use ${NPH_FILE_UPLOAD_ITEM_STATUSES.map((value) => `"${value}"`).join(', ')}.`;
    }
    if (!(NPH_FILE_UPLOAD_ITEM_KINDS as readonly string[]).includes(this.kind)) {
      return `kind "${String(this.kind)}" does not exist. Use "file" or "image".`;
    }
    if (!(NPH_FILE_UPLOAD_ITEM_SIZES as readonly string[]).includes(this.size)) {
      return `size "${String(this.size)}" does not exist. The button and the remove button follow the form: "default" or "large", never "compact".`;
    }
    if (this.status === 'uploading') {
      const progress = this.progress;
      if (typeof progress !== 'number' || !Number.isFinite(progress) || progress < 0 || progress > 100) {
        return `progress ${String(progress)} is outside 0 to 100: an item that is uploading says how far it got.`;
      }
    }
    const href = text(this.href);
    if (href !== '' && !isSafeFileHref(href)) {
      return `the href is unsafe. A file opens from ${NPH_FILE_UPLOAD_LINK_PROTOCOLS.join(', ')} or a relative address.`;
    }
    return null;
  }

  /* ----- what the item says ------------------------------------------------ */

  /** The percentage as a whole number, clamped to the bar. */
  private get percent(): number {
    return Math.round(this.progress ?? 0);
  }

  private get language(): string {
    return languageOf(this);
  }

  /** "PDF · 2.4 MB": the format and the size, each when it is known. */
  private metaText(): string {
    const format = text(this.format) || formatOf(text(this.name));
    const size = typeof this.bytes === 'number' && Number.isFinite(this.bytes) && this.bytes >= 0 ? formatBytes(this.bytes, this.language) : '';
    return [format, size].filter((part) => part !== '').join(' · ');
  }

  /** The look of the item: a disabled item goes back to the ready look (rule T11). */
  private get look(): NphFileUploadStatus {
    return this.disabled ? 'ready' : this.status;
  }

  private get isImage(): boolean {
    return this.kind === 'image';
  }

  /** The name is a link only on a saved file that has an address and is not disabled. */
  private get linkHref(): string {
    return this.status === 'done' && !this.disabled ? text(this.href) : '';
  }

  /** The "Remove X" or "Cancel upload of X" of the × button, with the file name filled in. */
  private removeName(): string {
    const name = text(this.name);
    const template = this.status === 'uploading' ? text(this.cancelLabel) : text(this.removeLabel);
    return template === '' ? name : fill(template, { name });
  }

  private uploadingLine(): string {
    return fill(text(this.uploadingText), { progress: String(this.percent) });
  }

  /* ----- public methods ---------------------------------------------------- */

  /** Moves the focus to the remove button, for the parent that handles the focus after a change. */
  focusRemove(): void {
    this.renderRoot.querySelector<HTMLElement>('.remove')?.focus();
  }

  /** Moves the focus to "Try again", when the item has it. Returns whether it had. */
  focusRetry(): boolean {
    const retry = this.renderRoot.querySelector<HTMLElement>('.retry');
    retry?.focus();
    return retry !== null;
  }

  /* ----- life cycle -------------------------------------------------------- */

  protected override willUpdate(): void {
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
  }

  protected override updated(_changed: PropertyValues): void {
    if (this.problem === null) {
      this.warnMissingTexts();
    }
  }

  /** The texts the consumer owes: drawn without them, and said once, since they may arrive later. */
  private warnMissingTexts(): void {
    const owed: [boolean, string, string][] = [
      [this.status === 'uploading', 'uploading-text', text(this.uploadingText)],
      [this.status === 'sent', 'sent-text', text(this.sentText)],
      [this.status === 'done', 'done-text', text(this.doneText)],
      [this.status === 'error', 'retry-text', text(this.retryText)],
      [this.status !== 'uploading', 'remove-label', text(this.removeLabel)],
      [this.status === 'uploading', 'cancel-label', text(this.cancelLabel)],
    ];
    for (const [needed, property, value] of owed) {
      if (needed && value === '') {
        this.warnOnce(property, `the item is ${this.status} and has no \`${property}\`. Give it the text, already localized.`);
      }
    }
    if (this.status === 'done' && !this.disabled && text(this.href) === '') {
      this.warnOnce('href', 'a done item has no `href`: the name is text and does not open the file. Give it the address.');
    }
    if (this.status === 'error' && text(this.reason) === '') {
      this.warnOnce('reason', 'an item with an error has no `reason`: the person does not know what happened. Give it the reason.');
    }
  }

  private warnOnce(key: string, message: string): void {
    if (!this.warned.has(key)) {
      this.warned.add(key);
      devMessage('warn', message);
    }
  }

  /* ----- events ------------------------------------------------------------ */

  private onRemove(): void {
    this.dispatchEvent(
      new CustomEvent<NphFileUploadRemoveDetail>('nph-file-upload-remove', {
        detail: { id: this.fileId ?? '', cancel: this.status === 'uploading' },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onRetry(): void {
    this.dispatchEvent(
      new CustomEvent<NphFileUploadRetryDetail>('nph-file-upload-retry', {
        detail: { id: this.fileId ?? '' },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* ----- rendering --------------------------------------------------------- */

  /** The box at the start: the icon of the kind, or the thumbnail of an image. */
  private renderBox(): TemplateResult {
    const thumbnail = text(this.thumbnail);
    if (this.isImage && thumbnail !== '') {
      return html`<span class="box" data-image aria-hidden="true"><nph-image size="sm" src=${thumbnail}></nph-image></span>`;
    }
    return html`<span class="box" aria-hidden="true"
      ><nph-icon class="type-icon" name=${this.isImage ? 'file-image' : 'file-lines'} variant="light" size="sm"></nph-icon
    ></span>`;
  }

  private renderName(): TemplateResult {
    const name = text(this.name);
    const href = this.linkHref;
    return href === ''
      ? html`<span class="name" title=${name}>${name}</span>`
      : html`<a class="name link" href=${href} title=${name}>${name}</a>`;
  }

  /** The status line below the format and size: none while `ready`. */
  private renderStatus(): TemplateResult | typeof nothing {
    switch (this.look) {
      case 'uploading':
        return html`<span
          class="status"
          role="progressbar"
          aria-label=${text(this.name)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${String(this.percent)}
          aria-valuetext=${this.uploadingLine()}
          ><nph-spinner class="status-spinner" size="sm"></nph-spinner><span class="status-text">${this.uploadingLine()}</span></span
        >`;
      case 'sent':
        return html`<span class="status"
          ><nph-icon class="status-icon" name="circle-check" variant="light" size="sm"></nph-icon
          ><span class="status-text">${text(this.sentText)}</span></span
        >`;
      case 'done':
        return html`<span class="status"
          ><nph-icon class="status-icon" name="circle-check" variant="light" size="sm"></nph-icon
          ><span class="status-text">${text(this.doneText)}</span></span
        >`;
      case 'error':
        return html`<span class="status"
          ><nph-icon class="status-icon" name="circle-xmark" variant="light" size="sm"></nph-icon
          ><span class="status-text">${text(this.reason)}</span></span
        >`;
      default:
        return nothing;
    }
  }

  private renderActions(): TemplateResult {
    const retry =
      this.look === 'error'
        ? html`<nph-button
            class="retry"
            severity="secondary"
            emphasis="ghost"
            size=${this.size}
            icon-start="rotate-right"
            text=${text(this.retryText)}
            ?disabled=${this.disabled}
            @click=${() => this.onRetry()}
          ></nph-button>`
        : nothing;
    return html`<span class="actions"
      >${retry}<nph-button
        class="remove"
        severity="secondary"
        emphasis="ghost"
        size=${this.size}
        icon-start="xmark"
        label=${this.removeName()}
        ?disabled=${this.disabled}
        @click=${() => this.onRemove()}
      ></nph-button
    ></span>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null) {
      return nothing;
    }
    return html`<div class="item" data-status=${this.look} data-kind=${this.kind} data-disabled=${this.disabled ? 'true' : 'false'} aria-disabled=${this.disabled ? 'true' : nothing}>
      ${this.renderBox()}
      <span class="texts"
        >${this.renderName()}${this.metaText() === '' ? nothing : html`<span class="meta">${this.metaText()}</span>`}${this.renderStatus()}</span
      >
      ${this.renderActions()}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphFileUploadItem);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-file-upload-item': NphFileUploadItem;
  }
  interface HTMLElementEventMap {
    'nph-file-upload-remove': CustomEvent<NphFileUploadRemoveDetail>;
    'nph-file-upload-retry': CustomEvent<NphFileUploadRetryDetail>;
  }
}
