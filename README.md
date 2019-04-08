# Colibjs

[![build status](https://cloud.drone.io/api/badges/twobulls/colib/status.svg)](https://cloud.drone.io/twobulls/colib)
[![npm version](https://badge.fury.io/js/colib.svg)](https://badge.fury.io/js/colib)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![MIT license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)

> Next generation tweening and timed logic sequencing for typescript as javascript.

## Usage

### At a Glance

Colib is a highly modular system for building complex animations/timed event sequences.

```typescript
const queue = new CommandQueue();
queue.enqueue(
  waitForTime(3),
  changeByOffset(balloon, {y: 100 }, 0.5, smooth()),
  parallel(
    changeTo(balloon, {alpha: 0}, 0.3, smooth()),
    changeTo(balloon, {scale, 0}, 0.5, inBack())
  )
);
queue.update(1); // Let the queue process some time.
```

### In Depth

Describe more configuration/usage options here.

## Vision

Describe the project's vision in more detail here. This is also a good place to describe the scope of the project.

## Changelog

See the GitHub [release history](https://github.com/twobulls/your-lib/releases).

## Contributing

Check our our [contributor](CONTRIBUTING.md) and [developer](DEVELOPER.md) guides.
