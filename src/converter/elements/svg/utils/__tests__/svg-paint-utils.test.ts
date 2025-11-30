import { describe, test, expect } from "vitest";
import { SvgPaintUtils } from "../svg-paint-utils";
import type { SvgBaseAttributes } from "../../svg-attributes";

describe("SvgPaintUtils", () => {
  describe("parseFillToPaint", () => {
    test("16進数カラーからSolidPaintを生成する", () => {
      const attributes: SvgBaseAttributes = { fill: "#ff0000" };
      const paint = SvgPaintUtils.parseFillToPaint(attributes);

      expect(paint).not.toBeNull();
      expect(paint?.type).toBe("SOLID");
      if (paint?.type === "SOLID") {
        expect(paint.color.r).toBe(1);
        expect(paint.color.g).toBe(0);
        expect(paint.color.b).toBe(0);
      }
    });

    test("名前付きカラーからSolidPaintを生成する", () => {
      const attributes: SvgBaseAttributes = { fill: "blue" };
      const paint = SvgPaintUtils.parseFillToPaint(attributes);

      expect(paint).not.toBeNull();
      expect(paint?.type).toBe("SOLID");
      if (paint?.type === "SOLID") {
        expect(paint.color.r).toBe(0);
        expect(paint.color.g).toBe(0);
        expect(paint.color.b).toBe(1);
      }
    });

    test("fill='none'の場合nullを返す", () => {
      const attributes: SvgBaseAttributes = { fill: "none" };
      const paint = SvgPaintUtils.parseFillToPaint(attributes);

      expect(paint).toBeNull();
    });

    test("fill属性がない場合デフォルトで黒のPaintを返す", () => {
      const attributes: SvgBaseAttributes = {};
      const paint = SvgPaintUtils.parseFillToPaint(attributes);

      expect(paint).not.toBeNull();
      expect(paint?.type).toBe("SOLID");
      if (paint?.type === "SOLID") {
        expect(paint.color.r).toBe(0);
        expect(paint.color.g).toBe(0);
        expect(paint.color.b).toBe(0);
      }
    });

    test("fill-opacityが設定されている場合、opacityを適用する", () => {
      const attributes: SvgBaseAttributes = {
        fill: "#ff0000",
        "fill-opacity": "0.5",
      };
      const paint = SvgPaintUtils.parseFillToPaint(attributes);

      expect(paint).not.toBeNull();
      expect(paint?.opacity).toBe(0.5);
    });

    test("rgb()形式のカラーをパースする", () => {
      const attributes: SvgBaseAttributes = { fill: "rgb(255, 128, 0)" };
      const paint = SvgPaintUtils.parseFillToPaint(attributes);

      expect(paint).not.toBeNull();
      expect(paint?.type).toBe("SOLID");
      if (paint?.type === "SOLID") {
        expect(paint.color.r).toBeCloseTo(1, 2);
        expect(paint.color.g).toBeCloseTo(0.502, 2);
        expect(paint.color.b).toBe(0);
      }
    });
  });

  describe("parseStrokeToPaint", () => {
    test("16進数カラーからSolidPaintを生成する", () => {
      const attributes: SvgBaseAttributes = { stroke: "#00ff00" };
      const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

      expect(paint).not.toBeNull();
      expect(paint?.type).toBe("SOLID");
      if (paint?.type === "SOLID") {
        expect(paint.color.r).toBe(0);
        expect(paint.color.g).toBe(1);
        expect(paint.color.b).toBe(0);
      }
    });

    test("stroke='none'の場合nullを返す", () => {
      const attributes: SvgBaseAttributes = { stroke: "none" };
      const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

      expect(paint).toBeNull();
    });

    test("stroke属性がない場合nullを返す", () => {
      const attributes: SvgBaseAttributes = {};
      const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

      expect(paint).toBeNull();
    });

    test("stroke-opacityが設定されている場合、opacityを適用する", () => {
      const attributes: SvgBaseAttributes = {
        stroke: "#0000ff",
        "stroke-opacity": "0.7",
      };
      const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

      expect(paint).not.toBeNull();
      expect(paint?.opacity).toBe(0.7);
    });
  });

  describe("getStrokeWeight", () => {
    test("stroke-widthの値を取得する", () => {
      const attributes: SvgBaseAttributes = { "stroke-width": "2" };
      const weight = SvgPaintUtils.getStrokeWeight(attributes);

      expect(weight).toBe(2);
    });

    test("stroke-widthがない場合デフォルト値1を返す", () => {
      const attributes: SvgBaseAttributes = {};
      const weight = SvgPaintUtils.getStrokeWeight(attributes);

      expect(weight).toBe(1);
    });

    test("stroke-widthが0の場合0を返す", () => {
      const attributes: SvgBaseAttributes = { "stroke-width": "0" };
      const weight = SvgPaintUtils.getStrokeWeight(attributes);

      expect(weight).toBe(0);
    });
  });

  describe("createFills", () => {
    test("fillからPaint配列を生成する", () => {
      const attributes: SvgBaseAttributes = { fill: "#ff0000" };
      const fills = SvgPaintUtils.createFills(attributes);

      expect(fills.length).toBe(1);
      expect(fills[0].type).toBe("SOLID");
    });

    test("fill='none'の場合空配列を返す", () => {
      const attributes: SvgBaseAttributes = { fill: "none" };
      const fills = SvgPaintUtils.createFills(attributes);

      expect(fills.length).toBe(0);
    });
  });

  describe("createStrokes", () => {
    test("strokeからPaint配列を生成する", () => {
      const attributes: SvgBaseAttributes = { stroke: "#00ff00" };
      const strokes = SvgPaintUtils.createStrokes(attributes);

      expect(strokes.length).toBe(1);
      expect(strokes[0].type).toBe("SOLID");
    });

    test("stroke属性がない場合空配列を返す", () => {
      const attributes: SvgBaseAttributes = {};
      const strokes = SvgPaintUtils.createStrokes(attributes);

      expect(strokes.length).toBe(0);
    });
  });
});
