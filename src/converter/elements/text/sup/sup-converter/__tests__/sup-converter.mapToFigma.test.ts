import { test, expect } from "vitest";
import { SupConverter } from "../sup-converter";
import { SupElement } from "../../sup-element";
import type { TextNodeConfig } from "../../../../../models/figma-node";

test("SupConverter.mapToFigma() - 有効なsupノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "sup",
    attributes: {},
  };
  const config = SupConverter.mapToFigma(node) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.style.fontSize).toBe(12); // 75%縮小
});

test("SupConverter.mapToFigma() - 属性を持つsupノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "sup",
    attributes: {
      id: "exponent",
      class: "math",
    },
  };
  const config = SupConverter.mapToFigma(node);
  expect(config).not.toBeNull();
  expect(config?.type).toBe("TEXT");
});

test("SupConverter.mapToFigma() - 子要素を持つsupノードを変換する", () => {
  const node = {
    type: "element",
    tagName: "sup",
    attributes: {},
    children: [{ type: "text", textContent: "2" }],
  };
  const config = SupConverter.mapToFigma(node) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.content).toBe("2");
});

test("SupConverter.mapToFigma() - 無効なノードタイプでnullを返す", () => {
  const node = {
    type: "text",
    content: "not an element",
  };
  const config = SupConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - 異なるtagNameでnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
  };
  const config = SupConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - subタグでnullを返す", () => {
  const node = {
    type: "element",
    tagName: "sub",
    attributes: {},
  };
  const config = SupConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - null入力でnullを返す", () => {
  const config = SupConverter.mapToFigma(null);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - undefined入力でnullを返す", () => {
  const config = SupConverter.mapToFigma(undefined);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - 非オブジェクト入力でnullを返す", () => {
  const config = SupConverter.mapToFigma("string");
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - 数値入力でnullを返す", () => {
  const config = SupConverter.mapToFigma(123);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - typeプロパティがないノードを処理する", () => {
  const node = {
    tagName: "sup",
    attributes: {},
  };
  const config = SupConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - tagNameプロパティがないノードを処理する", () => {
  const node = {
    type: "element",
    attributes: {},
  };
  const config = SupConverter.mapToFigma(node);
  expect(config).toBeNull();
});

test("SupConverter.mapToFigma() - SupElementインスタンスを変換する", () => {
  const element = SupElement.create({
    id: "footnote-1",
  });
  const config = SupConverter.mapToFigma(element) as TextNodeConfig;
  expect(config).not.toBeNull();
  expect(config.type).toBe("TEXT");
  expect(config.style.fontSize).toBe(12);
});
