/**
 * Tests of `nph-stepper` (P117), in a real browser (P21, item 5): hover, keyboard focus, the cut
 * label and the width below which the stepper becomes `nph-progress` only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `5569:6530`, sets `5541:1622` and
 * `5540:581`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-73: the API, the
 * invalid input, the roles and names the browser computes, the Tab order, the linear and the
 * non-linear stepper, the event of a button step, the cut label and its balloon, the narrow width, the
 * colors and the measures of each status, the focus, the combined states, the motion and the token
 * contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-stepper.css?raw';
import {
  NPH_STEPPER_LINK_PROTOCOLS,
  NPH_STEPPER_MAX_STEPS,
  NPH_STEPPER_MIN_STEPS,
  NPH_STEPPER_STATUSES,
  NphStepper,
  isSafeHref,
} from './nph-stepper';
import type { NphStep, NphStepSelectDetail } from './nph-stepper';
import type { NphProgress } from '../nph-progress/nph-progress';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
  await document.fonts.ready;
});

/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  listeners.abort();
  listeners = new AbortController();
  document.body.replaceChildren();
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

const STEPS: NphStep[] = [{ label: 'Account' }, { label: 'Address' }, { label: 'Payment' }, { label: 'Review' }];

const TEXTS = {
  label: 'Sign-up steps',
  completedLabel: 'Completed',
  pendingLabel: 'Pending',
  errorLabel: 'With error',
  optionalLabel: 'Optional',
  stepText: 'Step {current} of {count}',
};

/** A stepper in a block of its own width, so the container query has a width to read. */
async function mount(props: Partial<NphStepper> = {}, width = '60rem'): Promise<NphStepper> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const stepper = document.createElement('nph-stepper');
  Object.assign(stepper, { steps: STEPS, current: 2, ...TEXTS, ...props });
  holder.append(stepper);
  document.body.append(holder);
  await settle(stepper);
  return stepper;
}

async function settle(stepper: NphStepper): Promise<void> {
  await stepper.updateComplete;
  await frame();
  for (const inner of stepper.shadowRoot?.querySelectorAll('nph-icon, nph-progress, nph-tooltip') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await stepper.updateComplete;
}

const root = (stepper: NphStepper): ShadowRoot => stepper.shadowRoot as ShadowRoot;
const items = (stepper: NphStepper): HTMLElement[] => [...root(stepper).querySelectorAll<HTMLElement>('li.item')];
const step = (stepper: NphStepper, index: number): HTMLElement => root(stepper).querySelector(`#step-${String(index)}`) as HTMLElement;
const label = (stepper: NphStepper, index: number): HTMLElement =>
  root(stepper).querySelector(`.label[data-index="${String(index)}"]`) as HTMLElement;
const marker = (stepper: NphStepper, index: number): HTMLElement => step(stepper, index).querySelector('.marker') as HTMLElement;
const connectors = (stepper: NphStepper): HTMLElement[] => [...root(stepper).querySelectorAll<HTMLElement>('.connector')];
const tooltips = (stepper: NphStepper): NphTooltip[] => [...root(stepper).querySelectorAll<NphTooltip>('nph-tooltip')];
const narrow = (stepper: NphStepper): NphProgress => root(stepper).querySelector('nph-progress') as NphProgress;
const nav = (stepper: NphStepper): HTMLElement => root(stepper).querySelector('nav') as HTMLElement;

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));
const color = (token: string): string => resolved('color', token);
const background = (token: string): string => resolved('background-color', token);

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** The events the stepper fires, collected until the end of the test. */
function collect(stepper: NphStepper): NphStepSelectDetail[] {
  const seen: NphStepSelectDetail[] = [];
  stepper.addEventListener('nph-step-select', (event) => seen.push(event.detail), { signal: listeners.signal });
  return seen;
}

/** The node the browser itself builds for an element in its accessibility tree (as in `nph-breadcrumb`). */
async function axNode(element: Element): Promise<{ role: string; name: string }> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const node = nodes[0];
    return { role: String(node?.role?.value ?? ''), name: String(node?.name?.value ?? '') };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-stepper')).toBe(NphStepper);
    expect(document.createElement('nph-stepper')).toBeInstanceOf(NphStepper);
  });

  it('the public API is exactly P117', () => {
    const declared = [...(NphStepper as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()].filter(
      (name) => name !== 'cutSteps',
    );
    expect(declared.sort()).toEqual(
      [
        'completedLabel',
        'current',
        'errorLabel',
        'hostName',
        'label',
        'nonLinear',
        'optionalLabel',
        'pendingLabel',
        'stepText',
        'steps',
      ].sort(),
    );
    expect([...NPH_STEPPER_STATUSES]).toEqual(['pending', 'completed', 'error']);
    expect(NPH_STEPPER_MIN_STEPS).toBe(2);
    expect(NPH_STEPPER_MAX_STEPS).toBe(7);
  });

  it('has the defaults: no steps, the first one current, linear', () => {
    const stepper = document.createElement('nph-stepper');
    expect(stepper.steps).toEqual([]);
    expect(stepper.current).toBe(1);
    expect(stepper.nonLinear).toBe(false);
    expect(stepper.label).toBeNull();
  });

  it('`steps` is a property only; the rest comes from attributes', () => {
    const stepper = document.createElement('nph-stepper');
    stepper.setAttribute('steps', '[{"label":"A"}]');
    stepper.setAttribute('current', '3');
    stepper.setAttribute('non-linear', '');
    stepper.setAttribute('label', 'Name');
    stepper.setAttribute('completed-label', 'Done');
    stepper.setAttribute('pending-label', 'To do');
    stepper.setAttribute('error-label', 'Failed');
    stepper.setAttribute('optional-label', 'Optional');
    stepper.setAttribute('step-text', 'Step {current} of {count}');
    expect(stepper.steps).toEqual([]);
    expect(stepper.current).toBe(3);
    expect(stepper.nonLinear).toBe(true);
    expect(stepper.label).toBe('Name');
    expect(stepper.completedLabel).toBe('Done');
    expect(stepper.pendingLabel).toBe('To do');
    expect(stepper.errorLabel).toBe('Failed');
    expect(stepper.optionalLabel).toBe('Optional');
    expect(stepper.stepText).toBe('Step {current} of {count}');
  });

  it('`non-linear` reflects, so the consumer can style and check it', async () => {
    const stepper = await mount({ nonLinear: true });
    expect(stepper.hasAttribute('non-linear')).toBe(true);
    stepper.nonLinear = false;
    await stepper.updateComplete;
    expect(stepper.hasAttribute('non-linear')).toBe(false);
  });

  it('declares no slot, no part and no color property', () => {
    expect(componentCss).not.toMatch(/::part/);
    expect(Object.keys(NphStepper).includes('parts')).toBe(false);
  });

  it('links take http, https, mailto, tel and relative addresses, and nothing else', () => {
    expect([...NPH_STEPPER_LINK_PROTOCOLS]).toEqual(['http:', 'https:', 'mailto:', 'tel:']);
    for (const href of ['/step/2', '#step-2', 'https://example.com/a', 'mailto:a@b.co', 'tel:+5511']) {
      expect(isSafeHref(href), href).toBe(true);
    }
    for (const href of ['javascript:alert(1)', 'java\nscript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,x', 'vbscript:x']) {
      expect(isSafeHref(href), href).toBe(false);
    }
  });
});

describe('invalid input', () => {
  /** The `console.error` calls of the stepper, with the message. */
  async function problems(props: Partial<NphStepper>): Promise<{ stepper: NphStepper; errors: string[] }> {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const stepper = await mount(props);
    const errors = spy.mock.calls.map((call) => String(call[0]));
    return { stepper, errors };
  }

  const cases: Array<[string, Partial<NphStepper>, RegExp]> = [
    ['steps that is not a list', { steps: 'a,b' as unknown as NphStep[] }, /`steps` is not a list/],
    ['a single step', { steps: [{ label: 'A' }], current: 1 }, /1 step\(s\)/],
    [
      'eight steps',
      { steps: Array.from({ length: 8 }, (_, index) => ({ label: `S${String(index)}` })), current: 1 },
      /8 step\(s\)/,
    ],
    ['a current below 1', { current: 0 }, /current 0 is outside 1 to 4/],
    ['a current above the count', { current: 5 }, /current 5 is outside 1 to 4/],
    ['a current that is not an integer', { current: 1.5 }, /current 1.5 is outside/],
    ['a step without a label', { steps: [{ label: 'A' }, { label: '  ' }, { label: 'C' }], current: 1 }, /step 2 has no `label`/],
    ['a step that is not an object', { steps: [{ label: 'A' }, null as unknown as NphStep], current: 1 }, /step 2 has no `label`/],
    [
      'a status outside the list',
      { steps: [{ label: 'A' }, { label: 'B', status: 'current' as unknown as 'error' }, { label: 'C' }], current: 1 },
      /status "current" of step 2 does not exist/,
    ],
    [
      'a status on the current step',
      { steps: [{ label: 'A' }, { label: 'B', status: 'error' }, { label: 'C' }], current: 2 },
      /step 2 is the current step and takes no `status`/,
    ],
    [
      'a disabled current step',
      { steps: [{ label: 'A' }, { label: 'B', disabled: true }, { label: 'C' }], current: 2 },
      /step 2 is the current step and cannot be disabled/,
    ],
    [
      'an unsafe href',
      { steps: [{ label: 'A', href: 'javascript:alert(1)' }, { label: 'B' }], current: 2 },
      /step 1 has an unsafe `href`/,
    ],
  ];

  for (const [name, props, message] of cases) {
    it(`${name}: draws nothing and says why, once`, async () => {
      const { stepper, errors } = await problems(props);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch(message);
      expect(errors[0]).toContain('[nph-stepper]');
      expect(stepper.hasAttribute('data-nph-rendered')).toBe(false);
      expect(root(stepper).querySelector('nav')).toBeNull();
      expect(root(stepper).querySelector('nph-progress')).toBeNull();
      expect(stepper.getBoundingClientRect().height).toBe(0);
    });
  }

  it('says it once per cause: a new render with the same input is silent', async () => {
    const { stepper } = await problems({ current: 9 });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    spy.mockClear();
    stepper.label = 'Another name';
    await stepper.updateComplete;
    expect(spy).not.toHaveBeenCalled();
    stepper.current = 8;
    await stepper.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('draws again when the input is fixed', async () => {
    const { stepper } = await problems({ current: 9 });
    stepper.current = 2;
    await settle(stepper);
    expect(stepper.hasAttribute('data-nph-rendered')).toBe(true);
    expect(items(stepper)).toHaveLength(4);
  });

  it('an empty list is a mount: it draws nothing and says nothing', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warns = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const stepper = await mount({ steps: [] });
    expect(errors).not.toHaveBeenCalled();
    expect(warns).not.toHaveBeenCalled();
    expect(stepper.hasAttribute('data-nph-rendered')).toBe(false);
    expect(root(stepper).querySelector('nav')).toBeNull();
  });

  it('two steps and seven steps are valid', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const two = await mount({ steps: [{ label: 'A' }, { label: 'B' }], current: 1 });
    const seven = await mount({ steps: Array.from({ length: 7 }, (_, index) => ({ label: `S${String(index)}` })), current: 4 });
    expect(errors).not.toHaveBeenCalled();
    expect(items(two)).toHaveLength(2);
    expect(items(seven)).toHaveLength(7);
  });

  it('the `hidden` attribute of the consumer still hides a valid stepper', async () => {
    const stepper = await mount();
    stepper.hidden = true;
    await stepper.updateComplete;
    expect(getComputedStyle(stepper).display).toBe('none');
  });
});

describe('warnings: drawn, and said once', () => {
  async function warnings(props: Partial<NphStepper>): Promise<string[]> {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const stepper = await mount(props);
    stepper.requestUpdate();
    await stepper.updateComplete;
    return spy.mock.calls.map((call) => String(call[0]));
  }

  it('no accessible name', async () => {
    const messages = await warnings({ label: null });
    expect(messages.filter((message) => message.includes('no accessible name'))).toHaveLength(1);
  });

  it('a status with no hidden text', async () => {
    const messages = await warnings({ completedLabel: null, errorLabel: null, pendingLabel: 'Pending', current: 3, steps: [...STEPS.slice(0, 3), { label: 'E', status: 'error' }] });
    expect(messages.some((message) => message.includes('`completed-label`'))).toBe(true);
    expect(messages.some((message) => message.includes('`error-label`'))).toBe(true);
    expect(messages.filter((message) => message.includes('`pending-label`'))).toHaveLength(0);
  });

  it('an optional step with no "Optional" word', async () => {
    const messages = await warnings({ optionalLabel: null, steps: [STEPS[0] as NphStep, { label: 'B', optional: true }, ...STEPS.slice(2)] });
    expect(messages.some((message) => message.includes('`optional-label`'))).toBe(true);
  });

  it('no "Step N of M" text for the narrow width', async () => {
    const messages = await warnings({ stepText: null });
    expect(messages.some((message) => message.includes('`step-text`'))).toBe(true);
  });

  it('a stepper with everything is silent', async () => {
    expect(await warnings({})).toEqual([]);
  });

  it('the host aria-label is the name when there is no label', async () => {
    const messages = await warnings({ label: null, hostName: 'Hiring steps' });
    expect(messages.filter((message) => message.includes('no accessible name'))).toHaveLength(0);
  });
});

describe('semantics', () => {
  it('is a navigation landmark with a name, holding an ordered list with one item per step', async () => {
    const stepper = await mount();
    const landmark = nav(stepper);
    expect(landmark.getAttribute('aria-label')).toBe('Sign-up steps');
    expect(await axNode(landmark)).toEqual({ role: 'navigation', name: 'Sign-up steps' });
    const list = landmark.querySelector('ol') as HTMLElement;
    expect(list).not.toBeNull();
    expect([...list.children].map((child) => child.tagName)).toEqual(['LI', 'LI', 'LI', 'LI']);
  });

  it('the label wins over the host aria-label', async () => {
    const stepper = await mount({ label: 'Named', hostName: 'Ignored' });
    expect(nav(stepper).getAttribute('aria-label')).toBe('Named');
    const other = await mount({ label: null, hostName: 'From the host' });
    expect(nav(other).getAttribute('aria-label')).toBe('From the host');
  });

  it('only the current step carries aria-current="step"', async () => {
    const stepper = await mount({ current: 3 });
    const current = [...root(stepper).querySelectorAll('[aria-current]')];
    expect(current).toHaveLength(1);
    expect(current[0]).toBe(step(stepper, 2));
    expect(current[0]?.getAttribute('aria-current')).toBe('step');
  });

  it('the current step is text, not a link or a button', async () => {
    const stepper = await mount({ steps: STEPS.map((item) => ({ ...item, href: '#x' })), current: 2 });
    expect(step(stepper, 1).tagName).toBe('SPAN');
    expect(step(stepper, 1).hasAttribute('href')).toBe(false);
  });

  it('the status is hidden text at the start of the step and the current step has none', async () => {
    const stepper = await mount({ current: 2, steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: 'C', status: 'error' }, STEPS[3] as NphStep] });
    expect(step(stepper, 0).querySelector('.hidden')?.textContent).toBe('Completed, ');
    expect(step(stepper, 1).querySelector('.hidden')).toBeNull();
    expect(step(stepper, 2).querySelector('.hidden')?.textContent).toBe('With error, ');
    expect(step(stepper, 3).querySelector('.hidden')?.textContent).toBe('Pending, ');
    const first = step(stepper, 0).querySelector('.hidden') as HTMLElement;
    expect(first.nextElementSibling ?? first.parentElement?.querySelector('.label')).not.toBeNull();
  });

  it('the accessible name of a clickable step is the status and the label, and the reason is read', async () => {
    const stepper = await mount({
      current: 3,
      steps: [
        { label: 'Account' },
        { label: 'Address', status: 'error', description: 'Fix 2 fields', href: '#address' },
        { label: 'Payment' },
        { label: 'Review', optional: true },
      ],
    });
    const completed = await axNode(step(stepper, 0));
    expect(completed.role).toBe('button');
    expect(completed.name).toBe('Completed, Account');
    const error = await axNode(step(stepper, 1));
    expect(error.role).toBe('link');
    expect(error.name).toBe('With error, Address Fix 2 fields');
  });

  it('the marker, the number and the icons are hidden from assistive technology', async () => {
    const stepper = await mount();
    for (let index = 0; index < 4; index += 1) {
      expect(marker(stepper, index).getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('the connector is decorative: hidden, and with no list item of its own', async () => {
    const stepper = await mount();
    expect(connectors(stepper)).toHaveLength(3);
    for (const connector of connectors(stepper)) {
      expect(connector.getAttribute('aria-hidden')).toBe('true');
      expect(connector.closest('li')).not.toBeNull();
    }
    expect(items(stepper)).toHaveLength(4);
    expect(items(stepper)[3]?.querySelector('.connector')).toBeNull();
  });

  it('the number of the marker is the position, the icons are check and triangle-exclamation', async () => {
    const stepper = await mount({ current: 3, steps: [STEPS[0] as NphStep, { label: 'B', status: 'error' }, STEPS[2] as NphStep, STEPS[3] as NphStep] });
    const icon = (index: number) => marker(stepper, index).querySelector('nph-icon');
    expect(icon(0)?.getAttribute('name')).toBe('check');
    expect(icon(0)?.getAttribute('variant')).toBe('light');
    expect(icon(1)?.getAttribute('name')).toBe('triangle-exclamation');
    expect(icon(1)?.getAttribute('variant')).toBe('light');
    expect(marker(stepper, 2).textContent?.trim()).toBe('3');
    expect(marker(stepper, 3).textContent?.trim()).toBe('4');
    expect(icon(2)).toBeNull();
  });

  it('a disabled step carries aria-disabled and says what it shows', async () => {
    const stepper = await mount({
      current: 2,
      steps: [{ label: 'A', disabled: true }, { label: 'B' }, { label: 'C', disabled: true }, { label: 'D' }],
    });
    expect(step(stepper, 0).getAttribute('aria-disabled')).toBe('true');
    expect(step(stepper, 0).querySelector('.hidden')?.textContent).toBe('Completed, ');
    expect(step(stepper, 2).getAttribute('aria-disabled')).toBe('true');
    expect(step(stepper, 2).querySelector('.hidden')?.textContent).toBe('Pending, ');
    expect(step(stepper, 3).hasAttribute('aria-disabled')).toBe(false);
  });

  it('a disabled step with an error is pending to assistive technology, and the reason is its description', async () => {
    const stepper = await mount({
      current: 3,
      steps: [{ label: 'A' }, { label: 'B', status: 'error', disabled: true, description: 'Fix 2 fields' }, { label: 'C' }, { label: 'D' }],
    });
    expect(step(stepper, 1).querySelector('.hidden')?.textContent).toBe('Pending, ');
    expect(step(stepper, 1).querySelector('.description')?.textContent).toBe('Fix 2 fields');
    expect(items(stepper)[1]?.getAttribute('data-status')).toBe('pending');
  });

  it('the description and "Optional" belong to the step', async () => {
    const stepper = await mount({
      steps: [{ label: 'A' }, { label: 'B', description: 'Pick one', optional: true }, STEPS[2] as NphStep, STEPS[3] as NphStep],
    });
    const inside = step(stepper, 1);
    expect(inside.querySelector('.description')?.textContent).toBe('Pick one');
    expect(inside.querySelector('.optional')?.textContent).toBe('Optional');
    expect(step(stepper, 0).querySelector('.description')).toBeNull();
    expect(step(stepper, 0).querySelector('.optional')).toBeNull();
  });
});

describe('what each step is, and the Tab order', () => {
  it('linear: the completed steps are buttons, the current and the pending ones are text', async () => {
    const stepper = await mount({ current: 3 });
    expect(step(stepper, 0).tagName).toBe('BUTTON');
    expect(step(stepper, 1).tagName).toBe('BUTTON');
    expect(step(stepper, 2).tagName).toBe('SPAN');
    expect(step(stepper, 3).tagName).toBe('SPAN');
    expect(step(stepper, 3).hasAttribute('tabindex')).toBe(false);
  });

  it('linear: the step with an error is clickable', async () => {
    const stepper = await mount({ current: 2, steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: 'C', status: 'error' }, STEPS[3] as NphStep] });
    expect(step(stepper, 2).tagName).toBe('BUTTON');
    expect(step(stepper, 3).tagName).toBe('SPAN');
  });

  it('non-linear: the pending steps are clickable too', async () => {
    const stepper = await mount({ current: 2, nonLinear: true });
    expect(step(stepper, 0).tagName).toBe('BUTTON');
    expect(step(stepper, 1).tagName).toBe('SPAN');
    expect(step(stepper, 2).tagName).toBe('BUTTON');
    expect(step(stepper, 3).tagName).toBe('BUTTON');
  });

  it('a step with href is a link; a step without it is a button', async () => {
    const stepper = await mount({
      current: 3,
      steps: [{ label: 'A', href: '/a' }, { label: 'B' }, STEPS[2] as NphStep, STEPS[3] as NphStep],
    });
    expect(step(stepper, 0).tagName).toBe('A');
    expect(step(stepper, 0).getAttribute('href')).toBe('/a');
    expect(step(stepper, 1).tagName).toBe('BUTTON');
    expect((step(stepper, 1) as HTMLButtonElement).type).toBe('button');
  });

  it('a disabled step is never clickable, in either mode', async () => {
    const steps = [{ label: 'A', disabled: true }, { label: 'B' }, { label: 'C', disabled: true }, { label: 'D' }];
    for (const nonLinear of [false, true]) {
      const stepper = await mount({ steps, current: 2, nonLinear });
      expect(step(stepper, 0).tagName).toBe('SPAN');
      expect(step(stepper, 2).tagName).toBe('SPAN');
      expect(step(stepper, 0).hasAttribute('tabindex')).toBe(false);
      expect(step(stepper, 2).hasAttribute('tabindex')).toBe(false);
    }
  });

  it('only the clickable steps enter Tab, in list order; the current and the disabled ones do not', async () => {
    const stepper = await mount({
      current: 3,
      nonLinear: true,
      steps: [{ label: 'A' }, { label: 'B', disabled: true }, { label: 'C' }, { label: 'D' }, { label: 'E', disabled: true }],
    });
    const before = document.createElement('button');
    before.textContent = 'before';
    document.body.prepend(before);
    before.focus();
    const reached: string[] = [];
    for (let press = 0; press < 3; press += 1) {
      await userEvent.tab();
      reached.push(stepper.shadowRoot?.activeElement?.id ?? '(none)');
    }
    expect(reached).toEqual(['step-0', 'step-3', '(none)']);
  });

  it('the arrow keys do nothing: each step is a Tab stop of its own', async () => {
    const stepper = await mount({ current: 4, steps: [...STEPS, { label: 'Done' }] });
    (step(stepper, 0) as HTMLElement).focus();
    for (const key of ['{ArrowRight}', '{ArrowDown}', '{ArrowLeft}', '{Home}', '{End}']) {
      await userEvent.keyboard(key);
      expect(root(stepper).activeElement).toBe(step(stepper, 0));
    }
  });
});

describe('the event of a button step', () => {
  it('fires `nph-step-select` with the 1-based position when the person clicks', async () => {
    const stepper = await mount({ current: 3 });
    const seen = collect(stepper);
    step(stepper, 0).click();
    step(stepper, 1).click();
    expect(seen).toEqual([{ step: 1 }, { step: 2 }]);
  });

  it('bubbles and crosses the shadow boundary', async () => {
    const stepper = await mount({ current: 3 });
    let event: CustomEvent<NphStepSelectDetail> | undefined;
    document.addEventListener('nph-step-select', (e) => (event = e as CustomEvent<NphStepSelectDetail>), { signal: listeners.signal });
    step(stepper, 0).click();
    expect(event?.bubbles).toBe(true);
    expect(event?.composed).toBe(true);
    expect(event?.detail).toEqual({ step: 1 });
  });

  it('Enter and Space activate a button step', async () => {
    const stepper = await mount({ current: 3 });
    const seen = collect(stepper);
    (step(stepper, 0) as HTMLElement).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(seen).toEqual([{ step: 1 }, { step: 1 }]);
  });

  it('a link fires only the native click, and no `nph-step-select`', async () => {
    const stepper = await mount({ current: 3, steps: STEPS.map((item) => ({ ...item, href: '#from-stepper' })) });
    const seen = collect(stepper);
    const clicks: Event[] = [];
    document.addEventListener('click', (event) => clicks.push(event), { signal: listeners.signal });
    step(stepper, 0).click();
    expect(seen).toEqual([]);
    expect(clicks).toHaveLength(1);
    expect(clicks[0]?.composed).toBe(true);
  });

  it('a `current` set by the page fires nothing', async () => {
    const stepper = await mount({ current: 2 });
    const seen = collect(stepper);
    stepper.current = 3;
    await settle(stepper);
    expect(seen).toEqual([]);
  });

  it('the stepper keeps no state: a click does not move `current`', async () => {
    const stepper = await mount({ current: 3 });
    step(stepper, 0).click();
    await settle(stepper);
    expect(stepper.current).toBe(3);
    expect(step(stepper, 2).getAttribute('aria-current')).toBe('step');
  });

  it('the current step, a pending one in the linear stepper and a disabled one fire nothing', async () => {
    const stepper = await mount({
      current: 2,
      steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, STEPS[2] as NphStep, { label: 'D', disabled: true }],
    });
    const seen = collect(stepper);
    for (const index of [1, 2, 3]) step(stepper, index).click();
    expect(seen).toEqual([]);
  });
});

describe('status, look and combined states', () => {
  it('each item says its status: current, completed, pending and error', async () => {
    const stepper = await mount({
      current: 2,
      steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: 'C', status: 'error' }, STEPS[3] as NphStep],
    });
    expect(items(stepper).map((item) => item.getAttribute('data-status'))).toEqual(['completed', 'current', 'error', 'pending']);
  });

  it('the status comes from the position, and a step can be given another', async () => {
    const stepper = await mount({
      current: 3,
      steps: [{ label: 'A', status: 'pending' }, { label: 'B', status: 'error' }, STEPS[2] as NphStep, { label: 'D', status: 'completed' }],
    });
    expect(items(stepper).map((item) => item.getAttribute('data-status'))).toEqual(['pending', 'error', 'current', 'completed']);
  });

  it('error + disabled: disabled wins and the step looks pending', async () => {
    const stepper = await mount({
      current: 3,
      steps: [{ label: 'A' }, { label: 'B', status: 'error', disabled: true }, STEPS[2] as NphStep, STEPS[3] as NphStep],
    });
    const item = items(stepper)[1] as HTMLElement;
    expect(item.getAttribute('data-status')).toBe('pending');
    expect(item.querySelector('nph-icon')).toBeNull();
    expect(getComputedStyle(marker(stepper, 1)).backgroundColor).toBe(background('--nph-stepper-marker-background'));
    expect(getComputedStyle(label(stepper, 1)).color).toBe(color('--nph-stepper-label-foreground'));
  });

  it('completed + disabled keeps the background and the check under the disabled opacity', async () => {
    const stepper = await mount({ current: 3, steps: [{ label: 'A', disabled: true }, STEPS[1] as NphStep, STEPS[2] as NphStep, STEPS[3] as NphStep] });
    expect(marker(stepper, 0).querySelector('nph-icon')?.getAttribute('name')).toBe('check');
    expect(getComputedStyle(marker(stepper, 0)).backgroundColor).toBe(background('--nph-stepper-marker-background-complete'));
    expect(getComputedStyle(step(stepper, 0)).opacity).toBe(resolved('opacity', '--nph-stepper-item-disabled-opacity'));
    expect(getComputedStyle(step(stepper, 1)).opacity).toBe('1');
  });

  it('the reason of a disabled step with an error is not drawn in the error color', async () => {
    const stepper = await mount({
      current: 3,
      steps: [{ label: 'A' }, { label: 'B', status: 'error', disabled: true, description: 'Fix 2 fields' }, STEPS[2] as NphStep, STEPS[3] as NphStep],
    });
    const description = step(stepper, 1).querySelector('.description') as HTMLElement;
    expect(getComputedStyle(description).color).toBe(color('--nph-stepper-description-foreground'));
  });

  it('the reason of an active error is drawn in the error color', async () => {
    const stepper = await mount({
      current: 3,
      steps: [{ label: 'A' }, { label: 'B', status: 'error', description: 'Fix 2 fields' }, STEPS[2] as NphStep, STEPS[3] as NphStep],
    });
    const description = step(stepper, 1).querySelector('.description') as HTMLElement;
    expect(getComputedStyle(description).color).toBe(color('--nph-stepper-description-foreground-error'));
  });
});

describe('the marker, the label and the connector', () => {
  it('the marker is a circle of stepper/marker-size', async () => {
    const stepper = await mount();
    for (let index = 0; index < 4; index += 1) {
      const box = marker(stepper, index).getBoundingClientRect();
      expect(box.width).toBeCloseTo(px('--nph-stepper-marker-size'), 1);
      expect(box.height).toBeCloseTo(px('--nph-stepper-marker-size'), 1);
    }
    expect(getComputedStyle(marker(stepper, 0)).borderRadius).toBe(resolved('border-radius', '--nph-stepper-marker-radius'));
  });

  it('pending: a muted background, a thin outline and the number', async () => {
    const stepper = await mount({ current: 1 });
    const style = getComputedStyle(marker(stepper, 1));
    expect(style.backgroundColor).toBe(background('--nph-stepper-marker-background'));
    expect(style.borderTopColor).toBe(color('--nph-stepper-marker-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-stepper-marker-border-width'), 1);
    expect(style.color).toBe(color('--nph-stepper-marker-foreground'));
  });

  it('current: no background, a ring of stepper/marker-border-width-current and the number in the brand text', async () => {
    const stepper = await mount({ current: 2 });
    const style = getComputedStyle(marker(stepper, 1));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopColor).toBe(color('--nph-stepper-marker-border-current'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-stepper-marker-border-width-current'), 1);
    expect(style.color).toBe(color('--nph-stepper-marker-foreground-current'));
    expect(marker(stepper, 1).getBoundingClientRect().width).toBeCloseTo(px('--nph-stepper-marker-size'), 1);
  });

  it('completed and error: the solid background and the icon in its own color', async () => {
    const stepper = await mount({
      current: 2,
      steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: 'C', status: 'error' }, STEPS[3] as NphStep],
    });
    const completed = getComputedStyle(marker(stepper, 0));
    expect(completed.backgroundColor).toBe(background('--nph-stepper-marker-background-complete'));
    expect(completed.color).toBe(color('--nph-stepper-marker-foreground-complete'));
    const error = getComputedStyle(marker(stepper, 2));
    expect(error.backgroundColor).toBe(background('--nph-stepper-marker-background-error'));
    expect(error.color).toBe(color('--nph-stepper-marker-foreground-error'));
    const icon = marker(stepper, 0).querySelector('nph-icon') as HTMLElement;
    expect(icon.getBoundingClientRect().width).toBeCloseTo(px('--nph-stepper-marker-icon-size'), 1);
  });

  it('the label has the color of its status, and the current one is stronger', async () => {
    const stepper = await mount({
      current: 2,
      steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: 'C', status: 'error' }, STEPS[3] as NphStep],
    });
    expect(getComputedStyle(label(stepper, 0)).color).toBe(color('--nph-stepper-label-foreground-complete'));
    expect(getComputedStyle(label(stepper, 1)).color).toBe(color('--nph-stepper-label-foreground-current'));
    expect(getComputedStyle(label(stepper, 2)).color).toBe(color('--nph-stepper-label-foreground-error'));
    expect(getComputedStyle(label(stepper, 3)).color).toBe(color('--nph-stepper-label-foreground'));
    const weight = (token: string) => resolved('font-weight', token);
    const heading = (index: number) => getComputedStyle(label(stepper, index).closest('.heading') as HTMLElement);
    expect(heading(1).fontWeight).toBe(weight('--nph-text-label-md-strong-font-weight'));
    expect(heading(0).fontWeight).toBe(weight('--nph-text-label-md-font-weight'));
  });

  it('the description and "Optional" are body-sm in the description color', async () => {
    const stepper = await mount({
      current: 1,
      steps: [{ label: 'A', description: 'Support line', optional: true }, STEPS[1] as NphStep],
    });
    for (const element of [step(stepper, 0).querySelector('.description'), step(stepper, 0).querySelector('.optional')] as HTMLElement[]) {
      const style = getComputedStyle(element);
      expect(style.color).toBe(color('--nph-stepper-description-foreground'));
      expect(style.fontSize).toBe(resolved('font-size', '--nph-text-body-sm-font-size'));
    }
  });

  it('the step area is at least 32 high and hugs the marker with its padding', async () => {
    const stepper = await mount({ current: 3 });
    const area = step(stepper, 0).getBoundingClientRect();
    const padding = getComputedStyle(step(stepper, 0));
    expect(area.height).toBeGreaterThanOrEqual(32);
    expect(Number.parseFloat(padding.paddingTop)).toBeCloseTo(px('--nph-stepper-item-padding-y'), 1);
    expect(Number.parseFloat(padding.paddingLeft)).toBeCloseTo(px('--nph-stepper-item-padding-x'), 1);
    expect(padding.gap).toBe(resolved('gap', '--nph-stepper-item-gap'));
    expect(getComputedStyle(step(stepper, 0)).borderRadius).toBe(resolved('border-radius', '--nph-stepper-item-radius'));
  });

  it('the marker and the label are centered on each other', async () => {
    const stepper = await mount({ current: 1 });
    const m = marker(stepper, 1).getBoundingClientRect();
    const l = label(stepper, 1).getBoundingClientRect();
    expect(l.top + l.height / 2).toBeCloseTo(m.top + m.height / 2, 0);
  });

  it('the connector passes through the center of the marker', async () => {
    const stepper = await mount({ current: 2 });
    const m = marker(stepper, 0).getBoundingClientRect();
    const c = (connectors(stepper)[0] as HTMLElement).getBoundingClientRect();
    expect(c.top + c.height / 2).toBeCloseTo(m.top + m.height / 2, 0);
  });

  it('the connector is a line of stepper/connector-thickness, stepper/connector-gap away from each step', async () => {
    const stepper = await mount({ current: 2 });
    const first = step(stepper, 0).getBoundingClientRect();
    const second = step(stepper, 1).getBoundingClientRect();
    const connector = connectors(stepper)[0] as HTMLElement;
    const box = connector.getBoundingClientRect();
    expect(box.left - first.right).toBeCloseTo(px('--nph-stepper-connector-gap'), 1);
    expect(second.left - box.right).toBeCloseTo(px('--nph-stepper-connector-gap'), 1);
    expect(Number.parseFloat(getComputedStyle(connector).borderTopWidth)).toBeCloseTo(px('--nph-stepper-connector-thickness'), 1);
  });

  it('the connector before the current step is the brand one, and after it the neutral one', async () => {
    const stepper = await mount({ current: 3 });
    const lines = connectors(stepper).map((connector) => getComputedStyle(connector).borderTopColor);
    expect(lines[0]).toBe(color('--nph-stepper-connector-background-complete'));
    expect(lines[1]).toBe(color('--nph-stepper-connector-background-complete'));
    expect(lines[2]).toBe(color('--nph-stepper-connector-background'));
  });

  it('the connector fills the space between the steps', async () => {
    const stepper = await mount({}, '60rem');
    const widths = connectors(stepper).map((connector) => connector.getBoundingClientRect().width);
    for (const width of widths) expect(width).toBeGreaterThan(px('--nph-stepper-connector-min-width'));
    const last = step(stepper, 3).getBoundingClientRect();
    expect(last.right).toBeCloseTo(stepper.getBoundingClientRect().right, 0);
  });

  it('the connector never gets narrower than stepper/connector-min-width', async () => {
    const steps = Array.from({ length: 7 }, (_, index) => ({ label: `Step number ${String(index + 1)}`, description: 'Support' }));
    const stepper = await mount({ steps, current: 4 }, '38rem');
    for (const connector of connectors(stepper)) {
      expect(connector.getBoundingClientRect().width).toBeGreaterThanOrEqual(px('--nph-stepper-connector-min-width') - 0.5);
    }
  });
});

describe('the width of the text', () => {
  const LONG = 'A very long label that does not fit in the column';

  it('the text column stops at stepper/text-max-width', async () => {
    const stepper = await mount({ steps: [{ label: LONG, description: LONG }, STEPS[1] as NphStep, STEPS[2] as NphStep], current: 2 }, '90rem');
    const text = step(stepper, 0).querySelector('.text') as HTMLElement;
    expect(text.getBoundingClientRect().width).toBeLessThanOrEqual(px('--nph-stepper-text-max-width') + 0.5);
    expect(text.getBoundingClientRect().width).toBeGreaterThan(px('--nph-stepper-text-max-width') - 1);
  });

  it('the label of a completed step stays on one line and is cut with an ellipsis', async () => {
    const stepper = await mount({ steps: [{ label: LONG }, STEPS[1] as NphStep, STEPS[2] as NphStep], current: 2 }, '90rem');
    const element = label(stepper, 0);
    const style = getComputedStyle(element);
    expect(style.whiteSpace).toBe('nowrap');
    expect(style.textOverflow).toBe('ellipsis');
    expect(element.scrollWidth).toBeGreaterThan(element.clientWidth);
    expect(element.getBoundingClientRect().height).toBeLessThan(2 * Number.parseFloat(style.lineHeight));
  });

  it('the label of the current step wraps to up to two lines and is never cut', async () => {
    const stepper = await mount({ steps: [STEPS[0] as NphStep, { label: 'Billing address and invoice details' }, STEPS[2] as NphStep], current: 2 }, '90rem');
    const element = label(stepper, 1);
    const lines = element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight);
    expect(Math.round(lines)).toBe(2);
    expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth);
    expect(tooltips(stepper)).toHaveLength(0);
  });

  it('a two-line current label sits next to one-line neighbors with the steps aligned to the top', async () => {
    const stepper = await mount({ steps: [STEPS[0] as NphStep, { label: 'Billing address and invoice details' }, STEPS[2] as NphStep], current: 2 }, '90rem');
    const tops = [0, 1, 2].map((index) => step(stepper, index).getBoundingClientRect().top);
    expect(tops[1]).toBeCloseTo(tops[0] as number, 1);
    expect(tops[2]).toBeCloseTo(tops[0] as number, 1);
  });

  it('the description goes up to two lines inside the column', async () => {
    const description = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen';
    const stepper = await mount({ steps: [{ label: 'A', description }, STEPS[1] as NphStep], current: 2 }, '90rem');
    const element = step(stepper, 0).querySelector('.description') as HTMLElement;
    const lines = element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight);
    expect(Math.round(lines)).toBe(2);
  });
});

describe('the cut label and its balloon', () => {
  const LONG = 'A very long label that does not fit in the column';

  it('a cut label brings nph-tooltip with the whole text', async () => {
    const stepper = await mount({ steps: [{ label: LONG }, STEPS[1] as NphStep, STEPS[2] as NphStep], current: 2 }, '90rem');
    const balloons = tooltips(stepper);
    expect(balloons).toHaveLength(1);
    expect(balloons[0]?.text).toBe(LONG);
    expect(balloons[0]?.getAttribute('for')).toBe('step-0');
    expect(step(stepper, 0).getAttribute('aria-describedby')).toContain(balloons[0]?.id ?? 'no-id');
  });

  it('a label that fits has no balloon', async () => {
    const stepper = await mount();
    expect(tooltips(stepper)).toHaveLength(0);
  });

  it('the balloon is measured: it goes away when the room comes back, and returns when it goes', async () => {
    const stepper = await mount({ steps: [{ label: 'Medium length label' }, STEPS[1] as NphStep, STEPS[2] as NphStep], current: 2 }, '90rem');
    expect(tooltips(stepper)).toHaveLength(0);
    const holder = stepper.parentElement as HTMLElement;
    holder.style.inlineSize = '38rem';
    stepper.steps = [{ label: LONG }, STEPS[1] as NphStep, STEPS[2] as NphStep];
    await vi.waitFor(() => expect(tooltips(stepper)).toHaveLength(1));
    stepper.steps = [{ label: 'Short' }, STEPS[1] as NphStep, STEPS[2] as NphStep];
    await vi.waitFor(() => expect(tooltips(stepper)).toHaveLength(0));
  });

  it('a pending step of the linear stepper with a cut label takes Tab only to open the balloon: it is not a link', async () => {
    const stepper = await mount({ steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: LONG }, STEPS[3] as NphStep], current: 2 }, '90rem');
    const pending = step(stepper, 2);
    expect(pending.tagName).toBe('SPAN');
    expect(pending.getAttribute('tabindex')).toBe('0');
    expect(pending.hasAttribute('href')).toBe(false);
    expect(tooltips(stepper)).toHaveLength(1);
    const seen = collect(stepper);
    pending.focus();
    await userEvent.keyboard('{Enter}');
    expect(seen).toEqual([]);
  });

  it('a pending step with a label that fits is no Tab stop', async () => {
    const stepper = await mount();
    expect(step(stepper, 3).hasAttribute('tabindex')).toBe(false);
  });

  it('the balloon opens on focus at once and Esc closes it without moving the focus', async () => {
    const stepper = await mount({ steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: LONG }, STEPS[3] as NphStep], current: 2 }, '90rem');
    const pending = step(stepper, 2);
    pending.focus();
    await frame();
    const balloon = tooltips(stepper)[0] as NphTooltip;
    await vi.waitFor(() => expect(balloon.hasAttribute('open')).toBe(true));
    await userEvent.keyboard('{Escape}');
    await vi.waitFor(() => expect(balloon.hasAttribute('open')).toBe(false));
    expect(root(stepper).activeElement).toBe(pending);
  });

  it('a clickable step with a cut label keeps its role and gets the balloon', async () => {
    const stepper = await mount({ steps: [{ label: LONG }, STEPS[1] as NphStep, STEPS[2] as NphStep], current: 2 }, '90rem');
    expect(step(stepper, 0).tagName).toBe('BUTTON');
    expect(tooltips(stepper)[0]?.getAttribute('for')).toBe('step-0');
  });

  it('a disabled step gets no balloon, and neither does the current one', async () => {
    const stepper = await mount(
      { steps: [{ label: LONG, disabled: true }, { label: LONG }, { label: LONG, disabled: true }], current: 2 },
      '90rem',
    );
    expect(tooltips(stepper)).toHaveLength(0);
  });
});

describe('the narrow width', () => {
  it('wide: the list is drawn and nph-progress is not', async () => {
    const stepper = await mount({}, '60rem');
    expect(getComputedStyle(nav(stepper)).display).toBe('block');
    expect(getComputedStyle(narrow(stepper)).display).toBe('none');
  });

  it('below 600 px of its own width it becomes nph-progress of the steps type, and the list leaves', async () => {
    const stepper = await mount({}, '37rem');
    expect(getComputedStyle(nav(stepper)).display).toBe('none');
    expect(getComputedStyle(narrow(stepper)).display).toBe('block');
    expect(narrow(stepper).type).toBe('steps');
    expect(narrow(stepper).steps).toBe(4);
    expect(narrow(stepper).step).toBe(2);
    expect(narrow(stepper).label).toBe('Address');
    expect(narrow(stepper).valueText).toBe('Step 2 of 4');
    expect(narrow(stepper).hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('exactly 600 px is still the list', async () => {
    const stepper = await mount({}, '600px');
    expect(stepper.getBoundingClientRect().width).toBeCloseTo(600, 0);
    expect(getComputedStyle(nav(stepper)).display).toBe('block');
    const less = await mount({}, '599px');
    expect(getComputedStyle(nav(less)).display).toBe('none');
  });

  it('it is the width of the stepper that counts, not the window', async () => {
    const narrowStepper = await mount({}, '20rem');
    expect(getComputedStyle(nav(narrowStepper)).display).toBe('none');
    /* The window of the test is narrower than 600 px; a stepper wider than that draws the list anyway. */
    const wideStepper = await mount({}, '60rem');
    expect(wideStepper.getBoundingClientRect().width).toBeGreaterThan(window.innerWidth);
    expect(getComputedStyle(nav(wideStepper)).display).toBe('block');
  });

  it('follows the stepper when the room changes, both ways', async () => {
    const stepper = await mount({}, '60rem');
    const holder = stepper.parentElement as HTMLElement;
    holder.style.inlineSize = '20rem';
    await vi.waitFor(() => expect(getComputedStyle(nav(stepper)).display).toBe('none'));
    holder.style.inlineSize = '60rem';
    await vi.waitFor(() => expect(getComputedStyle(nav(stepper)).display).toBe('block'));
    expect(getComputedStyle(narrow(stepper)).display).toBe('none');
  });

  it('the step text is filled in with {current} and {count}, in any order the language needs', async () => {
    const stepper = await mount({ stepText: '{count} etapas, etapa {current}', current: 3 }, '20rem');
    expect(narrow(stepper).valueText).toBe('4 etapas, etapa 3');
    expect(narrow(stepper).step).toBe(3);
    expect(narrow(stepper).label).toBe('Payment');
  });

  it('the list that is not drawn is out of the accessibility tree, and so is the progress when wide', async () => {
    const stepper = await mount({}, '20rem');
    const link = step(stepper, 0);
    expect(link.checkVisibility()).toBe(false);
    const wide = await mount({}, '60rem');
    expect(narrow(wide).checkVisibility()).toBe(false);
    expect(step(wide, 0).checkVisibility()).toBe(true);
  });

  it('the cut labels are measured again when the list comes back', async () => {
    const long = 'A very long label that does not fit in the column';
    const stepper = await mount({ steps: [{ label: long }, STEPS[1] as NphStep, STEPS[2] as NphStep], current: 2 }, '20rem');
    expect(tooltips(stepper)).toHaveLength(0);
    (stepper.parentElement as HTMLElement).style.inlineSize = '60rem';
    await vi.waitFor(() => expect(tooltips(stepper)).toHaveLength(1));
  });

  it('as a flex row item with flex: 1, it has a width of its own and draws the list', async () => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; inline-size: 60rem;';
    const stepper = document.createElement('nph-stepper');
    Object.assign(stepper, { steps: STEPS, current: 2, ...TEXTS });
    stepper.style.flex = '1';
    row.append(stepper);
    document.body.append(row);
    await settle(stepper);
    expect(getComputedStyle(nav(stepper)).display).toBe('block');
  });
});

describe('hover and focus', () => {
  it('hover paints a completed step and a pending one that can be activated', async () => {
    const stepper = await mount({ current: 2, nonLinear: true });
    await userEvent.hover(step(stepper, 0));
    await wait(300);
    expect(getComputedStyle(step(stepper, 0)).backgroundColor).toBe(background('--nph-stepper-item-background-hover'));
    await userEvent.hover(step(stepper, 2));
    await wait(300);
    expect(getComputedStyle(step(stepper, 2)).backgroundColor).toBe(background('--nph-stepper-item-background-hover'));
    expect(getComputedStyle(label(stepper, 2)).color).toBe(color('--nph-stepper-label-foreground-hover'));
  });

  it('hover keeps the look of the status: the marker does not change', async () => {
    const stepper = await mount({ current: 2 });
    const before = getComputedStyle(marker(stepper, 0)).backgroundColor;
    await userEvent.hover(step(stepper, 0));
    await wait(300);
    expect(getComputedStyle(marker(stepper, 0)).backgroundColor).toBe(before);
  });

  it('hover on the step with an error paints no background and only underlines the label', async () => {
    const stepper = await mount({ current: 2, steps: [STEPS[0] as NphStep, STEPS[1] as NphStep, { label: 'C', status: 'error' }, STEPS[3] as NphStep] });
    await userEvent.hover(step(stepper, 2));
    await wait(300);
    expect(getComputedStyle(step(stepper, 2)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(label(stepper, 2)).textDecorationLine).toBe('underline');
    expect(getComputedStyle(label(stepper, 2)).color).toBe(color('--nph-stepper-label-foreground-error'));
  });

  it('a step that cannot be activated does not react to the pointer', async () => {
    const stepper = await mount({ current: 2 });
    await userEvent.hover(step(stepper, 3));
    await wait(300);
    expect(getComputedStyle(step(stepper, 3)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.hover(step(stepper, 1));
    await wait(300);
    expect(getComputedStyle(step(stepper, 1)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(step(stepper, 3)).cursor).not.toBe('pointer');
  });

  it('keyboard focus draws a border and a halo outside the step, with no hover background', async () => {
    const stepper = await mount({ current: 2 });
    const target = step(stepper, 0);
    await userEvent.tab();
    expect(root(stepper).activeElement).toBe(target);
    expect(target.matches(':focus-visible')).toBe(true);
    const border = getComputedStyle(target, '::before');
    expect(border.borderTopColor).toBe(color('--nph-stepper-focus-border'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-stepper-focus-border-width'), 1);
    const halo = getComputedStyle(target, '::after');
    expect(halo.borderTopColor).toBe(color('--nph-stepper-focus-ring'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-stepper-focus-ring-width'), 1);
    await userEvent.hover(target);
    await wait(300);
    expect(getComputedStyle(target).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('the focus is drawn outside the step area and is not clipped', async () => {
    const stepper = await mount({ current: 3 });
    await userEvent.tab();
    const target = step(stepper, 0);
    const area = target.getBoundingClientRect();
    const border = getComputedStyle(target, '::before');
    expect(Number.parseFloat(border.width)).toBeGreaterThan(area.width - 1);
    for (const ancestor of [root(stepper).querySelector('.list'), items(stepper)[0]] as HTMLElement[]) {
      expect(getComputedStyle(ancestor).overflow).toBe('visible');
    }
  });

  it('pointer focus draws no ring', async () => {
    const stepper = await mount({ current: 3 });
    await userEvent.click(step(stepper, 0));
    expect(getComputedStyle(step(stepper, 0), '::before').content).toBe('none');
  });
});

describe('motion', () => {
  it('the color changes in stepper/state-duration with the state easing, and nothing moves', async () => {
    const stepper = await mount();
    for (const element of [step(stepper, 0), marker(stepper, 0), label(stepper, 0), connectors(stepper)[0] as HTMLElement]) {
      const style = getComputedStyle(element);
      expect(style.transitionDuration).toBe(resolved('transition-duration', '--nph-stepper-state-duration'));
      expect(style.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-state-easing'));
      expect(style.transitionProperty).not.toMatch(/width|height|inset|left|top|transform/);
    }
  });

  it('with reduced motion nothing moves: no transition at all', async () => {
    const session = cdp();
    const stepper = await mount();
    try {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      for (const element of [step(stepper, 0), marker(stepper, 0), label(stepper, 0), connectors(stepper)[0] as HTMLElement]) {
        expect(getComputedStyle(element).transitionDuration).toBe('0s');
      }
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});

describe('color scheme', () => {
  /** The value a token resolves to inside a holder, where the color scheme attribute lives. */
  function inside(holder: HTMLElement, token: string): string {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(${token})`;
    holder.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  }

  it('the colors follow data-nph-color-scheme set on a parent', async () => {
    const stepper = await mount({ current: 2 });
    const holder = stepper.parentElement as HTMLElement;
    const light = getComputedStyle(marker(stepper, 0)).backgroundColor;
    expect(light).toBe(inside(holder, '--nph-stepper-marker-background-complete'));
    holder.setAttribute('data-nph-color-scheme', 'dark');
    await frame();
    await wait(300);
    const dark = getComputedStyle(marker(stepper, 0)).backgroundColor;
    expect(dark).not.toBe(light);
    expect(dark).toBe(inside(holder, '--nph-stepper-marker-background-complete'));
  });

  it('the colors follow data-nph-brand set on a parent, with the scheme', async () => {
    const stepper = await mount({ current: 2 });
    const holder = stepper.parentElement as HTMLElement;
    const before = getComputedStyle(marker(stepper, 0)).backgroundColor;
    /* The brand and the scheme are set together, on the element that resolves the tokens (P67). */
    holder.setAttribute('data-nph-color-scheme', 'light');
    holder.setAttribute('data-nph-brand', 'igrejas');
    await frame();
    await wait(300);
    const after = getComputedStyle(marker(stepper, 0)).backgroundColor;
    expect(after).not.toBe(before);
    expect(after).toBe(inside(holder, '--nph-stepper-marker-background-complete'));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));
  const declared = [...new Set([...tokensCss.matchAll(/(--nph-stepper-[a-z0-9-]+):/g)].map((match) => match[1] ?? ''))];

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('consumes every one of the forty stepper/* tokens', () => {
    expect(declared).toHaveLength(40);
    for (const name of declared) {
      expect(used, name).toContain(name);
    }
  });

  it('uses the four text roles', () => {
    for (const name of [
      '--nph-text-label-sm-font-size',
      '--nph-text-label-md-font-size',
      '--nph-text-label-md-strong-font-weight',
      '--nph-text-body-sm-font-size',
      '--nph-motion-state-easing',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, duration or measure, except the 600 px of the narrow width', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    const measures = [...cssWithoutComments.matchAll(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/g)].map((match) => match[0]);
    expect(measures).toEqual(['37.5rem']);
    expect(cssWithoutComments).toMatch(/@container \(width < 37\.5rem\)/);
  });
});
