import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { ClipPathAttributes } from "../clip-path-attributes";
import type { SvgChildNode } from "../../group/group-element";

/**
 * SVG clipPath（クリッピングパス）要素の型定義
 *
 * clipPath要素はdefs内で定義され、他の要素のclip-path属性から参照される
 * 内部に図形要素を持ち、その形状でクリッピングを行う
 */
export interface ClipPathElement {
  type: "element";
  tagName: "clipPath";
  attributes: ClipPathAttributes;
  children?: SvgChildNode[];
}

/**
 * ClipPathElementコンパニオンオブジェクト
 */
export const ClipPathElement = {
  /**
   * ClipPathElement型ガード
   *
   * @param node - 判定対象のノード
   * @returns nodeがClipPathElementの場合true
   */
  isClipPathElement(node: unknown): node is ClipPathElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "clipPath"
    );
  },

  /**
   * ClipPathElementファクトリーメソッド
   *
   * @param attributes - clipPath要素の属性
   * @param children - 子要素（クリッピング図形）の配列
   * @returns 新しいClipPathElementインスタンス
   */
  create(
    attributes: Partial<ClipPathAttributes> = {},
    children?: SvgChildNode[],
  ): ClipPathElement {
    return {
      type: "element",
      tagName: "clipPath",
      attributes: attributes as ClipPathAttributes,
      children,
    };
  },

  /**
   * id属性を取得
   *
   * @param element - 対象のClipPathElement
   * @returns id属性の値、未設定の場合はundefined
   */
  getId(element: ClipPathElement): string | undefined {
    return element.attributes.id;
  },

  /**
   * clipPathUnits属性を取得
   *
   * @param element - 対象のClipPathElement
   * @returns clipPathUnits属性の値、未設定の場合は"userSpaceOnUse"
   */
  getClipPathUnits(
    element: ClipPathElement,
  ): "userSpaceOnUse" | "objectBoundingBox" {
    return element.attributes.clipPathUnits ?? "userSpaceOnUse";
  },

  /**
   * クリッピング用の子要素（図形）を取得
   *
   * @param element - 対象のClipPathElement
   * @returns 子要素の配列、子要素が存在しない場合は空配列
   */
  getClipShapes(element: ClipPathElement): SvgChildNode[] {
    return element.children ?? [];
  },

  /**
   * ClipPathElementをFigmaノード設定にマッピング
   *
   * clipPath要素は直接描画されないため、常にnullを返す。
   * クリッピングの適用は、参照する側の要素で行う。
   *
   * @param _node - マッピング対象のノード（未使用、シグネチャ互換性のため）
   * @returns 常にnull（clipPath要素は描画されないため）
   */
  mapToFigma(_node: unknown): FigmaNodeConfig | null {
    // clipPath要素は描画されないため常にnullを返す
    return null;
  },
};
