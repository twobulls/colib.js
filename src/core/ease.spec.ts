import {
  Ease,
  linear,
  roundStep,
  ceilStep,
  floorStep,
  inPolynomial,
  inOutPolynomial,
  inQuad,
  outQuad,
  outPolynomial,
  inCubic,
  outCubic,
  inOutCubic,
  inOutQuad,
  inQuart,
  outQuart,
  inOutQuart,
  inQuint,
  outQuint,
  inOutQuint,
  inSin,
  outSin,
  inOutSin,
  elastic,
  inElastic,
  outElastic,
  intOutElastic,
  inExpo,
  outExpo,
  inOutExpo,
  inCirc,
  outCirc,
  inOutCirc,
  inBack,
  outBack,
  inOutBack,
  inBounce,
  outBounce,
  inOutBounce,
  hermite,
  inHermite,
  outHermite,
  inOutHermite,
  smooth,
  averageComposite,
  weightedComposite,
  sequentialComposite,
  chainComposite
} from './ease';

function commonEases(): Ease[] {
  return [
    linear(),
    roundStep(3),
    roundStep(),
    ceilStep(3),
    ceilStep(),
    floorStep(3),
    floorStep(),
    inPolynomial(10),
    outPolynomial(10),
    inOutPolynomial(10),
    inQuad(),
    outQuad(),
    inOutQuad(),
    inCubic(),
    outCubic(),
    inOutCubic(),
    inQuart(),
    outQuart(),
    inOutQuart(),
    inQuint(),
    outQuint(),
    inOutQuint(),
    inSin(),
    outSin(),
    inOutSin(),
    elastic(),
    inElastic(),
    outElastic(),
    intOutElastic(),
    inExpo(),
    outExpo(),
    inOutExpo(),
    inCirc(),
    outCirc(),
    inOutCirc(),
    inBack(),
    outBack(),
    inOutBack(),
    inOutBack(0.4),
    inBounce(),
    outBounce(),
    inOutBounce(),
    hermite(),
    inHermite(),
    outHermite(),
    inOutHermite(),
    smooth()
  ];
}

describe('eases', () => {
  it('starts at f(0)=0 and ends at f(1)=1', () => {
    for (const ease of commonEases()) {
      expect(ease(0)).toBe(0);
      expect(ease(1)).toBe(1);
    }
  });
});

describe('roundStep', () => {
  it('throws error if steps is 0', () => {
    expect(() => roundStep(0)).toThrowError();
  });
});

describe('floorStep', () => {
  it('throws error if steps is 0', () => {
    expect(() => floorStep(0)).toThrowError();
  });
});

describe('ceilStep', () => {
  it('throws error if steps is 0', () => {
    expect(() => ceilStep(0)).toThrowError();
  });
});

describe('averageCompositve', () => {
  it('calculates the average value of a series of tweens', () => {
    const avg = averageComposite(linear(), inQuad(), inCubic());
    const val = avg(0.5);
    const expected = (0.5 + 0.5 * 0.5 + 0.5 * 0.5 * 0.5) / 3;
    expect(val).toBe(expected);
  });
  it('throws an error when no eases are provided', () => {
    expect(() => averageComposite()).toThrowError();
  });
});

describe('weightedComposite', () => {
  it('calculates the average value of a series of tweens, using weights', () => {
    const avg = weightedComposite(
      { ease: linear(), weight: 1 },
      { ease: inQuad(), weight: 2 },
      { ease: inCubic(), weight: 3 }
    );
    const val = avg(0.5);
    const expected = (0.5 + 0.5 * 0.5 * 2 + 0.5 * 0.5 * 0.5 * 3) / 6;
    expect(val).toBe(expected);
  });
  it('throws an error when weights sum to 0 or less', () => {
    expect(() => weightedComposite({ ease: linear(), weight: 0 })).toThrowError();
  });
});

describe('sequentialComposite', () => {
  it('breaks the ease into intervals, and a applies a different ease to each interval', () => {
    const avg = sequentialComposite(linear(), inQuad(), inCubic(), inQuart());
    const expected = inCubic()(0.5) * 0.25 + 0.5;
    expect(avg(0.625)).toBe(expected);
  });
  it('returns 1 when t is larger than 1', () => {
    const avg = sequentialComposite(linear(), inQuad(), inCubic(), inQuart());
    expect(avg(2)).toBe(1);
  });
  it('returns 0 when t is smaller than 1', () => {
    const avg = sequentialComposite(linear(), inQuad(), inCubic(), inQuart());
    expect(avg(-2)).toBe(0);
  });
  it('throws an error when no eases are provided', () => {
    expect(() => sequentialComposite()).toThrowError();
  });
});

describe('chainComposite', () => {
  it('passes the output from one ease as the input into the next', () => {
    const avg = chainComposite(linear(), inQuad(), inCubic(), inQuart());
    const t1 = 0.5;
    const t2 = t1 * t1;
    const t3 = t2 * t2 * t2;
    const expected = t3 * t3 * t3 * t3;
    expect(avg(0.5)).toBe(expected);
  });

  it('throws an error when no eases are provided', () => {
    expect(() => chainComposite()).toThrowError();
  });
});

describe('inPolynomial', () => {
  it('throws an error when given a power of 0', () => {
    expect(() => inPolynomial(0)).toThrowError();
  });
});

describe('elastic', () => {
  it('produces well known values', () => {
    const ease = elastic(1.0, 4);
    const outputs = [];
    for (let i = 0; i <= 10; ++i) {
      outputs.push(ease(i / 10));
    }
    expect(outputs).toMatchInlineSnapshot(`
Array [
  0,
  0.00030553606453170113,
  0.0012070976342771387,
  0.00354680077921521,
  0.009184144567069895,
  0.02209708691207961,
  0.050563562148434216,
  0.11137581552354595,
  0.23776412907378847,
  0.49384417029756894,
  1,
]
`);
  });
  it('sets minimum amplitude to 1', () => {
    const ease = elastic();
    const easeAdjusted = elastic(-1);

    const outputs = [];
    for (let i = 0; i <= 10; ++i) {
      const expected = ease(i / 10);
      expect(easeAdjusted(i / 10)).toBe(expected);
    }
  });
});

describe('inBounce', () => {
  it('produces well known values', () => {
    const ease = inBounce();
    const outputs = [];
    for (let i = 0; i <= 10; ++i) {
      outputs.push(ease(i / 10));
    }
    expect(outputs).toMatchInlineSnapshot(`
Array [
  0,
  0.01187500000000008,
  0.06000000000000005,
  0.06937499999999996,
  0.22750000000000004,
  0.234375,
  0.09000000000000019,
  0.31937499999999985,
  0.6975000000000001,
  0.9243750000000001,
  1,
]
`);
  });
});
describe('inExpo', () => {
  it('produces well known values', () => {
    const ease = inExpo();
    const outputs = [];
    for (let i = 0; i <= 10; ++i) {
      outputs.push(ease(i / 10));
    }
    expect(outputs).toMatchInlineSnapshot(`
Array [
  0,
  0.001953125,
  0.00390625,
  0.0078125,
  0.015625,
  0.03125,
  0.0625,
  0.12499999999999996,
  0.25000000000000006,
  0.5000000000000001,
  1,
]
`);
  });
});
