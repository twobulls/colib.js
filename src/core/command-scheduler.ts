import { CommandQueue } from './command-queue';
import { Command } from './commands';

/**
 * `CommandScheduler` takes commands, and runs them in parallel. With a single call to update, several different
 * commands can be updated and running at the same time.
 */
export class CommandScheduler {
  /**
   * Gets or sets a value indicating whether this `CommandScheduler` is paused.
   */
  paused = false;

  private queues: CommandQueue[] = [];

  /**
   * Add commands to be scheduled. The commands given in this call will be scheduled in sequence as a group, but run at the
   * same time as other scheduled sequences.
   *
   * ```typescript
   * const scheduler = new CommandScheduler();
   * scheduler.add(
   *   () => { console.log('called'); }
   * );
   * scheduler.update(0.5); // 'called'
   * ```
   *
   * @param commands The commands to execute.
   */
  add(...commands: Command[]) {
    if (commands.length === 0) {
      return;
    }
    const queue = new CommandQueue();
    queue.push(...commands);
    this.queues.push(queue);
  }

  /**
   * Updates the scheduler's deltaTime. This will in turn update the deltaTimes of any
   * commands running on this scheduler.
   *
   * ```typescript
   * const scheduler = new CommandScheduler();
   * scheduler.add(
   *   () => { console.log('a'); }
   *   waitForTime(1),
   *   () => { console.log('c'); }
   * );
   * scheduler.add(
   *   () => { console.log('b'); }
   *   waitForTime(1),
   *   () => { console.log('d'); }
   * );
   * scheduler.update(0.5); // 'a' 'b'
   * scheduler.update(0.5); // 'c' 'd'
   * ```
   *
   * @param deltaTime The time since the last update. Must be >= 0.
   */
  update(deltaTime: number) {
    if (deltaTime < 0) {
      throw new RangeError('deltaTime is expected to be >= 0');
    }
    if (!this.paused) {
      let index = 0;
      for (const queue of this.queues) {
        const complete = queue.update(deltaTime);
        if (!complete) {
          this.queues[index] = queue;
          index++;
        }
      }
      this.queues.length = index;
    }
  }
}
