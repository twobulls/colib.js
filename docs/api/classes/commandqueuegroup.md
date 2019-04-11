[colib](../README.md) > [CommandQueueGroup](../classes/commandqueuegroup.md)

# Class: CommandQueueGroup

## Hierarchy

**CommandQueueGroup**

## Index

### Methods

- [addQueue](commandqueuegroup.md#addqueue)
- [createQueue](commandqueuegroup.md#createqueue)
- [removeQueue](commandqueuegroup.md#removequeue)
- [update](commandqueuegroup.md#update)

---

## Methods

<a id="addqueue"></a>

### addQueue

▸ **addQueue**(queue: _[CommandQueue](commandqueue.md)_): `void`

_Defined in command-queue-group.ts:32_

Adds the queue, to be updated by the group.

```typescript
const group = new CommandQueueGroup();
const queue = new CommandQueue();
group.addQueue(queue);
queue.push(() => {
  console.log('called');
});
group.update(1.0); // 'called'
```

**Parameters:**

| Name  | Type                            | Description                                       |
| ----- | ------------------------------- | ------------------------------------------------- |
| queue | [CommandQueue](commandqueue.md) | The \`CommandQueue\` for the behaviour to update. |

**Returns:** `void`

---

<a id="createqueue"></a>

### createQueue

▸ **createQueue**(): [CommandQueue](commandqueue.md)

_Defined in command-queue-group.ts:11_

Creates a queue, which will be updated by the group.

**Returns:** [CommandQueue](commandqueue.md)

---

<a id="removequeue"></a>

### removeQueue

▸ **removeQueue**(queue: _[CommandQueue](commandqueue.md)_): `void`

_Defined in command-queue-group.ts:61_

Removes a queue the group.

```typescript
const group = new CommandQueueGroup();
const queue = new CommandQueue();
group.addQueue(queue);
queue.push(() => {
  console.log('called');
});
group.removeQueue(queue);
group.update(1.0); // Nothing
```

**Parameters:**

| Name  | Type                            | Description                                                                                          |
| ----- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| queue | [CommandQueue](commandqueue.md) | The CommandQueue to remove. This queue should have been created, or added to this behaviour already. |

**Returns:** `void`

---

<a id="update"></a>

### update

▸ **update**(deltaTime: _`number`_): `void`

_Defined in command-queue-group.ts:89_

Updates all the queues in the group by the specified deltaTime.

```typescript
const group = new CommandQueueGroup();
const queue = new CommandQueue();
group.addQueue(queue);
queue.push(() => {
  console.log('called');
});
group.update(1.0); // 'called'
```

**Parameters:**

| Name      | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| deltaTime | `number` | The amount of time to update all the queues by. |

**Returns:** `void`

---
