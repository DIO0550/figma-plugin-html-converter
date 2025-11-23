import { test, expect } from "vitest";
import { TheadElement } from "../thead-element";
import type { TheadAttributes } from "../../thead-attributes";

test("TheadElement.create() - デフォルト属性で基本的なthead要素を作成する", () => {
  const element = TheadElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("thead");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("TheadElement.create() - 指定された属性でthead要素を作成する", () => {
  const attributes: TheadAttributes = {
    id: "table-header",
    className: "header-section",
    style: "background-color: #f0f0f0;",
  };

  const element = TheadElement.create(attributes);

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("thead");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("TheadElement.create() - id属性のみでthead要素を作成する", () => {
  const element = TheadElement.create({ id: "main-header" });

  expect(element.attributes?.id).toBe("main-header");
  expect(element.attributes?.className).toBeUndefined();
});

test("TheadElement.create() - className属性のみでthead要素を作成する", () => {
  const element = TheadElement.create({ className: "sticky-header" });

  expect(element.attributes?.className).toBe("sticky-header");
  expect(element.attributes?.id).toBeUndefined();
});

test("TheadElement.create() - style属性でthead要素を作成する", () => {
  const element = TheadElement.create({
    style: "font-weight: bold; border-bottom: 2px solid black;",
  });

  expect(element.attributes?.style).toBe(
    "font-weight: bold; border-bottom: 2px solid black;",
  );
});
