import { test, expect } from "vitest";
import { AConverter } from "../a-converter";
import type { AElement } from "../../a-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";
import {
  createAElement,
  createTextNode,
  createElementNode,
  createDefaultTextStyle,
} from "./test-helpers";

test("AConverter.toFigmaNode() - href属性とテキストを持つa要素をTEXTノードに変換する", () => {
  const element = createAElement("https://example.com", [
    createTextNode("リンクテキスト"),
  ]);

  const result = AConverter.toFigmaNode(element);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("a [https://example.com]");
  expect(result.content).toBe("リンクテキスト");
  expect(result.style).toEqual(createDefaultTextStyle());
});

test("AConverter.toFigmaNode() - href属性がない場合、名前にhrefを含めない", () => {
  const element: AElement = {
    type: "element",
    tagName: "a",
    attributes: {},
    children: [createTextNode("テキスト")],
  };

  const result = AConverter.toFigmaNode(element);

  expect(result.name).toBe("a");
  expect(result.content).toBe("テキスト");
});

test("AConverter.toFigmaNode() - 子要素が存在しない場合、contentを空文字列とする", () => {
  const element = createAElement("#");

  const result = AConverter.toFigmaNode(element);

  expect(result.content).toBe("");
});

test("AConverter.toFigmaNode() - children配列が空の場合、contentを空文字列とする", () => {
  const element = createAElement("#", []);

  const result = AConverter.toFigmaNode(element);

  expect(result.content).toBe("");
});

test("AConverter.toFigmaNode() - 複数の子要素からテキストを連結して抽出する", () => {
  const children: HTMLNode[] = [
    createTextNode("Click "),
    createElementNode("strong", [createTextNode("here")]),
    createTextNode(" to continue"),
  ];
  const element = createAElement("https://example.com", children);

  const result = AConverter.toFigmaNode(element);

  expect(result.content).toBe("Click here to continue");
});

test("AConverter.toFigmaNode() - ネストした要素構造からテキストを再帰的に抽出する", () => {
  const children: HTMLNode[] = [
    createElementNode("span", [
      createTextNode("Visit "),
      createElementNode("em", [createTextNode("our")]),
      createTextNode(" site"),
    ]),
  ];
  const element = createAElement("https://example.com", children);

  const result = AConverter.toFigmaNode(element);

  expect(result.content).toBe("Visit our site");
});

test("AConverter.toFigmaNode() - 極端に長いテキストコンテンツを正しく処理する", () => {
  const longText = "a".repeat(10000);
  const element = createAElement("#", [createTextNode(longText)]);

  const result = AConverter.toFigmaNode(element);

  expect(result.content).toBe(longText);
  expect(result.content.length).toBe(10000);
});

test("AConverter.toFigmaNode() - 極端に長いhref値を名前に含める", () => {
  const longUrl = "https://example.com/" + "path/".repeat(100);
  const element = createAElement(longUrl, [createTextNode("Long URL")]);

  const result = AConverter.toFigmaNode(element);

  expect(result.name).toBe(`a [${longUrl}]`);
  expect(result.name.length).toBeGreaterThan(500);
});

test("AConverter.toFigmaNode() - 深くネストした構造から全てのテキストを抽出する", () => {
  const deepStructure: HTMLNode = createElementNode("span", [
    createTextNode("Level 1 "),
    createElementNode("em", [
      createTextNode("Level 2 "),
      createElementNode("strong", [
        createTextNode("Level 3 "),
        createElementNode("u", [createTextNode("Level 4")]),
      ]),
    ]),
  ]);
  const element = createAElement("#", [deepStructure]);

  const result = AConverter.toFigmaNode(element);

  expect(result.content).toBe("Level 1 Level 2 Level 3 Level 4");
});
