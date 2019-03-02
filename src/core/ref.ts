/**
 * `Ref` captures a variable using closure functions.
 */
export class Ref<T> {
  get value(): T {
    return this.getter();
  }

  set value(val: T) {
    this.setter(val);
  }

  /**
   * Captures a reference to a property on an object. Setting/getting the value of the resultant `Ref` will read/write
   * to the original property.
   * @param object The object to capture the reference from.
   * @param property The property to capture the reference of.
   */
  static from<T, C extends keyof T>(object: T, property: C): Ref<T[C]> {
    const getter = () => object[property];
    const setter = (val: T[C]) => (object[property] = val);
    return new Ref(getter, setter);
  }

  static create<T>(val: T): Ref<T> {
    return new Ref(
      () => val,
      v => {
        val = v;
      }
    );
  }

  /**
   * Create a new `Ref`.
   * @param getter The getter to use for variable access
   * @param setter The setter to use for variable assignment;
   */
  constructor(private getter: () => T, private setter: (val: T) => void) {}
}
