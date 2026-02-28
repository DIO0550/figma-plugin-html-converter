import { HTMLNode } from "./models/html-node";
import { FigmaNode, FigmaNodeConfig } from "./models/figma-node";
import { Styles } from "./models/styles";
import { Attributes } from "./models/attributes";
import { Paint } from "./models/paint";
import { ConversionOptions } from "./models/conversion-options";
import { AutoLayoutProperties } from "./models/auto-layout";
import { ImgElement } from "./elements/image";
import { VideoElement } from "./elements/video";
import { AudioElement } from "./elements/audio";
import { IframeElement } from "./elements/iframe";
import { EmbedElement } from "./elements/embed";
import { ObjectElement } from "./elements/object";
import { mapToFigma as mapPToFigma } from "./elements/text/p";
import { AConverter } from "./elements/text/a";
import {
  SummaryElement,
  DetailsElement,
  DialogElement,
} from "./elements/interactive";
import { mapToFigma as mapProgressToFigma } from "./elements/form/progress";
import { mapToFigma as mapMeterToFigma } from "./elements/form/meter";
import { TimeConverter } from "./elements/text/time";
import { AbbrConverter } from "./elements/text/abbr";
import { CiteConverter } from "./elements/text/cite";
import { QConverter } from "./elements/text/q";
import { KbdConverter } from "./elements/text/kbd";
import { SampConverter } from "./elements/text/samp";
import { VarConverter } from "./elements/text/var";

const inlineSemanticConverters = {
  time: TimeConverter,
  abbr: AbbrConverter,
  cite: CiteConverter,
  q: QConverter,
  kbd: KbdConverter,
  samp: SampConverter,
  var: VarConverter,
} as const;

// レイアウト関連の定数
const LAYOUT_CONFIG = {
  DEFAULT_SPACING: 8,
  DEFAULT_CONTAINER_WIDTH: 800,
  DEFAULT_CONTAINER_HEIGHT: 600,
  FULL_PERCENTAGE: 100,
  HALF_PERCENTAGE: 50,
} as const;

type ResolveResult =
  | { earlyReturn: true; nodeConfig: FigmaNodeConfig }
  | { earlyReturn: false; nodeConfig: FigmaNodeConfig };

function resolveByTag(
  htmlNode: HTMLNode,
  tagName: string,
  normalizedOptions: ConversionOptions,
): ResolveResult {
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

  // p要素の処理
  if (tagName === "p") {
    const pConfig = mapPToFigma(htmlNode);
    if (pConfig) {
      return { earlyReturn: true, nodeConfig: pConfig };
    }
  }

  // a要素の処理
  if (tagName === "a") {
    const aConfig = AConverter.mapToFigma(htmlNode);
    if (aConfig) {
      return { earlyReturn: true, nodeConfig: aConfig };
    }
  }

  // interactive要素の処理
  if (tagName === "summary") {
    const summaryConfig = SummaryElement.mapToFigma(htmlNode);
    if (summaryConfig) {
      return { earlyReturn: true, nodeConfig: summaryConfig };
    }
  }

  if (tagName === "details") {
    const detailsConfig = DetailsElement.mapToFigma(htmlNode);
    if (detailsConfig) {
      return { earlyReturn: true, nodeConfig: detailsConfig };
    }
  }

  if (tagName === "dialog") {
    const dialogConfig = DialogElement.mapToFigma(htmlNode);
    if (dialogConfig) {
      return { earlyReturn: true, nodeConfig: dialogConfig };
    }
  }

  // 進捗・メーター要素の処理
  if (tagName === "progress") {
    const progressConfig = mapProgressToFigma(htmlNode);
    if (progressConfig) {
      return { earlyReturn: true, nodeConfig: progressConfig };
    }
  }

  if (tagName === "meter") {
    const meterConfig = mapMeterToFigma(htmlNode);
    if (meterConfig) {
      return { earlyReturn: true, nodeConfig: meterConfig };
    }
  }

  const inlineSemanticConverter =
    inlineSemanticConverters[tagName as keyof typeof inlineSemanticConverters];
  if (inlineSemanticConverter) {
    const config = inlineSemanticConverter.mapToFigma(htmlNode);
    if (config) {
      return { earlyReturn: true, nodeConfig: config };
    }
  }

  let nodeConfig: FigmaNodeConfig;

  if (ImgElement.isImgElement(htmlNode)) {
    const imageConfig = ImgElement.mapToFigma(htmlNode);
    if (imageConfig) {
      nodeConfig = imageConfig;
    } else {
      nodeConfig = FigmaNode.createFrame(tagName);
    }
  } else if (VideoElement.isVideoElement(htmlNode)) {
    const videoConfig = VideoElement.mapToFigma(htmlNode);
    if (videoConfig) {
      nodeConfig = videoConfig;
    } else {
      nodeConfig = FigmaNode.createFrame(tagName);
    }
  } else if (AudioElement.isAudioElement(htmlNode)) {
    const audioConfig = AudioElement.mapToFigma(htmlNode);
    if (audioConfig) {
      nodeConfig = audioConfig;
    } else {
      nodeConfig = FigmaNode.createFrame(tagName);
    }
  } else if (IframeElement.isIframeElement(htmlNode)) {
    const iframeConfig = IframeElement.mapToFigma(htmlNode);
    if (iframeConfig) {
      nodeConfig = iframeConfig;
    } else {
      nodeConfig = FigmaNode.createFrame(tagName);
    }
  } else if (EmbedElement.isEmbedElement(htmlNode)) {
    const embedConfig = EmbedElement.mapToFigma(htmlNode);
    if (embedConfig) {
      nodeConfig = embedConfig;
    } else {
      nodeConfig = FigmaNode.createFrame(tagName);
    }
  } else if (ObjectElement.isObjectElement(htmlNode)) {
    const objectConfig = ObjectElement.mapToFigma(htmlNode);
    if (objectConfig) {
      nodeConfig = objectConfig;
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
        spacing: normalizedOptions.spacing ?? LAYOUT_CONFIG.DEFAULT_SPACING,
      });
    }
  }

  return { earlyReturn: false, nodeConfig };
}

function applyAutoLayout(nodeConfig: FigmaNodeConfig, styles: Styles): void {
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
}

function applyPadding(nodeConfig: FigmaNodeConfig, styles: Styles): void {
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
    if (typeof paddingLeft === "number") nodeConfig.paddingLeft = paddingLeft;

    const padding = Styles.getPadding(styles);
    // 0も有効な値として扱う: === undefined で未設定判定
    if (
      padding !== null &&
      nodeConfig.paddingTop === undefined &&
      nodeConfig.paddingBottom === undefined &&
      nodeConfig.paddingLeft === undefined &&
      nodeConfig.paddingRight === undefined
    ) {
      nodeConfig.paddingTop = padding.top;
      nodeConfig.paddingBottom = padding.bottom;
      nodeConfig.paddingLeft = padding.left;
      nodeConfig.paddingRight = padding.right;
    }
  }
}

function applyPositioning(nodeConfig: FigmaNodeConfig, styles: Styles): void {
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
}

function applySizing(nodeConfig: FigmaNodeConfig, styles: Styles): void {
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
  if (aspectRatio !== null && Number.isFinite(aspectRatio) && aspectRatio > 0) {
    nodeConfig.aspectRatio = aspectRatio;
    if (nodeConfig.width !== undefined && nodeConfig.height === undefined) {
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
        horizontal: minWidth !== null || maxWidth !== null ? "SCALE" : "MIN",
        vertical: minHeight !== null || maxHeight !== null ? "MIN" : "MIN",
      };
    }
  }
}

function applyVisualStyles(nodeConfig: FigmaNodeConfig, styles: Styles): void {
  const bgColor = Styles.getBackgroundColor(styles);
  if (bgColor) {
    FigmaNode.setFills(nodeConfig, [Paint.solid(bgColor)]);
  }

  const border = Styles.getBorder(styles);
  if (border) {
    FigmaNode.setStrokes(nodeConfig, [Paint.solid(border.color)], border.width);
  }

  const borderRadius = Styles.getBorderRadius(styles);
  if (typeof borderRadius === "number") {
    FigmaNode.setCornerRadius(nodeConfig, borderRadius);
  }
}

function appendChildren(
  nodeConfig: FigmaNodeConfig,
  htmlNode: HTMLNode,
  tagName: string,
  normalizedOptions: ConversionOptions,
  styles: Styles | null,
): void {
  if (!htmlNode.children || htmlNode.children.length === 0) return;

  const children: FigmaNodeConfig[] = [];

  for (const child of htmlNode.children) {
    const childNode = mapHTMLNodeToFigma(child, normalizedOptions);

    if (childNode.name !== "Comment") {
      children.push(childNode);
    }
  }

  if (children.length === 0) return;

  if (FigmaNode.isFrame(nodeConfig)) {
    // TODO: Figma APIでの子要素配置実装を追加
    (nodeConfig as unknown as { children: typeof children }).children =
      children;

    const display = styles ? Styles.get(styles, "display") : null;
    if (display === "block" || display === "inline-block") {
      if (
        nodeConfig.layoutMode === "VERTICAL" &&
        !styles?.display?.includes("flex")
      ) {
        delete nodeConfig.layoutMode;
        delete nodeConfig.primaryAxisAlignItems;
        delete nodeConfig.counterAxisAlignItems;
        delete nodeConfig.itemSpacing;
      }
    }

    // 0も有効な値として扱う: === undefined で未設定判定
    if (
      nodeConfig.width === undefined &&
      nodeConfig.height === undefined &&
      nodeConfig.layoutSizingHorizontal === undefined &&
      nodeConfig.layoutSizingVertical === undefined
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

export function mapHTMLNodeToFigma(
  htmlNode: HTMLNode,
  options: ConversionOptions = {},
): FigmaNodeConfig {
  const normalizedOptions = ConversionOptions.from(options);

  // テキスト・コメントの早期リターン
  if (HTMLNode.isText(htmlNode)) {
    const textNode = FigmaNode.createText(htmlNode.textContent || "Text");
    textNode.name = "Text";
    return textNode;
  }

  if (HTMLNode.isComment(htmlNode)) {
    return FigmaNode.createFrame("Comment");
  }

  const tagName = htmlNode.tagName || "unknown";

  // Phase 1: タグによるノード解決
  const resolved = resolveByTag(htmlNode, tagName, normalizedOptions);
  if (resolved.earlyReturn) return resolved.nodeConfig;
  const nodeConfig = resolved.nodeConfig;

  // スタイルのパースは1回のみ
  let styles: Styles | null = null;
  if (htmlNode.attributes?.style) {
    const attributes = Attributes.from(htmlNode.attributes);
    const styleStr = Attributes.getStyle(attributes);
    if (styleStr) {
      styles = Styles.parse(styleStr);
    }
  }

  // Phase 2: スタイル適用
  if (styles) {
    applyAutoLayout(nodeConfig, styles);
    applyPadding(nodeConfig, styles);
    applyPositioning(nodeConfig, styles);
    applySizing(nodeConfig, styles);
    applyVisualStyles(nodeConfig, styles);
  }

  // Phase 3: 子要素処理（stylesはdisplay補正に必要なため渡す）
  appendChildren(nodeConfig, htmlNode, tagName, normalizedOptions, styles);

  return nodeConfig;
}

export const HTMLToFigmaMapper = {
  mapNode: mapHTMLNodeToFigma,
};
