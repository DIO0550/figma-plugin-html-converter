/**
 * @fileoverview input要素のFigma変換ロジックのテスト
 */

import { test, expect } from "vitest";
import { toFigmaNode, mapToFigma } from "../input-converter";
import { InputElement } from "../../input-element";

// テキスト入力系（text, email, password）のテスト

test("toFigmaNode: text型のinputをFigmaフレームに変換できる", () => {
  const element = InputElement.create({ type: "text" });
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("input");
  expect(config.layoutMode).toBe("HORIZONTAL");
});

test("toFigmaNode: placeholder属性が設定される", () => {
  const element = InputElement.create({
    type: "text",
    placeholder: "Enter your name",
  });
  const config = toFigmaNode(element);

  expect(config.children).toHaveLength(1);
  expect(config.children?.[0].type).toBe("TEXT");
  expect(config.children?.[0].name).toBe("Enter your name");
});

test("toFigmaNode: value属性がある場合はvalueが表示される", () => {
  const element = InputElement.create({
    type: "text",
    value: "John Doe",
    placeholder: "Enter your name",
  });
  const config = toFigmaNode(element);

  expect(config.children).toHaveLength(1);
  expect(config.children?.[0].name).toBe("John Doe");
});

test("toFigmaNode: email型のinputを変換できる", () => {
  const element = InputElement.create({
    type: "email",
    placeholder: "Enter email",
  });
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.children?.[0].name).toBe("Enter email");
});

test("toFigmaNode: password型のinputを変換できる", () => {
  const element = InputElement.create({
    type: "password",
    placeholder: "Enter password",
  });
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.children?.[0].name).toBe("Enter password");
});

test("toFigmaNode: ボーダーとパディングが設定される", () => {
  const element = InputElement.create({ type: "text" });
  const config = toFigmaNode(element);

  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(1);
  expect(config.cornerRadius).toBe(4);
  expect(config.paddingLeft).toBe(12);
  expect(config.paddingRight).toBe(12);
  expect(config.paddingTop).toBe(8);
  expect(config.paddingBottom).toBe(8);
});

test("toFigmaNode: 背景色が白に設定される", () => {
  const element = InputElement.create({ type: "text" });
  const config = toFigmaNode(element);

  expect(config.fills).toHaveLength(1);
  expect(config.fills?.[0].type).toBe("SOLID");
  if (config.fills?.[0].type === "SOLID") {
    expect(config.fills[0].color).toEqual({ r: 1, g: 1, b: 1 });
  }
});

// checkboxのテスト

test("toFigmaNode checkbox: checkbox型のinputを矩形に変換できる", () => {
  const element = InputElement.create({ type: "checkbox" });
  const config = toFigmaNode(element);

  expect(config.type).toBe("RECTANGLE");
  expect(config.name).toBe("checkbox");
  expect(config.width).toBe(20);
  expect(config.height).toBe(20);
  expect(config.cornerRadius).toBe(4);
});

test("toFigmaNode checkbox: checked属性がある場合はチェックマークが表示される", () => {
  const element = InputElement.create({
    type: "checkbox",
    checked: "checked",
  });
  const config = toFigmaNode(element);

  expect(config.children).toHaveLength(1);
  expect(config.children?.[0].type).toBe("TEXT");
  expect(config.children?.[0].name).toBe("✓");
});

test("toFigmaNode checkbox: checked属性がない場合は子要素がない", () => {
  const element = InputElement.create({ type: "checkbox" });
  const config = toFigmaNode(element);

  expect(config.children).toBeUndefined();
});

// radioのテスト

test("toFigmaNode radio: radio型のinputを矩形に変換できる（円形に見えるよう角丸大）", () => {
  const element = InputElement.create({ type: "radio" });
  const config = toFigmaNode(element);

  expect(config.type).toBe("RECTANGLE");
  expect(config.name).toBe("radio");
  expect(config.width).toBe(20);
  expect(config.height).toBe(20);
  expect(config.cornerRadius).toBe(10); // 半分で円形
});

test("toFigmaNode radio: checked属性がある場合はドットが表示される", () => {
  const element = InputElement.create({
    type: "radio",
    checked: "checked",
  });
  const config = toFigmaNode(element);

  expect(config.children).toHaveLength(1);
  expect(config.children?.[0].type).toBe("RECTANGLE");
  expect(config.children?.[0].width).toBe(10);
  expect(config.children?.[0].height).toBe(10);
});

// numberのテスト

test("toFigmaNode number: number型のinputを変換できる", () => {
  const element = InputElement.create({
    type: "number",
    value: "42",
  });
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.children?.[0].name).toBe("42");
});

// button/submitのテスト

test("toFigmaNode button/submit: submit型のinputをボタンに変換できる", () => {
  const element = InputElement.create({
    type: "submit",
    value: "送信",
  });
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("submit");
  expect(config.children?.[0].type).toBe("TEXT");
  expect(config.children?.[0].name).toBe("送信");
});

test("toFigmaNode button/submit: button型のinputをボタンに変換できる", () => {
  const element = InputElement.create({
    type: "button",
    value: "クリック",
  });
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("button");
  expect(config.children?.[0].name).toBe("クリック");
});

test("toFigmaNode button/submit: valueがない場合はデフォルトテキストが表示される", () => {
  const element = InputElement.create({ type: "submit" });
  const config = toFigmaNode(element);

  expect(config.children?.[0].name).toBe("Submit");
});

test("toFigmaNode button/submit: ボタンの背景色が設定される", () => {
  const element = InputElement.create({ type: "submit" });
  const config = toFigmaNode(element);

  expect(config.fills).toBeDefined();
  expect(config.fills?.[0].type).toBe("SOLID");
});

// disabled状態のテスト

test("toFigmaNode disabled: disabled属性がある場合は背景色が薄くなる", () => {
  const element = InputElement.create({
    type: "text",
    disabled: "disabled",
  });
  const config = toFigmaNode(element);

  // 背景色が薄いグレーになることを確認
  expect(config.fills).toBeDefined();
  expect(config.fills?.[0].type).toBe("SOLID");
  if (config.fills?.[0].type === "SOLID") {
    expect(config.fills[0].color.r).toBeGreaterThan(0.9);
  }
});

// id/class属性のテスト

test("toFigmaNode id/class: id属性がある場合はノード名に反映される", () => {
  const element = InputElement.create({
    type: "text",
    id: "username",
  });
  const config = toFigmaNode(element);

  expect(config.name).toBe("input#username");
});

test("toFigmaNode id/class: class属性がある場合はノード名に反映される", () => {
  const element = InputElement.create({
    type: "text",
    class: "form-control",
  });
  const config = toFigmaNode(element);

  expect(config.name).toBe("input.form-control");
});

test("toFigmaNode id/class: idとclassの両方がある場合はidが優先される", () => {
  const element = InputElement.create({
    type: "text",
    id: "username",
    class: "form-control",
  });
  const config = toFigmaNode(element);

  expect(config.name).toBe("input#username");
});

// mapToFigmaのテスト

test("mapToFigma: InputElementを変換できる", () => {
  const element = InputElement.create({ type: "text" });
  const config = mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config?.type).toBe("FRAME");
});

test("mapToFigma: HTMLNodeから変換できる", () => {
  const node = {
    type: "element",
    tagName: "input",
    attributes: { type: "email" },
  };
  const config = mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.type).toBe("FRAME");
});

test("mapToFigma: input要素でない場合はnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
  };
  const config = mapToFigma(node);

  expect(config).toBeNull();
});

test("mapToFigma: 無効なノードの場合はnullを返す", () => {
  const config = mapToFigma(null);
  expect(config).toBeNull();
});
