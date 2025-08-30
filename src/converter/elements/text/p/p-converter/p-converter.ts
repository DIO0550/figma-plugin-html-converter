import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { PElement } from "../p-element";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * p要素のコンバーター
 * HTMLのp要素をFigmaノードに変換します
 */
export class PConverter {
  /**
   * p要素をFigmaノードに変換
   */
  toFigmaNode(element: PElement): FigmaNodeConfig {
    let config = FigmaNode.createFrame("p");

    // HTML要素のデフォルト設定を適用
    config = FigmaNodeConfig.applyHtmlElementDefaults(
      config,
      "p",
      element.attributes,
    );

    // スタイルがある場合は解析して適用
    if (element.attributes?.style) {
      const styles = Styles.parse(element.attributes.style);

      // 背景色を適用
      const backgroundColor = Styles.getBackgroundColor(styles);
      if (backgroundColor) {
        config = FigmaNodeConfig.applyBackgroundColor(config, backgroundColor);
      }

      // パディングを適用
      const padding = Styles.getPadding(styles);
      if (padding) {
        config = FigmaNodeConfig.applyPaddingStyles(config, padding);
      }

      // ボーダースタイルを適用
      config = FigmaNodeConfig.applyBorderStyles(
        config,
        Styles.extractBorderOptions(styles),
      );

      // サイズスタイルを適用
      config = FigmaNodeConfig.applySizeStyles(
        config,
        Styles.extractSizeOptions(styles),
      );
    }

    // 子要素の処理
    if (element.children && element.children.length > 0) {
      config.children = this.processChildren(
        element.children,
        element.attributes?.style,
      );
    } else {
      config.children = [];
    }

    return config;
  }

  /**
   * 子要素を処理してFigmaノードに変換
   */
  private processChildren(
    children: HTMLNode[],
    parentStyle?: string,
  ): FigmaNodeConfig[] {
    const result: FigmaNodeConfig[] = [];
    const parentStyles = parentStyle ? Styles.parse(parentStyle) : {};

    for (const child of children) {
      if (this.isTextNode(child)) {
        // テキストノードの処理
        const textConfig = this.createTextNode(child, parentStyles);
        result.push(textConfig);
      } else if (this.isElementNode(child)) {
        // インライン要素の処理
        const childElement = child as HTMLNode & { tagName: string };
        if (childElement.tagName === "strong" || childElement.tagName === "b") {
          const boldTextConfig = this.createBoldTextNode(
            childElement,
            parentStyles,
          );
          result.push(boldTextConfig);
        } else if (
          childElement.tagName === "em" ||
          childElement.tagName === "i"
        ) {
          const italicTextConfig = this.createItalicTextNode(
            childElement,
            parentStyles,
          );
          result.push(italicTextConfig);
        } else {
          // その他の要素はテキストとして処理
          const textContent = this.extractTextContent(child as HTMLNode);
          if (textContent) {
            result.push(
              this.createTextNode(
                { type: "text", content: textContent },
                parentStyles,
              ),
            );
          }
        }
      }
    }

    return result;
  }

  /**
   * テキストノードを作成
   */
  private createTextNode(
    node: { type: string; content: string },
    parentStyles: Record<string, string>,
  ): FigmaNodeConfig {
    interface TextNodeConfig extends FigmaNodeConfig {
      type: "TEXT";
      content: string;
      style: {
        fontFamily: string;
        fontSize: number;
        fontWeight: number;
        fontStyle?: string;
        lineHeight: {
          unit: string;
          value: number;
        };
        letterSpacing: number;
        textAlign: string;
        verticalAlign: string;
        fills?: Array<{
          type: string;
          color: {
            r: number;
            g: number;
            b: number;
            a: number;
          };
        }>;
      };
    }

    const textConfig: TextNodeConfig = {
      type: "TEXT",
      content: node.content,
      name: "text",
      layoutMode: "NONE",
      layoutSizingHorizontal: "FIXED",
      style: {
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: 400,
        lineHeight: {
          unit: "PIXELS",
          value: 24,
        },
        letterSpacing: 0,
        textAlign: "LEFT",
        verticalAlign: "TOP",
      },
    };

    // フォントサイズの処理
    if (parentStyles["font-size"]) {
      const sizeValue = Styles.parseSize(parentStyles["font-size"]);
      if (typeof sizeValue === "number") {
        textConfig.style.fontSize = sizeValue;
        // line-heightが指定されていない場合は、フォントサイズに基づいて調整
        if (!parentStyles["line-height"]) {
          textConfig.style.lineHeight.value = sizeValue * 1.5;
        }
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

    return textConfig as FigmaNodeConfig;
  }

  /**
   * 太字テキストノードを作成
   */
  private createBoldTextNode(
    element: HTMLNode,
    parentStyles: Record<string, string>,
  ): FigmaNodeConfig {
    const textContent = this.extractTextContent(element);
    const textNode = this.createTextNode(
      { type: "text", content: textContent },
      parentStyles,
    );
    // TypeScriptの型安全性のため、styleプロパティの存在を確認
    if (
      "style" in textNode &&
      textNode.style &&
      typeof textNode.style === "object"
    ) {
      (textNode.style as { fontWeight?: number }).fontWeight = 700;
    }
    return textNode;
  }

  /**
   * 斜体テキストノードを作成
   */
  private createItalicTextNode(
    element: HTMLNode,
    parentStyles: Record<string, string>,
  ): FigmaNodeConfig {
    const textContent = this.extractTextContent(element);
    const textNode = this.createTextNode(
      { type: "text", content: textContent },
      parentStyles,
    );
    // TypeScriptの型安全性のため、styleプロパティの存在を確認
    if (
      "style" in textNode &&
      textNode.style &&
      typeof textNode.style === "object"
    ) {
      (textNode.style as { fontStyle?: string }).fontStyle = "ITALIC";
    }
    return textNode;
  }

  /**
   * 要素からテキストコンテンツを抽出
   */
  private extractTextContent(element: HTMLNode): string {
    if (!element.children || element.children.length === 0) {
      return "";
    }

    let text = "";
    for (const child of element.children) {
      if (this.isTextNode(child)) {
        text += child.content;
      } else if (this.isElementNode(child)) {
        text += this.extractTextContent(child);
      }
    }
    return text;
  }

  /**
   * テキストノードかどうかを判定
   */
  private isTextNode(node: unknown): node is { type: string; content: string } {
    return (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      node.type === "text" &&
      "content" in node &&
      typeof node.content === "string"
    );
  }

  /**
   * 要素ノードかどうかを判定
   */
  private isElementNode(node: unknown): boolean {
    return (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      typeof (node as { tagName: unknown }).tagName === "string"
    );
  }

  /**
   * ノードをFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    // p要素かどうかをチェック
    if (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "p"
    ) {
      const element = node as PElement;
      return this.toFigmaNode(element);
    }
    return null;
  }
}
