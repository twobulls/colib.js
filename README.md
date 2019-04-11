# Colib

[![build status](https://cloud.drone.io/api/badges/twobulls/colib/status.svg)](https://cloud.drone.io/twobulls/colib)
[![npm version](https://badge.fury.io/js/colib.svg)](https://badge.fury.io/js/colib)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![MIT license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)

> Next generation tweening and timed logic sequencing for typescript.

## Usage

### At a Glance

Colib is a highly modular system for building complex animations/timed event sequences with support for coroutines.

```typescript
globalScheduler().push(
  waitForTime(3),
  changeByOffset(balloon, {y: 100 }, 0.5, smooth()),
  parallel(
    changeFrom(balloon, {alpha: 0}, 0.3, smooth()),
    changeFrom(balloon, {scale: 0}, 0.5, inBack())
  ),
  coroutine(popBalloon)
);

function* popBalloon() {
  yield waitForTime(1);
  yield parallel(
    changeTo(balloon, {scale: 10}, 0.3, outBack())
    changeTo(balloon, {alpha: 0}, 0.2)
  );
  console.log("Popped");
}
```

## Installation

```bash
yarn add colib
# OR
npm install colib
```

## Documentation

Check out the documentation [here](docs/index.md).

## Changelog

See the GitHub [release history](https://github.com/twobulls/colib/releases).

## Contributing

Check our our [contributor](CONTRIBUTING.md) and [developer](DEVELOPER.md) guides.

## Acknowledgements

Brought to you by [Two Bulls](https://www.twobulls.com/)
