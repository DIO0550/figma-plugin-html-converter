import { test, expect } from "vitest";
import { UlElement } from "../ul-element";

// Malformed input handling
test("UlElement edge case: handles empty style string", () => {
  const element = UlElement.create({
    style: "",
  });

  expect(element.attributes?.style).toBe("");
  expect(UlElement.isUlElement(element)).toBe(true);
});

test("UlElement edge case: handles style string with only whitespace", () => {
  const element = UlElement.create({
    style: "   ",
  });

  expect(element.attributes?.style).toBe("   ");
});

test("UlElement edge case: handles malformed style strings", () => {
  const element = UlElement.create({
    style: "invalid::style;;format;;;",
  });

  expect(element.attributes?.style).toBe("invalid::style;;format;;;");
  // The element should still be valid
  expect(UlElement.isUlElement(element)).toBe(true);
});

test("UlElement edge case: handles style with missing values", () => {
  const element = UlElement.create({
    style: "padding-left:;margin-top:20px;color:",
  });

  expect(element.attributes?.style).toBe(
    "padding-left:;margin-top:20px;color:",
  );
});

test("UlElement edge case: handles style with duplicate properties", () => {
  const element = UlElement.create({
    style: "padding: 10px; padding: 20px; padding: 30px",
  });

  // Should preserve the string as-is
  expect(element.attributes?.style).toBe(
    "padding: 10px; padding: 20px; padding: 30px",
  );
});

// Extreme values
test("UlElement edge case: handles very long class names", () => {
  const longClassName = "a".repeat(1000);
  const element = UlElement.create({
    className: longClassName,
  });

  expect(element.attributes?.className).toBe(longClassName);
});

test("UlElement edge case: handles very long id", () => {
  const longId = "id-" + "x".repeat(500);
  const element = UlElement.create({
    id: longId,
  });

  expect(element.attributes?.id).toBe(longId);
});

test("UlElement edge case: handles extremely long style string", () => {
  const properties: string[] = [];
  for (let i = 0; i < 100; i++) {
    properties.push(`property-${i}: value-${i}`);
  }
  const longStyle = properties.join("; ");

  const element = UlElement.create({
    style: longStyle,
  });

  expect(element.attributes?.style).toBe(longStyle);
});

// Special characters
test("UlElement edge case: handles special characters in className", () => {
  const element = UlElement.create({
    className: "class-with-émojis-😀-and-特殊文字",
  });

  expect(element.attributes?.className).toBe(
    "class-with-émojis-😀-and-特殊文字",
  );
});

test("UlElement edge case: handles special characters in id", () => {
  const element = UlElement.create({
    id: "id_with!@#$%^&*()",
  });

  expect(element.attributes?.id).toBe("id_with!@#$%^&*()");
});

test("UlElement edge case: handles escaped characters in style", () => {
  const element = UlElement.create({
    style: "content: '\\\"quoted\\\"'; font-family: \\'Arial\\'",
  });

  expect(element.attributes?.style).toBe(
    "content: '\\\"quoted\\\"'; font-family: \\'Arial\\'",
  );
});

// Null and undefined handling
test("UlElement edge case: handles undefined attributes gracefully", () => {
  const element = UlElement.create({
    id: undefined,
    className: undefined,
    style: undefined,
  });

  expect(element.attributes?.id).toBeUndefined();
  expect(element.attributes?.className).toBeUndefined();
  expect(element.attributes?.style).toBeUndefined();
});

test("UlElement edge case: handles mixed valid and invalid attributes", () => {
  const element = UlElement.create({
    id: "valid-id",
    className: undefined,
    style: "",
    type: "disc",
  });

  expect(element.attributes?.id).toBe("valid-id");
  expect(element.attributes?.className).toBeUndefined();
  expect(element.attributes?.style).toBe("");
  expect(element.attributes?.type).toBe("disc");
});

// Children handling
test("UlElement edge case: handles empty children array", () => {
  const element = UlElement.create({}, []);

  expect(element.children).toEqual([]);
});

test("UlElement edge case: handles large number of children", () => {
  const children = Array(1000)
    .fill(null)
    .map((_, i) => ({
      type: "element" as const,
      tagName: "li",
      attributes: { id: `item-${i}` },
      children: [],
    }));

  const element = UlElement.create({}, children);

  expect(element.children).toHaveLength(1000);
  expect(element.children?.[0]?.attributes?.id).toBe("item-0");
  expect(element.children?.[999]?.attributes?.id).toBe("item-999");
});
