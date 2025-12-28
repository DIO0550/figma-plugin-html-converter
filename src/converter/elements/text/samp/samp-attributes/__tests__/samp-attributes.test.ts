import { describe, test, expect } from "vitest";
import type { SampAttributes } from "../samp-attributes";

describe("SampAttributes", () => {
  test("SampAttributesはグローバル属性を含むことができる", () => {
    const attributes: SampAttributes = {
      id: "output-sample",
      class: "sample-output",
      style: "font-family: monospace",
    };

    expect(attributes.id).toBe("output-sample");
    expect(attributes.class).toBe("sample-output");
    expect(attributes.style).toBe("font-family: monospace");
  });
});
