/**
 * iframe要素の属性定義とバリデーション
 * HTML Living Standard準拠の属性セットとセキュリティ検証ロジックを提供
 */

import { Styles } from "../../../models/styles";

export interface IframeAttributes {
  // ソース属性
  src?: string;
  srcdoc?: string;

  // サイズ属性
  width?: string;
  height?: string;

  // セキュリティ属性
  sandbox?:
    | ""
    | "allow-forms"
    | "allow-modals"
    | "allow-orientation-lock"
    | "allow-pointer-lock"
    | "allow-popups"
    | "allow-popups-to-escape-sandbox"
    | "allow-presentation"
    | "allow-same-origin"
    | "allow-scripts"
    | "allow-top-navigation"
    | "allow-top-navigation-by-user-activation"
    | string;
  allow?: string;
  referrerpolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

  // 遅延読み込み
  loading?: "lazy" | "eager";

  // その他のHTML属性
  name?: string;
  allowfullscreen?: boolean;
  allowpaymentrequest?: boolean;

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
 * HTML Living Standard仕様に準拠
 * https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element
 */
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 150;

export const IframeAttributes = {
  /**
   * iframe要素のサイズを解析する
   * @param attributes - iframe要素の属性
   * @returns 幅と高さのピクセル値。属性がない場合はHTML Living Standard準拠のデフォルト値（300x150）
   */
  parseSize(attributes: IframeAttributes): { width: number; height: number } {
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;

    if (attributes.width) {
      const parsed = parseInt(attributes.width, 10);
      if (!isNaN(parsed)) {
        width = parsed;
      }
    }

    if (attributes.height) {
      const parsed = parseInt(attributes.height, 10);
      if (!isNaN(parsed)) {
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
   * @returns 安全なURLの場合true。javascript:、data:、HTMLタグを含むURLは拒否
   */
  isValidUrl(url: string | undefined): boolean {
    if (!url) return false;

    const lowerUrl = url.toLowerCase();

    if (url.includes("<") || url.includes(">")) return false;
    if (lowerUrl.startsWith("javascript:")) return false;
    if (lowerUrl.startsWith("data:")) return false;

    if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://"))
      return true;

    if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../"))
      return true;

    return false;
  },

  /**
   * 検証済みのsrc属性を取得する
   * @param attributes - iframe要素の属性
   * @returns 有効なURLの場合はその値、無効または未設定の場合はnull
   */
  getSrc(attributes: IframeAttributes): string | null {
    if (!attributes.src) return null;
    return this.isValidUrl(attributes.src) ? attributes.src : null;
  },

  /**
   * title属性を取得する
   * @param attributes - iframe要素の属性
   * @returns title属性の値、未設定の場合はnull
   */
  getTitle(attributes: IframeAttributes): string | null {
    return attributes.title ?? null;
  },

  /**
   * スタイルからボーダー情報を取得する
   * @param attributes - iframe要素の属性
   * @returns ボーダー情報、スタイル未設定または未定義の場合はnull
   */
  getBorder(attributes: IframeAttributes) {
    if (!attributes.style) return null;

    const styles = Styles.parse(attributes.style);
    return Styles.getBorder(styles);
  },

  /**
   * スタイルから角丸の値を取得する
   * @param attributes - iframe要素の属性
   * @returns 角丸のピクセル値、未設定の場合はnull
   */
  getBorderRadius(attributes: IframeAttributes): number | null {
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
