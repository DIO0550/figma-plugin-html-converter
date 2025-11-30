import { test, expect } from "vitest";
import { ColElement } from "../col-element";

// col要素はメタデータのみでFigmaノードを生成しない（nullを返す）

test("ColElement.mapToFigma() - 正常なColElementオブジェクトをマッピングするとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "col",
    attributes: {},
    children: [],
  };

  const config = ColElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - 属性を持つColElementをマッピングするとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "col",
    attributes: {
      span: 2,
      width: "100px",
    },
    children: [],
  };

  const config = ColElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - ColElement.create()で作成した要素をマッピングするとnullが返される", () => {
  const node = ColElement.create({ span: 3 });
  const config = ColElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - nullを渡すとnullが返される", () => {
  const config = ColElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - undefinedを渡すとnullが返される", () => {
  const config = ColElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - 文字列を渡すとnullが返される", () => {
  const config = ColElement.mapToFigma("col");

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - 数値を渡すとnullが返される", () => {
  const config = ColElement.mapToFigma(123);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - 配列を渡すとnullが返される", () => {
  const config = ColElement.mapToFigma([]);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - type属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    tagName: "col",
    attributes: {},
    children: [],
  };

  const config = ColElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - tagNameがcolでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {},
    children: [],
  };

  const config = ColElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("ColElement.mapToFigma() - 空のオブジェクトを渡すとnullが返される", () => {
  const config = ColElement.mapToFigma({});

  expect(config).toBeNull();
});
