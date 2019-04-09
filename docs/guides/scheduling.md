# Scheduling

## `globalScheduler()`

The easiest way to run commands is to use the [globalScheduler()](../api/README.md#globalscheduler). All you need to do is grab the globalScheduler, add whatever commands you want to it, and it will do the rest.

```typescript
const scheduler = globalScheduler();
scheduler.add(waitForTime(3.0), () => {
  console.log('Called');
});
```

In the browser, the [globalScheduler()](../api/README.md#globalscheduler) uses the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API for added performance.

One bad thing about the [globalScheduler()](../api/README.md#globalscheduler) approach is that it isn't very flexible. Thankfully Colib gives you a lot of options with how to run commands.

## CommandQueue

The [CommandQueue](../api/classes/commandqueue.md) is the most basic way of running commands. It gives you a First In First Out (FIFO), queue that runs commands in sequence. Unlike the [globalScheduler()](../api/README.md#globalscheduler), a [CommandQueue](../api/classes/commandqueue.md) won't automatically be called for you, something must call it's update method.

```typescript
const queue = new CommandQueue();
queue.enqueue(waitForTime(4.0));
queue.enqueue(() => {
  console.log('Called!');
});
queue.update(4.0);
```

CommandQueues are easy to integrate into your existing run loop.

## CommandScheduler

While [globalScheduler()](../api/README.md#globalscheduler) gives you access to a shared scheduler that will automatically update itself, you can also create a stand alone scheduler and update it yourself.

```typescript
const scheduler = new CommandScheduler();
scheduler.add(waitForSeconds(4.0), () => {
  console.log('World');
});
scheduler.add(waitForSeconds(2.0), () => {
  console.log('Hello');
});
scheduler.update(4.0); // "Hello" "World"
```

## CommandQueueGroup

Another way of scheduling commands, which is even more flexible than a [CommandScheduler](../api/classes/commandscheduler.md), is a [CommandQueueGroup](../api/classes/commandqueuegroup.md). The `CommandQueueGroup` can update multiple [CommandQueue](../api/classes/commandqueue.md)s at once.

```typescript
const group = new CommandQueueGroup();
const queue1 = new CommandQueue();
group.addQueue(queue);
const queue2 = groupd.createQueue();
queue1.enqueue(waitForSeconds(4.0), () => {
  console.log('World');
});
queue2.enqueue(waitForSeconds(2.0), () => {
  console.log('Hello');
});
group.update(1.0); // 'Hello' 'World'
```

Queue's can be added or removed from the group at will.

### globalQueueGroup()

Similar to [globalScheduler()](../api/README.md#globalscheduler), it is also possible to get a [globalQueueGroup()](../api/README.md#globalqueuegroup) that is automatically updated.

```typescript
const group = globalQueueGroup();
const queue = group.createQueue();
// OR, if you just want a quick way to grab a new CommandQueue
const queue = globalQueueGroup().createQueue();

queue.enqueue(waitForSeconds(2.0), () => {
  console.log('this was called');
});
```
