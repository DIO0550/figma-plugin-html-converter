import { test, expect } from "vitest";
import type { TrAttributes } from "../tr-attributes";

test("TrAttributes - width属性を持つ", () => {
  const attrs: TrAttributes = {
    width: "100px",
  };

  expect(attrs.width).toBe("100px");
});

test("TrAttributes - height属性を持つ", () => {
  const attrs: TrAttributes = {
    height: "50px",
  };

  expect(attrs.height).toBe("50px");
});

test("TrAttributes - GlobalAttributesを継承する", () => {
  const attrs: TrAttributes = {
    id: "row-1",
    className: "table-row",
    style: "background-color: white;",
  };

  expect(attrs.id).toBe("row-1");
  expect(attrs.className).toBe("table-row");
  expect(attrs.style).toBe("background-color: white;");
});

test("TrAttributes - width/height両方を持つ", () => {
  const attrs: TrAttributes = {
    width: "100%",
    height: "50px",
  };

  expect(attrs.width).toBe("100%");
  expect(attrs.height).toBe("50px");
});

test("TrAttributes - すべてオプショナル", () => {
  const attrs: TrAttributes = {};

  expect(attrs.width).toBeUndefined();
  expect(attrs.height).toBeUndefined();
});
