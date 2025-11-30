import { describe, test, expect } from "vitest";
import { CircleElement } from "../circle-element";

describe("CircleElement.toFigmaNode", () => {
  test("基本的なEllipseNodeを生成する", () => {
    const element = CircleElement.create({
      cx: 50,
      cy: 50,
      r: 25,
    });

    const config = CircleElement.toFigmaNode(element);

    expect(config.name).toBe("circle");
    expect(config.type).toBe("RECTANGLE");
  });

  test("正しい位置とサイズを設定する", () => {
    const element = CircleElement.create({
      cx: 100,
      cy: 100,
      r: 50,
    });

    const config = CircleElement.toFigmaNode(element);

    // cx=100, r=50 → x = 100 - 50 = 50
    expect(config.x).toBe(50);
    // cy=100, r=50 → y = 100 - 50 = 50
    expect(config.y).toBe(50);
    // 直径 = 2 * 50 = 100
    expect(config.width).toBe(100);
    expect(config.height).toBe(100);
  });

  test("fillを適用する", () => {
    const element = CircleElement.create({
      cx: 50,
      cy: 50,
      r: 25,
      fill: "#ff0000",
    });

    const config = CircleElement.toFigmaNode(element);

    expect(config.fills).toBeDefined();
    expect(config.fills?.length).toBe(1);
    expect(config.fills?.[0].type).toBe("SOLID");
  });

  test("strokeを適用する", () => {
    const element = CircleElement.create({
      cx: 50,
      cy: 50,
      r: 25,
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    const config = CircleElement.toFigmaNode(element);

    expect(config.strokes).toBeDefined();
    expect(config.strokes?.length).toBe(1);
    expect(config.strokeWeight).toBe(2);
  });

  test("fill='none'の場合fillsを設定しない", () => {
    const element = CircleElement.create({
      cx: 50,
      cy: 50,
      r: 25,
      fill: "none",
    });

    const config = CircleElement.toFigmaNode(element);

    expect(config.fills?.length).toBe(0);
  });

  test("cornerRadiusを設定して円形にする", () => {
    const element = CircleElement.create({
      cx: 50,
      cy: 50,
      r: 25,
    });

    const config = CircleElement.toFigmaNode(element);

    // 円を表現するためにcornerRadiusを半径に設定
    expect(config.cornerRadius).toBe(25);
  });

  test("デフォルト値でcircle要素を変換する", () => {
    const element = CircleElement.create();

    const config = CircleElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(0);
    expect(config.width).toBe(0);
    expect(config.height).toBe(0);
  });
});
