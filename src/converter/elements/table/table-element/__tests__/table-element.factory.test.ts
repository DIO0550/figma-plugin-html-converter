import { test, expect } from "vitest";
import { TableElement } from "../table-element";

test("デフォルト値でtable要素が作成できる", () => {
  const table = TableElement.create();
  expect(table.type).toBe("element");
  expect(table.tagName).toBe("table");
  expect(table.children).toEqual([]);
});

test("border属性を指定してtable要素が作成できる", () => {
  const table = TableElement.create({ border: "1" });
  expect(table.attributes).toEqual({ border: "1" });
});

test("複数の属性を指定してtable要素が作成できる", () => {
  const table = TableElement.create({
    border: "1",
    class: "my-table",
    id: "table-1",
  });
  expect(table.attributes?.border).toBe("1");
  expect(table.attributes?.class).toBe("my-table");
  expect(table.attributes?.id).toBe("table-1");
});
