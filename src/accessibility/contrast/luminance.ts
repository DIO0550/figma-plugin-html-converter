/**
 * WCAG 2.1準拠の相対輝度計算
 */
import type { RGB } from "../../converter/models/colors";
import {
  SRGB_LINEAR,
  RELATIVE_LUMINANCE_WEIGHTS,
} from "../constants/a11y-constants";

/**
 * sRGB値をリニアRGB値に変換する
 *
 * @param srgb - sRGB値（0-1の範囲）
 * @returns リニアRGB値
 */
export function srgbToLinear(srgb: number): number {
  if (srgb <= SRGB_LINEAR.THRESHOLD) {
    return srgb / SRGB_LINEAR.LOW_DIVISOR;
  }
  return Math.pow(
    (srgb + SRGB_LINEAR.HIGH_OFFSET) / SRGB_LINEAR.HIGH_DIVISOR,
    SRGB_LINEAR.GAMMA,
  );
}

/**
 * RGB色の相対輝度を計算する（WCAG 2.1準拠）
 *
 * @param color - RGB色（各値は0-1の範囲）
 * @returns 相対輝度（0-1）
 */
export function calculateRelativeLuminance(color: RGB): number {
  const rLinear = srgbToLinear(color.r);
  const gLinear = srgbToLinear(color.g);
  const bLinear = srgbToLinear(color.b);

  return (
    RELATIVE_LUMINANCE_WEIGHTS.RED * rLinear +
    RELATIVE_LUMINANCE_WEIGHTS.GREEN * gLinear +
    RELATIVE_LUMINANCE_WEIGHTS.BLUE * bLinear
  );
}
