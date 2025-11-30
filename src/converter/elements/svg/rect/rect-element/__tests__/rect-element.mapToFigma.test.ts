import { describe, test, expect } from "vitest";
import { RectElement } from "../rect-element";

describe("RectElement.mapToFigma", () => {
  test("正常なRectElementオブジェクトをマッピングする", () => {
    const node = {
      type: "element",
      tagName: "rect",
      attributes: {
        x: "10",
        y: "20",
        width: "100",
        height: "50",
      },
    };

    const config = RectElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.name).toBe("rect");
    expect(config?.type).toBe("RECTANGLE");
  });

  test("HTMLNodeライクな構造をマッピングする", () => {
    const node = {
      type: "element",
      tagName: "rect",
      attributes: {
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        fill: "#ff0000",
      },
    };

    const config = RectElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.fills?.length).toBe(1);
  });

  test("異なるタグ名の場合nullを返す", () => {
    const node = {
      type: "element",
      tagName: "circle",
      attributes: {},
    };

    const config = RectElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("nullの場合nullを返す", () => {
    const config = RectElement.mapToFigma(null);

    expect(config).toBeNull();
  });

  test("undefinedの場合nullを返す", () => {
    const config = RectElement.mapToFigma(undefined);

    expect(config).toBeNull();
  });
});
