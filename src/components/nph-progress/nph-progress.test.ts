/**
 * Tests of `nph-progress` (P107), in a real browser (P21, item 5): geometry, the loop and the
 * colors only exist where there is layout, animation and resolved tokens.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cdp } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-progress.css?raw';
import { NPH_PROGRESS_SIZES, NPH_PROGRESS_STATUSES, NPH_PROGRESS_STEP_COUNTS, NPH_PROGRESS_TYPES, NphProgress } from './nph-progress';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

type Props = Partial<{
  type: string;
  size: string;
  status: string;
  value: number | null;
  steps: number | null;
  step: number;
  label: string | null;
  valueText: string | null;
  help: string | null;
}>;

async function mount(properties: Props = {}, attributes: Record<string, string> = {}, width = '280px'): Promise<NphProgress> {
  const element = document.createElement('nph-progress');
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  Object.assign(element, properties);
  const container = document.createElement('div');
  container.style.inlineSize = width;
  container.append(element);
  document.body.append(container);
  await element.updateComplete;
  return element;
}

/** The part of the shadow root, by class. */
function part<T extends HTMLElement = HTMLElement>(element: NphProgress, selector: string): T | null {
  return element.shadowRoot?.querySelector<T>(selector) ?? null;
}

const track = (element: NphProgress) => part(element, '.track') as HTMLElement;

/** The value of a token as the browser resolves it for a property, so the test follows the token. */
function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

describe('registration and API', () => {
  it('defines nph-progress exactly once', () => {
    expect(customElements.get('nph-progress')).toBe(NphProgress);
  });

  it('the public API is exactly the contract', () => {
    const declared = [...(NphProgress as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(new Set(declared)).toEqual(
      new Set(['type', 'size', 'status', 'value', 'steps', 'step', 'label', 'valueText', 'help', 'hostName']),
    );
  });

  it('the values of the lists are the ones of the contract', () => {
    expect([...NPH_PROGRESS_TYPES]).toEqual(['determinate', 'indeterminate', 'steps']);
    expect([...NPH_PROGRESS_SIZES]).toEqual(['md', 'sm']);
    expect([...NPH_PROGRESS_STATUSES]).toEqual(['active', 'success', 'error']);
    expect([...NPH_PROGRESS_STEP_COUNTS]).toEqual([3, 4, 5]);
  });

  it('defaults: determinate, md, active, value 0, step 1, no text', async () => {
    const progress = await mount();
    expect(progress.type).toBe('determinate');
    expect(progress.size).toBe('md');
    expect(progress.status).toBe('active');
    expect(progress.value).toBe(0);
    expect(progress.step).toBe(1);
    expect(progress.steps).toBeNull();
    expect(progress.label).toBeNull();
    expect(progress.valueText).toBeNull();
    expect(progress.help).toBeNull();
  });

  it('type, size and status reflect to the attribute', async () => {
    const progress = await mount();
    expect(progress.getAttribute('type')).toBe('determinate');
    expect(progress.getAttribute('size')).toBe('md');
    expect(progress.getAttribute('status')).toBe('active');
    progress.type = 'indeterminate';
    progress.size = 'sm';
    await progress.updateComplete;
    expect(progress.getAttribute('type')).toBe('indeterminate');
    expect(progress.getAttribute('size')).toBe('sm');
  });

  it('reads value, steps and step from the attributes', async () => {
    const progress = await mount({}, { type: 'steps', steps: '4', step: '2', value: '40' });
    expect(progress.steps).toBe(4);
    expect(progress.step).toBe(2);
    expect(progress.value).toBe(40);
  });

  it('has no slot, no part and no event of its own', async () => {
    const progress = await mount({ label: 'File upload' });
    expect(progress.shadowRoot?.querySelector('slot')).toBeNull();
    expect(progress.shadowRoot?.querySelector('[part]')).toBeNull();
  });
});

describe('determinate: the indicator and the end stop', () => {
  it('the bar is 8 px at md and 4 px at sm, and the pill follows the radius token', async () => {
    for (const [size, height] of [['md', 8], ['sm', 4]] as const) {
      const progress = await mount({ size, value: 50 });
      const box = track(progress).getBoundingClientRect();
      expect(box.height, size).toBe(height);
      expect(getComputedStyle(track(progress)).borderTopLeftRadius, size).toBe(resolved('border-radius', '--nph-progress-radius'));
      progress.remove();
    }
  });

  it('the indicator is shorter than the proportion by the track gap, below 100', async () => {
    const progress = await mount({ value: 50 });
    const gap = parseFloat(resolved('width', '--nph-progress-track-gap'));
    const box = part(progress, '.indicator')!.getBoundingClientRect();
    expect(box.width).toBeCloseTo(280 * 0.5 - gap, 1);
    expect(box.height).toBe(8);
  });

  it('the gap after the indicator is empty: the track paints nothing there, the rest starts after the gap', async () => {
    const progress = await mount({ value: 50 });
    const gap = parseFloat(resolved('width', '--nph-progress-track-gap'));
    const bar = track(progress).getBoundingClientRect();
    const indicator = part(progress, '.indicator')!.getBoundingClientRect();
    const rest = part(progress, '.rest')!.getBoundingClientRect();
    expect(getComputedStyle(track(progress)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(rest.left - indicator.right).toBeCloseTo(gap, 1);
    expect(rest.right).toBeCloseTo(bar.right, 1);
    expect(rest.left).toBeCloseTo(bar.left + bar.width * 0.5, 1);
    /* Nothing is painted in the middle of the gap: the element there is the track, with no color. */
    const middle = document.elementsFromPoint(indicator.right + gap / 2, bar.top + bar.height / 2);
    const painted = middle.filter((element) => element.shadowRoot === null && getComputedStyle(element).backgroundColor !== 'rgba(0, 0, 0, 0)');
    expect(painted.map((element) => element.tagName)).not.toContain('SPAN');
  });

  it('at 0 the rest fills the whole track, and at 100 there is no rest', async () => {
    const empty = await mount({ value: 0 });
    expect(part(empty, '.rest')!.getBoundingClientRect().width).toBe(280);
    const full = await mount({ value: 100 });
    expect(part(full, '.rest')).toBeNull();
  });

  it('never goes below zero width: at 1 the indicator is a sliver, not a negative box', async () => {
    const progress = await mount({ value: 1 });
    expect(part(progress, '.indicator')!.getBoundingClientRect().width).toBeGreaterThanOrEqual(0);
  });

  it('at 0 the indicator disappears and only the end stop remains', async () => {
    const progress = await mount({ value: 0 });
    expect(getComputedStyle(part(progress, '.indicator')!).display).toBe('none');
    expect(part(progress, '.stop')).not.toBeNull();
  });

  it('at 100 the indicator fills the track, with no gap and no end stop', async () => {
    const progress = await mount({ value: 100 });
    expect(part(progress, '.indicator')!.getBoundingClientRect().width).toBe(280);
    expect(part(progress, '.stop')).toBeNull();
  });

  it('the end stop is 4 x 4 on both sizes, at the end of the track and never taller than the bar', async () => {
    for (const size of ['md', 'sm'] as const) {
      const progress = await mount({ size, value: 25 });
      const stop = part(progress, '.stop')!.getBoundingClientRect();
      const bar = track(progress).getBoundingClientRect();
      expect(stop.width, size).toBe(4);
      expect(stop.height, size).toBe(4);
      expect(stop.height, size).toBeLessThanOrEqual(bar.height);
      expect(stop.right, size).toBeCloseTo(bar.right, 1);
      progress.remove();
    }
  });

  it('the end stop shows on every value below 100 and never overlaps the indicator', async () => {
    for (const value of [0, 1, 25, 50, 75, 97, 99, 99.5]) {
      const progress = await mount({ value });
      const stop = part(progress, '.stop')!.getBoundingClientRect();
      const indicator = part(progress, '.indicator')!.getBoundingClientRect();
      expect(stop.width, String(value)).toBe(4);
      if (value > 0) expect(indicator.right, String(value)).toBeLessThanOrEqual(stop.left + 0.01);
      progress.remove();
    }
  });

  it('the colors come from the progress tokens', async () => {
    const progress = await mount({ value: 50 });
    expect(getComputedStyle(part(progress, '.rest')!).backgroundColor).toBe(
      resolved('background-color', '--nph-progress-track-background'),
    );
    expect(getComputedStyle(part(progress, '.indicator')!).backgroundColor).toBe(
      resolved('background-color', '--nph-progress-indicator-background'),
    );
    expect(getComputedStyle(part(progress, '.stop')!).backgroundColor).toBe(
      resolved('background-color', '--nph-progress-stop-background'),
    );
  });

  it('success and error paint the indicator with their token, at 100', async () => {
    for (const status of ['success', 'error'] as const) {
      const progress = await mount({ status, value: 100, help: 'Done.' });
      expect(getComputedStyle(part(progress, '.indicator')!).backgroundColor, status).toBe(
        resolved('background-color', `--nph-progress-indicator-background-${status}`),
      );
      progress.remove();
    }
  });

  it('the width is fluid, with a minimum of 48 px', async () => {
    const wide = await mount({ value: 50 }, {}, '500px');
    expect(wide.getBoundingClientRect().width).toBe(500);
    wide.remove();
    const narrow = await mount({ value: 50 }, {}, '20px');
    expect(narrow.getBoundingClientRect().width).toBe(48);
  });
});

describe('the optional texts and the status icon', () => {
  it('draws the label, the value text and the help text, in that order, with the token colors', async () => {
    const progress = await mount({ value: 50, label: 'File upload', valueText: '50%', help: 'Do not close this window.' });
    const label = part(progress, '.label')!;
    const valueText = part(progress, '.value-text')!;
    const help = part(progress, '.help')!;
    expect(label.textContent).toBe('File upload');
    expect(valueText.textContent).toBe('50%');
    expect(help.textContent).toBe('Do not close this window.');
    expect(getComputedStyle(label).color).toBe(resolved('color', '--nph-progress-label-foreground'));
    expect(getComputedStyle(valueText).color).toBe(resolved('color', '--nph-progress-value-foreground'));
    expect(getComputedStyle(help).color).toBe(resolved('color', '--nph-progress-help-foreground'));
    expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(valueText.getBoundingClientRect().left);
    expect(track(progress).getBoundingClientRect().top).toBeGreaterThanOrEqual(label.getBoundingClientRect().bottom);
    expect(help.getBoundingClientRect().top).toBeGreaterThanOrEqual(track(progress).getBoundingClientRect().bottom);
  });

  it('the gaps come from the tokens: label to bar and bar to help, label to value text', async () => {
    const progress = await mount({ value: 50, label: 'File upload', valueText: '50%', help: 'Help' });
    const stack = parseFloat(resolved('width', '--nph-progress-gap'));
    const inline = parseFloat(resolved('width', '--nph-progress-label-gap'));
    const header = part(progress, '.header')!.getBoundingClientRect();
    const bar = track(progress).getBoundingClientRect();
    const help = part(progress, '.help')!.getBoundingClientRect();
    expect(bar.top - header.bottom).toBeCloseTo(stack, 1);
    expect(help.top - bar.bottom).toBeCloseTo(stack, 1);
    const label = part(progress, '.label')!.getBoundingClientRect();
    const valueText = part(progress, '.value-text')!.getBoundingClientRect();
    expect(valueText.left - label.right).toBeCloseTo(inline, 1);
  });

  it('draws only the texts it is given', async () => {
    const progress = await mount({ value: 50, label: 'File upload' });
    expect(part(progress, '.value-text')).toBeNull();
    expect(part(progress, '.help')).toBeNull();
    expect(part(progress, '.status-icon')).toBeNull();
    const bare = await mount({ value: 50 }, { 'aria-label': 'Upload' });
    expect(part(bare, '.header')).toBeNull();
  });

  it('text with only spaces counts as no text', async () => {
    const progress = await mount({ value: 50, label: '   ', valueText: ' ', help: '  ' }, { 'aria-label': 'Upload' });
    expect(part(progress, '.header')).toBeNull();
    expect(part(progress, '.help')).toBeNull();
  });

  it('success draws circle-check, solid, at icon/size-sm, in the success color', async () => {
    const progress = await mount({ status: 'success', value: 100, label: 'Upload', valueText: 'Done' });
    const icon = part(progress, 'nph-icon')!;
    expect(icon.getAttribute('name')).toBe('circle-check');
    expect(icon.getAttribute('variant')).toBe('solid');
    expect(icon.getAttribute('size')).toBe('sm');
    expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-progress-icon-success'));
    expect(icon.getBoundingClientRect().width).toBe(parseFloat(resolved('width', '--nph-progress-icon-size')));
  });

  it('error draws circle-xmark in the error color and the help text in the error color', async () => {
    const progress = await mount({ status: 'error', value: 100, label: 'Upload', valueText: 'Error', help: 'The file is too large.' });
    const icon = part(progress, 'nph-icon')!;
    expect(icon.getAttribute('name')).toBe('circle-xmark');
    expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-progress-icon-error'));
    expect(getComputedStyle(part(progress, '.help')!).color).toBe(resolved('color', '--nph-progress-help-foreground-error'));
  });

  it('the status icon is decorative: it has no name and nothing in the accessibility tree', async () => {
    const progress = await mount({ status: 'success', value: 100, label: 'Upload' });
    const icon = part(progress, 'nph-icon')!;
    expect(icon.hasAttribute('label')).toBe(false);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('active draws no status icon', async () => {
    const progress = await mount({ value: 50, label: 'Upload' });
    expect(part(progress, 'nph-icon')).toBeNull();
  });
});

describe('indeterminate', () => {
  it('draws one segment, one third of the track, and no indicator, stop or value', async () => {
    const progress = await mount({ type: 'indeterminate', label: 'Preparing' });
    const segment = part(progress, '.segment-loop')!;
    expect(segment.getBoundingClientRect().width).toBeCloseTo(280 / 3, 1);
    expect(part(progress, '.indicator')).toBeNull();
    expect(part(progress, '.stop')).toBeNull();
  });

  it('loops once in progress/loop-duration (1400 ms), linear, forever', async () => {
    const progress = await mount({ type: 'indeterminate', label: 'Preparing' });
    const style = getComputedStyle(part(progress, '.segment-loop')!);
    expect(style.animationName).toBe('nph-progress-loop');
    expect(style.animationIterationCount).toBe('infinite');
    expect(style.animationDuration).toBe('1.4s');
    /* `core/easing/linear` is the cubic Bezier (0, 0, 1, 1), which the browser reads back as it is. */
    expect(['linear', 'cubic-bezier(0, 0, 1, 1)']).toContain(style.animationTimingFunction);
    expect(style.animationDuration).toBe(resolved('animation-duration', '--nph-progress-loop-duration'));
    expect(style.animationTimingFunction).toBe(resolved('animation-timing-function', '--nph-progress-loop-easing'));
  });

  it('never rests stopped in the middle: it starts outside the left edge and ends outside the right edge', async () => {
    const progress = await mount({ type: 'indeterminate', label: 'Preparing' });
    const animation = part(progress, '.segment-loop')!.getAnimations()[0] as Animation;
    const frames = (animation.effect as KeyframeEffect).getKeyframes();
    expect(frames.map((frame) => frame.transform)).toEqual(['translateX(-100%)', 'translateX(300%)']);
    const bar = track(progress).getBoundingClientRect();
    const segment = part(progress, '.segment-loop')!;
    animation.pause();
    animation.currentTime = 0;
    expect(segment.getBoundingClientRect().right).toBeCloseTo(bar.left, 1);
    animation.currentTime = 1399;
    expect(segment.getBoundingClientRect().left).toBeGreaterThan(bar.right - 1);
  });

  it('in a right-to-left container the loop still runs left to right, starting outside the left edge', async () => {
    const progress = await mount({ type: 'indeterminate', label: 'Preparing' });
    (progress.parentElement as HTMLElement).dir = 'rtl';
    await progress.updateComplete;
    const bar = track(progress).getBoundingClientRect();
    const segment = part(progress, '.segment-loop')!;
    const animation = segment.getAnimations()[0] as Animation;
    animation.pause();
    animation.currentTime = 0;
    expect(segment.getBoundingClientRect().right).toBeCloseTo(bar.left, 1);
    animation.currentTime = 700;
    const middle = segment.getBoundingClientRect();
    expect(middle.left).toBeGreaterThan(bar.left);
    expect(middle.left).toBeLessThan(bar.right);
    animation.currentTime = 1399;
    expect(segment.getBoundingClientRect().left).toBeGreaterThan(bar.right - 1);
  });

  it('with reduced motion the loop stops and the segment rests at the start of the track', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const progress = await mount({ type: 'indeterminate', label: 'Preparing' });
      const segment = part(progress, '.segment-loop')!;
      expect(getComputedStyle(segment).animationName).toBe('none');
      const bar = track(progress).getBoundingClientRect();
      expect(segment.getBoundingClientRect().left).toBeCloseTo(bar.left, 1);
      expect(segment.getBoundingClientRect().width).toBeGreaterThan(0);
    } finally {
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
      });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });

  it('the loop exists only while there is no value: switching to determinate removes it', async () => {
    const progress = await mount({ type: 'indeterminate', label: 'Upload' });
    expect(part(progress, '.segment-loop')).not.toBeNull();
    progress.type = 'determinate';
    progress.value = 10;
    await progress.updateComplete;
    expect(part(progress, '.segment-loop')).toBeNull();
    expect(track(progress).getAnimations({ subtree: true })).toHaveLength(0);
    expect(part(progress, '.indicator')).not.toBeNull();
  });

  it('determinate has no animation at all', async () => {
    const progress = await mount({ value: 40, label: 'Upload' });
    expect(progress.shadowRoot?.getAnimations?.() ?? []).toHaveLength(0);
  });
});

describe('steps', () => {
  const states = (progress: NphProgress) => [...(progress.shadowRoot?.querySelectorAll('.segment') ?? [])].map((s) => s.getAttribute('data-state'));

  it('draws one equal segment per step, apart by the segment gap, each as tall as the bar', async () => {
    for (const steps of [3, 4, 5]) {
      const progress = await mount({ type: 'steps', steps, label: 'Sign-up' });
      const segments = [...(progress.shadowRoot?.querySelectorAll('.segment') ?? [])] as HTMLElement[];
      expect(segments).toHaveLength(steps);
      const gap = parseFloat(resolved('width', '--nph-progress-segment-gap'));
      const widths = segments.map((segment) => segment.getBoundingClientRect().width);
      for (const width of widths) expect(width).toBeCloseTo((280 - gap * (steps - 1)) / steps, 1);
      expect(segments[1]!.getBoundingClientRect().left - segments[0]!.getBoundingClientRect().right).toBeCloseTo(gap, 1);
      expect(segments[0]!.getBoundingClientRect().height).toBe(8);
      progress.remove();
    }
  });

  it('sm segments are 4 px', async () => {
    const progress = await mount({ type: 'steps', steps: 3, size: 'sm', label: 'Sign-up' });
    expect(part(progress, '.segment')!.getBoundingClientRect().height).toBe(4);
  });

  it('active: the steps up to the current one are done, the rest pending', async () => {
    expect(states(await mount({ type: 'steps', steps: 4, step: 1, label: 'Sign-up' }))).toEqual(['done', 'pending', 'pending', 'pending']);
    expect(states(await mount({ type: 'steps', steps: 4, step: 3, label: 'Sign-up' }))).toEqual(['done', 'done', 'done', 'pending']);
  });

  it('success: all segments in success', async () => {
    const progress = await mount({ type: 'steps', steps: 3, step: 3, status: 'success', label: 'Sign-up' });
    expect(states(progress)).toEqual(['success', 'success', 'success']);
  });

  it('error: the done ones, the step with the error, the rest pending', async () => {
    const progress = await mount({ type: 'steps', steps: 5, step: 3, status: 'error', label: 'Sign-up', help: 'Check your data.' });
    expect(states(progress)).toEqual(['done', 'done', 'error', 'pending', 'pending']);
  });

  it('the segment colors come from the segment tokens', async () => {
    const progress = await mount({ type: 'steps', steps: 5, step: 3, status: 'error', label: 'Sign-up', help: 'Check your data.' });
    const color = (state: string) => getComputedStyle(part(progress, `.segment[data-state="${state}"]`)!).backgroundColor;
    expect(color('done')).toBe(resolved('background-color', '--nph-progress-segment-background'));
    expect(color('pending')).toBe(resolved('background-color', '--nph-progress-segment-background-pending'));
    expect(color('error')).toBe(resolved('background-color', '--nph-progress-segment-background-error'));
    const ok = await mount({ type: 'steps', steps: 3, status: 'success', label: 'Sign-up' });
    expect(getComputedStyle(part(ok, '.segment')!).backgroundColor).toBe(resolved('background-color', '--nph-progress-segment-background-success'));
  });

  it('has no end stop and no indicator', async () => {
    const progress = await mount({ type: 'steps', steps: 3, label: 'Sign-up' });
    expect(part(progress, '.stop')).toBeNull();
    expect(part(progress, '.indicator')).toBeNull();
  });
});

describe('semantics', () => {
  const bar = (progress: NphProgress) => track(progress);

  it('the track is a progress bar from 0 to 100, never the host', async () => {
    const progress = await mount({ value: 30, label: 'File upload' });
    expect(bar(progress).getAttribute('role')).toBe('progressbar');
    expect(bar(progress).getAttribute('aria-valuemin')).toBe('0');
    expect(bar(progress).getAttribute('aria-valuemax')).toBe('100');
    expect(progress.hasAttribute('role')).toBe(false);
  });

  it('determinate: aria-valuenow is the value', async () => {
    for (const value of [0, 25, 62.5, 100]) {
      const progress = await mount({ value, label: 'Upload', ...(value === 100 ? {} : {}) });
      expect(bar(progress).getAttribute('aria-valuenow'), String(value)).toBe(String(value));
      progress.remove();
    }
  });

  it('indeterminate: no aria-valuenow, no aria-valuetext without a value text', async () => {
    const progress = await mount({ type: 'indeterminate', label: 'Preparing' });
    expect(bar(progress).hasAttribute('aria-valuenow')).toBe(false);
    expect(bar(progress).hasAttribute('aria-valuetext')).toBe(false);
  });

  it('steps: aria-valuenow is the share of steps, counting the current one, and aria-valuetext is the "N of M"', async () => {
    const progress = await mount({ type: 'steps', steps: 4, step: 1, label: 'Sign-up', valueText: '1 of 4' });
    expect(bar(progress).getAttribute('aria-valuenow')).toBe('25');
    expect(bar(progress).getAttribute('aria-valuetext')).toBe('1 of 4');
    progress.step = 3;
    await progress.updateComplete;
    expect(bar(progress).getAttribute('aria-valuenow')).toBe('75');
    progress.status = 'success';
    await progress.updateComplete;
    expect(bar(progress).getAttribute('aria-valuenow')).toBe('100');
  });

  it('the value text is the aria-valuetext', async () => {
    const progress = await mount({ value: 50, label: 'Upload', valueText: '50%' });
    expect(bar(progress).getAttribute('aria-valuetext')).toBe('50%');
  });

  it('the label names the bar, by reference to the visible text', async () => {
    const progress = await mount({ value: 50, label: 'File upload' });
    expect(bar(progress).getAttribute('aria-labelledby')).toBe('label');
    expect(part(progress, '#label')?.textContent).toBe('File upload');
    expect(bar(progress).hasAttribute('aria-label')).toBe(false);
  });

  it('without a label, the host aria-label names the bar', async () => {
    const progress = await mount({ value: 50 }, { 'aria-label': 'Upload of the photo' });
    expect(bar(progress).getAttribute('aria-label')).toBe('Upload of the photo');
    expect(bar(progress).hasAttribute('aria-labelledby')).toBe(false);
    progress.setAttribute('aria-label', 'Upload of the report');
    await progress.updateComplete;
    expect(bar(progress).getAttribute('aria-label')).toBe('Upload of the report');
  });

  it('with both, the label wins', async () => {
    const progress = await mount({ value: 50, label: 'File upload' }, { 'aria-label': 'Other' });
    expect(bar(progress).getAttribute('aria-labelledby')).toBe('label');
    expect(bar(progress).hasAttribute('aria-label')).toBe(false);
  });

  it('the help text describes the bar', async () => {
    const progress = await mount({ value: 50, label: 'Upload', help: 'Do not close this window.' });
    expect(bar(progress).getAttribute('aria-describedby')).toBe('help');
    expect(part(progress, '#help')?.textContent).toBe('Do not close this window.');
    progress.help = null;
    await progress.updateComplete;
    expect(bar(progress).hasAttribute('aria-describedby')).toBe(false);
  });

  it('the name resolves in the browser accessibility tree: label, value and description', async () => {
    const progress = await mount({ value: 50, label: 'File upload', valueText: '50%', help: 'Do not close this window.' });
    const session = cdp();
    await session.send('Accessibility.enable');
    /* The test runs in an iframe of the Vitest page: ask for the tree of that frame. */
    const { frameTree } = (await session.send('Page.getFrameTree')) as {
      frameTree: { frame: { id: string }; childFrames?: Array<{ frame: { id: string; url: string } }> };
    };
    const mine = frameTree.childFrames?.find((child) => child.frame.url.includes(location.pathname.split('/').slice(0, 2).join('/')));
    const { nodes } = (await session.send('Accessibility.getFullAXTree', { frameId: (mine ?? frameTree).frame.id })) as {
      nodes: Array<{ role?: { value: string }; name?: { value: string }; description?: { value: string }; properties?: Array<{ name: string; value: { value: unknown } }> }>;
    };
    const found = nodes.find((node) => node.role?.value === 'progressbar' && node.name?.value === 'File upload');
    expect(found, 'progressbar named by the label').toBeDefined();
    expect(found?.description?.value).toBe('Do not close this window.');
    expect(progress.isConnected).toBe(true);
  });

  it('is not interactive: no focus, no tab stop, no focusable element', async () => {
    const progress = await mount({ value: 50, label: 'Upload' });
    const before = document.activeElement;
    progress.focus();
    expect(document.activeElement).toBe(before);
    expect(progress.hasAttribute('tabindex')).toBe(false);
    expect(progress.shadowRoot?.querySelectorAll('a, button, input, [tabindex]').length).toBe(0);
  });

  it('has no hover state: the colors do not change under the pointer', async () => {
    const progress = await mount({ value: 50, label: 'Upload' });
    const before = getComputedStyle(part(progress, '.indicator')!).backgroundColor;
    expect(componentCss).not.toMatch(/:hover|:active|:focus/);
    expect(getComputedStyle(part(progress, '.indicator')!).backgroundColor).toBe(before);
  });
});

describe('invalid input', () => {
  /** Each case: the properties and a piece of the one console.error that names the cause. */
  const INVALID: Array<[string, Props, string]> = [
    ['type outside the list', { type: 'circular' }, 'type "circular"'],
    ['size outside the list', { size: 'lg', value: 10 }, 'size "lg"'],
    ['status outside the list', { status: 'warning', value: 100 }, 'status "warning"'],
    ['value below 0', { value: -1 }, 'value -1'],
    ['value above 100', { value: 101 }, 'value 101'],
    ['value not a number', { value: Number.NaN }, 'value NaN'],
    ['success below 100 (including the default 0)', { status: 'success' }, 'only at value 100'],
    ['error below 100', { status: 'error', value: 40, help: 'Failed.' }, 'only at value 100'],
    ['success on indeterminate', { type: 'indeterminate', status: 'success' }, 'only "active"'],
    ['error on indeterminate', { type: 'indeterminate', status: 'error' }, 'only "active"'],
    ['steps without a count', { type: 'steps' }, 'steps null'],
    ['steps with a count outside 3 to 5', { type: 'steps', steps: 6 }, 'steps 6'],
    ['steps with 2', { type: 'steps', steps: 2 }, 'steps 2'],
    ['step 0', { type: 'steps', steps: 4, step: 0 }, 'step 0'],
    ['step beyond the count', { type: 'steps', steps: 4, step: 5 }, 'step 5'],
    ['step not an integer', { type: 'steps', steps: 4, step: 1.5 }, 'step 1.5'],
  ];

  for (const [name, properties, message] of INVALID) {
    it(`${name}: nothing drawn, 0 x 0, one console.error`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const progress = await mount({ label: 'Upload', ...properties });
      expect(progress.shadowRoot?.querySelector('.root')).toBeNull();
      expect(progress.hasAttribute('data-nph-rendered')).toBe(false);
      const box = progress.getBoundingClientRect();
      expect(box.width).toBe(0);
      expect(box.height).toBe(0);
      expect(error).toHaveBeenCalledTimes(1);
      expect(String(error.mock.calls[0]?.[0])).toContain('[nph-progress]');
      expect(String(error.mock.calls[0]?.[0])).toContain(message);
    });
  }

  it('a new render with the same invalid input does not repeat the error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const progress = await mount({ value: 120, label: 'Upload' });
    progress.label = 'Other';
    await progress.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a bar that becomes valid draws again', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const progress = await mount({ value: 120, label: 'Upload' });
    progress.value = 50;
    await progress.updateComplete;
    expect(progress.hasAttribute('data-nph-rendered')).toBe(true);
    expect(track(progress)).not.toBeNull();
  });

  it('error without help draws, and warns once, in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const progress = await mount({ status: 'error', value: 100, label: 'Upload' });
    expect(track(progress)).not.toBeNull();
    expect(warn.mock.calls.some((call) => String(call[0]).includes('`help`'))).toBe(true);
  });

  it('a bar with no accessible name draws, and warns once, in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const progress = await mount({ value: 50 });
    expect(track(progress)).not.toBeNull();
    progress.value = 60;
    await progress.updateComplete;
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('accessible name'))).toHaveLength(1);
  });

  it('a name that arrives after the first render clears the warning state', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const progress = await mount({ value: 50 });
    progress.label = 'Upload';
    await progress.updateComplete;
    progress.label = null;
    await progress.updateComplete;
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('accessible name'))).toHaveLength(2);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] as string);
    expect(used).toEqual(
      expect.arrayContaining(['--nph-progress-track-background', '--nph-progress-indicator-background', '--nph-progress-loop-duration']),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the CSS consumes every progress token of the contract', () => {
    const declared = [...tokensCss.matchAll(/(--nph-progress-[a-z-]+):/g)].map((match) => match[1] as string);
    expect(declared).toHaveLength(27);
    for (const name of declared) {
      expect(cssWithoutComments, name).toContain(`var(${name})`);
    }
  });

  it('the CSS has no literal design value beyond the 3rem minimum width', () => {
    const withoutAllowed = cssWithoutComments.replace(/min-inline-size:\s*3rem;/, '');
    expect(withoutAllowed).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutAllowed).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutAllowed).not.toMatch(/\d(px|rem|em|ms|s|deg|turn)\b/);
    expect(cssWithoutComments.match(/min-inline-size:\s*3rem;/g)).toHaveLength(1);
  });
});
