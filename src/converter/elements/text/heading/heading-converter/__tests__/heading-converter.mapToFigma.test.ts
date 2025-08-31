import { test, expect } from "vitest";
import { mapToFigma } from "../heading-converter";

test("mapToFigma - h1要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [{ type: "text", content: "Title" }],
  };

  const result = mapToFigma(node);

  expect(result).not.toBeNull();
  expect(result!.name).toBe("h1");
  expect(result!.type).toBe("FRAME");
});

test("mapToFigma - h2要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).not.toBeNull();
  expect(result!.name).toBe("h2");
});

test("mapToFigma - h3要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "h3",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).not.toBeNull();
  expect(result!.name).toBe("h3");
});

test("mapToFigma - h4要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "h4",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).not.toBeNull();
  expect(result!.name).toBe("h4");
});

test("mapToFigma - h5要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "h5",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).not.toBeNull();
  expect(result!.name).toBe("h5");
});

test("mapToFigma - h6要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "h6",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).not.toBeNull();
  expect(result!.name).toBe("h6");
});

test("mapToFigma - 見出し要素以外はnullを返す", () => {
  const divNode = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(mapToFigma(divNode)).toBeNull();
});

test("mapToFigma - typeがelement以外の場合はnullを返す", () => {
  const textNode = {
    type: "text",
    content: "Hello",
  };

  expect(mapToFigma(textNode)).toBeNull();
});

test("mapToFigma - nullの場合はnullを返す", () => {
  expect(mapToFigma(null)).toBeNull();
});

test("mapToFigma - undefinedの場合はnullを返す", () => {
  expect(mapToFigma(undefined)).toBeNull();
});
