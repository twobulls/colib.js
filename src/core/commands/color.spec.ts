import { changeToColor, ColorRGB, ColorHSL, ColorHSV, isColorRGB, isColorHSV, isColorHSL } from './color';
import { Ref } from '../ref';
import { CommandQueue } from '../command-queue';

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

describe('changeToColor', () => {
  it('can tween Ref<ColorRGB> to a target color', () => {
    const ref = Ref.create<ColorRGB>({ r: 1, g: 0.5, b: 0 });
    const target = { r: 0, g: 1, b: 1 };
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ r: 0.75, g: 0.625, b: 0.25 });
  });
  it('can tween Ref<ColorRGB> to a target color with alpha', () => {
    const ref = Ref.create<ColorRGB>({ r: 1, g: 0.5, b: 0, a: 0.2 });
    const target = { r: 0, g: 1, b: 1, a: 0.8 };
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ r: 0.75, g: 0.625, b: 0.25, a: 0.35 });
  });
  it('can tween Ref<ColorHSL> to a target color', () => {
    const ref = Ref.create<ColorHSL>({ h: 100, s: 1, l: 0.25 });
    const target = { h: 0, s: 0.5, l: 0.5 };
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 80, s: 0.75, l: 0.25 });

    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, l: 0.5 });
  });
  it('can tween Ref<ColorHSL> to a target color with alpha', () => {
    const ref = Ref.create<ColorHSL>({ h: 100, s: 1, l: 0.25, a: 0.2 });
    const target = { h: 0, s: 0.5, l: 0.5, a: 0.8 };
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 80, s: 0.75, l: 0.25, a: 0.35 });
    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, l: 0.5, a: 0.8 });
  });
  it('can tween Ref<ColorHSV> to a target color', () => {
    const ref = Ref.create<ColorHSV>({ h: 100, s: 1, v: 0.25 });
    const target = { h: 0, s: 0.5, v: 0.5 };
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 80, s: 0.75, v: 0.25 });

    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, v: 0.5 });
  });
  it('can tween Ref<ColorHSV> to a target color with alpha', () => {
    const ref = Ref.create<ColorHSV>({ h: 100, s: 1, v: 0.25, a: 0.2 });
    const target = { h: 0, s: 0.5, v: 0.5, a: 0.8 };
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 80, s: 0.75, v: 0.25, a: 0.35 });
    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, v: 0.5, a: 0.8 });
  });

  it('can tween Ref<number> to target number', () => {
    const ref = Ref.create<number>(0xff00ff);
    const target = 0x00ff00;
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual(0xbf3fbf);
  });

  it('can tween Ref<string> to target string over rgb', () => {
    const ref = Ref.create<string>('rgb(255,0,255)');
    const target = 'rgb(0,255,0)';
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('rgb(191, 64, 191)');
  });

  it('can tween Ref<string> to target string over hsv', () => {
    const ref = Ref.create<string>('hsl(100,100%,25%)');
    const target = 'hsl(0,50%,50%)';
    const queue = new CommandQueue();
    queue.enqueue(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('rgb(80, 112, 16)');
  });
});
