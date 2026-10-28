/**
 * Tests of `nph-chip` (P100), in a real browser (P21, item 5): resolved color, real hover,
 * keyboard focus, measures and the cut label only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation `3077:2240`, set `3076:1439`), as
 * converted to text in the evidence of the `figma-docs-accepted` gate of DSA-57, and the
 * defaults of the pending decisions D-1 to D-5: the API, the tokens of each type, severity and
 * state in both schemes, the box measures, the inside border, the focus rings, the X and its
 * event, the toggle and its event, the cut label and its balloon, the accessible names, the
 * invalid input and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import semanticTokens from '../../tokens/source/semantic.tokens.json';
import componentCss from './nph-chip.css?raw';
import {
  NPH_CHIP_REMOVE_EVENT,
  NPH_CHIP_REMOVE_ICON,
  NPH_CHIP_SELECTED_CHANGE_EVENT,
  NPH_CHIP_SEVERITIES,
  NPH_CHIP_SIZES,
  NPH_CHIP_TYPES,
  NphChip,
} from './nph-chip';
import type { NphChipRemoveDetail, NphChipSelectedChangeDetail } from './nph-chip';

type Props = Partial<
  Pick<
    NphChip,
    | 'type'
    | 'severity'
    | 'size'
    | 'text'
    | 'icon'
    | 'avatar'
    | 'avatarSrc'
    | 'counter'
    | 'removeLabel'
    | 'selected'
    | 'marked'
    | 'readonly'
    | 'invalid'
    | 'disabled'
  >
>;

const REMOVABLE: Props = { text: 'Status: Waiting', removeLabel: 'Remove filter' };
const SELECTABLE: Props = { type: 'selectable', text: 'Pending' };
const LONG = 'Responsible department: Regional office of the southern conference';
const STATUSES = NPH_CHIP_SEVERITIES.filter((severity) => severity !== 'default');

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(props: Props = REMOVABLE, parent: HTMLElement = document.body): Promise<NphChip> {
  const element = document.createElement('nph-chip');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

function part<T extends Element = HTMLElement>(element: NphChip, selector: string): T {
  const found = element.shadowRoot?.querySelector<T>(selector);
  if (!found) throw new Error(`no ${selector}`);
  return found;
}

const chip = (element: NphChip) => part(element, '.chip');
const label = (element: NphChip) => part(element, '.label');
const removeButton = (element: NphChip) => part<HTMLButtonElement>(element, 'button.remove');
const hasPart = (element: NphChip, selector: string) => element.shadowRoot?.querySelector(selector) !== null;

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const color = (token: string) => resolved('color', token);
const width = (token: string) => Number.parseFloat(resolved('width', token));

/** The color of the inside border (the `inset` shadow), or `none`. */
function borderColor(element: HTMLElement): string {
  const shadow = getComputedStyle(element).boxShadow;
  return shadow === 'none' ? 'none' : (shadow.match(/rgba?\([^)]*\)/)?.[0] ?? 'none');
}

/** Waits until a computed value reaches the expected one: the change of state has a transition. */
async function eventually(read: () => string, expected: string): Promise<void> {
  await vi.waitFor(() => expect(read()).toBe(expected));
}

/** Waits for the next frames, so a ResizeObserver and a re-render can run. */
async function frames(element: NphChip, count = 3): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  await element.updateComplete;
}

/** Captures the development errors of a mount. */
function errors(): () => string[] {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  return () => spy.mock.calls.map((call) => String(call[0]));
}

describe('nph-chip — API', () => {
  it('the reactive API is exactly the one of P100', () => {
    const declared = [...(NphChip as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties]
      .filter(([, options]) => !options.state)
      .map(([name]) => name)
      .sort();
    expect(declared).toEqual(
      [
        'avatar',
        'avatarSrc',
        'counter',
        'disabled',
        'icon',
        'invalid',
        'marked',
        'readonly',
        'removeLabel',
        'selected',
        'severity',
        'size',
        'text',
        'type',
      ].sort(),
    );
  });

  it('the lists are the Figma values, in English', () => {
    expect(NPH_CHIP_TYPES).toEqual(['removable', 'selectable']);
    expect(NPH_CHIP_SEVERITIES).toEqual(['default', 'success', 'warning', 'error', 'info', 'help']);
    expect(NPH_CHIP_SIZES).toEqual(['compact', 'default']);
    expect(NPH_CHIP_REMOVE_ICON).toBe('xmark');
  });

  it('the defaults are the default variant of the set: removable, default, compact', async () => {
    const element = await mount();
    expect(element.getAttribute('type')).toBe('removable');
    expect(element.getAttribute('severity')).toBe('default');
    expect(element.getAttribute('size')).toBe('compact');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('no text is a mount: nothing drawn and no error', async () => {
    const read = errors();
    const element = await mount({ removeLabel: 'Remove filter' });
    expect(element.shadowRoot?.childElementCount).toBe(0);
    expect(getComputedStyle(element).display).toBe('none');
    expect(read()).toEqual([]);
  });

  it('has no slot and no ::part', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
  });
});

describe('nph-chip — invalid input', () => {
  const cases: Array<[string, Props]> = [
    ['type', { ...REMOVABLE, type: 'filter' as never }],
    ['severity', { ...REMOVABLE, severity: 'danger' as never }],
    ['size', { ...REMOVABLE, size: 'large' as never }],
    ['icon outside the core', { ...REMOVABLE, icon: 'not-an-icon' }],
    ['two contents', { ...REMOVABLE, icon: 'calendar', avatar: true }],
    ['avatar-src without avatar', { ...REMOVABLE, avatarSrc: 'photo.png' }],
    ['counter on a removable chip', { ...REMOVABLE, counter: 3 }],
    ['selected on a removable chip', { ...REMOVABLE, selected: true }],
    ['two removable states', { ...REMOVABLE, marked: true, invalid: true }],
    ['a status with a removable state', { ...REMOVABLE, severity: 'success', readonly: true }],
    ['a status with an icon', { ...REMOVABLE, severity: 'info', icon: 'calendar' }],
    ['a status with an avatar', { ...REMOVABLE, severity: 'info', avatar: true }],
    ['the X without remove-label', { text: 'Status: Waiting' }],
    ['a counter that is not a whole number', { ...SELECTABLE, counter: 2.5 }],
    ['a negative counter', { ...SELECTABLE, counter: -1 }],
    ['an avatar on a selectable chip', { ...SELECTABLE, avatar: true }],
    ['a status on a selectable chip', { ...SELECTABLE, severity: 'success' }],
    ['a removable state on a selectable chip', { ...SELECTABLE, invalid: true }],
  ];

  it.each(cases)('%s: draws nothing and emits one error', async (_name, props) => {
    const read = errors();
    const element = await mount(props);
    expect(element.shadowRoot?.childElementCount).toBe(0);
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(element).display).toBe('none');
    expect(read()).toHaveLength(1);
    expect(read()[0]).toMatch(/^\[nph-chip\] /);
  });

  it('accumulates one error per cause', async () => {
    const read = errors();
    await mount({ text: 'Status', type: 'filter' as never, size: 'large' as never, icon: 'not-an-icon' });
    expect(read()).toHaveLength(3);
  });

  it('a read only chip needs no remove-label: it has no X', async () => {
    const read = errors();
    const element = await mount({ text: 'Status: Waiting', readonly: true });
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(hasPart(element, 'button.remove')).toBe(false);
    expect(read()).toEqual([]);
  });

  it('disabled wins over the removable states, with no error', async () => {
    const read = errors();
    const element = await mount({ ...REMOVABLE, invalid: true, disabled: true });
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(read()).toEqual([]);
  });

  it('a counter of zero is valid', async () => {
    const read = errors();
    const element = await mount({ ...SELECTABLE, counter: 0 });
    expect(part(element, '.counter').textContent).toBe('0');
    expect(read()).toEqual([]);
  });
});

describe('nph-chip — removable', () => {
  it('the X is a native button named by remove-label and the text', async () => {
    const element = await mount();
    const button = removeButton(element);
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Remove filter Status: Waiting');
    expect(button.querySelector('nph-icon')?.getAttribute('name')).toBe('xmark');
  });

  it('the body has no action and takes no focus: only the X is in the Tab order', async () => {
    const element = await mount();
    expect(hasPart(element, 'button:not(.remove)')).toBe(false);
    expect(label(element).hasAttribute('tabindex')).toBe(false);
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBe(removeButton(element));
  });

  it('the X fires nph-remove with the text, and the chip stays: the consumer removes it', async () => {
    const element = await mount();
    const received: NphChipRemoveDetail[] = [];
    element.addEventListener(NPH_CHIP_REMOVE_EVENT, (event) => received.push(event.detail), { once: true });
    await userEvent.click(removeButton(element));
    expect(received).toEqual([{ text: 'Status: Waiting' }]);
    expect(element.isConnected).toBe(true);
  });

  it('the event bubbles and crosses shadow roots', async () => {
    const element = await mount();
    let event: Event | undefined;
    element.addEventListener(NPH_CHIP_REMOVE_EVENT, (received) => (event = received), { once: true });
    removeButton(element).click();
    expect(event?.bubbles).toBe(true);
    expect(event?.composed).toBe(true);
  });

  it('Enter and Space on the X also remove', async () => {
    const element = await mount();
    const listener = vi.fn();
    element.addEventListener(NPH_CHIP_REMOVE_EVENT, listener);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('a click on the body fires nothing and does not toggle', async () => {
    const element = await mount();
    const listener = vi.fn();
    element.addEventListener(NPH_CHIP_REMOVE_EVENT, listener);
    element.addEventListener(NPH_CHIP_SELECTED_CHANGE_EVENT, listener);
    await userEvent.click(label(element));
    expect(listener).not.toHaveBeenCalled();
    expect(element.selected).toBe(false);
  });

  it('an enabled chip does not say it is inactive', async () => {
    expect(chip(await mount()).hasAttribute('aria-disabled')).toBe(false);
  });

  it('read only shows the value without the X', async () => {
    const element = await mount({ ...REMOVABLE, readonly: true });
    expect(hasPart(element, 'button.remove')).toBe(false);
    expect(chip(element).classList.contains('end-remove')).toBe(false);
  });

  it('disabled: the X is natively disabled, out of the Tab order, and fires nothing', async () => {
    const element = await mount({ ...REMOVABLE, disabled: true });
    const listener = vi.fn();
    element.addEventListener(NPH_CHIP_REMOVE_EVENT, listener);
    expect(removeButton(element).disabled).toBe(true);
    expect(chip(element).getAttribute('aria-disabled')).toBe('true');
    element.click();
    removeButton(element).click();
    expect(listener).not.toHaveBeenCalled();
  });

  it('the icon and the avatar are decorative', async () => {
    const withIcon = await mount({ ...REMOVABLE, icon: 'calendar' });
    expect(part(withIcon, 'nph-icon.lead').getAttribute('aria-hidden')).toBe('true');
    const withAvatar = await mount({ text: 'Ana Souza', removeLabel: 'Remove', avatar: true });
    const avatar = part(withAvatar, 'nph-avatar.lead');
    await (avatar as unknown as NphChip).updateComplete;
    expect(avatar.getAttribute('size')).toBe('sm');
    expect(avatar.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('nph-chip — selectable', () => {
  it('the whole chip is a native toggle button with aria-pressed', async () => {
    const element = await mount(SELECTABLE);
    const button = part<HTMLButtonElement>(element, 'button.chip');
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(hasPart(element, 'button.remove')).toBe(false);
  });

  it('a click toggles selected and fires nph-selected-change after the change', async () => {
    const element = await mount(SELECTABLE);
    const received: Array<[NphChipSelectedChangeDetail, boolean]> = [];
    element.addEventListener(NPH_CHIP_SELECTED_CHANGE_EVENT, (event) => received.push([event.detail, element.selected]));
    await userEvent.click(part(element, 'button.chip'));
    await userEvent.click(part(element, 'button.chip'));
    expect(received).toEqual([
      [{ selected: true }, true],
      [{ selected: false }, false],
    ]);
  });

  it('Enter and Space toggle it', async () => {
    const element = await mount(SELECTABLE);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(element.selected).toBe(true);
    await userEvent.keyboard(' ');
    expect(element.selected).toBe(false);
  });

  it('setting selected from code fires nothing', async () => {
    const element = await mount(SELECTABLE);
    const listener = vi.fn();
    element.addEventListener(NPH_CHIP_SELECTED_CHANGE_EVENT, listener);
    element.selected = true;
    await element.updateComplete;
    expect(part(element, 'button.chip').getAttribute('aria-pressed')).toBe('true');
    expect(listener).not.toHaveBeenCalled();
  });

  it('selected shows the X as a mark, not as a button', async () => {
    const element = await mount({ ...SELECTABLE, selected: true });
    const mark = part(element, 'nph-icon.mark');
    expect(mark.getAttribute('name')).toBe('xmark');
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    expect(element.shadowRoot?.querySelectorAll('button')).toHaveLength(1);
  });

  it('the counter is read inside the name, after a space', async () => {
    const element = await mount({ ...SELECTABLE, counter: 12 });
    expect(part(element, 'button.chip').textContent?.replace(/\s+/g, ' ').trim()).toBe('Pending 12');
  });

  it('disabled: natively disabled, out of the Tab order, no toggle and no event', async () => {
    const element = await mount({ ...SELECTABLE, disabled: true });
    const listener = vi.fn();
    element.addEventListener(NPH_CHIP_SELECTED_CHANGE_EVENT, listener);
    expect(part<HTMLButtonElement>(element, 'button.chip').disabled).toBe(true);
    element.click();
    expect(element.selected).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('nph-chip — measures', () => {
  it('the height is chip/height-compact or chip/height-default; the X target is the same in both', async () => {
    for (const [size, token] of [
      ['compact', '--nph-chip-height-compact'],
      ['default', '--nph-chip-height-default'],
    ] as const) {
      const element = await mount({ ...REMOVABLE, size });
      expect(chip(element).getBoundingClientRect().height).toBeCloseTo(width(token), 1);
      const target = removeButton(element).getBoundingClientRect();
      expect(target.width).toBeCloseTo(width('--nph-chip-remove-size'), 1);
      expect(target.height).toBeCloseTo(width('--nph-chip-remove-size'), 1);
    }
  });

  it('the border is drawn inside: same box with and without it', async () => {
    const bordered = await mount({ ...SELECTABLE });
    const borderless = await mount({ ...SELECTABLE, selected: false, disabled: true });
    expect(borderColor(chip(bordered))).not.toBe('none');
    expect(borderColor(chip(borderless))).toBe('none');
    expect(getComputedStyle(chip(bordered)).borderTopStyle).toBe('none');
    expect(chip(bordered).getBoundingClientRect().width).toBeCloseTo(chip(borderless).getBoundingClientRect().width, 1);
    expect(getComputedStyle(chip(bordered)).boxShadow).toContain(`${width('--nph-chip-border-width')}px`);
  });

  const paddings: Array<[string, Props, string, string]> = [
    ['text only', { ...SELECTABLE }, '--nph-chip-padding-x', '--nph-chip-padding-x'],
    ['icon', { ...SELECTABLE, icon: 'calendar' }, '--nph-chip-padding-start-icon', '--nph-chip-padding-x'],
    ['avatar and X', { text: 'Ana Souza', removeLabel: 'Remove', avatar: true }, '--nph-chip-padding-start-avatar', '--nph-chip-padding-end-remove'],
    ['X, default size', { ...REMOVABLE, size: 'default' }, '--nph-chip-padding-x', '--nph-chip-padding-end-remove-default'],
    ['counter', { ...SELECTABLE, counter: 12 }, '--nph-chip-padding-x', '--nph-chip-padding-end-counter'],
    ['counter and X (D-5)', { ...SELECTABLE, counter: 12, selected: true }, '--nph-chip-padding-x', '--nph-chip-padding-end-remove'],
  ];

  it.each(paddings)('padding with %s', async (_name, props, start, end) => {
    const element = await mount(props);
    const style = getComputedStyle(chip(element));
    expect(Number.parseFloat(style.paddingInlineStart)).toBeCloseTo(width(start), 1);
    expect(Number.parseFloat(style.paddingInlineEnd)).toBeCloseTo(width(end), 1);
    expect(Number.parseFloat(style.columnGap)).toBeCloseTo(width('--nph-chip-gap'), 1);
  });

  it('D-5: text, counter and X, in this order; the icon comes before the text', async () => {
    const element = await mount({ ...SELECTABLE, counter: 12, selected: true });
    expect([...chip(element).children].map((child) => child.className)).toEqual(['label', 'counter', 'mark']);
    const withIcon = await mount({ ...SELECTABLE, icon: 'calendar', selected: true });
    expect([...chip(withIcon).children].map((child) => child.className)).toEqual(['lead', 'label', 'mark']);
  });

  it('the label is text/label-md; the counter is a pill in text/label-sm (D-1)', async () => {
    const element = await mount({ ...SELECTABLE, counter: 12 });
    expect(getComputedStyle(label(element)).fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    const counter = part(element, '.counter');
    const style = getComputedStyle(counter);
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    expect(Number.parseFloat(style.paddingTop)).toBeCloseTo(width('--nph-chip-counter-padding-y'), 1);
    expect(Number.parseFloat(style.paddingLeft)).toBeCloseTo(width('--nph-chip-counter-padding-x'), 1);
    expect(counter.getBoundingClientRect().height).toBeCloseTo(
      2 * width('--nph-chip-counter-padding-y') + width('--nph-text-label-sm-line-height'),
      1,
    );
  });

  it('the icon and the X icon are nph-icon sm, light', async () => {
    const element = await mount({ ...REMOVABLE, icon: 'calendar' });
    for (const icon of element.shadowRoot?.querySelectorAll('nph-icon') ?? []) {
      expect(icon.getAttribute('size')).toBe('sm');
      expect(icon.getAttribute('variant') ?? 'light').toBe('light');
    }
  });
});

describe('nph-chip — long text', () => {
  it('the label is cut at chip/max-width, with an ellipsis', async () => {
    const element = await mount({ ...REMOVABLE, text: LONG });
    await frames(element);
    expect(element.getBoundingClientRect().width).toBeCloseTo(width('--nph-chip-max-width'), 1);
    expect(getComputedStyle(label(element)).textOverflow).toBe('ellipsis');
    expect(label(element).scrollWidth).toBeGreaterThan(label(element).clientWidth);
  });

  it('removable: the cut label takes focus and points the balloon at itself (D-3)', async () => {
    const element = await mount({ ...REMOVABLE, text: LONG });
    await frames(element);
    expect(label(element).getAttribute('tabindex')).toBe('0');
    const tooltip = part(element, 'nph-tooltip');
    expect(tooltip.getAttribute('for')).toBe(label(element).id);
    expect((tooltip as unknown as { text: string }).text).toBe(LONG);
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBe(label(element));
    expect(getComputedStyle(chip(element), '::before').content).not.toBe('none');
  });

  it('selectable: the balloon points at the chip button', async () => {
    const element = await mount({ ...SELECTABLE, text: LONG });
    await frames(element);
    expect(part(element, 'nph-tooltip').getAttribute('for')).toBe(part(element, 'button.chip').id);
    expect(label(element).hasAttribute('tabindex')).toBe(false);
  });

  it('a label that fits has no balloon and takes no focus', async () => {
    const element = await mount();
    await frames(element);
    expect(hasPart(element, 'nph-tooltip')).toBe(false);
    expect(label(element).hasAttribute('tabindex')).toBe(false);
  });

  it('the balloon follows the text: it goes when the text fits again', async () => {
    const element = await mount({ ...REMOVABLE, text: LONG });
    await frames(element);
    expect(hasPart(element, 'nph-tooltip')).toBe(true);
    element.text = 'Short';
    await frames(element);
    expect(hasPart(element, 'nph-tooltip')).toBe(false);
  });

  it('a chip moved to another place observes its label again: cut later, it gets the balloon', async () => {
    const element = await mount();
    await frames(element);
    expect(hasPart(element, 'nph-tooltip')).toBe(false);
    const holder = document.createElement('div');
    document.body.append(holder);
    holder.append(element);
    await frames(element);
    element.style.maxInlineSize = `${width('--nph-chip-remove-size') * 3}px`;
    await vi.waitFor(() => expect(hasPart(element, 'nph-tooltip')).toBe(true));
    expect(label(element).getAttribute('tabindex')).toBe('0');
  });

  it('a disabled chip has no balloon', async () => {
    const element = await mount({ ...REMOVABLE, text: LONG, disabled: true });
    await frames(element);
    expect(hasPart(element, 'nph-tooltip')).toBe(false);
    expect(label(element).hasAttribute('tabindex')).toBe(false);
  });

  it('a click on the balloon does not toggle a selectable chip', async () => {
    const element = await mount({ ...SELECTABLE, text: LONG });
    await frames(element);
    part(element, 'nph-tooltip').click();
    expect(element.selected).toBe(false);
  });
});

/** The tokens each state paints: container, inside border, label, icons. */
interface Paint {
  background: string;
  border: string | null;
  label: string;
  icon: string;
}

async function expectPaint(element: NphChip, paint: Paint): Promise<void> {
  const box = chip(element);
  expect(getComputedStyle(box).backgroundColor).toBe(color(paint.background));
  expect(borderColor(box)).toBe(paint.border === null ? 'none' : color(paint.border));
  expect(getComputedStyle(label(element)).color).toBe(color(paint.label));
  expect(getComputedStyle(box).color).toBe(color(paint.icon));
}

describe.each(['light', 'dark'] as const)('nph-chip — colors in %s', (scheme) => {
  const setScheme = () => document.documentElement.setAttribute('data-nph-color-scheme', scheme);

  it('removable at rest, marked, read only and invalid', async () => {
    setScheme();
    await expectPaint(await mount(), {
      background: '--nph-chip-background',
      border: '--nph-chip-border',
      label: '--nph-chip-foreground',
      icon: '--nph-chip-foreground',
    });
    await expectPaint(await mount({ ...REMOVABLE, marked: true }), {
      background: '--nph-chip-background-hover',
      border: '--nph-chip-border',
      label: '--nph-chip-foreground',
      icon: '--nph-chip-foreground',
    });
    await expectPaint(await mount({ ...REMOVABLE, readonly: true }), {
      background: '--nph-chip-background',
      border: '--nph-chip-border',
      label: '--nph-chip-foreground',
      icon: '--nph-chip-foreground',
    });
    await expectPaint(await mount({ ...REMOVABLE, invalid: true }), {
      background: '--nph-chip-invalid-background',
      border: '--nph-chip-invalid-border',
      label: '--nph-chip-invalid-foreground',
      icon: '--nph-chip-invalid-foreground',
    });
  });

  it.each(STATUSES)('status %s: only the label takes the color; disabled falls back with no border', async (status) => {
    setScheme();
    await expectPaint(await mount({ ...REMOVABLE, severity: status }), {
      background: `--nph-chip-${status}-background`,
      border: `--nph-chip-${status}-border`,
      label: `--nph-chip-${status}-foreground`,
      icon: '--nph-chip-foreground',
    });
    await expectPaint(await mount({ ...REMOVABLE, severity: status, disabled: true }), {
      background: '--nph-chip-background-disabled',
      border: null,
      label: '--nph-chip-foreground',
      icon: '--nph-chip-foreground',
    });
  });

  it.each(STATUSES)('status %s: hover on the X and the X ring in the status color', async (status) => {
    setScheme();
    const element = await mount({ ...REMOVABLE, severity: status });
    const button = removeButton(element);
    expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.hover(button);
    await eventually(() => getComputedStyle(button).backgroundColor, color(`--nph-chip-${status}-remove-background-hover`));
    await userEvent.unhover(button);
    await userEvent.tab();
    await eventually(() => getComputedStyle(button).backgroundColor, color(`--nph-chip-${status}-remove-background-hover`));
    expect(getComputedStyle(button, '::before').borderTopColor).toBe(color(`--nph-chip-${status}-focus-border`));
    expect(getComputedStyle(button, '::after').borderTopColor).toBe(color(`--nph-chip-${status}-focus-halo`));
  });

  it('removable disabled: the disabled background, no border, at state/disabled-opacity', async () => {
    setScheme();
    const element = await mount({ ...REMOVABLE, disabled: true });
    await expectPaint(element, {
      background: '--nph-chip-background-disabled',
      border: null,
      label: '--nph-chip-foreground',
      icon: '--nph-chip-foreground',
    });
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('selectable at rest, hover, disabled and the four selected states', async () => {
    setScheme();
    const rest = await mount({ ...SELECTABLE, counter: 12 });
    await expectPaint(rest, {
      background: '--nph-chip-background',
      border: '--nph-chip-border',
      label: '--nph-chip-foreground',
      icon: '--nph-chip-foreground',
    });
    const counter = part(rest, '.counter');
    expect(getComputedStyle(counter).backgroundColor).toBe(color('--nph-chip-counter-background'));
    expect(getComputedStyle(counter).color).toBe(color('--nph-chip-counter-foreground'));
    await userEvent.hover(chip(rest));
    await eventually(() => getComputedStyle(chip(rest)).backgroundColor, color('--nph-chip-background-hover'));
    await eventually(() => getComputedStyle(counter).backgroundColor, color('--nph-chip-counter-background-hover'));
    await userEvent.unhover(chip(rest));

    const disabled = await mount({ ...SELECTABLE, counter: 12, disabled: true });
    await expectPaint(disabled, {
      background: '--nph-chip-background-disabled',
      border: null,
      label: '--nph-chip-foreground',
      icon: '--nph-chip-foreground',
    });
    expect(getComputedStyle(part(disabled, '.counter')).backgroundColor).toBe(color('--nph-chip-counter-background-disabled'));

    const selected = await mount({ ...SELECTABLE, counter: 12, selected: true });
    const selectedPaint: Paint = {
      background: '--nph-chip-background-selected',
      border: null,
      label: '--nph-chip-foreground-selected',
      icon: '--nph-chip-foreground-selected',
    };
    await expectPaint(selected, selectedPaint);
    const selectedCounter = part(selected, '.counter');
    expect(getComputedStyle(selectedCounter).color).toBe(color('--nph-chip-counter-foreground'));
    await userEvent.hover(chip(selected));
    await eventually(() => getComputedStyle(chip(selected)).backgroundColor, color('--nph-chip-background-selected-hover'));
    await eventually(() => getComputedStyle(selectedCounter).backgroundColor, color('--nph-chip-counter-background'));
    await userEvent.unhover(chip(selected));

    await expectPaint(await mount({ ...SELECTABLE, counter: 12, selected: true, disabled: true }), selectedPaint);
  });

  it('removable: hover, active and focus on the X use chip/remove-background-hover; the ring is focus/border and focus/halo', async () => {
    setScheme();
    const element = await mount();
    const button = removeButton(element);
    await userEvent.hover(button);
    await eventually(() => getComputedStyle(button).backgroundColor, color('--nph-chip-remove-background-hover'));
    await eventually(() => getComputedStyle(chip(element)).backgroundColor, color('--nph-chip-background'));
    await userEvent.unhover(button);
    await userEvent.tab();
    expect(getComputedStyle(button, '::before').borderTopColor).toBe(color('--nph-focus-border'));
    expect(getComputedStyle(button, '::after').borderTopColor).toBe(color('--nph-focus-halo'));
  });

  it('invalid: the X uses the error pair (D-4)', async () => {
    setScheme();
    const element = await mount({ ...REMOVABLE, invalid: true });
    await userEvent.tab();
    const button = removeButton(element);
    await eventually(() => getComputedStyle(button).backgroundColor, color('--nph-chip-error-remove-background-hover'));
    expect(getComputedStyle(button, '::before').borderTopColor).toBe(color('--nph-chip-error-focus-border'));
    expect(getComputedStyle(button, '::after').borderTopColor).toBe(color('--nph-chip-error-focus-halo'));
  });
});

describe('nph-chip — focus rings', () => {
  it('around the X: a border of border/width and a halo of focus/ring-width, round (26 and 34 px)', async () => {
    const element = await mount();
    await userEvent.tab();
    const button = removeButton(element);
    const size = width('--nph-chip-remove-size');
    const border = width('--nph-border-width');
    const ring = width('--nph-focus-ring-width');
    const before = getComputedStyle(button, '::before');
    const after = getComputedStyle(button, '::after');
    expect(Number.parseFloat(before.width)).toBeCloseTo(size + 2 * border, 1);
    expect(Number.parseFloat(after.width)).toBeCloseTo(size + 2 * (border + ring), 1);
    expect(Number.parseFloat(before.borderTopWidth)).toBeCloseTo(border, 1);
    expect(Number.parseFloat(after.borderTopWidth)).toBeCloseTo(ring, 1);
    expect(before.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-chip-radius'));
  });

  it('around the whole selectable chip, keyboard only', async () => {
    const clicked = await mount(SELECTABLE);
    await userEvent.click(chip(clicked));
    expect(getComputedStyle(chip(clicked), '::before').content).toBe('none');
    document.body.replaceChildren();
    const element = await mount(SELECTABLE);
    await userEvent.tab();
    const box = chip(element).getBoundingClientRect();
    const before = getComputedStyle(chip(element), '::before');
    expect(before.borderTopColor).toBe(color('--nph-focus-border'));
    expect(Number.parseFloat(before.width)).toBeCloseTo(box.width + 2 * width('--nph-border-width'), 1);
    expect(getComputedStyle(chip(element), '::after').borderTopColor).toBe(color('--nph-focus-halo'));
  });

  it('marked and disabled: disabled wins, with no ring', async () => {
    const element = await mount({ ...REMOVABLE, marked: true, disabled: true });
    expect(getComputedStyle(chip(element), '::before').content).toBe('none');
    expect(getComputedStyle(chip(element), '::after').content).toBe('none');
    expect(getComputedStyle(chip(element)).backgroundColor).toBe(color('--nph-chip-background-disabled'));
  });

  it('marked: hover background and the ring around the whole chip, without focus', async () => {
    const element = await mount({ ...REMOVABLE, marked: true });
    expect(getComputedStyle(chip(element), '::before').borderTopColor).toBe(color('--nph-focus-border'));
    expect(getComputedStyle(chip(element), '::after').borderTopColor).toBe(color('--nph-focus-halo'));
  });
});

describe('nph-chip — token contract', () => {
  /* The `chip` group of the semantic source: the tokens that came with the accepted documentation. */
  const chipTokens = Object.keys((semanticTokens as unknown as Record<string, Record<string, unknown>>).chip ?? {}).map(
    (name) => `chip/${name}`,
  );

  it('the source has the 62 chip tokens of the evidence', () => {
    expect(chipTokens).toHaveLength(62);
  });

  it('every chip token exists in the generated CSS and is consumed here', () => {
    for (const token of chipTokens) {
      const property = `--nph-${token.replace('/', '-')}`;
      expect(tokensCss, property).toContain(`${property}:`);
      expect(componentCss, property).toContain(`var(${property})`);
    }
  });

  it('the CSS consumes only --nph-* custom properties, with no core or theme token', () => {
    const consumed = [...componentCss.matchAll(/var\((--[\w-]+)\)/g)].map((match) => match[1] ?? '');
    for (const property of consumed) {
      expect(property.startsWith('--nph-') || property.startsWith('--_'), property).toBe(true);
      expect(property.startsWith('--nph-core-') || property.startsWith('--nph-theme-'), property).toBe(false);
    }
  });

  it('the CSS has no literal color', () => {
    const body = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(body).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
  });
});
