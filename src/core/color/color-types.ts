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

/**
 * Type guard for determining whether a color is a ColorRGB object.
 * @param value The value to test.
 */
export function isColorRGB(value: any): value is ColorRGB {
  if (typeof value !== 'object') {
    return false;
  }
  return (
    typeof value.r === 'number' &&
    typeof value.g === 'number' &&
    typeof value.b === 'number' &&
    (value.a === undefined || typeof value.a === 'number')
  );
}

/**
 * Type guard for determining whether a color is a ColorHSV object.
 * @param value The value to test.
 */
export function isColorHSV(value: any): value is ColorHSV {
  if (typeof value !== 'object') {
    return false;
  }
  return (
    typeof value.h === 'number' &&
    typeof value.s === 'number' &&
    typeof value.v === 'number' &&
    (value.a === undefined || typeof value.a === 'number')
  );
}

/**
 * Type guard for determining whether a color is a ColorHSL object.
 * @param value The value to test.
 */
export function isColorHSL(value: any): value is ColorHSL {
  if (typeof value !== 'object') {
    return false;
  }
  return (
    typeof value.h === 'number' &&
    typeof value.s === 'number' &&
    typeof value.l === 'number' &&
    (value.a === undefined || typeof value.a === 'number')
  );
}

export enum ColorFormat {
  STRING,
  HEX_STRING,
  NUMBER,
  RGBA_OBJECT,
  HSLA_OBJECT,
  HSVA_OBJECT
}
