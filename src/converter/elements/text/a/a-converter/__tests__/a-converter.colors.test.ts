import { test, expect } from "vitest";
import { AConverter } from "../a-converter";
import { createAElement, createTextNode } from "./test-helpers";

test.each`
  format      | color        | text       | expected
  ${"3桁HEX"} | ${"#f00"}    | ${"Red"}   | ${{ r: 1, g: 0, b: 0, a: 1 }}
  ${"6桁HEX"} | ${"#00ff00"} | ${"Green"} | ${{ r: 0, g: 1, b: 0, a: 1 }}
`(
  "AConverter.toFigmaNode() - $format カラー$colorをRGB値に変換する",
  ({ color, text, expected }) => {
    const element = createAElement(
      "#",
      [createTextNode(text)],
      `color: ${color};`,
    );
    const result = AConverter.toFigmaNode(element);
    expect(result.style.fills?.[0].color).toEqual(expected);
  },
);

test.each`
  format    | color                     | text                  | expected
  ${"rgb"}  | ${"rgb(0, 0, 255)"}       | ${"Blue"}             | ${{ r: 0, g: 0, b: 1, a: 1 }}
  ${"rgba"} | ${"rgba(255, 0, 0, 0.5)"} | ${"Semi-transparent"} | ${{ r: 1, g: 0, b: 0, a: 0.5 }}
`(
  "AConverter.toFigmaNode() - $format形式のカラーをRGB値に変換する",
  ({ color, text, expected }) => {
    const element = createAElement(
      "#",
      [createTextNode(text)],
      `color: ${color};`,
    );
    const result = AConverter.toFigmaNode(element);
    expect(result.style.fills?.[0].color).toEqual(expected);
  },
);

test.each`
  colorName   | color       | text        | expected
  ${"yellow"} | ${"yellow"} | ${"Yellow"} | ${{ r: 1, g: 1, b: 0, a: 1 }}
  ${"red"}    | ${"red"}    | ${"Red"}    | ${{ r: 1, g: 0, b: 0, a: 1 }}
  ${"blue"}   | ${"blue"}   | ${"Blue"}   | ${{ r: 0, g: 0, b: 1, a: 1 }}
  ${"green"}  | ${"green"}  | ${"Green"}  | ${{ r: 0, g: 0.5019607843137255, b: 0, a: 1 }}
  ${"black"}  | ${"black"}  | ${"Black"}  | ${{ r: 0, g: 0, b: 0, a: 1 }}
  ${"white"}  | ${"white"}  | ${"White"}  | ${{ r: 1, g: 1, b: 1, a: 1 }}
  ${"gray"}   | ${"gray"}   | ${"Gray"}   | ${{ r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255, a: 1 }}
`(
  "AConverter.toFigmaNode() - 名前付きカラー$colorNameをRGB値に変換する",
  ({ color, text, expected }) => {
    const element = createAElement(
      "#",
      [createTextNode(text)],
      `color: ${color};`,
    );
    const result = AConverter.toFigmaNode(element);
    expect(result.style.fills?.[0].color).toEqual(expected);
  },
);

test("AConverter.toFigmaNode() - 不明な名前付きカラーの場合デフォルトカラーを維持する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Unknown")],
    "color: fuchsia;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fills?.[0].color).toEqual({ r: 0, g: 0.478, b: 1, a: 1 });
});
