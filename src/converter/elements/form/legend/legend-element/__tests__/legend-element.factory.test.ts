/**
 * @fileoverview legend要素のファクトリー関数のテスト
 */

import { test, expect } from "vitest";
import { LegendElement } from "../legend-element";

test("LegendElement.create: デフォルト値でlegend要素を作成できる", () => {
  const element = LegendElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("legend");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("LegendElement.create: 属性を指定してlegend要素を作成できる", () => {
  const attributes = {
    id: "personal-legend",
    class: "legend-text",
  };
  const element = LegendElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("LegendElement.create: 子要素を指定してlegend要素を作成できる", () => {
  const children = [{ type: "text" as const, textContent: "Personal Info" }];
  const element = LegendElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("LegendElement.create: 属性と子要素の両方を指定してlegend要素を作成できる", () => {
  const attributes = { id: "contact-legend" };
  const children = [{ type: "text" as const, textContent: "Contact" }];
  const element = LegendElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("LegendElement.create: GlobalAttributesを含む属性を設定できる", () => {
  const element = LegendElement.create({
    id: "address-legend",
    class: "legend legend-primary",
    style: "font-weight: bold;",
  });

  expect(element.attributes.id).toBe("address-legend");
  expect(element.attributes.class).toBe("legend legend-primary");
  expect(element.attributes.style).toBe("font-weight: bold;");
});
