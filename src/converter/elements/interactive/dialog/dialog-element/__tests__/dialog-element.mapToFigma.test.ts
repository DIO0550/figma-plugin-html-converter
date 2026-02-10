import { test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

test("DialogElement.mapToFigma - DialogElement - 正しくマッピングする", () => {
  const element = DialogElement.create();
  const node = DialogElement.mapToFigma(element);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("dialog");
});

test("DialogElement.mapToFigma - HTMLノード形式 - マッピングできる", () => {
  const htmlNode = {
    type: "element",
    tagName: "dialog",
    attributes: { id: "confirm-modal" },
    children: [],
  };

  const node = DialogElement.mapToFigma(htmlNode);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("dialog#confirm-modal");
});

test("DialogElement.mapToFigma - open属性付きノード（表示状態） - opacity=1でマッピング", () => {
  const htmlNode = {
    type: "element",
    tagName: "dialog",
    attributes: { open: true },
    children: [],
  };

  const node = DialogElement.mapToFigma(htmlNode);

  expect(node).not.toBeNull();
  expect(node?.opacity).toBe(1);
});

test("DialogElement.mapToFigma - open属性なしノード（非表示状態） - opacity=0でマッピング", () => {
  const htmlNode = {
    type: "element",
    tagName: "dialog",
    attributes: {},
    children: [],
  };

  const node = DialogElement.mapToFigma(htmlNode);

  expect(node).not.toBeNull();
  expect(node?.opacity).toBe(0);
});

test("DialogElement.mapToFigma - 異なるタグ名のノード - nullを返す", () => {
  const divNode = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const node = DialogElement.mapToFigma(divNode);

  expect(node).toBeNull();
});

test("DialogElement.mapToFigma - null - nullを返す", () => {
  const node = DialogElement.mapToFigma(null);

  expect(node).toBeNull();
});

test("DialogElement.mapToFigma - undefined - nullを返す", () => {
  const node = DialogElement.mapToFigma(undefined);

  expect(node).toBeNull();
});

test("DialogElement.mapToFigma - detailsタグ - nullを返す", () => {
  const detailsNode = {
    type: "element",
    tagName: "details",
    attributes: {},
    children: [],
  };

  const node = DialogElement.mapToFigma(detailsNode);

  expect(node).toBeNull();
});
