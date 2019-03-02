import { CommandFactory, Command, parallel, sequence } from '../commands';

export function mapParallel<T>(items: Iterable<T>, factory: (item: T, index: number) => Command | undefined): Command {
  return parallel(...mapToCommands(items, factory));
}

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
