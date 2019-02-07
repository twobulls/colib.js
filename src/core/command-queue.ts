import { Command, CommandOperation, CommandState } from './commands';

/**
 * The CommandQueue class is one of core primitives for running commands.
 * It operates, as its name suggests, as a FIFO queue. All Commands Enqueued
 * to the queue run in sequential order. When it is fed time via Update, it
 * will remove Commands from the queue as they complete.
 */
export class CommandQueue {
  /**
   * Gets or sets a value indicating whether this `CommandQueue` is paused.
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
   * @example
   * CommandQueue queue = new CommandQueue();
   * queue.Enqueue(commandOne);
   * queue.Enqueue(commandTwo);
   * // Is equivalent to
   * queue.Enqueue(commandOne, commandTwo);
   * @param commands The `Command`s to be enqueued. The `CommandQueue` will dequeue the commands over succesive calls to
   * update.
   */
  enqueue(...commands: Command[]): CommandQueue {
    this.commands.push(...commands);
    return this;
  }

  /**
   * Updates the queue with a zero time update. This will make sure the first available command is started.
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
   */
  runToEnd() {
    this.update(Number.MAX_VALUE, CommandOperation.FastForward);
  }

  /**
   * Updates the <c>CommandQueue</c>. This causes CommandDelegates to be executed
   * in the order than are enqueued. Update will return after a `Command` elects to pause. This method can't be called
   * recursively.
   * @param deltaTime The time, in seconds, since the last update. Must be >= 0.
   * @param operation The update operation to use. Fastforward will try to force commands to reach the end of the queue.
   * @returns If the queue is finished as no `Command`s remain, returns `true`, `false` otherwise.
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

          const result = this.currentCommand(this.deltaTimeAccumulation, operation);
          if (result.complete) {
            this.currentCommand = undefined;
          }

          // Only run again if an action just finished,
          // (indicated by currentCommand == null), and we have more actions.
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
