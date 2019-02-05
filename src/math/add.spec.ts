import { add } from './add';

describe('add', () => {
  it('adds two positive numbers', () => {
    const output = add(1, 2);
    expect(output).toBe(3);
  });
});
