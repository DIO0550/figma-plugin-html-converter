import { describe, test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

describe("EllipseElement.mapToFigma", () => {
  test("正常なEllipseElementオブジェクトをマッピングする", () => {
    const node = {
      type: "element",
      tagName: "ellipse",
      attributes: {
        cx: "100",
        cy: "50",
        rx: "80",
        ry: "40",
      },
    };

    const config = EllipseElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.name).toBe("ellipse");
    expect(config?.type).toBe("RECTANGLE");
  });

  test("HTMLNodeライクな構造をマッピングする", () => {
    const node = {
      type: "element",
      tagName: "ellipse",
      attributes: {
        cx: 100,
        cy: 50,
        rx: 80,
        ry: 40,
        fill: "#ff0000",
      },
    };

    const config = EllipseElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.fills?.length).toBe(1);
  });

  test("異なるタグ名の場合nullを返す", () => {
    const node = {
      type: "element",
      tagName: "circle",
      attributes: {},
    };

    const config = EllipseElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("nullの場合nullを返す", () => {
    const config = EllipseElement.mapToFigma(null);

    expect(config).toBeNull();
  });

  test("undefinedの場合nullを返す", () => {
    const config = EllipseElement.mapToFigma(undefined);

    expect(config).toBeNull();
  });
});
