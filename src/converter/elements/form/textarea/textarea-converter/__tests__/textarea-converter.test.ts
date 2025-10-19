/**
 * @fileoverview textarea要素のFigma変換ロジックの簡易テスト
 */

import { test, expect } from "vitest";
import { toFigmaNode, mapToFigma } from "../textarea-converter";
import { TextareaElement } from "../../textarea-element";

test("TextareaConverter: 基本的なtextarea要素を変換できる", () => {
  const element = TextareaElement.create();
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("textarea");
  expect(config.layoutMode).toBe("VERTICAL");
  expect(config.minHeight).toBe(80);
});

test("TextareaConverter: placeholder属性が表示される", () => {
  const element = TextareaElement.create({
    placeholder: "メッセージを入力してください",
  });
  const config = toFigmaNode(element);

  expect(config.children).toHaveLength(1);
  expect(config.children?.[0].name).toBe("メッセージを入力してください");
});

test("TextareaConverter: 子要素のテキストが表示される", () => {
  const element = TextareaElement.create({}, [
    {
      type: "text" as const,
      textContent: "既存のテキスト",
    },
  ]);
  const config = toFigmaNode(element);

  expect(config.children).toHaveLength(1);
  expect(config.children?.[0].name).toBe("既存のテキスト");
});

test("TextareaConverter: disabled状態を反映できる", () => {
  const element = TextareaElement.create({ disabled: "disabled" });
  const config = toFigmaNode(element);

  expect(config.fills).toBeDefined();
  expect(config.fills?.[0].type).toBe("SOLID");
  if (config.fills?.[0].type === "SOLID") {
    expect(config.fills[0].color.r).toBeGreaterThan(0.9);
  }
});

test("TextareaConverter: HTMLNodeから変換できる", () => {
  const node = {
    type: "element",
    tagName: "textarea",
    attributes: {},
    children: [],
  };
  const config = mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.type).toBe("FRAME");
});
