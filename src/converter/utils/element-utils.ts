import type { FigmaNodeConfig } from "../models/figma-node";

/**
 * unknown 型のノードを指定された要素型に変換し、Figma ノードに変換する
 *
 * @param node - 変換対象のノード
 * @param tagName - HTML タグ名
 * @param typeGuard - 型ガード関数
 * @param create - 要素作成関数
 * @param toFigmaNode - Figma ノード変換関数
 * @returns FigmaNodeConfig または null
 */
export function mapToFigmaWith<T>(
  node: unknown,
  tagName: string,
  typeGuard: (n: unknown) => n is T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (attrs: any) => T,
  toFigmaNode: (element: T) => FigmaNodeConfig,
): FigmaNodeConfig | null {
  // 型ガードで直接チェック
  if (typeGuard(node)) {
    return toFigmaNode(node);
  }

  // 互換性のための HTMLNode からの変換
  if (
    node !== null &&
    typeof node === "object" &&
    "type" in node &&
    "tagName" in node &&
    node.type === "element" &&
    node.tagName === tagName
  ) {
    const attributes =
      "attributes" in node && typeof node.attributes === "object"
        ? node.attributes
        : {};
    const element = create(attributes);
    return toFigmaNode(element);
  }

  return null;
}
