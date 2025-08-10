import { HTMLNode } from "./models/html-node";
import { FigmaNode, FigmaNodeConfig } from "./models/figma-node";
import { Styles } from "./models/styles";
import { Attributes } from "./models/attributes";
import { Paint } from "./models/paint";
import { ConversionOptions } from "./models/conversion-options";
import type { ConversionOptions as ConversionOptionsType } from "./models/conversion-options";
import { AutoLayoutProperties } from "./models/auto-layout";

// デフォルトのスペーシング値
const DEFAULT_SPACING = 8;

export function mapHTMLNodeToFigma(
  htmlNode: HTMLNode,
  options: ConversionOptionsType = {}
): FigmaNodeConfig {
  // オプションを正規化
  const normalizedOptions = ConversionOptions.from(options);
  // テキストノードの場合
  if (HTMLNode.isText(htmlNode)) {
    const textNode = FigmaNode.createText(htmlNode.textContent || "Text");
    textNode.name = "Text"; // テキストノードの名前は固定
    return textNode;
  }

  // コメントノードの場合は無視
  if (HTMLNode.isComment(htmlNode)) {
    return FigmaNode.createFrame("Comment");
  }

  // 要素ノードの場合
  const tagName = htmlNode.tagName || "unknown";

  // タグ名に基づいてノードタイプを決定
  const isTextElement = [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "a",
    "strong",
    "em",
    "b",
    "i",
    "u",
  ].includes(tagName);
  const isListElement = ["ul", "ol", "li"].includes(tagName);

  let nodeConfig: FigmaNodeConfig;

  if (isTextElement) {
    const textContent = HTMLNode.getTextContent(htmlNode);
    nodeConfig = FigmaNode.createText(textContent || tagName);
    nodeConfig.name = tagName; // タグ名を名前として設定

    // デフォルトフォントの適用
    if (ConversionOptions.hasDefaultFont(normalizedOptions)) {
      // フォント設定のプレースホルダー（実際のFigma APIでは異なる実装が必要）
      // nodeConfig.fontName = normalizedOptions.defaultFont;
    }
  } else {
    nodeConfig = FigmaNode.createFrame(tagName);

    // リスト要素の場合はAuto Layoutを設定
    if (isListElement) {
      FigmaNode.setAutoLayout(nodeConfig, {
        mode: tagName === "li" ? "HORIZONTAL" : "VERTICAL",
        spacing: normalizedOptions.spacing || DEFAULT_SPACING,
      });
    }
  }

  // スタイル属性の解析
  if (htmlNode.attributes?.style) {
    const attributes = Attributes.from(htmlNode.attributes);
    const styleStr = Attributes.getStyle(attributes);

    if (styleStr) {
      const styles = Styles.parse(styleStr);

      // Flexboxレイアウトの適用
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      if (autoLayout && FigmaNode.isFrame(nodeConfig)) {
        nodeConfig.layoutMode = autoLayout.layoutMode;
        nodeConfig.primaryAxisAlignItems = autoLayout.primaryAxisAlignItems;
        nodeConfig.counterAxisAlignItems = autoLayout.counterAxisAlignItems;
        nodeConfig.paddingLeft = autoLayout.paddingLeft;
        nodeConfig.paddingRight = autoLayout.paddingRight;
        nodeConfig.paddingTop = autoLayout.paddingTop;
        nodeConfig.paddingBottom = autoLayout.paddingBottom;
        nodeConfig.itemSpacing = autoLayout.itemSpacing;
      }

      // Padding処理（個別のpadding値も含む）
      if (!nodeConfig.layoutMode || nodeConfig.layoutMode === 'NONE') {
        // Auto Layoutが設定されていない場合、またはFlexboxからのpaddingが設定されていない場合
        const paddingTop = Styles.getPaddingTop(styles);
        const paddingRight = Styles.getPaddingRight(styles);
        const paddingBottom = Styles.getPaddingBottom(styles);
        const paddingLeft = Styles.getPaddingLeft(styles);

        if (typeof paddingTop === 'number') nodeConfig.paddingTop = paddingTop;
        if (typeof paddingRight === 'number') nodeConfig.paddingRight = paddingRight;
        if (typeof paddingBottom === 'number') nodeConfig.paddingBottom = paddingBottom;
        if (typeof paddingLeft === 'number') nodeConfig.paddingLeft = paddingLeft;

        // paddingショートハンドが設定されている場合
        const padding = Styles.getPadding(styles);
        if (padding && !nodeConfig.paddingTop && !nodeConfig.paddingBottom && !nodeConfig.paddingLeft && !nodeConfig.paddingRight) {
          nodeConfig.paddingTop = padding.top;
          nodeConfig.paddingBottom = padding.bottom;
          nodeConfig.paddingLeft = padding.left;
          nodeConfig.paddingRight = padding.right;
        }
      }

      // Position処理
      const position = Styles.getPosition(styles);
      if (position && position !== 'static') {
        const top = Styles.getTop(styles);
        const right = Styles.getRight(styles);
        const bottom = Styles.getBottom(styles);
        const left = Styles.getLeft(styles);

        // x, y座標の設定
        if (typeof left === 'number') {
          nodeConfig.x = left;
        }
        if (typeof top === 'number') {
          nodeConfig.y = top;
        }

        // Constraints設定
        if (position === 'absolute' || position === 'fixed') {
          // デフォルトのconstraints
          let horizontalConstraint: 'MIN' | 'MAX' | 'STRETCH' = 'MIN';
          let verticalConstraint: 'MIN' | 'MAX' | 'STRETCH' = 'MIN';

          // rightが設定されている場合
          if (typeof right === 'number') {
            if (typeof left === 'number') {
              // leftとrightの両方が設定されている場合はSTRETCH
              horizontalConstraint = 'STRETCH';
            } else {
              // rightのみの場合はMAX
              horizontalConstraint = 'MAX';
            }
          }

          // bottomが設定されている場合
          if (typeof bottom === 'number') {
            if (typeof top === 'number') {
              // topとbottomの両方が設定されている場合はSTRETCH
              verticalConstraint = 'STRETCH';
            } else {
              // bottomのみの場合はMAX
              verticalConstraint = 'MAX';
            }
          }

          // fixedの場合、rightが0でleftも0の場合はSTRETCH
          if (position === 'fixed') {
            if (left === 0 && right === 0) {
              horizontalConstraint = 'STRETCH';
            }
          }

          nodeConfig.constraints = {
            horizontal: horizontalConstraint,
            vertical: verticalConstraint
          };
        }

        // relativeの場合、オフセットとして処理
        if (position === 'relative') {
          if (typeof left === 'number') nodeConfig.x = left;
          if (typeof top === 'number') nodeConfig.y = top;
        }

        // z-indexの処理
        const zIndex = Styles.getZIndex(styles);
        if (zIndex !== null) {
          nodeConfig.zIndex = zIndex;
        }
      }

      // Margin処理（Auto Layoutの子要素として処理される場合に影響）
      const margin = Styles.getMargin(styles);
      if (margin) {
        // marginは親要素のAuto Layoutのitemspacingや要素の配置に影響を与える
        // ここではメタデータとして保存（実際のFigma APIでは異なる処理が必要）
        (nodeConfig as any).margin = margin;
      }

      // サイズの適用
      const width = Styles.getWidth(styles);
      if (typeof width === "number") {
        nodeConfig.width = width;
      }

      const height = Styles.getHeight(styles);
      if (typeof height === "number") {
        nodeConfig.height = height;
      }

      // 背景色の適用
      const bgColor = Styles.getBackgroundColor(styles);
      if (bgColor) {
        FigmaNode.setFills(nodeConfig, [Paint.solid(bgColor)]);
      }

      // ボーダーの適用
      const border = Styles.getBorder(styles);
      if (border) {
        FigmaNode.setStrokes(
          nodeConfig,
          [Paint.solid(border.color)],
          border.width
        );
      }

      // 角丸の適用
      const borderRadius = Styles.getBorderRadius(styles);
      if (typeof borderRadius === "number") {
        FigmaNode.setCornerRadius(nodeConfig, borderRadius);
      }
    }
  }

  // 子要素の再帰的な変換
  if (htmlNode.children && htmlNode.children.length > 0) {
    const children: FigmaNodeConfig[] = [];

    for (const child of htmlNode.children) {
      // 子要素を再帰的に変換
      const childNode = mapHTMLNodeToFigma(child, normalizedOptions);

      // コメントノードはスキップ
      if (childNode.name !== "Comment") {
        children.push(childNode);
      }
    }

    // 子要素が存在する場合
    if (children.length > 0) {
      // フレームノードの場合のみ子要素を追加可能
      if (FigmaNode.isFrame(nodeConfig)) {
        // 子要素の配置（実際のFigma APIでは異なる実装が必要）
        // ここでは仮の実装として children プロパティを追加
        (nodeConfig as any).children = children;

        // 親要素がdiv、section、articleなどのコンテナ要素の場合はAuto Layoutを適用
        const isContainerElement = [
          "div",
          "section",
          "article",
          "main",
          "aside",
          "nav",
          "header",
          "footer",
        ].includes(tagName);
        if (isContainerElement && !nodeConfig.layoutMode) {
          FigmaNode.setAutoLayout(nodeConfig, {
            mode: "VERTICAL",
            spacing: normalizedOptions.spacing || DEFAULT_SPACING,
          });
        }

        // コンテナサイズが未設定の場合、デフォルトサイズを適用
        if (!nodeConfig.width && !nodeConfig.height) {
          // ルート要素またはbody要素の場合、コンテナサイズを適用
          if (tagName === "body" || tagName === "html" || tagName === "div") {
            if (ConversionOptions.hasContainerSize(normalizedOptions)) {
              nodeConfig.width = normalizedOptions.containerWidth;
              nodeConfig.height = normalizedOptions.containerHeight;
            }
          }
        }
      }
    }
  }

  return nodeConfig;
}
