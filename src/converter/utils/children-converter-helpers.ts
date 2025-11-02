import type { FigmaNodeConfig } from "../models/figma-node";
import type { BaseElement } from "../elements/base/base-element";
import type { HTMLNode } from "../models/html-node/html-node";
import { ElementContextConverter } from "../elements/text/base/converters";

/**
 * テキスト要素用の子要素変換関数を作成する
 *
 * @param elementType - 要素タイプ（p, h1-h6, blockquote, pre など）
 * @returns 子要素を変換する関数
 *
 * @example
 * ```typescript
 * const converter = createTextChildrenConverter("p");
 * const children = converter(element);
 * ```
 */
export function createTextChildrenConverter<
  T extends BaseElement<string, unknown>,
>(elementType: string): (element: T) => FigmaNodeConfig[] {
  return (element: T): FigmaNodeConfig[] => {
    // 子要素がない場合は空配列を返す
    if (!element.children || element.children.length === 0) {
      return [];
    }

    // 親要素のスタイルを取得
    const parentStyle = (
      element.attributes as Record<string, unknown> | undefined
    )?.style as string | undefined;

    // ElementContextConverterで子要素を変換
    const results = ElementContextConverter.convertAll(
      element.children as HTMLNode[],
      parentStyle,
      elementType,
    );

    // 結果をFigmaNodeConfig配列にマップ
    return results
      .map((result) => {
        if (
          result &&
          typeof result === "object" &&
          "node" in result &&
          result.node !== undefined
        ) {
          return result.node;
        }
        return undefined;
      })
      .filter((node): node is FigmaNodeConfig => node !== undefined);
  };
}
