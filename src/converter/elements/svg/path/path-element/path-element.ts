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
 * 境界ボックス
 */
interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
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

    const points: Array<{ x: number; y: number }> = [];

    for (const command of commands) {
      if (MoveToCommand.isMoveToCommand(command)) {
        if (command.relative) {
          currentX += command.x;
          currentY += command.y;
        } else {
          currentX = command.x;
          currentY = command.y;
        }
        points.push({ x: currentX, y: currentY });
      } else if (LineToCommand.isLineToCommand(command)) {
        if (command.relative) {
          currentX += command.x;
          currentY += command.y;
        } else {
          currentX = command.x;
          currentY = command.y;
        }
        points.push({ x: currentX, y: currentY });
      } else if (HorizontalLineToCommand.isHorizontalLineToCommand(command)) {
        if (command.relative) {
          currentX += command.x;
        } else {
          currentX = command.x;
        }
        points.push({ x: currentX, y: currentY });
      } else if (VerticalLineToCommand.isVerticalLineToCommand(command)) {
        if (command.relative) {
          currentY += command.y;
        } else {
          currentY = command.y;
        }
        points.push({ x: currentX, y: currentY });
      } else if (CubicBezierCommand.isCubicBezierCommand(command)) {
        // 制御点1 (x1, y1)、制御点2 (x2, y2)、終点 (x, y)
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
        // ベジェ曲線は必ず制御点で囲まれた凸包内に収まるため、
        // 制御点を境界計算に含めることで安全な近似が得られる
        points.push({ x: x1, y: y1 });
        points.push({ x: x2, y: y2 });
        points.push({ x, y });
        currentX = x;
        currentY = y;
      } else if (SmoothCubicBezierCommand.isSmoothCubicBezierCommand(command)) {
        // 制御点2 (x2, y2)、終点 (x, y) ※制御点1は前コマンドから反射
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
        points.push({ x: x2, y: y2 });
        points.push({ x, y });
        currentX = x;
        currentY = y;
      } else if (QuadraticBezierCommand.isQuadraticBezierCommand(command)) {
        // 制御点 (x1, y1)、終点 (x, y)
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
        points.push({ x: x1, y: y1 });
        points.push({ x, y });
        currentX = x;
        currentY = y;
      } else if (
        SmoothQuadraticBezierCommand.isSmoothQuadraticBezierCommand(command)
      ) {
        let x: number, y: number;
        if (command.relative) {
          x = currentX + command.x;
          y = currentY + command.y;
        } else {
          x = command.x;
          y = command.y;
        }
        points.push({ x, y });
        currentX = x;
        currentY = y;
      } else if (ArcCommand.isArcCommand(command)) {
        let x: number, y: number;
        if (command.relative) {
          x = currentX + command.x;
          y = currentY + command.y;
        } else {
          x = command.x;
          y = command.y;
        }
        // 楕円弧の正確な境界計算は回転角度とフラグの組み合わせにより複雑なため、
        // 楕円の外接矩形（始点±半径）と終点を含めることで安全な近似を行う
        points.push({ x: currentX - command.rx, y: currentY - command.ry });
        points.push({ x: currentX + command.rx, y: currentY + command.ry });
        points.push({ x, y });
        currentX = x;
        currentY = y;
      }
      // ClosePathCommand（Z）は現在位置を開始点に戻すだけで新しい座標を追加しないため、
      // 境界計算には影響しない
    }

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
