import type { Brand } from "../../../../../../types";
import type { TextNodeConfig } from "../../../../../models/figma-node";

export type LetterSpacing = Brand<number, "LetterSpacing">;

const DEFAULT_BASE_FONT_SIZE = 16 as const;

/**
 * Figma letterSpacing representation used by Text nodes.
 * - unit: Always "PIXELS" in this converter
 * - value: Pixel amount after converting CSS letter-spacing to px
 */
export interface FigmaLetterSpacing {
  value: number;
  unit: "PIXELS" | "PERCENT";
}

/**
 * Companion object providing creation, parsing and mapping utilities
 * for the LetterSpacing branded type.
 *
 * Example:
 *   const px = LetterSpacing.parse("0.1em", 16); // -> branded px value
 *   const figma = LetterSpacing.toFigmaLetterSpacing(px!);
 */
export const LetterSpacing = {
  /**
   * Create a branded LetterSpacing from a raw number (px).
   * @param value Raw pixel value
   * @returns LetterSpacing branded value
   */
  create(value: number): LetterSpacing {
    return value as LetterSpacing;
  },

  /**
   * Get raw number value from a LetterSpacing branded type.
   * @param letterSpacing Branded value
   * @returns Raw pixel number
   */
  getValue(letterSpacing: LetterSpacing): number {
    return letterSpacing as unknown as number;
  },

  /**
   * Parse CSS letter-spacing string into a px-based LetterSpacing.
   * Supports: px | rem | em | % | normal.
   * Returns null for CSS variables and keywords: var(), inherit, initial, unset.
   * @param letterSpacing Source CSS value
   * @param fontSize Font size used for em and % conversions
   * @param baseFontSize Base size for rem conversion (default 16)
   */
  parse(
    letterSpacing: string,
    fontSize?: number,
    baseFontSize: number = DEFAULT_BASE_FONT_SIZE,
  ): LetterSpacing | null {
    if (!letterSpacing || !letterSpacing.trim()) {
      return null;
    }

    const trimmed = letterSpacing.trim().toLowerCase();
    if (trimmed === "normal") {
      return LetterSpacing.create(0);
    }
    if (
      trimmed === "inherit" ||
      trimmed === "initial" ||
      trimmed === "unset" ||
      trimmed.startsWith("var(")
    ) {
      return null;
    }
    if (trimmed.endsWith("px")) {
      const pxValue = parseFloat(trimmed);
      if (!isNaN(pxValue)) {
        return LetterSpacing.create(pxValue);
      }
    }
    if (trimmed.endsWith("rem")) {
      const remValue = parseFloat(trimmed);
      if (!isNaN(remValue)) {
        return LetterSpacing.create(remValue * baseFontSize);
      }
    }
    if (trimmed.endsWith("em") && fontSize !== undefined) {
      const emValue = parseFloat(trimmed);
      if (!isNaN(emValue)) {
        return LetterSpacing.create(emValue * fontSize);
      }
    } else if (trimmed.endsWith("em")) {
      return null;
    }
    if (trimmed.endsWith("%") && fontSize !== undefined) {
      const percentValue = parseFloat(trimmed);
      if (!isNaN(percentValue)) {
        return LetterSpacing.create((percentValue / 100) * fontSize);
      }
    } else if (trimmed.endsWith("%")) {
      return null;
    }
    return null;
  },

  /**
   * Extract letter-spacing from CSS style map and normalize to px.
   * @param styles CSS declarations map
   * @param fontSize Font size used for em/% conversions
   * @param baseFontSize Base size for rem conversion
   * @returns Pixel value (0 if missing or invalid)
   */
  extractStyle(
    styles: Record<string, string>,
    fontSize?: number,
    baseFontSize: number = DEFAULT_BASE_FONT_SIZE,
  ): number {
    const value = styles["letter-spacing"];
    if (!value) {
      return 0;
    }

    const letterSpacing = this.parse(value, fontSize, baseFontSize);
    return letterSpacing !== null ? this.getValue(letterSpacing) : 0;
  },

  /**
   * Apply parsed letter-spacing to a TextNodeConfig immutably.
   * @param config Source config
   * @param styles CSS declarations map
   * @returns New config with letterSpacing applied
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
  ): TextNodeConfig {
    const fontSize = config.style.fontSize;
    const letterSpacingValue = this.extractStyle(styles, fontSize);

    return {
      ...config,
      style: {
        ...config.style,
        letterSpacing: letterSpacingValue,
      },
    };
  },

  /**
   * Convert LetterSpacing to Figma's letterSpacing format.
   * @param letterSpacing Branded px value
   * @returns FigmaLetterSpacing object
   */
  toFigmaLetterSpacing(letterSpacing: LetterSpacing): FigmaLetterSpacing {
    return {
      value: this.getValue(letterSpacing),
      unit: "PIXELS",
    };
  },
} as const;
