/**
 * This class contains helper methods for creating common easing functions.
 * An easing function takes an input value <c>t</c> where an uneased <c>t</c>
 * ranges from 0 <= t <= 1 . Some easing functions, (such as <c>BackEase</c> returns
 * values outside the range 0 <= t <= 1). For a given valid easing function, f(t),
 * f(0) = 0 and f(1) = 1.
 **/
export type Ease = (t: number) => number;

/**
 * The default ease. It doesn't modify the value
 * of t.
 **/
export function linear(): Ease {
  return t => t;
}

/**
 * Quantises t into numSteps + 1 levels, using the round operation.
 * @param numSteps Must be >= 1
 */
export function roundStep(numSteps: number = 1): Ease {
  checkNumStepsGreaterThanZero(numSteps);
  const roundedSteps = Math.round(numSteps);

  return t => Math.round(t * roundedSteps) / roundedSteps;
}

/**
 * Quantises t into numSteps + 1 levels, using the ceil operation.
 * This increases the average value of t over the duration
 * of the ease.
 * @param numSteps Must be >= 1
 */
export function ceilStep(numSteps: number = 1): Ease {
  checkNumStepsGreaterThanZero(numSteps);
  const roundedSteps = Math.round(numSteps);
  return t => Math.ceil(t * roundedSteps) / roundedSteps;
}

/**
 * Quantises t into numSteps + 1 levels, using floor operation.
 * This decreases the average value of t over the duration of the ease.
 * @param numSteps Must be >= 1
 */
export function floorStep(numSteps = 1): Ease {
  checkNumStepsGreaterThanZero(numSteps);
  const roundedSteps = Math.round(numSteps);
  return t => Math.floor(t * roundedSteps) / roundedSteps;
}

function checkNumStepsGreaterThanZero(numSteps: number) {
  if (numSteps <= 0) {
    throw new RangeError('numSteps must be > 0');
  }
}

/**
 * Averages the output from several easing functions.
 * @param eases The list of eases to average together.
 */
export function averageComposite(...eases: Ease[]): Ease {
  return t => {
    const average = eases.reduce((total, ease) => total + ease(t), 0);
    return average / eases.length;
  };
}

/**
 * Sequentially triggers easing functions. For instance, if we have
 * 3 easing functions, 0 <= t < 0.33 is handled by first easing function
 * 0.33 <= t < 0.66 by second, and 0.66 <= t <= 1.0 by third.
 * @param eases The list of eases to chain together.
 */
export function sequentialComposite(...eases: Ease[]): Ease {
  return t => {
    const index = Math.floor(t * eases.length);
    if (index >= eases.length) {
      return 1.0;
    }
    if (index < 0) {
      return 0.0;
    } else {
      const sequenceLength = 1.0 / eases.length;
      const sequenceT = (t - index * sequenceLength) / sequenceLength;
      return (eases[index](sequenceT) + index) * sequenceLength;
    }
  };
}

export interface WeightedEaseConfig {
  weight: number;
  ease: Ease;
}
/**
 * Averages the output of several easing function using a weighting for each.
 * @param eases The list of eases to average together.
 */
export function weightedComposite(...eases: WeightedEaseConfig[]): Ease {
  const totalWeight = eases.reduce((total, ease) => total + ease.weight, 0);

  return t => {
    const weightedTotal = eases.reduce((total, ease) => total + ease.ease(t) * ease.weight, 0);
    return weightedTotal / totalWeight;
  };
}

/**
 * Eases a value, by pipelining it throguh several easing functions.
 * The output of the first ease is used as input for the next.
 */
export function chainComposite(...eases: Ease[]): Ease {
  return t => eases.reduce((lastT, ease) => ease(lastT), t);
}

/**
 * Combines two easing functions. The inEase parameter maps to the range
 * 0.0 <= t < 0.5, outEase maps to the range 0.5 <= t < 1.0
 * @param inEase The ease in function
 * @param outEase The ease out function
 */
export function inOutEase(inEase: Ease, outEase: Ease): Ease {
  return t => {
    if (t < 0.5) {
      return 0.5 * inEase(t / 0.5);
    }
    return 0.5 * outEase((t - 0.5) / 0.5) + 0.5;
  };
}

/**
 * Flips an ease about the x/y axis, so ease ins become ease outs etcs.
 * @param inEase The ease to flip
 */
export function flip(inEase: Ease): Ease {
  return t => 1.0 - inEase(1.0 - t);
}

/**
 * Creates a polynomial easing function, (quadratic, cubic etc).
 * @param power The power of the easing function. Must be > 0 .
 */
export function inPolynomial(power: number): Ease {
  if (power <= 0) {
    throw new RangeError('power must be > 0');
  }
  return t => Math.pow(t, power);
}

export function outPolynomial(power: number): Ease {
  return flip(inPolynomial(power));
}
export function inOutPolynomial(power: number): Ease {
  return inOutEase(inPolynomial(power), outPolynomial(power));
}

export function inQuad(): Ease {
  return inPolynomial(2.0);
}
export function outQuad(): Ease {
  return outPolynomial(2.0);
}
export function inOutQuad(): Ease {
  return inOutPolynomial(2.0);
}

export function inCubic(): Ease {
  return inPolynomial(3.0);
}
export function outCubic(): Ease {
  return outPolynomial(3.0);
}
export function inOutCubic(): Ease {
  return inOutPolynomial(3.0);
}

export function inQuart(): Ease {
  return inPolynomial(4.0);
}
export function outQuart(): Ease {
  return outPolynomial(4.0);
}
export function inOutQuart(): Ease {
  return inOutPolynomial(4.0);
}

export function inQuint(): Ease {
  return inPolynomial(5.0);
}
export function outQuint(): Ease {
  return outPolynomial(5.0);
}
export function inOutQuint(): Ease {
  return inOutPolynomial(5.0);
}

/**
 * Eases using a trigonometric functions.
 **/
export function inSin(): Ease {
  return t => {
    if (t === 1) {
      return 1;
    }
    return 1.0 - Math.cos((t * Math.PI) / 2.0);
  };
}
export function outSin(): Ease {
  return flip(inSin());
}
export function inOutSin(): Ease {
  return inOutEase(inSin(), outSin());
}

/**
 * An ease with an elastic effect.
 * @param amplitude The maximum amount of displacement caused by the elastic effect
 * @param period How springy the elastic effect is.
 */
export function elastic(amplitude = 1.0, period = 0.3): Ease {
  return t => {
    let tempAmplitude = amplitude;
    let s = 0.0;

    if (t === 0) {
      return 0.0;
    } else if (t === 1.0) {
      return 1.0;
    }

    if (tempAmplitude < 1.0) {
      tempAmplitude = 1.0;
      s = period / 4.0;
    } else {
      s = (period / (2.0 * Math.PI)) * Math.asin(1.0 / tempAmplitude);
    }
    t -= 1.0;
    return -(tempAmplitude * Math.pow(2.0, 10.0 * t) * Math.sin(((t - s) * 2.0 * Math.PI) / period));
  };
}

export function inElastic(): Ease {
  return elastic();
}
export function outElastic(): Ease {
  return flip(elastic());
}
export function intOutElastic(): Ease {
  return inOutEase(inElastic(), outElastic());
}

export function inExpo(): Ease {
  return t => {
    if (t === 1) {
      return 1;
    }
    if (t === 0) {
      return 0;
    }
    return Math.pow(2.0, 10.0 * (t - 1.0));
  };
}
export function outExpo(): Ease {
  return flip(inExpo());
}
export function inOutExpo(): Ease {
  return inOutEase(inExpo(), outExpo());
}

export function inCirc(): Ease {
  return t => 1.0 - Math.sqrt(1.0 - t * t);
}
export function outCirc(): Ease {
  return flip(inCirc());
}
export function inOutCirc(): Ease {
  return inOutEase(inCirc(), outCirc());
}

/**
 * The in back ease is used to reverse a little, before shooting towards a target.

 * @param overshoot The amount to overshoot the goal by.
 */
export function inBack(overshoot = 0.2): Ease {
  return t => t * t * t - t * overshoot * Math.sin(t * Math.PI);
}

/**
 * The in back ease is used to overshoot a target.
 * @param overshoot The amount to overshoot the goal by.
 */
export function outBack(overshoot = 0.2): Ease {
  return flip(inBack(overshoot));
}

/**
 * The in back ease is used to overshoot a target.
 * @param overshoot The amount to overshoot the goal by.
 */
export function inOutBack(overshoot = 0.2): Ease {
  return inOutEase(inBack(overshoot * 2.0), outBack(overshoot * 2.0));
}

export function inBounce(): Ease {
  return t => {
    t = 1.0 - t;
    if (t < 1.0 / 2.75) {
      return 1.0 - 7.5625 * t * t;
    } else if (t < 2.0 / 2.75) {
      t -= 1.5 / 2.75;
      return 1.0 - (7.5625 * t * t + 0.75);
    } else if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return 1.0 - (7.5625 * t * t + 0.9375);
    } else {
      t -= 2.625 / 2.75;
      return 1.0 - (7.5625 * t * t + 0.984375);
    }
  };
}
export function outBounce(): Ease {
  return flip(inBounce());
}
export function inOutBounce(): Ease {
  return inOutEase(inBounce(), outBounce());
}

/**
 * A Hermite curve easing function. The Hermite curve is a cheap easing function, with adjustable gradients at it's endpoints.
 * @param startGradient The gradient, (x/y), at the start of the ease. The closer this is to zero, the smoother the ease.
 * @param endGradient The gradient (x/y), at the end of the ease. The closer this is to zero, the smoother the ease.
 */
export function hermite(startGradient = 0.0, endGradient = 0.0): Ease {
  return t => {
    // Hermite curve over normalised t interval:
    //    p(t) = (-2t^2 - 3t^2 + 1) * p0 + (t^3 - 2t^2 + t) * m0 + (-2t^3+ 3t^2) *p1 + (t^3- t^2) * m1
    // Where p0 = p at time 0, p1 = p at time 1, m0 = tangent at time 0, m1 = tangent at time 1.
    // Note that in our case p0 = 0, and p1 = 1, while m0 = startGradient, and m1 = endGradient.
    // This gives :
    //    p(t) = (t^3 - 2t^2 + t) * m0 - 2t^3 + 3t^2 + (t^3 - t^2) * m1
    const tSqr = t * t;
    const tCbd = t * t * t;
    return (tCbd - 2 * tSqr + t) * startGradient - 2 * tCbd + 3 * tSqr + (tCbd - tSqr) * endGradient;
  };
}

export function inHermite(): Ease {
  return hermite(0.0, 1.0);
}

export function outHermite(): Ease {
  return hermite(1.0, 0.0);
}

export function inOutHermite(): Ease {
  return hermite();
}

export function smooth(): Ease {
  return hermite();
}
