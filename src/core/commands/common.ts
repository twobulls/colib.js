import { Ease } from '../ease';

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
 * A interval command is executed over a period of time. The value t is normalized from 0 to 1.
 */
export type CommandInterval = (t: number) => void;

/**
 * A command factory creates a command.
 */
export type CommandFactory = () => Command;

export type CommandIterator = IterableIterator<Command | undefined>;
/**
 * A coroutine command uses generators to produce a sequence of commands over time.
 * ```typescript
 * function *aCoroutine(): CommandIterator {
 *    yield wait(5);
 *    console.log("Now this is called");
 *    yield interval(t => console.log(t), 10);
 *    console.log("This is also called");
 * }
 * ```
 */
export type CommandCoroutine = () => CommandIterator;

/**
 * Interruptable commands are useful for situations where a command is waiting for an external action to finish,
 * but a queue running the command wants to fast foward. For example, consider a command to play an audio clip.
 * The command starts the Audio, then polls waiting for it to finish. Suddenly a queue  running the command
 * is told to runToEnd. In this case, the onInterrupt action is called, which stops the audio source and performs
 * cleanup. The command then finishes, and the queue continues.
 * @param command The command to make interruptable
 * @param onInterrupt The action to perform if the
 * ```typescript
 * const queue = new CommandQueue();
 * const audioPlayer = new AudioPlayer(audioClip);
 * queue.push(
 *  interruptable(
 *    defer(() => {
 *      console.log('Playing');
 *      audioPlayer.play();
 *      return waitForTime(audioClip.length);
 *    }, () => {
 *      console.log('Stopped');
 *      audioPlayer.stop();
 *    })
 * );
 * queue.update(1.0); // Playing
 * queue.runToEnd(); // Stopped
 * ```
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
 * A command which does nothing. Can be useful as a return value.
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *   none(),
 *   () => { console.log('called'); }
 * );
 * queue.update(0); // Called
 * ```
 */
export function none(): Command {
  return (deltaTime, _) => ({ deltaTime, complete: true });
}

/**
 * Runs a command over an interval of time.
 * @param command The command to execute.
 * @param duration The duration of time to apply the command over. Must be greater than or equal to 0.
 * @param ease An easing function to apply to the t parameter of a CommandDuration. If undefined, linear easing is used.
 * ```typescript
 * const DURATION = 5;
 * const queue = new CommandQueue();
 * queue.push(
 *  interval(t => { console.log(t); }, DURATION)
 * );
 * queue.update(1); // 0.2
 * queue.update(2); // 0.6
 * queue.update(2); // 1
 * ```
 */
export function interval(command: CommandInterval, duration: number, ease?: Ease): Command {
  checkDurationGreaterThanOrEqualToZero(duration);
  if (duration === 0.0) {
    // Sometimes it is convenient to create duration commands with
    // a time of zero, so we have a special case.
    return (deltaTime, operation) => {
      command(1);
      return { deltaTime, complete: true };
    };
  }

  let elapsedTime = 0.0;

  return (deltaTime, operation) => {
    elapsedTime += deltaTime;

    let t = elapsedTime / duration;
    t = Math.max(0, Math.min(t, 1));

    if (operation === CommandOperation.FastForward) {
      t = 1;
    }

    if (ease !== undefined && t !== 1) {
      t = ease(t);
    }
    command(t);

    const complete = elapsedTime >= duration;
    if (operation === CommandOperation.FastForward) {
      elapsedTime = 0.0;
    } else if (complete) {
      deltaTime = elapsedTime - duration;
      elapsedTime = 0.0;
    } else {
      deltaTime = 0.0;
    }
    return { deltaTime, complete };
  };
}

/**
 * Waits until a given amount of time has elapsed.
 * @param duration The duration of time to wait. Must be greater than or equal to 0.
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *    waitForTime(10),
 *    () => { console.log('called'); }
 * );
 * queue.update(5);
 * queue.update(5); // called
 * ```
 */
export function waitForTime(duration: number): Command {
  checkDurationGreaterThanOrEqualToZero(duration);
  if (duration === 0) {
    return none();
  }
  let elapsedTime = 0.0;
  return (deltaTime, operation) => {
    if (operation === CommandOperation.FastForward) {
      elapsedTime = 0.0;
      return { deltaTime, complete: true };
    }
    elapsedTime += deltaTime;
    deltaTime = 0.0;
    const complete = elapsedTime >= duration;
    if (complete) {
      deltaTime = elapsedTime - duration;
      elapsedTime = 0.0;
    }
    return { deltaTime, complete };
  };
}

/**
 * Waits a specified number of calls to update. This ignores time althogether.
 * @param frameCount The number of frames to wait. Must be > 0.
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *    waitForFrames(2),
 *    () => { console.log('called'); }
 * );
 * queue.update(1000);
 * queue.update(1000);
 * queue.update(0); // called
 * ```
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
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *    parallel(
 *     () => { console.log('called 1'); }
 *     waitForTime(1),
 *     () => { console.log('called 2'); }
 *   )
 * );
 * queue.update(0); // 'called 1' 'called 2'
 * ```
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
      complete = complete && result.complete;
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
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *   sequence(
 *     waitForTime(1),
 *     () => { console.log('called'); }
 *   )
 * );
 * queue.update(1); // 'called'
 * ```
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
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *   repeat(3,
 *     () => {console.log('called'); }
 *   )
 * );
 * queue.update(10); // 'called' x 3
 * ```
 */
export function repeat(repeatCount: number, ...commands: Command[]): Command {
  if (repeatCount < 0) {
    throw new RangeError('repeatCount must be >= 0.');
  }
  if (repeatCount === 0) {
    return none();
  }
  const seq = sequence(...commands);
  if (repeatCount === 1) {
    return seq;
  }

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
 * create an infinite loop. RepeatForever can be escaped by calling `runToEnd` on the `CommandQueue`, or using
 * `CommandOperation.FastForward`.
 * @param commands The commands to execute.
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *   repeatForever(
 *     waitForTime(1),
 *     () => { console.log('called'); }
 *   )
 * );
 * queue.update(10); // 'called' x 10
 * queue.runToEnd(); // repeatForever will be forced to complete
 * ```
 */
export function repeatForever(...commands: Command[]): Command {
  const seq = sequence(...commands);
  return (deltaTime, operation) => {
    let complete = true;
    do {
      const result = callCommand(seq, deltaTime, operation);
      complete = result.complete;
      deltaTime = result.deltaTime;
    } while (complete && operation !== CommandOperation.FastForward);
    if (complete && operation === CommandOperation.FastForward) {
      complete = true;
    }
    return { complete, deltaTime };
  };
}

/**
 * Creates a command which runs a coroutine.
 * @param command The command to generate the coroutine.
 * @description
 * Coroutines, (also known as generators in ES6), are methods which can be paused/resumed using the `yield` operator.
 * ```typescript
 *
 * const queue = new CommandQueue();
 *
 * function *coroutineWithNoArguments() {
 *   yield return waitForTime(2.0);
 * }
 *
 * function *coroutineWithArguments(firstVal: number, secondVal: number, thirdVal: number) {
 *   console.log(firstVal);
 *   yield waitForTime(1.0); // You can return any Command here.
 *   console.log(secondValue);
 *   yield; // Wait a single frame.
 *   console.log(thirdVal);
 * }
 *
 * queue.push(
 *   coroutine(coroutineWithNoArguments),
 *   coroutine(() => coroutineWithArguments(1, 2, 3))
 * );
 * ```
 */
export function coroutine(command: CommandCoroutine): Command {
  let iterator: CommandIterator | undefined;
  let currentCommand: Command | undefined;

  return (deltaTime, operation) => {
    // Create our coroutine, if we don't have one.
    if (iterator === undefined) {
      iterator = command();
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
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *  chooseRandom(
 *    () => { console.log('a'); },
 *    () => { console.log('b'); },
 *    () => { console.log('c'); }
 *  )
 * );
 * queue.update(0); // 'a' or 'b' or 'c'
 * ```
 */
export function chooseRandom(...commands: (Command | undefined)[]): Command {
  if (commands.length === 0) {
    return none();
  }
  return defer(() => {
    const index = Math.floor(Math.random() * commands.length) % commands.length;
    const result = commands[index];
    return result === undefined ? none() : result;
  });
}

/**
 * Defers the creation of the Command until just before the point of execution.
 * @param commandDeferred The action which will create the Command.
 * ```typescript
 * const queue = new CommandQueue();
 * let loopCount = 0;
 * queue.push(
 *  repeat(3,
 *    defer( () => {
 *      console.log(`Loop ${loopCount}`);
 *      loopCount += 1;
 *      return waitForTime(loopCount);
 *    })
 *  )
 * );
 * queue.update(0); // "Loop 0"
 * queue.update(1); // "Loop 1"
 * queue.update(2); // "Loop 2"
 * ```
 */
export function defer(commandDeferred: CommandFactory): Command {
  let command: Command = none();
  return sequence(
    () => {
      command = commandDeferred();
    },
    (deltaTime, operation) => {
      return command(deltaTime, operation);
    }
  );
}

/**
 * Consumes all the time from the current update, but let's execution continue.
 * Useful for compensating for loading bumps.
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *  consumeTime(),
 *  waitForTime(0.1),
 *  () => { console.log('called'); }
 * );
 * queue.update(1000); // Nothing
 * queue.update(0.1); // "called"
 * ```
 */
export function consumeTime(): Command {
  return () => {
    return { complete: true, deltaTime: 0 };
  };
}

/**
 * Slows down, or increases the rate at which time flows through the given subcommands.
 * @param dilationAmount
 * The scale of the dilation to perform. For instance, a dilationAmount
 * of 2 will make time flow twice as quickly. This number must be greater than 0.
 * @param commands A list of commands to choose to dilate time for.
 * ```typescript
 * const queue = new CommandQueue();
 * queue.push(
 *  dilateTime(2,
 *    waitForTime(1),
 *    () => { console.log('called'); }
 *  )
 * );
 * queue.update(0.5); // "called"
 * ```
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
