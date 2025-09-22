import { HTMLNode } from "../../../../../models/html-node/html-node";
import {
  ParagraphChildConverter,
  type ParagraphChildResult,
} from "../paragraph-child-converter";
import {
  HeadingChildConverter,
  type HeadingChildResult,
} from "../heading-child-converter";
import { ElementCategory } from "../element-category";

/**
 * 要素タイプに応じたコンバーターを選択するコンパニオンオブジェクト
 */
export const ElementContextConverter = {
  /**
   * 適切なコンバーターを選択して変換
   */
  convert(
    child: HTMLNode,
    parentStyle?: string,
    elementType?: string,
  ): ParagraphChildResult | HeadingChildResult | null {
    const category = ElementCategory.from(elementType);

    switch (category) {
      case "heading":
        return HeadingChildConverter.convert(child, parentStyle, elementType);

      case "paragraph":
      case "inline":
      case "code":
      case "quote":
      case "list":
      default:
        // 現時点では、heading以外は全てParagraphChildConverterを使用
        // 将来的には各カテゴリ用のコンバーターを追加
        return ParagraphChildConverter.convert(child, parentStyle, elementType);
    }
  },

  /**
   * 複数の子要素を一括変換
   */
  convertAll(
    children: HTMLNode[],
    parentStyle?: string,
    elementType?: string,
  ): (ParagraphChildResult | HeadingChildResult)[] {
    const category = ElementCategory.from(elementType);

    switch (category) {
      case "heading":
        return HeadingChildConverter.convertAll(
          children,
          parentStyle,
          elementType,
        );

      case "paragraph":
      case "inline":
      case "code":
      case "quote":
      case "list":
      default:
        // 現時点では、heading以外は全てParagraphChildConverterを使用
        // 将来的には各カテゴリ用のコンバーターを追加
        return ParagraphChildConverter.convertAll(
          children,
          parentStyle,
          elementType,
        );
    }
  },
};
