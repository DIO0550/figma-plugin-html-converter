import { describe, test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

describe("SummaryElement.isSummaryElement", () => {
  test("SummaryElementオブジェクトを正しく判定する", () => {
    const element = SummaryElement.create();

    expect(SummaryElement.isSummaryElement(element)).toBe(true);
  });

  test("属性付きSummaryElementオブジェクトを正しく判定する", () => {
    const element = SummaryElement.create({
      id: "test-summary",
      class: "summary-class",
    });

    expect(SummaryElement.isSummaryElement(element)).toBe(true);
  });

  test("nullをfalseと判定する", () => {
    expect(SummaryElement.isSummaryElement(null)).toBe(false);
  });

  test("undefinedをfalseと判定する", () => {
    expect(SummaryElement.isSummaryElement(undefined)).toBe(false);
  });

  test("文字列をfalseと判定する", () => {
    expect(SummaryElement.isSummaryElement("summary")).toBe(false);
  });

  test("数値をfalseと判定する", () => {
    expect(SummaryElement.isSummaryElement(123)).toBe(false);
  });

  test("異なるtagNameの要素をfalseと判定する", () => {
    const divElement = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };

    expect(SummaryElement.isSummaryElement(divElement)).toBe(false);
  });

  test("異なるtypeの要素をfalseと判定する", () => {
    const textNode = {
      type: "text",
      tagName: "summary",
      attributes: {},
    };

    expect(SummaryElement.isSummaryElement(textNode)).toBe(false);
  });

  test("typeプロパティがないオブジェクトをfalseと判定する", () => {
    const invalidObject = {
      tagName: "summary",
      attributes: {},
    };

    expect(SummaryElement.isSummaryElement(invalidObject)).toBe(false);
  });

  test("tagNameプロパティがないオブジェクトをfalseと判定する", () => {
    const invalidObject = {
      type: "element",
      attributes: {},
    };

    expect(SummaryElement.isSummaryElement(invalidObject)).toBe(false);
  });
});
