import { test, expect } from "vitest";
import { InsConverter } from "../ins-converter";
import { InsElement } from "../../ins-element";
import type { TextNodeConfig } from "../../../../../models/figma-node";

test("InsConverter.mapToFigma() - 有効なinsノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "ins",
    attributes: {},
  };
  const config = InsConverter.mapToFigma(node) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.style.textDecoration).toBe("UNDERLINE");
});

test("InsConverter.mapToFigma() - 属性を持つinsノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "ins",
    attributes: {
      cite: "https://example.com",
      datetime: "2025-11-09",
    },
  };
  const config = InsConverter.mapToFigma(node);
  expect(config).not.toBeNull();
  expect(config?.type).toBe("TEXT");
});

test("InsConverter.mapToFigma() - 子要素を持つinsノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "ins",
    attributes: {},
    children: [{ type: "text", textContent: "inserted" }],
  };
  const config = InsConverter.mapToFigma(node) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.content).toBe("inserted");
});

test("InsConverter.mapToFigma() - 無効なノードタイプでnullを返す", () => {
  const node = {
    type: "text",
    content: "not an element",
  };
  const config = InsConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - 異なるtagNameでnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
  };
  const config = InsConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - delタグでnullを返す", () => {
  const node = {
    type: "element",
    tagName: "del",
    attributes: {},
  };
  const config = InsConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - null入力でnullを返す", () => {
  const config = InsConverter.mapToFigma(null);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - undefined入力でnullを返す", () => {
  const config = InsConverter.mapToFigma(undefined);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - 非オブジェクト入力でnullを返す", () => {
  const config = InsConverter.mapToFigma("string");
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - 数値入力でnullを返す", () => {
  const config = InsConverter.mapToFigma(123);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - typeプロパティがないノードを処理する", () => {
  const node = {
    tagName: "ins",
    attributes: {},
  };
  const config = InsConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - tagNameプロパティがないノードを処理する", () => {
  const node = {
    type: "element",
    attributes: {},
  };
  const config = InsConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("InsConverter.mapToFigma() - InsElementインスタンスを変換する", () => {
  const element = InsElement.create({
    cite: "https://example.com",
  });
  const config = InsConverter.mapToFigma(element) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.style.textDecoration).toBe("UNDERLINE");
});
