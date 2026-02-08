import { test, expect } from "vitest";
import {
  SHORTHAND_RULES,
  canMergeToShorthand,
  buildShorthandValue,
  detectShorthandLonghandConflicts,
} from "../shorthand-rules";

const marginRule = SHORTHAND_RULES.find((r) => r.shorthand === "margin")!;
const paddingRule = SHORTHAND_RULES.find((r) => r.shorthand === "padding")!;
const borderRule = SHORTHAND_RULES.find((r) => r.shorthand === "border")!;

test("canMergeToShorthand - longhandが揃う - trueを返す", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(true);
});

test("canMergeToShorthand - longhand不足 - falseを返す", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(false);
});

test("canMergeToShorthand - shorthand既存 - falseを返す", () => {
    const properties = {
      margin: "10px",
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(false);
});

test("canMergeToShorthand - longhandに!important - falseを返す", () => {
    const properties = {
      "margin-top": "10px !important",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(canMergeToShorthand(marginRule, properties)).toBe(false);
});

test("canMergeToShorthand - longhandにCSS変数 - falseを返す", () => {
    const properties = {
      "padding-top": "var(--space)",
      "padding-right": "10px",
      "padding-bottom": "10px",
      "padding-left": "10px",
    };
    expect(canMergeToShorthand(paddingRule, properties)).toBe(false);
});

test("canMergeToShorthand - borderプロパティ揃い - trueを返す", () => {
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

test("buildShorthandValue - 全値同一 - 単一値になる", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("10px");
});

test("buildShorthandValue - 上下左右同一 - 2値になる", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "20px",
      "margin-bottom": "10px",
      "margin-left": "20px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("10px 20px");
});

test("buildShorthandValue - 左右同一 - 3値になる", () => {
    const properties = {
      "margin-top": "10px",
      "margin-right": "20px",
      "margin-bottom": "30px",
      "margin-left": "20px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("10px 20px 30px");
});

test("buildShorthandValue - 全値異なる - 4値になる", () => {
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

test("buildShorthandValue - 0px値 - 0に正規化", () => {
    const properties = {
      "margin-top": "0px",
      "margin-right": "0px",
      "margin-bottom": "0px",
      "margin-left": "0px",
    };
    expect(buildShorthandValue(marginRule, properties)).toBe("0");
});

test("buildShorthandValue - borderプロパティ - width style color順", () => {
    const properties = {
      "border-width": "1px",
      "border-style": "solid",
      "border-color": "red",
    };
    expect(buildShorthandValue(borderRule, properties)).toBe("1px solid red");
});

test("detectShorthandLonghandConflicts - 混在あり - conflictsを返す", () => {
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

test("detectShorthandLonghandConflicts - 混在なし - 空配列", () => {
    const properties = {
      "margin-top": "10px",
      "padding-top": "20px",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
});

test("detectShorthandLonghandConflicts - shorthandに!important - 空配列", () => {
    const properties = {
      margin: "10px !important",
      "margin-top": "20px",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
});

test("detectShorthandLonghandConflicts - longhandに!important - 空配列", () => {
    const properties = {
      margin: "10px",
      "margin-top": "20px !important",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
});

test("detectShorthandLonghandConflicts - CSS変数含有 - 空配列", () => {
    const properties = {
      margin: "var(--space)",
      "margin-top": "20px",
    };
    expect(detectShorthandLonghandConflicts(properties)).toHaveLength(0);
});

test("detectShorthandLonghandConflicts - 複数混在 - 2件返す", () => {
    const properties = {
      margin: "10px",
      "margin-top": "20px",
      "margin-bottom": "30px",
    };
    const conflicts = detectShorthandLonghandConflicts(properties);
    expect(conflicts).toHaveLength(2);
});
