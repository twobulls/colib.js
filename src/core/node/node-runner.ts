import { CommandScheduler } from '../command-scheduler';
import { CommandQueueGroup } from '../command-queue-group';

export class NodeRunner {
  readonly scheduler = new CommandScheduler();
  readonly queueGroup = new CommandQueueGroup();

  private lastTimestamp: DOMHighResTimeStamp;
  private immediate: NodeJS.Immediate | undefined;

  constructor(private maxDeltaTime: number) {
    this.lastTimestamp = performance.now();
    this.immediate = setImmediate(t => this.animationCallback(performance.now()));
  }

  cancel() {
    if (this.immediate !== undefined) {
      clearImmediate(this.immediate);
      this.immediate = undefined;
    }
  }

  private animationCallback(timestamp: DOMHighResTimeStamp) {
    const delta = Math.min(timestamp - this.lastTimestamp, this.maxDeltaTime) / 1000;
    this.lastTimestamp = timestamp;
    this.scheduler.update(delta);
    this.queueGroup.update(delta);

    this.immediate = setImmediate(() => this.animationCallback(performance.now()));
  }
}
