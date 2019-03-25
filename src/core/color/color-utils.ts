import {
  ColorType,
  isColorHSL,
  isColorHSV,
  isColorRGB,
  ColorHSL,
  ColorHSV,
  ColorRGB,
  ColorFormat
} from './color-types';
import { Ref } from '../ref';
import { convertColor } from './convert';

export function lerpRGB(from: ColorType, to: ColorType, t: number) {
  let newFrom: ColorRGB;
  if (!isColorRGB(from)) {
    newFrom = convertColor(from, ColorFormat.RGBA_OBJECT) as ColorRGB;
  } else {
    newFrom = from;
  }
  let newTo: ColorRGB;
  if (!isColorRGB(to)) {
    newTo = convertColor(to, ColorFormat.RGBA_OBJECT) as ColorRGB;
  } else {
    newTo = to;
  }

  const color = {
    r: (newTo.r - newFrom.r) * t + newFrom.r,
    g: (newTo.g - newFrom.g) * t + newFrom.g,
    b: (newTo.b - newFrom.b) * t + newFrom.b
  };

  return colorWithLerpedAlpha(color, newFrom.a, newTo.a, t);
}

export function lerpHSV(from: ColorType, to: ColorType, t: number): ColorHSV {
  let newFrom: ColorHSV;
  if (!isColorHSV(from)) {
    newFrom = convertColor(from, ColorFormat.HSVA_OBJECT) as ColorHSV;
  } else {
    newFrom = from;
  }
  let newTo: ColorHSV;
  if (!isColorHSV(to)) {
    newTo = convertColor(to, ColorFormat.HSVA_OBJECT) as ColorHSV;
  } else {
    newTo = to;
  }

  const color = {
    h: lerpHue(newFrom.h, newTo.h, t),
    s: (newTo.s - newFrom.s) * t + newFrom.s,
    v: (newTo.v - newFrom.v) * t + newFrom.v
  };
  return colorWithLerpedAlpha(color, newFrom.a, newTo.a, t);
}

export function lerpHSL(from: ColorType, to: ColorType, t: number): ColorHSL {
  let newFrom: ColorHSL;
  if (!isColorHSL(from)) {
    newFrom = convertColor(from, ColorFormat.HSLA_OBJECT) as ColorHSL;
  } else {
    newFrom = from;
  }
  let newTo: ColorHSL;
  if (!isColorHSL(to)) {
    newTo = convertColor(to, ColorFormat.HSLA_OBJECT) as ColorHSL;
  } else {
    newTo = to;
  }

  const color = {
    h: lerpHue(newFrom.h, newTo.h, t),
    s: (newTo.s - newFrom.s) * t + newFrom.s,
    l: (newTo.l - newFrom.l) * t + newFrom.l
  };
  return colorWithLerpedAlpha(color, newFrom.a, newTo.a, t);
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

function colorWithLerpedAlpha<T>(color: T, fromAlpha: number | undefined, toAlpha: number | undefined, t: number) {
  if (fromAlpha === undefined && toAlpha === undefined) {
    return color;
  }
  const newFromAlpha = fromAlpha === undefined ? 1 : fromAlpha;
  const newToAlpha = toAlpha === undefined ? 1 : toAlpha;

  const a = (newToAlpha - newFromAlpha) * t + newFromAlpha;
  return { ...color, a };
}
