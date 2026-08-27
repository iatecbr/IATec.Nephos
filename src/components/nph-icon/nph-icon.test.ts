/**
 * Prova do contrato do `nph-icon`.
 *
 * Roda em Chromium de verdade (P21, item 5). Os grupos abaixo cobrem o que a
 * ficha promete: nucleo fechado, variante, tamanho por token, entrada
 * invalida, acessibilidade, ausencia de interacao, heranca de cor e transbordo
 * dos icones largos.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import designMd from '../../../design.md?raw';
import '../../tokens/generated/tokens.css';
import { NphIcon } from './nph-icon';
import { NPH_ICON_NAMES } from './nph-icon.icons';

/* `NphIcon` e importado como valor para registrar o elemento e para tipar. */
const REGISTRADO = customElements.get('nph-icon');

let erros: MockInstance<typeof console.error>;

beforeEach(() => {
  erros = vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  erros.mockRestore();
  document.body.replaceChildren();
});

async function montar(atributos: Record<string, string>): Promise<NphIcon> {
  const elemento = document.createElement('nph-icon');
  for (const [chave, valor] of Object.entries(atributos)) {
    elemento.setAttribute(chave, valor);
  }
  document.body.append(elemento);
  await elemento.updateComplete;
  return elemento;
}

function svgDe(elemento: NphIcon): SVGSVGElement | null {
  return elemento.shadowRoot?.querySelector('svg') ?? null;
}

function caminhoDe(elemento: NphIcon): string {
  return elemento.shadowRoot?.querySelector('path')?.getAttribute('d') ?? '';
}

/**
 * Extrai os nomes de `icones_nucleo` direto do `design.md`. O mapa do
 * componente nao pode divergir da fonte: se a lista mudar la, este teste
 * reprova aqui.
 */
function nomesDoDesignMd(): string[] {
  const inicio = designMd.indexOf('icones_nucleo:');
  const fim = designMd.indexOf('icones_segunda_leva:');
  expect(inicio).toBeGreaterThan(-1);
  expect(fim).toBeGreaterThan(inicio);

  const bloco = designMd.slice(inicio, fim);
  const listas = [...bloco.matchAll(/icones:\s*\[([^\]]+)\]/g)];
  expect(listas.length).toBe(5);

  return listas.flatMap((lista) =>
    (lista[1] ?? '').split(',').map((nome) => nome.trim()),
  );
}

describe('registro do elemento', () => {
  it('define nph-icon uma unica vez', () => {
    expect(REGISTRADO).toBe(NphIcon);
  });
});

describe('nucleo fechado de 34 icones', () => {
  it('o mapa do componente e identico a icones_nucleo do design.md', () => {
    const doDocumento = nomesDoDesignMd();
    expect(doDocumento).toHaveLength(34);
    expect([...NPH_ICON_NAMES].sort()).toEqual([...doDocumento].sort());
  });

  it('cada um dos 34 nomes desenha um caminho', async () => {
    for (const nome of NPH_ICON_NAMES) {
      const icone = await montar({ name: nome, size: 'sm' });
      expect(svgDe(icone), nome).not.toBeNull();
      expect(caminhoDe(icone).length, nome).toBeGreaterThan(0);
      icone.remove();
    }
    expect(erros).not.toHaveBeenCalled();
  });
});

describe('variant', () => {
  it('regular e o padrao quando o atributo esta ausente', async () => {
    const semAtributo = await montar({ name: 'star', size: 'sm' });
    const explicito = await montar({ name: 'star', variant: 'regular', size: 'sm' });
    expect(caminhoDe(semAtributo)).toBe(caminhoDe(explicito));
    expect(erros).not.toHaveBeenCalled();
  });

  it('star aceita solid, com arte diferente da regular', async () => {
    const regular = await montar({ name: 'star', variant: 'regular', size: 'sm' });
    const solid = await montar({ name: 'star', variant: 'solid', size: 'sm' });
    expect(svgDe(solid)).not.toBeNull();
    expect(caminhoDe(solid)).not.toBe(caminhoDe(regular));
    expect(erros).not.toHaveBeenCalled();
  });

  it('solid em qualquer outro nome nao renderiza e reclama', async () => {
    for (const nome of ['check', 'bars', 'circle-check']) {
      const icone = await montar({ name: nome, variant: 'solid', size: 'sm' });
      expect(svgDe(icone), nome).toBeNull();
    }
    expect(erros).toHaveBeenCalledTimes(3);
  });

  it('familia proibida nao renderiza', async () => {
    for (const familia of ['light', 'thin', 'sharp', 'duotone']) {
      const icone = await montar({ name: 'check', variant: familia, size: 'sm' });
      expect(svgDe(icone), familia).toBeNull();
    }
    expect(erros).toHaveBeenCalledTimes(4);
  });
});

describe('size', () => {
  it('cada tamanho vem do token semantico correspondente', async () => {
    const esperado: Record<string, string> = { sm: '16px', md: '20px', lg: '24px' };
    for (const [tamanho, medida] of Object.entries(esperado)) {
      const icone = await montar({ name: 'gear', size: tamanho });
      const estilo = getComputedStyle(icone);
      expect(estilo.inlineSize, tamanho).toBe(medida);
      expect(estilo.blockSize, tamanho).toBe(medida);
    }
    expect(erros).not.toHaveBeenCalled();
  });

  it('e obrigatorio: sem size nao ha icone nem caixa', async () => {
    const icone = await montar({ name: 'gear' });
    expect(svgDe(icone)).toBeNull();
    expect(getComputedStyle(icone).display).toBe('none');
    expect(erros).toHaveBeenCalledTimes(1);
  });

  it('valor livre nao renderiza', async () => {
    for (const tamanho of ['xl', '16', '16px', '']) {
      const icone = await montar({ name: 'gear', size: tamanho });
      expect(svgDe(icone), tamanho).toBeNull();
    }
    expect(erros).toHaveBeenCalledTimes(4);
  });
});

describe('entrada invalida', () => {
  it('name fora do nucleo nao renderiza e reclama', async () => {
    for (const nome of ['rocket', 'Star', 'fa-star', 'times', '']) {
      const icone = await montar({ name: nome, size: 'sm' });
      expect(svgDe(icone), nome).toBeNull();
      expect(getComputedStyle(icone).display, nome).toBe('none');
    }
    expect(erros).toHaveBeenCalledTimes(5);
  });

  it('name ausente nao renderiza e reclama', async () => {
    const icone = await montar({ size: 'sm' });
    expect(svgDe(icone)).toBeNull();
    expect(erros).toHaveBeenCalledTimes(1);
  });

  it('acumula um erro por propriedade invalida', async () => {
    await montar({ name: 'rocket', variant: 'thin', size: 'xl' });
    expect(erros).toHaveBeenCalledTimes(3);
  });

  it('nao deixa fallback visual: nada dentro do shadow root', async () => {
    const icone = await montar({ name: 'rocket', size: 'sm' });
    expect(icone.shadowRoot?.querySelector('*') ?? null).toBeNull();
  });
});

describe('acessibilidade', () => {
  it('sem label o icone e decorativo', async () => {
    const icone = await montar({ name: 'check', size: 'sm' });
    expect(icone.getAttribute('aria-hidden')).toBe('true');
    expect(icone.hasAttribute('role')).toBe(false);
    expect(icone.hasAttribute('aria-label')).toBe(false);
  });

  it('label vazio ou so com espacos e decorativo', async () => {
    for (const rotulo of ['', ' ', '   \t ']) {
      const icone = await montar({ name: 'check', size: 'sm', label: rotulo });
      expect(icone.getAttribute('aria-hidden'), JSON.stringify(rotulo)).toBe('true');
      expect(icone.hasAttribute('role'), JSON.stringify(rotulo)).toBe(false);
    }
  });

  it('label com conteudo nomeia o icone', async () => {
    const icone = await montar({ name: 'magnifying-glass', size: 'sm', label: 'Buscar' });
    expect(icone.getAttribute('role')).toBe('img');
    expect(icone.getAttribute('aria-label')).toBe('Buscar');
    expect(icone.hasAttribute('aria-hidden')).toBe(false);
  });

  it('label e aparado antes de virar nome acessivel', async () => {
    const icone = await montar({ name: 'magnifying-glass', size: 'sm', label: '  Buscar  ' });
    expect(icone.getAttribute('aria-label')).toBe('Buscar');
  });

  it('entrada invalida fica fora da arvore de acessibilidade', async () => {
    const icone = await montar({ name: 'rocket', size: 'sm', label: 'Buscar' });
    expect(icone.getAttribute('aria-hidden')).toBe('true');
    expect(icone.hasAttribute('role')).toBe(false);
  });

  it('o svg interno nunca e anunciado nem focalizavel', async () => {
    const icone = await montar({ name: 'check', size: 'sm', label: 'Concluido' });
    const svg = svgDe(icone);
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });

  it('o label troca de decorativo para nomeado sem recriar o elemento', async () => {
    const icone = await montar({ name: 'check', size: 'sm' });
    expect(icone.getAttribute('aria-hidden')).toBe('true');
    icone.label = 'Concluido';
    await icone.updateComplete;
    expect(icone.getAttribute('role')).toBe('img');
    expect(icone.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('ausencia de interacao', () => {
  it('nao recebe foco', async () => {
    const icone = await montar({ name: 'check', size: 'sm', label: 'Concluido' });
    expect(icone.hasAttribute('tabindex')).toBe(false);
    icone.focus();
    expect(document.activeElement).not.toBe(icone);
  });

  it('nao expoe slot', async () => {
    const icone = await montar({ name: 'check', size: 'sm' });
    expect(icone.shadowRoot?.querySelector('slot')).toBeNull();
  });

  it('nao intercepta nem inventa evento: o clique chega ao controle em volta', async () => {
    const controle = document.createElement('button');
    document.body.append(controle);

    const icone = document.createElement('nph-icon');
    icone.setAttribute('name', 'trash-can');
    icone.setAttribute('size', 'sm');
    controle.append(icone);
    await icone.updateComplete;

    const noControle: string[] = [];
    controle.addEventListener('click', (evento) => noControle.push(evento.type));

    const noIcone: string[] = [];
    for (const tipo of ['change', 'input', 'select', 'toggle', 'nph-icon-click']) {
      icone.addEventListener(tipo, () => noIcone.push(tipo));
    }

    const svg = icone.shadowRoot?.querySelector('svg');
    svg?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(noControle).toEqual(['click']);
    expect(noIcone).toEqual([]);
  });
});

describe('cor e caixa', () => {
  it('o desenho herda currentColor do contexto', async () => {
    const contexto = document.createElement('div');
    contexto.style.color = 'rgb(255, 0, 0)';
    document.body.append(contexto);

    const icone = document.createElement('nph-icon');
    icone.setAttribute('name', 'circle-check');
    icone.setAttribute('size', 'md');
    contexto.append(icone);
    await icone.updateComplete;

    const caminho = icone.shadowRoot?.querySelector('path');
    expect(caminho).not.toBeNull();
    expect(getComputedStyle(caminho as SVGPathElement).fill).toBe('rgb(255, 0, 0)');
  });

  it('a API reativa e exatamente name, variant, size e label', () => {
    const propriedades = [...NphIcon.elementProperties.keys()].map(String).sort();
    expect(propriedades).toEqual(['label', 'name', 'size', 'variant']);
  });

  it('a cor sai de currentColor, nao de propriedade', async () => {
    const icone = await montar({ name: 'check', size: 'sm' });
    expect(svgDe(icone)?.getAttribute('fill')).toBe('currentColor');
  });

  it('eye transborda a caixa quadrada, centralizado e sem reescala', async () => {
    const icone = await montar({ name: 'eye', size: 'sm' });
    const caixa = icone.getBoundingClientRect();
    const desenho = (svgDe(icone) as SVGSVGElement).getBoundingClientRect();

    expect(Math.round(caixa.width)).toBe(16);
    expect(Math.round(caixa.height)).toBe(16);
    /* 576x512 escalado por altura 16 da 18 de largura. */
    expect(Math.round(desenho.width)).toBe(18);
    expect(Math.round(desenho.height)).toBe(16);
    /* Transbordo simetrico: 1px de cada lado. */
    expect(Math.round(caixa.left - desenho.left)).toBe(1);
    expect(Math.round(desenho.right - caixa.right)).toBe(1);
  });

  it('icone de largura natural igual a altura nao transborda', async () => {
    const icone = await montar({ name: 'circle-check', size: 'lg' });
    const caixa = icone.getBoundingClientRect();
    const desenho = (svgDe(icone) as SVGSVGElement).getBoundingClientRect();
    expect(Math.round(caixa.width)).toBe(24);
    expect(Math.round(desenho.width)).toBe(24);
  });
});
