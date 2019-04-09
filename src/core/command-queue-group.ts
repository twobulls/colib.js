import { CommandQueue } from './command-queue';

export class CommandQueueGroup {
  private newQueues: CommandQueue[] = [];
  private queuesToRemove: CommandQueue[] = [];
  private queues: CommandQueue[] = [];

  /**
   * Creates a queue, which will be updated by the group.
   */
  createQueue() {
    const queue = new CommandQueue();
    this.addQueue(queue);
    return queue;
  }

  /**
   * Adds the queue, to be updated by the group.
   *
   * ```typescript
   * const group = new CommandQueueGroup();
   * const queue = new CommandQueue();
   * group.addQueue(queue);
   * queue.push(
   *   () => { console.log('called'); }
   * );
   * group.update(1.0); // 'called'
   * ```
   *
   * @param queue The `CommandQueue` for the behaviour to update.
   */
  addQueue(queue: CommandQueue) {
    const newQueuesIndex = this.newQueues.indexOf(queue);
    const queuesIndex = this.queues.indexOf(queue);
    const queuesToRemoveIndex = this.queuesToRemove.indexOf(queue);

    if (newQueuesIndex === -1 && queuesIndex === -1) {
      this.newQueues.push(queue);
    }
    if (queuesToRemoveIndex !== -1) {
      this.queuesToRemove.splice(queuesToRemoveIndex, 1);
    }
  }

  /**
   * Removes a queue the group.
   *
   * ```typescript
   * const group = new CommandQueueGroup();
   * const queue = new CommandQueue();
   * group.addQueue(queue);
   * queue.push(
   *   () => { console.log('called'); }
   * );
   * group.removeQueue(queue);
   * group.update(1.0); // Nothing
   * ```
   *
   * @param queue The CommandQueue to remove. This queue should have been created, or added to this behaviour already.
   */
  removeQueue(queue: CommandQueue) {
    const newQueuesIndex = this.newQueues.indexOf(queue);
    const queuesIndex = this.queues.indexOf(queue);
    const queuesToRemoveIndex = this.queuesToRemove.indexOf(queue);

    if (queuesIndex !== -1 && queuesToRemoveIndex === -1) {
      this.queuesToRemove.push(queue);
    }
    if (newQueuesIndex !== -1) {
      this.newQueues.splice(newQueuesIndex, 1);
    }
  }

  /**
   * Updates all the queues in the group by the specified deltaTime.
   *
   * ```typescript
   * const group = new CommandQueueGroup();
   * const queue = new CommandQueue();
   * group.addQueue(queue);
   * queue.push(
   *   () => { console.log('called'); }
   * );
   * group.update(1.0); // 'called'
   * ```
   *
   * @param deltaTime The amount of time to update all the queues by.
   */
  update(deltaTime: number) {
    const queuesToUpdate = [...this.queues];
    do {
      this.queues.push(...this.newQueues);
      queuesToUpdate.push(...this.newQueues);

      for (const queueToRemove of this.queuesToRemove) {
        this.queues.splice(this.queues.indexOf(queueToRemove), 1);
        queuesToUpdate.splice(queuesToUpdate.indexOf(queueToRemove), 1);
      }

      this.newQueues.length = 0;
      this.queuesToRemove.length = 0;
      const nextQueue = queuesToUpdate.pop();
      if (nextQueue !== undefined) {
        nextQueue.update(deltaTime);
      }
    } while (queuesToUpdate.length > 0 || this.newQueues.length > 0);
  }
}
