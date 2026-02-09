import { test, expect } from "vitest";
import { DetailsElement } from "../details-element";

test("DetailsElement.mapToFigma - DetailsElement - 正しくマッピングする", () => {
  const element = DetailsElement.create();
  const node = DetailsElement.mapToFigma(element);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("details");
});

test("DetailsElement.mapToFigma - HTMLノード形式 - マッピングできる", () => {
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

test("DetailsElement.mapToFigma - open属性付きノード - opacity=1でマッピング", () => {
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

test("DetailsElement.mapToFigma - 異なるタグ名のノード - nullを返す", () => {
  const divNode = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const node = DetailsElement.mapToFigma(divNode);

  expect(node).toBeNull();
});

test("DetailsElement.mapToFigma - null - nullを返す", () => {
  const node = DetailsElement.mapToFigma(null);

  expect(node).toBeNull();
});

test("DetailsElement.mapToFigma - undefined - nullを返す", () => {
  const node = DetailsElement.mapToFigma(undefined);

  expect(node).toBeNull();
});

test("DetailsElement.mapToFigma - summaryタグ - nullを返す", () => {
  const summaryNode = {
    type: "element",
    tagName: "summary",
    attributes: {},
    children: [],
  };

  const node = DetailsElement.mapToFigma(summaryNode);

  expect(node).toBeNull();
});
