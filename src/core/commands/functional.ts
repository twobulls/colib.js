import { Command, parallel, sequence } from './common';

/**
 * Maps a collection of values to a series of commands run in parallel.
 *
 * ```typescript
 * const items = ["called 1", "called 2", "called 3"]
 * const queue = new CommandQueue();
 * queue.push(
 *  mapParallel( items, (item) => {
 *    return sequence(
 *      waitForTime(1),
 *      () => { console.log(item); }
 *    )
 *  })
 * );
 * queue.update(1); // "called 1" "called 2" "called 3"
 * ```
 *
 * @param items The collection of items
 * @param factory A factory function which converts each item to a command
 */
export function mapParallel<T>(items: Iterable<T>, factory: (item: T, index: number) => Command | undefined): Command {
  return parallel(...mapToCommands(items, factory));
}

/**
 * Maps a collection of values to a series of commands run sequentially.
 *
 * ```typescript
 * const items = ["called 1", "called 2", "called 3"]
 * const queue = new CommandQueue();
 * queue.push(
 *  mapSequential( items, (item) => {
 *    return sequence(
 *      waitForTime(1),
 *      () => { console.log(item); }
 *    )
 *  })
 * );
 * queue.update(1); // "called 1"
 * queue.update(1); // "called 2"
 * queue.update(1); // "called 3"
 * ```
 *
 * @param items The collection of items
 * @param factory A factory function which converts each item to a command
 */
export function mapSequential<T>(
  items: Iterable<T>,
  factory: (item: T, index: number) => Command | undefined
): Command {
  return sequence(...mapToCommands(items, factory));
}

function mapToCommands<T>(items: Iterable<T>, factory: (item: T, index: number) => Command | undefined): Command[] {
  const commands = [];
  let index = 0;
  for (const item of items) {
    const command = factory(item, index);
    ++index;
    if (command !== undefined) {
      commands.push(command);
    }
  }
  return commands;
}
