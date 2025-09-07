import { describe, it, expect, beforeEach } from "vitest";
import { UlConverter } from "../ul-converter";
import { createUlElement } from "../../ul-element/ul-element.factory";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

describe("UlConverter - Performance", () => {
  let converter: UlConverter;

  beforeEach(() => {
    converter = new UlConverter();
  });

  describe("large list performance", () => {
    it("should handle list with 1000 items efficiently", () => {
      const children: HTMLNode[] = Array(1000)
        .fill(null)
        .map((_, i) => ({
          type: "element" as const,
          tagName: "li",
          attributes: { id: `item-${i}` },
          children: [
            {
              type: "text" as const,
              content: `List item ${i}`,
            },
          ],
        }));

      const element = createUlElement({}, children);

      const startTime = performance.now();
      const result = converter.toFigmaNode(element);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
      // Should complete within reasonable time (100ms)
      expect(duration).toBeLessThan(100);
    });

    it("should handle deeply nested lists efficiently", () => {
      // Create a deeply nested structure
      const createNestedList = (depth: number): HTMLNode => {
        if (depth === 0) {
          return {
            type: "element",
            tagName: "li",
            attributes: {},
            children: [
              {
                type: "text",
                content: `Depth ${depth}`,
              },
            ],
          };
        }

        return {
          type: "element",
          tagName: "li",
          attributes: {},
          children: [
            {
              type: "text",
              content: `Depth ${depth}`,
            },
            {
              type: "element",
              tagName: "ul",
              attributes: {},
              children: [createNestedList(depth - 1)],
            },
          ],
        };
      };

      const element = createUlElement({}, [createNestedList(50)]);

      const startTime = performance.now();
      const result = converter.toFigmaNode(element);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
      // Should handle deep nesting without stack overflow
      expect(duration).toBeLessThan(100);
    });

    it("should handle many attributes efficiently", () => {
      const attributes: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        attributes[`data-attr-${i}`] = `value-${i}`;
      }

      const element = createUlElement(attributes);

      const startTime = performance.now();
      const result = converter.toFigmaNode(element);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(50);
    });

    it("should handle complex styles efficiently", () => {
      const styleProperties = [];
      for (let i = 0; i < 50; i++) {
        styleProperties.push(`property-${i}: value-${i}`);
      }
      const complexStyle = styleProperties.join("; ");

      const element = createUlElement({
        style: complexStyle,
      });

      const startTime = performance.now();
      const result = converter.toFigmaNode(element);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(50);
    });
  });

  describe("memory efficiency", () => {
    it("should not create memory leaks with repeated conversions", () => {
      const element = createUlElement({
        style: "padding: 20px; margin: 10px; border: 1px solid black",
      });

      // Perform many conversions
      const results = [];
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        results.push(converter.toFigmaNode(element));
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results).toHaveLength(1000);
      expect(results[0]).not.toBe(results[999]); // Each should be a new object
      // Should complete 1000 conversions quickly
      expect(duration).toBeLessThan(500);
    });

    it("should handle large HTML strings efficiently", () => {
      const items = Array(500)
        .fill(null)
        .map(
          (_, i) => `<li id="item-${i}" class="list-item-${i}">Item ${i}</li>`,
        )
        .join("");

      const largeHtml = `<ul class="huge-list" style="padding: 20px">${items}</ul>`;

      const startTime = performance.now();
      const result = converter.mapToFigma(largeHtml);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
      // Should parse and convert large HTML quickly
      expect(duration).toBeLessThan(100);
    });
  });

  describe("optimization benchmarks", () => {
    it("should maintain consistent performance with varying input sizes", () => {
      const sizes = [10, 50, 100, 200, 500];
      const durations: number[] = [];

      for (const size of sizes) {
        const children: HTMLNode[] = Array(size)
          .fill(null)
          .map((_, i) => ({
            type: "element" as const,
            tagName: "li",
            attributes: { id: `item-${i}` },
            children: [],
          }));

        const element = createUlElement({}, children);

        const startTime = performance.now();
        converter.toFigmaNode(element);
        const endTime = performance.now();

        durations.push(endTime - startTime);
      }

      // Performance should scale reasonably with input size
      // The ratio of time for 500 items vs 10 items should be less than 100x
      const ratio = durations[durations.length - 1] / durations[0];
      expect(ratio).toBeLessThan(100);
    });

    it("should cache or optimize repeated style parsing", () => {
      const style =
        "padding: 20px; margin: 10px; border: 1px solid black; background-color: white";

      // First conversion (cold)
      const element1 = createUlElement({ style });
      const startTime1 = performance.now();
      converter.toFigmaNode(element1);
      const duration1 = performance.now() - startTime1;

      // Subsequent conversions (potentially optimized)
      const durations: number[] = [];
      for (let i = 0; i < 10; i++) {
        const element = createUlElement({ style });
        const startTime = performance.now();
        converter.toFigmaNode(element);
        durations.push(performance.now() - startTime);
      }

      const avgDuration =
        durations.reduce((a, b) => a + b, 0) / durations.length;

      // Subsequent conversions should be reasonably fast (within 3x of first)
      expect(avgDuration).toBeLessThanOrEqual(duration1 * 3);
    });

    it("should handle mixed content types efficiently", () => {
      const children: HTMLNode[] = [];

      // Mix of different content types
      for (let i = 0; i < 100; i++) {
        if (i % 3 === 0) {
          // Text node
          children.push({
            type: "text",
            content: `Text content ${i}`,
          });
        } else if (i % 3 === 1) {
          // Element with attributes
          children.push({
            type: "element",
            tagName: "li",
            attributes: {
              id: `item-${i}`,
              className: `class-${i}`,
              style: `color: rgb(${i}, ${i}, ${i})`,
            },
            children: [],
          });
        } else {
          // Nested element
          children.push({
            type: "element",
            tagName: "li",
            attributes: {},
            children: [
              {
                type: "element",
                tagName: "span",
                attributes: {},
                children: [
                  {
                    type: "text",
                    content: `Nested ${i}`,
                  },
                ],
              },
            ],
          });
        }
      }

      const element = createUlElement({}, children);

      const startTime = performance.now();
      const result = converter.toFigmaNode(element);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(100);
    });
  });

  describe("stress tests", () => {
    it("should handle rapid successive conversions", () => {
      const element = createUlElement({
        style: "padding: 10px",
      });

      const startTime = performance.now();
      const results = [];

      // Rapid fire conversions
      for (let i = 0; i < 100; i++) {
        results.push(converter.toFigmaNode(element));
      }

      const duration = performance.now() - startTime;

      expect(results).toHaveLength(100);
      expect(duration).toBeLessThan(100); // Should handle 100 conversions in under 100ms
    });

    it("should handle maximum reasonable list size", () => {
      const MAX_REASONABLE_SIZE = 5000;
      const children: HTMLNode[] = Array(MAX_REASONABLE_SIZE)
        .fill(null)
        .map((_, i) => ({
          type: "element" as const,
          tagName: "li",
          attributes: {},
          children: [
            {
              type: "text" as const,
              content: `Item ${i}`,
            },
          ],
        }));

      const element = createUlElement({}, children);

      const startTime = performance.now();
      const result = converter.toFigmaNode(element);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      // Even with 5000 items, should complete within 1 second
      expect(duration).toBeLessThan(1000);
    });
  });
});
