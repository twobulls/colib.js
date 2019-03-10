import { Ref } from 'core/ref';
import { Ease } from 'core/ease';
import { Command, sequence, duration } from './common';
import * as Color from 'color';

/**
 * Represents a RGB color with optional alpha. Values range from [0 -> 1]
 */
export interface ColorRGB {
  r: number;
  b: number;
  g: number;
  a?: number;
}

/**
 * Represents a HSL color with optional alpha.
 */
export interface ColorHSL {
  h: number /** Ranges from  0->360 degrees*/;
  s: number /** Ranges from 0->1 */;
  l: number /** Ranges from 0->1 */;
  a?: number /** Ranges from 0->1 */;
}

/**
 * Represents an HSV color with optional alpha.
 * @property h ranger
 */
export interface ColorHSV {
  h: number /** Ranges from  0->360 degrees*/;
  s: number /** Ranges from 0->1 */;
  v: number /** Ranges from 0->1 */;
  a?: number /** Ranges from 0->1 */;
}

export type ColorType = string | number | ColorRGB | ColorHSL | ColorHSV;

enum ColorMode {
  STRING,
  NUMBER,
  RGBA_OBJECT,
  HSLA_OBJECT,
  HSVA_OBJECT
}

/**
 * Type guard for determining whether a color is a ColorRGB object.
 * @param value The value to test.
 */
export function isColorRGB(value: ColorType): value is ColorRGB {
  if (typeof value !== 'object') {
    return false;
  }
  return (<ColorRGB>value).r !== undefined;
}

/**
 * Type guard for determining whether a color is a ColorHSV object.
 * @param value The value to test.
 */
export function isColorHSV(value: ColorType): value is ColorHSV {
  if (typeof value !== 'object') {
    return false;
  }
  return (<ColorHSV>value).v !== undefined && (<ColorHSL>value).h !== undefined;
}

/**
 * Type guard for determining whether a color is a ColorHSL object.
 * @param value The value to test.
 */
export function isColorHSL(value: ColorType): value is ColorHSL {
  if (typeof value !== 'object') {
    return false;
  }
  return (<ColorHSL>value).l !== undefined && (<ColorHSL>value).h !== undefined;
}

/**
 * Changes a color to a target color over time.
 * @param ref A reference to the color to change.
 * @param target The target color
 * @param commandDuration The duration of the command
 * @param ease The ease to apply.
 */
export function changeToColor<U extends ColorType>(
  ref: Ref<U>,
  target: ColorType,
  commandDuration: number,
  ease?: Ease
): Command {
  let start: Color = Color.rgb(0, 0, 0);
  const mode = getMode(ref.value);
  const end = getColor(target);
  return sequence(
    () => {
      start = getColor(ref.value);
    },
    duration(
      t => {
        const mixed = lerpRGB(start, end, t);
        const value = convertToColorType(mixed, mode) as U;
        ref.value = value;
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
