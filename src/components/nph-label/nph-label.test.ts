/**
 * Prova do contrato do `nph-label`, em navegador de verdade.
 *
 * Cobre o que a ficha e o Registro prometem: o asterisco de `required`, a
 * ausencia de Shadow DOM, a associacao com o controle, o asterisco decorativo
 * para tecnologia assistiva, a ausencia de propriedade de layout, peso ou
 * estado, e o gatilho de informacao (L8 a L11, P62.6): quando aparece, a
 * medida e a cor pelos tokens, o foco por borda e halo, e como o balao abre,
 * fecha e se posiciona.
 *
 * Os esquemas de cor sao trocados na raiz (`data-nph-color-scheme` no `html`).
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

/** Monta o elemento, espera a primeira renderizacao e devolve. */
async function mount(configure: (el: NphLabel) => void = () => undefined, parent: HTMLElement = document.body): Promise<NphLabel> {
  const el = document.createElement('nph-label');
  configure(el);
  parent.append(el);
  await el.updateComplete;
  return el;
}

/** Rotulo com gatilho: texto, `info` e `infoLabel` de exemplo. */
function withInfo(e: NphLabel): void {
  e.text = 'Full name';
  e.info = 'Explains what the field asks for.';
  e.infoLabel = 'About full name';
}

const labelOf = (el: NphLabel): HTMLLabelElement => {
  const l = el.querySelector('label');
  if (l === null) throw new Error('o elemento nao renderizou um <label>');
  return l;
};

const asterisk = (el: NphLabel): HTMLElement | null => el.querySelector('.nph-label__required');

const triggerOf = (el: NphLabel): HTMLButtonElement => {
  const b = el.querySelector<HTMLButtonElement>('button');
  if (b === null) throw new Error('o elemento nao renderizou o gatilho');
  return b;
};

type Tooltip = HTMLElement & { open: boolean; text: string; updateComplete: Promise<boolean> };

const tooltipOf = (el: NphLabel): Tooltip => {
  const t = el.querySelector<Tooltip>('nph-tooltip');
  if (t === null) throw new Error('o elemento nao renderizou o nph-tooltip');
  return t;
};

const bubbleOf = (el: NphLabel): HTMLElement => {
  const b = tooltipOf(el).shadowRoot?.querySelector<HTMLElement>('.bubble');
  if (!b) throw new Error('o balao nao esta aberto');
  return b;
};

/** O valor que o navegador da a um token, na mesma propriedade. */
function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (property: string, token: string): number => Number.parseFloat(resolved(property, token));

/** Espera o Lit renderizar de novo depois de um evento. */
async function settle(el: NphLabel): Promise<void> {
  await el.updateComplete;
  await tooltipOf(el).updateComplete;
}

describe('registro', () => {
  it('define a tag uma vez e exporta a classe', () => {
    expect(REGISTERED).toBe(NphLabel);
  });
});

describe('required acrescenta o asterisco', () => {
  it('required=false e o padrao e nao desenha asterisco', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(el.required).toBe(false);
    expect(labelOf(el).textContent).toBe('Nome completo');
    expect(asterisk(el)).toBeNull();
  });

  it('required=true acrescenta o asterisco ao fim do texto', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    expect(asterisk(el)).not.toBeNull();
    expect(asterisk(el)?.textContent).toBe('*');
    expect(labelOf(el).textContent).toBe('Nome completo*');
  });

  it('required reflete para atributo, para o CSS do consumidor poder mirar', async () => {
    const el = await mount((e) => {
      e.required = true;
    });
    expect(el.hasAttribute('required')).toBe(true);
  });

  it('alternar required desenha e apaga o asterisco', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    el.required = false;
    await el.updateComplete;
    expect(asterisk(el)).toBeNull();
  });
});

describe('excecao a P01 — sem Shadow DOM', () => {
  it('nao abre shadow root: sem isso a associacao nativa nao funcionaria', async () => {
    const el = await mount();
    expect(el.shadowRoot).toBeNull();
  });

  it('renderiza o <label> na luz, dentro do proprio elemento', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(labelOf(el).parentElement).toBe(el);
  });
});

describe('associacao com o controle', () => {
  it('for chega ao <label> e o clique leva o foco ao campo', async () => {
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

  it('com o gatilho, o clique no texto continua levando o foco ao campo (P62.1)', async () => {
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

  it('sem for, o atributo nao e emitido em branco', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(labelOf(el).hasAttribute('for')).toBe(false);
  });
});

describe('acessibilidade', () => {
  it('o rotulo da o nome acessivel do campo', async () => {
    const field = document.createElement('input');
    field.id = 'name-field';
    document.body.append(field);
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.for = 'name-field';
    });
    /* `labels` e a via oficial: e o que o leitor de tela usa para nomear. */
    expect([...(field.labels ?? [])]).toContain(labelOf(el));
  });

  it('o asterisco e decorativo: leva aria-hidden', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    expect(asterisk(el)?.getAttribute('aria-hidden')).toBe('true');
  });

  it('o componente nao injeta texto proprio: nenhum idioma vive aqui', async () => {
    const el = await mount((e) => {
      e.text = 'Full name';
      e.required = true;
    });
    expect(labelOf(el).textContent).toBe('Full name*');
  });

  it('o gatilho e um botao nativo depois do <label>, fora dele, nomeado por infoLabel', async () => {
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

  it('o gatilho nao entra no nome do campo: o texto do <label> continua so o rotulo', async () => {
    const el = await mount((e) => {
      withInfo(e);
      e.required = true;
    });
    expect(labelOf(el).textContent).toBe('Full name*');
  });

  it('o icone e circle-info solid sm, decorativo', async () => {
    const el = await mount(withInfo);
    const icon = triggerOf(el).querySelector('nph-icon');
    expect(icon?.getAttribute('name')).toBe('circle-info');
    expect(icon?.getAttribute('variant')).toBe('solid');
    expect(icon?.getAttribute('size')).toBe('sm');
    await (icon as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('o balao e regiao viva desde a montagem, fechado, com o texto de info', async () => {
    const el = await mount(withInfo);
    const tooltip = tooltipOf(el);
    expect(tooltip.getAttribute('role')).toBe('status');
    expect(tooltip.open).toBe(false);
    expect(tooltip.text).toBe('Explains what the field asks for.');
  });

  it('cada rotulo tem o seu id de balao', async () => {
    const a = await mount(withInfo);
    const b = await mount(withInfo);
    expect(tooltipOf(a).id).not.toBe(tooltipOf(b).id);
  });
});

describe('quando o gatilho aparece', () => {
  it('sem info, o DOM e o de hoje: so o <label>, e a raiz continua inline-block', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(el.children).toHaveLength(1);
    expect(el.querySelector('button, nph-tooltip')).toBeNull();
    expect(el.hasAttribute('data-nph-info')).toBe(false);
    expect(getComputedStyle(el).display).toBe('inline-block');
    expect(getComputedStyle(el).position).toBe('static');
  });

  it('com info e infoLabel, o gatilho e o balao aparecem', async () => {
    const el = await mount(withInfo);
    expect(el.hasAttribute('data-nph-info')).toBe(true);
    expect(triggerOf(el)).toBeTruthy();
    expect(tooltipOf(el)).toBeTruthy();
  });

  it('info-label e o atributo de infoLabel; info e infoLabel nao refletem', async () => {
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

  it('info sem infoLabel: sem gatilho, rotulo intacto e console.error uma vez', async () => {
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

  it('infoLabel so com espacos conta como vazio', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = await mount((e) => {
      e.text = 'Full name';
      e.info = 'Explains.';
      e.infoLabel = '   ';
    });
    expect(el.querySelector('button')).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('infoLabel sem info e montagem: nada, sem erro', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = await mount((e) => {
      e.text = 'Full name';
      e.infoLabel = 'About full name';
    });
    expect(el.querySelector('button')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('tirar info apaga o gatilho e fecha o balao', async () => {
    const el = await mount(withInfo);
    await userEvent.click(triggerOf(el));
    el.info = '';
    await el.updateComplete;
    expect(el.querySelector('button, nph-tooltip')).toBeNull();
    expect(el.hasAttribute('data-nph-info')).toBe(false);
  });
});

describe('medidas e cor pelos tokens', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: gatilho 24 x 24, icone sm em color/muted-foreground, a space/inline-tight do texto`, async () => {
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

  it('com o gatilho, a raiz tem a altura dele e o texto fica ao centro', async () => {
    const el = await mount(withInfo);
    const root = el.getBoundingClientRect();
    const trigger = triggerOf(el).getBoundingClientRect();
    const text = labelOf(el).getBoundingClientRect();
    expect(root.height).toBeCloseTo(trigger.height, 1);
    expect(text.top - root.top).toBeCloseTo(root.bottom - text.bottom, 1);
  });

  it('sem o gatilho, a altura e a do texto (text/label-md)', async () => {
    const el = await mount((e) => {
      e.text = 'Nome completo';
    });
    expect(el.getBoundingClientRect().height).toBeCloseTo(px('line-height', '--nph-text-label-md-line-height'), 1);
  });
});

describe('foco do gatilho', () => {
  async function tabToTrigger(parent: HTMLElement = document.body): Promise<NphLabel> {
    const before = document.createElement('input');
    parent.append(before);
    const el = await mount(withInfo, parent);
    before.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(triggerOf(el));
    return el;
  }

  it('Tab mostra a borda focus/border e o halo focus/halo, por fora, sem mudar o tamanho', async () => {
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

  it('o clique de mouse nao desenha o foco', async () => {
    const el = await mount(withInfo);
    await userEvent.click(triggerOf(el));
    expect(getComputedStyle(triggerOf(el), '::before').content).toBe('none');
  });

  it('numa parte da tela com outra marca e outro esquema, o halo e o local (P67)', async () => {
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

describe('abrir e fechar o balao', () => {
  it('o clique abre e fecha, e o gatilho fica com o foco', async () => {
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

  it('Enter e Espaco alternam', async () => {
    const el = await mount(withInfo);
    triggerOf(el).focus();
    await userEvent.keyboard('{Enter}');
    await settle(el);
    expect(tooltipOf(el).open).toBe(true);
    await userEvent.keyboard(' ');
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
  });

  it('Esc com o balao aberto fecha, deixa o foco no gatilho e nao propaga', async () => {
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

  it('Esc com o balao fechado nao e interceptado', async () => {
    const el = await mount(withInfo);
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    triggerOf(el).focus();
    await userEvent.keyboard('{Escape}');
    expect(outer).toHaveBeenCalledTimes(1);
    document.body.removeEventListener('keydown', outer);
  });

  it('clique fora fecha; clique dentro do balao nao fecha', async () => {
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

  it('clique no texto do rotulo fecha o balao e leva o foco ao campo', async () => {
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

  it('Tab e Shift+Tab para fora fecham', async () => {
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

  it('passar o mouse nao abre', async () => {
    const el = await mount(withInfo);
    await userEvent.hover(triggerOf(el));
    await settle(el);
    expect(tooltipOf(el).open).toBe(false);
  });

  it('desconectar com o balao aberto solta o ouvinte do documento', async () => {
    const remove = vi.spyOn(document, 'removeEventListener');
    const el = await mount(withInfo);
    await userEvent.click(triggerOf(el));
    await settle(el);
    el.remove();
    expect(remove.mock.calls.some(([type]) => type === 'pointerdown')).toBe(true);
    expect(() => document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))).not.toThrow();
  });
});

describe('posicao do balao', () => {
  it('abaixo do rotulo, alinhado ao inicio, a space/inline, sem mudar a altura do rotulo', async () => {
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

  it('rotulo curto e explicacao longa: o balao vai ate a largura maxima, em ate duas linhas', async () => {
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

describe('o que o rotulo NAO tem', () => {
  it('nao expoe layout, peso nem estado', async () => {
    const el = await mount();
    for (const forbidden of ['layout', 'weight', 'state', 'disabled', 'error', 'invalid', 'open']) {
      expect(forbidden in el).toBe(false);
    }
  });

  it('a API publica e exatamente text, required, for, info e infoLabel', () => {
    const properties = (NphLabel as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties;
    const declared = [...properties].filter(([, options]) => options.state !== true).map(([name]) => name);
    expect(new Set(declared)).toEqual(new Set(['text', 'required', 'for', 'info', 'infoLabel']));
  });
});

describe('contrato de token', () => {
  it('o design.md autoriza status/error como indicador de obrigatorio', () => {
    const block = designMd.slice(designMd.indexOf('  status/error:'));
    const usage = block.slice(0, block.indexOf('nao_use'));
    expect(usage).toContain('asterisco');
    expect(usage).toContain('obrigat');
  });

  it('A5 continua proibindo color/destructive em erro de validacao', () => {
    expect(designMd).toContain('Usar `color/destructive` em erro de validação');
  });

  it('o papel text/label-md existe no CSS gerado', () => {
    for (const part of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing']) {
      expect(tokensCss).toContain('--nph-text-label-md-' + part + ':');
    }
  });

  it('todo token que o gatilho e o balao consomem existe no CSS gerado', () => {
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
