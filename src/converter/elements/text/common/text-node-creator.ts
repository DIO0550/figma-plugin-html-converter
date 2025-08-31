import { TextNodeConfig } from "../../../models/figma-node";
import { Styles } from "../../../models/styles";

/**
 * テキストノード作成のオプション
 */
export interface CreateTextNodeOptions {
  /** デフォルトのフォントサイズ */
  defaultFontSize?: number;
  /** デフォルトのフォントウェイト */
  defaultFontWeight?: number;
  /** デフォルトの行の高さ倍率 */
  defaultLineHeightMultiplier?: number;
}

/**
 * 共通のテキストノード作成関数
 * p要素やheading要素で使用される共通ロジック
 */
export function createBaseTextNode(
  node: { type: string; content: string },
  parentStyles: Record<string, string>,
  options: CreateTextNodeOptions = {},
): TextNodeConfig {
  const {
    defaultFontSize = 16,
    defaultFontWeight = 400,
    defaultLineHeightMultiplier = 1.5,
  } = options;

  const textConfig = TextNodeConfig.create(node.content);

  // デフォルトのフォントサイズとウェイトを設定
  textConfig.style.fontSize = defaultFontSize;
  if (defaultFontWeight !== 400) {
    textConfig.style.fontWeight = defaultFontWeight;
  }

  // フォントサイズの処理（スタイルで上書きがある場合）
  if (parentStyles["font-size"]) {
    const sizeValue = Styles.parseSize(parentStyles["font-size"]);
    if (typeof sizeValue === "number") {
      textConfig.style.fontSize = sizeValue;
    }
  }

  // 行の高さの処理
  if (parentStyles["line-height"]) {
    const lineHeightValue = parentStyles["line-height"];
    // 数値のみの場合は倍率として扱う
    const numericValue = parseFloat(lineHeightValue);
    if (!isNaN(numericValue)) {
      textConfig.style.lineHeight.value =
        textConfig.style.fontSize * numericValue;
    } else {
      // px値などの単位付きの場合
      const sizeValue = Styles.parseSize(lineHeightValue);
      if (typeof sizeValue === "number") {
        textConfig.style.lineHeight.value = sizeValue;
      }
    }
  } else {
    // line-heightが指定されていない場合は、フォントサイズに基づいて調整
    textConfig.style.lineHeight.value =
      textConfig.style.fontSize * defaultLineHeightMultiplier;
  }

  // テキスト配置の処理
  if (parentStyles["text-align"]) {
    const textAlign = parentStyles["text-align"].toUpperCase();
    if (["LEFT", "CENTER", "RIGHT", "JUSTIFY"].includes(textAlign)) {
      textConfig.style.textAlign = textAlign;
    }
  }

  // カラーの処理
  if (parentStyles["color"]) {
    const color = Styles.parseColor(parentStyles["color"]);
    if (color) {
      textConfig.style.fills = [
        {
          type: "SOLID",
          color: {
            r: color.r,
            g: color.g,
            b: color.b,
            a: 1,
          },
        },
      ];
    }
  }

  return textConfig;
}
