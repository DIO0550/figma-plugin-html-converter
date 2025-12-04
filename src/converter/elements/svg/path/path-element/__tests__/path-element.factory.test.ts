import { describe, test, expect } from "vitest";
import { PathElement } from "../path-element";

describe("PathElement.create", () => {
  test("引数なし - デフォルト属性でpath要素を作成する", () => {
    const element = PathElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("path");
    expect(element.attributes).toEqual({});
  });

  test("d属性を指定 - パスデータが設定されたpath要素を作成する", () => {
    const element = PathElement.create({ d: "M0 0 L100 100" });

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("path");
    expect(element.attributes.d).toBe("M0 0 L100 100");
  });

  test("fill属性を指定 - fillが設定されたpath要素を作成する", () => {
    const element = PathElement.create({
      d: "M0 0 L100 100",
      fill: "#ff0000",
    });

    expect(element.attributes.fill).toBe("#ff0000");
  });

  test("stroke属性を指定 - strokeが設定されたpath要素を作成する", () => {
    const element = PathElement.create({
      d: "M0 0 L100 100",
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    expect(element.attributes.stroke).toBe("#00ff00");
    expect(element.attributes["stroke-width"]).toBe(2);
  });

  test("複雑なパスデータ - 全ての属性が保持される", () => {
    const pathData = "M10 10 C20 20 40 20 50 10 S80 0 90 10";
    const element = PathElement.create({
      d: pathData,
      fill: "none",
      stroke: "#000000",
    });

    expect(element.attributes.d).toBe(pathData);
    expect(element.attributes.fill).toBe("none");
    expect(element.attributes.stroke).toBe("#000000");
  });
});
