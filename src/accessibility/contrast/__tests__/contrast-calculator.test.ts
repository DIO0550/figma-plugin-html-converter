import { test, expect } from "vitest";
import { calculateContrastRatio, checkContrast } from "../contrast-calculator";

// =============================================================================
// コントラスト比計算
// =============================================================================

test("白と黒のコントラスト比は21:1", () => {
  const ratio = calculateContrastRatio(
    { r: 1, g: 1, b: 1 },
    { r: 0, g: 0, b: 0 },
  );
  expect(ratio).toBeCloseTo(21, 0);
});

test("黒と白のコントラスト比は21:1（順序に依存しない）", () => {
  const ratio = calculateContrastRatio(
    { r: 0, g: 0, b: 0 },
    { r: 1, g: 1, b: 1 },
  );
  expect(ratio).toBeCloseTo(21, 0);
});

test("同じ色のコントラスト比は1:1", () => {
  const ratio = calculateContrastRatio(
    { r: 0.5, g: 0.5, b: 0.5 },
    { r: 0.5, g: 0.5, b: 0.5 },
  );
  expect(ratio).toBeCloseTo(1, 0);
});

// =============================================================================
// WCAG AA判定
// =============================================================================

test("白と黒の組み合わせはAA通常テキスト・大テキストともに合格", () => {
  const result = checkContrast({ r: 1, g: 1, b: 1 }, { r: 0, g: 0, b: 0 });
  expect(result.meetsAA).toBe(true);
  expect(result.meetsAALarge).toBe(true);
  expect(result.ratio).toBeCloseTo(21, 0);
});

test("低コントラストの組み合わせはAA不合格", () => {
  // ライトグレー同士: コントラスト比が低い
  const result = checkContrast(
    { r: 0.8, g: 0.8, b: 0.8 },
    { r: 0.9, g: 0.9, b: 0.9 },
  );
  expect(result.meetsAA).toBe(false);
  expect(result.ratio).toBeLessThan(4.5);
});

test("大テキスト基準のみ合格する中間的なコントラスト比", () => {
  // コントラスト比が3:1〜4.5:1の間になる色の組み合わせ
  // #767676 (sRGB 0.463) on #FFFFFF → コントラスト比 ≈ 4.54 (ギリギリ)
  // #808080 (sRGB 0.502) on #FFFFFF → コントラスト比 ≈ 3.95
  const result = checkContrast(
    { r: 0.502, g: 0.502, b: 0.502 },
    { r: 1, g: 1, b: 1 },
  );
  expect(result.meetsAALarge).toBe(true);
  expect(result.meetsAA).toBe(false);
});

test("checkContrastは前景色と背景色をそのまま保持する", () => {
  const fg = { r: 1, g: 0, b: 0 };
  const bg = { r: 0, g: 0, b: 1 };
  const result = checkContrast(fg, bg);
  expect(result.foreground).toEqual(fg);
  expect(result.background).toEqual(bg);
});

// =============================================================================
// 境界値・エッジケース
// =============================================================================

test("範囲外の負の値はクランプされて正しく計算される", () => {
  const ratio = calculateContrastRatio(
    { r: -0.1, g: 0.5, b: 0.5 },
    { r: 1, g: 1, b: 1 },
  );
  expect(ratio).toBeGreaterThanOrEqual(1);
  expect(ratio).toBeLessThanOrEqual(21);
});

test("範囲外の1を超える値はクランプされて正しく計算される", () => {
  const ratio = calculateContrastRatio(
    { r: 1.5, g: 0.5, b: 0.5 },
    { r: 0, g: 0, b: 0 },
  );
  expect(ratio).toBeGreaterThanOrEqual(1);
  expect(ratio).toBeLessThanOrEqual(21);
});

test("極小値に近い色のコントラスト比が正しく計算される", () => {
  const ratio = calculateContrastRatio(
    { r: 0.001, g: 0.001, b: 0.001 },
    { r: 1, g: 1, b: 1 },
  );
  expect(ratio).toBeGreaterThan(20);
});

test("純粋な赤と白のコントラスト比が計算される", () => {
  const ratio = calculateContrastRatio(
    { r: 1, g: 0, b: 0 },
    { r: 1, g: 1, b: 1 },
  );
  expect(ratio).toBeGreaterThan(1);
  expect(ratio).toBeLessThan(21);
});
