/**
 * @fileoverview meter要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { mapToFigmaWith } from "../../../../utils/element-utils";
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
 * 数値属性をパースするヘルパー
 */
function parseNumeric(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
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
function resolveSize(attributes?: MeterAttributes): {
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
function getNodeName(attributes?: MeterAttributes): string {
  if (attributes?.id) {
    return `meter#${attributes.id}`;
  }
  if (attributes?.class) {
    const className = attributes.class.split(" ")[0];
    return `meter.${className}`;
  }
  return "meter";
}

/**
 * meterの状態（範囲・しきい値・色）を計算する
 */
function resolveMeterState(attributes?: MeterAttributes): MeterState {
  const min = parseNumeric(attributes?.min) ?? 0;
  let max = parseNumeric(attributes?.max) ?? 1;
  if (max <= min) {
    max = min + 1;
  }

  const value = clamp(parseNumeric(attributes?.value) ?? min, min, max);
  const range = max - min;

  const defaultLow = min + range * 0.25;
  const defaultHigh = min + range * 0.75;

  const low = clamp(parseNumeric(attributes?.low) ?? defaultLow, min, max);
  const high = clamp(parseNumeric(attributes?.high) ?? defaultHigh, low, max);

  const optimumParsed = parseNumeric(attributes?.optimum);
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
  const size = resolveSize(element.attributes);
  const state = resolveMeterState(element.attributes);

  const config = FigmaNode.createFrame(getNodeName(element.attributes));
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
