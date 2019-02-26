import { Ease } from './ease';
import * as commands from './commands';
export function changeTo(single: number, endSingle: number, duration: number, ease: Ease) {
  let startSingle = 0.0;
  return commands.sequence(
    commands.act(() => {
      startSingle = single;
    }),
    commands.duration(
      (t: number) => {
        single = (endSingle - startSingle) * t + startSingle;
      },
      duration,
      ease
    )
  );
}

export function changeBy(single: number, offset: number, duration: number, ease: Ease) {
  let lastT = 0.0;
  return commands.sequence(
    commands.act(() => {
      lastT = 0.0;
    }),
    commands.duration(
      (t: number) => {
        single += offset * (t - lastT);
        lastT = t;
      },
      duration,
      ease
    )
  );
}

export function changeFrom(single: number, startSingle: number, duration: number, ease: Ease) {
  let endSingle = 0.0;
  return commands.sequence(
    commands.act(() => {
      endSingle = single;
    }),
    commands.duration(
      (t: number) => {
        single = (endSingle - startSingle) * t + startSingle;
      },
      duration,
      ease
    )
  );
}

export function scaleBy(scale: number, scaleFactor: number, duration: number, ease: Ease) {
  let lastScaleFactor = 1.0;
  return commands.sequence(
    commands.act(() => {
      lastScaleFactor = 1.0;
    }),
    commands.duration(
      (t: number) => {
        const newScaleFactor = 1.0 * t * (scaleFactor - 1.0) + 1.0;
        scale = (scale * newScaleFactor) / lastScaleFactor;
        lastScaleFactor = newScaleFactor;
      },
      duration,
      ease
    )
  );
}
