import type { GlobalAttributes } from "../../../base/global-attributes/global-attributes";

/**
 * a要素の属性定義
 * アンカー要素（リンク）の属性を定義
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/a
 */
export interface AAttributes extends GlobalAttributes {
  /**
   * ハイパーリンク先のURL
   */
  href?: string;

  /**
   * リンク先のターゲット
   * - _self: 現在のブラウジングコンテキスト（既定値）
   * - _blank: 新しいブラウジングコンテキスト
   * - _parent: 親のブラウジングコンテキスト
   * - _top: 最上位のブラウジングコンテキスト
   */
  target?: "_self" | "_blank" | "_parent" | "_top" | string;

  /**
   * リンク先のリソースとの関係
   * 例: nofollow, noopener, noreferrer
   */
  rel?: string;

  /**
   * ダウンロード時のファイル名
   * 値が指定されている場合、リンクをダウンロードとして扱う
   */
  download?: string | boolean;

  /**
   * リンク先リソースの言語
   * BCP 47言語タグ
   */
  hreflang?: string;

  /**
   * リンク先リソースのMIMEタイプ
   */
  type?: string;

  /**
   * Referrer-Policy
   * リンクをたどる際のリファラーポリシー
   */
  referrerpolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

  /**
   * ping属性
   * リンクがクリックされた時に通知するURL（スペース区切り）
   */
  ping?: string;
}
