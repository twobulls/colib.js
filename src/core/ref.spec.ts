import { Ref } from './ref';

describe('Ref', () => {
  it('calls the getter when reading a value', () => {
    let localVal = 0;
    const ref = new Ref(
      () => localVal,
      val => {
        localVal = val;
      }
    );
    localVal = 10;
    expect(ref.value).toBe(10);
  });
  it('calls the setter when writing a value', () => {
    let localVal = 0;
    const ref = new Ref(
      () => localVal,
      val => {
        localVal = val;
      }
    );
    ref.value = 10;
    expect(localVal).toBe(10);
  });

  it('can write to a caputured object property', () => {
    const obj = {
      a: 10,
      b: 'hello'
    };
    const ref = Ref.from(obj, 'a');
    ref.value = 12;
    expect(obj.a).toBe(12);
  });

  it('can read from a captured object property', () => {
    const obj = {
      a: 10,
      b: 'hello'
    };
    const ref = Ref.from(obj, 'b');
    obj.b = 'world';
    expect(ref.value).toBe('world');
  });

  it('creates shorthand refs quickly', () => {
    const ref = Ref.create(10);
    ref.value = 10;
    expect(ref.value).toBe(10);
  });
});
