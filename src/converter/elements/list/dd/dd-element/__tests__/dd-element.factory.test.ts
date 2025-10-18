/**
 * @fileoverview DdElement ファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { DdElement } from "../dd-element";

test("DdElement.create: creates default DdElement", () => {
  const element = DdElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "dd",
    attributes: {},
    children: [],
  });
});

test("DdElement.create: creates DdElement with attributes", () => {
  const attributes = {
    id: "definition-1",
    class: "glossary-definition",
  };
  const element = DdElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("DdElement.create: creates DdElement with children", () => {
  const children = [
    {
      type: "text" as const,
      content: "A programming interface for applications",
    },
  ];
  const element = DdElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("DdElement.create: creates DdElement with multiple attributes and children", () => {
  const attributes = {
    id: "api-definition",
    class: "definition technical-definition",
    style: "margin-left: 20px;",
  };
  const children = [
    {
      type: "text" as const,
      content:
        "An API is a set of rules and protocols for building and integrating application software.",
    },
  ];
  const element = DdElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
