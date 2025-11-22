import { test, expect } from "vitest";
import { TableElement } from "../table-element";
import { TrElement } from "../tr";

test("2x2テーブルが正しく変換される", () => {
  // 2行のテーブル作成
  const tr1 = TrElement.create();
  const tr2 = TrElement.create();
  const table: typeof TableElement.prototype = {
    type: "element",
    tagName: "table",
    attributes: {},
    children: [tr1, tr2],
  };

  // Figma変換
  const config = TableElement.toFigmaNode(table);

  // 検証：基本構造
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");

  // 検証：Auto Layout設定
  expect(config.layoutMode).toBe("VERTICAL");
  expect(config.primaryAxisAlignItems).toBe("MIN");
  expect(config.counterAxisAlignItems).toBe("MIN");
  expect(config.itemSpacing).toBe(0);
});

test("3x3テーブルが正しく変換される", () => {
  // 3行のテーブル作成
  const tr1 = TrElement.create();
  const tr2 = TrElement.create();
  const tr3 = TrElement.create();
  const table: typeof TableElement.prototype = {
    type: "element",
    tagName: "table",
    attributes: {},
    children: [tr1, tr2, tr3],
  };

  // Figma変換
  const config = TableElement.toFigmaNode(table);

  // 検証：基本構造
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");

  // 検証：Auto Layout設定
  expect(config.layoutMode).toBe("VERTICAL");
  expect(config.primaryAxisAlignItems).toBe("MIN");
  expect(config.counterAxisAlignItems).toBe("MIN");
  expect(config.itemSpacing).toBe(0);
});
