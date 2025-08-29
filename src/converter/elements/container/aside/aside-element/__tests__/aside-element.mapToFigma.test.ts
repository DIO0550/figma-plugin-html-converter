import { test, expect, vi, beforeEach } from "vitest";
import { AsideElement } from "../aside-element";
import type { AsideElement as AsideElementType } from "../aside-element";

// テスト用のHTMLNode型定義
type TestTextNode = { type: "text"; content: string };
type TestCommentNode = { type: "comment"; content: string };

// HTMLToFigmaMapperのモック
vi.mock("../../../../../mapper", () => ({
  HTMLToFigmaMapper: {
    mapNode: vi.fn(),
  },
}));

import { HTMLToFigmaMapper } from "../../../../../mapper";

beforeEach(() => {
  vi.clearAllMocks();
});

test("AsideElement.mapToFigma: aside要素でない場合はnullを返すこと", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  const result = AsideElement.mapToFigma(node);
  expect(result).toBeNull();
});

test("AsideElement.mapToFigma: aside要素をFigmaノードに変換できること", () => {
  const element: AsideElementType = {
    type: "element",
    tagName: "aside",
    attributes: {
      id: "sidebar",
    },
  };

  const result = AsideElement.mapToFigma(element);

  expect(result).not.toBeNull();
  expect(result?.type).toBe("FRAME");
  expect(result?.name).toBe("aside#sidebar");
  expect(result?.children).toEqual([]);
});

test("AsideElement.mapToFigma: 子要素を持つaside要素を変換できること", () => {
  const childFigmaNode = {
    type: "TEXT" as const,
    name: "text",
    content: "子要素",
  };

  vi.mocked(HTMLToFigmaMapper.mapNode).mockReturnValue(childFigmaNode);

  const element: AsideElementType = {
    type: "element",
    tagName: "aside",
    attributes: {},
    children: [
      {
        type: "text",
        content: "子要素",
      } as TestTextNode,
    ],
  };

  const result = AsideElement.mapToFigma(element);

  expect(result?.children).toEqual([childFigmaNode]);
  expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledWith({
    type: "text",
    content: "子要素",
  });
});

test("AsideElement.mapToFigma: 複数の子要素を持つaside要素を変換できること", () => {
  const child1 = { type: "TEXT" as const, name: "text1", content: "子要素1" };
  const child2 = { type: "TEXT" as const, name: "text2", content: "子要素2" };

  vi.mocked(HTMLToFigmaMapper.mapNode)
    .mockReturnValueOnce(child1)
    .mockReturnValueOnce(child2);

  const element: AsideElementType = {
    type: "element",
    tagName: "aside",
    attributes: {},
    children: [
      { type: "text", content: "子要素1" } as TestTextNode,
      { type: "text", content: "子要素2" } as TestTextNode,
    ],
  };

  const result = AsideElement.mapToFigma(element);

  expect(result?.children).toEqual([child1, child2]);
  expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(2);
});

test("AsideElement.mapToFigma: nullを返す子要素はフィルタリングされること", () => {
  const childFigmaNode = {
    type: "TEXT" as const,
    name: "text",
    content: "有効な子要素",
  };

  vi.mocked(HTMLToFigmaMapper.mapNode)
    .mockReturnValueOnce(null!)
    .mockReturnValueOnce(childFigmaNode)
    .mockReturnValueOnce(null!);

  const element: AsideElementType = {
    type: "element",
    tagName: "aside",
    attributes: {},
    children: [
      { type: "comment", content: "コメント" } as TestCommentNode,
      { type: "text", content: "有効な子要素" } as TestTextNode,
      { type: "comment", content: "別のコメント" } as TestCommentNode,
    ],
  };

  const result = AsideElement.mapToFigma(element);

  expect(result?.children).toEqual([childFigmaNode]);
  expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(3);
});

test("AsideElement.mapToFigma: スタイル付きaside要素を変換できること", () => {
  const element: AsideElementType = {
    type: "element",
    tagName: "aside",
    attributes: {
      id: "sidebar",
      className: "navigation",
      style: "width: 300px; padding: 20px;",
    },
  };

  const result = AsideElement.mapToFigma(element);

  expect(result?.name).toBe("aside#sidebar.navigation");
  expect(result?.width).toBe(300);
  expect(result?.paddingTop).toBe(20);
  expect(result?.paddingRight).toBe(20);
  expect(result?.paddingBottom).toBe(20);
  expect(result?.paddingLeft).toBe(20);
});
