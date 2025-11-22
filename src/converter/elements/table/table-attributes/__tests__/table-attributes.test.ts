import { test, expect } from "vitest";
import type { TableAttributes } from "../table-attributes";

test("GlobalAttributesを継承してclassとid属性が使用できる", () => {
  const attrs: TableAttributes = {
    class: "my-table",
    id: "table-1",
  };
  expect(attrs.class).toBe("my-table");
  expect(attrs.id).toBe("table-1");
});

test("border属性が正しく設定できる", () => {
  const attrs: TableAttributes = {
    border: "1",
  };
  expect(attrs.border).toBe("1");
});

test("全ての属性がオプショナルで空オブジェクトが作成できる", () => {
  const attrs: TableAttributes = {};
  expect(attrs).toBeDefined();
});
