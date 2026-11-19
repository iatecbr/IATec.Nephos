/**
 * Tests of `nph-carousel` (P129), in a real browser (P21, item 5): the width of a slide, how many
 * fit, the Tab order, hover, focus and a drag only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `5173:1429`, sets `5165:1094`,
 * `5164:771` and `5164:687`) and decision P129: the API, the three layouts and their widths, the
 * pages of the several layout and what a resize does, the arrows and the indicators, the counter,
 * the roles of the APG tabbed carousel, the keys, the hand-over of the focus, the own event, the
 * names by language, the drag and the swipe, right-to-left text, the composition warnings, the
 * invalid input and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-carousel.css?raw';
import {
  NPH_CAROUSEL_LAYOUTS,
  NPH_CAROUSEL_MAX_INDICATORS,
  NPH_CAROUSEL_SLIDE_CHANGE_EVENT,
  NphCarousel,
} from './nph-carousel';
import type { NphCarouselSlideChangeDetail } from './nph-carousel';

/** A slide is 256 wide, as the example slide of the Figma, and the gap and the peek are 8 and 32. */
const SLIDE = 256;
const GAP = 8;
const PEEK = 32;

interface Spec {
  layout?: string;
  count?: number;
  /** The width of the frame the carousel lives in. */
  width?: number;
  index?: number;
  attributes?: Record<string, string>;
  hideArrows?: boolean;
  hideIndicators?: boolean;
  counter?: boolean;
  dir?: 'ltr' | 'rtl';
  lang?: string;
  /** `null` leaves the carousel with no name. */
  label?: string | null;
}

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

function slide(index: number): HTMLElement {
  const element = document.createElement('div');
  element.style.cssText = `inline-size: ${String(SLIDE)}px; block-size: 192px;`;
  element.innerHTML = `<span>Slide content ${String(index + 1)}</span> <button type="button">Action ${String(index + 1)}</button>`;
  return element;
}

async function mount(spec: Spec = {}): Promise<NphCarousel> {
  const frame = document.createElement('div');
  frame.style.cssText = `inline-size: ${String(spec.width ?? SLIDE)}px;`;
  if (spec.dir !== undefined) frame.dir = spec.dir;
  if (spec.lang !== undefined) frame.lang = spec.lang;
  const carousel = document.createElement('nph-carousel');
  if (spec.layout !== undefined) carousel.setAttribute('layout', spec.layout);
  if (spec.label !== null) carousel.label = spec.label ?? 'Gallery';
  if (spec.index !== undefined) carousel.index = spec.index;
  if (spec.hideArrows) carousel.hideArrows = true;
  if (spec.hideIndicators) carousel.hideIndicators = true;
  if (spec.counter) carousel.counter = true;
  for (const [name, value] of Object.entries(spec.attributes ?? {})) carousel.setAttribute(name, value);
  carousel.append(...Array.from({ length: spec.count ?? 4 }, (_unused, index) => slide(index)));
  frame.append(carousel);
  document.body.append(frame);
  await settle(carousel);
  return carousel;
}

/** The carousel, its buttons and the observers have settled. */
async function settle(carousel: NphCarousel): Promise<void> {
  await carousel.updateComplete;
  await Promise.all(
    [...carousel.shadowRoot!.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-button')].map(
      (button) => button.updateComplete,
    ),
  );
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined))));
  await carousel.updateComplete;
  /* The strip moves on a transition: wait until it stops, so a position is read where it ends. */
  const strip = carousel.shadowRoot!.querySelector('.strip');
  await Promise.all((strip?.getAnimations() ?? []).map((animation) => animation.finished.catch(() => undefined)));
}

function root(carousel: NphCarousel): HTMLElement {
  return carousel.shadowRoot!.querySelector<HTMLElement>('.root')!;
}

function track(carousel: NphCarousel): HTMLElement {
  return carousel.shadowRoot!.querySelector<HTMLElement>('.track')!;
}

function strip(carousel: NphCarousel): HTMLElement {
  return carousel.shadowRoot!.querySelector<HTMLElement>('.strip')!;
}

function boxes(carousel: NphCarousel): HTMLElement[] {
  return [...carousel.shadowRoot!.querySelectorAll<HTMLElement>('.slide')];
}

function tabs(carousel: NphCarousel): HTMLButtonElement[] {
  return [...carousel.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab')];
}

function arrow(carousel: NphCarousel, which: 'previous' | 'next'): (HTMLElement & { disabled: boolean; updateComplete: Promise<unknown> }) | null {
  return carousel.shadowRoot!.querySelector(`.arrow-${which}`);
}

function counter(carousel: NphCarousel): HTMLElement | null {
  return carousel.shadowRoot!.querySelector<HTMLElement>('.counter');
}

/** The distance, in pixels, from the start edge of the track to a slide box. */
function offsetOf(carousel: NphCarousel, index: number): number {
  const left = track(carousel).getBoundingClientRect().left;
  return Math.round(boxes(carousel)[index]!.getBoundingClientRect().left - left);
}

function indexes(carousel: NphCarousel): number[] {
  return boxes(carousel).flatMap((box, index) => (box.hasAttribute('inert') ? [] : [index]));
}

function press(element: HTMLElement, key: string, options: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true, ...options });
  element.dispatchEvent(event);
  return event;
}

function pointer(element: HTMLElement, type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel', x: number, y = 0, time?: number): void {
  const event = new PointerEvent(type, { bubbles: true, composed: true, button: 0, pointerId: 1, isPrimary: true, clientX: x, clientY: y });
  /* A fixed time stamp makes the velocity of a flick the same on a slow machine. */
  if (time !== undefined) Object.defineProperty(event, 'timeStamp', { value: time });
  element.dispatchEvent(event);
}

/** Drags the track by `distance` pixels along the line, with a pause long enough to keep it from being a flick. */
async function drag(carousel: NphCarousel, distance: number): Promise<void> {
  const element = track(carousel);
  const box = element.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + 20;
  pointer(element, 'pointerdown', x, y);
  await new Promise((resolve) => setTimeout(resolve, 60));
  pointer(element, 'pointermove', x + distance / 2, y);
  await new Promise((resolve) => setTimeout(resolve, 60));
  pointer(element, 'pointermove', x + distance, y);
  await new Promise((resolve) => setTimeout(resolve, 200));
  pointer(element, 'pointerup', x + distance, y);
  await settle(carousel);
}

function changes(carousel: NphCarousel): number[] {
  const seen: number[] = [];
  carousel.addEventListener(NPH_CAROUSEL_SLIDE_CHANGE_EVENT, (event) => {
    seen.push((event as CustomEvent<NphCarouselSlideChangeDetail>).detail.index);
  });
  return seen;
}

describe('the API', () => {
  it('has the documented defaults', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const carousel = await mount({ label: null });
    expect(carousel.layout).toBe('single');
    expect(carousel.index).toBe(0);
    expect(carousel.hideArrows).toBe(false);
    expect(carousel.hideIndicators).toBe(false);
    expect(carousel.counter).toBe(false);
    expect(carousel.label).toBeNull();
    expect(carousel.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('is exactly the documented list of properties', () => {
    const elementProperties = (NphCarousel as unknown as { elementProperties: Map<string, { state?: boolean; attribute?: string | boolean }> })
      .elementProperties;
    const publicProperties = [...elementProperties.entries()].filter(([, options]) => options.state !== true).map(([name]) => name);
    expect(publicProperties.sort()).toEqual(
      [
        'counter',
        'hideArrows',
        'hideIndicators',
        'hostName',
        'index',
        'indicatorsLabel',
        'label',
        'layout',
        'nextLabel',
        'pageLabel',
        'positionLabel',
        'previousLabel',
        'slideLabel',
      ].sort(),
    );
  });

  it('knows the three layouts, and layout and index reflect', async () => {
    expect([...NPH_CAROUSEL_LAYOUTS]).toEqual(['single', 'several', 'peek']);
    const carousel = await mount({ layout: 'peek', index: 1 });
    expect(carousel.getAttribute('layout')).toBe('peek');
    expect(carousel.getAttribute('index')).toBe('1');
  });

  it('reads the attributes of the booleans and of the names', async () => {
    const carousel = await mount({
      attributes: { 'hide-arrows': '', 'hide-indicators': '', counter: '', 'previous-label': 'Back', 'next-label': 'Forward' },
    });
    expect(carousel.hideArrows).toBe(true);
    expect(carousel.hideIndicators).toBe(true);
    expect(carousel.counter).toBe(true);
    expect(carousel.previousLabel).toBe('Back');
    expect(carousel.nextLabel).toBe('Forward');
  });

  it('has no slot of its own: the slides are the children, and no attribute is written on them', async () => {
    const carousel = await mount();
    for (const child of carousel.children) {
      expect(child.getAttributeNames()).toEqual(['style']);
    }
    expect(carousel.shadowRoot!.querySelectorAll('slot').length).toBe(4);
    expect(carousel.shadowRoot!.querySelectorAll('slot[name]').length).toBe(0);
  });
});

describe('layout: single', () => {
  it('each slide is as wide as the track and one whole slide shows', async () => {
    const carousel = await mount({ layout: 'single', width: SLIDE });
    const width = track(carousel).clientWidth;
    expect(width).toBe(SLIDE);
    for (const box of boxes(carousel)) expect(box.offsetWidth).toBe(width);
    expect(offsetOf(carousel, 0)).toBe(0);
    expect(offsetOf(carousel, 1)).toBe(SLIDE + GAP);
    expect(indexes(carousel)).toEqual([0]);
  });

  it('the slide content stays at the start of its box', async () => {
    const carousel = await mount({ layout: 'single', width: 400 });
    const content = carousel.children[0]!.getBoundingClientRect();
    expect(Math.round(content.left - track(carousel).getBoundingClientRect().left)).toBe(0);
    expect(Math.round(content.width)).toBe(SLIDE);
  });

  it('moves one slide at a time and the strip follows the current slide', async () => {
    const carousel = await mount({ layout: 'single' });
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect(carousel.index).toBe(1);
    expect(offsetOf(carousel, 1)).toBe(0);
    expect(indexes(carousel)).toEqual([1]);
  });
});

describe('layout: peek', () => {
  it('the slide leaves room for one gap and the peek, and the next slide shows at the edge', async () => {
    const carousel = await mount({ layout: 'peek', width: SLIDE + GAP + PEEK });
    expect(boxes(carousel)[0]!.offsetWidth).toBe(SLIDE);
    const rightEdge = track(carousel).getBoundingClientRect().right;
    const next = boxes(carousel)[1]!.getBoundingClientRect();
    expect(Math.round(rightEdge - next.left)).toBe(PEEK);
  });

  it('in the middle the next slide still shows at the edge', async () => {
    const carousel = await mount({ layout: 'peek', width: SLIDE + GAP + PEEK, index: 1 });
    expect(offsetOf(carousel, 1)).toBe(0);
    const rightEdge = track(carousel).getBoundingClientRect().right;
    expect(Math.round(rightEdge - boxes(carousel)[2]!.getBoundingClientRect().left)).toBe(PEEK);
  });

  it('at the end the previous slide shows before the current one', async () => {
    const carousel = await mount({ layout: 'peek', width: SLIDE + GAP + PEEK, index: 3 });
    const area = track(carousel).getBoundingClientRect();
    const current = boxes(carousel)[3]!.getBoundingClientRect();
    expect(Math.round(area.right - current.right)).toBe(0);
    expect(Math.round(boxes(carousel)[2]!.getBoundingClientRect().right - area.left)).toBe(PEEK);
  });

  it('the neighbor at the edge is out of view: inert, and a click on it changes nothing', async () => {
    const carousel = await mount({ layout: 'peek', width: SLIDE + GAP + PEEK });
    expect(indexes(carousel)).toEqual([0]);
    expect(boxes(carousel)[1]!.hasAttribute('inert')).toBe(true);
    const seen = changes(carousel);
    boxes(carousel)[1]!.click();
    await settle(carousel);
    expect(carousel.index).toBe(0);
    expect(seen).toEqual([]);
  });
});

describe('layout: several', () => {
  it('shows as many whole slides as fit the width, and the indicators are pages', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: 2 * SLIDE + GAP });
    expect(indexes(carousel)).toEqual([0, 1]);
    expect(tabs(carousel).length).toBe(3);
    expect(boxes(carousel)[0]!.offsetWidth).toBe(SLIDE);
  });

  it('keeps the width of the content and never cuts a slide in the middle', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: 2 * SLIDE + GAP + 40 });
    expect(indexes(carousel)).toEqual([0, 1]);
    for (const box of boxes(carousel)) expect(box.offsetWidth).toBe(SLIDE);
  });

  it('one slide fits when the width is under two slides', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: SLIDE + GAP + PEEK });
    expect(indexes(carousel)).toEqual([0]);
    expect(tabs(carousel).length).toBe(5);
  });

  it('below one slide the single slide follows the width of the container', async () => {
    const carousel = await mount({ layout: 'several', count: 4, width: 200 });
    expect(boxes(carousel)[0]!.offsetWidth).toBe(200);
    expect(indexes(carousel)).toEqual([0]);
  });

  it('the last page is aligned to the end, so it shows whole slides', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: 2 * SLIDE + GAP });
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect(carousel.index).toBe(2);
    expect(indexes(carousel)).toEqual([2, 3]);
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect(carousel.index).toBe(3);
    expect(indexes(carousel)).toEqual([3, 4]);
    expect(offsetOf(carousel, 3)).toBe(0);
    expect(arrow(carousel, 'next')!.disabled).toBe(true);
  });

  it('a new width changes the pages and keeps index and the event out of it', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: 2 * SLIDE + GAP, index: 2 });
    const seen = changes(carousel);
    expect(tabs(carousel).length).toBe(3);
    expect(carousel.index).toBe(2);
    (carousel.parentElement as HTMLElement).style.inlineSize = `${String(SLIDE + GAP + PEEK)}px`;
    await vi.waitFor(() => expect(tabs(carousel).length).toBe(5));
    await settle(carousel);
    expect(carousel.index).toBe(2);
    expect(indexes(carousel)).toEqual([2]);
    expect(seen).toEqual([]);
  });

  it('with the whole sequence on one page there is nothing to go through: no controls bar', async () => {
    const carousel = await mount({ layout: 'several', count: 2, width: 2 * SLIDE + GAP });
    expect(carousel.shadowRoot!.querySelector('.controls')).toBeNull();
    expect(indexes(carousel)).toEqual([0, 1]);
  });

  it('a slide that grows once its content loads changes how many fit', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: 2 * SLIDE + GAP });
    for (const child of carousel.children) (child as HTMLElement).style.inlineSize = '300px';
    await vi.waitFor(() => expect(indexes(carousel)).toEqual([0]));
  });
});

describe('the controls bar', () => {
  it('has the previous arrow, the indicators, the next arrow and the counter, in that order', async () => {
    const carousel = await mount({ counter: true });
    const bar = carousel.shadowRoot!.querySelector('.controls')!;
    expect([...bar.children].map((child) => child.className.split(' ')[0])).toEqual(['arrow', 'tabs', 'arrow', 'counter']);
    expect(arrow(carousel, 'previous')).toBe(bar.children[0]);
    expect(arrow(carousel, 'next')).toBe(bar.children[2]);
  });

  it('is a centered row below the track', async () => {
    const carousel = await mount();
    const bar = carousel.shadowRoot!.querySelector('.controls') as HTMLElement;
    const style = getComputedStyle(bar);
    expect(style.display).toBe('flex');
    expect(style.justifyContent).toBe('center');
    expect(style.alignItems).toBe('center');
    expect(bar.getBoundingClientRect().top).toBeGreaterThan(track(carousel).getBoundingClientRect().bottom);
  });

  it('the arrows are the icon-only button, secondary, solid and circular, with the chevrons', async () => {
    const carousel = await mount();
    for (const [which, icon] of [
      ['previous', 'chevron-left'],
      ['next', 'chevron-right'],
    ] as const) {
      const button = arrow(carousel, which)!;
      expect(button.localName).toBe('nph-button');
      expect(button.getAttribute('severity')).toBe('secondary');
      expect(button.getAttribute('emphasis')).toBe('solid');
      expect(button.getAttribute('shape')).toBe('circular');
      expect(button.getAttribute('size')).toBe('default');
      expect(button.getAttribute('icon-start')).toBe(icon);
      expect(button.hasAttribute('data-nph-icon-only')).toBe(true);
    }
  });

  it('the previous arrow is disabled at the start and the next one at the end, and both are active in the middle', async () => {
    const carousel = await mount({ count: 3 });
    expect([arrow(carousel, 'previous')!.disabled, arrow(carousel, 'next')!.disabled]).toEqual([true, false]);
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect([arrow(carousel, 'previous')!.disabled, arrow(carousel, 'next')!.disabled]).toEqual([false, false]);
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect([arrow(carousel, 'previous')!.disabled, arrow(carousel, 'next')!.disabled]).toEqual([false, true]);
  });

  it('a disabled arrow takes state/disabled-opacity from the button and leaves the Tab order', async () => {
    const carousel = await mount();
    const previous = arrow(carousel, 'previous')!;
    expect(getComputedStyle(previous).opacity).toBe('0.5');
    expect(previous.shadowRoot!.querySelector('button')!.disabled).toBe(true);
  });

  it('the arrows go one slide at a time, and Enter and Space on an arrow do the same', async () => {
    const carousel = await mount({ count: 4 });
    const next = arrow(carousel, 'next')!;
    next.focus();
    await userEvent.keyboard('{Enter}');
    await settle(carousel);
    expect(carousel.index).toBe(1);
    await userEvent.keyboard(' ');
    await settle(carousel);
    expect(carousel.index).toBe(2);
    arrow(carousel, 'previous')!.click();
    await settle(carousel);
    expect(carousel.index).toBe(1);
  });

  it('shows the counter as position of total, and off by default', async () => {
    const carousel = await mount({ lang: 'en', count: 4 });
    expect(counter(carousel)).toBeNull();
    carousel.counter = true;
    await settle(carousel);
    expect(counter(carousel)!.textContent).toBe('1 of 4');
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect(counter(carousel)!.textContent).toBe('2 of 4');
  });

  it('hide-arrows leaves the indicators, and hide-indicators leaves the arrows', async () => {
    const noArrows = await mount({ hideArrows: true });
    expect(arrow(noArrows, 'previous')).toBeNull();
    expect(arrow(noArrows, 'next')).toBeNull();
    expect(tabs(noArrows).length).toBe(4);
    document.body.replaceChildren();
    const noIndicators = await mount({ hideIndicators: true, counter: true });
    expect(tabs(noIndicators).length).toBe(0);
    expect(arrow(noIndicators, 'previous')).not.toBeNull();
    expect(counter(noIndicators)).not.toBeNull();
  });

  it(`above ${String(NPH_CAROUSEL_MAX_INDICATORS)} pages the indicators go off and the counter comes on by itself`, async () => {
    const carousel = await mount({ lang: 'en', count: NPH_CAROUSEL_MAX_INDICATORS + 1 });
    expect(tabs(carousel).length).toBe(0);
    expect(counter(carousel)!.textContent).toBe('1 of 6');
    expect(arrow(carousel, 'next')).not.toBeNull();
  });

  it(`up to ${String(NPH_CAROUSEL_MAX_INDICATORS)} pages keep the indicators, with two the bar has two`, async () => {
    expect(tabs(await mount({ count: NPH_CAROUSEL_MAX_INDICATORS })).length).toBe(NPH_CAROUSEL_MAX_INDICATORS);
    document.body.replaceChildren();
    expect(tabs(await mount({ count: 2 })).length).toBe(2);
  });

  it('in the several layout the counter counts pages', async () => {
    const carousel = await mount({ lang: 'en', layout: 'several', count: 12, width: 2 * SLIDE + GAP });
    expect(counter(carousel)!.textContent).toBe('1 of 6');
    expect(tabs(carousel).length).toBe(0);
  });

  it('one slide, or none, draws no controls', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const one = await mount({ count: 1 });
    expect(one.shadowRoot!.querySelector('.controls')).toBeNull();
    document.body.replaceChildren();
    const none = await mount({ count: 0 });
    expect(none.shadowRoot!.querySelector('.controls')).toBeNull();
  });

  it('the targets of the indicators touch, 24 by 24, and the marker is a dot, the current one a wider pill', async () => {
    const carousel = await mount({ count: 3 });
    const [first, second] = tabs(carousel);
    const a = first!.getBoundingClientRect();
    const b = second!.getBoundingClientRect();
    expect([a.width, a.height]).toEqual([24, 24]);
    expect(Math.round(b.left - a.right)).toBe(0);
    const current = first!.querySelector('.marker')!.getBoundingClientRect();
    const other = second!.querySelector('.marker')!.getBoundingClientRect();
    expect([current.width, current.height]).toEqual([12, 8]);
    expect([other.width, other.height]).toEqual([8, 8]);
    expect(getComputedStyle(first!.querySelector('.marker')!).borderRadius).toBe(getComputedStyle(second!.querySelector('.marker')!).borderRadius);
  });
});

describe('the indicators are a tab group', () => {
  it('the group is a tablist with a name, each indicator a tab with aria-selected, and one Tab stop', async () => {
    const carousel = await mount({ lang: 'en' });
    const list = carousel.shadowRoot!.querySelector('.tabs')!;
    expect(list.getAttribute('role')).toBe('tablist');
    expect(list.getAttribute('aria-label')).toBe('Choose a slide');
    expect(tabs(carousel).map((tab) => tab.getAttribute('role'))).toEqual(['tab', 'tab', 'tab', 'tab']);
    expect(tabs(carousel).map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false', 'false']);
    expect(tabs(carousel).map((tab) => tab.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1']);
  });

  it('each tab controls its slide, and the reference resolves in the same root', async () => {
    const carousel = await mount();
    for (const [index, tab] of tabs(carousel).entries()) {
      const controlled = tab.getAttribute('aria-controls')!;
      expect(controlled).toBe(`slide-${String(index)}`);
      expect(carousel.shadowRoot!.getElementById(controlled)).toBe(boxes(carousel)[index]);
    }
  });

  it('in the several layout a tab controls every slide of its page', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: 2 * SLIDE + GAP });
    expect(tabs(carousel).map((tab) => tab.getAttribute('aria-controls'))).toEqual(['slide-0 slide-1', 'slide-2 slide-3', 'slide-3 slide-4']);
  });

  it('names a slide "Slide N of total" and, in the several layout, a page "Go to page N"', async () => {
    const carousel = await mount({ lang: 'en', count: 3 });
    expect(tabs(carousel).map((tab) => tab.getAttribute('aria-label'))).toEqual(['Slide 1 of 3', 'Slide 2 of 3', 'Slide 3 of 3']);
    document.body.replaceChildren();
    const several = await mount({ lang: 'en', layout: 'several', count: 5, width: 2 * SLIDE + GAP });
    expect(tabs(several).map((tab) => tab.getAttribute('aria-label'))).toEqual(['Go to page 1', 'Go to page 2', 'Go to page 3']);
  });

  it('a click on an indicator shows its slide and fires the event once', async () => {
    const carousel = await mount();
    const seen = changes(carousel);
    tabs(carousel)[2]!.click();
    await settle(carousel);
    expect(carousel.index).toBe(2);
    expect(tabs(carousel)[2]!.getAttribute('aria-selected')).toBe('true');
    expect(seen).toEqual([2]);
    tabs(carousel)[2]!.click();
    await settle(carousel);
    expect(seen).toEqual([2]);
  });

  it('Tab goes from the previous arrow to the indicators, one stop, and to the next arrow', async () => {
    const carousel = await mount({ count: 4 });
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    arrow(carousel, 'previous')!.focus();
    const seen: string[] = [];
    for (let stop = 0; stop < 2; stop += 1) {
      await userEvent.tab();
      const active = carousel.shadowRoot!.activeElement as HTMLElement;
      seen.push(active.className.split(' ').find((name) => ['tab', 'arrow-next'].includes(name)) ?? active.className);
    }
    expect(seen).toEqual(['tab', 'arrow-next']);
    expect((carousel.shadowRoot!.activeElement as HTMLElement).classList.contains('arrow-next')).toBe(true);
  });

  it('Right and Left move the focus and show the slide, and the focus stays on the indicator', async () => {
    const carousel = await mount({ count: 4 });
    const seen = changes(carousel);
    tabs(carousel)[0]!.focus();
    const right = press(tabs(carousel)[0]!, 'ArrowRight');
    await settle(carousel);
    expect(right.defaultPrevented).toBe(true);
    expect(carousel.index).toBe(1);
    expect(carousel.shadowRoot!.activeElement).toBe(tabs(carousel)[1]);
    expect(tabs(carousel).map((tab) => tab.getAttribute('tabindex'))).toEqual(['-1', '0', '-1', '-1']);
    press(tabs(carousel)[1]!, 'ArrowLeft');
    await settle(carousel);
    expect(carousel.index).toBe(0);
    expect(carousel.shadowRoot!.activeElement).toBe(tabs(carousel)[0]);
    expect(seen).toEqual([1, 0]);
  });

  it('Home and End go to the first and the last, and the arrows stop at the ends', async () => {
    const carousel = await mount({ count: 4 });
    tabs(carousel)[0]!.focus();
    press(tabs(carousel)[0]!, 'End');
    await settle(carousel);
    expect(carousel.index).toBe(3);
    expect(carousel.shadowRoot!.activeElement).toBe(tabs(carousel)[3]);
    press(tabs(carousel)[3]!, 'ArrowRight');
    await settle(carousel);
    expect(carousel.index).toBe(3);
    press(tabs(carousel)[3]!, 'Home');
    await settle(carousel);
    expect(carousel.index).toBe(0);
    expect(carousel.shadowRoot!.activeElement).toBe(tabs(carousel)[0]);
  });

  it('other keys and a modifier do nothing', async () => {
    const carousel = await mount();
    tabs(carousel)[0]!.focus();
    expect(press(tabs(carousel)[0]!, 'a').defaultPrevented).toBe(false);
    expect(press(tabs(carousel)[0]!, 'ArrowRight', { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(carousel.index).toBe(0);
  });

  it('hover paints the target of the other indicators only, and the current one has no hover', async () => {
    const carousel = await mount();
    const background = (tab: HTMLElement) => getComputedStyle(tab).backgroundColor;
    const rest = background(tabs(carousel)[1]!);
    await userEvent.hover(page.elementLocator(tabs(carousel)[1]!));
    expect(background(tabs(carousel)[1]!)).not.toBe(rest);
    await userEvent.hover(page.elementLocator(tabs(carousel)[0]!));
    expect(background(tabs(carousel)[0]!)).toBe(rest);
    await userEvent.unhover(page.elementLocator(tabs(carousel)[0]!));
  });
});

describe('semantics', () => {
  it('the carousel is a region with the role description and a name', async () => {
    const carousel = await mount({ label: 'Gallery' });
    expect(root(carousel).getAttribute('role')).toBe('region');
    expect(root(carousel).getAttribute('aria-roledescription')).toBe('carousel');
    expect(root(carousel).getAttribute('aria-label')).toBe('Gallery');
    expect(carousel.getAttribute('role')).toBeNull();
  });

  it('the host aria-label names the region when there is no label', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const carousel = await mount({ label: null, attributes: { 'aria-label': 'Featured cards' } });
    expect(root(carousel).getAttribute('aria-label')).toBe('Featured cards');
  });

  it('the track announces the new slide politely', async () => {
    const carousel = await mount();
    expect(track(carousel).getAttribute('aria-live')).toBe('polite');
  });

  it('with indicators each slide is a tabpanel named "position of total" with the role description slide', async () => {
    const carousel = await mount({ lang: 'en', count: 3 });
    expect(boxes(carousel).map((box) => box.getAttribute('role'))).toEqual(['tabpanel', 'tabpanel', 'tabpanel']);
    expect(boxes(carousel).map((box) => box.getAttribute('aria-roledescription'))).toEqual(['slide', 'slide', 'slide']);
    expect(boxes(carousel).map((box) => box.getAttribute('aria-label'))).toEqual(['1 of 3', '2 of 3', '3 of 3']);
  });

  it('without indicators each slide is a group, as in the basic carousel of the APG', async () => {
    const carousel = await mount({ lang: 'en', count: 3, hideIndicators: true, counter: true });
    expect(boxes(carousel).map((box) => box.getAttribute('role'))).toEqual(['group', 'group', 'group']);
    expect(boxes(carousel)[1]!.getAttribute('aria-roledescription')).toBe('slide');
    expect(boxes(carousel)[1]!.getAttribute('aria-label')).toBe('2 of 3');
  });

  it('in the several layout every slide names its own position, not the page', async () => {
    const carousel = await mount({ lang: 'en', layout: 'several', count: 4, width: 2 * SLIDE + GAP });
    expect(boxes(carousel).map((box) => box.getAttribute('aria-label'))).toEqual(['1 of 4', '2 of 4', '3 of 4', '4 of 4']);
  });

  it('a slide out of view is inert: its controls leave the Tab order', async () => {
    const carousel = await mount({ count: 3 });
    expect(boxes(carousel).map((box) => box.hasAttribute('inert'))).toEqual([false, true, true]);
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect(boxes(carousel).map((box) => box.hasAttribute('inert'))).toEqual([true, false, true]);
  });

  it('the inert is on the box in the shadow root, never on the slide of the consumer', async () => {
    const carousel = await mount({ count: 3 });
    for (const child of carousel.children) expect(child.hasAttribute('inert')).toBe(false);
  });

  it('in the several layout every whole slide in view keeps its controls in the content order', async () => {
    const carousel = await mount({ layout: 'several', count: 5, width: 2 * SLIDE + GAP });
    expect(indexes(carousel)).toEqual([0, 1]);
    carousel.children[0]!.querySelector('button')!.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(carousel.children[1]!.querySelector('button'));
  });

  it('every slide of the consumer is in its own box, in order', async () => {
    const carousel = await mount({ count: 3 });
    const assigned = [...carousel.shadowRoot!.querySelectorAll('slot')].map((slot) => (slot as HTMLSlotElement).assignedElements()[0]);
    expect(assigned).toEqual([...carousel.children]);
  });

  it('slides that come in or go out are drawn or dropped', async () => {
    const carousel = await mount({ count: 3 });
    carousel.append(slide(3));
    await vi.waitFor(() => expect(boxes(carousel).length).toBe(4));
    carousel.children[0]!.remove();
    await vi.waitFor(() => expect(boxes(carousel).length).toBe(3));
    await settle(carousel);
    expect(tabs(carousel).length).toBe(3);
  });
});

describe('the own event', () => {
  it('nph-slide-change bubbles, is composed, is not cancelable and carries the first slide in view', async () => {
    const carousel = await mount();
    let received: CustomEvent<NphCarouselSlideChangeDetail> | undefined;
    document.body.addEventListener(NPH_CAROUSEL_SLIDE_CHANGE_EVENT, (event) => {
      received = event as CustomEvent<NphCarouselSlideChangeDetail>;
    });
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect(received?.bubbles).toBe(true);
    expect(received?.composed).toBe(true);
    expect(received?.cancelable).toBe(false);
    expect(received?.detail).toEqual({ index: 1 });
  });

  it('is fired by arrow, indicator, key and drag, and never by code', async () => {
    const carousel = await mount({ count: 5 });
    const seen = changes(carousel);
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    tabs(carousel)[3]!.click();
    await settle(carousel);
    press(tabs(carousel)[3]!, 'ArrowLeft');
    await settle(carousel);
    await drag(carousel, -150);
    expect(seen).toEqual([1, 3, 2, 3]);
    carousel.index = 0;
    await settle(carousel);
    expect(seen).toEqual([1, 3, 2, 3]);
    expect(indexes(carousel)).toEqual([0]);
  });

  it('an index out of range shows the nearest slide, keeps what was written, and the arrows follow it', async () => {
    const carousel = await mount({ count: 3 });
    carousel.index = 10;
    await settle(carousel);
    expect(indexes(carousel)).toEqual([2]);
    expect(arrow(carousel, 'next')!.disabled).toBe(true);
    carousel.index = -4;
    await settle(carousel);
    expect(indexes(carousel)).toEqual([0]);
    expect(arrow(carousel, 'previous')!.disabled).toBe(true);
  });

  it('writing index from code moves the strip and the indicators with no event', async () => {
    const carousel = await mount({ count: 4 });
    const seen = changes(carousel);
    carousel.index = 2;
    await settle(carousel);
    expect(offsetOf(carousel, 2)).toBe(0);
    expect(tabs(carousel)[2]!.getAttribute('aria-selected')).toBe('true');
    expect(seen).toEqual([]);
  });
});

describe('the focus is not lost', () => {
  it('when the next arrow has the focus and becomes disabled at the end, the focus goes to the current indicator', async () => {
    const carousel = await mount({ count: 3, index: 1 });
    arrow(carousel, 'next')!.focus();
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    await vi.waitFor(() => expect(carousel.shadowRoot!.activeElement).toBe(tabs(carousel)[2]));
  });

  it('the previous arrow does the same at the start', async () => {
    const carousel = await mount({ count: 3, index: 1 });
    arrow(carousel, 'previous')!.focus();
    arrow(carousel, 'previous')!.click();
    await settle(carousel);
    await vi.waitFor(() => expect(carousel.shadowRoot!.activeElement).toBe(tabs(carousel)[0]));
  });

  it('with no indicators the focus goes to the other arrow', async () => {
    const carousel = await mount({ count: 3, index: 1, hideIndicators: true, counter: true });
    arrow(carousel, 'next')!.focus();
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    await vi.waitFor(() => expect(carousel.shadowRoot!.activeElement).toBe(arrow(carousel, 'previous')));
  });

  it('an arrow that keeps being active keeps the focus', async () => {
    const carousel = await mount({ count: 4 });
    arrow(carousel, 'next')!.focus();
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    expect(carousel.shadowRoot!.activeElement).toBe(arrow(carousel, 'next'));
  });

  it('when a resize takes the indicators away while one has the focus, the focus goes to an arrow', async () => {
    const carousel = await mount({ layout: 'several', count: 8, width: 2 * SLIDE + GAP });
    expect(tabs(carousel).length).toBe(4);
    tabs(carousel)[0]!.focus();
    (carousel.parentElement as HTMLElement).style.inlineSize = `${String(SLIDE)}px`;
    await vi.waitFor(() => expect(tabs(carousel).length).toBe(0));
    await vi.waitFor(() => expect(carousel.shadowRoot!.activeElement).toBe(arrow(carousel, 'next')));
  });

  it('focus visible: the indicator draws the focus border in focus/border and the halo outside the target', async () => {
    const carousel = await mount();
    tabs(carousel)[1]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    const tab = carousel.shadowRoot!.activeElement as HTMLElement;
    const before = getComputedStyle(tab, '::before');
    const after = getComputedStyle(tab, '::after');
    expect(before.borderTopWidth).toBe('1px');
    expect(before.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(parseFloat(after.borderTopWidth)).toBeGreaterThan(0);
    expect(tab.getBoundingClientRect().width).toBe(24);
  });
});

describe('names and language', () => {
  /* The default names are Portuguese and Spanish on purpose (P127): the spelling proof reads English only. */
  /* cspell:disable */
  it('the default names follow the language nearest the carousel: Portuguese, English, Spanish', async () => {
    document.documentElement.removeAttribute('lang');
    const names = async (lang?: string) => {
      document.body.replaceChildren();
      const carousel = await mount({ ...(lang === undefined ? {} : { lang }), count: 3 });
      return {
        previous: arrow(carousel, 'previous')!.getAttribute('label'),
        next: arrow(carousel, 'next')!.getAttribute('label'),
        group: carousel.shadowRoot!.querySelector('.tabs')!.getAttribute('aria-label'),
        tab: tabs(carousel)[1]!.getAttribute('aria-label'),
        slide: boxes(carousel)[1]!.getAttribute('aria-label'),
      };
    };
    expect(await names()).toEqual({
      previous: 'Slide anterior',
      next: 'Próximo slide',
      group: 'Escolher o slide',
      tab: 'Slide 2 de 3',
      slide: '2 de 3',
    });
    expect(await names('en-US')).toEqual({
      previous: 'Previous slide',
      next: 'Next slide',
      group: 'Choose a slide',
      tab: 'Slide 2 of 3',
      slide: '2 of 3',
    });
    expect(await names('es')).toEqual({
      previous: 'Diapositiva anterior',
      next: 'Diapositiva siguiente',
      group: 'Elegir una diapositiva',
      tab: 'Diapositiva 2 de 3',
      slide: '2 de 3',
    });
  });

  /* cspell:enable */
  it('the names the product gives replace the defaults, and the templates take position and total', async () => {
    const carousel = await mount({
      lang: 'en',
      count: 3,
      counter: true,
      attributes: {
        'previous-label': 'Back',
        'next-label': 'Forward',
        'indicators-label': 'Pick one',
        'slide-label': 'Card {position} out of {total}',
        'position-label': '{position}/{total}',
      },
    });
    expect(arrow(carousel, 'previous')!.getAttribute('label')).toBe('Back');
    expect(arrow(carousel, 'next')!.getAttribute('label')).toBe('Forward');
    expect(carousel.shadowRoot!.querySelector('.tabs')!.getAttribute('aria-label')).toBe('Pick one');
    expect(tabs(carousel)[2]!.getAttribute('aria-label')).toBe('Card 3 out of 3');
    expect(counter(carousel)!.textContent).toBe('1/3');
    expect(boxes(carousel)[0]!.getAttribute('aria-label')).toBe('1/3');
  });

  it('the page template names the indicators of the several layout', async () => {
    const carousel = await mount({
      lang: 'en',
      layout: 'several',
      count: 4,
      width: 2 * SLIDE + GAP,
      attributes: { 'page-label': 'Page {position}' },
    });
    expect(tabs(carousel).map((tab) => tab.getAttribute('aria-label'))).toEqual(['Page 1', 'Page 2']);
  });

  it('the arrow names are the tooltip text and the accessible name of the icon-only button', async () => {
    const carousel = await mount({ lang: 'en' });
    const next = arrow(carousel, 'next')!;
    expect(next.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('Next slide');
    expect(next.shadowRoot!.querySelector('nph-tooltip')).not.toBeNull();
  });
});

describe('the arrow icon color', () => {
  const resolved = (value: string): string => {
    const probe = document.createElement('span');
    probe.style.color = value;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  };

  it('is carousel/control-foreground at rest and in hover', async () => {
    const carousel = await mount();
    const next = arrow(carousel, 'next')!;
    const inner = next.shadowRoot!.querySelector('button')!;
    const expected = resolved('var(--nph-carousel-control-foreground)');
    expect(getComputedStyle(inner).color).toBe(expected);
    await userEvent.hover(page.elementLocator(next));
    expect(getComputedStyle(inner).color).toBe(expected);
    await userEvent.unhover(page.elementLocator(next));
  });

  it('is not the color the button gives by itself', async () => {
    const carousel = await mount();
    const standalone = document.createElement('nph-button');
    standalone.setAttribute('severity', 'secondary');
    standalone.setAttribute('shape', 'circular');
    standalone.setAttribute('icon-start', 'chevron-right');
    standalone.setAttribute('label', 'Alone');
    document.body.append(standalone);
    await (standalone as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    const own = getComputedStyle(standalone.shadowRoot!.querySelector('button')!).color;
    const inCarousel = getComputedStyle(arrow(carousel, 'next')!.shadowRoot!.querySelector('button')!).color;
    expect(inCarousel).not.toBe(own);
  });
});

describe('drag and swipe', () => {
  it('a drag past a quarter of a step moves one slide in the direction of the drag', async () => {
    const carousel = await mount({ count: 4, index: 1 });
    const seen = changes(carousel);
    await drag(carousel, -100);
    expect(carousel.index).toBe(2);
    await drag(carousel, 100);
    expect(carousel.index).toBe(1);
    expect(seen).toEqual([2, 1]);
  });

  it('a short drag goes back to the same slide, with no event', async () => {
    const carousel = await mount({ count: 4, index: 1 });
    const seen = changes(carousel);
    await drag(carousel, -40);
    expect(carousel.index).toBe(1);
    expect(offsetOf(carousel, 1)).toBe(0);
    expect(seen).toEqual([]);
  });

  it('a drag under the slop is a click and moves nothing', async () => {
    const carousel = await mount({ count: 4 });
    const seen = changes(carousel);
    const element = track(carousel);
    pointer(element, 'pointerdown', 100, 20);
    pointer(element, 'pointermove', 96, 20);
    pointer(element, 'pointerup', 96, 20);
    await settle(carousel);
    expect(seen).toEqual([]);
    expect(root(carousel).hasAttribute('data-dragging')).toBe(false);
  });

  it('a quick flick moves one slide even when it is short', async () => {
    const carousel = await mount({ count: 4 });
    const element = track(carousel);
    pointer(element, 'pointerdown', 200, 20, 1000);
    pointer(element, 'pointermove', 180, 20, 1005);
    pointer(element, 'pointermove', 150, 20, 1010);
    pointer(element, 'pointerup', 150, 20, 1010);
    await settle(carousel);
    expect(carousel.index).toBe(1);
  });

  it('one gesture moves one step only, however far it goes', async () => {
    const carousel = await mount({ count: 6 });
    await drag(carousel, -600);
    expect(carousel.index).toBe(1);
  });

  it('there is no slide to drag to at the ends: the strip comes back', async () => {
    const carousel = await mount({ count: 3 });
    const seen = changes(carousel);
    await drag(carousel, 150);
    expect(carousel.index).toBe(0);
    expect(offsetOf(carousel, 0)).toBe(0);
    expect(seen).toEqual([]);
  });

  it('the strip follows the pointer while it drags, with no transition', async () => {
    const carousel = await mount({ count: 3 });
    const element = track(carousel);
    pointer(element, 'pointerdown', 200, 20);
    pointer(element, 'pointermove', 150, 20);
    await carousel.updateComplete;
    expect(root(carousel).hasAttribute('data-dragging')).toBe(true);
    expect(getComputedStyle(strip(carousel)).transitionDuration).toBe('0s');
    expect(offsetOf(carousel, 0)).toBeLessThan(0);
    pointer(element, 'pointercancel', 150, 20);
    await settle(carousel);
    expect(offsetOf(carousel, 0)).toBe(0);
  });

  it('the click that follows a drag does not reach the content, and a plain click does', async () => {
    const carousel = await mount({ count: 3 });
    const action = carousel.children[0]!.querySelector('button')!;
    const clicks = vi.fn();
    action.addEventListener('click', clicks);
    const element = track(carousel);
    pointer(element, 'pointerdown', 200, 20);
    await new Promise((resolve) => setTimeout(resolve, 40));
    pointer(element, 'pointermove', 80, 20);
    pointer(element, 'pointerup', 80, 20);
    /* The browser sends the click right after the pointer goes up. */
    action.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
    expect(clicks).not.toHaveBeenCalled();
    await settle(carousel);
    carousel.index = 0;
    await settle(carousel);
    action.click();
    expect(clicks).toHaveBeenCalledTimes(1);
  });

  it('a drag that starts in a text field is left to the field', async () => {
    const carousel = await mount({ count: 3 });
    const input = document.createElement('input');
    carousel.children[0]!.append(input);
    const seen = changes(carousel);
    pointer(input, 'pointerdown', 200, 20);
    await new Promise((resolve) => setTimeout(resolve, 40));
    pointer(input, 'pointermove', 100, 20);
    pointer(input, 'pointerup', 100, 20);
    await settle(carousel);
    expect(seen).toEqual([]);
  });

  it('a real pointer drags the strip to the next slide, and touch-action leaves the vertical scroll to the browser', async () => {
    const carousel = await mount({ count: 4 });
    expect(getComputedStyle(track(carousel)).touchAction).toBe('pan-y');
    const source = page.elementLocator(track(carousel));
    await userEvent.dragAndDrop(source, source, { sourcePosition: { x: 200, y: 40 }, targetPosition: { x: 30, y: 40 } });
    await settle(carousel);
    expect(carousel.index).toBe(1);
  });

  it('dragging does not need to be the only way: arrows and indicators do the same', async () => {
    const carousel = await mount({ count: 4 });
    expect(arrow(carousel, 'next')).not.toBeNull();
    expect(tabs(carousel).length).toBe(4);
  });
});

describe('motion', () => {
  it('the strip moves on motion/state-duration and motion/state-easing, after the first placement', async () => {
    const carousel = await mount();
    await vi.waitFor(() => expect(carousel.hasAttribute('data-nph-ready')).toBe(true));
    const style = getComputedStyle(strip(carousel));
    const probe = document.createElement('span');
    probe.style.transitionDuration = 'var(--nph-motion-state-duration)';
    document.body.append(probe);
    expect(style.transitionDuration).toBe(getComputedStyle(probe).transitionDuration);
    expect(style.transitionProperty).toBe('transform');
    probe.remove();
  });

  it('the first placement does not animate', async () => {
    const frame = document.createElement('div');
    frame.style.inlineSize = `${String(SLIDE)}px`;
    const carousel = document.createElement('nph-carousel');
    carousel.label = 'Gallery';
    carousel.index = 2;
    carousel.append(slide(0), slide(1), slide(2));
    frame.append(carousel);
    document.body.append(frame);
    await carousel.updateComplete;
    expect(carousel.hasAttribute('data-nph-ready')).toBe(false);
  });

  it('with reduced motion the change is instant', () => {
    const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\{[^}]*transition: none/);
  });
});

describe('right-to-left text', () => {
  it('the first slide is on the right, the arrows mirror and the order of the controls follows the direction', async () => {
    const carousel = await mount({ dir: 'rtl', count: 3 });
    const area = track(carousel).getBoundingClientRect();
    expect(Math.round(area.right - boxes(carousel)[0]!.getBoundingClientRect().right)).toBe(0);
    expect(arrow(carousel, 'previous')!.getAttribute('icon-start')).toBe('chevron-right');
    expect(arrow(carousel, 'next')!.getAttribute('icon-start')).toBe('chevron-left');
    expect(arrow(carousel, 'previous')!.getBoundingClientRect().left).toBeGreaterThan(arrow(carousel, 'next')!.getBoundingClientRect().left);
  });

  it('the strip moves to the right-hand side as the slides go on', async () => {
    const carousel = await mount({ dir: 'rtl', count: 3 });
    arrow(carousel, 'next')!.click();
    await settle(carousel);
    const area = track(carousel).getBoundingClientRect();
    expect(Math.round(area.right - boxes(carousel)[1]!.getBoundingClientRect().right)).toBe(0);
    expect(indexes(carousel)).toEqual([1]);
  });

  it('Left goes to the next slide and Right to the previous one', async () => {
    const carousel = await mount({ dir: 'rtl', count: 4 });
    tabs(carousel)[0]!.focus();
    press(tabs(carousel)[0]!, 'ArrowLeft');
    await settle(carousel);
    expect(carousel.index).toBe(1);
    press(tabs(carousel)[1]!, 'ArrowRight');
    await settle(carousel);
    expect(carousel.index).toBe(0);
  });

  it('a drag to the right goes to the next slide', async () => {
    const carousel = await mount({ dir: 'rtl', count: 4 });
    await drag(carousel, 100);
    expect(carousel.index).toBe(1);
  });

  it('peek shows the next slide at the left edge', async () => {
    const carousel = await mount({ dir: 'rtl', layout: 'peek', count: 4, width: SLIDE + GAP + PEEK });
    const area = track(carousel).getBoundingClientRect();
    expect(Math.round(boxes(carousel)[1]!.getBoundingClientRect().right - area.left)).toBe(PEEK);
  });
});

describe('composition warnings: the carousel still renders', () => {
  const warned = () => vi.spyOn(console, 'warn').mockImplementation(() => undefined);

  it('fewer than two slides', async () => {
    const warn = warned();
    const carousel = await mount({ count: 1 });
    expect(warn.mock.calls.some(([message]) => String(message).includes('fewer than two slides'))).toBe(true);
    expect(carousel.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('a region with no name', async () => {
    const warn = warned();
    await mount({ label: null });
    expect(warn.mock.calls.some(([message]) => String(message).includes('no accessible name'))).toBe(true);
  });

  it('arrows and indicators both off leaves only dragging', async () => {
    const warn = warned();
    await mount({ hideArrows: true, hideIndicators: true, counter: true });
    expect(warn.mock.calls.some(([message]) => String(message).includes('only dragging is left'))).toBe(true);
  });

  it('more than five pages with the arrows off leaves only dragging', async () => {
    const warn = warned();
    await mount({ hideArrows: true, count: 7 });
    expect(warn.mock.calls.some(([message]) => String(message).includes('only dragging is left'))).toBe(true);
  });

  it('indicators off with no counter', async () => {
    const warn = warned();
    await mount({ hideIndicators: true });
    expect(warn.mock.calls.some(([message]) => String(message).includes('the indicators are off and so is the counter'))).toBe(true);
  });

  it('a well-formed carousel warns of nothing', async () => {
    const warn = warned();
    await mount({ count: 4 });
    expect(warn).not.toHaveBeenCalled();
  });

  it('each warning shows once while the problem lasts', async () => {
    const warn = warned();
    const carousel = await mount({ label: null });
    carousel.counter = true;
    await settle(carousel);
    carousel.counter = false;
    await settle(carousel);
    expect(warn.mock.calls.filter(([message]) => String(message).includes('no accessible name')).length).toBe(1);
  });
});

describe('invalid input: it renders nothing and says why, once per cause', () => {
  it('a layout outside the three values', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const carousel = await mount({ layout: 'vertical' });
    expect(carousel.hasAttribute('data-nph-rendered')).toBe(false);
    expect(carousel.shadowRoot!.querySelector('.root')).toBeNull();
    expect(getComputedStyle(carousel).display).toBe('none');
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]![0])).toContain('layout "vertical" does not exist');
    carousel.index = 1;
    await carousel.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a layout padded with whitespace', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const carousel = await mount({ layout: ' peek ' });
    expect(carousel.hasAttribute('data-nph-rendered')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('draws again when the layout becomes valid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const carousel = await mount({ layout: 'wrong' });
    carousel.layout = 'peek';
    await settle(carousel);
    expect(carousel.hasAttribute('data-nph-rendered')).toBe(true);
    expect(carousel.shadowRoot!.querySelector('.root')).not.toBeNull();
  });

  it('a carousel with no slide is a mount, not an error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const carousel = await mount({ count: 0 });
    expect(error).not.toHaveBeenCalled();
    expect(boxes(carousel)).toEqual([]);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1] ?? ''));
  const CAROUSEL = [
    '--nph-carousel-control-foreground',
    '--nph-carousel-control-gap',
    '--nph-carousel-controls-offset',
    '--nph-carousel-counter-foreground',
    '--nph-carousel-indicator-background',
    '--nph-carousel-indicator-background-current',
    '--nph-carousel-indicator-radius',
    '--nph-carousel-indicator-size',
    '--nph-carousel-indicator-target-background-hover',
    '--nph-carousel-indicator-target-radius',
    '--nph-carousel-indicator-target-size',
    '--nph-carousel-indicator-width-current',
    '--nph-carousel-peek-size',
    '--nph-carousel-slide-gap',
  ];
  const EXPECTED = [
    ...CAROUSEL,
    '--nph-border-width',
    '--nph-focus-border',
    '--nph-focus-halo',
    '--nph-focus-ring-width',
    '--nph-motion-state-duration',
    '--nph-motion-state-easing',
    '--nph-text-label-md-font-family',
    '--nph-text-label-md-font-size',
    '--nph-text-label-md-font-weight',
    '--nph-text-label-md-letter-spacing',
    '--nph-text-label-md-line-height',
  ];

  it('the CSS consumes the fourteen carousel tokens and the semantic ones named in the contract, and nothing else', () => {
    expect([...used].sort()).toEqual([...EXPECTED].sort());
  });

  it('every token exists in the generated CSS', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('every carousel token is read by the CSS', () => {
    const declared = [...new Set([...tokensCss.matchAll(/(--nph-carousel-[a-z-]+)\s*:/g)].map((match) => match[1] ?? ''))];
    expect(declared.length).toBe(14);
    for (const name of declared) {
      expect(used.has(name), name).toBe(true);
    }
  });

  it('the tokens point where the contract says', () => {
    const value = (name: string) => new RegExp(`${name}:\\s*([^;]+);`).exec(tokensCss)?.[1]?.trim();
    expect(value('--nph-carousel-indicator-background')).toBe('var(--nph-color-subtle-foreground)');
    expect(value('--nph-carousel-indicator-background-current')).toBe('var(--nph-color-primary-border)');
    expect(value('--nph-carousel-indicator-target-background-hover')).toBe('var(--nph-color-accent)');
    expect(value('--nph-carousel-indicator-size')).toBe('var(--nph-core-space-200)');
    expect(value('--nph-carousel-indicator-width-current')).toBe('var(--nph-core-space-300)');
    expect(value('--nph-carousel-indicator-target-size')).toBe('var(--nph-core-target-size-minimum)');
    expect(value('--nph-carousel-indicator-radius')).toBe('var(--nph-radius-full)');
    expect(value('--nph-carousel-indicator-target-radius')).toBe('var(--nph-radius-full)');
    expect(value('--nph-carousel-control-foreground')).toBe('var(--nph-color-muted-foreground)');
    expect(value('--nph-carousel-counter-foreground')).toBe('var(--nph-color-muted-foreground)');
    expect(value('--nph-carousel-slide-gap')).toBe('var(--nph-space-inline)');
    expect(value('--nph-carousel-control-gap')).toBe('var(--nph-space-inline)');
    expect(value('--nph-carousel-controls-offset')).toBe('var(--nph-space-stack)');
    expect(value('--nph-carousel-peek-size')).toBe('var(--nph-core-space-700)');
  });

  it('design.md names the semantic tokens the carousel tokens alias, with the position marker and the circular target', () => {
    expect(designMd).toMatch(/color\/subtle-foreground/);
    expect(designMd).toMatch(/color\/primary-border/);
    expect(designMd).toMatch(/position marker \(dot or pill\) and circular target/);
  });

  it('never consumes a core or theme token and writes no literal design value', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('the forced-colors rules keep a visible marker', () => {
    expect(cssWithoutComments).toMatch(/@media \(forced-colors: active\)[\s\S]*ButtonText[\s\S]*Highlight/);
  });

  it('the arrow color is the one override on the button, through its foreground variable', () => {
    expect(cssWithoutComments).toMatch(/\.arrow\s*\{[^}]*--_fg:\s*var\(--nph-carousel-control-foreground\)/);
  });
});
