import { Ref } from '../ref';
import { Ease } from '../ease';
import { Command, sequence, duration } from './common';
import * as Color from 'color';
import { ColorRGB, ColorHSL, ColorHSV, ColorType, isColorHSV, isColorHSL, isColorRGB } from '../color-types';

enum ColorMode {
  STRING,
  NUMBER,
  RGBA_OBJECT,
  HSLA_OBJECT,
  HSVA_OBJECT
}

/**
 * Changes a color to a target color over time.
 * @param ref A reference to the color to change.
 * @param target The target color
 * @param commandDuration The duration of the command
 * @param ease The ease to apply.
 */
export function changeToColor<U extends ColorType>(
  ref: Ref<U> | ColorRGB | ColorHSL | ColorHSV,
  target: ColorType,
  commandDuration: number,
  ease?: Ease
): Command {
  let start: Color = Color.rgb(0, 0, 0);
  const newRef = getColorRef(ref);

  const mode = getMode(newRef.value);
  const end = getColor(target);

  return sequence(
    () => {
      start = getColor(newRef.value);
    },
    duration(
      t => {
        const mixed = lerpRGB(start, end, t);
        const value = convertToColorType(mixed, mode) as U;
        newRef.value = value;
      },
      commandDuration,
      ease
    )
  );
}

/**
 * Changes a color, from an offset, to a current value, over time.
 * @param ref A reference to the color to change.
 * @param target The color to start from.
 * @param commandDuration The duration of the command
 * @param ease The ease to apply.
 */
export function changeFromColor<U extends ColorType>(
  ref: Ref<U> | ColorRGB | ColorHSL | ColorHSV,
  target: ColorType,
  commandDuration: number,
  ease?: Ease
): Command {
  let end: Color = Color.rgb(0, 0, 0);
  const newRef = getColorRef(ref);

  const mode = getMode(newRef.value);
  const start = getColor(target);

  return sequence(
    () => {
      end = getColor(newRef.value);
    },
    duration(
      t => {
        const mixed = lerpRGB(start, end, t);
        const value = convertToColorType(mixed, mode) as U;
        newRef.value = value;
      },
      commandDuration,
      ease
    )
  );
}

function getMode(value: ColorType): ColorMode {
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

function convertToColorType(col: Color, mode: ColorMode): ColorType {
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

function getColor(col: ColorType): Color {
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

function lerpRGB(from: Color, to: Color, t: number) {
  const { r: fromR, g: fromG, b: fromB, alpha: fromAlpha } = from.rgb().object();
  const { r: toR, g: toG, b: toB, alpha: toAlpha } = to.rgb().object();

  const color = new Color({
    r: (toR - fromR) * t + fromR,
    g: (toG - fromG) * t + fromG,
    b: (toB - fromB) * t + fromB
  });
  if (fromAlpha === undefined && toAlpha === undefined) {
    return color;
  }
  const newFromAlpha = fromAlpha === undefined ? 1 : fromAlpha;
  const newToAlpha = toAlpha === undefined ? 1 : toAlpha;

  const alpha = (newToAlpha - newFromAlpha) * t + newFromAlpha;
  return color.fade(1 - alpha);
}

function getColorRef<U extends ColorType>(ref: Ref<U> | ColorRGB | ColorHSV | ColorHSL) {
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
