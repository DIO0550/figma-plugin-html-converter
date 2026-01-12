/**
 * embed要素の属性定義とバリデーション
 * HTML Living Standard準拠の属性セットを提供
 */

import {
  parseSize as parseSizeCommon,
  isValidUrl as isValidUrlCommon,
  getBorder as getBorderCommon,
  getBorderRadius as getBorderRadiusCommon,
} from "../../common";

export interface EmbedAttributes {
  // ソース属性
  src?: string;
  type?: string;

  // サイズ属性
  width?: string;
  height?: string;

  // グローバル属性
  id?: string;
  class?: string;
  style?: string;
  title?: string;
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  hidden?: boolean;
  tabindex?: string;

  // データ属性
  [key: `data-${string}`]: string | undefined;

  // ARIAアクセシビリティ属性
  role?: string;
  [key: `aria-${string}`]: string | undefined;
}

export const EmbedAttributes = {
  /**
   * embed要素の幅・高さを解析し、最終的なピクセル値を決定する
   *
   * 幅・高さは次の優先順位で決定されます:
   * 1. `width` / `height` 属性値（10進数の数値文字列かつ 0 より大きい値）
   * 2. `style` 属性内の `width` / `height`（数値に解釈可能かつ 0 より大きい値）
   * 3. デフォルト値（HTML Living Standard 準拠の 300x150）
   *
   * 無効な値（数値に変換できない、または 0 以下の値）の場合は、その値は無視され、
   * 次の優先順位の値（style属性またはデフォルト値）が使用されます。
   *
   * @param attributes - `EmbedAttributes` 型のオブジェクト。`width` / `height` 属性および
   *                     CSS テキスト形式の `style` 属性からサイズ情報を解析します。
   * @returns 幅と高さのピクセル値。いずれにも有効な値が指定されていない場合はデフォルト値（300x150）
   */
  parseSize(attributes: EmbedAttributes): { width: number; height: number } {
    return parseSizeCommon(attributes);
  },

  /**
   * URLのセキュリティ検証を行う
   * @param url - 検証対象のURL
   * @returns 安全なURLの場合true
   */
  isValidUrl(url: string | undefined): boolean {
    return isValidUrlCommon(url);
  },

  /**
   * 検証済みのsrc属性を取得する
   * @param attributes - embed要素の属性
   * @returns 有効なURLの場合はその値、無効または未設定の場合はnull
   */
  getSrc(attributes: EmbedAttributes): string | null {
    if (!attributes.src) return null;
    return this.isValidUrl(attributes.src) ? attributes.src : null;
  },

  /**
   * type属性を取得する
   * @param attributes - embed要素の属性
   * @returns type属性の値、未設定の場合はnull
   */
  getType(attributes: EmbedAttributes): string | null {
    return attributes.type ?? null;
  },

  /**
   * スタイルからボーダー情報を取得する
   * @param attributes - embed要素の属性
   * @returns ボーダー情報、スタイル未設定または未定義の場合はnull
   */
  getBorder(attributes: EmbedAttributes) {
    return getBorderCommon(attributes);
  },

  /**
   * スタイルから角丸の値を取得する
   * @param attributes - embed要素の属性
   * @returns 角丸のピクセル値、未設定の場合はnull
   */
  getBorderRadius(attributes: EmbedAttributes): number | null {
    return getBorderRadiusCommon(attributes);
  },
};
