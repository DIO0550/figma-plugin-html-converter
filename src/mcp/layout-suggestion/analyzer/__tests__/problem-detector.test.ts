/**
 * ProblemDetector のテスト
 */
import { test, expect, afterEach } from "vitest";
import {
  ProblemDetector,
  configureDetectionThresholds,
  getDetectionThresholds,
  resetDetectionThresholds,
} from "../problem-detector";
import { Styles } from "../../../../converter/models/styles";
import { createNodePath } from "../../types";

// テストの独立性を保つため、各テスト後に検出閾値をリセット
afterEach(() => {
  resetDetectionThresholds();
});

test("ProblemDetector.detectMissingFlexContainer - 子要素が複数ありFlexコンテナでない - 問題を検出する", () => {
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        3,
      );

  expect(problem).not.toBeNull();
  expect(problem?.type).toBe("missing-flex-container");
  expect(problem?.severity).toBe("medium");
});

test("ProblemDetector.detectMissingFlexContainer - Flexコンテナの場合 - 問題を検出しない", () => {
      const styles = Styles.from({ display: "flex" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        3,
      );

  expect(problem).toBeNull();
});

test("ProblemDetector.detectMissingFlexContainer - 子要素が1つ以下 - 問題を検出しない", () => {
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        1,
      );

  expect(problem).toBeNull();
});

test("ProblemDetector.detectMissingAlignment - Flexコンテナで配置指定がない - 問題を検出する", () => {
      const styles = Styles.from({ display: "flex" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

  expect(problem).not.toBeNull();
  expect(problem?.type).toBe("missing-alignment");
  expect(problem?.severity).toBe("low");
});

test("ProblemDetector.detectMissingAlignment - justify-content指定あり - 問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        "justify-content": "center",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

  expect(problem).toBeNull();
});

test("ProblemDetector.detectMissingAlignment - align-items指定あり - 問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        "align-items": "center",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

  expect(problem).toBeNull();
});

test("ProblemDetector.detectMissingAlignment - Flexコンテナでない - 問題を検出しない", () => {
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

  expect(problem).toBeNull();
});

test("ProblemDetector.detectInconsistentSpacing - スペーシング値が一貫していない - 問題を検出する", () => {
      const styles = Styles.from({
        display: "flex",
        gap: "10px",
        padding: "20px 5px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

  expect(problem).not.toBeNull();
  expect(problem?.type).toBe("inconsistent-spacing");
});

test("ProblemDetector.detectInconsistentSpacing - スペーシング値が一貫している - 問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        gap: "10px",
        padding: "10px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

  expect(problem).toBeNull();
});

test("ProblemDetector.detectInconsistentSpacing - gapとpaddingの一部が一致しても不一致な値がある - 問題を検出する", () => {
      // gap: 10px, padding: 10px 20px → paddingの一部がgapと一致するが、
      // 20pxはgap(10px)とも最初のpadding値(10px)とも異なる
      const styles = Styles.from({
        display: "flex",
        gap: "10px",
        padding: "10px 20px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

  expect(problem).not.toBeNull();
});

test("ProblemDetector.detectInconsistentSpacing - gapが0 - 問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        gap: "0px",
        padding: "10px 20px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

  expect(problem).toBeNull();
});

test("ProblemDetector.detectInconsistentSpacing - paddingがない - 問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        gap: "10px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

  expect(problem).toBeNull();
});

test("ProblemDetector.detectInconsistentSpacing - 3種類以上の値がある - 問題を検出する", () => {
  const styles = Styles.from({
    display: "flex",
    gap: "10px",
    padding: "10px 20px 30px",
  });
  const path = createNodePath("root > div");

  const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

  expect(problem).not.toBeNull();
  expect(problem?.type).toBe("inconsistent-spacing");
});

test("ProblemDetector.detectSuboptimalDirection - 横並びで横幅が狭い - 問題を検出する", () => {
      const styles = Styles.from({
        display: "flex",
        "flex-direction": "row",
        width: "200px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectSuboptimalDirection(
        styles,
        path,
        5,
      );

  expect(problem).not.toBeNull();
  expect(problem?.type).toBe("suboptimal-direction");
});

test("ProblemDetector.detectSuboptimalDirection - 子要素が少ない - 問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        "flex-direction": "row",
        width: "200px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectSuboptimalDirection(
        styles,
        path,
        2,
      );

  expect(problem).toBeNull();
});

test("ProblemDetector.detectInefficientNesting - 深いネスト - 問題を検出する", () => {
      const path = createNodePath("root > div > div > div > div > div");

      const problem = ProblemDetector.detectInefficientNesting(path, 5);

  expect(problem).not.toBeNull();
  expect(problem?.type).toBe("inefficient-nesting");
  expect(problem?.severity).toBe("medium");
});

test("ProblemDetector.detectInefficientNesting - 浅いネスト - 問題を検出しない", () => {
      const path = createNodePath("root > div > div");

      const problem = ProblemDetector.detectInefficientNesting(path, 2);

  expect(problem).toBeNull();
});

test("ProblemDetector.detectAll - 複数の問題 - 同時に検出する", () => {
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div > div > div > div > div");

      const problems = ProblemDetector.detectAll(styles, path, 3, 5);

  expect(problems.length).toBeGreaterThan(0);
});

test("ProblemDetector.detectAll - 問題がない - 空の配列を返す", () => {
      const styles = Styles.from({
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        gap: "10px",
        padding: "10px",
      });
      const path = createNodePath("root > div");

      const problems = ProblemDetector.detectAll(styles, path, 0, 1);

  expect(problems.length).toBe(0);
});

test("ProblemDetector.parseSpacingValue - px単位の値 - 正しくパースする", () => {
  expect(ProblemDetector.parseSpacingValue("10px")).toBe(10);
});

test("ProblemDetector.parseSpacingValue - 小数点を含むpx値 - 正しくパースする", () => {
  expect(ProblemDetector.parseSpacingValue("10.5px")).toBe(10.5);
});

test("ProblemDetector.parseSpacingValue - 単位なしの数値 - パースする", () => {
  expect(ProblemDetector.parseSpacingValue("10")).toBe(10);
});

test("ProblemDetector.parseSpacingValue - 無効な値 - 0を返す", () => {
  expect(ProblemDetector.parseSpacingValue("invalid")).toBe(0);
  expect(ProblemDetector.parseSpacingValue("10em")).toBe(0);
  expect(ProblemDetector.parseSpacingValue("10%")).toBe(0);
});

test("ProblemDetector.parseSpacingValue - undefined - 0を返す", () => {
  expect(ProblemDetector.parseSpacingValue(undefined)).toBe(0);
});

test("ProblemDetector.parseSpacingValue - 空文字列 - 0を返す", () => {
  expect(ProblemDetector.parseSpacingValue("")).toBe(0);
});

test("ProblemDetector.parsePaddingValues - 1値の場合 - 全方向に同じ値を適用する", () => {
  const result = ProblemDetector.parsePaddingValues("10px");
  expect(result).toEqual([10, 10, 10, 10]);
});

test("ProblemDetector.parsePaddingValues - 2値の場合 - 上下と左右に値を適用する", () => {
  const result = ProblemDetector.parsePaddingValues("10px 20px");
  expect(result).toEqual([10, 20, 10, 20]);
});

test("ProblemDetector.parsePaddingValues - 3値の場合 - 上、左右、下に値を適用する", () => {
  const result = ProblemDetector.parsePaddingValues("10px 20px 30px");
  expect(result).toEqual([10, 20, 30, 20]);
});

test("ProblemDetector.parsePaddingValues - 4値の場合 - 上右下左の順に値を適用する", () => {
  const result = ProblemDetector.parsePaddingValues("10px 20px 30px 40px");
  expect(result).toEqual([10, 20, 30, 40]);
});

test("ProblemDetector.parsePaddingValues - 空文字列 - 全方向0を返す", () => {
  const result = ProblemDetector.parsePaddingValues("");
  expect(result).toEqual([0, 0, 0, 0]);
});

test("ProblemDetector.parsePaddingValues - 単位なしの数値 - パースできる", () => {
  const result = ProblemDetector.parsePaddingValues("10 20");
  expect(result).toEqual([10, 20, 10, 20]);
});

test("configureDetectionThresholds - 単一のプロパティ - 設定できる", () => {
  configureDetectionThresholds({ minChildrenForFlex: 5 });

  const thresholds = getDetectionThresholds();
  expect(thresholds.minChildrenForFlex).toBe(5);
});

test("configureDetectionThresholds - 複数のプロパティ - 同時に設定できる", () => {
  configureDetectionThresholds({
    minChildrenForFlex: 3,
    narrowContainerWidth: 400,
  });

  const thresholds = getDetectionThresholds();
  expect(thresholds.minChildrenForFlex).toBe(3);
  expect(thresholds.narrowContainerWidth).toBe(400);
});

test("configureDetectionThresholds - すべてのプロパティ - 設定できる", () => {
  configureDetectionThresholds({
    minChildrenForFlex: 3,
    inefficientNestingDepth: 5,
    minChildrenForDirectionCheck: 6,
    narrowContainerWidth: 400,
  });

  const thresholds = getDetectionThresholds();
  expect(thresholds.minChildrenForFlex).toBe(3);
  expect(thresholds.inefficientNestingDepth).toBe(5);
  expect(thresholds.minChildrenForDirectionCheck).toBe(6);
  expect(thresholds.narrowContainerWidth).toBe(400);
});

test("configureDetectionThresholds - 設定した閾値 - 実際の検出に影響する", () => {
  const styles = Styles.from({ display: "block" });
  const path = createNodePath("root > div");

  const problemBefore = ProblemDetector.detectMissingFlexContainer(
    styles,
    path,
    2,
  );
  expect(problemBefore).not.toBeNull();

  configureDetectionThresholds({ minChildrenForFlex: 3 });

  const problemAfter = ProblemDetector.detectMissingFlexContainer(
    styles,
    path,
    2,
  );
  expect(problemAfter).toBeNull();

  const problemWith3 = ProblemDetector.detectMissingFlexContainer(
    styles,
    path,
    3,
  );
  expect(problemWith3).not.toBeNull();
});

test("getDetectionThresholds - デフォルト - デフォルト値を取得できる", () => {
  const thresholds = getDetectionThresholds();

  expect(thresholds.minChildrenForFlex).toBe(2);
  expect(thresholds.inefficientNestingDepth).toBe(4);
  expect(thresholds.minChildrenForDirectionCheck).toBe(4);
  expect(thresholds.narrowContainerWidth).toBe(300);
});

test("getDetectionThresholds - 読み取り専用のコピー - 新しいオブジェクトを返す", () => {
  const thresholds1 = getDetectionThresholds();
  const originalValue = thresholds1.minChildrenForFlex;

  const modified = { ...thresholds1, minChildrenForFlex: 999 };
  expect(modified.minChildrenForFlex).toBe(999);

  const thresholds2 = getDetectionThresholds();
  expect(thresholds2.minChildrenForFlex).toBe(originalValue);

  expect(thresholds1).not.toBe(thresholds2);
  expect(thresholds1).toEqual(thresholds2);
});

test("resetDetectionThresholds - 変更した閾値 - デフォルト値にリセットできる", () => {
  configureDetectionThresholds({
    minChildrenForFlex: 10,
    inefficientNestingDepth: 20,
    minChildrenForDirectionCheck: 30,
    narrowContainerWidth: 1000,
  });

  resetDetectionThresholds();

  const thresholds = getDetectionThresholds();
  expect(thresholds.minChildrenForFlex).toBe(2);
  expect(thresholds.inefficientNestingDepth).toBe(4);
  expect(thresholds.minChildrenForDirectionCheck).toBe(4);
  expect(thresholds.narrowContainerWidth).toBe(300);
});

test("resetDetectionThresholds - リセット後 - 再度設定できる", () => {
  configureDetectionThresholds({ minChildrenForFlex: 5 });
  resetDetectionThresholds();
  configureDetectionThresholds({ minChildrenForFlex: 7 });

  const thresholds = getDetectionThresholds();
  expect(thresholds.minChildrenForFlex).toBe(7);
});
