/**
 * @fileoverview progress要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { ProgressAttributes } from "../progress-attributes";
import { ProgressElement } from "../progress-element";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 12;
const TRACK_COLOR = { r: 0.92, g: 0.92, b: 0.92 };
const FILL_COLOR = { r: 0.2, g: 0.6, b: 1 };

/**
 * 数値属性をパースするヘルパー
 */
function parseNumeric(value: unknown, fallback: number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * 値を指定範囲にクランプする
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * style属性から幅・高さを解決する
 */
function resolveSize(attributes?: ProgressAttributes): {
  width: number;
  height: number;
} {
  const style = attributes?.style;
  if (!style) {
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }

  const styles = Styles.parse(style);
  const width = Styles.getWidth(styles);
  const height = Styles.getHeight(styles);

  return {
    width: typeof width === "number" ? width : DEFAULT_WIDTH,
    height: typeof height === "number" ? height : DEFAULT_HEIGHT,
  };
}

/**
 * ノード名をid/classから生成する
 */
function getNodeName(attributes?: ProgressAttributes): string {
  if (attributes?.id) {
    return `progress#${attributes.id}`;
  }
  if (attributes?.class) {
    const className = attributes.class.split(" ")[0];
    return `progress.${className}`;
  }
  return "progress";
}

/**
 * progress要素をFigmaノードに変換
 */
export function toFigmaNode(element: ProgressElement): FigmaNodeConfig {
  const max = Math.max(parseNumeric(element.attributes?.max, 1), 0.0001);
  const value = clamp(parseNumeric(element.attributes?.value, 0), 0, max);
  const ratio = clamp(value / max, 0, 1);
  const size = resolveSize(element.attributes);

  const config = FigmaNode.createFrame(getNodeName(element.attributes));
  config.layoutMode = "NONE";
  config.width = size.width;
  config.height = size.height;

  const track = FigmaNode.createRectangle("progress-track");
  track.width = size.width;
  track.height = size.height;
  track.cornerRadius = size.height / 2;
  track.fills = [{ type: "SOLID", color: TRACK_COLOR }];

  const fill = FigmaNode.createRectangle("progress-fill");
  fill.width = size.width * ratio;
  fill.height = size.height;
  fill.cornerRadius = size.height / 2;
  fill.fills = [{ type: "SOLID", color: FILL_COLOR }];

  config.children = [track, fill];

  return config;
}

/**
 * HTMLNodeからprogress要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "progress",
    ProgressElement.isProgressElement,
    ProgressElement.create,
    toFigmaNode,
  );
}

/**
 * progress要素のコンバータークラス
 */
export class ProgressConverter {
  toFigmaNode(element: ProgressElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
