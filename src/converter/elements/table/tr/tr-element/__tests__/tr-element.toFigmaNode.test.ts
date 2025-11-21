import { test, expect, describe } from "vitest";
import { TrElement } from "../tr-element";

describe("TrElement.toFigmaNode()", () => {
  test("基本的なFrameNodeを生成する", () => {
    const element = TrElement.create();
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr");
    expect(config.type).toBe("FRAME");
  });

  test("デフォルト属性でtr要素を変換する", () => {
    const element = TrElement.create();
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr");
    expect(config.type).toBe("FRAME");
  });

  test("width属性を持つtr要素を変換する", () => {
    const element = TrElement.create({ width: "100px" });
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr");
    expect(config.type).toBe("FRAME");
  });

  test("height属性を持つtr要素を変換する", () => {
    const element = TrElement.create({ height: "50px" });
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr");
    expect(config.type).toBe("FRAME");
  });

  test("style属性を持つtr要素を変換する", () => {
    const element = TrElement.create({
      style: "background-color: #f0f0f0;",
    });
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr");
    expect(config.type).toBe("FRAME");
  });

  test("複数の属性を持つtr要素を変換する", () => {
    const element = TrElement.create({
      width: "100%",
      height: "50px",
      className: "table-row",
      style: "border: 1px solid black; padding: 10px;",
    });
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr");
    expect(config.type).toBe("FRAME");
  });

  test("id属性を持つtr要素を変換する", () => {
    const element = TrElement.create({ id: "row-1" });
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr#row-1");
  });

  test("className属性を持つtr要素を変換する", () => {
    const element = TrElement.create({ className: "data-row" });
    const config = TrElement.toFigmaNode(element);

    expect(config.name).toBe("tr");
  });
});
