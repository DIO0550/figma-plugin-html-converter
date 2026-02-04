import { test, expect, describe } from "vitest";
import {
  SHORTHAND_RULES,
  canMergeToShorthand,
  buildShorthandValue,
  detectShorthandLonghandConflicts,
} from "../shorthand-rules";

describe("canMergeToShorthand", () => {
  const marginRule = SHORTHAND_RULES.find((r) => r.shorthand === "margin")!;
  const paddingRule = SHORTHAND_RULES.find((r) => r.shorthand === "padding")!;
  const borderRule = SHORTHAND_RULES.find((r) => r.shorthand === "border")!;

  test("全longhandが揃っている場合はtrue", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(true);
  });

  test("longhandが不足している場合はfalse", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(false);
  });

  test("shorthandが既に存在する場合はfalse", () => {
    const properties = {
      margin: "10px",
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(false);
  });

  test("!important付きのlonghandがある場合はfalse", () => {
    const properties = {
      "margin-top": "10px !important",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(false);
  });

  test("CSS変数を含むlonghandがある場合はfalse", () => {
    const properties = {
      "padding-top": "var(--space)",
      "padding-right": "10px",
      "padding-bottom": "10px",
      "padding-left": "10px",
    };
    expect(canMergeToShorthand(paddingRule, properties)).toBe(false);
  });

  test("border: 3プロパティ全てが揃った場合のみtrue", () => {
    expect(
      canMergeToShorthand(borderRule, {
        "border-width": "1px",
        "border-style": "solid",
        "border-color": "red",
      }),
    ).toBe(true);

    expect(
      canMergeToShorthand(borderRule, {
        "border-width": "1px",
        "border-style": "solid",
      }),
    ).toBe(false);
  });
});

describe("buildShorthandValue", () => {
  const marginRule = SHORTHAND_RULES.find((r) => r.shorthand === "margin")!;
  const borderRule = SHORTHAND_RULES.find((r) => r.shorthand === "border")!;

  test("全値同一の場合は単一値", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("10px");
  });

  test("上下/左右同一の場合は2値", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "20px",
      "margin-bottom": "10px",
      "margin-left": "20px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("10px 20px");
  });

  test("左右同一の場合は3値", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "20px",
      "margin-bottom": "30px",
      "margin-left": "20px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("10px 20px 30px");
  });

  test("全値異なる場合は4値", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "20px",
      "margin-bottom": "30px",
      "margin-left": "40px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe(
      "10px 20px 30px 40px",
    );
  });

  test("0値は正規化される", () => {
    const properties = {
      "margin-top": "0px",
      "margin-right": "0px",
      "margin-bottom": "0px",
      "margin-left": "0px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("0");
  });

  test("border: width style colorの順で結合", () => {
    const properties = {
      "border-width": "1px",
      "border-style": "solid",
      "border-color": "red",
    };
    expect(buildShorthandValue(borderRule, properties)).toBe("1px solid red");
  });
});

describe("detectShorthandLonghandConflicts", () => {
  test("shorthandとlonghandの混在を検出", () => {
    const properties = {
      margin: "10px",
      "margin-top": "20px",
    };
    const conflicts = detectShorthandLonghandConflicts(properties);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].shorthand).toBe("margin");
    expect(conflicts[0].longhand).toBe("margin-top");
    expect(conflicts[0].longhandValue).toBe("20px");
  });

  test("混在がない場合は空配列", () => {
    const properties = {
      "margin-top": "10px",
      "padding-top": "20px",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
  });

  test("!important付きshorthandは除外", () => {
    const properties = {
      margin: "10px !important",
      "margin-top": "20px",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
  });

  test("!important付きlonghandは除外", () => {
    const properties = {
      margin: "10px",
      "margin-top": "20px !important",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
  });

  test("CSS変数含有は除外", () => {
    const properties = {
      margin: "var(--space)",
      "margin-top": "20px",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
  });

  test("複数の混在を検出", () => {
    const properties = {
      margin: "10px",
      "margin-top": "20px",
      "margin-bottom": "30px",
    };
    const conflicts = detectShorthandLonghandConflicts(properties);
    expect(conflicts).toHaveLength(2);
  });
});
