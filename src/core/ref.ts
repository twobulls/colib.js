/**
 * `Ref` captures a variable using functions, so it can be passed around and mutated easily.
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
   *
   * ```typescript
   * const myObj = { a: 10 };
   * const ref = Ref.from(myObj, 'a');
   * ref.value = 100;
   * console.log(myObj.a); // 100
   * ```
   *
   * @param object The object to capture the reference from.
   * @param property The property to capture the reference of.
   * @typeparam T The type of the object to capture a reference from.
   * @typeparam C The name of the property to capture.
   * @returns A reference to a property on an object.
   */
  static from<T, C extends keyof T>(object: T, property: C): Ref<T[C]> {
    const getter = () => object[property];
    const setter = (val: T[C]) => (object[property] = val);
    return new Ref(getter, setter);
  }

  /**
   * Creates a reference initialized to a value.
   *
   * ```typescript
   * const ref = Ref.create(10);
   * ref.value = 100;
   * console.log(ref.value); // 100
   * ```
   *
   * @param val The initial value to capture
   * @typeparam The type of the value.
   */
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
   *
   * ```typescript
   * let a = 10;
   * const ref = new Ref( () => a, (val) => { a = val; });
   * ref.value = 100;
   * console.log(a); // 100
   * ```
   *
   * @param getter The getter to use for variable access
   * @param setter The setter to use for variable assignment;
   * @typeparam T The type of the value to capture.
   */
  constructor(private getter: () => T, private setter: (val: T) => void) {}
}
