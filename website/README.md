# Colib API

## Index

### Enumerations

- [ColorFormat](enums/colorformat.md)
- [ColorLerpMode](enums/colorlerpmode.md)
- [CommandOperation](enums/commandoperation.md)

### Classes

- [CommandQueue](classes/commandqueue.md)
- [CommandQueueGroup](classes/commandqueuegroup.md)
- [CommandScheduler](classes/commandscheduler.md)
- [Ref](classes/ref.md)

### Interfaces

- [ColorHSL](interfaces/colorhsl.md)
- [ColorHSV](interfaces/colorhsv.md)
- [ColorParseResult](interfaces/colorparseresult.md)
- [ColorRGB](interfaces/colorrgb.md)
- [CommandState](interfaces/commandstate.md)
- [WeightedEaseConfig](interfaces/weightedeaseconfig.md)

### Type aliases

- [ColorType](#markdown-header-ColorType)
- [Command](#markdown-header-Command)
- [CommandAct](#markdown-header-CommandAct)
- [CommandCondition](#markdown-header-CommandCondition)
- [CommandCoroutine](#markdown-header-CommandCoroutine)
- [CommandFactory](#markdown-header-CommandFactory)
- [CommandInterval](#markdown-header-CommandInterval)
- [CommandIterator](#markdown-header-CommandIterator)
- [Ease](#markdown-header-Ease)

### Functions

- [averageComposite](#markdown-header-averageComposite)
- [cancelGlobalCommands](#markdown-header-cancelGlobalCommands)
- [ceilStep](#markdown-header-ceilStep)
- [chainComposite](#markdown-header-chainComposite)
- [changeFrom](#markdown-header-changeFrom)
- [changeFromColor](#markdown-header-changeFromColor)
- [changeFromNum](#markdown-header-changeFromNum)
- [changeFromOffset](#markdown-header-changeFromOffset)
- [changeFromOffsetNum](#markdown-header-changeFromOffsetNum)
- [changeTo](#markdown-header-changeTo)
- [changeToColor](#markdown-header-changeToColor)
- [changeToNum](#markdown-header-changeToNum)
- [changeToOffset](#markdown-header-changeToOffset)
- [changeToOffsetNum](#markdown-header-changeToOffsetNum)
- [chooseRandom](#markdown-header-chooseRandom)
- [consumeTime](#markdown-header-consumeTime)
- [coroutine](#markdown-header-coroutine)
- [defer](#markdown-header-defer)
- [dilateTime](#markdown-header-dilateTime)
- [elastic](#markdown-header-elastic)
- [flip](#markdown-header-flip)
- [floorStep](#markdown-header-floorStep)
- [globalQueueGroup](#markdown-header-globalQueueGroup)
- [globalScheduler](#markdown-header-globalScheduler)
- [hermite](#markdown-header-hermite)
- [inBack](#markdown-header-inBack)
- [inBounce](#markdown-header-inBounce)
- [inCirc](#markdown-header-inCirc)
- [inCubic](#markdown-header-inCubic)
- [inElastic](#markdown-header-inElastic)
- [inExpo](#markdown-header-inExpo)
- [inHermite](#markdown-header-inHermite)
- [inOutBack](#markdown-header-inOutBack)
- [inOutBounce](#markdown-header-inOutBounce)
- [inOutCirc](#markdown-header-inOutCirc)
- [inOutCubic](#markdown-header-inOutCubic)
- [inOutEase](#markdown-header-inOutEase)
- [inOutElastic](#markdown-header-inOutElastic)
- [inOutExpo](#markdown-header-inOutExpo)
- [inOutHermite](#markdown-header-inOutHermite)
- [inOutPolynomial](#markdown-header-inOutPolynomial)
- [inOutQuad](#markdown-header-inOutQuad)
- [inOutQuart](#markdown-header-inOutQuart)
- [inOutQuint](#markdown-header-inOutQuint)
- [inOutSin](#markdown-header-inOutSin)
- [inPolynomial](#markdown-header-inPolynomial)
- [inQuad](#markdown-header-inQuad)
- [inQuart](#markdown-header-inQuart)
- [inQuint](#markdown-header-inQuint)
- [inSin](#markdown-header-inSin)
- [interruptable](#markdown-header-interruptable)
- [interval](#markdown-header-interval)
- [isColorHSL](#markdown-header-isColorHSL)
- [isColorHSV](#markdown-header-isColorHSV)
- [isColorRGB](#markdown-header-isColorRGB)
- [linear](#markdown-header-linear)
- [mapParallel](#markdown-header-mapParallel)
- [mapSequential](#markdown-header-mapSequential)
- [none](#markdown-header-none)
- [outBack](#markdown-header-outBack)
- [outBounce](#markdown-header-outBounce)
- [outCirc](#markdown-header-outCirc)
- [outCubic](#markdown-header-outCubic)
- [outElastic](#markdown-header-outElastic)
- [outExpo](#markdown-header-outExpo)
- [outHermite](#markdown-header-outHermite)
- [outPolynomial](#markdown-header-outPolynomial)
- [outQuad](#markdown-header-outQuad)
- [outQuart](#markdown-header-outQuart)
- [outQuint](#markdown-header-outQuint)
- [outSin](#markdown-header-outSin)
- [parallel](#markdown-header-parallel)
- [repeat](#markdown-header-repeat)
- [repeatForever](#markdown-header-repeatForever)
- [roundStep](#markdown-header-roundStep)
- [scaleBy](#markdown-header-scaleBy)
- [scaleByNum](#markdown-header-scaleByNum)
- [scaleFrom](#markdown-header-scaleFrom)
- [scaleFromNum](#markdown-header-scaleFromNum)
- [sequence](#markdown-header-sequence)
- [sequentialComposite](#markdown-header-sequentialComposite)
- [smooth](#markdown-header-smooth)
- [waitForFrames](#markdown-header-waitForFrames)
- [waitForTime](#markdown-header-waitForTime)
- [weightedComposite](#markdown-header-weightedComposite)

---

## Type aliases

### ColorType

**Ƭ ColorType**: _`string` \| `number` \| [ColorRGB](interfaces/colorrgb.md) \| [ColorHSL](interfaces/colorhsl.md) \| [ColorHSV](interfaces/colorhsv.md)_

_Defined in color/color-types.ts:34_

Composite type of all supported color formats.

---

### Command

**Ƭ Command**: _`function`_

_Defined in commands/common.ts:22_

The base building block for all commands. This is what the CommandQueue and CommandScheduler update. Commands typically capture state, and are only safe to be invoked by a single queue/scheduler at once. Inside options, deltaTime is the time to update the command by. The command should modify deltaTime, subtracting the time it has consumed. The command sets the completed flag to true when it has completed, or false otherwise. Once the delegate has completed, the next call should restart it. If the operation is set to fast forward, the command should try to immediately complete.

#### Type declaration

▸(deltaTime: _`number`_, operation: _[CommandOperation](enums/commandoperation.md)_): [CommandState](interfaces/commandstate.md) \| `void`

**Parameters:**

| Name      | Type                                          |
| --------- | --------------------------------------------- |
| deltaTime | `number`                                      |
| operation | [CommandOperation](enums/commandoperation.md) |

**Returns:** [CommandState](interfaces/commandstate.md) \| `void`

---

### CommandAct

**Ƭ CommandAct**: _`function`_

_Defined in commands/common.ts:27_

A one shot command. It doesn't take up any time, and completes immediately.

#### Type declaration

▸(): `void`

**Returns:** `void`

---

### CommandCondition

**Ƭ CommandCondition**: _`function`_

_Defined in commands/common.ts:32_

A condition returns true or false, which can change the flow control for some commands.

#### Type declaration

▸(): `boolean`

**Returns:** `boolean`

---

### CommandCoroutine

**Ƭ CommandCoroutine**: _`function`_

_Defined in commands/common.ts:57_

A coroutine command uses generators to produce a sequence of commands over time.

```typescript
function* aCoroutine(): CommandIterator {
  yield wait(5);
  console.log('Now this is called');
  yield interval(t => console.log(t), 10);
  console.log('This is also called');
}
```

#### Type declaration

▸(): [CommandIterator](#markdown-header-CommandIterator)

**Returns:** [CommandIterator](#markdown-header-CommandIterator)

---

### CommandFactory

**Ƭ CommandFactory**: _`function`_

_Defined in commands/common.ts:42_

A command factory creates a command.

#### Type declaration

▸(): [Command](#markdown-header-Command)

**Returns:** [Command](#markdown-header-Command)

---

### CommandInterval

**Ƭ CommandInterval**: _`function`_

_Defined in commands/common.ts:37_

A interval command is executed over a period of time. The value t is normalized from 0 to 1.

#### Type declaration

▸(t: _`number`_): `void`

**Parameters:**

| Name | Type     |
| ---- | -------- |
| t    | `number` |

**Returns:** `void`

---

### CommandIterator

**Ƭ CommandIterator**: _`IterableIterator`<[Command](#markdown-header-Command) \| `undefined`>_

_Defined in commands/common.ts:44_

---

### Ease

**Ƭ Ease**: _`function`_

_Defined in ease.ts:7_

An easing function takes an input value t where an uneased t ranges from 0 <= t <= 1 . Some easing functions, (such as BackEase returns values outside the range 0 <= t <= 1). For a given valid easing function, f(t), f(0) = 0 and f(1) = 1.

#### Type declaration

▸(t: _`number`_): `number`

**Parameters:**

| Name | Type     |
| ---- | -------- |
| t    | `number` |

**Returns:** `number`

---

## Functions

### averageComposite

▸ **averageComposite**(...eases: _[Ease](#markdown-header-Ease)[]_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:61_

Averages the output from several easing functions.

**Parameters:**

| Name         | Type                            | Description                            |
| ------------ | ------------------------------- | -------------------------------------- |
| `Rest` eases | [Ease](#markdown-header-Ease)[] | The list of eases to average together. |

**Returns:** [Ease](#markdown-header-Ease)

---

### cancelGlobalCommands

▸ **cancelGlobalCommands**(): `void`

_Defined in global.ts:51_

Cancels all commands currently running on the `globalScheduler` and `globalQueueGroup`.

**Returns:** `void`

---

### ceilStep

▸ **ceilStep**(numSteps?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:34_

Quantises t into numSteps + 1 levels, using the ceil operation. This increases the average value of t over the duration of the ease.

**Parameters:**

| Name                     | Type     | Default value | Description  |
| ------------------------ | -------- | ------------- | ------------ |
| `Default value` numSteps | `number` | 1             | Must be >= 1 |

**Returns:** [Ease](#markdown-header-Ease)

---

### chainComposite

▸ **chainComposite**(...eases: _[Ease](#markdown-header-Ease)[]_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:120_

Eases a value, by pipelining it through several easing functions. The output of the first ease is used as input for the next.

**Parameters:**

| Name         | Type                            |
| ------------ | ------------------------------- |
| `Rest` eases | [Ease](#markdown-header-Ease)[] |

**Returns:** [Ease](#markdown-header-Ease)

---

### changeFrom

▸ **changeFrom**<`T`>(object: _`T`_, from: _`T`_, commandDuration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/object.ts:62_

Tweens the properties on an object from a set of target values, using regular linear interpolation.

```typescript
const queue = new CommandQueue();
const DURATION = 1;
const obj = { a: 10, b: 20, c: 30 };
const target = { b: 40, c: 60 };
queue.push(changeFrom(obj, target, DURATION));
queue.update(DURATION / 4);
console.log(obj); // { a: 10, b: 35, c: 52.5 }
```

**Type parameters:**

#### T

**Parameters:**

| Name            | Type                          | Description                            |
| --------------- | ----------------------------- | -------------------------------------- |
| object          | `T`                           | The object to tween the properties of. |
| from            | `T`                           | The target to tween from.              |
| commandDuration | `number`                      | The duration of the command.           |
| `Optional` ease | [Ease](#markdown-header-Ease) | The ease to apply                      |

**Returns:** [Command](#markdown-header-Command)

---

### changeFromColor

▸ **changeFromColor**<`U`>(ref: _[Ref](classes/ref.md)<`U`> \| [ColorRGB](interfaces/colorrgb.md) \| [ColorHSL](interfaces/colorhsl.md) \| [ColorHSV](interfaces/colorhsv.md)_, target: _[ColorType](#markdown-header-ColorType)_, commandDuration: _`number`_, lerpMode?: _[ColorLerpMode](enums/colorlerpmode.md)_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/color.ts:102_

Changes a color, from an offset, to a current value, over time.

```typescript
const queue = new CommandQueue();
const DURATION = 1.0;
const color = { r: 1, g: 1, b: 1, a: 1 };
queue.push(changeFromColor(color, 'rgb(50%,20%,10%,0.5)', DURATION));
queue.update(DURATION / 4);
console.log(color); // { r: 0.875, g: 0.8, b: 0.775, 0.875 }
```

**Type parameters:**

#### U : [ColorType](#markdown-header-ColorType)

**Parameters:**

| Name                     | Type                                                                                                                                         | Default value     | Description                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------- |
| ref                      | [Ref](classes/ref.md)<`U`> \| [ColorRGB](interfaces/colorrgb.md) \| [ColorHSL](interfaces/colorhsl.md) \| [ColorHSV](interfaces/colorhsv.md) | -                 | A reference to the color to change. |
| target                   | [ColorType](#markdown-header-ColorType)                                                                                                      | -                 | The color to start from.            |
| commandDuration          | `number`                                                                                                                                     | -                 | The duration of the command         |
| `Default value` lerpMode | [ColorLerpMode](enums/colorlerpmode.md)                                                                                                      | ColorLerpMode.RGB |
| `Optional` ease          | [Ease](#markdown-header-Ease)                                                                                                                | -                 | The ease to apply.                  |

**Returns:** [Command](#markdown-header-Command)

---

### changeFromNum

▸ **changeFromNum**(ref: _[Ref](classes/ref.md)<`number`>_, startTarget: _`number`_, duration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/number.ts:59_

Sets a value to `start`, then tweens it back to it's original position.

```typescript
const DURATION = 1.0;
const queue = new CommandQueue();
const numRef = Ref.create(0);
queue.push(changeFromNum(numRef, 100, DURATION));
queue.update(DURATION / 4);
console.log(numRef.value); // 75;
```

**Parameters:**

| Name            | Type                            | Description                         |
| --------------- | ------------------------------- | ----------------------------------- |
| ref             | [Ref](classes/ref.md)<`number`> | A reference to the number to tween. |
| startTarget     | `number`                        | The value to tween from.            |
| duration        | `number`                        | The duration of the tween.          |
| `Optional` ease | [Ease](#markdown-header-Ease)   | The ease to use for the tween.      |

**Returns:** [Command](#markdown-header-Command)

---

### changeFromOffset

▸ **changeFromOffset**<`T`>(object: _`T`_, offset: _`T`_, commandDuration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/object.ts:120_

Tweens the properties on an object from an offset back to it's start position, using regular linear interpolation.

```typescript
const queue = new CommandQueue();
const DURATION = 1;
const obj = { a: 10, b: 20, c: 30 };
const offset = { b: 40, c: 60 };
queue.push(changeFromOffset(obj, offset, DURATION));
queue.update(DURATION / 4);
console.log(obj); // { a: 10, b: 50, c: 75 }
```

**Type parameters:**

#### T

**Parameters:**

| Name            | Type                          | Description                            |
| --------------- | ----------------------------- | -------------------------------------- |
| object          | `T`                           | The object to tween the properties of. |
| offset          | `T`                           | The offset to tween from.              |
| commandDuration | `number`                      | The duration of the command.           |
| `Optional` ease | [Ease](#markdown-header-Ease) | The ease to apply                      |

**Returns:** [Command](#markdown-header-Command)

---

### changeFromOffsetNum

▸ **changeFromOffsetNum**(ref: _[Ref](classes/ref.md)<`number`>_, offset: _`number`_, duration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/number.ts:132_

Adds an offset to a value, then tweens it back to it's start position.

```typescript
const DURATION = 1.0;
const queue = new CommandQueue();
const numRef = Ref.create(10);
queue.push(changeFromOffsetNum(numRef, 100, DURATION));
queue.update(DURATION / 4);
console.log(numRef.value); // 85;
```

**Parameters:**

| Name            | Type                            | Description                         |
| --------------- | ------------------------------- | ----------------------------------- |
| ref             | [Ref](classes/ref.md)<`number`> | A reference to the number to tween. |
| offset          | `number`                        | The offset to tween from.           |
| duration        | `number`                        | The duration of the tween.          |
| `Optional` ease | [Ease](#markdown-header-Ease)   | The ease to use for the tween.      |

**Returns:** [Command](#markdown-header-Command)

---

### changeTo

▸ **changeTo**<`T`>(object: _`T`_, target: _`T`_, commandDuration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/object.ts:33_

Tweens the properties on an object to a set of target values, using regular linear interpolation.

```typescript
const queue = new CommandQueue();
const DURATION = 1;
const obj = { a: 10, b: 20, c: 30 };
const target = { b: 40, c: 60 };
queue.push(changeTo(obj, target, DURATION));
queue.update(DURATION / 4);
console.log(obj); // { a: 10, b: 25, c: 37.5 }
```

**Type parameters:**

#### T

**Parameters:**

| Name            | Type                          | Description                            |
| --------------- | ----------------------------- | -------------------------------------- |
| object          | `T`                           | The object to tween the properties of. |
| target          | `T`                           | The target to tween to.                |
| commandDuration | `number`                      | The duration of the command.           |
| `Optional` ease | [Ease](#markdown-header-Ease) | The ease to apply                      |

**Returns:** [Command](#markdown-header-Command)

---

### changeToColor

▸ **changeToColor**<`U`>(ref: _[Ref](classes/ref.md)<`U`> \| [ColorRGB](interfaces/colorrgb.md) \| [ColorHSL](interfaces/colorhsl.md) \| [ColorHSV](interfaces/colorhsv.md)_, target: _[ColorType](#markdown-header-ColorType)_, commandDuration: _`number`_, lerpMode?: _[ColorLerpMode](enums/colorlerpmode.md)_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/color.ts:42_

Changes a color to a target color over time.

```typescript
const queue = new CommandQueue();
const DURATION = 1.0;
const color = { r: 1, g: 1, b: 1, a: 1 };
queue.push(changeToColor(color, 'rgb(50%,20%,10%,0.5)', DURATION));
queue.update(DURATION / 4);
console.log(color); // { r: 0.625, g: 0.4, b: 0.325, 0.625 }
```

**Type parameters:**

#### U : [ColorType](#markdown-header-ColorType)

**Parameters:**

| Name                     | Type                                                                                                                                         | Default value     | Description                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------- |
| ref                      | [Ref](classes/ref.md)<`U`> \| [ColorRGB](interfaces/colorrgb.md) \| [ColorHSL](interfaces/colorhsl.md) \| [ColorHSV](interfaces/colorhsv.md) | -                 | A reference to the color to change. |
| target                   | [ColorType](#markdown-header-ColorType)                                                                                                      | -                 | The target color                    |
| commandDuration          | `number`                                                                                                                                     | -                 | The duration of the command         |
| `Default value` lerpMode | [ColorLerpMode](enums/colorlerpmode.md)                                                                                                      | ColorLerpMode.RGB |
| `Optional` ease          | [Ease](#markdown-header-Ease)                                                                                                                | -                 | The ease to apply.                  |

**Returns:** [Command](#markdown-header-Command)

---

### changeToNum

▸ **changeToNum**(ref: _[Ref](classes/ref.md)<`number`>_, target: _`number`_, duration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/number.ts:24_

Tweens a number to an end value.

```typescript
const DURATION = 1.0;
const queue = new CommandQueue();
const numRef = Ref.create(0);
queue.push(changeToNum(numRef, 100, DURATION));
queue.update(DURATION / 4);
console.log(numRef.value); // 25;
```

**Parameters:**

| Name            | Type                            | Description                                             |
| --------------- | ------------------------------- | ------------------------------------------------------- |
| ref             | [Ref](classes/ref.md)<`number`> | A reference to the number to tween.                     |
| target          | `number`                        | The value the number should be at the end of the tween. |
| duration        | `number`                        | The duration of the tween.                              |
| `Optional` ease | [Ease](#markdown-header-Ease)   | The ease to use for the tween.                          |

**Returns:** [Command](#markdown-header-Command)

---

### changeToOffset

▸ **changeToOffset**<`T`>(object: _`T`_, offset: _`T`_, commandDuration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/object.ts:91_

Tweens the properties on an object to an offset from it's start position, using regular linear interpolation.

```typescript
const queue = new CommandQueue();
const DURATION = 1;
const obj = { a: 10, b: 20, c: 30 };
const offset = { b: 40, c: 60 };
queue.push(changeToOffset(obj, offset, DURATION));
queue.update(DURATION / 4);
console.log(obj); // { a: 10, b: 30, c: 45 }
```

**Type parameters:**

#### T

**Parameters:**

| Name            | Type                          | Description                              |
| --------------- | ----------------------------- | ---------------------------------------- |
| object          | `T`                           | The object to tween the properties of.   |
| offset          | `T`                           | The offset to add to the start position. |
| commandDuration | `number`                      | The duration of the command.             |
| `Optional` ease | [Ease](#markdown-header-Ease) | The ease to apply                        |

**Returns:** [Command](#markdown-header-Command)

---

### changeToOffsetNum

▸ **changeToOffsetNum**(ref: _[Ref](classes/ref.md)<`number`>_, offset: _`number`_, duration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/number.ts:94_

Tweens a value towards it's current value plus an offset.

```typescript
const DURATION = 1.0;
const queue = new CommandQueue();
const numRef = Ref.create(10);
queue.push(changeToOffsetNum(numRef, 100, DURATION));
queue.update(DURATION / 4);
console.log(numRef.value); // 35;
```

**Parameters:**

| Name            | Type                            | Description                         |
| --------------- | ------------------------------- | ----------------------------------- |
| ref             | [Ref](classes/ref.md)<`number`> | A reference to the number to tween. |
| offset          | `number`                        | The offset to tween from the start. |
| duration        | `number`                        | The duration of the tween.          |
| `Optional` ease | [Ease](#markdown-header-Ease)   | The ease to use for the tween.      |

**Returns:** [Command](#markdown-header-Command)

---

### chooseRandom

▸ **chooseRandom**(...commands: _(`undefined` \| `function`)[]_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:511_

Chooses a random child command to perform. Re-evaluated on repeat.

```typescript
const queue = new CommandQueue();
queue.push(
  chooseRandom(
    () => {
      console.log('a');
    },
    () => {
      console.log('b');
    },
    () => {
      console.log('c');
    }
  )
);
queue.update(0); // 'a' or 'b' or 'c'
```

**Parameters:**

| Name            | Type                          | Description                                                                                                                                                |
| --------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Rest` commands | (`undefined` \| `function`)[] | A list of commands to choose from at random. Only one command will be performed. Undefined commands can be passed. At least one command must be specified. |

**Returns:** [Command](#markdown-header-Command)

---

### consumeTime

▸ **consumeTime**(): [Command](#markdown-header-Command)

_Defined in commands/common.ts:571_

Consumes all the time from the current update, but let's execution continue. Useful for compensating for loading bumps.

```typescript
const queue = new CommandQueue();
queue.push(consumeTime(), waitForTime(0.1), () => {
  console.log('called');
});
queue.update(1000); // Nothing
queue.update(0.1); // "called"
```

**Returns:** [Command](#markdown-header-Command)

---

### coroutine

▸ **coroutine**(command: _[CommandCoroutine](#markdown-header-CommandCoroutine)_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:455_

Creates a command which runs a coroutine.

Coroutines, (also known as generators in ES6), are methods which can be paused/resumed using the `yield` operator.

```typescript
const queue = new CommandQueue();

function *coroutineWithNoArguments() {
  yield return waitForTime(2.0);
}

function *coroutineWithArguments(firstVal: number, secondVal: number, thirdVal: number) {
  console.log(firstVal);
  yield waitForTime(1.0); // You can return any Command here.
  console.log(secondValue);
  yield; // Wait a single frame.
  console.log(thirdVal);
}

queue.push(
  coroutine(coroutineWithNoArguments),
  coroutine(() => coroutineWithArguments(1, 2, 3))
);
```

**Parameters:**

| Name    | Type                                                  | Description                            |
| ------- | ----------------------------------------------------- | -------------------------------------- |
| command | [CommandCoroutine](#markdown-header-CommandCoroutine) | The command to generate the coroutine. |

**Returns:** [Command](#markdown-header-Command)

---

### defer

▸ **defer**(commandDeferred: _[CommandFactory](#markdown-header-CommandFactory)_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:544_

Defers the creation of the Command until just before the point of execution.

```typescript
const queue = new CommandQueue();
let loopCount = 0;
queue.push(
  repeat(
    3,
    defer(() => {
      console.log(`Loop ${loopCount}`);
      loopCount += 1;
      return waitForTime(loopCount);
    })
  )
);
queue.update(0); // "Loop 0"
queue.update(1); // "Loop 1"
queue.update(2); // "Loop 2"
```

**Parameters:**

| Name            | Type                                              | Description                               |
| --------------- | ------------------------------------------------- | ----------------------------------------- |
| commandDeferred | [CommandFactory](#markdown-header-CommandFactory) | The action which will create the Command. |

**Returns:** [Command](#markdown-header-Command)

---

### dilateTime

▸ **dilateTime**(dilationAmount: _`number`_, ...commands: _[Command](#markdown-header-Command)[]_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:596_

Slows down, or increases the rate at which time flows through the given subcommands.

```typescript
const queue = new CommandQueue();
queue.push(
  dilateTime(2, waitForTime(1), () => {
    console.log('called');
  })
);
queue.update(0.5); // "called"
```

**Parameters:**

| Name            | Type                                  | Description                                                                                                                                         |
| --------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| dilationAmount  | `number`                              | The scale of the dilation to perform. For instance, a dilationAmount of 2 will make time flow twice as quickly. This number must be greater than 0. |
| `Rest` commands | [Command](#markdown-header-Command)[] | A list of commands to choose to dilate time for.                                                                                                    |

**Returns:** [Command](#markdown-header-Command)

---

### elastic

▸ **elastic**(amplitude?: _`number`_, period?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:231_

An ease with an elastic effect.

**Parameters:**

| Name                      | Type     | Default value | Description                                                     |
| ------------------------- | -------- | ------------- | --------------------------------------------------------------- |
| `Default value` amplitude | `number` | 1             | The maximum amount of displacement caused by the elastic effect |
| `Default value` period    | `number` | 0.3           | How springy the elastic effect is.                              |

**Returns:** [Ease](#markdown-header-Ease)

---

### flip

▸ **flip**(inEase: _[Ease](#markdown-header-Ease)_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:146_

Flips an ease about the x/y axis, so ease ins become ease outs etcs.

**Parameters:**

| Name   | Type                          | Description      |
| ------ | ----------------------------- | ---------------- |
| inEase | [Ease](#markdown-header-Ease) | The ease to flip |

**Returns:** [Ease](#markdown-header-Ease)

---

### floorStep

▸ **floorStep**(numSteps?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:45_

Quantises t into numSteps + 1 levels, using floor operation. This decreases the average value of t over the duration of the ease.

**Parameters:**

| Name                     | Type     | Default value | Description  |
| ------------------------ | -------- | ------------- | ------------ |
| `Default value` numSteps | `number` | 1             | Must be >= 1 |

**Returns:** [Ease](#markdown-header-Ease)

---

### globalQueueGroup

▸ **globalQueueGroup**(maxDeltaTime?: _`number`_): [CommandQueueGroup](classes/commandqueuegroup.md)

_Defined in global.ts:44_

**Parameters:**

| Name                         | Type     | Default value     | Description                                                                                                                                                                                                                                                                   |
| ---------------------------- | -------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Default value` maxDeltaTime | `number` | MAX_DELTA_TIME_MS | The most amount of time the global scheduler can update by between frames. In the browser, this is useful to prevent animations fast forwarding when resuming a backgrounded tab. `typescript const queueGroup = globalQueueGroup(); const queue = queueGroup.createQueue();` |

**Returns:** [CommandQueueGroup](classes/commandqueuegroup.md)
A global, shared `CommandQueueGroup` for the current environment.

---

### globalScheduler

▸ **globalScheduler**(maxDeltaTime?: _`number`_): [CommandScheduler](classes/commandscheduler.md)

_Defined in global.ts:29_

**Parameters:**

| Name                         | Type     | Default value     | Description                                                                                                                                                                                                                                                                                       |
| ---------------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Default value` maxDeltaTime | `number` | MAX_DELTA_TIME_MS | The most amount of time the global scheduler can update by between frames. In the browser, this is useful to prevent animations fast forwarding when resuming a backgrounded tab. `typescript const scheduler = globalScheduler(); const queue = scheduler.add(() => { console.log("Hello"); });` |

**Returns:** [CommandScheduler](classes/commandscheduler.md)
A global, shared `CommandScheduler` for the current environment.

---

### hermite

▸ **hermite**(startGradient?: _`number`_, endGradient?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:345_

A Hermite curve easing function. The Hermite curve is a cheap easing function, with adjustable gradients at it's endpoints.

**Parameters:**

| Name                          | Type     | Default value | Description                                                                                       |
| ----------------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `Default value` startGradient | `number` | 0             | The gradient, (x/y), at the start of the ease. The closer this is to zero, the smoother the ease. |
| `Default value` endGradient   | `number` | 0             | The gradient (x/y), at the end of the ease. The closer this is to zero, the smoother the ease.    |

**Returns:** [Ease](#markdown-header-Ease)

---

### inBack

▸ **inBack**(overshoot?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:296_

The in back ease is used to reverse a little, before shooting towards a target.

**Parameters:**

| Name                      | Type     | Default value | Description                          |
| ------------------------- | -------- | ------------- | ------------------------------------ |
| `Default value` overshoot | `number` | 0.2           | The amount to overshoot the goal by. |

**Returns:** [Ease](#markdown-header-Ease)

---

### inBounce

▸ **inBounce**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:316_

**Returns:** [Ease](#markdown-header-Ease)

---

### inCirc

▸ **inCirc**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:281_

**Returns:** [Ease](#markdown-header-Ease)

---

### inCubic

▸ **inCubic**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:178_

**Returns:** [Ease](#markdown-header-Ease)

---

### inElastic

▸ **inElastic**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:253_

**Returns:** [Ease](#markdown-header-Ease)

---

### inExpo

▸ **inExpo**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:263_

**Returns:** [Ease](#markdown-header-Ease)

---

### inHermite

▸ **inHermite**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:359_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutBack

▸ **inOutBack**(overshoot?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:312_

The in back ease is used to overshoot a target.

**Parameters:**

| Name                      | Type     | Default value | Description                          |
| ------------------------- | -------- | ------------- | ------------------------------------ |
| `Default value` overshoot | `number` | 0.2           | The amount to overshoot the goal by. |

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutBounce

▸ **inOutBounce**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:336_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutCirc

▸ **inOutCirc**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:287_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutCubic

▸ **inOutCubic**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:184_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutEase

▸ **inOutEase**(inEase: _[Ease](#markdown-header-Ease)_, outEase: _[Ease](#markdown-header-Ease)_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:133_

Combines two easing functions. The inEase parameter maps to the range 0.0 <= t < 0.5, outEase maps to the range 0.5 <= t < 1.0

**Parameters:**

| Name    | Type                          | Description           |
| ------- | ----------------------------- | --------------------- |
| inEase  | [Ease](#markdown-header-Ease) | The ease in function  |
| outEase | [Ease](#markdown-header-Ease) | The ease out function |

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutElastic

▸ **inOutElastic**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:259_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutExpo

▸ **inOutExpo**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:277_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutHermite

▸ **inOutHermite**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:367_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutPolynomial

▸ **inOutPolynomial**(power: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:164_

**Parameters:**

| Name  | Type     |
| ----- | -------- |
| power | `number` |

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutQuad

▸ **inOutQuad**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:174_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutQuart

▸ **inOutQuart**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:194_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutQuint

▸ **inOutQuint**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:204_

**Returns:** [Ease](#markdown-header-Ease)

---

### inOutSin

▸ **inOutSin**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:222_

**Returns:** [Ease](#markdown-header-Ease)

---

### inPolynomial

▸ **inPolynomial**(power: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:154_

Creates a polynomial easing function, (quadratic, cubic etc).

**Parameters:**

| Name  | Type     | Description                                     |
| ----- | -------- | ----------------------------------------------- |
| power | `number` | The power of the easing function. Must be > 0 . |

**Returns:** [Ease](#markdown-header-Ease)

---

### inQuad

▸ **inQuad**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:168_

**Returns:** [Ease](#markdown-header-Ease)

---

### inQuart

▸ **inQuart**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:188_

**Returns:** [Ease](#markdown-header-Ease)

---

### inQuint

▸ **inQuint**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:198_

**Returns:** [Ease](#markdown-header-Ease)

---

### inSin

▸ **inSin**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:211_

Eases using a trigonometric functions.

**Returns:** [Ease](#markdown-header-Ease)

---

### interruptable

▸ **interruptable**(command: _[Command](#markdown-header-Command)_, onInterrupt: _`function`_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:87_

Interruptable commands are useful for situations where a command is waiting for an external action to finish, but a queue running the command wants to fast foward. For example, consider a command to play an audio clip. The command starts the Audio, then polls waiting for it to finish. Suddenly a queue running the command is told to runToEnd. In this case, the onInterrupt action is called, which stops the audio source and performs cleanup. The command then finishes, and the queue continues.

```typescript
const queue = new CommandQueue();
const audioPlayer = new AudioPlayer(audioClip);
queue.push(
 interruptable(
   defer(() => {
     console.log('Playing');
     audioPlayer.play();
     return waitForTime(audioClip.length);
   }, () => {
     console.log('Stopped');
     audioPlayer.stop();
   })
);
queue.update(1.0); // Playing
queue.runToEnd(); // Stopped
```

**Parameters:**

| Name        | Type                                | Description                       |
| ----------- | ----------------------------------- | --------------------------------- |
| command     | [Command](#markdown-header-Command) | The command to make interruptable |
| onInterrupt | `function`                          | The action to perform if the      |

**Returns:** [Command](#markdown-header-Command)

---

### interval

▸ **interval**(command: _[CommandInterval](#markdown-header-CommandInterval)_, duration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:140_

Runs a command over an interval of time.

```typescript
const DURATION = 5;
const queue = new CommandQueue();
queue.push(
  interval(t => {
    console.log(t);
  }, DURATION)
);
queue.update(1); // 0.2
queue.update(2); // 0.6
queue.update(2); // 1
```

**Parameters:**

| Name            | Type                                                | Description                                                                                               |
| --------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| command         | [CommandInterval](#markdown-header-CommandInterval) | The command to execute.                                                                                   |
| duration        | `number`                                            | The duration of time to apply the command over. Must be greater than or equal to 0.                       |
| `Optional` ease | [Ease](#markdown-header-Ease)                       | An easing function to apply to the t parameter of a CommandDuration. If undefined, linear easing is used. |

**Returns:** [Command](#markdown-header-Command)

---

### isColorHSL

▸ **isColorHSL**(value: _`any`_): `boolean`

_Defined in color/color-types.ts:72_

Type guard for determining whether a color is a ColorHSL object.

**Parameters:**

| Name  | Type  | Description        |
| ----- | ----- | ------------------ |
| value | `any` | The value to test. |

**Returns:** `boolean`

---

### isColorHSV

▸ **isColorHSV**(value: _`any`_): `boolean`

_Defined in color/color-types.ts:56_

Type guard for determining whether a color is a ColorHSV object.

**Parameters:**

| Name  | Type  | Description        |
| ----- | ----- | ------------------ |
| value | `any` | The value to test. |

**Returns:** `boolean`

---

### isColorRGB

▸ **isColorRGB**(value: _`any`_): `boolean`

_Defined in color/color-types.ts:40_

Type guard for determining whether a color is a ColorRGB object.

**Parameters:**

| Name  | Type  | Description        |
| ----- | ----- | ------------------ |
| value | `any` | The value to test. |

**Returns:** `boolean`

---

### linear

▸ **linear**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:13_

The default ease. It doesn't modify the value of t.

**Returns:** [Ease](#markdown-header-Ease)

---

### mapParallel

▸ **mapParallel**<`T`>(items: _`Iterable`<`T`>_, factory: _`function`_): [Command](#markdown-header-Command)

_Defined in commands/functional.ts:23_

Maps a collection of values to a series of commands run in parallel.

```typescript
const items = ['called 1', 'called 2', 'called 3'];
const queue = new CommandQueue();
queue.push(
  mapParallel(items, item => {
    return sequence(waitForTime(1), () => {
      console.log(item);
    });
  })
);
queue.update(1); // "called 1" "called 2" "called 3"
```

**Type parameters:**

#### T

**Parameters:**

| Name    | Type            | Description                                              |
| ------- | --------------- | -------------------------------------------------------- |
| items   | `Iterable`<`T`> | The collection of items                                  |
| factory | `function`      | A factory function which converts each item to a command |

**Returns:** [Command](#markdown-header-Command)

---

### mapSequential

▸ **mapSequential**<`T`>(items: _`Iterable`<`T`>_, factory: _`function`_): [Command](#markdown-header-Command)

_Defined in commands/functional.ts:49_

Maps a collection of values to a series of commands run sequentially.

```typescript
const items = ['called 1', 'called 2', 'called 3'];
const queue = new CommandQueue();
queue.push(
  mapSequential(items, item => {
    return sequence(waitForTime(1), () => {
      console.log(item);
    });
  })
);
queue.update(1); // "called 1"
queue.update(1); // "called 2"
queue.update(1); // "called 3"
```

**Type parameters:**

#### T

**Parameters:**

| Name    | Type            | Description                                              |
| ------- | --------------- | -------------------------------------------------------- |
| items   | `Iterable`<`T`> | The collection of items                                  |
| factory | `function`      | A factory function which converts each item to a command |

**Returns:** [Command](#markdown-header-Command)

---

### none

▸ **none**(): [Command](#markdown-header-Command)

_Defined in commands/common.ts:118_

A command which does nothing. Can be useful as a return value.

```typescript
const queue = new CommandQueue();
queue.push(none(), () => {
  console.log('called');
});
queue.update(0); // Called
```

**Returns:** [Command](#markdown-header-Command)

---

### outBack

▸ **outBack**(overshoot?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:304_

The in back ease is used to overshoot a target.

**Parameters:**

| Name                      | Type     | Default value | Description                          |
| ------------------------- | -------- | ------------- | ------------------------------------ |
| `Default value` overshoot | `number` | 0.2           | The amount to overshoot the goal by. |

**Returns:** [Ease](#markdown-header-Ease)

---

### outBounce

▸ **outBounce**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:333_

**Returns:** [Ease](#markdown-header-Ease)

---

### outCirc

▸ **outCirc**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:284_

**Returns:** [Ease](#markdown-header-Ease)

---

### outCubic

▸ **outCubic**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:181_

**Returns:** [Ease](#markdown-header-Ease)

---

### outElastic

▸ **outElastic**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:256_

**Returns:** [Ease](#markdown-header-Ease)

---

### outExpo

▸ **outExpo**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:274_

**Returns:** [Ease](#markdown-header-Ease)

---

### outHermite

▸ **outHermite**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:363_

**Returns:** [Ease](#markdown-header-Ease)

---

### outPolynomial

▸ **outPolynomial**(power: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:161_

**Parameters:**

| Name  | Type     |
| ----- | -------- |
| power | `number` |

**Returns:** [Ease](#markdown-header-Ease)

---

### outQuad

▸ **outQuad**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:171_

**Returns:** [Ease](#markdown-header-Ease)

---

### outQuart

▸ **outQuart**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:191_

**Returns:** [Ease](#markdown-header-Ease)

---

### outQuint

▸ **outQuint**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:201_

**Returns:** [Ease](#markdown-header-Ease)

---

### outSin

▸ **outSin**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:219_

**Returns:** [Ease](#markdown-header-Ease)

---

### parallel

▸ **parallel**(...commands: _[Command](#markdown-header-Command)[]_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:272_

A parallel command executes several commands in parallel. It finishes when the last command has finished.

```typescript
const queue = new CommandQueue();
queue.push(
   parallel(
    () => { console.log('called 1'); }
    waitForTime(1),
    () => { console.log('called 2'); }
  )
);
queue.update(0); // 'called 1' 'called 2'
```

**Parameters:**

| Name            | Type                                  | Description              |
| --------------- | ------------------------------------- | ------------------------ |
| `Rest` commands | [Command](#markdown-header-Command)[] | The commands to execute. |

**Returns:** [Command](#markdown-header-Command)

---

### repeat

▸ **repeat**(repeatCount: _`number`_, ...commands: _[Command](#markdown-header-Command)[]_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:364_

The repeat command repeats a delegate a given number of times.

```typescript
const queue = new CommandQueue();
queue.push(
  repeat(3, () => {
    console.log('called');
  })
);
queue.update(10); // 'called' x 3
```

**Parameters:**

| Name            | Type                                  | Description                                                                            |
| --------------- | ------------------------------------- | -------------------------------------------------------------------------------------- |
| repeatCount     | `number`                              | The number of times to repeat the given command. Must be > 0.                          |
| `Rest` commands | [Command](#markdown-header-Command)[] | The commands to repeat. All of the basic commands are repeatable without side-effects. |

**Returns:** [Command](#markdown-header-Command)

---

### repeatForever

▸ **repeatForever**(...commands: _[Command](#markdown-header-Command)[]_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:411_

Repeats a command forever. Make sure that the commands you are repeating will consume some time, otherwise this will create an infinite loop. RepeatForever can be escaped by calling `runToEnd` on the `CommandQueue`, or using `CommandOperation.FastForward`.

```typescript
const queue = new CommandQueue();
queue.push(
  repeatForever(waitForTime(1), () => {
    console.log('called');
  })
);
queue.update(10); // 'called' x 10
queue.runToEnd(); // repeatForever will be forced to complete
```

**Parameters:**

| Name            | Type                                  | Description              |
| --------------- | ------------------------------------- | ------------------------ |
| `Rest` commands | [Command](#markdown-header-Command)[] | The commands to execute. |

**Returns:** [Command](#markdown-header-Command)

---

### roundStep

▸ **roundStep**(numSteps?: _`number`_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:21_

Quantises t into numSteps + 1 levels, using the round operation.

**Parameters:**

| Name                     | Type     | Default value | Description  |
| ------------------------ | -------- | ------------- | ------------ |
| `Default value` numSteps | `number` | 1             | Must be >= 1 |

**Returns:** [Ease](#markdown-header-Ease)

---

### scaleBy

▸ **scaleBy**<`T`>(object: _`T`_, scaleFactor: _`T`_, commandDuration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/object.ts:149_

Scales up the properties on an object by `scaleFactor`

```typescript
const queue = new CommandQueue();
const DURATION = 1;
const obj = { x: 10, y: 20, z: 30 };
const scaleFactor = { x: 2, y: 3, z: 4 };
queue.push(scaleBy(obj, scaleFactor, DURATION));
queue.update(DURATION);
console.log(obj); // { x: 20, y: 60, z: 120 }
```

**Type parameters:**

#### T

**Parameters:**

| Name            | Type                          | Description                                                                    |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| object          | `T`                           | The object to tween the properties of.                                         |
| scaleFactor     | `T`                           | The scale factor to apply to the object. This should have matching properties. |
| commandDuration | `number`                      | The duration of the command.                                                   |
| `Optional` ease | [Ease](#markdown-header-Ease) | The ease to apply                                                              |

**Returns:** [Command](#markdown-header-Command)

---

### scaleByNum

▸ **scaleByNum**(ref: _[Ref](classes/ref.md)<`number`>_, scaleFactor: _`number`_, commandDuration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/number.ts:169_

Tween that scales up a value by `scaleFactor`.

```typescript
const DURATION = 1.0;
const queue = new CommandQueue();
const numRef = Ref.create(4);
queue.push(scaleByNum(numRef, 100, DURATION));
queue.update(DURATION / 4);
console.log(numRef.value); // 99;
```

**Parameters:**

| Name            | Type                            | Description                         |
| --------------- | ------------------------------- | ----------------------------------- |
| ref             | [Ref](classes/ref.md)<`number`> | A reference to the number to tween. |
| scaleFactor     | `number`                        | How much to scale up the value by.  |
| commandDuration | `number`                        | The duration of the tween.          |
| `Optional` ease | [Ease](#markdown-header-Ease)   | The ease to use for the tween.      |

**Returns:** [Command](#markdown-header-Command)

---

### scaleFrom

▸ **scaleFrom**<`T`>(object: _`T`_, scaleFactor: _`T`_, commandDuration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/object.ts:178_

Immediately scales up the properties on an object by `scaleFactor`, then tweens back to the original scale.

```typescript
const queue = new CommandQueue();
const DURATION = 1;
const obj = { x: 10, y: 20, z: 30 };
const scaleFactor = { x: 2, y: 3, z: 4 };
queue.push(scaleFrom(obj, scaleFactor, DURATION));
queue.update(DURATION / 4);
console.log(obj); // { x: 17.5, y: 50, z: 97.5 }
```

**Type parameters:**

#### T

**Parameters:**

| Name            | Type                          | Description                                                                    |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| object          | `T`                           | The object to tween the properties of.                                         |
| scaleFactor     | `T`                           | The scale factor to apply to the object. This should have matching properties. |
| commandDuration | `number`                      | The duration of the command.                                                   |
| `Optional` ease | [Ease](#markdown-header-Ease) | The ease to apply                                                              |

**Returns:** [Command](#markdown-header-Command)

---

### scaleFromNum

▸ **scaleFromNum**(ref: _[Ref](classes/ref.md)<`number`>_, scaleFactor: _`number`_, duration: _`number`_, ease?: _[Ease](#markdown-header-Ease)_): [Command](#markdown-header-Command)

_Defined in commands/number.ts:205_

Multiplies a value by `scaleFactor`, then tweens it from that value back to it's starting value.

```typescript
const DURATION = 1.0;
const queue = new CommandQueue();
const numRef = Ref.create(4);
queue.push(scaleFromNum(numRef, 100, DURATION));
queue.update(DURATION / 4);
console.log(numRef.value); // 301;
```

**Parameters:**

| Name            | Type                            | Description                         |
| --------------- | ------------------------------- | ----------------------------------- |
| ref             | [Ref](classes/ref.md)<`number`> | A reference to the number to tween. |
| scaleFactor     | `number`                        | How much to scale up the value by.  |
| duration        | `number`                        | The duration of the tween.          |
| `Optional` ease | [Ease](#markdown-header-Ease)   | The ease to use for the tween.      |

**Returns:** [Command](#markdown-header-Command)

---

### sequence

▸ **sequence**(...commands: _[Command](#markdown-header-Command)[]_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:320_

A sequence command executes several commands sequentially.

```typescript
const queue = new CommandQueue();
queue.push(
  sequence(waitForTime(1), () => {
    console.log('called');
  })
);
queue.update(1); // 'called'
```

**Parameters:**

| Name            | Type                                  | Description                                           |
| --------------- | ------------------------------------- | ----------------------------------------------------- |
| `Rest` commands | [Command](#markdown-header-Command)[] | A parameter list of commands to execute sequentially. |

**Returns:** [Command](#markdown-header-Command)

---

### sequentialComposite

▸ **sequentialComposite**(...eases: _[Ease](#markdown-header-Ease)[]_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:77_

Sequentially triggers easing functions. For instance, if we have 3 easing functions, 0 <= t < 0.33 is handled by first easing function 0.33 <= t < 0.66 by second, and 0.66 <= t <= 1.0 by third.

**Parameters:**

| Name         | Type                            | Description                          |
| ------------ | ------------------------------- | ------------------------------------ |
| `Rest` eases | [Ease](#markdown-header-Ease)[] | The list of eases to chain together. |

**Returns:** [Ease](#markdown-header-Ease)

---

### smooth

▸ **smooth**(): [Ease](#markdown-header-Ease)

_Defined in ease.ts:371_

**Returns:** [Ease](#markdown-header-Ease)

---

### waitForFrames

▸ **waitForFrames**(frameCount: _`number`_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:234_

Waits a specified number of calls to update. This ignores time althogether.

```typescript
const queue = new CommandQueue();
queue.push(waitForFrames(2), () => {
  console.log('called');
});
queue.update(1000);
queue.update(1000);
queue.update(0); // called
```

**Parameters:**

| Name       | Type     | Description                                |
| ---------- | -------- | ------------------------------------------ |
| frameCount | `number` | The number of frames to wait. Must be > 0. |

**Returns:** [Command](#markdown-header-Command)

---

### waitForTime

▸ **waitForTime**(duration: _`number`_): [Command](#markdown-header-Command)

_Defined in commands/common.ts:196_

Waits until a given amount of time has elapsed.

```typescript
const queue = new CommandQueue();
queue.push(waitForTime(10), () => {
  console.log('called');
});
queue.update(5);
queue.update(5); // called
```

**Parameters:**

| Name     | Type     | Description                                                       |
| -------- | -------- | ----------------------------------------------------------------- |
| duration | `number` | The duration of time to wait. Must be greater than or equal to 0. |

**Returns:** [Command](#markdown-header-Command)

---

### weightedComposite

▸ **weightedComposite**(...eases: _[WeightedEaseConfig](interfaces/weightedeaseconfig.md)[]_): [Ease](#markdown-header-Ease)

_Defined in ease.ts:104_

Averages the output of several easing function using a weighting for each.

**Parameters:**

| Name         | Type                                                     | Description                            |
| ------------ | -------------------------------------------------------- | -------------------------------------- |
| `Rest` eases | [WeightedEaseConfig](interfaces/weightedeaseconfig.md)[] | The list of eases to average together. |

**Returns:** [Ease](#markdown-header-Ease)

---
