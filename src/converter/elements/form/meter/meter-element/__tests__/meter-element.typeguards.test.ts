/**
 * @fileoverview meter要素の型ガードのテスト
 */

import { expect, test } from "vitest";
import { MeterElement } from "../meter-element";

test("MeterElement.isMeterElement: 有効なmeter要素をtrueと判定する", () => {
  const node = {
    type: "element" as const,
    tagName: "meter" as const,
    attributes: {},
  };

  expect(MeterElement.isMeterElement(node)).toBe(true);
});

test("MeterElement.isMeterElement: meter以外をfalseと判定する", () => {
  expect(
    MeterElement.isMeterElement({ type: "element", tagName: "div" }),
  ).toBe(false);
  expect(MeterElement.isMeterElement(null)).toBe(false);
  expect(MeterElement.isMeterElement(undefined)).toBe(false);
  expect(MeterElement.isMeterElement("meter")).toBe(false);
});
