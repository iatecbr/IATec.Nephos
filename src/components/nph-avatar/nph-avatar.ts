/**
 * `nph-avatar` — the picture of a person: the photo, or the person icon without one.
 *
 * Contract accepted in Figma (frame `1434:30`, set `1434:29`), sheet
 * `fichas/nph-avatar.md`, `design.md` and decision P74 — nph-avatar: API and
 * semantics:
 * - `size`: `sm` (default), `md` or `lg`, the Figma `size`. Reflects, because the
 *   internal CSS selects the box by it. The box is a square of `avatar/size-*` with
 *   the corner of `avatar/radius-*`, never a circle;
 * - `src`: the photo address. There is no property for the Figma `tipo`: it derives
 *   from `src`. A non-empty `src` (after trim) is the `foto` type; without it, the
 *   piece draws `sem foto`. So `<nph-avatar>` with no attribute draws the icon;
 * - `label`: the accessible name. Empty or whitespace-only makes the avatar
 *   decorative (`aria-hidden="true"` on the host, as `nph-icon`); with text, the host
 *   takes `role="img"` and `aria-label`. The inner `<img>` always has `alt=""`;
 * - the person icon (`nph-icon` `user`, style `light`, `icon/size-*` of the same
 *   size) shows while the photo loads and stays if it fails; the photo takes its
 *   place on `load`. No event is emitted and a new `src` starts the wait again;
 * - the border (`border/width` in `color/border`) is drawn by the avatar, inside the
 *   frame and over the photo, so the overlap in a group stays separated;
 * - never focusable, no slot, no `::part`, no event, no initials, no form
 *   association;
 * - invalid `size` does not render and emits `console.error` only in development,
 *   one per cause and with no visual fallback (P74, same rule as P21, P66 and P73).
 *   No `src` and no `label` is valid and silent.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import avatarCss from './nph-avatar.css?inline';

const TAG = 'nph-avatar';

/** Internal marker, not API: present only when the size is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_AVATAR_SIZES = ['sm', 'md', 'lg'] as const;
export type NphAvatarSize = (typeof NPH_AVATAR_SIZES)[number];

export function isSize(value: string): value is NphAvatarSize {
  return (NPH_AVATAR_SIZES as readonly string[]).includes(value);
}

/** Where the photo is: waiting for it, drawn, or failed. */
type PhotoStatus = 'loading' | 'loaded' | 'error';

/** The address the picture gets: `src` without surrounding spaces, empty when missing. */
function normalizeSrc(src: string | null | undefined): string {
  return (src ?? '').trim();
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphAvatar extends LitElement {
  static override styles = unsafeCSS(avatarCss);

  static override properties = {
    /* `size` reflects because the internal CSS selects the box by it. */
    size: { type: String, reflect: true },
    src: { type: String },
    label: { type: String },
  };

  /** `sm` by default. */
  declare size: NphAvatarSize;
  /** The photo address. Without it, the piece draws the person icon. */
  declare src: string;
  /** Accessible name. Empty or whitespace-only makes the avatar decorative. */
  declare label: string;

  private valid = false;
  private photo: PhotoStatus = 'loading';

  constructor() {
    super();
    this.size = 'sm';
    this.src = '';
    this.label = '';
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Only a new `size` is checked again, so the error does not repeat on other updates. */
    if (changed.has('size')) {
      const size = this.size ?? '';
      const valid = isSize(size);
      if (!valid) {
        devError(`size "${size}" does not exist. Use ${NPH_AVATAR_SIZES.map((value) => `"${value}"`).join(', ')}.`);
      }
      /* The photo is drawn again when the piece becomes valid: the wait starts over. */
      if (valid && !this.valid) {
        this.photo = 'loading';
      }
      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }
    /* The wait starts over only when the address the picture gets changes: `render` trims
       `src`, so a change in the surrounding spaces hands the same address to the same
       `<img>`, no new `load` or `error` comes, and the status must stay. On the first
       update the previous value is `undefined`, which counts as the empty address. */
    if (changed.has('src') && normalizeSrc(changed.get('src') as string | undefined) !== normalizeSrc(this.src)) {
      this.photo = 'loading';
    }
    this.applySemantics();
  }

  /**
   * Semantics on the HOST, as `nph-icon`: it is what assistive technology sees.
   * An avatar without a name, or one that does not render, stays out of the tree.
   */
  private applySemantics(): void {
    const label = (this.label ?? '').trim();
    if (this.valid && label !== '') {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  private setPhoto(status: PhotoStatus): void {
    this.photo = status;
    this.requestUpdate();
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const src = normalizeSrc(this.src);
    const icon =
      src !== '' && this.photo === 'loaded' ? nothing : html`<nph-icon name="user" size=${this.size}></nph-icon>`;
    /* The listeners come before `src`, so a photo that is already cached is not missed. */
    const photo =
      src === ''
        ? nothing
        : html`<img
            alt=""
            ?hidden=${this.photo !== 'loaded'}
            @load=${() => this.setPhoto('loaded')}
            @error=${() => this.setPhoto('error')}
            src=${src}
          />`;
    return html`${icon}${photo}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphAvatar);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-avatar': NphAvatar;
  }
}
