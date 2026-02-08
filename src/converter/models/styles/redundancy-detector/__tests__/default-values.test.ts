import { test, expect } from "vitest";
import {
  getDefaultDisplay,
  getDefaultValue,
  isDefaultValue,
  CSS_DEFAULT_VALUES,
} from "../default-values";

test("getDefaultDisplay - ブロック要素 - blockを返す", () => {
    expect(getDefaultDisplay("div")).toBe("block");
    expect(getDefaultDisplay("section")).toBe("block");
    expect(getDefaultDisplay("p")).toBe("block");
    expect(getDefaultDisplay("h1")).toBe("block");
    expect(getDefaultDisplay("h6")).toBe("block");
});

test("getDefaultDisplay - インライン要素 - inlineを返す", () => {
    expect(getDefaultDisplay("span")).toBe("inline");
    expect(getDefaultDisplay("a")).toBe("inline");
    expect(getDefaultDisplay("strong")).toBe("inline");
    expect(getDefaultDisplay("em")).toBe("inline");
});

test("getDefaultDisplay - テーブル要素 - 対応displayを返す", () => {
    expect(getDefaultDisplay("table")).toBe("table");
    expect(getDefaultDisplay("tr")).toBe("table-row");
    expect(getDefaultDisplay("td")).toBe("table-cell");
    expect(getDefaultDisplay("th")).toBe("table-cell");
    expect(getDefaultDisplay("thead")).toBe("table-header-group");
    expect(getDefaultDisplay("tbody")).toBe("table-row-group");
});

test("getDefaultDisplay - リスト要素 - list-itemを返す", () => {
    expect(getDefaultDisplay("li")).toBe("list-item");
});

test("getDefaultDisplay - フォーム要素 - inline-blockを返す", () => {
    expect(getDefaultDisplay("img")).toBe("inline-block");
    expect(getDefaultDisplay("input")).toBe("inline-block");
    expect(getDefaultDisplay("button")).toBe("inline-block");
});

test("getDefaultDisplay - 大文字小文字混在 - 正規化して判定", () => {
    expect(getDefaultDisplay("DIV")).toBe("block");
    expect(getDefaultDisplay("Span")).toBe("inline");
});

test("getDefaultDisplay - 不明要素 - inlineを返す", () => {
    expect(getDefaultDisplay("custom-element")).toBe("inline");
});

test("getDefaultValue - displayでtagName指定 - tag別値を返す", () => {
    expect(getDefaultValue("display", "div")).toBe("block");
    expect(getDefaultValue("display", "span")).toBe("inline");
    expect(getDefaultValue("display", "table")).toBe("table");
});

test("getDefaultValue - displayでtagNameなし - undefinedを返す", () => {
    expect(getDefaultValue("display")).toBeUndefined();
});

test("getDefaultValue - 汎用プロパティ - デフォルト値を返す", () => {
    expect(getDefaultValue("position")).toBe("static");
    expect(getDefaultValue("opacity")).toBe("1");
    expect(getDefaultValue("visibility")).toBe("visible");
    expect(getDefaultValue("float")).toBe("none");
});

test("getDefaultValue - 未定義プロパティ - undefinedを返す", () => {
    expect(getDefaultValue("color")).toBeUndefined();
    expect(getDefaultValue("width")).toBeUndefined();
});

test("isDefaultValue - デフォルト値一致 - trueを返す", () => {
    expect(isDefaultValue("position", "static")).toBe(true);
    expect(isDefaultValue("opacity", "1")).toBe(true);
    expect(isDefaultValue("float", "none")).toBe(true);
});

test("isDefaultValue - デフォルト値不一致 - falseを返す", () => {
    expect(isDefaultValue("position", "relative")).toBe(false);
    expect(isDefaultValue("opacity", "0.5")).toBe(false);
});

test("isDefaultValue - 0px値 - 0として一致", () => {
    expect(isDefaultValue("margin-top", "0px")).toBe(true);
    expect(isDefaultValue("margin-top", "0em")).toBe(true);
    expect(isDefaultValue("margin-top", "0rem")).toBe(true);
    expect(isDefaultValue("padding-left", "0px")).toBe(true);
});

test("isDefaultValue - !important付き - falseを返す", () => {
    expect(isDefaultValue("position", "static !important")).toBe(false);
    expect(isDefaultValue("opacity", "1 !important")).toBe(false);
});

test("isDefaultValue - CSS変数含有 - falseを返す", () => {
    expect(isDefaultValue("opacity", "var(--opacity)")).toBe(false);
    expect(isDefaultValue("position", "var(--pos)")).toBe(false);
});

test("isDefaultValue - displayとtagName - 判定が変わる", () => {
    expect(isDefaultValue("display", "block", "div")).toBe(true);
    expect(isDefaultValue("display", "inline", "span")).toBe(true);
    expect(isDefaultValue("display", "block", "span")).toBe(false);
    expect(isDefaultValue("display", "inline", "div")).toBe(false);
});

test("isDefaultValue - 未定義プロパティ - falseを返す", () => {
    expect(isDefaultValue("color", "red")).toBe(false);
    expect(isDefaultValue("width", "100px")).toBe(false);
});

test("isDefaultValue - 前後空白あり - 正規化して判定", () => {
    expect(isDefaultValue("position", " static ")).toBe(true);
});

test("CSS_DEFAULT_VALUES - 主要プロパティ - 定義されている", () => {
    expect(CSS_DEFAULT_VALUES["position"]).toBe("static");
    expect(CSS_DEFAULT_VALUES["opacity"]).toBe("1");
    expect(CSS_DEFAULT_VALUES["visibility"]).toBe("visible");
    expect(CSS_DEFAULT_VALUES["overflow"]).toBe("visible");
    expect(CSS_DEFAULT_VALUES["float"]).toBe("none");
    expect(CSS_DEFAULT_VALUES["flex-grow"]).toBe("0");
    expect(CSS_DEFAULT_VALUES["flex-shrink"]).toBe("1");
    expect(CSS_DEFAULT_VALUES["box-sizing"]).toBe("content-box");
});
