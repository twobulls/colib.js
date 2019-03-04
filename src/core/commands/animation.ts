import { Command, sequence, defer, duration } from './common';
import { smooth, Ease } from '../ease';
import { changeTo, scaleBy } from './object';
import { Ref } from 'core/ref';
import { scaleByNum } from './number';

export interface Vec1D {
  x: number;
}

export interface Vec2D extends Vec1D {
  y: number;
}

export interface Vec3D extends Vec2D {
  z: number;
}

export type Vec = Vec1D | Vec2D | Vec3D;

/**
 * Pulsates the scale.
 * @param val The value to pulsate.
 * @param amount The amount to increase the scale by.
 * @param commandDuration The duration of the command.
 **/
export function pulsateScale(val: Vec | Ref<number>, amount: number, commandDuration: number) {
  let tweenBack: Command | undefined;
  const scale = 1 + amount;

  if (Ref.isRef(val)) {
    return sequence(
      () => {
        tweenBack = changeTo(val, val, commandDuration / 2, smooth());
      },
      scaleByNum(val as Ref<number>, scale, commandDuration / 2, smooth()),
      defer(() => tweenBack as Command)
    );
  }

  val = val as Vec;

  const targetScale = { x: scale, y: scale, z: scale };

  return sequence(
    () => {
      tweenBack = changeTo(val, val, commandDuration / 2, smooth());
    },
    scaleBy(val, targetScale, commandDuration / 2, smooth()),
    defer(() => tweenBack as Command)
  );
}

/**
 * Oscillates around a value. This will animation go from startValue -> startValue + amount -> startValue - amount -> startValue
 * @param val The value to oscillate.
 * @param amount  The maximum amount to oscillate away from the default value.
 * @param commandDuration The duration of the command.
 * @param ease The ease to apply.
 */
export function oscillate(val: Ref<number>, amount: number, commandDuration: number, ease?: Ease) {
  let baseValue = 0;
  return sequence(
    () => {
      baseValue = val.value;
    },
    duration(
      t => {
        val.value = baseValue + Math.sin(t * 2 * Math.PI) * amount;
      },
      commandDuration,
      ease
    )
  );
}
