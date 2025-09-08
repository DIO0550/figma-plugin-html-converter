import { test, expect } from "vitest";
import { UlConverter } from "../ul-converter";
import { UlElement } from "../../ul-element";

test("UlConverter.toFigmaNode: converts ul element to Figma frame node", () => {
  const converter = new UlConverter();
  const element = UlElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("ul");
  expect(node.layoutMode).toBe("VERTICAL");
  expect(node.layoutSizingHorizontal).toBe("HUG");
  expect(node.layoutSizingVertical).toBe("HUG");
});

test("UlConverter.toFigmaNode: applies default padding for list", () => {
  const converter = new UlConverter();
  const element = UlElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.paddingLeft).toBe(40); // Default list padding
  expect(node.paddingTop).toBe(16);
  expect(node.paddingBottom).toBe(16);
});

test("UlConverter.toFigmaNode: applies custom styles", () => {
  const converter = new UlConverter();
  const element = UlElement.create({
    style: "padding-left: 60px; margin-top: 20px",
  });
  const node = converter.toFigmaNode(element);

  expect(node.paddingLeft).toBe(60);
});

test("UlConverter.toFigmaNode: sets item spacing", () => {
  const converter = new UlConverter();
  const element = UlElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.itemSpacing).toBe(8); // Default spacing between list items
});

test("UlConverter.mapToFigma: maps HTML string to Figma node", () => {
  const converter = new UlConverter();
  const html = '<ul class="my-list"><li>Item 1</li><li>Item 2</li></ul>';
  const result = converter.mapToFigma(html);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("ul");
  expect(result.layoutMode).toBe("VERTICAL");
});

test("UlConverter.mapToFigma: handles nested lists", () => {
  const converter = new UlConverter();
  const html = `
    <ul>
      <li>Item 1</li>
      <li>
        Item 2
        <ul>
          <li>Nested 1</li>
          <li>Nested 2</li>
        </ul>
      </li>
    </ul>
  `;
  const result = converter.mapToFigma(html);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("ul");
});

test("UlConverter.mapToFigma: handles empty list", () => {
  const converter = new UlConverter();
  const html = "<ul></ul>";
  const result = converter.mapToFigma(html);

  expect(result.type).toBe("FRAME");
  expect(result.children).toEqual([]);
});
