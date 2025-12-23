/**
 * @fileoverview progress要素の型ガードのテスト
 */

import { expect, test } from "vitest";
import { ProgressElement } from "../progress-element";

test("ProgressElement.isProgressElement: 有効なprogress要素をtrueと判定する", () => {
  const node = {
    type: "element" as const,
    tagName: "progress" as const,
    attributes: {},
  };

  expect(ProgressElement.isProgressElement(node)).toBe(true);
});

test("ProgressElement.isProgressElement: progress以外の要素をfalseと判定する", () => {
  const node = {
    type: "element" as const,
    tagName: "div" as const,
    attributes: {},
  };

  expect(ProgressElement.isProgressElement(node)).toBe(false);
  expect(ProgressElement.isProgressElement(null)).toBe(false);
  expect(ProgressElement.isProgressElement(undefined)).toBe(false);
  expect(ProgressElement.isProgressElement("progress")).toBe(false);
});
