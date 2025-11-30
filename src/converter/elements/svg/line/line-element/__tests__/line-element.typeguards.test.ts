import { describe, test, expect } from "vitest";
import { LineElement } from "../line-element";

describe("LineElement.isLineElement", () => {
  test("正常なLineElementを判定する", () => {
    const element = LineElement.create({
      x1: 10,
      y1: 20,
      x2: 100,
      y2: 80,
    });

    expect(LineElement.isLineElement(element)).toBe(true);
  });

  test("nullを不正と判定する", () => {
    expect(LineElement.isLineElement(null)).toBe(false);
  });

  test("undefinedを不正と判定する", () => {
    expect(LineElement.isLineElement(undefined)).toBe(false);
  });

  test("異なるタグ名の要素を不正と判定する", () => {
    const element = {
      type: "element",
      tagName: "circle",
      attributes: {},
    };

    expect(LineElement.isLineElement(element)).toBe(false);
  });

  test("異なるtypeの要素を不正と判定する", () => {
    const element = {
      type: "text",
      tagName: "line",
      attributes: {},
    };

    expect(LineElement.isLineElement(element)).toBe(false);
  });
});
