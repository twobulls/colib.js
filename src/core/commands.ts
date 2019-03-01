import { Ease } from './ease';

export enum CommandOperation {
  Normal,
  FastForward
}

export interface CommandState {
  deltaTime: number;
  complete: boolean;
}

/**
 * The base building block for all commands.
 * @description
 * This is what the CommandQueue and CommandScheduler update. Commands typically capture state, and are only safe to be
 * invoked by a single queue/scheduler at once.
 * Inside options, deltaTime is the time to update the command by. The command should modify deltaTime, subtracting the
 * time it has consumed. The command sets the completed flag to true when it has completed, or false otherwise. Once the
 * delegate has completed, the next call should restart it. If the operation is set to fast forward, the command should
 * try to immediately complete.
 */
export type Command = (deltaTime: number, operation: CommandOperation) => CommandState | void;

/**
 * A one shot command. It doesn't take up any time, and completes immediately.
 */
export type CommandAct = () => void;

/**
 * A condition returns true or false, which can change the flow control for some commands.
 */
export type CommandCondition = () => boolean;

/**
 * A duration command is executed over a period of time. The value t is normalized from 0 to 1.
 */
export type CommandDuration = (t: number) => void;

/**
 * A command factory creates a command.
 */
export type CommandFactory = () => Command;

export type CommandIterator = IterableIterator<Command>;
/**
 * A coroutine command uses generators to produce a sequence of commands over time.
 * @example
 * function *aCoroutine(): CommandIterator {
 *    yield wait(5); // Log t for 5 seconds
 *    console.log("Now this is called");
 *    yield duration(t => console.log(t), 10); // Log t for 10 seconds
 *    console.log("This is also called");
 * }
 */
export type CommandCoroutine = () => CommandIterator;

/**
 * Interruptable commands are useful for situations where a command is waiting for an external action to finish,
 * but a queue running the command wants to fast foward. For example, consider a command to play an audio source.
 * The command starts the Audio, then polls waiting for it to finish. Suddenly a queue  running the command
 * is told to runToEnd. In this case, the onInterrupt action is called, which stops the audio source and performs
 * cleanup. The command then finishes, and the queue continues.
 * @param command The command to make interruptable
 * @param onInterrupt The action to perform if the
 */
export function interruptable(command: Command, onInterrupt: () => void): Command {
  let started = false;
  return (deltaTime, operation) => {
    if (operation === CommandOperation.FastForward) {
      if (started) {
        onInterrupt();
        started = false;
      }
      return { deltaTime, complete: true };
    }
    started = true;
    const result = callCommand(command, deltaTime, operation);
    if (result.complete) {
      started = false;
    }
    return result;
  };
}

/**
 *  A command which does nothing. Can be useful as a return value.
 */
export function none(): Command {
  return (deltaTime, operation) => ({ deltaTime, complete: true });
}

/**
 * CommandDuration runs a command over a duration of time.
 * @param command The command to execute.
 * @param commandDuration The duration of time, in seconds, to apply the command over. Must be greater than or equal to 0.
 * @param ease An easing function to apply to the t parameter of a CommandDuration. If undefined, linear easing is used.
 */
export function duration(command: CommandDuration, commandDuration: number, ease?: Ease): Command {
  checkDurationGreaterThanOrEqualToZero(commandDuration);
  if (commandDuration === 0.0) {
    // Sometimes it is convenient to create duration commands with
    // a time of zero, so we have a special case.
    return (deltaTime, operation) => {
      let t = 1.0;
      if (ease !== undefined) {
        t = ease(t);
      }
      command(t);
      return { deltaTime, complete: true };
    };
  }

  let elapsedTime = 0.0;

  return (deltaTime, operation) => {
    elapsedTime += deltaTime;

    let t = elapsedTime / commandDuration;
    t = t < 0.0 ? 0.0 : t > 1.0 ? 1.0 : t;

    if (operation === CommandOperation.FastForward) {
      t = 1;
    }

    if (ease != null) {
      t = ease(t);
    }
    command(t);

    const complete = elapsedTime >= commandDuration;
    if (operation === CommandOperation.FastForward) {
      elapsedTime = 0.0;
    } else if (complete) {
      deltaTime = elapsedTime - commandDuration;
      elapsedTime = 0.0;
    } else {
      deltaTime = 0.0;
    }
    return { deltaTime, complete };
  };
}

/**
 * A Wait command does nothing until duration has elapsed
 * @property commandDuration The duration of time, in seconds, to wait. Must be greater than 0.
 */
export function waitForSeconds(commandDuration: number): Command {
  checkDurationGreaterThanZero(commandDuration);
  let elapsedTime = 0.0;
  return (deltaTime, operation) => {
    if (operation === CommandOperation.FastForward) {
      elapsedTime = 0.0;
      return { deltaTime, complete: true };
    }
    elapsedTime += deltaTime;
    deltaTime = 0.0;
    const complete = elapsedTime >= commandDuration;
    if (complete) {
      deltaTime = elapsedTime - commandDuration;
      elapsedTime = 0.0;
    }
    return { deltaTime, complete };
  };
}

/**
 * Waits a specified number of calls to update. This ignores time althogether.
 * @param frameCount The number of frames to wait. Must be > 0.
 */
export function waitForFrames(frameCount: number): Command {
  frameCount = Math.ceil(frameCount);
  if (frameCount <= 0) {
    throw RangeError('frameCount must be > 0.');
  }
  let counter = frameCount;
  return (deltaTime, operation) => {
    if (operation === CommandOperation.FastForward) {
      return { deltaTime, complete: true };
    }
    if (counter > 0) {
      --counter;
      deltaTime = 0;
      return { deltaTime, complete: false };
    }
    counter = frameCount;
    return { deltaTime, complete: true };
  };
}

/**
 * A parallel command executes several commands in parallel. It finishes
 * when the last command has finished.
 * @param commands The commands to execute.
 */
export function parallel(...commands: Command[]): Command {
  // Optimization.
  if (commands.length === 0) {
    return none();
  }
  if (commands.length === 1) {
    return commands[0];
  }

  const finishedCommands = [...Array(commands.length)].fill(false);

  return (deltaTime, operation) => {
    let complete = true;
    let smallestDeltaTime = deltaTime;
    for (let i = 0; i < commands.length; ++i) {
      if (finishedCommands[i]) {
        continue;
      }
      const result = callCommand(commands[i], deltaTime, operation);
      finishedCommands[i] = result.complete;
      complete = commands && result.complete;
      smallestDeltaTime = Math.min(result.deltaTime, smallestDeltaTime);
    }

    if (complete) {
      finishedCommands.fill(false);
    }
    deltaTime = smallestDeltaTime;
    return { deltaTime, complete };
  };
}

/**
 * A sequence command executes several commands sequentially.
 * @param commands A parameter list of commands to execute sequentially.
 */
export function sequence(...commands: Command[]): Command {
  // Optimization.
  if (commands.length === 0) {
    return none();
  }
  if (commands.length === 1) {
    return commands[0];
  }

  let index = 0;
  return (deltaTime, operation) => {
    let complete = true;
    while (complete) {
      const result = callCommand(commands[index], deltaTime, operation);
      deltaTime = result.deltaTime;
      complete = result.complete;
      if (complete) {
        index += 1;
      }
      if (index === commands.length) {
        index = 0;
        return result;
      }
    }
    return { complete, deltaTime };
  };
}

/**
 * The repeat command repeats a delegate a given number of times.
 * @param repeatCount The number of times to repeat the given command. Must be > 0.
 * @param commands The commands to repeat. All of the basic commands are repeatable without side-effects.
 */
export function repeat(repeatCount: number, ...commands: Command[]): Command {
  if (repeatCount <= 0) {
    throw new RangeError('repeatCount must be > 0.');
  }
  const seq = sequence(...commands);
  let count = 0;
  return (deltaTime, operation) => {
    let complete = true;
    while (complete && count < repeatCount) {
      const result = callCommand(seq, deltaTime, operation);
      deltaTime = result.deltaTime;
      complete = result.complete;
      if (complete) {
        count++;
      }
    }
    count %= repeatCount;
    return { complete, deltaTime };
  };
}

/**
 * Repeats a command forever. Make sure that the commands you are repeating will consume some time, otherwise this will
 * create an infinite loop.
 * @param commands The commands to execute.
 */
export function repeatForever(...commands: Command[]): Command {
  const seq = sequence(...commands);
  return (deltaTime, operation) => {
    let complete = true;
    while (complete) {
      const result = callCommand(seq, deltaTime, operation);
      complete = result.complete;
      deltaTime = result.deltaTime;
    }
    return { complete, deltaTime };
  };
}

/**
 * Creates a command which runs a coroutine.
 * @param command The command to generate the coroutine.
 * @description
 * Coroutines, (also known as generators in ES6), are methods which can be paused/resumed using the `yield` operator.
 * @example
 *
 * const queue = new CommandQueue();
 *
 * function *coroutineWithNoArguments() {
 *   yield return waitForSeconds(2.0);
 * }
 *
 * function *coroutineWithArguments(firstVal: number, secondVal: number, thirdVal: number) {
 *   console.log(firstVal);
 *   yield waitForSeconds(1.0); // You can return any Command here.
 *   console.log(secondValue);
 *   yield; // Wait a single frame.
 *   console.log(thirdVal);
 * }
 *
 * queue.enqueue(
 *   coroutine(coroutineWithNoArguments),
 *   coroutine(() => coroutineWithArguments(1, 2, 3))
 * );
 */
export function coroutine(command: CommandCoroutine): Command {
  let iterator: CommandIterator | undefined;
  let currentCommand: Command | undefined;

  return (deltaTime, operation) => {
    // Create our coroutine, if we don't have one.
    if (iterator === undefined) {
      iterator = command();
      // Finish if we couldn't create a coroutine.
      if (iterator === undefined) {
        return { complete: true, deltaTime };
      }
    }

    let complete = true;
    while (complete) {
      // Set the current command.
      if (currentCommand === undefined) {
        const { done, value } = iterator.next();
        if (done) {
          iterator = undefined;
          return { complete: true, deltaTime };
        }
        currentCommand = value;
        if (currentCommand === undefined) {
          // Yield return null will wait a frame, like with
          // Unity coroutines.
          currentCommand = waitForFrames(1);
        }
      }
      const result = callCommand(currentCommand, deltaTime, operation);
      complete = result.complete;
      deltaTime = result.deltaTime;
      if (complete) {
        currentCommand = undefined;
      }
    }
    return { complete, deltaTime };
  };
}

/**
 * Chooses a random child command to perform. Re-evaluated on repeat.
 * @param commands
 * A list of commands to choose from at random. Only one command will be performed.
 * Undefined commands can be passed. At least one command must be specified.
 */
export function chooseRandom(...commands: (Command | undefined)[]): Command {
  if (commands.length === 0) {
    throw RangeError('Must have at least one command parameter.');
  }
  return defer(() => {
    const index = Math.floor(Math.random() * commands.length) % commands.length;
    const result = commands[index];
    return result === undefined ? none() : result;
  });
}

/// <summary>
/// Defers the creation of the Command until just before the point of execution.
/// </summary>
/// <param name="deferredCommand">
/// The action which will create the CommandDelegate.
/// This must not be null, but it can return a null CommandDelegate.
/// </param>
export function defer(commandDeferred: CommandFactory): Command {
  let command: Command | undefined;
  return sequence(
    () => {
      command = commandDeferred();
    },
    (deltaTime, operation) => {
      if (command !== undefined) {
        return command(deltaTime, operation);
      }
      return { complete: true, deltaTime };
    }
  );
}

/**
 * Consumes all the time from the current update, but let's execution continue.
 * Useful for compensating for loading bumps.
 */
export function consumeTime(): Command {
  return (deltaTime, operation) => {
    if (operation === CommandOperation.FastForward) {
      return { complete: true, deltaTime };
    }
    deltaTime = Number.EPSILON < deltaTime ? Number.EPSILON : deltaTime;
    return { complete: true, deltaTime };
  };
}

/**
 *  Slows down, or increases the rate at which time flows through the given subcommands.
 * @param dilationAmount
 * The scale of the dilation to perform. For instance, a dilationAmount
 * of 2 will make time flow twice as quickly. This number must be greater than 0.
 * @param commands A list of commands to choose to dilate time for.
 */
export function dilateTime(dilationAmount: number, ...commands: Command[]): Command {
  if (dilationAmount <= 0.0) {
    throw RangeError('dilationAmount must be greater than 0');
  }
  const command = sequence(...commands);
  return (deltaTime, operation) => {
    const newDelta = deltaTime * dilationAmount;
    const result = callCommand(command, newDelta, operation);
    deltaTime = result.deltaTime / dilationAmount;
    return { ...result, deltaTime };
  };
}

function checkDurationGreaterThanZero(durationAmount: number) {
  if (durationAmount <= 0.0) {
    throw RangeError('duration must be > 0');
  }
}

function checkDurationGreaterThanOrEqualToZero(durationAmount: number) {
  if (durationAmount < 0.0) {
    throw RangeError('duration must be >= 0');
  }
}

function callCommand(command: Command, deltaTime: number, operation: CommandOperation): CommandState {
  const state = command(deltaTime, operation);
  if (state !== undefined) {
    return state;
  }
  return {
    deltaTime,
    complete: true
  };
}
