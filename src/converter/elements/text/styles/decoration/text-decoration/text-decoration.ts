import type { Brand } from "../../../../../../types";
import type {
  TextNodeConfig,
  TextStyle,
} from "../../../../../models/figma-node";

// Figmaがサポートするテキスト装飾
export type FigmaTextDecoration = "UNDERLINE" | "STRIKETHROUGH";

// ブランド型
export type TextDecoration = Brand<FigmaTextDecoration, "TextDecoration">;

/**
 * Companion object for handling CSS text-decoration to Figma TextDecoration mapping.
 *
 * CSS text-decoration values:
 * - underline → UNDERLINE
 * - line-through → STRIKETHROUGH
 * - overline → not supported (returns undefined)
 * - none → undefined
 *
 * @example
 * const decoration = TextDecoration.parse("underline"); // -> "UNDERLINE"
 * TextDecoration.applyToConfig(config, decoration);
 */
export const TextDecoration = {
  /**
   * Create a branded TextDecoration from a Figma text decoration value.
   * @param value Figma text decoration value
   * @returns Branded TextDecoration
   */
  create(value: FigmaTextDecoration): TextDecoration {
    return value as TextDecoration;
  },

  /**
   * Parse CSS text-decoration value to Figma TextDecoration.
   * Supports: underline, line-through, overline, none
   * Returns undefined for unsupported values and CSS keywords.
   * @param decoration CSS text-decoration value
   * @returns TextDecoration or undefined
   */
  parse(decoration: string): TextDecoration | undefined {
    if (!decoration || typeof decoration !== "string") {
      return undefined;
    }

    const trimmed = decoration.trim();
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

    // Split by whitespace to handle multiple values
    const values = trimmed.toLowerCase().split(/\s+/);

    // Process each value and return the first supported one
    for (const value of values) {
      switch (value) {
        case "underline":
          return "UNDERLINE" as TextDecoration;
        case "line-through":
          return "STRIKETHROUGH" as TextDecoration;
        case "none":
          return undefined;
        case "overline":
          // Overline is not supported in Figma, skip it
          continue;
        default:
          // Unknown value, skip it
          continue;
      }
    }

    // No supported values found
    return undefined;
  },

  /**
   * Extract text-decoration from a style object.
   * Checks both camelCase and kebab-case properties.
   * @param style Style object containing CSS properties
   * @returns TextDecoration or undefined
   */
  extractStyle(style: Record<string, unknown>): TextDecoration | undefined {
    if (!style || typeof style !== "object") {
      return undefined;
    }

    // Prioritize camelCase over kebab-case
    const decorationValue = style.textDecoration ?? style["text-decoration"];

    if (!decorationValue || typeof decorationValue !== "string") {
      return undefined;
    }

    return TextDecoration.parse(decorationValue);
  },

  /**
   * Apply text decoration to a TextNodeConfig.
   * @param config Config object to modify
   * @param decoration TextDecoration to apply (or undefined to remove)
   * @returns The same config object (modified)
   */
  applyToConfig(
    config: TextNodeConfig,
    decoration: TextDecoration | undefined,
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

    if (decoration) {
      config.style.textDecoration = decoration;
    } else {
      // Explicitly remove decoration if undefined is passed
      delete config.style.textDecoration;
    }
    return config;
  },
};
