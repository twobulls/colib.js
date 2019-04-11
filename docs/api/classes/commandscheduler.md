[colib](../README.md) > [CommandScheduler](../classes/commandscheduler.md)

# Class: CommandScheduler

`CommandScheduler` takes commands, and runs them in parallel. With a single call to update, several different commands can be updated and running at the same time.

## Hierarchy

**CommandScheduler**

## Index

### Properties

- [paused](commandscheduler.md#paused)

### Methods

- [add](commandscheduler.md#add)
- [update](commandscheduler.md#update)

---

## Properties

<a id="paused"></a>

### paused

**● paused**: _`boolean`_ = false

_Defined in command-scheduler.ts:12_

Gets or sets a value indicating whether this `CommandScheduler` is paused.

---

## Methods

<a id="add"></a>

### add

▸ **add**(...commands: _[Command](../#command)[]_): `void`

_Defined in command-scheduler.ts:30_

Add commands to be scheduled. The commands given in this call will be scheduled in sequence as a group, but run at the same time as other scheduled sequences.

```typescript
const scheduler = new CommandScheduler();
scheduler.add(() => {
  console.log('called');
});
scheduler.update(0.5); // 'called'
```

**Parameters:**

| Name            | Type                     | Description              |
| --------------- | ------------------------ | ------------------------ |
| `Rest` commands | [Command](../#command)[] | The commands to execute. |

**Returns:** `void`

---

<a id="update"></a>

### update

▸ **update**(deltaTime: _`number`_): `void`

_Defined in command-scheduler.ts:61_

Updates the scheduler's deltaTime. This will in turn update the deltaTimes of any commands running on this scheduler.

```typescript
const scheduler = new CommandScheduler();
scheduler.add(
  () => { console.log('a'); }
  waitForTime(1),
  () => { console.log('c'); }
);
scheduler.add(
  () => { console.log('b'); }
  waitForTime(1),
  () => { console.log('d'); }
);
scheduler.update(0.5); // 'a' 'b'
scheduler.update(0.5); // 'c' 'd'
```

**Parameters:**

| Name      | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| deltaTime | `number` | The time since the last update. Must be >= 0. |

**Returns:** `void`

---
