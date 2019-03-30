import { Ref } from '../ref';
import { Ease } from '../ease';
import { Command, sequence, duration } from './common';
import {
  ColorRGB,
  ColorHSL,
  ColorHSV,
  ColorType,
  ColorFormat,
  getColorRef,
  lerpRGB,
  lerpHSV,
  lerpHSL,
  convertColor,
  getColorFormat
} from '../color';

export enum ColorLerpMode {
  RGB,
  HSV,
  HSL
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
  lerpMode: ColorLerpMode = ColorLerpMode.RGB,
  ease?: Ease
): Command {
  let start: ColorType = { r: 0, g: 0, b: 0, a: 1 };
  const newRef = getColorRef(ref);
  const lerpFunc = getLerpFunc(lerpMode);

  const outputFormat = getColorFormat(newRef.value);
  const conversionFormat = getConversionFormat(lerpMode);
  const end = convertColor(target, conversionFormat);

  if (end === undefined) {
    throw Error(`Invalid color ${end}`);
  }

  return sequence(
    () => {
      const result = convertColor(newRef.value, conversionFormat);
      if (result === undefined) {
        start = { r: 1, g: 1, b: 1, a: 1 };
      } else {
        start = result;
      }
    },
    duration(
      t => {
        const mixed = lerpFunc(start, end, t);
        const value = convertColor(mixed, outputFormat) as U;

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
  lerpMode: ColorLerpMode = ColorLerpMode.RGB,
  ease?: Ease
): Command {
  let end: ColorType = { r: 0, g: 0, b: 0, a: 1 };

  const newRef = getColorRef(ref);
  const lerpFunc = getLerpFunc(lerpMode);

  const outputFormat = getColorFormat(newRef.value);
  const conversionFormat = getConversionFormat(lerpMode);
  const start = convertColor(target, conversionFormat);
  if (start === undefined) {
    throw Error(`Invalid color ${start}`);
  }

  return sequence(
    () => {
      const result = convertColor(newRef.value, conversionFormat);
      if (result === undefined) {
        end = { r: 1, g: 1, b: 1, a: 1 };
      } else {
        end = result;
      }
    },
    duration(
      t => {
        const mixed = lerpFunc(start, end, t);
        const value = convertColor(mixed, outputFormat) as U;
        newRef.value = value;
      },
      commandDuration,
      ease
    )
  );
}

function getLerpFunc(lerpMode: ColorLerpMode) {
  switch (lerpMode) {
    case ColorLerpMode.RGB:
      return lerpRGB;
    case ColorLerpMode.HSV:
      return lerpHSV;
    case ColorLerpMode.HSL:
      return lerpHSL;
  }
}

function getConversionFormat(lerpMode: ColorLerpMode) {
  switch (lerpMode) {
    case ColorLerpMode.HSL:
      return ColorFormat.HSLA_OBJECT;
    case ColorLerpMode.HSV:
      return ColorFormat.HSVA_OBJECT;
    case ColorLerpMode.RGB:
      return ColorFormat.RGBA_OBJECT;
  }
}
