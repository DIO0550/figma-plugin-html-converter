import type { Brand } from '../../../types';
import type { RGB } from '../colors';
import { Colors } from '../colors';

// Stylesのブランド型
export type Styles = Brand<Record<string, string>, 'Styles'>;

// サイズの結果型
export type SizeValue = {
  value: number;
  unit: 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw';
};

// ボーダー情報
export interface BorderStyle {
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  color: RGB;
}


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
    styleString.split(';').forEach(style => {
      const colonIndex = style.indexOf(':');
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
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('; ');
  },

  // サイズ値をパース
  parseSize(sizeString: string | undefined): number | SizeValue | null {
    if (!sizeString) return null;

    const trimmed = sizeString.trim();
    
    // 特殊な値
    if (trimmed === 'auto' || trimmed === 'inherit') {
      return null;
    }

    // 数値と単位を分離
    const match = trimmed.match(/^([\d.]+)(px|%|em|rem|vh|vw)?$/);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const unit = match[2] as SizeValue['unit'] | undefined;

    // ピクセルまたは単位なしの場合は数値を返す
    if (!unit || unit === 'px') {
      return value;
    }
    
    // viewport units
    if (unit === 'vw') {
      // 1920pxをデフォルトビューポート幅として使用
      return value * 19.2;
    }
    if (unit === 'vh') {
      // 1080pxをデフォルトビューポート高さとして使用
      return value * 10.8;
    }
    
    // rem/em単位はピクセルに変換
    if (unit === 'rem' || unit === 'em') {
      return value * 16; // デフォルトフォントサイズ16pxとして計算
    }

    // その他の単位は単位付きで返す
    return { value, unit };
  },

  // width プロパティを取得してパース
  getWidth(styles: Styles): number | SizeValue | null {
    const width = styles.width;
    if (!width) return null;
    
    // calc()のサポート
    if (width.includes('calc')) {
      return Styles.parseCalc(width);
    }
    
    return Styles.parseSize(width);
  },

  // height プロパティを取得してパース
  getHeight(styles: Styles): number | SizeValue | null {
    const height = styles.height;
    if (!height) return null;
    
    // calc()のサポート
    if (height.includes('calc')) {
      return Styles.parseCalc(height);
    }
    
    return Styles.parseSize(height);
  },
  
  // calc()関数をパース（簡略版）
  parseCalc(calcStr: string): number | SizeValue | null {
    // calc(50vh + 100px) のような簡単なケースを処理
    const match = calcStr.match(/calc\(([^)]+)\)/);
    if (!match) return null;
    
    const expr = match[1];
    
    // 簡単な加算・減算のみサポート
    const addMatch = expr.match(/(\d+(?:\.\d+)?)(vw|vh|px|%|rem|em)?\s*\+\s*(\d+(?:\.\d+)?)(px|%|rem|em)?/);
    if (addMatch) {
      const val1 = parseFloat(addMatch[1]);
      const unit1 = addMatch[2] || 'px';
      const val2 = parseFloat(addMatch[3]);
      const unit2 = addMatch[4] || 'px';
      
      // 異なる単位の場合、ピクセルに変換
      let result = 0;
      if (unit1 === 'vh') result += val1 * 10.8; // 1080 / 100
      else if (unit1 === 'vw') result += val1 * 19.2; // 1920 / 100
      else if (unit1 === 'rem' || unit1 === 'em') result += val1 * 16;
      else result += val1;
      
      if (unit2 === 'rem' || unit2 === 'em') result += val2 * 16;
      else result += val2;
      
      return result;
    }
    
    const subMatch = expr.match(/(\d+(?:\.\d+)?)(vw|vh|px|%|rem|em)?\s*-\s*(\d+(?:\.\d+)?)(px|%|rem|em)?/);
    if (subMatch) {
      const val1 = parseFloat(subMatch[1]);
      const unit1 = subMatch[2] || 'px';
      
      // パーセンテージと固定値の計算
      if (unit1 === '%' && val1 === 100) {
        // 100% - 40px のようなケース
        return { value: val1, unit: '%' } as SizeValue;
      }
    }
    
    return null;
  },

  // カラー値をパース
  parseColor(colorString: string): RGB | null {
    return Colors.parse(colorString);
  },

  // background-color を取得してパース
  getBackgroundColor(styles: Styles): RGB | null {
    const bgColor = styles['background-color'] || styles.backgroundColor;
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
    let style: BorderStyle['style'] = 'solid';
    let color: RGB = { r: 0, g: 0, b: 0 };

    for (const part of parts) {
      // 幅の判定
      const sizeResult = Styles.parseSize(part);
      if (typeof sizeResult === 'number') {
        width = sizeResult;
        continue;
      }

      // スタイルの判定
      if (['solid', 'dashed', 'dotted', 'double'].includes(part)) {
        style = part as BorderStyle['style'];
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
    const radius = styles['border-radius'] || styles.borderRadius;
    return radius ? Styles.parseSize(radius) : null;
  },

  // padding値をパース（ショートハンド対応）
  parsePadding(paddingString: string): { top: number; right: number; bottom: number; left: number } | null {
    const parts = paddingString.trim().split(/\s+/).map(p => {
      // calc()のサポート
      if (p.includes('calc')) {
        const calcResult = Styles.parseCalc(p);
        return typeof calcResult === 'number' ? calcResult : 0;
      }
      const size = Styles.parseSize(p);
      return typeof size === 'number' ? size : 0;
    });

    if (parts.length === 0) return null;

    // CSS padding ショートハンド規則
    if (parts.length === 1) {
      const value = parts[0];
      return { top: value, right: value, bottom: value, left: value };
    }
    if (parts.length === 2) {
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    }
    if (parts.length === 3) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    }
    if (parts.length >= 4) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    }

    return null;
  },

  // padding を取得してパース
  getPadding(styles: Styles): { top: number; right: number; bottom: number; left: number } | null {
    const padding = styles.padding;
    return padding ? Styles.parsePadding(padding) : null;
  },

  // margin値をパース（paddingと同じロジック）
  getMargin(styles: Styles): { top: number; right: number; bottom: number; left: number } | null {
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
    const zIndex = styles['z-index'] || styles.zIndex;
    if (!zIndex) return null;
    
    const value = parseInt(zIndex, 10);
    return isNaN(value) ? null : value;
  },

  // 個別のmargin値を取得
  getMarginTop(styles: Styles): number | SizeValue | null {
    const marginTop = styles['margin-top'] || styles.marginTop;
    return marginTop ? Styles.parseSize(marginTop) : null;
  },

  getMarginRight(styles: Styles): number | SizeValue | null {
    const marginRight = styles['margin-right'] || styles.marginRight;
    return marginRight ? Styles.parseSize(marginRight) : null;
  },

  getMarginBottom(styles: Styles): number | SizeValue | null {
    const marginBottom = styles['margin-bottom'] || styles.marginBottom;
    return marginBottom ? Styles.parseSize(marginBottom) : null;
  },

  getMarginLeft(styles: Styles): number | SizeValue | null {
    const marginLeft = styles['margin-left'] || styles.marginLeft;
    return marginLeft ? Styles.parseSize(marginLeft) : null;
  },

  // 個別のpadding値を取得
  getPaddingTop(styles: Styles): number | SizeValue | null {
    const paddingTop = styles['padding-top'] || styles.paddingTop;
    if (!paddingTop) return null;
    // calc()のサポート
    if (paddingTop.includes('calc')) {
      return Styles.parseCalc(paddingTop);
    }
    return Styles.parseSize(paddingTop);
  },

  getPaddingRight(styles: Styles): number | SizeValue | null {
    const paddingRight = styles['padding-right'] || styles.paddingRight;
    if (!paddingRight) return null;
    // calc()のサポート
    if (paddingRight.includes('calc')) {
      return Styles.parseCalc(paddingRight);
    }
    return Styles.parseSize(paddingRight);
  },

  getPaddingBottom(styles: Styles): number | SizeValue | null {
    const paddingBottom = styles['padding-bottom'] || styles.paddingBottom;
    if (!paddingBottom) return null;
    // calc()のサポート
    if (paddingBottom.includes('calc')) {
      return Styles.parseCalc(paddingBottom);
    }
    return Styles.parseSize(paddingBottom);
  },

  getPaddingLeft(styles: Styles): number | SizeValue | null {
    const paddingLeft = styles['padding-left'] || styles.paddingLeft;
    if (!paddingLeft) return null;
    // calc()のサポート
    if (paddingLeft.includes('calc')) {
      return Styles.parseCalc(paddingLeft);
    }
    return Styles.parseSize(paddingLeft);
  },

  // flex-wrap
  getFlexWrap(styles: Styles): string | null {
    return styles['flex-wrap'] || null;
  },

  // flex-grow
  getFlexGrow(styles: Styles): number | null {
    const flexGrow = styles['flex-grow'];
    if (flexGrow) {
      const value = parseFloat(flexGrow);
      return isNaN(value) ? null : value;
    }
    
    // flexショートハンドから取得
    const flex = styles.flex;
    if (flex) {
      const parts = flex.split(' ');
      const growValue = parseFloat(parts[0]);
      return isNaN(growValue) ? null : growValue;
    }
    
    return null;
  },

  // flex-shrink
  getFlexShrink(styles: Styles): number | null {
    const flexShrink = styles['flex-shrink'];
    if (flexShrink) {
      const value = parseFloat(flexShrink);
      return isNaN(value) ? null : value;
    }
    
    // flexショートハンドから取得
    const flex = styles.flex;
    if (flex) {
      const parts = flex.split(' ');
      if (parts.length >= 2) {
        const shrinkValue = parseFloat(parts[1]);
        return isNaN(shrinkValue) ? null : shrinkValue;
      }
    }
    
    return null;
  },

  // min-width
  getMinWidth(styles: Styles): number | null {
    const minWidth = styles['min-width'];
    const size = Styles.parseSize(minWidth);
    return typeof size === 'number' ? size : null;
  },

  // max-width
  getMaxWidth(styles: Styles): number | null {
    const maxWidth = styles['max-width'];
    const size = Styles.parseSize(maxWidth);
    return typeof size === 'number' ? size : null;
  },

  // min-height
  getMinHeight(styles: Styles): number | null {
    const minHeight = styles['min-height'];
    const size = Styles.parseSize(minHeight);
    return typeof size === 'number' ? size : null;
  },

  // max-height
  getMaxHeight(styles: Styles): number | null {
    const maxHeight = styles['max-height'];
    const size = Styles.parseSize(maxHeight);
    return typeof size === 'number' ? size : null;
  },

  // aspect-ratio
  getAspectRatio(styles: Styles): number | null {
    const aspectRatio = styles['aspect-ratio'];
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
  }
};

