import { test, expect } from "vitest";
import { UlConverter } from "../ul-converter";
import { UlElement } from "../../ul-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

test("UlConverter integration: converts ul with multiple li elements", () => {
  const converter = new UlConverter();
  const html = `
    <ul>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("ul");
  expect(result.layoutMode).toBe("VERTICAL");
  expect(result.itemSpacing).toBe(8);
});

test("UlConverter integration: handles nested ul within li", () => {
  const converter = new UlConverter();
  const html = `
    <ul id="parent">
      <li>Item 1</li>
      <li>
        Item 2
        <ul id="nested">
          <li>Nested item 1</li>
          <li>Nested item 2</li>
        </ul>
      </li>
      <li>Item 3</li>
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("ul#parent");
});

test("UlConverter integration: preserves li element text content", () => {
  const liChildren: HTMLNode[] = [
    {
      type: "element",
      tagName: "li",
      children: [{ type: "text", textContent: "List item text" }],
    },
  ];

  const element = UlElement.create({ id: "my-list" }, liChildren);
  const converter = new UlConverter();
  const result = converter.toFigmaNode(element);

  expect(result).toBeDefined();
  expect(result.name).toBe("ul#my-list");
  expect(element.children).toEqual(liChildren);
});

test("UlConverter integration: handles mixed content in li elements", () => {
  const converter = new UlConverter();
  const html = `
    <ul>
      <li>Simple text</li>
      <li><strong>Bold text</strong></li>
      <li>Text with <a href="#">link</a></li>
      <li>
        <span>Span content</span>
        Regular text
      </li>
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.layoutMode).toBe("VERTICAL");
});

test("UlConverter integration: applies styles to ul with li children", () => {
  const converter = new UlConverter();
  const html = `
    <ul style="padding-left: 60px; background-color: #f0f0f0;">
      <li>Item with custom padding</li>
      <li>Another item</li>
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.paddingLeft).toBe(60);
  expect(result.fills).toBeDefined();
});

test("UlConverter integration: handles empty li elements", () => {
  const converter = new UlConverter();
  const html = `
    <ul>
      <li></li>
      <li>Non-empty</li>
      <li></li>
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
});

test("UlConverter integration: handles ul with class and id attributes", () => {
  const converter = new UlConverter();
  const html = `
    <ul id="todo-list" class="task-list priority-high">
      <li class="task-item">Task 1</li>
      <li class="task-item completed">Task 2</li>
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.name).toBe("ul#todo-list");
});

test("UlConverter integration: handles deeply nested ul structures", () => {
  const converter = new UlConverter();
  const html = `
    <ul>
      <li>Level 1
        <ul>
          <li>Level 2
            <ul>
              <li>Level 3
                <ul>
                  <li>Level 4</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.layoutMode).toBe("VERTICAL");
});

test("UlConverter integration: maintains li order in children array", () => {
  const children: HTMLNode[] = [
    {
      type: "element",
      tagName: "li",
      attributes: { id: "first" },
      children: [{ type: "text", textContent: "1" }],
    },
    {
      type: "element",
      tagName: "li",
      attributes: { id: "second" },
      children: [{ type: "text", textContent: "2" }],
    },
    {
      type: "element",
      tagName: "li",
      attributes: { id: "third" },
      children: [{ type: "text", textContent: "3" }],
    },
  ];

  const element = UlElement.create({}, children);
  const converter = new UlConverter();
  const result = converter.toFigmaNode(element);

  expect(result).toBeDefined();
  expect(element.children).toEqual(children);
  expect(element.children?.[0]).toEqual(children[0]);
  expect(element.children?.[1]).toEqual(children[1]);
  expect(element.children?.[2]).toEqual(children[2]);
});

test("UlConverter integration: handles ul without any li elements", () => {
  const converter = new UlConverter();
  const html = `
    <ul>
      Just text without li elements
    </ul>
  `;

  const result = converter.mapToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.children).toEqual([]);
});
