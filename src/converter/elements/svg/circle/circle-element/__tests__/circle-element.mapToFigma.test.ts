import { describe, test, expect } from "vitest";
import { CircleElement } from "../circle-element";

describe("CircleElement.mapToFigma", () => {
  test("正常なCircleElementオブジェクトをマッピングする", () => {
    const node = {
      type: "element",
      tagName: "circle",
      attributes: {
        cx: "50",
        cy: "50",
        r: "25",
      },
    };

    const config = CircleElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.name).toBe("circle");
    expect(config?.type).toBe("RECTANGLE");
  });

  test("HTMLNodeライクな構造をマッピングする", () => {
    const node = {
      type: "element",
      tagName: "circle",
      attributes: {
        cx: 100,
        cy: 100,
        r: 50,
        fill: "#ff0000",
      },
    };

    const config = CircleElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.fills?.length).toBe(1);
  });

  test("異なるタグ名の場合nullを返す", () => {
    const node = {
      type: "element",
      tagName: "rect",
      attributes: {},
    };

    const config = CircleElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("nullの場合nullを返す", () => {
    const config = CircleElement.mapToFigma(null);

    expect(config).toBeNull();
  });

  test("undefinedの場合nullを返す", () => {
    const config = CircleElement.mapToFigma(undefined);

    expect(config).toBeNull();
  });

  test("属性がないノードをマッピングする", () => {
    const node = {
      type: "element",
      tagName: "circle",
      attributes: {},
    };

    const config = CircleElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.x).toBe(0);
    expect(config?.y).toBe(0);
  });
});
