/**
 * @fileoverview progress要素のFigma変換ロジック
 *
 * HTML `<progress>` 要素をFigmaのフレームノードに変換します。
 * トラック（背景）とフィル（進捗部分）の2つの矩形で構成され、
 * value/max属性に基づいて進捗率を視覚化します。
 *
 * @see https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element
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

/** progress要素のデフォルト幅（px）- ブラウザ標準に近似 */
const DEFAULT_WIDTH = 200;

/** progress要素のデフォルト高さ（px）- ブラウザ標準に近似 */
const DEFAULT_HEIGHT = 12;

/** トラック（背景）の色 - ライトグレー（#EBEBEB相当） */
const TRACK_COLOR = { r: 0.92, g: 0.92, b: 0.92 };

/** フィル（進捗部分）の色 - ブルー（#3399FF相当）*/
const FILL_COLOR = { r: 0.2, g: 0.6, b: 1 };

/**
 * ゼロ除算を防ぐための最小max値（イプシロン）
 *
 * max属性が0以下の場合でも安全に比率計算を行うために使用。
 * IEEE 754浮動小数点の精度を考慮した十分小さな正の値。
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
