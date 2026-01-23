/**
 * ProblemDetector のテスト
 */
import { describe, test, expect, afterEach } from "vitest";
import {
  ProblemDetector,
  configureDetectionThresholds,
  getDetectionThresholds,
  resetDetectionThresholds,
} from "../problem-detector";
import { Styles } from "../../../../converter/models/styles";
import { createNodePath } from "../../types";

describe("ProblemDetector", () => {
  // テストの独立性を保つため、各テスト後に検出閾値をリセット
  afterEach(() => {
    resetDetectionThresholds();
  });

  describe("detectMissingFlexContainer", () => {
    test("子要素が複数あり、Flexコンテナでない場合に問題を検出する", () => {
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

    test("Flexコンテナの場合は問題を検出しない", () => {
      const styles = Styles.from({ display: "flex" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        3,
      );

      expect(problem).toBeNull();
    });

    test("子要素が1つ以下の場合は問題を検出しない", () => {
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        1,
      );

      expect(problem).toBeNull();
    });
  });

  describe("detectMissingAlignment", () => {
    test("Flexコンテナで配置指定がない場合に問題を検出する", () => {
      const styles = Styles.from({ display: "flex" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

      expect(problem).not.toBeNull();
      expect(problem?.type).toBe("missing-alignment");
      expect(problem?.severity).toBe("low");
    });

    test("justify-contentが指定されている場合は問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        "justify-content": "center",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

      expect(problem).toBeNull();
    });

    test("align-itemsが指定されている場合は問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        "align-items": "center",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

      expect(problem).toBeNull();
    });

    test("Flexコンテナでない場合は問題を検出しない", () => {
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectMissingAlignment(styles, path);

      expect(problem).toBeNull();
    });
  });

  describe("detectInconsistentSpacing", () => {
    test("スペーシング値が一貫していない場合に問題を検出する", () => {
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

    test("スペーシング値が一貫している場合は問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        gap: "10px",
        padding: "10px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

      expect(problem).toBeNull();
    });

    test("gapとpaddingの一部が一致しても不一致な値がある場合は問題を検出する", () => {
      // gap: 10px, padding: 10px 20px → paddingの一部がgapと一致するが、
      // 20pxはgap(10px)とも最初のpadding値(10px)とも異なる
      const styles = Styles.from({
        display: "flex",
        gap: "10px",
        padding: "10px 20px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

      // 不一致ロジック: paddingの各値がgapとも最初のpadding値とも異なる場合に検出
      // 20 !== 10 && 20 !== 10 → true なので不一致を検出する
      expect(problem).not.toBeNull();
    });

    test("gapが0の場合は問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        gap: "0px",
        padding: "10px 20px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

      expect(problem).toBeNull();
    });

    test("paddingがない場合は問題を検出しない", () => {
      const styles = Styles.from({
        display: "flex",
        gap: "10px",
      });
      const path = createNodePath("root > div");

      const problem = ProblemDetector.detectInconsistentSpacing(styles, path);

      expect(problem).toBeNull();
    });

    test("3種類以上の値がある場合に問題を検出する", () => {
      // gap: 10px, padding: 10px 20px 30px → 3種類の値が存在
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
  });

  describe("detectSuboptimalDirection", () => {
    test("横並びで横幅が狭い場合に問題を検出する", () => {
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

    test("子要素が少ない場合は問題を検出しない", () => {
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
  });

  describe("detectInefficientNesting", () => {
    test("深いネストで問題を検出する", () => {
      const path = createNodePath("root > div > div > div > div > div");

      const problem = ProblemDetector.detectInefficientNesting(path, 5);

      expect(problem).not.toBeNull();
      expect(problem?.type).toBe("inefficient-nesting");
      expect(problem?.severity).toBe("medium");
    });

    test("浅いネストでは問題を検出しない", () => {
      const path = createNodePath("root > div > div");

      const problem = ProblemDetector.detectInefficientNesting(path, 2);

      expect(problem).toBeNull();
    });
  });

  describe("detectAll", () => {
    test("複数の問題を同時に検出できる", () => {
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div > div > div > div > div");

      const problems = ProblemDetector.detectAll(styles, path, 3, 5);

      expect(problems.length).toBeGreaterThan(0);
    });

    test("問題がない場合は空の配列を返す", () => {
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
  });

  describe("parseSpacingValue", () => {
    test("px単位の値を正しくパースする", () => {
      expect(ProblemDetector.parseSpacingValue("10px")).toBe(10);
    });

    test("小数点を含むpx値を正しくパースする", () => {
      expect(ProblemDetector.parseSpacingValue("10.5px")).toBe(10.5);
    });

    test("単位なしの数値をパースする", () => {
      expect(ProblemDetector.parseSpacingValue("10")).toBe(10);
    });

    test("無効な値は0を返す", () => {
      expect(ProblemDetector.parseSpacingValue("invalid")).toBe(0);
      expect(ProblemDetector.parseSpacingValue("10em")).toBe(0);
      expect(ProblemDetector.parseSpacingValue("10%")).toBe(0);
    });

    test("undefinedは0を返す", () => {
      expect(ProblemDetector.parseSpacingValue(undefined)).toBe(0);
    });

    test("空文字列は0を返す", () => {
      expect(ProblemDetector.parseSpacingValue("")).toBe(0);
    });
  });

  describe("parsePaddingValues", () => {
    test("1値の場合、全方向に同じ値を適用する", () => {
      const result = ProblemDetector.parsePaddingValues("10px");
      expect(result).toEqual([10, 10, 10, 10]);
    });

    test("2値の場合、上下と左右に値を適用する", () => {
      // CSS: padding: 10px 20px → 上下10px、左右20px
      const result = ProblemDetector.parsePaddingValues("10px 20px");
      expect(result).toEqual([10, 20, 10, 20]);
    });

    test("3値の場合、上、左右、下に値を適用する", () => {
      // CSS: padding: 10px 20px 30px → 上10px、左右20px、下30px
      const result = ProblemDetector.parsePaddingValues("10px 20px 30px");
      expect(result).toEqual([10, 20, 30, 20]);
    });

    test("4値の場合、上右下左の順に値を適用する", () => {
      // CSS: padding: 10px 20px 30px 40px → 上10px、右20px、下30px、左40px
      const result = ProblemDetector.parsePaddingValues("10px 20px 30px 40px");
      expect(result).toEqual([10, 20, 30, 40]);
    });

    test("空文字列の場合、全方向0を返す", () => {
      const result = ProblemDetector.parsePaddingValues("");
      expect(result).toEqual([0, 0, 0, 0]);
    });

    test("単位なしの数値もパースできる", () => {
      const result = ProblemDetector.parsePaddingValues("10 20");
      expect(result).toEqual([10, 20, 10, 20]);
    });
  });

  describe("configureDetectionThresholds", () => {
    // NOTE: afterEachは親describeで定義済みのため、ここでの定義は不要

    test("単一のプロパティを設定できる", () => {
      configureDetectionThresholds({ minChildrenForFlex: 5 });

      const thresholds = getDetectionThresholds();
      expect(thresholds.minChildrenForFlex).toBe(5);
    });

    test("複数のプロパティを同時に設定できる", () => {
      configureDetectionThresholds({
        minChildrenForFlex: 3,
        narrowContainerWidth: 400,
      });

      const thresholds = getDetectionThresholds();
      expect(thresholds.minChildrenForFlex).toBe(3);
      expect(thresholds.narrowContainerWidth).toBe(400);
    });

    test("すべてのプロパティを設定できる", () => {
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

    test("設定した閾値が実際の検出に影響する", () => {
      // デフォルトではminChildrenForFlex=2なので、2個で検出される
      const styles = Styles.from({ display: "block" });
      const path = createNodePath("root > div");

      const problemBefore = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        2,
      );
      expect(problemBefore).not.toBeNull();

      // 閾値を3に変更
      configureDetectionThresholds({ minChildrenForFlex: 3 });

      // 2個では検出されなくなる
      const problemAfter = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        2,
      );
      expect(problemAfter).toBeNull();

      // 3個以上で検出される
      const problemWith3 = ProblemDetector.detectMissingFlexContainer(
        styles,
        path,
        3,
      );
      expect(problemWith3).not.toBeNull();
    });
  });

  describe("getDetectionThresholds", () => {
    // NOTE: afterEachは親describeで定義済みのため、ここでの定義は不要

    test("デフォルト値を取得できる", () => {
      const thresholds = getDetectionThresholds();

      expect(thresholds.minChildrenForFlex).toBe(2);
      expect(thresholds.inefficientNestingDepth).toBe(4);
      expect(thresholds.minChildrenForDirectionCheck).toBe(4);
      expect(thresholds.narrowContainerWidth).toBe(300);
    });

    test("読み取り専用のコピーを返す（呼び出しごとに新しいオブジェクトを返す）", () => {
      const thresholds1 = getDetectionThresholds();
      const originalValue = thresholds1.minChildrenForFlex;

      // 新しいオブジェクトを作成して値を変更（型安全なアプローチ）
      const modified = { ...thresholds1, minChildrenForFlex: 999 };
      expect(modified.minChildrenForFlex).toBe(999); // 新しいオブジェクトには反映される

      // 再度取得しても元の値のまま
      const thresholds2 = getDetectionThresholds();
      expect(thresholds2.minChildrenForFlex).toBe(originalValue);

      // 各呼び出しは異なるオブジェクトを返す（参照が異なる）
      expect(thresholds1).not.toBe(thresholds2);
      // しかし値は同じ
      expect(thresholds1).toEqual(thresholds2);
    });
  });

  describe("resetDetectionThresholds", () => {
    test("変更した閾値をデフォルト値にリセットできる", () => {
      // 閾値を変更
      configureDetectionThresholds({
        minChildrenForFlex: 10,
        inefficientNestingDepth: 20,
        minChildrenForDirectionCheck: 30,
        narrowContainerWidth: 1000,
      });

      // リセット
      resetDetectionThresholds();

      // デフォルト値に戻っていることを確認
      const thresholds = getDetectionThresholds();
      expect(thresholds.minChildrenForFlex).toBe(2);
      expect(thresholds.inefficientNestingDepth).toBe(4);
      expect(thresholds.minChildrenForDirectionCheck).toBe(4);
      expect(thresholds.narrowContainerWidth).toBe(300);
    });

    test("リセット後も再度設定できる", () => {
      configureDetectionThresholds({ minChildrenForFlex: 5 });
      resetDetectionThresholds();
      configureDetectionThresholds({ minChildrenForFlex: 7 });

      const thresholds = getDetectionThresholds();
      expect(thresholds.minChildrenForFlex).toBe(7);
    });
  });
});
