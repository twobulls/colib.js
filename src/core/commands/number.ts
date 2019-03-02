import { Ref } from '../ref';
import { sequence, duration } from '../commands';
import { Ease } from '../ease';

/**
 * Tweens a number to an end value.
 * @param ref A reference to the number to tween.
 * @param target The value the number should be at the end of the tween.
 * @param commandDuration The duration of the tween.
 * @param ease The ease to use for the tween.
 */
export function changeToNum(ref: Ref<number>, target: number, commandDuration: number, ease?: Ease) {
  let start = 0;
  return sequence(
    () => {
      start = ref.value;
    },
    duration(
      t => {
        ref.value = (target - start) * t + start;
      },
      commandDuration,
      ease
    )
  );
}

/**
 * Sets a value to `start`, then tweens it back to it's original position.
 * @param ref A reference to the number to tween.
 * @param startTarget  The value to tween from.
 * @param commandDuration The duration of the tween.
 * @param ease The ease to use for the tween.
 */
export function changeFromNum(ref: Ref<number>, startTarget: number, commandDuration: number, ease?: Ease) {
  let end = 0;
  return sequence(
    () => {
      end = ref.value;
    },
    duration(
      t => {
        ref.value = (end - startTarget) * t + startTarget;
      },
      commandDuration,
      ease
    )
  );
}

/**
 * Tweens a value towards it's current value plus an offset.
 * @param ref A reference to the number to tween.
 * @param offset The offset to tween from the start.
 * @param commandDuration The duration of the tween.
 * @param ease The ease to use for the tween.
 */
export function changeToOffsetNum(ref: Ref<number>, offset: number, commandDuration: number, ease?: Ease) {
  let start = 0;
  let end = 0;

  return sequence(
    () => {
      start = ref.value;
      end = start + offset;
    },
    duration(
      t => {
        ref.value = (end - start) * t + start;
      },
      commandDuration,
      ease
    )
  );
}

/**
 * Adds an offset to a value, then tweens it back to it's start position.
 * @param ref A reference to the number to tween.
 * @param offset  The offset to tween from.
 * @param commandDuration The duration of the tween.
 * @param ease The ease to use for the tween.
 */
export function changeFromOffsetNum(ref: Ref<number>, offset: number, commandDuration: number, ease?: Ease) {
  let start = 0;
  let end = 0;
  return sequence(
    () => {
      end = ref.value;
      start = end + offset;
    },
    duration(
      t => {
        ref.value = (end - start) * t + start;
      },
      commandDuration,
      ease
    )
  );
}

/**
 * Tween that scales up a value by `scaleFactor`.
 * @param ref A reference to the number to tween.
 * @param scaleFactor How much to scale up the value by.
 * @param commandDuration The duration of the tween.
 * @param ease The ease to use for the tween.
 */
export function scaleByNum(ref: Ref<number>, scaleFactor: number, commandDuration: number, ease?: Ease) {
  let start = 0;
  let end = 0;
  return sequence(
    () => {
      start = ref.value;
      end = start * scaleFactor;
    },
    duration(
      t => {
        ref.value = (end - start) * t + start;
      },
      commandDuration,
      ease
    )
  );
}
/**
 * Multiplies a value by `scaleFactor`, then tweens it from that value back to it's starting value.
 * @param ref A reference to the number to tween.
 * @param scaleFactor How much to scale up the value by.
 * @param commandDuration The duration of the tween.
 * @param ease The ease to use for the tween.
 */
export function scaleFromNum(ref: Ref<number>, scaleFactor: number, commandDuration: number, ease?: Ease) {
  let start = 0;
  let end = 0;
  return sequence(
    () => {
      end = ref.value;
      start = end * scaleFactor;
    },
    duration(
      t => {
        ref.value = (end - start) * t + start;
      },
      commandDuration,
      ease
    )
  );
}
