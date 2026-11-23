/**
 * Demonstration frame shared by the `nph-accordion` Validation stories.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The scenery here —
 * the framed figure, the width of a cell, the stack of accordions — is NOT a precedent for component CSS: the piece
 * takes its measures from the `accordion/*` and `collapsible/*` tokens.
 *
 * The three required examples are those of the accepted documentation (frame `7428:43770`): the details of a
 * contract, grouped, with a status icon at the start and the status in text in the description; the steps of a
 * setup, separated, one section open at a time, with the pending item in text in the description; and the filters
 * of a side panel, flush, compact, several sections open. The pictures are the data URIs of `nph-avatar` and
 * `nph-image`: no real person, no new binary asset and no network address. Every visible text comes from the
 * dictionary, passed in by the story that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-accordion';
import { PHOTO_A } from '../nph-avatar/nph-avatar.demo';
import { IMAGE_B } from '../nph-image/nph-image.demo';
import type { NphAccordionItem } from '../nph-accordion-item/nph-accordion-item';
import type { NphAccordionAppearance, NphAccordionExpansion, NphAccordionSize } from './nph-accordion';

export type Scheme = 'light' | 'dark';

/** The texts of the demonstration, from the `accordionValidation` dictionary. */
export interface AccordionTexts {
  lightCaption: string;
  darkCaption: string;
  sectionOne: string;
  sectionTwo: string;
  sectionThree: string;
  bodyOne: string;
  bodyTwo: string;
  bodyThree: string;
  support: string;
  shortSupport: string;
  longTitle: string;
  longSupport: string;
  tagNew: string;
  tagPro: string;
  statusDone: string;
  statusPending: string;
  statusLate: string;
  statusAttention: string;
  startSuccess: string;
  startWarning: string;
  startError: string;
  startPending: string;
  saveLabel: string;
  lockedNote: string;
  contractTitle: string;
  contractBilling: string;
  contractBillingSupport: string;
  contractBillingBody: string;
  contractSignatures: string;
  contractSignaturesSupport: string;
  contractSignaturesBody: string;
  contractAttachments: string;
  contractAttachmentsSupport: string;
  contractAttachmentsBody: string;
  stepProducts: string;
  stepProductsSupport: string;
  stepProductsBody: string;
  stepShipping: string;
  stepShippingSupport: string;
  stepShippingBody: string;
  stepReview: string;
  stepReviewSupport: string;
  stepReviewBody: string;
  filterStatus: string;
  filterStatusBody: string;
  filterPeriod: string;
  filterPeriodBody: string;
  filterOwner: string;
  filterOwnerBody: string;
  eventOpen: string;
  eventClosed: string;
}

/** The width of an accordion inside a matrix cell: a cell sizes itself from its content and the piece brings no width. */
export const MATRIX_WIDTH = '32rem';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: 100%; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, one under the other. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/** One section: what an item takes, and the text of its content. */
export interface ItemSpec
  extends Partial<
    Pick<
      NphAccordionItem,
      | 'label'
      | 'description'
      | 'start'
      | 'icon'
      | 'mediaSrc'
      | 'startLabel'
      | 'tag'
      | 'status'
      | 'statusLabel'
      | 'indicator'
      | 'open'
      | 'disabled'
      | 'persistent'
    >
  > {
  /** What goes in the content slot; a paragraph with the text of the section when empty. */
  content?: TemplateResult;
}

export interface AccordionOptions {
  appearance?: NphAccordionAppearance;
  expansion?: NphAccordionExpansion;
  size?: NphAccordionSize;
  headingLevel?: number;
  /** The width of the frame, to force the wrap of a long title. */
  width?: string;
}

/** One section with the paragraph of its content. */
export function item(spec: ItemSpec, body: string): TemplateResult {
  const { content, label = '', description = '', start = '', icon = '', mediaSrc = '', startLabel = '', tag = '', status = '', statusLabel = '' } = spec;
  return html`<nph-accordion-item
    label=${label}
    description=${description}
    start=${start}
    icon=${icon}
    media-src=${mediaSrc}
    start-label=${startLabel}
    tag=${tag}
    status=${status}
    status-label=${statusLabel}
    indicator=${spec.indicator ?? 'end'}
    ?open=${spec.open ?? false}
    ?disabled=${spec.disabled ?? false}
    ?persistent=${spec.persistent ?? false}
    >${content ?? html`<p style="margin: 0;">${body}</p>`}</nph-accordion-item
  >`;
}

/** An accordion with the items of the specs, at the width asked for. */
export function accordion(specs: readonly ItemSpec[], bodies: readonly string[], options: AccordionOptions = {}): TemplateResult {
  const { appearance = 'grouped', expansion = 'multiple', size = 'default', headingLevel = 3, width = MATRIX_WIDTH } = options;
  return html`<div style="inline-size: ${width}; max-inline-size: 100%;">
    <nph-accordion appearance=${appearance} expansion=${expansion} size=${size} heading-level=${headingLevel}>
      ${specs.map((spec, index) => item(spec, bodies[index % bodies.length] ?? ''))}
    </nph-accordion>
  </div>`;
}

/** The three plain sections of the matrices, the first one open. */
export function plain(texts: AccordionTexts, options: AccordionOptions = {}, extra: ItemSpec = {}, openFirst = true): TemplateResult {
  return accordion(
    [
      { label: texts.sectionOne, open: openFirst, ...extra },
      { label: texts.sectionTwo, ...extra, open: false },
      { label: texts.sectionThree, ...extra, open: false },
    ],
    [texts.bodyOne, texts.bodyTwo, texts.bodyThree],
    options,
  );
}

/** The first required example: the details of a contract, grouped, a status icon at the start and the status in the description. */
export function contractExample(texts: AccordionTexts): TemplateResult {
  return accordion(
    [
      {
        label: texts.sectionOne,
        description: texts.statusDone,
        start: 'status-success',
        startLabel: texts.startSuccess,
        open: true,
      },
      {
        label: texts.contractBilling,
        description: texts.contractBillingSupport,
        start: 'status-warning',
        startLabel: texts.startWarning,
        open: true,
      },
      {
        label: texts.contractSignatures,
        description: texts.contractSignaturesSupport,
        start: 'status-pending',
        startLabel: texts.startPending,
      },
      {
        label: texts.contractAttachments,
        description: texts.contractAttachmentsSupport,
        start: 'status-error',
        startLabel: texts.startError,
      },
    ],
    [texts.bodyOne, texts.contractBillingBody, texts.contractSignaturesBody, texts.contractAttachmentsBody],
    { appearance: 'grouped' },
  );
}

/** The second required example: the steps of a setup, separated, one open at a time, the pending item in the description. */
export function stepsExample(texts: AccordionTexts): TemplateResult {
  return accordion(
    [
      { label: texts.stepProducts, description: texts.stepProductsSupport, status: 'pending', statusLabel: texts.statusPending, open: true },
      { label: texts.stepShipping, description: texts.stepShippingSupport, status: 'pending', statusLabel: texts.statusPending },
      { label: texts.stepReview, description: texts.stepReviewSupport, tag: texts.tagPro },
    ],
    [texts.stepProductsBody, texts.stepShippingBody, texts.stepReviewBody],
    { appearance: 'separated', expansion: 'single' },
  );
}

/** The third required example: the filters of a side panel with a pointer, flush, compact, several sections open. */
export function filtersExample(texts: AccordionTexts): TemplateResult {
  return accordion(
    [
      { label: texts.filterStatus, indicator: 'start', open: true },
      { label: texts.filterPeriod, indicator: 'start', open: true },
      { label: texts.filterOwner, indicator: 'start' },
    ],
    [texts.filterStatusBody, texts.filterPeriodBody, texts.filterOwnerBody],
    { appearance: 'flush', size: 'compact', width: '20rem' },
  );
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: AccordionTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${contractExample(texts)} ${stepsExample(texts)} ${filtersExample(texts)}
  </div>`;
}

/** The start media of the Figma start set, one type per accordion, in the size asked for. */
export function startMedia(texts: AccordionTexts, size: NphAccordionSize = 'default'): Array<{ label: string; cell: TemplateResult }> {
  const body = [texts.bodyOne, texts.bodyTwo, texts.bodyThree];
  const make = (specs: ItemSpec[]): TemplateResult => accordion(specs, body, { appearance: 'flush', size });
  const three = (extra: ItemSpec): ItemSpec[] => [
    { label: texts.sectionOne, ...extra },
    { label: texts.sectionTwo, ...extra },
    { label: texts.sectionThree, ...extra },
  ];
  return [
    { label: 'start: icon', cell: make(three({ start: 'icon', icon: 'gear' })) },
    { label: 'start: tile', cell: make(three({ start: 'tile', icon: 'folder' })) },
    { label: 'start: avatar', cell: make(three({ start: 'avatar', mediaSrc: PHOTO_A })) },
    { label: 'start: avatar · no photo', cell: make(three({ start: 'avatar' })) },
    { label: 'start: image', cell: make(three({ start: 'image', mediaSrc: IMAGE_B })) },
    {
      label: 'start: status-success · status-warning · status-error · status-pending',
      cell: make([
        { label: texts.sectionOne, start: 'status-success', startLabel: texts.startSuccess },
        { label: texts.sectionTwo, start: 'status-warning', startLabel: texts.startWarning },
        { label: texts.sectionThree, start: 'status-error', startLabel: texts.startError },
        { label: texts.sectionOne, start: 'status-pending', startLabel: texts.startPending },
      ]),
    },
  ];
}

/** An accordion that says what the page heard when the person opens or closes an item: the interactive example. */
export function interactive(texts: AccordionTexts): TemplateResult {
  const listen = (event: Event): void => {
    const accordionElement = event.currentTarget as HTMLElement;
    const line = accordionElement.parentElement?.parentElement?.querySelector('output');
    const open = (event as unknown as CustomEvent<{ open: boolean }>).detail.open;
    const label = (event.target as HTMLElement & { label: string }).label;
    if (line) line.textContent = `${label} — ${open ? texts.eventOpen : texts.eventClosed}`;
  };
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline); inline-size: ${MATRIX_WIDTH}; max-inline-size: 100%;">
    <div>
      <nph-accordion appearance="flush" @nph-toggle=${listen}>
        ${item({ label: texts.sectionOne }, texts.bodyOne)} ${item({ label: texts.sectionTwo }, texts.bodyTwo)}
      </nph-accordion>
    </div>
    <output style="color: var(--nph-color-muted-foreground);" aria-live="polite"></output>
  </div>`;
}

/**
 * Accessibility exception (P72, `docs/stories.md` §2.3), as in `nph-collapsible`: the gate leaves out the axe rule
 * `label-content-name-mismatch` in the stories that show a start status or a tag. Reason: the name of the trigger
 * is its whole content on purpose (title, tag, short description, status; item 11 of the accepted documentation),
 * and axe compares the name with the visible text of the button and flags the hidden text of a start status icon.
 * Alternative discarded: an `aria-label` on the button, which would hide the tag and the status that belong to the
 * name. Proposed here; for Elvys to confirm in the pull request.
 */
export const NAME_EXCEPTION = {
  a11y: { options: { rules: { 'label-content-name-mismatch': { enabled: false } } } },
};

/**
 * Accessibility exception (P72, `docs/stories.md` §2.3), for the stories that show a disabled item: the gate leaves
 * out the axe rule `color-contrast` (and the one above). Reason: the accepted contract fades the whole disabled
 * item under `collapsible/disabled-opacity` and keeps the content of a locked section in view; axe measures the
 * faded text like any text, where WCAG 1.4.3 exempts the text of an inactive component. Alternative discarded:
 * leaving the locked section out of the demonstrations, which would hide the combined state (rule T11) the contract
 * asks to show. It leaves when the gate can tell an inactive component. Proposed here; for Elvys to confirm in the
 * pull request.
 */
export const DISABLED_EXCEPTION = {
  a11y: { options: { rules: { 'label-content-name-mismatch': { enabled: false }, 'color-contrast': { enabled: false } } } },
};
