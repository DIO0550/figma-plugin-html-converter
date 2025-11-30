import { describe, test, expect } from "vitest";
import { SvgAttributes, type SvgBaseAttributes } from "../svg-attributes";

describe("SvgAttributes", () => {
  describe("getFill", () => {
    test("fill属性の値を取得する", () => {
      const attributes: SvgBaseAttributes = { fill: "#ff0000" };
      expect(SvgAttributes.getFill(attributes)).toBe("#ff0000");
    });

    test("fill属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getFill(attributes)).toBeUndefined();
    });
  });

  describe("getStroke", () => {
    test("stroke属性の値を取得する", () => {
      const attributes: SvgBaseAttributes = { stroke: "blue" };
      expect(SvgAttributes.getStroke(attributes)).toBe("blue");
    });

    test("stroke属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getStroke(attributes)).toBeUndefined();
    });
  });

  describe("getStrokeWidth", () => {
    test("stroke-width属性を数値として取得する", () => {
      const attributes: SvgBaseAttributes = { "stroke-width": "2" };
      expect(SvgAttributes.getStrokeWidth(attributes)).toBe(2);
    });

    test("stroke-width属性が数値の場合そのまま返す", () => {
      const attributes: SvgBaseAttributes = { "stroke-width": 3 };
      expect(SvgAttributes.getStrokeWidth(attributes)).toBe(3);
    });

    test("stroke-width属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getStrokeWidth(attributes)).toBeUndefined();
    });

    test("無効な値の場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = { "stroke-width": "invalid" };
      expect(SvgAttributes.getStrokeWidth(attributes)).toBeUndefined();
    });
  });

  describe("getOpacity", () => {
    test("opacity属性を0-1の数値として取得する", () => {
      const attributes: SvgBaseAttributes = { opacity: "0.5" };
      expect(SvgAttributes.getOpacity(attributes)).toBe(0.5);
    });

    test("opacity属性が数値の場合そのまま返す", () => {
      const attributes: SvgBaseAttributes = { opacity: 0.7 };
      expect(SvgAttributes.getOpacity(attributes)).toBe(0.7);
    });

    test("opacity属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getOpacity(attributes)).toBeUndefined();
    });

    test("1より大きい値は1に制限する", () => {
      const attributes: SvgBaseAttributes = { opacity: 1.5 };
      expect(SvgAttributes.getOpacity(attributes)).toBe(1);
    });

    test("0より小さい値は0に制限する", () => {
      const attributes: SvgBaseAttributes = { opacity: -0.5 };
      expect(SvgAttributes.getOpacity(attributes)).toBe(0);
    });
  });

  describe("getFillOpacity", () => {
    test("fill-opacity属性を0-1の数値として取得する", () => {
      const attributes: SvgBaseAttributes = { "fill-opacity": "0.8" };
      expect(SvgAttributes.getFillOpacity(attributes)).toBe(0.8);
    });

    test("fill-opacity属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getFillOpacity(attributes)).toBeUndefined();
    });
  });

  describe("getStrokeOpacity", () => {
    test("stroke-opacity属性を0-1の数値として取得する", () => {
      const attributes: SvgBaseAttributes = { "stroke-opacity": "0.6" };
      expect(SvgAttributes.getStrokeOpacity(attributes)).toBe(0.6);
    });

    test("stroke-opacity属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getStrokeOpacity(attributes)).toBeUndefined();
    });
  });

  describe("isFillNone", () => {
    test("fill='none'の場合trueを返す", () => {
      const attributes: SvgBaseAttributes = { fill: "none" };
      expect(SvgAttributes.isFillNone(attributes)).toBe(true);
    });

    test("fillが他の値の場合falseを返す", () => {
      const attributes: SvgBaseAttributes = { fill: "red" };
      expect(SvgAttributes.isFillNone(attributes)).toBe(false);
    });

    test("fillがundefinedの場合falseを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.isFillNone(attributes)).toBe(false);
    });
  });

  describe("isStrokeNone", () => {
    test("stroke='none'の場合trueを返す", () => {
      const attributes: SvgBaseAttributes = { stroke: "none" };
      expect(SvgAttributes.isStrokeNone(attributes)).toBe(true);
    });

    test("strokeが他の値の場合falseを返す", () => {
      const attributes: SvgBaseAttributes = { stroke: "blue" };
      expect(SvgAttributes.isStrokeNone(attributes)).toBe(false);
    });
  });

  describe("getStrokeLinecap", () => {
    test("stroke-linecap属性の値を取得する", () => {
      const attributes: SvgBaseAttributes = { "stroke-linecap": "round" };
      expect(SvgAttributes.getStrokeLinecap(attributes)).toBe("round");
    });

    test("stroke-linecap属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getStrokeLinecap(attributes)).toBeUndefined();
    });
  });

  describe("getStrokeLinejoin", () => {
    test("stroke-linejoin属性の値を取得する", () => {
      const attributes: SvgBaseAttributes = { "stroke-linejoin": "bevel" };
      expect(SvgAttributes.getStrokeLinejoin(attributes)).toBe("bevel");
    });

    test("stroke-linejoin属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getStrokeLinejoin(attributes)).toBeUndefined();
    });
  });

  describe("getTransform", () => {
    test("transform属性の値を取得する", () => {
      const attributes: SvgBaseAttributes = {
        transform: "translate(10, 20)",
      };
      expect(SvgAttributes.getTransform(attributes)).toBe("translate(10, 20)");
    });

    test("transform属性がない場合はundefinedを返す", () => {
      const attributes: SvgBaseAttributes = {};
      expect(SvgAttributes.getTransform(attributes)).toBeUndefined();
    });
  });
});
