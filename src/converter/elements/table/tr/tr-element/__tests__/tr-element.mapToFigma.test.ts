import { test, expect, describe } from "vitest";
import { TrElement } from "../tr-element";

describe("TrElement.mapToFigma()", () => {
  test("正常なTrElementオブジェクトをマッピングする", () => {
    const node = {
      type: "element",
      tagName: "tr",
      attributes: {},
      children: [],
    };

    const config = TrElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.name).toBe("tr");
  });

  test("属性を持つTrElementをマッピングする", () => {
    const node = {
      type: "element",
      tagName: "tr",
      attributes: {
        width: "100%",
        height: "50px",
        className: "table-row",
      },
      children: [],
    };

    const config = TrElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.name).toBe("tr");
  });

  test("TrElement.create()で作成した要素をマッピングする", () => {
    const node = TrElement.create({ width: "100%" });
    const config = TrElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.name).toBe("tr");
  });

  test("nullをnullとして返す", () => {
    const config = TrElement.mapToFigma(null);

    expect(config).toBeNull();
  });

  test("undefinedをnullとして返す", () => {
    const config = TrElement.mapToFigma(undefined);

    expect(config).toBeNull();
  });

  test("文字列をnullとして返す", () => {
    const config = TrElement.mapToFigma("tr");

    expect(config).toBeNull();
  });

  test("数値をnullとして返す", () => {
    const config = TrElement.mapToFigma(123);

    expect(config).toBeNull();
  });

  test("配列をnullとして返す", () => {
    const config = TrElement.mapToFigma([]);

    expect(config).toBeNull();
  });

  test("type属性がないオブジェクトをnullとして返す", () => {
    const node = {
      tagName: "tr",
      attributes: {},
      children: [],
    };

    const config = TrElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("tagName属性がないオブジェクトをnullとして返す", () => {
    const node = {
      type: "element",
      attributes: {},
      children: [],
    };

    const config = TrElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("typeがelementでないオブジェクトをnullとして返す", () => {
    const node = {
      type: "text",
      tagName: "tr",
      attributes: {},
      children: [],
    };

    const config = TrElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("tagNameがtrでないオブジェクトをnullとして返す", () => {
    const node = {
      type: "element",
      tagName: "td",
      attributes: {},
      children: [],
    };

    const config = TrElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("空のオブジェクトをnullとして返す", () => {
    const config = TrElement.mapToFigma({});

    expect(config).toBeNull();
  });
});
