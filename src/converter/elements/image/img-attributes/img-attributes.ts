import { Styles } from '../../../models/styles';

/**
 * img要素の属性定義
 * HTML Living Standard準拠
 */
export interface ImgAttributes {
  // 必須属性
  src?: string;
  alt?: string;
  
  // サイズ属性
  width?: string;
  height?: string;
  
  // レスポンシブ画像
  srcset?: string;
  sizes?: string;
  
  // パフォーマンス
  loading?: 'lazy' | 'eager';
  decoding?: 'sync' | 'async' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
  
  // CORS
  crossorigin?: 'anonymous' | 'use-credentials' | '';
  
  // 参照ポリシー
  referrerpolicy?: 
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
  
  // その他
  usemap?: string;
  ismap?: boolean;
  
  // グローバル属性
  id?: string;
  class?: string;
  style?: string;
  title?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  hidden?: boolean;
  tabindex?: string;
  
  // データ属性
  [key: `data-${string}`]: string | undefined;
  
  // ARIAアクセシビリティ属性
  role?: string;
  [key: `aria-${string}`]: string | undefined;
}

// デフォルト値
const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 100;

/**
 * ImgAttributesコンパニオンオブジェクト
 */
export const ImgAttributes = {
  /**
   * 属性からサイズを解析
   */
  parseSize(attributes: ImgAttributes): { width: number; height: number } {
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
      if (typeof styleWidth === 'number') {
        width = styleWidth;
      }

      const styleHeight = Styles.getHeight(styles);
      if (typeof styleHeight === 'number') {
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
    if (url.includes('<') || url.includes('>')) return false;
    if (url.toLowerCase().startsWith('javascript:')) return false;
    if (url.toLowerCase().startsWith('data:') && !url.startsWith('data:image/')) return false;
    
    // データURL
    if (url.startsWith('data:image/')) return true;
    
    // 絶対URL
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    
    // 相対URL
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return true;
    
    // その他の通常のパス（ファイル名など）
    return true;
  },

  /**
   * object-fitの取得
   */
  getObjectFit(attributes: ImgAttributes): string | null {
    if (!attributes.style) return null;
    
    const styles = Styles.parse(attributes.style);
    const objectFit = Styles.get(styles, 'object-fit');
    return objectFit !== undefined ? objectFit as string : null;
  },

  /**
   * ボーダー情報の取得
   */
  getBorder(attributes: ImgAttributes) {
    if (!attributes.style) return null;
    
    const styles = Styles.parse(attributes.style);
    return Styles.getBorder(styles);
  },

  /**
   * 角丸の取得
   */
  getBorderRadius(attributes: ImgAttributes): number | null {
    if (!attributes.style) return null;
    
    const styles = Styles.parse(attributes.style);
    const borderRadius = Styles.getBorderRadius(styles);
    
    // 数値の場合はそのまま返す
    if (typeof borderRadius === 'number') {
      return borderRadius;
    }
    
    // オブジェクトの場合は最初の値を返す（簡略化）
    if (borderRadius && typeof borderRadius === 'object') {
      const values = Object.values(borderRadius);
      if (values.length > 0 && typeof values[0] === 'number') {
        return values[0];
      }
    }
    
    return null;
  }
}