import { CommandScheduler } from './command-scheduler';
import { waitForTime } from './commands';

describe('CommandScheduler', () => {
  it('executes parallel commands in order they were added', () => {
    const scheduler = new CommandScheduler();
    const vals: string[] = [];
    scheduler.add(() => {
      vals.push('a');
    });
    scheduler.add(() => {
      vals.push('b');
    });
    scheduler.add(() => {
      vals.push('c');
    });

    scheduler.update(1);
    expect(vals).toEqual(['a', 'b', 'c']);
  });

  it('executes commands in parallel', () => {
    const scheduler = new CommandScheduler();
    const vals: string[] = [];

    scheduler.add(waitForTime(1), () => {
      vals.push('a');
    });
    scheduler.add(waitForTime(2), () => {
      vals.push('b');
    });
    scheduler.add(waitForTime(3), () => {
      vals.push('c');
    });

    scheduler.update(1);
    expect(vals).toEqual(['a']);
    scheduler.update(1);
    expect(vals).toEqual(['a', 'b']);
    scheduler.update(1);
    expect(vals).toEqual(['a', 'b', 'c']);
  });

  it('handles adding no commands gracefully', () => {
    const scheduler = new CommandScheduler();
    expect(() => scheduler.add()).not.toThrowError();
  });

  it('throws an error if deltaTime is less than 0', () => {
    const scheduler = new CommandScheduler();
    expect(() => scheduler.update(-1)).toThrowError();
  });

  it("won't execute anything if the scheduler is paused", () => {
    const scheduler = new CommandScheduler();
    const vals: string[] = [];

    scheduler.add(waitForTime(1), () => {
      vals.push('a');
    });

    scheduler.paused = true;
    scheduler.update(1);
    expect(vals).toEqual([]);
  });
});
