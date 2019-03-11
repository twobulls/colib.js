import { Ref } from '../ref';
import { Ease } from '../ease';
import { Command, sequence, duration } from './common';
import * as Color from 'color';
import { ColorRGB, ColorHSL, ColorHSV, ColorType } from '../color-types';
import {
  getColorRef,
  getColorFormat,
  getColor,
  lerpRGB,
  convertToColorFormat,
  lerpHSV,
  lerpHSL
} from '../utils/color-utils';

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
  let start: Color = new Color(0x000000);
  const newRef = getColorRef(ref);
  const lerpFunc = getLerpFunc(lerpMode);

  const mode = getColorFormat(newRef.value);
  const end = getColor(target);

  return sequence(
    () => {
      start = getColor(newRef.value);
    },
    duration(
      t => {
        const mixed = lerpFunc(start, end, t);
        const value = convertToColorFormat(mixed, mode) as U;
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
  let end: Color = new Color(0x000000);
  const newRef = getColorRef(ref);
  const lerpFunc = getLerpFunc(lerpMode);

  const mode = getColorFormat(newRef.value);
  const start = getColor(target);

  return sequence(
    () => {
      end = getColor(newRef.value);
    },
    duration(
      t => {
        const mixed = lerpFunc(start, end, t);
        const value = convertToColorFormat(mixed, mode) as U;
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
