import type { TextNodeConfig } from "../../../../models/figma-node";

/**
 * 垂直方向の配置を表す型
 */
export type VerticalAlignType =
  | "baseline"
  | "top"
  | "middle"
  | "bottom"
  | "text-top"
  | "text-bottom"
  | "super"
  | "sub";

/**
 * VerticalAlignのコンパニオンオブジェクト
 */
export const VerticalAlign = {
  /**
   * VerticalAlign値を作成
   */
  create(value: VerticalAlignType = "baseline"): VerticalAlignType {
    return value;
  },

  /**
   * CSSのvertical-align値をパース
   */
  parse(value: string | undefined | null): VerticalAlignType | null {
    if (!value) {
      return null;
    }

    const trimmedValue = value.trim().toLowerCase();

    switch (trimmedValue) {
      case "baseline":
      case "top":
      case "middle":
      case "bottom":
      case "text-top":
      case "text-bottom":
      case "super":
      case "sub":
        return trimmedValue as VerticalAlignType;
      default:
        // 数値指定（px, em, %など）の場合はbaselineとして扱う
        if (/^-?\d+(\.\d+)?(px|em|rem|%)?$/.test(trimmedValue)) {
          return "baseline";
        }
        return null;
    }
  },

  /**
   * 上付き文字かどうかを判定
   */
  isSuper(value: VerticalAlignType | null): boolean {
    return value === "super";
  },

  /**
   * 下付き文字かどうかを判定
   */
  isSub(value: VerticalAlignType | null): boolean {
    return value === "sub";
  },

  /**
   * 中央配置かどうかを判定
   */
  isMiddle(value: VerticalAlignType | null): boolean {
    return value === "middle";
  },

  /**
   * デフォルト値を取得
   */
  getDefault(): VerticalAlignType {
    return "baseline";
  },

  /**
   * スタイルオブジェクトからvertical-alignを抽出
   */
  extractStyle(styles: Record<string, string>): VerticalAlignType | null {
    return this.parse(styles["vertical-align"] || styles["verticalAlign"]);
  },

  /**
   * TextNodeConfigにvertical-alignの設定を適用
   * 注意: Figmaには直接的なvertical-align相当の機能がないため、
   * テキストのベースラインシフトやサイズ調整で擬似的に表現
   */
  applyToConfig(
    config: TextNodeConfig,
    value: VerticalAlignType | null,
  ): TextNodeConfig {
    if (!value || value === "baseline") {
      return config;
    }

    // Figmaでのvertical-align相当の実装
    // super/subの場合、フォントサイズと位置を調整
    if (this.isSuper(value) || this.isSub(value)) {
      const currentSize = config.style?.fontSize ?? 16;
      const newSize = currentSize * 0.75; // 75%のサイズに縮小

      return {
        ...config,
        style: {
          ...config.style,
          fontSize: newSize,
          // verticalAlignの設定も保持
          verticalAlign: value,
        },
      };
    }

    // その他のalign値は、スタイル情報として保持
    return {
      ...config,
      style: {
        ...config.style,
        verticalAlign: value,
      },
    };
  },

  /**
   * Figmaのテキスト配置設定に変換
   * 注意: これは親要素のAutoLayoutで使用される想定
   */
  toFigmaAlignment(
    value: VerticalAlignType | null,
  ): "MIN" | "CENTER" | "MAX" | null {
    if (!value) {
      return null;
    }

    switch (value) {
      case "top":
      case "text-top":
        return "MIN";
      case "middle":
        return "CENTER";
      case "bottom":
      case "text-bottom":
        return "MAX";
      default:
        return null;
    }
  },
};
