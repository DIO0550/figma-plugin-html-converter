import { test, expect } from "vitest";
import { Styles } from "../../styles";
import { RedundancyDetector } from "../redundancy-detector";

test("RedundancyDetector.detect - 空スタイル - 何も検出しない", () => {
    const styles = Styles.parse("");
    expect(RedundancyDetector.detect(styles)).toEqual([]);
});

test("RedundancyDetector.detect - 複合スタイル - 複数タイプを検出", () => {
    const styles = Styles.parse(
      "position: static; margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px",
    );
    const issues = RedundancyDetector.detect(styles);
    expect(issues.length).toBeGreaterThan(0);

    const types = issues.map((i) => i.type);
    expect(types).toContain("default-value");
    expect(types).toContain("shorthand-opportunity");
});

test(
  "RedundancyDetector.detect - longhandがデフォルト値のみ - shorthand提案しない",
  () => {
    const styles = Styles.parse(
      "margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0",
    );
    const issues = RedundancyDetector.detect(styles);
    const types = issues.map((i) => i.type);
    expect(types).toContain("default-value");
    expect(types).not.toContain("shorthand-opportunity");
  },
);

test("RedundancyDetector.detectDuplicates - Styles入力 - 重複を検出しない", () => {
    const styles = Styles.parse("color: red");
    expect(RedundancyDetector.detectDuplicates(styles)).toEqual([]);
});

test("RedundancyDetector.detectDefaults - デフォルト値含む - issuesを返す", () => {
    const styles = Styles.parse("position: static; opacity: 1");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(2);
    expect(issues[0].type).toBe("default-value");
    expect(issues[0].property).toBe("position");
    expect(issues[1].property).toBe("opacity");
});

test("RedundancyDetector.detectDefaults - 非デフォルト値のみ - 空配列", () => {
    const styles = Styles.parse("position: relative; opacity: 0.5");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(0);
});

test("RedundancyDetector.detectDefaults - tagName指定 - display判定が変わる", () => {
    const styles = Styles.parse("display: block");
    expect(RedundancyDetector.detectDefaults(styles, "div")).toHaveLength(1);
    expect(RedundancyDetector.detectDefaults(styles, "span")).toHaveLength(0);
});

test("RedundancyDetector.detectDefaults - !important付き - 検出しない", () => {
    const styles = Styles.parse("position: static !important");
    expect(RedundancyDetector.detectDefaults(styles)).toHaveLength(0);
});

test("RedundancyDetector.detectDefaults - CSS変数含有 - 検出しない", () => {
    const styles = Styles.parse("opacity: var(--opacity)");
    expect(RedundancyDetector.detectDefaults(styles)).toHaveLength(0);
});

test("RedundancyDetector.detectDefaults - 0px - デフォルト値として検出", () => {
    const styles = Styles.parse("margin-top: 0px");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].property).toBe("margin-top");
});

test("RedundancyDetector.detectDefaults - 単一プロパティ - 検出する", () => {
    const styles = Styles.parse("float: none");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(1);
});

test(
  "RedundancyDetector.detectShorthandOpportunities - margin longhand揃い - 提案する",
  () => {
    const styles = Styles.parse(
      "margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe("shorthand-opportunity");
    expect(issues[0].property).toBe("margin");
    expect(issues[0].suggestedValue).toBe("margin: 10px");
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - padding longhand揃い - 提案する",
  () => {
    const styles = Styles.parse(
      "padding-top: 5px; padding-right: 10px; padding-bottom: 5px; padding-left: 10px",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].suggestedValue).toBe("padding: 5px 10px");
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - border longhand揃い - 提案する",
  () => {
    const styles = Styles.parse(
      "border-width: 1px; border-style: solid; border-color: red",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].suggestedValue).toBe("border: 1px solid red");
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - longhand不足 - 提案しない",
  () => {
    const styles = Styles.parse("margin-top: 10px; margin-right: 10px");
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(0);
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - shorthand既存 - 提案しない",
  () => {
    const styles = Styles.parse(
      "margin: 10px; margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(0);
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - longhandがデフォルト値 - 提案しない",
  () => {
    const styles = Styles.parse(
      "margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(0);
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - longhandが0pxデフォルト - 提案しない",
  () => {
    const styles = Styles.parse(
      "margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(0);
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - padding longhandがデフォルト値 - 提案しない",
  () => {
    const styles = Styles.parse(
      "padding-top: 0; padding-right: 0; padding-bottom: 0; padding-left: 0",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(0);
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - 一部デフォルト値 - 提案する",
  () => {
    const styles = Styles.parse(
      "margin-top: 10px; margin-right: 0; margin-bottom: 10px; margin-left: 0",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].suggestedValue).toBe("margin: 10px 0");
  },
);

test(
  "RedundancyDetector.detectShorthandOpportunities - tagName指定 - 呼び出し可能",
  () => {
    const styles = Styles.parse(
      "margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(
      styles,
      "div",
    );
    expect(issues).toHaveLength(0);
  },
);

test(
  "RedundancyDetector.detectShorthandLonghandConflictsFromStyles - 混在あり - issueを返す",
  () => {
    const styles = Styles.parse("margin: 10px; margin-top: 20px");
    const issues =
      RedundancyDetector.detectShorthandLonghandConflictsFromStyles(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe("duplicate-property");
    expect(issues[0].severity).toBe("high");
    expect(issues[0].property).toBe("margin-top");
  },
);

test(
  "RedundancyDetector.detectShorthandLonghandConflictsFromStyles - 混在なし - 空配列",
  () => {
    const styles = Styles.parse("margin-top: 10px; padding-top: 20px");
    const issues =
      RedundancyDetector.detectShorthandLonghandConflictsFromStyles(styles);
    expect(issues).toHaveLength(0);
  },
);

test("RedundancyDetector.detect - 大量プロパティ - 配列を返す", () => {
    const props = Array.from(
      { length: 100 },
      (_, i) => `--custom-${i}: value${i}`,
    ).join("; ");
    const styles = Styles.parse(props);
    const issues = RedundancyDetector.detect(styles);
    expect(Array.isArray(issues)).toBe(true);
});

test(
  "RedundancyDetector.detectDefaults - デフォルト値混在 - 対象のみ検出",
  () => {
    const styles = Styles.parse(
      "position: static; color: red; opacity: 1; font-size: 16px",
    );
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(2);
    const properties = issues.map((i) => i.property);
    expect(properties).toContain("position");
    expect(properties).toContain("opacity");
  },
);
