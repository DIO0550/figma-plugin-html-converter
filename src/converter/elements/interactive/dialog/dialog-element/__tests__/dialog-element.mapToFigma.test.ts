import { describe, test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

describe("DialogElement.mapToFigma", () => {
  test("DialogElementを正しくマッピングする", () => {
    const element = DialogElement.create();
    const node = DialogElement.mapToFigma(element);

    expect(node).not.toBeNull();
    expect(node?.type).toBe("FRAME");
    expect(node?.name).toBe("dialog");
  });

  test("HTMLノード形式からマッピングできる", () => {
    const htmlNode = {
      type: "element",
      tagName: "dialog",
      attributes: { id: "confirm-modal" },
      children: [],
    };

    const node = DialogElement.mapToFigma(htmlNode);

    expect(node).not.toBeNull();
    expect(node?.type).toBe("FRAME");
    expect(node?.name).toBe("dialog#confirm-modal");
  });

  test("open属性付きノードをマッピングできる（表示状態）", () => {
    const htmlNode = {
      type: "element",
      tagName: "dialog",
      attributes: { open: true },
      children: [],
    };

    const node = DialogElement.mapToFigma(htmlNode);

    expect(node).not.toBeNull();
    expect(node?.opacity).toBe(1);
  });

  test("open属性なしノードをマッピングできる（非表示状態）", () => {
    const htmlNode = {
      type: "element",
      tagName: "dialog",
      attributes: {},
      children: [],
    };

    const node = DialogElement.mapToFigma(htmlNode);

    expect(node).not.toBeNull();
    expect(node?.opacity).toBe(0);
  });

  test("異なるタグ名のノードはnullを返す", () => {
    const divNode = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };

    const node = DialogElement.mapToFigma(divNode);

    expect(node).toBeNull();
  });

  test("nullを渡すとnullを返す", () => {
    const node = DialogElement.mapToFigma(null);

    expect(node).toBeNull();
  });

  test("undefinedを渡すとnullを返す", () => {
    const node = DialogElement.mapToFigma(undefined);

    expect(node).toBeNull();
  });

  test("detailsタグはnullを返す", () => {
    const detailsNode = {
      type: "element",
      tagName: "details",
      attributes: {},
      children: [],
    };

    const node = DialogElement.mapToFigma(detailsNode);

    expect(node).toBeNull();
  });
});
