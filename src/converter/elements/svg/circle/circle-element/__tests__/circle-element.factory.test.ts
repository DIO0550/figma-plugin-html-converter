import { describe, test, expect } from "vitest";
import { CircleElement } from "../circle-element";

describe("CircleElement.create", () => {
  test("デフォルト属性で基本的なcircle要素を作成する", () => {
    const element = CircleElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("circle");
    expect(element.attributes).toBeDefined();
  });

  test("cx, cy, r属性を設定してcircle要素を作成する", () => {
    const element = CircleElement.create({
      cx: 50,
      cy: 50,
      r: 25,
    });

    expect(element.attributes.cx).toBe(50);
    expect(element.attributes.cy).toBe(50);
    expect(element.attributes.r).toBe(25);
  });

  test("fill属性を設定してcircle要素を作成する", () => {
    const element = CircleElement.create({
      cx: 100,
      cy: 100,
      r: 50,
      fill: "#ff0000",
    });

    expect(element.attributes.fill).toBe("#ff0000");
  });

  test("stroke属性を設定してcircle要素を作成する", () => {
    const element = CircleElement.create({
      cx: 100,
      cy: 100,
      r: 50,
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    expect(element.attributes.stroke).toBe("#00ff00");
    expect(element.attributes["stroke-width"]).toBe(2);
  });

  test("文字列の座標値を設定してcircle要素を作成する", () => {
    const element = CircleElement.create({
      cx: "100",
      cy: "100",
      r: "50",
    });

    expect(element.attributes.cx).toBe("100");
    expect(element.attributes.cy).toBe("100");
    expect(element.attributes.r).toBe("50");
  });
});
