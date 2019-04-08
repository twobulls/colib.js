import { CommandQueue } from './command-queue';
import { repeat, waitForSeconds, CommandOperation, interval, repeatForever } from './commands';

describe('CommandQueue', () => {
  it('calls commands in sequence', () => {
    const queue = new CommandQueue();

    let lastCalled = '';
    queue.enqueue(
      () => {
        expect(lastCalled).toEqual('');
        lastCalled = 'a';
        // Add to the back of the queue, a,b already in queue.
        queue.enqueue(() => {
          expect(lastCalled).toEqual('b');
          lastCalled = 'c';
        });
      },
      () => {
        expect(lastCalled).toEqual('a');
        lastCalled = 'b';
      }
    );
    queue.update(1);
    expect(lastCalled).toEqual('c');
  });

  it('can acculumate time correctly', () => {
    const queue = new CommandQueue();
    queue.enqueue(repeat(1000, waitForSeconds(3)));

    let totalTime = 0.0;
    do {
      totalTime += 0.1;
    } while (!queue.update(0.1));

    const expectedTime = 1000 * 3;
    expect(totalTime).toBeCloseTo(expectedTime);
  });

  it("shouldn't run the next command when paused", () => {
    const queue = new CommandQueue();
    let secondCommandCalled = false;
    queue.enqueue(
      () => {
        queue.paused = true;
      },
      () => {
        secondCommandCalled = true;
      }
    );
    queue.update(1);
    queue.update(1);
    expect(secondCommandCalled).toBeFalsy();
    queue.paused = false;
    queue.update(1);
    expect(secondCommandCalled).toBeTruthy();
  });

  it('should skip when using fast forward mode', () => {
    const queue = new CommandQueue();
    let wasCalled = false;
    queue.enqueue(waitForSeconds(100), () => {
      wasCalled = true;
    });
    queue.update(1, CommandOperation.FastForward);
    expect(wasCalled).toBeTruthy();
  });

  it('should skip when calling runToEnd', () => {
    const queue = new CommandQueue();
    let wasCalled = false;
    queue.enqueue(waitForSeconds(100), () => {
      wasCalled = true;
    });
    queue.runToEnd();
    expect(wasCalled).toBeTruthy();
  });

  it('should throw an error when deltaTime is negative', () => {
    const queue = new CommandQueue();
    expect(() => queue.update(-1)).toThrowError();
  });

  it('should throw an error when update is called while queue is already updating', () => {
    const queue = new CommandQueue();
    queue.enqueue(() => {
      queue.update(1);
    });
    expect(() => queue.update(1)).toThrowError();
  });

  it('should process the next command without changing time', () => {
    const queue = new CommandQueue();
    let lastT = -1;
    queue.enqueue(
      interval(t => {
        lastT = t;
      }, 3)
    );

    queue.process();
    expect(lastT).toBe(0);
  });

  it('should be safe to call process while the queue is updating', () => {
    const queue = new CommandQueue();
    queue.enqueue(
      interval(t => {
        queue.process();
      }, 3)
    );
    expect(() => queue.update(1)).not.toThrowError();
  });

  it('time is stable over long durations', () => {
    const queue = new CommandQueue();
    let count = 0;
    queue.enqueue(
      repeatForever(waitForSeconds(20), () => {
        count++;
      })
    );

    for (let i = 0; i < 100000; ++i) {
      queue.update(0.1);
    }
    expect(count).toEqual(500);
  });
});
