import type { TextNodeConfig } from "../../../../models/figma-node";

/**
 * テキストの方向を表す型
 */
export type TextDirectionType = "ltr" | "rtl";

/**
 * 書字方向（writing-mode）の型
 */
export type WritingModeType =
  | "horizontal-tb"
  | "vertical-rl"
  | "vertical-lr"
  | "sideways-rl"
  | "sideways-lr";

/**
 * TextDirectionのコンパニオンオブジェクト
 */
export const TextDirection = {
  /**
   * TextDirection値を作成
   */
  create(value: TextDirectionType = "ltr"): TextDirectionType {
    return value;
  },

  /**
   * CSSのdirection値をパース
   */
  parse(value: string | undefined | null): TextDirectionType | null {
    if (!value) {
      return null;
    }

    const trimmedValue = value.trim().toLowerCase();

    switch (trimmedValue) {
      case "ltr":
      case "rtl":
        return trimmedValue as TextDirectionType;
      case "inherit":
      case "initial":
      case "unset":
        // 継承値の場合はデフォルトのltrを返す
        return "ltr";
      default:
        return null;
    }
  },

  /**
   * 右から左へのテキスト方向かどうか判定
   */
  isRTL(value: TextDirectionType | null): boolean {
    return value === "rtl";
  },

  /**
   * 左から右へのテキスト方向かどうか判定
   */
  isLTR(value: TextDirectionType | null): boolean {
    return value === "ltr";
  },

  /**
   * デフォルト値を取得
   */
  getDefault(): TextDirectionType {
    return "ltr";
  },

  /**
   * スタイルオブジェクトからdirectionを抽出
   */
  extractStyle(styles: Record<string, string>): TextDirectionType | null {
    return this.parse(styles.direction);
  },

  /**
   * TextNodeConfigにdirectionの設定を適用
   * 注意: FigmaのAPIには直接的なテキスト方向の設定がないため、
   * テキストの配置や並び順で擬似的に表現
   */
  applyToConfig(
    config: TextNodeConfig,
    value: TextDirectionType | null,
  ): TextNodeConfig {
    if (!value || value === "ltr") {
      return config;
    }

    // RTLの場合、テキスト配置を右寄せにする
    if (this.isRTL(value)) {
      return {
        ...config,
        style: {
          ...config.style,
          textAlign: "RIGHT",
          // RTLのメタ情報を保持（実装の判断用）
          // 実際のFigmaでのRTL表示は、プラグイン側での特別な処理が必要
        },
      };
    }

    return config;
  },

  /**
   * Writing-modeをパース
   */
  parseWritingMode(value: string | undefined | null): WritingModeType | null {
    if (!value) {
      return null;
    }

    const trimmedValue = value.trim().toLowerCase();

    switch (trimmedValue) {
      case "horizontal-tb":
      case "vertical-rl":
      case "vertical-lr":
      case "sideways-rl":
      case "sideways-lr":
        return trimmedValue as WritingModeType;
      case "tb": // 旧仕様
        return "vertical-rl";
      case "lr": // 旧仕様
      case "lr-tb": // 旧仕様
        return "horizontal-tb";
      case "rl": // 旧仕様
      case "tb-rl": // 旧仕様
        return "vertical-rl";
      default:
        return null;
    }
  },

  /**
   * 縦書きかどうか判定
   */
  isVertical(mode: WritingModeType | null): boolean {
    return (
      mode === "vertical-rl" ||
      mode === "vertical-lr" ||
      mode === "sideways-rl" ||
      mode === "sideways-lr"
    );
  },

  /**
   * 横書きかどうか判定
   */
  isHorizontal(mode: WritingModeType | null): boolean {
    return mode === "horizontal-tb" || mode === null;
  },

  /**
   * スタイルオブジェクトからwriting-modeを抽出
   */
  extractWritingMode(styles: Record<string, string>): WritingModeType | null {
    return this.parseWritingMode(styles["writing-mode"] || styles.writingMode);
  },

  /**
   * TextNodeConfigにwriting-modeの設定を適用
   * 注意: Figmaには縦書きの直接サポートがないため、
   * レイアウトの回転や特殊な処理が必要
   */
  applyWritingModeToConfig(
    config: TextNodeConfig,
    mode: WritingModeType | null,
  ): TextNodeConfig {
    if (!mode || this.isHorizontal(mode)) {
      return config;
    }

    // 縦書きの場合、メタ情報として保持
    // 実際の縦書き表示はプラグイン側での特別な処理が必要
    if (this.isVertical(mode)) {
      return {
        ...config,
        // 縦書きのメタ情報を保持
        // Figmaでの実装は、テキストの回転やレイアウト調整で対応
      };
    }

    return config;
  },

  /**
   * テキスト方向を逆転
   */
  reverse(value: TextDirectionType): TextDirectionType {
    return value === "ltr" ? "rtl" : "ltr";
  },

  /**
   * 言語コードから推定される方向を取得
   */
  fromLanguage(langCode: string): TextDirectionType {
    const rtlLanguages = [
      "ar", // アラビア語
      "he", // ヘブライ語
      "fa", // ペルシア語
      "ur", // ウルドゥー語
      "yi", // イディッシュ語
      "ji", // イディッシュ語（旧）
      "iw", // ヘブライ語（旧）
      "ku", // クルド語
      "ps", // パシュトー語
      "sd", // シンド語
    ];

    const lang = langCode.toLowerCase().split("-")[0];
    return rtlLanguages.includes(lang) ? "rtl" : "ltr";
  },
};
