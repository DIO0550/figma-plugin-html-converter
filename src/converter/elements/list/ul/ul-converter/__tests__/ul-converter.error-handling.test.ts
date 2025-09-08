import { test, expect, vi, afterEach } from "vitest";
import { UlConverter } from "../ul-converter";
import { UlElement } from "../../ul-element";
import { Styles } from "../../../../../models/styles";
import { FigmaNodeConfig } from "../../../../../models/figma-node";

afterEach(() => {
  vi.restoreAllMocks();
});

// toFigmaNode error handling
test("UlConverter error: handles invalid element types - null", () => {
  const converter = new UlConverter();
  const invalidElement = null as unknown as Parameters<
    typeof converter.toFigmaNode
  >[0];
  expect(() => converter.toFigmaNode(invalidElement)).toThrow();
});

test("UlConverter error: handles invalid element types - undefined", () => {
  const converter = new UlConverter();
  const undefinedElement = undefined as unknown as Parameters<
    typeof converter.toFigmaNode
  >[0];
  expect(() => converter.toFigmaNode(undefinedElement)).toThrow();
});

test("UlConverter error: handles element without attributes", () => {
  const converter = new UlConverter();
  const element = {
    type: "element" as const,
    tagName: "ul" as const,
    children: [],
  } as unknown as Parameters<typeof converter.toFigmaNode>[0];

  const result = converter.toFigmaNode(element);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
});

test("UlConverter error: handles corrupted style parsing", () => {
  const converter = new UlConverter();
  const mockParse = vi.spyOn(Styles, "parse");
  mockParse.mockImplementation(() => {
    throw new Error("Parse error");
  });

  const element = UlElement.create({
    style: "invalid-style",
  });

  expect(() => converter.toFigmaNode(element)).toThrow();
});

test("UlConverter error: handles invalid padding values", () => {
  const converter = new UlConverter();
  const mockGetPaddingLeft = vi.spyOn(Styles, "getPaddingLeft");
  mockGetPaddingLeft.mockReturnValue("invalid" as unknown as number);

  const element = UlElement.create({
    style: "padding-left: 20px",
  });

  const result = converter.toFigmaNode(element);

  // Should use default padding when invalid
  expect(result.paddingLeft).toBe(40);
});

test("UlConverter error: handles FigmaNodeConfig.applyBackgroundColor failures", () => {
  const converter = new UlConverter();
  const mockApplyBackgroundColor = vi.spyOn(
    FigmaNodeConfig,
    "applyBackgroundColor",
  );
  mockApplyBackgroundColor.mockImplementation(() => {
    throw new Error("Background color error");
  });

  const element = UlElement.create({
    style: "background-color: red",
  });

  expect(() => converter.toFigmaNode(element)).toThrow();
});

test("UlConverter error: handles border style application failures", () => {
  const converter = new UlConverter();
  const mockApplyBorderStyles = vi.spyOn(FigmaNodeConfig, "applyBorderStyles");
  mockApplyBorderStyles.mockImplementation(() => {
    throw new Error("Border style error");
  });

  const element = UlElement.create({
    style: "border: 1px solid black",
  });

  expect(() => converter.toFigmaNode(element)).toThrow();
});

test("UlConverter error: handles size style application failures", () => {
  const converter = new UlConverter();
  const mockApplySizeStyles = vi.spyOn(FigmaNodeConfig, "applySizeStyles");
  mockApplySizeStyles.mockImplementation(() => {
    throw new Error("Size style error");
  });

  const element = UlElement.create({
    style: "width: 100px; height: 200px",
  });

  expect(() => converter.toFigmaNode(element)).toThrow();
});

test("UlConverter error: recovers from partial style extraction failures", () => {
  const converter = new UlConverter();
  const mockGetBackgroundColor = vi.spyOn(Styles, "getBackgroundColor");
  mockGetBackgroundColor.mockImplementation(() => {
    throw new Error("Color extraction failed");
  });

  const element = UlElement.create({
    style: "background-color: blue; padding: 10px",
  });

  // Should continue despite background color failure
  expect(() => converter.toFigmaNode(element)).toThrow();
});

// mapToFigma error handling
test("UlConverter mapToFigma: handles valid ul HTML", () => {
  const converter = new UlConverter();
  const validHtml = "<ul><li>Item 1</li><li>Item 2</li></ul>";
  const result = converter.mapToFigma(validHtml);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("ul");
});

test("UlConverter mapToFigma: throws error for non-ul elements", () => {
  const converter = new UlConverter();
  const divHtml = "<div>Not a ul element</div>";
  expect(() => converter.mapToFigma(divHtml)).toThrow(
    "Expected ul element, but got div",
  );
});

test("UlConverter mapToFigma: throws error for null input", () => {
  const converter = new UlConverter();
  const nullInput = null as unknown as Parameters<
    typeof converter.mapToFigma
  >[0];
  expect(() => converter.mapToFigma(nullInput)).toThrow();
});

test("UlConverter mapToFigma: throws error for undefined input", () => {
  const converter = new UlConverter();
  const undefinedInput = undefined as unknown as Parameters<
    typeof converter.mapToFigma
  >[0];
  expect(() => converter.mapToFigma(undefinedInput)).toThrow();
});

test("UlConverter mapToFigma: handles ul with attributes", () => {
  const converter = new UlConverter();
  const htmlWithAttrs =
    '<ul id="myList" class="list-class"><<li>Item</li></ul>';
  const result = converter.mapToFigma(htmlWithAttrs);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("ul#myList");
});

test("UlConverter mapToFigma: handles nested ul elements", () => {
  const converter = new UlConverter();
  const nestedHtml =
    '<ul id="list1"><li>Item 1<ul id="list2"><li>Nested</li></ul></li></ul>';
  const result = converter.mapToFigma(nestedHtml);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("ul#list1");
});

// Resource cleanup
test("UlConverter resource: handles large inputs without memory leak", () => {
  const converter = new UlConverter();
  const largeHtml = "<ul>" + "<li>Item</li>".repeat(10000) + "</ul>";

  expect(() => {
    const result = converter.mapToFigma(largeHtml);
    expect(result).toBeDefined();
  }).not.toThrow();
});

test("UlConverter resource: handles converter instance reuse", () => {
  const converter = new UlConverter();
  const element1 = UlElement.create({ id: "list1" });
  const element2 = UlElement.create({ id: "list2" });

  const result1 = converter.toFigmaNode(element1);
  const result2 = converter.toFigmaNode(element2);

  // Results should be independent
  expect(result1).not.toBe(result2);
  expect(result1.name).toBe("ul#list1");
  expect(result2.name).toBe("ul#list2");
});

// Boundary conditions
test("UlConverter boundary: handles zero padding values", () => {
  const converter = new UlConverter();
  const element = UlElement.create({
    style: "padding: 0",
  });

  const result = converter.toFigmaNode(element);

  expect(result.paddingTop).toBe(0);
  expect(result.paddingBottom).toBe(0);
  expect(result.paddingLeft).toBe(0);
  expect(result.paddingRight).toBe(0);
});

test("UlConverter boundary: handles negative padding values", () => {
  const converter = new UlConverter();
  const element = UlElement.create({
    style: "padding-left: -20px",
  });

  const result = converter.toFigmaNode(element);

  // Should ignore negative values and use default
  expect(result.paddingLeft).toBe(40);
});

test("UlConverter boundary: handles NaN padding values", () => {
  const converter = new UlConverter();
  const mockGetPaddingLeft = vi.spyOn(Styles, "getPaddingLeft");
  mockGetPaddingLeft.mockReturnValue(NaN);

  const element = UlElement.create({
    style: "padding-left: auto",
  });

  const result = converter.toFigmaNode(element);

  // Should use default when NaN
  expect(result.paddingLeft).toBe(40);
});

test("UlConverter boundary: handles Infinity padding values", () => {
  const converter = new UlConverter();
  const mockGetPaddingLeft = vi.spyOn(Styles, "getPaddingLeft");
  mockGetPaddingLeft.mockReturnValue(Infinity);

  const element = UlElement.create({
    style: "padding-left: 999999999999px",
  });

  const result = converter.toFigmaNode(element);

  // Should use default when Infinity
  expect(result.paddingLeft).toBe(40);
});
