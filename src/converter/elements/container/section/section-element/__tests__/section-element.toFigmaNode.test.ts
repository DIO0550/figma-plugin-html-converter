import { test, expect } from "vitest";
import { SectionElement } from "../section-element";

test("[SectionElement.toFigmaNode] 基本的なsection要素をFigmaノードに変換できる", () => {
  const element = SectionElement.create({
    id: "test-section",
    class: "container",
  });

  const figmaNode = SectionElement.toFigmaNode(element);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("section#test-section.container");
  expect(figmaNode.layoutMode).toBe("VERTICAL");
  expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
});

test("[SectionElement.toFigmaNode] classのみを持つsection要素を変換できる", () => {
  const element = SectionElement.create({
    class: "main-content sidebar",
  });

  const figmaNode = SectionElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("section.main-content.sidebar");
});

test("[SectionElement.toFigmaNode] 属性なしのsection要素を変換できる", () => {
  const element = SectionElement.create();

  const figmaNode = SectionElement.toFigmaNode(element);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("section");
  expect(figmaNode.layoutMode).toBe("VERTICAL");
});

test("[SectionElement.toFigmaNode] style属性を含むsection要素を変換できる", () => {
  const element = SectionElement.create({
    style: "width: 100%; padding: 20px; background-color: #f0f0f0;",
  });

  const figmaNode = SectionElement.toFigmaNode(element);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.fills).toBeDefined();
  expect(figmaNode.paddingTop).toBe(20);
  expect(figmaNode.paddingRight).toBe(20);
  expect(figmaNode.paddingBottom).toBe(20);
  expect(figmaNode.paddingLeft).toBe(20);
});

test("[SectionElement.toFigmaNode] Flexboxスタイルを含むsection要素を変換できる", () => {
  const element = SectionElement.create({
    style:
      "display: flex; flex-direction: row; gap: 10px; align-items: center; justify-content: space-between;",
  });

  const figmaNode = SectionElement.toFigmaNode(element);

  expect(figmaNode.layoutMode).toBe("HORIZONTAL");
  expect(figmaNode.itemSpacing).toBe(10);
  expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  expect(figmaNode.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
});

test("[SectionElement.toFigmaNode] ボーダーとborder-radiusを含むsection要素を変換できる", () => {
  const element = SectionElement.create({
    style: "border: 2px solid #333; border-radius: 8px;",
  });

  const figmaNode = SectionElement.toFigmaNode(element);

  expect(figmaNode.strokes).toBeDefined();
  expect(figmaNode.strokeWeight).toBe(2);
  expect(figmaNode.cornerRadius).toBe(8);
});

test("[SectionElement.toFigmaNode] サイズ指定を含むsection要素を変換できる", () => {
  const element = SectionElement.create({
    style: "width: 300px; height: 200px;",
  });

  const figmaNode = SectionElement.toFigmaNode(element);

  expect(figmaNode.width).toBe(300);
  expect(figmaNode.height).toBe(200);
});
