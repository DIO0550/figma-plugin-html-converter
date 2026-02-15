import { test, expect } from "vitest";
import { TrElement } from "../tr-element";

test("TrElement.mapToFigma - 正常なtr要素ノード - tr名の設定を返す", () => {
  const node = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  const config = TrElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tr");
});

test("TrElement.mapToFigma - 属性付きtr要素ノード - tr名の設定を返す", () => {
  const node = {
    type: "element",
    tagName: "tr",
    attributes: {
      width: "100%",
      height: "50px",
      className: "table-row",
    },
    children: [],
  };

  const config = TrElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tr");
});

test("TrElement.mapToFigma - TrElement.create生成要素 - tr名の設定を返す", () => {
  const node = TrElement.create({ width: "100%" });
  const config = TrElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tr");
});

test("TrElement.mapToFigma - null入力 - nullを返す", () => {
  const config = TrElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - undefined入力 - nullを返す", () => {
  const config = TrElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - 文字列入力 - nullを返す", () => {
  const config = TrElement.mapToFigma("tr");

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - 数値入力 - nullを返す", () => {
  const config = TrElement.mapToFigma(123);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - 配列入力 - nullを返す", () => {
  const config = TrElement.mapToFigma([]);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - type属性なしオブジェクト - nullを返す", () => {
  const node = {
    tagName: "tr",
    attributes: {},
    children: [],
  };

  const config = TrElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - tagName属性なしオブジェクト - nullを返す", () => {
  const node = {
    type: "element",
    attributes: {},
    children: [],
  };

  const config = TrElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - typeがelement以外 - nullを返す", () => {
  const node = {
    type: "text",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  const config = TrElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - tagNameがtr以外 - nullを返す", () => {
  const node = {
    type: "element",
    tagName: "td",
    attributes: {},
    children: [],
  };

  const config = TrElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TrElement.mapToFigma - 空オブジェクト入力 - nullを返す", () => {
  const config = TrElement.mapToFigma({});

  expect(config).toBeNull();
});
