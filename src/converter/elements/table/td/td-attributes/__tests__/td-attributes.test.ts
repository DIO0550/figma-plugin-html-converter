import { test, expect } from "vitest";
import type { TdAttributes } from "../td-attributes";

test("TdAttributes - GlobalAttributes properties を受け入れる", () => {
  const attributes: TdAttributes = {
    id: "test-id",
    className: "test-class",
    style: "color: red;",
  };

  expect(attributes.id).toBe("test-id");
  expect(attributes.className).toBe("test-class");
  expect(attributes.style).toBe("color: red;");
});

test("TdAttributes - width 属性のみを受け入れる", () => {
  const attributes: TdAttributes = {
    width: "100px",
  };

  expect(attributes.width).toBe("100px");
});

test("TdAttributes - height 属性のみを受け入れる", () => {
  const attributes: TdAttributes = {
    height: "50px",
  };

  expect(attributes.height).toBe("50px");
});

test("TdAttributes - width と height の両方を受け入れる", () => {
  const attributes: TdAttributes = {
    width: "200px",
    height: "100px",
  };

  expect(attributes.width).toBe("200px");
  expect(attributes.height).toBe("100px");
});

test("TdAttributes - 全ての属性を同時に受け入れる", () => {
  const attributes: TdAttributes = {
    id: "cell-1",
    className: "table-cell",
    style: "border: 1px solid black; padding: 10px;",
    width: "150px",
    height: "75px",
  };

  expect(attributes.id).toBe("cell-1");
  expect(attributes.className).toBe("table-cell");
  expect(attributes.style).toBe("border: 1px solid black; padding: 10px;");
  expect(attributes.width).toBe("150px");
  expect(attributes.height).toBe("75px");
});

test("TdAttributes - 空の属性オブジェクトを許可する", () => {
  const attributes: TdAttributes = {};

  expect(Object.keys(attributes).length).toBe(0);
});
