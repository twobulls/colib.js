import { sub } from './sub';

describe('sub', () => {
  it('subs two positive numbers', () => {
    const output = sub(1, 2);
    expect(output).toBe(-1);
  });
});
