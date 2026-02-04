import { test, expect, describe } from "vitest";
import { Styles } from "../../styles";
import { RedundancyDetector } from "../redundancy-detector";

describe("RedundancyDetector.detect", () => {
  test("空のスタイルでは何も検出しない", () => {
    const styles = Styles.parse("");
    expect(RedundancyDetector.detect(styles)).toEqual([]);
  });

  test("全パターンの冗長性を統合検出", () => {
    const styles = Styles.parse(
      "position: static; margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px",
    );
    const issues = RedundancyDetector.detect(styles);
    expect(issues.length).toBeGreaterThan(0);

    const types = issues.map((i) => i.type);
    expect(types).toContain("default-value");
    expect(types).toContain("shorthand-opportunity");
  });
});

describe("RedundancyDetector.detectDuplicates", () => {
  test("Styles型では重複は検出されない（パース時に解決済み）", () => {
    const styles = Styles.parse("color: red");
    expect(RedundancyDetector.detectDuplicates(styles)).toEqual([]);
  });
});

describe("RedundancyDetector.detectDefaults", () => {
  test("デフォルト値を検出", () => {
    const styles = Styles.parse("position: static; opacity: 1");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(2);
    expect(issues[0].type).toBe("default-value");
    expect(issues[0].property).toBe("position");
    expect(issues[1].property).toBe("opacity");
  });

  test("デフォルト値でないものは検出しない", () => {
    const styles = Styles.parse("position: relative; opacity: 0.5");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(0);
  });

  test("要素別デフォルト値を考慮", () => {
    const styles = Styles.parse("display: block");
    expect(RedundancyDetector.detectDefaults(styles, "div")).toHaveLength(1);
    expect(RedundancyDetector.detectDefaults(styles, "span")).toHaveLength(0);
  });

  test("!important付きは除外", () => {
    const styles = Styles.parse("position: static !important");
    expect(RedundancyDetector.detectDefaults(styles)).toHaveLength(0);
  });

  test("CSS変数含有は除外", () => {
    const styles = Styles.parse("opacity: var(--opacity)");
    expect(RedundancyDetector.detectDefaults(styles)).toHaveLength(0);
  });

  test("0px → 0の正規化によるデフォルト値検出", () => {
    const styles = Styles.parse("margin-top: 0px");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].property).toBe("margin-top");
  });

  test("単一プロパティのスタイル", () => {
    const styles = Styles.parse("float: none");
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(1);
  });
});

describe("RedundancyDetector.detectShorthandOpportunities", () => {
  test("margin longhandをshorthandに統合提案", () => {
    const styles = Styles.parse(
      "margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe("shorthand-opportunity");
    expect(issues[0].property).toBe("margin");
    expect(issues[0].suggestedValue).toBe("margin: 10px");
  });

  test("padding longhandをshorthandに統合提案", () => {
    const styles = Styles.parse(
      "padding-top: 5px; padding-right: 10px; padding-bottom: 5px; padding-left: 10px",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].suggestedValue).toBe("padding: 5px 10px");
  });

  test("border longhandをshorthandに統合提案", () => {
    const styles = Styles.parse(
      "border-width: 1px; border-style: solid; border-color: red",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].suggestedValue).toBe("border: 1px solid red");
  });

  test("longhandが不足している場合は提案しない", () => {
    const styles = Styles.parse("margin-top: 10px; margin-right: 10px");
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(0);
  });

  test("shorthandが既に存在する場合は提案しない", () => {
    const styles = Styles.parse(
      "margin: 10px; margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px",
    );
    const issues = RedundancyDetector.detectShorthandOpportunities(styles);
    expect(issues).toHaveLength(0);
  });
});

describe("RedundancyDetector.detectShorthandLonghandConflictsFromStyles", () => {
  test("shorthandとlonghandの混在を検出", () => {
    const styles = Styles.parse("margin: 10px; margin-top: 20px");
    const issues =
      RedundancyDetector.detectShorthandLonghandConflictsFromStyles(styles);
    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe("duplicate-property");
    expect(issues[0].severity).toBe("high");
    expect(issues[0].property).toBe("margin-top");
  });

  test("混在がない場合は空", () => {
    const styles = Styles.parse("margin-top: 10px; padding-top: 20px");
    const issues =
      RedundancyDetector.detectShorthandLonghandConflictsFromStyles(styles);
    expect(issues).toHaveLength(0);
  });
});

describe("エッジケース", () => {
  test("大量のプロパティ（100以上）を処理できる", () => {
    const props = Array.from(
      { length: 100 },
      (_, i) => `--custom-${i}: value${i}`,
    ).join("; ");
    const styles = Styles.parse(props);
    const issues = RedundancyDetector.detect(styles);
    expect(Array.isArray(issues)).toBe(true);
  });

  test("デフォルト値と非デフォルト値の混在", () => {
    const styles = Styles.parse(
      "position: static; color: red; opacity: 1; font-size: 16px",
    );
    const issues = RedundancyDetector.detectDefaults(styles);
    expect(issues).toHaveLength(2);
    const properties = issues.map((i) => i.property);
    expect(properties).toContain("position");
    expect(properties).toContain("opacity");
  });
});
