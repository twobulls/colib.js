import { CommandQueue } from './command-queue';
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

export function globalScheduler(maxDeltaTime = MAX_DELTA_TIME_MS): CommandScheduler {
  return getRunner().scheduler;
}

export function globalQueueGroup(maxDeltaTime = MAX_DELTA_TIME_MS): CommandQueueGroup {
  return getRunner().queueGroup;
}

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
