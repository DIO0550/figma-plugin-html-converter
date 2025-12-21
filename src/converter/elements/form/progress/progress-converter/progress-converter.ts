/**
 * @fileoverview progress要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { buildNodeName } from "../../../../utils/node-name-builder";
import {
  clamp,
  parseNumericWithFallback,
} from "../../../../utils/numeric-helpers";
import { resolveSize } from "../../../../utils/size-helpers";
import { ProgressElement } from "../progress-element";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 12;
const TRACK_COLOR = { r: 0.92, g: 0.92, b: 0.92 };
const FILL_COLOR = { r: 0.2, g: 0.6, b: 1 };

/**
 * ゼロ除算を防ぐための最小max値
 * max属性が0以下の場合にこの値を使用して計算を安全に行う
 */
const MIN_MAX_VALUE = 0.0001;

/**
 * progress要素をFigmaノードに変換
 */
export function toFigmaNode(element: ProgressElement): FigmaNodeConfig {
  const max = Math.max(
    parseNumericWithFallback(element.attributes?.max, 1),
    MIN_MAX_VALUE,
  );
  const value = clamp(
    parseNumericWithFallback(element.attributes?.value, 0),
    0,
    max,
  );
  const ratio = clamp(value / max, 0, 1);
  const size = resolveSize(element.attributes, {
    defaultWidth: DEFAULT_WIDTH,
    defaultHeight: DEFAULT_HEIGHT,
  });

  const config = FigmaNode.createFrame(buildNodeName(element));
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
