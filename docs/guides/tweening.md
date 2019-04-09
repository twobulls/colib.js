# Tweening

Colib has an API for basic tweening/animation.

```typescript
const DURATION = 5.0;
const col = { r: 1, g: 1, b: 1, a: 1};
globalScheduler().add(
  parallel(
    changeTo(someObject, {x: 100, y, 10}, DURATION, smooth()),
    changeFromColor(col, "#FFAAFF", DURATION, outBounce())
  )
);
```

## The [interval](../api/README.md#interval) command

The interval take a duration and a callback. The callback is run every update, and gives the progress, (t), from the start to the end of the duration. This is the command that all over tweening functions are built upon in Colib.

```typescript
const DURATION = 3.0;
globalScheduler().add(interval(t => console.log(t), DURATION));
// Example output:
// 0
// 0.25
// 0.5
// 0.75
// 1
```

So, t is interpolated over a duration. You can apply an [easing function](https://easings.net/en) to change how this value is interpolated.

```typescript
const DURATION = 3.0;
globalScheduler().add(interval(t => console.log(t), DURATION, inOutQuad()));
```

## Eases

In Colib, an easing function takes an input value `t` where an uneased `t` ranges from 0 <= t <= 1 . Some easing functions, (such as [inBack](../api/README.md#inback)), return values outside the range 0 <= t <= 1). For a given valid easing function, f(t), f(0) = 0 and f(1) = 1. All eases have the following signature.

```typescript
export type Ease = (t: number) => number;
const validEase: Ease = t => t * t;
```

You can implement any easing function you like, although Colib comes with a bunch of built in ones. For instance, all the [Robert Penner easing functions](https://easings.net/en) are available. There are also a few eases provided which are useful.

- [smooth](../api/README.md#smooth) provides nice interpolations and is a good default choice.
- [hermite](../api/README.md#hermite) let's you set the gradient at the start/end of the ease.
- [chainComposite](../api/README.md#chainComposite) feeds the output of one ease into the input of another.

There are many more options for eases, you can check out in the API docs. All tweening functions accept and ease argument.

## Object Tweens

It's possible to tween objects of an arbitary structure.

```typescript
const DURATION = 5.0;
const obj = {
  scale: { x: 1, y: 1 },
  position: { x: 10, y: 10 }
};

globalScheduler().add(changeTo(obj, { scale: { x: 100 }, position: { y: 50 } }, DURATION));
```

The example above will multiple by x scale by 100, and move the y position to 50. Currently, only number properties will be tweened using the function.

There are several other similar object commands.

- [changeFrom](../api/README.md#changeFrom) jumps a value to a target, then tweens it back to it's starting position
- [changeToOffset](../api/README.md#changeToOffset) tweens a value to the current value plus an offset
- [`changeFromOffset`](../api/README.md#changeFromOffset) jumps a value to an offset from it's current value, then tweens it back it's starting position

## Number tweens

Number tweening is similar to object tweens, except we need to capture a reference to the variable to tween. We use the [Ref](../api/classes/ref) class to achieve this.

```typescript
const DURATION = 3;
let localNumToTween = 0;

// Ref is used to capture a number from a local scope.
const ref = new Ref(
  () => localNumToTween,
  val => {
    localNumToTween = val;
  }
);

globalScheduler().add(changeToNum(ref, 1, DURATION));
```

It is also possible to capture a [Ref](../api/classes/ref) from an object.

```typescript
const DURATION = 3;
const someObj = { x: 100 };
const ref = Ref.from(someObj, 'x');
globalScheduler().add(changeFromNum(ref, 0, DURATION));
```

The available number tweens are [changeToNum](../api/README.md#changeToNum), [changeFromNum](../api/README.md#changeFromNum), [changeToOffsetNum](../api/README.md#changeToOffsetNumb), and [changeFromOffsetNum](../api/README.md#changeFromOffsetNum).

## Color tweens

Colib also has a flexible system for tweening colors, in different formats and using different interpolation strategies.

```typescript
const DURATION = 3;
const color = { r: 1, g: 1, b: 1, a: 0 };
globalScheduler().add(changeToColor(color, '#CC00CC', DURATION, ColorLerpMode.HSV));
```

There are only two color tweening functions, [changeToColor](../api/README.md#changeToColor) and [changeFromColor](../api/README.md#changeFromColor).
