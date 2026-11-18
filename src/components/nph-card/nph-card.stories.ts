/**
 * VALIDATION stories of `nph-card`.
 *
 * They prove the contract accepted in Figma (documentation frame `6516:13647`, root `6478:6670`, sets `6478:6673`
 * and `6478:7282`) and decision P130: the three types in the two surfaces, the two densities, the four media
 * options and the move of the side media to the top on a narrow container, the three pieces of the start, the
 * states (default, loading and the disabled clickable card), the section card with its key-value list, the parts that
 * turn on and off, a collection as a list with the title as a heading, the five required examples of the frame —
 * summary with actions, navigable collection, detail block, profile and file — and the seven brands. Every story
 * shows the same cards in light and in dark mode, in the same story, through `data-nph-color-scheme` on the
 * frame (P20, P67).
 *
 * Hover and keyboard focus belong to the clickable card and show up by using it: move the mouse over it, or press
 * Tab; the component test measures each one. No attribute forces a state, because it would be API. Each page
 * opens with what it proves, from the dictionary (`validationPages.claims`). The captions and the card texts come
 * from the language dictionary, under the key `cardValidation` (`docs/i18n.md`, "Storybook"); the names of the combinations
 * are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-card';
import { cardGrid, collection, detail, file, inBlock, inScheme, nested, profile, sample, summary } from './nph-card.demo';
import type { CardText, GridEntry, Scheme } from './nph-card.demo';

const meta: Meta = {
  title: 'Components/nph-card/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): CardText {
  return translations(localeOf(context)).cardValidation as CardText;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

const page = (storyId: string) => ({
  piece: 'nph-card',
  storyId: `components-nph-card-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode and, when given, the example. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-card', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** The three types in the two surfaces: the Figma properties `tipo` and `superfície`. */
export const Types: Story = {
  name: 'Types',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('types'),
      inBothModes(context, 'types', (label) =>
        cardGrid(
          label,
          (['elevated', 'outlined'] as const).flatMap((surface) => [
            { label: `type: base · surface: ${surface}`, content: sample(v, { surface, status: true, content: true, action: true }) },
            { label: `type: clickable · surface: ${surface}`, content: sample(v, { type: 'clickable', surface }) },
            { label: `type: section · surface: ${surface}`, content: sample(v, { type: 'section', surface, action: true, footer: false, description: false }) },
          ]),
        ),
      ),
    );
  },
};

/** The two densities: padding, title style, start size and footer padding follow it, on the three types. */
export const Densities: Story = {
  name: 'Densities',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('densities'),
      inBothModes(context, 'densities', (label) =>
        cardGrid(
          label,
          (['default', 'compact'] as const).flatMap((density) => [
            { label: `type: base · density: ${density}`, content: sample(v, { density, content: true }) },
            { label: `type: clickable · density: ${density}`, content: sample(v, { type: 'clickable', density }) },
            { label: `type: section · density: ${density}`, content: sample(v, { type: 'section', density, footer: false, description: false }) },
          ]),
        ),
      ),
    );
  },
};

/** The four media options on the base and the clickable type; the side media goes to the top on a narrow container. */
export const Media: Story = {
  name: 'Media',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const entries = (type: 'base' | 'clickable'): GridEntry[] => [
      { label: `type: ${type} · media: top`, content: sample(v, { type, media: 'top', content: type === 'base' }) },
      { label: `type: ${type} · media: inset-top`, content: sample(v, { type, media: 'inset-top', content: type === 'base' }) },
      { label: `type: ${type} · media: side`, content: sample(v, { type, media: 'side', content: type === 'base', width: 'wide' }) },
      { label: `type: ${type} · media: side · narrow container`, content: sample(v, { type, media: 'side', content: type === 'base', width: 'narrow' }) },
    ];
    return validationPage(
      context,
      page('media'),
      inBothModes(context, 'media', (label) => cardGrid(label, [...entries('base'), ...entries('clickable')])),
    );
  },
};

/** The start holds one piece at a time: the tonal icon box, the avatar or the image, sized by the density. */
export const Start: Story = {
  name: 'Start',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('start'),
      inBothModes(context, 'start', (label) =>
        cardGrid(
          label,
          (['default', 'compact'] as const).flatMap((density) => [
            { label: `start: icon · density: ${density}`, content: sample(v, { density, footer: false }) },
            { label: `start: avatar · density: ${density}`, content: sample(v, { density, start: 'avatar', footer: false }) },
            { label: `start: image · density: ${density}`, content: sample(v, { density, start: 'image', footer: false }) },
          ]),
        ),
      ),
    );
  },
};

/** Default and loading on every type; the disabled state exists only on the clickable card. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      inBothModes(context, 'states', (label) =>
        cardGrid(label, [
          { label: 'type: base · state: default', content: sample(v, { content: true }) },
          { label: 'type: clickable · state: default', content: sample(v, { type: 'clickable' }) },
          { label: 'type: section · state: default', content: sample(v, { type: 'section', description: false }) },
          { label: 'type: base · state: loading', content: sample(v, { loading: true }) },
          { label: 'type: clickable · state: loading', content: sample(v, { type: 'clickable', loading: true }) },
          { label: 'type: section · state: loading', content: sample(v, { type: 'section', loading: true }) },
          { label: 'type: clickable · state: disabled', content: sample(v, { type: 'clickable', disabled: true }) },
        ]),
      ),
    );
  },
};

/** The section card: a block of data with the key-value list, a text action in the header and a tonal section. */
export const Section: Story = {
  name: 'Section',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('section'),
      inBothModes(context, 'section', (label) =>
        cardGrid(label, [
          { label: 'type: section · list', content: sample(v, { type: 'section', footer: false, description: false }) },
          { label: 'type: section · list · header action', content: sample(v, { type: 'section', action: true, footer: false, description: false }) },
          {
            label: 'type: section · surface: outlined · header action · tonal section · footer',
            content: sample(v, { type: 'section', surface: 'outlined', action: true, section: true, description: true }),
          },
        ]),
      ),
    );
  },
};

/** The parts that turn on and off: the minimum, the default and the maximum, and the footer with no divider. */
export const Parts: Story = {
  name: 'Parts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('parts'),
      inBothModes(context, 'parts', (label) =>
        cardGrid(label, [
          { label: 'minimum: density: compact · title only', content: sample(v, { density: 'compact', icon: '', description: false, footer: false }) },
          { label: 'default: start and description', content: sample(v, { footer: false }) },
          { label: 'maximum: every part on', content: sample(v, { status: true, content: true, section: true, action: true }) },
          { label: 'hide-divider: footer without the line', content: sample(v, { hideDivider: true }) },
        ]),
      ),
    );
  },
};

/** A collection is a named list, one `li` per card, and the title of each card is a heading with the link inside. */
export const Collection: Story = {
  name: 'Collection',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('collection'),
      html`<div style=${stack}>
        ${inBothModes(context, 'collection', () => collection(v))}
        ${inBothModes(context, 'collection', () => collection(v, true), v.collectionMediaCaption)}
      </div>`,
    );
  },
};

/** The five required examples of the accepted frame, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', () => summary(v), v.exampleSummary)}
        ${inBothModes(context, 'examples', () => collection(v, true), v.exampleCollection)}
        ${inBothModes(context, 'examples', () => detail(v), v.exampleDetail)}
        ${inBothModes(context, 'examples', () => profile(v), v.exampleProfile)}
        ${inBothModes(context, 'examples', () => file(v), v.exampleFile)}
        ${inBothModes(context, 'examples', () => nested(v), v.exampleNested)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the tonal icon box and the buttons follow the brand of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-card', page('brands').storyId), () =>
        html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline);">
          ${sample(v, { status: true, content: true })}
          ${inBlock(html`<nph-card type="clickable" density="compact" href="#" heading=${v.linkHeading} icon="folder"></nph-card>`)}
        </div>`,
      ),
    );
  },
};
