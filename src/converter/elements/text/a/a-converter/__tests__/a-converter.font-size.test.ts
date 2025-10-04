import { test, expect } from "vitest";
import { AConverter } from "../a-converter";
import { createAElement, createTextNode } from "./test-helpers";

test.each`
  unit     | fontSize    | expected
  ${"px"}  | ${"24px"}   | ${24}
  ${"pt"}  | ${"12pt"}   | ${16}
  ${"rem"} | ${"1.5rem"} | ${24}
  ${"em"}  | ${"2em"}    | ${32}
`(
  "AConverter.toFigmaNode() - $unit単位のフォントサイズを変換する",
  ({ fontSize, expected }) => {
    const element = createAElement(
      "#",
      [createTextNode(fontSize)],
      `font-size: ${fontSize};`,
    );
    const result = AConverter.toFigmaNode(element);
    expect(result.style.fontSize).toBe(expected);
  },
);

test.each`
  type           | fontSize      | expected
  ${"小数点px"}  | ${"14.7px"}   | ${14.7}
  ${"小数点rem"} | ${"0.875rem"} | ${14}
  ${"小数点em"}  | ${"1.25em"}   | ${20}
  ${"小数点pt"}  | ${"10.5pt"}   | ${16}
`(
  "AConverter.toFigmaNode() - $type値を正しく変換する",
  ({ fontSize, expected }) => {
    const element = createAElement(
      "#",
      [createTextNode(fontSize)],
      `font-size: ${fontSize};`,
    );
    const result = AConverter.toFigmaNode(element);
    expect(result.style.fontSize).toBe(expected);
  },
);

test("AConverter.toFigmaNode() - 単位なしの数値をpxとして扱う", () => {
  const element = createAElement("#", [createTextNode("18")], "font-size: 18;");
  const result = AConverter.toFigmaNode(element);
  expect(result.style.fontSize).toBe(18);
});

test("AConverter.toFigmaNode() - 不正なフォントサイズ値の場合デフォルト値を維持する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Invalid")],
    "font-size: abc;",
  );
  const result = AConverter.toFigmaNode(element);
  expect(result.style.fontSize).toBe(16);
});
