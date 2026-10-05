/**
 * Prova do contrato do `nph-label`.
 *
 * Cobre o que a ficha e o Registro prometem: a matriz de duas variantes, a
 * ausencia de Shadow DOM, a associacao com o controle, o asterisco decorativo
 * para tecnologia assistiva e a ausencia de propriedade de layout, peso ou
 * estado.
 */
import { describe, expect, it, afterEach } from 'vitest';

import designMd from '../../../design.md?raw';
import '../../tokens/generated/tokens.css';
import { NphLabel } from './nph-label';

const REGISTERED = customElements.get('nph-label');

afterEach(() => {
  document.body.replaceChildren();
});

/** Monta o elemento, espera a primeira renderizacao e devolve. */
async function mount(configure: (el: NphLabel) => void = () => undefined): Promise<NphLabel> {
  const el = document.createElement('nph-label');
  configure(el);
  document.body.append(el);
  await el.updateComplete;
  return el;
}

const labelOf = (el: NphLabel): HTMLLabelElement => {
  const l = el.querySelector('label');
  if (l === null) throw new Error('o elemento nao renderizou um <label>');
  return l;
};

const asterisk = (el: NphLabel): HTMLElement | null =>
  el.querySelector('.nph-label__required');

describe('registro', () => {
  it('define a tag uma vez e exporta a classe', () => {
    expect(REGISTERED).toBe(NphLabel);
  });
});

describe('a matriz tem exatamente duas combinacoes', () => {
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
});

describe('o que o rotulo NAO tem', () => {
  it('nao expoe layout, peso nem estado', async () => {
    const el = await mount();
    for (const forbidden of ['layout', 'weight', 'state', 'disabled', 'error', 'invalid']) {
      expect(forbidden in el).toBe(false);
    }
  });

  it('a API publica e exatamente text, required e for', () => {
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

  it('o papel text/label-md existe no CSS gerado', async () => {
    const css = (await import('../../tokens/generated/tokens.css?raw')).default;
    for (const part of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing']) {
      expect(css).toContain('--nph-text-label-md-' + part + ':');
    }
  });
});
