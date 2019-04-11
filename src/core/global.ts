import { CommandScheduler } from './command-scheduler';
import { BrowserRunner } from './browser/browser-runner';
import { NodeRunner } from './node';
import { CommandQueueGroup } from './command-queue-group';

const MAX_DELTA_TIME_MS = 1000;

let globalRunner: Runner | undefined;

interface Runner {
  scheduler: CommandScheduler;
  queueGroup: CommandQueueGroup;
  cancel(): void;
}

/**
 * @param maxDeltaTime The most amount of time the global scheduler can update by between frames.
 * In the browser, this is useful to prevent animations fast forwarding when resuming a backgrounded tab.
 *
 * ```typescript
 * const scheduler = globalScheduler();
 * const queue = scheduler.add(() => {
 *  console.log("Hello");
 * });
 * ```
 *
 * @returns A global, shared `CommandScheduler` for the current environment.
 */
export function globalScheduler(maxDeltaTime = MAX_DELTA_TIME_MS): CommandScheduler {
  return getRunner(maxDeltaTime).scheduler;
}

/**
 * @param maxDeltaTime The most amount of time the global scheduler can update by between frames.
 * In the browser, this is useful to prevent animations fast forwarding when resuming a backgrounded tab.
 *
 * ```typescript
 * const queueGroup = globalQueueGroup();
 * const queue = queueGroup.createQueue();
 * ```
 *
 * @returns A global, shared `CommandQueueGroup` for the current environment.
 */
export function globalQueueGroup(maxDeltaTime = MAX_DELTA_TIME_MS): CommandQueueGroup {
  return getRunner().queueGroup;
}

/**
 * Cancels all commands currently running on the `globalScheduler` and `globalQueueGroup`.
 */
export function cancelGlobalCommands() {
  if (globalRunner !== undefined) {
    globalRunner.cancel();
    globalRunner = undefined;
  }
}

function getRunner(maxDeltaTime = MAX_DELTA_TIME_MS): Runner {
  if (globalRunner === undefined) {
    if (window === undefined) {
      globalRunner = new NodeRunner(maxDeltaTime);
    } else {
      globalRunner = new BrowserRunner(maxDeltaTime);
    }
  }
  return globalRunner;
}
