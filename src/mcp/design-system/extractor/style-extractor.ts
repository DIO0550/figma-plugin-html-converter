/**
 * スタイル抽出機能
 *
 * デザインシステムスタイルから詳細情報を抽出し、
 * CSS プロパティへの変換機能を提供する。
 */
import type {
  DesignSystemStyle,
  PaintStyleInfo,
  TextStyleInfo,
  EffectStyleInfo,
  GridStyleInfo,
} from "../types";

// =============================================================================
// 抽出結果の型定義
// =============================================================================

/**
 * カラー情報
 */
export interface ColorInfo {
  type: "solid" | "gradient";
  hex?: string;
  rgb?: { r: number; g: number; b: number };
  opacity: number;
  gradientStops?: Array<{
    position: number;
    color: string;
  }>;
}

/**
 * タイポグラフィ情報
 */
export interface TypographyInfo {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number | "normal";
  letterSpacing: number;
  cssValue: string;
}

/**
 * エフェクト情報
 * NOTE: typeにstringを含めることで、Figma APIで新しく追加された
 * エフェクトタイプ（NOISE, TEXTURE, GLASS等）にも対応可能
 */
export interface EffectInfo {
  type:
    | "drop-shadow"
    | "inner-shadow"
    | "layer-blur"
    | "background-blur"
    | string;
  offsetX?: number;
  offsetY?: number;
  blurRadius?: number;
  spreadRadius?: number;
  color?: string;
  cssValue: string;
}

/**
 * カテゴリ別スタイル
 */
export interface CategorizedStyles {
  paint: PaintStyleInfo[];
  text: TextStyleInfo[];
  effect: EffectStyleInfo[];
  grid: GridStyleInfo[];
}

// =============================================================================
// 定数
// =============================================================================

/** RGB値の最大値（0-255） */
const RGB_MAX_VALUE = 255;

/** 16進数の基数 */
const HEX_RADIX = 16;

/** 16進数の桁数（1バイト = 2桁） */
const HEX_PAD_LENGTH = 2;

/** パーセント値の乗数 */
const PERCENTAGE_MULTIPLIER = 100;

// =============================================================================
// StyleExtractor クラス
// =============================================================================

/**
 * スタイル抽出クラス
 */
export class StyleExtractor {
  private constructor() {}

  /**
   * インスタンスを作成する
   */
  static create(): StyleExtractor {
    return new StyleExtractor();
  }

  /**
   * ペイントスタイルからカラー情報を抽出する
   */
  extractColorInfo(style: PaintStyleInfo): ColorInfo | null {
    const paints = style.paints;
    if (paints.length === 0) {
      return null;
    }

    const firstPaint = paints[0];

    if (firstPaint.type === "SOLID") {
      const color = firstPaint.color;
      const rgb = {
        r: Math.round(color.r * RGB_MAX_VALUE),
        g: Math.round(color.g * RGB_MAX_VALUE),
        b: Math.round(color.b * RGB_MAX_VALUE),
      };
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

      return {
        type: "solid",
        hex,
        rgb,
        opacity: firstPaint.opacity ?? 1,
      };
    }

    if (
      firstPaint.type === "GRADIENT_LINEAR" ||
      firstPaint.type === "GRADIENT_RADIAL" ||
      firstPaint.type === "GRADIENT_ANGULAR" ||
      firstPaint.type === "GRADIENT_DIAMOND"
    ) {
      const gradientStops = firstPaint.gradientStops.map((stop) => ({
        position: stop.position,
        color: this.rgbaToColorString(
          Math.round(stop.color.r * RGB_MAX_VALUE),
          Math.round(stop.color.g * RGB_MAX_VALUE),
          Math.round(stop.color.b * RGB_MAX_VALUE),
          stop.color.a,
        ),
      }));

      return {
        type: "gradient",
        opacity: 1,
        gradientStops,
      };
    }

    return null;
  }

  /**
   * テキストスタイルからタイポグラフィ情報を抽出する
   */
  extractTypographyInfo(style: TextStyleInfo): TypographyInfo {
    const lineHeightValue =
      style.lineHeight === undefined
        ? "normal"
        : style.lineHeight === "AUTO"
          ? "normal"
          : style.lineHeight;
    const lineHeightCss =
      style.lineHeight === undefined || style.lineHeight === "AUTO"
        ? "normal"
        : `${style.lineHeight}px`;

    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: lineHeightValue,
      letterSpacing: style.letterSpacing ?? 0,
      cssValue: `${style.fontWeight} ${style.fontSize}px/${lineHeightCss} ${style.fontFamily}`,
    };
  }

  /**
   * エフェクトスタイルからエフェクト情報を抽出する
   */
  extractEffectInfo(style: EffectStyleInfo): EffectInfo[] {
    return style.effects
      .filter((effect) => effect.visible !== false)
      .map((effect) => this.convertEffect(effect));
  }

  /**
   * スタイルをカテゴリ別に分類する
   */
  categorizeStyles(styles: DesignSystemStyle[]): CategorizedStyles {
    const result: CategorizedStyles = {
      paint: [],
      text: [],
      effect: [],
      grid: [],
    };

    for (const style of styles) {
      switch (style.type) {
        case "PAINT":
          result.paint.push(style);
          break;
        case "TEXT":
          result.text.push(style);
          break;
        case "EFFECT":
          result.effect.push(style);
          break;
        case "GRID":
          result.grid.push(style);
          break;
      }
    }

    return result;
  }

  /**
   * 名前パターンでスタイルを検索する
   */
  findMatchingStyles(
    styles: DesignSystemStyle[],
    pattern: string,
  ): DesignSystemStyle[] {
    const lowerPattern = pattern.toLowerCase();
    return styles.filter((style) =>
      style.name.toLowerCase().includes(lowerPattern),
    );
  }

  /**
   * スタイルをCSS プロパティに変換する
   */
  toCssProperties(style: DesignSystemStyle): Record<string, string> {
    switch (style.type) {
      case "PAINT":
        return this.paintToCss(style);
      case "TEXT":
        return this.textToCss(style);
      case "EFFECT":
        return this.effectToCss(style);
      case "GRID":
        return this.gridToCss(style);
      default:
        return {};
    }
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
  }

  private rgbaToColorString(
    r: number,
    g: number,
    b: number,
    a: number,
  ): string {
    if (a === 1) {
      return this.rgbToHex(r, g, b);
    }
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  private toHex(n: number): string {
    return n.toString(HEX_RADIX).padStart(HEX_PAD_LENGTH, "0");
  }

  private convertEffect(effect: Effect): EffectInfo {
    const baseInfo = {
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 0.25)",
      cssValue: "",
    };

    switch (effect.type) {
      case "DROP_SHADOW": {
        const color = this.effectColorToCss(effect.color);
        const cssValue = `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${effect.spread ?? 0}px ${color}`;
        return {
          type: "drop-shadow",
          offsetX: effect.offset.x,
          offsetY: effect.offset.y,
          blurRadius: effect.radius,
          spreadRadius: effect.spread ?? 0,
          color,
          cssValue,
        };
      }
      case "INNER_SHADOW": {
        const color = this.effectColorToCss(effect.color);
        const cssValue = `inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${effect.spread ?? 0}px ${color}`;
        return {
          type: "inner-shadow",
          offsetX: effect.offset.x,
          offsetY: effect.offset.y,
          blurRadius: effect.radius,
          spreadRadius: effect.spread ?? 0,
          color,
          cssValue,
        };
      }
      case "LAYER_BLUR": {
        return {
          ...baseInfo,
          type: "layer-blur",
          blurRadius: effect.radius,
          cssValue: `blur(${effect.radius}px)`,
        };
      }
      case "BACKGROUND_BLUR": {
        return {
          ...baseInfo,
          type: "background-blur",
          blurRadius: effect.radius,
          cssValue: `blur(${effect.radius}px)`,
        };
      }
      default: {
        // Figma APIで新しく追加されたエフェクトタイプ（NOISE, TEXTURE, GLASS等）は
        // 現時点でCSS変換をサポートしていないため、基本情報のみ返す
        const unknownType = effect.type;
        console.warn(
          `[StyleExtractor] 未対応のエフェクトタイプを検出しました: ${unknownType}`,
        );
        return {
          ...baseInfo,
          type: unknownType.toLowerCase() as EffectInfo["type"],
          cssValue: "",
        };
      }
    }
  }

  private effectColorToCss(color: RGBA): string {
    const r = Math.round(color.r * RGB_MAX_VALUE);
    const g = Math.round(color.g * RGB_MAX_VALUE);
    const b = Math.round(color.b * RGB_MAX_VALUE);
    return `rgba(${r}, ${g}, ${b}, ${color.a})`;
  }

  private paintToCss(style: PaintStyleInfo): Record<string, string> {
    const colorInfo = this.extractColorInfo(style);
    if (!colorInfo) {
      return {};
    }

    if (colorInfo.type === "solid" && colorInfo.hex) {
      if (colorInfo.opacity !== 1) {
        return {
          "background-color": `rgba(${colorInfo.rgb?.r}, ${colorInfo.rgb?.g}, ${colorInfo.rgb?.b}, ${colorInfo.opacity})`,
        };
      }
      return { "background-color": colorInfo.hex };
    }

    if (colorInfo.type === "gradient" && colorInfo.gradientStops) {
      const stops = colorInfo.gradientStops
        .map((s) => `${s.color} ${s.position * PERCENTAGE_MULTIPLIER}%`)
        .join(", ");
      return { "background-image": `linear-gradient(${stops})` };
    }

    return {};
  }

  private textToCss(style: TextStyleInfo): Record<string, string> {
    const css: Record<string, string> = {
      "font-family": style.fontFamily,
      "font-size": `${style.fontSize}px`,
      "font-weight": String(style.fontWeight),
    };

    if (style.lineHeight !== undefined) {
      css["line-height"] =
        style.lineHeight === "AUTO" ? "normal" : `${style.lineHeight}px`;
    }

    if (style.letterSpacing !== undefined && style.letterSpacing !== 0) {
      css["letter-spacing"] = `${style.letterSpacing}px`;
    }

    return css;
  }

  private effectToCss(style: EffectStyleInfo): Record<string, string> {
    const effects = this.extractEffectInfo(style);
    if (effects.length === 0) {
      return {};
    }

    const shadows = effects
      .filter((e) => e.type === "drop-shadow" || e.type === "inner-shadow")
      .map((e) => e.cssValue);

    const blurs = effects
      .filter((e) => e.type === "layer-blur" || e.type === "background-blur")
      .map((e) => e.cssValue);

    const css: Record<string, string> = {};

    if (shadows.length > 0) {
      css["box-shadow"] = shadows.join(", ");
    }

    if (blurs.length > 0) {
      css["filter"] = blurs.join(" ");
    }

    return css;
  }

  private gridToCss(_style: GridStyleInfo): Record<string, string> {
    // グリッドスタイルはCSSへの直接変換が複雑なため、
    // 基本的な情報のみ返す
    return {};
  }
}
