import { test, expect } from "vitest";
import { TextDecoration } from "../text-decoration";

test("TextDecoration.create - 文字列を渡した場合 - ブランド付きTextDecorationを作成する", () => {
  const decoration = TextDecoration.create("UNDERLINE");
  expect(decoration).toBe("UNDERLINE");
});
