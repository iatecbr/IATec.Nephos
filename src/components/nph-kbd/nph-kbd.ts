/**
 * `nph-kbd` — a keyboard shortcut key, static.
 *
 * Contract accepted in Figma (frame `1193:20`, component `772:3`) and P66:
 * - `text`, the text of ONE key (`tecla` in Figma). A combination joins one
 *   piece per key, side by side;
 * - empty or only spaces: nothing is shown. Not an error: it is the state
 *   before the consumer fills in the text;
 * - no interaction: no focus, click, event, slot, variant or `::part`;
 * - the screen reader announces the key by its own text, inside `<kbd>`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import kbdCss from './nph-kbd.css?inline';

const TAG = 'nph-kbd';

/** Internal mark, not API: present only when there is text to show. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export class NphKbd extends LitElement {
  static override styles = unsafeCSS(kbdCss);

  static override properties = {
    text: { type: String },
  };

  /** The text of one key. Empty or only spaces: nothing is shown. */
  declare text: string;

  constructor() {
    super();
    this.text = '';
  }

  protected override willUpdate(): void {
    this.toggleAttribute(RENDERED_ATTRIBUTE, (this.text ?? '').trim() !== '');
  }

  protected override render(): TemplateResult | typeof nothing {
    const content = (this.text ?? '').trim();
    if (content === '') {
      return nothing;
    }
    return html`<kbd>${content}</kbd>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphKbd);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-kbd': NphKbd;
  }
}
