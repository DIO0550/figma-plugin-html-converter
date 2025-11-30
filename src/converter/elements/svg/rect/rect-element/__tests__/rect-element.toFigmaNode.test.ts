import { describe, test, expect } from "vitest";
import { RectElement } from "../rect-element";

describe("RectElement.toFigmaNode", () => {
  test("基本的なRectangleNodeを生成する", () => {
    const element = RectElement.create({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });

    const config = RectElement.toFigmaNode(element);

    expect(config.name).toBe("rect");
    expect(config.type).toBe("RECTANGLE");
  });

  test("正しい位置とサイズを設定する", () => {
    const element = RectElement.create({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });

    const config = RectElement.toFigmaNode(element);

    expect(config.x).toBe(10);
    expect(config.y).toBe(20);
    expect(config.width).toBe(100);
    expect(config.height).toBe(50);
  });

  test("fillを適用する", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      fill: "#ff0000",
    });

    const config = RectElement.toFigmaNode(element);

    expect(config.fills).toBeDefined();
    expect(config.fills?.length).toBe(1);
    expect(config.fills?.[0].type).toBe("SOLID");
  });

  test("strokeを適用する", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    const config = RectElement.toFigmaNode(element);

    expect(config.strokes).toBeDefined();
    expect(config.strokes?.length).toBe(1);
    expect(config.strokeWeight).toBe(2);
  });

  test("fill='none'の場合fillsを設定しない", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      fill: "none",
    });

    const config = RectElement.toFigmaNode(element);

    expect(config.fills?.length).toBe(0);
  });

  test("rx属性でcornerRadiusを設定する", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      rx: 10,
    });

    const config = RectElement.toFigmaNode(element);

    expect(config.cornerRadius).toBe(10);
  });

  test("ry属性でcornerRadiusを設定する（rxがない場合）", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      ry: 15,
    });

    const config = RectElement.toFigmaNode(element);

    expect(config.cornerRadius).toBe(15);
  });

  test("デフォルト値でrect要素を変換する", () => {
    const element = RectElement.create();

    const config = RectElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(0);
    expect(config.width).toBe(0);
    expect(config.height).toBe(0);
  });
});
