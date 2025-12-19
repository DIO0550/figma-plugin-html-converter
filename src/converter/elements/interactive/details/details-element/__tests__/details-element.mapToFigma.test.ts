import { describe, test, expect } from "vitest";
import { DetailsElement } from "../details-element";

describe("DetailsElement.mapToFigma", () => {
  test("DetailsElementを正しくマッピングする", () => {
    const element = DetailsElement.create();
    const node = DetailsElement.mapToFigma(element);

    expect(node).not.toBeNull();
    expect(node?.type).toBe("FRAME");
    expect(node?.name).toBe("details");
  });

  test("HTMLノード形式からマッピングできる", () => {
    const htmlNode = {
      type: "element",
      tagName: "details",
      attributes: { id: "test-details" },
      children: [],
    };

    const node = DetailsElement.mapToFigma(htmlNode);

    expect(node).not.toBeNull();
    expect(node?.type).toBe("FRAME");
    expect(node?.name).toBe("details#test-details");
  });

  test("open属性付きノードをマッピングできる", () => {
    const htmlNode = {
      type: "element",
      tagName: "details",
      attributes: { open: true },
      children: [],
    };

    const node = DetailsElement.mapToFigma(htmlNode);

    expect(node).not.toBeNull();
    expect(node?.opacity).toBe(1);
  });

  test("異なるタグ名のノードはnullを返す", () => {
    const divNode = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };

    const node = DetailsElement.mapToFigma(divNode);

    expect(node).toBeNull();
  });

  test("nullを渡すとnullを返す", () => {
    const node = DetailsElement.mapToFigma(null);

    expect(node).toBeNull();
  });

  test("undefinedを渡すとnullを返す", () => {
    const node = DetailsElement.mapToFigma(undefined);

    expect(node).toBeNull();
  });

  test("summaryタグはnullを返す", () => {
    const summaryNode = {
      type: "element",
      tagName: "summary",
      attributes: {},
      children: [],
    };

    const node = DetailsElement.mapToFigma(summaryNode);

    expect(node).toBeNull();
  });
});
