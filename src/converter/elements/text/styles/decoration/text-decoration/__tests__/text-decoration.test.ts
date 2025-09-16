import { describe, it, expect } from "vitest";
import { TextDecoration } from "../text-decoration";
import type { TextNodeConfig } from "../../../../../../models/figma-node";

type StyleObject = Record<string, unknown>;

describe("TextDecoration", () => {
  describe("create", () => {
    it("should create a branded TextDecoration from string", () => {
      const decoration = TextDecoration.create("UNDERLINE");
      expect(decoration).toBe("UNDERLINE");
    });
  });

  describe("parse", () => {
    describe("single decoration values", () => {
      it("should parse 'underline' to UNDERLINE", () => {
        const result = TextDecoration.parse("underline");
        expect(result).toBe("UNDERLINE");
      });

      it("should parse 'line-through' to STRIKETHROUGH", () => {
        const result = TextDecoration.parse("line-through");
        expect(result).toBe("STRIKETHROUGH");
      });

      it("should parse 'overline' to undefined (not supported in Figma)", () => {
        const result = TextDecoration.parse("overline");
        expect(result).toBeUndefined();
      });

      it("should parse 'none' to undefined", () => {
        const result = TextDecoration.parse("none");
        expect(result).toBeUndefined();
      });
    });

    describe("multiple decoration values", () => {
      it("should parse 'underline line-through' to UNDERLINE (first supported value)", () => {
        const result = TextDecoration.parse("underline line-through");
        expect(result).toBe("UNDERLINE");
      });

      it("should parse 'line-through underline' to STRIKETHROUGH (first supported value)", () => {
        const result = TextDecoration.parse("line-through underline");
        expect(result).toBe("STRIKETHROUGH");
      });

      it("should parse 'overline underline' to UNDERLINE (skip unsupported)", () => {
        const result = TextDecoration.parse("overline underline");
        expect(result).toBe("UNDERLINE");
      });
    });

    describe("invalid and edge cases", () => {
      it("should return undefined for empty string", () => {
        const result = TextDecoration.parse("");
        expect(result).toBeUndefined();
      });

      it("should return undefined for whitespace only", () => {
        const result = TextDecoration.parse("   ");
        expect(result).toBeUndefined();
      });

      it("should return undefined for invalid value", () => {
        const result = TextDecoration.parse("invalid");
        expect(result).toBeUndefined();
      });

      it("should return undefined for CSS variables", () => {
        const result = TextDecoration.parse("var(--text-decoration)");
        expect(result).toBeUndefined();
      });

      it("should return undefined for inherit keyword", () => {
        const result = TextDecoration.parse("inherit");
        expect(result).toBeUndefined();
      });

      it("should return undefined for initial keyword", () => {
        const result = TextDecoration.parse("initial");
        expect(result).toBeUndefined();
      });

      it("should return undefined for unset keyword", () => {
        const result = TextDecoration.parse("unset");
        expect(result).toBeUndefined();
      });
    });

    describe("case insensitivity", () => {
      it("should parse 'UNDERLINE' case-insensitively", () => {
        const result = TextDecoration.parse("UNDERLINE");
        expect(result).toBe("UNDERLINE");
      });

      it("should parse 'UnderLine' case-insensitively", () => {
        const result = TextDecoration.parse("UnderLine");
        expect(result).toBe("UNDERLINE");
      });

      it("should parse 'LINE-THROUGH' case-insensitively", () => {
        const result = TextDecoration.parse("LINE-THROUGH");
        expect(result).toBe("STRIKETHROUGH");
      });
    });
  });

  describe("extractStyle", () => {
    it("should extract text-decoration from style object", () => {
      const style: StyleObject = { textDecoration: "underline" };
      const result = TextDecoration.extractStyle(style);
      expect(result).toBe("UNDERLINE");
    });

    it("should extract text-decoration from kebab-case property", () => {
      const style: StyleObject = { "text-decoration": "line-through" };
      const result = TextDecoration.extractStyle(style);
      expect(result).toBe("STRIKETHROUGH");
    });

    it("should prioritize textDecoration over text-decoration", () => {
      const style: StyleObject = {
        textDecoration: "underline",
        "text-decoration": "line-through",
      };
      const result = TextDecoration.extractStyle(style);
      expect(result).toBe("UNDERLINE");
    });

    it("should return undefined when no decoration property exists", () => {
      const style: StyleObject = { color: "red" };
      const result = TextDecoration.extractStyle(style);
      expect(result).toBeUndefined();
    });

    it("should return undefined for empty style object", () => {
      const style: StyleObject = {};
      const result = TextDecoration.extractStyle(style);
      expect(result).toBeUndefined();
    });
  });

  describe("applyToConfig", () => {
    it("should apply UNDERLINE to config", () => {
      const config = { style: {} } as TextNodeConfig;
      const decoration = TextDecoration.create("UNDERLINE");
      const result = TextDecoration.applyToConfig(config, decoration);

      expect(result.style.textDecoration).toBe("UNDERLINE");
      expect(result).toBe(config); // should return same object
    });

    it("should apply STRIKETHROUGH to config", () => {
      const config = { style: {} } as TextNodeConfig;
      const decoration = TextDecoration.create("STRIKETHROUGH");
      const result = TextDecoration.applyToConfig(config, decoration);

      expect(result.style.textDecoration).toBe("STRIKETHROUGH");
    });

    it("should not modify config when decoration is undefined", () => {
      const config = { style: {} } as TextNodeConfig;
      const result = TextDecoration.applyToConfig(config, undefined);

      expect(result.style.textDecoration).toBeUndefined();
      expect(result).toBe(config);
    });

    it("should override existing decoration in config", () => {
      const config = {
        style: { textDecoration: "UNDERLINE" },
      } as TextNodeConfig;
      const decoration = TextDecoration.create("STRIKETHROUGH");
      const result = TextDecoration.applyToConfig(config, decoration);

      expect(result.style.textDecoration).toBe("STRIKETHROUGH");
    });
  });

  describe("integration with style extraction and config application", () => {
    it("should extract and apply decoration from style to config", () => {
      const style: StyleObject = { textDecoration: "underline" };
      const config = { style: {} } as TextNodeConfig;

      const decoration = TextDecoration.extractStyle(style);
      const result = TextDecoration.applyToConfig(config, decoration);

      expect(result.style.textDecoration).toBe("UNDERLINE");
    });

    it("should handle line-through correctly", () => {
      const style: StyleObject = { "text-decoration": "line-through" };
      const config = { style: {} } as TextNodeConfig;

      const decoration = TextDecoration.extractStyle(style);
      const result = TextDecoration.applyToConfig(config, decoration);

      expect(result.style.textDecoration).toBe("STRIKETHROUGH");
    });

    it("should handle none value correctly", () => {
      const style: StyleObject = { textDecoration: "none" };
      const config = {
        style: { textDecoration: "UNDERLINE" },
      } as TextNodeConfig;

      const decoration = TextDecoration.extractStyle(style);
      const result = TextDecoration.applyToConfig(config, decoration);

      expect(result.style.textDecoration).toBeUndefined();
    });
  });
});
