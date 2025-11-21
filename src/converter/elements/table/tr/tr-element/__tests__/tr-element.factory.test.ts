import { test, expect } from "vitest";
import { TrElement } from "../tr-element";
import type { TrAttributes } from "../../tr-attributes";

test("TrElement.create() - デフォルト属性で基本的なtr要素を作成する", () => {
  const element = TrElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tr");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("TrElement.create() - 指定された属性でtr要素を作成する", () => {
  const attributes: TrAttributes = {
    id: "row-1",
    className: "table-row",
    width: "100%",
    height: "50px",
  };

  const element = TrElement.create(attributes);

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tr");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("TrElement.create() - width属性のみでtr要素を作成する", () => {
  const element = TrElement.create({ width: "100%" });

  expect(element.attributes?.width).toBe("100%");
  expect(element.attributes?.height).toBeUndefined();
});

test("TrElement.create() - height属性のみでtr要素を作成する", () => {
  const element = TrElement.create({ height: "50px" });

  expect(element.attributes?.height).toBe("50px");
  expect(element.attributes?.width).toBeUndefined();
});

test("TrElement.create() - style属性でtr要素を作成する", () => {
  const element = TrElement.create({
    style: "border: 1px solid black; padding: 10px;",
  });

  expect(element.attributes?.style).toBe(
    "border: 1px solid black; padding: 10px;",
  );
});
