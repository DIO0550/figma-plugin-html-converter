/**
 * @fileoverview meter要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { clamp, parseNumericOrNull } from "../../../../utils/numeric-helpers";
import { resolveSize } from "../../../../utils/size-helpers";
import type { MeterAttributes } from "../meter-attributes";
import { MeterElement } from "../meter-element";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 12;
const TRACK_COLOR = { r: 0.92, g: 0.92, b: 0.92 };
const STATUS_COLORS = {
  good: { r: 0.2, g: 0.7, b: 0.2 },
  caution: { r: 0.95, g: 0.76, b: 0.2 },
  danger: { r: 0.9, g: 0.3, b: 0.3 },
} as const;

/**
 * low/highしきい値のデフォルト比率
 * low: 範囲の25%地点、high: 範囲の75%地点
 */
const DEFAULT_LOW_RATIO = 0.25;
const DEFAULT_HIGH_RATIO = 0.75;

type MeterStatus = keyof typeof STATUS_COLORS;

interface MeterState {
  min: number;
  max: number;
  value: number;
  low: number;
  high: number;
  optimum: number | null;
  ratio: number;
  status: MeterStatus;
}

/**
 * meterの状態（範囲・しきい値・色）を計算する
 */
function resolveMeterState(attributes?: MeterAttributes): MeterState {
  const min = parseNumericOrNull(attributes?.min) ?? 0;
  let max = parseNumericOrNull(attributes?.max) ?? 1;
  if (max <= min) {
    max = min + 1;
  }

  const value = clamp(parseNumericOrNull(attributes?.value) ?? min, min, max);
  const range = max - min;

  const defaultLow = min + range * DEFAULT_LOW_RATIO;
  const defaultHigh = min + range * DEFAULT_HIGH_RATIO;

  const low = clamp(
    parseNumericOrNull(attributes?.low) ?? defaultLow,
    min,
    max,
  );
  const high = clamp(
    parseNumericOrNull(attributes?.high) ?? defaultHigh,
    low,
    max,
  );

  const optimumParsed = parseNumericOrNull(attributes?.optimum);
  const optimum =
    optimumParsed === null ? null : clamp(optimumParsed, min, max);

  const ratio = range === 0 ? 0 : (value - min) / range;
  const status = determineMeterStatus(value, { min, max, low, high, optimum });

  return { min, max, value, low, high, optimum, ratio, status };
}

/**
 * meterの色状態を決定する
 */
function determineMeterStatus(
  value: number,
  info: {
    min: number;
    max: number;
    low: number;
    high: number;
    optimum: number | null;
  },
): MeterStatus {
  const { low, high, optimum } = info;

  if (optimum !== null) {
    if (optimum >= high) {
      if (value >= high) return "good";
      if (value >= low) return "caution";
      return "danger";
    }

    if (optimum <= low) {
      if (value <= low) return "good";
      if (value <= high) return "caution";
      return "danger";
    }

    if (value >= low && value <= high) {
      return "good";
    }
    return "danger";
  }

  if (value >= high) return "good";
  if (value >= low) return "caution";
  return "danger";
}

/**
 * meter要素をFigmaノードに変換
 */
export function toFigmaNode(element: MeterElement): FigmaNodeConfig {
  const size = resolveSize(element.attributes, {
    defaultWidth: DEFAULT_WIDTH,
    defaultHeight: DEFAULT_HEIGHT,
  });
  const state = resolveMeterState(element.attributes);

  const config = FigmaNode.createFrame(buildNodeName(element));
  config.layoutMode = "NONE";
  config.width = size.width;
  config.height = size.height;

  const track = FigmaNode.createRectangle("meter-track");
  track.width = size.width;
  track.height = size.height;
  track.cornerRadius = size.height / 2;
  track.fills = [{ type: "SOLID", color: TRACK_COLOR }];

  const fill = FigmaNode.createRectangle("meter-fill");
  fill.width = size.width * state.ratio;
  fill.height = size.height;
  fill.cornerRadius = size.height / 2;
  fill.fills = [{ type: "SOLID", color: STATUS_COLORS[state.status] }];

  config.children = [track, fill];

  return config;
}

/**
 * HTMLNodeからmeter要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "meter",
    MeterElement.isMeterElement,
    MeterElement.create,
    toFigmaNode,
  );
}
