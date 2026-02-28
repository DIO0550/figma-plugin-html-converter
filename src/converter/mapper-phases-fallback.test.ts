import { afterEach, describe, test, expect, vi } from "vitest";
import { HTMLNode } from "./models/html-node";

afterEach(() => {
  vi.restoreAllMocks();
});

// --- nullフォールバック回帰テスト ---
// vi.doMock + vi.resetModules を使うためdescribeスコープで管理

describe("nullフォールバック回帰テスト", () => {
  afterEach(() => {
    vi.resetModules();
  });

  test("p要素 - pコンバーターがnull返却時にテキストノードにフォールバック", async () => {
    vi.resetModules();
    vi.doMock("./elements/text/p", () => ({
      mapToFigma: () => null,
    }));
    const { mapHTMLNodeToFigma: mapFn } = await import("./mapper");

    const node: HTMLNode = {
      type: "element",
      tagName: "p",
      children: [{ type: "text", textContent: "paragraph text" }],
    };
    const result = mapFn(node);

    // pコンバーターがnullを返すと、isTextElement判定でTEXTノードにフォールバック
    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("p");
  });

  test("a要素 - aコンバーターがnull返却時にテキストノードにフォールバック", async () => {
    vi.resetModules();
    vi.doMock("./elements/text/a", () => ({
      AConverter: { mapToFigma: () => null },
    }));
    const { mapHTMLNodeToFigma: mapFn } = await import("./mapper");

    const node: HTMLNode = {
      type: "element",
      tagName: "a",
      attributes: { href: "https://example.com" },
      children: [{ type: "text", textContent: "link" }],
    };
    const result = mapFn(node);

    // aコンバーターがnullを返すと、isTextElement判定でTEXTノードにフォールバック
    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("a");
  });

  test("progress要素 - progressコンバーターがnull返却時にフレームにフォールバック", async () => {
    vi.resetModules();
    vi.doMock("./elements/form/progress", () => ({
      mapToFigma: () => null,
    }));
    const { mapHTMLNodeToFigma: mapFn } = await import("./mapper");

    const node: HTMLNode = {
      type: "element",
      tagName: "progress",
      attributes: { value: "50", max: "100" },
    };
    const result = mapFn(node);

    // progressコンバーターがnullを返すとデフォルトフレーム生成
    expect(result.type).toBe("FRAME");
    expect(result.name).toBe("progress");
  });

  test("time要素 - inlineSemanticコンバーターがnull返却時にフレームにフォールバック", async () => {
    vi.resetModules();
    vi.doMock("./elements/text/time", () => ({
      TimeConverter: { mapToFigma: () => null },
    }));
    const { mapHTMLNodeToFigma: mapFn } = await import("./mapper");

    const node: HTMLNode = {
      type: "element",
      tagName: "time",
      children: [{ type: "text", textContent: "2024-01-01" }],
    };
    const result = mapFn(node);

    // timeはisTextElementに含まれないため、デフォルトフレーム生成にフォールバック
    expect(result.type).toBe("FRAME");
    expect(result.name).toBe("time");
  });
});
