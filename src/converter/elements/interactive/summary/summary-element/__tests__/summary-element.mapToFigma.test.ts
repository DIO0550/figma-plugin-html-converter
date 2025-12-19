import { describe, test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

describe("SummaryElement.mapToFigma", () => {
  test("SummaryElementを正しくマッピングする", () => {
    const element = SummaryElement.create();
    const node = SummaryElement.mapToFigma(element);

    expect(node).not.toBeNull();
    expect(node?.type).toBe("FRAME");
    expect(node?.name).toBe("summary");
  });

  test("HTMLノード形式からマッピングできる", () => {
    const htmlNode = {
      type: "element",
      tagName: "summary",
      attributes: { id: "test-summary" },
      children: [],
    };

    const node = SummaryElement.mapToFigma(htmlNode);

    expect(node).not.toBeNull();
    expect(node?.type).toBe("FRAME");
    expect(node?.name).toBe("summary#test-summary");
  });

  test("異なるタグ名のノードはnullを返す", () => {
    const divNode = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };

    const node = SummaryElement.mapToFigma(divNode);

    expect(node).toBeNull();
  });

  test("nullを渡すとnullを返す", () => {
    const node = SummaryElement.mapToFigma(null);

    expect(node).toBeNull();
  });

  test("undefinedを渡すとnullを返す", () => {
    const node = SummaryElement.mapToFigma(undefined);

    expect(node).toBeNull();
  });

  test("テキストノードはnullを返す", () => {
    const textNode = {
      type: "text",
      textContent: "Some text",
    };

    const node = SummaryElement.mapToFigma(textNode);

    expect(node).toBeNull();
  });

  test("属性付きのノードを正しくマッピングする", () => {
    const htmlNode = {
      type: "element",
      tagName: "summary",
      attributes: {
        class: "summary-class",
        style: "font-weight: bold;",
      },
      children: [],
    };

    const node = SummaryElement.mapToFigma(htmlNode);

    expect(node).not.toBeNull();
    expect(node?.name).toBe("summary.summary-class");
  });
});
