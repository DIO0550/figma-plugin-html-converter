import { test, expect } from "vitest";
import { ColgroupElement } from "../colgroup-element";

// colgroup要素はメタデータのみでFigmaノードを生成しない（nullを返す）

test("ColgroupElement.mapToFigma() - 正常なColgroupElementオブジェクトをマッピングするとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {},
    children: [],
  };

  const config = ColgroupElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - 属性を持つColgroupElementをマッピングするとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {
      span: 3,
      id: "colgroup-1",
    },
    children: [],
  };

  const config = ColgroupElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - ColgroupElement.create()で作成した要素をマッピングするとnullが返される", () => {
  const node = ColgroupElement.create({ span: 2 });
  const config = ColgroupElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - 子要素を持つColgroupElementをマッピングするとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {},
    children: [
      {
        type: "element",
        tagName: "col",
        attributes: { span: 2 },
        children: [],
      },
    ],
  };

  const config = ColgroupElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - nullを渡すとnullが返される", () => {
  const config = ColgroupElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - undefinedを渡すとnullが返される", () => {
  const config = ColgroupElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - 文字列を渡すとnullが返される", () => {
  const config = ColgroupElement.mapToFigma("colgroup");

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - 数値を渡すとnullが返される", () => {
  const config = ColgroupElement.mapToFigma(123);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - 配列を渡すとnullが返される", () => {
  const config = ColgroupElement.mapToFigma([]);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - type属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    tagName: "colgroup",
    attributes: {},
    children: [],
  };

  const config = ColgroupElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - tagNameがcolgroupでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "col",
    attributes: {},
    children: [],
  };

  const config = ColgroupElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColgroupElement.mapToFigma() - 空のオブジェクトを渡すとnullが返される", () => {
  const config = ColgroupElement.mapToFigma({});

  expect(config).toBeNull();
});
