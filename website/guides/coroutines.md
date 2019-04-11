# Coroutines

Since ES6 added the concept of [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), functions that return different values over multiple calls, we can utilise the same concept in Colib to write our logic in a more conventional way. In Colib, we call these coroutines. We use the [coroutine](../README.md#coroutine) command to create them.

```typescript
function* aCoroutine() {
  yield waitForTime(3.0);
  console.log('Hello');
  yield waitForTime(2.0);
  console.log('World');
}

globalScheduler().add(coroutine(aCoroutine));
```

You can start a coroutine with arguments, by wrapping it in an arrow function.

```typescript
function* aCoroutine(firstWord: string, secondWord: string) {
  yield waitForTime(3.0);
  console.log(firstWord);
  yield waitForTime(2.0);
  console.log(secondWord);
}

globalScheduler().add(coroutine(() => aCoroutine('Hello', 'World')));
```

Yielding without a value will pause the coroutine for 1 frame.

```typescript
function* aCoroutine() {
  yield;
  console.log('Hello');
  yield;
  console.log('World');
}

globalScheduler().add(coroutine(aCoroutine));
```
