import { describe, it, expect } from "vitest";
import { TextTransform } from "../text-transform";
import type { TextNodeConfig } from "../../../../../../models/figma-node";

type StyleObject = Record<string, unknown>;

describe("TextTransform", () => {
  describe("create", () => {
    it("should create a branded TextTransform from string", () => {
      const transform = TextTransform.create("UPPERCASE");
      expect(transform).toBe("UPPERCASE");
    });
  });

  describe("parse", () => {
    describe("valid transform values", () => {
      it("should parse 'uppercase' to UPPERCASE", () => {
        const result = TextTransform.parse("uppercase");
        expect(result).toBe("UPPERCASE");
      });

      it("should parse 'lowercase' to LOWERCASE", () => {
        const result = TextTransform.parse("lowercase");
        expect(result).toBe("LOWERCASE");
      });

      it("should parse 'capitalize' to CAPITALIZE", () => {
        const result = TextTransform.parse("capitalize");
        expect(result).toBe("CAPITALIZE");
      });

      it("should parse 'none' to ORIGINAL", () => {
        const result = TextTransform.parse("none");
        expect(result).toBe("ORIGINAL");
      });

      it("should parse 'full-width' to undefined (not supported)", () => {
        const result = TextTransform.parse("full-width");
        expect(result).toBeUndefined();
      });

      it("should parse 'full-size-kana' to undefined (not supported)", () => {
        const result = TextTransform.parse("full-size-kana");
        expect(result).toBeUndefined();
      });
    });

    describe("case insensitivity", () => {
      it("should parse 'UPPERCASE' case-insensitively", () => {
        const result = TextTransform.parse("UPPERCASE");
        expect(result).toBe("UPPERCASE");
      });

      it("should parse 'UpperCase' case-insensitively", () => {
        const result = TextTransform.parse("UpperCase");
        expect(result).toBe("UPPERCASE");
      });

      it("should parse 'LOWERCASE' case-insensitively", () => {
        const result = TextTransform.parse("LOWERCASE");
        expect(result).toBe("LOWERCASE");
      });

      it("should parse 'Capitalize' case-insensitively", () => {
        const result = TextTransform.parse("Capitalize");
        expect(result).toBe("CAPITALIZE");
      });

      it("should parse 'NONE' case-insensitively", () => {
        const result = TextTransform.parse("NONE");
        expect(result).toBe("ORIGINAL");
      });
    });

    describe("invalid and edge cases", () => {
      it("should return undefined for empty string", () => {
        const result = TextTransform.parse("");
        expect(result).toBeUndefined();
      });

      it("should return undefined for whitespace only", () => {
        const result = TextTransform.parse("   ");
        expect(result).toBeUndefined();
      });

      it("should return undefined for invalid value", () => {
        const result = TextTransform.parse("invalid");
        expect(result).toBeUndefined();
      });

      it("should return undefined for CSS variables", () => {
        const result = TextTransform.parse("var(--text-transform)");
        expect(result).toBeUndefined();
      });

      it("should return undefined for inherit keyword", () => {
        const result = TextTransform.parse("inherit");
        expect(result).toBeUndefined();
      });

      it("should return undefined for initial keyword", () => {
        const result = TextTransform.parse("initial");
        expect(result).toBeUndefined();
      });

      it("should return undefined for unset keyword", () => {
        const result = TextTransform.parse("unset");
        expect(result).toBeUndefined();
      });
    });
  });

  describe("extractStyle", () => {
    it("should extract text-transform from style object", () => {
      const style: StyleObject = { textTransform: "uppercase" };
      const result = TextTransform.extractStyle(style);
      expect(result).toBe("UPPERCASE");
    });

    it("should extract text-transform from kebab-case property", () => {
      const style: StyleObject = { "text-transform": "lowercase" };
      const result = TextTransform.extractStyle(style);
      expect(result).toBe("LOWERCASE");
    });

    it("should prioritize textTransform over text-transform", () => {
      const style: StyleObject = {
        textTransform: "uppercase",
        "text-transform": "lowercase",
      };
      const result = TextTransform.extractStyle(style);
      expect(result).toBe("UPPERCASE");
    });

    it("should return undefined when no transform property exists", () => {
      const style: StyleObject = { color: "red" };
      const result = TextTransform.extractStyle(style);
      expect(result).toBeUndefined();
    });

    it("should return undefined for empty style object", () => {
      const style: StyleObject = {};
      const result = TextTransform.extractStyle(style);
      expect(result).toBeUndefined();
    });
  });

  describe("applyToConfig", () => {
    it("should apply UPPERCASE to config", () => {
      const config = { style: {} } as TextNodeConfig;
      const transform = TextTransform.create("UPPERCASE");
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("UPPERCASE");
      expect(result).toBe(config); // should return same object
    });

    it("should apply LOWERCASE to config", () => {
      const config = { style: {} } as TextNodeConfig;
      const transform = TextTransform.create("LOWERCASE");
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("LOWERCASE");
    });

    it("should apply CAPITALIZE to config", () => {
      const config = { style: {} } as TextNodeConfig;
      const transform = TextTransform.create("CAPITALIZE");
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("CAPITALIZE");
    });

    it("should apply ORIGINAL to config", () => {
      const config = { style: {} } as TextNodeConfig;
      const transform = TextTransform.create("ORIGINAL");
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("ORIGINAL");
    });

    it("should not modify config when transform is undefined", () => {
      const config = { style: {} } as TextNodeConfig;
      const result = TextTransform.applyToConfig(config, undefined);

      expect(result.style.textCase).toBeUndefined();
      expect(result).toBe(config);
    });

    it("should override existing transform in config", () => {
      const config = { style: { textCase: "UPPERCASE" } } as TextNodeConfig;
      const transform = TextTransform.create("LOWERCASE");
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("LOWERCASE");
    });
  });

  describe("apply", () => {
    it("should transform text to uppercase", () => {
      const result = TextTransform.apply("hello world", "UPPERCASE");
      expect(result).toBe("HELLO WORLD");
    });

    it("should transform text to lowercase", () => {
      const result = TextTransform.apply("HELLO WORLD", "LOWERCASE");
      expect(result).toBe("hello world");
    });

    it("should capitalize first letter of each word", () => {
      const result = TextTransform.apply("hello world", "CAPITALIZE");
      expect(result).toBe("Hello World");
    });

    it("should return original text for ORIGINAL", () => {
      const result = TextTransform.apply("HeLLo WoRLD", "ORIGINAL");
      expect(result).toBe("HeLLo WoRLD");
    });

    it("should return original text when transform is undefined", () => {
      const result = TextTransform.apply("HeLLo WoRLD", undefined);
      expect(result).toBe("HeLLo WoRLD");
    });

    it("should handle empty string", () => {
      expect(TextTransform.apply("", "UPPERCASE")).toBe("");
      expect(TextTransform.apply("", "LOWERCASE")).toBe("");
      expect(TextTransform.apply("", "CAPITALIZE")).toBe("");
      expect(TextTransform.apply("", "ORIGINAL")).toBe("");
    });

    it("should handle single character", () => {
      expect(TextTransform.apply("a", "UPPERCASE")).toBe("A");
      expect(TextTransform.apply("A", "LOWERCASE")).toBe("a");
      expect(TextTransform.apply("a", "CAPITALIZE")).toBe("A");
      expect(TextTransform.apply("A", "ORIGINAL")).toBe("A");
    });

    it("should handle special characters and numbers", () => {
      const text = "123 ABC! @#$ xyz";
      expect(TextTransform.apply(text, "UPPERCASE")).toBe("123 ABC! @#$ XYZ");
      expect(TextTransform.apply(text, "LOWERCASE")).toBe("123 abc! @#$ xyz");
      expect(TextTransform.apply(text, "CAPITALIZE")).toBe("123 Abc! @#$ Xyz");
      expect(TextTransform.apply(text, "ORIGINAL")).toBe(text);
    });

    it("should handle multiple spaces correctly in capitalize", () => {
      const result = TextTransform.apply("hello   world", "CAPITALIZE");
      expect(result).toBe("Hello   World");
    });

    it("should capitalize after punctuation", () => {
      const result = TextTransform.apply("hello. world! test", "CAPITALIZE");
      expect(result).toBe("Hello. World! Test");
    });
  });

  describe("integration with style extraction and config application", () => {
    it("should extract and apply transform from style to config", () => {
      const style: StyleObject = { textTransform: "uppercase" };
      const config = { style: {} } as TextNodeConfig;

      const transform = TextTransform.extractStyle(style);
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("UPPERCASE");
    });

    it("should handle lowercase correctly", () => {
      const style: StyleObject = { "text-transform": "lowercase" };
      const config = { style: {} } as TextNodeConfig;

      const transform = TextTransform.extractStyle(style);
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("LOWERCASE");
    });

    it("should handle none value correctly", () => {
      const style: StyleObject = { textTransform: "none" };
      const config = { style: { textCase: "UPPERCASE" } } as TextNodeConfig;

      const transform = TextTransform.extractStyle(style);
      const result = TextTransform.applyToConfig(config, transform);

      expect(result.style.textCase).toBe("ORIGINAL");
    });
  });
});
