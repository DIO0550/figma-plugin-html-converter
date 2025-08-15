import type { Brand } from '../../../types';
import { 
  RGB_RANGE,
  HSL_LIMITS,
  HEX_FORMAT,
  LUMINANCE_WEIGHTS 
} from '../../constants/color-constants';

// ローカル定数（このファイル内でのみ使用）
// 比較許容誤差
const DEFAULT_TOLERANCE = 0.001;

// HSL変換で使用する分数
const HUE_SEGMENT = 1/6;
const HUE_HALF = 1/2;
const HUE_TWO_THIRDS = 2/3;
const HUE_THIRD = 1/3;
const HUE_DIVISION = 6;
const LIGHTNESS_HALF = 0.5;

// 色の混合のデフォルトウェイト
const MIX_DEFAULT_WEIGHT = 0.5;

// RGB色の型定義（0-1の範囲）
export interface RGB {
  r: number; // 0-1
  g: number; // 0-1  
  b: number; // 0-1
}

// RGBA色の型定義
export interface RGBA extends RGB {
  a: number; // 0-1 (opacity)
}

// HSL色の型定義
export interface HSL {
  h: number; // 0-360 (hue)
  s: number; // 0-100 (saturation)
  l: number; // 0-100 (lightness)
}

// 16進数カラーのブランド型
export type HexColor = Brand<string, 'HexColor'>;

// 名前付きカラーの定義
export const NAMED_COLORS: Record<string, RGB> = {
  // 基本色
  red: { r: 1, g: 0, b: 0 },
  green: { r: 0, g: 0.5019607843137255, b: 0 },
  blue: { r: 0, g: 0, b: 1 },
  black: { r: 0, g: 0, b: 0 },
  white: { r: 1, g: 1, b: 1 },
  
  // 追加の基本色
  gray: { r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255 },
  grey: { r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255 },
  yellow: { r: 1, g: 1, b: 0 },
  cyan: { r: 0, g: 1, b: 1 },
  magenta: { r: 1, g: 0, b: 1 },
  
  // Web標準色
  orange: { r: 1, g: 0.6470588235294118, b: 0 },
  purple: { r: 0.5019607843137255, g: 0, b: 0.5019607843137255 },
  brown: { r: 0.6470588235294118, g: 0.16470588235294117, b: 0.16470588235294117 },
  pink: { r: 1, g: 0.7529411764705882, b: 0.796078431372549 },
  lime: { r: 0, g: 1, b: 0 },
  navy: { r: 0, g: 0, b: 0.5019607843137255 },
  
  // 透明
  transparent: { r: 0, g: 0, b: 0 }
} as const;

// Colorsユーティリティ
export const Colors = {
  // RGB値を作成（0-255の値から0-1に変換）
  rgb(r: number, g: number, b: number): RGB {
    return {
      r: clamp(r / RGB_RANGE.MAX_VALUE, 0, 1),
      g: clamp(g / RGB_RANGE.MAX_VALUE, 0, 1),
      b: clamp(b / RGB_RANGE.MAX_VALUE, 0, 1)
    };
  },

  // RGBA値を作成
  rgba(r: number, g: number, b: number, a: number): RGBA {
    return {
      ...Colors.rgb(r, g, b),
      a: clamp(a, 0, 1)
    };
  },

  // 16進数カラーからRGBに変換
  fromHex(hex: string): RGB | null {
    let cleanHex = hex.replace('#', '');

    // 3桁の場合は6桁に展開
    if (cleanHex.length === HEX_FORMAT.SHORT_LENGTH) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }

    if (cleanHex.length !== HEX_FORMAT.FULL_LENGTH) return null;
    
    // 16進数として有効な文字のみ含まれているかチェック
    if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) return null;

    const r = parseInt(cleanHex.substring(0, 2), HEX_FORMAT.RADIX) / RGB_RANGE.MAX_VALUE;
    const g = parseInt(cleanHex.substring(2, 4), HEX_FORMAT.RADIX) / RGB_RANGE.MAX_VALUE;
    const b = parseInt(cleanHex.substring(4, 6), HEX_FORMAT.RADIX) / RGB_RANGE.MAX_VALUE;

    return { r, g, b };
  },

  // RGBから16進数カラーに変換
  toHex(color: RGB): HexColor {
    const toHexPart = (value: number) => {
      const hex = Math.round(value * RGB_RANGE.MAX_VALUE).toString(HEX_FORMAT.RADIX);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const hex = `#${toHexPart(color.r)}${toHexPart(color.g)}${toHexPart(color.b)}`;
    return hex as HexColor;
  },

  // rgb()またはrgba()関数文字列からRGBに変換
  fromRgbString(rgbString: string): RGB | null {
    const match = rgbString.match(/rgba?\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*(?:,\s*[\d.]+)?\s*\)/);
    if (!match) return null;

    return Colors.rgb(
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3])
    );
  },

  // RGBをrgb()関数文字列に変換
  toRgbString(color: RGB): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `rgb(${r}, ${g}, ${b})`;
  },

  // RGBAをrgba()関数文字列に変換
  toRgbaString(color: RGBA): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `rgba(${r}, ${g}, ${b}, ${color.a})`;
  },

  // 名前付きカラーからRGBに変換
  fromName(name: string): RGB | null {
    return NAMED_COLORS[name.toLowerCase()] || null;
  },

  // カラー文字列をパース（hex, rgb, 名前付き）
  parse(colorString: string): RGB | null {
    const trimmed = colorString.trim();

    // 16進数カラー
    if (trimmed.startsWith('#')) {
      return Colors.fromHex(trimmed);
    }

    // rgb()またはrgba()関数
    if (trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(')) {
      return Colors.fromRgbString(trimmed);
    }

    // 名前付きカラー
    return Colors.fromName(trimmed);
  },

  // RGBからHSLに変換
  toHsl(color: RGB): HSL {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));

      if (max === color.r) {
        h = ((color.g - color.b) / delta + (color.g < color.b ? 6 : 0)) / 6;
      } else if (max === color.g) {
        h = ((color.b - color.r) / delta + 2) / 6;
      } else {
        h = ((color.r - color.g) / delta + 4) / 6;
      }
    }

    return {
      h: Math.round(h * HSL_LIMITS.HUE_MAX_DEGREES),
      s: Math.round(s * HSL_LIMITS.SATURATION_MAX),
      l: Math.round(l * HSL_LIMITS.LIGHTNESS_MAX)
    };
  },

  // HSLからRGBに変換
  fromHsl(hsl: HSL): RGB {
    const h = hsl.h / HSL_LIMITS.HUE_MAX_DEGREES;
    const s = hsl.s / HSL_LIMITS.SATURATION_MAX;
    const l = hsl.l / HSL_LIMITS.LIGHTNESS_MAX;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < HUE_SEGMENT) return p + (q - p) * HUE_DIVISION * t;
        if (t < HUE_HALF) return q;
        if (t < HUE_TWO_THIRDS) return p + (q - p) * (HUE_TWO_THIRDS - t) * HUE_DIVISION;
        return p;
      };

      const q = l < LIGHTNESS_HALF ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + HUE_THIRD);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - HUE_THIRD);
    }

    return { r, g, b };
  },

  // 色の明度を調整
  lighten(color: RGB, amount: number): RGB {
    const hsl = Colors.toHsl(color);
    hsl.l = Math.min(HSL_LIMITS.LIGHTNESS_MAX, hsl.l + amount);
    return Colors.fromHsl(hsl);
  },

  // 色の暗度を調整
  darken(color: RGB, amount: number): RGB {
    const hsl = Colors.toHsl(color);
    hsl.l = Math.max(0, hsl.l - amount);
    return Colors.fromHsl(hsl);
  },

  // 色の彩度を調整
  saturate(color: RGB, amount: number): RGB {
    const hsl = Colors.toHsl(color);
    hsl.s = Math.min(HSL_LIMITS.SATURATION_MAX, hsl.s + amount);
    return Colors.fromHsl(hsl);
  },

  // 色の彩度を下げる
  desaturate(color: RGB, amount: number): RGB {
    const hsl = Colors.toHsl(color);
    hsl.s = Math.max(0, hsl.s - amount);
    return Colors.fromHsl(hsl);
  },

  // グレースケールに変換
  grayscale(color: RGB): RGB {
    const gray = color.r * LUMINANCE_WEIGHTS.RED + 
                  color.g * LUMINANCE_WEIGHTS.GREEN + 
                  color.b * LUMINANCE_WEIGHTS.BLUE;
    return { r: gray, g: gray, b: gray };
  },

  // 色を反転
  invert(color: RGB): RGB {
    return {
      r: 1 - color.r,
      g: 1 - color.g,
      b: 1 - color.b
    };
  },

  // 2色を混合
  mix(color1: RGB, color2: RGB, weight: number = MIX_DEFAULT_WEIGHT): RGB {
    const w = clamp(weight, 0, 1);
    return {
      r: color1.r * (1 - w) + color2.r * w,
      g: color1.g * (1 - w) + color2.g * w,
      b: color1.b * (1 - w) + color2.b * w
    };
  },

  // 色が等しいか判定
  equals(color1: RGB, color2: RGB, tolerance: number = DEFAULT_TOLERANCE): boolean {
    return Math.abs(color1.r - color2.r) <= tolerance &&
           Math.abs(color1.g - color2.g) <= tolerance &&
           Math.abs(color1.b - color2.b) <= tolerance;
  }
};

// ヘルパー関数
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}