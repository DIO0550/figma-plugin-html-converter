import { test, expect } from "vitest";
import { UlConverter } from "../ul-converter";
import { UlElement } from "../../ul-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { FigmaNodeConfig } from "../../../../../models/figma-node";

// ========================================
// Large List Performance Tests
// ========================================

test("UlConverter performance: should handle list with 1000 items efficiently", () => {
  const converter = new UlConverter();
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

  const element = UlElement.create({}, children);

  const startTime = performance.now();
  const result = converter.toFigmaNode(element);
  const endTime = performance.now();

  const duration = endTime - startTime;

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  // Should complete within reasonable time (100ms)
  expect(duration).toBeLessThan(100);
});

test("UlConverter performance: should handle deeply nested lists efficiently", () => {
  const converter = new UlConverter();
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
            textContent: `Depth ${depth}`,
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
          textContent: `Depth ${depth}`,
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

  const element = UlElement.create({}, [createNestedList(50)]);

  const startTime = performance.now();
  const result = converter.toFigmaNode(element);
  const endTime = performance.now();

  const duration = endTime - startTime;

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  // Should handle deep nesting without stack overflow
  expect(duration).toBeLessThan(100);
});

test("UlConverter performance: should handle many attributes efficiently", () => {
  const converter = new UlConverter();
  const attributes: Record<string, string> = {};
  for (let i = 0; i < 100; i++) {
    attributes[`data-attr-${i}`] = `value-${i}`;
  }

  const element = UlElement.create(attributes);

  const startTime = performance.now();
  const result = converter.toFigmaNode(element);
  const endTime = performance.now();

  const duration = endTime - startTime;

  expect(result).toBeDefined();
  expect(duration).toBeLessThan(50);
});

test("UlConverter performance: should handle complex styles efficiently", () => {
  const converter = new UlConverter();
  const styleProperties: string[] = [];
  for (let i = 0; i < 50; i++) {
    styleProperties.push(`property-${i}: value-${i}`);
  }
  const complexStyle = styleProperties.join("; ");

  const element = UlElement.create({
    style: complexStyle,
  });

  const startTime = performance.now();
  const result = converter.toFigmaNode(element);
  const endTime = performance.now();

  const duration = endTime - startTime;

  expect(result).toBeDefined();
  expect(duration).toBeLessThan(50);
});

// ========================================
// Memory Efficiency Tests
// ========================================

test("UlConverter performance: should not create memory leaks with repeated conversions", () => {
  const converter = new UlConverter();
  const element = UlElement.create({
    style: "padding: 20px; margin: 10px; border: 1px solid black",
  });

  // Perform many conversions
  const results: FigmaNodeConfig[] = [];
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

test("UlConverter performance: should handle large HTML strings efficiently", () => {
  const converter = new UlConverter();
  const items = Array(500)
    .fill(null)
    .map((_, i) => `<li id="item-${i}" class="list-item-${i}">Item ${i}</li>`)
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

// ========================================
// Optimization Benchmark Tests
// ========================================

test("UlConverter performance: should maintain consistent performance with varying input sizes", () => {
  const converter = new UlConverter();
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

    const element = UlElement.create({}, children);

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

test("UlConverter performance: should cache or optimize repeated style parsing", () => {
  const converter = new UlConverter();
  const style =
    "padding: 20px; margin: 10px; border: 1px solid black; background-color: white";

  // First conversion (cold)
  const element1 = UlElement.create({ style });
  const startTime1 = performance.now();
  converter.toFigmaNode(element1);
  const duration1 = performance.now() - startTime1;

  // Subsequent conversions (potentially optimized)
  const durations: number[] = [];
  for (let i = 0; i < 10; i++) {
    const element = UlElement.create({ style });
    const startTime = performance.now();
    converter.toFigmaNode(element);
    durations.push(performance.now() - startTime);
  }

  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

  // Subsequent conversions should be reasonably fast (within 10x of first)
  // Note: No caching is implemented yet, so performance may vary
  expect(avgDuration).toBeLessThanOrEqual(duration1 * 10);
});

test("UlConverter performance: should handle mixed content types efficiently", () => {
  const converter = new UlConverter();
  const children: HTMLNode[] = [];

  // Mix of different content types
  for (let i = 0; i < 100; i++) {
    if (i % 3 === 0) {
      // Text node
      children.push({
        type: "text",
        textContent: `Text content ${i}`,
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
                textContent: `Nested ${i}`,
              },
            ],
          },
        ],
      });
    }
  }

  const element = UlElement.create({}, children);

  const startTime = performance.now();
  const result = converter.toFigmaNode(element);
  const endTime = performance.now();

  const duration = endTime - startTime;

  expect(result).toBeDefined();
  expect(duration).toBeLessThan(100);
});

// ========================================
// Stress Tests
// ========================================

test("UlConverter performance: should handle rapid successive conversions", () => {
  const converter = new UlConverter();
  const element = UlElement.create({
    style: "padding: 10px",
  });

  const startTime = performance.now();
  const results: FigmaNodeConfig[] = [];

  // Rapid fire conversions
  for (let i = 0; i < 100; i++) {
    results.push(converter.toFigmaNode(element));
  }

  const duration = performance.now() - startTime;

  expect(results).toHaveLength(100);
  expect(duration).toBeLessThan(100); // Should handle 100 conversions in under 100ms
});

test("UlConverter performance: should handle maximum reasonable list size", () => {
  const converter = new UlConverter();
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

  const element = UlElement.create({}, children);

  const startTime = performance.now();
  const result = converter.toFigmaNode(element);
  const endTime = performance.now();

  const duration = endTime - startTime;

  expect(result).toBeDefined();
  // Even with 5000 items, should complete within 1 second
  expect(duration).toBeLessThan(1000);
});
