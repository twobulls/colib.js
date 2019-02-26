import { CommandQueue } from './../core/command-queue';
import * as commands from './../core/commands';
const DELTA_TIME_RATE = 1.0 / 30.0;

test('command enqueue ordering', () => {
  const queue = new CommandQueue();
  let lastCalled = '';
  queue.enqueue(
    commands.act(() => {
      lastCalled = 'a';
    }),
    commands.act(() => {
      lastCalled = 'b';
    }),
    commands.act(() => {
      lastCalled = 'c';
      queue.enqueue(
        commands.act(() => {
          lastCalled = 'e';
        })
      );
    }),
    commands.act(() => {
      lastCalled = 'd';
    })
  );
  while (!queue.update(DELTA_TIME_RATE)) {}
  expect(lastCalled).toEqual('e');
});

// test('commands timing', () => {
//   const queue = new CommandQueue();
//   const FIRST_Command_DURATION = 4.5;
//   const SECOND_Command_DURATION = 1.0;
//   const WAIT_DURATION = 1.5;
//   const REPEAT_COUNT = 8640;
//   let lastT = 0.0;
//   queue.enqueue(
//     commands.repeat(REPEAT_COUNT,
//       commands.sequence(
//         commands.waitForSeconds(WAIT_DURATION),
//         commands.act(() => lastT = 0.0),
//         commands.duration((t) => {
//           expect(t <= 1.0).toBeTruthy();
//           expect(lastT <= t).toBeTruthy();
//           lastT = t;
//         }, FIRST_Command_DURATION),
//         commands.act(() => lastT = 0.0),
//         commands.parallel(
//           commands.duration((t) => { }, SECOND_Command_DURATION / 2.0),
//           // The following two  Duration Commands should finish in the same Update call.
//           commands.duration((t) => { }, SECOND_Command_DURATION - (DELTA_TIME_RATE / 2.0)),
//           commands.duration((t) => {
//             expect(t <= 1.0).toBeTruthy();
//             expect(lastT <= t).toBeTruthy();
//             lastT = t;
//           }, SECOND_Command_DURATION)
//         )
//       )
//     )
//   );
//   let totalTime = 0.0;
//   while (!queue.update(DELTA_TIME_RATE)) {
//     totalTime += DELTA_TIME_RATE;
//   }
//   const EXPECTED_TIME = (FIRST_Command_DURATION + SECOND_Command_DURATION + WAIT_DURATION) * REPEAT_COUNT;
//   expect(totalTime / EXPECTED_TIME).toBeCloseTo(DELTA_TIME_RATE);
// });
