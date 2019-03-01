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
  smooth
} from './ease';

function commonEases(): Ease[] {
  return [
    linear(),
    roundStep(3),
    ceilStep(3),
    floorStep(3),
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
