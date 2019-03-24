import { colors } from './color-list';
import { ColorRGB, ColorType, ColorHSL } from 'core/color/color-types';
import { ColorFormat } from './color-utils';

export interface ColorParseResult {
  color: ColorRGB | ColorHSL;
  format: ColorFormat;
}

/**
 * Parse a color, either a css color string, or a hex number;
 * @param color The color to parse. Can be any valid css color string, or a number.
 * If a number, a 24bit RGB number is expected, (eg 0xFFAABB).
 */
export function parseColor(color: string | number) {
  if (typeof color === 'number') {
    return { color: parseColorNumber(color), format: ColorFormat.NUMBER };
  }
  return parseColorString(color);
}

/**
 * Parse a color from a number.
 * @param color A 24bit RGB number is expected, (eg 0xFFAABB). Only the last 24 bits are used.
 */
export function parseColorNumber(color: number): ColorRGB {
  // tslint:disable-next-line:no-bitwise
  const r = ((color >> 16) & 255) / 255;
  // tslint:disable-next-line:no-bitwise
  const g = ((color >> 8) & 255) / 255;
  // tslint:disable-next-line:no-bitwise
  const b = (color & 255) / 255;
  return { r, g, b, a: 1 };
}

export function parseColorString(color: string): ColorParseResult | undefined {
  color = color.trim().toLowerCase();
  const colorName = colors[color] as number | undefined;
  if (colorName !== undefined) {
    return { color: parseColorNumber(colorName), format: ColorFormat.STRING };
  }

  if (color.startsWith('#')) {
    const r = parseHexNumberString(color.slice(1));
    if (r === undefined) {
      return undefined;
    }
    return { color: r, format: ColorFormat.HEX_STRING };
  }
  if (!color.endsWith(')')) {
    return undefined;
  }
  const result = parseColorFunction(color);
  if (result === undefined) {
    return undefined;
  }
  return { color: result, format: ColorFormat.STRING };
}

function parseHexNumberString(color: string): ColorRGB | undefined {
  const result = parseInt(color, 16);

  const aCode = 'a'.charCodeAt(0);
  const fCode = 'f'.charCodeAt(0);
  const zeroCode = '0'.charCodeAt(0);
  const nineCode = '9'.charCodeAt(0);

  for (let i = 1; i < color.length; ++i) {
    const code = color.charCodeAt(i);
    if ((code >= aCode && code <= fCode) || (code >= zeroCode && code <= nineCode)) {
      continue;
    }
    return undefined;
  }
  if (color.length === 6) {
    return parseColorNumber(result);
  }
  if (color.length === 8) {
    // tslint:disable-next-line:no-bitwise
    const a = (result & 255) / 255;
    // tslint:disable-next-line:no-bitwise
    const col = parseColorNumber(result >> 8);
    return { ...col, a };
  }
  if (color.length === 3) {
    // tslint:disable-next-line:no-bitwise
    const r = ((result >> 8) & 15) / 15;
    // tslint:disable-next-line:no-bitwise
    const g = ((result >> 4) & 15) / 15;
    // tslint:disable-next-line:no-bitwise
    const b = (result & 15) / 15;
    return { r, g, b, a: 1 };
  }
  if (color.length === 4) {
    // tslint:disable-next-line:no-bitwise
    const r = ((result >> 12) & 15) / 15;
    // tslint:disable-next-line:no-bitwise
    const g = ((result >> 8) & 15) / 15;
    // tslint:disable-next-line:no-bitwise
    const b = ((result >> 4) & 15) / 15;
    // tslint:disable-next-line:no-bitwise
    const a = (result & 15) / 15;

    return { r, g, b, a };
  }
  return undefined;
}

function parseColorFunction(color: string): ColorRGB | ColorHSL | undefined {
  if (color.startsWith('rgb(')) {
    return parseRGBString(color.slice(4, -1));
  }
  if (color.startsWith('rgba(')) {
    return parseRGBString(color.slice(5, -1));
  }
  if (color.startsWith('hsl(')) {
    return parseHSVString(color.slice(4, -1));
  }
  if (color.startsWith('hsla(')) {
    return parseHSVString(color.slice(5, -1));
  }
}

function parseRGBString(content: string): ColorRGB | undefined {
  // Functional mode eg. rgb(255, 255, 255)
  let values = content.split(',').map(v => v.trim());
  let alpha: string | undefined;

  if (values.length !== 3 && values.length !== 4) {
    // Could be using whitespace format eg, rgb(255 255 255)
    values = content.replace(/\s+/g, ' ').split(' ');
    if (values.length !== 3 && values.length !== 5) {
      return undefined;
    }
    if (values.length === 5) {
      if (values[3] !== '/') {
        return undefined;
      }
      alpha = values[4];
    }
  } else if (values.length === 4) {
    alpha = values[3];
  }

  let anyPercentages = false;
  let allPercentages = true;
  for (let i = 0; i < 3; ++i) {
    const value = values[i];
    if (value.endsWith('%')) {
      anyPercentages = true;
    } else {
      allPercentages = false;
    }
  }
  if (anyPercentages !== allPercentages) {
    return undefined; // Either all the values are percentages, or none of them are.
  }

  let r = parseFloat(values[0]);
  let g = parseFloat(values[1]);
  let b = parseFloat(values[2]);
  let a = 1;
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return undefined;
  }

  if (allPercentages) {
    r /= 100;
    g /= 100;
    b /= 100;
  } else {
    r /= 255;
    g /= 255;
    b /= 255;
  }

  if (alpha !== undefined) {
    a = parseFloat(alpha);
    if (isNaN(a)) {
      return undefined;
    }
    if (alpha.endsWith('%')) {
      a /= 100;
    }
  }

  return { r, g, b, a };
}

function parseHSVString(content: string): ColorHSL | undefined {
  // Functional mode eg. hsl(180deg, 100%, 50%)
  let values = content.split(',').map(v => v.trim());
  let alpha: string | undefined;

  if (values.length !== 3 && values.length !== 4) {
    // Could be using whitespace format eg, hsl(180deg 100% 100%)
    values = content.replace(/\s+/g, ' ').split(' ');
    if (values.length !== 3 && values.length !== 5) {
      return undefined;
    }
    if (values.length === 5) {
      if (values[3] !== '/') {
        return undefined;
      }
      alpha = values[4];
    }
  } else if (values.length === 4) {
    alpha = values[3];
  }

  if (!values[1].endsWith('%') || !values[2].endsWith('%')) {
    return undefined;
  }
  const h = parseAngle(values[0]);
  if (h === undefined) {
    return undefined;
  }

  const s = parseFloat(values[1]) / 100;
  const l = parseFloat(values[2]) / 100;
  if (isNaN(s) || isNaN(l)) {
    return undefined;
  }
  let a = 1;
  if (alpha !== undefined) {
    a = parseFloat(alpha);
    if (isNaN(a)) {
      return undefined;
    }
    if (alpha.endsWith('%')) {
      a /= 100;
    }
  }
  return { h, s, l, a };
}

/**
 * @param angle The angle string. Can be in format 270, 270deg, 1rad, 100grad, 2turn
 * @returns The angle in degrees as a numbers
 */
function parseAngle(angle: string): number | undefined {
  const value = parseFloat(angle);
  if (isNaN(value)) {
    return undefined;
  }

  if (angle.endsWith('deg')) {
    return value;
  }
  if (angle.endsWith('grad')) {
    return 360 * (value / 400);
  }
  if (angle.endsWith('rad')) {
    return (180 * value) / Math.PI;
  }
  if (angle.endsWith('turn')) {
    return value * 360;
  }

  return value;
}
