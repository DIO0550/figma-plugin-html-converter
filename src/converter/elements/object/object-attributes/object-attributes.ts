/**
 * object要素の属性定義とバリデーション
 * HTML Living Standard準拠の属性セットを提供
 */

import {
  parseSize as parseSizeCommon,
  isValidUrl as isValidUrlCommon,
  getBorder as getBorderCommon,
  getBorderRadius as getBorderRadiusCommon,
} from "../../common";

export interface ObjectAttributes {
  // ソース属性
  data?: string;
  type?: string;

  // サイズ属性
  width?: string;
  height?: string;

  // その他の属性
  name?: string;
  form?: string;
  usemap?: string;

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

export const ObjectAttributes = {
  /**
   * object要素の幅・高さを解析し、最終的なピクセル値を決定する
   *
   * 幅・高さは次の優先順位で決定されます:
   * 1. `width` / `height` 属性値（10進数の数値文字列かつ 0 より大きい値）
   * 2. `style` 属性内の `width` / `height`（数値に解釈可能かつ 0 より大きい値）
   * 3. デフォルト値（HTML Living Standard 準拠の 300x150）
   *
   * 無効な値（数値に変換できない、または 0 以下の値）の場合は、その値は無視され、
   * 次の優先順位の値（style属性またはデフォルト値）が使用されます。
   *
   * @param attributes - `ObjectAttributes` 型のオブジェクト。`width` / `height` 属性および
   *                     CSS テキスト形式の `style` 属性からサイズ情報を解析します。
   * @returns 幅と高さのピクセル値。いずれにも有効な値が指定されていない場合はデフォルト値（300x150）
   */
  parseSize(attributes: ObjectAttributes): { width: number; height: number } {
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
   * 検証済みのdata属性を取得する
   * @param attributes - object要素の属性
   * @returns 有効なURLの場合はその値、無効または未設定の場合はnull
   */
  getData(attributes: ObjectAttributes): string | null {
    if (!attributes.data) return null;
    return this.isValidUrl(attributes.data) ? attributes.data : null;
  },

  /**
   * type属性を取得する
   * @param attributes - object要素の属性
   * @returns type属性の値、未設定の場合はnull
   */
  getType(attributes: ObjectAttributes): string | null {
    return attributes.type ?? null;
  },

  /**
   * name属性を取得する
   * @param attributes - object要素の属性
   * @returns name属性の値、未設定の場合はnull
   */
  getName(attributes: ObjectAttributes): string | null {
    return attributes.name ?? null;
  },

  /**
   * スタイルからボーダー情報を取得する
   * @param attributes - object要素の属性
   * @returns ボーダー情報、スタイル未設定または未定義の場合はnull
   */
  getBorder(attributes: ObjectAttributes) {
    return getBorderCommon(attributes);
  },

  /**
   * スタイルから角丸の値を取得する
   * @param attributes - object要素の属性
   * @returns 角丸のピクセル値、未設定の場合はnull
   */
  getBorderRadius(attributes: ObjectAttributes): number | null {
    return getBorderRadiusCommon(attributes);
  },
};
