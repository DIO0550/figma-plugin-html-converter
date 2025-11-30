import { describe, test, expect } from "vitest";
import { RectElement } from "../rect-element";

describe("RectElement.create", () => {
  test("デフォルト属性で基本的なrect要素を作成する", () => {
    const element = RectElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("rect");
    expect(element.attributes).toBeDefined();
  });

  test("x, y, width, height属性を設定してrect要素を作成する", () => {
    const element = RectElement.create({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });

    expect(element.attributes.x).toBe(10);
    expect(element.attributes.y).toBe(20);
    expect(element.attributes.width).toBe(100);
    expect(element.attributes.height).toBe(50);
  });

  test("rx, ry属性を設定してrect要素を作成する", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      rx: 10,
      ry: 10,
    });

    expect(element.attributes.rx).toBe(10);
    expect(element.attributes.ry).toBe(10);
  });

  test("fill属性を設定してrect要素を作成する", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      fill: "#ff0000",
    });

    expect(element.attributes.fill).toBe("#ff0000");
  });

  test("stroke属性を設定してrect要素を作成する", () => {
    const element = RectElement.create({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    expect(element.attributes.stroke).toBe("#00ff00");
    expect(element.attributes["stroke-width"]).toBe(2);
  });
});
