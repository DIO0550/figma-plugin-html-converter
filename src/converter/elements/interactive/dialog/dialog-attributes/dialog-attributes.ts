import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * dialog要素の属性インターフェース
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog
 */
export interface DialogAttributes extends GlobalAttributes {
  /**
   * ダイアログが表示されているかどうかを示すブール属性
   * - true: ダイアログが表示されている
   * - false/undefined: ダイアログが非表示
   * - "": HTML属性としてopenが存在する場合（<dialog open>）
   */
  open?: boolean | "";
}

/**
 * DialogAttributesコンパニオンオブジェクト
 */
export const DialogAttributes = {
  /**
   * dialog要素が開いているかどうかを判定
   * HTML属性の存在（空文字列）もtrueとして扱う
   */
  isOpen(attrs: DialogAttributes): boolean {
    return attrs.open === true || attrs.open === "";
  },
};
