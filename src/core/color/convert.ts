import { parseColor } from './parse';
import {
  ColorType,
  ColorRGB,
  isColorRGB,
  isColorHSL,
  ColorHSL,
  ColorHSV,
  isColorHSV,
  ColorFormat
} from './color-types';

/** @ignore */
export function getColorFormat(value: ColorType): ColorFormat {
  if (typeof value === 'string') {
    if (value.trimLeft().startsWith('#')) {
      return ColorFormat.HEX_STRING;
    }

    return ColorFormat.STRING;
  }
  if (typeof value === 'number') {
    return ColorFormat.NUMBER;
  }
  if (isColorHSL(value)) {
    return ColorFormat.HSLA_OBJECT;
  }
  if (isColorHSV(value)) {
    return ColorFormat.HSVA_OBJECT;
  }
  return ColorFormat.RGBA_OBJECT;
}

/** @ignore */
export function convertColor(col: ColorType, format: ColorFormat): ColorType | undefined {
  if (getColorFormat(col) === format) {
    return col;
  }
  const rgb = convertToRGB(col);
  if (rgb === undefined) {
    return undefined;
  }
  switch (format) {
    case ColorFormat.RGBA_OBJECT:
      return rgb;
    case ColorFormat.HSLA_OBJECT:
      return convertRGBToHSL(rgb);
    case ColorFormat.HSVA_OBJECT:
      return convertRGBToHSV(rgb);
    case ColorFormat.STRING:
      if (isColorHSL(col)) {
        if (col.a === undefined || col.a === 1) {
          return `hsl(${round3DecimalPlaces(col.h)},${round3DecimalPlaces(col.s * 100)}%,${col.l * 100}%)`;
        }
        return `hsla(${round3DecimalPlaces(col.h)},${round3DecimalPlaces(col.s * 100)}%,${col.l * 100}%,${col.a})`;
      }
      if (rgb.a === undefined || rgb.a === 1) {
        return `rgb(${round3DecimalPlaces(rgb.r * 255)},${round3DecimalPlaces(rgb.g * 255)},${round3DecimalPlaces(
          rgb.b * 255
        )})`;
      }
      return `rgba(${round3DecimalPlaces(rgb.r * 255)},${round3DecimalPlaces(rgb.g * 255)},${round3DecimalPlaces(
        rgb.b * 255
      )},${rgb.a})`;
    case ColorFormat.NUMBER:
      return convertToHexNumber(rgb);
    case ColorFormat.HEX_STRING:
      const hex = convertToHexNumber(rgb).toString(16);
      return `#${hex}`;
  }
}

function convertToRGB(color: ColorType): ColorRGB | undefined {
  if (typeof color === 'string' || typeof color === 'number') {
    const result = parseColor(color);
    if (result === undefined) {
      return undefined;
    }
    color = result.color;
  }

  if (isColorRGB(color)) {
    return color;
  }
  if (isColorHSL(color)) {
    return convertHSLToRGB(color);
  }
  return convertHSVToRGB(color);
}

function convertHSLToRGB(color: ColorHSL): ColorRGB {
  const h = remapZeroToOne(color.h / 360);

  if (color.s === 0) {
    // The color is grey
    return { r: color.l, g: color.l, b: color.l, a: color.a };
  }
  const q = color.l < 0.5 ? color.l * (1 + color.s) : color.l + color.s - color.l * color.s;
  const p = 2 * color.l - q;
  const r = convertHueToRGB(p, q, remapZeroToOne(h + 1 / 3));
  const g = convertHueToRGB(p, q, h);
  const b = convertHueToRGB(p, q, remapZeroToOne(h - 1 / 3));
  return { r, g, b, a: color.a };
}

function convertHSVToRGB(color: ColorHSV): ColorRGB {
  let r = 0,
    g = 0,
    b = 0;

  const i = Math.floor((color.h / 360) * 6);
  const f = (color.h / 360) * 6 - i;
  const p = color.v * (1 - color.s);
  const q = color.v * (1 - f * color.s);
  const t = color.v * (1 - (1 - f) * color.s);

  switch (i % 6) {
    case 0:
      (r = color.v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = color.v), (b = p);
      break;
    case 2:
      (r = p), (g = color.v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = color.v);
      break;
    case 4:
      (r = t), (g = p), (b = color.v);
      break;
    case 5:
      (r = color.v), (g = p), (b = q);
      break;
  }
  return { r, g, b, a: color.a };
}

function convertRGBToHSV(color: ColorRGB): ColorHSV {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  let h = 0;

  if (max !== min) {
    switch (max) {
      case color.r:
        h = (color.g - color.b) / d + (color.g < color.b ? 6 : 0);
        break;
      case color.g:
        h = (color.b - color.r) / d + 2;
        break;
      case color.b:
        h = (color.r - color.g) / d + 4;
        break;
    }

    h /= 6;
  }
  h *= 360;

  return { h, s, v, a: color.a };
}

function convertRGBToHSL(color: ColorRGB): ColorHSL {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case color.r:
        h = (color.g - color.b) / d + (color.g < color.b ? 6 : 0);
        break;
      case color.g:
        h = (color.b - color.r) / d + 2;
        break;
      case color.b:
        h = (color.r - color.g) / d + 4;
        break;
    }

    h /= 6;
  }
  h *= 360;

  return { h, s, l, a: color.a };
}

function convertToHexNumber(color: ColorRGB) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  // tslint:disable-next-line:no-bitwise
  const num = (r << 16) + (g << 8) + b;
  return num;
}

function round3DecimalPlaces(num: number) {
  return Math.round(num * 1000) / 1000;
}

function convertHueToRGB(p: number, q: number, t: number) {
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}

function remapZeroToOne(value: number) {
  if (value > 1) {
    return value % 1;
  }
  if (value < 0) {
    return 1 - (-value % 1);
  }
  return value;
}
