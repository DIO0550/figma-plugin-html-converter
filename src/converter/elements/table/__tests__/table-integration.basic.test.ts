import { test, expect } from "vitest";
import { TableElement } from "../table-element";
import { TrElement } from "../tr";

test("空のtable要素が作成されてFigmaに変換される", () => {
  // 空のテーブル作成
  const table = TableElement.create();

  // Figma変換
  const config = TableElement.toFigmaNode(table);

  // 検証
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");
  expect(config.layoutMode).toBe("VERTICAL");
  expect(config.children?.length ?? 0).toBe(0);
});

test("1x1テーブル（1行1セル）が正しく作成される", () => {
  // 1行のテーブル作成
  const tr = TrElement.create();
  const table: typeof TableElement.prototype = {
    type: "element",
    tagName: "table",
    attributes: {},
    children: [tr],
  };

  // Figma変換
  const config = TableElement.toFigmaNode(table);

  // 検証
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");
  expect(config.layoutMode).toBe("VERTICAL");
  expect(config.primaryAxisAlignItems).toBe("MIN");
  expect(config.counterAxisAlignItems).toBe("MIN");
  expect(config.itemSpacing).toBe(0);
});
