# Scheduling

> [Home](../index.md) > Guides > Scheduling

## `globalScheduler()`

The easiest way to run commands is to use the [globalScheduler()](../api/README.md#globalscheduler). All you need to do is grab the globalScheduler, add whatever commands you want to it, and it will do the rest.

```typescript
const scheduler = globalScheduler();
scheduler.add(waitForTime(3.0), () => {
  console.log('Called');
});
```

In the browser, the [globalScheduler()](../api/README.md#globalscheduler) uses the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/window/requestAnimationFrame) API for added performance.

One bad thing about the [globalScheduler()](../api/README.md#globalscheduler) approach is that it isn't very flexible. Thankfully Colib gives you a lot of options with how to run commands.

## CommandQueue

The [CommandQueue](../api/classes/commandqueue.md) is the most basic way of running commands. It gives you a First In First Out (FIFO), queue that runs commands in sequence. Unlike the [globalScheduler()](../api/README.md#globalscheduler), a [CommandQueue](../api/classes/commandqueue.md) won't automatically be called for you, something must call it's update method.

```typescript
const queue = new CommandQueue();
queue.push(waitForTime(4.0));
queue.push(() => {
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
queue1.push(waitForSeconds(4.0), () => {
  console.log('World');
});
queue2.push(waitForSeconds(2.0), () => {
  console.log('Hello');
});
group.update(1.0); // 'Hello' 'World'
```

Queue's can be added or removed from the group at will.

## globalQueueGroup()

Similar to [globalScheduler()](../api/README.md#globalscheduler), it is also possible to get a [globalQueueGroup()](../api/README.md#globalqueuegroup) that is automatically updated.

```typescript
const group = globalQueueGroup();
const queue = group.createQueue();
// OR, if you just want a quick way to grab a new CommandQueue
const queue = globalQueueGroup().createQueue();

queue.push(waitForSeconds(2.0), () => {
  console.log('this was called');
});
```

### Fast forwarding

It is possible to fastforward a queue by using the [runToEnd](../api/classes/commandqueue.md#runtoend) method. This will try to feed as much time as possible into the queue, until all commands have completed. Commands that aren't intended to stop, such as the `repeatForver` will be forced to terminate.

```typescript
const queue = new CommandQueue();

queue.push(
  repeatForever(waitForSeconds(1), () => {
    console.log('Looping');
  }),
  () => {
    console.log('Finished');
  }
);
queue.update(10); // "Called" x 5
queue.runToEnd(); // "Finished"
```

Fastfowarding relies on commands having a plan to terminate went ran with a [CommandOperation.FastForward](../api/enums/commandoperation.md#fastforward) operation. Some custom complex commands, such as hand built coroutines, might not respect that flag and never terminate.

```typescript
function* loopingCoroutine() {
  while (true) {
    yield;
  }
}

queue.push(coroutine(loopingCoroutine));
queue.runToEnd(); // ERROR: This will never terminate.
```

Keep this in mind when using runToEnd.
