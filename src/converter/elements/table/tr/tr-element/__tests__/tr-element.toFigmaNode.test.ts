import { test, expect } from "vitest";
import { TrElement } from "../tr-element";

test("TrElement.toFigmaNode - 基本要素を変換 - FrameNode設定を生成する", () => {
  const element = TrElement.create();
  const config = TrElement.toFigmaNode(element);

  expect(config.name).toBe("tr");
  expect(config.type).toBe("FRAME");
});

test("TrElement.toFigmaNode - デフォルト属性 - tr要素名とFRAME型を返す", () => {
  const element = TrElement.create();
  const config = TrElement.toFigmaNode(element);

  expect(config.name).toBe("tr");
  expect(config.type).toBe("FRAME");
});

test("TrElement.toFigmaNode - width属性付き要素 - tr要素名とFRAME型を返す", () => {
  const element = TrElement.create({ width: "100px" });
  const config = TrElement.toFigmaNode(element);

  expect(config.name).toBe("tr");
  expect(config.type).toBe("FRAME");
});

test("TrElement.toFigmaNode - height属性付き要素 - tr要素名とFRAME型を返す", () => {
  const element = TrElement.create({ height: "50px" });
  const config = TrElement.toFigmaNode(element);

  expect(config.name).toBe("tr");
  expect(config.type).toBe("FRAME");
});

test("TrElement.toFigmaNode - style属性付き要素 - tr要素名とFRAME型を返す", () => {
  const element = TrElement.create({
    style: "background-color: #f0f0f0;",
  });
  const config = TrElement.toFigmaNode(element);

  expect(config.name).toBe("tr");
  expect(config.type).toBe("FRAME");
});

test("TrElement.toFigmaNode - 複数属性付き要素 - tr要素名とFRAME型を返す", () => {
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

test("TrElement.toFigmaNode - id属性付き要素 - idを含む名前を返す", () => {
  const element = TrElement.create({ id: "row-1" });
  const config = TrElement.toFigmaNode(element);

  expect(config.name).toBe("tr#row-1");
});

test("TrElement.toFigmaNode - className属性付き要素 - tr要素名を返す", () => {
  const element = TrElement.create({ className: "data-row" });
  const config = TrElement.toFigmaNode(element);

  expect(config.name).toBe("tr");
});
