/**
 * `nph-avatar-stack` — a group of overlapping avatars, with the count of who does not
 * show.
 *
 * Contract accepted in Figma (frame `1579:46`, set `1579:45`), decisions D1 to D3 of
 * the task DSA-25, sheet `fichas/nph-avatar-stack.md`, `design.md` and decision P78 —
 * nph-avatar-stack: API and semantics:
 * - the default slot takes `nph-avatar` children, each with its own `src`. The Figma
 *   `mostrar 3º`, `mostrar 4º` and `mostrar 5º` are not properties: they are the number
 *   of children. Each avatar goes over the previous one by `avatar/overlap`;
 * - `size`: `sm` (default), `md` or `lg`, the Figma `size`. Reflects, because the
 *   internal CSS selects the count by it. The group is the source of truth: it writes
 *   its `size` on every child avatar, also when a child changes its own afterwards;
 * - `count`: the Figma `mostrar contagem` and `contagem`. A whole number; above zero the
 *   group draws "+N" at the end, overlapping the last avatar (D2), with `text/label-sm`
 *   in `sm` and `md` and `text/label-md` in `lg` (D1). Zero, or no attribute, draws no
 *   count;
 * - `label`: the name of the group, already localized by the consuming application,
 *   with the names and the total ("Ana, Bruno, Carla and 3 more"). The host is a
 *   `role="img"` and `label` becomes its `aria-label`; a name the consumer puts on the
 *   host (`aria-label` or `aria-labelledby`) is also a name. The slot and the count sit
 *   in one `aria-hidden` wrapper, so the avatars and the count stay out of the
 *   accessibility tree: the role alone does not hide them, because Chromium still
 *   exposes an avatar with a `label` of its own inside a `role="img"`;
 * - the separation between avatars is the border of each `nph-avatar`: the group draws
 *   no ring (D3), no background and no border of its own;
 * - no `::part`, no event, no color property, and never focusable;
 * - invalid input does not render and emits `console.error` only in development, one
 *   per cause (the rule of P21): a `size` outside `sm`, `md` and `lg`, a `count` that is
 *   not a whole number from zero up, and no name. A problem in the composition renders
 *   anyway and emits `console.warn` only in development, once while it lasts: fewer than
 *   two avatars, more than five, a child that is not an `nph-avatar`, and an avatar with
 *   a `label` of its own.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import { NPH_AVATAR_SIZES, isSize } from '../nph-avatar/nph-avatar';
import type { NphAvatar, NphAvatarSize } from '../nph-avatar/nph-avatar';
import avatarStackCss from './nph-avatar-stack.css?inline';

const TAG = 'nph-avatar-stack';

const AVATAR_TAG = 'nph-avatar';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The group shows from the 1st to the 5th avatar; whoever does not show enters the count. */
export const NPH_AVATAR_STACK_MIN_AVATARS = 2;
export const NPH_AVATAR_STACK_MAX_AVATARS = 5;

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function isAvatar(element: Element): element is NphAvatar {
  return element.localName === AVATAR_TAG;
}

/** A removed `count` attribute is `null` to Lit, and it means no count, as zero does. */
function countOf(count: number | null | undefined): number {
  return count ?? 0;
}

function isCount(count: number): boolean {
  return Number.isSafeInteger(count) && count >= 0;
}

export class NphAvatarStack extends LitElement {
  static override styles = unsafeCSS(avatarStackCss);

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-label', 'aria-labelledby'];
  }

  static override properties = {
    /* `size` reflects because the internal CSS selects the count by it. */
    size: { type: String, reflect: true },
    count: { type: Number },
    label: { type: String },
  };

  /** `sm` by default. Written on every child avatar. */
  declare size: NphAvatarSize;
  /** How many people do not show. Zero draws no count. */
  declare count: number;
  /** The name of the group, already localized by the consuming application. */
  declare label: string;

  private valid = false;
  private labelApplied = false;
  private applyingSemantics = false;
  private accessibleNameChanged = false;
  /** The composition warnings already shown, so a problem that stays does not repeat. */
  private shownWarnings = new Set<string>();
  /** Watches `size` and `label` of the direct children, which raise no `slotchange`. */
  private readonly childObserver = new MutationObserver((records) => this.onChildMutation(records));

  constructor() {
    super();
    this.size = 'sm';
    this.count = 0;
    this.label = '';
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      (name === 'aria-label' || name === 'aria-labelledby') &&
      oldValue !== newValue &&
      !this.applyingSemantics
    ) {
      if (name === 'aria-label') {
        this.labelApplied = false;
      }
      this.accessibleNameChanged = true;
      this.requestUpdate();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* One observer on the host covers the current set of children: the records are
       filtered to the direct avatars, so a child added or removed later needs no wiring.
       The group's own write of `size` comes back here once; writing it again changes
       nothing. */
    this.childObserver.observe(this, { attributes: true, attributeFilter: ['size', 'label'], subtree: true });
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver.disconnect();
  }

  private onChildMutation(records: MutationRecord[]): void {
    const changed = records.some(
      (record) => record.target instanceof Element && record.target.parentElement === this && isAvatar(record.target),
    );
    if (changed && this.valid) {
      this.syncAvatars();
      this.checkComposition();
    }
  }

  private avatars(): NphAvatar[] {
    return [...this.children].filter(isAvatar);
  }

  /** The group has a single size: every child avatar takes the group's. */
  private syncAvatars(): void {
    for (const avatar of this.avatars()) {
      if (avatar.size !== this.size) {
        avatar.size = this.size;
      }
    }
  }

  /** Composition problems: they render anyway, and each shows once while it lasts. */
  private checkComposition(): void {
    const warnings = new Set<string>();
    const avatars = this.avatars();

    if (avatars.length < NPH_AVATAR_STACK_MIN_AVATARS) {
      warnings.add('fewer than two avatars: for a single person, use nph-avatar without a group.');
    }
    if (avatars.length > NPH_AVATAR_STACK_MAX_AVATARS) {
      warnings.add('more than five avatars: show up to the 5th and put whoever does not show in count.');
    }
    if (avatars.length < this.children.length) {
      warnings.add('only nph-avatar is a child of the group; the other elements are not part of it.');
    }
    if (avatars.some((avatar) => (avatar.label ?? '').trim() !== '')) {
      warnings.add('an avatar of the group has a label of its own: the group is read by its own label, so put the names there.');
    }

    for (const warning of warnings) {
      if (!this.shownWarnings.has(warning)) {
        devWarn(warning);
      }
    }
    this.shownWarnings = warnings;
  }

  /** The name of the host: `label` becomes its `aria-label`, as in `nph-toggle-group`. */
  private applyName(): void {
    this.applyingSemantics = true;
    try {
      const label = (this.label ?? '').trim();
      if (label !== '') {
        this.setAttribute('aria-label', label);
        this.labelApplied = true;
      } else if (this.labelApplied) {
        this.removeAttribute('aria-label');
        this.labelApplied = false;
      }
    } finally {
      this.applyingSemantics = false;
    }
  }

  /**
   * The host is the image, as a named `nph-avatar` is. With invalid input it draws
   * nothing and stays out of the accessibility tree.
   */
  private applyRole(): void {
    if (this.valid) {
      this.setAttribute('role', 'img');
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    this.applyName();

    /* Only the inputs that decide validity are checked again, so the errors do not repeat. */
    if (
      changed.has('size') ||
      changed.has('count') ||
      changed.has('label') ||
      this.accessibleNameChanged ||
      !this.hasUpdated
    ) {
      this.accessibleNameChanged = false;
      const size = this.size ?? '';
      const count = countOf(this.count);
      const named = ['aria-label', 'aria-labelledby'].some((name) => (this.getAttribute(name) ?? '').trim() !== '');
      let valid = true;

      if (!isSize(size)) {
        devError(`size "${size}" does not exist. Use ${NPH_AVATAR_SIZES.map((value) => `"${value}"`).join(', ')}.`);
        valid = false;
      }
      if (!isCount(count)) {
        devError(`count "${String(this.count)}" is not a whole number from zero up.`);
        valid = false;
      }
      if (!named) {
        devError('the group needs a name: set label, aria-label or aria-labelledby, with the names and the total.');
        valid = false;
      }
      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }
    this.applyRole();
  }

  protected override updated(): void {
    if (this.valid) {
      this.syncAvatars();
      this.checkComposition();
    }
  }

  private onSlotChange(): void {
    if (!this.valid) {
      return;
    }
    this.syncAvatars();
    this.checkComposition();
  }

  /**
   * The wrapper takes no box (`display: contents`), so the avatars and the count stay flex
   * items of the host; it only hides what is inside from the accessibility tree.
   */
  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const count = countOf(this.count);
    return html`<span class="group" aria-hidden="true"><slot @slotchange=${this.onSlotChange}></slot>${count > 0
        ? html`<span class="count">+${count}</span>`
        : nothing}</span>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphAvatarStack);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-avatar-stack': NphAvatarStack;
  }
}
