import { lerpHSV, lerpRGB, lerpHSL } from './color-utils';
import * as Color from 'color';

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
