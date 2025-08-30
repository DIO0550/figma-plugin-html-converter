import type { FigmaNodeConfig } from "./figma-node";

/**
 * テキストノードの設定型
 * Figmaのテキストノードを表現するための型定義
 */
export interface TextNodeConfig extends FigmaNodeConfig {
  type: "TEXT";
  content: string;
  style: TextStyle;
}

/**
 * テキストスタイルの型定義
 */
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle?: string;
  lineHeight: {
    unit: string;
    value: number;
  };
  letterSpacing: number;
  textAlign: string;
  verticalAlign: string;
  fills?: Array<{
    type: string;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }>;
}

/**
 * テキストノード設定のユーティリティ
 */
export const TextNodeConfig = {
  /**
   * デフォルトのテキストスタイルを作成
   */
  createDefaultStyle(): TextStyle {
    return {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: 24,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
    };
  },

  /**
   * テキストノード設定を作成
   */
  create(content: string, style?: Partial<TextStyle>): TextNodeConfig {
    const config: TextNodeConfig = {
      type: "TEXT",
      content,
      name: "text",
      layoutMode: "NONE",
      layoutSizingHorizontal: "FIXED",
      style: {
        ...TextNodeConfig.createDefaultStyle(),
        ...style,
      },
    };
    return config;
  },

  /**
   * フォントウェイトを設定
   */
  setFontWeight(config: TextNodeConfig, weight: number): TextNodeConfig {
    return {
      ...config,
      style: {
        ...config.style,
        fontWeight: weight,
      },
    };
  },

  /**
   * フォントスタイルを設定
   */
  setFontStyle(config: TextNodeConfig, fontStyle: string): TextNodeConfig {
    return {
      ...config,
      style: {
        ...config.style,
        fontStyle,
      },
    };
  },
};
