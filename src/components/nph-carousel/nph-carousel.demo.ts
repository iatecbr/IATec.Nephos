/**
 * Demonstration frame shared by the `nph-carousel` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the framed figure, the width of the frame, the example slide — is NOT a
 * precedent for component CSS: the carousel takes its gaps, indicators and peek from the
 * `carousel/*` tokens, and the width of the frame is the consumer's to give. The example slide is
 * the one of the accepted frame: an `nph-image` of the `media` size, ratio 16:9, and two
 * `nph-skeleton` lines, stacked with `space/stack-snug`. The slide has no photo, so the image draws
 * its frame only (the empty state of DSA-51).
 *
 * The functions take every visible text as an argument: this file holds none, because every
 * visible text comes from the language dictionary of the page that calls it. The names the product
 * gives the carousel (arrows, indicators, slides) come from the same dictionary, as a product
 * would give them, already localized.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-image/nph-image';
import '../nph-skeleton/nph-skeleton';
import './nph-carousel';
import type { NphCarouselLayout } from './nph-carousel';

export type Scheme = 'light' | 'dark';

/** The names a product gives the carousel, already localized. */
export interface CarouselNames {
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly indicatorsLabel: string;
  readonly slideLabel: string;
  readonly pageLabel: string;
  readonly positionLabel: string;
  readonly gallery: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/**
 * The width the frame gives each layout, built from the tokens of the slide: one slide, two slides
 * and a gap, or one slide, a gap and the peek (the 256, 520 and 296 of the accepted frame).
 */
export function widthOf(layout: NphCarouselLayout): string {
  switch (layout) {
    case 'several':
      return 'calc(2 * var(--nph-image-media-width) + var(--nph-carousel-slide-gap))';
    case 'peek':
      return 'calc(var(--nph-image-media-width) + var(--nph-carousel-slide-gap) + var(--nph-carousel-peek-size))';
    default:
      return 'var(--nph-image-media-width)';
  }
}

/** One example slide: an image frame and two lines, `space/stack-snug` apart. */
export function slide(): TemplateResult {
  return html`<div
    style="display: flex; flex-direction: column; gap: var(--nph-space-stack-snug); inline-size: var(--nph-image-media-width);"
  >
    <nph-image size="media" ratio="16:9"></nph-image>
    <nph-skeleton></nph-skeleton>
    <div style="inline-size: 60%;"><nph-skeleton></nph-skeleton></div>
  </div>`;
}

export interface SampleOptions {
  layout?: NphCarouselLayout;
  /** How many slides. Four by default. */
  count?: number;
  /** The first slide in view. */
  index?: number;
  counter?: boolean;
  hideArrows?: boolean;
  hideIndicators?: boolean;
  /** The region name; the gallery name by default. */
  label?: string;
}

/** A carousel in a frame of the width its layout needs. */
export function sample(names: CarouselNames, options: SampleOptions = {}): TemplateResult {
  const layout = options.layout ?? 'single';
  return html`<div style="inline-size: ${widthOf(layout)}; max-inline-size: 100%;">
    <nph-carousel
      layout=${layout}
      .index=${options.index ?? 0}
      ?counter=${options.counter === true}
      ?hide-arrows=${options.hideArrows === true}
      ?hide-indicators=${options.hideIndicators === true}
      label=${options.label ?? names.gallery}
      previous-label=${names.previousLabel}
      next-label=${names.nextLabel}
      indicators-label=${names.indicatorsLabel}
      slide-label=${names.slideLabel}
      page-label=${names.pageLabel}
      position-label=${names.positionLabel}
    >
      ${Array.from({ length: options.count ?? 4 }, () => slide())}
    </nph-carousel>
  </div>`;
}

/** Image gallery: peek, in the middle of the sequence, with arrows and indicators. */
export function gallery(names: CarouselNames): TemplateResult {
  return sample(names, { layout: 'peek', index: 1, count: 4 });
}

/** Featured cards: several, at the start; the previous arrow is disabled there. */
export function featured(names: CarouselNames, label: string): TemplateResult {
  return sample(names, { layout: 'several', count: 6, label });
}

/** More slides than the indicators hold: indicators off by themselves and the counter on, with the total. */
export function many(names: CarouselNames, label: string): TemplateResult {
  return sample(names, { layout: 'single', count: 8, index: 1, label });
}
