import { test, expect } from "vitest";
import { TableElement } from "../table-element";

test("border属性を持つtableが正しく変換される", () => {
  // style属性でborderを指定したテーブル作成
  const table = TableElement.create({
    style: "border: 1px solid black;",
  });

  // Figma変換
  const config = TableElement.toFigmaNode(table);

  // 検証：基本構造
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");

  // 検証：ボーダーが適用されている
  expect(config.strokes).toBeDefined();
  expect(config.strokes!.length).toBeGreaterThan(0);
});

test("background-colorを持つtableが正しく変換される", () => {
  // 背景色を指定したテーブル作成
  const table = TableElement.create({
    style: "background-color: #f0f0f0;",
  });

  // Figma変換
  const config = TableElement.toFigmaNode(table);

  // 検証：基本構造
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");

  // 検証：背景色が適用されている
  expect(config.fills).toBeDefined();
  expect(config.fills!.length).toBeGreaterThan(0);
});

test("paddingを持つtableが正しく変換される", () => {
  // パディングを指定したテーブル作成
  const table = TableElement.create({
    style: "padding: 10px;",
  });

  // Figma変換
  const config = TableElement.toFigmaNode(table);

  // 検証：基本構造
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("table");

  // 検証：パディングが適用されている
  expect(config.paddingLeft).toBe(10);
  expect(config.paddingRight).toBe(10);
  expect(config.paddingTop).toBe(10);
  expect(config.paddingBottom).toBe(10);
});
