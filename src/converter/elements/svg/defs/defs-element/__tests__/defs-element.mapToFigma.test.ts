import { describe, test, expect } from "vitest";
import { DefsElement } from "../defs-element";

describe("DefsElement.mapToFigma", () => {
  test("defs要素はnullを返す（描画されない）", () => {
    const element = DefsElement.create();

    const config = DefsElement.mapToFigma(element);

    expect(config).toBeNull();
  });

  test("定義を含むdefs要素もnullを返す", () => {
    const element = DefsElement.create({}, [
      {
        type: "element",
        tagName: "linearGradient",
        attributes: { id: "grad1" },
      },
    ]);

    const config = DefsElement.mapToFigma(element);

    expect(config).toBeNull();
  });

  test("HTMLNodeのdefs要素もnullを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "defs",
      attributes: {},
    };

    const config = DefsElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("defs要素以外の場合、nullを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "g",
      attributes: {},
    };

    const config = DefsElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("nullの場合、nullを返す", () => {
    const config = DefsElement.mapToFigma(null);

    expect(config).toBeNull();
  });
});
