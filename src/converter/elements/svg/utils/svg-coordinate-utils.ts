// SVG座標パース・境界ボックス計算ユーティリティ
const DEFAULT_COORDINATE_VALUE = 0;

/**
 * 境界ボックスの型
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 点座標の型
 */
export interface Point {
  x: number;
  y: number;
}

export const SvgCoordinateUtils = {
  /**
   * 属性値を数値にパースする
   * @param value 属性値（文字列または数値）
   * @param defaultValue デフォルト値
   * @returns パースした数値、またはデフォルト値
   */
  parseNumericAttribute(
    value: string | number | undefined,
    defaultValue: number = DEFAULT_COORDINATE_VALUE,
  ): number {
    if (value === undefined) {
      return defaultValue;
    }

    if (typeof value === "number") {
      return value;
    }

    // parseFloatは文字列の先頭から数値をパース（例: "100px" → 100）
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  },

  /**
   * 円の境界ボックスを計算
   * @param cx 中心X座標
   * @param cy 中心Y座標
   * @param r 半径
   * @returns 境界ボックス
   */
  calculateCircleBounds(cx: number, cy: number, r: number): BoundingBox {
    return {
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2,
    };
  },

  /**
   * 楕円の境界ボックスを計算
   * @param cx 中心X座標
   * @param cy 中心Y座標
   * @param rx X方向の半径
   * @param ry Y方向の半径
   * @returns 境界ボックス
   */
  calculateEllipseBounds(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
  ): BoundingBox {
    return {
      x: cx - rx,
      y: cy - ry,
      width: rx * 2,
      height: ry * 2,
    };
  },

  /**
   * 直線の境界ボックスを計算
   * @param x1 始点X座標
   * @param y1 始点Y座標
   * @param x2 終点X座標
   * @param y2 終点Y座標
   * @returns 境界ボックス
   */
  calculateLineBounds(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): BoundingBox {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  },

  /**
   * 矩形の境界ボックスを計算
   * @param x X座標
   * @param y Y座標
   * @param width 幅
   * @param height 高さ
   * @returns 境界ボックス
   */
  calculateRectBounds(
    x: number,
    y: number,
    width: number,
    height: number,
  ): BoundingBox {
    return {
      x,
      y,
      width,
      height,
    };
  },

  /**
   * SVG points属性をパースして点の配列を返す
   *
   * SVG仕様に従い、カンマまたはスペースで区切られた座標ペアを解析します。
   * 形式: "x1,y1 x2,y2 ..." または "x1 y1 x2 y2 ..."
   *
   * @param points points属性値
   * @returns 点の配列
   */
  parsePoints(points: string | undefined): Point[] {
    if (!points || points.trim() === "") {
      return [];
    }

    const numbers = points
      .trim()
      .split(/[\s,]+/)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));

    const result: Point[] = [];
    for (let i = 0; i + 1 < numbers.length; i += 2) {
      result.push({ x: numbers[i], y: numbers[i + 1] });
    }

    return result;
  },

  /**
   * 点の配列から境界ボックスを計算
   * @param points 点の配列
   * @returns 境界ボックス
   */
  calculatePointsBounds(points: Point[]): BoundingBox {
    if (points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
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

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  },
};
