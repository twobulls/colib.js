# Basics

Colib makes it easy to build complex sequences of timed logic and animations, without ending up in callback hell. Here we will cover the most basic building block in Colib, the [Command](../README.md#command).

## An introductory example

Before we define just exactly what a command is, let's look at an example of what you can do with Colib.

```typescript
import { globalScheduler, waitForTime, parallel, changeTo } from 'colib';

const scheduler = globalScheduler();
const obj = { x: 10, y: 100 };
scheduler.add(
  waitForTime(4.0),
  parallel(
    changeTo(obj, { y: 200 }, 3.0, inOutQuad()),
    sequence(waitForTime(1.5), () => {
      console.log('Reached');
    })
  )
);
```

Here we see a couple of commands used, [sequence](../README.md#sequence), [parallel](../README.md#parallel), [waitForTime](../README.md#waitForTime), [changeTo](../README.md#changeTo). Let's break down the whole thing step by step.

### Breakdown

#### scheduler.add(...)

The global scheduler used here will run the commands. Commands don't do anything until something runs them.

#### waitForTime(4)

Waits 4 seconds, before execution continues onto the next command.

#### parallel(...)

Executes all it's child commands at the same time.

#### changeTo(obj, {y: 200}, 3.0, inOutQuad())

Tweens the value of `obj.y` to 200, over a duration of 3 seconds, using the `inOutQuad()` ease.

#### sequence(...)

Executes all it's child commands one after the other. Because this sequence is nested inside a parallel command, the entire sequence is executing at the same time as the changeTo command.

#### waitForTime(1.5)

Waits 1.5 seconds, before execution continues onto the next command.

#### () => { console.log('Reached') }

A callback command that logs "Reached" to the console.

## Commands

So now we've seen a few commands in action, but what are they? Commands are functions that can consume time, and return whether they are completed or not. Take a look at the following (simplified) function signature of a command:

```typescript
export type Command = (deltaTime: number) => { deltaTime: number; complete: boolean };
```

A command takes the maximum amount of time it's allowed to advance by, `deltaTime`, and returns any remaining unused time and whether it completed or not. Typically commands are implemented as closure functions so they track state internally. This means most commands are impure, (they have side effects).

So, the definition of a Command is simple, but it can used to build some incredibly cool and complex behaviours. As we saw in our example, [parallel](../README.md#parallel) and [sequence](../README.md#sequence) allow commands to easily be composed together in different ways. Other common commands worth checking out that can be used for composition include [repeat](../README.md#repeat), [repeatForever](../README.md#repeatForever), and [chooseRandom](../README.md#chooseRandom).
