import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { Paint } from "../../../../models/paint";
import { DialogAttributes } from "../dialog-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * dialog要素のレイアウト定数
 */
const DIALOG_LAYOUT = {
  PADDING_VERTICAL: 16,
  PADDING_HORIZONTAL: 24,
  ITEM_SPACING: 12,
  CORNER_RADIUS: 8,
} as const;

/**
 * dialog要素の型定義
 * モーダルまたは非モーダルダイアログボックスを表すセマンティック要素
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog
 */
export interface DialogElement extends BaseElement<"dialog", DialogAttributes> {
  children: DialogElement[] | [];
}

/**
 * DialogElementコンパニオンオブジェクト
 */
export const DialogElement = {
  /**
   * ノードがDialogElementかどうかを判定する型ガード
   */
  isDialogElement(node: unknown): node is DialogElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "dialog"
    );
  },

  /**
   * DialogElementを作成するファクトリメソッド
   */
  create(attributes: Partial<DialogAttributes> = {}): DialogElement {
    return {
      type: "element",
      tagName: "dialog",
      attributes: attributes as DialogAttributes,
      children: [],
    };
  },

  /**
   * DialogElementをFigmaNodeConfigに変換
   * open属性に応じてopacityで表示/非表示を制御
   */
  toFigmaNode(element: DialogElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("dialog");
        const baseConfig = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "dialog",
          el.attributes,
        );

        // open属性の判定
        const isOpen = DialogAttributes.isOpen(el.attributes ?? {});

        // dialog要素のモーダルスタイル
        const dialogConfig: FigmaNodeConfig = {
          ...baseConfig,
          layoutMode: "VERTICAL",
          // open属性によって表示/非表示を制御
          opacity: isOpen ? 1 : 0,
          // デフォルトの白背景
          fills: [Paint.solid({ r: 1, g: 1, b: 1 })],
          // モーダル風のボーダー
          strokes: [Paint.solid({ r: 0.8, g: 0.8, b: 0.8 })],
          strokeWeight: 1,
          // 角丸（モーダルらしい外観）
          cornerRadius: DIALOG_LAYOUT.CORNER_RADIUS,
          // パディング
          paddingTop: DIALOG_LAYOUT.PADDING_VERTICAL,
          paddingBottom: DIALOG_LAYOUT.PADDING_VERTICAL,
          paddingLeft: DIALOG_LAYOUT.PADDING_HORIZONTAL,
          paddingRight: DIALOG_LAYOUT.PADDING_HORIZONTAL,
          itemSpacing: DIALOG_LAYOUT.ITEM_SPACING,
        };

        return dialogConfig;
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * HTMLノードからFigmaノードへのマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "dialog",
      this.isDialogElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
