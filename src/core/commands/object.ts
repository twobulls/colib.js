import { Ease } from '../ease';
import { Ref } from '../ref';
import { changeToNum, changeFromNum, changeFromOffsetNum, changeToOffsetNum, scaleByNum, scaleFromNum } from './number';
import { parallel } from './common';

interface RefPair<T> {
  ref: Ref<T>;
  value: T;
}

type CommonRefPairs = RefPair<number>;

/**
 * Tweens the properties on an object to a set of target values, using regular linear interpolation.
 * @param object The object to tween the properties of.
 * @param target The target to tween to.
 * @param commandDuration The duration of the command.
 * @param ease The ease to apply
 */
export function changeTo<T>(object: T, target: T, commandDuration: number, ease?: Ease) {
  const refs = generateReferenceTargetPairs(object, target);
  const tweens = refs.map(pair => {
    const { ref, value } = pair;
    return changeToNum(ref, value, commandDuration, ease);
  });
  return parallel(...tweens);
}

/**
 * Tweens the properties on an object from a set of target values, using regular linear interpolation.
 * @param object The object to tween the properties of.
 * @param from The target to tween from.
 * @param commandDuration The duration of the command.
 * @param ease The ease to apply
 */
export function changeFrom<T>(object: T, from: T, commandDuration: number, ease?: Ease) {
  const refs = generateReferenceTargetPairs(object, from);
  const tweens = refs.map(pair => {
    const { ref, value } = pair;
    return changeFromNum(ref, value, commandDuration, ease);
  });
  return parallel(...tweens);
}

/**
 * Tweens the properties on an object to an offset from it's start position, using regular linear interpolation.
 * @param object The object to tween the properties of.
 * @param offset The offset to add to the start position.
 * @param commandDuration The duration of the command.
 * @param ease The ease to apply
 */
export function changeToOffset<T>(object: T, offset: T, commandDuration: number, ease?: Ease) {
  const refs = generateReferenceTargetPairs(object, offset);
  const tweens = refs.map(pair => {
    const { ref, value } = pair;
    return changeToOffsetNum(ref, value, commandDuration, ease);
  });
  return parallel(...tweens);
}

/**
 * Tweens the properties on an object from an offset back to it's start position, using regular linear interpolation.
 * @param object The object to tween the properties of.
 * @param offset The offset to tween from.
 * @param commandDuration The duration of the command.
 * @param ease The ease to apply
 */
export function changeFromOffset<T>(object: T, offset: T, commandDuration: number, ease?: Ease) {
  const refs = generateReferenceTargetPairs(object, offset);
  const tweens = refs.map(pair => {
    const { ref, value } = pair;
    return changeFromOffsetNum(ref, value, commandDuration, ease);
  });
  return parallel(...tweens);
}

/**
 * Scales up the properties on an object by `scaleFactor`
 * @param object The object to tween the properties of.
 * @param scaleFactor The scale factor to apply to the object. This should have matching properties.
 * @param commandDuration The duration of the command.
 * @param ease The ease to apply
 */
export function scaleBy<T>(object: T, scaleFactor: T, commandDuration: number, ease?: Ease) {
  const refs = generateReferenceTargetPairs(object, scaleFactor);
  const tweens = refs.map(pair => {
    const { ref, value } = pair;
    return scaleByNum(ref, value, commandDuration, ease);
  });
  return parallel(...tweens);
}

/**
 * Immediately scales up the properties on an object by `scaleFactor`, then tweens back to the original scale.
 * @param object The object to tween the properties of.
 * @param scaleFactor The scale factor to apply to the object. This should have matching properties.
 * @param commandDuration The duration of the command.
 * @param ease The ease to apply
 */
export function scaleFrom<T>(object: T, scaleFactor: T, commandDuration: number, ease?: Ease) {
  const refs = generateReferenceTargetPairs(object, scaleFactor);
  const tweens = refs.map(pair => {
    const { ref, value } = pair;
    return scaleFromNum(ref, value, commandDuration, ease);
  });
  return parallel(...tweens);
}

function generateReferenceTargetPairs<T extends Object>(obj: T, target: T) {
  const refs: CommonRefPairs[] = [];

  const objs: { obj: any; target: any }[] = [{ obj, target }];
  const visited = new Set();

  while (objs.length > 0) {
    const pair = objs.pop() as { obj: any; target: any };
    if (visited.has(pair.obj) || visited.has(pair.target)) {
      throw new Error("Can't tween a value that refences itself recursively");
    }
    visited.add(pair.obj);
    visited.add(pair.target);

    for (const key of Object.keys(pair.target)) {
      const targetVal = pair.target[key];
      const objVal = pair.obj[key];

      if (objVal === undefined) {
        continue;
      }
      if (typeof objVal === 'number' && typeof targetVal === 'number') {
        const ref = Ref.from(pair.obj, key) as Ref<number>;
        refs.push({ ref, value: targetVal });
      }
      if (typeof objVal === 'object' && typeof targetVal === 'object') {
        objs.push({ obj: objVal, target: targetVal });
      }
    }
  }
  return refs;
}
