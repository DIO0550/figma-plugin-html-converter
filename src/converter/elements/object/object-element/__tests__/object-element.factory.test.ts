/**
 * object要素のファクトリテスト
 */

import { test, expect } from "vitest";
import { ObjectElement } from "../object-element";

test("create: 空の属性でObjectElementを作成できる", () => {
  const element = ObjectElement.create();
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("object");
  expect(element.attributes).toEqual({});
});

test("create: data属性を持つObjectElementを作成できる", () => {
  const element = ObjectElement.create({
    data: "https://example.com/content.swf",
  });
  expect(element.attributes.data).toBe("https://example.com/content.swf");
});

test("create: サイズ属性を持つObjectElementを作成できる", () => {
  const element = ObjectElement.create({
    width: "640",
    height: "360",
  });
  expect(element.attributes.width).toBe("640");
  expect(element.attributes.height).toBe("360");
});

test("create: type属性を持つObjectElementを作成できる", () => {
  const element = ObjectElement.create({
    type: "application/x-shockwave-flash",
  });
  expect(element.attributes.type).toBe("application/x-shockwave-flash");
});

test("create: name属性を持つObjectElementを作成できる", () => {
  const element = ObjectElement.create({
    name: "myObject",
  });
  expect(element.attributes.name).toBe("myObject");
});

test("create: 複数の属性を組み合わせてObjectElementを作成できる", () => {
  const element = ObjectElement.create({
    data: "https://example.com/document.pdf",
    width: "800",
    height: "600",
    type: "application/pdf",
    name: "pdfViewer",
  });
  expect(element.attributes.data).toBe("https://example.com/document.pdf");
  expect(element.attributes.width).toBe("800");
  expect(element.attributes.height).toBe("600");
  expect(element.attributes.type).toBe("application/pdf");
  expect(element.attributes.name).toBe("pdfViewer");
});
