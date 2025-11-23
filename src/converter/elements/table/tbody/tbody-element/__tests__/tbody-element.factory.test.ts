import { test, expect } from "vitest";
import { TbodyElement } from "../tbody-element";
import type { TbodyAttributes } from "../../tbody-attributes";

test("TbodyElement.create() - デフォルト属性で基本的なtbody要素を作成する", () => {
  const element = TbodyElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tbody");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("TbodyElement.create() - 指定された属性でtbody要素を作成する", () => {
  const attributes: TbodyAttributes = {
    id: "table-body",
    className: "body-section",
    style: "background-color: #ffffff;",
  };

  const element = TbodyElement.create(attributes);

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tbody");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("TbodyElement.create() - id属性のみでtbody要素を作成する", () => {
  const element = TbodyElement.create({ id: "data-body" });

  expect(element.attributes?.id).toBe("data-body");
  expect(element.attributes?.className).toBeUndefined();
});

test("TbodyElement.create() - className属性のみでtbody要素を作成する", () => {
  const element = TbodyElement.create({ className: "striped-body" });

  expect(element.attributes?.className).toBe("striped-body");
  expect(element.attributes?.id).toBeUndefined();
});

test("TbodyElement.create() - style属性でtbody要素を作成する", () => {
  const element = TbodyElement.create({
    style: "font-size: 14px; color: #333;",
  });

  expect(element.attributes?.style).toBe("font-size: 14px; color: #333;");
});
