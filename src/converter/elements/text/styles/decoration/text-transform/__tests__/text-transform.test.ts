import { test, expect } from "vitest";
import { TextTransform } from "../text-transform";

test("TextTransform.create - 文字列を渡した場合 - ブランド付きTextTransformを作成する", () => {
  const transform = TextTransform.create("UPPERCASE");
  expect(transform).toBe("UPPERCASE");
});
