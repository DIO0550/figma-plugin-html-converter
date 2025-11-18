import { test, expect } from "vitest";
import { ThElement } from "../th-element";

// 基本的な変換テスト
test("基本的なFrameノードを作成できる", () => {
  const element = ThElement.create();
  const node = ThElement.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("th");
});

// scope属性によるノード名のテスト
test("scope='col'の場合、ノード名はth-colになる", () => {
  const element = ThElement.create({ scope: "col" });
  const node = ThElement.toFigmaNode(element);

  expect(node.name).toBe("th-col");
});

test("scope='row'の場合、ノード名はth-rowになる", () => {
  const element = ThElement.create({ scope: "row" });
  const node = ThElement.toFigmaNode(element);

  expect(node.name).toBe("th-row");
});

test("scope='colgroup'の場合、ノード名はth-colgroupになる", () => {
  const element = ThElement.create({ scope: "colgroup" });
  const node = ThElement.toFigmaNode(element);

  expect(node.name).toBe("th-colgroup");
});

test("scope='rowgroup'の場合、ノード名はth-rowgroupになる", () => {
  const element = ThElement.create({ scope: "rowgroup" });
  const node = ThElement.toFigmaNode(element);

  expect(node.name).toBe("th-rowgroup");
});

// ID属性が優先されるテスト
test("ID属性がある場合、ノード名に反映される", () => {
  const element = ThElement.create({
    scope: "col",
    id: "header-1",
  });
  const node = ThElement.toFigmaNode(element);

  expect(node.name).toBe("th#header-1");
});

test("class属性の最初のクラス名がノード名に反映される", () => {
  const element = ThElement.create({
    scope: "col",
    class: "header-cell main",
  });
  const node = ThElement.toFigmaNode(element);

  expect(node.name).toBe("th.header-cell");
});

// test.eachを使用したノード名のパラメータ化テスト
test.each([
  [{}, "th"],
  [{ scope: "col" }, "th-col"],
  [{ scope: "row" }, "th-row"],
  [{ id: "header" }, "th#header"],
  [{ class: "cell" }, "th.cell"],
  [{ scope: "col", id: "h1" }, "th#h1"],
  [{ scope: "col", class: "cell" }, "th.cell"],
  [{ scope: "col", id: "h1", class: "cell" }, "th#h1"],
])("属性%pの場合、ノード名は%sになる", (attributes, expectedName) => {
  const element = ThElement.create(attributes);
  const node = ThElement.toFigmaNode(element);

  expect(node.name).toBe(expectedName);
});
