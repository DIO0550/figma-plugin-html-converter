import { describe, test, expect } from "vitest";
import type { TimeAttributes } from "../time-attributes";

describe("TimeAttributes", () => {
  test("TimeAttributesはdatetime属性を含むことができる", () => {
    const attributes: TimeAttributes = {
      datetime: "2024-12-25",
    };

    expect(attributes.datetime).toBe("2024-12-25");
  });

  test("TimeAttributesはグローバル属性を含むことができる", () => {
    const attributes: TimeAttributes = {
      id: "event-time",
      class: "highlight",
      style: "color: red",
      datetime: "2024-12-25T10:00:00",
    };

    expect(attributes.id).toBe("event-time");
    expect(attributes.class).toBe("highlight");
    expect(attributes.style).toBe("color: red");
    expect(attributes.datetime).toBe("2024-12-25T10:00:00");
  });

  test("TimeAttributesはdatetime属性なしでも定義できる", () => {
    const attributes: TimeAttributes = {
      id: "time-display",
    };

    expect(attributes.id).toBe("time-display");
    expect(attributes.datetime).toBeUndefined();
  });
});
