import { test, expect } from "vitest";
import { SummaryElement } from "../summary";
import { DetailsElement } from "../details";
import { DialogElement } from "../dialog";

test("mapToFigma連携 - HTMLノード形式から各要素を正しくマッピングできる", () => {
  const summaryHtml = {
    type: "element",
    tagName: "summary",
    attributes: { id: "summary-1" },
    children: [],
  };

  const detailsHtml = {
    type: "element",
    tagName: "details",
    attributes: { open: true },
    children: [],
  };

  const dialogHtml = {
    type: "element",
    tagName: "dialog",
    attributes: { open: true },
    children: [],
  };

  const summaryNode = SummaryElement.mapToFigma(summaryHtml);
  const detailsNode = DetailsElement.mapToFigma(detailsHtml);
  const dialogNode = DialogElement.mapToFigma(dialogHtml);

  expect(summaryNode).not.toBeNull();
  expect(detailsNode).not.toBeNull();
  expect(dialogNode).not.toBeNull();

  expect(summaryNode?.name).toBe("summary#summary-1");
  expect(detailsNode?.opacity).toBe(1);
  expect(dialogNode?.opacity).toBe(1);
});

test("mapToFigma連携 - 異なるタグ名の要素はnullを返す", () => {
  const divHtml = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(SummaryElement.mapToFigma(divHtml)).toBeNull();
  expect(DetailsElement.mapToFigma(divHtml)).toBeNull();
  expect(DialogElement.mapToFigma(divHtml)).toBeNull();
});
