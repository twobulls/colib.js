import { CommandQueueGroup } from './command-queue-group';
import { CommandQueue } from './command-queue';
import { waitForFrames } from './commands';

describe('CommandQueueGroup', () => {
  it('will call update on a created queue', () => {
    const group = new CommandQueueGroup();
    const newQueue = group.createQueue();
    let called = false;

    newQueue.push(() => {
      called = true;
    });
    group.update(0.0);
    expect(called).toBeTruthy();
  });
  it('will call update on an added queue', () => {
    const group = new CommandQueueGroup();
    const queue = new CommandQueue();
    group.addQueue(queue);
    let called = false;

    queue.push(() => {
      called = true;
    });

    group.update(0.0);
    expect(called).toBeTruthy();
  });
  it("won't let an added queue be called twice", () => {
    const group = new CommandQueueGroup();
    const queue = group.createQueue();
    group.addQueue(queue);
    let calledCount = 0;

    queue.push(
      () => {
        calledCount++;
      },
      waitForFrames(1),
      () => {
        calledCount++;
      }
    );

    group.update(0.0);
    expect(calledCount).toBe(1);
  });

  it('will let a queue be removed immediately after it has been added', () => {
    const group = new CommandQueueGroup();
    const queue = group.createQueue();
    group.removeQueue(queue);
    let calledCount = 0;

    queue.push(() => {
      calledCount++;
    });

    group.update(0.0);
    expect(calledCount).toBe(0);
  });

  it('will let a queue be removed while the group is updating', () => {
    const group = new CommandQueueGroup();
    const queue = group.createQueue();
    let calledCount = 0;

    queue.push(
      () => {
        calledCount++;
        group.removeQueue(queue);
      },
      waitForFrames(1),
      () => {
        calledCount++;
      }
    );

    group.update(0.0);
    group.update(0.0);

    expect(calledCount).toBe(1);
  });

  it('will let a queue be added while the group is updating', () => {
    const group = new CommandQueueGroup();
    const queue = group.createQueue();
    let calledCount = 0;

    queue.push(() => {
      calledCount++;
      group.createQueue().push(() => {
        calledCount++;
      });
    });

    group.update(0.0);

    expect(calledCount).toBe(2);
  });

  it("will let a queue be added, after it's been removed and already ran once", () => {
    const group = new CommandQueueGroup();
    const queue = group.createQueue();
    group.update(0);

    let calledCount = 0;

    queue.push(() => {
      calledCount++;
      group.createQueue().push(() => {
        calledCount++;
      });
    });

    group.removeQueue(queue);
    group.addQueue(queue);
    group.update(0);

    expect(calledCount).toBe(2);
  });
});
