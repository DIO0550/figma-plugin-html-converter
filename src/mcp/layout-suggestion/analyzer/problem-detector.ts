/**
 * 問題点検出器
 *
 * レイアウトの問題点を検出するロジック
 */
import type { LayoutProblem, NodePath } from "../types";
import { Styles } from "../../../converter/models/styles";
import { Flexbox } from "../../../converter/models/flexbox";

/**
 * 検出閾値
 */
const DETECTION_THRESHOLDS = {
  /** Flexコンテナを推奨する最小子要素数 */
  MIN_CHILDREN_FOR_FLEX: 2,
  /** 非効率なネストと判断する深さ */
  INEFFICIENT_NESTING_DEPTH: 4,
  /** 横並びで方向変更を推奨する最小子要素数 */
  MIN_CHILDREN_FOR_DIRECTION_CHECK: 4,
  /** 狭いコンテナと判断する幅（px） */
  NARROW_CONTAINER_WIDTH: 300,
} as const;

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
    if (childCount < DETECTION_THRESHOLDS.MIN_CHILDREN_FOR_FLEX) {
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

    /**
     * スペーシングの不一致を検出するロジック:
     *
     * 条件1: gap > 0 && uniquePaddingValues.size > 1
     *   - gapが設定されている（Flexboxでスペーシングを使用）
     *   - かつ、paddingの各方向の値が異なる（例: padding: 10px 20px）
     *
     * 条件2: hasInconsistency
     *   - paddingのいずれかの値がgapとも、padding最初の値とも異なる
     *   - つまり、スペーシングに3種類以上の値が存在する状態
     *   - 例: gap: 10px, padding: 10px 20px 30px → 10, 20, 30の3種類
     *
     * これにより「意図的に異なる値を使用している」のではなく、
     * 「一貫性なく値がバラついている」状態を検出する
     */
    if (gap > 0 && uniquePaddingValues.size > 1) {
      const hasInconsistency = paddingValues.some(
        (p) => p !== gap && p !== paddingValues[0],
      );
      if (hasInconsistency) {
        return {
          type: "inconsistent-spacing",
          severity: "low",
          location: path,
          description:
            "スペーシング値（gap、padding）に一貫性がありません。デザインの一貫性のために、同じ値を使用することを検討してください。",
          currentValue: `gap: ${gap}px, padding: ${padding}`,
        };
      }
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

    if (childCount < DETECTION_THRESHOLDS.MIN_CHILDREN_FOR_DIRECTION_CHECK) {
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
      width < DETECTION_THRESHOLDS.NARROW_CONTAINER_WIDTH
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
    if (depth < DETECTION_THRESHOLDS.INEFFICIENT_NESTING_DEPTH) {
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
   * @param value - CSS値
   * @returns 数値（px）
   */
  parseSpacingValue(value: string | undefined): number {
    if (!value) return 0;

    const match = value.match(/^(\d+(?:\.\d+)?)(px)?$/);
    if (match) {
      return parseFloat(match[1]);
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
