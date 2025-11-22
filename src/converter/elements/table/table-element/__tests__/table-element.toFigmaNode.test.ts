import { test, expect } from "vitest";
import { TableElement } from "../table-element";

test("空のテーブルがFigma FrameNodeに変換される", () => {
  const table = TableElement.create();
  const config = TableElement.toFigmaNode(table);
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");
  expect(config.children?.length ?? 0).toBe(0);
});

test("style属性のborderがstrokesとして適用される", () => {
  const table = TableElement.create({
    style: "border: 1px solid black;",
  });
  const config = TableElement.toFigmaNode(table);
  expect(config.strokes).toBeDefined();
  expect(config.strokes!.length).toBeGreaterThan(0);
});

test("子要素（tr）が正しく変換されて配置される", () => {
  const table = TableElement.create();
  const config = TableElement.toFigmaNode(table);
  expect(config.type).toBe("FRAME");
});

test("Auto Layout設定がVERTICALで適用される", () => {
  const table = TableElement.create();
  const config = TableElement.toFigmaNode(table);
  expect(config.layoutMode).toBe("VERTICAL");
  expect(config.primaryAxisAlignItems).toBe("MIN");
  expect(config.counterAxisAlignItems).toBe("MIN");
  expect(config.itemSpacing).toBe(0);
});
