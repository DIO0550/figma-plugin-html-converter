import { Styles } from "../../../models/styles";

/**
 * video要素の属性定義
 * HTML Living Standard準拠
 */
export interface VideoAttributes {
  // ソース属性
  src?: string;
  poster?: string;

  // サイズ属性
  width?: string;
  height?: string;

  // 再生制御属性
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsinline?: boolean;

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

  // ダウンロード可否
  disablepictureinpicture?: boolean;
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

// デフォルト値（HTML5 video要素のデフォルトアスペクト比 2:1）
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 150;

/**
 * VideoAttributesコンパニオンオブジェクト
 */
export const VideoAttributes = {
  /**
   * 属性からサイズを解析
   */
  parseSize(attributes: VideoAttributes): { width: number; height: number } {
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;

    // width/height属性から取得
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

    // スタイル属性が優先
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

    // XSS攻撃の可能性があるパターンを先にチェック
    if (url.includes("<") || url.includes(">")) return false;
    if (url.toLowerCase().startsWith("javascript:")) return false;
    if (
      url.toLowerCase().startsWith("data:") &&
      !url.startsWith("data:image/") &&
      !url.startsWith("data:video/")
    )
      return false;

    // データURL（画像・動画）
    if (url.startsWith("data:image/") || url.startsWith("data:video/"))
      return true;

    // 絶対URL
    if (url.startsWith("http://") || url.startsWith("https://")) return true;

    // 相対URL
    if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../"))
      return true;

    // その他の通常のパス（ファイル名など）
    return true;
  },

  /**
   * poster属性の取得（検証済み）
   */
  getPoster(attributes: VideoAttributes): string | null {
    if (!attributes.poster) return null;
    return this.isValidUrl(attributes.poster) ? attributes.poster : null;
  },

  /**
   * controls属性の確認
   */
  hasControls(attributes: VideoAttributes): boolean {
    // HTML属性として存在する場合（空文字含む）はtrue
    if (attributes.controls === undefined) return false;
    if (attributes.controls === false) return false;
    return true;
  },

  /**
   * src属性の取得（検証済み）
   */
  getVideoSrc(attributes: VideoAttributes): string | null {
    if (!attributes.src) return null;
    return this.isValidUrl(attributes.src) ? attributes.src : null;
  },

  /**
   * preload属性の取得
   */
  getPreload(attributes: VideoAttributes): "none" | "metadata" | "auto" {
    return attributes.preload ?? "auto";
  },

  /**
   * ボーダー情報の取得
   */
  getBorder(attributes: VideoAttributes) {
    if (!attributes.style) return null;

    const styles = Styles.parse(attributes.style);
    return Styles.getBorder(styles);
  },

  /**
   * 角丸の取得
   */
  getBorderRadius(attributes: VideoAttributes): number | null {
    if (!attributes.style) return null;

    const styles = Styles.parse(attributes.style);
    const borderRadius = Styles.getBorderRadius(styles);

    // 数値の場合はそのまま返す
    if (typeof borderRadius === "number") {
      return borderRadius;
    }

    // オブジェクトの場合は最初の値を返す（簡略化）
    if (borderRadius && typeof borderRadius === "object") {
      const values = Object.values(borderRadius);
      if (values.length > 0 && typeof values[0] === "number") {
        return values[0];
      }
    }

    return null;
  },
};
