import { convertColor, getColorFormat } from './convert';
import { ColorHSL, ColorFormat, ColorHSV, ColorRGB } from './color-types';

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
      { input: 'hsl(207,61%,22%,0)', output: { h: 207, s: 0.61, l: 0.22 } },
      { input: 'rgb(255,200,240,0)', output: { h: 316.363, s: 1, l: 0.892 } },
      { input: 'rgb(0,0,0)', output: { h: 0, s: 0, l: 0 } }
    ];
    for (const { input, output } of pairs) {
      const result = convertColor(input, ColorFormat.HSLA_OBJECT) as ColorHSL;
      expect(result.h).toBeCloseTo(output.h);
      expect(result.s).toBeCloseTo(output.s);
      expect(result.l).toBeCloseTo(output.l);
    }
  });

  it('can convert to hsv colors', () => {
    const pairs = [
      { input: '#91bc8f', output: { h: 117.333, s: 0.24, v: 0.74 } },
      { input: '#aaaaaa', output: { h: 0, s: 0, v: 0.666 } },
      { input: 'sandybrown', output: { h: 27.567, s: 0.606, v: 0.96 } },
      { input: 0x4682b4, output: { h: 207.272, s: 0.6111, v: 0.71 } },
      { input: 'rgb(100,255,255,0)', output: { h: 180, s: 0.607, v: 1 } },
      { input: 'rgb(255,200,240,0)', output: { h: 316.363, s: 0.2157, v: 1 } },
      { input: 'rgb(0,0,0)', output: { h: 0, s: 0, v: 0 } },
      { input: 'hsl(207,61%,22%,0)', output: { h: 207, s: 0.757, v: 0.35 } }
    ];
    for (const { input, output } of pairs) {
      const result = convertColor(input, ColorFormat.HSVA_OBJECT) as ColorHSV;
      expect(result.h).toBeCloseTo(output.h);
      expect(result.s).toBeCloseTo(output.s);
      expect(result.v).toBeCloseTo(output.v);
    }
  });
  it('can convert to rgb colors', () => {
    const pairs = [
      { input: '#91bc8f', output: { r: 145 / 255, g: 188 / 255, b: 143 / 255 } },
      { input: '#aaaaaa', output: { r: 170 / 255, g: 170 / 255, b: 170 / 255 } },
      { input: 'sandybrown', output: { r: 244 / 255, g: 164 / 255, b: 96 / 255 } },
      { input: 0x4682b4, output: { r: 70 / 255, g: 130 / 255, b: 180 / 255 } },
      { input: 'rgb(100,255,255,0)', output: { r: 100 / 255, g: 1, b: 1 } },
      { input: 'hsl(207,61%,22%,0)', output: { r: 22 / 255, g: 60 / 255, b: 90 / 255 } },
      { input: { h: 207, s: 0.8, v: 0.5 }, output: { r: 25 / 255, g: 81 / 255, b: 127 / 255 } },
      { input: { h: 138, s: 0.34, v: 0.35 }, output: { r: 58 / 255, g: 89 / 255, b: 68 / 255 } },
      { input: { h: 70, s: 0.69, v: 0.57 }, output: { r: 128 / 255, g: 145 / 255, b: 45 / 255 } },
      { input: { h: 11, s: 0.69, v: 0.57 }, output: { r: 145 / 255, g: 63 / 255, b: 45 / 255 } },
      { input: { h: 319, s: 0.69, v: 0.57 }, output: { r: 145 / 255, g: 45 / 255, b: 113 / 255 } },
      { input: { h: 271, s: 0.69, v: 0.57 }, output: { r: 96 / 255, g: 45 / 255, b: 145 / 255 } },
      { input: 'hsl(927,61%,22%,0)', output: { r: 22 / 255, g: 60 / 255, b: 90 / 255 } },
      { input: 'hsl(120,61%,22%,0)', output: { r: 22 / 255, g: 90 / 255, b: 23 / 255 } },
      { input: 'hsl(480,61%,22%,0)', output: { r: 22 / 255, g: 90 / 255, b: 23 / 255 } },
      { input: 'hsl(-240,61%,22%,0)', output: { r: 22 / 255, g: 90 / 255, b: 23 / 255 } },
      { input: 'hsl(250,61%,77%,0)', output: { r: 172 / 255, g: 161 / 255, b: 232 / 255 } },
      { input: 'hsl(250,0%,61%,0)', output: { r: 0.61, g: 0.61, b: 0.61 } }
    ];
    for (const { input, output } of pairs) {
      const result = convertColor(input, ColorFormat.RGBA_OBJECT) as ColorRGB;
      expect(result.r).toBeCloseTo(output.r);
      expect(result.g).toBeCloseTo(output.g);
      expect(result.b).toBeCloseTo(output.b);
    }
  });

  it('can convert objects to strings', () => {
    const pairs = [
      { input: { h: 207, s: 0.61, l: 0.22 }, output: 'hsl(207,61%,22%)' },
      { input: { h: 207, s: 0.61, l: 0.22, a: 0.5 }, output: 'hsla(207,61%,22%,0.5)' }
    ];
    for (const { input, output } of pairs) {
      const result = convertColor(input, ColorFormat.STRING) as string;
      expect(result).toEqual(output);
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
