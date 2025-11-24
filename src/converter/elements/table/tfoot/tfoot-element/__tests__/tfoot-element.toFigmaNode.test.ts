import { test, expect } from "vitest";
import { TfootElement } from "../tfoot-element";

test("TfootElement.toFigmaNode() - デフォルト属性でtfoot要素を変換すると基本的なFrameNodeが生成される", () => {
  const element = TfootElement.create();
  const config = TfootElement.toFigmaNode(element);

  expect(config.name).toBe("tfoot");
  expect(config.type).toBe("FRAME");
});

test("TfootElement.toFigmaNode() - style属性を持つtfoot要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TfootElement.create({
    style: "background-color: #f0f0f0;",
  });
  const config = TfootElement.toFigmaNode(element);

  expect(config.name).toBe("tfoot");
  expect(config.type).toBe("FRAME");
});

test("TfootElement.toFigmaNode() - 複数の属性を持つtfoot要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TfootElement.create({
    className: "footer-section",
    style: "font-weight: bold; border-top: 2px solid #000;",
  });
  const config = TfootElement.toFigmaNode(element);

  expect(config.name).toBe("tfoot");
  expect(config.type).toBe("FRAME");
});

test("TfootElement.toFigmaNode() - id属性を持つtfoot要素を変換するとノード名にIDが含まれる", () => {
  const element = TfootElement.create({ id: "table-footer" });
  const config = TfootElement.toFigmaNode(element);

  expect(config.name).toBe("tfoot#table-footer");
});

test("TfootElement.toFigmaNode() - className属性を持つtfoot要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TfootElement.create({ className: "total-footer" });
  const config = TfootElement.toFigmaNode(element);

  expect(config.name).toBe("tfoot");
});
