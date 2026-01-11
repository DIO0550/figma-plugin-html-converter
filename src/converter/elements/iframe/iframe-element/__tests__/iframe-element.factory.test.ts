import { test, expect } from "vitest";
import { IframeElement } from "../iframe-element";

test("create: 空の属性でIframeElementを作成できる", () => {
  const element = IframeElement.create();
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("iframe");
  expect(element.attributes).toEqual({});
});

test("create: src属性を持つIframeElementを作成できる", () => {
  const element = IframeElement.create({
    src: "https://example.com",
  });
  expect(element.attributes.src).toBe("https://example.com");
});

test("create: サイズ属性を持つIframeElementを作成できる", () => {
  const element = IframeElement.create({
    width: "640",
    height: "360",
  });
  expect(element.attributes.width).toBe("640");
  expect(element.attributes.height).toBe("360");
});

test("create: title属性を持つIframeElementを作成できる", () => {
  const element = IframeElement.create({
    title: "Embedded Content",
  });
  expect(element.attributes.title).toBe("Embedded Content");
});

test("create: sandbox属性を持つIframeElementを作成できる", () => {
  const element = IframeElement.create({
    sandbox: "allow-scripts allow-same-origin",
  });
  expect(element.attributes.sandbox).toBe("allow-scripts allow-same-origin");
});

test("create: loading属性を持つIframeElementを作成できる", () => {
  const element = IframeElement.create({
    loading: "lazy",
  });
  expect(element.attributes.loading).toBe("lazy");
});

test("create: 複数の属性を組み合わせてIframeElementを作成できる", () => {
  const element = IframeElement.create({
    src: "https://example.com/embed",
    width: "800",
    height: "600",
    title: "Embedded Video",
    sandbox: "allow-scripts",
    loading: "lazy",
  });
  expect(element.attributes.src).toBe("https://example.com/embed");
  expect(element.attributes.width).toBe("800");
  expect(element.attributes.height).toBe("600");
  expect(element.attributes.title).toBe("Embedded Video");
  expect(element.attributes.sandbox).toBe("allow-scripts");
  expect(element.attributes.loading).toBe("lazy");
});
