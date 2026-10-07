/**
 * Proof of the `nph-label` contract, in a real browser.
 *
 * Covers what the spec and the Register promise: the `required` asterisk, the
 * absence of Shadow DOM, the association with the control, the asterisk being
 * decorative for assistive technology, the absence of a layout, weight or
 * state property, and the information trigger (L8 to L11, P62.6): when it
 * appears, its measure and color through the tokens, focus through border and
 * halo, and how the bubble opens, closes and is positioned.
 *
 * The color schemes are switched at the root (`data-nph-color-scheme` on `html`).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import designMd from '../../../design.md?raw';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import { NphLabel } from './nph-label';

const REGISTERED = customElements.get('nph-label');

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('400 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

/** Mounts the element, waits for the first render and returns it. */
async function mount(configure: (el: NphLabel) => void = () => undefined, parent: HTMLElement = document.body): Promise<NphLabel> {
  const el = document.createElement('nph-label');
  configure(el);
  parent.append(el);
  await el.updateComplete;
  return el;
}

/** Label with trigger: example text, `info` and `infoLabel`. */
function withInfo(e: NphLabel): void {
  e.text = 'Full name';
  e.info = 'Explains what the field asks for.';
  e.infoLabel = 'About full name';
}

const labelOf = (el: NphLabel): HTMLLabelElement => {
  const l = el.querySelector('label');
  if (l === null) throw new Error('the element did not render a <label>');
  return l;
};

const asterisk = (el: NphLabel): HTMLElement | null => el.querySelector('.nph-label__required');

const triggerOf = (el: NphLabel): HTMLButtonElement => {
  const b = el.querySelector<HTMLButtonElement>('button');
  if (b === null) throw new Error('the element did not render the trigger');
  return b;
};

type Tooltip = HTMLElement & { open: boolean; text: string; updateComplete: Promise<boolean> };

const tooltipOf = (el: NphLabel): Tooltip => {
  const t = el.querySelector<Tooltip>('nph-tooltip');
  if (t === null) throw new Error('the element did not render nph-tooltip');
  return t;
};

const bubbleOf = (el: NphLabel): HTMLElement => {
  const b = tooltipOf(el).shadowRoot?.querySelector<HTMLElement>('.bubble');
  if (!b) throw new Error('the bubble is not open');
  return b;
};

/** The value the browser gives a token, in the same property. */
function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (property: string, token: string): number => Number.parseFloat(resolved(property, token));

/** Waits for Lit to render again after an event. */
async function settle(el: NphLabel): Promise<void> {
  await el.updateComplete;
  await tooltipOf(el).updateComplete;
}

describe('registration', () => {
  it('defines the tag once and exports the class', () => {
    expect(REGISTERED).toBe(NphLabel);
  });
});

describe('required appends the asterisk', () => {
  it('required=false is the default and draws no asterisk', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(el.required).toBe(false);
    expect(labelOf(el).textContent).toBe('Nome completo');
    expect(asterisk(el)).toBeNull();
  });

  it('required=true appends the asterisk to the end of the text', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    expect(asterisk(el)).not.toBeNull();
    expect(asterisk(el)?.textContent).toBe('*');
    expect(labelOf(el).textContent).toBe('Nome completo*');
  });

  it('required reflects to an attribute, so the consumer CSS can target it', async () => {
    const el = await mount((e) => {
      e.required = true;
    });
    expect(el.hasAttribute('required')).toBe(true);
  });

  it('toggling required draws and removes the asterisk', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    el.required = false;
    await el.updateComplete;
    expect(asterisk(el)).toBeNull();
  });
});

describe('exception to P01 — no Shadow DOM', () => {
  it('does not open a shadow root: without it the native association would not work', async () => {
    const el = await mount();
    expect(el.shadowRoot).toBeNull();
  });

  it('renders the <label> in the light DOM, inside the element itself', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(labelOf(el).parentElement).toBe(el);
  });
});

describe('association with the control', () => {
  it('for reaches the <label> and a click moves focus to the field', async () => {
    const field = document.createElement('input');
    field.id = 'name-field';
    document.body.append(field);

    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.for = 'name-field';
    });

    expect(labelOf(el).htmlFor).toBe('name-field');
    expect(labelOf(el).control).toBe(field);

    labelOf(el).click();
    expect(document.activeElement).toBe(field);
  });

  it('with the trigger, clicking the text still moves focus to the field (P62.1)', async () => {
    const field = document.createElement('input');
    field.id = 'name-field';
    document.body.append(field);
    const el = await mount((e) => {
      withInfo(e);
      e.for = 'name-field';
    });
    expect(labelOf(el).control).toBe(field);
    await userEvent.click(labelOf(el));
    expect(document.activeElement).toBe(field);
  });

  it('without for, the attribute is not emitted blank', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(labelOf(el).hasAttribute('for')).toBe(false);
  });
});

describe('accessibility', () => {
  it('the label gives the field its accessible name', async () => {
    const field = document.createElement('input');
    field.id = 'name-field';
    document.body.append(field);
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.for = 'name-field';
    });
    /* `labels` is the official route: it is what the screen reader uses to name. */
    expect([...(field.labels ?? [])]).toContain(labelOf(el));
  });

  it('the asterisk is decorative: it carries aria-hidden', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    expect(asterisk(el)?.getAttribute('aria-hidden')).toBe('true');
  });

  it('the component injects no text of its own: no language lives here', async () => {
    const el = await mount((e) => {
      e.text = 'Full name';
      e.required = true;
    });
    expect(labelOf(el).textContent).toBe('Full name*');
  });

  it('the trigger is a native button after the <label>, outside it, named by infoLabel', async () => {
    const el = await mount(withInfo);
    const trigger = triggerOf(el);
    expect(trigger.type).toBe('button');
    expect(trigger.parentElement).toBe(el);
    expect(labelOf(el).contains(trigger)).toBe(false);
    expect(labelOf(el).nextElementSibling).toBe(trigger);
    expect(trigger.getAttribute('aria-label')).toBe('About full name');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(tooltipOf(el).id);
  });

  it('the trigger does not enter the field name: the <label> text stays only the label', async () => {
    const el = await mount((e) => {
      withInfo(e);
      e.required = true;
    });
    expect(labelOf(el).textContent).toBe('Full name*');
  });

  it('the icon is circle-info solid sm, decorative', async () => {
    const el = await mount(withInfo);
    const icon = triggerOf(el).querySelector('nph-icon');
    expect(icon?.getAttribute('name')).toBe('circle-info');
    expect(icon?.getAttribute('variant')).toBe('solid');
    expect(icon?.getAttribute('size')).toBe('sm');
    await (icon as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('the bubble is a live region from mount, closed, with the info text', async () => {
    const el = await mount(withInfo);
    const tooltip = tooltipOf(el);
    expect(tooltip.getAttribute('role')).toBe('status');
    expect(tooltip.open).toBe(false);
    expect(tooltip.text).toBe('Explains what the field asks for.');
  });

  it('each label has its own bubble id', async () => {
    const a = await mount(withInfo);
    const b = await mount(withInfo);
    expect(tooltipOf(a).id).not.toBe(tooltipOf(b).id);
  });
});

describe('when the trigger appears', () => {
  it('without info, the DOM is the one of today: only the <label>, and the root stays inline-block', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(el.children).toHaveLength(1);
    expect(el.querySelector('button, nph-tooltip')).toBeNull();
    expect(el.hasAttribute('data-nph-info')).toBe(false);
    expect(getComputedStyle(el).display).toBe('inline-block');
    expect(getComputedStyle(el).position).toBe('static');
  });

  it('with info and infoLabel, the trigger and the bubble appear', async () => {
    const el = await mount(withInfo);
    expect(el.hasAttribute('data-nph-info')).toBe(true);
    expect(triggerOf(el)).toBeTruthy();
    expect(tooltipOf(el)).toBeTruthy();
  });

  it('info-label is the attribute of infoLabel; info and infoLabel do not reflect', async () => {
    const el = document.createElement('nph-label');
    el.setAttribute('text', 'Full name');
    el.setAttribute('info', 'Explains.');
    el.setAttribute('info-label', 'About full name');
    document.body.append(el);
    await el.updateComplete;
    expect(el.infoLabel).toBe('About full name');
    expect(triggerOf(el).getAttribute('aria-label')).toBe('About full name');

    const set = await mount(withInfo);
    expect(set.hasAttribute('info')).toBe(false);
    expect(set.hasAttribute('info-label')).toBe(false);
  });

  it('info without infoLabel: no trigger, label intact and console.error once', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = await mount((e) => {
      e.text = 'Full name';
      e.info = 'Explains.';
    });
    expect(el.querySelector('button, nph-tooltip')).toBeNull();
    expect(labelOf(el).textContent).toBe('Full name');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(String(spy.mock.calls[0]?.[0])).toContain('info-label');
    el.info = 'Explains more.';
    await el.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('infoLabel with only spaces counts as empty', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = await mount((e) => {
      e.text = 'Full name';
      e.info = 'Explains.';
      e.infoLabel = '   ';
    });
    expect(el.querySelector('button')).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('infoLabel without info is assembly: nothing, no error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = await mount((e) => {
      e.text = 'Full name';
      e.infoLabel = 'About full name';
    });
    expect(el.querySelector('button')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('removing info erases the trigger and closes the bubble', async () => {
    const el = await mount(withInfo);
    await userEvent.click(triggerOf(el));
    el.info = '';
    await el.updateComplete;
    expect(el.querySelector('button, nph-tooltip')).toBeNull();
    expect(el.hasAttribute('data-nph-info')).toBe(false);
  });
});

describe('measures and color through the tokens', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: 24 x 24 trigger, sm icon in color/muted-foreground, space/inline-tight from the text`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const el = await mount(withInfo);
      const trigger = triggerOf(el);
      const box = trigger.getBoundingClientRect();
      const side = px('width', '--nph-icon-size-sm') + 2 * px('width', '--nph-space-inline-tight');
      expect(box.width).toBeCloseTo(side, 2);
      expect(box.height).toBeCloseTo(side, 2);
      const icon = trigger.querySelector('nph-icon') as HTMLElement;
      expect(icon.getBoundingClientRect().width).toBeCloseTo(px('width', '--nph-icon-size-sm'), 2);
      expect(getComputedStyle(trigger).color).toBe(resolved('color', '--nph-color-muted-foreground'));
      expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-color-muted-foreground'));
      expect(getComputedStyle(trigger).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      const gap = box.left - labelOf(el).getBoundingClientRect().right;
      expect(gap).toBeCloseTo(px('width', '--nph-space-inline-tight'), 1);
    });
  }

  it('with the trigger, the root has its height and the text sits in the center', async () => {
    const el = await mount(withInfo);
    const root = el.getBoundingClientRect();
    const trigger = triggerOf(el).getBoundingClientRect();
    const text = labelOf(el).getBoundingClientRect();
    expect(root.height).toBeCloseTo(trigger.height, 1);
    expect(text.top - root.top).toBeCloseTo(root.bottom - text.bottom, 1);
  });

  it('without the trigger, the height is that of the text (text/label-md)', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(el.getBoundingClientRect().height).toBeCloseTo(px('line-height', '--nph-text-label-md-line-height'), 1);
  });
});

describe('trigger focus', () => {
  async function tabToTrigger(parent: HTMLElement = document.body): Promise<NphLabel> {
    const before = document.createElement('input');
    parent.append(before);
    const el = await mount(withInfo, parent);
    before.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(triggerOf(el));
    return el;
  }

  it('Tab shows the focus/border border and the focus/halo halo, outside, without changing the size', async () => {
    const el = await tabToTrigger();
    const trigger = triggerOf(el);
    const border = getComputedStyle(trigger, '::before');
    const halo = getComputedStyle(trigger, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(border.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
    const box = trigger.getBoundingClientRect();
    const borderWidth = px('width', '--nph-border-width');
    const ringWidth = px('width', '--nph-focus-ring-width');
    expect(Number.parseFloat(border.width)).toBeCloseTo(box.width + 2 * borderWidth, 2);
    expect(Number.parseFloat(halo.height)).toBeCloseTo(box.height + 2 * (borderWidth + ringWidth), 2);
  });

  it('a mouse click does not draw the focus', async () => {
    const el = await mount(withInfo);
    await userEvent.click(triggerOf(el));
    expect(getComputedStyle(triggerOf(el), '::before').content).toBe('none');
  });

  it('in a part of the screen with another brand and another scheme, the halo is the local one (P67)', async () => {
    const defaultBrand = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
    const otherBrand =
      [...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? '').find((b) => b !== defaultBrand) ?? '';
    const part = document.createElement('div');
    part.setAttribute('data-nph-brand', otherBrand);
    part.setAttribute('data-nph-color-scheme', 'dark');
    document.body.append(part);
    const el = await tabToTrigger(part);
    const local = resolved('color', '--nph-focus-halo', part);
    expect(local).not.toBe(resolved('color', '--nph-focus-halo'));
    expect(getComputedStyle(triggerOf(el), '::after').borderTopColor).toBe(local);
  });
});

describe('opening and closing the bubble', () => {
  it('a click opens and closes, and the trigger keeps focus', async () => {
    const el = await mount(withInfo);
    const trigger = triggerOf(el);
    await userEvent.click(trigger);
    await settle(el);
    expect(tooltipOf(el).open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(trigger);
    expect(bubbleOf(el).textContent).toBe('Explains what the field asks for.');
    await userEvent.click(trigger);
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('Enter and Space toggle', async () => {
    const el = await mount(withInfo);
    triggerOf(el).focus();
    await userEvent.keyboard('{Enter}');
    await settle(el);
    expect(tooltipOf(el).open).toBe(true);
    await userEvent.keyboard(' ');
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
  });

  it('Esc with the bubble open closes it, leaves focus on the trigger and does not propagate', async () => {
    const el = await mount(withInfo);
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    await userEvent.click(triggerOf(el));
    await settle(el);
    await userEvent.keyboard('{Escape}');
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
    expect(document.activeElement).toBe(triggerOf(el));
    expect(outer).not.toHaveBeenCalled();
    document.body.removeEventListener('keydown', outer);
  });

  it('Esc with the bubble closed is not intercepted', async () => {
    const el = await mount(withInfo);
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    triggerOf(el).focus();
    await userEvent.keyboard('{Escape}');
    expect(outer).toHaveBeenCalledTimes(1);
    document.body.removeEventListener('keydown', outer);
  });

  it('a click outside closes; a click inside the bubble does not close', async () => {
    const outside = document.createElement('p');
    outside.textContent = 'outside';
    document.body.append(outside);
    const el = await mount(withInfo);
    await userEvent.click(triggerOf(el));
    await settle(el);
    await userEvent.click(bubbleOf(el));
    await settle(el);
    expect(tooltipOf(el).open).toBe(true);
    await userEvent.click(outside);
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
  });

  it('a click on the label text closes the bubble and moves focus to the field', async () => {
    const field = document.createElement('input');
    field.id = 'name-field';
    document.body.append(field);
    const el = await mount((e) => {
      withInfo(e);
      e.for = 'name-field';
    });
    await userEvent.click(triggerOf(el));
    await settle(el);
    await userEvent.click(labelOf(el));
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
    expect(document.activeElement).toBe(field);
  });

  it('Tab and Shift+Tab out close it', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const el = await mount(withInfo);
    const after = document.createElement('input');
    document.body.append(after);

    await userEvent.click(triggerOf(el));
    await settle(el);
    await userEvent.tab();
    await settle(el);
    expect(document.activeElement).toBe(after);
    expect(tooltipOf(el).open).toBe(false);

    await userEvent.click(triggerOf(el));
    await settle(el);
    await userEvent.tab({ shift: true });
    await settle(el);
    expect(document.activeElement).toBe(before);
    expect(tooltipOf(el).open).toBe(false);
  });

  it('hovering does not open it', async () => {
    const el = await mount(withInfo);
    await userEvent.hover(triggerOf(el));
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
  });

  it('disconnecting with the bubble open releases the document listener', async () => {
    const remove = vi.spyOn(document, 'removeEventListener');
    const el = await mount(withInfo);
    await userEvent.click(triggerOf(el));
    await settle(el);
    el.remove();
    expect(remove.mock.calls.some(([type, , options]) => type === 'pointerdown' && options === true)).toBe(true);
  });
});

describe('bubble position', () => {
  it('below the label, aligned to the start, at space/inline, without changing the label height', async () => {
    const el = await mount(withInfo);
    const before = el.getBoundingClientRect();
    await userEvent.click(triggerOf(el));
    await settle(el);
    const root = el.getBoundingClientRect();
    const tooltip = tooltipOf(el).getBoundingClientRect();
    expect(root.height).toBeCloseTo(before.height, 2);
    expect(tooltip.left).toBeCloseTo(root.left, 1);
    expect(tooltip.top - root.bottom).toBeCloseTo(px('width', '--nph-space-inline'), 1);
  });

  it('short label and long explanation: the bubble goes up to the maximum width, in up to two lines', async () => {
    const el = await mount((e) => {
      e.text = 'CPF';
      e.info = 'Use the number printed on the identity card, digits only, without dots or dashes.';
      e.infoLabel = 'About CPF';
    });
    await userEvent.click(triggerOf(el));
    await settle(el);
    const bubble = bubbleOf(el).getBoundingClientRect();
    expect(bubble.width).toBeCloseTo(px('width', '--nph-layout-max-tooltip-width'), 1);
    expect(bubble.width).toBeGreaterThan(el.getBoundingClientRect().width);
    expect(bubble.height).toBeLessThanOrEqual(px('height', '--nph-layout-max-tooltip-height') + 0.5);
  });
});

describe('what the label does NOT have', () => {
  it('exposes no layout, weight or state', async () => {
    const el = await mount();
    for (const forbidden of ['layout', 'weight', 'state', 'disabled', 'error', 'invalid', 'open']) {
      expect(forbidden in el).toBe(false);
    }
  });

  it('the public API is exactly text, required, for, info and infoLabel', () => {
    const properties = (NphLabel as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties;
    const declared = [...properties].filter(([, options]) => options.state !== true).map(([name]) => name);
    expect(new Set(declared)).toEqual(new Set(['text', 'required', 'for', 'info', 'infoLabel']));
  });
});

describe('token contract', () => {
  it('design.md authorizes status/error as the required indicator', () => {
    const block = designMd.slice(designMd.indexOf('  status/error:'));
    const usage = block.slice(0, block.indexOf('nao_use'));
    expect(usage).toContain('asterisk');
    expect(usage).toContain('required');
  });

  it('A5 still forbids color/destructive on validation errors', () => {
    expect(designMd).toContain('Use `color/destructive` for a validation error');
  });

  it('the text/label-md role exists in the generated CSS', () => {
    for (const part of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing']) {
      expect(tokensCss).toContain('--nph-text-label-md-' + part + ':');
    }
  });

  it('every token the trigger and the bubble consume exists in the generated CSS', () => {
    for (const token of [
      '--nph-space-inline-tight',
      '--nph-space-inline',
      '--nph-icon-size-sm',
      '--nph-color-muted-foreground',
      '--nph-border-width',
      '--nph-focus-border',
      '--nph-focus-halo',
      '--nph-focus-ring-width',
      '--nph-focus-border-radius-control',
      '--nph-focus-radius-control-with-border',
    ]) {
      expect(tokensCss, token).toContain(`${token}:`);
    }
  });
});
