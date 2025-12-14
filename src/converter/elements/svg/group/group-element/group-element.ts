import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { GroupAttributes } from "../group-attributes";
import { SvgTransformUtils } from "../../utils/svg-transform-utils";
import { SvgAttributes } from "../../svg-attributes";

/**
 * SVG子要素の型定義
 */
export interface SvgChildNode {
  type: string;
  tagName: string;
  attributes: Record<string, unknown>;
  children?: SvgChildNode[];
}

/**
 * SVG g（グループ）要素の型定義
 */
export interface GroupElement {
  type: "element";
  tagName: "g";
  attributes: GroupAttributes;
  children?: SvgChildNode[];
}

/**
 * GroupElementコンパニオンオブジェクト
 */
export const GroupElement = {
  /**
   * GroupElement型ガード
   *
   * @param node - 判定対象のノード
   * @returns nodeがGroupElementの場合true
   */
  isGroupElement(node: unknown): node is GroupElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "g"
    );
  },

  /**
   * GroupElementファクトリーメソッド
   *
   * @param attributes - g要素の属性（デフォルト: 空オブジェクト）
   * @param children - 子要素の配列
   * @returns 新しいGroupElementインスタンス
   */
  create(
    attributes: GroupAttributes = {},
    children?: SvgChildNode[],
  ): GroupElement {
    return {
      type: "element",
      tagName: "g",
      attributes,
      children,
    };
  },

  /**
   * transform属性を取得
   *
   * @param element - 対象のGroupElement
   * @returns transform属性の値、未設定の場合はundefined
   */
  getTransform(element: GroupElement): string | undefined {
    return SvgAttributes.getTransform(element.attributes);
  },

  /**
   * id属性を取得
   *
   * @param element - 対象のGroupElement
   * @returns id属性の値、未設定の場合はundefined
   */
  getId(element: GroupElement): string | undefined {
    return element.attributes.id;
  },

  /**
   * opacity属性を取得
   *
   * @param element - 対象のGroupElement
   * @returns opacity属性の値、未設定の場合はundefined
   */
  getOpacity(element: GroupElement): number | undefined {
    return SvgAttributes.getOpacity(element.attributes);
  },

  /**
   * GroupElementをFigmaのGROUPノードに変換
   *
   * 子要素の変換は呼び出し側（マッパー）の責任となる
   *
   * @param element 変換するGroup要素
   * @returns FigmaノードConfig
   */
  toFigmaNode(element: GroupElement): FigmaNodeConfig {
    const id = this.getId(element);
    const name = id ?? "g";

    const config = FigmaNode.createGroup(name);

    const transform = this.getTransform(element);
    if (transform) {
      const commands = SvgTransformUtils.parseTransform(transform);
      const translation = SvgTransformUtils.extractTranslation(commands);
      if (translation.x !== 0 || translation.y !== 0) {
        config.x = translation.x;
        config.y = translation.y;
      }
    }

    const opacity = this.getOpacity(element);
    if (opacity !== undefined) {
      config.opacity = opacity;
    }

    // 子要素配列を初期化（変換は呼び出し側で行う）
    config.children = [];

    return config;
  },

  /**
   * 任意のノードをGroupElementとしてFigmaノード設定にマッピング
   *
   * 型ガード、ファクトリー、変換関数を組み合わせた汎用マッピングパターンを使用。
   * ノードがg要素でない場合はnullを返す。
   *
   * @param node - マッピング対象のノード（unknown型を受け入れ、内部で型チェック）
   * @returns FigmaNodeConfig（g要素の場合）、またはnull（g要素でない場合）
   *
   * @example
   * const config = GroupElement.mapToFigma(htmlNode);
   * if (config) {
   *   // g要素として正常に変換された
   * }
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "g",
      this.isGroupElement,
      (attrs) => this.create(attrs),
      (element) => this.toFigmaNode(element),
    );
  },
};
