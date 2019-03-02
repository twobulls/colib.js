import { Ease } from '../ease';
import { Ref } from '../ref';
import { changeToNum } from './number';
import { parallel, none } from '../commands';
import { type } from 'os';

interface RefPair<T> {
  ref: Ref<T>;
  value: T;
}

type CommonRefPairs = RefPair<number>;

export function changeTo<T>(object: T, target: T, commandDuration: number, ease?: Ease) {
  const refs = generateReferenceTargetPairs(object, target);
  const tweens = refs.map(pair => {
    const { ref, value } = pair;
    return changeToNum(ref, value, commandDuration, ease);
  });
  return parallel(...tweens);
}

function generateReferenceTargetPairs<T extends Object>(obj: T, target: T) {
  const refs: CommonRefPairs[] = [];

  for (const key of Object.keys(target)) {
    const typesKey = key as keyof T;
    const targetVal = target[typesKey];
    const ref = Ref.from(obj, typesKey);

    if (ref.value === undefined) {
      continue;
    }
    if (typeof ref.value === 'number' && typeof targetVal === 'number') {
      const newRef = (ref as unknown) as Ref<number>;
      refs.push({ ref: newRef, value: targetVal });
    }
  }
  return refs;
}
