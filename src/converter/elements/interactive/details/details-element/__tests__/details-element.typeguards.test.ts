import { describe, test, expect } from "vitest";
import { DetailsElement } from "../details-element";

describe("DetailsElement.isDetailsElement", () => {
  test("DetailsElementオブジェクトを正しく判定する", () => {
    const element = DetailsElement.create();

    expect(DetailsElement.isDetailsElement(element)).toBe(true);
  });

  test("open属性付きDetailsElementオブジェクトを正しく判定する", () => {
    const element = DetailsElement.create({ open: true });

    expect(DetailsElement.isDetailsElement(element)).toBe(true);
  });

  test("nullをfalseと判定する", () => {
    expect(DetailsElement.isDetailsElement(null)).toBe(false);
  });

  test("undefinedをfalseと判定する", () => {
    expect(DetailsElement.isDetailsElement(undefined)).toBe(false);
  });

  test("文字列をfalseと判定する", () => {
    expect(DetailsElement.isDetailsElement("details")).toBe(false);
  });

  test("数値をfalseと判定する", () => {
    expect(DetailsElement.isDetailsElement(123)).toBe(false);
  });

  test("異なるtagNameの要素をfalseと判定する", () => {
    const divElement = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };

    expect(DetailsElement.isDetailsElement(divElement)).toBe(false);
  });

  test("summaryタグをfalseと判定する", () => {
    const summaryElement = {
      type: "element",
      tagName: "summary",
      attributes: {},
      children: [],
    };

    expect(DetailsElement.isDetailsElement(summaryElement)).toBe(false);
  });

  test("異なるtypeの要素をfalseと判定する", () => {
    const textNode = {
      type: "text",
      tagName: "details",
      attributes: {},
    };

    expect(DetailsElement.isDetailsElement(textNode)).toBe(false);
  });
});
