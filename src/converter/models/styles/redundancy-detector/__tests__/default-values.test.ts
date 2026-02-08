import { test, expect, describe } from "vitest";
import {
  getDefaultDisplay,
  getDefaultValue,
  isDefaultValue,
  CSS_DEFAULT_VALUES,
} from "../default-values";

describe("getDefaultDisplay", () => {
  test("ブロック要素のデフォルトdisplayはblock", () => {
    expect(getDefaultDisplay("div")).toBe("block");
    expect(getDefaultDisplay("section")).toBe("block");
    expect(getDefaultDisplay("p")).toBe("block");
    expect(getDefaultDisplay("h1")).toBe("block");
    expect(getDefaultDisplay("h6")).toBe("block");
  });

  test("インライン要素のデフォルトdisplayはinline", () => {
    expect(getDefaultDisplay("span")).toBe("inline");
    expect(getDefaultDisplay("a")).toBe("inline");
    expect(getDefaultDisplay("strong")).toBe("inline");
    expect(getDefaultDisplay("em")).toBe("inline");
  });

  test("テーブル要素のデフォルトdisplay", () => {
    expect(getDefaultDisplay("table")).toBe("table");
    expect(getDefaultDisplay("tr")).toBe("table-row");
    expect(getDefaultDisplay("td")).toBe("table-cell");
    expect(getDefaultDisplay("th")).toBe("table-cell");
    expect(getDefaultDisplay("thead")).toBe("table-header-group");
    expect(getDefaultDisplay("tbody")).toBe("table-row-group");
  });

  test("リスト要素のデフォルトdisplayはlist-item", () => {
    expect(getDefaultDisplay("li")).toBe("list-item");
  });

  test("フォーム要素のデフォルトdisplayはinline-block", () => {
    expect(getDefaultDisplay("img")).toBe("inline-block");
    expect(getDefaultDisplay("input")).toBe("inline-block");
    expect(getDefaultDisplay("button")).toBe("inline-block");
  });

  test("大文字・小文字を区別しない", () => {
    expect(getDefaultDisplay("DIV")).toBe("block");
    expect(getDefaultDisplay("Span")).toBe("inline");
  });

  test("不明な要素はinlineを返す", () => {
    expect(getDefaultDisplay("custom-element")).toBe("inline");
  });
});

describe("getDefaultValue", () => {
  test("displayプロパティはtagName考慮", () => {
    expect(getDefaultValue("display", "div")).toBe("block");
    expect(getDefaultValue("display", "span")).toBe("inline");
    expect(getDefaultValue("display", "table")).toBe("table");
  });

  test("displayプロパティでtagNameなしの場合はundefined", () => {
    expect(getDefaultValue("display")).toBeUndefined();
  });

  test("汎用デフォルト値を返す", () => {
    expect(getDefaultValue("position")).toBe("static");
    expect(getDefaultValue("opacity")).toBe("1");
    expect(getDefaultValue("visibility")).toBe("visible");
    expect(getDefaultValue("float")).toBe("none");
  });

  test("マップにないプロパティはundefined", () => {
    expect(getDefaultValue("color")).toBeUndefined();
    expect(getDefaultValue("width")).toBeUndefined();
  });
});

describe("isDefaultValue", () => {
  test("デフォルト値と一致する場合true", () => {
    expect(isDefaultValue("position", "static")).toBe(true);
    expect(isDefaultValue("opacity", "1")).toBe(true);
    expect(isDefaultValue("float", "none")).toBe(true);
  });

  test("デフォルト値と一致しない場合false", () => {
    expect(isDefaultValue("position", "relative")).toBe(false);
    expect(isDefaultValue("opacity", "0.5")).toBe(false);
  });

  test("0値の正規化: 0px → 0 として一致", () => {
    expect(isDefaultValue("margin-top", "0px")).toBe(true);
    expect(isDefaultValue("margin-top", "0em")).toBe(true);
    expect(isDefaultValue("margin-top", "0rem")).toBe(true);
    expect(isDefaultValue("padding-left", "0px")).toBe(true);
  });

  test("!important付きは常にfalse", () => {
    expect(isDefaultValue("position", "static !important")).toBe(false);
    expect(isDefaultValue("opacity", "1 !important")).toBe(false);
  });

  test("CSS変数含有は常にfalse", () => {
    expect(isDefaultValue("opacity", "var(--opacity)")).toBe(false);
    expect(isDefaultValue("position", "var(--pos)")).toBe(false);
  });

  test("要素別display判定", () => {
    expect(isDefaultValue("display", "block", "div")).toBe(true);
    expect(isDefaultValue("display", "inline", "span")).toBe(true);
    expect(isDefaultValue("display", "block", "span")).toBe(false);
    expect(isDefaultValue("display", "inline", "div")).toBe(false);
  });

  test("マップにないプロパティは常にfalse", () => {
    expect(isDefaultValue("color", "red")).toBe(false);
    expect(isDefaultValue("width", "100px")).toBe(false);
  });

  test("前後の空白は無視される", () => {
    expect(isDefaultValue("position", " static ")).toBe(true);
  });
});

describe("CSS_DEFAULT_VALUES", () => {
  test("主要なプロパティが定義されている", () => {
    expect(CSS_DEFAULT_VALUES["position"]).toBe("static");
    expect(CSS_DEFAULT_VALUES["opacity"]).toBe("1");
    expect(CSS_DEFAULT_VALUES["visibility"]).toBe("visible");
    expect(CSS_DEFAULT_VALUES["overflow"]).toBe("visible");
    expect(CSS_DEFAULT_VALUES["float"]).toBe("none");
    expect(CSS_DEFAULT_VALUES["flex-grow"]).toBe("0");
    expect(CSS_DEFAULT_VALUES["flex-shrink"]).toBe("1");
    expect(CSS_DEFAULT_VALUES["box-sizing"]).toBe("content-box");
  });
});
