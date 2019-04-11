[colib](../README.md) > [CommandQueue](../classes/commandqueue.md)

# Class: CommandQueue

The CommandQueue class is one of core primitives for running commands. It operates, as its name suggests, as a FIFO queue. All Commands pushed to the queue run in sequential order. When it is fed time via Update, it will remove Commands from the queue as they complete.

## Hierarchy

**CommandQueue**

## Index

### Properties

- [paused](commandqueue.md#paused)

### Accessors

- [deltaTimeAccumulation](commandqueue.md#deltatimeaccumulation)
- [updating](commandqueue.md#updating)

### Methods

- [process](commandqueue.md#process)
- [push](commandqueue.md#push)
- [runToEnd](commandqueue.md#runtoend)
- [update](commandqueue.md#update)

---

## Properties

<a id="paused"></a>

### paused

**● paused**: _`boolean`_ = false

_Defined in command-queue.ts:23_

Gets or sets a value indicating whether this `CommandQueue` is paused.

```typescript
queue.push(() => {
  console.log('called');
});
queue.paused = true;
queue.update(1.0); // Nothing
queue.paused = false;
queue.update(1.0); // 'called'
```

---

## Accessors

<a id="deltatimeaccumulation"></a>

### deltaTimeAccumulation

**get deltaTimeAccumulation**(): `number`

_Defined in command-queue.ts:28_

Gets the elapsed time since the current executing Command started.

**Returns:** `number`

---

<a id="updating"></a>

### updating

**get updating**(): `boolean`

_Defined in command-queue.ts:36_

Indicates whether the CommandQueue is currently in an update loop. Update should never be again while this is true.

**Returns:** `boolean`

---

## Methods

<a id="process"></a>

### process

▸ **process**(): `void`

_Defined in command-queue.ts:73_

Updates the queue with a zero time update. This will make sure the first available command is started, but no time is consumed.

```typescript
const queue = new CommandQueue();
queue.push(() => {
  console.log('called');
});
queue.process(); // 'called'
```

**Returns:** `void`

---

<a id="push"></a>

### push

▸ **push**(...commands: _[Command](../#command)[]_): [CommandQueue](commandqueue.md)

_Defined in command-queue.ts:60_

Enqueue the specified command. Commands are queued up in the order specified. Multiple calls to `push` result is the same sequential ordering ie.

```typescript
const queue = new CommandQueue();
queue.push(commandOne);
queue.push(commandTwo);
// Is equivalent to
queue.push(commandOne, commandTwo);
```

**Parameters:**

| Name            | Type                     | Description                                                                                                     |
| --------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `Rest` commands | [Command](../#command)[] | The \`Command\`s to be enqueued. The \`CommandQueue\` will dequeue the commands over succesive calls to update. |

**Returns:** [CommandQueue](commandqueue.md)

---

<a id="runtoend"></a>

### runToEnd

▸ **runToEnd**(): `void`

_Defined in command-queue.ts:93_

Tries to update a queue until it has complete. Note, this can result in an infinite loop if commands in the queue rely on external state changes.

```typescript
const queue = new CommandQueue();
queue.push(waitForTime(3), () => {
  console.log('called');
});
queue.runToEnd(); // 'called'
```

**Returns:** `void`

---

<a id="update"></a>

### update

▸ **update**(deltaTime: _`number`_, operation?: _[CommandOperation](../enums/commandoperation.md)_): `boolean`

_Defined in command-queue.ts:118_

Updates the `CommandQueue`. This causes CommandDelegates to be executed in the order than are enqueued. Update will return after a `Command` elects to pause. This method can't be called recursively.

```typescript
const queue = new CommandQueue();
queue.push(
  waitForTime(0.5),
  () => {
    console.log('a');
  },
  waitForTime(0.5),
  () => {
    console.log('b');
  }
);
queue.update(0.6); // 'a'
queue.update(0.4); // 'b'
```

**Parameters:**

| Name                      | Type                                             | Default value           | Description                                                                                        |
| ------------------------- | ------------------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------- |
| deltaTime                 | `number`                                         | -                       | The time since the last update. Must be >= 0.                                                      |
| `Default value` operation | [CommandOperation](../enums/commandoperation.md) | CommandOperation.Normal | The update operation to use. Fastforward will try to force commands to reach the end of the queue. |

**Returns:** `boolean`
If the queue is finished as no `Command`s remain, returns `true`, `false` otherwise.

---
