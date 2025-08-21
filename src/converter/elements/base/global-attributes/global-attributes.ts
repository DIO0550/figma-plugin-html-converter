/**
 * HTML要素の共通属性（グローバル属性）
 * 全てのHTML要素で使用可能な属性
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes
 */
export interface GlobalAttributes {
  // 基本属性
  id?: string;
  className?: string;
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
  
  // データ属性（data-*）
  [key: `data-${string}`]: string | undefined;
  
  // ARIA属性（aria-*）
  [key: `aria-${string}`]: string | undefined;
  
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
  
  // その他の属性も許可
  [key: string]: string | undefined;
}