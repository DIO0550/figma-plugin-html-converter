import { describe, test, expect } from "vitest";
import type { KbdAttributes } from "../kbd-attributes";

describe("KbdAttributes", () => {
  test("KbdAttributesはグローバル属性を含むことができる", () => {
    const attributes: KbdAttributes = {
      id: "shortcut-key",
      class: "keyboard",
      style: "font-family: monospace",
    };

    expect(attributes.id).toBe("shortcut-key");
    expect(attributes.class).toBe("keyboard");
    expect(attributes.style).toBe("font-family: monospace");
  });
});
