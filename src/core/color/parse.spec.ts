import { parseColor } from './parse';
import { ColorFormat } from './color-types';

describe('parseColor', () => {
  it('unpacks rgb numbers into the range 0->1', () => {
    const result = parseColor(0xf1acbd);
    expect(result).toEqual({ format: ColorFormat.NUMBER, color: { r: 241 / 255, g: 172 / 255, b: 189 / 255, a: 1 } });
  });

  it('parses a predefined color name', () => {
    const color = parseColor('cadetblue');
    expect(color).toEqual({ format: ColorFormat.STRING, color: { r: 95 / 255, g: 158 / 255, b: 160 / 255, a: 1 } });
  });
  it('parses transparent color name', () => {
    const color = parseColor('transparent');
    expect(color).toEqual({ format: ColorFormat.STRING, color: { r: 0, g: 0, b: 0, a: 0 } });
  });
  it('parses a predefined color name with bad casing', () => {
    const color = parseColor('caDetBluE');
    expect(color).toEqual({ format: ColorFormat.STRING, color: { r: 95 / 255, g: 158 / 255, b: 160 / 255, a: 1 } });
  });

  it('parses a 6 digit hex color', () => {
    const result = parseColor('#f1acbd');
    expect(result).toEqual({
      format: ColorFormat.HEX_STRING,
      color: { r: 241 / 255, g: 172 / 255, b: 189 / 255, a: 1 }
    });
  });
  it('parses a 8 digit hex color with alpha', () => {
    const result = parseColor('#f1acbdAA');
    expect(result).toEqual({
      format: ColorFormat.HEX_STRING,
      color: { r: 241 / 255, g: 172 / 255, b: 189 / 255, a: 170 / 255 }
    });
  });
  it('parses a 3 digit hex color', () => {
    const result = parseColor('#fab');
    expect(result).toEqual({ format: ColorFormat.HEX_STRING, color: { r: 1, g: 10 / 15, b: 11 / 15, a: 1 } });
  });
  it('parses a 3 digit hex color', () => {
    const result = parseColor('#fab');
    expect(result).toEqual({ format: ColorFormat.HEX_STRING, color: { r: 1, g: 10 / 15, b: 11 / 15, a: 1 } });
  });
  it('parses a 4 digit hex color', () => {
    const result = parseColor('#fabB');
    expect(result).toEqual({ format: ColorFormat.HEX_STRING, color: { r: 1, g: 10 / 15, b: 11 / 15, a: 11 / 15 } });
  });

  it('parses a hex string which is too long as undefined', () => {
    const result = parseColor('#fabAAAA99');
    expect(result).toBeUndefined();
  });
  it('parses a hex string with bad characters as undefined', () => {
    const result = parseColor('#faHA');
    expect(result).toBeUndefined();
  });

  it('parses rgb strings with commas', () => {
    const colors = [
      // Functional syntax
      'rgb(255,0,153)',
      'rgb(255, 0, 153)',
      'rgb(100%,0%,60%)',
      'rgb(100%, 0%, 60%)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { r: 1, g: 0, b: 153 / 255, a: 1 } });
    }
  });

  it('parses an rgb string as undefined when mixing percentage and decimal', () => {
    const result = parseColor('rgb(100%, 0, 60%)'); // ERROR! Don't mix integers and percentages.
    expect(result).toBeUndefined();
  });

  it('parses an rgb string as undefined if it is missing numbers', () => {
    const result = parseColor('rgb(100%, 0%)');
    expect(result).toBeUndefined();
  });

  it('parses rgb strings with whitespaces', () => {
    const colors = ['rgb(255 0 153)', 'rgb(100% 0% 60%)'];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { r: 1, g: 0, b: 153 / 255, a: 1 } });
    }
  });

  it('parses rgb strings with optional transparency', () => {
    const colors = [
      // Functional syntax with alpha value
      'rgb(255, 0, 153, 0.5)',
      'rgb(255, 0, 153, 50%)',
      // Whitespace syntax
      'rgb(255 0 153 / 0.5)',
      'rgb(255 0 153 / 50%)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { r: 1, g: 0, b: 153 / 255, a: 0.5 } });
    }
  });

  it('parses rgb strings with invalid number of arguments as undefined', () => {
    const colors = [
      'rgb(255, 0, 153, 0.5, 2)',
      'rgb(255, 0, 153, 50%, 5, 6)',
      'rgb(255 0 153 0.5)',
      'rgb(255 0 153 Y 50%)',
      'rgb(255, 0, 1',
      'rgb(a, 0, 1)',
      'rgb(1, 0, 1, a)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toBeUndefined();
    }
  });

  it('parses rgb with decimal values while rounding', () => {
    const result = parseColor('rgb(1e2, .5e1, .5e0, +.25e2%)');
    expect(result).toEqual({ format: ColorFormat.STRING, color: { r: 100 / 255, g: 5 / 255, b: 0.5 / 255, a: 0.25 } });
  });
  it('parses rgba strings', () => {
    const colors = [
      // Functional syntax with alpha value
      'rgba(255, 0, 153, 0.5)',
      'rgba(255, 0, 153, 50%)',
      // Whitespace syntax
      'rgba(255 0 153 / 0.5)',
      'rgba(255 0 153 / 50%)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { r: 1, g: 0, b: 153 / 255, a: 0.5 } });
    }
  });

  it('parses hsl strings with commas or whitepaces', () => {
    const colors = ['hsl(270,60%,70%)', 'hsl(270, 60%, 70%)', 'hsl(270 60% 70%)'];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { h: 270, s: 0.6, l: 0.7, a: 1 } });
    }
  });
  it('parses hsl strings alternate degree forms', () => {
    const colors = [
      'hsl(270deg, 60%, 70%)',
      'hsl(.75turn, 60%, 70%)',
      'hsl(4.71238898038469rad, 60%, 70%)',
      'hsl(300grad,60%,70%)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { h: 270, s: 0.6, l: 0.7, a: 1 } });
    }
  });
  it('parses hsl strings with alpha values', () => {
    const colors = [
      'hsl(270,60%,70%, 0.5)',
      'hsl(270, 60%, 70%, 50%)',
      'hsl(270 60% 70% / 0.5)',
      'hsl(270 60% 70% / 50%)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { h: 270, s: 0.6, l: 0.7, a: 0.5 } });
    }
  });
  it('parses invalid hsl strings as undefined', () => {
    const colors = [
      'hsl(0, 0, 0%)',
      'hsl(0, 0%, 0)',
      'hsl(a, 0%, 0%)',
      'hsl(0, a%, 0%)',
      'hsl(10 1%, 1% 1)',
      'hsl(1,2%,2%,1,2)',
      'hsl(1,2%,2%,a)',
      'hsl(1 2% 2% a 0)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toBeUndefined();
    }
  });

  it('parses hsla strings', () => {
    const colors = [
      'hsla(270,60%,70%, 0.5)',
      'hsla(270, 60%, 70%, 50%)',
      'hsla(270 60% 70% / 0.5)',
      'hsla(270 60% 70% / 50%)'
    ];
    for (const color of colors) {
      const result = parseColor(color);
      expect(result).toEqual({ format: ColorFormat.STRING, color: { h: 270, s: 0.6, l: 0.7, a: 0.5 } });
    }
  });

  it('returns undefined for unknown strings', () => {
    const result = parseColor('cmyk(0,0,0,0)');
    expect(result).toBeUndefined();
  });
});
