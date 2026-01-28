/**
 * デザインシステム適用機能
 *
 * マッピング結果をFigmaNodeConfigに適用し、
 * デザインシステムのスタイルを反映する。
 */
import type {
  MappingMatch,
  ApplyDesignSystemResult,
  ApplyError,
  PaintStyleInfo,
  TextStyleInfo,
  EffectStyleInfo,
} from "../types";
import { StyleExtractor } from "../extractor";

/**
 * FigmaNodeConfigの簡易型（実際の型はconverter/models/figma-node/configから）
 */
interface FigmaNodeConfigLike {
  type: "FRAME" | "TEXT" | "RECTANGLE" | "GROUP" | "POLYGON";
  name: string;
  fills?: Paint[];
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  lineHeight?: number | "AUTO";
  letterSpacing?: number;
  effects?: Effect[];
  [key: string]: unknown;
}

/**
 * 適用オプション
 */
export interface ApplyOptions {
  /** 最小信頼度（これ以下のマッチはスキップ） */
  minConfidence: number;
  /** ドライラン（実際には適用しない） */
  dryRun?: boolean;
}

/**
 * 適用プレビュー
 */
export interface ApplyPreview {
  elementPath: string;
  styleName: string;
  styleType: string;
  changes: Record<string, unknown>;
}

/**
 * デザインシステム適用クラス
 */
export class DesignSystemApplier {
  private styleExtractor: StyleExtractor;

  private constructor() {
    this.styleExtractor = StyleExtractor.create();
  }

  /**
   * アプライヤーインスタンスを作成する
   */
  static create(): DesignSystemApplier {
    return new DesignSystemApplier();
  }

  /**
   * マッピング結果をFigmaNodeConfigに適用する
   */
  applyToFigmaNodeConfig(
    match: MappingMatch,
    config: FigmaNodeConfigLike,
  ): FigmaNodeConfigLike {
    const { appliedStyle } = match;

    if (!appliedStyle) {
      return config;
    }

    switch (appliedStyle.type) {
      case "PAINT":
        return this.applyPaintStyle(appliedStyle, config);
      case "TEXT":
        return this.applyTextStyle(appliedStyle, config);
      case "EFFECT":
        return this.applyEffectStyle(appliedStyle, config);
      default:
        return config;
    }
  }

  /**
   * 複数のマッチを適用する
   */
  applyMatches(
    matches: MappingMatch[],
    options: ApplyOptions,
  ): ApplyDesignSystemResult {
    let appliedCount = 0;
    let skippedCount = 0;
    const errors: ApplyError[] = [];

    for (const match of matches) {
      if (match.confidence < options.minConfidence) {
        skippedCount++;
        continue;
      }

      if (options.dryRun) {
        appliedCount++;
        continue;
      }

      try {
        // TODO: 実際のFigmaノードへの適用処理を実装する
        // 現時点ではマッチの記録のみ行い、FigmaNodeConfigへの適用は
        // applyToFigmaNodeConfig()を個別に呼び出して行う
        this.applyToFigmaNodeConfig(match, {
          type: "FRAME",
          name: match.elementPath,
        });
        appliedCount++;
      } catch (error) {
        errors.push({
          elementPath: match.elementPath,
          message: error instanceof Error ? error.message : "Unknown error",
          code: "APPLY_ERROR",
        });
      }
    }

    return {
      success: errors.length === 0,
      appliedCount,
      skippedCount,
      errors,
      appliedAt: new Date(),
    };
  }

  /**
   * マッチからCSS文字列を生成する
   */
  generateCssFromMatch(match: MappingMatch): string {
    const { appliedStyle } = match;

    if (!appliedStyle) {
      return "";
    }

    const cssProps = this.styleExtractor.toCssProperties(appliedStyle);
    return Object.entries(cssProps)
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n");
  }

  /**
   * 適用結果のプレビューを生成する
   */
  previewApply(match: MappingMatch): ApplyPreview {
    const { appliedStyle, elementPath } = match;

    const changes: Record<string, unknown> = {};

    if (appliedStyle) {
      switch (appliedStyle.type) {
        case "PAINT":
          changes.fills = this.getPaintChanges(appliedStyle);
          break;
        case "TEXT":
          Object.assign(changes, this.getTextChanges(appliedStyle));
          break;
        case "EFFECT":
          changes.effects = this.getEffectChanges(appliedStyle);
          break;
      }
    }

    return {
      elementPath,
      styleName: appliedStyle?.name ?? "Unknown",
      styleType: appliedStyle?.type ?? "Unknown",
      changes,
    };
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private applyPaintStyle(
    style: PaintStyleInfo,
    config: FigmaNodeConfigLike,
  ): FigmaNodeConfigLike {
    return {
      ...config,
      fills: [...style.paints] as Paint[],
    };
  }

  private applyTextStyle(
    style: TextStyleInfo,
    config: FigmaNodeConfigLike,
  ): FigmaNodeConfigLike {
    return {
      ...config,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
    };
  }

  private applyEffectStyle(
    style: EffectStyleInfo,
    config: FigmaNodeConfigLike,
  ): FigmaNodeConfigLike {
    return {
      ...config,
      effects: [...style.effects] as Effect[],
    };
  }

  private getPaintChanges(style: PaintStyleInfo): unknown[] {
    return style.paints.map((paint) => {
      if (paint.type === "SOLID") {
        return {
          type: "SOLID",
          color: paint.color,
          opacity: paint.opacity,
        };
      }
      return { type: paint.type };
    });
  }

  private getTextChanges(style: TextStyleInfo): Record<string, unknown> {
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
    };
  }

  private getEffectChanges(style: EffectStyleInfo): unknown[] {
    return style.effects.map((effect) => ({
      type: effect.type,
      visible: effect.visible,
    }));
  }
}
