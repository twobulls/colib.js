import { Command, sequence, interval } from './common';
import { Ref } from '../ref';
import { Ease } from '../ease';

/**
 * Tweens a number to an end value.
 * @param ref A reference to the number to tween.
 * @param target The value the number should be at the end of the tween.
 * @param duration The duration of the tween.
 * @param ease The ease to use for the tween.
 * ```typescript
 * const DURATION = 1.0;
 * const queue = new CommandQueue();
 * const numRef = Ref.create(0);
 * queue.push(
 *  changeToNum(numRef, 100, DURATION)
 * );
 * queue.update(DURATION / 4);
 * console.log(numRef.value); // 25;
 * ```
 */
export function changeToNum(ref: Ref<number>, target: number, duration: number, ease?: Ease): Command {
  let start = 0;
  return sequence(
    () => {
      start = ref.value;
    },
    interval(
      t => {
        ref.value = (target - start) * t + start;
      },
      duration,
      ease
    )
  );
}

/**
 * Sets a value to `start`, then tweens it back to it's original position.
 * @param ref A reference to the number to tween.
 * @param startTarget  The value to tween from.
 * @param duration The duration of the tween.
 * @param ease The ease to use for the tween.
 * ```typescript
 * const DURATION = 1.0;
 * const queue = new CommandQueue();
 * const numRef = Ref.create(0);
 * queue.push(
 *  changeFromNum(numRef, 100, DURATION)
 * );
 * queue.update(DURATION / 4);
 * console.log(numRef.value); // 75;
 * ```
 */
export function changeFromNum(ref: Ref<number>, startTarget: number, duration: number, ease?: Ease): Command {
  let end = 0;
  return sequence(
    () => {
      end = ref.value;
    },
    interval(
      t => {
        ref.value = (end - startTarget) * t + startTarget;
      },
      duration,
      ease
    )
  );
}

/**
 * Tweens a value towards it's current value plus an offset.
 * @param ref A reference to the number to tween.
 * @param offset The offset to tween from the start.
 * @param duration The duration of the tween.
 * @param ease The ease to use for the tween.
 * ```typescript
 * const DURATION = 1.0;
 * const queue = new CommandQueue();
 * const numRef = Ref.create(10);
 * queue.push(
 *  changeToOffsetNum(numRef, 100, DURATION)
 * );
 * queue.update(DURATION / 4);
 * console.log(numRef.value); // 35;
 * ```
 */
export function changeToOffsetNum(ref: Ref<number>, offset: number, duration: number, ease?: Ease): Command {
  let start = 0;
  let end = 0;

  return sequence(
    () => {
      start = ref.value;
      end = start + offset;
    },
    interval(
      t => {
        ref.value = (end - start) * t + start;
      },
      duration,
      ease
    )
  );
}

/**
 * Adds an offset to a value, then tweens it back to it's start position.
 * @param ref A reference to the number to tween.
 * @param offset  The offset to tween from.
 * @param duration The duration of the tween.
 * @param ease The ease to use for the tween.
 * ```typescript
 * const DURATION = 1.0;
 * const queue = new CommandQueue();
 * const numRef = Ref.create(10);
 * queue.push(
 *  changeFromOffsetNum(numRef, 100, DURATION)
 * );
 * queue.update(DURATION / 4);
 * console.log(numRef.value); // 85;
 * ```
 */
export function changeFromOffsetNum(ref: Ref<number>, offset: number, duration: number, ease?: Ease): Command {
  let start = 0;
  let end = 0;
  return sequence(
    () => {
      end = ref.value;
      start = end + offset;
    },
    interval(
      t => {
        ref.value = (end - start) * t + start;
      },
      duration,
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
 * ```typescript
 * const DURATION = 1.0;
 * const queue = new CommandQueue();
 * const numRef = Ref.create(4);
 * queue.push(
 *  scaleByNum(numRef, 100, DURATION)
 * );
 * queue.update(DURATION / 4);
 * console.log(numRef.value); // 99;
 * ```
 */
export function scaleByNum(ref: Ref<number>, scaleFactor: number, commandDuration: number, ease?: Ease): Command {
  let start = 0;
  let end = 0;
  return sequence(
    () => {
      start = ref.value;
      end = start * scaleFactor;
    },
    interval(
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
 * @param duration The duration of the tween.
 * @param ease The ease to use for the tween.
 * ```typescript
 * const DURATION = 1.0;
 * const queue = new CommandQueue();
 * const numRef = Ref.create(4);
 * queue.push(
 *  scaleFromNum(numRef, 100, DURATION)
 * );
 * queue.update(DURATION / 4);
 * console.log(numRef.value); // 301;
 * ```
 */
export function scaleFromNum(ref: Ref<number>, scaleFactor: number, duration: number, ease?: Ease): Command {
  let start = 0;
  let end = 0;
  return sequence(
    () => {
      end = ref.value;
      start = end * scaleFactor;
    },
    interval(
      t => {
        ref.value = (end - start) * t + start;
      },
      duration,
      ease
    )
  );
}
