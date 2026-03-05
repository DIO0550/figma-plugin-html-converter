import type { FontName } from "../../types";
import type { OptimizationMode } from "../styles/style-optimizer/types";

// 変換オプションの型定義
export interface ConversionOptions {
  defaultFont?: FontName;
  containerWidth?: number;
  containerHeight?: number;
  spacing?: number;
  colorMode?: "rgb" | "hex";
  /** スタイル最適化を有効にするか */
  optimizeStyles?: boolean;
  /** 最適化モード（auto: 自動適用, manual: 手動承認） */
  optimizationMode?: OptimizationMode;
}

// ConversionOptionsのコンパニオンオブジェクト
export const ConversionOptions = {
  // デフォルトオプションを取得
  getDefault(): ConversionOptions {
    return {
      defaultFont: { family: "Inter", style: "Regular" },
      containerWidth: 800,
      containerHeight: 600,
      spacing: 8,
      colorMode: "rgb",
      optimizeStyles: false,
      optimizationMode: "auto",
    };
  },

  // オプションをマージ（null/undefinedはデフォルト値を保持するためフィルタリング）
  merge(
    base: ConversionOptions,
    override: Partial<ConversionOptions>,
  ): ConversionOptions {
    const filtered = Object.fromEntries(
      Object.entries(override).filter(([, v]) => v != null),
    ) as Partial<ConversionOptions>;
    return { ...base, ...filtered };
  },

  // 複数のオプションをマージ
  mergeAll(...options: Partial<ConversionOptions>[]): ConversionOptions {
    return options.reduce<ConversionOptions>(
      (acc, option) => ConversionOptions.merge(acc, option),
      ConversionOptions.getDefault(),
    );
  },

  // オプションの検証
  validate(options: ConversionOptions): boolean {
    // コンテナサイズの検証（NaN/Infinityも無効）
    if (
      options.containerWidth !== undefined &&
      (!Number.isFinite(options.containerWidth) || options.containerWidth <= 0)
    ) {
      return false;
    }
    if (
      options.containerHeight !== undefined &&
      (!Number.isFinite(options.containerHeight) ||
        options.containerHeight <= 0)
    ) {
      return false;
    }

    // spacingの検証（NaN/Infinityも無効）
    if (
      options.spacing !== undefined &&
      (!Number.isFinite(options.spacing) || options.spacing < 0)
    ) {
      return false;
    }

    // colorModeの検証
    if (
      options.colorMode !== undefined &&
      !["rgb", "hex"].includes(options.colorMode)
    ) {
      return false;
    }

    // optimizeStylesの検証
    if (
      options.optimizeStyles !== undefined &&
      typeof options.optimizeStyles !== "boolean"
    ) {
      return false;
    }

    // optimizationModeの検証
    if (
      options.optimizationMode !== undefined &&
      !["auto", "manual"].includes(options.optimizationMode)
    ) {
      return false;
    }

    return true;
  },

  // オプションの正規化
  normalize(options: Partial<ConversionOptions>): ConversionOptions {
    const defaults = ConversionOptions.getDefault();
    const merged = ConversionOptions.merge(defaults, options);

    // 不正値（NaN/Infinity）をデフォルトに差し戻し、負の値を正の値に正規化
    if (
      merged.containerWidth !== undefined &&
      !Number.isFinite(merged.containerWidth)
    ) {
      merged.containerWidth = defaults.containerWidth;
    } else if (
      merged.containerWidth !== undefined &&
      merged.containerWidth < 0
    ) {
      merged.containerWidth = Math.abs(merged.containerWidth);
    }
    if (
      merged.containerHeight !== undefined &&
      !Number.isFinite(merged.containerHeight)
    ) {
      merged.containerHeight = defaults.containerHeight;
    } else if (
      merged.containerHeight !== undefined &&
      merged.containerHeight < 0
    ) {
      merged.containerHeight = Math.abs(merged.containerHeight);
    }
    if (merged.spacing !== undefined && !Number.isFinite(merged.spacing)) {
      merged.spacing = defaults.spacing;
    } else if (merged.spacing !== undefined && merged.spacing < 0) {
      merged.spacing = Math.abs(merged.spacing);
    }

    return merged;
  },

  // 型ガード
  hasDefaultFont(
    options: ConversionOptions,
  ): options is ConversionOptions & { defaultFont: FontName } {
    return options.defaultFont !== undefined;
  },

  hasContainerSize(options: ConversionOptions): options is ConversionOptions & {
    containerWidth: number;
    containerHeight: number;
  } {
    return (
      typeof options.containerWidth === "number" &&
      Number.isFinite(options.containerWidth) &&
      options.containerWidth > 0 &&
      typeof options.containerHeight === "number" &&
      Number.isFinite(options.containerHeight) &&
      options.containerHeight > 0
    );
  },

  // カラーモードのチェック
  isRGBMode(options: ConversionOptions): boolean {
    return options.colorMode === "rgb";
  },

  isHexMode(options: ConversionOptions): boolean {
    return options.colorMode === "hex";
  },

  // 部分的なオプションから完全なオプションを作成
  from(partial: Partial<ConversionOptions> = {}): ConversionOptions {
    return ConversionOptions.normalize(partial);
  },
};
