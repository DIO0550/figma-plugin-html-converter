import type { Brand } from "../../../types";
import type { RGB } from "../colors";
import { Colors } from "../colors";
import { CSSValueAdapter } from "../css-values/adapter";

// Stylesのブランド型
export type Styles = Brand<Record<string, string>, "Styles">;

// サイズの結果型
export type SizeValue = {
  value: number;
  unit: "px" | "%" | "em" | "rem" | "vh" | "vw";
};

// ボーダー情報
export interface BorderStyle {
  width: number;
  style: "solid" | "dashed" | "dotted" | "double";
  color: RGB;
}

// px値または単位なしの数値のみを受け入れる正規表現パターン (Issue #88)
// マッチ例: "100", "100px", "12.5", "12.5px"
// 非マッチ例: "10rem", "50%", "calc(100% - 20px)", "auto"
const PX_OR_UNITLESS_PATTERN = /^(\d+(?:\.\d+)?)(px)?$/;

/**
 * px値または単位なしの数値のみを受け入れるヘルパー関数
 * @param sizeStr - チェックするサイズ文字列
 * @returns 有効な場合は数値、それ以外はundefined
 */
const parseSizeIfValid = (sizeStr: string | undefined): number | undefined => {
  if (!sizeStr || !PX_OR_UNITLESS_PATTERN.test(sizeStr.trim())) {
    return undefined;
  }
  const size = CSSValueAdapter.parseSize(sizeStr);
  return typeof size === "number" ? size : undefined;
};

/**
 * 指定されたプロパティから px値または単位なしの数値のみを取得するヘルパー関数
 * @param styles - Stylesオブジェクト
 * @param property - チェックするプロパティ名
 * @returns 有効な場合は数値、それ以外はnull
 */
const getSizeWithPxRestriction = (
  styles: Styles,
  property: string,
): number | null => {
  const value = styles[property];
  if (!value) return null;
  // px値、または単位なしの数値のみを受け入れ
  if (!PX_OR_UNITLESS_PATTERN.test(value.trim())) {
    return null;
  }
  const size = CSSValueAdapter.parseSize(value);
  return typeof size === "number" ? size : null;
};

// Stylesコンパニオンオブジェクト
export const Styles = {
  // 空のStylesを作成
  empty(): Styles {
    return {} as Styles;
  },

  // オブジェクトからStyles型を作成
  from(value: Record<string, string>): Styles {
    return value as Styles;
  },

  // インラインスタイル文字列をパース
  parse(styleString: string): Styles {
    const styles: Record<string, string> = {};

    if (!styleString.trim()) {
      return Styles.from(styles);
    }

    // セミコロンで分割し、各スタイルを処理
    styleString.split(";").forEach((style) => {
      const colonIndex = style.indexOf(":");
      if (colonIndex === -1) return;

      const property = style.substring(0, colonIndex).trim();
      const value = style.substring(colonIndex + 1).trim();

      if (property && value) {
        styles[property] = value;
      }
    });

    return Styles.from(styles);
  },

  // 特定のスタイルプロパティを取得
  get(styles: Styles, property: string): string | undefined {
    return styles[property];
  },

  // 特定のスタイルプロパティを設定
  set(styles: Styles, property: string, value: string): Styles {
    return Styles.from({ ...styles, [property]: value });
  },

  // 特定のスタイルプロパティを削除
  remove(styles: Styles, property: string): Styles {
    const { [property]: _, ...rest } = styles;
    return Styles.from(rest);
  },

  // Stylesをマージ
  merge(base: Styles, override: Styles): Styles {
    return Styles.from({ ...base, ...override });
  },

  // Stylesが空かどうか
  isEmpty(styles: Styles): boolean {
    return Object.keys(styles).length === 0;
  },

  // インラインスタイル文字列に変換
  toString(styles: Styles): string {
    return Object.entries(styles)
      .filter(([prop]) => prop !== "__brand")
      .map(([prop, value]) => `${prop}: ${value}`)
      .join("; ");
  },

  // サイズ値をパース
  parseSize(sizeString: string | undefined): number | SizeValue | null {
    return CSSValueAdapter.parseSize(sizeString);
  },

  // width プロパティを取得してパース
  getWidth(styles: Styles): number | SizeValue | null {
    const width = styles.width;
    return width ? CSSValueAdapter.parseSize(width) : null;
  },

  // height プロパティを取得してパース
  getHeight(styles: Styles): number | SizeValue | null {
    const height = styles.height;
    return height ? CSSValueAdapter.parseSize(height) : null;
  },

  // calc()関数をパース（後方互換性のため残す）
  parseCalc(calcStr: string): number | SizeValue | null {
    return CSSValueAdapter.parseSize(calcStr);
  },

  // カラー値をパース
  parseColor(colorString: string): RGB | null {
    return Colors.parse(colorString);
  },

  // background-color を取得してパース
  getBackgroundColor(styles: Styles): RGB | null {
    const bgColor = styles["background-color"] || styles.backgroundColor;
    return bgColor ? Styles.parseColor(bgColor) : null;
  },

  // color を取得してパース
  getColor(styles: Styles): RGB | null {
    const color = styles.color;
    return color ? Styles.parseColor(color) : null;
  },

  // ボーダーショートハンドをパース
  parseBorder(borderString: string): BorderStyle | null {
    const parts = borderString.trim().split(/\s+/);

    let width = 1;
    let style: BorderStyle["style"] = "solid";
    let color: RGB = { r: 0, g: 0, b: 0 };

    for (const part of parts) {
      // 幅の判定
      const sizeResult = Styles.parseSize(part);
      if (typeof sizeResult === "number") {
        width = sizeResult;
        continue;
      }

      // スタイルの判定
      if (["solid", "dashed", "dotted", "double"].includes(part)) {
        style = part as BorderStyle["style"];
        continue;
      }

      // カラーの判定
      const colorResult = Styles.parseColor(part);
      if (colorResult) {
        color = colorResult;
      }
    }

    return { width, style, color };
  },

  // border プロパティを取得してパース
  getBorder(styles: Styles): BorderStyle | null {
    const border = styles.border;
    return border ? Styles.parseBorder(border) : null;
  },

  // border-radius を取得してパース
  getBorderRadius(styles: Styles): number | SizeValue | null {
    const radius = styles["border-radius"] || styles.borderRadius;
    return radius ? Styles.parseSize(radius) : null;
  },

  // padding値をパース（ショートハンド対応）
  parsePadding(
    paddingString: string,
  ): { top: number; right: number; bottom: number; left: number } | null {
    return CSSValueAdapter.parsePadding(paddingString);
  },

  // padding を取得してパース
  getPadding(
    styles: Styles,
  ): { top: number; right: number; bottom: number; left: number } | null {
    const padding = styles.padding;
    return padding ? Styles.parsePadding(padding) : null;
  },

  // margin値をパース（paddingと同じロジック）
  getMargin(
    styles: Styles,
  ): { top: number; right: number; bottom: number; left: number } | null {
    const margin = styles.margin;
    return margin ? Styles.parsePadding(margin) : null;
  },

  // display プロパティを取得
  getDisplay(styles: Styles): string | undefined {
    return styles.display;
  },

  // opacity を取得してパース
  getOpacity(styles: Styles): number | null {
    const opacity = styles.opacity;
    if (!opacity) return null;

    const value = parseFloat(opacity);
    return isNaN(value) ? null : Math.max(0, Math.min(1, value));
  },

  // position プロパティを取得
  getPosition(styles: Styles): string | undefined {
    return styles.position;
  },

  // top, right, bottom, left プロパティを取得してパース
  getTop(styles: Styles): number | SizeValue | null {
    const top = styles.top;
    return top ? Styles.parseSize(top) : null;
  },

  getRight(styles: Styles): number | SizeValue | null {
    const right = styles.right;
    return right ? Styles.parseSize(right) : null;
  },

  getBottom(styles: Styles): number | SizeValue | null {
    const bottom = styles.bottom;
    return bottom ? Styles.parseSize(bottom) : null;
  },

  getLeft(styles: Styles): number | SizeValue | null {
    const left = styles.left;
    return left ? Styles.parseSize(left) : null;
  },

  // z-index を取得してパース
  getZIndex(styles: Styles): number | null {
    const zIndex = styles["z-index"] || styles.zIndex;
    if (!zIndex) return null;

    const value = parseInt(zIndex, 10);
    return isNaN(value) ? null : value;
  },

  // 個別のmargin値を取得
  getMarginTop(styles: Styles): number | SizeValue | null {
    const marginTop = styles["margin-top"] || styles.marginTop;
    return marginTop ? Styles.parseSize(marginTop) : null;
  },

  getMarginRight(styles: Styles): number | SizeValue | null {
    const marginRight = styles["margin-right"] || styles.marginRight;
    return marginRight ? Styles.parseSize(marginRight) : null;
  },

  getMarginBottom(styles: Styles): number | SizeValue | null {
    const marginBottom = styles["margin-bottom"] || styles.marginBottom;
    return marginBottom ? Styles.parseSize(marginBottom) : null;
  },

  getMarginLeft(styles: Styles): number | SizeValue | null {
    const marginLeft = styles["margin-left"] || styles.marginLeft;
    return marginLeft ? Styles.parseSize(marginLeft) : null;
  },

  // 個別のpadding値を取得
  getPaddingTop(styles: Styles): number | SizeValue | null {
    const paddingTop = styles["padding-top"] || styles.paddingTop;
    return paddingTop ? CSSValueAdapter.parseSize(paddingTop) : null;
  },

  getPaddingRight(styles: Styles): number | SizeValue | null {
    const paddingRight = styles["padding-right"] || styles.paddingRight;
    return paddingRight ? CSSValueAdapter.parseSize(paddingRight) : null;
  },

  getPaddingBottom(styles: Styles): number | SizeValue | null {
    const paddingBottom = styles["padding-bottom"] || styles.paddingBottom;
    return paddingBottom ? CSSValueAdapter.parseSize(paddingBottom) : null;
  },

  getPaddingLeft(styles: Styles): number | SizeValue | null {
    const paddingLeft = styles["padding-left"] || styles.paddingLeft;
    return paddingLeft ? CSSValueAdapter.parseSize(paddingLeft) : null;
  },

  // flex-wrap
  getFlexWrap(styles: Styles): string | null {
    return styles["flex-wrap"] || null;
  },

  // flex-grow
  getFlexGrow(styles: Styles): number | null {
    const flexGrow = styles["flex-grow"];
    if (flexGrow) {
      const value = parseFloat(flexGrow);
      return isNaN(value) ? null : value;
    }

    // flexショートハンドから取得
    const flex = styles.flex;
    if (flex) {
      const parts = flex.split(" ");
      const growValue = parseFloat(parts[0]);
      return isNaN(growValue) ? null : growValue;
    }

    return null;
  },

  // flex-shrink
  getFlexShrink(styles: Styles): number | null {
    const flexShrink = styles["flex-shrink"];
    if (flexShrink) {
      const value = parseFloat(flexShrink);
      return isNaN(value) ? null : value;
    }

    // flexショートハンドから取得
    const flex = styles.flex;
    if (flex) {
      const parts = flex.split(" ");
      if (parts.length >= 2) {
        const shrinkValue = parseFloat(parts[1]);
        return isNaN(shrinkValue) ? null : shrinkValue;
      }
    }

    return null;
  },

  // min-width (Issue #88: px値のみをサポート)
  getMinWidth(styles: Styles): number | null {
    return getSizeWithPxRestriction(styles, "min-width");
  },

  // max-width (Issue #88: px値のみをサポート)
  getMaxWidth(styles: Styles): number | null {
    return getSizeWithPxRestriction(styles, "max-width");
  },

  // min-height (Issue #88: px値のみをサポート)
  getMinHeight(styles: Styles): number | null {
    return getSizeWithPxRestriction(styles, "min-height");
  },

  // max-height (Issue #88: px値のみをサポート)
  getMaxHeight(styles: Styles): number | null {
    return getSizeWithPxRestriction(styles, "max-height");
  },

  // aspect-ratio
  getAspectRatio(styles: Styles): number | null {
    const aspectRatio = styles["aspect-ratio"];
    if (!aspectRatio) return null;

    // "16/9" や "16 / 9" 形式をパース
    const match = aspectRatio.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (match) {
      const width = parseFloat(match[1]);
      const height = parseFloat(match[2]);
      return width / height;
    }

    // 単一の数値
    const value = parseFloat(aspectRatio);
    return isNaN(value) ? null : value;
  },

  /**
   * FlexboxスタイルをFigmaNodeConfig用のオプションに変換
   */
  extractFlexboxOptions(styles: Styles): {
    display?: string;
    flexDirection?: string;
    gap?: number;
    alignItems?: string;
    justifyContent?: string;
  } {
    // Issue #88: px値、または単位なしの数値のみを受け入れ
    const gap = Styles.get(styles, "gap");
    const gapValue = parseSizeIfValid(gap);

    return {
      display: Styles.get(styles, "display"),
      flexDirection: Styles.get(styles, "flex-direction"),
      gap: gapValue,
      alignItems: Styles.get(styles, "align-items"),
      justifyContent: Styles.get(styles, "justify-content"),
    };
  },

  /**
   * ボーダースタイルをFigmaNodeConfig用のオプションに変換
   */
  extractBorderOptions(styles: Styles): {
    border?: { color: { r: number; g: number; b: number }; width: number };
    borderRadius?: number;
  } {
    const border = Styles.getBorder(styles);
    const borderRadius = Styles.getBorderRadius(styles);
    return {
      border: border || undefined,
      borderRadius: typeof borderRadius === "number" ? borderRadius : undefined,
    };
  },

  /**
   * サイズスタイルをFigmaNodeConfig用のオプションに変換
   */
  extractSizeOptions(styles: Styles): {
    width?: number;
    height?: number;
  } {
    // Issue #88: px値、または単位なしの数値のみを受け入れ
    return {
      width: parseSizeIfValid(styles.width),
      height: parseSizeIfValid(styles.height),
    };
  },
};
