import { describe, test, expect } from "vitest";
import { LineElement } from "../line-element";

describe("LineElement.create", () => {
  test("デフォルト属性で基本的なline要素を作成する", () => {
    const element = LineElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("line");
    expect(element.attributes).toBeDefined();
  });

  test("x1, y1, x2, y2属性を設定してline要素を作成する", () => {
    const element = LineElement.create({
      x1: 10,
      y1: 20,
      x2: 100,
      y2: 80,
    });

    expect(element.attributes.x1).toBe(10);
    expect(element.attributes.y1).toBe(20);
    expect(element.attributes.x2).toBe(100);
    expect(element.attributes.y2).toBe(80);
  });

  test("stroke属性を設定してline要素を作成する", () => {
    const element = LineElement.create({
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      stroke: "#ff0000",
      "stroke-width": 2,
    });

    expect(element.attributes.stroke).toBe("#ff0000");
    expect(element.attributes["stroke-width"]).toBe(2);
  });

  test("文字列の座標値を設定してline要素を作成する", () => {
    const element = LineElement.create({
      x1: "10",
      y1: "20",
      x2: "100",
      y2: "80",
    });

    expect(element.attributes.x1).toBe("10");
    expect(element.attributes.y1).toBe("20");
    expect(element.attributes.x2).toBe("100");
    expect(element.attributes.y2).toBe("80");
  });
});
