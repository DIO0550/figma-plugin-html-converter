/**
 * @fileoverview fieldset要素のコンバーターのテスト
 */

import { test, expect } from "vitest";
import { FieldsetElement } from "../../fieldset-element";
import { toFigmaNode, mapToFigma } from "../fieldset-converter";

test("toFigmaNode: 基本的なfieldset要素を変換できる", () => {
  const element = FieldsetElement.create();
  const config = toFigmaNode(element);

  expect(config.name).toBe("fieldset");
  expect(config.layoutMode).toBe("VERTICAL");
});

test("toFigmaNode: fieldset要素に枠線を設定する", () => {
  const element = FieldsetElement.create({ name: "contact" });
  const config = toFigmaNode(element);

  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBeGreaterThan(0);
  expect(config.strokeWeight).toBe(1);
});

test("toFigmaNode: fieldset要素にパディングを設定する", () => {
  const element = FieldsetElement.create({ name: "address" });
  const config = toFigmaNode(element);

  expect(config.paddingLeft).toBe(12);
  expect(config.paddingRight).toBe(12);
  expect(config.paddingTop).toBe(12);
  expect(config.paddingBottom).toBe(12);
});

test("toFigmaNode: disabled属性がある場合に不透明度を設定する", () => {
  const element = FieldsetElement.create({ name: "info", disabled: true });
  const config = toFigmaNode(element);

  expect(config.opacity).toBe(0.5);
});

test("toFigmaNode: disabled属性がない場合は不透明度を設定しない", () => {
  const element = FieldsetElement.create({ name: "info", disabled: false });
  const config = toFigmaNode(element);

  expect(config.opacity).toBeUndefined();
});

test("toFigmaNode: 子要素がある場合に子要素を配置する", () => {
  const children = [
    { type: "element" as const, tagName: "legend" as const, attributes: {} },
    { type: "element" as const, tagName: "input" as const, attributes: {} },
  ];
  const element = FieldsetElement.create({ name: "form-group" }, children);
  const config = toFigmaNode(element);

  // 子要素はコンバーターでは設定されない（親の責任）
  expect(config.children).toBeUndefined();
});

test("toFigmaNode: ID属性からノード名を設定する", () => {
  const element = FieldsetElement.create({ id: "personal-fieldset" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("fieldset#personal-fieldset");
});

test("toFigmaNode: class属性からノード名を設定する", () => {
  const element = FieldsetElement.create({ class: "form-fieldset custom" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("fieldset.form-fieldset");
});

test("toFigmaNode: name属性からノード名を設定する", () => {
  const element = FieldsetElement.create({ name: "contact-info" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("fieldset[name=contact-info]");
});

test("toFigmaNode: レイアウトモードをVERTICALに設定する", () => {
  const element = FieldsetElement.create({ name: "info" });
  const config = toFigmaNode(element);

  expect(config.layoutMode).toBe("VERTICAL");
  expect(config.primaryAxisAlignItems).toBe("MIN");
  expect(config.counterAxisAlignItems).toBe("MIN");
});

test("toFigmaNode: 要素間のスペーシングを設定する", () => {
  const element = FieldsetElement.create({ name: "info" });
  const config = toFigmaNode(element);

  expect(config.itemSpacing).toBe(8);
});

test("mapToFigma: FieldsetElement型のノードを変換できる", () => {
  const element = FieldsetElement.create({ name: "contact" });
  const config = mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("fieldset[name=contact]");
});

test("mapToFigma: HTMLNode型のfieldset要素を変換できる", () => {
  const htmlNode = {
    type: "element",
    tagName: "fieldset",
    attributes: { name: "personal" },
    children: [],
  };
  const config = mapToFigma(htmlNode);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("fieldset[name=personal]");
});

test("mapToFigma: fieldset要素以外の場合nullを返す", () => {
  const notFieldset = {
    type: "element",
    tagName: "input",
    attributes: {},
  };
  const config = mapToFigma(notFieldset);

  expect(config).toBeNull();
});

test("mapToFigma: nullの場合nullを返す", () => {
  expect(mapToFigma(null)).toBeNull();
});

test("mapToFigma: undefinedの場合nullを返す", () => {
  expect(mapToFigma(undefined)).toBeNull();
});

test("mapToFigma: 文字列の場合nullを返す", () => {
  expect(mapToFigma("fieldset")).toBeNull();
});

test("mapToFigma: 数値の場合nullを返す", () => {
  expect(mapToFigma(123)).toBeNull();
});
