/**
 * デザインシステム適用機能
 *
 * Figmaのデザインシステム（スタイル/コンポーネント）を読み込み、
 * HTML要素に自動適用する機能を提供する。
 */

// Types
export * from "./types";

// Scanner
export { DesignSystemScanner } from "./scanner";

// Extractor
export { StyleExtractor } from "./extractor";
export type {
  ColorInfo,
  TypographyInfo,
  EffectInfo,
  CategorizedStyles,
} from "./extractor";

// Mapper
export { DesignSystemMapper } from "./mapper";
export type { ElementInfo } from "./mapper";

// AI Optimization
export { MappingOptimizer } from "./ai-optimization";
export type { MappingValidation } from "./ai-optimization";

// Applier
export { DesignSystemApplier } from "./applier";
export type { ApplyOptions, ApplyPreview } from "./applier";

// Settings
export { DesignSystemSettingsManager, STORAGE_KEY } from "./settings";
export type { ValidationResult } from "./settings";
