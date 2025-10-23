/**
 * @fileoverview legend要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { LegendAttributes } from "../legend-attributes";

test("LegendAttributes: GlobalAttributesを継承している", () => {
  const attributes: LegendAttributes = {
    id: "test-legend",
    class: "legend-text",
  };
  expect(attributes.id).toBe("test-legend");
  expect(attributes.class).toBe("legend-text");
});

test("LegendAttributes: すべての属性が省略可能", () => {
  const attributes: LegendAttributes = {};
  expect(attributes).toBeDefined();
});

test("LegendAttributes: 複数の属性を同時に持つことができる", () => {
  const attributes: LegendAttributes = {
    id: "personal-legend",
    class: "legend-header",
    style: "font-weight: bold;",
  };
  expect(attributes.id).toBe("personal-legend");
  expect(attributes.class).toBe("legend-header");
  expect(attributes.style).toBe("font-weight: bold;");
});
