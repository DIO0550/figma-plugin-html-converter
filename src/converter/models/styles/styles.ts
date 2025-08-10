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

    // その他の単位は単位付きで返す
    return { value, unit };
  },

  // width プロパティを取得してパース
  getWidth(styles: Styles): number | SizeValue | null {
    const width = styles.width;
    return width ? Styles.parseSize(width) : null;
  },

  // height プロパティを取得してパース
  getHeight(styles: Styles): number | SizeValue | null {
    const height = styles.height;
    return height ? Styles.parseSize(height) : null;
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
    return paddingTop ? Styles.parseSize(paddingTop) : null;
  },

  getPaddingRight(styles: Styles): number | SizeValue | null {
    const paddingRight = styles['padding-right'] || styles.paddingRight;
    return paddingRight ? Styles.parseSize(paddingRight) : null;
  },

  getPaddingBottom(styles: Styles): number | SizeValue | null {
    const paddingBottom = styles['padding-bottom'] || styles.paddingBottom;
    return paddingBottom ? Styles.parseSize(paddingBottom) : null;
  },

  getPaddingLeft(styles: Styles): number | SizeValue | null {
    const paddingLeft = styles['padding-left'] || styles.paddingLeft;
    return paddingLeft ? Styles.parseSize(paddingLeft) : null;
  }
};

