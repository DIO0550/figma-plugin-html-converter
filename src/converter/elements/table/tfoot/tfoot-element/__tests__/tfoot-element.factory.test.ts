import { test, expect } from "vitest";
import { TfootElement } from "../tfoot-element";
import type { TfootAttributes } from "../../tfoot-attributes";

test("TfootElement.create() - デフォルト属性で基本的なtfoot要素を作成する", () => {
  const element = TfootElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tfoot");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("TfootElement.create() - 指定された属性でtfoot要素を作成する", () => {
  const attributes: TfootAttributes = {
    id: "table-footer",
    className: "footer-section",
    style: "background-color: #f0f0f0;",
  };

  const element = TfootElement.create(attributes);

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tfoot");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("TfootElement.create() - id属性のみでtfoot要素を作成する", () => {
  const element = TfootElement.create({ id: "summary-footer" });

  expect(element.attributes?.id).toBe("summary-footer");
  expect(element.attributes?.className).toBeUndefined();
});

test("TfootElement.create() - className属性のみでtfoot要素を作成する", () => {
  const element = TfootElement.create({ className: "total-footer" });

  expect(element.attributes?.className).toBe("total-footer");
  expect(element.attributes?.id).toBeUndefined();
});

test("TfootElement.create() - style属性でtfoot要素を作成する", () => {
  const element = TfootElement.create({
    style: "font-weight: bold; border-top: 2px solid #000;",
  });

  expect(element.attributes?.style).toBe(
    "font-weight: bold; border-top: 2px solid #000;",
  );
});
