import { describe, it, expect, vi } from "vitest";
import { MainElement } from "../main-element";
import { HTMLToFigmaMapper } from "../../../../../mapper";
import type { FigmaNodeConfig } from "../../../../../models/figma-node";
import type { HTMLNode } from "../../../../../models/html-node";

vi.mock("../../../../../mapper", () => ({
  HTMLToFigmaMapper: {
    mapNode: vi.fn(),
  },
}));

describe("MainElement.mapToFigma", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("main要素でない場合nullを返すこと", () => {
    expect(MainElement.mapToFigma(null)).toBeNull();
    expect(MainElement.mapToFigma(undefined)).toBeNull();
    expect(MainElement.mapToFigma("main")).toBeNull();
    expect(
      MainElement.mapToFigma({ type: "text", content: "text" }),
    ).toBeNull();
    expect(
      MainElement.mapToFigma({
        type: "element",
        tagName: "div",
        attributes: {},
      }),
    ).toBeNull();
  });

  it("基本的なmain要素をFigmaノードに変換できること", () => {
    const element = MainElement.create();
    const result = MainElement.mapToFigma(element);

    expect(result).toMatchObject({
      type: "FRAME",
      name: "main",
      layoutMode: "VERTICAL",
      children: [],
    });
  });

  it("子要素がない場合空配列を設定すること", () => {
    const element = MainElement.create();
    const result = MainElement.mapToFigma(element);

    expect(result?.children).toEqual([]);
  });

  it("子要素を正しく処理すること", () => {
    const childFigmaNode1: FigmaNodeConfig = {
      type: "FRAME",
      name: "section",
    };
    const childFigmaNode2: FigmaNodeConfig = {
      type: "TEXT",
      name: "text",
      characters: "Hello",
    };

    (HTMLToFigmaMapper.mapNode as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(childFigmaNode1)
      .mockReturnValueOnce(childFigmaNode2);

    const children: HTMLNode[] = [
      { type: "element", tagName: "section", attributes: {}, children: [] },
      { type: "text", content: "Hello" },
    ];

    const element = MainElement.create({}, children);
    const result = MainElement.mapToFigma(element);

    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(2);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenNthCalledWith(1, children[0]);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenNthCalledWith(2, children[1]);
    expect(result?.children).toEqual([childFigmaNode1, childFigmaNode2]);
  });

  it("nullを返す子要素をフィルタリングすること", () => {
    const childFigmaNode: FigmaNodeConfig = {
      type: "FRAME",
      name: "div",
    };

    (HTMLToFigmaMapper.mapNode as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(childFigmaNode)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(childFigmaNode);

    const children: HTMLNode[] = [
      { type: "element", tagName: "div", attributes: {}, children: [] },
      { type: "comment", content: "comment" },
      { type: "element", tagName: "div", attributes: {}, children: [] },
    ];

    const element = MainElement.create({}, children);
    const result = MainElement.mapToFigma(element);

    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(3);
    expect(result?.children).toEqual([childFigmaNode, childFigmaNode]);
  });

  it("属性とスタイルが正しく適用されること", () => {
    const element = MainElement.create({
      id: "main-content",
      className: "main container",
      style: "display: flex; padding: 20px; background-color: #f5f5f5;",
    });

    const result = MainElement.mapToFigma(element);

    expect(result).toMatchObject({
      type: "FRAME",
      name: "main#main-content.main.container",
      layoutMode: "HORIZONTAL",
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
    });

    expect(result?.fills).toBeDefined();
    expect(result?.fills).toHaveLength(1);
  });

  it("複雑な子要素構造を持つmain要素を正しく処理すること", () => {
    const nestedChildFigmaNode: FigmaNodeConfig = {
      type: "FRAME",
      name: "article",
    };
    const textFigmaNode: FigmaNodeConfig = {
      type: "TEXT",
      name: "text",
      characters: "Content",
    };

    (HTMLToFigmaMapper.mapNode as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(nestedChildFigmaNode)
      .mockReturnValueOnce(textFigmaNode)
      .mockReturnValueOnce(null);

    const children: HTMLNode[] = [
      {
        type: "element",
        tagName: "article",
        attributes: { id: "article1" },
        children: [{ type: "text", content: "Article content" }],
      },
      { type: "text", content: "Content" },
      { type: "comment", content: "This is a comment" },
    ];

    const element = MainElement.create(
      { id: "main", style: "padding: 16px;" },
      children,
    );
    const result = MainElement.mapToFigma(element);

    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(3);
    expect(result).toMatchObject({
      type: "FRAME",
      name: "main#main",
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      children: [nestedChildFigmaNode, textFigmaNode],
    });
  });

  it("子要素がundefinedの場合空配列を設定すること", () => {
    const element = {
      type: "element" as const,
      tagName: "main" as const,
      attributes: {},
      children: undefined,
    };

    const result = MainElement.mapToFigma(element);
    expect(result?.children).toEqual([]);
    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
  });
});
