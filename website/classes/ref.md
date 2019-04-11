[colib](../README.md) > [Ref](../classes/ref.md)

# Class: Ref

`Ref` captures a variable using functions, so it can be passed around and mutated easily.

## Type parameters

#### T

## Hierarchy

**Ref**

## Index

### Constructors

- [constructor](ref.md#markdown-header-constructor)

### Accessors

- [value](ref.md#markdown-header-value)

### Methods

- [create](ref.md#markdown-header-Static-create)
- [from](ref.md#markdown-header-Static-from)

---

## Constructors

### constructor

⊕ **new Ref**(getter: _`function`_, setter: _`function`_): [Ref](ref.md)

_Defined in ref.ts:55_

Create a new `Ref`.

```typescript
let a = 10;
const ref = new Ref(
  () => a,
  val => {
    a = val;
  }
);
ref.value = 100;
console.log(a); // 100
```

_**typeparam**_: The type of the value to capture.

**Parameters:**

| Name   | Type       | Description                                |
| ------ | ---------- | ------------------------------------------ |
| getter | `function` | The getter to use for variable access      |
| setter | `function` | The setter to use for variable assignment; |

**Returns:** [Ref](ref.md)

---

## Accessors

### value

**get value**(): `T`

**set value**(val: _`T`_): `void`

_Defined in ref.ts:5_

**Returns:** `T`

_Defined in ref.ts:9_

**Parameters:**

| Name | Type |
| ---- | ---- |
| val  | `T`  |

**Returns:** `void`

---

## Methods

### `<Static>` create

▸ **create**<`T`>(val: _`T`_): [Ref](ref.md)<`T`>

_Defined in ref.ts:48_

Creates a reference initialized to a value.

```typescript
const ref = Ref.create(10);
ref.value = 100;
console.log(ref.value); // 100
```

_**typeparam**_: type of the value.

**Type parameters:**

#### T

**Parameters:**

| Name | Type | Description                  |
| ---- | ---- | ---------------------------- |
| val  | `T`  | The initial value to capture |

**Returns:** [Ref](ref.md)<`T`>

---

### `<Static>` from

▸ **from**<`T`,`C`>(object: _`T`_, property: _`C`_): [Ref](ref.md)<`T[C]`>

_Defined in ref.ts:30_

Captures a reference to a property on an object. Setting/getting the value of the resultant `Ref` will read/write to the original property.

```typescript
const myObj = { a: 10 };
const ref = Ref.from(myObj, 'a');
ref.value = 100;
console.log(myObj.a); // 100
```

**Type parameters:**

#### T

The type of the object to capture a reference from.

#### C : `keyof T`

The name of the property to capture.

**Parameters:**

| Name     | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| object   | `T`  | The object to capture the reference from. |
| property | `C`  | The property to capture the reference of. |

**Returns:** [Ref](ref.md)<`T[C]`>
A reference to a property on an object.

---
