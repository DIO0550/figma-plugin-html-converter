import { describe, test, expect } from "vitest";
import { GroupElement } from "../group-element";

describe("GroupElement.isGroupElement", () => {
  test("GroupElementの場合、trueを返す", () => {
    const element = GroupElement.create();

    expect(GroupElement.isGroupElement(element)).toBe(true);
  });

  test("tagNameがgで、typeがelementの場合、trueを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "g",
      attributes: {},
    };

    expect(GroupElement.isGroupElement(node)).toBe(true);
  });

  test("tagNameがg以外の場合、falseを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "rect",
      attributes: {},
    };

    expect(GroupElement.isGroupElement(node)).toBe(false);
  });

  test("typeがelement以外の場合、falseを返す", () => {
    const node = {
      type: "text" as const,
      tagName: "g",
      attributes: {},
    };

    expect(GroupElement.isGroupElement(node)).toBe(false);
  });

  test("nullの場合、falseを返す", () => {
    expect(GroupElement.isGroupElement(null)).toBe(false);
  });

  test("undefinedの場合、falseを返す", () => {
    expect(GroupElement.isGroupElement(undefined)).toBe(false);
  });

  test("オブジェクトでない場合、falseを返す", () => {
    expect(GroupElement.isGroupElement("g")).toBe(false);
    expect(GroupElement.isGroupElement(123)).toBe(false);
  });
});
