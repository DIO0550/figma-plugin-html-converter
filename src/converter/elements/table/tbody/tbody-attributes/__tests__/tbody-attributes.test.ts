import { test, expect } from "vitest";
import type { TbodyAttributes } from "../tbody-attributes";

test("TbodyAttributes - GlobalAttributesを継承する", () => {
  const attrs: TbodyAttributes = {
    id: "table-body",
    className: "body-section",
    style: "background-color: #ffffff;",
  };

  expect(attrs.id).toBe("table-body");
  expect(attrs.className).toBe("body-section");
  expect(attrs.style).toBe("background-color: #ffffff;");
});

test("TbodyAttributes - すべてオプショナル", () => {
  const attrs: TbodyAttributes = {};

  expect(attrs.id).toBeUndefined();
  expect(attrs.className).toBeUndefined();
  expect(attrs.style).toBeUndefined();
});

test("TbodyAttributes - id属性を持つ", () => {
  const attrs: TbodyAttributes = {
    id: "data-body",
  };

  expect(attrs.id).toBe("data-body");
});

test("TbodyAttributes - className属性を持つ", () => {
  const attrs: TbodyAttributes = {
    className: "striped-body",
  };

  expect(attrs.className).toBe("striped-body");
});

test("TbodyAttributes - style属性を持つ", () => {
  const attrs: TbodyAttributes = {
    style: "font-size: 14px;",
  };

  expect(attrs.style).toBe("font-size: 14px;");
});
