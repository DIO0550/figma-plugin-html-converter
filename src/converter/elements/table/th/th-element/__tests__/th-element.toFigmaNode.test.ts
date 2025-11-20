import { test, expect } from "vitest";
import { ThElement } from "../th-element";

test("ThElement.toFigmaNode() - 基本的なth要素をFigmaNodeConfigに変換する", () => {
  const element = ThElement.create();

  const config = ThElement.toFigmaNode(element);

  expect(config).toBeDefined();
  expect(config.name).toBe("th");
  expect(config.type).toBe("FRAME");
});

test("ThElement.toFigmaNode() - scope属性がある場合、ノード名に反映する (col)", () => {
  const element = ThElement.create({ scope: "col" });

  const config = ThElement.toFigmaNode(element);

  expect(config.name).toBe("th-col");
});

test("ThElement.toFigmaNode() - scope属性がある場合、ノード名に反映する (row)", () => {
  const element = ThElement.create({ scope: "row" });

  const config = ThElement.toFigmaNode(element);

  expect(config.name).toBe("th-row");
});

test("ThElement.toFigmaNode() - scope属性がある場合、ノード名に反映する (colgroup)", () => {
  const element = ThElement.create({ scope: "colgroup" });

  const config = ThElement.toFigmaNode(element);

  expect(config.name).toBe("th-colgroup");
});

test("ThElement.toFigmaNode() - scope属性がある場合、ノード名に反映する (rowgroup)", () => {
  const element = ThElement.create({ scope: "rowgroup" });

  const config = ThElement.toFigmaNode(element);

  expect(config.name).toBe("th-rowgroup");
});

test("ThElement.toFigmaNode() - スタイルから背景色を適用する", () => {
  const element = ThElement.create({
    style: "background-color: rgb(255, 0, 0);",
  });

  const config = ThElement.toFigmaNode(element);

  expect(config.fills).toBeDefined();
  expect(config.fills).toHaveLength(1);
  expect(config.fills![0].type).toBe("SOLID");
});

test("ThElement.toFigmaNode() - スタイルからpaddingを適用する", () => {
  const element = ThElement.create({
    style: "padding: 10px;",
  });

  const config = ThElement.toFigmaNode(element);

  expect(config.paddingTop).toBe(10);
  expect(config.paddingRight).toBe(10);
  expect(config.paddingBottom).toBe(10);
  expect(config.paddingLeft).toBe(10);
});

test("ThElement.toFigmaNode() - スタイルからborderを適用する", () => {
  const element = ThElement.create({
    style: "border: 1px solid black;",
  });

  const config = ThElement.toFigmaNode(element);

  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(1);
});

test("ThElement.toFigmaNode() - スタイルからwidthとheightを適用する", () => {
  const element = ThElement.create({
    style: "width: 100px; height: 50px;",
  });

  const config = ThElement.toFigmaNode(element);

  expect(config.width).toBe(100);
  expect(config.height).toBe(50);
});

test("ThElement.toFigmaNode() - 複雑なスタイルを持つth要素を処理する", () => {
  const element = ThElement.create({
    style:
      "background-color: #f0f0f0; border: 2px solid #333; padding: 15px; width: 200px; height: 100px;",
  });

  const config = ThElement.toFigmaNode(element);

  expect(config.fills).toBeDefined();
  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(2);
  expect(config.paddingTop).toBe(15);
  expect(config.width).toBe(200);
  expect(config.height).toBe(100);
});

test("ThElement.toFigmaNode() - scope属性と複雑なスタイルを組み合わせる", () => {
  const element = ThElement.create({
    scope: "col",
    style: "background-color: #e0e0e0; padding: 12px;",
  });

  const config = ThElement.toFigmaNode(element);

  expect(config.name).toBe("th-col");
  expect(config.fills).toBeDefined();
  expect(config.paddingTop).toBe(12);
});

test("ThElement.toFigmaNode() - スタイルなしのth要素を処理する", () => {
  const element = ThElement.create();

  const config = ThElement.toFigmaNode(element);

  expect(config.name).toBe("th");
  expect(config.type).toBe("FRAME");
  expect(config.children).toBeUndefined();
});
