/**
 * @fileoverview DlElement ファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { DlElement } from "../dl-element";

test("DlElement.create: creates default DlElement", () => {
  const element = DlElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "dl",
    attributes: {},
    children: [],
  });
});

test("DlElement.create: creates DlElement with attributes", () => {
  const attributes = {
    id: "glossary",
    class: "definition-list",
  };
  const element = DlElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("DlElement.create: creates DlElement with children", () => {
  const children = [
    { type: "element" as const, tagName: "dt" as const },
    { type: "element" as const, tagName: "dd" as const },
  ];
  const element = DlElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("DlElement.create: creates DlElement with multiple attributes and children", () => {
  const attributes = {
    id: "technical-glossary",
    class: "glossary terms",
    style: "background: #f5f5f5;",
  };
  const children = [
    { type: "element" as const, tagName: "dt" as const },
    { type: "element" as const, tagName: "dd" as const },
  ];
  const element = DlElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
