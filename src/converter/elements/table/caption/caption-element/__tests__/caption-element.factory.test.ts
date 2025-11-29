import { test, expect } from "vitest";
import { CaptionElement } from "../caption-element";
import type { CaptionAttributes } from "../../caption-attributes";

test("CaptionElement.create() - デフォルト属性で基本的なcaption要素を作成する", () => {
  const element = CaptionElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("caption");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("CaptionElement.create() - 指定された属性でcaption要素を作成する", () => {
  const attributes: CaptionAttributes = {
    id: "table-caption",
    className: "caption-section",
    style: "text-align: center;",
  };

  const element = CaptionElement.create(attributes);

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("caption");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("CaptionElement.create() - id属性のみでcaption要素を作成する", () => {
  const element = CaptionElement.create({ id: "main-caption" });

  expect(element.attributes?.id).toBe("main-caption");
  expect(element.attributes?.className).toBeUndefined();
});

test("CaptionElement.create() - className属性のみでcaption要素を作成する", () => {
  const element = CaptionElement.create({ className: "bold-caption" });

  expect(element.attributes?.className).toBe("bold-caption");
  expect(element.attributes?.id).toBeUndefined();
});

test("CaptionElement.create() - style属性でcaption要素を作成する", () => {
  const element = CaptionElement.create({
    style: "font-weight: bold; text-align: center;",
  });

  expect(element.attributes?.style).toBe(
    "font-weight: bold; text-align: center;",
  );
});
