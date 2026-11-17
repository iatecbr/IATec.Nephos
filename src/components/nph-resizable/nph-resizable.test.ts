/**
 * Tests of `nph-resizable` (P128), in a real browser (P21, item 5): sizes, the Tab order, hover,
 * focus and a real pointer only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `5123:2641`, sets `5112:1849`
 * and `5099:172`) and decision P128: the API, the layout of two and three panels in both
 * directions, the size attributes of the panels, the keyboard of the Window Splitter, the pointer
 * drag, the collapse and the restore, the collapse button, the semantics and the names, the own
 * event, the states, right-to-left text, the composition warnings, the invalid input and the token
 * contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-resizable.css?raw';
import { NPH_RESIZABLE_DIRECTIONS, NPH_RESIZABLE_RESIZE_EVENT, NphResizable } from './nph-resizable';
import type { NphResizableResizeDetail } from './nph-resizable';

/** The group is 800 wide and 400 tall; a handle is 28 (`control/height-compact`), so two panels share 772 and three share 744. */
const WIDTH = 800;
const HEIGHT = 400;
const HANDLE = 28;

interface PanelSpec {
  name?: string | null;
  attributes?: Record<string, string>;
  text?: string;
}

interface Spec {
  direction?: string;
  disabled?: boolean;
  hideCollapseButton?: boolean;
  collapseLabel?: string | null;
  expandLabel?: string | null;
  sizes?: number[];
  attributes?: Record<string, string>;
  panels?: PanelSpec[];
  dir?: 'ltr' | 'rtl';
  width?: number;
  height?: number;
}

const TWO: PanelSpec[] = [{ name: 'List' }, { name: 'Reading pane' }];
const THREE: PanelSpec[] = [{ name: 'Navigation' }, { name: 'List' }, { name: 'Reading pane' }];

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

function panel(spec: PanelSpec, index: number): HTMLElement {
  const element = document.createElement('div');
  element.textContent = spec.text ?? `Content ${index + 1}`;
  if (spec.name !== null) element.setAttribute('aria-label', spec.name ?? `Panel ${index + 1}`);
  for (const [name, value] of Object.entries(spec.attributes ?? {})) element.setAttribute(name, value);
  return element;
}

async function mount(spec: Spec = {}): Promise<NphResizable> {
  const frame = document.createElement('div');
  frame.style.cssText = `inline-size: ${spec.width ?? WIDTH}px; block-size: ${spec.height ?? HEIGHT}px;`;
  if (spec.dir !== undefined) frame.dir = spec.dir;
  const group = document.createElement('nph-resizable');
  if (spec.direction !== undefined) group.setAttribute('direction', spec.direction);
  if (spec.disabled) group.disabled = true;
  if (spec.hideCollapseButton) group.hideCollapseButton = true;
  if (spec.collapseLabel !== null) group.collapseLabel = spec.collapseLabel ?? 'Collapse panel';
  if (spec.expandLabel !== null) group.expandLabel = spec.expandLabel ?? 'Expand panel';
  if (spec.sizes !== undefined) group.sizes = spec.sizes;
  for (const [name, value] of Object.entries(spec.attributes ?? {})) group.setAttribute(name, value);
  group.append(...(spec.panels ?? TWO).map(panel));
  frame.append(group);
  document.body.append(frame);
  await settle(group);
  return group;
}

/** The group, its children and the buttons have rendered, and the observers have settled. */
async function settle(group: NphResizable): Promise<void> {
  await group.updateComplete;
  await Promise.all([...group.shadowRoot!.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-button')].map((button) => button.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  await group.updateComplete;
}

function separator(group: NphResizable, index = 0): HTMLElement {
  return group.shadowRoot!.querySelectorAll<HTMLElement>('.separator')[index]!;
}

function handle(group: NphResizable, index = 0): HTMLElement {
  return group.shadowRoot!.querySelectorAll<HTMLElement>('.handle')[index]!;
}

function panels(group: NphResizable): HTMLElement[] {
  return [...group.shadowRoot!.querySelectorAll<HTMLElement>('.panel')];
}

function collapseButton(group: NphResizable, index = 0): HTMLElement & { updateComplete: Promise<unknown> } {
  return group.shadowRoot!.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('.collapse')[index]!;
}

/** The length of each panel on the group axis, in pixels. */
function lengths(group: NphResizable): number[] {
  const vertical = group.direction === 'vertical';
  return panels(group).map((element) => (vertical ? element.getBoundingClientRect().height : element.getBoundingClientRect().width));
}

function rounded(sizes: readonly number[]): number[] {
  return sizes.map((size) => Math.round(size * 100) / 100);
}

function press(element: HTMLElement, key: string, options: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true, ...options });
  element.dispatchEvent(event);
  return event;
}

function pointer(element: HTMLElement, type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel', x: number, y = 0): void {
  element.dispatchEvent(
    new PointerEvent(type, { bubbles: true, composed: true, button: 0, pointerId: 1, isPrimary: true, clientX: x, clientY: y }),
  );
}

/** Drags the separator by `distance` pixels along the axis of the group, from its center. */
async function drag(group: NphResizable, index: number, distance: number): Promise<void> {
  const box = separator(group, index).getBoundingClientRect();
  const vertical = group.direction === 'vertical';
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  pointer(separator(group, index), 'pointerdown', x, y);
  pointer(separator(group, index), 'pointermove', vertical ? x : x + distance, vertical ? y + distance : y);
  await group.updateComplete;
}

function listen(group: NphResizable): { sizes: number[][]; spy: ReturnType<typeof vi.fn> } {
  const sizes: number[][] = [];
  const spy = vi.fn();
  group.addEventListener(NPH_RESIZABLE_RESIZE_EVENT, (event) => {
    const detail = (event as CustomEvent<NphResizableResizeDetail>).detail;
    sizes.push([...detail.sizes]);
    spy(event);
  });
  return { sizes, spy };
}

/** What a token resolves to as a property of an element, to compare with what the component draws. */
function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** A point of the separator over the top line segment: the middle of the handle is the collapse button. */
const ABOVE_THE_BUTTON = { position: { x: 14, y: 10 } };

const frameOf = (group: NphResizable): HTMLElement => group.parentElement!;

describe('registration and API', () => {
  it('defines nph-resizable only once', () => {
    expect(customElements.get('nph-resizable')).toBe(NphResizable);
  });

  it('the public API is exactly the one in P128', () => {
    const declared = [...(NphResizable as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties.entries()]
      .filter(([, options]) => options.state !== true)
      .map(([name]) => name);
    expect(declared).toEqual(['direction', 'disabled', 'hideCollapseButton', 'collapseLabel', 'expandLabel', 'sizes']);
    expect([...NPH_RESIZABLE_DIRECTIONS]).toEqual(['horizontal', 'vertical']);
  });

  it('the defaults are horizontal, enabled, with the collapse button and no sizes yet', () => {
    const group = document.createElement('nph-resizable');
    expect(group.direction).toBe('horizontal');
    expect(group.disabled).toBe(false);
    expect(group.hideCollapseButton).toBe(false);
    expect(group.sizes).toEqual([]);
  });

  it('has open Shadow DOM with manual slots, and no part', async () => {
    const group = await mount();
    expect(group.shadowRoot?.mode).toBe('open');
    expect(group.shadowRoot?.slotAssignment).toBe('manual');
    expect(group.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('has no variant, size, color, collapsed or mobile property', () => {
    const declared = [...(NphResizable as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['variant', 'size', 'color', 'collapsed', 'mobile', 'breakpoint', 'persist', 'storageKey', 'minSize', 'maxSize']) {
      expect(declared).not.toContain(name);
    }
  });

  it('reflects direction and disabled, because the internal CSS selects the handle by them', async () => {
    const group = await mount({ direction: 'vertical', disabled: true });
    expect(group.getAttribute('direction')).toBe('vertical');
    expect(group.hasAttribute('disabled')).toBe(true);
    const plain = await mount();
    expect(plain.getAttribute('direction')).toBe('horizontal');
    expect(plain.hasAttribute('disabled')).toBe(false);
  });

  it('writes no attribute on a panel: the slots are assigned by hand', async () => {
    const group = await mount();
    for (const child of group.children) {
      expect(child.hasAttribute('slot')).toBe(false);
      expect(child.assignedSlot).not.toBeNull();
    }
  });
});

describe('layout of the horizontal group', () => {
  it('two panels share what the handle leaves, in equal parts by default', async () => {
    const group = await mount();
    const [left, right] = lengths(group);
    expect(left).toBeCloseTo((WIDTH - HANDLE) / 2, 0);
    expect(right).toBeCloseTo((WIDTH - HANDLE) / 2, 0);
    expect(rounded(group.sizes)).toEqual([50, 50]);
    expect(handle(group).getBoundingClientRect().width).toBeCloseTo(HANDLE, 0);
    expect(handle(group).getBoundingClientRect().height).toBeCloseTo(HEIGHT, 0);
  });

  it('the panels stand side by side, handle between them, and fill the whole height', async () => {
    const group = await mount();
    const [left, right] = panels(group).map((element) => element.getBoundingClientRect());
    const middle = handle(group).getBoundingClientRect();
    expect(left!.right).toBeCloseTo(middle.left, 0);
    expect(middle.right).toBeCloseTo(right!.left, 0);
    expect(left!.height).toBeCloseTo(HEIGHT, 0);
    expect(right!.height).toBeCloseTo(HEIGHT, 0);
  });

  it('the default size of a panel is read from its attribute and the rest goes to the others', async () => {
    const group = await mount({ panels: [{ name: 'List', attributes: { 'default-size': '30' } }, { name: 'Reading pane' }] });
    expect(rounded(group.sizes)).toEqual([30, 70]);
    expect(lengths(group)[0]).toBeCloseTo(0.3 * (WIDTH - HANDLE), 0);
  });

  it('three panels have two handles, and the free ones share the rest equally', async () => {
    const group = await mount({
      panels: [{ name: 'Navigation', attributes: { 'default-size': '20' } }, { name: 'List' }, { name: 'Reading pane' }],
    });
    expect(group.shadowRoot!.querySelectorAll('.handle').length).toBe(2);
    expect(rounded(group.sizes)).toEqual([20, 40, 40]);
    expect(lengths(group)[1]).toBeCloseTo(0.4 * (WIDTH - 2 * HANDLE), 0);
  });

  it('sizes written by code win over the defaults, with no event', async () => {
    const group = await mount({ sizes: [25, 75] });
    const { spy } = listen(group);
    expect(rounded(group.sizes)).toEqual([25, 75]);
    group.sizes = [60, 40];
    await settle(group);
    expect(lengths(group)[0]).toBeCloseTo(0.6 * (WIDTH - HANDLE), 0);
    expect(spy).not.toHaveBeenCalled();
  });

  it('reads sizes as numbers separated by spaces', async () => {
    const group = await mount({ attributes: { sizes: ' 30   70 ' } });
    expect(rounded(group.sizes)).toEqual([30, 70]);
  });

  it('sizes that do not match the panels fall back to the defaults and say so', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ attributes: { sizes: '10 20 70' } });
    expect(rounded(group.sizes)).toEqual([50, 50]);
    expect(warn.mock.calls.map((call) => String(call[0])).join('\n')).toMatch(/sizes has 3 numbers for 2 panels/);
  });

  it('sizes that do not add up to 100 are brought to 100', async () => {
    const group = await mount({ sizes: [20, 20] });
    expect(rounded(group.sizes).reduce((total, size) => total + size, 0)).toBeCloseTo(100, 1);
  });

  it('the panel has no background of its own, the group no outline, and the padding is space/container-padding', async () => {
    const group = await mount();
    const host = getComputedStyle(group);
    expect(host.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(host.borderTopWidth).toBe('0px');
    expect(host.outlineStyle).toBe('none');
    const first = panels(group)[0]!;
    expect(getComputedStyle(first).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const content = first.querySelector<HTMLElement>('.content')!;
    expect(getComputedStyle(content).paddingLeft).toBe(resolved('padding-left', '--nph-space-container-padding'));
  });

  it('the content is aligned to the top of the panel', async () => {
    const group = await mount();
    const content = group.firstElementChild!.getBoundingClientRect();
    const first = panels(group)[0]!.getBoundingClientRect();
    expect(content.top).toBeGreaterThanOrEqual(first.top);
    expect(content.top - first.top).toBeLessThan(first.height / 2);
  });

  it('a panel that does not fit scrolls, and the sizes stay', async () => {
    const group = await mount({
      width: 300,
      panels: [{ name: 'List', text: 'x'.repeat(2000) }, { name: 'Reading pane' }],
    });
    expect(lengths(group)[0]).toBeCloseTo(0.5 * (300 - HANDLE), 0);
    expect(panels(group)[0]!.scrollWidth).toBeGreaterThanOrEqual(panels(group)[0]!.clientWidth);
  });
});

describe('layout of the vertical group', () => {
  it('the panels are stacked with the horizontal handle between them', async () => {
    const group = await mount({ direction: 'vertical' });
    const [top, bottom] = panels(group).map((element) => element.getBoundingClientRect());
    const middle = handle(group).getBoundingClientRect();
    expect(top!.bottom).toBeCloseTo(middle.top, 0);
    expect(middle.bottom).toBeCloseTo(bottom!.top, 0);
    expect(middle.height).toBeCloseTo(HANDLE, 0);
    expect(middle.width).toBeCloseTo(WIDTH, 0);
    expect(lengths(group)[0]).toBeCloseTo((HEIGHT - HANDLE) / 2, 0);
    expect(top!.width).toBeCloseTo(WIDTH, 0);
  });

  it('three stacked panels, with the sizes of the attributes', async () => {
    const group = await mount({
      direction: 'vertical',
      panels: [{ name: 'Editor', attributes: { 'default-size': '60' } }, { name: 'Console' }, { name: 'Output' }],
    });
    expect(rounded(group.sizes)).toEqual([60, 20, 20]);
    expect(lengths(group)[0]).toBeCloseTo(0.6 * (HEIGHT - 2 * HANDLE), 0);
  });

  it('the grip of the horizontal handle is the vertical grip turned a quarter', async () => {
    const vertical = await mount({ direction: 'vertical' });
    const horizontal = await mount();
    const turned = vertical.shadowRoot!.querySelector<HTMLElement>('.grip nph-icon')!;
    const upright = horizontal.shadowRoot!.querySelector<HTMLElement>('.grip nph-icon')!;
    expect(turned.getAttribute('name')).toBe('grip-vertical');
    expect(upright.getAttribute('name')).toBe('grip-vertical');
    expect(getComputedStyle(turned).rotate).toBe('90deg');
    expect(getComputedStyle(upright).rotate).toBe('none');
  });
});

describe('the parts of the handle', () => {
  it('a line segment, the grip box, the collapse button and a line segment, centered on the handle axis', async () => {
    const group = await mount();
    const parts = [...handle(group).children].filter((child) => !child.classList.contains('separator')).map((child) => child.className);
    expect(parts).toEqual(['line', 'grip', 'collapse', 'line']);
    const axis = handle(group).getBoundingClientRect();
    for (const part of handle(group).querySelectorAll<HTMLElement>('.line, .grip, .collapse')) {
      const box = part.getBoundingClientRect();
      expect(box.left + box.width / 2).toBeCloseTo(axis.left + axis.width / 2, 0);
    }
  });

  it('the segments fill the space before and after the grip and the button, with the gap of the handle', async () => {
    const group = await mount();
    const [before, after] = [...handle(group).querySelectorAll<HTMLElement>('.line')].map((line) => line.getBoundingClientRect());
    const grip = handle(group).querySelector('.grip')!.getBoundingClientRect();
    const button = collapseButton(group).getBoundingClientRect();
    const gap = Number.parseFloat(resolved('width', '--nph-resizable-handle-gap'));
    expect(grip.top - before!.bottom).toBeCloseTo(gap, 0);
    expect(button.top - grip.bottom).toBeCloseTo(gap, 0);
    expect(after!.top - button.bottom).toBeCloseTo(gap, 0);
    expect(before!.top).toBeCloseTo(handle(group).getBoundingClientRect().top, 0);
    expect(after!.bottom).toBeCloseTo(handle(group).getBoundingClientRect().bottom, 0);
  });

  it('the line is resizable/handle-width wide, in resizable/handle-color, and the grip box is resizable/grip-size', async () => {
    const group = await mount();
    const line = handle(group).querySelector<HTMLElement>('.line')!;
    expect(getComputedStyle(line).width).toBe(resolved('width', '--nph-resizable-handle-width'));
    expect(getComputedStyle(line).backgroundColor).toBe(resolved('background-color', '--nph-resizable-handle-color'));
    const grip = handle(group).querySelector<HTMLElement>('.grip')!;
    expect(getComputedStyle(grip).width).toBe(resolved('width', '--nph-resizable-grip-size'));
    expect(getComputedStyle(grip).height).toBe(resolved('height', '--nph-resizable-grip-size'));
    expect(getComputedStyle(grip).borderRadius).toBe(resolved('border-radius', '--nph-resizable-grip-radius'));
    expect(getComputedStyle(grip).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(grip).color).toBe(resolved('color', '--nph-resizable-grip-foreground'));
  });

  it('the grip icon is the light grip-vertical at the grip size, hidden from assistive technology', async () => {
    const group = await mount();
    const grip = handle(group).querySelector<HTMLElement>('.grip')!;
    expect(grip.getAttribute('aria-hidden')).toBe('true');
    const icon = grip.querySelector('nph-icon')!;
    expect(icon.getAttribute('name')).toBe('grip-vertical');
    expect(icon.getAttribute('size')).toBe('sm');
    expect(icon.hasAttribute('variant')).toBe(false);
  });

  it('the grip shows in every state: at rest, in hover, in focus and disabled', async () => {
    const group = await mount();
    const grip = handle(group).querySelector<HTMLElement>('.grip')!;
    expect(getComputedStyle(grip).display).not.toBe('none');
    await userEvent.hover(separator(group), ABOVE_THE_BUTTON);
    expect(getComputedStyle(grip).color).toBe(resolved('color', '--nph-resizable-grip-foreground'));
    const disabled = await mount({ disabled: true });
    expect(getComputedStyle(handle(disabled).querySelector<HTMLElement>('.grip')!).display).not.toBe('none');
  });

  it('the separator covers the whole handle, so the whole column is the hit area, above 24 px', async () => {
    const group = await mount();
    const box = separator(group).getBoundingClientRect();
    const column = handle(group).getBoundingClientRect();
    expect(box.width).toBeCloseTo(column.width, 0);
    expect(box.height).toBeCloseTo(column.height, 0);
    expect(box.width).toBeGreaterThan(24);
  });

  it('the segments and the grip let the pointer through to the separator', async () => {
    const group = await mount();
    for (const part of handle(group).querySelectorAll<HTMLElement>('.line, .grip')) {
      expect(getComputedStyle(part).pointerEvents).toBe('none');
    }
  });
});

describe('the keyboard', () => {
  it('the arrows on the axis move the handle 1 percent, and Shift 10 percent', async () => {
    const group = await mount();
    const { sizes } = listen(group);
    press(separator(group), 'ArrowRight');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([51, 49]);
    press(separator(group), 'ArrowRight', { shiftKey: true });
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([61, 39]);
    press(separator(group), 'ArrowLeft', { shiftKey: true });
    press(separator(group), 'ArrowLeft');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([50, 50]);
    expect(sizes.length).toBe(4);
    expect(lengths(group)[0]).toBeCloseTo(0.5 * (WIDTH - HANDLE), 0);
  });

  it('the arrows of the other axis do nothing, and the key is not stopped', async () => {
    const group = await mount();
    const { spy } = listen(group);
    for (const key of ['ArrowUp', 'ArrowDown', 'a', 'Tab', 'PageDown', 'F6', ' ']) {
      const event = press(separator(group), key);
      expect(event.defaultPrevented, key).toBe(false);
    }
    expect(rounded(group.sizes)).toEqual([50, 50]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('a vertical group answers to up and down only', async () => {
    const group = await mount({ direction: 'vertical' });
    press(separator(group), 'ArrowDown');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([51, 49]);
    press(separator(group), 'ArrowUp', { shiftKey: true });
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([41, 59]);
    const before = [...group.sizes];
    press(separator(group), 'ArrowRight');
    press(separator(group), 'ArrowLeft');
    expect(group.sizes).toEqual(before);
  });

  it('the handled keys are stopped from scrolling the page', async () => {
    const group = await mount();
    for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter']) {
      expect(press(separator(group), key).defaultPrevented, key).toBe(true);
    }
  });

  it('Home takes the main panel to its minimum and End to its maximum', async () => {
    const group = await mount({
      panels: [{ name: 'List', attributes: { 'min-size': '20', 'max-size': '60' } }, { name: 'Reading pane' }],
    });
    press(separator(group), 'Home');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([20, 80]);
    press(separator(group), 'End');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([60, 40]);
  });

  it('the maximum also stops at the minimum of the panel across the handle', async () => {
    const group = await mount({
      panels: [{ name: 'List' }, { name: 'Reading pane', attributes: { 'min-size': '30' } }],
    });
    press(separator(group), 'End');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([70, 30]);
    expect(separator(group).getAttribute('aria-valuemax')).toBe('70');
  });

  it('an arrow stops at the maximum and does not fire the event again', async () => {
    const group = await mount({
      panels: [{ name: 'List', attributes: { 'max-size': '52' } }, { name: 'Reading pane' }],
    });
    const { sizes } = listen(group);
    press(separator(group), 'ArrowRight');
    press(separator(group), 'ArrowRight');
    press(separator(group), 'ArrowRight');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([52, 48]);
    expect(sizes.length).toBe(2);
  });

  it('Enter collapses the main panel to nothing and gives the space across the handle; Enter again restores it', async () => {
    const group = await mount({ sizes: [35, 65] });
    press(separator(group), 'Enter');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([0, 100]);
    expect(lengths(group)[0]).toBeCloseTo(0, 0);
    expect(lengths(group)[1]).toBeCloseTo(WIDTH - HANDLE, 0);
    expect(separator(group).getAttribute('aria-valuenow')).toBe('0');
    press(separator(group), 'Enter');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([35, 65]);
  });

  it('a collapsed panel with a size of its own keeps that size, and Enter restores the previous one', async () => {
    const group = await mount({
      sizes: [40, 60],
      panels: [{ name: 'List', attributes: { 'collapsed-size': '5' } }, { name: 'Reading pane' }],
    });
    press(separator(group), 'Enter');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([5, 95]);
    expect(separator(group).getAttribute('aria-valuenow')).toBe('5');
    expect(separator(group).getAttribute('aria-valuemin')).toBe('5');
    press(separator(group), 'Enter');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([40, 60]);
  });

  it('a collapsed panel leaves the screen and the accessibility tree; with a size of its own it stays visible', async () => {
    const group = await mount({ sizes: [40, 60] });
    press(separator(group), 'Enter');
    await group.updateComplete;
    expect(getComputedStyle(panels(group)[0]!).visibility).toBe('hidden');
    const rail = await mount({
      sizes: [40, 60],
      panels: [{ name: 'List', attributes: { 'collapsed-size': '5' } }, { name: 'Reading pane' }],
    });
    press(separator(rail), 'Enter');
    await rail.updateComplete;
    expect(getComputedStyle(panels(rail)[0]!).visibility).toBe('visible');
  });

  it('Enter keeps working with the collapse button off', async () => {
    const group = await mount({ hideCollapseButton: true, sizes: [35, 65] });
    expect(group.shadowRoot!.querySelector('.collapse')).toBeNull();
    press(separator(group), 'Enter');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([0, 100]);
  });

  it('pushing a panel under its minimum with the arrow collapses it, and the arrow from there brings it back to the minimum', async () => {
    const group = await mount({
      sizes: [21, 79],
      panels: [{ name: 'List', attributes: { 'min-size': '20' } }, { name: 'Reading pane' }],
    });
    press(separator(group), 'ArrowLeft');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([20, 80]);
    press(separator(group), 'ArrowLeft');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([0, 100]);
    press(separator(group), 'ArrowRight');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([20, 80]);
  });

  it('the keys do nothing with a modifier other than Shift', async () => {
    const group = await mount();
    for (const options of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }]) {
      expect(press(separator(group), 'ArrowRight', options).defaultPrevented).toBe(false);
    }
    expect(rounded(group.sizes)).toEqual([50, 50]);
  });
});

describe('the pointer', () => {
  it('dragging moves the handle by the distance, in percent of what the panels share', async () => {
    const group = await mount();
    const { sizes } = listen(group);
    await drag(group, 0, 100);
    expect(group.sizes[0]).toBeCloseTo(50 + (100 / (WIDTH - HANDLE)) * 100, 1);
    expect(lengths(group)[0]).toBeCloseTo((WIDTH - HANDLE) / 2 + 100, 0);
    expect(sizes.length).toBe(1);
    pointer(separator(group), 'pointerup', 0);
  });

  it('dragging up and down moves the handle of a vertical group', async () => {
    const group = await mount({ direction: 'vertical' });
    await drag(group, 0, -80);
    expect(lengths(group)[0]).toBeCloseTo((HEIGHT - HANDLE) / 2 - 80, 0);
    pointer(separator(group), 'pointerup', 0);
  });

  it('the handle stops at the minimum and the maximum of each panel', async () => {
    const group = await mount({
      panels: [{ name: 'List', attributes: { 'min-size': '20', 'max-size': '60' } }, { name: 'Reading pane' }],
    });
    await drag(group, 0, 5000);
    expect(rounded(group.sizes)).toEqual([60, 40]);
    pointer(separator(group), 'pointerup', 0);
    await drag(group, 0, -5000);
    expect(rounded(group.sizes)).toEqual([0, 100]);
  });

  it('a limit in pixels is the same limit at any length', async () => {
    const group = await mount({
      panels: [{ name: 'List', attributes: { 'min-size': '200px', 'max-size': '300px' } }, { name: 'Reading pane' }],
    });
    press(separator(group), 'Home');
    await settle(group);
    expect(lengths(group)[0]).toBeCloseTo(200, 0);
    press(separator(group), 'End');
    await settle(group);
    expect(lengths(group)[0]).toBeCloseTo(300, 0);
  });

  it('dragging under the minimum snaps to the nearest of the collapsed size and the minimum', async () => {
    const group = await mount({
      panels: [{ name: 'List', attributes: { 'min-size': '30' } }, { name: 'Reading pane' }],
    });
    const track = WIDTH - HANDLE;
    await drag(group, 0, -0.3 * track);
    expect(rounded(group.sizes)).toEqual([30, 70]);
    pointer(separator(group), 'pointerup', 0);
    await drag(group, 0, -(0.3 - 0.1) * track);
    expect(rounded(group.sizes)).toEqual([0, 100]);
  });

  it('dragging from a collapsed panel restores it as the handle moves', async () => {
    const group = await mount({
      sizes: [0, 100],
      panels: [{ name: 'List', attributes: { 'min-size': '20' } }, { name: 'Reading pane' }],
    });
    await drag(group, 0, 0.05 * (WIDTH - HANDLE));
    expect(rounded(group.sizes)).toEqual([0, 100]);
    pointer(separator(group), 'pointerup', 0);
    await drag(group, 0, 0.4 * (WIDTH - HANDLE));
    expect(group.sizes[0]).toBeCloseTo(40, 0);
  });

  it('the grip box takes its background and its color only while the pointer drags', async () => {
    const group = await mount();
    const grip = handle(group).querySelector<HTMLElement>('.grip')!;
    expect(getComputedStyle(grip).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await drag(group, 0, 20);
    expect(handle(group).hasAttribute('data-dragging')).toBe(true);
    expect(getComputedStyle(grip).backgroundColor).toBe(resolved('background-color', '--nph-resizable-grip-background-active'));
    expect(getComputedStyle(grip).color).toBe(resolved('color', '--nph-resizable-grip-foreground-active'));
    const line = handle(group).querySelector<HTMLElement>('.line')!;
    expect(getComputedStyle(line).backgroundColor).toBe(resolved('background-color', '--nph-resizable-handle-color-hover'));
    pointer(separator(group), 'pointerup', 0);
    await group.updateComplete;
    expect(handle(group).hasAttribute('data-dragging')).toBe(false);
    expect(getComputedStyle(grip).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('moving after the release, or with another pointer, changes nothing', async () => {
    const group = await mount();
    await drag(group, 0, 40);
    pointer(separator(group), 'pointerup', 0);
    const settled = [...group.sizes];
    pointer(separator(group), 'pointermove', 900);
    expect(group.sizes).toEqual(settled);
    const box = separator(group).getBoundingClientRect();
    pointer(separator(group), 'pointerdown', box.left + 10, box.top + 10);
    separator(group).dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true, pointerId: 7, clientX: 700, clientY: 10 }));
    expect(group.sizes).toEqual(settled);
    pointer(separator(group), 'pointerup', 0);
  });

  it('a press that is not the main button, or a cancelled drag, moves nothing', async () => {
    const group = await mount();
    separator(group).dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 2, pointerId: 1, clientX: 400 }));
    pointer(separator(group), 'pointermove', 600);
    expect(rounded(group.sizes)).toEqual([50, 50]);
    await drag(group, 0, 30);
    pointer(separator(group), 'pointercancel', 0);
    await group.updateComplete;
    expect(handle(group).hasAttribute('data-dragging')).toBe(false);
    const settled = [...group.sizes];
    pointer(separator(group), 'pointermove', 700);
    expect(group.sizes).toEqual(settled);
  });

  it('a real pointer drags the handle: it presses the line, moves and releases, with the pointer captured', async () => {
    /* A frame that fits in the test viewport, so the real pointer reaches every point of it. */
    const group = await mount({ width: 360, height: 240 });
    const { sizes } = listen(group);
    const source = page.elementLocator(separator(group));
    const target = page.elementLocator(panels(group)[1]!);
    await userEvent.dragAndDrop(source, target, { sourcePosition: { x: 14, y: 10 }, targetPosition: { x: 60, y: 100 } });
    await group.updateComplete;
    expect(group.sizes[0]).toBeGreaterThan(50);
    expect(sizes.length).toBeGreaterThan(0);
    expect(handle(group).hasAttribute('data-dragging')).toBe(false);
    expect(lengths(group)[0]).toBeCloseTo((group.sizes[0]! / 100) * (360 - HANDLE), 0);
  });

  it('double click restores the default size', async () => {
    const group = await mount({ panels: [{ name: 'List', attributes: { 'default-size': '30' } }, { name: 'Reading pane' }] });
    const { sizes } = listen(group);
    press(separator(group), 'End');
    await group.updateComplete;
    separator(group).dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([30, 70]);
    expect(sizes.length).toBe(2);
  });

  it('the cursor is the resize cursor of the axis', async () => {
    const horizontal = await mount();
    const vertical = await mount({ direction: 'vertical' });
    expect(getComputedStyle(separator(horizontal)).cursor).toBe('col-resize');
    expect(getComputedStyle(separator(vertical)).cursor).toBe('row-resize');
    expect(getComputedStyle(separator(horizontal)).touchAction).toBe('none');
  });

  it('hover paints the line in resizable/handle-color-hover, and the grip stays as at rest', async () => {
    const group = await mount();
    const line = handle(group).querySelector<HTMLElement>('.line')!;
    await userEvent.hover(separator(group), ABOVE_THE_BUTTON);
    expect(getComputedStyle(line).backgroundColor).toBe(resolved('background-color', '--nph-resizable-handle-color-hover'));
    expect(getComputedStyle(handle(group).querySelector<HTMLElement>('.grip')!).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(document.activeElement).not.toBe(group);
    expect(group.shadowRoot!.activeElement).toBeNull();
  });
});

describe('three panels', () => {
  it('the first handle controls the first panel and the second handle controls the second', async () => {
    const group = await mount({ panels: THREE });
    expect(rounded(group.sizes)).toEqual([33.33, 33.33, 33.33]);
    press(separator(group, 0), 'ArrowRight', { shiftKey: true });
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([43.33, 23.33, 33.33]);
    press(separator(group, 1), 'ArrowRight', { shiftKey: true });
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([43.33, 33.33, 23.33]);
  });

  it('the space of a collapsed panel goes to the panel across the same handle', async () => {
    const group = await mount({ panels: THREE, sizes: [20, 30, 50] });
    press(separator(group, 1), 'Enter');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([20, 0, 80]);
    press(separator(group, 0), 'Enter');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([0, 20, 80]);
  });

  it('a collapsed second panel keeps the first handle from growing the first panel', async () => {
    const group = await mount({ panels: THREE, sizes: [20, 0, 80] });
    press(separator(group, 0), 'ArrowRight', { shiftKey: true });
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([20, 0, 80]);
    press(separator(group, 0), 'ArrowLeft', { shiftKey: true });
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([10, 10, 80]);
  });

  it('each handle takes its own limits: the second handle stops at the minimum of the third panel', async () => {
    const group = await mount({
      panels: [{ name: 'Navigation' }, { name: 'List' }, { name: 'Reading pane', attributes: { 'min-size': '25' } }],
      sizes: [20, 30, 50],
    });
    press(separator(group, 1), 'End');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([20, 55, 25]);
  });

  it('every handle has its own collapse button, with the label of its panel when the panel gives one', async () => {
    const group = await mount({
      panels: [
        { name: 'Navigation', attributes: { 'collapse-label': 'Collapse navigation', 'expand-label': 'Expand navigation' } },
        { name: 'List' },
        { name: 'Reading pane' },
      ],
    });
    expect(collapseButton(group, 0).getAttribute('label')).toBe('Collapse navigation');
    expect(collapseButton(group, 1).getAttribute('label')).toBe('Collapse panel');
    press(separator(group, 0), 'Enter');
    await settle(group);
    expect(collapseButton(group, 0).getAttribute('label')).toBe('Expand navigation');
    expect(collapseButton(group, 1).getAttribute('label')).toBe('Collapse panel');
  });
});

describe('the collapse button', () => {
  it('is the icon-only nph-button, secondary, ghost, compact and square, 28 by 28', async () => {
    const group = await mount();
    const button = collapseButton(group);
    expect(button.localName).toBe('nph-button');
    expect(button.getAttribute('severity')).toBe('secondary');
    expect(button.getAttribute('emphasis')).toBe('ghost');
    expect(button.getAttribute('size')).toBe('compact');
    expect(button.getAttribute('shape')).toBe('square');
    expect(button.getAttribute('text') ?? '').toBe('');
    const box = button.getBoundingClientRect();
    expect(box.width).toBeCloseTo(HANDLE, 0);
    expect(box.height).toBeCloseTo(HANDLE, 0);
    expect(box.width).toBeGreaterThan(24);
  });

  it('is on by default, and hide-collapse-button turns it off, leaving the line and the grip', async () => {
    const group = await mount({ hideCollapseButton: true });
    expect(group.shadowRoot!.querySelector('nph-button')).toBeNull();
    expect(handle(group).querySelector('.grip')).not.toBeNull();
    expect(handle(group).querySelectorAll('.line').length).toBe(2);
  });

  it('the chevron points to the main panel and flips while it is collapsed', async () => {
    const horizontal = await mount({ sizes: [40, 60] });
    expect(collapseButton(horizontal).getAttribute('icon-start')).toBe('chevron-left');
    press(separator(horizontal), 'Enter');
    await settle(horizontal);
    expect(collapseButton(horizontal).getAttribute('icon-start')).toBe('chevron-right');
    const vertical = await mount({ direction: 'vertical', sizes: [40, 60] });
    expect(collapseButton(vertical).getAttribute('icon-start')).toBe('chevron-up');
    press(separator(vertical), 'Enter');
    await settle(vertical);
    expect(collapseButton(vertical).getAttribute('icon-start')).toBe('chevron-down');
  });

  it('is named by the action: the label swaps between collapse and expand, with aria-expanded', async () => {
    const group = await mount({ collapseLabel: 'Collapse the list', expandLabel: 'Expand the list' });
    const button = collapseButton(group);
    expect(button.getAttribute('label')).toBe('Collapse the list');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    press(separator(group), 'Enter');
    await settle(group);
    expect(button.getAttribute('label')).toBe('Expand the list');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('controls the main panel, by the reflection of elements, because an id cannot cross the shadow root', async () => {
    const group = await mount();
    const native = collapseButton(group).shadowRoot!.querySelector<HTMLButtonElement & { ariaControlsElements: readonly Element[] | null }>('button')!;
    expect(native.ariaControlsElements).toEqual([group.firstElementChild]);
    expect(native.getAttribute('aria-expanded')).toBe('true');
  });

  it('a click collapses and restores the panel, the focus stays on the button and the chevron flips', async () => {
    const group = await mount({ sizes: [30, 70] });
    const { sizes } = listen(group);
    const button = collapseButton(group);
    button.querySelector?.('button');
    (button.shadowRoot!.querySelector('button') as HTMLButtonElement).focus();
    (button.shadowRoot!.querySelector('button') as HTMLButtonElement).click();
    await settle(group);
    expect(rounded(group.sizes)).toEqual([0, 100]);
    expect(group.shadowRoot!.activeElement).toBe(button);
    expect(button.getAttribute('icon-start')).toBe('chevron-right');
    (button.shadowRoot!.querySelector('button') as HTMLButtonElement).click();
    await settle(group);
    expect(rounded(group.sizes)).toEqual([30, 70]);
    expect(group.shadowRoot!.activeElement).toBe(button);
    expect(sizes.length).toBe(2);
  });

  it('Enter and Space on the button collapse it too, and it is its own Tab stop after the handle', async () => {
    const group = await mount({ sizes: [30, 70] });
    await userEvent.tab();
    expect(group.shadowRoot!.activeElement).toBe(separator(group));
    await userEvent.tab();
    expect(group.shadowRoot!.activeElement).toBe(collapseButton(group));
    await userEvent.keyboard('{Enter}');
    await settle(group);
    expect(rounded(group.sizes)).toEqual([0, 100]);
    await userEvent.keyboard(' ');
    await settle(group);
    expect(rounded(group.sizes)).toEqual([30, 70]);
  });

  it('without collapse-label and expand-label it is not drawn, and the error says so once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ collapseLabel: null, expandLabel: null });
    expect(group.shadowRoot!.querySelector('nph-button')).toBeNull();
    expect(separator(group)).toBeTruthy();
    await group.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toMatch(/collapse-label and expand-label/);
  });

  it('with the button hidden, the labels are not needed', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await mount({ collapseLabel: null, expandLabel: null, hideCollapseButton: true });
    expect(error).not.toHaveBeenCalled();
  });
});

describe('semantics and names', () => {
  it('the handle is a separator that receives focus, with the orientation of its line', async () => {
    const group = await mount();
    const element = separator(group);
    expect(element.getAttribute('role')).toBe('separator');
    expect(element.getAttribute('tabindex')).toBe('0');
    expect(element.getAttribute('aria-orientation')).toBe('vertical');
    const vertical = await mount({ direction: 'vertical' });
    expect(separator(vertical).getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('aria-valuenow is the percent of the main panel, with the minimum and the maximum it can take', async () => {
    const group = await mount({
      sizes: [35, 65],
      panels: [{ name: 'List', attributes: { 'min-size': '20', 'max-size': '60' } }, { name: 'Reading pane' }],
    });
    const element = separator(group);
    expect(element.getAttribute('aria-valuenow')).toBe('35');
    expect(element.getAttribute('aria-valuemin')).toBe('0');
    expect(element.getAttribute('aria-valuemax')).toBe('60');
    press(element, 'ArrowRight', { shiftKey: true });
    await group.updateComplete;
    expect(element.getAttribute('aria-valuenow')).toBe('45');
  });

  it('aria-valuenow is an integer from 0 to 100 and never outside the minimum and maximum', async () => {
    const group = await mount({ sizes: [33.4, 66.6] });
    const element = separator(group);
    const now = Number(element.getAttribute('aria-valuenow'));
    expect(Number.isInteger(now)).toBe(true);
    expect(now).toBeGreaterThanOrEqual(Number(element.getAttribute('aria-valuemin')));
    expect(now).toBeLessThanOrEqual(Number(element.getAttribute('aria-valuemax')));
  });

  it('aria-controls points to the main panel, with three panels each handle to its own', async () => {
    const group = await mount({ panels: THREE });
    const reflect = (index: number) => (separator(group, index) as HTMLElement & { ariaControlsElements: readonly Element[] | null }).ariaControlsElements;
    expect(reflect(0)).toEqual([group.children[0]]);
    expect(reflect(1)).toEqual([group.children[1]]);
  });

  it('the handle takes the name of the panel it controls: its aria-label', async () => {
    const group = await mount();
    expect(separator(group).getAttribute('aria-label')).toBe('List');
    group.children[0]!.setAttribute('aria-label', 'Messages');
    await settle(group);
    expect(separator(group).getAttribute('aria-label')).toBe('Messages');
  });

  it('or the elements its aria-labelledby names, never the whole panel text', async () => {
    const frame = document.createElement('div');
    frame.style.cssText = `inline-size: ${WIDTH}px; block-size: ${HEIGHT}px;`;
    const group = document.createElement('nph-resizable');
    group.collapseLabel = 'Collapse';
    group.expandLabel = 'Expand';
    const first = document.createElement('section');
    first.setAttribute('aria-labelledby', 'heading');
    first.innerHTML = '<h2 id="heading">Inbox</h2><p>A long text of the panel that is not its name.</p>';
    const second = panel({ name: 'Reading pane' }, 1);
    group.append(first, second);
    frame.append(group);
    document.body.append(frame);
    await settle(group);
    const element = separator(group) as HTMLElement & { ariaLabelledByElements: readonly Element[] | null };
    expect(element.hasAttribute('aria-label')).toBe(false);
    expect(element.ariaLabelledByElements).toEqual([first.querySelector('h2')]);
  });

  it('a panel with no name leaves the handle with none, and says so once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ panels: [{ name: null }, { name: 'Reading pane' }] });
    expect(separator(group).hasAttribute('aria-label')).toBe(false);
    await group.updateComplete;
    const named = warn.mock.calls.filter((call) => /needs a name/.test(String(call[0])));
    expect(named.length).toBe(1);
  });

  it('the host has no role of its own, and the panels are the content of the consumer', async () => {
    const group = await mount();
    expect(group.hasAttribute('role')).toBe(false);
    expect(group.getAttribute('tabindex')).toBeNull();
  });

  it('the collapse button sits beside the separator, not inside it', async () => {
    const group = await mount();
    expect(separator(group).contains(collapseButton(group))).toBe(false);
    expect(separator(group).children.length).toBe(0);
    expect(collapseButton(group).parentElement).toBe(handle(group));
  });
});

describe('focus', () => {
  it('the handle line becomes the 2 px focus border in focus/border, with no halo, and no panel shifts', async () => {
    const group = await mount();
    const line = handle(group).querySelector<HTMLElement>('.line')!;
    const before = panels(group).map((element) => element.getBoundingClientRect().width);
    await userEvent.tab();
    expect(group.shadowRoot!.activeElement).toBe(separator(group));
    expect(getComputedStyle(line).width).toBe(resolved('width', '--nph-resizable-focus-border-width'));
    expect(getComputedStyle(line).backgroundColor).toBe(resolved('background-color', '--nph-focus-border'));
    expect(getComputedStyle(separator(group)).outlineStyle).toBe('none');
    expect(getComputedStyle(line).boxShadow).toBe('none');
    expect(panels(group).map((element) => element.getBoundingClientRect().width)).toEqual(before);
  });

  it('the focus line of the horizontal handle is the height of the border', async () => {
    const group = await mount({ direction: 'vertical' });
    await userEvent.tab();
    const line = handle(group).querySelector<HTMLElement>('.line')!;
    expect(getComputedStyle(line).height).toBe(resolved('height', '--nph-resizable-focus-border-width'));
  });

  it('a pointer press focuses the handle but does not show the focus border', async () => {
    const group = await mount();
    const line = handle(group).querySelector<HTMLElement>('.line')!;
    separator(group).focus({ focusVisible: false } as FocusOptions);
    expect(group.shadowRoot!.activeElement).toBe(separator(group));
    expect(getComputedStyle(line).width).toBe(resolved('width', '--nph-resizable-handle-width'));
  });

  it('the handle and the collapse button are separate stops in the Tab order, in document order', async () => {
    const group = await mount({ panels: THREE });
    const stops: Element[] = [];
    for (let step = 0; step < 4; step += 1) {
      await userEvent.tab();
      stops.push(group.shadowRoot!.activeElement!);
    }
    expect(stops).toEqual([separator(group, 0), collapseButton(group, 0), separator(group, 1), collapseButton(group, 1)]);
  });
});

describe('disabled', () => {
  it('the whole handle takes state/disabled-opacity, the default cursor, and leaves the Tab order', async () => {
    const group = await mount({ disabled: true });
    expect(getComputedStyle(handle(group)).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(getComputedStyle(separator(group)).cursor).toBe('default');
    expect(separator(group).hasAttribute('tabindex')).toBe(false);
    expect(separator(group).getAttribute('aria-disabled')).toBe('true');
    await userEvent.tab();
    expect(group.shadowRoot!.activeElement).toBeNull();
  });

  it('the collapse button is disabled with the handle', async () => {
    const group = await mount({ disabled: true });
    expect(collapseButton(group).hasAttribute('disabled')).toBe(true);
    expect(collapseButton(group).shadowRoot!.querySelector('button')!.disabled).toBe(true);
  });

  it('the handle answers to no pointer and no key, and fires no event', async () => {
    const group = await mount({ disabled: true });
    const { spy } = listen(group);
    for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter']) press(separator(group), key);
    await drag(group, 0, 100);
    separator(group).dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
    expect(rounded(group.sizes)).toEqual([50, 50]);
    expect(spy).not.toHaveBeenCalled();
    expect(handle(group).hasAttribute('data-dragging')).toBe(false);
  });

  it('disabled wins over hover: the line stays in the color at rest', async () => {
    const group = await mount({ disabled: true });
    await userEvent.hover(separator(group), ABOVE_THE_BUTTON);
    const line = handle(group).querySelector<HTMLElement>('.line')!;
    expect(getComputedStyle(line).backgroundColor).toBe(resolved('background-color', '--nph-resizable-handle-color'));
  });

  it('turning it off while the pointer drags ends the drag', async () => {
    const group = await mount();
    await drag(group, 0, 40);
    group.disabled = true;
    await group.updateComplete;
    const settled = [...group.sizes];
    pointer(separator(group), 'pointermove', 700);
    await group.updateComplete;
    expect(group.sizes).toEqual(settled);
    expect(handle(group).hasAttribute('data-dragging')).toBe(false);
  });

  it('a disabled group still reports its sizes and is readable', async () => {
    const group = await mount({ disabled: true, sizes: [30, 70] });
    expect(separator(group).getAttribute('aria-valuenow')).toBe('30');
  });
});

describe('the own event', () => {
  it('nph-resize bubbles, is composed, is not cancelable and carries the sizes', async () => {
    const group = await mount();
    const seen: Event[] = [];
    document.addEventListener(NPH_RESIZABLE_RESIZE_EVENT, (event) => seen.push(event), { once: true });
    press(separator(group), 'ArrowRight');
    const [event] = seen as CustomEvent<NphResizableResizeDetail>[];
    expect(event?.bubbles).toBe(true);
    expect(event?.composed).toBe(true);
    expect(event?.cancelable).toBe(false);
    expect(rounded(event!.detail.sizes)).toEqual([51, 49]);
  });

  it('is fired once per change by the keyboard, the pointer, the button and the double click, and never by code', async () => {
    const group = await mount({ sizes: [30, 70] });
    const { sizes } = listen(group);
    press(separator(group), 'ArrowRight');
    await drag(group, 0, 30);
    pointer(separator(group), 'pointerup', 0);
    collapseButton(group).shadowRoot!.querySelector('button')!.click();
    separator(group).dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
    await settle(group);
    expect(sizes.length).toBe(4);
    group.sizes = [10, 90];
    group.setAttribute('sizes', '20 80');
    await settle(group);
    expect(sizes.length).toBe(4);
  });

  it('a movement that changes nothing fires nothing', async () => {
    const group = await mount({ sizes: [0, 100] });
    const { spy } = listen(group);
    press(separator(group), 'ArrowLeft');
    press(separator(group), 'Home');
    expect(spy).not.toHaveBeenCalled();
  });

  it('the sizes of the detail add up to 100', async () => {
    const group = await mount({ panels: THREE });
    const { sizes } = listen(group);
    press(separator(group, 0), 'ArrowRight', { shiftKey: true });
    expect(sizes[0]!.reduce((total, size) => total + size, 0)).toBeCloseTo(100, 5);
  });
});

describe('the panels change', () => {
  it('a panel that comes in or goes out changes the handles and the sizes, with no event', async () => {
    const group = await mount();
    const { spy } = listen(group);
    group.append(panel({ name: 'Details' }, 2));
    await settle(group);
    expect(group.shadowRoot!.querySelectorAll('.handle').length).toBe(2);
    expect(group.sizes.length).toBe(3);
    group.lastElementChild!.remove();
    await settle(group);
    expect(group.shadowRoot!.querySelectorAll('.handle').length).toBe(1);
    expect(group.sizes.length).toBe(2);
    expect(spy).not.toHaveBeenCalled();
  });

  it('an attribute of a panel that the group reads moves the limit on its own', async () => {
    const group = await mount();
    group.children[0]!.setAttribute('max-size', '40');
    await settle(group);
    expect(rounded(group.sizes)).toEqual([40, 60]);
  });

  it('a new length of the group settles a limit in pixels again, with no event', async () => {
    const group = await mount({
      sizes: [30, 70],
      panels: [{ name: 'List', attributes: { 'min-size': '300px' } }, { name: 'Reading pane' }],
    });
    const { spy } = listen(group);
    expect(lengths(group)[0]).toBeGreaterThanOrEqual(299);
    frameOf(group).style.inlineSize = '1200px';
    await new Promise((resolve) => setTimeout(resolve, 100));
    await settle(group);
    expect(lengths(group)[0]).toBeGreaterThanOrEqual(299);
    expect(spy).not.toHaveBeenCalled();
  });

  it('text and comments between the panels are not panels', async () => {
    const group = await mount();
    group.insertBefore(document.createTextNode('text'), group.children[1] ?? null);
    group.append(document.createComment('comment'));
    await settle(group);
    expect(group.shadowRoot!.querySelectorAll('.panel').length).toBe(2);
  });
});

describe('right-to-left text', () => {
  it('the start panel is on the right, the chevron mirrors and the right arrow shrinks the main panel', async () => {
    const group = await mount({ dir: 'rtl', sizes: [40, 60] });
    const [main, other] = panels(group).map((element) => element.getBoundingClientRect());
    expect(main!.left).toBeGreaterThan(other!.left);
    expect(collapseButton(group).getAttribute('icon-start')).toBe('chevron-right');
    press(separator(group), 'ArrowRight');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([39, 61]);
    press(separator(group), 'ArrowLeft', { shiftKey: true });
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([49, 51]);
    press(separator(group), 'Enter');
    await settle(group);
    expect(collapseButton(group).getAttribute('icon-start')).toBe('chevron-left');
  });

  it('dragging to the left grows the main panel', async () => {
    const group = await mount({ dir: 'rtl' });
    await drag(group, 0, -100);
    expect(lengths(group)[0]).toBeCloseTo((WIDTH - HANDLE) / 2 + 100, 0);
    pointer(separator(group), 'pointerup', 0);
  });

  it('a vertical group is not mirrored', async () => {
    const group = await mount({ dir: 'rtl', direction: 'vertical' });
    expect(collapseButton(group).getAttribute('icon-start')).toBe('chevron-up');
    press(separator(group), 'ArrowDown');
    await group.updateComplete;
    expect(rounded(group.sizes)).toEqual([51, 49]);
  });
});

describe('composition warnings: the group still renders', () => {
  const warnings = (warn: ReturnType<typeof vi.spyOn>) => warn.mock.calls.map((call) => String(call[0])).join('\n');

  it('fewer than two panels', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ panels: [{ name: 'Alone' }] });
    expect(group.shadowRoot!.querySelectorAll('.handle').length).toBe(0);
    expect(group.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warnings(warn)).toMatch(/fewer than two panels/);
  });

  it('more than three panels, and the handles are still drawn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ panels: [...THREE, { name: 'Fourth' }] });
    expect(group.shadowRoot!.querySelectorAll('.handle').length).toBe(3);
    expect(warnings(warn)).toMatch(/more than three panels: nest groups/);
  });

  it('a size that is not a number is ignored, and says so', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ panels: [{ name: 'List', attributes: { 'min-size': 'wide' } }, { name: 'Reading pane' }] });
    expect(rounded(group.sizes)).toEqual([50, 50]);
    expect(warnings(warn)).toMatch(/min-size="wide" is not a number/);
  });

  it('a minimum above the maximum raises the maximum to the minimum', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ panels: [{ name: 'List', attributes: { 'min-size': '60', 'max-size': '40' } }, { name: 'Reading pane' }] });
    expect(rounded(group.sizes)).toEqual([60, 40]);
    expect(warnings(warn)).toMatch(/min-size is above max-size/);
  });

  it('a group with no length on its axis says to give it one', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount({ width: 0 });
    expect(warnings(warn)).toMatch(/no length on its axis/);
  });

  it('a well-formed group warns of nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await mount({ panels: THREE });
    await mount({ direction: 'vertical' });
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it('each warning shows once while the problem lasts', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ panels: [{ name: 'Alone' }] });
    group.requestUpdate();
    await group.updateComplete;
    group.requestUpdate();
    await group.updateComplete;
    expect(warn.mock.calls.filter((call) => /fewer than two/.test(String(call[0]))).length).toBe(1);
  });
});

describe('invalid input: it renders nothing and says why, once per cause', () => {
  it('a direction outside horizontal and vertical', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ direction: 'diagonal' });
    expect(group.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(group).display).toBe('none');
    expect(group.shadowRoot!.children.length).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toMatch(/direction "diagonal" does not exist/);
  });

  it('a direction padded with whitespace', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ direction: ' vertical ' });
    expect(group.hasAttribute('data-nph-rendered')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('draws again when the direction becomes valid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ direction: 'diagonal' });
    group.direction = 'vertical';
    await settle(group);
    expect(group.hasAttribute('data-nph-rendered')).toBe(true);
    expect(group.shadowRoot!.querySelectorAll('.panel').length).toBe(2);
  });

  it('an empty group is a mount, not an error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ panels: [] });
    expect(group.sizes).toEqual([]);
    expect(error).not.toHaveBeenCalled();
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1] ?? ''));
  const EXPECTED = [
    '--nph-control-height-compact',
    '--nph-control-height-large',
    '--nph-focus-border',
    '--nph-resizable-focus-border-width',
    '--nph-resizable-grip-background-active',
    '--nph-resizable-grip-foreground',
    '--nph-resizable-grip-foreground-active',
    '--nph-resizable-grip-radius',
    '--nph-resizable-grip-size',
    '--nph-resizable-handle-color',
    '--nph-resizable-handle-color-hover',
    '--nph-resizable-handle-gap',
    '--nph-resizable-handle-width',
    '--nph-space-container-padding',
    '--nph-state-disabled-opacity',
  ];

  it('the CSS consumes the ten resizable tokens and the semantic ones named in the contract, and nothing else', () => {
    expect([...used].sort()).toEqual(EXPECTED);
  });

  it('every token exists in the generated CSS', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('every resizable token is read by the CSS', () => {
    const declared = [...new Set([...tokensCss.matchAll(/(--nph-resizable-[a-z-]+)\s*:/g)].map((match) => match[1] ?? ''))];
    expect(declared.length).toBe(10);
    for (const name of declared) {
      expect(used.has(name), name).toBe(true);
    }
  });

  it('the tokens point where the contract says', () => {
    const value = (name: string) => new RegExp(`${name}:\\s*([^;]+);`).exec(tokensCss)?.[1]?.trim();
    expect(value('--nph-resizable-handle-color')).toBe('var(--nph-color-border)');
    expect(value('--nph-resizable-handle-color-hover')).toBe('var(--nph-color-border-strong)');
    expect(value('--nph-resizable-handle-width')).toBe('var(--nph-border-width)');
    expect(value('--nph-resizable-focus-border-width')).toBe('var(--nph-core-focus-width-sm)');
    expect(value('--nph-resizable-grip-foreground')).toBe('var(--nph-color-muted-foreground)');
    expect(value('--nph-resizable-grip-foreground-active')).toBe('var(--nph-color-accent-foreground)');
    expect(value('--nph-resizable-grip-background-active')).toBe('var(--nph-color-accent)');
    expect(value('--nph-resizable-grip-radius')).toBe('var(--nph-radius-subtle)');
    expect(value('--nph-resizable-grip-size')).toBe('var(--nph-icon-size-sm)');
    expect(value('--nph-resizable-handle-gap')).toBe('var(--nph-space-inline-tight)');
  });

  it('design.md names the tokens the component uses directly', () => {
    expect(designMd).toMatch(/resizable\/handle-gap/);
    expect(designMd).toMatch(/resizable\/grip-background-active/);
    expect(designMd).toMatch(/color\/border-strong/);
  });

  it('never consumes a core or theme token and writes no literal design value', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('has no animation and no transition, so there is nothing to reduce under reduced motion', () => {
    expect(cssWithoutComments).not.toMatch(/transition|animation|@keyframes/);
  });

  it('the hit area on a coarse pointer grows from control/height-compact to control/height-large', () => {
    expect(cssWithoutComments).toMatch(/@media \(pointer: coarse\)/);
    expect(cssWithoutComments).toMatch(/--nph-control-height-compact\) - var\(--nph-control-height-large\)/);
  });

  it('the line keeps a color of its own with forced colors', () => {
    expect(cssWithoutComments).toMatch(/@media \(forced-colors: active\)[\s\S]*CanvasText[\s\S]*Highlight/);
  });
});
