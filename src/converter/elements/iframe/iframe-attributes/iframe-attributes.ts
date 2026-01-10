import { Styles } from "../../../models/styles";

/**
 * iframe要素の属性定義
 * HTML Living Standard準拠
 */
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
 * デフォルトサイズ
 * HTML Living Standard仕様に準拠: iframe要素のデフォルトサイズは300x150px
 * https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element
 */
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 150;

/**
 * IframeAttributesコンパニオンオブジェクト
 */
export const IframeAttributes = {
  /**
   * 属性からサイズを解析
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

    // CSS仕様: インラインスタイルがHTML属性より優先される
    if (attributes.style) {
      const styles = Styles.parse(attributes.style);

      const styleWidth = Styles.getWidth(styles);
      if (typeof styleWidth === "number") {
        width = styleWidth;
      }

      const styleHeight = Styles.getHeight(styles);
      if (typeof styleHeight === "number") {
        height = styleHeight;
      }
    }

    return { width, height };
  },

  /**
   * URLの検証
   * iframeはセキュリティ上、data: URLやjavascript: URLを許可しない
   * 許可されるパターン: http(s)://、スラッシュで始まる相対URL、./や../で始まる相対URL
   * それ以外のパターン（例: page.html）は明示的に拒否
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
   * src属性の取得（検証済み）
   */
  getSrc(attributes: IframeAttributes): string | null {
    if (!attributes.src) return null;
    return this.isValidUrl(attributes.src) ? attributes.src : null;
  },

  /**
   * title属性の取得
   */
  getTitle(attributes: IframeAttributes): string | null {
    return attributes.title ?? null;
  },

  /**
   * ボーダー情報の取得
   */
  getBorder(attributes: IframeAttributes) {
    if (!attributes.style) return null;

    const styles = Styles.parse(attributes.style);
    return Styles.getBorder(styles);
  },

  /**
   * 角丸の取得
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
