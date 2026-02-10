import { test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

test("SummaryElement.mapToFigma - SummaryElement - 正しくマッピングする", () => {
  const element = SummaryElement.create();
  const node = SummaryElement.mapToFigma(element);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("summary");
});

test("SummaryElement.mapToFigma - HTMLノード形式 - マッピングできる", () => {
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

test("SummaryElement.mapToFigma - 異なるタグ名のノード - nullを返す", () => {
  const divNode = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const node = SummaryElement.mapToFigma(divNode);

  expect(node).toBeNull();
});

test("SummaryElement.mapToFigma - null - nullを返す", () => {
  const node = SummaryElement.mapToFigma(null);

  expect(node).toBeNull();
});

test("SummaryElement.mapToFigma - undefined - nullを返す", () => {
  const node = SummaryElement.mapToFigma(undefined);

  expect(node).toBeNull();
});

test("SummaryElement.mapToFigma - テキストノード - nullを返す", () => {
  const textNode = {
    type: "text",
    textContent: "Some text",
  };

  const node = SummaryElement.mapToFigma(textNode);

  expect(node).toBeNull();
});

test("SummaryElement.mapToFigma - 属性付きノード - 正しくマッピングする", () => {
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
