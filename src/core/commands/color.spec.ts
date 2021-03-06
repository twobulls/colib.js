import { changeToColor, changeFromColor, ColorLerpMode } from './color';
import { ColorRGB, ColorHSL, ColorHSV } from '../color/color-types';

import { Ref } from '../ref';
import { CommandQueue } from '../command-queue';

describe('changeToColor', () => {
  it('can tween Ref<ColorRGB> to a target color', () => {
    const ref = Ref.create<ColorRGB>({ r: 1, g: 0.5, b: 0 });
    const target = { r: 0, g: 1, b: 1 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ r: 0.75, g: 0.625, b: 0.25 });
  });
  it('can tween Ref<ColorRGB> to a target color with alpha', () => {
    const ref = Ref.create<ColorRGB>({ r: 1, g: 0.5, b: 0, a: 0.3 });
    const target = { r: 0, g: 1, b: 1, a: 0.8 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual({ r: 0.75, g: 0.625, b: 0.25, a: 0.425 });
  });

  it('can tween ColorRGB to a target color', () => {
    const ref = { r: 1, g: 0.5, b: 0 };
    const target = { r: 0, g: 1, b: 1 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref).toEqual({ r: 0.75, g: 0.625, b: 0.25 });
  });
  it('can tween ColorRGB to a target color with alpha', () => {
    const ref = { r: 1, g: 0.5, b: 0, a: 0.3 };
    const target = { r: 0, g: 1, b: 1, a: 0.8 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref).toEqual({ r: 0.75, g: 0.625, b: 0.25, a: 0.425 });
  });

  it('can tween Ref<ColorHSL> to a target color', () => {
    const ref = Ref.create<ColorHSL>({ h: 100, s: 1, l: 0.25 });
    const target = { h: 0, s: 0.5, l: 0.5 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSL));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 75, s: 0.875, l: 0.3125 });

    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, l: 0.5 });
  });
  it('can tween Ref<ColorHSL> to a target color with alpha', () => {
    const ref = Ref.create<ColorHSL>({ h: 100, s: 1, l: 0.25, a: 0.3 });
    const target = { h: 0, s: 0.5, l: 0.5, a: 0.8 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSL));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 75, s: 0.875, l: 0.3125, a: 0.425 });
    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, l: 0.5, a: 0.8 });
  });

  it('can tween ColorHSL to a target color', () => {
    const ref = { h: 100, s: 1, l: 0.25 };
    const target = { h: 0, s: 0.5, l: 0.5 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSL));
    queue.update(0.25);
    expect(ref).toEqual({ h: 75, s: 0.875, l: 0.3125 });

    queue.update(1);
    expect(ref).toEqual({ h: 0, s: 0.5, l: 0.5 });
  });
  it('can tween ColorHSL to a target color with alpha', () => {
    const ref = { h: 100, s: 1, l: 0.25, a: 0.3 };
    const target = { h: 0, s: 0.5, l: 0.5, a: 0.8 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSL));
    queue.update(0.25);
    expect(ref).toEqual({ h: 75, s: 0.875, l: 0.3125, a: 0.425 });
    queue.update(1);
    expect(ref).toEqual({ h: 0, s: 0.5, l: 0.5, a: 0.8 });
  });

  it('can tween Ref<ColorHSV> to a target color', () => {
    const ref = Ref.create<ColorHSV>({ h: 100, s: 1, v: 0.25 });
    const target = { h: 0, s: 0.5, v: 0.5 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSV));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 75, s: 0.875, v: 0.3125 });

    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, v: 0.5 });
  });
  it('can tween Ref<ColorHSV> to a target color with alpha', () => {
    const ref = Ref.create<ColorHSV>({ h: 100, s: 1, v: 0.25, a: 0.3 });
    const target = { h: 0, s: 0.5, v: 0.5, a: 0.8 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSV));
    queue.update(0.25);
    expect(ref.value).toEqual({ h: 75, s: 0.875, v: 0.3125, a: 0.425 });
    queue.update(1);
    expect(ref.value).toEqual({ h: 0, s: 0.5, v: 0.5, a: 0.8 });
  });

  it('can tween ColorHSV to a target color', () => {
    const ref = { h: 100, s: 1, v: 0.25 };
    const target = { h: 0, s: 0.5, v: 0.5 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSV));
    queue.update(0.25);
    expect(ref).toEqual({ h: 75, s: 0.875, v: 0.3125 });

    queue.update(1);
    expect(ref).toEqual({ h: 0, s: 0.5, v: 0.5 });
  });
  it('can tween ColorHSV to a target color with alpha', () => {
    const ref = { h: 100, s: 1, v: 0.25, a: 0.3 };
    const target = { h: 0, s: 0.5, v: 0.5, a: 0.8 };
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1, ColorLerpMode.HSV));
    queue.update(0.25);
    expect(ref).toEqual({ h: 75, s: 0.875, v: 0.3125, a: 0.425 });
    queue.update(1);
    expect(ref).toEqual({ h: 0, s: 0.5, v: 0.5, a: 0.8 });
  });

  it('can tween Ref<number> to target number', () => {
    const ref = Ref.create<number>(0xff00ff);
    const target = 0x00ff00;
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual(0xbf40bf);
  });

  it('can tween Ref<string> to target string over rgb', () => {
    const ref = Ref.create<string>('rgb(255,0,255)');
    const target = 'rgb(0,255,0)';
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('rgb(191.25,63.75,191.25)');
  });

  it('can tween Ref<string> to target string over hsl', () => {
    const ref = Ref.create<string>('hsl(100,100%,25%)');
    const target = 'hsl(0,50%,50%)';
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('rgb(79.687,111.563,15.938)');
  });

  it('can lerp between string colors of mismatched types', () => {
    const ref = Ref.create<string>('hsla(100,100%,25%, 0.5)');
    const target = 0xff00ff;
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('rgba(95.625,95.625,63.75,0.625)');
  });
  it('can lerp between a ColorRGB and string', () => {
    const ref = { r: 1, g: 0, b: 1 };
    const target = 'rgba(0,255,0,0.5)';
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref).toEqual({ r: 0.75, g: 0.25, b: 0.75, a: 0.875 });
  });
  it('can lerp between hex strings', () => {
    const ref = Ref.create('#FF00FF');
    const target = '#00FF00';
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('#bf40bf');
  });

  it('will throw an exception when given an invalidly formatted string', () => {
    const ref = Ref.create('#FF00FF');
    expect(() => changeToColor(ref, 'invalid', 0.3)).toThrowErrorMatchingInlineSnapshot(`"Invalid color undefined"`);
  });
  it('will assume the color is white, when lerping from an invalid color', () => {
    const ref = Ref.create('#invalid');
    const target = '#00FF00';
    const queue = new CommandQueue();
    queue.push(changeToColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('#bfffbf');
  });
});

describe('changeFromColor', () => {
  it('can tween a ColorRGB value', () => {
    const ref = { r: 1, g: 0.5, b: 0 };
    const target = { r: 0, g: 1, b: 1 };
    const queue = new CommandQueue();
    queue.push(changeFromColor(ref, target, 1));
    queue.update(0.25);
    expect(ref).toEqual({ r: 0.25, g: 0.875, b: 0.75 });
  });
  it('can tween a ColorHSV value', () => {
    const ref = { h: 100, s: 1, v: 0.25, a: 0.2 };
    const target = { h: 0, s: 0.5, v: 0.5, a: 0.8 };
    const queue = new CommandQueue();
    queue.push(changeFromColor(ref, target, 1, ColorLerpMode.HSV));
    queue.update(0.25);
    expect(ref).toEqual({ h: 25, s: 0.625, v: 0.4375, a: 0.65 });
  });
  it('will throw an exception when given an invalidly formatted string', () => {
    const ref = Ref.create('#FF00FF');
    expect(() => changeFromColor(ref, 'invalid', 0.3)).toThrowErrorMatchingInlineSnapshot(`"Invalid color undefined"`);
  });
  it('will assume the color is white, when lerping to an invalid color', () => {
    const ref = Ref.create('#invalid');
    const target = '#00FF00';
    const queue = new CommandQueue();
    queue.push(changeFromColor(ref, target, 1));
    queue.update(0.25);
    expect(ref.value).toEqual('#40ff40');
  });
});
