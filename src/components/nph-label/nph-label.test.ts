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

const REGISTRADO = customElements.get('nph-label');

afterEach(() => {
  document.body.replaceChildren();
});

/** Monta o elemento, espera a primeira renderizacao e devolve. */
async function montar(configurar: (el: NphLabel) => void = () => undefined): Promise<NphLabel> {
  const el = document.createElement('nph-label');
  configurar(el);
  document.body.append(el);
  await el.updateComplete;
  return el;
}

const rotulo = (el: NphLabel): HTMLLabelElement => {
  const l = el.querySelector('label');
  if (l === null) throw new Error('o elemento nao renderizou um <label>');
  return l;
};

const asterisco = (el: NphLabel): HTMLElement | null =>
  el.querySelector('.nph-label__obrigatorio');

describe('registro', () => {
  it('define a tag uma vez e exporta a classe', () => {
    expect(REGISTRADO).toBe(NphLabel);
  });
});

describe('a matriz tem exatamente duas combinacoes', () => {
  it('required=false e o padrao e nao desenha asterisco', async () => {
    const el = await montar((e) => {
      e.text = 'Nome completo';
    });
    expect(el.required).toBe(false);
    expect(rotulo(el).textContent).toBe('Nome completo');
    expect(asterisco(el)).toBeNull();
  });

  it('required=true acrescenta o asterisco ao fim do texto', async () => {
    const el = await montar((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    expect(asterisco(el)).not.toBeNull();
    expect(asterisco(el)?.textContent).toBe('*');
    expect(rotulo(el).textContent).toBe('Nome completo*');
  });

  it('required reflete para atributo, para o CSS do consumidor poder mirar', async () => {
    const el = await montar((e) => {
      e.required = true;
    });
    expect(el.hasAttribute('required')).toBe(true);
  });

  it('alternar required desenha e apaga o asterisco', async () => {
    const el = await montar((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    el.required = false;
    await el.updateComplete;
    expect(asterisco(el)).toBeNull();
  });
});

describe('excecao a P01 — sem Shadow DOM', () => {
  it('nao abre shadow root: sem isso a associacao nativa nao funcionaria', async () => {
    const el = await montar();
    expect(el.shadowRoot).toBeNull();
  });

  it('renderiza o <label> na luz, dentro do proprio elemento', async () => {
    const el = await montar((e) => {
      e.text = 'Nome completo';
    });
    expect(rotulo(el).parentElement).toBe(el);
  });
});

describe('associacao com o controle', () => {
  it('for chega ao <label> e o clique leva o foco ao campo', async () => {
    const campo = document.createElement('input');
    campo.id = 'campo-nome';
    document.body.append(campo);

    const el = await montar((e) => {
      e.text = 'Nome completo';
      e.for = 'campo-nome';
    });

    expect(rotulo(el).htmlFor).toBe('campo-nome');
    expect(rotulo(el).control).toBe(campo);

    rotulo(el).click();
    expect(document.activeElement).toBe(campo);
  });

  it('sem for, o atributo nao e emitido em branco', async () => {
    const el = await montar((e) => {
      e.text = 'Nome completo';
    });
    expect(rotulo(el).hasAttribute('for')).toBe(false);
  });
});

describe('acessibilidade', () => {
  it('o rotulo da o nome acessivel do campo', async () => {
    const campo = document.createElement('input');
    campo.id = 'campo-nome';
    document.body.append(campo);
    const el = await montar((e) => {
      e.text = 'Nome completo';
      e.for = 'campo-nome';
    });
    /* `labels` e a via oficial: e o que o leitor de tela usa para nomear. */
    expect([...(campo.labels ?? [])]).toContain(rotulo(el));
  });

  it('o asterisco e decorativo: leva aria-hidden', async () => {
    const el = await montar((e) => {
      e.text = 'Nome completo';
      e.required = true;
    });
    expect(asterisco(el)?.getAttribute('aria-hidden')).toBe('true');
  });

  it('o componente nao injeta texto proprio: nenhum idioma vive aqui', async () => {
    const el = await montar((e) => {
      e.text = 'Full name';
      e.required = true;
    });
    expect(rotulo(el).textContent).toBe('Full name*');
  });
});

describe('o que o rotulo NAO tem', () => {
  it('nao expoe layout, peso nem estado', async () => {
    const el = await montar();
    for (const proibida of ['layout', 'weight', 'state', 'disabled', 'error', 'invalid']) {
      expect(proibida in el).toBe(false);
    }
  });

  it('a API publica e exatamente text, required e for', () => {
    const declaradas = Object.keys(
      (NphLabel as unknown as { elementProperties: Map<string, unknown> }).elementProperties
        ? Object.fromEntries(
            (NphLabel as unknown as { elementProperties: Map<string, unknown> }).elementProperties,
          )
        : {},
    );
    expect(new Set(declaradas)).toEqual(new Set(['text', 'required', 'for']));
  });
});

describe('contrato de token', () => {
  it('o design.md autoriza status/error como indicador de obrigatorio', () => {
    const bloco = designMd.slice(designMd.indexOf('  status/error:'));
    const uso = bloco.slice(0, bloco.indexOf('nao_use'));
    expect(uso).toContain('asterisco');
    expect(uso).toContain('obrigat');
  });

  it('A5 continua proibindo color/destructive em erro de validacao', () => {
    expect(designMd).toContain('Usar `color/destructive` em erro de validação');
  });

  it('o papel text/label-md existe no CSS gerado', async () => {
    const css = (await import('../../tokens/generated/tokens.css?raw')).default;
    for (const parte of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing']) {
      expect(css).toContain('--nph-text-label-md-' + parte + ':');
    }
  });
});
