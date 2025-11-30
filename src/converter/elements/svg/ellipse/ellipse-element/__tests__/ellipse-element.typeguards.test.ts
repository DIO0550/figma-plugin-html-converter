import { describe, test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

describe("EllipseElement.isEllipseElement", () => {
  test("正常なEllipseElementを判定する", () => {
    const element = EllipseElement.create({
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
    });

    expect(EllipseElement.isEllipseElement(element)).toBe(true);
  });

  test("nullを不正と判定する", () => {
    expect(EllipseElement.isEllipseElement(null)).toBe(false);
  });

  test("undefinedを不正と判定する", () => {
    expect(EllipseElement.isEllipseElement(undefined)).toBe(false);
  });

  test("異なるタグ名の要素を不正と判定する", () => {
    const element = {
      type: "element",
      tagName: "circle",
      attributes: {},
    };

    expect(EllipseElement.isEllipseElement(element)).toBe(false);
  });

  test("異なるtypeの要素を不正と判定する", () => {
    const element = {
      type: "text",
      tagName: "ellipse",
      attributes: {},
    };

    expect(EllipseElement.isEllipseElement(element)).toBe(false);
  });
});
