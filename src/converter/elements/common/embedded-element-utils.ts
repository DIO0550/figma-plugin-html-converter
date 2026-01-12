/**
 * embed/object/iframe要素で共通して使用するユーティリティ関数
 * サイズ解析、URL検証、ボーダー処理などの共通ロジックを提供
 */

import { Styles } from "../../models/styles";

/**
 * HTML Living Standard仕様に準拠したデフォルト値
 * @see https://html.spec.whatwg.org/multipage/iframe-embed-object.html
 */
export const DEFAULT_EMBEDDED_SIZE: { WIDTH: number; HEIGHT: number } = {
  WIDTH: 300,
  HEIGHT: 150,
};

/**
 * width/height/style属性を持つ要素の共通インターフェース
 */
export interface SizeableAttributes {
  width?: string;
  height?: string;
  style?: string;
}

/**
 * 埋め込み要素の幅・高さを解析し、最終的なピクセル値を決定する
 *
 * 幅・高さは次の優先順位で決定されます:
 * 1. `width` / `height` 属性値（10進数の数値文字列かつ 0 より大きい値）
 * 2. `style` 属性内の `width` / `height`（数値に解釈可能かつ 0 より大きい値）
 * 3. デフォルト値（HTML Living Standard 準拠の 300x150）
 *
 * 無効な値（数値に変換できない、または 0 以下の値）の場合は、その値は無視され、
 * 次の優先順位の値（style属性またはデフォルト値）が使用されます。
 *
 * @param attributes - `width` / `height` 属性および CSS テキスト形式の `style` 属性を持つオブジェクト
 * @returns 幅と高さのピクセル値。いずれにも有効な値が指定されていない場合はデフォルト値（300x150）
 */
export function parseSize(attributes: SizeableAttributes): {
  width: number;
  height: number;
} {
  let width = DEFAULT_EMBEDDED_SIZE.WIDTH;
  let height = DEFAULT_EMBEDDED_SIZE.HEIGHT;

  if (attributes.width) {
    const parsed = parseInt(attributes.width, 10);
    if (!isNaN(parsed) && parsed > 0) {
      width = parsed;
    }
  }

  if (attributes.height) {
    const parsed = parseInt(attributes.height, 10);
    if (!isNaN(parsed) && parsed > 0) {
      height = parsed;
    }
  }

  if (attributes.style) {
    const styles = Styles.parse(attributes.style);

    const styleWidth = Styles.getWidth(styles);
    if (typeof styleWidth === "number" && styleWidth > 0) {
      width = styleWidth;
    }

    const styleHeight = Styles.getHeight(styles);
    if (typeof styleHeight === "number" && styleHeight > 0) {
      height = styleHeight;
    }
  }

  return { width, height };
}

/**
 * URLのセキュリティ検証を行う
 * @param url - 検証対象のURL
 * @returns 安全なURLの場合true。javascript:、data:、HTMLタグを含むURLは拒否
 */
export function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return false;

  const lowerUrl = trimmedUrl.toLowerCase();

  if (trimmedUrl.includes("<") || trimmedUrl.includes(">")) return false;
  if (lowerUrl.startsWith("javascript:")) return false;
  if (lowerUrl.startsWith("data:")) return false;

  if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://"))
    return true;

  if (
    trimmedUrl.startsWith("/") ||
    trimmedUrl.startsWith("./") ||
    trimmedUrl.startsWith("../")
  )
    return true;

  return false;
}

/**
 * style属性を持つ要素の共通インターフェース
 */
export interface StyleableAttributes {
  style?: string;
}

/**
 * スタイルからボーダー情報を取得する
 * @param attributes - style属性を持つ要素の属性
 * @returns ボーダー情報、スタイル未設定または未定義の場合はnull
 */
export function getBorder(attributes: StyleableAttributes) {
  if (!attributes.style) return null;

  const styles = Styles.parse(attributes.style);
  return Styles.getBorder(styles);
}

/**
 * スタイルから角丸の値を取得する
 * @param attributes - style属性を持つ要素の属性
 * @returns 角丸のピクセル値、未設定の場合はnull
 */
export function getBorderRadius(
  attributes: StyleableAttributes,
): number | null {
  if (!attributes.style) return null;

  const styles = Styles.parse(attributes.style);
  const borderRadius = Styles.getBorderRadius(styles);

  if (typeof borderRadius === "number") {
    return borderRadius;
  }

  if (borderRadius && typeof borderRadius === "object") {
    const values = Object.values(borderRadius);
    if (values.length > 0 && typeof values[0] === "number") {
      return values[0];
    }
  }

  return null;
}
