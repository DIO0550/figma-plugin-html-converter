import { HTMLNode } from "./models/html-node";
import { FigmaNode, FigmaNodeConfig } from "./models/figma-node";
import { Styles } from "./models/styles";
import { Attributes } from "./models/attributes";
import { Paint } from "./models/paint";
import { ConversionOptions } from "./models/conversion-options";
import { AutoLayoutProperties } from "./models/auto-layout";
import { ImgElement } from "./elements/image";
import { mapToFigma as mapPToFigma } from "./elements/text/p";
import { AConverter } from "./elements/text/a";
import {
  SummaryElement,
  DetailsElement,
  DialogElement,
} from "./elements/interactive";
import { mapToFigma as mapProgressToFigma } from "./elements/form/progress";
import { mapToFigma as mapMeterToFigma } from "./elements/form/meter";

// レイアウト関連の定数
const LAYOUT_CONFIG = {
  DEFAULT_SPACING: 8,
  DEFAULT_CONTAINER_WIDTH: 800,
  DEFAULT_CONTAINER_HEIGHT: 600,
  FULL_PERCENTAGE: 100,
  HALF_PERCENTAGE: 50,
} as const;

export function mapHTMLNodeToFigma(
  htmlNode: HTMLNode,
  options: ConversionOptions = {},
): FigmaNodeConfig {
  const normalizedOptions = ConversionOptions.from(options);
  if (HTMLNode.isText(htmlNode)) {
    const textNode = FigmaNode.createText(htmlNode.textContent || "Text");
    textNode.name = "Text";
    return textNode;
  }

  if (HTMLNode.isComment(htmlNode)) {
    return FigmaNode.createFrame("Comment");
  }

  const tagName = htmlNode.tagName || "unknown";

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

  // p要素の処理を追加
  if (tagName === "p") {
    const pConfig = mapPToFigma(htmlNode);
    if (pConfig) {
      return pConfig;
    }
  }

  // a要素の処理を追加
  if (tagName === "a") {
    const aConfig = AConverter.mapToFigma(htmlNode);
    if (aConfig) {
      return aConfig;
    }
  }

  // interactive要素の処理
  if (tagName === "summary") {
    const summaryConfig = SummaryElement.mapToFigma(htmlNode);
    if (summaryConfig) {
      return summaryConfig;
    }
  }

  if (tagName === "details") {
    const detailsConfig = DetailsElement.mapToFigma(htmlNode);
    if (detailsConfig) {
      return detailsConfig;
    }
  }

  if (tagName === "dialog") {
    const dialogConfig = DialogElement.mapToFigma(htmlNode);
    if (dialogConfig) {
      return dialogConfig;
    }
  }

  // 進捗・メーター要素の処理
  if (tagName === "progress") {
    const progressConfig = mapProgressToFigma(htmlNode);
    if (progressConfig) {
      return progressConfig;
    }
  }

  if (tagName === "meter") {
    const meterConfig = mapMeterToFigma(htmlNode);
    if (meterConfig) {
      return meterConfig;
    }
  }

  if (ImgElement.isImgElement(htmlNode)) {
    const imageConfig = ImgElement.mapToFigma(htmlNode);
    if (imageConfig) {
      nodeConfig = imageConfig;
    } else {
      nodeConfig = FigmaNode.createFrame(tagName);
    }
  } else if (isTextElement) {
    const textContent = HTMLNode.getTextContent(htmlNode);
    nodeConfig = FigmaNode.createText(textContent || tagName);
    nodeConfig.name = tagName;

    if (ConversionOptions.hasDefaultFont(normalizedOptions)) {
      // TODO: Figma APIのfontName実装を追加
      // nodeConfig.fontName = normalizedOptions.defaultFont;
    }
  } else {
    nodeConfig = FigmaNode.createFrame(tagName);

    if (isListElement) {
      FigmaNode.setAutoLayout(nodeConfig, {
        mode: tagName === "li" ? "HORIZONTAL" : "VERTICAL",
        spacing: normalizedOptions.spacing || LAYOUT_CONFIG.DEFAULT_SPACING,
      });
    }
  }

  if (htmlNode.attributes?.style) {
    const attributes = Attributes.from(htmlNode.attributes);
    const styleStr = Attributes.getStyle(attributes);

    if (styleStr) {
      const styles = Styles.parse(styleStr);

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

        const flexWrap = Styles.getFlexWrap(styles);
        if (flexWrap === "wrap" || flexWrap === "wrap-reverse") {
          nodeConfig.layoutWrap = "WRAP";
        }
      }

      if (!nodeConfig.layoutMode || nodeConfig.layoutMode === "NONE") {
        const paddingTop = Styles.getPaddingTop(styles);
        const paddingRight = Styles.getPaddingRight(styles);
        const paddingBottom = Styles.getPaddingBottom(styles);
        const paddingLeft = Styles.getPaddingLeft(styles);

        if (typeof paddingTop === "number") nodeConfig.paddingTop = paddingTop;
        if (typeof paddingRight === "number")
          nodeConfig.paddingRight = paddingRight;
        if (typeof paddingBottom === "number")
          nodeConfig.paddingBottom = paddingBottom;
        if (typeof paddingLeft === "number")
          nodeConfig.paddingLeft = paddingLeft;

        const padding = Styles.getPadding(styles);
        if (
          padding &&
          !nodeConfig.paddingTop &&
          !nodeConfig.paddingBottom &&
          !nodeConfig.paddingLeft &&
          !nodeConfig.paddingRight
        ) {
          nodeConfig.paddingTop = padding.top;
          nodeConfig.paddingBottom = padding.bottom;
          nodeConfig.paddingLeft = padding.left;
          nodeConfig.paddingRight = padding.right;
        }
      }

      const position = Styles.getPosition(styles);
      if (position && position !== "static") {
        const top = Styles.getTop(styles);
        const right = Styles.getRight(styles);
        const bottom = Styles.getBottom(styles);
        const left = Styles.getLeft(styles);

        if (typeof left === "number") {
          nodeConfig.x = left;
        }
        if (typeof top === "number") {
          nodeConfig.y = top;
        }

        if (position === "absolute" || position === "fixed") {
          let horizontalConstraint: "MIN" | "MAX" | "STRETCH" = "MIN";
          let verticalConstraint: "MIN" | "MAX" | "STRETCH" = "MIN";

          if (typeof right === "number") {
            if (typeof left === "number") {
              horizontalConstraint = "STRETCH";
            } else {
              horizontalConstraint = "MAX";
            }
          }

          if (typeof bottom === "number") {
            if (typeof top === "number") {
              verticalConstraint = "STRETCH";
            } else {
              verticalConstraint = "MAX";
            }
          }

          if (position === "fixed") {
            if (left === 0 && right === 0) {
              horizontalConstraint = "STRETCH";
            }
          }

          nodeConfig.constraints = {
            horizontal: horizontalConstraint,
            vertical: verticalConstraint,
          };
        }

        if (position === "relative") {
          if (typeof left === "number") nodeConfig.x = left;
          if (typeof top === "number") nodeConfig.y = top;
        }

        const zIndex = Styles.getZIndex(styles);
        if (zIndex !== null) {
          nodeConfig.zIndex = zIndex;
        }
      }

      const margin = Styles.getMargin(styles);
      if (margin) {
        // TODO: marginを親要素のAuto Layoutとして処理する実装を追加
        (nodeConfig as unknown as { margin: typeof margin }).margin = margin;
      }

      const width = Styles.getWidth(styles);
      if (typeof width === "number") {
        nodeConfig.width = width;
      } else if (width && typeof width === "object" && width.unit === "%") {
        if (width.value === LAYOUT_CONFIG.FULL_PERCENTAGE) {
          nodeConfig.layoutSizingHorizontal = "FILL";
        } else if (width.value === LAYOUT_CONFIG.HALF_PERCENTAGE) {
          nodeConfig.layoutSizingHorizontal = "FILL";
        } else {
          nodeConfig.layoutSizingHorizontal = "FIXED";
          nodeConfig.width =
            LAYOUT_CONFIG.DEFAULT_CONTAINER_WIDTH *
            (width.value / LAYOUT_CONFIG.FULL_PERCENTAGE);
        }
      }

      const height = Styles.getHeight(styles);
      if (typeof height === "number") {
        nodeConfig.height = height;
      } else if (height && typeof height === "object" && height.unit === "%") {
        if (height.value === LAYOUT_CONFIG.FULL_PERCENTAGE) {
          nodeConfig.layoutSizingVertical = "FILL";
        } else if (height.value === LAYOUT_CONFIG.HALF_PERCENTAGE) {
          nodeConfig.height =
            LAYOUT_CONFIG.DEFAULT_CONTAINER_HEIGHT *
            (LAYOUT_CONFIG.HALF_PERCENTAGE / LAYOUT_CONFIG.FULL_PERCENTAGE);
        } else {
          nodeConfig.layoutSizingVertical = "FIXED";
          nodeConfig.height =
            LAYOUT_CONFIG.DEFAULT_CONTAINER_HEIGHT *
            (height.value / LAYOUT_CONFIG.FULL_PERCENTAGE);
        }
      } else if (height === null && styles.height === "auto") {
        nodeConfig.layoutSizingVertical = "HUG";
      }

      const minWidth = Styles.getMinWidth(styles);
      if (minWidth !== null) nodeConfig.minWidth = minWidth;

      const maxWidth = Styles.getMaxWidth(styles);
      if (maxWidth !== null) nodeConfig.maxWidth = maxWidth;

      const minHeight = Styles.getMinHeight(styles);
      if (minHeight !== null) nodeConfig.minHeight = minHeight;

      const maxHeight = Styles.getMaxHeight(styles);
      if (maxHeight !== null) nodeConfig.maxHeight = maxHeight;

      const aspectRatio = Styles.getAspectRatio(styles);
      if (aspectRatio !== null) {
        nodeConfig.aspectRatio = aspectRatio;
        if (nodeConfig.width && !nodeConfig.height) {
          nodeConfig.height = nodeConfig.width / aspectRatio;
        }
      }

      const flexGrow = Styles.getFlexGrow(styles);
      if (flexGrow !== null) {
        nodeConfig.layoutGrow = flexGrow;
        if (flexGrow > 0) {
          nodeConfig.layoutSizingHorizontal = "FILL";
        }
      }

      const flexShrink = Styles.getFlexShrink(styles);
      if (flexShrink === 0) {
        nodeConfig.layoutGrow = 0;
      }

      if (
        minWidth !== null ||
        maxWidth !== null ||
        minHeight !== null ||
        maxHeight !== null
      ) {
        if (!nodeConfig.constraints) {
          nodeConfig.constraints = {
            horizontal:
              minWidth !== null || maxWidth !== null ? "SCALE" : "MIN",
            vertical: minHeight !== null || maxHeight !== null ? "MIN" : "MIN",
          };
        }
      }

      const bgColor = Styles.getBackgroundColor(styles);
      if (bgColor) {
        FigmaNode.setFills(nodeConfig, [Paint.solid(bgColor)]);
      }

      const border = Styles.getBorder(styles);
      if (border) {
        FigmaNode.setStrokes(
          nodeConfig,
          [Paint.solid(border.color)],
          border.width,
        );
      }

      const borderRadius = Styles.getBorderRadius(styles);
      if (typeof borderRadius === "number") {
        FigmaNode.setCornerRadius(nodeConfig, borderRadius);
      }
    }
  }

  if (htmlNode.children && htmlNode.children.length > 0) {
    const children: FigmaNodeConfig[] = [];

    for (const child of htmlNode.children) {
      const childNode = mapHTMLNodeToFigma(child, normalizedOptions);

      if (childNode.name !== "Comment") {
        children.push(childNode);
      }
    }

    if (children.length > 0) {
      if (FigmaNode.isFrame(nodeConfig)) {
        // TODO: Figma APIでの子要素配置実装を追加
        (nodeConfig as unknown as { children: typeof children }).children =
          children;

        const displayStyle = htmlNode.attributes?.style
          ? Styles.parse(htmlNode.attributes.style)
          : null;
        const display = displayStyle
          ? Styles.get(displayStyle, "display")
          : null;
        if (display === "block" || display === "inline-block") {
          if (
            nodeConfig.layoutMode === "VERTICAL" &&
            !displayStyle?.display?.includes("flex")
          ) {
            delete nodeConfig.layoutMode;
            delete nodeConfig.primaryAxisAlignItems;
            delete nodeConfig.counterAxisAlignItems;
            delete nodeConfig.itemSpacing;
          }
        }

        if (
          !nodeConfig.width &&
          !nodeConfig.height &&
          !nodeConfig.layoutSizingHorizontal &&
          !nodeConfig.layoutSizingVertical
        ) {
          if (tagName === "body" || tagName === "html") {
            if (ConversionOptions.hasContainerSize(normalizedOptions)) {
              nodeConfig.width = normalizedOptions.containerWidth;
              nodeConfig.height = normalizedOptions.containerHeight;
            }
          } else if (tagName === "div" && !nodeConfig.layoutMode) {
            delete nodeConfig.layoutMode;
          }
        }
      }
    }
  }

  return nodeConfig;
}

export const HTMLToFigmaMapper = {
  mapNode: mapHTMLNodeToFigma,
};
