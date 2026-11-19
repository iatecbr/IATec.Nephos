/**
 * Demonstration frame and fixtures shared by the `nph-card` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The scenery here —
 * the framed figure, the width of the block the card sits in, the list of a collection — is NOT a precedent for
 * component CSS: the card takes every measure from its own tokens and its width from its container.
 *
 * The pictures are the data URIs of `nph-avatar` and `nph-image`: no real person, no new binary asset and no
 * network address. The functions take the visible text as arguments: this file holds none, because every visible
 * text comes from the language dictionary of the page that calls it.
 *
 * The five required examples are those of the accepted frame: a summary with actions, a navigable collection, a
 * detail block in a panel, a profile and a file.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-card';
import '../nph-avatar/nph-avatar';
import '../nph-badge/nph-badge';
import '../nph-button/nph-button';
import '../nph-image/nph-image';
import { textRole } from '../../shared/docs/page';
import { PHOTO_A } from '../nph-avatar/nph-avatar.demo';
import { IMAGE_A, IMAGE_B, IMAGE_WIDE } from '../nph-image/nph-image.demo';
import type { NphCard, NphCardDensity, NphCardMedia, NphCardSurface, NphCardType } from './nph-card';

export type Scheme = 'light' | 'dark';

/** The texts of the demonstration, from the dictionary (`cardValidation`). */
export interface CardText {
  lightCaption: string;
  darkCaption: string;
  collectionMediaCaption: string;
  exampleSummary: string;
  exampleCollection: string;
  exampleDetail: string;
  exampleProfile: string;
  exampleFile: string;
  exampleNested: string;
  heading: string;
  description: string;
  content: string;
  status: string;
  sectionLabel: string;
  sectionText: string;
  cancel: string;
  approve: string;
  menuLabel: string;
  imageAlt: string;
  linkHeading: string;
  linkDescription: string;
  linkMeta: string;
  sectionHeading: string;
  sectionDescription: string;
  keyCustomer: string;
  valueCustomer: string;
  keyPlan: string;
  valuePlan: string;
  keyTotal: string;
  valueTotal: string;
  edit: string;
  personHeading: string;
  personDescription: string;
  personMessage: string;
  personProfile: string;
  fileHeading: string;
  fileDescription: string;
  fileImageAlt: string;
  fileMenuLabel: string;
  loadingLabel: string;
  collectionLabel: string;
  collectionHeadingA: string;
  collectionHeadingB: string;
  collectionHeadingC: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens (P67). A story is
 * never duplicated per mode. The surface is the page background, where an elevated card sits.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); flex: 1 1 var(--nph-layout-dialog-sm); min-inline-size: 0; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The width of the block a card sits in: the card has none of its own and takes its container's. */
export type Width = 'narrow' | 'default' | 'wide';

const WIDTHS: Record<Width, string> = {
  narrow: 'var(--nph-layout-dialog-min-width)',
  default: 'var(--nph-layout-dialog-sm)',
  wide: 'var(--nph-layout-dialog-md)',
};

/** A block of a given width around a card, so a card in a grid cell has a width to take; it shrinks to the room. */
export function inBlock(content: TemplateResult, width: Width = 'default'): TemplateResult {
  return html`<div style="inline-size: ${WIDTHS[width]}; max-inline-size: 100%; text-align: start;">${content}</div>`;
}

/** One labelled entry of a grid: the label names the combination, in the technical names of the attributes. */
export interface GridEntry {
  label: string;
  content: TemplateResult;
}

/**
 * The cards of a story in a grid that wraps, each under the name of its combination. Cards are wide, so a table
 * with a column per property would scroll sideways; the grid lets each card take the room of the page.
 */
export function cardGrid(label: string, entries: readonly GridEntry[]): TemplateResult {
  return html`<div
    role="group"
    aria-label=${label}
    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--nph-layout-dialog-sm)), 1fr)); gap: var(--nph-space-section) var(--nph-space-stack); align-items: start; inline-size: 100%;"
  >
    ${entries.map(
      (entry) => html`<figure style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline-tight); min-inline-size: 0;">
        <figcaption style="${textRole('caption')} color: var(--nph-color-muted-foreground);">${entry.label}</figcaption>
        ${entry.content}
      </figure>`,
    )}
  </div>`;
}

/** The menu action of the base card: an icon-only ghost button, named with the verb and the card title. */
function menu(label: string): TemplateResult {
  return html`<nph-button
    slot="action"
    severity="secondary"
    emphasis="ghost"
    size="compact"
    icon-start="ellipsis-vertical"
    label=${label}
  ></nph-button>`;
}

/** The two footer actions: secondary first, the main one last. */
function footer(d: CardText): TemplateResult {
  return html`<nph-button slot="footer" severity="secondary" text=${d.cancel}></nph-button
    ><nph-button slot="footer" text=${d.approve}></nph-button>`;
}

function media(d: CardText, src: string = IMAGE_WIDE): TemplateResult {
  return html`<nph-image slot="media" src=${src} alt=${d.imageAlt}></nph-image>`;
}

export interface SampleOptions {
  type?: NphCardType;
  surface?: NphCardSurface;
  density?: NphCardDensity;
  media?: NphCardMedia;
  width?: Width;
  /** The start icon: a core name. */
  icon?: string;
  /** What the start holds instead of the icon. */
  start?: 'avatar' | 'image';
  status?: boolean;
  description?: boolean;
  content?: boolean;
  section?: boolean;
  footer?: boolean;
  /** The menu action (base type) or the text action (section type). */
  action?: boolean;
  hideDivider?: boolean;
  disabled?: boolean;
  loading?: boolean;
  headingLevel?: NphCard['headingLevel'];
}

/** One card with the parts asked for. The defaults are those of the Figma default variant: start and description on. */
export function sample(d: CardText, options: SampleOptions = {}): TemplateResult {
  const {
    type = 'base',
    surface = 'elevated',
    density = 'default',
    media: mediaOption = 'none',
    width = 'default',
    icon = 'folder',
    start,
    status = false,
    description = true,
    content = false,
    section = false,
    footer: footerOption,
    action = false,
    hideDivider = false,
    disabled = false,
    loading = false,
    headingLevel = 3,
  } = options;
  const clickable = type === 'clickable';
  const isSection = type === 'section';
  const withFooter = footerOption ?? type !== 'clickable';
  const items = isSection
    ? [
        { key: d.keyCustomer, value: d.valueCustomer },
        { key: d.keyPlan, value: d.valuePlan },
        { key: d.keyTotal, value: d.valueTotal },
      ]
    : [];
  return inBlock(
    html`<nph-card
      type=${type}
      surface=${surface}
      density=${density}
      media=${mediaOption}
      heading=${isSection ? d.sectionHeading : clickable ? d.linkHeading : d.heading}
      heading-level=${String(headingLevel)}
      description=${description ? (isSection ? d.sectionDescription : clickable ? d.linkDescription : d.description) : nothing}
      icon=${start === undefined && icon !== '' ? icon : nothing}
      href=${clickable ? '#' : nothing}
      loading-label=${d.loadingLabel}
      .items=${items}
      ?disabled=${disabled}
      ?loading=${loading}
      ?hide-divider=${hideDivider}
    >
      ${mediaOption !== 'none' && !isSection ? media(d) : nothing}
      ${start === 'avatar' ? html`<nph-avatar slot="leading" src=${PHOTO_A} label=${d.personHeading}></nph-avatar>` : nothing}
      ${start === 'image' ? html`<nph-image slot="leading" src=${IMAGE_B} alt=${d.fileImageAlt}></nph-image>` : nothing}
      ${status ? html`<nph-badge slot="status" text=${d.status} severity="secondary" emphasis="light"></nph-badge>` : nothing}
      ${action && type === 'base' ? menu(d.menuLabel) : nothing}
      ${action && isSection ? html`<nph-button slot="action" severity="secondary" size="compact" text=${d.edit}></nph-button>` : nothing}
      ${content && !isSection ? html`<span>${d.content}</span>` : nothing}
      ${section && !clickable
        ? html`<span slot="section" style="color: var(--nph-card-description-foreground);">${d.sectionLabel}</span
            ><span slot="section">${d.sectionText}</span>`
        : nothing}
      ${clickable && withFooter ? html`<span slot="footer">${d.linkMeta}</span>` : nothing}
      ${!clickable && withFooter ? footer(d) : nothing}
    </nph-card>`,
    width,
  );
}

/** Example 1: summary with actions — base elevated, with status, tonal section, divider and one main action. */
export function summary(d: CardText): TemplateResult {
  return sample(d, { status: true, content: true, section: true, action: true });
}

/** A list of clickable cards: the collection is the consumer's `ul` and `li`, named, with the title as a heading. */
export function collection(d: CardText, withMedia = false): TemplateResult {
  const heads = [d.collectionHeadingA, d.collectionHeadingB, d.collectionHeadingC];
  return html`<ul
    aria-label=${d.collectionLabel}
    style="list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--nph-layout-dialog-min-width)), 1fr)); gap: var(--nph-space-stack); inline-size: 100%; max-inline-size: calc(var(--nph-layout-dialog-sm) * 2);"
  >
    ${heads.map(
      (heading, position) => html`<li>
        <nph-card type="clickable" href="#" heading=${heading} description=${d.linkDescription} media=${withMedia ? 'top' : 'none'} icon=${withMedia ? nothing : 'folder'}>
          ${withMedia ? media(d, [IMAGE_WIDE, IMAGE_A, IMAGE_B][position] ?? IMAGE_WIDE) : nothing}
          <span slot="footer">${d.linkMeta}</span>
        </nph-card>
      </li>`,
    )}
  </ul>`;
}

/** Example 3: detail block in a panel — section outlined with a header action. */
export function detail(d: CardText): TemplateResult {
  return sample(d, { type: 'section', surface: 'outlined', action: true, footer: false, description: false });
}

/** Example 4: profile — base with an avatar with a photo at the start. */
export function profile(d: CardText): TemplateResult {
  return inBlock(
    html`<nph-card heading=${d.personHeading} description=${d.personDescription}>
      <nph-avatar slot="leading" src=${PHOTO_A} label=${d.personHeading}></nph-avatar>
      <nph-button slot="footer" severity="secondary" text=${d.personMessage}></nph-button>
      <nph-button slot="footer" text=${d.personProfile}></nph-button>
    </nph-card>`,
  );
}

/** Example 5: file — base outlined, a thumbnail at the start and the menu action, no footer. */
export function file(d: CardText): TemplateResult {
  return inBlock(
    html`<nph-card surface="outlined" heading=${d.fileHeading} description=${d.fileDescription}>
      <nph-image slot="leading" src=${IMAGE_B} alt=${d.fileImageAlt}></nph-image>
      ${menu(d.fileMenuLabel)}
    </nph-card>`,
  );
}

/** The same card on an outlined surface inside another surface: the use of `outlined` the sheet recommends. */
export function nested(d: CardText): TemplateResult {
  return html`<div
    style="display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-container-padding); background: var(--nph-color-card); border: var(--nph-border-width) solid var(--nph-color-border-subtle); border-radius: var(--nph-radius-surface); inline-size: var(--nph-layout-dialog-sm); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${sample(d, { surface: 'outlined', description: true, content: true, footer: false })}
  </div>`;
}
