import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { PathAttributes } from "../path-attributes";
import { PathParser } from "../path-parser";
import type { PathCommandType } from "../path-parser";
import {
  MoveToCommand,
  LineToCommand,
  HorizontalLineToCommand,
  VerticalLineToCommand,
  CubicBezierCommand,
  SmoothCubicBezierCommand,
  QuadraticBezierCommand,
  SmoothQuadraticBezierCommand,
  ArcCommand,
} from "../path-parser";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

/**
 * 点座標
 */
interface Point {
  x: number;
  y: number;
}

/**
 * 境界ボックス
 */
interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * コマンド処理結果
 */
interface CommandProcessResult {
  points: Point[];
  currentX: number;
  currentY: number;
}

/**
 * パスデータが空または解析不能な場合のデフォルト境界ボックス
 */
const DEFAULT_BOUNDING_BOX: BoundingBox = {
  minX: 0,
  minY: 0,
  maxX: 0,
  maxY: 0,
};

/**
 * MoveToコマンドを処理
 */
function processMoveToCommand(
  command: MoveToCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  if (command.relative) {
    currentX += command.x;
    currentY += command.y;
  } else {
    currentX = command.x;
    currentY = command.y;
  }
  return {
    points: [{ x: currentX, y: currentY }],
    currentX,
    currentY,
  };
}

/**
 * LineToコマンドを処理
 */
function processLineToCommand(
  command: LineToCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  if (command.relative) {
    currentX += command.x;
    currentY += command.y;
  } else {
    currentX = command.x;
    currentY = command.y;
  }
  return {
    points: [{ x: currentX, y: currentY }],
    currentX,
    currentY,
  };
}

/**
 * HorizontalLineToコマンドを処理
 */
function processHorizontalLineToCommand(
  command: HorizontalLineToCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  if (command.relative) {
    currentX += command.x;
  } else {
    currentX = command.x;
  }
  return {
    points: [{ x: currentX, y: currentY }],
    currentX,
    currentY,
  };
}

/**
 * VerticalLineToコマンドを処理
 */
function processVerticalLineToCommand(
  command: VerticalLineToCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  if (command.relative) {
    currentY += command.y;
  } else {
    currentY = command.y;
  }
  return {
    points: [{ x: currentX, y: currentY }],
    currentX,
    currentY,
  };
}

/**
 * CubicBezierコマンドを処理
 *
 * ベジェ曲線は必ず制御点で囲まれた凸包内に収まるため、
 * 制御点を境界計算に含めることで安全な近似が得られる
 */
function processCubicBezierCommand(
  command: CubicBezierCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  let x1: number, y1: number;
  let x2: number, y2: number;
  let x: number, y: number;

  if (command.relative) {
    x1 = currentX + command.x1;
    y1 = currentY + command.y1;
    x2 = currentX + command.x2;
    y2 = currentY + command.y2;
    x = currentX + command.x;
    y = currentY + command.y;
  } else {
    x1 = command.x1;
    y1 = command.y1;
    x2 = command.x2;
    y2 = command.y2;
    x = command.x;
    y = command.y;
  }

  return {
    points: [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x, y },
    ],
    currentX: x,
    currentY: y,
  };
}

/**
 * SmoothCubicBezierコマンドを処理
 *
 * 制御点1は前コマンドから反射されるため、制御点2と終点のみ処理
 */
function processSmoothCubicBezierCommand(
  command: SmoothCubicBezierCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  let x2: number, y2: number;
  let x: number, y: number;

  if (command.relative) {
    x2 = currentX + command.x2;
    y2 = currentY + command.y2;
    x = currentX + command.x;
    y = currentY + command.y;
  } else {
    x2 = command.x2;
    y2 = command.y2;
    x = command.x;
    y = command.y;
  }

  return {
    points: [
      { x: x2, y: y2 },
      { x, y },
    ],
    currentX: x,
    currentY: y,
  };
}

/**
 * QuadraticBezierコマンドを処理
 */
function processQuadraticBezierCommand(
  command: QuadraticBezierCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  let x1: number, y1: number;
  let x: number, y: number;

  if (command.relative) {
    x1 = currentX + command.x1;
    y1 = currentY + command.y1;
    x = currentX + command.x;
    y = currentY + command.y;
  } else {
    x1 = command.x1;
    y1 = command.y1;
    x = command.x;
    y = command.y;
  }

  return {
    points: [
      { x: x1, y: y1 },
      { x, y },
    ],
    currentX: x,
    currentY: y,
  };
}

/**
 * SmoothQuadraticBezierコマンドを処理
 */
function processSmoothQuadraticBezierCommand(
  command: SmoothQuadraticBezierCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  let x: number, y: number;

  if (command.relative) {
    x = currentX + command.x;
    y = currentY + command.y;
  } else {
    x = command.x;
    y = command.y;
  }

  return {
    points: [{ x, y }],
    currentX: x,
    currentY: y,
  };
}

/**
 * Arcコマンドを処理
 *
 * 楕円弧の正確な境界計算は回転角度とフラグの組み合わせにより複雑なため、
 * 楕円の外接矩形（始点±半径）と終点を含めることで安全な近似を行う
 */
function processArcCommand(
  command: ArcCommand,
  currentX: number,
  currentY: number,
): CommandProcessResult {
  let x: number, y: number;

  if (command.relative) {
    x = currentX + command.x;
    y = currentY + command.y;
  } else {
    x = command.x;
    y = command.y;
  }

  return {
    points: [
      { x: currentX - command.rx, y: currentY - command.ry },
      { x: currentX + command.rx, y: currentY + command.ry },
      { x, y },
    ],
    currentX: x,
    currentY: y,
  };
}

/**
 * SVG path要素の型定義
 */
export interface PathElement {
  type: "element";
  tagName: "path";
  attributes: PathAttributes;
  children?: never;
}

/**
 * PathElementコンパニオンオブジェクト
 */
export const PathElement = {
  /**
   * 型ガード
   */
  isPathElement(node: unknown): node is PathElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "path"
    );
  },

  /**
   * ファクトリーメソッド
   */
  create(attributes: Partial<PathAttributes> = {}): PathElement {
    return {
      type: "element",
      tagName: "path",
      attributes: attributes as PathAttributes,
    };
  },

  /**
   * d属性を取得
   */
  getD(element: PathElement): string {
    return element.attributes.d ?? "";
  },

  /**
   * パスデータをパースしてコマンド配列を返す
   */
  parsePathData(element: PathElement): PathCommandType[] {
    const d = this.getD(element);
    if (!d) {
      return [];
    }
    return PathParser.parse(d);
  },

  /**
   * 単一のパスコマンドを処理して座標と収集した点を返す
   *
   * 各コマンドタイプに応じて適切なヘルパー関数に処理を委譲し、
   * 現在座標を更新して境界計算に必要な点を収集します。
   */
  processCommand(
    command: PathCommandType,
    currentX: number,
    currentY: number,
  ): CommandProcessResult {
    if (MoveToCommand.isMoveToCommand(command)) {
      return processMoveToCommand(command, currentX, currentY);
    }
    if (LineToCommand.isLineToCommand(command)) {
      return processLineToCommand(command, currentX, currentY);
    }
    if (HorizontalLineToCommand.isHorizontalLineToCommand(command)) {
      return processHorizontalLineToCommand(command, currentX, currentY);
    }
    if (VerticalLineToCommand.isVerticalLineToCommand(command)) {
      return processVerticalLineToCommand(command, currentX, currentY);
    }
    if (CubicBezierCommand.isCubicBezierCommand(command)) {
      return processCubicBezierCommand(command, currentX, currentY);
    }
    if (SmoothCubicBezierCommand.isSmoothCubicBezierCommand(command)) {
      return processSmoothCubicBezierCommand(command, currentX, currentY);
    }
    if (QuadraticBezierCommand.isQuadraticBezierCommand(command)) {
      return processQuadraticBezierCommand(command, currentX, currentY);
    }
    if (SmoothQuadraticBezierCommand.isSmoothQuadraticBezierCommand(command)) {
      return processSmoothQuadraticBezierCommand(command, currentX, currentY);
    }
    if (ArcCommand.isArcCommand(command)) {
      return processArcCommand(command, currentX, currentY);
    }

    // ClosePathCommand（Z）は現在位置を開始点に戻すだけで新しい座標を追加しないため、
    // 境界計算には影響しない
    return { points: [], currentX, currentY };
  },

  /**
   * 点の配列から境界ボックスを計算
   */
  calculateBoundsFromPoints(points: Point[]): BoundingBox {
    if (points.length === 0) {
      return DEFAULT_BOUNDING_BOX;
    }

    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;

    for (const point of points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return { minX, minY, maxX, maxY };
  },

  /**
   * パスの境界ボックスを計算
   *
   * パスコマンドを順に処理し、全ての点を含む境界ボックスを計算します。
   * ベジェ曲線の場合は制御点も含めて計算します（近似）。
   */
  calculateBoundingBox(element: PathElement): BoundingBox {
    const commands = this.parsePathData(element);

    if (commands.length === 0) {
      return DEFAULT_BOUNDING_BOX;
    }

    let currentX = 0;
    let currentY = 0;
    const allPoints: Point[] = [];

    for (const command of commands) {
      const result = this.processCommand(command, currentX, currentY);
      allPoints.push(...result.points);
      currentX = result.currentX;
      currentY = result.currentY;
    }

    return this.calculateBoundsFromPoints(allPoints);
  },

  /**
   * PathElementをFigmaのFRAMEノードに変換
   *
   * 設計判断: FigmaのVECTORノードは複雑なvectorNetworkの設定が必要なため、
   * このコンバーターではパスの境界ボックスを計算してFRAMEノードで表現します。
   * これにより、パスの位置とサイズは正確に変換されますが、
   * パスの形状自体は表現されません。将来的にVECTORノードへの変換を検討します。
   *
   * @param element 変換するPath要素
   * @returns FigmaノードConfig（FRAMEタイプ）
   */
  toFigmaNode(element: PathElement): FigmaNodeConfig {
    const bounds = this.calculateBoundingBox(element);

    const config = FigmaNode.createFrame("path");

    config.x = bounds.minX;
    config.y = bounds.minY;
    config.width = bounds.maxX - bounds.minX;
    config.height = bounds.maxY - bounds.minY;

    SvgPaintUtils.applyPaintToNode(config, element.attributes);

    return config;
  },

  /**
   * マッピング関数
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "path",
      this.isPathElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
