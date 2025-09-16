import type { Brand } from "../../../../../../types";
import type {
  TextNodeConfig,
  TextStyle,
} from "../../../../../models/figma-node";

// FigmaのTextCaseタイプ
export type FigmaTextCase =
  | "UPPERCASE"
  | "LOWERCASE"
  | "CAPITALIZE"
  | "ORIGINAL";

// ブランド型
export type TextTransform = Brand<FigmaTextCase, "TextTransform">;

/**
 * Companion object for handling CSS text-transform to Figma TextCase mapping.
 *
 * CSS text-transform values:
 * - uppercase → UPPERCASE
 * - lowercase → LOWERCASE
 * - capitalize → CAPITALIZE
 * - none → ORIGINAL
 * - full-width, full-size-kana → not supported (returns undefined)
 *
 * @example
 * const transform = TextTransform.parse("uppercase"); // -> "UPPERCASE"
 * const transformed = TextTransform.apply("hello", transform); // -> "HELLO"
 * TextTransform.applyToConfig(config, transform);
 */
export const TextTransform = {
  /**
   * Create a branded TextTransform from a Figma text case value.
   * @param value Figma text case value
   * @returns Branded TextTransform
   */
  create(value: FigmaTextCase): TextTransform {
    return value as TextTransform;
  },

  /**
   * Parse CSS text-transform value to Figma TextCase.
   * Supports: uppercase, lowercase, capitalize, none
   * Returns undefined for unsupported values and CSS keywords.
   * @param transform CSS text-transform value
   * @returns TextTransform or undefined
   */
  parse(transform: string): TextTransform | undefined {
    if (!transform || typeof transform !== "string") {
      return undefined;
    }

    const trimmed = transform.trim();
    if (!trimmed) {
      return undefined;
    }

    // Check for CSS keywords to exclude
    const cssKeywords = ["inherit", "initial", "unset", "revert"];
    if (cssKeywords.includes(trimmed.toLowerCase())) {
      return undefined;
    }

    // Check for CSS variables
    if (trimmed.startsWith("var(")) {
      return undefined;
    }

    // Map CSS values to Figma values
    switch (trimmed.toLowerCase()) {
      case "uppercase":
        return "UPPERCASE" as TextTransform;
      case "lowercase":
        return "LOWERCASE" as TextTransform;
      case "capitalize":
        return "CAPITALIZE" as TextTransform;
      case "none":
        return "ORIGINAL" as TextTransform;
      case "full-width":
      case "full-size-kana":
        // These are not supported in Figma
        return undefined;
      default:
        return undefined;
    }
  },

  /**
   * Extract text-transform from a style object.
   * Checks both camelCase and kebab-case properties.
   * @param style Style object containing CSS properties
   * @returns TextTransform or undefined
   */
  extractStyle(style: Record<string, unknown>): TextTransform | undefined {
    if (!style || typeof style !== "object") {
      return undefined;
    }

    // Prioritize camelCase over kebab-case
    const transformValue = style.textTransform ?? style["text-transform"];

    if (!transformValue || typeof transformValue !== "string") {
      return undefined;
    }

    return TextTransform.parse(transformValue);
  },

  /**
   * Apply text transform to a TextNodeConfig.
   * @param config Config object to modify
   * @param transform TextTransform to apply (or undefined to skip)
   * @returns The same config object (modified)
   */
  applyToConfig(
    config: TextNodeConfig,
    transform: TextTransform | undefined,
  ): TextNodeConfig {
    if (!config.style) {
      // Initialize with proper TextStyle type
      config.style = {
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: 400,
        lineHeight: { unit: "PIXELS", value: 24 },
        letterSpacing: 0,
        textAlign: "LEFT",
        verticalAlign: "TOP",
      } as TextStyle;
    }

    if (transform) {
      config.style.textCase = transform;
    }
    return config;
  },

  /**
   * Apply text transformation to actual text content.
   * @param text The text to transform
   * @param transform The transformation to apply
   * @returns Transformed text
   */
  apply(text: string, transform: TextTransform | undefined): string {
    if (!transform || !text) {
      return text;
    }

    switch (transform) {
      case "UPPERCASE":
        return text.toUpperCase();

      case "LOWERCASE":
        return text.toLowerCase();

      case "CAPITALIZE":
        // Capitalize first letter of each word and lowercase the rest
        return text.replace(
          /\b\w+/g,
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        );

      case "ORIGINAL":
      default:
        return text;
    }
  },
};
