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

test("width属性を持つth要素を変換できる", () => {
  const element = ThElement.create({
    width: "100px",
    style: "width: 100px;",
  });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.width).toBe(100);
});

test("height属性を持つth要素を変換できる", () => {
  const element = ThElement.create({
    height: "50px",
    style: "height: 50px;",
  });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.height).toBe(50);
});

test("背景色を持つth要素を変換できる", () => {
  const element = ThElement.create({
    style: "background-color: #f0f0f0;",
  });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.fills).toBeDefined();
  expect(Array.isArray(figmaNode.fills)).toBe(true);
  expect(figmaNode.fills?.length).toBeGreaterThan(0);
});

test("ボーダーを持つth要素を変換できる", () => {
  const element = ThElement.create({
    style: "border: 1px solid #ccc;",
  });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.strokes).toBeDefined();
  expect(figmaNode.strokeWeight).toBeDefined();
});

test("パディングを持つth要素を変換できる", () => {
  const element = ThElement.create({
    style: "padding: 10px;",
  });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.paddingLeft).toBe(10);
  expect(figmaNode.paddingRight).toBe(10);
  expect(figmaNode.paddingTop).toBe(10);
  expect(figmaNode.paddingBottom).toBe(10);
});

test("すべての属性を持つth要素を変換できる", () => {
  const element = ThElement.create({
    scope: "col",
    width: "120px",
    height: "40px",
    abbr: "Full Name",
    colspan: "2",
    rowspan: "1",
    style:
      "background-color: #e0e0e0; border: 1px solid #999; padding: 8px; font-weight: bold; text-align: center;",
    class: "header-cell",
    id: "header-1",
  });
  const figmaNode = ThElement.toFigmaNode(element);

  expect(figmaNode).toBeDefined();
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("th#header-1");
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

test("テーブルヘッダー行のth要素を作成できる", () => {
  const headers = [
    ThElement.create({ scope: "col", abbr: "Name" }),
    ThElement.create({ scope: "col", abbr: "Age" }),
    ThElement.create({ scope: "col", abbr: "Email" }),
  ];

  const figmaNodes = headers.map((header) => ThElement.toFigmaNode(header));

  expect(figmaNodes).toHaveLength(3);
  figmaNodes.forEach((node) => {
    expect(node.type).toBe("FRAME");
    expect(node.name).toBe("th-col");
  });
});

test("行ヘッダーのth要素を作成できる", () => {
  const rowHeader = ThElement.create({
    scope: "row",
    style: "font-weight: bold; background-color: #e0e0e0;",
  });

  const figmaNode = ThElement.toFigmaNode(rowHeader);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("th-row");
});

test("結合セル（colspan）のth要素を作成できる", () => {
  const mergedHeader = ThElement.create({
    scope: "colgroup",
    colspan: "3",
    style: "text-align: center;",
  });

  const figmaNode = ThElement.toFigmaNode(mergedHeader);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("th-colgroup");
});
