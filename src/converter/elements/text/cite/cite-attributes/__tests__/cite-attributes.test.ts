import { test, expect } from "vitest";
import type { CiteAttributes } from "../cite-attributes";

test("CiteAttributes - グローバル属性を設定した場合 - 各属性値を正しく保持する", () => {
  const attributes: CiteAttributes = {
    id: "book-title",
    class: "citation",
    style: "font-style: italic",
  };

  expect(attributes.id).toBe("book-title");
  expect(attributes.class).toBe("citation");
  expect(attributes.style).toBe("font-style: italic");
});
