import { CommandQueue } from '../command-queue';
import { Ref } from '../ref';
import { changeToNum, changeFromNum, changeToOffsetNum, changeFromOffsetNum, scaleByNum, scaleFromNum } from './number';

describe('changeToNum', () => {
  it('starts at the refs current value', () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(changeToNum(ref, 10, 3));
    queue.process();
    expect(ref.value).toBe(3);
  });

  it('ends at the target value', () => {
    const queue = new CommandQueue();

    const ref = Ref.create(0);
    queue.enqueue(changeToNum(ref, 10, 3));
    queue.update(3);
    expect(ref.value).toBe(10);
  });
});

describe('changeFromNum', () => {
  it('starts at the target value', () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(changeFromNum(ref, 10, 3));
    queue.process();
    expect(ref.value).toBe(10);
  });

  it("ends at the ref's start value", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(changeFromNum(ref, 10, 3));
    queue.update(3);
    expect(ref.value).toBe(3);
  });
});

describe('changeToOffsetNum', () => {
  it("starts at the ref's start value", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(changeToOffsetNum(ref, 10, 3));
    queue.process();
    expect(ref.value).toBe(3);
  });

  it("ends at the ref's start value plus the offset", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(changeToOffsetNum(ref, 10, 3));
    queue.update(3);
    expect(ref.value).toBe(13);
  });
});

describe('changeFromOffsetNum', () => {
  it("starts at the ref's start plus the offset", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(changeFromOffsetNum(ref, 10, 3));
    queue.process();
    expect(ref.value).toBe(13);
  });

  it("ends at the ref's start value", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(changeFromOffsetNum(ref, 10, 3));
    queue.update(3);
    expect(ref.value).toBe(3);
  });
});

describe('scaleByNum', () => {
  it("starts at the ref's start value", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(scaleByNum(ref, 2, 3));
    queue.process();
    expect(ref.value).toBe(3);
  });
  it("ends at the ref's start value times scale factor", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(scaleByNum(ref, 2, 3));
    queue.update(3);
    expect(ref.value).toBe(6);
  });
});

describe('scaleFromNum', () => {
  it("starts at the ref's start value times scale factor", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(scaleFromNum(ref, 2, 3));
    queue.process();
    expect(ref.value).toBe(6);
  });
  it("starts at the ref's start value", () => {
    const queue = new CommandQueue();

    const ref = Ref.create(3);
    queue.enqueue(scaleFromNum(ref, 2, 3));
    queue.update(3);
    expect(ref.value).toBe(3);
  });
});
