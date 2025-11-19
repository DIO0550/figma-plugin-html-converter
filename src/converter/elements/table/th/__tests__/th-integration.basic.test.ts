import { test, expect } from "vitest";
import { ThElement } from "../th-element";

test("最小限のth要素をFigmaノードに変換できる", () => {
  const element = ThElement.create();
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("th");
});

test("scope='col'のth要素を変換できる", () => {
  const element = ThElement.create({ scope: "col" });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("th-col");
});

test("scope='row'のth要素を変換できる", () => {
  const element = ThElement.create({ scope: "row" });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("th-row");
});

test("scope='colgroup'のth要素を変換できる", () => {
  const element = ThElement.create({ scope: "colgroup" });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("th-colgroup");
});

test("scope='rowgroup'のth要素を変換できる", () => {
  const element = ThElement.create({ scope: "rowgroup" });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("th-rowgroup");
});

test("id属性なしでscope属性のみを持つth要素を変換できる", () => {
  const element = ThElement.create({
    scope: "col",
    width: "120px",
    height: "40px",
    style: "background-color: #e0e0e0;",
  });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("th-col");
});

test("正しいThElementを変換できる", () => {
  const element = ThElement.create({ scope: "col" });
  const figmaNode = ThElement.mapToFigma(element);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode?.type).toBe("FRAME");
  expect(figmaNode?.name).toBe("th-col");
});

test("不正なノードに対してnullを返す", () => {
  const invalidNode = { type: "text", content: "Hello" };
  const result = ThElement.mapToFigma(invalidNode);

  expect(result).toBeNull();
});

test("nullに対してnullを返す", () => {
  const result = ThElement.mapToFigma(null);

  expect(result).toBeNull();
});

test("undefinedに対してnullを返す", () => {
  const result = ThElement.mapToFigma(undefined);

  expect(result).toBeNull();
});

test("文字列に対してnullを返す", () => {
  const result = ThElement.mapToFigma("th");

  expect(result).toBeNull();
});
