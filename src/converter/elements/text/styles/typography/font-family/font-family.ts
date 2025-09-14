import type { Brand } from "../../../../../../types";

/**
 * フォントファミリーのブランド型
 */
export type FontFamily = Brand<string, "FontFamily">;

/**
 * FontFamilyのコンパニオンオブジェクト
 * フォントファミリーの作成とパースを担当
 */
export const FontFamily = {
  /**
   * FontFamilyを作成
   */
  create(value: string): FontFamily {
    return value as FontFamily;
  },

  /**
   * ブランドを外してプレーンな文字列を取得
   */
  unwrap(value: FontFamily): string {
    return value as unknown as string;
  },

  /**
   * font-familyをパース
   * "Arial, sans-serif" → "Arial"
   */
  parse(fontFamily: string): FontFamily | null {
    if (!fontFamily) {
      return null;
    }

    // カンマで分割して最初のフォントファミリーを取得
    const firstFamily = fontFamily.split(",")[0];

    // 前後の空白とクォートを除去
    const cleaned = firstFamily.trim().replace(/^["']|["']$/g, "");
    return cleaned ? FontFamily.create(cleaned) : null;
  },
} as const;
