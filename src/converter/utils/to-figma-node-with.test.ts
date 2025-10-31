import { expect, vi, test } from "vitest";
import { toFigmaNodeWith } from "./to-figma-node-with";
import type { FigmaNodeConfig } from "../models/figma-node";
import type { BaseElement } from "../elements/base/base-element";
import { Styles } from "../models/styles";

// テスト用の要素型
interface TestElement extends BaseElement<"test", Record<string, unknown>> {
  tagName: "test";
  children?: TestElement[];
}

test("toFigmaNodeWith: createBaseConfigが呼ばれて基本設定が返されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {},
    children: [],
  };

  const createBaseConfig = vi.fn(
    (): FigmaNodeConfig => ({
      type: "FRAME",
      name: "test",
    }),
  );

  const result = toFigmaNodeWith(element, createBaseConfig);

  expect(createBaseConfig).toHaveBeenCalledWith(element);
  expect(result).toEqual({
    type: "FRAME",
    name: "test",
  });
});

test("toFigmaNodeWith: スタイルがない場合は早期リターンすること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {},
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const customStyleApplier = vi.fn();

  const result = toFigmaNodeWith(element, createBaseConfig, {
    customStyleApplier,
  });

  // スタイルがない場合、customStyleApplierは呼ばれない
  expect(customStyleApplier).not.toHaveBeenCalled();
  expect(result).toEqual({
    type: "FRAME",
    name: "test",
  });
});

test("toFigmaNodeWith: 共通スタイルが適用されること（applyCommonStyles=true）", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "background-color: rgb(255, 0, 0); padding: 10px;",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
  });

  // 背景色が適用されていること
  expect(result.fills).toBeDefined();
  expect(result.fills).toHaveLength(1);
  expect(result.fills?.[0]).toMatchObject({
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
  });

  // パディングが適用されていること
  expect(result.paddingTop).toBe(10);
  expect(result.paddingBottom).toBe(10);
  expect(result.paddingLeft).toBe(10);
  expect(result.paddingRight).toBe(10);
});

test("toFigmaNodeWith: 共通スタイルが適用されないこと（applyCommonStyles=false）", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "background-color: rgb(255, 0, 0); padding: 10px;",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: false,
  });

  // 背景色もパディングも適用されていないこと
  expect(result.fills).toBeUndefined();
  expect(result.paddingTop).toBeUndefined();
});

test("toFigmaNodeWith: カスタムスタイルが適用されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "display: flex;",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const customStyleApplier = (
    config: FigmaNodeConfig,
    _element: TestElement,
    _styles: Styles,
  ): FigmaNodeConfig => ({
    ...config,
    layoutMode: "HORIZONTAL",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
    customStyleApplier,
  });

  // カスタムスタイルが適用されていること
  expect(result.layoutMode).toBe("HORIZONTAL");
});

test("toFigmaNodeWith: 子要素が変換されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {},
    children: [
      {
        type: "element",
        tagName: "test",
        attributes: {},
        children: [],
      },
    ],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const childrenConverter = (_element: TestElement): FigmaNodeConfig[] => [
    {
      type: "TEXT",
      name: "child",
    },
  ];

  const result = toFigmaNodeWith(element, createBaseConfig, {
    childrenConverter,
  });

  // 子要素が追加されていること
  expect(result.children).toBeDefined();
  expect(result.children).toHaveLength(1);
  expect(result.children?.[0]).toMatchObject({
    type: "TEXT",
    name: "child",
  });
});

test("toFigmaNodeWith: すべての機能を組み合わせて使用できること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "background-color: rgb(0, 255, 0); padding: 20px;",
    },
    children: [
      {
        type: "element",
        tagName: "test",
        attributes: {},
        children: [],
      },
    ],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "parent",
  });

  const customStyleApplier = (config: FigmaNodeConfig): FigmaNodeConfig => ({
    ...config,
    layoutMode: "VERTICAL",
  });

  const childrenConverter = (): FigmaNodeConfig[] => [
    {
      type: "TEXT",
      name: "child1",
    },
    {
      type: "TEXT",
      name: "child2",
    },
  ];

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
    customStyleApplier,
    childrenConverter,
  });

  // 基本設定
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("parent");

  // 共通スタイル
  expect(result.fills).toBeDefined();
  expect(result.fills?.[0]).toMatchObject({
    type: "SOLID",
    color: { r: 0, g: 1, b: 0 },
  });
  expect(result.paddingTop).toBe(20);

  // カスタムスタイル
  expect(result.layoutMode).toBe("VERTICAL");

  // 子要素
  expect(result.children).toHaveLength(2);
  expect(result.children?.[0].name).toBe("child1");
  expect(result.children?.[1].name).toBe("child2");
});

test("toFigmaNodeWith: オプションが未指定でも動作すること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "background-color: rgb(0, 0, 255);",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  // オプションなしで呼び出し
  const result = toFigmaNodeWith(element, createBaseConfig);

  // デフォルトで共通スタイルが適用される
  expect(result.fills).toBeDefined();
  expect(result.fills?.[0]).toMatchObject({
    type: "SOLID",
    color: { r: 0, g: 0, b: 1 },
  });
});

test("toFigmaNodeWith: 空の子要素配列でエラーにならないこと", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {},
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const childrenConverter = (): FigmaNodeConfig[] => [];

  const result = toFigmaNodeWith(element, createBaseConfig, {
    childrenConverter,
  });

  expect(result.children).toEqual([]);
});

test("toFigmaNodeWith: customStyleApplierがundefinedでもエラーにならないこと", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "background-color: rgb(128, 128, 128);",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  expect(() => {
    toFigmaNodeWith(element, createBaseConfig, {
      customStyleApplier: undefined,
    });
  }).not.toThrow();
});

test("toFigmaNodeWith: childrenConverterがundefinedでもエラーにならないこと", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {},
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  expect(() => {
    toFigmaNodeWith(element, createBaseConfig, {
      childrenConverter: undefined,
    });
  }).not.toThrow();
});

test("toFigmaNodeWith: min-width/max-width がpx値の場合に正しく適用されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "min-width: 100px; max-width: 500px;",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
  });

  expect(result.minWidth).toBe(100);
  expect(result.maxWidth).toBe(500);
});

test("toFigmaNodeWith: min-width/max-width が単位付き値（rem）の場合は無視されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "min-width: 10rem; max-width: 50rem;",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
  });

  expect(result.minWidth).toBeUndefined();
  expect(result.maxWidth).toBeUndefined();
});

test("toFigmaNodeWith: min-height/max-height がpx値の場合に正しく適用されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "min-height: 200px; max-height: 800px;",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
  });

  expect(result.minHeight).toBe(200);
  expect(result.maxHeight).toBe(800);
});

test("toFigmaNodeWith: min-height/max-height がパーセント値の場合は無視されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "min-height: 10%; max-height: 90%;",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
  });

  expect(result.minHeight).toBeUndefined();
  expect(result.maxHeight).toBeUndefined();
});

test("toFigmaNodeWith: min/max サイズがcalc()の場合は無視されること", () => {
  const element: TestElement = {
    type: "element",
    tagName: "test",
    attributes: {
      style: "min-width: calc(100% - 20px); max-height: calc(100vh - 50px);",
    },
    children: [],
  };

  const createBaseConfig = (): FigmaNodeConfig => ({
    type: "FRAME",
    name: "test",
  });

  const result = toFigmaNodeWith(element, createBaseConfig, {
    applyCommonStyles: true,
  });

  expect(result.minWidth).toBeUndefined();
  expect(result.maxHeight).toBeUndefined();
});
