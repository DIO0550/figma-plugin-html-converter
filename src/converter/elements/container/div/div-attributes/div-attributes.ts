/**
 * div要素の属性定義
 * HTML Living Standard準拠
 */
export interface DivAttributes {
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