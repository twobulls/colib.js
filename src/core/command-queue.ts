import { Command, CommandOperation } from './commands';

/**
 * The CommandQueue class is one of core primitives for running commands.
 * It operates, as its name suggests, as a FIFO queue. All Commands Enqueued
 * to the queue run in sequential order. When it is fed time via Update, it
 * will remove Commands from the queue as they complete.
 */
export class CommandQueue {
  /**
   * Gets or sets a value indicating whether this `CommandQueue` is paused.
   * ```typescript
   * queue.enqueue(
   *   () => { console.log('called');}
   * );
   * queue.paused = true;
   * queue.update(1.0); // Nothing
   * queue.paused = false;
   * queue.update(1.0); // 'called'
   * ```
   */
  paused = false;

  /**
   * Gets the elapsed time since the current executing CommandDelegate started.
   */
  get deltaTimeAccumulation() {
    return this._deltaTimeAccumulation;
  }

  /**
   * Indicates whether the CommandQueue is currently in an update loop. Update should
   * never be again while this is true.
   */
  get updating() {
    return this._updating;
  }

  private commands: Command[] = [];
  private currentCommand?: Command;
  private _deltaTimeAccumulation = 0.0;
  private _updating = false;

  /**
   * Enqueue the specified command. Commands are queued up in the order specified.
   * Multiple calls to `enqueue` result is the same sequential ordering ie.
   * @param commands The `Command`s to be enqueued. The `CommandQueue` will dequeue the commands over succesive calls to
   * update.
   * ```typescript
   * const queue = new CommandQueue();
   * queue.enqueue(commandOne);
   * queue.enqueue(commandTwo);
   * // Is equivalent to
   * queue.enqueue(commandOne, commandTwo);
   * ```
   */
  enqueue(...commands: Command[]): CommandQueue {
    this.commands.push(...commands);
    return this;
  }

  /**
   * Updates the queue with a zero time update. This will make sure the first available command is started, but no time is consumed.
   * ```typescript
   * const queue = new CommandQueue();
   * queue.enqueue( () => { console.log('called') });
   * queue.process(); // 'called'
   * ```
   */
  process() {
    // If we are already in an update loop, then just let the queue continue running.
    if (!this.updating) {
      this.update(0.0);
    }
  }

  /**
   * Tries to update a queue until it has complete. Note, this can result in an infinite loop if
   * commands in the queue rely on external state changes.
   * ```typescript
   * const queue = new CommandQueue();
   * queue.enqueue(
   *  waitForTime(3),
   *  () => { console.log('called')}
   * );
   * queue.runToEnd(); // 'called'
   * ```
   */
  runToEnd() {
    this.update(Number.MAX_VALUE, CommandOperation.FastForward);
  }

  /**
   * Updates the `CommandQueue`. This causes CommandDelegates to be executed
   * in the order than are enqueued. Update will return after a `Command` elects to pause. This method can't be called
   * recursively.
   * @param deltaTime The time since the last update. Must be >= 0.
   * @param operation The update operation to use. Fastforward will try to force commands to reach the end of the queue.
   * @returns If the queue is finished as no `Command`s remain, returns `true`, `false` otherwise.
   * ```typescript
   * const queue = new CommandQueue();
   * queue.enqueue(
   *  waitForTime(0.5),
   *  () => { console.log('a'); },
   *  waitForTime(0.5),
   *  () => { console.log('b'); }
   * );
   * queue.update(0.6); // 'a'
   * queue.update(0.4); // 'b'
   * ```
   */
  update(deltaTime: number, operation = CommandOperation.Normal): boolean {
    if (deltaTime < 0.0) {
      throw RangeError('deltaTime is expected to be positive.');
    }
    if (this._updating) {
      // Guard against recursive calls.
      throw new Error("update can't be called recursively.");
    }
    this._updating = true;

    try {
      if (!this.paused) {
        this._deltaTimeAccumulation += deltaTime;
        let shouldRun = this.commands.length !== 0 || this.currentCommand !== undefined;
        while (shouldRun) {
          if (this.currentCommand === undefined) {
            const [firstCommand, ...remainder] = this.commands;
            this.currentCommand = firstCommand;
            this.commands = remainder;
          }

          let result = this.currentCommand(this.deltaTimeAccumulation, operation);
          if (result === undefined) {
            result = { deltaTime: this.deltaTimeAccumulation, complete: true };
          }
          this._deltaTimeAccumulation = result.deltaTime;
          if (result.complete) {
            this.currentCommand = undefined;
          }

          // Only run again if an action just finished,
          // (indicated by currentCommand === undefined), and we have more actions.
          shouldRun = result.complete && this.commands.length !== 0 && !this.paused;
        }
      }
      const done = this.commands.length === 0 && this.currentCommand === undefined;
      return done;
    } finally {
      this._updating = false;
      deltaTime = this.deltaTimeAccumulation;
      if (this.currentCommand === undefined) {
        this._deltaTimeAccumulation = 0.0;
      }
    }
  }
}
