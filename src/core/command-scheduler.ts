import { LinkedList } from './../data-stucture/linked-list';
import { CommandQueue } from './command-queue';
import { Command } from './commands';

export class CommandScheduler {
  /**
   * Gets or sets a value indicating whether this `CommandScheduler` is paused.
   */
  paused = false;

  private _queues = new LinkedList();

  add(command: Command) {
    const queue = new CommandQueue();
    queue.enqueue(command);
    this._queues.addToTail(queue);
  }

  update(deltaTime: number) {
    if (deltaTime < 0.0) {
      throw RangeError('deltaTime is expected to be positive.');
    }
    if (!this.paused) {
      let linkedNode = this._queues.head;
      while (linkedNode) {
        const next = linkedNode.next;
        const finished = linkedNode.value.update(deltaTime);
        if (finished) {
          this._queues.removeHead();
        }
        linkedNode = next;
      }
    }
  }
}
