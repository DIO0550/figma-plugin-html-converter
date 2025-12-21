/**
 * @fileoverview progress/meter要素の統合テスト
 */

import { describe, test, expect } from "vitest";
import { ProgressElement } from "../progress/progress-element";
import { MeterElement } from "../meter/meter-element";
import {
  mapToFigma as mapProgressToFigma,
  toFigmaNode as progressToFigmaNode,
} from "../progress/progress-converter";
import {
  mapToFigma as mapMeterToFigma,
  toFigmaNode as meterToFigmaNode,
} from "../meter/meter-converter";

describe("Progress/Meter Elements 統合テスト", () => {
  describe("progress/meter要素の型ガード連携", () => {
    test("異なる要素を正しく区別できる", () => {
      const progress = ProgressElement.create();
      const meter = MeterElement.create({ value: 50, max: 100 });

      expect(ProgressElement.isProgressElement(progress)).toBe(true);
      expect(ProgressElement.isProgressElement(meter)).toBe(false);

      expect(MeterElement.isMeterElement(progress)).toBe(false);
      expect(MeterElement.isMeterElement(meter)).toBe(true);
    });
  });

  describe("HTMLノード形式からのマッピング", () => {
    test("progress要素をHTMLノード形式から正しくマッピングできる", () => {
      const progressHtml = {
        type: "element" as const,
        tagName: "progress" as const,
        attributes: { value: "30", max: "100" },
        children: [],
      };

      const node = mapProgressToFigma(progressHtml);

      expect(node).not.toBeNull();
      expect(node?.name).toBe("progress");
      expect(node?.children?.length).toBe(2);
    });

    test("meter要素をHTMLノード形式から正しくマッピングできる", () => {
      const meterHtml = {
        type: "element" as const,
        tagName: "meter" as const,
        attributes: { value: "0.6", min: "0", max: "1" },
        children: [],
      };

      const node = mapMeterToFigma(meterHtml);

      expect(node).not.toBeNull();
      expect(node?.name).toBe("meter");
      expect(node?.children?.length).toBe(2);
    });

    test("異なるタグ名の要素はnullを返す", () => {
      const divHtml = {
        type: "element" as const,
        tagName: "div" as const,
        attributes: {},
        children: [],
      };

      expect(mapProgressToFigma(divHtml)).toBeNull();
      expect(mapMeterToFigma(divHtml)).toBeNull();
    });
  });

  describe("progress要素のindeterminate状態", () => {
    test("value属性なしでindeterminate状態を表現する", () => {
      const progress = ProgressElement.create({ max: "100" });
      const node = progressToFigmaNode(progress);

      const fill = node.children?.[1];
      expect(fill?.width).toBe(0);
    });

    test("value=undefinedでもindeterminate状態として処理される", () => {
      const progress = ProgressElement.create({});
      const node = progressToFigmaNode(progress);

      const fill = node.children?.[1];
      expect(fill?.width).toBe(0);
    });
  });

  describe("meter要素のlow/high/optimum属性の色状態判定", () => {
    test("optimumがhigh以上の場合、高い値がgood", () => {
      const meter = MeterElement.create({
        value: 90,
        min: 0,
        max: 100,
        low: 30,
        high: 70,
        optimum: 100,
      });
      const node = meterToFigmaNode(meter);

      const fill = node.children?.[1];
      // good = green (r: 0.2, g: 0.7, b: 0.2)
      expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
    });

    test("optimumがlow以下の場合、低い値がgood", () => {
      const meter = MeterElement.create({
        value: 10,
        min: 0,
        max: 100,
        low: 30,
        high: 70,
        optimum: 0,
      });
      const node = meterToFigmaNode(meter);

      const fill = node.children?.[1];
      // good = green (r: 0.2, g: 0.7, b: 0.2)
      expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
    });

    test("optimumがlowとhighの間の場合、範囲内がgood", () => {
      const meter = MeterElement.create({
        value: 50,
        min: 0,
        max: 100,
        low: 30,
        high: 70,
        optimum: 50,
      });
      const node = meterToFigmaNode(meter);

      const fill = node.children?.[1];
      // good = green (r: 0.2, g: 0.7, b: 0.2)
      expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
    });

    test("optimum未指定でvalue >= highはgood", () => {
      const meter = MeterElement.create({
        value: 80,
        min: 0,
        max: 100,
        low: 25,
        high: 75,
      });
      const node = meterToFigmaNode(meter);

      const fill = node.children?.[1];
      // good = green (r: 0.2, g: 0.7, b: 0.2)
      expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
    });

    test("optimum未指定でlow <= value < highはcaution", () => {
      const meter = MeterElement.create({
        value: 50,
        min: 0,
        max: 100,
        low: 25,
        high: 75,
      });
      const node = meterToFigmaNode(meter);

      const fill = node.children?.[1];
      // caution = yellow (r: 0.95, g: 0.76, b: 0.2)
      expect(fill?.fills?.[0]?.color.r).toBeCloseTo(0.95);
    });

    test("optimum未指定でvalue < lowはdanger", () => {
      const meter = MeterElement.create({
        value: 10,
        min: 0,
        max: 100,
        low: 25,
        high: 75,
      });
      const node = meterToFigmaNode(meter);

      const fill = node.children?.[1];
      // danger = red (r: 0.9, g: 0.3, b: 0.3)
      expect(fill?.fills?.[0]?.color.r).toBeCloseTo(0.9);
      expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.3);
    });
  });

  describe("progress/meterの共通スタイル", () => {
    test("両要素ともトラックとフィルの2つの子要素を持つ", () => {
      const progress = ProgressElement.create({ value: "50", max: "100" });
      const meter = MeterElement.create({ value: 50, max: 100 });

      const progressNode = progressToFigmaNode(progress);
      const meterNode = meterToFigmaNode(meter);

      expect(progressNode.children?.length).toBe(2);
      expect(meterNode.children?.length).toBe(2);

      expect(progressNode.children?.[0]?.name).toBe("progress-track");
      expect(progressNode.children?.[1]?.name).toBe("progress-fill");
      expect(meterNode.children?.[0]?.name).toBe("meter-track");
      expect(meterNode.children?.[1]?.name).toBe("meter-fill");
    });

    test("両要素ともデフォルトサイズは200x12", () => {
      const progress = ProgressElement.create();
      const meter = MeterElement.create({ value: 50, max: 100 });

      const progressNode = progressToFigmaNode(progress);
      const meterNode = meterToFigmaNode(meter);

      expect(progressNode.width).toBe(200);
      expect(progressNode.height).toBe(12);
      expect(meterNode.width).toBe(200);
      expect(meterNode.height).toBe(12);
    });

    test("両要素ともcornerRadiusは高さの半分", () => {
      const progress = ProgressElement.create({ style: "height: 20px;" });
      const meter = MeterElement.create({
        value: 50,
        max: 100,
        style: "height: 20px;",
      });

      const progressNode = progressToFigmaNode(progress);
      const meterNode = meterToFigmaNode(meter);

      expect(progressNode.children?.[0]?.cornerRadius).toBe(10);
      expect(meterNode.children?.[0]?.cornerRadius).toBe(10);
    });
  });
});
