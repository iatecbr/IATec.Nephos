/**
 * VALIDATION stories of `nph-carousel`.
 *
 * They prove the contract accepted in Figma (documentation frame `5173:1429`, root `5164:663`, sets
 * `5165:1094`, `5164:771` and `5164:687`) and decision P129: the three layouts at the start, in the
 * middle and at the end of the sequence, the controls bar with the arrows, the indicators and the
 * counter turned on and off, a sequence with more slides than the indicators hold, the own event
 * `nph-slide-change` with the slide the product keeps, the three required examples of the frame —
 * "Image gallery", "Featured cards" and "Many slides" — and the seven brands. Every story shows the
 * same carousel in light and in dark mode, in the same story, through `data-nph-color-scheme` on the
 * frame (P20, P67).
 *
 * Hover, focus and the drag belong to the controls and show up by using them: move the mouse over an
 * indicator, press Tab and use the arrow keys, or drag the strip; the component test measures each
 * state. No attribute forces a state, because it would be API. Each page opens with what it proves,
 * from the dictionary (`validationPages.claims`). The captions and the names come from the language
 * dictionary, under the key `carouselValidation` (`docs/i18n.md`, "Storybook"); the row and column
 * names of the matrices are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-carousel';
import type { NphCarouselSlideChangeDetail } from './nph-carousel';
import { featured, gallery, inScheme, many, sample } from './nph-carousel.demo';
import type { Scheme } from './nph-carousel.demo';

const meta: Meta = {
  title: 'Components/nph-carousel/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).carouselValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-carousel',
  storyId: `components-nph-carousel-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-carousel', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** The three layouts at the start, in the middle and at the end: the Figma properties `layout` and `posição`. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(
          label,
          ['position: start', 'position: middle', 'position: end'],
          [
            {
              label: 'layout: single',
              cells: [0, 1, 3].map((index) => sample(v, { layout: 'single', count: 4, index })),
            },
            {
              label: 'layout: several',
              cells: [0, 2, 4].map((index) => sample(v, { layout: 'several', count: 6, index })),
            },
            {
              label: 'layout: peek',
              cells: [0, 1, 3].map((index) => sample(v, { layout: 'peek', count: 4, index })),
            },
          ],
        ),
      ),
    );
  },
};

/** The controls bar: both controls, one of them, the counter, and the two together with the indicators off. */
export const Controls: Story = {
  name: 'Controls',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('controls'),
      inBothModes(context, 'controls', (label) =>
        matrix(
          label,
          ['arrows: on', 'arrows: off'],
          [
            {
              label: 'indicators: on · counter: off',
              cells: [sample(v, { index: 1 }), sample(v, { index: 1, hideArrows: true })],
            },
            {
              label: 'indicators: on · counter: on',
              cells: [sample(v, { index: 1, counter: true }), sample(v, { index: 1, counter: true, hideArrows: true })],
            },
            {
              label: 'indicators: off · counter: on',
              cells: [sample(v, { index: 1, hideIndicators: true, counter: true }), html``],
            },
          ],
        ),
      ),
    );
  },
};

/** More slides than the indicators hold: above five pages the indicators go off and the counter comes on, in the several layout counting pages. */
export const ManySlides: Story = {
  name: 'Many slides',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('many-slides'),
      inBothModes(context, 'many-slides', (label) =>
        matrix(label, ['layout: single', 'layout: several'], [
          {
            label: 'slides: 8',
            cells: [sample(v, { count: 8, index: 1 }), sample(v, { layout: 'several', count: 12, index: 2 })],
          },
        ]),
      ),
    );
  },
};

/** The status text under a carousel: it is replaced by a listener, and the product keeps `detail.index`. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const onChange = (event: CustomEvent<NphCarouselSlideChangeDetail>): void => {
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    if (status) {
      status.textContent = format(v.statusChanged, { index: String(event.detail.index) });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @nph-slide-change=${onChange}>
    ${gallery(v)}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** An arrow, an indicator, a key or a drag fires `nph-slide-change`; `detail.index` is what the product stores and gives back through `index`. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('interactive'), inBothModes(context, 'interactive', () => interactive(context))),
};

/** The three required examples of the accepted frame, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', () => gallery(v), v.exampleGallery)}
        ${inBothModes(context, 'examples', () => featured(v, v.featuredLabel), v.exampleFeatured)}
        ${inBothModes(context, 'examples', () => many(v, v.manyLabel), v.exampleMany)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the current indicator and the focus border follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-carousel', page('brands').storyId), () => sample(v, { layout: 'peek', index: 1 })),
    );
  },
};
