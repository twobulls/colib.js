import { lerpHSV, lerpRGB, lerpHSL, getColorRef } from './color-utils';
import { Ref } from '../ref';

describe('lerpHSV', () => {
  it('will lerp hue over the shortest path', () => {
    const result = lerpHSV({ h: 180, s: 25, v: 25 }, { h: 160, s: 50, v: 50 }, 0.5);
    expect(result).toEqual({ h: 170, s: 37.5, v: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360', () => {
    const result = lerpHSV({ h: 350, s: 25, v: 25 }, { h: 20, s: 50, v: 50 }, 0.5);
    expect(result).toEqual({ h: 5, s: 37.5, v: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360, when from is to than from', () => {
    const result = lerpHSV({ h: 20, s: 25, v: 25 }, { h: 350, s: 50, v: 50 }, 0.5);
    expect(result).toEqual({ h: 5, s: 37.5, v: 37.5 });
  });
  it('will lerp with an alpha value', () => {
    const result = lerpHSV({ h: 350, s: 25, v: 25, a: 0.8 }, { h: 20, s: 50, v: 50, a: 0.2 }, 0.5);
    expect(result).toEqual({ h: 5, s: 37.5, v: 37.5, a: 0.5 });
  });
});

describe('lerpHSL', () => {
  it('will lerp hue over the shortest path', () => {
    const result = lerpHSL({ h: 180, s: 25, l: 25 }, { h: 160, s: 50, l: 50 }, 0.5);
    expect(result).toEqual({ h: 170, s: 37.5, l: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360', () => {
    const result = lerpHSL({ h: 350, s: 25, l: 25 }, { h: 20, s: 50, l: 50 }, 0.5);
    expect(result).toEqual({ h: 5, s: 37.5, l: 37.5 });
  });
  it('will lerp hue over the shortest path by wrapping around 360, when from is to than from', () => {
    const result = lerpHSL({ h: 20, s: 25, l: 25 }, { h: 350, s: 50, l: 50 }, 0.5);
    expect(result).toEqual({ h: 5, s: 37.5, l: 37.5 });
  });

  it('will lerp with an alpha value', () => {
    const result = lerpHSL({ h: 350, s: 25, l: 25, a: 0.8 }, { h: 20, s: 50, l: 50, a: 0.2 }, 0.5);
    expect(result).toEqual({ h: 5, s: 37.5, l: 37.5, a: 0.5 });
  });
});

describe('lerpRGB', () => {
  it('will lerp hue over the shortest path', () => {
    const result = lerpRGB({ r: 255, g: 0, b: 255 }, { r: 0, g: 125, b: 0 }, 0.5);
    expect(result).toEqual({ r: 127.5, g: 62.5, b: 127.5 });
  });
  it('will lerp with an alpha value', () => {
    const result = lerpRGB({ r: 255, g: 0, b: 255, a: 0.8 }, { r: 0, g: 125, b: 0, a: 0.2 }, 0.5);
    expect(result).toEqual({ r: 127.5, g: 62.5, b: 127.5, a: 0.5 });
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
