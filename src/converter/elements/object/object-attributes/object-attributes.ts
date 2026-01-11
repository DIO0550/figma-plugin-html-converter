/**
 * object要素の属性定義とバリデーション
 * HTML Living Standard準拠の属性セットを提供
 */

import { Styles } from "../../../models/styles";

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

/**
 * HTML Living Standard仕様に準拠したデフォルト値
 * @see https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element
 */
const DEFAULT_WIDTH = 300;

/**
 * HTML Living Standard仕様に準拠したデフォルト値
 */
const DEFAULT_HEIGHT = 150;

export const ObjectAttributes = {
  /**
   * object要素のサイズを解析する
   * @param attributes - object要素の属性
   * @returns 幅と高さのピクセル値。属性がない場合はデフォルト値（300x150）
   */
  parseSize(attributes: ObjectAttributes): { width: number; height: number } {
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;

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
  },

  /**
   * URLのセキュリティ検証を行う
   * @param url - 検証対象のURL
   * @returns 安全なURLの場合true
   */
  isValidUrl(url: string | undefined): boolean {
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
    if (!attributes.style) return null;

    const styles = Styles.parse(attributes.style);
    return Styles.getBorder(styles);
  },

  /**
   * スタイルから角丸の値を取得する
   * @param attributes - object要素の属性
   * @returns 角丸のピクセル値、未設定の場合はnull
   */
  getBorderRadius(attributes: ObjectAttributes): number | null {
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
  },
};
