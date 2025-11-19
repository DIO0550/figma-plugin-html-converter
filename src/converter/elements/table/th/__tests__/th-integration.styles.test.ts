import { test, expect } from "vitest";
import { ThElement } from "../th-element";

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
