/**
 * ProblemDetector のテスト
 */
import { describe, test, expect } from "vitest";
import { ProblemDetector } from "../problem-detector";
import { Styles } from "../../../../converter/models/styles";
import { createNodePath } from "../../types";

describe("ProblemDetector", () => {
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
});
