/**
 * 問題点検出器
 *
 * レイアウトの問題点を検出するロジック
 */
import type { LayoutProblem, NodePath } from "../types";
import { Styles } from "../../../converter/models/styles";
import { Flexbox } from "../../../converter/models/flexbox";

/**
 * 検出閾値の型定義
 *
 * 将来的に SuggestionSettings などの設定オブジェクトから
 * 値を注入する際の契約として利用します。
 */
export interface DetectionThresholds {
  /**
   * Flexコンテナを推奨する最小子要素数
   * 根拠: 2個以上の子要素がある場合、Flexboxによる配置が有用になる
   *       1個の場合はセンタリング等の目的以外ではFlexは不要
   */
  minChildrenForFlex: number;

  /**
   * 非効率なネストと判断する深さ
   * 根拠: 一般的なベストプラクティスでは3-4レベルが推奨される
   *       4レベル以上は可読性・保守性の低下を示唆する
   */
  inefficientNestingDepth: number;

  /**
   * 横並びで方向変更を推奨する最小子要素数
   * 根拠: 子要素が4個以上で狭いコンテナの場合、
   *       横並びだとオーバーフローしやすくなる
   */
  minChildrenForDirectionCheck: number;

  /**
   * 狭いコンテナと判断する幅（px）
   * 根拠: 300pxはモバイルビューポートの一般的な幅
   *       これより狭い場合、横並び要素は収まりにくい
   */
  narrowContainerWidth: number;
}

/**
 * 検出閾値のデフォルト値
 *
 * resetDetectionThresholds() で初期状態に戻す際に使用されます。
 */
const DEFAULT_DETECTION_THRESHOLDS: Readonly<DetectionThresholds> = {
  minChildrenForFlex: 2,
  inefficientNestingDepth: 4,
  minChildrenForDirectionCheck: 4,
  narrowContainerWidth: 300,
} as const;

/**
 * 検出閾値（現在の値）
 *
 * これらの値はデザインシステムやユーザー設定に応じて調整が必要になる可能性があります。
 * configureDetectionThresholds() を使用して部分的に上書きできます。
 * resetDetectionThresholds() を使用してデフォルト値に戻せます。
 */
const DETECTION_THRESHOLDS: DetectionThresholds = {
  ...DEFAULT_DETECTION_THRESHOLDS,
};

/**
 * 検出閾値を設定する
 *
 * 部分的な上書きをサポートします。指定されたプロパティのみが更新されます。
 *
 * @param overrides - 上書きしたい閾値
 *
 * @example
 * ```ts
 * // Flexコンテナの閾値のみを変更
 * configureDetectionThresholds({ minChildrenForFlex: 3 });
 *
 * // 複数の閾値を一度に変更
 * configureDetectionThresholds({
 *   minChildrenForFlex: 3,
 *   narrowContainerWidth: 400,
 * });
 * ```
 */
export function configureDetectionThresholds(
  overrides: Partial<DetectionThresholds>,
): void {
  if (overrides.minChildrenForFlex !== undefined) {
    DETECTION_THRESHOLDS.minChildrenForFlex = overrides.minChildrenForFlex;
  }
  if (overrides.inefficientNestingDepth !== undefined) {
    DETECTION_THRESHOLDS.inefficientNestingDepth =
      overrides.inefficientNestingDepth;
  }
  if (overrides.minChildrenForDirectionCheck !== undefined) {
    DETECTION_THRESHOLDS.minChildrenForDirectionCheck =
      overrides.minChildrenForDirectionCheck;
  }
  if (overrides.narrowContainerWidth !== undefined) {
    DETECTION_THRESHOLDS.narrowContainerWidth = overrides.narrowContainerWidth;
  }
}

/**
 * 現在の検出閾値を取得する
 *
 * @returns 現在の検出閾値（読み取り専用のコピー）
 */
export function getDetectionThresholds(): Readonly<DetectionThresholds> {
  return { ...DETECTION_THRESHOLDS };
}

/**
 * 検出閾値をデフォルト値にリセットする
 *
 * テストの独立性を保つために、各テストの afterEach で呼び出すことを推奨します。
 *
 * @example
 * ```ts
 * import { afterEach } from "vitest";
 * import { resetDetectionThresholds } from "./problem-detector";
 *
 * afterEach(() => {
 *   resetDetectionThresholds();
 * });
 * ```
 */
export function resetDetectionThresholds(): void {
  DETECTION_THRESHOLDS.minChildrenForFlex =
    DEFAULT_DETECTION_THRESHOLDS.minChildrenForFlex;
  DETECTION_THRESHOLDS.inefficientNestingDepth =
    DEFAULT_DETECTION_THRESHOLDS.inefficientNestingDepth;
  DETECTION_THRESHOLDS.minChildrenForDirectionCheck =
    DEFAULT_DETECTION_THRESHOLDS.minChildrenForDirectionCheck;
  DETECTION_THRESHOLDS.narrowContainerWidth =
    DEFAULT_DETECTION_THRESHOLDS.narrowContainerWidth;
}

/**
 * 問題点検出器のコンパニオンオブジェクト
 */
export const ProblemDetector = {
  /**
   * Flexコンテナの欠如を検出する
   *
   * @param styles - スタイル
   * @param path - ノードパス
   * @param childCount - 子要素数
   * @returns 問題（検出されない場合はnull）
   */
  detectMissingFlexContainer(
    styles: Styles,
    path: NodePath,
    childCount: number,
  ): LayoutProblem | null {
    if (childCount < DETECTION_THRESHOLDS.minChildrenForFlex) {
      return null;
    }

    if (Flexbox.isFlexContainer(styles)) {
      return null;
    }

    const display = Styles.get(styles, "display") || "block";

    return {
      type: "missing-flex-container",
      severity: "medium",
      location: path,
      description: `この要素には${childCount}個の子要素がありますが、Flexコンテナではありません。display: flexを使用することで、レイアウトを簡単に制御できます。`,
      currentValue: display,
    };
  },

  /**
   * 配置指定の欠如を検出する
   *
   * @param styles - スタイル
   * @param path - ノードパス
   * @returns 問題（検出されない場合はnull）
   */
  detectMissingAlignment(styles: Styles, path: NodePath): LayoutProblem | null {
    if (!Flexbox.isFlexContainer(styles)) {
      return null;
    }

    const justifyContent = Styles.get(styles, "justify-content");
    const alignItems = Styles.get(styles, "align-items");

    if (justifyContent || alignItems) {
      return null;
    }

    return {
      type: "missing-alignment",
      severity: "low",
      location: path,
      description:
        "このFlexコンテナにはjustify-contentとalign-itemsが指定されていません。明示的に配置を指定することで、意図が明確になります。",
    };
  },

  /**
   * スペーシングの不一致を検出する
   *
   * @param styles - スタイル
   * @param path - ノードパス
   * @returns 問題（検出されない場合はnull）
   */
  detectInconsistentSpacing(
    styles: Styles,
    path: NodePath,
  ): LayoutProblem | null {
    const gap = ProblemDetector.parseSpacingValue(Styles.get(styles, "gap"));
    const padding = Styles.get(styles, "padding");

    if (!padding) {
      return null;
    }

    const paddingValues = ProblemDetector.parsePaddingValues(padding);
    const uniquePaddingValues = new Set(paddingValues);

    // 可読性向上: 段階的な条件チェックと明確な変数名
    const hasGap = gap > 0;
    const hasMultiplePaddingValues = uniquePaddingValues.size > 1;

    // gapが設定されていない、または全てのpadding値が同じ場合は不一致なし
    if (!hasGap || !hasMultiplePaddingValues) {
      return null;
    }

    // 不一致検出: paddingの値がgapとも最初のpadding値とも異なる場合
    // これは「スペーシングに3種類以上の値が存在する」ことを意味する
    const primaryPaddingValue = paddingValues[0];
    const hasMismatchWithGap = paddingValues.some(
      (paddingValue) =>
        paddingValue !== gap && paddingValue !== primaryPaddingValue,
    );

    if (hasMismatchWithGap) {
      return {
        type: "inconsistent-spacing",
        severity: "low",
        location: path,
        description:
          "スペーシング値（gap、padding）に一貫性がありません。デザインの一貫性のために、同じ値を使用することを検討してください。",
        currentValue: `gap: ${gap}px, padding: ${padding}`,
      };
    }

    return null;
  },

  /**
   * 最適でない方向指定を検出する
   *
   * @param styles - スタイル
   * @param path - ノードパス
   * @param childCount - 子要素数
   * @returns 問題（検出されない場合はnull）
   */
  detectSuboptimalDirection(
    styles: Styles,
    path: NodePath,
    childCount: number,
  ): LayoutProblem | null {
    if (!Flexbox.isFlexContainer(styles)) {
      return null;
    }

    if (childCount < DETECTION_THRESHOLDS.minChildrenForDirectionCheck) {
      return null;
    }

    const flexDirection = Styles.get(styles, "flex-direction") || "row";
    const width = ProblemDetector.parseSpacingValue(
      Styles.get(styles, "width"),
    );

    // 横並び（row）で幅が狭く、子要素が多い場合
    if (
      flexDirection === "row" &&
      width > 0 &&
      width < DETECTION_THRESHOLDS.narrowContainerWidth
    ) {
      return {
        type: "suboptimal-direction",
        severity: "low",
        location: path,
        description: `横並び（row）ですが、コンテナの幅（${width}px）に対して子要素が${childCount}個あります。縦並び（column）への変更を検討してください。`,
        currentValue: flexDirection,
      };
    }

    return null;
  },

  /**
   * 非効率なネストを検出する
   *
   * @param path - ノードパス
   * @param depth - ネストの深さ
   * @returns 問題（検出されない場合はnull）
   */
  detectInefficientNesting(
    path: NodePath,
    depth: number,
  ): LayoutProblem | null {
    if (depth < DETECTION_THRESHOLDS.inefficientNestingDepth) {
      return null;
    }

    return {
      type: "inefficient-nesting",
      severity: "medium",
      location: path,
      description: `ネストの深さが${depth}レベルあります。HTML構造を簡素化することで、パフォーマンスと可読性が向上する可能性があります。`,
      currentValue: `depth: ${depth}`,
    };
  },

  /**
   * すべての問題を検出する
   *
   * @param styles - スタイル
   * @param path - ノードパス
   * @param childCount - 子要素数
   * @param nestingDepth - ネストの深さ
   * @returns 検出された問題のリスト
   */
  detectAll(
    styles: Styles,
    path: NodePath,
    childCount: number,
    nestingDepth: number,
  ): LayoutProblem[] {
    const problems: LayoutProblem[] = [];

    const missingFlex = ProblemDetector.detectMissingFlexContainer(
      styles,
      path,
      childCount,
    );
    if (missingFlex) problems.push(missingFlex);

    const missingAlignment = ProblemDetector.detectMissingAlignment(
      styles,
      path,
    );
    if (missingAlignment) problems.push(missingAlignment);

    const inconsistentSpacing = ProblemDetector.detectInconsistentSpacing(
      styles,
      path,
    );
    if (inconsistentSpacing) problems.push(inconsistentSpacing);

    const suboptimalDirection = ProblemDetector.detectSuboptimalDirection(
      styles,
      path,
      childCount,
    );
    if (suboptimalDirection) problems.push(suboptimalDirection);

    const inefficientNesting = ProblemDetector.detectInefficientNesting(
      path,
      nestingDepth,
    );
    if (inefficientNesting) problems.push(inefficientNesting);

    return problems;
  },

  /**
   * スペーシング値をパースする
   *
   * @param value - CSS値（"10px", "16.5px" など）
   * @param options - パースオプション
   * @param options.allowUnitless - 単位なしの数値を許容するかどうか
   *   - true（デフォルト）: Figma APIやインラインスタイルで使用される単位なし数値を受け入れる
   *   - false: CSS仕様に従い、"px"が必須。単位なしの場合は0を返す
   *
   * 注: em, rem, %などの他の単位は現在サポートしていません（pxのみ）
   *
   * @returns 数値（px単位）。パース失敗時は0
   *
   * @example
   * ```ts
   * // デフォルト: 単位なしも許容
   * parseSpacingValue("10px")   // => 10
   * parseSpacingValue("10")     // => 10
   *
   * // 厳密モード: pxが必須
   * parseSpacingValue("10px", { allowUnitless: false })  // => 10
   * parseSpacingValue("10", { allowUnitless: false })    // => 0
   * ```
   */
  parseSpacingValue(
    value: string | undefined,
    options: { allowUnitless?: boolean } = {},
  ): number {
    const { allowUnitless = true } = options;

    if (!value) return 0;

    if (allowUnitless) {
      // 数値 + オプショナルな "px" にマッチ
      const match = value.match(/^(\d+(?:\.\d+)?)(px)?$/);
      if (match) {
        return parseFloat(match[1]);
      }
    } else {
      // px必須モード: "px"で終わる値のみ受け入れる
      const match = value.match(/^(\d+(?:\.\d+)?)px$/);
      if (match) {
        return parseFloat(match[1]);
      }
    }

    return 0;
  },

  /**
   * padding値をパースして各方向の値を取得する
   *
   * @param padding - padding値
   * @returns 各方向の値の配列 [top, right, bottom, left]
   */
  parsePaddingValues(padding: string): number[] {
    const parts = padding
      .split(/\s+/)
      .map((p) => ProblemDetector.parseSpacingValue(p));

    switch (parts.length) {
      case 1:
        return [parts[0], parts[0], parts[0], parts[0]];
      case 2:
        return [parts[0], parts[1], parts[0], parts[1]];
      case 3:
        return [parts[0], parts[1], parts[2], parts[1]];
      case 4:
        return parts;
      default:
        return [0, 0, 0, 0];
    }
  },
};
