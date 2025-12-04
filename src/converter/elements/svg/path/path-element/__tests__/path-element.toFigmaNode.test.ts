import { describe, test, expect } from "vitest";
import { PathElement } from "../path-element";

describe("PathElement.toFigmaNode", () => {
  test("基本的なpath要素 - FRAMEノードを生成する", () => {
    const element = PathElement.create({ d: "M0 0 L100 100" });
    const config = PathElement.toFigmaNode(element);

    expect(config.type).toBe("FRAME");
    expect(config.name).toBe("path");
  });

  test("直線パス - 正しい境界ボックスを計算する", () => {
    const element = PathElement.create({ d: "M10 20 L50 80" });
    const config = PathElement.toFigmaNode(element);

    expect(config.x).toBe(10);
    expect(config.y).toBe(20);
    expect(config.width).toBe(40);
    expect(config.height).toBe(60);
  });

  test("複数の直線 - 正しい境界ボックスを計算する", () => {
    const element = PathElement.create({ d: "M0 0 L100 0 L100 50 L0 50 Z" });
    const config = PathElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(0);
    expect(config.width).toBe(100);
    expect(config.height).toBe(50);
  });

  test("水平線・垂直線コマンド - 正しい境界ボックスを計算する", () => {
    const element = PathElement.create({ d: "M10 10 H50 V40" });
    const config = PathElement.toFigmaNode(element);

    expect(config.x).toBe(10);
    expect(config.y).toBe(10);
    expect(config.width).toBe(40);
    expect(config.height).toBe(30);
  });

  test("fill属性 - fillsを適用する", () => {
    const element = PathElement.create({
      d: "M0 0 L100 100",
      fill: "#ff0000",
    });
    const config = PathElement.toFigmaNode(element);

    expect(config.fills).toBeDefined();
    expect(config.fills).toHaveLength(1);
    expect(config.fills?.[0]).toMatchObject({
      type: "SOLID",
      color: { r: 1, g: 0, b: 0 },
    });
  });

  test("stroke属性 - strokesを適用する", () => {
    const element = PathElement.create({
      d: "M0 0 L100 100",
      stroke: "#00ff00",
      "stroke-width": 3,
    });
    const config = PathElement.toFigmaNode(element);

    expect(config.strokes).toBeDefined();
    expect(config.strokes).toHaveLength(1);
    expect(config.strokes?.[0]).toMatchObject({
      type: "SOLID",
      color: { r: 0, g: 1, b: 0 },
    });
    expect(config.strokeWeight).toBe(3);
  });

  test("fill='none' - fillsを空配列にする", () => {
    const element = PathElement.create({
      d: "M0 0 L100 100",
      fill: "none",
      stroke: "#000000",
    });
    const config = PathElement.toFigmaNode(element);

    expect(config.fills).toEqual([]);
  });

  test("d属性が空 - デフォルトの境界ボックスを返す", () => {
    const element = PathElement.create({ d: "" });
    const config = PathElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(0);
    expect(config.width).toBe(0);
    expect(config.height).toBe(0);
  });

  test("d属性がundefined - デフォルトの境界ボックスを返す", () => {
    const element = PathElement.create({});
    const config = PathElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(0);
    expect(config.width).toBe(0);
    expect(config.height).toBe(0);
  });

  test("負の座標を含むパス - 正しい境界ボックスを計算する", () => {
    const element = PathElement.create({ d: "M-50 -30 L50 30" });
    const config = PathElement.toFigmaNode(element);

    expect(config.x).toBe(-50);
    expect(config.y).toBe(-30);
    expect(config.width).toBe(100);
    expect(config.height).toBe(60);
  });

  test("相対座標のパス - 絶対座標に変換して境界ボックスを計算する", () => {
    const element = PathElement.create({ d: "M10 10 l40 60" });
    const config = PathElement.toFigmaNode(element);

    expect(config.x).toBe(10);
    expect(config.y).toBe(10);
    expect(config.width).toBe(40);
    expect(config.height).toBe(60);
  });

  test("ベジェ曲線のパス - 制御点を含む境界ボックスを計算する", () => {
    const element = PathElement.create({ d: "M0 50 C25 0 75 0 100 50" });
    const config = PathElement.toFigmaNode(element);

    // 境界ボックスは制御点を含むため、最小でも以下の範囲
    expect(config.x).toBeLessThanOrEqual(0);
    expect(config.y).toBeLessThanOrEqual(0);
    expect(config.width).toBeGreaterThanOrEqual(100);
    expect(config.height).toBeGreaterThanOrEqual(50);
  });
});
