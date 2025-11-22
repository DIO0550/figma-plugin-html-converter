import { test, expect } from "vitest";
import { TheadElement } from "../thead-element";

test("TheadElement.mapToFigma() - 正常なTheadElementオブジェクトをマッピングするとFigmaNodeConfigが返される", () => {
  const node = {
    type: "element",
    tagName: "thead",
    attributes: {},
    children: [],
  };

  const config = TheadElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("thead");
});

test("TheadElement.mapToFigma() - 属性を持つTheadElementをマッピングすると正しく変換される", () => {
  const node = {
    type: "element",
    tagName: "thead",
    attributes: {
      id: "table-header",
      className: "header-section",
    },
    children: [],
  };

  const config = TheadElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("thead#table-header");
});

test("TheadElement.mapToFigma() - TheadElement.create()で作成した要素をマッピングできる", () => {
  const node = TheadElement.create({ className: "sticky-header" });
  const config = TheadElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("thead");
});

test("TheadElement.mapToFigma() - nullを渡すとnullが返される", () => {
  const config = TheadElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - undefinedを渡すとnullが返される", () => {
  const config = TheadElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - 文字列を渡すとnullが返される", () => {
  const config = TheadElement.mapToFigma("thead");

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - 数値を渡すとnullが返される", () => {
  const config = TheadElement.mapToFigma(123);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - 配列を渡すとnullが返される", () => {
  const config = TheadElement.mapToFigma([]);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - type属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    tagName: "thead",
    attributes: {},
    children: [],
  };

  const config = TheadElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - tagName属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    attributes: {},
    children: [],
  };

  const config = TheadElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - typeがelementでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "text",
    tagName: "thead",
    attributes: {},
    children: [],
  };

  const config = TheadElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - tagNameがtheadでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  const config = TheadElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TheadElement.mapToFigma() - 空のオブジェクトを渡すとnullが返される", () => {
  const config = TheadElement.mapToFigma({});

  expect(config).toBeNull();
});
