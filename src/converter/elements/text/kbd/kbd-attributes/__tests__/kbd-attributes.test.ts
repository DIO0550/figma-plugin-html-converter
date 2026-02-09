import { test, expect } from "vitest";
import type { KbdAttributes } from "../kbd-attributes";

test("KbdAttributes - グローバル属性を設定した場合 - 各属性値を正しく保持する", () => {
  const attributes: KbdAttributes = {
    id: "shortcut-key",
    class: "keyboard",
    style: "font-family: monospace",
  };

  expect(attributes.id).toBe("shortcut-key");
  expect(attributes.class).toBe("keyboard");
  expect(attributes.style).toBe("font-family: monospace");
});
