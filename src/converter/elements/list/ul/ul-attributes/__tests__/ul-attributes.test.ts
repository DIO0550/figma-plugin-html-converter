import { describe, it, expect } from "vitest";
import { UlAttributes } from "../ul-attributes";

describe("UlAttributes", () => {
  describe("constructor", () => {
    it("should create instance with default values", () => {
      const attrs = new UlAttributes();

      expect(attrs.type).toBeUndefined();
      expect(attrs.compact).toBeUndefined();
    });

    it("should accept type attribute", () => {
      const attrs = new UlAttributes({ type: "disc" });
      expect(attrs.type).toBe("disc");
    });

    it("should accept compact attribute", () => {
      const attrs = new UlAttributes({ compact: true });
      expect(attrs.compact).toBe(true);
    });
  });

  describe("from", () => {
    it("should create from attributes object", () => {
      const attrs = UlAttributes.from({
        type: "circle",
        compact: "true",
      });

      expect(attrs.type).toBe("circle");
      expect(attrs.compact).toBe(true);
    });

    it("should handle empty attributes", () => {
      const attrs = UlAttributes.from({});

      expect(attrs.type).toBeUndefined();
      expect(attrs.compact).toBeUndefined();
    });
  });
});
