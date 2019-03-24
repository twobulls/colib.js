import {
  lerpHSV,
  lerpRGB,
  lerpHSL,
  getColorFormat,
  ColorFormat,
  getColor,
  convertToColorFormat,
  getColorRef
} from './color-utils';
import * as Color from 'color';
import { Ref } from '../ref';

describe('lerpHSV', () => {
  it('will lerp hue over the shortest path', () => {
    const result = lerpHSV(new Color({ h: 180, s: 25, v: 25 }), new Color({ h: 160, s: 50, v: 50 }), 0.5).object();
    expect(result).toEqual({ h: 170, s: 37.5, v: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360', () => {
    const result = lerpHSV(new Color({ h: 350, s: 25, v: 25 }), new Color({ h: 20, s: 50, v: 50 }), 0.5).object();
    expect(result).toEqual({ h: 5, s: 37.5, v: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360, when from is to than from', () => {
    const result = lerpHSV(new Color({ h: 20, s: 25, v: 25 }), new Color({ h: 350, s: 50, v: 50 }), 0.5).object();
    expect(result).toEqual({ h: 5, s: 37.5, v: 37.5 });
  });
  it('will lerp with an alpha value', () => {
    const result = lerpHSV(
      new Color({ h: 350, s: 25, v: 25 }).fade(0.8),
      new Color({ h: 20, s: 50, v: 50 }).fade(0.2),
      0.5
    ).object();
    expect(result).toEqual({ h: 5, s: 37.5, v: 37.5, alpha: 0.5 });
  });
});

describe('lerpHSL', () => {
  it('will lerp hue over the shortest path', () => {
    const result = lerpHSL(new Color({ h: 180, s: 25, l: 25 }), new Color({ h: 160, s: 50, l: 50 }), 0.5).object();
    expect(result).toEqual({ h: 170, s: 37.5, l: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360', () => {
    const result = lerpHSL(new Color({ h: 350, s: 25, l: 25 }), new Color({ h: 20, s: 50, l: 50 }), 0.5).object();
    expect(result).toEqual({ h: 5, s: 37.5, l: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360, when from is to than from', () => {
    const result = lerpHSL(new Color({ h: 20, s: 25, l: 25 }), new Color({ h: 350, s: 50, l: 50 }), 0.5).object();
    expect(result).toEqual({ h: 5, s: 37.5, l: 37.5 });
  });

  it('will lerp with an alpha value', () => {
    const result = lerpHSL(
      new Color({ h: 350, s: 25, l: 25 }).fade(0.8),
      new Color({ h: 20, s: 50, l: 50 }).fade(0.2),
      0.5
    ).object();
    expect(result).toEqual({ h: 5, s: 37.5, l: 37.5, alpha: 0.5 });
  });
});

describe('lerpRGB', () => {
  it('will lerp hue over the shortest path', () => {
    const result = lerpRGB(new Color({ r: 255, g: 0, b: 255 }), new Color({ r: 0, g: 125, b: 0 }), 0.5).object();
    expect(result).toEqual({ r: 127.5, g: 62.5, b: 127.5 });
  });
  it('will lerp with an alpha value', () => {
    const result = lerpRGB(
      new Color({ r: 255, g: 0, b: 255 }).fade(0.8),
      new Color({ r: 0, g: 125, b: 0 }).fade(0.2),
      0.5
    ).object();
    expect(result).toEqual({ r: 127.5, g: 62.5, b: 127.5, alpha: 0.5 });
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

describe('getColor', () => {
  it('converts from string to Color object', () => {
    const conversion = getColor('rgb(255,0,255)');
    expect(conversion.array()).toEqual([255, 0, 255]);
  });
  it('converts from number to Color object', () => {
    const conversion = getColor(0xff00ff);
    expect(conversion.array()).toEqual([255, 0, 255]);
  });
  it('converts from ColorRGB to Color object', () => {
    const conversion = getColor({ r: 1, g: 0, b: 1 });
    expect(conversion.array()).toEqual([255, 0, 255]);
  });
  it('converts from ColorHSV to Color object', () => {
    const conversion = getColor({ h: 300, s: 1, v: 1 });
    expect(conversion.array()).toEqual([255, 0, 255]);
  });
  it('converts from ColorHSL to Color object', () => {
    const conversion = getColor({ h: 300, s: 1, l: 0.5 });
    const [r, g, b] = conversion.array();
    expect(r).toBeCloseTo(255);
    expect(g).toBeCloseTo(0);
    expect(b).toBeCloseTo(255);
  });

  it('converts from ColorRGB to Color object with alpha', () => {
    const conversion = getColor({ r: 1, g: 0, b: 1, a: 0.25 });
    expect(conversion.array()).toEqual([255, 0, 255, 0.25]);
  });
});

describe('convertToColorFormat', () => {
  it('converts to ColorRGB objects', () => {
    const color = convertToColorFormat(new Color(0xff00ff), ColorFormat.RGBA_OBJECT);
    expect(color).toEqual({ r: 1, g: 0, b: 1 });
  });
  it('converts to ColorHSV objects', () => {
    const color = convertToColorFormat(new Color(0xff00ff), ColorFormat.HSVA_OBJECT);
    expect(color).toEqual({ h: 300, s: 1, v: 1 });
  });
  it('converts to ColorHSL objects', () => {
    const color = convertToColorFormat(new Color(0xff00ff), ColorFormat.HSLA_OBJECT);
    expect(color).toEqual({ h: 300, s: 1, l: 0.5 });
  });
  it('converts to ColorRGB objects with alpha', () => {
    const color = convertToColorFormat(new Color(0xff00ff).fade(0.5), ColorFormat.RGBA_OBJECT);
    expect(color).toEqual({ r: 1, g: 0, b: 1, a: 0.5 });
  });
  it('converts to ColorHSV objects with alpha', () => {
    const color = convertToColorFormat(new Color(0xff00ff).fade(0.5), ColorFormat.HSVA_OBJECT);
    expect(color).toEqual({ h: 300, s: 1, v: 1, a: 0.5 });
  });
  it('converts to ColorHSL objects with alpha', () => {
    const color = convertToColorFormat(new Color(0xff00ff).fade(0.5), ColorFormat.HSLA_OBJECT);
    expect(color).toEqual({ h: 300, s: 1, l: 0.5, a: 0.5 });
  });
  it('converts to hex strings', () => {
    const color = convertToColorFormat(new Color(0xff00ff), ColorFormat.HEX_STRING);
    expect(color).toEqual('#FF00FF');
  });
  it('converts to strings', () => {
    const color = convertToColorFormat(new Color(0xff00ff), ColorFormat.STRING);
    expect(color).toEqual('rgb(255, 0, 255)');
  });

  it('converts to numbers', () => {
    const color = convertToColorFormat(new Color(0xff00ff), ColorFormat.NUMBER);
    expect(color).toEqual(0xff00ff);
  });
});

describe('getColorRef', () => {
  it('it returns a regular reference unmodified', () => {
    const ref = Ref.create(0xff00ff);
    expect(getColorRef(ref)).toBe(ref);
  });
  it('it converts a ColorRGB object to a ref', () => {
    const col = { r: 1, g: 0, b: 1 };
    const ref = getColorRef(col);
    ref.value = { r: 0.5, g: 0.5, b: 0.5 };
    expect(col).toEqual({ r: 0.5, g: 0.5, b: 0.5 });
  });
  it('it converts a ColorRGB object to a ref, with alpha', () => {
    const col = { r: 1, g: 0, b: 1 };
    const ref = getColorRef(col);
    ref.value = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
    expect(col).toEqual({ r: 0.5, g: 0.5, b: 0.5, a: 1 });
  });
  it('it converts a ColorHSV object to a ref, with alpha', () => {
    const col = { h: 180, s: 0.5, v: 1 };
    const ref = getColorRef(col);
    ref.value = { h: 270, s: 0.75, v: 0.5, a: 1 };
    expect(col).toEqual({ h: 270, s: 0.75, v: 0.5, a: 1 });
  });
  it('it converts a ColorHSL object to a ref, with alpha', () => {
    const col = { h: 180, s: 0.5, l: 1 };
    const ref = getColorRef(col);
    ref.value = { h: 270, s: 0.75, l: 0.5, a: 1 };
    expect(col).toEqual({ h: 270, s: 0.75, l: 0.5, a: 1 });
  });
});
