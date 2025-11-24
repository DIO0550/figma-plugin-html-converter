import { test, expect } from "vitest";
import { TfootElement } from "../tfoot-element";

test("TfootElement.mapToFigma() - 正常なTfootElementオブジェクトをマッピングするとFigmaNodeConfigが返される", () => {
  const node = {
    type: "element",
    tagName: "tfoot",
    attributes: {},
    children: [],
  };

  const config = TfootElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tfoot");
});

test("TfootElement.mapToFigma() - 属性を持つTfootElementをマッピングすると正しく変換される", () => {
  const node = {
    type: "element",
    tagName: "tfoot",
    attributes: {
      id: "table-footer",
      className: "footer-section",
    },
    children: [],
  };

  const config = TfootElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tfoot#table-footer");
});

test("TfootElement.mapToFigma() - TfootElement.create()で作成した要素をマッピングできる", () => {
  const node = TfootElement.create({ className: "total-footer" });
  const config = TfootElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tfoot");
});

test("TfootElement.mapToFigma() - nullを渡すとnullが返される", () => {
  const config = TfootElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - undefinedを渡すとnullが返される", () => {
  const config = TfootElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - 文字列を渡すとnullが返される", () => {
  const config = TfootElement.mapToFigma("tfoot");

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - 数値を渡すとnullが返される", () => {
  const config = TfootElement.mapToFigma(123);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - 配列を渡すとnullが返される", () => {
  const config = TfootElement.mapToFigma([]);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - type属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    tagName: "tfoot",
    attributes: {},
    children: [],
  };

  const config = TfootElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - tagName属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    attributes: {},
    children: [],
  };

  const config = TfootElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - typeがelementでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "text",
    tagName: "tfoot",
    attributes: {},
    children: [],
  };

  const config = TfootElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - tagNameがtfootでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  const config = TfootElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TfootElement.mapToFigma() - 空のオブジェクトを渡すとnullが返される", () => {
  const config = TfootElement.mapToFigma({});

  expect(config).toBeNull();
});
