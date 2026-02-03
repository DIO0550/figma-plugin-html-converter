/**
 * WCAG 2.1準拠のコントラスト比計算
 */
import type { RGB } from "../../converter/models/colors";
import type { ContrastResult } from "../types";
import { WCAG_CONTRAST, CONTRAST_OFFSET } from "../constants/a11y-constants";
import { calculateRelativeLuminance } from "./luminance";

/**
 * 2つの色のコントラスト比を計算する
 *
 * @param color1 - 色1（RGB, 各値0-1）
 * @param color2 - 色2（RGB, 各値0-1）
 * @returns コントラスト比（1-21）
 */
export function calculateContrastRatio(color1: RGB, color2: RGB): number {
  const l1 = calculateRelativeLuminance(color1);
  const l2 = calculateRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + CONTRAST_OFFSET) / (darker + CONTRAST_OFFSET);
}

/**
 * 2つの色のコントラストをWCAG AA基準でチェックする
 *
 * @param foreground - 前景色（RGB, 各値0-1）
 * @param background - 背景色（RGB, 各値0-1）
 * @returns コントラストチェック結果
 */
export function checkContrast(
  foreground: RGB,
  background: RGB,
): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background);

  return {
    ratio,
    meetsAA: ratio >= WCAG_CONTRAST.AA_NORMAL_TEXT,
    meetsAALarge: ratio >= WCAG_CONTRAST.AA_LARGE_TEXT,
    foreground,
    background,
  };
}
