import { test, expect } from "vitest";
import { TableElement } from "../table-element";

test("有効なtable要素がFigmaNodeConfigに変換される", () => {
  const validNode = {
    type: "element",
    tagName: "table",
    attributes: {},
    children: [],
  };
  const result = TableElement.mapToFigma(validNode);
  expect(result).not.toBeNull();
  expect(result?.type).toBe("FRAME");
});

test("無効なノードに対してnullを返す", () => {
  const invalid = { tagName: "div" };
  const result = TableElement.mapToFigma(invalid);
  expect(result).toBeNull();
});

test("nullに対してnullを返す", () => {
  const result = TableElement.mapToFigma(null);
  expect(result).toBeNull();
});
