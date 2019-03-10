import * as Color from 'color';
import { ColorType, isColorHSL, isColorHSV, isColorRGB, ColorHSL, ColorHSV, ColorRGB } from '../color-types';
import { Ref } from '../ref';

export enum ColorMode {
  STRING,
  NUMBER,
  RGBA_OBJECT,
  HSLA_OBJECT,
  HSVA_OBJECT
}

export function getMode(value: ColorType): ColorMode {
  if (typeof value === 'string') {
    return ColorMode.STRING;
  }
  if (typeof value === 'number') {
    return ColorMode.NUMBER;
  }
  if (isColorHSL(value)) {
    return ColorMode.HSLA_OBJECT;
  }
  if (isColorHSV(value)) {
    return ColorMode.HSVA_OBJECT;
  }
  return ColorMode.RGBA_OBJECT;
}

export function convertToColorType(col: Color, mode: ColorMode): ColorType {
  switch (mode) {
    case ColorMode.RGBA_OBJECT: {
      const { alpha, ...rgb } = col.rgb().object();
      const colRGB = { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 };
      if (alpha !== undefined) {
        return { ...colRGB, a: alpha };
      }
      return colRGB;
    }
    case ColorMode.HSLA_OBJECT: {
      const { alpha, ...hsl } = col.hsl().object();
      const colHSL = { h: hsl.h, s: hsl.s / 100, l: hsl.l / 100 };
      if (alpha !== undefined) {
        return { ...colHSL, a: alpha };
      }
      return colHSL;
    }
    case ColorMode.HSVA_OBJECT: {
      const { alpha, ...hsv } = col.hsv().object();
      const colHSV = { h: hsv.h, s: hsv.s / 100, v: hsv.v / 100 };
      if (alpha !== undefined) {
        return { ...colHSV, a: alpha };
      }
      return colHSV;
    }
    case ColorMode.NUMBER:
      return col.rgbNumber();
    case ColorMode.STRING:
      return col.string();
  }
}

export function getColor(col: ColorType): Color {
  if (typeof col === 'string' || typeof col === 'number') {
    return new Color(col).rgb();
  }
  const { a } = col;

  if (isColorRGB(col)) {
    col = { r: col.r * 255, g: col.g * 255, b: col.b * 255 };
  }
  if (isColorHSL(col)) {
    col = { h: col.h, s: col.s * 100, l: col.l * 100 };
  }
  if (isColorHSV(col)) {
    col = { h: col.h, s: col.s * 100, v: col.v * 100 };
  }

  const color = new Color(col).rgb();
  if (a === undefined) {
    return color;
  }
  return color.fade(1 - a);
}

export function lerpRGB(from: Color, to: Color, t: number) {
  const { r: fromR, g: fromG, b: fromB, alpha: fromAlpha } = from.rgb().object();
  const { r: toR, g: toG, b: toB, alpha: toAlpha } = to.rgb().object();

  const color = new Color({
    r: (toR - fromR) * t + fromR,
    g: (toG - fromG) * t + fromG,
    b: (toB - fromB) * t + fromB
  });
  return colorWithLerpedAlpha(color, fromAlpha, toAlpha, t);
}

export function lerpHSV(from: Color, to: Color, t: number) {
  const { h: fromH, s: fromS, v: fromV, alpha: fromAlpha } = from.hsv().object();
  const { h: toH, s: toS, v: toV, alpha: toAlpha } = to.hsv().object();

  const color = new Color({
    h: lerpHue(fromH, toH, t),
    s: (toS - fromS) * t + fromS,
    v: (toV - fromV) * t + fromV
  });
  return colorWithLerpedAlpha(color, fromAlpha, toAlpha, t);
}

export function lerpHSL(from: Color, to: Color, t: number) {
  const { h: fromH, s: fromS, l: fromL, alpha: fromAlpha } = from.hsl().object();
  const { h: toH, s: toS, l: toL, alpha: toAlpha } = to.hsl().object();

  const color = new Color({
    h: lerpHue(fromH, toH, t),
    s: (toS - fromS) * t + fromS,
    l: (toL - fromL) * t + fromL
  });
  return colorWithLerpedAlpha(color, fromAlpha, toAlpha, t);
}

export function getColorRef<U extends ColorType>(ref: Ref<U> | ColorRGB | ColorHSV | ColorHSL) {
  if (isColorRGB(ref)) {
    return new Ref<ColorRGB>(
      () => ({ ...ref }),
      val => {
        ref.r = val.r;
        ref.b = val.b;
        ref.g = val.g;
        if (val.a !== undefined) {
          ref.a = val.a;
        }
      }
    );
  }
  if (isColorHSV(ref)) {
    return new Ref<ColorHSV>(
      () => ({ ...ref }),
      val => {
        ref.h = val.h;
        ref.s = val.s;
        ref.v = val.v;
        if (val.a !== undefined) {
          ref.a = val.a;
        }
      }
    );
  }
  if (isColorHSL(ref)) {
    return new Ref<ColorHSL>(
      () => ({ ...ref }),
      val => {
        ref.h = val.h;
        ref.s = val.s;
        ref.l = val.l;
        if (val.a !== undefined) {
          ref.a = val.a;
        }
      }
    );
  }

  return ref;
}

function lerpHue(fromH: number, toH: number, t: number) {
  const diff = Math.abs(toH - fromH);

  let newH = ((toH - fromH) * t + fromH) % 360;
  if (diff > 180) {
    const newFromH = fromH < toH ? fromH + 360 : fromH;
    const newToH = fromH > toH ? toH + 360 : toH;

    newH = ((newToH - newFromH) * t + newFromH) % 360;
  }
  return newH;
}

function colorWithLerpedAlpha(color: Color, fromAlpha: number | undefined, toAlpha: number | undefined, t: number) {
  if (fromAlpha === undefined && toAlpha === undefined) {
    return color;
  }
  const newFromAlpha = fromAlpha === undefined ? 1 : fromAlpha;
  const newToAlpha = toAlpha === undefined ? 1 : toAlpha;

  const alpha = (newToAlpha - newFromAlpha) * t + newFromAlpha;
  return color.fade(1 - alpha);
}
