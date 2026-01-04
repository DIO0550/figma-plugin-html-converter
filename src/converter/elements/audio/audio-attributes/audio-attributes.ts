import { Styles } from "../../../models/styles";

/**
 * audio要素の属性定義
 * HTML Living Standard準拠
 */
export interface AudioAttributes {
  // ソース属性
  src?: string;

  // サイズ属性（カスタムサイズ用）
  width?: string;
  height?: string;

  // 再生制御属性
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;

  // プリロード
  preload?: "none" | "metadata" | "auto";

  // CORS
  crossorigin?: "anonymous" | "use-credentials" | "";

  // 参照ポリシー
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

  // リモート再生の無効化
  disableremoteplayback?: boolean;

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
 * ブラウザ標準のaudio UIに近いサイズを採用
 * 幅: 300px（標準的なプレーヤー幅）
 * 高さ: 54px（コントロールバーの高さ）
 */
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 54;

/**
 * AudioAttributesコンパニオンオブジェクト
 */
export const AudioAttributes = {
  /**
   * 属性からサイズを解析
   */
  parseSize(attributes: AudioAttributes): { width: number; height: number } {
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
   */
  isValidUrl(url: string | undefined): boolean {
    if (!url) return false;

    const lowerUrl = url.toLowerCase();

    // XSS攻撃の可能性があるパターンを先にチェック
    if (url.includes("<") || url.includes(">")) return false;
    if (lowerUrl.startsWith("javascript:")) return false;
    if (
      lowerUrl.startsWith("data:") &&
      !lowerUrl.startsWith("data:audio/") &&
      !lowerUrl.startsWith("data:image/")
    )
      return false;

    // データURL（音声・画像）
    if (
      lowerUrl.startsWith("data:audio/") ||
      lowerUrl.startsWith("data:image/")
    )
      return true;

    // 絶対URL
    if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://"))
      return true;

    // 相対URL
    if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../"))
      return true;

    return true;
  },

  /**
   * controls属性の確認
   */
  hasControls(attributes: AudioAttributes): boolean {
    if (attributes.controls === undefined) return false;
    if (attributes.controls === false) return false;
    return true;
  },

  /**
   * src属性の取得（検証済み）
   */
  getAudioSrc(attributes: AudioAttributes): string | null {
    if (!attributes.src) return null;
    return this.isValidUrl(attributes.src) ? attributes.src : null;
  },

  /**
   * preload属性の取得
   */
  getPreload(attributes: AudioAttributes): "none" | "metadata" | "auto" {
    return attributes.preload ?? "auto";
  },

  /**
   * ボーダー情報の取得
   */
  getBorder(attributes: AudioAttributes) {
    if (!attributes.style) return null;

    const styles = Styles.parse(attributes.style);
    return Styles.getBorder(styles);
  },

  /**
   * 角丸の取得
   */
  getBorderRadius(attributes: AudioAttributes): number | null {
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
