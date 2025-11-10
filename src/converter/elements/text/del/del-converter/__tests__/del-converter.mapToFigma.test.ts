import { test, expect } from "vitest";
import { DelConverter } from "../del-converter";
import { DelElement } from "../../del-element";
import type { TextNodeConfig } from "../../../../../models/figma-node";

test("DelConverter.mapToFigma() - 有効なdelノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "del",
    attributes: {},
  };
  const config = DelConverter.mapToFigma(node) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.style.textDecoration).toBe("STRIKETHROUGH");
});

test("DelConverter.mapToFigma() - 属性を持つdelノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "del",
    attributes: {
      cite: "https://example.com",
      datetime: "2025-11-09",
    },
  };
  const config = DelConverter.mapToFigma(node);
  expect(config).not.toBeNull();
  expect(config?.type).toBe("TEXT");
});

test("DelConverter.mapToFigma() - 子要素を持つdelノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "del",
    attributes: {},
    children: [{ type: "text", textContent: "deleted" }],
  };
  const config = DelConverter.mapToFigma(node) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.content).toBe("deleted");
});

test("DelConverter.mapToFigma() - 無効なノードタイプでnullを返す", () => {
  const node = {
    type: "text",
    content: "not an element",
  };
  const config = DelConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - 異なるtagNameでnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
  };
  const config = DelConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - insタグでnullを返す", () => {
  const node = {
    type: "element",
    tagName: "ins",
    attributes: {},
  };
  const config = DelConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - null入力でnullを返す", () => {
  const config = DelConverter.mapToFigma(null);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - undefined入力でnullを返す", () => {
  const config = DelConverter.mapToFigma(undefined);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - 非オブジェクト入力でnullを返す", () => {
  const config = DelConverter.mapToFigma("string");
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - 数値入力でnullを返す", () => {
  const config = DelConverter.mapToFigma(123);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - typeプロパティがないノードを処理する", () => {
  const node = {
    tagName: "del",
    attributes: {},
  };
  const config = DelConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - tagNameプロパティがないノードを処理する", () => {
  const node = {
    type: "element",
    attributes: {},
  };
  const config = DelConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("DelConverter.mapToFigma() - DelElementインスタンスを変換する", () => {
  const element = DelElement.create({
    cite: "https://example.com",
  });
  const config = DelConverter.mapToFigma(element) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.style.textDecoration).toBe("STRIKETHROUGH");
});
