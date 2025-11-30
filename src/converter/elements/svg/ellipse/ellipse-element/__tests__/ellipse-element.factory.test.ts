import { describe, test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

describe("EllipseElement.create", () => {
  test("デフォルト属性で基本的なellipse要素を作成する", () => {
    const element = EllipseElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("ellipse");
    expect(element.attributes).toBeDefined();
  });

  test("cx, cy, rx, ry属性を設定してellipse要素を作成する", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
    });

    expect(element.attributes.cx).toBe(100);
    expect(element.attributes.cy).toBe(50);
    expect(element.attributes.rx).toBe(80);
    expect(element.attributes.ry).toBe(40);
  });

  test("fill属性を設定してellipse要素を作成する", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
      fill: "#ff0000",
    });

    expect(element.attributes.fill).toBe("#ff0000");
  });

  test("stroke属性を設定してellipse要素を作成する", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    expect(element.attributes.stroke).toBe("#00ff00");
    expect(element.attributes["stroke-width"]).toBe(2);
  });

  test("文字列の座標値を設定してellipse要素を作成する", () => {
    const element = EllipseElement.create({
      cx: "100",
      cy: "50",
      rx: "80",
      ry: "40",
    });

    expect(element.attributes.cx).toBe("100");
    expect(element.attributes.cy).toBe("50");
    expect(element.attributes.rx).toBe("80");
    expect(element.attributes.ry).toBe("40");
  });
});
