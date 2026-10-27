/**
 * Demonstration frame shared by the `nph-dialog` Validation, Fixtures and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index
 * it. The scenery here — the frames, the native fields of the examples, the sizes of each
 * frame — is NOT a precedent for component CSS: the dialog takes its measures from its own
 * tokens.
 *
 * WHY FRAMES (P87). A modal dialog sits in the top layer and covers the whole window it
 * opens in, with its veil. A page that shows several examples, each in light and dark mode
 * (`docs/stories.md`, §4.6), cannot open them all at once over itself. Each example is the
 * real component, open, in a story of its own (`Components/nph-dialog/Fixtures`, hidden from
 * the sidebar), and the pages embed that story in an `<iframe>`, one per mode: each frame is
 * a window of its own, with its own veil and its own breakpoint.
 *
 * The functions take the visible text as arguments or read it from the dictionary of the
 * page that calls them: this file holds none.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-dialog';
import type { NphDialogActions, NphDialogSize } from './nph-dialog';

export type Scheme = 'light' | 'dark';

/** The examples a frame can show. Identifiers, the same in every language. */
export const EXAMPLES = [
  'edit-profile',
  'send-for-approval',
  'import-contacts',
  'stacked',
  'publishing',
] as const;

export type Example = (typeof EXAMPLES)[number];

/** The texts of the examples, in the language of the page: the `dialogValidation` key. */
export interface ExampleTexts {
  close: string;
  cancel: string;
  save: string;
  send: string;
  import: string;
  publish: string;
  editProfileHeading: string;
  editProfileDescription: string;
  nameLabel: string;
  nameValue: string;
  emailLabel: string;
  emailValue: string;
  sendHeading: string;
  sendDescription: string;
  importHeading: string;
  importDescription: string;
  contacts: string[];
  publishHeading: string;
  publishDescription: string;
}

/** The dialog an example asks for: size, actions and lines. */
interface Setup {
  size: NphDialogSize;
  actions: NphDialogActions;
  lines: boolean;
}

const SETUP: Record<Example, Setup> = {
  'edit-profile': { size: 'md', actions: 'inline', lines: false },
  'send-for-approval': { size: 'sm', actions: 'inline', lines: false },
  'import-contacts': { size: 'lg', actions: 'inline', lines: true },
  stacked: { size: 'md', actions: 'stacked', lines: false },
  publishing: { size: 'sm', actions: 'inline', lines: false },
};

/** A native field of the example, in the dialog's own text roles. The frame is not a precedent. */
function field(id: string, label: string, value: string): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
    <label
      for=${id}
      style="font-family: var(--nph-text-label-md-font-family); font-size: var(--nph-text-label-md-font-size); font-weight: var(--nph-text-label-md-font-weight); line-height: var(--nph-text-label-md-line-height);"
      >${label}</label
    >
    <input
      id=${id}
      .value=${value}
      style="box-sizing: border-box; inline-size: var(--nph-layout-dialog-content-md); max-inline-size: 100%; block-size: var(--nph-control-height-default); padding-inline: var(--nph-space-control-padding); border: var(--nph-border-width) solid var(--nph-color-input); border-radius: var(--nph-radius-control); background: var(--nph-color-background); color: var(--nph-color-foreground); font-family: var(--nph-text-body-md-font-family); font-size: var(--nph-text-body-md-font-size);"
    />
  </div>`;
}

function body(example: Example, t: ExampleTexts): TemplateResult | typeof nothing {
  switch (example) {
    case 'edit-profile':
    case 'stacked':
      return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
        ${field(`${example}-name`, t.nameLabel, t.nameValue)} ${field(`${example}-email`, t.emailLabel, t.emailValue)}
      </div>`;
    case 'import-contacts':
      return html`<ul
        style="margin: 0; padding-inline-start: var(--nph-space-container-padding); inline-size: var(--nph-layout-dialog-content-lg); max-inline-size: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); font-family: var(--nph-text-body-md-font-family); font-size: var(--nph-text-body-md-font-size); line-height: var(--nph-text-body-md-line-height);"
      >
        ${t.contacts.map((contact) => html`<li>${contact}</li>`)}
      </ul>`;
    default:
      return nothing;
  }
}

function footer(example: Example, t: ExampleTexts): TemplateResult {
  const cancel = html`<nph-button slot="footer" severity="secondary" text=${t.cancel}></nph-button>`;
  switch (example) {
    case 'send-for-approval':
      return html`${cancel}<nph-button slot="footer" text=${t.send}></nph-button>`;
    case 'import-contacts':
      return html`${cancel}<nph-button slot="footer" text=${t.import}></nph-button>`;
    case 'publishing':
      return html`${cancel}<nph-button slot="footer" text=${t.publish} loading></nph-button>`;
    default:
      return html`${cancel}<nph-button slot="footer" text=${t.save}></nph-button>`;
  }
}

function headingOf(example: Example, t: ExampleTexts): { heading: string; description: string } {
  switch (example) {
    case 'send-for-approval':
      return { heading: t.sendHeading, description: t.sendDescription };
    case 'import-contacts':
      return { heading: t.importHeading, description: t.importDescription };
    case 'publishing':
      return { heading: t.publishHeading, description: t.publishDescription };
    default:
      return { heading: t.editProfileHeading, description: t.editProfileDescription };
  }
}

/** A size or an arrangement of the actions other than the example's own, for the matrix. */
export interface Variant {
  size?: NphDialogSize;
  actions?: NphDialogActions;
}

function setupOf(name: Example, variant: Variant = {}): Setup {
  return { ...SETUP[name], ...variant };
}

/** The real dialog of an example, open unless the page opens it itself. */
export function example(name: Example, t: ExampleTexts, variant: Variant = {}, open = true): TemplateResult {
  const setup = setupOf(name, variant);
  const { heading, description } = headingOf(name, t);
  return html`<nph-dialog
    heading=${heading}
    description=${description}
    size=${setup.size}
    actions=${setup.actions}
    close-label=${t.close}
    ?header-separator=${setup.lines}
    ?footer-separator=${setup.lines}
    ?open=${open}
    >${body(name, t)}${footer(name, t)}</nph-dialog
  >`;
}

/** Story id of the hidden page that shows one example, open, in the window of a frame. */
export const FIXTURE_STORY = 'components-nph-dialog-fixtures--example';

/** The address of the frame of an example, in a mode and a language. */
export function fixtureSrc(name: Example, scheme: Scheme, locale: string, variant: Variant = {}): string {
  const args = [`example:${name}`, ...Object.entries(variant).map(([key, value]) => `${key}:${value}`)].join(';');
  const globals = `colorScheme:${scheme};locale:${locale}`;
  return `iframe.html?id=${FIXTURE_STORY}&viewMode=story&args=${encodeURIComponent(args)}&globals=${encodeURIComponent(globals)}`;
}

/*
 * The size of each frame, only from tokens. The width leaves the dialog its ceiling and the
 * edge of the window; the stacked example stays below the `md` breakpoint on purpose. The
 * height is a share of `layout/dialog-max-height`; stacked actions take the height of the
 * stacked example.
 */
const FRAME_WIDTH: Record<NphDialogSize, string> = {
  sm: 'calc(var(--nph-layout-dialog-sm) + 2 * var(--nph-layout-margin-compact))',
  md: 'calc(var(--nph-layout-dialog-md) + 2 * var(--nph-layout-margin-compact))',
  lg: 'calc(var(--nph-layout-dialog-lg) + 2 * var(--nph-layout-margin-compact))',
};

const FRAME_HEIGHT: Record<Example, string> = {
  'edit-profile': 'calc(var(--nph-layout-dialog-max-height) * 0.6)',
  'send-for-approval': 'calc(var(--nph-layout-dialog-max-height) * 0.45)',
  'import-contacts': 'calc(var(--nph-layout-dialog-max-height) * 0.75)',
  stacked: 'calc(var(--nph-layout-dialog-max-height) * 0.75)',
  publishing: 'calc(var(--nph-layout-dialog-max-height) * 0.45)',
};

/**
 * One example in a mode, in a window of its own, with a caption below. The mode is pinned on
 * the window, not on the figure: the caption sits on the page and is read in the page's mode.
 * Pinned on the figure, a dark caption landed on a light page (P72 gate, `color-contrast`).
 */
export function framed(
  name: Example,
  scheme: Scheme,
  locale: string,
  title: string,
  caption: string,
  variant: Variant = {},
): TemplateResult {
  const setup = setupOf(name, variant);
  return html`<figure
    data-nph-dialog-example=${name}
    data-nph-dialog-size=${setup.size}
    data-nph-dialog-actions=${setup.actions}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); max-inline-size: 100%;"
  >
    <iframe
      data-nph-color-scheme=${scheme}
      title=${title}
      src=${fixtureSrc(name, scheme, locale, variant)}
      loading="lazy"
      style="display: block; inline-size: ${FRAME_WIDTH[setup.size]}; max-inline-size: 100%; block-size: ${setup.actions === 'stacked' ? FRAME_HEIGHT.stacked : FRAME_HEIGHT[name]}; border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); background: var(--nph-color-background);"
    ></iframe>
    ${caption !== ''
      ? html`<figcaption style="color: var(--nph-color-muted-foreground); font-family: var(--nph-text-caption-font-family); font-size: var(--nph-text-caption-font-size); line-height: var(--nph-text-caption-line-height);">${caption}</figcaption>`
      : nothing}
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(
  name: Example,
  locale: string,
  title: string,
  captions: { light: string; dark: string },
): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
    ${framed(name, 'light', locale, title, captions.light)} ${framed(name, 'dark', locale, title, captions.dark)}
  </div>`;
}
