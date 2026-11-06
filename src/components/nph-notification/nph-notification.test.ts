/**
 * Tests of `nph-notification` (P108), in a real browser (P21, item 5): the box, the gaps, the
 * resolved colors, the reflow and the focus of the close only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `3442:10163`, set `3434:9035`, focus of the
 * close on solid `4207:1146`), recorded in the evidence of the `figma-docs-accepted` gate of
 * DSA-63: the properties and their invalid combinations, the anatomy and its tokens in both
 * color schemes, the seven severities and the two emphases, the toast, the stacked and
 * single-line layouts with the reflow, the actions and the close button, the close on solid, the
 * time a toast stays, the announcement, the touch target and the token contract of the CSS.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-notification.css?raw';
import {
  NPH_NOTIFICATION_DEFAULT_DURATION,
  NPH_NOTIFICATION_EMPHASES,
  NPH_NOTIFICATION_LAYOUTS,
  NPH_NOTIFICATION_PLACEMENTS,
  NPH_NOTIFICATION_SEVERITIES,
  NphNotification,
} from './nph-notification';
import type { NphNotificationActionDetail, NphNotificationCloseDetail } from './nph-notification';
import type { NphButton } from '../nph-button/nph-button';

const DESCRIPTION = 'The report will go out tomorrow at 9 am to the people on the list.';
const HEADING = 'Report scheduled';
const CLOSE = 'Close';
const SCHEMES = ['light', 'dark'] as const;
const COLORED = ['info', 'success', 'warning', 'error', 'help'] as const;

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

type Attributes = Record<string, string | true | undefined>;

interface MountOptions {
  attributes?: Attributes;
  scheme?: (typeof SCHEMES)[number];
  parentStyle?: string;
}

/** Mounts one `nph-notification` with the given attributes, inside a container. */
async function mount(options: MountOptions = {}): Promise<{ parent: HTMLElement; note: NphNotification }> {
  const parent = document.createElement('div');
  if (options.scheme !== undefined) parent.setAttribute('data-nph-color-scheme', options.scheme);
  if (options.parentStyle !== undefined) parent.style.cssText = options.parentStyle;
  const note = document.createElement('nph-notification');
  const attributes: Attributes = { description: DESCRIPTION, 'close-label': CLOSE, ...options.attributes };
  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined) note.setAttribute(name, value === true ? '' : value);
  }
  parent.append(note);
  document.body.append(parent);
  await note.updateComplete;
  return { parent, note };
}

function part<T extends Element>(note: NphNotification, selector: string): T {
  const element = note.shadowRoot?.querySelector<T>(selector);
  if (element === null || element === undefined) throw new Error(`no ${selector} in the shadow root`);
  return element;
}

const has = (note: NphNotification, selector: string): boolean => note.shadowRoot?.querySelector(selector) != null;

type ResolvedProperty = 'width' | 'paddingTop' | 'paddingLeft' | 'rowGap' | 'columnGap' | 'color' | 'backgroundColor' | 'borderTopWidth' | 'borderTopLeftRadius' | 'boxShadow' | 'height' | 'borderTopColor';

/** Resolves a token to what the browser computes, through a probe element. */
function resolved(property: ResolvedProperty, token: string, scope: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  if (property === 'rowGap' || property === 'columnGap') probe.style.display = 'flex';
  if (property === 'borderTopWidth' || property === 'borderTopColor') probe.style.borderStyle = 'solid';
  probe.style[property] = `var(${token})`;
  scope.append(probe);
  const value = getComputedStyle(probe)[property];
  probe.remove();
  return value;
}

const px = (value: string): number => Number.parseFloat(value);

function buttons(note: NphNotification): NphButton[] {
  return [...(note.shadowRoot?.querySelectorAll<NphButton>('nph-button.action') ?? [])];
}

function closeButton(note: NphNotification): NphButton {
  return part<NphButton>(note, '.close nph-button');
}

/** The text a button draws, which is its `text` property. */
const textOf = (button: NphButton): string => button.text;

describe('registration and API', () => {
  it('defines nph-notification exactly once', () => {
    expect(customElements.get('nph-notification')).toBe(NphNotification);
  });

  it('the public API is exactly the contract properties', () => {
    const declared = [...(NphNotification as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.filter((name) => name !== 'coarse').sort()).toEqual(
      [
        'action',
        'closeLabel',
        'description',
        'duration',
        'emphasis',
        'heading',
        'hideClose',
        'layout',
        'placement',
        'secondaryAction',
        'severity',
        'timeBar',
      ].sort(),
    );
  });

  it('the values of each list are the ones of the contract', () => {
    expect([...NPH_NOTIFICATION_PLACEMENTS]).toEqual(['inline', 'toast']);
    expect([...NPH_NOTIFICATION_SEVERITIES]).toEqual(['info', 'success', 'warning', 'error', 'help', 'neutral', 'loading']);
    expect([...NPH_NOTIFICATION_EMPHASES]).toEqual(['subtle', 'solid']);
    expect([...NPH_NOTIFICATION_LAYOUTS]).toEqual(['stacked', 'single-line']);
    expect(NPH_NOTIFICATION_DEFAULT_DURATION).toBe(6000);
  });

  it('the defaults are inline, info, subtle and stacked', async () => {
    const { note } = await mount();
    expect([note.placement, note.severity, note.emphasis, note.layout]).toEqual(['inline', 'info', 'subtle', 'stacked']);
  });

  it('there is no title property: the global HTML attribute stays the native one', () => {
    const declared = [...(NphNotification as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).not.toContain('title');
  });

  it('exposes no slot and no part, and takes no focus itself', async () => {
    const { note } = await mount({ attributes: { action: 'Review', 'secondary-action': 'Later' } });
    expect(note.shadowRoot?.querySelector('slot')).toBeNull();
    expect(note.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(note.hasAttribute('tabindex')).toBe(false);
    expect(note.tabIndex).toBe(-1);
  });
});

describe('text', () => {
  it('the title comes first, then the description', async () => {
    const { note } = await mount({ attributes: { heading: HEADING } });
    const heading = part(note, '.text .heading');
    const description = part(note, '.text .description');
    expect(heading.textContent?.trim()).toBe(HEADING);
    expect(description.textContent?.trim()).toBe(DESCRIPTION);
    expect(heading.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('the title is optional: without it only the description shows', async () => {
    const { note } = await mount();
    expect(has(note, '.text .heading')).toBe(false);
    expect(has(note, '.text .description')).toBe(true);
  });

  it('a title of only spaces counts as no title, and the texts are trimmed', async () => {
    const { note } = await mount({ attributes: { heading: '   ', description: `  ${DESCRIPTION}  ` } });
    expect(has(note, '.text .heading')).toBe(false);
    expect(part(note, '.text .description').textContent?.trim()).toBe(DESCRIPTION);
  });

  it('the title and the description are paragraphs: the consumer owns the outline', async () => {
    const { note } = await mount({ attributes: { heading: HEADING } });
    expect(part(note, '.text .heading').tagName).toBe('P');
    expect(part(note, '.text .description').tagName).toBe('P');
  });

  it('follows changes at run time', async () => {
    const { note } = await mount({ attributes: { heading: HEADING } });
    note.heading = 'Order sent';
    note.description = 'The order left the warehouse.';
    await note.updateComplete;
    expect(part(note, '.text .heading').textContent?.trim()).toBe('Order sent');
    expect(part(note, '.text .description').textContent?.trim()).toBe('The order left the warehouse.');
  });

  for (const scheme of SCHEMES) {
    it(`${scheme}: the title is text/heading-xs and the description is text/body-md, in notification/text`, async () => {
      const { parent, note } = await mount({ attributes: { heading: HEADING }, scheme });
      const heading = getComputedStyle(part(note, '.text .heading'));
      const description = getComputedStyle(part(note, '.text .description'));
      const color = resolved('color', '--nph-notification-text', parent);
      expect([heading.color, description.color]).toEqual([color, color]);
      expect([heading.fontSize, heading.lineHeight]).toEqual(['14px', '20px']);
      expect([description.fontSize, description.lineHeight]).toEqual(['14px', '20px']);
      const tokens = getComputedStyle(parent);
      expect(heading.fontWeight).toBe(tokens.getPropertyValue('--nph-text-heading-xs-font-weight').trim());
      expect(description.fontWeight).toBe(tokens.getPropertyValue('--nph-text-body-md-font-weight').trim());
    });
  }
});

describe('severity icon', () => {
  const ICONS = {
    info: 'circle-info',
    success: 'circle-check',
    warning: 'triangle-exclamation',
    error: 'circle-xmark',
    help: 'circle-question',
    neutral: 'bell',
  } as const;

  for (const [severity, name] of Object.entries(ICONS)) {
    it(`${severity}: a decorative solid ${name} at notification/icon-size`, async () => {
      const { note } = await mount({ attributes: { severity } });
      const icon = part(note, '.icon nph-icon');
      expect(icon.getAttribute('name')).toBe(name);
      expect(icon.getAttribute('variant')).toBe('solid');
      expect(icon.getAttribute('size')).toBe('md');
      expect(icon.getAttribute('label')).toBeNull();
      const box = icon.getBoundingClientRect();
      expect(box.width).toBe(px(resolved('width', '--nph-notification-icon-size')));
    });
  }

  it('every severity has its own drawing: the color is never the only signal', () => {
    expect(new Set(Object.values(ICONS)).size).toBe(6);
  });

  it('loading draws the nph-spinner, same size, with the primary arc, and no icon', async () => {
    const { note } = await mount({ attributes: { severity: 'loading', placement: 'toast' } });
    expect(has(note, '.icon nph-icon')).toBe(false);
    const spinner = part(note, '.icon nph-spinner');
    expect(spinner.getAttribute('size')).toBe('md');
    expect(spinner.getAttribute('label')).toBeNull();
    expect(spinner.getBoundingClientRect().width).toBe(px(resolved('width', '--nph-notification-icon-size')));
    expect(getComputedStyle(part(note, '.spinner')).color).toBe(resolved('color', '--nph-color-primary'));
  });
});

describe('box and colors', () => {
  for (const scheme of SCHEMES) {
    for (const severity of COLORED) {
      it(`${scheme}: ${severity} subtle takes notification/${severity}-surface and its 1 px border`, async () => {
        const { parent, note } = await mount({ attributes: { severity }, scheme });
        const style = getComputedStyle(part(note, '.container'));
        expect(style.backgroundColor).toBe(resolved('backgroundColor', `--nph-notification-${severity}-surface`, parent));
        expect(style.borderTopColor).toBe(resolved('borderTopColor', `--nph-notification-${severity}-border`, parent));
        expect(style.borderTopWidth).toBe(resolved('borderTopWidth', '--nph-notification-border-width', parent));
        expect(getComputedStyle(part(note, '.icon nph-icon')).color).toBe(resolved('color', `--nph-notification-${severity}-solid`, parent));
      });

      it(`${scheme}: ${severity} solid takes notification/${severity}-solid, no visible border and on-solid text`, async () => {
        const { parent, note } = await mount({ attributes: { severity, emphasis: 'solid', heading: HEADING }, scheme });
        const style = getComputedStyle(part(note, '.container'));
        expect(style.backgroundColor).toBe(resolved('backgroundColor', `--nph-notification-${severity}-solid`, parent));
        expect(style.borderTopColor).toBe('rgba(0, 0, 0, 0)');
        const onSolid = resolved('color', '--nph-notification-on-solid', parent);
        expect(getComputedStyle(part(note, '.text .heading')).color).toBe(onSolid);
        expect(getComputedStyle(part(note, '.text .description')).color).toBe(onSolid);
        expect(getComputedStyle(part(note, '.icon nph-icon')).color).toBe(onSolid);
      });
    }

    it(`${scheme}: neutral subtle takes its own surface, border and icon`, async () => {
      const { parent, note } = await mount({ attributes: { severity: 'neutral' }, scheme });
      const style = getComputedStyle(part(note, '.container'));
      expect(style.backgroundColor).toBe(resolved('backgroundColor', '--nph-notification-neutral-surface', parent));
      expect(style.borderTopColor).toBe(resolved('borderTopColor', '--nph-notification-neutral-border', parent));
      expect(getComputedStyle(part(note, '.icon nph-icon')).color).toBe(resolved('color', '--nph-notification-neutral-icon', parent));
    });

    it(`${scheme}: neutral solid takes the inverse surface and the inverse foreground`, async () => {
      const { parent, note } = await mount({ attributes: { severity: 'neutral', emphasis: 'solid', heading: HEADING }, scheme });
      const style = getComputedStyle(part(note, '.container'));
      expect(style.backgroundColor).toBe(resolved('backgroundColor', '--nph-notification-neutral-solid', parent));
      const onSolid = resolved('color', '--nph-notification-neutral-on-solid', parent);
      expect(getComputedStyle(part(note, '.text .heading')).color).toBe(onSolid);
      expect(getComputedStyle(part(note, '.icon nph-icon')).color).toBe(onSolid);
    });

    it(`${scheme}: loading takes the popover surface and its border`, async () => {
      const { parent, note } = await mount({ attributes: { severity: 'loading', placement: 'toast' }, scheme });
      const style = getComputedStyle(part(note, '.container'));
      expect(style.backgroundColor).toBe(resolved('backgroundColor', '--nph-notification-loading-surface', parent));
      expect(style.borderTopColor).toBe(resolved('borderTopColor', '--nph-notification-loading-border', parent));
    });
  }

  it('the paddings are the contract ones: start, block and end', async () => {
    const { note } = await mount();
    const style = getComputedStyle(part(note, '.container'));
    expect(style.paddingLeft).toBe(resolved('paddingLeft', '--nph-notification-padding-start'));
    expect(style.paddingTop).toBe(resolved('paddingTop', '--nph-notification-padding-block'));
    expect(style.paddingRight).toBe(resolved('paddingLeft', '--nph-notification-padding-end'));
  });

  it('the gap between the icon, the content and the close is notification/gap', async () => {
    const { note } = await mount();
    const style = getComputedStyle(part(note, '.container'));
    expect(style.columnGap).toBe(resolved('columnGap', '--nph-notification-gap'));
  });

  it('inline: the radius is notification/radius and the box takes the width of its area', async () => {
    const { parent, note } = await mount({ parentStyle: 'inline-size: 520px;' });
    expect(getComputedStyle(part(note, '.container')).borderTopLeftRadius).toBe(resolved('borderTopLeftRadius', '--nph-notification-radius'));
    expect(note.getBoundingClientRect().width).toBe(parent.getBoundingClientRect().width);
    expect(getComputedStyle(part(note, '.container')).boxShadow).toBe('none');
  });

  it('subtle and solid have the same size: the solid border is kept, only hidden', async () => {
    const subtle = await mount({ parentStyle: 'inline-size: 520px;' });
    const solid = await mount({ attributes: { emphasis: 'solid' }, parentStyle: 'inline-size: 520px;' });
    expect(solid.note.getBoundingClientRect().height).toBe(subtle.note.getBoundingClientRect().height);
  });
});

describe('toast', () => {
  it('stacked: width notification/toast-width, radius notification/toast-radius and the elevation/modal effect', async () => {
    const { note } = await mount({ attributes: { placement: 'toast' }, parentStyle: 'inline-size: 800px;' });
    expect(note.getBoundingClientRect().width).toBe(px(resolved('width', '--nph-notification-toast-width')));
    const container = getComputedStyle(part(note, '.container'));
    expect(container.borderTopLeftRadius).toBe(resolved('borderTopLeftRadius', '--nph-notification-toast-radius'));
    expect(container.boxShadow).toBe(resolved('boxShadow', '--nph-elevation-modal'));
    expect(container.boxShadow).not.toBe('none');
  });

  it('single-line: width notification/toast-width-max', async () => {
    const { note } = await mount({
      attributes: { placement: 'toast', layout: 'single-line', description: 'Order sent.' },
      parentStyle: 'inline-size: 800px;',
    });
    expect(note.getBoundingClientRect().width).toBe(px(resolved('width', '--nph-notification-toast-width-max')));
  });

  it('never wider than its container, and never wider than the maximum', async () => {
    const { note } = await mount({
      attributes: { placement: 'toast', layout: 'single-line', description: 'Order sent.' },
      parentStyle: 'inline-size: 300px;',
    });
    expect(note.getBoundingClientRect().width).toBe(300);
  });

  it('light: the elevation casts a shadow; dark: its color is transparent, so there is none', async () => {
    const light = await mount({ attributes: { placement: 'toast' }, scheme: 'light' });
    const dark = await mount({ attributes: { placement: 'toast' }, scheme: 'dark' });
    const lightShadow = getComputedStyle(part(light.note, '.container')).boxShadow;
    const darkShadow = getComputedStyle(part(dark.note, '.container')).boxShadow;
    expect(lightShadow).toContain('rgba(0, 0, 0, 0.');
    expect(darkShadow.match(/rgba\(0, 0, 0, 0\)/g)?.length).toBeGreaterThan(0);
    expect(darkShadow).not.toMatch(/rgba\(0, 0, 0, 0\.[1-9]/);
  });

  it('the toast does not move focus when it appears', async () => {
    const field = document.createElement('input');
    document.body.append(field);
    field.focus();
    await mount({ attributes: { placement: 'toast', severity: 'error', action: 'Retry' } });
    expect(document.activeElement).toBe(field);
  });
});

describe('layout', () => {
  it('stacked: the text above and the actions below', async () => {
    const { note } = await mount({ attributes: { action: 'Review', 'secondary-action': 'Later' } });
    const text = part(note, '.text').getBoundingClientRect();
    const actions = part(note, '.actions').getBoundingClientRect();
    expect(actions.top).toBeGreaterThanOrEqual(text.bottom);
    expect(getComputedStyle(part(note, '.body')).flexDirection).toBe('column');
  });

  it('stacked: notification/content-gap between the title and the description', async () => {
    const { note } = await mount({ attributes: { heading: HEADING } });
    const heading = part(note, '.heading').getBoundingClientRect();
    const description = part(note, '.text .description').getBoundingClientRect();
    expect(description.top - heading.bottom).toBe(px(resolved('rowGap', '--nph-notification-content-gap')));
  });

  it('stacked: notification/content-actions-gap and actions-padding-top between the text and the actions', async () => {
    const { note } = await mount({ attributes: { action: 'Review' } });
    const text = part(note, '.text').getBoundingClientRect();
    const button = part(note, '.action').getBoundingClientRect();
    const expected = px(resolved('rowGap', '--nph-notification-content-actions-gap')) + px(resolved('paddingTop', '--nph-notification-actions-padding-top'));
    expect(button.top - text.bottom).toBe(expected);
  });

  it('notification/actions-gap between the two actions', async () => {
    const { note } = await mount({ attributes: { action: 'Review', 'secondary-action': 'Later' } });
    const [main, secondary] = buttons(note);
    const gap = (secondary as NphButton).getBoundingClientRect().left - (main as NphButton).getBoundingClientRect().right;
    expect(gap).toBe(px(resolved('columnGap', '--nph-notification-actions-gap')));
  });

  it('single-line that fits: everything on one row, with notification/content-gap-single-line', async () => {
    const { note } = await mount({
      attributes: { layout: 'single-line', heading: 'Saved', description: 'Order sent.', action: 'Undo' },
      parentStyle: 'inline-size: 640px;',
    });
    expect(note.hasAttribute('data-nph-reflowed')).toBe(false);
    const heading = part(note, '.text .heading').getBoundingClientRect();
    const description = part(note, '.text .description').getBoundingClientRect();
    const action = part(note, '.action').getBoundingClientRect();
    expect(Math.abs(heading.top - description.top)).toBeLessThanOrEqual(2);
    expect(description.left - heading.right).toBe(px(resolved('columnGap', '--nph-notification-content-gap-single-line')));
    expect(action.left).toBeGreaterThan(description.right);
    expect(Math.abs(action.top + action.height / 2 - (heading.top + heading.height / 2))).toBeLessThanOrEqual(heading.height);
  });

  it('single-line that does not fit reflows to stacked, with the action below the text', async () => {
    const { note } = await mount({
      attributes: { layout: 'single-line', heading: 'Deadline is near', action: 'Review' },
      parentStyle: 'inline-size: 360px;',
    });
    expect(note.hasAttribute('data-nph-reflowed')).toBe(true);
    const text = part(note, '.text').getBoundingClientRect();
    const action = part(note, '.action').getBoundingClientRect();
    expect(action.top).toBeGreaterThanOrEqual(text.bottom);
    expect(getComputedStyle(part(note, '.body')).flexDirection).toBe('column');
  });

  it('a toast keeps the width of its declared layout when the text reflows', async () => {
    const { note } = await mount({
      attributes: {
        placement: 'toast',
        layout: 'single-line',
        description: `${DESCRIPTION} ${DESCRIPTION}`,
        action: 'Review',
      },
      parentStyle: 'inline-size: 800px;',
    });
    expect(note.hasAttribute('data-nph-reflowed')).toBe(true);
    expect(note.getBoundingClientRect().width).toBe(px(resolved('width', '--nph-notification-toast-width-max')));
  });

  it('follows the width of the area both ways: narrow reflows, wide goes back to one line', async () => {
    const { parent, note } = await mount({
      attributes: { layout: 'single-line', heading: 'Saved', description: 'Order sent.', action: 'Undo' },
      parentStyle: 'inline-size: 640px;',
    });
    expect(note.hasAttribute('data-nph-reflowed')).toBe(false);
    parent.style.inlineSize = '200px';
    await note.updateComplete;
    note.requestUpdate();
    await note.updateComplete;
    expect(note.hasAttribute('data-nph-reflowed')).toBe(true);
    parent.style.inlineSize = '640px';
    note.requestUpdate();
    await note.updateComplete;
    expect(note.hasAttribute('data-nph-reflowed')).toBe(false);
  });

  it('a notification that was invalid and becomes valid also follows the width', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { note } = await mount({
      attributes: { layout: 'single-line', heading: 'Deadline is near', description: undefined, action: 'Review' },
      parentStyle: 'inline-size: 360px;',
    });
    expect(note.hasAttribute('data-nph-rendered')).toBe(false);
    note.description = 'The report is due in two days, so send it to the team today.';
    await note.updateComplete;
    expect(note.hasAttribute('data-nph-reflowed')).toBe(true);
  });

  it('a shorter action text on a reflowed notification goes back to one line, with no resize', async () => {
    const { note } = await mount({
      attributes: { layout: 'single-line', heading: 'Saved', description: 'Order sent to the warehouse.', action: 'Review the whole order and its history now' },
      parentStyle: 'inline-size: 480px;',
    });
    expect(note.hasAttribute('data-nph-reflowed')).toBe(true);
    note.action = 'Review';
    await note.updateComplete;
    await Promise.all(buttons(note).map((button) => button.updateComplete));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(note.hasAttribute('data-nph-reflowed')).toBe(false);
  });

  it('stacked never reflows', async () => {
    const { note } = await mount({ attributes: { description: `${DESCRIPTION} ${DESCRIPTION}` }, parentStyle: 'inline-size: 300px;' });
    expect(note.hasAttribute('data-nph-reflowed')).toBe(false);
  });

  it('the hidden twin of the text takes no space and does not widen the page', async () => {
    const { note } = await mount({
      attributes: { layout: 'single-line', description: DESCRIPTION.repeat(8), action: 'Undo' },
      parentStyle: 'inline-size: 300px;',
    });
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
    expect(getComputedStyle(part(note, '.probe-box')).visibility).toBe('hidden');
    expect(part(note, '.probe-box').getBoundingClientRect().width).toBe(0);
  });
});

describe('actions', () => {
  const MAIN = { info: 'info', success: 'success', warning: 'warn', error: 'danger', help: 'help', neutral: 'primary' } as const;

  for (const [severity, type] of Object.entries(MAIN)) {
    it(`${severity}: the main action is an nph-button ${type}, solid, size default`, async () => {
      const { note } = await mount({ attributes: { severity, action: 'Review' } });
      const [main] = buttons(note);
      expect(main?.getAttribute('severity')).toBe(type);
      expect(main?.getAttribute('emphasis')).toBe('solid');
      expect(main?.getAttribute('size')).toBe('default');
      expect(textOf(main as NphButton)).toBe('Review');
      expect(main?.hasAttribute('data-nph-rendered')).toBe(true);
    });
  }

  for (const severity of ['info', 'success', 'warning', 'help', 'neutral'] as const) {
    it(`${severity}: the secondary action is a primary ghost, in its action tokens`, async () => {
      const { note } = await mount({ attributes: { severity, action: 'Review', 'secondary-action': 'Later' } });
      const secondary = part<NphButton>(note, '.secondary');
      expect(secondary.getAttribute('severity')).toBe('primary');
      expect(secondary.getAttribute('emphasis')).toBe('ghost');
      expect(secondary.hasAttribute('data-nph-rendered')).toBe(true);
      const control = secondary.shadowRoot?.querySelector('.control') as HTMLElement;
      expect(getComputedStyle(control).color).toBe(resolved('color', `--nph-notification-${severity}-action-foreground`));
    });
  }

  it('error: the secondary action is a danger ghost, in the destructive action tokens', async () => {
    const { note } = await mount({ attributes: { severity: 'error', action: 'Retry', 'secondary-action': 'Cancel' } });
    const secondary = part<NphButton>(note, '.secondary');
    expect(secondary.getAttribute('severity')).toBe('danger');
    expect(secondary.getAttribute('emphasis')).toBe('ghost');
    const control = secondary.shadowRoot?.querySelector('.control') as HTMLElement;
    expect(getComputedStyle(control).color).toBe(resolved('color', '--nph-notification-error-action-foreground'));
  });

  for (const scheme of SCHEMES) {
    for (const severity of [...COLORED, 'neutral'] as const) {
      it(`${scheme}: ${severity} secondary action hovers on notification/${severity}-action-background-hover`, async () => {
        const { parent, note } = await mount({ attributes: { severity, action: 'Review', 'secondary-action': 'Later' }, scheme });
        const secondary = part<NphButton>(note, '.secondary');
        const control = secondary.shadowRoot?.querySelector('.control') as HTMLElement;
        expect(getComputedStyle(control).backgroundColor).toBe('rgba(0, 0, 0, 0)');
        await userEvent.hover(control);
        expect(getComputedStyle(control).backgroundColor).toBe(resolved('backgroundColor', `--nph-notification-${severity}-action-background-hover`, parent));
        await userEvent.unhover(control);
      });
    }
  }

  it('the colors of the secondary action are set on that element only: the main action and the page keep theirs', async () => {
    const { note } = await mount({ attributes: { severity: 'info', action: 'Review', 'secondary-action': 'Later' } });
    const [main] = buttons(note);
    expect(getComputedStyle(main as NphButton).getPropertyValue('--nph-color-primary-on-surface')).toBe(
      getComputedStyle(document.body).getPropertyValue('--nph-color-primary-on-surface'),
    );
    expect(getComputedStyle(note).getPropertyValue('--nph-color-primary-surface')).toBe(
      getComputedStyle(document.body).getPropertyValue('--nph-color-primary-surface'),
    );
  });

  it('at most two actions: the second one follows the first, at notification/actions-gap', async () => {
    const { note } = await mount({ attributes: { action: 'Review', 'secondary-action': 'Later' } });
    expect(buttons(note).map(textOf)).toEqual(['Review', 'Later']);
  });

  it('the click of each action fires nph-action with its own detail, bubbling and composed', async () => {
    const { parent, note } = await mount({ attributes: { action: 'Review', 'secondary-action': 'Later' } });
    const seen: NphNotificationActionDetail[] = [];
    parent.addEventListener('nph-action', (event) => seen.push((event as CustomEvent<NphNotificationActionDetail>).detail));
    const [main, secondary] = buttons(note);
    (main as NphButton).click();
    (secondary as NphButton).click();
    expect(seen).toEqual([{ action: 'primary' }, { action: 'secondary' }]);
  });

  it('single-line takes only the main action', async () => {
    const { note } = await mount({ attributes: { layout: 'single-line', action: 'Review', 'secondary-action': 'Later' } });
    expect(buttons(note).map(textOf)).toEqual(['Review']);
    expect(has(note, '.secondary')).toBe(false);
  });

  it('solid has no actions, only the close button', async () => {
    const { note } = await mount({ attributes: { emphasis: 'solid', action: 'Review', 'secondary-action': 'Later' } });
    expect(buttons(note)).toHaveLength(0);
    expect(has(note, '.actions')).toBe(false);
    expect(has(note, '.close nph-button')).toBe(true);
  });

  it('loading has no actions', async () => {
    const { note } = await mount({ attributes: { severity: 'loading', placement: 'toast', action: 'Review' } });
    expect(buttons(note)).toHaveLength(0);
  });

  it('on a touch screen the actions switch to the size large of nph-button', async () => {
    const query = {
      matches: true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    } as unknown as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockReturnValue(query);
    const { note } = await mount({ attributes: { action: 'Review', 'secondary-action': 'Later' } });
    expect(buttons(note).map((button) => button.getAttribute('size'))).toEqual(['large', 'large']);
  });

  it('follows the pointer media query when it changes', async () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined;
    const query = {
      matches: false,
      addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
        listener = callback;
      },
      removeEventListener: () => undefined,
    } as unknown as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockReturnValue(query);
    const { note } = await mount({ attributes: { action: 'Review' } });
    expect(buttons(note)[0]?.getAttribute('size')).toBe('default');
    listener?.({ matches: true } as MediaQueryListEvent);
    await note.updateComplete;
    expect(buttons(note)[0]?.getAttribute('size')).toBe('large');
  });
});

describe('close button', () => {
  it('is an nph-button secondary ghost with only the xmark icon, named by close-label', async () => {
    const { note } = await mount();
    const close = closeButton(note);
    expect(close.getAttribute('severity')).toBe('secondary');
    expect(close.getAttribute('emphasis')).toBe('ghost');
    expect(close.getAttribute('icon-start')).toBe('xmark');
    expect(close.label).toBe(CLOSE);
    expect(close.text).toBe('');
    expect(close.hasAttribute('data-nph-icon-only')).toBe(true);
  });

  it('sits at the end corner, at the top', async () => {
    const { note } = await mount({ attributes: { heading: HEADING, action: 'Review' } });
    const container = part(note, '.container').getBoundingClientRect();
    const close = part(note, '.close').getBoundingClientRect();
    expect(close.right).toBeLessThanOrEqual(container.right);
    expect(close.top - container.top).toBeLessThan(container.height / 2);
    expect(container.right - close.right).toBe(px(resolved('paddingLeft', '--nph-notification-padding-end')) + px(resolved('borderTopWidth', '--nph-notification-border-width')));
  });

  it('hide-close turns it off', async () => {
    const { note } = await mount({ attributes: { 'hide-close': true, 'close-label': undefined } });
    expect(has(note, '.close')).toBe(false);
    expect(note.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('loading has no close button, whatever the properties say', async () => {
    const { note } = await mount({ attributes: { severity: 'loading', placement: 'toast' } });
    expect(has(note, '.close')).toBe(false);
  });

  it('the click fires nph-close with the close-button source and the notification hides itself', async () => {
    const { parent, note } = await mount();
    const seen: NphNotificationCloseDetail[] = [];
    parent.addEventListener('nph-close', (event) => seen.push((event as CustomEvent<NphNotificationCloseDetail>).detail));
    closeButton(note).click();
    expect(seen).toEqual([{ source: 'close-button' }]);
    expect(note.hidden).toBe(true);
    expect(getComputedStyle(note).display).toBe('none');
  });

  it('preventDefault on nph-close keeps it', async () => {
    const { parent, note } = await mount();
    parent.addEventListener('nph-close', (event) => event.preventDefault());
    closeButton(note).click();
    expect(note.hidden).toBe(false);
    expect(getComputedStyle(note).display).not.toBe('none');
  });

  it('the event bubbles through the shadow root and is cancelable', async () => {
    const { note } = await mount();
    let received: Event | undefined;
    document.body.addEventListener('nph-close', (event) => (received = event), { once: true });
    closeButton(note).click();
    expect(received?.bubbles).toBe(true);
    expect(received?.composed).toBe(true);
    expect(received?.cancelable).toBe(true);
  });

  it('the keyboard closes it, as the native button does', async () => {
    const { note } = await mount();
    const before = document.createElement('input');
    note.before(before);
    before.focus();
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Enter}');
    expect(note.hidden).toBe(true);
  });

  it('shows the tooltip of the icon-only button, named by the close-label', async () => {
    const { note } = await mount();
    expect(closeButton(note).shadowRoot?.querySelector('nph-tooltip')).not.toBeNull();
  });
});

describe('close on solid', () => {
  for (const scheme of SCHEMES) {
    for (const severity of [...COLORED, 'neutral'] as const) {
      const neutral = severity === 'neutral';
      const hoverToken = neutral ? '--nph-notification-neutral-close-background-hover' : '--nph-notification-close-background-hover';
      const onSolid = neutral ? '--nph-notification-neutral-on-solid' : '--nph-notification-on-solid';

      it(`${scheme}: ${severity} close has the icon in the text color and hovers at 16% of the contract color`, async () => {
        const { parent, note } = await mount({ attributes: { severity, emphasis: 'solid' }, scheme });
        const close = closeButton(note);
        const control = close.shadowRoot?.querySelector('.control') as HTMLElement;
        expect(getComputedStyle(control).color).toBe(resolved('color', onSolid, parent));
        expect(getComputedStyle(control).backgroundColor).toBe('rgba(0, 0, 0, 0)');
        await userEvent.hover(control);
        const hover = getComputedStyle(control).backgroundColor;
        await userEvent.unhover(control);
        const probe = document.createElement('div');
        probe.style.backgroundColor = `color-mix(in srgb, var(${hoverToken}) calc(var(--nph-notification-close-background-hover-opacity) * 100%), transparent)`;
        parent.append(probe);
        const expected = getComputedStyle(probe).backgroundColor;
        probe.remove();
        expect(hover).toBe(expected);
        expect(hover).not.toBe('rgba(0, 0, 0, 0)');
        expect(hover).toMatch(/0\.16\)?$/);
      });
    }
  }

  it('the opacity token is 16%', () => {
    expect(tokensCss).toContain('--nph-core-opacity-16: 0.16;');
  });

  for (const scheme of SCHEMES) {
    it(`${scheme}: the focus is a 2 px border in the text color, with no halo`, async () => {
      const { parent, note } = await mount({ attributes: { severity: 'error', emphasis: 'solid' }, scheme });
      const before = document.createElement('input');
      note.before(before);
      before.focus();
      await userEvent.keyboard('{Tab}');
      const close = closeButton(note);
      const control = close.shadowRoot?.querySelector('.control') as HTMLElement;
      expect(close.shadowRoot?.activeElement).toBe(control);
      const ring = getComputedStyle(control, '::before');
      expect(ring.borderTopWidth).toBe(resolved('borderTopWidth', '--nph-notification-close-focus-border-width', parent));
      expect(ring.borderTopWidth).toBe('2px');
      expect(ring.borderTopColor).toBe(resolved('borderTopColor', '--nph-notification-close-focus-border', parent));
      expect(ring.borderTopLeftRadius).toBe(resolved('borderTopLeftRadius', '--nph-focus-border-radius-control', parent));
      const halo = getComputedStyle(control, '::after');
      expect(halo.borderTopColor).toBe('rgba(0, 0, 0, 0)');
    });
  }

  it('on subtle, the close keeps the focus ring and the hover of the icon button', async () => {
    const { note } = await mount({ attributes: { severity: 'error' } });
    const close = closeButton(note);
    const style = getComputedStyle(close);
    expect(style.getPropertyValue('--nph-focus-halo')).toBe(getComputedStyle(document.body).getPropertyValue('--nph-focus-halo'));
    expect(style.getPropertyValue('--nph-border-width')).toBe(getComputedStyle(document.body).getPropertyValue('--nph-border-width'));
    const control = close.shadowRoot?.querySelector('.control') as HTMLElement;
    expect(getComputedStyle(control).color).toBe(resolved('color', '--nph-color-secondary-foreground'));
  });

  it('the re-pointed tokens are set on the close button only, never on the notification or the page', async () => {
    const { note } = await mount({ attributes: { severity: 'error', emphasis: 'solid', action: 'Retry' } });
    expect(getComputedStyle(note).getPropertyValue('--nph-border-width')).toBe(getComputedStyle(document.body).getPropertyValue('--nph-border-width'));
    expect(getComputedStyle(note).getPropertyValue('--nph-focus-halo')).toBe(getComputedStyle(document.body).getPropertyValue('--nph-focus-halo'));
  });
});

describe('touch target', () => {
  it('with a mouse the close box is the default control height', async () => {
    const { note } = await mount();
    expect(closeButton(note).getBoundingClientRect().height).toBe(px(resolved('height', '--nph-control-height-default')));
  });

  it('the CSS grows the touch area of the close to control/height-large on a coarse pointer, with no change to the drawing', () => {
    const start = componentCss.indexOf('@media (pointer: coarse)');
    const block = componentCss.slice(start, componentCss.indexOf('\n}\n', start));
    expect(block).toContain('min-inline-size: var(--nph-control-height-large)');
    expect(block).toContain('min-block-size: var(--nph-control-height-large)');
    expect(block).toContain('calc((var(--nph-control-height-default) - var(--nph-control-height-large)) / 2)');
    expect(block).not.toMatch(/nph-button\s*\{/);
  });
});

describe('semantics', () => {
  for (const severity of ['error', 'warning'] as const) {
    it(`${severity} is announced as an alert`, async () => {
      const { note } = await mount({ attributes: { severity, placement: 'toast' } });
      expect(note.getAttribute('role')).toBe('alert');
    });
  }

  for (const severity of ['info', 'success', 'help', 'neutral', 'loading'] as const) {
    it(`${severity} is announced as status`, async () => {
      const { note } = await mount({ attributes: { severity, placement: 'toast' } });
      expect(note.getAttribute('role')).toBe('status');
    });
  }

  it('the role follows the severity when it changes', async () => {
    const { note } = await mount();
    expect(note.getAttribute('role')).toBe('status');
    note.severity = 'error';
    await note.updateComplete;
    expect(note.getAttribute('role')).toBe('alert');
  });

  it('the severity icon is out of the reading and the container is not focusable', async () => {
    const { note } = await mount({ attributes: { heading: HEADING } });
    const icon = part(note, '.icon nph-icon');
    expect(icon.getAttribute('label')).toBeNull();
    expect(note.shadowRoot?.querySelector('.container')?.hasAttribute('tabindex')).toBe(false);
  });

  it('the hidden twin of the text is out of the reading', async () => {
    const { note } = await mount({ attributes: { heading: HEADING } });
    expect(part(note, '.probe-box').getAttribute('aria-hidden')).toBe('true');
  });

  it('the host takes no focus: with no actions and no close, nothing inside takes it either', async () => {
    const { note } = await mount({ attributes: { 'hide-close': true, 'close-label': undefined } });
    expect(note.shadowRoot?.querySelector('button, [tabindex], a, input')).toBeNull();
  });
});

describe('the time a toast stays', () => {
  const advance = async (note: NphNotification, ms: number): Promise<void> => {
    await vi.advanceTimersByTimeAsync(ms);
    await note.updateComplete;
  };

  it('closes by itself after 6000 ms by default, firing nph-close with the timeout source', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { parent, note } = await mount({ attributes: { placement: 'toast' } });
    const seen: NphNotificationCloseDetail[] = [];
    parent.addEventListener('nph-close', (event) => seen.push((event as CustomEvent<NphNotificationCloseDetail>).detail));
    await advance(note, 5999);
    expect(seen).toEqual([]);
    await advance(note, 1);
    expect(seen).toEqual([{ source: 'timeout' }]);
    expect(note.hidden).toBe(true);
  });

  it('a longer duration is honored', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { note } = await mount({ attributes: { placement: 'toast', duration: '10000' } });
    await advance(note, 9999);
    expect(note.hidden).toBe(false);
    await advance(note, 1);
    expect(note.hidden).toBe(true);
  });

  it('duration 0 keeps the toast until the person closes it', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { note } = await mount({ attributes: { placement: 'toast', duration: '0' } });
    await advance(note, 60000);
    expect(note.hidden).toBe(false);
  });

  it('inline never closes by itself', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { note } = await mount();
    await advance(note, 60000);
    expect(note.hidden).toBe(false);
  });

  for (const [name, attributes] of [
    ['an error toast', { severity: 'error' }],
    ['a toast with an action', { action: 'Undo' }],
    ['a toast with two actions', { action: 'Undo', 'secondary-action': 'Later' }],
    ['a loading toast', { severity: 'loading' }],
  ] as const) {
    it(`${name} only leaves when the person acts or closes it (WCAG 2.2.1)`, async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
      const { note } = await mount({ attributes: { placement: 'toast', ...attributes } });
      await advance(note, 60000);
      expect(note.hidden).toBe(false);
    });
  }

  it('a warning toast without an action does close by itself', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { note } = await mount({ attributes: { placement: 'toast', severity: 'warning' } });
    await advance(note, 6000);
    expect(note.hidden).toBe(true);
  });

  it('pauses while the pointer is over it and goes on with the time that was left', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { note } = await mount({ attributes: { placement: 'toast' } });
    await advance(note, 4000);
    note.dispatchEvent(new PointerEvent('pointerenter'));
    await advance(note, 60000);
    expect(note.hidden).toBe(false);
    note.dispatchEvent(new PointerEvent('pointerleave'));
    await advance(note, 1999);
    expect(note.hidden).toBe(false);
    await advance(note, 1);
    expect(note.hidden).toBe(true);
  });

  it('pauses while focus is inside it, and goes on when the focus leaves', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { note } = await mount({ attributes: { placement: 'toast' } });
    const outside = document.createElement('input');
    document.body.append(outside);
    await advance(note, 3000);
    closeButton(note).focus();
    await advance(note, 60000);
    expect(note.hidden).toBe(false);
    outside.focus();
    await advance(note, 2999);
    expect(note.hidden).toBe(false);
    await advance(note, 1);
    expect(note.hidden).toBe(true);
  });

  it('moving the focus between two parts of the toast does not restart or release it', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { note } = await mount({ attributes: { placement: 'toast' } });
    closeButton(note).focus();
    note.dispatchEvent(new FocusEvent('focusout', { relatedTarget: note }));
    await advance(note, 60000);
    expect(note.hidden).toBe(false);
  });

  it('preventDefault on the timeout keeps the toast, and the timer does not restart', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { parent, note } = await mount({ attributes: { placement: 'toast' } });
    let count = 0;
    parent.addEventListener('nph-close', (event) => {
      count += 1;
      event.preventDefault();
    });
    await advance(note, 60000);
    expect(count).toBe(1);
    expect(note.hidden).toBe(false);
  });

  it('the timer stops when the notification leaves the page', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { parent, note } = await mount({ attributes: { placement: 'toast' } });
    const seen: string[] = [];
    document.body.addEventListener('nph-close', () => seen.push('close'));
    note.remove();
    await vi.advanceTimersByTimeAsync(60000);
    expect(seen).toEqual([]);
    expect(parent.isConnected).toBe(true);
  });

  it('a toast that starts hidden and is shown with hidden = false closes by itself', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { parent, note } = await mount({ attributes: { placement: 'toast', hidden: true } });
    const seen: string[] = [];
    parent.addEventListener('nph-close', () => seen.push('close'));
    await advance(note, 60000);
    expect(seen).toEqual([]);
    note.hidden = false;
    await advance(note, 5999);
    expect(seen).toEqual([]);
    await advance(note, 1);
    expect(seen).toEqual(['close']);
    expect(note.hidden).toBe(true);
  });

  it('hiding a toast whose timer is armed stops it: no nph-close while it is invisible', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { parent, note } = await mount({ attributes: { placement: 'toast' } });
    const seen: string[] = [];
    parent.addEventListener('nph-close', () => seen.push('close'));
    await advance(note, 3000);
    note.hidden = true;
    await advance(note, 60000);
    expect(seen).toEqual([]);
  });

  it('moving the notification in the page starts the timer again', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { parent, note } = await mount({ attributes: { placement: 'toast' } });
    const other = document.createElement('div');
    document.body.append(other);
    other.append(note);
    await note.updateComplete;
    await advance(note, 6000);
    expect(note.hidden).toBe(true);
    expect(parent.isConnected).toBe(true);
  });

  it('closing with the button stops the timer: nph-close fires once', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { parent, note } = await mount({ attributes: { placement: 'toast' } });
    let count = 0;
    parent.addEventListener('nph-close', () => (count += 1));
    closeButton(note).click();
    await advance(note, 60000);
    expect(count).toBe(1);
  });
});

describe('time bar', () => {
  it('a subtle toast that closes by itself shows an nph-skeleton line at its base, decorative', async () => {
    const { note } = await mount({ attributes: { placement: 'toast', 'time-bar': true } });
    const bar = part(note, '.time-bar');
    expect(bar.tagName).toBe('NPH-SKELETON');
    expect(bar.getAttribute('shape')).toBe('line');
    expect(bar.getAttribute('aria-hidden')).toBe('true');
    const container = part(note, '.container').getBoundingClientRect();
    const box = bar.getBoundingClientRect();
    expect(Math.abs(box.bottom - (container.bottom - px(resolved('borderTopWidth', '--nph-notification-border-width'))))).toBeLessThanOrEqual(1);
    expect(box.width).toBeGreaterThan(container.width / 2);
  });

  it('is off by default', async () => {
    const { note } = await mount({ attributes: { placement: 'toast' } });
    expect(has(note, '.time-bar')).toBe(false);
  });
});

describe('invalid input', () => {
  const CASES: Array<[string, Attributes]> = [
    ['a placement outside the list', { placement: 'banner' }],
    ['a severity outside the list', { severity: 'danger' }],
    ['an emphasis outside the list', { emphasis: 'outline' }],
    ['a layout outside the list', { layout: 'wide' }],
    ['no description', { description: undefined }],
    ['a description of only spaces', { description: '   ' }],
    ['loading inline', { severity: 'loading' }],
    ['loading solid', { severity: 'loading', placement: 'toast', emphasis: 'solid' }],
    ['a duration under 6000', { placement: 'toast', duration: '3000' }],
    ['a negative duration', { placement: 'toast', duration: '-1' }],
    ['a secondary action without the main one', { 'secondary-action': 'Later' }],
    ['the time bar inline', { 'time-bar': true }],
    ['the time bar on a solid toast', { placement: 'toast', emphasis: 'solid', 'time-bar': true }],
    ['the time bar on error', { placement: 'toast', severity: 'error', 'time-bar': true }],
    ['the time bar with an action', { placement: 'toast', action: 'Undo', 'time-bar': true }],
    ['the time bar with duration 0', { placement: 'toast', duration: '0', 'time-bar': true }],
    ['the close shown with no close-label', { 'close-label': undefined }],
  ];

  for (const [name, attributes] of CASES) {
    it(`${name}: draws nothing, takes no space and emits console.error`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { note } = await mount({ attributes });
      expect(note.hasAttribute('data-nph-rendered'), name).toBe(false);
      expect(getComputedStyle(note).display).toBe('none');
      expect(note.shadowRoot?.querySelector('.container')).toBeNull();
      expect(note.hasAttribute('role')).toBe(false);
      expect(error).toHaveBeenCalled();
      expect(String(error.mock.calls[0]?.[0])).toContain('[nph-notification]');
    });
  }

  it('says every cause once, and again only when it changes', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { note } = await mount({ attributes: { severity: 'danger', description: undefined } });
    expect(error).toHaveBeenCalledTimes(2);
    note.heading = 'A title';
    await note.updateComplete;
    expect(error).toHaveBeenCalledTimes(2);
  });

  it('fixing the input draws the notification', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { note } = await mount({ attributes: { severity: 'danger' } });
    note.severity = 'error';
    await note.updateComplete;
    expect(note.hasAttribute('data-nph-rendered')).toBe(true);
    expect(note.getAttribute('role')).toBe('alert');
  });

  it('the parts the contract says have no effect are not drawn, with no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await mount({ attributes: { emphasis: 'solid', action: 'Review', 'secondary-action': 'Later' } });
    await mount({ attributes: { layout: 'single-line', action: 'Review', 'secondary-action': 'Later' } });
    await mount({ attributes: { severity: 'loading', placement: 'toast', action: 'Review', 'secondary-action': 'Later' } });
    expect(error).not.toHaveBeenCalled();
  });

  it('a duration on an inline notification, on an error or with an action is ignored, with no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await mount({ attributes: { duration: '8000' } });
    await mount({ attributes: { placement: 'toast', severity: 'error', duration: '8000' } });
    await mount({ attributes: { placement: 'toast', action: 'Undo', duration: '8000' } });
    expect(error).not.toHaveBeenCalled();
  });

  it('honors hidden with valid input and can be shown again', async () => {
    const { note } = await mount();
    note.hidden = true;
    expect(getComputedStyle(note).display).toBe('none');
    note.hidden = false;
    expect(getComputedStyle(note).display).toBe('block');
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css', () => {
    const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] as string));
    expect(used.size).toBeGreaterThan(40);
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('every notification token of the contract is read by the CSS, but the gap of the region, which belongs to the consumer container', () => {
    const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-notification-[a-z0-9-]+)\)/g)].map((match) => match[1] as string));
    const all = [...new Set([...tokensCss.matchAll(/(--nph-notification-[a-z0-9-]+):/g)].map((match) => match[1] as string))];
    expect(all.length).toBeGreaterThan(50);
    const unused = all.filter((name) => !used.has(name));
    expect(unused, 'tokens of the contract the CSS does not read').toEqual(['--nph-notification-stack-gap']);
  });

  it('the CSS has no literal design value; the written quantities are box relations', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments.replaceAll('100%', '')).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(cssWithoutComments).not.toMatch(/\b(animation|transition|@keyframes)\b/);
    expect(cssWithoutComments).not.toMatch(/\b(320|360|440)\b/);
  });

  it('the CSS reads no private variable of the pieces it composes and sets only public tokens on them', () => {
    expect(cssWithoutComments).not.toMatch(/--_(bg|fg|outline|focus-border|focus-halo|height)/);
    const set = [...cssWithoutComments.matchAll(/^\s+(--nph-[a-z0-9-]+):/gm)].map((match) => match[1] as string);
    expect(new Set(set)).toEqual(
      new Set([
        '--nph-color-primary-on-surface',
        '--nph-color-primary-surface',
        '--nph-color-destructive-on-surface',
        '--nph-color-destructive-surface',
        '--nph-color-secondary-foreground',
        '--nph-icon-button-secondary-ghost-background-hover',
        '--nph-focus-border',
        '--nph-focus-halo',
        '--nph-border-width',
      ]),
    );
    for (const name of set) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('the elevation is the modal effect, used directly: there is no notification token for it', () => {
    expect(cssWithoutComments).toContain('var(--nph-elevation-modal)');
    expect(tokensCss).not.toContain('--nph-notification-elevation');
  });
});
