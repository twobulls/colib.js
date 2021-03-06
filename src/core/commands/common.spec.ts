import { CommandQueue } from '../command-queue';
import {
  interruptable,
  waitForTime,
  none,
  repeat,
  waitForFrames,
  parallel,
  sequence,
  repeatForever,
  coroutine,
  chooseRandom,
  defer,
  consumeTime,
  dilateTime,
  interval
} from './common';
import { smooth } from '../ease';

describe('interruptable', () => {
  it('will call the interrupt handler on fast foward of in progress command', () => {
    const queue = new CommandQueue();
    let interrupted = false;
    queue.push(
      interruptable(waitForTime(1), () => {
        interrupted = true;
      })
    );

    queue.update(0.5);
    queue.runToEnd();
    expect(interrupted).toBeTruthy();
  });
  it("won't call the interrupt handler on fast foward of unstarted command", () => {
    const queue = new CommandQueue();
    let interrupted = false;
    queue.push(
      interruptable(waitForTime(1), () => {
        interrupted = true;
      })
    );

    queue.runToEnd();
    expect(interrupted).toBeFalsy();
  });
  it('can be re-run after interruption', () => {
    const queue = new CommandQueue();
    let callCount = 0;
    queue.push(
      repeat(2, interruptable(waitForTime(1), () => {}), () => {
        callCount++;
      })
    );

    queue.update(1);
    expect(callCount).toBe(1);
    queue.update(1);
    expect(callCount).toBe(2);
  });
});

describe('none', () => {
  it('will complete immediately, without using any time', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(none(), () => {
      called = true;
    });
    queue.process();
    expect(called).toBeTruthy();
  });
});

describe('interval', () => {
  it('respects the fast forward operation', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(interval(t => {}, 10), () => {
      called = true;
    });
    queue.runToEnd();
    expect(called).toBeTruthy();
  });
  it('skips to the end of the interval, when the time is 0', () => {
    const queue = new CommandQueue();
    let lastT = -1;
    queue.push(
      interval(t => {
        lastT = t;
      }, 0)
    );
    queue.process();
    expect(lastT).toBe(1);
  });
  it('normalises t', () => {
    const queue = new CommandQueue();
    const ts: number[] = [];
    queue.push(
      interval(t => {
        ts.push(t);
      }, 4)
    );
    queue.update(1);
    queue.update(1);
    queue.update(2);
    expect(ts).toEqual([0.25, 0.5, 1]);
  });
  it('maps t to easing function', () => {
    const queue = new CommandQueue();
    const ts: number[] = [];
    const smoothEase = smooth();
    queue.push(
      interval(
        t => {
          ts.push(t);
        },
        4,
        smoothEase
      )
    );
    queue.update(1);
    queue.update(1);
    queue.update(2);
    expect(ts).toEqual([smoothEase(0.25), smoothEase(0.5), smoothEase(1)]);
  });
  it('throws an error when duration is negative', () => {
    expect(() => interval(() => {}, -1)).toThrowError();
  });
});

describe('waitForTime', () => {
  it('can be interrupted', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(waitForTime(1.0), () => {
      called = true;
    });
    queue.runToEnd();
    expect(called).toBeTruthy();
  });
  it('takes up the correct duration', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(waitForTime(1.0), () => {
      called = true;
    });
    queue.update(0.5);
    expect(called).toBeFalsy();
    queue.update(0.5);

    expect(called).toBeTruthy();
  });
  it('can take 0 duration', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(waitForTime(0), () => {
      called = true;
    });
    queue.process();
    expect(called).toBeTruthy();
  });
});

describe('waitForFrames', () => {
  it('throws an error is frames is smaller than 1', () => {
    expect(() => waitForFrames(0)).toThrowError();
  });
  it('takes multiple updates to complete', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(waitForFrames(3), () => {
      called = true;
    });
    queue.process();
    queue.process();
    queue.process();

    expect(called).toBeFalsy();
    queue.process();

    expect(called).toBeTruthy();
  });
  it('can be interrupted', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(waitForFrames(3), () => {
      called = true;
    });
    queue.runToEnd();
    expect(called).toBeTruthy();
  });
  it('can be restarted', () => {
    const queue = new CommandQueue();
    let callCount = 0;
    queue.push(
      repeat(2, waitForFrames(2), () => {
        callCount++;
      })
    );
    queue.process();
    queue.process();
    queue.process();
    queue.process();
    queue.process();

    expect(callCount).toBe(2);
  });
});

describe('parallel', () => {
  it('handles an empty command list', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(parallel(), () => {
      called = true;
    });
    queue.process();
    expect(called).toBeTruthy();
  });

  it('handles returns the first command if only one command is specified', () => {
    const child = waitForTime(1);
    const output = parallel(child);
    expect(output).toBe(child);
  });

  it('executes two commands at the same time', () => {
    const queue = new CommandQueue();

    let calledA = false;
    let calledB = false;
    let calledC = false;
    let calledD = false;

    queue.push(
      parallel(
        sequence(
          waitForTime(0.5),
          () => {
            calledA = true;
          },
          waitForTime(0.5),
          () => {
            calledC = true;
          }
        ),
        sequence(
          waitForTime(0.5),
          () => {
            calledB = true;
          },
          waitForTime(0.5),
          () => {
            calledD = true;
          }
        )
      )
    );
    queue.update(0.5);
    expect(calledA).toBeTruthy();
    expect(calledB).toBeTruthy();
    expect(calledC).toBeFalsy();
    expect(calledD).toBeFalsy();
  });

  it('can be restarted', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    queue.push(
      repeat(
        2,
        parallel(waitForTime(1), () => {
          calledCount++;
        })
      )
    );
    queue.update(0.5);
    expect(calledCount).toBe(1);
    queue.update(1);
    expect(calledCount).toBe(2);
  });
});

describe('sequence', () => {
  it('handles an empty command list', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(sequence(), () => {
      called = true;
    });
    queue.process();
    expect(called).toBeTruthy();
  });

  it('handles returns the first command if only one command is specified', () => {
    const child = waitForTime(1);
    const output = sequence(child);
    expect(output).toBe(child);
  });

  it('calls commands in order', () => {
    const queue = new CommandQueue();
    let calledA = false;
    let calledB = false;

    queue.push(
      waitForTime(1),
      () => {
        calledA = true;
      },
      waitForTime(2),
      () => {
        calledB = true;
      }
    );

    queue.update(1);
    expect(calledA).toBeTruthy();
    expect(calledB).toBeFalsy();
    queue.update(1);
    expect(calledB).toBeFalsy();
  });

  it('can be restarted', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    queue.push(
      repeat(
        2,
        sequence(waitForTime(1), () => {
          calledCount++;
        })
      )
    );
    queue.update(1);
    expect(calledCount).toBe(1);
    queue.update(1);
    expect(calledCount).toBe(2);
  });
});

describe('repeat', () => {
  it('throws an error when given a negative repeat count', () => {
    expect(() => repeat(-1)).toThrowError();
  });
  it('will complete immediately, without using any time, when using a 0 repeat count', () => {
    const queue = new CommandQueue();
    let calledA = false;
    let calledB = false;
    queue.push(
      repeat(0, () => {
        calledA = false;
      }),
      () => {
        calledB = true;
      }
    );

    queue.process();

    expect(calledA).toBeFalsy();
    expect(calledB).toBeTruthy();
  });

  it('will complete a repeat loop with a count of 1 only once', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    let calledB = false;
    queue.push(
      repeat(1, () => {
        calledCount++;
      }),
      () => {
        calledB = true;
      }
    );

    queue.process();

    expect(calledCount).toBe(1);
    expect(calledB).toBeTruthy();
  });
  it('will complete a repeat loop multiple time', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    queue.push(
      repeat(10, () => {
        calledCount++;
      })
    );

    queue.process();

    expect(calledCount).toBe(10);
  });
  it('can be repeated', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    queue.push(
      repeat(
        2,
        repeat(10, () => {
          calledCount++;
        })
      )
    );

    queue.process();

    expect(calledCount).toBe(20);
  });
});

describe('repeatForever', () => {
  it('repeats an arbitary number of times', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    let lastCalled = false;
    queue.push(
      repeatForever(waitForTime(1), () => {
        calledCount++;
      }),
      () => {
        lastCalled = true;
      }
    );
    queue.update(1);
    expect(calledCount).toBe(1);
    queue.update(1);
    expect(calledCount).toBe(2);
    expect(lastCalled).toBeFalsy();
  });
  it('finishes when run to end command is called', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    let lastCalled = false;
    queue.push(
      repeatForever(waitForTime(1), () => {
        calledCount++;
      }),
      () => {
        lastCalled = true;
      }
    );
    queue.update(1);
    expect(calledCount).toBe(1);
    queue.runToEnd();
    expect(lastCalled).toBeTruthy();
  });
});

describe('coroutine', () => {
  it('can sequence values from a generator function', () => {
    const queue = new CommandQueue();
    let calledA = false;
    let calledB = false;

    function* gen() {
      yield waitForTime(1);
      calledA = true;
      yield waitForTime(1);
      calledB = true;
    }
    queue.push(coroutine(gen));
    queue.update(1);
    expect(calledA).toBeTruthy();
    expect(calledB).toBeFalsy();
    queue.update(1);
    expect(calledB).toBeTruthy();
  });

  it('will wait a frame when yielding without a value', () => {
    const queue = new CommandQueue();
    let called = false;
    function* gen() {
      yield;
      called = true;
    }
    queue.push(coroutine(gen));
    queue.process();
    expect(called).toBeFalsy();
    queue.process();
    expect(called).toBeTruthy();
  });

  it('can be restarted', () => {
    const queue = new CommandQueue();
    let calledCount = 0;
    function* gen() {
      calledCount++;
      yield;
    }
    queue.push(repeat(3, coroutine(gen)));
    queue.process();
    expect(calledCount).toBe(1);
    queue.process();
    expect(calledCount).toBe(2);
    queue.process();
    expect(calledCount).toBe(3);
  });
});

describe('chooseRandom', () => {
  it('handles an empty command list', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(chooseRandom(), () => {
      called = true;
    });
    queue.process();
    expect(called).toBeTruthy();
  });

  it('picks a random command', () => {
    const queue = new CommandQueue();
    let calledA = false;
    let calledB = false;
    let calledC = false;
    queue.push(
      chooseRandom(
        () => {
          calledA = true;
        },
        () => {
          calledB = true;
        },
        () => {
          calledC = true;
        }
      )
    );
    queue.process();
    expect(calledA || calledB || calledC).toBeTruthy();
    if (calledA) {
      expect(calledB || calledC).toBeFalsy();
    }
    if (calledB) {
      expect(calledA || calledC).toBeFalsy();
    }
    if (calledC) {
      expect(calledA || calledB).toBeFalsy();
    }
  });

  it('has good selection distribution', () => {
    const queue = new CommandQueue();
    let calledACount = 0;
    let calledBCount = 0;
    let calledCCount = 0;
    queue.push(
      repeatForever(
        waitForTime(1),
        chooseRandom(
          () => {
            calledACount++;
          },
          () => {
            calledBCount++;
          },
          () => {
            calledCCount++;
          }
        )
      )
    );

    queue.update(1000);

    expect(calledACount).toBeGreaterThan(200);
    expect(calledBCount).toBeGreaterThan(200);
    expect(calledCCount).toBeGreaterThan(200);
  });
});

describe('defer', () => {
  it('executes the deffered command', () => {
    const queue = new CommandQueue();
    let calledA = false;
    let calledB = false;
    queue.push(
      defer(() => {
        calledA = true;
        return sequence(waitForTime(1), () => {
          calledB = true;
        });
      })
    );

    queue.process();
    expect(calledA).toBeTruthy();
    expect(calledB).toBeFalsy();
    queue.update(1);
    expect(calledB).toBeTruthy();
  });
  it('can be repeated', () => {
    const queue = new CommandQueue();
    let calledDeferCount = 0;
    let calledInnerCount = 0;

    queue.push(
      repeat(
        3,
        defer(() => {
          calledDeferCount++;
          return sequence(waitForTime(1), () => {
            calledInnerCount++;
          });
        })
      )
    );

    queue.update(3);
    expect(calledDeferCount).toBe(3);
    expect(calledInnerCount).toBe(3);
  });

  it('will take no time if undefined is picked', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(chooseRandom(undefined, undefined, undefined), () => {
      called = true;
    });
    queue.process();
    expect(called).toBeTruthy();
  });
});

describe('consumeTime', () => {
  it('changes deltaTime to 0', () => {
    const queue = new CommandQueue();
    let lastT = -1;
    queue.push(
      consumeTime(),
      interval(t => {
        lastT = t;
      }, 3)
    );
    queue.update(1000);
    expect(lastT).toBe(0);
  });
});

describe('dilateTime', () => {
  it('throws an error if dilationAmount is 0', () => {
    expect(() => dilateTime(0)).toThrowError();
  });
  it('adjusts the time dilation', () => {
    const queue = new CommandQueue();
    let called = false;
    queue.push(
      dilateTime(0.5, waitForTime(1), () => {
        called = true;
      })
    );
    queue.update(1.9);
    expect(called).toBeFalsy();
    queue.update(0.1);
    expect(called).toBeTruthy();
  });
});
