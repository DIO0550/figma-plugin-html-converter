import { test, expect } from "vitest";
import { TbodyElement } from "../tbody-element";

test("TbodyElement.mapToFigma() - 正常なTbodyElementオブジェクトをマッピングするとFigmaNodeConfigが返される", () => {
  const node = {
    type: "element",
    tagName: "tbody",
    attributes: {},
    children: [],
  };

  const config = TbodyElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tbody");
});

test("TbodyElement.mapToFigma() - 属性を持つTbodyElementをマッピングすると正しく変換される", () => {
  const node = {
    type: "element",
    tagName: "tbody",
    attributes: {
      id: "table-body",
      className: "body-section",
    },
    children: [],
  };

  const config = TbodyElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tbody#table-body");
});

test("TbodyElement.mapToFigma() - TbodyElement.create()で作成した要素をマッピングできる", () => {
  const node = TbodyElement.create({ className: "striped-body" });
  const config = TbodyElement.mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("tbody");
});

test("TbodyElement.mapToFigma() - nullを渡すとnullが返される", () => {
  const config = TbodyElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - undefinedを渡すとnullが返される", () => {
  const config = TbodyElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - 文字列を渡すとnullが返される", () => {
  const config = TbodyElement.mapToFigma("tbody");

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - 数値を渡すとnullが返される", () => {
  const config = TbodyElement.mapToFigma(123);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - 配列を渡すとnullが返される", () => {
  const config = TbodyElement.mapToFigma([]);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - type属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    tagName: "tbody",
    attributes: {},
    children: [],
  };

  const config = TbodyElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - tagName属性がないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    attributes: {},
    children: [],
  };

  const config = TbodyElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - typeがelementでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "text",
    tagName: "tbody",
    attributes: {},
    children: [],
  };

  const config = TbodyElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - tagNameがtbodyでないオブジェクトを渡すとnullが返される", () => {
  const node = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  const config = TbodyElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("TbodyElement.mapToFigma() - 空のオブジェクトを渡すとnullが返される", () => {
  const config = TbodyElement.mapToFigma({});

  expect(config).toBeNull();
});
