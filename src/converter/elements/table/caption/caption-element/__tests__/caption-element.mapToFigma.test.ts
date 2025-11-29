import { test, expect } from "vitest";
import { CaptionElement } from "../caption-element";

test("CaptionElement.mapToFigma() - 正常なCaptionElementオブジェクトをマッピングするとFigmaNodeConfigが返される", () => {
  const node = {
    type: "element",
    tagName: "caption",
    attributes: {},
    children: [],
  };

  const config = CaptionElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("caption");
});

test("CaptionElement.mapToFigma() - 属性を持つCaptionElementをマッピングすると正しく変換される", () => {
  const node = {
    type: "element",
    tagName: "caption",
    attributes: {
      id: "table-caption",
      className: "caption-section",
    },
    children: [],
  };

  const config = CaptionElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("caption#table-caption");
});

test("CaptionElement.mapToFigma() - CaptionElement.create()で作成した要素をマッピングできる", () => {
  const node = CaptionElement.create({ className: "bold-caption" });
  const config = CaptionElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("caption");
});

test("CaptionElement.mapToFigma() - nullを渡すとnullが返される", () => {
  const config = CaptionElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - undefinedを渡すとnullが返される", () => {
  const config = CaptionElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - 文字列を渡すとnullが返される", () => {
  const config = CaptionElement.mapToFigma("caption");

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - 数値を渡すとnullが返される", () => {
  const config = CaptionElement.mapToFigma(123);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - 配列を渡すとnullが返される", () => {
  const config = CaptionElement.mapToFigma([]);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - type属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    tagName: "caption",
    attributes: {},
    children: [],
  };

  const config = CaptionElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - tagName属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    attributes: {},
    children: [],
  };

  const config = CaptionElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - typeがelementでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "text",
    tagName: "caption",
    attributes: {},
    children: [],
  };

  const config = CaptionElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - tagNameがcaptionでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  const config = CaptionElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("CaptionElement.mapToFigma() - 空のオブジェクトを渡すとnullが返される", () => {
  const config = CaptionElement.mapToFigma({});

  expect(config).toBeNull();
});
