import { convertColor, getColorFormat } from './convert';
import { ColorHSL, ColorFormat } from './color-types';

describe('convertColor', () => {
  it('can convert objects to themselves', () => {
    const pairs = [
      { color: '#bc8f8f', format: ColorFormat.HEX_STRING },
      { color: 0xbc8f8f, format: ColorFormat.NUMBER },
      { color: 'rgb(100,255,255,0)', format: ColorFormat.STRING },
      { color: 'hsl(100,50%,50%,0)', format: ColorFormat.STRING },
      { color: { r: 10, g: 255, b: 10, a: 1 }, format: ColorFormat.RGBA_OBJECT },
      { color: { h: 10, s: 1, v: 1, a: 1 }, format: ColorFormat.HSVA_OBJECT },
      { color: { h: 10, s: 1, l: 0.5, a: 1 }, format: ColorFormat.HSLA_OBJECT }
    ];
    for (const { color, format } of pairs) {
      expect(convertColor(color, format)).toEqual(color);
    }
  });

  it('can convert to hsl colors', () => {
    const pairs = [
      { input: '#91bc8f', output: { h: 117.333, s: 0.251, l: 0.649 } },
      { input: '#aaaaaa', output: { h: 0, s: 0, l: 0.666 } },
      { input: 'sandybrown', output: { h: 27.567, s: 0.871, l: 0.667 } },
      { input: 0x4682b4, output: { h: 207.272, s: 0.44, l: 0.49 } },
      { input: 'rgb(100,255,255,0)', output: { h: 180, s: 1, l: 0.696 } },
      { input: 'hsl(207,61%,22%,0)', output: { h: 207, s: 0.61, l: 0.22 } }
    ];
    for (const { input, output } of pairs) {
      const result = convertColor(input, ColorFormat.HSLA_OBJECT) as ColorHSL;
      expect(result.h).toBeCloseTo(output.h);
      expect(result.s).toBeCloseTo(output.s);
      expect(result.l).toBeCloseTo(output.l);
    }
  });
});

describe('getColorFormat', () => {
  it('detects hex strings', () => {
    expect(getColorFormat('#FF00FF')).toEqual(ColorFormat.HEX_STRING);
  });
  it('detects regular strings', () => {
    expect(getColorFormat('rbg(0, 255, 0)')).toEqual(ColorFormat.STRING);
  });
  it('detects numbers', () => {
    expect(getColorFormat(0xff00ff)).toEqual(ColorFormat.NUMBER);
  });
  it('detects HSV values', () => {
    expect(getColorFormat({ h: 170, s: 1, v: 1 })).toEqual(ColorFormat.HSVA_OBJECT);
  });
  it('detects HSL values', () => {
    expect(getColorFormat({ h: 170, s: 1, l: 1 })).toEqual(ColorFormat.HSLA_OBJECT);
  });
  it('detects RGB values', () => {
    expect(getColorFormat({ r: 1, g: 1, b: 1 })).toEqual(ColorFormat.RGBA_OBJECT);
  });
});
