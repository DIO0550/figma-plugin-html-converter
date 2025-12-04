import { describe, test, expect } from "vitest";
import { PathElement } from "../path-element";

describe("PathElement.mapToFigma", () => {
  test("PathElementオブジェクト - FigmaNodeConfigを返す", () => {
    const element = PathElement.create({ d: "M0 0 L100 100" });
    const config = PathElement.mapToFigma(element);

    expect(config).not.toBeNull();
    expect(config?.type).toBe("FRAME");
  });

  test("HTMLNodeライクな構造 - FigmaNodeConfigを返す", () => {
    const node = {
      type: "element",
      tagName: "path",
      attributes: {
        d: "M10 20 L50 80",
        fill: "#ff0000",
      },
    };
    const config = PathElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.type).toBe("FRAME");
    expect(config?.fills).toHaveLength(1);
  });

  test("異なるタグ名 - nullを返す", () => {
    const node = {
      type: "element",
      tagName: "rect",
      attributes: { d: "M0 0 L100 100" },
    };
    const config = PathElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("null - nullを返す", () => {
    const config = PathElement.mapToFigma(null);
    expect(config).toBeNull();
  });

  test("undefined - nullを返す", () => {
    const config = PathElement.mapToFigma(undefined);
    expect(config).toBeNull();
  });

  test("空オブジェクト - nullを返す", () => {
    const config = PathElement.mapToFigma({});
    expect(config).toBeNull();
  });

  test("stroke属性を持つHTMLNodeライクな構造 - strokesを適用する", () => {
    const node = {
      type: "element",
      tagName: "path",
      attributes: {
        d: "M0 0 L100 100",
        stroke: "#00ff00",
        "stroke-width": "2",
      },
    };
    const config = PathElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.strokes).toHaveLength(1);
    expect(config?.strokeWeight).toBe(2);
  });
});
