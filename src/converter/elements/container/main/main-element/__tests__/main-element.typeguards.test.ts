import { describe, it, expect } from "vitest";
import { MainElement } from "../main-element";

describe("MainElement.isMainElement", () => {
  it("main要素の場合trueを返すこと", () => {
    const element = {
      type: "element",
      tagName: "main",
      attributes: {},
    };

    expect(MainElement.isMainElement(element)).toBe(true);
  });

  it("type='element'でない場合falseを返すこと", () => {
    const element = {
      type: "text",
      tagName: "main",
      attributes: {},
    };

    expect(MainElement.isMainElement(element)).toBe(false);
  });

  it("tagName='main'でない場合falseを返すこと", () => {
    const element = {
      type: "element",
      tagName: "div",
      attributes: {},
    };

    expect(MainElement.isMainElement(element)).toBe(false);
  });

  it("nullの場合falseを返すこと", () => {
    expect(MainElement.isMainElement(null)).toBe(false);
  });

  it("undefinedの場合falseを返すこと", () => {
    expect(MainElement.isMainElement(undefined)).toBe(false);
  });

  it("オブジェクトでない場合falseを返すこと", () => {
    expect(MainElement.isMainElement("main")).toBe(false);
    expect(MainElement.isMainElement(123)).toBe(false);
    expect(MainElement.isMainElement(true)).toBe(false);
  });

  it("必要なプロパティが不足している場合falseを返すこと", () => {
    expect(MainElement.isMainElement({ type: "element" })).toBe(false);
    expect(MainElement.isMainElement({ tagName: "main" })).toBe(false);
    expect(MainElement.isMainElement({})).toBe(false);
  });
});
