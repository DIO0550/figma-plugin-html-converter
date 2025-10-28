import { describe, it, expect, vi } from "vitest";
import { toFigmaNodeWith } from "./to-figma-node-with";
import type { FigmaNodeConfig } from "../models/figma-node";
import type { BaseElement } from "../elements/base/base-element";
import { Styles } from "../models/styles";

// テスト用の要素型
interface TestElement extends BaseElement<"test", Record<string, unknown>> {
  tagName: "test";
  children?: TestElement[];
}

describe("toFigmaNodeWith", () => {
  describe("基本機能", () => {
    it("createBaseConfigが呼ばれて基本設定が返されること", () => {
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

    it("スタイルがない場合は早期リターンすること", () => {
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

    it("共通スタイルが適用されること（applyCommonStyles=true）", () => {
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

    it("共通スタイルが適用されないこと（applyCommonStyles=false）", () => {
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

    it("カスタムスタイルが適用されること", () => {
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

    it("子要素が変換されること", () => {
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
  });

  describe("統合シナリオ", () => {
    it("すべての機能を組み合わせて使用できること", () => {
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

      const customStyleApplier = (
        config: FigmaNodeConfig,
      ): FigmaNodeConfig => ({
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
  });

  describe("エッジケース", () => {
    it("オプションが未指定でも動作すること", () => {
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

    it("空の子要素配列でエラーにならないこと", () => {
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

    it("customStyleApplierがundefinedでもエラーにならないこと", () => {
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

    it("childrenConverterがundefinedでもエラーにならないこと", () => {
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
  });
});
