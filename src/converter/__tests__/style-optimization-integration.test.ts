import { test, expect } from "vitest";
import {
  convertHTMLToFigma,
  convertHTMLToFigmaWithOptimization,
} from "../index";

test("convertHTMLToFigma - 最適化なし - FRAMEを返す", async () => {
    const html = '<div style="position: static; color: red">Hello</div>';
    const result = await convertHTMLToFigma(html);
    expect(result).toBeDefined();
    expect(result.type).toBe("FRAME");
});

test(
  "convertHTMLToFigmaWithOptimization - optimizeStyles auto - 最適化結果が適用される",
  async () => {
    const html = '<div style="position: static; color: red">Hello</div>';
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
      optimizationMode: "auto",
    });
    expect(result.figmaNode).toBeDefined();
    expect(result.optimizationResults).toBeDefined();
    expect(result.optimizationResults!.length).toBeGreaterThan(0);
    expect(result.optimizationResults![0].appliedCount).toBeGreaterThan(0);
  },
);

test(
  "convertHTMLToFigmaWithOptimization - optimizeStyles manual - 提案が生成される",
  async () => {
    const html = '<div style="opacity: 1; float: none">Hello</div>';
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
      optimizationMode: "manual",
    });
    expect(result.figmaNode).toBeDefined();
    expect(result.optimizationResults).toBeDefined();
    expect(result.optimizationResults!.length).toBeGreaterThan(0);
  },
);

test(
  "convertHTMLToFigmaWithOptimization - スタイルなしHTML - optimizationResultsが空",
  async () => {
    const html = "<div>Hello</div>";
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
    });
    expect(result.optimizationResults).toEqual([]);
  },
);

test(
  "convertHTMLToFigmaWithOptimization - 空HTML - optimizationResultsが未定義",
  async () => {
    const result = await convertHTMLToFigmaWithOptimization("", {
      optimizeStyles: true,
    });
    expect(result.figmaNode.type).toBe("FRAME");
    expect(result.optimizationResults).toBeUndefined();
  },
);

test("convertHTMLToFigma - 既存API - FRAMEを返す", async () => {
    const html = '<div style="color: red">Hello</div>';
    const result = await convertHTMLToFigma(html);
    // FigmaNodeConfigが直接返される
    expect(result.type).toBe("FRAME");
});

test(
  "convertHTMLToFigmaWithOptimization - ネスト要素 - 最適化結果が2件になる",
  async () => {
    const html =
      '<div style="position: static"><p style="opacity: 1; color: blue">Text</p></div>';
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
      optimizationMode: "auto",
    });
    expect(result.optimizationResults).toBeDefined();
    // divとpの両方が最適化対象
    expect(result.optimizationResults!.length).toBe(2);
  },
);
