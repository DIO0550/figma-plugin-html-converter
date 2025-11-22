import { test, expect } from "vitest";
import { TheadElement } from "../thead-element";

test("TheadElement.toFigmaNode() - デフォルト属性でthead要素を変換すると基本的なFrameNodeが生成される", () => {
  const element = TheadElement.create();
  const config = TheadElement.toFigmaNode(element);

  expect(config.name).toBe("thead");
  expect(config.type).toBe("FRAME");
});

test("TheadElement.toFigmaNode() - style属性を持つthead要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TheadElement.create({
    style: "background-color: #f0f0f0;",
  });
  const config = TheadElement.toFigmaNode(element);

  expect(config.name).toBe("thead");
  expect(config.type).toBe("FRAME");
});

test("TheadElement.toFigmaNode() - 複数の属性を持つthead要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TheadElement.create({
    className: "header-section",
    style: "border-bottom: 2px solid black; font-weight: bold;",
  });
  const config = TheadElement.toFigmaNode(element);

  expect(config.name).toBe("thead");
  expect(config.type).toBe("FRAME");
});

test("TheadElement.toFigmaNode() - id属性を持つthead要素を変換するとノード名にIDが含まれる", () => {
  const element = TheadElement.create({ id: "table-header" });
  const config = TheadElement.toFigmaNode(element);

  expect(config.name).toBe("thead#table-header");
});

test("TheadElement.toFigmaNode() - className属性を持つthead要素を変換すると正しくFrameNodeに変換される", () => {
  const element = TheadElement.create({ className: "sticky-header" });
  const config = TheadElement.toFigmaNode(element);

  expect(config.name).toBe("thead");
});
