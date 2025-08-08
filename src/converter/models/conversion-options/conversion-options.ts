import type { FontName } from '../../types';

// 変換オプションの型定義
export interface ConversionOptions {
  defaultFont?: FontName;
  containerWidth?: number;
  containerHeight?: number;
  spacing?: number;
  colorMode?: 'rgb' | 'hex';
}

// ConversionOptionsのコンパニオンオブジェクト
export const ConversionOptions = {
  // デフォルトオプションを取得
  getDefault(): ConversionOptions {
    return {
      defaultFont: { family: 'Inter', style: 'Regular' },
      containerWidth: 800,
      containerHeight: 600,
      spacing: 8,
      colorMode: 'rgb'
    };
  },

  // オプションをマージ
  merge(base: ConversionOptions, override: Partial<ConversionOptions>): ConversionOptions {
    return { ...base, ...override };
  },

  // 複数のオプションをマージ
  mergeAll(...options: Partial<ConversionOptions>[]): ConversionOptions {
    return options.reduce<ConversionOptions>(
      (acc, option) => ConversionOptions.merge(acc, option),
      ConversionOptions.getDefault()
    );
  },

  // オプションの検証
  validate(options: ConversionOptions): boolean {
    // コンテナサイズの検証
    if (options.containerWidth !== undefined && options.containerWidth <= 0) {
      return false;
    }
    if (options.containerHeight !== undefined && options.containerHeight <= 0) {
      return false;
    }
    
    // spacingの検証
    if (options.spacing !== undefined && options.spacing < 0) {
      return false;
    }
    
    // colorModeの検証
    if (options.colorMode !== undefined && 
        !['rgb', 'hex'].includes(options.colorMode)) {
      return false;
    }
    
    return true;
  },

  // オプションの正規化
  normalize(options: Partial<ConversionOptions>): ConversionOptions {
    const defaults = ConversionOptions.getDefault();
    const merged = ConversionOptions.merge(defaults, options);
    
    // 負の値を正の値に正規化
    if (merged.containerWidth && merged.containerWidth < 0) {
      merged.containerWidth = Math.abs(merged.containerWidth);
    }
    if (merged.containerHeight && merged.containerHeight < 0) {
      merged.containerHeight = Math.abs(merged.containerHeight);
    }
    if (merged.spacing && merged.spacing < 0) {
      merged.spacing = Math.abs(merged.spacing);
    }
    
    return merged;
  },

  // 型ガード
  hasDefaultFont(options: ConversionOptions): options is ConversionOptions & { defaultFont: FontName } {
    return options.defaultFont !== undefined;
  },

  hasContainerSize(options: ConversionOptions): options is ConversionOptions & { containerWidth: number; containerHeight: number } {
    return options.containerWidth !== undefined && options.containerHeight !== undefined;
  },

  // カラーモードのチェック
  isRGBMode(options: ConversionOptions): boolean {
    return options.colorMode === 'rgb';
  },

  isHexMode(options: ConversionOptions): boolean {
    return options.colorMode === 'hex';
  },

  // 部分的なオプションから完全なオプションを作成
  from(partial: Partial<ConversionOptions> = {}): ConversionOptions {
    return ConversionOptions.normalize(partial);
  }
};