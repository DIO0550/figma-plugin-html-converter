import { test, expect } from "vitest";
import { AElement } from "../a-element";
import { createAElement, createTextNode } from "./test-helpers";

test("AElement.isAElement() - type='element'かつtagName='a'のオブジェクトに対してtrueを返す", () => {
  const node = createAElement({
    attributes: { href: "https://example.com" },
  });

  const result = AElement.isAElement(node);

  expect(result).toBe(true);
});

test.each`
  name                | node
  ${"div要素"}        | ${{ type: "element", tagName: "div" }}
  ${"textノード"}     | ${createTextNode("Hello")}
  ${"null値"}         | ${null}
  ${"undefined値"}    | ${undefined}
  ${"空オブジェクト"} | ${{}}
  ${"文字列"}         | ${"a"}
  ${"数値"}           | ${123}
  ${"typeのみ"}       | ${{ type: "element" }}
  ${"tagNameのみ"}    | ${{ tagName: "a" }}
`("AElement.isAElement() - $nameに対してfalseを返す", ({ node }) => {
  const result = AElement.isAElement(node);
  expect(result).toBe(false);
});
