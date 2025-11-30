import { describe, test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

describe("EllipseElement.toFigmaNode", () => {
  test("基本的なRectangleNodeを生成する（楕円はRectangleで表現）", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
    });

    const config = EllipseElement.toFigmaNode(element);

    expect(config.name).toBe("ellipse");
    expect(config.type).toBe("RECTANGLE");
  });

  test("正しい位置とサイズを設定する", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
    });

    const config = EllipseElement.toFigmaNode(element);

    // cx=100, rx=80 → x = 100 - 80 = 20
    expect(config.x).toBe(20);
    // cy=50, ry=40 → y = 50 - 40 = 10
    expect(config.y).toBe(10);
    // width = 2 * rx = 160
    expect(config.width).toBe(160);
    // height = 2 * ry = 80
    expect(config.height).toBe(80);
  });

  test("fillを適用する", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
      fill: "#ff0000",
    });

    const config = EllipseElement.toFigmaNode(element);

    expect(config.fills).toBeDefined();
    expect(config.fills?.length).toBe(1);
    expect(config.fills?.[0].type).toBe("SOLID");
  });

  test("strokeを適用する", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    const config = EllipseElement.toFigmaNode(element);

    expect(config.strokes).toBeDefined();
    expect(config.strokes?.length).toBe(1);
    expect(config.strokeWeight).toBe(2);
  });

  test("fill='none'の場合fillsを設定しない", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
      fill: "none",
    });

    const config = EllipseElement.toFigmaNode(element);

    expect(config.fills?.length).toBe(0);
  });

  test("cornerRadiusを設定して楕円形にする", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
    });

    const config = EllipseElement.toFigmaNode(element);

    // 楕円を表現するためにcornerRadiusを設定（rx/ryの小さい方の半分）
    // 完全な楕円にするには、実際にはrx, ryそれぞれを考慮する必要がある
    expect(config.cornerRadius).toBeDefined();
  });

  test("デフォルト値でellipse要素を変換する", () => {
    const element = EllipseElement.create();

    const config = EllipseElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(0);
    expect(config.width).toBe(0);
    expect(config.height).toBe(0);
  });
});
