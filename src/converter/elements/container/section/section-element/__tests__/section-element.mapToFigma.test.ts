import { test, expect } from "vitest";
import { SectionElement } from "../section-element";

test("[SectionElement.mapToFigma] HTMLNodeをFigmaノードにマッピングできる", () => {
  const htmlNode = {
    type: "element",
    tagName: "section",
    attributes: {
      id: "mapped-section",
      class: "content",
    },
    children: [],
  };

  const figmaNode = SectionElement.mapToFigma(htmlNode);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode?.type).toBe("FRAME");
  expect(figmaNode?.name).toBe("section#mapped-section.content");
});

test("[SectionElement.mapToFigma] 属性なしのHTMLNodeをマッピングできる", () => {
  const htmlNode = {
    type: "element",
    tagName: "section",
    children: [],
  };

  const figmaNode = SectionElement.mapToFigma(htmlNode);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode?.type).toBe("FRAME");
  expect(figmaNode?.name).toBe("section");
});

test("[SectionElement.mapToFigma] attributes属性がnullのHTMLNodeをマッピングできる", () => {
  const htmlNode = {
    type: "element",
    tagName: "section",
    attributes: null,
    children: [],
  };

  const figmaNode = SectionElement.mapToFigma(htmlNode);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode?.type).toBe("FRAME");
});

test("[SectionElement.mapToFigma] 互換性のないノードの場合はnullを返す", () => {
  const htmlNode = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const figmaNode = SectionElement.mapToFigma(htmlNode);
  expect(figmaNode).toBeNull();
});

test("[SectionElement.mapToFigma] typeが異なるノードの場合はnullを返す", () => {
  const htmlNode = {
    type: "text",
    content: "text content",
  };

  const figmaNode = SectionElement.mapToFigma(htmlNode);
  expect(figmaNode).toBeNull();
});

test("[SectionElement.mapToFigma] SectionElement型のオブジェクトを直接処理できる", () => {
  const element = SectionElement.create({
    id: "direct-section",
    class: "wrapper",
  });

  const figmaNode = SectionElement.mapToFigma(element);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode?.type).toBe("FRAME");
  expect(figmaNode?.name).toBe("section#direct-section.wrapper");
});

test("[SectionElement.mapToFigma] nullを渡した場合はnullを返す", () => {
  const figmaNode = SectionElement.mapToFigma(null);
  expect(figmaNode).toBeNull();
});

test("[SectionElement.mapToFigma] undefinedを渡した場合はnullを返す", () => {
  const figmaNode = SectionElement.mapToFigma(undefined);
  expect(figmaNode).toBeNull();
});
