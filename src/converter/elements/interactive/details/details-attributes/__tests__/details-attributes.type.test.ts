import { test, expect } from "vitest";
import type { DetailsAttributes } from "../details-attributes";

test("DetailsAttributes - GlobalAttributesを継承している", () => {
  const attrs: DetailsAttributes = {
    id: "test-details",
    class: "details-class",
    style: "border: 1px solid #ccc;",
  };

  expect(attrs.id).toBe("test-details");
  expect(attrs.class).toBe("details-class");
  expect(attrs.style).toBe("border: 1px solid #ccc;");
});

test("DetailsAttributes - open属性true - 持つことができる", () => {
  const attrs: DetailsAttributes = {
    open: true,
  };

  expect(attrs.open).toBe(true);
});

test("DetailsAttributes - open属性false - 持つことができる", () => {
  const attrs: DetailsAttributes = {
    open: false,
  };

  expect(attrs.open).toBe(false);
});

test("DetailsAttributes - open属性空文字列 - HTML属性の存在を表す", () => {
  const attrs: DetailsAttributes = {
    open: "",
  };

  expect(attrs.open).toBe("");
});

test("DetailsAttributes - 空のオブジェクト - 有効", () => {
  const attrs: DetailsAttributes = {};
  expect(attrs).toEqual({});
});
