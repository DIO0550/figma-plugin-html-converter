/**
 * @fileoverview DtElement ファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { DtElement } from "../dt-element";

test("DtElement.create: creates default DtElement", () => {
  const element = DtElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "dt",
    attributes: {},
    children: [],
  });
});

test("DtElement.create: creates DtElement with attributes", () => {
  const attributes = {
    id: "term-1",
    class: "glossary-term",
  };
  const element = DtElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("DtElement.create: creates DtElement with children", () => {
  const children = [{ type: "text" as const, content: "API" }];
  const element = DtElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("DtElement.create: creates DtElement with multiple attributes and children", () => {
  const attributes = {
    id: "technical-term",
    class: "term definition-term",
    style: "font-weight: bold;",
  };
  const children = [
    { type: "text" as const, content: "Application Programming Interface" },
  ];
  const element = DtElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
