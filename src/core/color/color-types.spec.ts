import { isColorRGB, isColorHSV, isColorHSL } from './color-types';

describe('isColorRGB', () => {
  it('returns false for a string', () => {
    expect(isColorRGB('#FFFFFF')).toBeFalsy();
  });
  it('returns false for a ColorHSV', () => {
    expect(isColorRGB({ h: 180, s: 1, v: 1 })).toBeFalsy();
  });

  it('returns true for a ColorRGB', () => {
    expect(isColorRGB({ r: 1, g: 1, b: 1 })).toBeTruthy();
  });
});

describe('isColorHSV', () => {
  it('returns false for a string', () => {
    expect(isColorHSV('#FFFFFF')).toBeFalsy();
  });
  it('returns false for a ColorHSL', () => {
    expect(isColorHSV({ h: 180, s: 1, l: 1 })).toBeFalsy();
  });

  it('returns true for a ColorHSV', () => {
    expect(isColorHSV({ h: 180, s: 1, v: 1 })).toBeTruthy();
  });
});

describe('isColorHSL', () => {
  it('returns false for a string', () => {
    expect(isColorHSL('#FFFFFF')).toBeFalsy();
  });
  it('returns false for a ColorHSV', () => {
    expect(isColorHSL({ h: 180, s: 1, v: 1 })).toBeFalsy();
  });

  it('returns true for a ColorHSL', () => {
    expect(isColorHSL({ h: 180, s: 1, l: 1 })).toBeTruthy();
  });
});
