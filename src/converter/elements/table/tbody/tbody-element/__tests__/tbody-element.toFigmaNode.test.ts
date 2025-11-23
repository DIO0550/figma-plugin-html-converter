import { test, expect } from "vitest";
import { TbodyElement } from "../tbody-element";

test("TbodyElement.toFigmaNode() - デフォルト属性でtbody要素を変換すると基本的なFrameNodeが生成される", () => {
  const element = TbodyElement.create();
  const config = TbodyElement.toFigmaNode(element);

  expect(config.name).toBe("tbody");
  expect(config.type).toBe("FRAME");
});

test("TbodyElement.toFigmaNode() - style属性を持つtbody要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TbodyElement.create({
    style: "background-color: #ffffff;",
  });
  const config = TbodyElement.toFigmaNode(element);

  expect(config.name).toBe("tbody");
  expect(config.type).toBe("FRAME");
});

test("TbodyElement.toFigmaNode() - 複数の属性を持つtbody要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TbodyElement.create({
    className: "body-section",
    style: "font-size: 14px; color: #333;",
  });
  const config = TbodyElement.toFigmaNode(element);

  expect(config.name).toBe("tbody");
  expect(config.type).toBe("FRAME");
});

test("TbodyElement.toFigmaNode() - id属性を持つtbody要素を変換するとノード名にIDが含まれる", () => {
  const element = TbodyElement.create({ id: "table-body" });
  const config = TbodyElement.toFigmaNode(element);

  expect(config.name).toBe("tbody#table-body");
});

test("TbodyElement.toFigmaNode() - className属性を持つtbody要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TbodyElement.create({ className: "striped-body" });
  const config = TbodyElement.toFigmaNode(element);

  expect(config.name).toBe("tbody");
});
