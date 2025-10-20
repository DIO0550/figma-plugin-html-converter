/**
 * @fileoverview input要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * input要素のtype属性の値
 */
export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "checkbox"
  | "radio"
  | "file"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "range"
  | "color"
  | "search"
  | "tel"
  | "url"
  | "submit"
  | "reset"
  | "button"
  | "hidden";

/**
 * input要素の属性インターフェース
 */
export interface InputAttributes extends GlobalAttributes {
  /**
   * 入力フィールドのタイプ
   */
  type?: InputType;

  /**
   * フォーム送信時のパラメータ名
   */
  name?: string;

  /**
   * 入力値
   */
  value?: string;

  /**
   * プレースホルダーテキスト
   */
  placeholder?: string;

  /**
   * 必須入力フィールドかどうか
   */
  required?: string;

  /**
   * 無効化されているかどうか
   */
  disabled?: string;

  /**
   * 読み取り専用かどうか
   */
  readonly?: string;

  /**
   * チェック状態（checkbox/radio用）
   */
  checked?: string;

  /**
   * 最小値（number/date用）
   */
  min?: string;

  /**
   * 最大値（number/date用）
   */
  max?: string;

  /**
   * ステップ値（number/range用）
   */
  step?: string;

  /**
   * 入力パターン（正規表現）
   */
  pattern?: string;

  /**
   * 最大文字数
   */
  maxlength?: string;

  /**
   * 最小文字数
   */
  minlength?: string;

  /**
   * 受け入れるファイルタイプ（file用）
   */
  accept?: string;

  /**
   * オートコンプリートの設定
   */
  autocomplete?: string;

  /**
   * 自動フォーカス
   */
  autofocus?: string;

  /**
   * サイズ（表示幅）
   */
  size?: string;
}
