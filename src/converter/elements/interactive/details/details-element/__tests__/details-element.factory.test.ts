import { test, expect } from "vitest";
import { DetailsElement } from "../details-element";

test("DetailsElement.create - 空の属性 - details要素を作成できる", () => {
  const element = DetailsElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("details");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("DetailsElement.create - id属性指定 - details要素を作成できる", () => {
  const element = DetailsElement.create({ id: "details-1" });

  expect(element.attributes.id).toBe("details-1");
});

test("DetailsElement.create - open属性true - details要素を作成できる", () => {
  const element = DetailsElement.create({ open: true });

  expect(element.attributes.open).toBe(true);
});

test("DetailsElement.create - open属性false - details要素を作成できる", () => {
  const element = DetailsElement.create({ open: false });

  expect(element.attributes.open).toBe(false);
});

test("DetailsElement.create - open属性空文字列 - details要素を作成できる", () => {
  const element = DetailsElement.create({ open: "" });

  expect(element.attributes.open).toBe("");
});

test("DetailsElement.create - 複数の属性指定 - details要素を作成できる", () => {
  const element = DetailsElement.create({
    id: "my-details",
    class: "collapsible",
    open: true,
    style: "border: 1px solid #ccc;",
  });

  expect(element.attributes.id).toBe("my-details");
  expect(element.attributes.class).toBe("collapsible");
  expect(element.attributes.open).toBe(true);
  expect(element.attributes.style).toBe("border: 1px solid #ccc;");
});
