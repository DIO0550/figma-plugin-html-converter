/**
 * 基本的なグローバル属性の型定義
 * 明示的に定義された属性のみを含む
 */
export interface GlobalAttributesBase {
  // 基本属性
  id?: string;
  className?: string;  // React/JSX用のプロパティ名
  class?: string;  // HTML標準のclass属性（HTMLパース時に使用）
  style?: string;
  title?: string;
  
  // 言語・国際化
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  
  // アクセシビリティ
  tabindex?: string | number;
  role?: string;
  accesskey?: string;
  
  // コンテンツ編集
  contenteditable?: boolean | 'true' | 'false' | 'inherit';
  spellcheck?: boolean | 'true' | 'false';
  
  // 表示・動作
  hidden?: boolean | '';
  draggable?: boolean | 'true' | 'false' | 'auto';
  
  // イベントハンドラ（on*）
  onclick?: string;
  onmouseover?: string;
  onmouseout?: string;
  onmousedown?: string;
  onmouseup?: string;
  onkeydown?: string;
  onkeyup?: string;
  onkeypress?: string;
  onfocus?: string;
  onblur?: string;
  onchange?: string;
  oninput?: string;
  onsubmit?: string;
  onload?: string;
  onerror?: string;
}

/**
 * データ属性の型定義
 */
export interface DataAttributes {
  [key: `data-${string}`]: string | undefined;
}

/**
 * ARIA属性の型定義
 */
export interface AriaAttributes {
  [key: `aria-${string}`]: string | undefined;
}

/**
 * カスタム属性の型定義
 * 標準外の属性を許可するための型
 */
export interface CustomAttributes {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * HTML要素の共通属性（グローバル属性）
 * 全てのHTML要素で使用可能な属性
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes
 */
export type GlobalAttributes = 
  & GlobalAttributesBase
  & DataAttributes
  & AriaAttributes
  & CustomAttributes;