/**
 * デザインシステムスキャナー
 *
 * Figmaのローカルスタイルとコンポーネントをスキャンし、
 * デザインシステム情報として抽出する。
 */
import type {
  DesignSystem,
  DesignSystemStyle,
  DesignSystemComponent,
  PaintStyleInfo,
  TextStyleInfo,
  EffectStyleInfo,
  GridStyleInfo,
  ComponentProperty,
  FigmaStyleType,
} from "../types";
import {
  createDesignSystemStyleId,
  createDesignSystemComponentId,
} from "../types";

// =============================================================================
// CSS font-weight 標準値（100-900の9段階）
// =============================================================================

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */
const CSS_FONT_WEIGHTS: Record<string, number> = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
};

/** デフォルトのフォントウェイト（Regular） */
const DEFAULT_FONT_WEIGHT = 400;

/**
 * デザインシステムスキャナークラス
 */
export class DesignSystemScanner {
  private cachedDesignSystem: DesignSystem | null = null;

  private constructor() {}

  /**
   * スキャナーインスタンスを作成する
   */
  static create(): DesignSystemScanner {
    return new DesignSystemScanner();
  }

  /**
   * デザインシステム全体をスキャンする
   */
  async scan(): Promise<DesignSystem> {
    const styles = await this.scanStyles();
    const components = await this.scanComponents();

    const designSystem: DesignSystem = {
      styles,
      components,
      scannedAt: new Date(),
    };

    this.cachedDesignSystem = designSystem;
    return designSystem;
  }

  /**
   * スタイルのみをスキャンする
   */
  async scanStyles(): Promise<DesignSystemStyle[]> {
    const paintStyles = this.scanPaintStyles();
    const textStyles = this.scanTextStyles();
    const effectStyles = this.scanEffectStyles();
    const gridStyles = this.scanGridStyles();

    return [...paintStyles, ...textStyles, ...effectStyles, ...gridStyles];
  }

  /**
   * コンポーネントのみをスキャンする
   *
   * NOTE: 大規模デザインシステムではコンポーネント数が多くなる可能性がある。
   * パフォーマンスが問題になる場合は、以下の最適化を検討すること：
   * - キャッシュの有効期限設定
   * - 必要なプロパティのみの遅延評価
   * - ページネーション/バッチ処理の導入
   */
  async scanComponents(): Promise<DesignSystemComponent[]> {
    const components = figma.root.findAllWithCriteria({
      types: ["COMPONENT"],
    }) as ComponentNode[];

    return components.map((component) => this.convertComponent(component));
  }

  /**
   * 名前でスタイルを検索する
   */
  findStyleByName(name: string): DesignSystemStyle | undefined {
    if (!this.cachedDesignSystem) {
      return undefined;
    }
    return this.cachedDesignSystem.styles.find((style) => style.name === name);
  }

  /**
   * 名前でコンポーネントを検索する
   */
  findComponentByName(name: string): DesignSystemComponent | undefined {
    if (!this.cachedDesignSystem) {
      return undefined;
    }
    return this.cachedDesignSystem.components.find(
      (component) => component.name === name,
    );
  }

  /**
   * タイプでスタイルをフィルタリングする
   */
  getStylesByType(type: FigmaStyleType): DesignSystemStyle[] {
    if (!this.cachedDesignSystem) {
      return [];
    }
    return this.cachedDesignSystem.styles.filter(
      (style) => style.type === type,
    );
  }

  /**
   * キャッシュされたデザインシステムを取得する
   */
  getCachedDesignSystem(): DesignSystem | null {
    return this.cachedDesignSystem;
  }

  /**
   * キャッシュをクリアする
   */
  clearCache(): void {
    this.cachedDesignSystem = null;
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private scanPaintStyles(): PaintStyleInfo[] {
    const paintStyles = figma.getLocalPaintStyles();
    return paintStyles.map((style) => this.convertPaintStyle(style));
  }

  private scanTextStyles(): TextStyleInfo[] {
    const textStyles = figma.getLocalTextStyles();
    return textStyles.map((style) => this.convertTextStyle(style));
  }

  private scanEffectStyles(): EffectStyleInfo[] {
    const effectStyles = figma.getLocalEffectStyles();
    return effectStyles.map((style) => this.convertEffectStyle(style));
  }

  private scanGridStyles(): GridStyleInfo[] {
    const gridStyles = figma.getLocalGridStyles();
    return gridStyles.map((style) => this.convertGridStyle(style));
  }

  private convertPaintStyle(style: PaintStyle): PaintStyleInfo {
    return {
      id: createDesignSystemStyleId(style.id),
      name: style.name,
      type: "PAINT",
      description: style.description || undefined,
      key: style.key,
      paints: style.paints,
    };
  }

  private convertTextStyle(style: TextStyle): TextStyleInfo {
    return {
      id: createDesignSystemStyleId(style.id),
      name: style.name,
      type: "TEXT",
      description: style.description || undefined,
      key: style.key,
      fontFamily: style.fontName.family,
      fontSize: style.fontSize,
      fontWeight: this.getFontWeight(style.fontName.style),
      lineHeight: this.getLineHeight(style.lineHeight),
      letterSpacing: this.getLetterSpacing(style.letterSpacing),
    };
  }

  private convertEffectStyle(style: EffectStyle): EffectStyleInfo {
    return {
      id: createDesignSystemStyleId(style.id),
      name: style.name,
      type: "EFFECT",
      description: style.description || undefined,
      key: style.key,
      effects: style.effects,
    };
  }

  private convertGridStyle(style: GridStyle): GridStyleInfo {
    return {
      id: createDesignSystemStyleId(style.id),
      name: style.name,
      type: "GRID",
      description: style.description || undefined,
      key: style.key,
      layoutGrids: style.layoutGrids,
    };
  }

  private convertComponent(component: ComponentNode): DesignSystemComponent {
    const properties = this.extractComponentProperties(component);

    return {
      id: createDesignSystemComponentId(component.id),
      name: component.name,
      description: component.description || undefined,
      key: component.key,
      properties,
    };
  }

  private extractComponentProperties(
    component: ComponentNode,
  ): ComponentProperty[] {
    const definitions = component.componentPropertyDefinitions;
    if (!definitions) {
      return [];
    }

    return Object.entries(definitions).map(([name, definition]) => ({
      name,
      type: definition.type as ComponentProperty["type"],
      defaultValue: definition.defaultValue as string | boolean | undefined,
    }));
  }

  private getFontWeight(fontStyle: string): number {
    for (const [styleName, weight] of Object.entries(CSS_FONT_WEIGHTS)) {
      if (fontStyle.includes(styleName)) {
        return weight;
      }
    }

    return DEFAULT_FONT_WEIGHT;
  }

  private getLineHeight(lineHeight: LineHeight): number | "AUTO" {
    if (lineHeight.unit === "AUTO") {
      return "AUTO";
    }
    return lineHeight.value;
  }

  private getLetterSpacing(letterSpacing: LetterSpacing): number {
    // TODO(#145): PERCENT単位の場合、fontSize基準のpx変換を実装する
    // 優先度: 低（現在のFigmaデザインシステムではPIXELS単位が主流のため）
    // 現時点ではPERCENT/PIXELSどちらも数値をそのまま返す
    return letterSpacing.value;
  }
}
