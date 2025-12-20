import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * details要素の属性インターフェース
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/details
 */
export interface DetailsAttributes extends GlobalAttributes {
  /**
   * 詳細が表示されているかどうかを示すブール属性
   * - true: 詳細が表示されている
   * - false/undefined: 詳細が折りたたまれている
   * - "": HTML属性としてopenが存在する場合（<details open>）
   */
  open?: boolean | "";
}

/**
 * DetailsAttributesコンパニオンオブジェクト
 */
export const DetailsAttributes = {
  /**
   * details要素が開いているかどうかを判定
   * HTML属性の存在（空文字列）もtrueとして扱う
   */
  isOpen(attrs: DetailsAttributes): boolean {
    // open属性が存在し、falseでない場合はtrue
    // open="" や open=true はtrue
    // open=false や open=undefined はfalse
    return attrs.open === true || attrs.open === "";
  },
};
