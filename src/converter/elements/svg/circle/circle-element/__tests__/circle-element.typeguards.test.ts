import { describe, test, expect } from "vitest";
import { CircleElement } from "../circle-element";

describe("CircleElement.isCircleElement", () => {
  test("正常なCircleElementを判定する", () => {
    const element = CircleElement.create({ cx: 50, cy: 50, r: 25 });

    expect(CircleElement.isCircleElement(element)).toBe(true);
  });

  test("nullを不正と判定する", () => {
    expect(CircleElement.isCircleElement(null)).toBe(false);
  });

  test("undefinedを不正と判定する", () => {
    expect(CircleElement.isCircleElement(undefined)).toBe(false);
  });

  test("異なるタグ名の要素を不正と判定する", () => {
    const element = {
      type: "element",
      tagName: "rect",
      attributes: {},
    };

    expect(CircleElement.isCircleElement(element)).toBe(false);
  });

  test("異なるtypeの要素を不正と判定する", () => {
    const element = {
      type: "text",
      tagName: "circle",
      attributes: {},
    };

    expect(CircleElement.isCircleElement(element)).toBe(false);
  });

  test("プレーンオブジェクトを不正と判定する", () => {
    const element = {
      cx: 50,
      cy: 50,
      r: 25,
    };

    expect(CircleElement.isCircleElement(element)).toBe(false);
  });
});
