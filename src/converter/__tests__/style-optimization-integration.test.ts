import { test, expect, describe } from "vitest";
import {
  convertHTMLToFigma,
  convertHTMLToFigmaWithOptimization,
} from "../index";

describe("変換パイプライン - スタイル最適化統合", () => {
  test("optimizeStyles無効時は通常の変換", async () => {
    const html = '<div style="position: static; color: red">Hello</div>';
    const result = await convertHTMLToFigma(html);
    expect(result).toBeDefined();
    expect(result.type).toBe("FRAME");
  });

  test("optimizeStyles有効・autoモードで冗長スタイルが最適化される", async () => {
    const html = '<div style="position: static; color: red">Hello</div>';
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
      optimizationMode: "auto",
    });
    expect(result.figmaNode).toBeDefined();
    expect(result.optimizationResults).toBeDefined();
    expect(result.optimizationResults!.length).toBeGreaterThan(0);
    expect(result.optimizationResults![0].appliedCount).toBeGreaterThan(0);
  });

  test("optimizeStyles有効・manualモードで提案が生成される", async () => {
    const html = '<div style="opacity: 1; float: none">Hello</div>';
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
      optimizationMode: "manual",
    });
    expect(result.figmaNode).toBeDefined();
    expect(result.optimizationResults).toBeDefined();
    expect(result.optimizationResults!.length).toBeGreaterThan(0);
  });

  test("スタイルのないHTMLでは最適化結果が空", async () => {
    const html = "<div>Hello</div>";
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
    });
    expect(result.optimizationResults).toEqual([]);
  });

  test("空のHTMLではoptimizationResultsが未定義", async () => {
    const result = await convertHTMLToFigmaWithOptimization("", {
      optimizeStyles: true,
    });
    expect(result.figmaNode.type).toBe("FRAME");
    expect(result.optimizationResults).toBeUndefined();
  });

  test("convertHTMLToFigmaは後方互換性を維持", async () => {
    const html = '<div style="color: red">Hello</div>';
    const result = await convertHTMLToFigma(html);
    // FigmaNodeConfigが直接返される
    expect(result.type).toBe("FRAME");
  });

  test("ネストされた要素のスタイルも最適化される", async () => {
    const html =
      '<div style="position: static"><p style="opacity: 1; color: blue">Text</p></div>';
    const result = await convertHTMLToFigmaWithOptimization(html, {
      optimizeStyles: true,
      optimizationMode: "auto",
    });
    expect(result.optimizationResults).toBeDefined();
    // divとpの両方が最適化対象
    expect(result.optimizationResults!.length).toBe(2);
  });
});
