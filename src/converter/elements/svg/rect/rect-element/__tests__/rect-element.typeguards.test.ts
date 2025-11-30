import { describe, test, expect } from "vitest";
import { RectElement } from "../rect-element";

describe("RectElement.isRectElement", () => {
  test("正常なRectElementを判定する", () => {
    const element = RectElement.create({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });

    expect(RectElement.isRectElement(element)).toBe(true);
  });

  test("nullを不正と判定する", () => {
    expect(RectElement.isRectElement(null)).toBe(false);
  });

  test("undefinedを不正と判定する", () => {
    expect(RectElement.isRectElement(undefined)).toBe(false);
  });

  test("異なるタグ名の要素を不正と判定する", () => {
    const element = {
      type: "element",
      tagName: "circle",
      attributes: {},
    };

    expect(RectElement.isRectElement(element)).toBe(false);
  });

  test("異なるtypeの要素を不正と判定する", () => {
    const element = {
      type: "text",
      tagName: "rect",
      attributes: {},
    };

    expect(RectElement.isRectElement(element)).toBe(false);
  });
});
