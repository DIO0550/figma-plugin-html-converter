import { test, expect } from "vitest";
import { AsideElement } from "../aside-element";
import type { AsideElement as AsideElementType } from "../aside-element";

test("AsideElement.toFigmaNode: 基本的なaside要素をFigmaノードに変換できること", () => {
  const element: AsideElementType = {
    type: "element",
    tagName: "aside",
    attributes: {},
  };

  const result = AsideElement.toFigmaNode(element);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("aside");
  expect(result.layoutMode).toBe("VERTICAL");
  expect(result.layoutSizingVertical).toBe("HUG");
  expect(result.layoutSizingHorizontal).toBe("FIXED");
});

test("AsideElement.toFigmaNode: ID属性がある場合は名前に含めること", () => {
  const element = AsideElement.create({ id: "sidebar" });
  const result = AsideElement.toFigmaNode(element);

  expect(result.name).toBe("aside#sidebar");
});

test("AsideElement.toFigmaNode: className属性がある場合は名前に含めること", () => {
  const element = AsideElement.create({ className: "sidebar navigation" });
  const result = AsideElement.toFigmaNode(element);

  expect(result.name).toBe("aside.sidebar.navigation");
});

test("AsideElement.toFigmaNode: IDとclassName両方がある場合は両方を名前に含めること", () => {
  const element = AsideElement.create({
    id: "sidebar",
    className: "navigation",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.name).toBe("aside#sidebar.navigation");
});

test("AsideElement.toFigmaNode: role属性がある場合は名前に含めること", () => {
  const element = AsideElement.create({ role: "complementary" });
  const result = AsideElement.toFigmaNode(element);

  expect(result.name).toBe("aside[role=complementary]");
});

test("AsideElement.toFigmaNode: aria-label属性がある場合は名前に含めること", () => {
  const element = AsideElement.create({ "aria-label": "サイドバー" });
  const result = AsideElement.toFigmaNode(element);

  expect(result.name).toBe("aside[aria-label=サイドバー]");
});

test("AsideElement.toFigmaNode: Flexboxスタイルを適用できること", () => {
  const element = AsideElement.create({
    style:
      "display: flex; flex-direction: row; justify-content: center; align-items: flex-end;",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.layoutMode).toBe("HORIZONTAL");
  expect(result.primaryAxisAlignItems).toBe("CENTER");
  expect(result.counterAxisAlignItems).toBe("MAX");
});

test("AsideElement.toFigmaNode: パディングスタイルを適用できること", () => {
  const element = AsideElement.create({
    style: "padding: 20px;",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.paddingTop).toBe(20);
  expect(result.paddingRight).toBe(20);
  expect(result.paddingBottom).toBe(20);
  expect(result.paddingLeft).toBe(20);
});

test("AsideElement.toFigmaNode: 個別パディングスタイルを適用できること", () => {
  const element = AsideElement.create({
    style:
      "padding-top: 10px; padding-right: 20px; padding-bottom: 30px; padding-left: 40px;",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.paddingTop).toBe(10);
  expect(result.paddingRight).toBe(20);
  expect(result.paddingBottom).toBe(30);
  expect(result.paddingLeft).toBe(40);
});

test("AsideElement.toFigmaNode: ギャップスタイルを適用できること", () => {
  const element = AsideElement.create({
    style: "gap: 16px;",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.itemSpacing).toBe(16);
});

test("AsideElement.toFigmaNode: 背景色スタイルを適用できること", () => {
  const element = AsideElement.create({
    style: "background-color: #ff0000;",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 1, g: 0, b: 0 },
      opacity: undefined,
      visible: true,
    },
  ]);
});

test("AsideElement.toFigmaNode: サイズスタイルを適用できること", () => {
  const element = AsideElement.create({
    style: "width: 300px; height: 500px;",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.width).toBe(300);
  expect(result.height).toBe(500);
  expect(result.layoutSizingHorizontal).toBe("FIXED");
  expect(result.layoutSizingVertical).toBe("FIXED");
});

test("AsideElement.toFigmaNode: 最小・最大サイズスタイルを適用できること", () => {
  const element = AsideElement.create({
    style:
      "min-width: 200px; max-width: 400px; min-height: 100px; max-height: 600px;",
  });
  const result = AsideElement.toFigmaNode(element);

  expect(result.minWidth).toBe(200);
  expect(result.maxWidth).toBe(400);
  expect(result.minHeight).toBe(100);
  expect(result.maxHeight).toBe(600);
});
