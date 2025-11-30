import { describe, test, expect } from "vitest";
import { LineElement } from "../line-element";

describe("LineElement.mapToFigma", () => {
  test("正常なLineElementオブジェクトをマッピングする", () => {
    const node = {
      type: "element",
      tagName: "line",
      attributes: {
        x1: "10",
        y1: "20",
        x2: "100",
        y2: "80",
      },
    };

    const config = LineElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.name).toBe("line");
    expect(config?.type).toBe("FRAME");
  });

  test("HTMLNodeライクな構造をマッピングする", () => {
    const node = {
      type: "element",
      tagName: "line",
      attributes: {
        x1: 10,
        y1: 20,
        x2: 100,
        y2: 80,
        stroke: "#ff0000",
      },
    };

    const config = LineElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.strokes?.length).toBe(1);
  });

  test("異なるタグ名の場合nullを返す", () => {
    const node = {
      type: "element",
      tagName: "circle",
      attributes: {},
    };

    const config = LineElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("nullの場合nullを返す", () => {
    const config = LineElement.mapToFigma(null);

    expect(config).toBeNull();
  });

  test("undefinedの場合nullを返す", () => {
    const config = LineElement.mapToFigma(undefined);

    expect(config).toBeNull();
  });
});
