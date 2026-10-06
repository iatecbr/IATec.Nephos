/**
 * Proof of the `nph-label` contract.
 *
 * Covers what the spec and the Register promise: the two-variant matrix, the
 * absence of Shadow DOM, the association with the control, the asterisk being
 * decorative for assistive technology and the absence of a layout, weight or
 * state property.
 */
import { describe, expect, it, afterEach } from 'vitest';

import designMd from '../../../design.md?raw';
import '../../tokens/generated/tokens.css';
import { NphLabel } from './nph-label';

const REGISTERED = customElements.get('nph-label');

afterEach(() => {
  document.body.replaceChildren();
});

/** Mounts the element, waits for the first render and returns it. */
async function mount(configure: (el: NphLabel) => void = () => undefined): Promise<NphLabel> {
  const el = document.createElement('nph-label');
  configure(el);
  document.body.append(el);
  await el.updateComplete;
  return el;
}

const labelOf = (el: NphLabel): HTMLLabelElement => {
  const l = el.querySelector('label');
  if (l === null) throw new Error('the element did not render a <label>');
  return l;
};

const asterisk = (el: NphLabel): HTMLElement | null =>
  el.querySelector('.nph-label__required');

describe('registration', () => {
  it('defines the tag once and exports the class', () => {
    expect(REGISTERED).toBe(NphLabel);
  });
});

describe('the matrix has exactly two combinations', () => {
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
});

describe('what the label does NOT have', () => {
  it('exposes no layout, weight or state', async () => {
    const el = await mount();
    for (const forbidden of ['layout', 'weight', 'state', 'disabled', 'error', 'invalid']) {
      expect(forbidden in el).toBe(false);
    }
  });

  it('the public API is exactly text, required and for', () => {
    const declared = Object.keys(
      (NphLabel as unknown as { elementProperties: Map<string, unknown> }).elementProperties
        ? Object.fromEntries(
            (NphLabel as unknown as { elementProperties: Map<string, unknown> }).elementProperties,
          )
        : {},
    );
    expect(new Set(declared)).toEqual(new Set(['text', 'required', 'for']));
  });
});

describe('token contract', () => {
  it('design.md authorizes status/error as the required indicator', () => {
    const block = designMd.slice(designMd.indexOf('  status/error:'));
    const usage = block.slice(0, block.indexOf('nao_use'));
    expect(usage).toContain('asterisco');
    expect(usage).toContain('obrigat');
  });

  it('A5 still forbids color/destructive on validation errors', () => {
    expect(designMd).toContain('Usar `color/destructive` em erro de validação');
  });

  it('the text/label-md role exists in the generated CSS', async () => {
    const css = (await import('../../tokens/generated/tokens.css?raw')).default;
    for (const part of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing']) {
      expect(css).toContain('--nph-text-label-md-' + part + ':');
    }
  });
});
